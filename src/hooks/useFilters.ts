import { useState, useEffect, useCallback } from 'react'
import { DEFAULT_FILTERS } from '@/types/filters'
import type { FlightFilters } from '@/types/filters'
import type { FilterPreset } from '@/types/presets'

const STORAGE_KEY = 'tma_filters'

function loadFromStorage(): FlightFilters {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_FILTERS
    const parsed = JSON.parse(raw) as Partial<FlightFilters>
    // Merge with defaults to handle missing fields after schema changes
    return { ...DEFAULT_FILTERS, ...parsed }
  } catch {
    return DEFAULT_FILTERS
  }
}

export function useFilters() {
  const [filters, setFilters] = useState<FlightFilters>(loadFromStorage)

  // Persist to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters))
    } catch {
      // Storage full or unavailable — silently ignore
    }
  }, [filters])

  const setFilter = useCallback(
    <K extends keyof FlightFilters>(key: K, value: FlightFilters[K]) => {
      setFilters(prev => ({ ...prev, [key]: value }))
    },
    [],
  )

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
  }, [])

  const loadPreset = useCallback((preset: FilterPreset) => {
    setFilters({ ...DEFAULT_FILTERS, ...preset.filters })
  }, [])

  return { filters, setFilter, resetFilters, loadPreset }
}
