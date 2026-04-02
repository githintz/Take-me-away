import type { FlightFilters } from '@/types/filters'
import { useWeekends } from '@/hooks/useWeekends'

interface Props {
  weekendOffset: FlightFilters['weekendOffset']
  flexibleDates: FlightFilters['flexibleDates']
  onChange: <K extends keyof FlightFilters>(key: K, value: FlightFilters[K]) => void
}

export function DateRangePicker({ weekendOffset, flexibleDates, onChange }: Props) {
  const weekends = useWeekends(8)

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">Weekend</label>
      <select
        value={weekendOffset}
        onChange={e => onChange('weekendOffset', Number(e.target.value))}
        className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-700"
      >
        {weekends.map((w, i) => (
          <option key={w.friday} value={i}>
            {i === 0 ? 'This weekend — ' : i === 1 ? 'Next weekend — ' : ''}
            {w.label}
          </option>
        ))}
      </select>

      <label className="flex items-center gap-2 mt-2 cursor-pointer">
        <input
          type="checkbox"
          checked={flexibleDates}
          onChange={e => onChange('flexibleDates', e.target.checked)}
          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
        />
        <span className="text-sm text-slate-600">Flexible dates (±1 day)</span>
      </label>
    </div>
  )
}
