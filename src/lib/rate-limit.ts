const requestBuckets = new Map<string, number[]>();

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

export function checkRateLimit(
  key: string,
  limit = 30,
  windowMs = 60_000
): RateLimitResult {
  const now = Date.now();
  const cutoff = now - windowMs;
  const timestamps = (requestBuckets.get(key) || []).filter((ts) => ts > cutoff);

  if (timestamps.length >= limit) {
    const oldest = timestamps[0] || now;
    requestBuckets.set(key, timestamps);
    return {
      allowed: false,
      limit,
      remaining: 0,
      resetAt: Math.ceil((oldest + windowMs) / 1000),
    };
  }

  timestamps.push(now);
  requestBuckets.set(key, timestamps);

  return {
    allowed: true,
    limit,
    remaining: Math.max(0, limit - timestamps.length),
    resetAt: Math.ceil((now + windowMs) / 1000),
  };
}
