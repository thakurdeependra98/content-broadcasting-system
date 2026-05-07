import { useMemo, useState } from 'react'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.jsx'
import { PageHeader } from '@/components/common/PageHeader.jsx'
import { EmptyState } from '@/components/common/EmptyState.jsx'
import { ErrorState } from '@/components/common/ErrorState.jsx'
import { SkeletonTable } from '@/components/common/SkeletonTable.jsx'
import { useMyContentList } from '@/hooks/useMyContentList.js'
import { MyContentRow } from '@/pages/teacher/MyContentRow.jsx'
import { Button } from '@/components/ui/button.jsx'

const PAGE_SIZE = 8

export default function TeacherMyContent() {
  const { items, loading, error, reload } = useMyContentList()
  const [page, setPage] = useState(1)

  const totalPages = useMemo(() => {
    const total = items?.length ?? 0
    return Math.max(1, Math.ceil(total / PAGE_SIZE))
  }, [items])

  const currentPage = Math.min(page, totalPages)

  const pagedItems = useMemo(() => {
    if (!items) return []
    const start = (currentPage - 1) * PAGE_SIZE
    return items.slice(start, start + PAGE_SIZE)
  }, [items, currentPage])

  return (
    <div>
      <PageHeader
        title="My content"
        description="Track approval status and broadcast window for each upload."
      />
      {loading ? <SkeletonTable rows={8} cols={6} /> : null}
      {error ? <ErrorState message={error} onRetry={reload} /> : null}
      {!loading && !error && items?.length === 0 ? (
        <EmptyState
          title="No uploads yet"
          description="Upload your first piece of content from the Upload page."
        />
      ) : null}
      {!loading && !error && items && items.length > 0 ? (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title / Subject</TableHead>
                  <TableHead>Preview</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Window</TableHead>
                  <TableHead>Rejection reason</TableHead>
                  <TableHead>Size</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedItems.map((item) => (
                  <MyContentRow key={item.id} item={item} />
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages} · {items.length} items
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
