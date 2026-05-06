import { BarChart3, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader.jsx'
import { StatCard } from '@/components/common/StatCard.jsx'
import { ErrorState } from '@/components/common/ErrorState.jsx'
import { Skeleton } from '@/components/ui/skeleton.jsx'
import { useDashboardStats } from '@/hooks/useDashboardStats.js'

export default function PrincipalDashboard() {
  const { stats, loading, error, reload } = useDashboardStats()

  return (
    <div>
      <PageHeader
        title="Principal Dashboard"
        description="School-wide overview of broadcast submissions."
      />
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      ) : null}
      {error ? <ErrorState message={error} onRetry={reload} /> : null}
      {stats && !loading ? (
        <div className="grid gap-2 rounded-xl sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total uploaded"
            value={stats.total}
            icon={<BarChart3 className="h-4 w-4" />}
            status="primary"
          />
          <StatCard title="Pending" value={stats.pending} icon={<Clock className="h-4 w-4" />} status="warning" />
          <StatCard title="Approved" value={stats.approved} icon={<CheckCircle2 className="h-4 w-4" />} status="success" />
          <StatCard title="Rejected" value={stats.rejected} icon={<XCircle className="h-4 w-4" />} status="destructive" />
        </div>
      ) : null}
    </div>
  )
}
