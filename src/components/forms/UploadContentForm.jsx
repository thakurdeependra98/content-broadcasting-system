import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.jsx'
import { FilePreview } from '@/components/common/FilePreview.jsx'
import { SUBJECTS } from '@/utils/constants.js'
import { uploadContentSchema, validateUploadFile } from '@/utils/validators.js'
import { fileToDataUrl } from '@/utils/fileUtils.js'
import { useContentUpload } from '@/hooks/useContentUpload.js'

export function UploadContentForm() {
  const { submit, loading: uploading } = useContentUpload()
  const [file, setFile] = useState(/** @type {File | null} */ (null))
  const [preview, setPreview] = useState('')
  const form = useForm({
    resolver: zodResolver(uploadContentSchema),
    defaultValues: {
      title: '',
      subject: SUBJECTS[0],
      description: '',
      startTime: '',
      endTime: '',
      rotationDuration: 10,
    },
  })

  const onPickFile = async (e) => {
    const f = e.target.files?.[0] ?? null
    const v = validateUploadFile(f)
    if (!v.ok) {
      toast.error(v.message)
      setFile(null)
      setPreview('')
      e.target.value = ''
      return
    }
    setFile(f)
    try {
      const url = await fileToDataUrl(f)
      setPreview(url)
    } catch {
      toast.error('Could not preview file')
      setPreview('')
    }
  }

  const onSubmit = form.handleSubmit(async (values) => {
    const v = validateUploadFile(file)
    if (!v.ok) {
      toast.error(v.message)
      return
    }
    try {
      const fileDataUrl = preview || (await fileToDataUrl(file))
      await submit({
        title: values.title,
        subject: values.subject,
        description: values.description,
        startTime: new Date(values.startTime).toISOString(),
        endTime: new Date(values.endTime).toISOString(),
        rotationDuration: values.rotationDuration,
        fileDataUrl,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      })
      toast.success('Content submitted for approval')
      form.reset({
        title: '',
        subject: SUBJECTS[0],
        description: '',
        startTime: '',
        endTime: '',
        rotationDuration: 10,
      })
      setFile(null)
      setPreview('')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    }
  })

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" placeholder="Lesson title" {...form.register('title')} />
        {form.formState.errors.title?.message ? (
          <p className="text-sm text-destructive">
            {String(form.formState.errors.title.message)}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label>Subject</Label>
        <Controller
          name="subject"
          control={form.control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(v) => {
                field.onChange(v)
                void form.trigger('subject')
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {form.formState.errors.subject?.message ? (
          <p className="text-sm text-destructive">
            {String(form.formState.errors.subject.message)}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input id="description" placeholder="Optional" {...form.register('description')} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">File (JPG, PNG, GIF — max 10MB)</Label>
        <Input id="file" type="file" accept="image/jpeg,image/png,image/gif" onChange={onPickFile} />
        {file ? (
          <p className="text-xs text-muted-foreground">
            Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </p>
        ) : null}
        {preview ? <FilePreview src={preview} alt="Upload preview" className="mt-2" /> : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startTime">Start time</Label>
          <Input id="startTime" type="datetime-local" {...form.register('startTime')} />
          {form.formState.errors.startTime?.message ? (
            <p className="text-sm text-destructive">
              {String(form.formState.errors.startTime.message)}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime">End time</Label>
          <Input id="endTime" type="datetime-local" {...form.register('endTime')} />
          {form.formState.errors.endTime?.message ? (
            <p className="text-sm text-destructive">
              {String(form.formState.errors.endTime.message)}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="rotation">Rotation duration (seconds)</Label>
        <Input
          id="rotation"
          type="number"
          min={1}
          {...form.register('rotationDuration', { valueAsNumber: true })}
        />
        {form.formState.errors.rotationDuration?.message ? (
          <p className="text-sm text-destructive">
            {String(form.formState.errors.rotationDuration.message)}
          </p>
        ) : null}
      </div>

      <Button type="submit" disabled={form.formState.isSubmitting || uploading}>
        {form.formState.isSubmitting || uploading ? 'Uploading…' : 'Submit for approval'}
      </Button>
    </form>
  )
}
