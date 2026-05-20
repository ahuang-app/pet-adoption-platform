import { motion } from 'framer-motion'
import PetCard from './PetCard'
import type { Pet } from '@/types'

export default function PetCardGrid({ pets }: { pets: Pet[] }) {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      {pets.map((pet) => (
        <motion.div key={pet.id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <PetCard pet={pet} />
        </motion.div>
      ))}
    </motion.div>
  )
}
