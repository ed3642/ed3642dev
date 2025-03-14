import { Skeleton } from '@/components/ui/skeleton'

function PathFindingLoading() {
  return (
    <div className="flex items-center flex-col w-full">
      <div className="flex items-center my-2 space-x-2">
        <Skeleton className="h-10 w-20 rounded-md" />
      </div>
      <Skeleton className="h-[500px] w-full rounded-xl" />
      <div className="mb-4"></div>
    </div>
  )
}

export { PathFindingLoading }
