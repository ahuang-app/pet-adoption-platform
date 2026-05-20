import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { usePet } from './usePets'
import LoadingState from '@/shared/LoadingState'
import ErrorState from '@/shared/ErrorState'
import { Heart, Stethoscope, MapPin, PawPrint } from 'lucide-react'

const sizeLabel: Record<string, string> = { small: '小型', medium: '中型', large: '大型' }

export default function PetDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: pet, isLoading, error, refetch } = usePet(id ? Number(id) : undefined)

  if (isLoading) return <div className="max-w-4xl mx-auto px-4 py-16"><LoadingState rows={1} cols={1} /></div>
  if (error || !pet) return <div className="max-w-4xl mx-auto px-4 py-16"><ErrorState message="该宠物不存在" onRetry={refetch} /></div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-20">
      {/* Section 1: Meet Me */}
      <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="grid md:grid-cols-2 gap-8 items-center">
        <motion.img src={pet.image_url} alt={pet.name}
          className="w-full aspect-[4/3] object-cover rounded-3xl shadow-lg"
          whileHover={{ scale: 1.02 }} transition={{ duration: 0.4 }} />
        <div>
          <p className="text-warm-500 font-medium mb-2">认识我 👋</p>
          <h1 className="text-4xl font-bold text-earth-800 mb-4">{pet.name}</h1>
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="bg-warm-100 text-warm-700 px-4 py-2 rounded-full text-sm">{pet.species?.icon} {pet.species?.name}</span>
            <span className="bg-warm-100 text-warm-700 px-4 py-2 rounded-full text-sm">{pet.breed?.name}</span>
            <span className="bg-warm-100 text-warm-700 px-4 py-2 rounded-full text-sm">{pet.age}岁</span>
            <span className="bg-warm-100 text-warm-700 px-4 py-2 rounded-full text-sm">{sizeLabel[pet.size]}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {pet.traits?.map((t) => (
              <span key={t} className="bg-earth-100 text-earth-600 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                <PawPrint className="w-3 h-3" /> {t}
              </span>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Section 2: My Story */}
      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-white rounded-3xl p-8 shadow-sm">
        <p className="text-warm-500 font-medium mb-2">我的故事 📖</p>
        <h2 className="text-2xl font-bold text-earth-700 mb-4">关于{pet.name}</h2>
        <p className="text-earth-500 leading-relaxed text-lg">{pet.description}</p>
      </motion.section>

      {/* Section 3: My Health */}
      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-white rounded-3xl p-8 shadow-sm">
        <p className="text-warm-500 font-medium mb-2">我的健康 🩺</p>
        <h2 className="text-2xl font-bold text-earth-700 mb-4">健康状况</h2>
        <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
          <Stethoscope className="w-8 h-8 text-green-500" />
          <div>
            <p className="font-medium text-green-800">健康状态</p>
            <p className="text-green-600">{pet.health_status}</p>
          </div>
        </div>
      </motion.section>

      {/* Section 4: Take Me Home */}
      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-warm-100 to-warm-50 rounded-3xl p-8 shadow-sm text-center">
        <p className="text-warm-500 font-medium mb-2">如何带我回家 🏡</p>
        <h2 className="text-2xl font-bold text-earth-700 mb-4">领养{pet.name}</h2>
        <div className="flex items-center justify-center gap-2 text-earth-500 mb-6">
          <MapPin className="w-5 h-5" />
          <span>{pet.shelter_info}</span>
        </div>
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button size="lg" className="bg-warm-500 hover:bg-warm-600 text-white text-lg px-10 py-6 rounded-xl"
            onClick={() => navigate(`/adopt/${pet.id}`)}>
            <Heart className="w-5 h-5 mr-2 fill-current" /> 领养它
          </Button>
        </motion.div>
      </motion.section>
    </div>
  )
}
