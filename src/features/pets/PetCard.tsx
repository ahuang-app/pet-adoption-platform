import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Pet } from '@/types'

const sizeLabel: Record<string, string> = { small: '小型', medium: '中型', large: '大型' }

export default function PetCard({ pet, featured }: { pet: Pet; featured?: boolean }) {
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
