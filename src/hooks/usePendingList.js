import { useCallback, useEffect, useState } from 'react'
import * as approvalService from '@/services/approval.service.js'

export function usePendingList() {
  const [items, setItems] = useState(/** @type {object[] | null} */ (null))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(/** @type {string | null} */ (null))

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await approvalService.getPendingApprovals()
      setItems(Array.isArray(data) ? data : [])
    } catch (e) {
      setItems(null)
      setError(e instanceof Error ? e.message : 'Failed to load approvals')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const t = window.setTimeout(() => {
      void load()
    }, 0)
    return () => window.clearTimeout(t)
  }, [load])

  return { items, loading, error, reload: load }
}
