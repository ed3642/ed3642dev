import Link from 'next/link'
import Image from 'next/image'

const Logo: React.FC = () => {
  return (
    <Link href="/">
      <div className="hover:opacity-75 transition items-center gap-x-2 flex">
        <Image src="/media/favicon.svg" alt="Logo" height={30} width={30} />
        <p className="text-xl font-bold text-gray-200 font-mono tracking-tight items-center">
          ed3642dev
        </p>
      </div>
    </Link>
  )
}

export { Logo }
