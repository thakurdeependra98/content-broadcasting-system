import { useEffect, useState } from 'react'
import { applyTheme, getInitialTheme } from '@/utils/theme.js'

export function useTheme() {
  const [theme, setTheme] = useState(() => getInitialTheme())

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }

  return {
    theme,
    isDark: theme === 'dark',
    setTheme,
    toggleTheme,
  }
}