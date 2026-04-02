import type { Itinerary } from '@/types/flight'
import type { FlightFilters, CabinClass } from '@/types/filters'

const CABIN_MAP: Record<CabinClass, string> = {
  economy: 'economy',
  premium_economy: 'premiumeconomy',
  business: 'business',
  first: 'first',
}

/** Format a YYYY-MM-DD date as YYMMDD for Skyscanner URLs */
function toSkyscannerDate(isoDate: string): string {
  // "2026-04-03" → "260403"
  return isoDate.replace(/-/g, '').substring(2)
}

/**
 * Builds a Skyscanner deep-link for a round trip.
 *
 * Format:
 *   https://www.skyscanner.net/transport/flights/{org}/{dst}/{YYMMDD}/{YYMMDD}/
 *     ?adults={n}&cabinclass={class}&rtn=1&preferdirects={bool}
 *
 * For "anywhere" destination, Skyscanner uses "everywhere" as the destination code.
 */
export function buildSkyscannerUrl(
  itinerary: Itinerary,
  filters: FlightFilters,
): string {
  const origin = itinerary.outbound.origin.iata.toLowerCase()
  const rawDest = itinerary.outbound.destination.iata
  const destination = filters.destination === 'anywhere' ? 'everywhere' : rawDest.toLowerCase()
  const outDate = toSkyscannerDate(itinerary.outbound.departureAt.split('T')[0]!)
  const retDate = toSkyscannerDate(itinerary.inbound.departureAt.split('T')[0]!)
  const cabin = CABIN_MAP[filters.cabinClass]
  const preferdirects = filters.maxConnections === 0 ? 'true' : 'false'

  const params = new URLSearchParams({
    adults: String(filters.adults),
    cabinclass: cabin,
    rtn: '1',
    preferdirects,
  })

  return (
    `https://www.skyscanner.net/transport/flights/${origin}/${destination}/${outDate}/${retDate}/?${params}`
  )
}
