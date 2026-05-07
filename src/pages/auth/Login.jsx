import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
  ArrowRight,
  CalendarCheck2,
  Compass,
  LockKeyhole,
  Radio,
  Sparkles,
  SquareCheckBig,
  UserRound,
} from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { useAuth } from '@/hooks/useAuth.js'
import { loginSchema } from '@/utils/validators.js'
import { ROLES } from '@/utils/constants.js'
import { ThemeToggle } from '@/components/common/ThemeToggle.jsx'

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from ?? '/'

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const fillDemo = (email, password) => {
    form.setValue('email', email, { shouldValidate: true, shouldDirty: true })
    form.setValue('password', password, { shouldValidate: true, shouldDirty: true })
  }

  if (user) {
    if (user.role === ROLES.TEACHER) {
      return <Navigate to="/teacher/dashboard" replace />
    }
    return <Navigate to="/principal/dashboard" replace />
  }

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const u = await login(values)
      toast.success(`Welcome, ${u.name}`)
      if (u.role === ROLES.TEACHER) {
        navigate(from.startsWith('/teacher') ? from : '/teacher/dashboard', {
          replace: true,
        })
      } else {
        navigate(from.startsWith('/principal') ? from : '/principal/dashboard', {
          replace: true,
        })
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Sign in failed')
    }
  })

  return (
    <div className="relative bg-background">
      <div className="absolute right-4 top-4 z-20">
        <ThemeToggle className="border-border/70 bg-background/70 shadow-sm backdrop-blur" />
      </div>
      <div className="grid overflow-hidden h-screen border border-border bg-card shadow-[0_28px_90px_-42px_rgba(29,78,216,0.45)] lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative overflow-hidden bg-primary px-6 py-8 text-primary-foreground sm:px-8 lg:flex lg:flex-col lg:px-10 lg:py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.34),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.16),transparent_28%)]" />
          <div className="absolute -right-8 top-16 h-28 w-28 rounded-full border border-white/20" />
          <div className="absolute -left-10 bottom-16 h-36 w-36 rounded-full bg-white/12 blur-3xl" />
          <div className="relative flex items-center gap-3 text-base font-semibold tracking-wide">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 shadow-lg backdrop-blur">
              <Radio className="h-5 w-5" aria-hidden />
            </span>
            Content Broadcasting
          </div>

          <div className="relative pb-2 sm:pb-4 lg:pb-0 flex flex-col lg:flex-1 lg:justify-center sm:px-10 px-4">
            <h2 className='text-3xl font-thin tracking-widest sm:text-4xl '>Hello,</h2>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-7xl">
              Welcome.
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-primary-foreground/82 sm:text-lg">
              Broadcast classroom content, review approvals, and keep live pages in sync with a clean admin workflow.
            </p>
          </div>
        </section>

        <section className="flex items-center bg-card px-6 py-10 sm:px-8 md:px-12 lg:px-14">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-10 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <Radio className="h-5 w-5" aria-hidden />
              </span>
              Content Broadcasting
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight text-foreground">
                Log In
              </h1>
              <p className="text-sm leading-6 text-muted-foreground sm:text-base">
                Use your school account or sign in with one of the demo credentials below.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border border-border bg-muted/50 p-4 text-sm text-foreground">
              <div className="flex items-center gap-2 font-medium">
                <Sparkles className="h-4 w-4 text-primary" aria-hidden />
                Demo access
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <Button
                  type="button"
                  variant="outline"
                  className="justify-between rounded-xl border-border bg-background px-4"
                  onClick={() => fillDemo('principal@demo.com', 'principal123')}
                >
                  Principal demo
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="justify-between rounded-xl border-border bg-background px-4"
                  onClick={() => fillDemo('teacher@demo.com', 'teacher123')}
                >
                  Teacher demo
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
              </div>
            </div>

            <form onSubmit={onSubmit} className="mt-8 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@school.edu"
                    className="h-11 rounded-xl pl-10"
                    {...form.register('email')}
                  />
                </div>
                {form.formState.errors.email?.message ? (
                  <p className="text-sm text-destructive">
                    {String(form.formState.errors.email.message)}
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    className="h-11 rounded-xl pl-10"
                    {...form.register('password')}
                  />
                </div>
                {form.formState.errors.password?.message ? (
                  <p className="text-sm text-destructive">
                    {String(form.formState.errors.password.message)}
                  </p>
                ) : null}
              </div>

              <Button
                type="submit"
                className="h-11 w-full rounded-xl text-base shadow-lg shadow-primary/20"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'Signing in…' : 'Sign in'}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Public live page:{' '}
                <Link className="font-medium text-primary underline-offset-4 hover:underline" to="/live/teacher-1">
                  /live/teacher-1
                </Link>
              </p>
            </form>
          </div>
        </section>
      </div>
    </div>
  )
}
