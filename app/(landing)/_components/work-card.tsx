import { Card } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { SquareArrowOutUpRight } from 'lucide-react'

interface WorkCardProps {
  title?: string
  description?: string
  image_path?: string
  link?: string
}

const WorkCard: React.FC<WorkCardProps> = ({
  title = '',
  description = '',
  image_path = '',
  link,
}) => {
  const cardContent = (
    <Card className="relative h-96 w-full sm:w-80 xl:w-96 rounded-lg">
      <Image
        src={image_path}
        alt={title}
        fill
        sizes="100%"
        style={{ objectFit: 'cover' }}
        className="absolute inset-0 rounded-lg"
      />
      <div className="absolute inset-0 flex flex-col justify-end rounded-lg">
        <div className="bg-gradient-to-t from-slate-900 via-slate-900/90 to-transparent p-3 pt-16 rounded-lg">
          <div className="flex items-center space-x-2">
            <h2 className="text-white text-xl font-bold">{title}</h2>
            {link && <SquareArrowOutUpRight className="text-white h-5 w-5" />}
          </div>
          <p className="text-zinc-200 text-sm">{description}</p>
        </div>
      </div>
    </Card>
  )

  return link ? (
    <Link href={link} target="_blank">
      {cardContent}
    </Link>
  ) : (
    cardContent
  )
}

export { WorkCard }
