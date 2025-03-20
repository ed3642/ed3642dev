'use client'

import Link from 'next/link'
import { Logo } from '@/components/logo'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { HomeIcon, Menu } from 'lucide-react'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'

interface Link {
  path: string
  label: string | React.ReactNode
  labelText?: string // For screen readers when using icons
}

const links: Link[] = [
  {
    path: '/path-finding',
    label: 'Path Finding',
  },
  {
    path: '/game-of-life',
    label: 'Game of Life',
  },
  {
    path: '/purple-win',
    label: 'Purple Green',
  },
  {
    path: '/',
    label: <HomeIcon className="w-5 h-5" />,
    labelText: 'Home',
  },
]

// might have a different ordering for mobile
const linksMobile: Link[] = [
  {
    path: '/',
    label: <HomeIcon className="w-5 h-5" />,
    labelText: 'Home',
  },
  {
    path: '/path-finding',
    label: 'Path Finding',
  },
  {
    path: '/game-of-life',
    label: 'Game of Life',
  },
  {
    path: '/purple-win',
    label: 'Purple Green',
  },
]

const NavBar: React.FC = () => {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <div className="sticky top-0 w-full h-14 border-b shadow-sm flex items-center z-50 px-2 bg-background">
      <div className="md:mx-auto flex items-center w-full justify-between">
        <Logo />

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              {links.map((link) => (
                <NavigationMenuItem key={link.path}>
                  <Link href={link.path} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        pathname === link.path && 'bg-accent'
                      )}
                      aria-label={link.labelText}
                    >
                      {link.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] sm:w-[300px] p-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <SheetTitle className="text-lg font-semibold">Navigation</SheetTitle>
                  <SheetDescription className="sr-only">
                    Application navigation links
                  </SheetDescription>
                </div>
                <nav className="flex-1">
                  <ul className="py-4">
                    {linksMobile.map((link) => (
                      <li key={link.path}>
                        <SheetClose asChild>
                          <Link
                            href={link.path}
                            className={cn(
                              'flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors',
                              pathname === link.path && 'text-foreground'
                            )}
                          >
                            {typeof link.label === 'string' ? (
                              link.label
                            ) : (
                              <>
                                <span className="h-5 w-5">{link.label}</span>
                                <span>{link.labelText}</span>
                              </>
                            )}
                          </Link>
                        </SheetClose>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}

export { NavBar }
