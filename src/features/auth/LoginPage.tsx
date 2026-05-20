import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { supabase } from '@/lib/supabase'
import { Heart } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) { setError(error.message); return }
    navigate('/dashboard')
  }

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!phone || phone.length < 10) { setError('请输入有效的手机号'); return }
    setLoading(true)
    // Try phone auth first (requires phone provider enabled in Supabase dashboard)
    let { error } = await supabase.auth.signInWithPassword({ phone, password })
    // If phone auth fails, try as email (fallback for when phone provider not enabled)
    if (error) {
      const { error: emailError } = await supabase.auth.signInWithPassword({ email: phone, password })
      if (emailError) { setError('登录失败，请检查手机号/邮箱和密码'); setLoading(false); return }
    }
    setLoading(false)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-6">
          <Heart className="w-10 h-10 text-warm-500 mx-auto fill-current" />
          <h1 className="text-2xl font-bold text-earth-700 mt-3">欢迎回来</h1>
          <p className="text-earth-400 text-sm mt-1">登录你的暖心领养账户</p>
        </div>

        <Tabs defaultValue="email">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="email" className="flex-1">邮箱登录</TabsTrigger>
            <TabsTrigger value="phone" className="flex-1">手机号登录</TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div><Label>邮箱</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required /></div>
              <div><Label>密码</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" required /></div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full bg-warm-500 hover:bg-warm-600" disabled={loading}>{loading ? '登录中...' : '登录'}</Button>
            </form>
          </TabsContent>

          <TabsContent value="phone">
            <form onSubmit={handlePhoneLogin} className="space-y-4">
              <div><Label>手机号</Label><Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="你的手机号" required /></div>
              <div><Label>密码</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" required /></div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full bg-warm-500 hover:bg-warm-600" disabled={loading}>{loading ? '登录中...' : '登录'}</Button>
            </form>
          </TabsContent>
        </Tabs>

        <p className="text-center text-sm text-earth-400 mt-6">
          还没有账户？<Link to="/register" className="text-warm-500 hover:underline">立即注册</Link>
        </p>
      </motion.div>
    </div>
  )
}
