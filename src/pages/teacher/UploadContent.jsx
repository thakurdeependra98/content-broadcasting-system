import { PageHeader } from '@/components/common/PageHeader.jsx'
import { UploadContentForm } from '@/components/forms/UploadContentForm.jsx'

export default function TeacherUpload() {

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
