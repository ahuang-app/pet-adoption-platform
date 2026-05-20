import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/features/auth/useAuth'
import { supabase } from '@/lib/supabase'
import { useQueryClient } from '@tanstack/react-query'
import { Camera } from 'lucide-react'

export default function ProfileSection() {
  const { user } = useAuth()
  const [name, setName] = useState('')
  const [uploading, setUploading] = useState(false)
  const queryClient = useQueryClient()

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setUploading(true)
    const filePath = `${user.id}/${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('avatars').upload(filePath, file)
    if (error) { setUploading(false); return }
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
    await supabase.from('users').update({ avatar_url: data.publicUrl }).eq('id', user.id)
    queryClient.invalidateQueries({ queryKey: ['profile'] })
    setUploading(false)
  }

  const handleNameUpdate = async () => {
    if (!name.trim() || !user) return
    await supabase.from('users').update({ name }).eq('id', user.id)
    setName('')
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-earth-700 mb-4">个人信息</h3>
      <div className="flex items-center gap-6">
        <label className="relative cursor-pointer group">
          <Avatar className="w-20 h-20">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-warm-200 text-warm-600 text-2xl">
              {user?.email?.[0]?.toUpperCase() ?? 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
        </label>
        <div>
          <p className="font-medium text-earth-700">{user?.user_metadata?.name ?? '用户'}</p>
          <p className="text-earth-400 text-sm">{user?.email ?? user?.phone}</p>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="修改昵称" className="flex-1" />
        <Button onClick={handleNameUpdate} size="sm" className="bg-warm-500 hover:bg-warm-600">保存</Button>
      </div>
    </div>
  )
}
