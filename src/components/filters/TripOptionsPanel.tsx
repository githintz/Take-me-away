import type { FlightFilters, CabinClass } from '@/types/filters'

interface Props {
  maxConnections: FlightFilters['maxConnections']
  minLayoverMinutes: FlightFilters['minLayoverMinutes']
  maxTotalDurationHours: FlightFilters['maxTotalDurationHours']
  cabinClass: FlightFilters['cabinClass']
  adults: FlightFilters['adults']
  onChange: <K extends keyof FlightFilters>(key: K, value: FlightFilters[K]) => void
}

const cabinOptions: { value: CabinClass; label: string }[] = [
  { value: 'economy', label: 'Economy' },
  { value: 'premium_economy', label: 'Prem. Eco' },
  { value: 'business', label: 'Business' },
  { value: 'first', label: 'First' },
]

function SegmentedButton<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs">
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={[
            'flex-1 py-1.5 px-2 font-medium transition-colors',
            value === opt.value
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-50',
          ].join(' ')}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export function TripOptionsPanel({
  maxConnections,
  minLayoverMinutes,
  maxTotalDurationHours,
  cabinClass,
  adults,
  onChange,
}: Props) {
  return (
    <div className="space-y-4">
      {/* Max stops */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Max stops</label>
        <SegmentedButton
          options={[
            { value: '0', label: 'Direct' },
            { value: '1', label: '1 stop' },
            { value: '2', label: '2+ stops' },
          ]}
          value={String(maxConnections)}
          onChange={v => onChange('maxConnections', Number(v) as FlightFilters['maxConnections'])}
        />
      </div>

      {/* Cabin class */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Cabin class</label>
        <SegmentedButton
          options={cabinOptions}
          value={cabinClass}
          onChange={v => onChange('cabinClass', v)}
        />
      </div>

      {/* Adults + max duration + layover in a grid */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Adults</label>
          <select
            value={adults}
            onChange={e => onChange('adults', Number(e.target.value) as FlightFilters['adults'])}
            className="w-full text-sm border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {[1, 2, 3, 4, 5, 6].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Max duration</label>
          <select
            value={maxTotalDurationHours}
            onChange={e => onChange('maxTotalDurationHours', Number(e.target.value))}
            className="w-full text-sm border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {[2, 3, 4, 5, 6, 8, 12, 24].map(h => (
              <option key={h} value={h}>{h === 24 ? 'Any' : `${h}h`}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Min layover</label>
          <select
            value={minLayoverMinutes}
            onChange={e => onChange('minLayoverMinutes', Number(e.target.value))}
            className="w-full text-sm border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value={30}>30 min</option>
            <option value={45}>45 min</option>
            <option value={60}>1 hour</option>
            <option value={90}>1h 30m</option>
            <option value={120}>2 hours</option>
          </select>
        </div>
      </div>
    </div>
  )
}
