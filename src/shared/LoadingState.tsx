export default function LoadingState({ rows = 2, cols = 3 }: { rows?: number; cols?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: rows * cols }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-4 space-y-3">
          <div className="bg-warm-100 rounded-xl h-48" />
          <div className="h-4 bg-warm-100 rounded w-3/4" />
          <div className="h-3 bg-warm-100 rounded w-1/2" />
        </div>
      ))}
    </div>
  )
}
