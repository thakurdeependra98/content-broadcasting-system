import { useEffect, useMemo, useState } from 'react'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.jsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Button } from '@/components/ui/button.jsx'
import { PageHeader } from '@/components/common/PageHeader.jsx'
import { EmptyState } from '@/components/common/EmptyState.jsx'
import { ErrorState } from '@/components/common/ErrorState.jsx'
import { SkeletonTable } from '@/components/common/SkeletonTable.jsx'
import { useDebounce } from '@/hooks/useDebounce.js'
import { useAllContentList } from '@/hooks/useAllContentList.js'
import { AllContentRow } from '@/pages/principal/AllContentRow.jsx'
import { PAGE_SIZE_DEFAULT } from '@/utils/constants.js'

export default function PrincipalAllContent() {
  const [status, setStatus] = useState('all')
  const [q, setQ] = useState('')
  const debouncedQ = useDebounce(q, 300)
  const [page, setPage] = useState(1)

  const params = useMemo(
    () => ({
      status,
      q: debouncedQ,
      page,
      pageSize: PAGE_SIZE_DEFAULT,
    }),
    [status, debouncedQ, page],
  )

  const { result, loading, error, reload } = useAllContentList(params)

  useEffect(() => {
    document.title = 'Principal — All Content'
  }, [])

  useEffect(() => {
    const t = window.setTimeout(() => setPage(1), 0)
    return () => window.clearTimeout(t)
  }, [status, debouncedQ])

  const totalPages = result ? Math.max(1, Math.ceil(result.total / result.pageSize)) : 1

  return (
    <div>
      <PageHeader
        title="All content"
        description="Filter by status and search across titles, subjects, and teachers."
      />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Status</p>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Search</p>
          <Input
            placeholder="Search title, subject, teacher…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      {loading ? <SkeletonTable rows={10} cols={5} /> : null}
      {error ? <ErrorState message={error} onRetry={reload} /> : null}

      {!loading && !error && result?.items.length === 0 ? (
        <EmptyState title="No results" description="Try changing filters or search." />
      ) : null}

      {!loading && !error && result && result.items.length > 0 ? (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title / Subject</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Starts</TableHead>
                  <TableHead>Rejection</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.items.map((item) => (
                  <AllContentRow key={item.id} item={item} />
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              Page {result.page} of {totalPages} · {result.total} items
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
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
