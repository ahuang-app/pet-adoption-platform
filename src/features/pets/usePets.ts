import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Pet, PetFilters } from '@/types'

async function fetchPets(filters?: PetFilters): Promise<Pet[]> {
  let query = supabase
    .from('pets')
    .select('*, species:species_id(*), breed:breed_id(*)')
    .eq('is_adopted', false)
    .order('created_at', { ascending: false })

  if (filters?.species_id) query = query.eq('species_id', filters.species_id)
  if (filters?.size) query = query.eq('size', filters.size)
  if (filters?.age_min !== undefined) query = query.gte('age', filters.age_min)
  if (filters?.age_max !== undefined) query = query.lte('age', filters.age_max)

  const { data, error } = await query
  if (error) throw error
  return data as Pet[]
}

export function usePets(filters?: PetFilters) {
  return useQuery({
    queryKey: ['pets', filters],
    queryFn: () => fetchPets(filters),
  })
}

export function usePet(id: number | undefined) {
  return useQuery({
    queryKey: ['pets', id],
    queryFn: async (): Promise<Pet> => {
      const { data, error } = await supabase
        .from('pets')
        .select('*, species:species_id(*), breed:breed_id(*)')
        .eq('id', id)
        .single()
      if (error) throw error
      return data as Pet
    },
    enabled: !!id,
  })
}

export function useSpecies() {
  return useQuery({
    queryKey: ['species'],
    queryFn: async () => {
      const { data, error } = await supabase.from('species').select('*').order('id')
      if (error) throw error
      return data
    },
  })
}

export function useBreeds(speciesId?: number) {
  return useQuery({
    queryKey: ['breeds', speciesId],
    queryFn: async () => {
      let query = supabase.from('breeds').select('*')
      if (speciesId) query = query.eq('species_id', speciesId)
      const { data, error } = await query.order('id')
      if (error) throw error
      return data
    },
    enabled: speciesId !== undefined,
  })
}
