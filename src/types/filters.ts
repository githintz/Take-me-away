export interface TimeWindow {
  startHour: number
  endHour: number
}

export type CabinClass = 'economy' | 'premium_economy' | 'business' | 'first'

export interface FlightFilters {
  origins: string[]
  /** IATA code or "anywhere" */
  destination: string
  /** 0 = next upcoming weekend, 1 = weekend after, etc. */
  weekendOffset: number
  /** Show flights ±1 day around the selected weekend */
  flexibleDates: boolean
  /** Outbound departure time window (e.g. Fri 16–22h) */
  outboundWindow: TimeWindow
  /** Return departure time window (e.g. Sun 14–23h) */
  inboundWindow: TimeWindow
  /** One-way leg duration cap (hours) */
  maxTotalDurationHours: number
  /** 0 = direct only, 1 = up to 1 stop, etc. */
  maxConnections: number
  minLayoverMinutes: number
  priceMin: number
  priceMax: number
  cabinClass: CabinClass
  adults: number
}

export const DEFAULT_FILTERS: FlightFilters = {
  origins: ['LHR'],
  destination: 'anywhere',
  weekendOffset: 0,
  flexibleDates: false,
  outboundWindow: { startHour: 16, endHour: 22 },
  inboundWindow: { startHour: 14, endHour: 23 },
  maxTotalDurationHours: 6,
  maxConnections: 1,
  minLayoverMinutes: 45,
  priceMin: 0,
  priceMax: 500,
  cabinClass: 'economy',
  adults: 1,
}
