import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Radio } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Skeleton } from '@/components/ui/skeleton.jsx'
import { FilePreview } from '@/components/common/FilePreview.jsx'
import { EmptyState } from '@/components/common/EmptyState.jsx'
import { ErrorState } from '@/components/common/ErrorState.jsx'
import { useLiveBroadcast } from '@/hooks/useLiveBroadcast.js'
import { formatDateTime } from '@/utils/formatters.js'

export default function LivePage() {
  const { teacherId } = useParams()
  const { data, loading, error, refresh } = useLiveBroadcast(teacherId)


  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-wide">Live broadcast</h1>
          <p className="text-sm text-muted-foreground">
            Teacher ID: <span className="font-mono">{teacherId}</span> · Refreshes every 10s
          </p>
        </div>
      </div>

      {loading && !data ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      ) : null}

      {error ? (
        <ErrorState message={error} onRetry={() => void refresh()} />
      ) : null}

      {!loading && !error && !data ? (
        <EmptyState
          title="No content available"
          description="There is no approved broadcast in the active time window for this teacher."
        />
      ) : null}

      {data ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{data.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{data.subject}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <FilePreview src={data.fileDataUrl} alt={data.title} />
            <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              <div>
                <span className="font-medium text-foreground">Window: </span>
                {formatDateTime(data.startTime)} → {formatDateTime(data.endTime)}
              </div>
              <div>
                <span className="font-medium text-foreground">Rotation: </span>
                {data.rotationDuration}s
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
