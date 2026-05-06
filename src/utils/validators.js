import { z } from 'zod'
import { FILE_RULES, SUBJECTS } from './constants.js'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const uploadContentSchema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    subject: z
      .string()
      .min(1, 'Subject is required')
      .refine((s) => SUBJECTS.includes(s), { message: 'Select a subject' }),
    description: z.string().optional(),
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
    rotationDuration: z.coerce.number().min(1, 'Rotation must be at least 1 second'),
  })
  .superRefine((data, ctx) => {
    const start = new Date(data.startTime).getTime()
    const end = new Date(data.endTime).getTime()
    if (Number.isNaN(start) || Number.isNaN(end)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid date',
        path: ['endTime'],
      })
      return
    }
    if (end <= start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'End time must be after start time',
        path: ['endTime'],
      })
    }
  })

/**
 * @param {File | null | undefined} file
 */
export function validateUploadFile(file) {
  if (!file) return { ok: false, message: 'File is required' }
  if (!FILE_RULES.acceptMime.includes(file.type)) {
    return {
      ok: false,
      message: 'Only JPG, PNG, or GIF images are allowed',
    }
  }
  if (file.size > FILE_RULES.maxBytes) {
    return { ok: false, message: 'File must be 10MB or smaller' }
  }
  return { ok: true, message: '' }
}

export const rejectReasonSchema = z.object({
  reason: z.string().min(1, 'Rejection reason is required').max(500),
})
