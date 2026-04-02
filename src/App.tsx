import { useState, useCallback } from 'react'
import { AppHeader } from '@/components/layout/AppHeader'
import { AppLayout } from '@/components/layout/AppLayout'
import { useFilters } from '@/hooks/useFilters'
import { useFlights } from '@/hooks/useFlights'
import { usePresets } from '@/hooks/usePresets'
import { useSortedFlights } from '@/hooks/useSortedFlights'
import type { SortKey, SortDirection } from '@/types/flight'
import type { FlightFilters } from '@/types/filters'

export default function App() {
  const { filters, setFilter, resetFilters, loadPreset } = useFilters()
  const { itineraries, loading, error, refetch } = useFlights(filters)
  const { presets, savePreset, deletePreset } = usePresets()

  const [sortKey, setSortKey] = useState<SortKey>('price')
  const [sortDir, setSortDir] = useState<SortDirection>('asc')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const sorted = useSortedFlights(itineraries, sortKey, sortDir)

  const handleSort = useCallback(
    (key: SortKey) => {
      setSortKey(prev => {
        if (prev === key) {
          setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
          return prev
        }
        setSortDir('asc')
        return key
      })
    },
    [],
  )

  const handleFilterChange = useCallback(
    <K extends keyof FlightFilters>(key: K, value: FlightFilters[K]) => {
      setFilter(key, value)
    },
    [setFilter],
  )

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader
        presets={presets}
        onLoadPreset={loadPreset}
        onOpenFilters={() => setMobileFiltersOpen(o => !o)}
        isMobileFilterOpen={mobileFiltersOpen}
      />
      <AppLayout
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={resetFilters}
        itineraries={sorted}
        loading={loading}
        error={error}
        onRetry={refetch}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={handleSort}
        presets={presets}
        onLoadPreset={loadPreset}
        onSavePreset={savePreset}
        onDeletePreset={deletePreset}
        mobileFiltersOpen={mobileFiltersOpen}
        onCloseMobileFilters={() => setMobileFiltersOpen(false)}
      />
    </div>
  )
}
