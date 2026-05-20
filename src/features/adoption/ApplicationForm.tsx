import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useSubmitApplication } from './useApplications'
import { useAuth } from '@/features/auth/useAuth'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

interface Props { petId: number; petName: string }

export default function ApplicationForm({ petId, petName }: Props) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const mutation = useSubmitApplication()

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-earth-500 mb-4">请先登录后提交领养申请</p>
        <Button className="bg-warm-500 hover:bg-warm-600" onClick={() => navigate('/login')}>去登录</Button>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim() || !phone.trim()) { setError('请填写必填项'); return }

    const { data: profile } = await supabase.from('users').select('id').eq('id', user.id).single()
    if (!profile) {
      const { error: insertError } = await supabase.from('users').insert({
        id: user.id,
        name: user.user_metadata?.name || name,
        email: user.email,
        phone: user.phone || phone,
      })
      if (insertError) { setError('创建用户资料失败: ' + insertError.message); return }
    }

    mutation.mutate(
      { user_id: user.id, pet_id: petId, name, phone, message },
      {
        onSuccess: () => navigate('/dashboard'),
        onError: (err) => setError(err.message),
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-earth-700 mb-1">领养申请 — {petName}</h3>
        <p className="text-earth-400 text-sm">填写以下信息，我们将尽快联系你</p>
      </div>
      <div><Label>姓名 *</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="你的真实姓名" required /></div>
      <div><Label>手机号 *</Label><Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="方便联系你的号码" required /></div>
      <div><Label>留言</Label><Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="告诉我们你为什么想领养它..." rows={4} /></div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button type="submit" className="w-full bg-warm-500 hover:bg-warm-600" disabled={mutation.isPending}>
        {mutation.isPending ? '提交中...' : '提交申请'}
      </Button>
    </form>
  )
}
