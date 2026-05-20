import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { supabase } from '@/lib/supabase'
import { Heart } from 'lucide-react'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { name } },
    })
    if (error) { setError(error.message); setLoading(false); return }
    if (data.user) {
      const { error: profileError } = await supabase.from('users').insert({ id: data.user.id, name, email })
      if (profileError) { setError('创建用户资料失败: ' + profileError.message); setLoading(false); return }
      setSuccess('注册成功！请查收验证邮件')
    }
    setLoading(false)
  }

  const handlePhoneRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      phone, password,
      options: { data: { name } },
    })
    if (error) { setError(error.message); setLoading(false); return }
    if (data.user) {
      await supabase.from('users').insert({ id: data.user.id, name, phone })
      setSuccess('注册成功！')
      setTimeout(() => navigate('/login'), 1500)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-6">
          <Heart className="w-10 h-10 text-warm-500 mx-auto fill-current" />
          <h1 className="text-2xl font-bold text-earth-700 mt-3">加入我们</h1>
          <p className="text-earth-400 text-sm mt-1">创建一个暖心领养账户</p>
        </div>

        <Tabs defaultValue="email">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="email" className="flex-1">邮箱注册</TabsTrigger>
            <TabsTrigger value="phone" className="flex-1">手机号注册</TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            <form onSubmit={handleEmailRegister} className="space-y-4">
              <div><Label>昵称</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="你的昵称" required /></div>
              <div><Label>邮箱</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required /></div>
              <div><Label>密码</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="至少6位" required minLength={6} /></div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">{success}</p>}
              <Button type="submit" className="w-full bg-warm-500 hover:bg-warm-600" disabled={loading}>{loading ? '注册中...' : '注册'}</Button>
            </form>
          </TabsContent>

          <TabsContent value="phone">
            <form onSubmit={handlePhoneRegister} className="space-y-4">
              <div><Label>昵称</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="你的昵称" required /></div>
              <div><Label>手机号</Label><Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="13800138000" required /></div>
              <div><Label>密码</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="至少6位" required minLength={6} /></div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">{success}</p>}
              <Button type="submit" className="w-full bg-warm-500 hover:bg-warm-600" disabled={loading}>{loading ? '注册中...' : '注册'}</Button>
            </form>
          </TabsContent>
        </Tabs>

        <p className="text-center text-sm text-earth-400 mt-6">
          已有账户？<Link to="/login" className="text-warm-500 hover:underline">去登录</Link>
        </p>
      </motion.div>
    </div>
  )
}
