import { useState, useCallback, useEffect } from 'react'
import type { FilterPreset } from '@/types/presets'
import type { FlightFilters } from '@/types/filters'

const STORAGE_KEY = 'tma_presets'

function loadPresets(): FilterPreset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as FilterPreset[]) : []
  } catch {
    return []
  }
}

export function usePresets() {
  const [presets, setPresets] = useState<FilterPreset[]>(loadPresets)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(presets))
    } catch {
      // ignore
    }
  }, [presets])

  const savePreset = useCallback((name: string, filters: FlightFilters) => {
    const preset: FilterPreset = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date().toISOString(),
      filters,
    }
    setPresets(prev => [...prev, preset])
  }, [])

  const deletePreset = useCallback((id: string) => {
    setPresets(prev => prev.filter(p => p.id !== id))
  }, [])

  return { presets, savePreset, deletePreset }
}
