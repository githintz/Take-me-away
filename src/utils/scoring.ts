import type { Itinerary, ItineraryTag } from '@/types/flight'
import { computeWeekendFraction, extractHour } from './dateUtils'

/**
 * Scores an itinerary from 0–100 for how good a "weekend trip" it is.
 *
 * Components (weighted):
 *  40% — destination time fraction (time actually at destination / 48h weekend)
 *  30% — price efficiency (relative to dataset; caller should normalise)
 *  20% — directness (direct=100, 1-stop=70, 2-stop=40)
 *  10% — outbound timing (Fri 18–21:00 ideal)
 */
export function computeWeekendScore(
  itinerary: Itinerary,
  priceMedian: number,
): number {
  // 1. Destination time fraction (40%)
  const fraction = computeWeekendFraction(
    itinerary.outbound.arrivalAt,
    itinerary.inbound.departureAt,
  )
  const destScore = fraction * 100

  // 2. Price efficiency (30%) — cheaper relative to median = higher score
  const priceRatio = priceMedian > 0 ? priceMedian / itinerary.totalPriceGBP : 1
  const priceScore = Math.min(100, priceRatio * 60) // cap at 100

  // 3. Directness (20%)
  const totalStops = itinerary.outbound.stops + itinerary.inbound.stops
  const directScore = totalStops === 0 ? 100 : totalStops === 1 ? 75 : totalStops === 2 ? 50 : 25

  // 4. Outbound timing (10%) — Fri 18:00–21:00 = ideal
  const outHour = extractHour(itinerary.outbound.departureAt)
  let timingScore: number
  if (outHour >= 17 && outHour <= 20) {
    timingScore = 100
  } else if (outHour >= 15 && outHour < 17) {
    timingScore = 70
  } else if (outHour > 20 && outHour <= 22) {
    timingScore = 75
  } else if (outHour >= 12 && outHour < 15) {
    timingScore = 40
  } else {
    timingScore = 10
  }

  return Math.round(
    destScore * 0.4 +
    priceScore * 0.3 +
    directScore * 0.2 +
    timingScore * 0.1,
  )
}

/** Assign tags to a ranked set of itineraries */
export function tagItineraries(itineraries: Itinerary[]): Itinerary[] {
  if (itineraries.length === 0) return []

  const bestValueIdx = itineraries.reduce(
    (best, it, i) => (it.totalPriceGBP < itineraries[best].totalPriceGBP ? i : best),
    0,
  )
  const fastestIdx = itineraries.reduce((best, it, i) => {
    const totalDur = it.outbound.totalDurationMinutes + it.inbound.totalDurationMinutes
    const bestDur =
      itineraries[best].outbound.totalDurationMinutes +
      itineraries[best].inbound.totalDurationMinutes
    return totalDur < bestDur ? i : best
  }, 0)
  const bestWeekendIdx = itineraries.reduce(
    (best, it, i) => (it.weekendScore > itineraries[best].weekendScore ? i : best),
    0,
  )

  return itineraries.map((it, i) => {
    const tags: ItineraryTag[] = []
    if (it.outbound.stops === 0 && it.inbound.stops === 0) tags.push('direct')
    if (i === bestValueIdx) tags.push('best-value')
    if (i === fastestIdx && fastestIdx !== bestValueIdx) tags.push('fastest')
    if (i === bestWeekendIdx) tags.push('best-weekend')
    return { ...it, tags }
  })
}

/** Compute median price from an array of itineraries */
export function medianPrice(itineraries: Itinerary[]): number {
  if (itineraries.length === 0) return 200
  const sorted = [...itineraries].sort((a, b) => a.totalPriceGBP - b.totalPriceGBP)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0
    ? (sorted[mid - 1]!.totalPriceGBP + sorted[mid]!.totalPriceGBP) / 2
    : sorted[mid]!.totalPriceGBP
}
