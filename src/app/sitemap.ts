import type { MetadataRoute } from 'next';
import { NEIGHBORHOODS } from '@/data/neighborhoods';

const BASE = 'https://relocateraleigh.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: 'weekly' | 'monthly' | 'yearly' = 'monthly') => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });
  return [
    page('', 1, 'weekly'),
    page('/neighborhoods', 0.8),
    ...NEIGHBORHOODS.map((n) => page(`/neighborhoods/${n.id}`, 0.7)),
    page('/scouting', 0.6),
    page('/checklist', 0.6),
    page('/events', 0.3),
    page('/privacy', 0.1, 'yearly'),
    page('/credits', 0.1, 'yearly'),
  ];
}
