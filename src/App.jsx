import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/context/AuthContext.jsx'
import { AppRouter } from '@/routes/AppRouter.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
        <Toaster richColors position="top-right"/>
      </AuthProvider>
    </BrowserRouter>
  )
}
