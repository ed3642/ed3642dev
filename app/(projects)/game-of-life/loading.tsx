import { Skeleton } from '@/components/ui/skeleton'

const GameOfLifeLoading: React.FC = () => {
  return (
    <div className="flex items-center flex-col w-full">
      <div className="flex items-center my-2 space-x-2">
        <Skeleton className="h-10 w-20 rounded-md" />
        <Skeleton className="h-10 w-20 rounded-md" />
        <Skeleton className="h-10 w-20 rounded-md" />
        <Skeleton className="h-10 w-20 rounded-md" />
      </div>
      <Skeleton className="h-[400px] w-full rounded-xl" />
      <div className="mb-4"></div>
    </div>
  )
}

export default GameOfLifeLoading
