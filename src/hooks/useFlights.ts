import { useState, useEffect, useRef, useCallback } from 'react'
import type { Itinerary } from '@/types/flight'
import type { FlightFilters } from '@/types/filters'
import type { FlightQuery, FlightMeta } from '@/types/provider'
import { flightProvider } from '@/services/providers'
import { getUpcomingWeekends } from '@/utils/dateUtils'

interface FlightState {
  itineraries: Itinerary[]
  loading: boolean
  error: string | null
  meta: FlightMeta | null
}

const DEBOUNCE_MS = 400

export function useFlights(filters: FlightFilters) {
  const [state, setState] = useState<FlightState>({
    itineraries: [],
    loading: true,
    error: null,
    meta: null,
  })

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const runSearch = useCallback(
    async (query: FlightQuery) => {
      // Cancel any in-flight request
      abortRef.current?.abort()
      abortRef.current = new AbortController()

      setState(prev => ({ ...prev, loading: true, error: null }))
      try {
        const result = await flightProvider.search(query)
        setState({ itineraries: result.itineraries, loading: false, error: null, meta: result.meta })
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return
        setState(prev => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : 'An unknown error occurred',
        }))
      }
    },
    [],
  )

  const refetch = useCallback(() => {
    const weekends = getUpcomingWeekends(8)
    const weekend = weekends[filters.weekendOffset] ?? weekends[0]!
    const query: FlightQuery = {
      filters,
      outboundDate: weekend.friday,
      inboundDate: weekend.sunday,
    }
    void runSearch(query)
  }, [filters, runSearch])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(refetch, DEBOUNCE_MS)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [refetch])

  return { ...state, refetch }
}
