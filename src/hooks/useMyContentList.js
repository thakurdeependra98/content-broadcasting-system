import { useQuery } from '@tanstack/react-query'
import * as contentService from '@/services/content.service.js'

export function useMyContentList() {
  const query = useQuery({
    queryKey: ['my-content'],
    queryFn: () => contentService.getMyContent(),
  })

  return {
    items: Array.isArray(query.data) ? query.data : [],
    loading: query.isLoading || query.isFetching,
    error: query.error instanceof Error ? query.error.message : null,
    reload: query.refetch,
  }
}
