import { useQuery } from '@tanstack/react-query'
import * as contentService from '@/services/content.service.js'

export function useDashboardStats() {
  const query = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => contentService.getStats(),
  })

  return {
    stats: query.data ?? null,
    loading: query.isLoading || query.isFetching,
    error: query.error instanceof Error ? query.error.message : null,
    reload: query.refetch,
  }
}
