import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'

const statusStyles = {
  default: {
    card: '',
    title: 'text-muted-foreground',
    icon: 'text-muted-foreground',
    value: 'text-foreground',
  },
  primary: {
    card: 'border-primary/20 bg-primary/8 shadow-[0_12px_30px_-18px_rgba(29,78,216,0.45)]',
    title: 'text-primary/80',
    icon: 'text-primary',
    value: 'text-primary',
  },
  warning: {
    card: 'border-amber-400/25 bg-amber-50 shadow-[0_12px_30px_-18px_rgba(245,158,11,0.35)]',
    title: 'text-amber-700',
    icon: 'text-amber-600',
    value: 'text-amber-700',
  },
  success: {
    card: 'border-emerald-400/25 bg-emerald-50 shadow-[0_12px_30px_-18px_rgba(16,185,129,0.35)]',
    title: 'text-emerald-700',
    icon: 'text-emerald-600',
    value: 'text-emerald-700',
  },
  destructive: {
    card: 'border-rose-400/25 bg-rose-50 shadow-[0_12px_30px_-18px_rgba(244,63,94,0.35)]',
    title: 'text-rose-700',
    icon: 'text-rose-600',
    value: 'text-rose-700',
  },
}

/**
 * @param {{ title: string, value: string | number, hint?: string, icon?: import('react').ReactNode, status?: keyof typeof statusStyles, className?: string }} props
 */
export function StatCard({ title, value, hint, icon, status = 'default', className }) {
  const styles = statusStyles[status] ?? statusStyles.default

  return (
    <Card className={[styles.card, className].filter(Boolean).join(' ')}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className={`text-xl font-normal tracking-wider ${styles.title}`}>
          {title}
        </CardTitle>
        {icon ? <span className={styles.icon}>{icon}</span> : null}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${styles.value}`}>{value}</div>
        {hint ? (
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </CardContent>
    </Card>
  )
}
