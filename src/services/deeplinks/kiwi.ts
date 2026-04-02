import type { Itinerary } from '@/types/flight'
import type { FlightFilters, CabinClass } from '@/types/filters'

const CABIN_MAP: Record<CabinClass, string> = {
  economy: 'ECONOMY',
  premium_economy: 'PREMIUM_ECONOMY',
  business: 'BUSINESS',
  first: 'FIRST',
}

/**
 * Builds a Kiwi.com deep-link for a round trip.
 *
 * Uses the /deep endpoint which accepts IATA codes directly.
 * Format:
 *   https://www.kiwi.com/deep?from={IATA}&to={IATA}
 *     &departure={YYYY-MM-DD}&return={YYYY-MM-DD}
 *     &adults={n}&cabinClass={CLASS}
 *
 * For "anywhere" destination, to=anywhere is used.
 */
export function buildKiwiUrl(
  itinerary: Itinerary,
  filters: FlightFilters,
): string {
  const from = itinerary.outbound.origin.iata
  const to =
    filters.destination === 'anywhere'
      ? 'anywhere'
      : itinerary.outbound.destination.iata
  const departure = itinerary.outbound.departureAt.split('T')[0]!
  const ret = itinerary.inbound.departureAt.split('T')[0]!
  const cabinClass = CABIN_MAP[filters.cabinClass]

  const params = new URLSearchParams({
    from,
    to,
    departure,
    return: ret,
    adults: String(filters.adults),
    cabinClass,
  })

  return `https://www.kiwi.com/deep?${params}`
}
