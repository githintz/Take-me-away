import { Plane, SearchX, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Props {
  status: 'empty' | 'error'
  error?: string | null
  onReset?: () => void
  onRetry?: () => void
}

export function EmptyState({ status, error, onReset, onRetry }: Props) {
  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <AlertCircle size={28} className="text-red-500" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-1">Something went wrong</h3>
        <p className="text-sm text-slate-500 mb-5 max-w-sm">
          {error ?? 'Unable to load flights. Please try again.'}
        </p>
        {onRetry && (
          <Button variant="secondary" onClick={onRetry}>
            Try again
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="relative mb-5">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
          <Plane size={30} className="text-slate-300" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
          <SearchX size={16} className="text-slate-400" />
        </div>
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">No flights found</h3>
      <p className="text-sm text-slate-500 mb-5 max-w-xs">
        Try widening your departure windows, increasing the max duration, or choosing a different weekend.
      </p>
      {onReset && (
        <Button variant="secondary" onClick={onReset}>
          Reset filters
        </Button>
      )}
    </div>
  )
}
