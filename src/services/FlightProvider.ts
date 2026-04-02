/**
 * FlightProvider abstraction — the single extension point for adding real APIs.
 *
 * To add a new provider:
 *   1. Create src/services/providers/YourProvider.ts
 *   2. Implement FlightProvider
 *   3. Add a case in createProvider()
 *   4. Set VITE_PROVIDER=yourprovider in .env.local
 */
export type { FlightProvider, FlightQuery, FlightResult, FlightMeta } from '@/types/provider'

import type { FlightProvider } from '@/types/provider'
import { MockFlightProvider } from './providers/MockFlightProvider'

export type ProviderType = 'mock'

export function createProvider(type: ProviderType = 'mock'): FlightProvider {
  switch (type) {
    case 'mock':
      return new MockFlightProvider()
    default: {
      console.warn(`Unknown provider "${type as string}", falling back to mock`)
      return new MockFlightProvider()
    }
  }
}
