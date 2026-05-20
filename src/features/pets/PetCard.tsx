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
      className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer
                 shadow-md hover:shadow-[0_16px_48px_rgba(255,156,48,0.18)] transition-shadow duration-300"
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
          {/* Hover gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-warm-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {pet.is_adopted && (
            <div className="absolute top-3 left-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full shadow-md">
              已被领养
            </div>
          )}

          {/* Favorite button - top right with white circle background */}
          <motion.button
            onClick={handleFavoriteClick}
            whileTap={{ scale: 0.85 }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-md
                       flex items-center justify-center hover:bg-white transition-colors z-10"
            title={isFavorited ? '取消收藏' : '收藏'}
          >
            <Heart
              className={`w-4.5 h-4.5 transition-all duration-200 ${
                isFavorited ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-400 hover:text-red-400'
              }`}
            />
          </motion.button>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-earth-700 group-hover:text-warm-600 transition-colors">{pet.name}</h3>
            <span className="text-sm text-earth-400">{pet.age}岁</span>
          </div>
          <p className="text-sm text-earth-400 mt-1">
            {pet.breed?.name ?? pet.species?.name} · {pet.size ? sizeLabel[pet.size] : ''}
          </p>
          <div className="flex gap-2 mt-3 flex-wrap">
            {pet.traits?.slice(0, 3).map((trait) => (
              <span key={trait} className="bg-warm-100 text-warm-700 text-xs px-3 py-1 rounded-full">
                {trait}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
