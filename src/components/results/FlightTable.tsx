import { ChevronUp, ChevronDown, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import type { Itinerary, SortKey, SortDirection } from '@/types/flight'
import { formatTime, formatDuration, formatShortDate } from '@/utils/dateUtils'

interface Props {
  itineraries: Itinerary[]
  sortKey: SortKey
  sortDir: SortDirection
  onSort: (key: SortKey) => void
}

interface ColDef {
  key: SortKey | null
  label: string
  className?: string
}

const COLUMNS: ColDef[] = [
  { key: null, label: 'Tags', className: 'w-32' },
  { key: 'outbound-departure', label: 'Outbound' },
  { key: 'inbound-departure', label: 'Return' },
  { key: 'duration', label: 'Duration', className: 'w-24' },
  { key: 'stops', label: 'Stops', className: 'w-20' },
  { key: 'price', label: 'Price', className: 'w-24' },
  { key: null, label: 'Book', className: 'w-32' },
]

function SortIcon({ active, dir }: { active: boolean; dir: SortDirection }) {
  if (!active) return <ChevronUp size={12} className="opacity-20" />
  return dir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
}

function LegCell({ leg }: { leg: Itinerary['outbound'] }) {
  const crossesMidnight = leg.arrivalAt.split('T')[0] !== leg.departureAt.split('T')[0]
  return (
    <div>
      <p className="text-sm font-semibold text-slate-800">
        {leg.origin.iata} → {leg.destination.iata}
      </p>
      <p className="text-xs text-slate-500">
        {formatShortDate(leg.departureAt)} · {formatTime(leg.departureAt)} →{' '}
        {formatTime(leg.arrivalAt)}
        {crossesMidnight && <sup className="text-slate-400"> +1</sup>}
      </p>
    </div>
  )
}

export function FlightTable({ itineraries, sortKey, sortDir, onSort }: Props) {
  if (itineraries.length === 0) return null

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            {COLUMNS.map(col => (
              <th
                key={col.label}
                className={[
                  'px-3 py-2.5 text-xs font-semibold text-slate-600 uppercase tracking-wide',
                  col.key ? 'cursor-pointer select-none hover:text-slate-900' : '',
                  col.className ?? '',
                ].join(' ')}
                onClick={col.key ? () => onSort(col.key!) : undefined}
              >
                <span className="flex items-center gap-1">
                  {col.label}
                  {col.key && (
                    <SortIcon active={sortKey === col.key} dir={sortDir} />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {itineraries.map((it, i) => (
            <tr
              key={it.id}
              className={[
                'border-b border-slate-100 last:border-b-0 transition-colors hover:bg-slate-50',
                it.tags.includes('best-weekend') ? 'bg-amber-50/40' : '',
                i % 2 === 0 ? '' : 'bg-slate-50/50',
              ].join(' ')}
            >
              {/* Tags */}
              <td className="px-3 py-2">
                <div className="flex flex-wrap gap-1">
                  {it.tags.includes('best-weekend') && <Badge variant="best-weekend">⭐</Badge>}
                  {it.tags.includes('best-value') && <Badge variant="best-value">£ Best</Badge>}
                  {it.tags.includes('direct') && <Badge variant="direct">Direct</Badge>}
                </div>
              </td>

              {/* Outbound */}
              <td className="px-3 py-2">
                <LegCell leg={it.outbound} />
              </td>

              {/* Inbound */}
              <td className="px-3 py-2">
                <LegCell leg={it.inbound} />
              </td>

              {/* Duration */}
              <td className="px-3 py-2 text-slate-600 text-xs tabular-nums">
                {formatDuration(it.outbound.totalDurationMinutes + it.inbound.totalDurationMinutes)}
              </td>

              {/* Stops */}
              <td className="px-3 py-2 text-xs text-slate-600 tabular-nums">
                {it.outbound.stops + it.inbound.stops === 0
                  ? <span className="text-emerald-700 font-medium">Direct</span>
                  : `${it.outbound.stops + it.inbound.stops} stop${it.outbound.stops + it.inbound.stops !== 1 ? 's' : ''}`}
              </td>

              {/* Price */}
              <td className="px-3 py-2">
                <span className="font-bold text-slate-900">£{it.totalPriceGBP}</span>
              </td>

              {/* Links */}
              <td className="px-3 py-2">
                <div className="flex flex-col gap-1">
                  {it.deepLinks.googleFlights && (
                    <a
                      href={it.deepLinks.googleFlights}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                    >
                      Google <ExternalLink size={10} />
                    </a>
                  )}
                  {it.deepLinks.skyscanner && (
                    <a
                      href={it.deepLinks.skyscanner}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-sky-600 hover:text-sky-800"
                    >
                      Skyscanner <ExternalLink size={10} />
                    </a>
                  )}
                  {it.deepLinks.kiwi && (
                    <a
                      href={it.deepLinks.kiwi}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-orange-600 hover:text-orange-800"
                    >
                      Kiwi <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
