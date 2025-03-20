import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { siteConfig } from '@/config/site'
import { NavBar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { GoogleAnalytics } from '@/components/google-analytics'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from '@/components/ui/sonner'
import { UsernameProvider } from '@/providers/username-provider'
import './globals.css'
import StructuredData from './structured-data'

const inter = Inter({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://ed3642dev.com'),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  icons: siteConfig.icons,
  openGraph: siteConfig.openGraph,
  twitter: siteConfig.twitter,
  appleWebApp: {
    title: siteConfig.name,
    statusBarStyle: 'default',
    capable: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <StructuredData />
        <GoogleAnalytics />
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <UsernameProvider>
              <NavBar />
              <main className="flex-grow">{children}</main>
              <Footer />
              <Toaster />
            </UsernameProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
