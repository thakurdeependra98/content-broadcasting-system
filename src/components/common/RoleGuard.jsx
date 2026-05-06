import { Navigate, Outlet } from 'react-router-dom'
import { ROLES } from '@/utils/constants.js'
import { useAuth } from '@/hooks/useAuth.js'

/**
 * @param {{ allow: string[] }} props
 */
export function RoleGuard({ allow }) {
  const { user } = useAuth()

  if (!user || !allow.includes(user.role)) {
    if (user?.role === ROLES.TEACHER) {
      return <Navigate to="/teacher/dashboard" replace />
    }
    if (user?.role === ROLES.PRINCIPAL) {
      return <Navigate to="/principal/dashboard" replace />
    }
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
