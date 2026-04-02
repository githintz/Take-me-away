/** Dual-handle range slider using two overlapping <input type="range"> elements. */

interface SliderProps {
  min: number
  max: number
  step?: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  formatLabel?: (v: number) => string
  className?: string
}

export function Slider({
  min,
  max,
  step = 1,
  value,
  onChange,
  formatLabel,
  className = '',
}: SliderProps) {
  const [low, high] = value
  const range = max - min

  const lowPct = range > 0 ? ((low - min) / range) * 100 : 0
  const highPct = range > 0 ? ((high - min) / range) * 100 : 100

  const handleLow = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Math.min(Number(e.target.value), high - step)
    onChange([v, high])
  }

  const handleHigh = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Math.max(Number(e.target.value), low + step)
    onChange([low, v])
  }

  const label = formatLabel ?? ((v: number) => String(v))

  return (
    <div className={className}>
      <div className="dual-range-container">
        <div className="dual-range-track" />
        <div
          className="dual-range-fill"
          style={{ left: `${lowPct}%`, width: `${highPct - lowPct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={low}
          onChange={handleLow}
          className="dual-range-input"
          aria-label={`Minimum: ${label(low)}`}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={high}
          onChange={handleHigh}
          className="dual-range-input"
          aria-label={`Maximum: ${label(high)}`}
        />
      </div>
    </div>
  )
}
