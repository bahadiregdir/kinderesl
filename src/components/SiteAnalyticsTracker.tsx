'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const SESSION_KEY = 'kinderesl_sid';

function getAnonymousSessionId(): string {
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const generated =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID().replace(/-/g, '').slice(0, 24)
        : `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
    window.sessionStorage.setItem(SESSION_KEY, generated);
    return generated;
  } catch {
    return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
  }
}

function getExternalReferrerHost(): string | null {
  try {
    if (!document.referrer) return null;
    const refHost = new URL(document.referrer).hostname.toLowerCase();
    const curHost = window.location.hostname.toLowerCase();
    if (!refHost || refHost === curHost || refHost === `www.${curHost}` || `www.${refHost}` === curHost) {
      return null;
    }
    return refHost;
  } catch {
    return null;
  }
}

function sendAnalyticsBeacon(payload: Record<string, unknown>, useBeacon = false): void {
  const json = JSON.stringify(payload);
  if (useBeacon && typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    try {
      const blob = new Blob([json], { type: 'text/plain;charset=UTF-8' });
      if (navigator.sendBeacon('/api/analytics/event', blob)) {
        return;
      }
    } catch {
      // Fallback to keepalive fetch below
    }
  }
  fetch('/api/analytics/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: json,
    keepalive: true,
  }).catch(() => {});
}

export function SiteAnalyticsTracker() {
  const pathname = usePathname() || '/';
  const sessionRef = useRef<string>('');
  const currentPathRef = useRef<string | null>(null);
  const enteredAtRef = useRef<number>(0);
  const exitSentForCurrentRef = useRef<boolean>(false);

  useEffect(() => {
    if (pathname.startsWith('/admin') || pathname.startsWith('/api')) return;

    if (!sessionRef.current) {
      sessionRef.current = getAnonymousSessionId();
    }
    const sessionId = sessionRef.current;

    if (currentPathRef.current && currentPathRef.current !== pathname) {
      const durationMs = enteredAtRef.current > 0 ? Date.now() - enteredAtRef.current : 0;
      sendAnalyticsBeacon(
        {
          type: 'exit',
          path: currentPathRef.current,
          sessionId,
          durationMs,
        },
        true
      );
    }

    currentPathRef.current = pathname;
    enteredAtRef.current = Date.now();
    exitSentForCurrentRef.current = false;

    const deviceType = window.innerWidth < 768 ? 'mobile' : 'desktop';
    const referrerHost = getExternalReferrerHost();

    sendAnalyticsBeacon(
      {
        type: 'pageview',
        path: pathname,
        referrerHost,
        sessionId,
        deviceType,
      },
      false
    );
  }, [pathname]);

  useEffect(() => {
    const flushExit = () => {
      if (exitSentForCurrentRef.current || !currentPathRef.current || !sessionRef.current) return;
      exitSentForCurrentRef.current = true;
      const durationMs = enteredAtRef.current > 0 ? Date.now() - enteredAtRef.current : 0;
      sendAnalyticsBeacon(
        {
          type: 'exit',
          path: currentPathRef.current,
          sessionId: sessionRef.current,
          durationMs,
        },
        true
      );
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flushExit();
      } else if (document.visibilityState === 'visible') {
        exitSentForCurrentRef.current = false;
      }
    };

    window.addEventListener('pagehide', flushExit);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('pagehide', flushExit);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return null;
}
