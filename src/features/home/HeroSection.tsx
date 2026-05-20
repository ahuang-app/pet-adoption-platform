import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import WaveDivider from '@/shared/WaveDivider'

const pawPrints = [
  { top: '10%', left: '5%', size: 28, delay: 0, duration: 7 },
  { top: '20%', left: '90%', size: 22, delay: 2, duration: 8 },
  { top: '60%', left: '8%', size: 18, delay: 4, duration: 6 },
  { top: '70%', left: '85%', size: 32, delay: 1, duration: 9 },
  { top: '35%', left: '15%', size: 14, delay: 3, duration: 7.5 },
  { top: '50%', left: '92%', size: 20, delay: 5, duration: 8.5 },
]

function PawPrint({ size, style }: { size: number; style: React.CSSProperties }) {
  return (
    <svg
      width={size}
      height={size * 0.85}
      viewBox="0 0 32 27"
      fill="none"
      style={style}
      className="absolute text-warm-300/50"
    >
      <ellipse cx="10" cy="8" rx="4.5" ry="5" fill="currentColor" />
      <ellipse cx="22" cy="8" rx="4.5" ry="5" fill="currentColor" />
      <ellipse cx="6" cy="18" rx="4" ry="4.5" fill="currentColor" />
      <ellipse cx="26" cy="18" rx="4" ry="4.5" fill="currentColor" />
      <ellipse cx="16" cy="16" rx="7" ry="8" fill="currentColor" />
    </svg>
  )
}

export default function HeroSection() {
  const scrollToSearch = () => {
    document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative bg-gradient-to-br from-warm-100 via-warm-50 to-earth-100 py-24 md:py-32 overflow-hidden">
      {/* Floating paw prints */}
      <style>{`
        @keyframes floatPaw {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          25% { transform: translateY(-15px) rotate(5deg); opacity: 0.5; }
          50% { transform: translateY(-5px) rotate(-3deg); opacity: 0.35; }
          75% { transform: translateY(-20px) rotate(4deg); opacity: 0.45; }
        }
      `}</style>
      {pawPrints.map((p, i) => (
        <PawPrint
          key={i}
          size={p.size}
          style={{
            top: p.top,
            left: p.left,
            animation: `floatPaw ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex justify-center mb-6"
        >
          <motion.div
            className="w-24 h-24 bg-warm-200 rounded-full flex items-center justify-center shadow-lg shadow-warm-300/30"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Heart className="w-12 h-12 text-warm-600 fill-current" />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold text-earth-800 mb-4"
        >
          给它们一个<span className="text-warm-500">温暖的家</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-earth-500 mb-8 max-w-2xl mx-auto"
        >
          每只等待领养的小动物都值得被爱。开启你的领养之旅，成为它们生命中最重要的那个人。
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex gap-4 justify-center"
        >
          <Button
            size="lg"
            className="bg-warm-500 hover:bg-warm-600 text-white text-lg px-8 py-6 rounded-xl shadow-lg shadow-warm-500/25 hover:shadow-xl hover:shadow-warm-500/30 transition-all"
            onClick={scrollToSearch}
          >
            寻找小动物
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-warm-300 text-warm-600 text-lg px-8 py-6 rounded-xl hover:bg-warm-50 transition-all"
            onClick={scrollToSearch}
          >
            了解更多
          </Button>
        </motion.div>
      </div>

      {/* Floating decorative emoji elements */}
      {(() => {
        const emojis = ['🐾', '❤️', '🌟', '🐕', '🐈', '🐰', '💕', '✨', '🦴', '🎾', '🏠', '🌺']
        return [...Array(12)].map((_, i) => (
          <motion.div
            key={`emoji-${i}`}
            className="absolute text-2xl opacity-30 pointer-events-none select-none"
            style={{
              left: `${5 + (i * 7.8) % 90}%`,
              top: `${8 + (i * 13.3) % 85}%`,
            }}
            animate={{
              y: [0, -15, -30, -15, 0],
              x: [0, 8, 0, -8, 0],
              rotate: [0, 8, -8, 0],
            }}
            transition={{
              duration: 5 + (i % 5),
              repeat: Infinity,
              delay: i * 0.6,
            }}
          >
            {emojis[i]}
          </motion.div>
        ))
      })()}

      <div className="absolute bottom-0 left-0 right-0">
        <WaveDivider color="fill-white" />
      </div>
    </section>
  )
}
