import { useState, useEffect } from 'react'
import { FilterPanel } from '@/components/filters/FilterPanel'
import { ResultsHeader } from '@/components/results/ResultsHeader'
import { ResultsList } from '@/components/results/ResultsList'
import { FlightTable } from '@/components/results/FlightTable'
import { EmptyState } from './EmptyState'
import type { Itinerary, SortKey, SortDirection } from '@/types/flight'
import type { FlightFilters } from '@/types/filters'
import type { FilterPreset } from '@/types/presets'

interface Props {
  filters: FlightFilters
  onFilterChange: <K extends keyof FlightFilters>(key: K, value: FlightFilters[K]) => void
  onReset: () => void
  itineraries: Itinerary[]
  loading: boolean
  error: string | null
  onRetry: () => void
  sortKey: SortKey
  sortDir: SortDirection
  onSort: (key: SortKey) => void
  presets: FilterPreset[]
  onLoadPreset: (preset: FilterPreset) => void
  onSavePreset: (name: string, filters: FlightFilters) => void
  onDeletePreset: (id: string) => void
  mobileFiltersOpen: boolean
  onCloseMobileFilters: () => void
}

export function AppLayout({
  filters,
  onFilterChange,
  onReset,
  itineraries,
  loading,
  error,
  onRetry,
  sortKey,
  sortDir,
  onSort,
  presets,
  onLoadPreset,
  onSavePreset,
  onDeletePreset,
  mobileFiltersOpen,
  onCloseMobileFilters,
}: Props) {
  const [view, setView] = useState<'list' | 'table'>('list')

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileFiltersOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileFiltersOpen])

  const handleSort = (key: SortKey) => {
    onSort(key)
  }

  const showEmpty = !loading && !error && itineraries.length === 0
  const showError = !loading && !!error

  return (
    <div className="max-w-7xl mx-auto flex h-[calc(100vh-56px)]">
      {/* ── Desktop sidebar ──────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-80 xl:w-88 border-r border-slate-200 bg-white flex-shrink-0 overflow-hidden">
        <FilterPanel
          filters={filters}
          onChange={onFilterChange}
          onReset={onReset}
          presets={presets}
          onLoadPreset={onLoadPreset}
          onSavePreset={onSavePreset}
          onDeletePreset={onDeletePreset}
        />
      </aside>

      {/* ── Mobile filter drawer ─────────────────────────── */}
      {mobileFiltersOpen && (
        <div className="lg:hidden">
          <div className="filter-drawer-overlay" onClick={onCloseMobileFilters} />
          <div className={`filter-drawer ${mobileFiltersOpen ? 'open' : ''}`}>
            {/* Drawer header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white sticky top-0 z-10">
              <p className="font-semibold text-slate-800 text-sm">Filters</p>
              <button
                type="button"
                onClick={onCloseMobileFilters}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Close filters"
              >
                ✕
              </button>
            </div>
            <FilterPanel
              filters={filters}
              onChange={onFilterChange}
              onReset={onReset}
              presets={presets}
              onLoadPreset={(p) => { onLoadPreset(p); onCloseMobileFilters() }}
              onSavePreset={onSavePreset}
              onDeletePreset={onDeletePreset}
            />
          </div>
        </div>
      )}

      {/* ── Results pane ─────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto thin-scroll px-4 py-4">
        <ResultsHeader
          count={itineraries.length}
          loading={loading}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
          view={view}
          onViewChange={setView}
        />

        {showError && (
          <EmptyState status="error" error={error} onRetry={onRetry} />
        )}

        {showEmpty && (
          <EmptyState status="empty" onReset={onReset} />
        )}

        {!showError && !showEmpty && (
          view === 'list' ? (
            <ResultsList itineraries={itineraries} loading={loading} />
          ) : (
            <FlightTable
              itineraries={itineraries}
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={handleSort}
            />
          )
        )}
      </main>
    </div>
  )
}
