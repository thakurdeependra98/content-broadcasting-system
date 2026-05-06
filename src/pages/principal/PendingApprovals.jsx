import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/common/PageHeader.jsx'
import { EmptyState } from '@/components/common/EmptyState.jsx'
import { ErrorState } from '@/components/common/ErrorState.jsx'
import { FilePreview } from '@/components/common/FilePreview.jsx'
import { RejectModal } from '@/components/common/RejectModal.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Skeleton } from '@/components/ui/skeleton.jsx'
import { usePendingList } from '@/hooks/usePendingList.js'
import { useApprovalActions } from '@/hooks/useApprovalActions.js'
import { formatDateTime } from '@/utils/formatters.js'

export default function PrincipalPendingApprovals() {
  const { items, loading, error, reload } = usePendingList()
  const { approve, reject, busyId } = useApprovalActions()
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejectTargetId, setRejectTargetId] = useState(/** @type {string | null} */ (null))

  useEffect(() => {
    document.title = 'Principal — Approvals'
  }, [])

  const openReject = (id) => {
    setRejectTargetId(id)
    setRejectOpen(true)
  }

  const handleApprove = async (id) => {
    try {
      await approve(id)
      toast.success('Content approved')
      await reload()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Approve failed')
    }
  }

  const handleRejectConfirm = async (reason) => {
    if (!rejectTargetId) return
    try {
      await reject(rejectTargetId, reason)
      toast.success('Content rejected')
      await reload()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Reject failed')
    }
  }

  return (
    <div>
      <PageHeader
        title="Pending approvals"
        description="Review uploads, preview files, and approve or reject with a reason."
      />
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : null}
      {error ? <ErrorState message={error} onRetry={reload} /> : null}
      {!loading && !error && items?.length === 0 ? (
        <EmptyState title="No pending items" description="You're all caught up." />
      ) : null}
      {!loading && !error && items && items.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="text-base leading-snug">{item.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {item.subject} · {item.teacherName}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <FilePreview src={item.fileDataUrl} alt={item.title} />
                {item.description ? (
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                ) : null}
                <p className="text-xs text-muted-foreground">
                  Window: {formatDateTime(item.startTime)} → {formatDateTime(item.endTime)}
                </p>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={() => handleApprove(item.id)}
                  disabled={busyId === item.id}
                >
                  {busyId === item.id ? 'Working…' : 'Approve'}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => openReject(item.id)}
                  disabled={busyId === item.id}
                >
                  Reject
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : null}

      <RejectModal
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        onConfirm={handleRejectConfirm}
      />
    </div>
  )
}
