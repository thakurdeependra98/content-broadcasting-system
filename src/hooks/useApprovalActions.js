import { useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import * as approvalService from '@/services/approval.service.js'

export function useApprovalActions() {
  const [busyId, setBusyId] = useState(/** @type {string | null} */ (null))
  const queryClient = useQueryClient()

  const approve = useCallback(async (id) => {
    setBusyId(id)
    try {
      const result = await approvalService.approveContent(id)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['pending-approvals'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] }),
        queryClient.invalidateQueries({ queryKey: ['my-content'] }),
        queryClient.invalidateQueries({ queryKey: ['all-content'] }),
      ])
      return result
    } finally {
      setBusyId(null)
    }
  }, [queryClient])

  const reject = useCallback(async (id, reason) => {
    setBusyId(id)
    try {
      const result = await approvalService.rejectContent(id, reason)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['pending-approvals'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] }),
        queryClient.invalidateQueries({ queryKey: ['my-content'] }),
        queryClient.invalidateQueries({ queryKey: ['all-content'] }),
      ])
      return result
    } finally {
      setBusyId(null)
    }
  }, [queryClient])

  return { approve, reject, busyId }
}
