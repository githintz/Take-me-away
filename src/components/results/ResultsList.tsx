import { FlightCard } from './FlightCard'
import { BestPick } from './BestPick'
import type { Itinerary } from '@/types/flight'

interface Props {
  itineraries: Itinerary[]
  loading: boolean
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex justify-between mb-4">
        <div className="flex gap-2">
          <div className="skeleton h-5 w-24 rounded-full" />
          <div className="skeleton h-5 w-16 rounded-full" />
        </div>
        <div className="skeleton h-7 w-14 rounded" />
      </div>
      <div className="space-y-3">
        <div className="skeleton h-4 w-16 rounded" />
        <div className="flex items-center gap-3">
          <div className="skeleton h-8 w-12 rounded" />
          <div className="skeleton h-2 flex-1 rounded-full" />
          <div className="skeleton h-8 w-12 rounded" />
        </div>
      </div>
      <div className="border-t border-dashed border-slate-100 my-3" />
      <div className="space-y-3">
        <div className="skeleton h-4 w-16 rounded" />
        <div className="flex items-center gap-3">
          <div className="skeleton h-8 w-12 rounded" />
          <div className="skeleton h-2 flex-1 rounded-full" />
          <div className="skeleton h-8 w-12 rounded" />
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <div className="skeleton h-7 w-28 rounded-lg" />
        <div className="skeleton h-7 w-24 rounded-lg" />
        <div className="skeleton h-7 w-16 rounded-lg" />
      </div>
    </div>
  )
}

export function ResultsList({ itineraries, loading }: Props) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (itineraries.length === 0) return null

  const bestWeekend = itineraries.find(it => it.tags.includes('best-weekend'))
  const rest = bestWeekend
    ? itineraries.filter(it => it.id !== bestWeekend.id)
    : itineraries

  return (
    <div className="space-y-3">
      {bestWeekend && <BestPick itinerary={bestWeekend} />}
      {rest.map(it => (
        <FlightCard key={it.id} itinerary={it} />
      ))}
    </div>
  )
}
