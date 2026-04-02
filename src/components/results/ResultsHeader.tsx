import { List, Table2, ChevronUp, ChevronDown } from 'lucide-react'
import type { SortKey, SortDirection } from '@/types/flight'

interface Props {
  count: number
  loading: boolean
  sortKey: SortKey
  sortDir: SortDirection
  onSort: (key: SortKey) => void
  view: 'list' | 'table'
  onViewChange: (v: 'list' | 'table') => void
}

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'price', label: 'Price' },
  { key: 'duration', label: 'Duration' },
  { key: 'outbound-departure', label: 'Outbound time' },
  { key: 'inbound-departure', label: 'Return time' },
  { key: 'stops', label: 'Stops' },
]

export function ResultsHeader({ count, loading, sortKey, sortDir, onSort, view, onViewChange }: Props) {
  return (
    <div className="flex items-center gap-3 mb-4 flex-wrap">
      {/* Count */}
      <p className="text-sm text-slate-500 mr-auto">
        {loading ? (
          <span className="inline-block w-20 h-4 skeleton rounded" />
        ) : (
          <><span className="font-semibold text-slate-800">{count}</span> flight{count !== 1 ? 's' : ''} found</>
        )}
      </p>

      {/* Sort */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-slate-500 hidden sm:inline">Sort:</span>
        <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs bg-white">
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.key}
              type="button"
              onClick={() => onSort(opt.key)}
              className={[
                'px-2.5 py-1.5 flex items-center gap-1 transition-colors border-r border-slate-200 last:border-r-0',
                sortKey === opt.key
                  ? 'bg-indigo-600 text-white font-medium'
                  : 'text-slate-600 hover:bg-slate-50',
              ].join(' ')}
            >
              {opt.label}
              {sortKey === opt.key && (
                sortDir === 'asc'
                  ? <ChevronUp size={11} />
                  : <ChevronDown size={11} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* View toggle */}
      <div className="flex rounded-lg border border-slate-200 overflow-hidden bg-white">
        <button
          type="button"
          onClick={() => onViewChange('list')}
          className={[
            'px-2.5 py-1.5 transition-colors',
            view === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-50',
          ].join(' ')}
          aria-label="Card view"
        >
          <List size={14} />
        </button>
        <button
          type="button"
          onClick={() => onViewChange('table')}
          className={[
            'px-2.5 py-1.5 transition-colors border-l border-slate-200',
            view === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-50',
          ].join(' ')}
          aria-label="Table view"
        >
          <Table2 size={14} />
        </button>
      </div>
    </div>
  )
}
