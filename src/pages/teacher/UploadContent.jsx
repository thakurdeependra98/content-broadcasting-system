import { useEffect } from 'react'
import { PageHeader } from '@/components/common/PageHeader.jsx'
import { UploadContentForm } from '@/components/forms/UploadContentForm.jsx'

export default function TeacherUpload() {
  useEffect(() => {
    document.title = 'Teacher — Upload'
  }, [])

  return (
    <div>
      <PageHeader
        title="Upload content"
        description="Submit subject-based material for principal approval."
      />
      <UploadContentForm />
    </div>
  )
}
