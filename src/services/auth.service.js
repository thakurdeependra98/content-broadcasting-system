import { api } from '@/services/http.js'

/**
 * @param {{ email: string, password: string }} credentials
 */
export async function login(credentials) {
  const { data } = await api.post('auth/login', credentials)
  return data
}
