import Script from 'next/script'
import { siteConfig } from '@/config/site'

export default function StructuredData() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: siteConfig.name,
    image: [`${siteConfig.url}/media/web-app-manifest-192x192.png`],
    url: siteConfig.url,
    description: siteConfig.description,
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'Ontario',
      addressCountry: 'Canada',
    },
    logo: `${siteConfig.url}/media/web-app-manifest-192x192.png`,
  }

  const jsonLdString = JSON.stringify(schema)

  return (
    <Script id="schema-org-data" type="application/ld+json" strategy="worker">
      {jsonLdString}
    </Script>
  )
}
