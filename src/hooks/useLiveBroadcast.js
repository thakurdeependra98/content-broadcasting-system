import { useQuery } from '@tanstack/react-query'
import * as contentService from '@/services/content.service.js'

/**
 * @param {string | undefined} teacherId
 */
export function useLiveBroadcast(teacherId) {
  const query = useQuery({
    queryKey: ['live-active', teacherId ?? ''],
    queryFn: () => contentService.getLiveActive(teacherId ?? ''),
    enabled: Boolean(teacherId),
    refetchInterval: 10_000,
    refetchIntervalInBackground: true,
  })

  return {
    data: query.data ?? null,
    loading: query.isLoading || query.isFetching,
    error: query.error instanceof Error ? query.error.message : null,
    refresh: query.refetch,
  }
}
