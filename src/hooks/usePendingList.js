import { useQuery } from '@tanstack/react-query'
import * as approvalService from '@/services/approval.service.js'

export function usePendingList() {
  const query = useQuery({
    queryKey: ['pending-approvals'],
    queryFn: () => approvalService.getPendingApprovals(),
  })

  return {
    items: Array.isArray(query.data) ? query.data : [],
    loading: query.isLoading || query.isFetching,
    error: query.error instanceof Error ? query.error.message : null,
    reload: query.refetch,
  }
}
