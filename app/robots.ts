import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/api/sitemap-server'],
      disallow: ['/api/'],
    },
    sitemap: 'https://ed3642dev.com/api/sitemap-server',
  }
}
