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
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-warm-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-warm-600 hover:text-warm-700 transition-colors">
          <Heart className="w-7 h-7 fill-current" />
          <span className="text-xl font-bold">暖心领养</span>
        </Link>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/search')}>
            <Search className="w-5 h-5" />
          </Button>

          {user ? (
            <>
              <Button variant="ghost" size="icon" className="relative" onClick={() => navigate('/dashboard')}>
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
                <User className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="w-4 h-4 mr-1" /> 退出
              </Button>
            </>
          ) : (
            <Button variant="default" size="sm" className="bg-warm-500 hover:bg-warm-600" onClick={() => navigate('/login')}>
              登录
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
