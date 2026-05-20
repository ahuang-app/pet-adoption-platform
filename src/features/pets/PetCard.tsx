import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/features/auth/useAuth'
import { useToggleFavorite } from '@/features/dashboard/useFavorites'
import type { Pet } from '@/types'

const sizeLabel: Record<string, string> = { small: '小型', medium: '中型', large: '大型' }

export default function PetCard({ pet, featured }: { pet: Pet; featured?: boolean }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const toggleFavorite = useToggleFavorite()

  const { data: isFavorited } = useQuery({
    queryKey: ['favorites', user?.id, pet.id],
    queryFn: async () => {
      if (!user) return false
      const { data } = await supabase.from('favorites').select('id').eq('user_id', user.id).eq('pet_id', pet.id).single()
      return !!data
    },
    enabled: !!user,
  })

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) { navigate('/login'); return }
    toggleFavorite.mutate({ userId: user.id, petId: pet.id, isFavorited: !!isFavorited })
  }

  return (
    <motion.div
      layoutId={featured ? `pet-${pet.id}` : undefined}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer
                 hover:shadow-[0_12px_40px_rgba(255,156,48,0.2)] transition-shadow duration-300"
    >
      <Link to={`/pets/${pet.id}`}>
        <div className="relative overflow-hidden aspect-[4/3]">
          <motion.img
            src={pet.image_url}
            alt={pet.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          />
          {pet.is_adopted && (
            <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full">已被领养</div>
          )}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 left-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
            title={isFavorited ? '取消收藏' : '收藏'}
          >
            <Heart
              className={`w-5 h-5 transition-colors ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'}`}
            />
          </button>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-earth-700">{pet.name}</h3>
            <span className="text-sm text-earth-400">{pet.age}岁</span>
          </div>
          <p className="text-sm text-earth-400 mt-1">
            {pet.breed?.name ?? pet.species?.name} · {pet.size ? sizeLabel[pet.size] : ''}
          </p>
          <div className="flex gap-2 mt-3 flex-wrap">
            {pet.traits?.slice(0, 3).map((trait) => (
              <span key={trait} className="bg-warm-100 text-warm-700 text-xs px-3 py-1 rounded-full">{trait}</span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
