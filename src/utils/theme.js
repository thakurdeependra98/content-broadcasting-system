export const THEME_KEY = 'cbs_theme'

export function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'

  try {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // Ignore storage errors and fall back to system preference.
  }

  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function applyTheme(theme) {
  if (typeof document === 'undefined') return

  document.documentElement.classList.toggle('dark', theme === 'dark')

  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    // Ignore storage errors in private/incognito modes.
  }
}