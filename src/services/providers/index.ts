/// <reference types="vite/client" />
import { createProvider } from '@/services/FlightProvider'
import type { ProviderType } from '@/services/FlightProvider'

const providerType = (import.meta.env.VITE_PROVIDER ?? 'mock') as ProviderType

export const flightProvider = createProvider(providerType)
