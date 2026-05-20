import { motion } from 'framer-motion'
import { Building2 } from 'lucide-react'

const shelters = [
  { name: '阳光动物救助中心', city: '北京' },
  { name: '喵星人救助站', city: '上海' },
  { name: '爱心宠物之家', city: '广州' },
  { name: '小动物保护协会', city: '成都' },
  { name: '流浪天使救助站', city: '深圳' },
  { name: '毛孩儿之家', city: '杭州' },
]

export default function ShelterWall() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-2xl font-bold text-earth-700 text-center mb-8">合作收容所</motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {shelters.map((shelter, i) => (
            <motion.div key={shelter.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center gap-3 p-6 bg-warm-50 rounded-2xl hover:bg-warm-100 transition-colors">
              <Building2 className="w-10 h-10 text-warm-500" />
              <div className="text-center">
                <p className="text-sm font-medium text-earth-700">{shelter.name}</p>
                <p className="text-xs text-earth-400">{shelter.city}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
