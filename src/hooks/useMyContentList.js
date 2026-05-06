import { useCallback, useEffect, useState } from 'react'
import * as contentService from '@/services/content.service.js'

export function useMyContentList() {
  const [items, setItems] = useState(/** @type {object[] | null} */ (null))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(/** @type {string | null} */ (null))

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await contentService.getMyContent()
      setItems(Array.isArray(data) ? data : [])
    } catch (e) {
      setItems(null)
      setError(e instanceof Error ? e.message : 'Failed to load content')
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
