import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import LoadingState from '@/shared/LoadingState'
import ErrorState from '@/shared/ErrorState'
import { ArrowLeft, Heart } from 'lucide-react'
import type { SuccessStory } from '@/types'

const fetchStory = async (id: number): Promise<SuccessStory> => {
  const { data, error } = await supabase
    .from('success_stories')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export default function SuccessStoryDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const storyId = id ? Number(id) : undefined

  const { data: story, isLoading, error, refetch } = useQuery({
    queryKey: ['success_story', storyId],
    queryFn: () => fetchStory(storyId!),
    enabled: !!storyId,
  })

  if (isLoading) return <div className="max-w-4xl mx-auto px-4 py-16"><LoadingState rows={1} cols={1} /></div>
  if (error || !story) return <div className="max-w-4xl mx-auto px-4 py-16"><ErrorState message="该故事不存在" onRetry={refetch} /></div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Button variant="ghost" className="text-earth-500 hover:text-earth-700 mb-6 pl-0" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5 mr-2" /> 返回
        </Button>
      </motion.div>

      {/* Section 1: Before & After */}
      <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <p className="text-warm-500 font-medium text-center">救助前</p>
          <motion.img src={story.before_image} alt={`${story.pet_name} 救助前`}
            className="w-full aspect-[4/3] object-cover rounded-3xl shadow-lg"
            whileHover={{ scale: 1.02 }} transition={{ duration: 0.4 }} />
        </div>
        <div className="space-y-3">
          <p className="text-warm-500 font-medium text-center">现在</p>
          <motion.img src={story.after_image} alt={`${story.pet_name} 现在`}
            className="w-full aspect-[4/3] object-cover rounded-3xl shadow-lg"
            whileHover={{ scale: 1.02 }} transition={{ duration: 0.4 }} />
        </div>
      </motion.section>

      {/* Section 2: Story Title */}
      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="text-center">
        <h1 className="text-4xl font-bold text-earth-800 mb-2">{story.pet_name}</h1>
        <p className="text-lg text-warm-500">领养人：{story.adopter_name}</p>
      </motion.section>

      {/* Section 3: Full Story */}
      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-white rounded-3xl p-8 shadow-sm">
        <p className="text-warm-500 font-medium mb-2">完整故事</p>
        <h2 className="text-2xl font-bold text-earth-700 mb-6">{story.pet_name}的故事</h2>
        <div className="text-earth-500 leading-relaxed text-lg whitespace-pre-line">
          {story.story_text}
        </div>
      </motion.section>

      {/* Section 4: CTA */}
      <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-gradient-to-br from-warm-100 to-warm-50 rounded-3xl p-8 shadow-sm text-center">
        <h2 className="text-2xl font-bold text-earth-700 mb-4">您也可以成为下一个故事的主人公</h2>
        <p className="text-earth-500 mb-6">每一只等待领养的宠物，都在期盼一个温暖的家。</p>
        <motion.div whileTap={{ scale: 0.95 }}>
          <Button size="lg" className="bg-warm-500 hover:bg-warm-600 text-white text-lg px-10 py-6 rounded-xl"
            onClick={() => navigate('/search')}>
            <Heart className="w-5 h-5 mr-2 fill-current" /> 去看看待领养的宠物
          </Button>
        </motion.div>
      </motion.section>
    </div>
  )
}
