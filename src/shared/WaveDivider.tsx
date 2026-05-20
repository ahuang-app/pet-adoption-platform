export default function WaveDivider({ flip = false, color = 'fill-warm-50' }: { flip?: boolean; color?: string }) {
  return (
    <div className={`w-full overflow-hidden leading-none ${flip ? 'rotate-180' : ''}`}>
      <svg
        viewBox="0 0 1440 120"
        className={`w-full h-12 md:h-20 ${color}`}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z" />
      </svg>
    </div>
  )
}
