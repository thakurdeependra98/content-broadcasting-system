import { Link, NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  LogOut,
  Radio,
  Upload,
  ListChecks,
  Layers,
  ClipboardList,
} from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.jsx'
import { ROLES } from '@/utils/constants.js'
import { useAuth } from '@/hooks/useAuth.js'
import { ErrorBoundary } from '@/components/common/ErrorBoundary.jsx'
import { ThemeToggle } from '@/components/common/ThemeToggle.jsx'

const teacherNav = [
  { to: '/teacher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/teacher/upload', label: 'Upload', icon: Upload },
  { to: '/teacher/my-content', label: 'My Content', icon: Layers },
]

const principalNav = [
  { to: '/principal/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/principal/approvals', label: 'Approvals', icon: ClipboardList },
  { to: '/principal/content', label: 'All Content', icon: ListChecks },
]

export function AppLayout() {
  const { user, logout } = useAuth()
  const links = user?.role === ROLES.PRINCIPAL ? principalNav : teacherNav
  const home = user?.role === ROLES.PRINCIPAL ? '/principal/dashboard' : '/teacher/dashboard'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950/15 via-blue-900/5 to-blue-950/10 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="flex min-h-screen">
        <aside className="sticky top-0 left-0 h-screen hidden w-72 shrink-0 overflow-y-auto border-r border-white/10 bg-primary text-primary-foreground shadow-[0_0_0_1px_rgba(255,255,255,0.05),_24px_0_60px_rgba(29,78,216,0.22)] md:flex md:flex-col">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.34),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.16),transparent_28%)]" />
          <div className="absolute -right-8 top-16 h-28 w-28 rounded-full border border-white/20" />
          <div className="absolute -left-10 bottom-16 h-36 w-36 rounded-full bg-white/12 blur-3xl" />
          <div className="relative border-b border-white/10 px-5 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 shadow-lg backdrop-blur">
                <Radio className="h-5 w-5" aria-hidden />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold tracking-[0.24em] uppercase">
                  CBS
                </div>
                <div className="truncate text-sm text-primary-foreground/82">Content Broadcasting System</div>
              </div>
            </div>
          </div>
          <nav className="relative flex flex-1 flex-col gap-2 px-4 py-5">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'border-white/25 bg-white/15 text-white shadow-lg shadow-white/10'
                      : 'border-transparent text-primary-foreground/82 hover:border-white/15 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 transition-colors group-hover:bg-white/20">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span className="flex-1">{label}</span>
                <span className="h-2 w-2 rounded-full bg-transparent transition-colors group-hover:bg-white" />
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(29,78,216,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(29,78,216,0.06)_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-60 dark:opacity-20" />
          <div className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-900/30" />
          <div className="pointer-events-none absolute -left-24 bottom-16 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-900/20" />

          <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-blue-200/60 bg-gradient-to-r from-blue-50 to-indigo-50/90 px-4 shadow-[0_8px_30px_rgba(29,78,216,0.08)] backdrop-blur-xl supports-[backdrop-filter]:bg-blue-50/60">
            <div className="flex items-center gap-2 md:hidden">
              <Radio className="h-5 w-5 text-primary" aria-hidden />
              <span className="font-semibold">CBS</span>
            </div>
            <div className="hidden md:block" />
            <div className="flex items-center gap-2">
              <ThemeToggle className="border-border/70 bg-background/70 shadow-sm backdrop-blur" />
              <Button variant="outline" size="sm" asChild className="border-border/70 bg-background/70 backdrop-blur md:hidden">
                <Link to={home}>Menu</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="max-w-[200px] truncate border-border/70 bg-background/70 shadow-sm backdrop-blur"
                  >
                    {user?.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 border-border/60 bg-background/95 shadow-xl backdrop-blur-xl">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-2">
                      <span className="text-base font-medium leading-none">{user?.name}</span>
                      <span className="text-sm leading-none text-muted-foreground">
                        {user?.email}
                      </span>
                      <span className="text-sm capitalize text-muted-foreground">
                        {user?.role}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="relative flex-1 p-4 pb-24 md:p-8 md:pb-8">
            <div className="relative mx-auto max-w-6xl">
              <ErrorBoundary>
                <Outlet />
              </ErrorBoundary>
            </div>
          </main>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-border/60 bg-background/80 p-2 backdrop-blur-xl md:hidden">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl py-2 text-[10px] font-medium transition-all ${
                isActive
                  ? 'bg-primary/10 text-primary shadow-sm'
                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
              }`
            }
          >
            <Icon className="h-4 w-4" aria-hidden />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
