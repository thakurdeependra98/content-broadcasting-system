import { CONTENT_STATUS } from './constants.js'

/**
 * Broadcast window phase for approved items (UI only).
 * @param {{ status: string, startTime: string, endTime: string }} item
 * @param {number} [nowMs]
 * @returns {'pending_review' | 'scheduled' | 'active' | 'expired' | 'rejected'}
 */
export function getBroadcastPhase(item, nowMs = Date.now()) {
  if (item.status === CONTENT_STATUS.REJECTED) return 'rejected'
  if (item.status === CONTENT_STATUS.PENDING) return 'pending_review'
  const start = new Date(item.startTime).getTime()
  const end = new Date(item.endTime).getTime()
  if (Number.isNaN(start) || Number.isNaN(end)) return 'expired'
  if (nowMs < start) return 'scheduled'
  if (nowMs <= end) return 'active'
  return 'expired'
}

/**
 * @param {ReturnType<typeof getBroadcastPhase>} phase
 */
export function phaseLabel(phase) {
  switch (phase) {
    case 'pending_review':
      return 'Pending review'
    case 'scheduled':
      return 'Scheduled'
    case 'active':
      return 'Active'
    case 'expired':
      return 'Expired'
    case 'rejected':
      return 'Rejected'
    default:
      return '—'
  }
}
