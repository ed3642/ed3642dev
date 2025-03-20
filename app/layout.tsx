import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'

import { ThemeProvider } from '@/components/theme-provider'
import { siteConfig } from '@/config/site'

import './globals.css'
import { NavBar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { GoogleAnalytics } from '@/components/google-analytics'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from '@/components/ui/sonner'
import { UsernameProvider } from '@/providers/username-provider'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
})

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: siteConfig.icons,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.className} flex flex-col min-h-screen`}>
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
