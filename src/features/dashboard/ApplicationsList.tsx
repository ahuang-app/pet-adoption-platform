import { useApplications } from '@/features/adoption/useApplications'
import StatusBadge from '@/shared/StatusBadge'
import EmptyState from '@/shared/EmptyState'
import LoadingState from '@/shared/LoadingState'

export default function ApplicationsList() {
  const { data: applications, isLoading } = useApplications()

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-earth-700 mb-4">领养申请记录</h3>
      {isLoading && <LoadingState rows={1} cols={1} />}
      {applications?.length === 0 && <EmptyState message="还没有领养申请" actionLabel="去发现小动物" actionTo="/search" />}
      <div className="space-y-3">
        {applications?.map((app) => (
          <div key={app.id} className="flex items-center justify-between p-4 bg-warm-50 rounded-xl">
            <div>
              <p className="font-medium text-earth-700">{app.pet?.name}</p>
              <p className="text-sm text-earth-400">{new Date(app.created_at).toLocaleDateString('zh-CN')}</p>
            </div>
            <StatusBadge status={app.status} />
          </div>
        ))}
      </div>
    </div>
  )
}
