import { useCallback, useMemo, useState } from 'react'
import * as authService from '@/services/auth.service.js'
import { AuthContext } from '@/context/auth-context.js'
import { TOKEN_KEY, USER_KEY } from '@/utils/constants.js'

function loadPersistedUser() {
  try {
    const token = localStorage.getItem(TOKEN_KEY)
    const raw = localStorage.getItem(USER_KEY)
    if (token && raw) {
      return JSON.parse(raw)
    }
  } catch {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }
  return null
}

/**
 * @param {{ children: import('react').ReactNode }} props
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadPersistedUser())

  /**
   * @param {{ email: string, password: string }} credentials
   */
  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials)
    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
