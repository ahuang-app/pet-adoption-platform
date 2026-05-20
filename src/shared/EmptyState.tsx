import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

interface Props {
  message: string
  actionLabel?: string
  actionTo?: string
}

export default function EmptyState({ message, actionLabel, actionTo }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-earth-400 text-lg mb-4">{message}</p>
      {actionLabel && actionTo && (
        <Link to={actionTo}>
          <Button variant="outline" className="border-warm-300 text-warm-600">
            {actionLabel}
          </Button>
        </Link>
      )}
    </div>
  )
}
