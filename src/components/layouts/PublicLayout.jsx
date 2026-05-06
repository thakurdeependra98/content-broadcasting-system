import { Link, Outlet } from 'react-router-dom'
import { Radio } from 'lucide-react'
import { ErrorBoundary } from '@/components/common/ErrorBoundary.jsx'

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link to="/login" className="flex items-center gap-2 font-semibold">
            <Radio className="h-5 w-5 text-primary" aria-hidden />
            Live broadcast
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl p-4 md:p-8">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  )
}
