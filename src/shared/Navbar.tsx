import { Link, useNavigate } from 'react-router-dom'
import { Heart, Search, User, LogOut, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/useAuth'
import { useUIStore } from '@/store/ui-store'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const unreadCount = useUIStore((s) => s.unreadCount)
  const navigate = useNavigate()

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-warm-50 via-white to-warm-50/80 backdrop-blur-md border-b border-warm-100/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-warm-500 rounded-xl flex items-center justify-center shadow-sm shadow-warm-500/30 group-hover:shadow-md group-hover:shadow-warm-500/40 transition-shadow">
            <Heart className="w-5 h-5 text-white fill-current" />
          </div>
          <span className="text-xl font-bold text-earth-700 group-hover:text-warm-600 transition-colors">
            暖心领养
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/search')} className="hover:bg-warm-100/50">
            <Search className="w-5 h-5 text-earth-500" />
          </Button>

          {user ? (
            <>
              <Button variant="ghost" size="icon" className="relative hover:bg-warm-100/50" onClick={() => navigate('/dashboard')}>
                <Bell className="w-5 h-5 text-earth-500" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="hover:bg-warm-100/50">
                <User className="w-5 h-5 text-earth-500" />
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut} className="text-earth-500 hover:text-earth-700">
                <LogOut className="w-4 h-4 mr-1" /> 退出
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              size="sm"
              className="bg-warm-500 hover:bg-warm-600 shadow-sm shadow-warm-500/25 hover:shadow-md hover:shadow-warm-500/30 transition-all"
              onClick={() => navigate('/login')}
            >
              登录
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
