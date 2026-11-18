import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      // 301 Permanent Redirects from old 2-segment worksheet URLs to new direct slug URLs (Faz 3)
      {
        source: '/worksheets/literacy/:slug',
        destination: '/worksheets/:slug',
        permanent: true,
      },
      {
        source: '/worksheets/math/:slug',
        destination: '/worksheets/:slug',
        permanent: true,
      },
      {
        source: '/worksheets/thinking-skills/:slug',
        destination: '/worksheets/:slug',
        permanent: true,
      },
      {
        source: '/worksheets/esl-vocabulary/:slug',
        destination: '/worksheets/:slug',
        permanent: true,
      },
      {
        source: '/worksheets/shapes-colors/:slug',
        destination: '/worksheets/:slug',
        permanent: true,
      },
      // Redirect old /themes to unified /topics
      {
        source: '/themes/:topic',
        destination: '/topics/:topic',
        permanent: true,
      },
      {
        source: '/themes',
        destination: '/topics',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
