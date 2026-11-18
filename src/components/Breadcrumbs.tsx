import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { getSiteUrl } from '@/config/site';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const siteUrl = getSiteUrl();
  const schemaItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: siteUrl,
    },
    ...items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 2,
      name: item.label,
      ...(item.href ? { item: `${siteUrl}${item.href}` } : {}),
    })),
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: schemaItems,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="py-2.5 text-xs text-slate-500 overflow-x-hidden">
        <ol className="flex items-center space-x-1.5 flex-wrap sm:flex-nowrap">
          <li className="flex items-center shrink-0">
            <Link
              href="/"
              className="inline-flex items-center gap-1 hover:text-[#2E6B6B] transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
          </li>

          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={index} className="flex items-center space-x-1.5 min-w-0">
                <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="hover:text-[#2E6B6B] transition-colors truncate max-w-[120px] sm:max-w-none shrink-0"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className="font-semibold text-slate-800 truncate max-w-[170px] sm:max-w-md inline-block align-bottom"
                    aria-current={isLast ? 'page' : undefined}
                    title={item.label}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
