import type { FlightFilters } from './filters'

export interface FilterPreset {
  id: string
  name: string
  createdAt: string
  filters: FlightFilters
}
