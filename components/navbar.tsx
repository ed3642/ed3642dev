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
import { HomeIcon } from 'lucide-react'

interface Link {
  path: string
  label: string | React.ReactNode
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
    label: 'Purple Win',
  },
  {
    path: '/',
    label: <HomeIcon className="w-5 h-5" />,
  },
]

const NavBar: React.FC = () => {
  return (
    <div className="sticky top-0 w-full h-14 border-b shadow-sm flex items-center z-50 bg-slate-900 px-2">
      <div className="md:mx-auto flex items-center w-full justify-between">
        <Logo />
        <NavigationMenu>
          <NavigationMenuList>
            {links.map((link) => (
              <NavigationMenuItem key={link.path}>
                <Link href={link.path} legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {link.label}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  )
}

export { NavBar }
