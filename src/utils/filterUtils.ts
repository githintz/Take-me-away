import type { Itinerary } from '@/types/flight'
import type { FlightQuery } from '@/types/provider'
import { extractHour } from './dateUtils'

export function applyFilters(itineraries: Itinerary[], query: FlightQuery): Itinerary[] {
  const { filters, outboundDate, inboundDate } = query

  return itineraries.filter(it => {
    // 1. Origin must be in selected origins
    if (!filters.origins.includes(it.outbound.origin.iata)) return false

    // 2. Destination filter (skip if "anywhere")
    if (filters.destination !== 'anywhere' && it.outbound.destination.iata !== filters.destination) {
      return false
    }

    // 3. Outbound departure time window
    const outHour = extractHour(it.outbound.departureAt)
    if (outHour < filters.outboundWindow.startHour || outHour > filters.outboundWindow.endHour) {
      return false
    }

    // 4. Inbound departure time window
    const inHour = extractHour(it.inbound.departureAt)
    if (inHour < filters.inboundWindow.startHour || inHour > filters.inboundWindow.endHour) {
      return false
    }

    // 5. Max one-way leg duration
    const maxMinutes = filters.maxTotalDurationHours * 60
    if (it.outbound.totalDurationMinutes > maxMinutes) return false
    if (it.inbound.totalDurationMinutes > maxMinutes) return false

    // 6. Max connections (stops)
    if (it.outbound.stops > filters.maxConnections) return false
    if (it.inbound.stops > filters.maxConnections) return false

    // 7. Minimum layover duration
    for (const layover of [...it.outbound.layovers, ...it.inbound.layovers]) {
      if (layover.durationMinutes < filters.minLayoverMinutes) return false
    }

    // 8. Price range
    if (it.totalPriceGBP < filters.priceMin || it.totalPriceGBP > filters.priceMax) return false

    // 9. Date matching (when flexibleDates is false, require exact date match)
    if (!filters.flexibleDates) {
      const outboundDatePart = it.outbound.departureAt.split('T')[0]
      const inboundDatePart = it.inbound.departureAt.split('T')[0]
      if (outboundDatePart !== outboundDate) return false
      if (inboundDatePart !== inboundDate) return false
    }

    return true
  })
}
