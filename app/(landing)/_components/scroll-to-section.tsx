'use client'

import React, { useRef, useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

const ScrollToSection = () => {
  const scrollToRef = useRef<HTMLDivElement>(null)
  const [animate, setAnimate] = useState(false)

  const scrollToWork = () => {
    if (scrollToRef.current) {
      const elementPosition = scrollToRef.current.getBoundingClientRect().top + window.scrollY

      const offsetPosition = elementPosition + 200 // with offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true)
    }, 2500) // wait a bit before animating the chevron
    return () => clearTimeout(timer) // cleanup
  }, [])

  return (
    <>
      <div className="w-full pt-16 relative">
        <Separator />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <ChevronDown
            className={cn('h-8 w-8 text-gray-800 bg-white rounded-full p-1 cursor-pointer', {
              'animate-bounce-3': animate,
            })}
            onClick={scrollToWork}
          />
        </div>
      </div>
      <div ref={scrollToRef}></div>
    </>
  )
}

export { ScrollToSection }
