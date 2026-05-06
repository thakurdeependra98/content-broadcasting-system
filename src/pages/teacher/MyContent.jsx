import { useEffect } from 'react'
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

export default function TeacherMyContent() {
  const { items, loading, error, reload } = useMyContentList()

  useEffect(() => {
    document.title = 'Teacher — My Content'
  }, [])

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
              {items.map((item) => (
                <MyContentRow key={item.id} item={item} />
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}
    </div>
  )
}
