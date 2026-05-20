import { Badge } from '@/components/ui/badge'
import type { ApplicationStatus } from '@/types'

const statusConfig: Record<ApplicationStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
  pending: { label: '审核中', variant: 'secondary' },
  approved: { label: '已通过', variant: 'default' },
  rejected: { label: '已拒绝', variant: 'destructive' },
}

export default function StatusBadge({ status }: { status: ApplicationStatus }) {
  const config = statusConfig[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
