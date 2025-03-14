import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'

import { ThemeProvider } from '@/components/theme-provider'
import { siteConfig } from '@/config/site'

import './globals.css'
import { NavBar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { GoogleAnalytics } from '@/components/google-analytics'

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
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <NavBar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
