import { useNotifications, useMarkAsRead } from './useNotifications'
import EmptyState from '@/shared/EmptyState'
import LoadingState from '@/shared/LoadingState'
import { Bell, BellRing } from 'lucide-react'
import { motion } from 'framer-motion'

export default function NotificationsPanel() {
  const { data: notifications, isLoading } = useNotifications()
  const markAsRead = useMarkAsRead()

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <BellRing className="w-5 h-5 text-warm-500" />
        <h3 className="font-bold text-earth-700">通知中心</h3>
      </div>
      {isLoading && <LoadingState rows={1} cols={1} />}
      {notifications?.length === 0 && <EmptyState message="暂无通知" />}
      <div className="space-y-2">
        {notifications?.map((n) => (
          <motion.div key={n.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${n.is_read ? 'bg-warm-50' : 'bg-warm-100'}`}
            onClick={() => !n.is_read && markAsRead.mutate(n.id)}>
            {n.is_read ? <Bell className="w-4 h-4 text-earth-400" /> : <BellRing className="w-4 h-4 text-warm-500" />}
            <div className="flex-1">
              <p className={`text-sm ${n.is_read ? 'text-earth-400' : 'text-earth-700 font-medium'}`}>{n.message}</p>
              <p className="text-xs text-earth-400">{new Date(n.created_at).toLocaleDateString('zh-CN')}</p>
            </div>
            {!n.is_read && <span className="w-2 h-2 bg-warm-500 rounded-full" />}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
