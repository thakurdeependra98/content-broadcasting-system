import axios from 'axios'
import {
  approveItem,
  createContentItem,
  getLiveActiveForTeacher,
  getStatsForUser,
  listAllContentForPrincipal,
  listPendingForPrincipal,
  listTeacherContent,
  loginUser,
  mockDelay,
  rejectItem,
  userFromToken,
} from '@/services/mockBackend.js'
import { ROLES, TOKEN_KEY } from '@/utils/constants.js'

/**
 * Axios instance. Uses a custom adapter that routes to the local mock backend.
 * Swap `adapter` for default when pointing `baseURL` at a real API.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '',
})

/**
 * @param {import('axios').InternalAxiosRequestConfig} config
 */
function getBearerToken(config) {
  const h = config.headers
  const auth =
    (typeof h?.get === 'function' ? h.get('Authorization') : h?.Authorization) ??
    config.headers?.common?.Authorization
  if (typeof auth !== 'string') return null
  const m = auth.match(/^Bearer\s+(.+)$/i)
  return m ? m[1] : null
}

/**
 * Axios serializes plain request bodies to JSON strings before the adapter runs.
 * Normalizing here keeps the mock backend compatible with both strings and objects.
 * @param {unknown} data
 */
function parseRequestData(data) {
  if (typeof data !== 'string') return data ?? {}
  if (!data) return {}
  try {
    return JSON.parse(data)
  } catch {
    return data
  }
}

/**
 * @param {import('axios').InternalAxiosRequestConfig} config
 */
async function mockAdapter(config) {
  await mockDelay()
  const method = (config.method ?? 'get').toLowerCase()
  const raw = String(config.url ?? '').replace(/^\//, '')
  const [url, queryStr] = raw.split('?')
  const token = getBearerToken(config)
  const user = userFromToken(token)
  const data = parseRequestData(config.data)

  try {
    if (url === 'auth/login' && method === 'post') {
      return { data: loginUser(data.email, data.password) }
    }

    const liveMatchEarly = url.match(/^live\/([^/]+)\/active$/)
    if (liveMatchEarly && method === 'get') {
      return { data: getLiveActiveForTeacher(liveMatchEarly[1]) }
    }

    if (!user) {
      const err = new Error('Unauthorized')
      err.response = { status: 401, data: { message: 'Unauthorized' } }
      throw err
    }

    if (url === 'content/stats' && method === 'get') {
      return { data: getStatsForUser(user) }
    }

    if (url === 'content/my' && method === 'get') {
      if (user.role !== ROLES.TEACHER) {
        const err = new Error('Forbidden')
        err.response = { status: 403, data: { message: 'Forbidden' } }
        throw err
      }
      return { data: listTeacherContent(user.id) }
    }

    if (url === 'content/pending' && method === 'get') {
      if (user.role !== ROLES.PRINCIPAL) {
        const err = new Error('Forbidden')
        err.response = { status: 403, data: { message: 'Forbidden' } }
        throw err
      }
      return { data: listPendingForPrincipal(user) }
    }

    if (url === 'content/all' && method === 'get') {
      if (user.role !== ROLES.PRINCIPAL) {
        const err = new Error('Forbidden')
        err.response = { status: 403, data: { message: 'Forbidden' } }
        throw err
      }
      const u = new URLSearchParams(queryStr ?? '')
      const status = u.get('status') ?? 'all'
      const q = u.get('q') ?? ''
      const page = u.get('page') ?? '1'
      const pageSize = u.get('pageSize') ?? '20'
      return {
        data: listAllContentForPrincipal({
          status,
          q,
          page,
          pageSize,
        }),
      }
    }

    if (url === 'content' && method === 'post') {
      if (user.role !== ROLES.TEACHER) {
        const err = new Error('Forbidden')
        err.response = { status: 403, data: { message: 'Forbidden' } }
        throw err
      }
      return { data: createContentItem(user, data) }
    }

    const approveMatch = url.match(/^content\/([^/]+)\/approve$/)
    if (approveMatch && method === 'post') {
      if (user.role !== ROLES.PRINCIPAL) {
        const err = new Error('Forbidden')
        err.response = { status: 403, data: { message: 'Forbidden' } }
        throw err
      }
      return { data: approveItem(user, approveMatch[1]) }
    }

    const rejectMatch = url.match(/^content\/([^/]+)\/reject$/)
    if (rejectMatch && method === 'post') {
      if (user.role !== ROLES.PRINCIPAL) {
        const err = new Error('Forbidden')
        err.response = { status: 403, data: { message: 'Forbidden' } }
        throw err
      }
      return { data: rejectItem(user, rejectMatch[1], data.reason) }
    }

    const err = new Error('Not found')
    err.response = { status: 404, data: { message: 'Not found' } }
    throw err
  } catch (e) {
    if (e.response) throw e
    const status = e.status ?? 500
    const err = new Error(e.message ?? 'Server error')
    err.response = { status, data: { message: e.message } }
    throw err
  }
}

api.defaults.adapter = async (config) => {
  try {
    const res = await mockAdapter(config)
    return {
      data: res.data,
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    }
  } catch (err) {
    return Promise.reject(err)
  }
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (r) => r,
  (error) => {
    const msg =
      error.response?.data?.message ??
      error.message ??
      'Something went wrong'
    const next = new Error(msg)
    next.status = error.response?.status
    next.original = error
    return Promise.reject(next)
  },
)
