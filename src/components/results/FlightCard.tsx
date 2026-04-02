import { ArrowRight, Clock, TrendingDown } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { AggregatorLinks } from './AggregatorLinks'
import type { Itinerary, Leg } from '@/types/flight'
import { formatTime, formatDuration, formatShortDate } from '@/utils/dateUtils'

function LegRow({ leg }: { leg: Leg }) {
  const depDate = leg.departureAt.split('T')[0]!
  const arrDate = leg.arrivalAt.split('T')[0]!
  const crossesMidnight = arrDate > depDate

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* Origin */}
      <div className="text-center min-w-[48px]">
        <p className="text-base font-bold text-slate-900 leading-none">{formatTime(leg.departureAt)}</p>
        <p className="text-xs font-semibold text-indigo-600 mt-0.5">{leg.origin.iata}</p>
      </div>

      {/* Route line */}
      <div className="flex-1 flex flex-col items-center gap-0.5 min-w-0">
        <div className="flex items-center gap-1 w-full">
          <div className="flex-1 h-px bg-slate-200" />
          {leg.stops === 0 ? (
            <ArrowRight size={12} className="text-slate-400 flex-shrink-0" />
          ) : (
            <div className="flex items-center gap-0.5">
              {leg.layovers.map((lv, i) => (
                <span
                  key={i}
                  className="text-xs text-slate-500 flex-shrink-0"
                  title={`${lv.airport.iata} · ${formatDuration(lv.durationMinutes)} layover`}
                >
                  ●
                </span>
              ))}
            </div>
          )}
          <div className="flex-1 h-px bg-slate-200" />
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <Clock size={10} />
          <span>{formatDuration(leg.totalDurationMinutes)}</span>
          {leg.stops > 0 && (
            <span className="text-orange-500">
              · {leg.stops} stop{leg.stops > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Destination */}
      <div className="text-center min-w-[48px]">
        <p className="text-base font-bold text-slate-900 leading-none">
          {formatTime(leg.arrivalAt)}
          {crossesMidnight && <sup className="text-xs text-slate-400 ml-0.5">+1</sup>}
        </p>
        <p className="text-xs font-semibold text-indigo-600 mt-0.5">{leg.destination.iata}</p>
      </div>
    </div>
  )
}

interface Props {
  itinerary: Itinerary
}

export function FlightCard({ itinerary }: Props) {
  const outDate = formatShortDate(itinerary.outbound.departureAt)
  const inDate = formatShortDate(itinerary.inbound.departureAt)
  const carrier = itinerary.outbound.segments[0]?.carrier ?? ''

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 hover:border-slate-300 hover:shadow-sm transition-all">
      {/* Header row: tags + price */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex flex-wrap gap-1.5">
          {itinerary.tags.includes('best-weekend') && (
            <Badge variant="best-weekend">⭐ Best weekend</Badge>
          )}
          {itinerary.tags.includes('best-value') && (
            <Badge variant="best-value">
              <TrendingDown size={10} />
              Best value
            </Badge>
          )}
          {itinerary.tags.includes('fastest') && (
            <Badge variant="fastest">
              <Clock size={10} />
              Fastest
            </Badge>
          )}
          {itinerary.tags.includes('direct') && (
            <Badge variant="direct">Direct</Badge>
          )}
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xl font-bold text-slate-900 leading-none">
            £{itinerary.totalPriceGBP}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">per person</p>
        </div>
      </div>

      {/* Outbound leg */}
      <div className="mb-2">
        <p className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">
          Outbound · {outDate}
        </p>
        <LegRow leg={itinerary.outbound} />
      </div>

      {/* Divider */}
      <div className="border-t border-dashed border-slate-100 my-2.5" />

      {/* Inbound leg */}
      <div className="mb-2">
        <p className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">
          Return · {inDate}
        </p>
        <LegRow leg={itinerary.inbound} />
      </div>

      {/* Footer: carrier + total duration + links */}
      <div className="flex items-center justify-between mt-1 mb-0.5">
        <p className="text-xs text-slate-400">{carrier}</p>
        <p className="text-xs text-slate-400">
          Total travel: {formatDuration(
            itinerary.outbound.totalDurationMinutes + itinerary.inbound.totalDurationMinutes,
          )}
        </p>
      </div>

      <AggregatorLinks deepLinks={itinerary.deepLinks} />
    </div>
  )
}
