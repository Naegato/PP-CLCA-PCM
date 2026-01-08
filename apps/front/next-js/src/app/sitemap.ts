import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['fr', 'en'];

  const routes = [
    '',
    '/login',
    '/register',
    '/account',
    '/loans',
    '/messages',
    '/notifications',
    '/stocks',
    '/portfolio',
    '/orders',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of routes) {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
      });
    }
  }

  return sitemapEntries;
}
