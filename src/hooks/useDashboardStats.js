import { useCallback, useEffect, useState } from 'react'
import * as contentService from '@/services/content.service.js'

export function useDashboardStats() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(/** @type {string | null} */ (null))

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await contentService.getStats()
      setStats(data)
    } catch (e) {
      setStats(null)
      setError(e instanceof Error ? e.message : 'Failed to load stats')
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

  return { stats, loading, error, reload: load }
}
