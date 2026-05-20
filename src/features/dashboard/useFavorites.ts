import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Favorite } from '@/types'

export function useFavorites() {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: async (): Promise<Favorite[]> => {
      const { data, error } = await supabase
        .from('favorites')
        .select('*, pet:pet_id(*)')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as Favorite[]
    },
  })
}

export function useToggleFavorite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ userId, petId, isFavorited }: { userId: string; petId: number; isFavorited: boolean }) => {
      if (isFavorited) {
        await supabase.from('favorites').delete().eq('user_id', userId).eq('pet_id', petId)
      } else {
        await supabase.from('favorites').insert({ user_id: userId, pet_id: petId })
      }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['favorites'] }) },
  })
}
