export const siteConfig = {
  url: process.env.NEXT_PUBLIC_BASE_URL,
  name: 'ed3642dev developer portfolio',
  description: 'Showing my software developer skills 🚀',
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/media/favicon.svg', type: 'image/svg+xml' },
      { url: '/media/favicon-96x96.webp', type: 'image/webp', sizes: '96x96' },
      { url: '/media/web-app-manifest-192x192.webp', type: 'image/webp', sizes: '192x192' },
      { url: '/media/web-app-manifest-512x512.webp', type: 'image/webp', sizes: '512x512' },
    ],
    shortcut: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_BASE_URL,
    title: 'ed3642dev developer portfolio',
    description: 'Showing my software developer skills 🚀',
    siteName: 'ed3642dev developer portfolio',
    images: [
      {
        url: '/media/og.webp',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ed3642dev',
    description: 'Showing my software developer skills 🚀',
    images: ['/media/twitter.webp'],
  },
  appleWebApp: {
    title: 'ed3642dev developer portfolio',
    capable: true,
    statusBarStyle: 'default',
  },
  start_url: '.',
  keywords: [
    'software',
    'developer',
    'programming',
    'web',
    'webdev',
    'website',
    'portfolio',
    'web developer',
  ],
}
