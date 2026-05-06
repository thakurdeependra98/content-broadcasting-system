/** @typedef {'principal' | 'teacher'} Role */

export const ROLES = {
  PRINCIPAL: 'principal',
  TEACHER: 'teacher',
}

export const CONTENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
}

export const SUBJECTS = [
  'Mathematics',
  'Science',
  'English',
  'History',
  'Art',
  'Physical Education',
  'Computer Science',
]

export const FILE_RULES = {
  maxBytes: 10 * 1024 * 1024,
  acceptMime: ['image/jpeg', 'image/png', 'image/gif'],
  acceptExt: ['.jpg', '.jpeg', '.png', '.gif'],
}

export const TOKEN_KEY = 'cbs_token'
export const USER_KEY = 'cbs_user'

export const PAGE_SIZE_DEFAULT = 20
