import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import FilterSidebar from './FilterSidebar'
import PetCardGrid from '@/features/pets/PetCardGrid'
import { usePets } from '@/features/pets/usePets'
import { useUIStore } from '@/store/ui-store'
import LoadingState from '@/shared/LoadingState'
import ErrorState from '@/shared/ErrorState'
import EmptyState from '@/shared/EmptyState'

export default function SearchPage() {
  const { filters, setFilters } = useUIStore()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const speciesId = searchParams.get('species_id')
    const size = searchParams.get('size')
    if (speciesId) setFilters({ species_id: Number(speciesId) })
    if (size) setFilters({ size: size as any })
  }, [searchParams])

  const { data: pets, isLoading, error, refetch } = usePets(filters)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-earth-700 mb-8">发现小伙伴</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <FilterSidebar />
        <div className="flex-1">
          {isLoading && <LoadingState rows={2} cols={3} />}
          {error && <ErrorState message="搜索失败" onRetry={() => refetch()} />}
          {pets && pets.length === 0 && <EmptyState message="没有匹配的宠物，试试其他筛选条件" actionLabel="清除筛选" actionTo="/search" />}
          {pets && pets.length > 0 && <PetCardGrid pets={pets} />}
        </div>
      </div>
    </div>
  )
}
