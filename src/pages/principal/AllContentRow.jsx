import { memo } from 'react'
import {
  TableCell,
  TableRow,
} from '@/components/ui/table.jsx'
import { StatusBadge } from '@/components/common/StatusBadge.jsx'
import { formatDateTime } from '@/utils/formatters.js'

export const AllContentRow = memo(function AllContentRow({ item }) {
  return (
    <TableRow>
      <TableCell className="max-w-[160px]">
        <div className="font-medium leading-tight">{item.title}</div>
        <div className="text-xs text-muted-foreground">{item.subject}</div>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">{item.teacherName}</TableCell>
      <TableCell>
        <StatusBadge status={item.status} item={item} />
      </TableCell>
      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
        {formatDateTime(item.startTime)}
      </TableCell>
      <TableCell className="max-w-[220px] truncate text-xs text-muted-foreground">
        {item.rejectionReason ?? '—'}
      </TableCell>
    </TableRow>
  )
})
