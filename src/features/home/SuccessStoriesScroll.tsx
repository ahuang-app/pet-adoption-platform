import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import type { SuccessStory } from '@/types'

const fetchStories = async (): Promise<SuccessStory[]> => {
  const { data, error } = await supabase.from('success_stories').select('*').order('created_at', { ascending: false }).limit(6)
  if (error) throw error
  return data
}

export default function SuccessStoriesScroll() {
  const { data: stories } = useQuery({ queryKey: ['success_stories'], queryFn: fetchStories })

  return (
    <section className="py-16 bg-warm-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-2xl font-bold text-earth-700 text-center mb-8">成功领养故事</motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {stories?.slice(0, 4).map((story, i) => (
            <motion.div key={story.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <Link to={`/stories/${story.id}`}>
                <div className="flex">
                  <img src={story.before_image} alt="之前" className="w-1/2 h-48 object-cover" />
                  <img src={story.after_image} alt="之后" className="w-1/2 h-48 object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-earth-700">{story.pet_name}</h3>
                  <p className="text-sm text-earth-500 mt-2 line-clamp-2">{story.story_text}</p>
                  <p className="text-xs text-warm-500 mt-3">— {story.adopter_name}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        {stories && stories.length > 4 && (
          <div className="text-center">
            <Link to="/stories">
              <Button variant="outline" className="border-warm-400 text-warm-600 hover:bg-warm-50">
                查看更多故事 <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
