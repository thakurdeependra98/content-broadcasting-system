import { useCallback, useEffect, useState } from 'react'
import * as contentService from '@/services/content.service.js'

/**
 * @param {{ status: string, q: string, page: number, pageSize?: number }} params
 */
export function useAllContentList(params) {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(/** @type {string | null} */ (null))

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await contentService.getAllContent({
        status: params.status,
        q: params.q,
        page: params.page,
        pageSize: params.pageSize ?? 20,
      })
      if (!data || !Array.isArray(data.items)) {
        throw new Error('Unexpected response')
      }
      setResult({
        items: data.items,
        total: data.total,
        page: data.page,
        pageSize: data.pageSize,
      })
    } catch (e) {
      setResult(null)
      setError(e instanceof Error ? e.message : 'Failed to load content')
    } finally {
      setLoading(false)
    }
  }, [params.page, params.pageSize, params.q, params.status])

  useEffect(() => {
    const t = window.setTimeout(() => {
      void load()
    }, 0)
    return () => window.clearTimeout(t)
  }, [load])

  return { result, loading, error, reload: load }
}
