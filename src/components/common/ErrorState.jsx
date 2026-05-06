import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'

/**
 * @param {{ message: string, onRetry?: () => void }} props
 */
export function ErrorState({ message, onRetry }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center rounded-lg border border-destructive/30 bg-destructive/5 p-8 text-center"
    >
      <AlertCircle className="mb-3 h-10 w-10 text-destructive" aria-hidden />
      <p className="text-sm font-medium text-destructive">{message}</p>
      {onRetry ? (
        <Button type="button" variant="outline" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  )
}
