import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { rejectReasonSchema } from '@/utils/validators.js'

/**
 * @param {{
 *   open: boolean,
 *   onOpenChange: (open: boolean) => void,
 *   title?: string,
 *   onConfirm: (reason: string) => Promise<void> | void,
 * }} props
 */
export function RejectModal({ open, onOpenChange, title, onConfirm }) {
  const form = useForm({
    resolver: zodResolver(rejectReasonSchema),
    defaultValues: { reason: '' },
  })

  const handleSubmit = form.handleSubmit(async (values) => {
    await onConfirm(values.reason)
    form.reset()
    onOpenChange(false)
  })

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) form.reset()
        onOpenChange(v)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title ?? 'Reject content'}</DialogTitle>
          <DialogDescription>
            A reason is required so the teacher can improve the submission.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reject-reason">Reason</Label>
            <Input
              id="reject-reason"
              placeholder="Explain why this is rejected"
              {...form.register('reason')}
            />
            {form.formState.errors.reason?.message ? (
              <p className="text-sm text-destructive">
                {String(form.formState.errors.reason.message)}
              </p>
            ) : null}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Rejecting…' : 'Reject'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
