import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectTrigger } from '@/components/ui/select'
import { SelectItem } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { useSpecies } from '@/features/pets/usePets'
import { useUIStore } from '@/store/ui-store'
import type { PetSize } from '@/types'
import { useState } from 'react'

const sizeLabels: Record<string, string> = { small: '小型', medium: '中型', large: '大型' }

export default function FilterSidebar() {
  const { filters, setFilters, resetFilters } = useUIStore()
  const { data: species } = useSpecies()
  const [ageRange, setAgeRange] = useState<[number, number]>([0, 15])

  const selectedSpecies = species?.find(s => s.id === filters.species_id)
  const speciesDisplay = filters.species_id ? `${selectedSpecies?.icon || ''} ${selectedSpecies?.name || ''}` : '全部物种'
  const sizeDisplay = filters.size ? sizeLabels[filters.size] : '不限'

  return (
    <aside className="w-full md:w-64 bg-white rounded-2xl shadow-sm p-6 space-y-6 h-fit sticky top-24">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-earth-700">筛选条件</h3>
        <Button variant="ghost" size="sm" onClick={resetFilters} className="text-earth-400">重置</Button>
      </div>

      <div>
        <Label>物种</Label>
        <Select value={filters.species_id ? String(filters.species_id) : ''}
          onValueChange={(v) => setFilters({ species_id: v ? Number(v) : undefined })}>
          <SelectTrigger className="mt-1"><span className="text-sm">{speciesDisplay}</span></SelectTrigger>
          <SelectContent>
            <SelectItem value="">全部物种</SelectItem>
            {species?.map((s) => <SelectItem key={s.id} value={String(s.id)}>{s.icon} {s.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>体型</Label>
        <Select value={filters.size || ''} onValueChange={(v) => setFilters({ size: (v as PetSize) || undefined })}>
          <SelectTrigger className="mt-1"><span className="text-sm">{sizeDisplay}</span></SelectTrigger>
          <SelectContent>
            <SelectItem value="">不限</SelectItem>
            <SelectItem value="small">小型</SelectItem>
            <SelectItem value="medium">中型</SelectItem>
            <SelectItem value="large">大型</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>年龄范围：{ageRange[0]} - {ageRange[1]} 岁</Label>
        <Slider className="mt-2" min={0} max={15} step={1} value={ageRange} onValueChange={(v) => {
          const range = v as [number, number]
          setAgeRange(range)
          setFilters({ age_min: range[0], age_max: range[1] })
        }} />
      </div>
    </aside>
  )
}
