import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { AdoptionApplication } from '@/types'

export function useApplications() {
  return useQuery({
    queryKey: ['applications'],
    queryFn: async (): Promise<AdoptionApplication[]> => {
      const { data, error } = await supabase
        .from('adoption_applications')
        .select('*, pet:pet_id(*)')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as AdoptionApplication[]
    },
  })
}

export function useSubmitApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (app: { user_id: string; pet_id: number; name: string; phone: string; message: string }) => {
      const { data, error } = await supabase.from('adoption_applications').insert(app).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
  })
}
