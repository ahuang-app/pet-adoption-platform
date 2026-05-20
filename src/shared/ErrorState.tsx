import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

interface Props {
  message: string
  onRetry?: () => void
}

export default function ErrorState({ message, onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
      <p className="text-earth-500 mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>重试</Button>
      )}
    </div>
  )
}
