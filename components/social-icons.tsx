import { Instagram, Linkedin, Mail } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface SocialIconsProps {
  iconSize?: number
}

const SocialIcons: React.FC<SocialIconsProps> = ({ iconSize = 24 }) => {
  return (
    <div className="flex space-x-4">
      <Link href="https://www.linkedin.com/in/eduardo-san-martin-celi/" target="_blank">
        <Linkedin color="white" size={iconSize} />
      </Link>
      <Link href="https://github.com/ed3642" target="_blank">
        <Image
          src="/media/github-mark-white.svg"
          width={iconSize}
          height={iconSize}
          alt="Github logo"
          className="text-white"
        />
      </Link>
      <Link href="https://www.instagram.com/ed3642dev/" target="_blank">
        <Instagram color="white" size={iconSize} />
      </Link>
      <Link href="mailto:ed3642dev@gmail.com" target="_blank">
        <Mail color="white" size={iconSize} />
      </Link>
    </div>
  )
}

export { SocialIcons }
