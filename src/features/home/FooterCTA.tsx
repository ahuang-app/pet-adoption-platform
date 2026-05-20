import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function FooterCTA() {
  const navigate = useNavigate()
  return (
    <section className="py-16 bg-gradient-to-r from-warm-500 to-warm-400">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-3xl font-bold text-white mb-4">准备好给它们一个家了吗？</motion.h2>
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-warm-100 text-lg mb-8">
          数以千计的小动物正在等待有爱心的你
        </motion.p>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <Button size="lg" className="bg-white text-warm-600 hover:bg-warm-50 text-lg px-10 py-6 rounded-xl shadow-lg"
            onClick={() => navigate('/search')}>
            开始寻找
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
