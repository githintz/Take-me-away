import { Slider } from '@/components/ui/Slider'
import type { FlightFilters } from '@/types/filters'

const HARD_MAX = 2000

interface Props {
  priceMin: FlightFilters['priceMin']
  priceMax: FlightFilters['priceMax']
  onChange: (min: number, max: number) => void
}

function priceLabel(v: number): string {
  return v >= HARD_MAX ? 'Any' : `£${v}`
}

export function PriceRangeSlider({ priceMin, priceMax, onChange }: Props) {
  const displayMax = priceMax >= HARD_MAX ? 'Any' : `£${priceMax}`

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-slate-700">Price per person</label>
        <span className="text-sm text-indigo-600 font-semibold tabular-nums">
          £{priceMin} – {displayMax}
        </span>
      </div>
      <Slider
        min={0}
        max={HARD_MAX}
        step={10}
        value={[priceMin, priceMax]}
        onChange={([lo, hi]) => onChange(lo, hi)}
        formatLabel={priceLabel}
      />
      <div className="flex justify-between text-xs text-slate-400 mt-1">
        <span>£0</span>
        <span>Any</span>
      </div>
    </div>
  )
}
