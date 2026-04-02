import { Slider } from '@/components/ui/Slider'
import type { TimeWindow } from '@/types/filters'
import { hourLabel } from '@/utils/dateUtils'

interface Props {
  label: string
  window: TimeWindow
  onChange: (w: TimeWindow) => void
}

export function DepartureWindowPicker({ label, window, onChange }: Props) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <span className="text-sm text-indigo-600 font-semibold tabular-nums">
          {hourLabel(window.startHour)} – {hourLabel(window.endHour)}
        </span>
      </div>
      <Slider
        min={0}
        max={23}
        step={1}
        value={[window.startHour, window.endHour]}
        onChange={([start, end]) => onChange({ startHour: start, endHour: end })}
        formatLabel={hourLabel}
      />
      <div className="flex justify-between text-xs text-slate-400 mt-1">
        <span>00:00</span>
        <span>23:00</span>
      </div>
    </div>
  )
}
