import { useCallback, useState } from 'react'
import * as contentService from '@/services/content.service.js'

export function useContentUpload() {
  const [loading, setLoading] = useState(false)

  const submit = useCallback(async (payload) => {
    setLoading(true)
    try {
      return await contentService.uploadContent(payload)
    } finally {
      setLoading(false)
    }
  }, [])

  return { submit, loading }
}
