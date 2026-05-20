import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/features/auth/useAuth'
import { supabase } from '@/lib/supabase'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import { Camera, Check, AlertCircle } from 'lucide-react'

export default function ProfileSection() {
  const { user } = useAuth()
  const [name, setName] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [nameSuccess, setNameSuccess] = useState(false)
  const queryClient = useQueryClient()

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data } = await supabase.from('users').select('*').eq('id', user!.id).single()
      return data
    },
    enabled: !!user,
  })

  useEffect(() => {
    if (profile?.name) setName(profile.name)
  }, [profile?.name])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setUploading(true)
    setUploadError('')
    setUploadSuccess(false)

    const fileExt = file.name.split('.').pop()
    const filePath = `${user.id}/avatar.${fileExt}`

    const { error } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true })
    if (error) { setUploadError('上传失败: ' + error.message); setUploading(false); return }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
    const publicUrl = data.publicUrl

    const { error: updateError } = await supabase.from('users').update({ avatar_url: publicUrl }).eq('id', user.id)
    if (updateError) { setUploadError('更新头像失败'); setUploading(false); return }

    queryClient.invalidateQueries({ queryKey: ['profile'] })
    setUploadSuccess(true)
    setUploading(false)
    setTimeout(() => setUploadSuccess(false), 3000)
  }

  const handleNameUpdate = async () => {
    if (!name.trim() || !user) return
    const { error } = await supabase.from('users').update({ name: name.trim() }).eq('id', user.id)
    if (error) return
    queryClient.invalidateQueries({ queryKey: ['profile'] })
    setNameSuccess(true)
    setTimeout(() => setNameSuccess(false), 3000)
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-earth-700 mb-4">个人信息</h3>
      <div className="flex items-center gap-6 mb-4">
        <label className="relative cursor-pointer group">
          <Avatar className="w-20 h-20">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-warm-200 text-warm-600 text-2xl">
              {(profile?.name || user?.email)?.[0]?.toUpperCase() ?? 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            {uploading ? (
              <span className="text-white text-xs">上传中...</span>
            ) : (
              <Camera className="w-6 h-6 text-white" />
            )}
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
        </label>
        <div>
          <p className="font-medium text-earth-700">{profile?.name || '用户'}</p>
          <p className="text-earth-400 text-sm">{user?.email || user?.phone}</p>
          {uploadSuccess && <p className="text-green-500 text-xs flex items-center gap-1"><Check className="w-3 h-3" /> 头像已更新</p>}
          {uploadError && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {uploadError}</p>}
        </div>
      </div>
      <div className="flex gap-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="修改昵称" className="flex-1" />
        <Button onClick={handleNameUpdate} size="sm" className="bg-warm-500 hover:bg-warm-600">保存</Button>
      </div>
      {nameSuccess && <p className="text-green-500 text-xs mt-2 flex items-center gap-1"><Check className="w-3 h-3" /> 昵称已更新</p>}
    </div>
  )
}
