import { useEffect, useState } from 'react'

/**
 * @template T
 * @param {T} value
 * @param {number} delayMs
 */
export function useDebounce(value, delayMs = 300) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(id)
  }, [value, delayMs])

  return debounced
}
