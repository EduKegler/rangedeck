import type { MetadataRoute } from 'next';

const BASE_URL = 'https://rangedeck.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];

  const defaultRanges = [
    'utg',
    'hj',
    'co',
    'bu',
    'sb-open',
    'any-vs-utg',
    'any-vs-bu',
    'any-vs-co',
    'bb-vs-ep-mp',
    'bb-vs-bu',
    'bb-vs-sb',
    'sb-vs-ep',
    'sb-vs-mp-lp',
    'polar-3bet',
    'linear-3bet',
  ];

  const rangePages: MetadataRoute.Sitemap = defaultRanges.map((rangeId) => ({
    url: `${BASE_URL}/edit/${rangeId}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...rangePages];
}
