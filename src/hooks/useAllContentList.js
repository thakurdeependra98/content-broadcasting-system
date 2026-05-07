import { useQuery } from '@tanstack/react-query'
import * as contentService from '@/services/content.service.js'

/**
 * @param {{ status: string, q: string, page: number, pageSize?: number }} params
 */
export function useAllContentList(params) {
  const query = useQuery({
    queryKey: ['all-content', params.status, params.q, params.page, params.pageSize ?? 20],
    queryFn: () =>
      contentService.getAllContent({
        status: params.status,
        q: params.q,
        page: params.page,
        pageSize: params.pageSize ?? 20,
      }),
  })

  return {
    result: query.data ?? null,
    loading: query.isLoading || query.isFetching,
    error: query.error instanceof Error ? query.error.message : null,
    reload: query.refetch,
  }
}
