import { useEffect } from 'react'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useUIStore } from '@/store/ui-store'
import type { Notification } from '@/types'

export function useNotifications() {
  const setUnreadCount = useUIStore((s) => s.setUnreadCount)
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['notifications'],
    queryFn: async (): Promise<Notification[]> => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*, application:application_id(*)')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Notification[]
    },
  })

  useEffect(() => {
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, () => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] })
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'notifications' }, () => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] })
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [queryClient])

  useEffect(() => {
    if (query.data) setUnreadCount(query.data.filter((n) => !n.is_read).length)
  }, [query.data, setUnreadCount])

  return query
}

export function useMarkAsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await supabase.from('notifications').update({ is_read: true }).eq('id', id)
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['notifications'] }) },
  })
}
