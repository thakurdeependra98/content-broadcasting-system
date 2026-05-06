import { Navigate } from 'react-router-dom'
import { ROLES } from '@/utils/constants.js'
import { useAuth } from '@/hooks/useAuth.js'

export function RootRedirect() {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role === ROLES.TEACHER) {
    return <Navigate to="/teacher/dashboard" replace />
  }

  return <Navigate to="/principal/dashboard" replace />
}
