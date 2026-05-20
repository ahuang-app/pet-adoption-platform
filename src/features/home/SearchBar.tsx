import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useUIStore } from '@/store/ui-store'
import { useSpecies } from '@/features/pets/usePets'
import type { PetSize } from '@/types'
import { Search } from 'lucide-react'

export default function SearchBar() {
  const { filters, setFilters } = useUIStore()
  const { data: species } = useSpecies()
  const navigate = useNavigate()

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (filters.species_id) params.set('species_id', String(filters.species_id))
    if (filters.size) params.set('size', filters.size)
    navigate(`/search?${params.toString()}`)
  }

  return (
    <section id="search-section" className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-earth-700 text-center mb-8">寻找你的小伙伴</h2>
        <div className="flex flex-wrap gap-4 items-end justify-center">
          <div className="w-40">
            <label className="text-sm text-earth-500 mb-1 block">物种</label>
            <Select value={filters.species_id ? String(filters.species_id) : ''}
              onValueChange={(v) => setFilters({ species_id: v ? Number(v) : undefined })}>
              <SelectTrigger><SelectValue placeholder="全部物种" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">全部物种</SelectItem>
                {species?.map((s) => <SelectItem key={s.id} value={String(s.id)}>{s.icon} {s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="w-32">
            <label className="text-sm text-earth-500 mb-1 block">体型</label>
            <Select value={filters.size || ''} onValueChange={(v) => setFilters({ size: (v as PetSize) || undefined })}>
              <SelectTrigger><SelectValue placeholder="不限" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">不限</SelectItem>
                <SelectItem value="small">小型</SelectItem>
                <SelectItem value="medium">中型</SelectItem>
                <SelectItem value="large">大型</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSearch} className="bg-warm-500 hover:bg-warm-600">
            <Search className="w-4 h-4 mr-2" /> 搜索
          </Button>
        </div>
      </div>
    </section>
  )
}
