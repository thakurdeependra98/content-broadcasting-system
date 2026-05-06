import { useCallback, useState } from 'react'
import * as approvalService from '@/services/approval.service.js'

export function useApprovalActions() {
  const [busyId, setBusyId] = useState(/** @type {string | null} */ (null))

  const approve = useCallback(async (id) => {
    setBusyId(id)
    try {
      return await approvalService.approveContent(id)
    } finally {
      setBusyId(null)
    }
  }, [])

  const reject = useCallback(async (id, reason) => {
    setBusyId(id)
    try {
      return await approvalService.rejectContent(id, reason)
    } finally {
      setBusyId(null)
    }
  }, [])

  return { approve, reject, busyId }
}
