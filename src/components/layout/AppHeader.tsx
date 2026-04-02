import { Plane, Github, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { FilterPreset } from '@/types/presets'

interface Props {
  presets: FilterPreset[]
  onLoadPreset: (preset: FilterPreset) => void
  onOpenFilters: () => void
  isMobileFilterOpen: boolean
}

export function AppHeader({ presets, onLoadPreset, onOpenFilters, isMobileFilterOpen }: Props) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">
        {/* Logo */}
        <div className="flex items-center gap-2 mr-4">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <Plane size={16} className="text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-slate-900 leading-none">Take Me Away</p>
            <p className="text-xs text-slate-400 leading-none mt-0.5">Weekend flight planner</p>
          </div>
        </div>

        {/* Quick-load presets (desktop) */}
        {presets.length > 0 && (
          <div className="hidden md:flex items-center gap-2 mr-auto">
            <span className="text-xs text-slate-400">Presets:</span>
            {presets.slice(0, 4).map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => onLoadPreset(p)}
                className="text-xs bg-slate-100 hover:bg-indigo-100 hover:text-indigo-700 text-slate-600 px-2.5 py-1 rounded-full transition-colors"
              >
                {p.name}
              </button>
            ))}
          </div>
        )}

        <div className="ml-auto flex items-center gap-2">
          {/* Provider badge */}
          <span className="hidden sm:inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Free · No API key
          </span>

          {/* GitHub link */}
          <a
            href="https://github.com/githintz/Take-me-away"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors rounded-lg hover:bg-slate-100"
            aria-label="View source on GitHub"
          >
            <Github size={18} />
          </a>

          {/* Mobile filter toggle */}
          <Button
            variant={isMobileFilterOpen ? 'primary' : 'secondary'}
            size="sm"
            onClick={onOpenFilters}
            className="lg:hidden"
          >
            <SlidersHorizontal size={14} />
            Filters
          </Button>
        </div>
      </div>
    </header>
  )
}
