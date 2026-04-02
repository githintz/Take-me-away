import { useState, useCallback } from 'react'
import { X, RotateCcw, Bookmark, BookmarkCheck } from 'lucide-react'
import { AirportSelect } from './AirportSelect'
import { DateRangePicker } from './DateRangePicker'
import { DepartureWindowPicker } from './DepartureWindowPicker'
import { PriceRangeSlider } from './PriceRangeSlider'
import { TripOptionsPanel } from './TripOptionsPanel'
import { Button } from '@/components/ui/Button'
import type { FlightFilters } from '@/types/filters'
import type { FilterPreset } from '@/types/presets'
import { searchAirports, getAirport } from '@/utils/airports'

interface Props {
  filters: FlightFilters
  onChange: <K extends keyof FlightFilters>(key: K, value: FlightFilters[K]) => void
  onReset: () => void
  presets: FilterPreset[]
  onLoadPreset: (preset: FilterPreset) => void
  onSavePreset: (name: string, filters: FlightFilters) => void
  onDeletePreset: (id: string) => void
}

export function FilterPanel({
  filters,
  onChange,
  onReset,
  presets,
  onLoadPreset,
  onSavePreset,
  onDeletePreset,
}: Props) {
  const [savingPreset, setSavingPreset] = useState(false)
  const [presetName, setPresetName] = useState('')

  const handleDestinationInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value.trim().toUpperCase()
      onChange('destination', val || 'anywhere')
    },
    [onChange],
  )

  const handleSavePreset = () => {
    const name = presetName.trim()
    if (!name) return
    onSavePreset(name, filters)
    setPresetName('')
    setSavingPreset(false)
  }

  const destDisplay = filters.destination === 'anywhere' ? '' : filters.destination
  const destAirport = getAirport(filters.destination)
  const destSuggestions = destDisplay.length >= 1 ? searchAirports(destDisplay) : []

  return (
    <div className="flex flex-col h-full">
      {/* Preset bar */}
      {presets.length > 0 && (
        <div className="px-4 py-2 border-b border-slate-100 bg-slate-50">
          <p className="text-xs text-slate-500 mb-1.5 font-medium">Saved presets</p>
          <div className="flex flex-wrap gap-1.5">
            {presets.map(p => (
              <div key={p.id} className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => onLoadPreset(p)}
                  className="text-xs bg-white border border-slate-200 text-slate-700 px-2 py-1 rounded-l-md hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors"
                >
                  {p.name}
                </button>
                <button
                  type="button"
                  onClick={() => onDeletePreset(p.id)}
                  className="text-xs bg-white border border-slate-200 border-l-0 text-slate-400 px-1.5 py-1 rounded-r-md hover:bg-red-50 hover:text-red-500 transition-colors"
                  aria-label={`Delete preset ${p.name}`}
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scrollable filters */}
      <div className="flex-1 overflow-y-auto thin-scroll px-4 py-4 space-y-5">
        <AirportSelect
          label="Origin airports"
          selectedIatas={filters.origins}
          onChange={iatas => onChange('origins', iatas)}
        />

        {/* Destination */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Destination</label>
          <div className="flex gap-2 mb-2">
            <button
              type="button"
              onClick={() => onChange('destination', 'anywhere')}
              className={[
                'px-3 py-1.5 text-sm rounded-lg font-medium transition-colors border',
                filters.destination === 'anywhere'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300',
              ].join(' ')}
            >
              Anywhere
            </button>
            {destAirport && (
              <span className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-sm rounded-lg border border-indigo-200">
                <span className="font-bold">{destAirport.iata}</span>
                <span>{destAirport.city}</span>
                <button
                  type="button"
                  onClick={() => onChange('destination', 'anywhere')}
                  className="ml-1 text-indigo-400 hover:text-indigo-700"
                >
                  <X size={12} />
                </button>
              </span>
            )}
          </div>

          {filters.destination === 'anywhere' && (
            <div className="relative">
              <input
                type="text"
                placeholder="Or type a city / airport code…"
                onChange={handleDestinationInput}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {destSuggestions.length > 0 && (
                <div className="absolute z-20 left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
                  {destSuggestions.map(a => (
                    <button
                      key={a.iata}
                      type="button"
                      onMouseDown={e => {
                        e.preventDefault()
                        onChange('destination', a.iata)
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-slate-50"
                    >
                      <span className="font-mono font-bold text-sm text-indigo-700 w-10">{a.iata}</span>
                      <span className="text-sm text-slate-700">{a.city}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <DateRangePicker
          weekendOffset={filters.weekendOffset}
          flexibleDates={filters.flexibleDates}
          onChange={onChange}
        />

        <div className="space-y-4">
          <DepartureWindowPicker
            label="Outbound departure (Fri)"
            window={filters.outboundWindow}
            onChange={w => onChange('outboundWindow', w)}
          />
          <DepartureWindowPicker
            label="Return departure (Sun)"
            window={filters.inboundWindow}
            onChange={w => onChange('inboundWindow', w)}
          />
        </div>

        <PriceRangeSlider
          priceMin={filters.priceMin}
          priceMax={filters.priceMax}
          onChange={(min, max) => {
            onChange('priceMin', min)
            onChange('priceMax', max)
          }}
        />

        <TripOptionsPanel
          maxConnections={filters.maxConnections}
          minLayoverMinutes={filters.minLayoverMinutes}
          maxTotalDurationHours={filters.maxTotalDurationHours}
          cabinClass={filters.cabinClass}
          adults={filters.adults}
          onChange={onChange}
        />
      </div>

      {/* Footer actions */}
      <div className="px-4 py-3 border-t border-slate-100 bg-white space-y-2">
        {savingPreset ? (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Preset name…"
              value={presetName}
              onChange={e => setPresetName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSavePreset() }}
              autoFocus
              className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <Button size="sm" onClick={handleSavePreset}>Save</Button>
            <Button size="sm" variant="ghost" onClick={() => setSavingPreset(false)}>Cancel</Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={onReset} className="flex-1">
              <RotateCcw size={13} />
              Reset
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setSavingPreset(true)} className="flex-1">
              {presets.length > 0 ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
              Save preset
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
