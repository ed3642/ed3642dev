import { MetadataRoute, NextApiRequest, NextApiResponse } from 'next'
import sitemap from '@/app/sitemap'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const sitemapData = sitemap()
  res.setHeader('Content-Type', 'application/xml')
  res.write(createSitemapXml(sitemapData))
  res.end()
}

function createSitemapXml(sitemapData: MetadataRoute.Sitemap) {
  const urls = sitemapData
    .map(
      (item) => `
    <url>
      <loc>${item.url}</loc>
      <lastmod>${item.lastModified instanceof Date ? item.lastModified.toISOString() : ''}</lastmod>
      <changefreq>${item.changeFrequency}</changefreq>
      <priority>${item.priority}</priority>
    </url>
  `
    )
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls}
    </urlset>`
}
