import { api } from '@/services/http.js'

/**
 * @returns {Promise<object[]>}
 */
export async function getPendingApprovals() {
  const { data } = await api.get('content/pending')
  return data
}

/**
 * @param {string} contentId
 */
export async function approveContent(contentId) {
  const { data } = await api.post(
    `content/${encodeURIComponent(contentId)}/approve`,
  )
  return data
}

/**
 * @param {string} contentId
 * @param {string} reason
 */
export async function rejectContent(contentId, reason) {
  const { data } = await api.post(
    `content/${encodeURIComponent(contentId)}/reject`,
    { reason },
  )
  return data
}
