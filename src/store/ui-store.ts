import { create } from 'zustand'
import type { PetFilters } from '@/types'

interface UIState {
  filters: PetFilters
  setFilters: (filters: Partial<PetFilters>) => void
  resetFilters: () => void
  unreadCount: number
  setUnreadCount: (count: number) => void
}

const defaultFilters: PetFilters = {}

export const useUIStore = create<UIState>((set) => ({
  filters: defaultFilters,
  setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters } })),
  resetFilters: () => set({ filters: defaultFilters }),
  unreadCount: 0,
  setUnreadCount: (count) => set({ unreadCount: count }),
}))
