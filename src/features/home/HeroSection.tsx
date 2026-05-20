import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'

export default function HeroSection() {
  const scrollToSearch = () => {
    document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative bg-gradient-to-br from-warm-100 via-warm-50 to-earth-100 py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-warm-200 rounded-full flex items-center justify-center">
            <Heart className="w-12 h-12 text-warm-600 fill-current" />
          </div>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold text-earth-800 mb-4">
          给它们一个<span className="text-warm-500">温暖的家</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-earth-500 mb-8 max-w-2xl mx-auto">
          每只等待领养的小动物都值得被爱。开启你的领养之旅，成为它们生命中最重要的那个人。
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }}
          className="flex gap-4 justify-center">
          <Button size="lg" className="bg-warm-500 hover:bg-warm-600 text-white text-lg px-8 py-6 rounded-xl" onClick={scrollToSearch}>
            寻找小动物
          </Button>
          <Button size="lg" variant="outline" className="border-warm-300 text-warm-600 text-lg px-8 py-6 rounded-xl" onClick={scrollToSearch}>
            了解更多
          </Button>
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-warm-50 to-transparent" />
    </section>
  )
}
