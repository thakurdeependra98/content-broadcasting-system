import { memo } from 'react'
import {
  TableCell,
  TableRow,
} from '@/components/ui/table.jsx'
import { StatusBadge } from '@/components/common/StatusBadge.jsx'
import { FilePreview } from '@/components/common/FilePreview.jsx'
import { formatDateTime, formatFileSize } from '@/utils/formatters.js'

export const MyContentRow = memo(function MyContentRow({ item }) {
  return (
    <TableRow>
      <TableCell className="max-w-[140px]">
        <div className="font-medium leading-tight">{item.title}</div>
        <div className="text-xs text-muted-foreground">{item.subject}</div>
      </TableCell>
      <TableCell>
        <FilePreview src={item.fileDataUrl} alt={item.title} className="max-w-[120px]" />
      </TableCell>
      <TableCell>
        <StatusBadge status={item.status} item={item} />
      </TableCell>
      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
        <div>{formatDateTime(item.startTime)}</div>
        <div>→ {formatDateTime(item.endTime)}</div>
      </TableCell>
      <TableCell className="max-w-[200px] text-xs text-muted-foreground">
        {item.status === 'rejected' && item.rejectionReason
          ? item.rejectionReason
          : '—'}
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">
        {formatFileSize(item.fileSize)}
      </TableCell>
    </TableRow>
  )
})
