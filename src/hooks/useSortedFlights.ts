import { useMemo } from 'react'
import type { Itinerary, SortKey, SortDirection } from '@/types/flight'

function getSortValue(it: Itinerary, key: SortKey): number | string {
  switch (key) {
    case 'price':
      return it.totalPriceGBP
    case 'duration':
      return it.outbound.totalDurationMinutes + it.inbound.totalDurationMinutes
    case 'outbound-departure':
      return it.outbound.departureAt
    case 'inbound-departure':
      return it.inbound.departureAt
    case 'stops':
      return it.outbound.stops + it.inbound.stops
  }
}

export function useSortedFlights(
  itineraries: Itinerary[],
  sortKey: SortKey,
  sortDir: SortDirection,
): Itinerary[] {
  return useMemo(() => {
    const copy = [...itineraries]
    copy.sort((a, b) => {
      const av = getSortValue(a, sortKey)
      const bv = getSortValue(b, sortKey)
      const cmp = av < bv ? -1 : av > bv ? 1 : 0
      return sortDir === 'asc' ? cmp : -cmp
    })
    return copy
  }, [itineraries, sortKey, sortDir])
}
