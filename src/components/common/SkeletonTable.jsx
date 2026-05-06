import { Skeleton } from '@/components/ui/skeleton.jsx'

/**
 * @param {{ rows?: number, cols?: number }} props
 */
export function SkeletonTable({ rows = 6, cols = 5 }) {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={`h-${i}`} className="h-8 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={`r-${r}`} className="flex gap-2">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={`c-${r}-${c}`} className="h-10 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}
