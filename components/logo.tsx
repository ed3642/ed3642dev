import Link from 'next/link'
import Image from 'next/image'

const Logo: React.FC = () => {
  return (
    <Link href="/">
      <div className="hover:opacity-75 transition items-center gap-x-2 hidden md:flex">
        <Image src="/media/favicon.svg" alt="Logo" height={30} width={30} />
        <p className="text-lg text-gray-200 pb-1">ed3642dev</p>
      </div>
    </Link>
  )
}

export { Logo }
