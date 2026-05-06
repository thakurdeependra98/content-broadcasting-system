/**
 * @param {string | number | Date} value
 */
export function formatDateTime(value) {
  if (value == null || value === '') return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

/**
 * @param {number} bytes
 */
export function formatFileSize(bytes) {
  if (bytes == null || Number.isNaN(bytes)) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * @param {string} status
 */
export function formatStatusLabel(status) {
  if (!status) return '—'
  return status.charAt(0).toUpperCase() + status.slice(1)
}
