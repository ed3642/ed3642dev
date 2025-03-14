'use client'

import { ChevronDown } from 'lucide-react'
import { useRef } from 'react'
import { Separator } from '@/components/ui/separator'

const InteractiveContent = () => {
  const professionalWorkRef = useRef<HTMLHeadingElement>(null)

  const scrollToProfessionalWork = () => {
    if (professionalWorkRef.current) {
      professionalWorkRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <div className="w-full pt-16">
        <div className="relative">
          <Separator />
          <ChevronDown
            className="h-8 w-8 text-gray-800 bg-white rounded-full p-1 cursor-pointer absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            onClick={scrollToProfessionalWork}
          />
        </div>
      </div>

      <h2 ref={professionalWorkRef} className="md:text-5xl text-3xl text-center mb-6">
        Professional Work
      </h2>
    </>
  )
}

export { InteractiveContent }
