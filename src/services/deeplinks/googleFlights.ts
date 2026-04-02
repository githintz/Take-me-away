import type { Itinerary } from '@/types/flight'
import type { FlightFilters, CabinClass } from '@/types/filters'

const CABIN_MAP: Record<CabinClass, number> = {
  economy: 1,
  premium_economy: 2,
  business: 3,
  first: 4,
}

/**
 * Builds a Google Flights deep-link for a round trip.
 *
 * Format:
 *   https://www.google.com/travel/flights#flt=
 *     {ORG}.{DST}.{DATE}*{DST}.{ORG}.{RET_DATE}
 *     ;c:GBP;e:{cabin};s:{stops};sd:1;t:f
 */
export function buildGoogleFlightsUrl(
  itinerary: Itinerary,
  filters: FlightFilters,
): string {
  const origin = itinerary.outbound.origin.iata
  const destination = itinerary.outbound.destination.iata
  const outDate = itinerary.outbound.departureAt.split('T')[0]!
  const retDate = itinerary.inbound.departureAt.split('T')[0]!
  const cabin = CABIN_MAP[filters.cabinClass]
  const maxStops = Math.min(filters.maxConnections, 2)

  const route = `${origin}.${destination}.${outDate}*${destination}.${origin}.${retDate}`
  const params = `c:GBP;e:${cabin};s:${maxStops};sd:1;t:f`

  return `https://www.google.com/travel/flights#flt=${route};${params}`
}
