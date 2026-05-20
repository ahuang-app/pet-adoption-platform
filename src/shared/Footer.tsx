import { Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-earth-800 text-warm-100 py-12">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart className="w-5 h-5 fill-current text-warm-400" />
          <span className="text-lg font-bold">暖心领养</span>
        </div>
        <p className="text-earth-300 text-sm">每一只小动物都值得一个温暖的家</p>
        <p className="text-earth-400 text-xs mt-4">© 2026 暖心领养平台 · 用爱终止流浪</p>
      </div>
    </footer>
  )
}
