import type { FlightProvider, FlightQuery, FlightResult } from '@/types/provider'
import type { Itinerary, Leg, Segment } from '@/types/flight'
import { RAW_MOCK_FLIGHTS } from '@/data/mockFlights'
import { applyFilters } from '@/utils/filterUtils'
import { computeWeekendScore, tagItineraries, medianPrice } from '@/utils/scoring'
import { buildAllDeepLinks } from '@/services/deeplinks'
import { shiftIso } from '@/utils/dateUtils'

/** Replace date portions of all timestamps in a Leg */
function shiftLeg(leg: Leg, shiftMs: number): Leg {
  return {
    ...leg,
    departureAt: shiftIso(leg.departureAt, shiftMs),
    arrivalAt: shiftIso(leg.arrivalAt, shiftMs),
    segments: leg.segments.map((s: Segment) => ({
      ...s,
      departureAt: shiftIso(s.departureAt, shiftMs),
      arrivalAt: shiftIso(s.arrivalAt, shiftMs),
    })),
  }
}

/**
 * Shift all timestamps in an itinerary so outbound/inbound dates match the query.
 * This keeps mock data "fresh" regardless of the actual date.
 */
function adjustDates(itinerary: Itinerary, outboundDate: string, inboundDate: string): Itinerary {
  const mockOutboundDateStr = itinerary.outbound.departureAt.split('T')[0]!
  const mockInboundDateStr = itinerary.inbound.departureAt.split('T')[0]!

  const outShift = new Date(outboundDate).getTime() - new Date(mockOutboundDateStr).getTime()
  const inShift = new Date(inboundDate).getTime() - new Date(mockInboundDateStr).getTime()

  return {
    ...itinerary,
    outbound: shiftLeg(itinerary.outbound, outShift),
    inbound: shiftLeg(itinerary.inbound, inShift),
  }
}

export class MockFlightProvider implements FlightProvider {
  readonly name = 'Mock Data'
  readonly supportsRealtime = false

  async search(query: FlightQuery): Promise<FlightResult> {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 350))

    // 1. Adjust all mock flight dates to match the queried weekend
    const dateAdjusted = RAW_MOCK_FLIGHTS.map(it =>
      adjustDates(it, query.outboundDate, query.inboundDate),
    )

    // 2. Apply user filters
    const filtered = applyFilters(dateAdjusted, query)

    // 3. Compute weekend scores
    const median = medianPrice(filtered)
    const scored = filtered.map(it => ({
      ...it,
      weekendScore: computeWeekendScore(it, median),
    }))

    // 4. Tag itineraries (best-value, fastest, direct, best-weekend)
    const tagged = tagItineraries(scored)

    // 5. Attach deep links
    const withLinks = tagged.map(it => ({
      ...it,
      deepLinks: buildAllDeepLinks(it, query.filters),
    }))

    return {
      itineraries: withLinks,
      meta: {
        totalResults: withLinks.length,
        currency: 'GBP',
        fetchedAt: new Date().toISOString(),
        providerName: this.name,
      },
    }
  }
}
