import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layouts/AppLayout.jsx'
import { PublicLayout } from '@/components/layouts/PublicLayout.jsx'
import { ProtectedRoute } from '@/components/common/ProtectedRoute.jsx'
import { RoleGuard } from '@/components/common/RoleGuard.jsx'
import { ROLES } from '@/utils/constants.js'
import { PageLoader } from '@/routes/PageLoader.jsx'
import { RootRedirect } from '@/routes/RootRedirect.jsx'

const Login = lazy(() => import('@/pages/auth/Login.jsx'))
const TeacherDashboard = lazy(() => import('@/pages/teacher/Dashboard.jsx'))
const TeacherUpload = lazy(() => import('@/pages/teacher/UploadContent.jsx'))
const TeacherMyContent = lazy(() => import('@/pages/teacher/MyContent.jsx'))
const PrincipalDashboard = lazy(() => import('@/pages/principal/Dashboard.jsx'))
const PrincipalApprovals = lazy(() => import('@/pages/principal/PendingApprovals.jsx'))
const PrincipalAllContent = lazy(() => import('@/pages/principal/AllContent.jsx'))
const LivePage = lazy(() => import('@/pages/public/LivePage.jsx'))
const NotFound = lazy(() => import('@/pages/NotFound.jsx'))

export function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />

        <Route element={<PublicLayout />}>
          <Route path="/live/:teacherId" element={<LivePage />} />
        </Route>

        <Route path="/teacher" element={<ProtectedRoute />}>
          <Route element={<RoleGuard allow={[ROLES.TEACHER]} />}>
            <Route element={<AppLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<TeacherDashboard />} />
              <Route path="upload" element={<TeacherUpload />} />
              <Route path="my-content" element={<TeacherMyContent />} />
            </Route>
          </Route>
        </Route>

        <Route path="/principal" element={<ProtectedRoute />}>
          <Route element={<RoleGuard allow={[ROLES.PRINCIPAL]} />}>
            <Route element={<AppLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<PrincipalDashboard />} />
              <Route path="approvals" element={<PrincipalApprovals />} />
              <Route path="content" element={<PrincipalAllContent />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
