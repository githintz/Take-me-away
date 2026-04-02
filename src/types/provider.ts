import type { FlightFilters } from './filters'
import type { Itinerary } from './flight'

export interface FlightQuery {
  filters: FlightFilters
  /** "YYYY-MM-DD" — the outbound (Friday) date */
  outboundDate: string
  /** "YYYY-MM-DD" — the return (Sunday) date */
  inboundDate: string
}

export interface FlightMeta {
  totalResults: number
  currency: string
  fetchedAt: string
  providerName: string
}

export interface FlightResult {
  itineraries: Itinerary[]
  meta: FlightMeta
}

export interface FlightProvider {
  readonly name: string
  readonly supportsRealtime: boolean
  search(query: FlightQuery): Promise<FlightResult>
}
