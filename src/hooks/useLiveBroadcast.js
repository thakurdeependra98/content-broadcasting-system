import { useCallback } from 'react'
import * as contentService from '@/services/content.service.js'
import { usePolling } from '@/hooks/usePolling.js'

/**
 * @param {string | undefined} teacherId
 */
export function useLiveBroadcast(teacherId) {
  const fetcher = useCallback(
    () => contentService.getLiveActive(teacherId ?? ''),
    [teacherId],
  )
  return usePolling(fetcher, 10_000, Boolean(teacherId))
}
