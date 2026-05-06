import { Badge } from '@/components/ui/badge.jsx'
import { CONTENT_STATUS } from '@/utils/constants.js'
import { getBroadcastPhase, phaseLabel } from '@/utils/schedule.js'

/**
 * @param {{ status: string, item?: object }} props
 */
export function StatusBadge({ status, item }) {
  if (item && status === CONTENT_STATUS.APPROVED) {
    const phase = getBroadcastPhase(item)
    const map = {
      scheduled: 'secondary',
      active: 'default',
      expired: 'outline',
      pending_review: 'secondary',
      rejected: 'destructive',
    }
    return (
      <Badge variant={map[phase] ?? 'secondary'}>{phaseLabel(phase)}</Badge>
    )
  }

  if (status === CONTENT_STATUS.PENDING) {
    return <Badge variant="secondary">Pending</Badge>
  }
  if (status === CONTENT_STATUS.APPROVED) {
    return <Badge variant="default">Approved</Badge>
  }
  if (status === CONTENT_STATUS.REJECTED) {
    return <Badge variant="destructive">Rejected</Badge>
  }
  return <Badge variant="outline">{status}</Badge>
}
