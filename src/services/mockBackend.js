import { CONTENT_STATUS, ROLES, SUBJECTS } from '@/utils/constants.js'

const LS_KEY = 'cbs_db_v1'

/** Tiny GIF — reused for seeded rows to keep localStorage small */
export const PLACEHOLDER_IMAGE =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

/**
 * @returns {number}
 */
export function randomLatencyMs() {
  return 180 + Math.floor(Math.random() * 420)
}

/**
 * @param {number} [ms]
 */
export async function mockDelay(ms = randomLatencyMs()) {
  await new Promise((r) => setTimeout(r, ms))
}

/**
 * @returns {{ users: object[], content: object[] }}
 */
function seedDatabase() {
  const now = Date.now()
  /** @type {object[]} */
  const users = [
    {
      id: 'principal-1',
      name: 'Dr. Anita Sharma',
      email: 'principal@demo.com',
      password: 'principal123',
      role: ROLES.PRINCIPAL,
    },
    {
      id: 'teacher-1',
      name: 'Mr. Rahul Verma',
      email: 'teacher@demo.com',
      password: 'teacher123',
      role: ROLES.TEACHER,
    },
    {
      id: 'teacher-2',
      name: 'Ms. Priya Nair',
      email: 'teacher2@demo.com',
      password: 'teacher123',
      role: ROLES.TEACHER,
    },
  ]
  const teachers = users.filter((u) => u.role === ROLES.TEACHER)
  /** @type {object[]} */
  const content = []

  for (let i = 0; i < 600; i += 1) {
    const r = i % 100
    let status
    if (r < 15) status = CONTENT_STATUS.PENDING
    else if (r < 80) status = CONTENT_STATUS.APPROVED
    else status = CONTENT_STATUS.REJECTED

    const teacher = teachers[i % teachers.length]
    let startMs
    let endMs

    if (status === CONTENT_STATUS.APPROVED) {
      const bucket = i % 5
      if (bucket === 0) {
        startMs = now - 3600_000
        endMs = now + 3600_000
      } else if (bucket === 1) {
        startMs = now + 7200_000
        endMs = now + 10_800_000
      } else if (bucket === 2) {
        startMs = now - 7 * 86400_000
        endMs = now - 86400_000
      } else {
        startMs = now - (i % 50) * 3600_000
        endMs = startMs + (2 + (i % 4)) * 3600_000
      }
    } else {
      startMs = now + 86400_000
      endMs = now + 90_000_000
    }

    content.push({
      id: `c-${i + 1}`,
      teacherId: teacher.id,
      teacherName: teacher.name,
      title: `Broadcast item ${i + 1}`,
      subject: SUBJECTS[i % SUBJECTS.length],
      description: `Auto-generated demo content #${i + 1}.`,
      fileDataUrl: PLACEHOLDER_IMAGE,
      fileName: `demo-${i + 1}.gif`,
      fileType: 'image/gif',
      fileSize: 43,
      startTime: new Date(startMs).toISOString(),
      endTime: new Date(endMs).toISOString(),
      rotationDuration: [5, 10, 15, 30][i % 4],
      status,
      rejectionReason:
        status === CONTENT_STATUS.REJECTED
          ? 'Does not meet curriculum guidelines.'
          : null,
      createdAt: new Date(now - (i % 200) * 3600_000).toISOString(),
      updatedAt: new Date(now - (i % 30) * 600_000).toISOString(),
    })
  }

  return { users, content }
}

/**
 * @returns {object[]}
 */
function getDemoUsers() {
  return [
    {
      id: 'principal-1',
      name: 'Dr. Anita Sharma',
      email: 'principal@demo.com',
      password: 'principal123',
      role: ROLES.PRINCIPAL,
    },
    {
      id: 'teacher-1',
      name: 'Mr. Rahul Verma',
      email: 'teacher@demo.com',
      password: 'teacher123',
      role: ROLES.TEACHER,
    },
    {
      id: 'teacher-2',
      name: 'Ms. Priya Nair',
      email: 'teacher2@demo.com',
      password: 'teacher123',
      role: ROLES.TEACHER,
    },
  ]
}

/**
 * @param {unknown} value
 */
function isValidUser(value) {
  if (!value || typeof value !== 'object') return false
  const u = /** @type {Record<string, unknown>} */ (value)
  return (
    typeof u.id === 'string' &&
    typeof u.name === 'string' &&
    typeof u.email === 'string' &&
    typeof u.password === 'string' &&
    (u.role === ROLES.PRINCIPAL || u.role === ROLES.TEACHER)
  )
}

/**
 * Preserve existing data, but always ensure demo accounts exist and are valid.
 * This prevents login failures when stale localStorage has broken `users`.
 * @param {object[] | undefined} users
 */
function normalizeUsers(users) {
  const byEmail = new Map()
  for (const candidate of Array.isArray(users) ? users : []) {
    if (isValidUser(candidate)) {
      byEmail.set(candidate.email.toLowerCase(), candidate)
    }
  }

  for (const demoUser of getDemoUsers()) {
    byEmail.set(demoUser.email.toLowerCase(), demoUser)
  }
  return Array.from(byEmail.values())
}

/**
 * @returns {{ users: object[], content: object[] }}
 */
export function getDb() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) {
      const fresh = seedDatabase()
      localStorage.setItem(LS_KEY, JSON.stringify(fresh))
      return fresh
    }
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.content)) {
      throw new Error('invalid shape')
    }
    const normalized = {
      users: normalizeUsers(parsed.users),
      content: parsed.content,
    }
    // Keep storage self-healed so next refresh is stable.
    localStorage.setItem(LS_KEY, JSON.stringify(normalized))
    return normalized
  } catch {
    const fresh = seedDatabase()
    localStorage.setItem(LS_KEY, JSON.stringify(fresh))
    return fresh
  }
}

/**
 * @param {{ users: object[], content: object[] }} db
 */
export function saveDb(db) {
  localStorage.setItem(LS_KEY, JSON.stringify(db))
}

/**
 * @param {string} email
 * @param {string} password
 */
export function loginUser(email, password) {
  const db = getDb()
  const user = db.users.find(
    (u) =>
      u.email.toLowerCase() === String(email).toLowerCase() &&
      u.password === password,
  )
  if (!user) {
    const err = new Error('Invalid email or password')
    err.status = 401
    throw err
  }
  const token = `mock:${user.id}:${Date.now()}`
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  }
}

/**
 * @param {string | null | undefined} token
 */
export function userFromToken(token) {
  if (!token || !String(token).startsWith('mock:')) return null
  const parts = String(token).split(':')
  if (parts.length < 3) return null
  const userId = parts[1]
  const db = getDb()
  const user = db.users.find((u) => u.id === userId)
  if (!user) return null
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}

/**
 * @param {object} user
 */
export function getStatsForUser(user) {
  const db = getDb()
  const list =
    user.role === ROLES.TEACHER
      ? db.content.filter((c) => c.teacherId === user.id)
      : db.content

  const pending = list.filter((c) => c.status === CONTENT_STATUS.PENDING).length
  const approved = list.filter(
    (c) => c.status === CONTENT_STATUS.APPROVED,
  ).length
  const rejected = list.filter(
    (c) => c.status === CONTENT_STATUS.REJECTED,
  ).length

  return {
    total: list.length,
    pending,
    approved,
    rejected,
  }
}

/**
 * @param {string} teacherId
 */
export function listTeacherContent(teacherId) {
  const db = getDb()
  return db.content
    .filter((c) => c.teacherId === teacherId)
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
}

/**
 * @param {object} user
 */
export function listPendingForPrincipal(user) {
  if (user.role !== ROLES.PRINCIPAL) {
    const err = new Error('Forbidden')
    err.status = 403
    throw err
  }
  const db = getDb()
  return db.content
    .filter((c) => c.status === CONTENT_STATUS.PENDING)
    .slice()
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )
}

/**
 * @param {object} params
 * @param {string} [params.status]
 * @param {string} [params.q]
 * @param {number} [params.page]
 * @param {number} [params.pageSize]
 */
export function listAllContentForPrincipal(params) {
  const db = getDb()
  let rows = db.content.slice()

  if (params.status && params.status !== 'all') {
    rows = rows.filter((c) => c.status === params.status)
  }

  const q = (params.q ?? '').trim().toLowerCase()
  if (q) {
    rows = rows.filter(
      (c) =>
        String(c.title).toLowerCase().includes(q) ||
        String(c.subject).toLowerCase().includes(q) ||
        String(c.teacherName).toLowerCase().includes(q),
    )
  }

  rows.sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )

  const page = Math.max(1, Number(params.page) || 1)
  const pageSize = Math.min(100, Math.max(1, Number(params.pageSize) || 20))
  const total = rows.length
  const start = (page - 1) * pageSize
  const items = rows.slice(start, start + pageSize)

  return { items, total, page, pageSize }
}

/**
 * @param {object} user
 * @param {object} payload
 */
export function createContentItem(user, payload) {
  if (user.role !== ROLES.TEACHER) {
    const err = new Error('Only teachers can upload')
    err.status = 403
    throw err
  }
  const db = getDb()
  const now = new Date().toISOString()
  const item = {
    id: `c-${Date.now()}`,
    teacherId: user.id,
    teacherName: user.name,
    title: payload.title,
    subject: payload.subject,
    description: payload.description ?? '',
    fileDataUrl: payload.fileDataUrl,
    fileName: payload.fileName,
    fileType: payload.fileType,
    fileSize: payload.fileSize,
    startTime: payload.startTime,
    endTime: payload.endTime,
    rotationDuration: payload.rotationDuration,
    status: CONTENT_STATUS.PENDING,
    rejectionReason: null,
    createdAt: now,
    updatedAt: now,
  }
  db.content.unshift(item)
  saveDb(db)
  return item
}

/**
 * @param {object} user
 * @param {string} id
 */
export function approveItem(user, id) {
  if (user.role !== ROLES.PRINCIPAL) {
    const err = new Error('Forbidden')
    err.status = 403
    throw err
  }
  const db = getDb()
  const item = db.content.find((c) => c.id === id)
  if (!item) {
    const err = new Error('Content not found')
    err.status = 404
    throw err
  }
  if (item.status !== CONTENT_STATUS.PENDING) {
    const err = new Error('Only pending items can be approved')
    err.status = 400
    throw err
  }
  item.status = CONTENT_STATUS.APPROVED
  item.rejectionReason = null
  item.updatedAt = new Date().toISOString()
  saveDb(db)
  return item
}

/**
 * @param {object} user
 * @param {string} id
 * @param {string} reason
 */
export function rejectItem(user, id, reason) {
  if (user.role !== ROLES.PRINCIPAL) {
    const err = new Error('Forbidden')
    err.status = 403
    throw err
  }
  const db = getDb()
  const item = db.content.find((c) => c.id === id)
  if (!item) {
    const err = new Error('Content not found')
    err.status = 404
    throw err
  }
  if (item.status !== CONTENT_STATUS.PENDING) {
    const err = new Error('Only pending items can be rejected')
    err.status = 400
    throw err
  }
  item.status = CONTENT_STATUS.REJECTED
  item.rejectionReason = reason
  item.updatedAt = new Date().toISOString()
  saveDb(db)
  return item
}

/**
 * @param {string} teacherId
 */
export function getLiveActiveForTeacher(teacherId) {
  const db = getDb()
  const now = Date.now()
  const candidates = db.content.filter((c) => {
    if (c.teacherId !== teacherId) return false
    if (c.status !== CONTENT_STATUS.APPROVED) return false
    const start = new Date(c.startTime).getTime()
    const end = new Date(c.endTime).getTime()
    if (Number.isNaN(start) || Number.isNaN(end)) return false
    return start <= now && now <= end
  })
  if (candidates.length === 0) return null
  candidates.sort((a, b) => {
    const da = Math.abs(now - new Date(a.startTime).getTime())
    const db_ = Math.abs(now - new Date(b.startTime).getTime())
    return da - db_
  })
  return candidates[0]
}
