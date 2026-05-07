import { Link, Outlet } from 'react-router-dom'
import { Radio } from 'lucide-react'
import { ErrorBoundary } from '@/components/common/ErrorBoundary.jsx'
import { ThemeToggle } from '@/components/common/ThemeToggle.jsx'

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950/15 via-blue-900/5 to-blue-950/10 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <header className="border-b ">
        <div className="flex h-14 items-center justify-between px-4">
          <Link to="/login" className="flex items-center gap-2 font-semibold">
            <Radio className="h-5 w-5 text-primary" aria-hidden />
            Content Broadcasting System
          </Link>
          <ThemeToggle className="border-border/70 bg-background/70 shadow-sm backdrop-blur" />
        </div>
      </header>
      <main className="relative mx-auto max-w-4xl p-4 md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(29,78,216,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(29,78,216,0.04)_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30 dark:opacity-20" />
        <div className="pointer-events-none absolute -right-16 top-16 h-48 w-48 rounded-full bg-blue-200/30 blur-3xl dark:bg-blue-900/30" />
        <div className="pointer-events-none absolute -left-16 bottom-12 h-56 w-56 rounded-full bg-indigo-200/20 blur-3xl dark:bg-indigo-900/20" />
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  )
}
