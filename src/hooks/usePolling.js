import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * @template T
 * @param {() => Promise<T>} fetcher
 * @param {number} intervalMs
 * @param {boolean} [enabled=true]
 */
export function usePolling(fetcher, intervalMs = 10_000, enabled = true) {
  const [data, setData] = useState(/** @type {T | null} */ (null))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(/** @type {string | null} */ (null))
  const mounted = useRef(true)

  const tick = useCallback(async () => {
    try {
      const result = await fetcher()
      if (!mounted.current) return
      setData(result)
      setError(null)
    } catch (e) {
      if (!mounted.current) return
      const msg = e instanceof Error ? e.message : 'Failed to refresh'
      setError(msg)
    } finally {
      if (mounted.current) setLoading(false)
    }
  }, [fetcher])

  useEffect(() => {
    mounted.current = true
    if (!enabled) {
      const t0 = window.setTimeout(() => setLoading(false), 0)
      return () => window.clearTimeout(t0)
    }

    const t1 = window.setTimeout(() => {
      setLoading(true)
      void tick()
    }, 0)
    const id = setInterval(() => {
      void tick()
    }, intervalMs)

    return () => {
      mounted.current = false
      window.clearTimeout(t1)
      clearInterval(id)
    }
  }, [enabled, intervalMs, tick])

  return { data, loading, error, refresh: tick }
}
