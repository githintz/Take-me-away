import type { Itinerary } from '@/types/flight'
import type { FlightFilters } from '@/types/filters'
import { buildGoogleFlightsUrl } from './googleFlights'
import { buildSkyscannerUrl } from './skyscanner'
import { buildKiwiUrl } from './kiwi'

export interface DeepLinkSet {
  googleFlights: string
  skyscanner: string
  kiwi: string
}

export function buildAllDeepLinks(
  itinerary: Itinerary,
  filters: FlightFilters,
): DeepLinkSet {
  return {
    googleFlights: buildGoogleFlightsUrl(itinerary, filters),
    skyscanner: buildSkyscannerUrl(itinerary, filters),
    kiwi: buildKiwiUrl(itinerary, filters),
  }
}
