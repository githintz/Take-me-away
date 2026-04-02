export interface Airport {
  iata: string
  name: string
  city: string
  country: string
  timezone: string
}

export interface Segment {
  origin: Airport
  destination: Airport
  /** ISO 8601 local time — "2026-04-03T18:30:00" */
  departureAt: string
  arrivalAt: string
  flightNumber: string
  carrier: string
  carrierCode: string
  durationMinutes: number
}

export interface LayoverInfo {
  airport: Airport
  durationMinutes: number
}

export interface Leg {
  segments: Segment[]
  origin: Airport
  destination: Airport
  departureAt: string
  arrivalAt: string
  totalDurationMinutes: number
  stops: number
  layovers: LayoverInfo[]
}

export type ItineraryTag = 'best-value' | 'fastest' | 'direct' | 'best-weekend'

export interface Itinerary {
  id: string
  outbound: Leg
  inbound: Leg
  totalPriceGBP: number
  currency: string
  deepLinks: {
    googleFlights?: string
    skyscanner?: string
    kiwi?: string
  }
  tags: ItineraryTag[]
  weekendScore: number
}

export type SortKey =
  | 'price'
  | 'duration'
  | 'outbound-departure'
  | 'inbound-departure'
  | 'stops'

export type SortDirection = 'asc' | 'desc'
