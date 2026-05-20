import { Link } from 'react-router-dom'
import { useFavorites } from './useFavorites'
import EmptyState from '@/shared/EmptyState'
import LoadingState from '@/shared/LoadingState'

export default function FavoritesList() {
  const { data: favorites, isLoading } = useFavorites()

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-earth-700 mb-4">我的收藏</h3>
      {isLoading && <LoadingState rows={1} cols={2} />}
      {favorites?.length === 0 && <EmptyState message="还没有收藏，去发现小动物吧" actionLabel="去看看" actionTo="/search" />}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {favorites?.map((fav) => (
          <Link key={fav.id} to={`/pets/${fav.pet_id}`}
            className="flex gap-4 p-3 bg-warm-50 rounded-xl hover:bg-warm-100 transition-colors">
            <img src={fav.pet?.image_url} alt={fav.pet?.name} className="w-20 h-20 object-cover rounded-lg" />
            <div>
              <p className="font-medium text-earth-700">{fav.pet?.name}</p>
              <p className="text-sm text-earth-400">{fav.pet?.breed?.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
