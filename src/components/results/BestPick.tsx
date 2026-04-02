import { Star } from 'lucide-react'
import { FlightCard } from './FlightCard'
import type { Itinerary } from '@/types/flight'

interface Props {
  itinerary: Itinerary
}

export function BestPick({ itinerary }: Props) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <Star size={14} className="text-amber-500 fill-amber-400" />
        <span className="text-sm font-semibold text-amber-700">Best weekend pick</span>
        <span className="text-xs text-slate-400">— maximises time at destination</span>
      </div>
      <div className="ring-2 ring-amber-300 rounded-xl">
        <FlightCard itinerary={itinerary} />
      </div>
    </div>
  )
}
