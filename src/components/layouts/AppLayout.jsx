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
    <div className="min-h-screen bg-muted/30">
      <div className="flex min-h-screen">
        <aside className="hidden w-60 shrink-0 border-r bg-card md:flex md:flex-col">
          <div className="flex h-14 items-center gap-2 border-b px-4">
            <Radio className="h-6 w-6 text-primary" aria-hidden />
            <span className="font-semibold">CBS</span>
          </div>
          <nav className="flex flex-1 flex-col gap-1 p-3">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                    isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                  }`
                }
              >
                <Icon className="h-4 w-4" aria-hidden />
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="border-t p-3 text-xs text-muted-foreground">
            Content Broadcasting System
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div className="flex items-center gap-2 md:hidden">
              <Radio className="h-5 w-5 text-primary" aria-hidden />
              <span className="font-semibold">CBS</span>
            </div>
            <div className="hidden md:block" />
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild className="md:hidden">
                <Link to={home}>Menu</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="max-w-[200px] truncate">
                    {user?.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium leading-none">{user?.name}</span>
                      <span className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </span>
                      <span className="text-xs capitalize text-muted-foreground">
                        {user?.role}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 p-4 pb-24 md:p-8 md:pb-8">
            <div className="mx-auto max-w-6xl">
              <ErrorBoundary>
                <Outlet />
              </ErrorBoundary>
            </div>
          </main>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t bg-background/95 p-2 md:hidden">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center justify-center gap-1 rounded-md py-2 text-[10px] font-medium ${
                isActive ? 'text-primary' : 'text-muted-foreground'
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
