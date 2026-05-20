import { useAuth } from '@/features/auth/useAuth'
import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProfileSection from './ProfileSection'
import FavoritesList from './FavoritesList'
import ApplicationsList from './ApplicationsList'
import NotificationsPanel from './NotificationsPanel'

export default function DashboardPage() {
  const { user, loading } = useAuth()

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-16 text-center text-earth-400">加载中...</div>
  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-earth-700">我的账户</motion.h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <ProfileSection />
          <FavoritesList />
        </div>
        <div className="space-y-8">
          <NotificationsPanel />
          <ApplicationsList />
        </div>
      </div>
    </div>
  )
}
