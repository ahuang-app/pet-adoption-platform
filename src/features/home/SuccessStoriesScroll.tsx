import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { SuccessStory } from '@/types'

const fetchStories = async (): Promise<SuccessStory[]> => {
  const { data, error } = await supabase.from('success_stories').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export default function SuccessStoriesScroll() {
  const { data: stories } = useQuery({ queryKey: ['success_stories'], queryFn: fetchStories })
  const ref = useRef<HTMLDivElement>(null)

  return (
    <section className="py-16 bg-warm-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-2xl font-bold text-earth-700 text-center mb-8">成功领养故事</motion.h2>
        <motion.div ref={ref} className="flex gap-6 overflow-x-auto pb-4 cursor-grab active:cursor-grabbing"
          whileTap={{ cursor: 'grabbing' }}>
          {stories?.map((story) => (
            <motion.div key={story.id} drag="x" dragConstraints={ref} dragElastic={0.1}
              className="min-w-[300px] bg-white rounded-2xl shadow-md overflow-hidden flex-shrink-0"
              whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300 }}>
              <div className="flex">
                <img src={story.before_image} alt="之前" className="w-1/2 h-40 object-cover" />
                <img src={story.after_image} alt="之后" className="w-1/2 h-40 object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-earth-700">{story.pet_name}</h3>
                <p className="text-sm text-earth-500 mt-1 line-clamp-2">{story.story_text}</p>
                <p className="text-xs text-warm-500 mt-2">— {story.adopter_name}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
