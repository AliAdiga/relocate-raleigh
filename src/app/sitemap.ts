import type { MetadataRoute } from 'next';
import { NEIGHBORHOODS } from '@/data/neighborhoods';

const BASE = 'https://relocateraleigh.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: BASE, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/neighborhoods`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    ...NEIGHBORHOODS.map((n) => ({
      url: `${BASE}/neighborhoods/${n.id}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    { url: `${BASE}/scouting`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/events`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
  ];
}
