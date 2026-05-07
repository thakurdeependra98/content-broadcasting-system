import { useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import * as contentService from '@/services/content.service.js'

export function useContentUpload() {
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()

  const submit = useCallback(async (payload) => {
    setLoading(true)
    try {
      const result = await contentService.uploadContent(payload)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['my-content'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] }),
        queryClient.invalidateQueries({ queryKey: ['all-content'] }),
      ])
      return result
    } finally {
      setLoading(false)
    }
  }, [queryClient])

  return { submit, loading }
}
