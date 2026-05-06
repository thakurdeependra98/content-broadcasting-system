import { Inbox } from 'lucide-react'

/**
 * @param {{ title: string, description?: string, action?: import('react').ReactNode }} props
 */
export function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
      <Inbox className="mb-4 h-10 w-10 text-muted-foreground" aria-hidden />
      <h3 className="text-lg font-semibold">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}
