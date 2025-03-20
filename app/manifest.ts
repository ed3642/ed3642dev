import type { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: 'ed3642dev',
    description: siteConfig.description,
    start_url: '/',
    display: 'browser',
    background_color: '#f6f7f8',
    theme_color: '#f6f7f8',
    lang: 'en',
    icons: siteConfig.icons.icon.map((icon) => ({
      src: icon.url,
      type: icon.type,
      sizes: icon.sizes,
    })),
  }
}
