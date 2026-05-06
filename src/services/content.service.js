import { api } from '@/services/http.js'

/**
 * @param {string} teacherId
 */
export async function getLiveActive(teacherId) {
  const { data } = await api.get(`live/${encodeURIComponent(teacherId)}/active`)
  return data
}

/**
 * @returns {Promise<object>}
 */
export async function getStats() {
  const { data } = await api.get('content/stats')
  return data
}

/**
 * @returns {Promise<object[]>}
 */
export async function getMyContent() {
  const { data } = await api.get('content/my')
  return data
}

/**
 * @param {object} payload
 */
export async function uploadContent(payload) {
  const { data } = await api.post('content', payload)
  return data
}

/**
 * @param {{ status?: string, q?: string, page?: number, pageSize?: number }} params
 */
export async function getAllContent(params = {}) {
  const search = new URLSearchParams()
  search.set('status', params.status ?? 'all')
  search.set('q', params.q ?? '')
  search.set('page', String(params.page ?? 1))
  search.set('pageSize', String(params.pageSize ?? 20))
  const { data } = await api.get(`content/all?${search.toString()}`)
  return data
}
