/**
 * Static mock flight data — 25 itineraries used by MockFlightProvider.
 *
 * Dates are 2026-04-03 (Friday) / 2026-04-05 (Sunday) as a baseline.
 * MockFlightProvider shifts all timestamps to match the actual queried weekend.
 *
 * Flights are carefully constructed to exercise every filter:
 *   - Flights 1–18: match default filters (LHR, Fri 16–22h, Sun 14–23h, ≤6h, ≤1 stop)
 *   - Flight 19: 1-stop LHR→TLV — exceeds default 6h duration
 *   - Flights 20–21: long-haul — exceed duration, shown when limit raised
 *   - Flight 22: direct LHR→SKG (fits default filters)
 *   - Flights 23–24: wrong departure time (filtered by time window)
 *   - Flight 25: from MAN (filtered unless MAN added to origins)
 */
import type { Airport, Itinerary, Leg, Segment } from '@/types/flight'
import { getAirport } from '@/utils/airports'

function ap(iata: string): Airport {
  const a = getAirport(iata)
  if (!a) throw new Error(`Unknown airport: ${iata}`)
  return a
}

function seg(
  fromIata: string,
  toIata: string,
  dep: string,
  arr: string,
  fn: string,
  carrier: string,
  code: string,
  dur: number,
): Segment {
  return {
    origin: ap(fromIata),
    destination: ap(toIata),
    departureAt: dep,
    arrivalAt: arr,
    flightNumber: fn,
    carrier,
    carrierCode: code,
    durationMinutes: dur,
  }
}

function directLeg(
  fromIata: string,
  toIata: string,
  dep: string,
  arr: string,
  fn: string,
  carrier: string,
  code: string,
  dur: number,
): Leg {
  const s = seg(fromIata, toIata, dep, arr, fn, carrier, code, dur)
  return {
    segments: [s],
    origin: ap(fromIata),
    destination: ap(toIata),
    departureAt: dep,
    arrivalAt: arr,
    totalDurationMinutes: dur,
    stops: 0,
    layovers: [],
  }
}

function connectingLeg(
  fromIata: string,
  viaIata: string,
  toIata: string,
  dep1: string,
  arr1: string,
  fn1: string,
  carrier1: string,
  code1: string,
  dur1: number,
  layoverMins: number,
  dep2: string,
  arr2: string,
  fn2: string,
  carrier2: string,
  code2: string,
  dur2: number,
): Leg {
  const s1 = seg(fromIata, viaIata, dep1, arr1, fn1, carrier1, code1, dur1)
  const s2 = seg(viaIata, toIata, dep2, arr2, fn2, carrier2, code2, dur2)
  return {
    segments: [s1, s2],
    origin: ap(fromIata),
    destination: ap(toIata),
    departureAt: dep1,
    arrivalAt: arr2,
    totalDurationMinutes: dur1 + layoverMins + dur2,
    stops: 1,
    layovers: [{ airport: ap(viaIata), durationMinutes: layoverMins }],
  }
}

const FRI = '2026-04-03'
const SUN = '2026-04-05'
const SAT = '2026-04-04'  // for overnight arrivals

function d(date: string, time: string) { return `${date}T${time}:00` }

// ── Itineraries ────────────────────────────────────────────────────────────

export const RAW_MOCK_FLIGHTS: Itinerary[] = [
  // 1. LHR → AMS (direct, Fri eve, £89)
  {
    id: 'mock-lhr-ams-1',
    outbound: directLeg('LHR','AMS', d(FRI,'18:30'), d(FRI,'20:45'), 'BA446', 'British Airways','BA', 135),
    inbound:  directLeg('AMS','LHR', d(SUN,'19:00'), d(SUN,'21:15'), 'BA447', 'British Airways','BA', 135),
    totalPriceGBP: 89, currency: 'GBP', deepLinks: {}, tags: [], weekendScore: 0,
  },
  // 2. LHR → BCN (direct, £149)
  {
    id: 'mock-lhr-bcn-1',
    outbound: directLeg('LHR','BCN', d(FRI,'17:00'), d(FRI,'20:05'), 'VY7820', 'Vueling','VY', 185),
    inbound:  directLeg('BCN','LHR', d(SUN,'20:00'), d(SUN,'23:00'), 'VY7821', 'Vueling','VY', 180),
    totalPriceGBP: 149, currency: 'GBP', deepLinks: {}, tags: [], weekendScore: 0,
  },
  // 3. LHR → CDG (direct, £109)
  {
    id: 'mock-lhr-cdg-1',
    outbound: directLeg('LHR','CDG', d(FRI,'18:00'), d(FRI,'20:15'), 'AF1181','Air France','AF', 135),
    inbound:  directLeg('CDG','LHR', d(SUN,'18:00'), d(SUN,'20:15'), 'AF1180','Air France','AF', 135),
    totalPriceGBP: 109, currency: 'GBP', deepLinks: {}, tags: [], weekendScore: 0,
  },
  // 4. LHR → FCO (direct, £129)
  {
    id: 'mock-lhr-fco-1',
    outbound: directLeg('LHR','FCO', d(FRI,'16:30'), d(FRI,'20:00'), 'BA554', 'British Airways','BA', 210),
    inbound:  directLeg('FCO','LHR', d(SUN,'19:30'), d(SUN,'23:00'), 'BA555', 'British Airways','BA', 210),
    totalPriceGBP: 129, currency: 'GBP', deepLinks: {}, tags: [], weekendScore: 0,
  },
  // 5. LHR → LIS (direct, £119)
  {
    id: 'mock-lhr-lis-1',
    outbound: directLeg('LHR','LIS', d(FRI,'17:30'), d(FRI,'19:30'), 'TP380', 'TAP Air Portugal','TP', 120),
    inbound:  directLeg('LIS','LHR', d(SUN,'21:00'), d(SUN,'23:00'), 'TP381', 'TAP Air Portugal','TP', 120),
    totalPriceGBP: 119, currency: 'GBP', deepLinks: {}, tags: [], weekendScore: 0,
  },
  // 6. LHR → DUB (direct, £69, short hop)
  {
    id: 'mock-lhr-dub-1',
    outbound: directLeg('LHR','DUB', d(FRI,'19:00'), d(FRI,'20:20'), 'BA832', 'British Airways','BA', 80),
    inbound:  directLeg('DUB','LHR', d(SUN,'17:00'), d(SUN,'18:20'), 'BA833', 'British Airways','BA', 80),
    totalPriceGBP: 69, currency: 'GBP', deepLinks: {}, tags: [], weekendScore: 0,
  },
  // 7. LHR → ATH (direct, £159, overnight arrival Sat 00:45)
  {
    id: 'mock-lhr-ath-1',
    outbound: directLeg('LHR','ATH', d(FRI,'20:00'), d(SAT,'00:45'), 'BA638', 'British Airways','BA', 225),
    inbound:  directLeg('ATH','LHR', d(SUN,'16:00'), d(SUN,'20:45'), 'BA639', 'British Airways','BA', 225),
    totalPriceGBP: 159, currency: 'GBP', deepLinks: {}, tags: [], weekendScore: 0,
  },
  // 8. LHR → PRG (direct, £99)
  {
    id: 'mock-lhr-prg-1',
    outbound: directLeg('LHR','PRG', d(FRI,'18:30'), d(FRI,'21:30'), 'BA852', 'British Airways','BA', 180),
    inbound:  directLeg('PRG','LHR', d(SUN,'19:30'), d(SUN,'22:30'), 'BA853', 'British Airways','BA', 180),
    totalPriceGBP: 99, currency: 'GBP', deepLinks: {}, tags: [], weekendScore: 0,
  },
  // 9. LHR → VIE (direct, £139)
  {
    id: 'mock-lhr-vie-1',
    outbound: directLeg('LHR','VIE', d(FRI,'17:30'), d(FRI,'21:00'), 'BA712', 'British Airways','BA', 210),
    inbound:  directLeg('VIE','LHR', d(SUN,'20:00'), d(SUN,'23:30'), 'OS458', 'Austrian Airlines','OS', 210),
    totalPriceGBP: 139, currency: 'GBP', deepLinks: {}, tags: [], weekendScore: 0,
  },
  // 10. LHR → OPO (direct, £79)
  {
    id: 'mock-lhr-opo-1',
    outbound: directLeg('LHR','OPO', d(FRI,'16:00'), d(FRI,'18:10'), 'TP652', 'TAP Air Portugal','TP', 130),
    inbound:  directLeg('OPO','LHR', d(SUN,'20:30'), d(SUN,'22:40'), 'TP653', 'TAP Air Portugal','TP', 130),
    totalPriceGBP: 79, currency: 'GBP', deepLinks: {}, tags: [], weekendScore: 0,
  },
  // 11. LHR → KEF (direct, £199 — late Fri, best weekend score)
  {
    id: 'mock-lhr-kef-1',
    outbound: directLeg('LHR','KEF', d(FRI,'20:00'), d(FRI,'22:00'), 'FI451', 'Icelandair','FI', 180),
    inbound:  directLeg('KEF','LHR', d(SUN,'17:00'), d(SUN,'20:00'), 'FI450', 'Icelandair','FI', 180),
    totalPriceGBP: 199, currency: 'GBP', deepLinks: {}, tags: [], weekendScore: 0,
  },
  // 12. LHR → KRK (direct, £59 — cheapest)
  {
    id: 'mock-lhr-krk-1',
    outbound: directLeg('LHR','KRK', d(FRI,'21:00'), d(SAT,'00:00'), 'FR5541','Ryanair','FR', 180),
    inbound:  directLeg('KRK','LHR', d(SUN,'18:00'), d(SUN,'21:00'), 'FR5542','Ryanair','FR', 180),
    totalPriceGBP: 59, currency: 'GBP', deepLinks: {}, tags: [], weekendScore: 0,
  },
  // 13. LHR → MXP (direct, £89)
  {
    id: 'mock-lhr-mxp-1',
    outbound: directLeg('LHR','MXP', d(FRI,'19:00'), d(FRI,'22:00'), 'BA572', 'British Airways','BA', 180),
    inbound:  directLeg('MXP','LHR', d(SUN,'21:00'), d(SUN,'23:55'), 'BA573', 'British Airways','BA', 175),
    totalPriceGBP: 89, currency: 'GBP', deepLinks: {}, tags: [], weekendScore: 0,
  },
  // 14. LHR → BUD (direct, £79)
  {
    id: 'mock-lhr-bud-1',
    outbound: directLeg('LHR','BUD', d(FRI,'16:30'), d(FRI,'19:00'), 'BA862', 'British Airways','BA', 150),
    inbound:  directLeg('BUD','LHR', d(SUN,'19:00'), d(SUN,'21:30'), 'W64702','Wizz Air','W6', 150),
    totalPriceGBP: 79, currency: 'GBP', deepLinks: {}, tags: [], weekendScore: 0,
  },
  // 15. LHR → WAW (direct, £99)
  {
    id: 'mock-lhr-waw-1',
    outbound: directLeg('LHR','WAW', d(FRI,'17:30'), d(FRI,'20:00'), 'LO281', 'LOT Polish Airlines','LO', 150),
    inbound:  directLeg('WAW','LHR', d(SUN,'20:00'), d(SUN,'22:30'), 'LO282', 'LOT Polish Airlines','LO', 150),
    totalPriceGBP: 99, currency: 'GBP', deepLinks: {}, tags: [], weekendScore: 0,
  },
  // 16. LHR → GVA (direct, £129)
  {
    id: 'mock-lhr-gva-1',
    outbound: directLeg('LHR','GVA', d(FRI,'18:00'), d(FRI,'20:30'), 'BA726', 'British Airways','BA', 150),
    inbound:  directLeg('GVA','LHR', d(SUN,'20:00'), d(SUN,'22:30'), 'BA727', 'British Airways','BA', 150),
    totalPriceGBP: 129, currency: 'GBP', deepLinks: {}, tags: [], weekendScore: 0,
  },
  // 17. LHR → ZRH (direct, £139)
  {
    id: 'mock-lhr-zrh-1',
    outbound: directLeg('LHR','ZRH', d(FRI,'16:00'), d(FRI,'18:45'), 'LX318', 'Swiss','LX', 165),
    inbound:  directLeg('ZRH','LHR', d(SUN,'21:00'), d(SUN,'23:45'), 'LX317', 'Swiss','LX', 165),
    totalPriceGBP: 139, currency: 'GBP', deepLinks: {}, tags: [], weekendScore: 0,
  },
  // 18. LHR → NAP (direct, £139)
  {
    id: 'mock-lhr-nap-1',
    outbound: directLeg('LHR','NAP', d(FRI,'17:00'), d(FRI,'20:30'), 'EZY8411','easyJet','U2', 210),
    inbound:  directLeg('NAP','LHR', d(SUN,'19:00'), d(SUN,'22:30'), 'EZY8412','easyJet','U2', 210),
    totalPriceGBP: 139, currency: 'GBP', deepLinks: {}, tags: [], weekendScore: 0,
  },
  // 19. LHR → TLV (1-stop via CDG, 7h30m — exceeds default 6h)
  {
    id: 'mock-lhr-tlv-1',
    outbound: connectingLeg(
      'LHR','CDG','TLV',
      d(FRI,'17:00'), d(FRI,'19:15'), 'AF1181','Air France','AF', 135,
      90,
      d(FRI,'20:45'), d(SAT,'00:30'), 'AF1630','Air France','AF', 225,
    ),
    inbound: connectingLeg(
      'TLV','CDG','LHR',
      d(SUN,'15:00'), d(SUN,'18:45'), 'AF1631','Air France','AF', 225,
      90,
      d(SUN,'20:15'), d(SUN,'22:30'), 'AF1180','Air France','AF', 135,
    ),
    totalPriceGBP: 249, currency: 'GBP', deepLinks: {}, tags: [], weekendScore: 0,
  },
  // 20. LHR → DXB (1-stop via FRA, 11h45m — long haul, shows when duration limit raised)
  {
    id: 'mock-lhr-dxb-1',
    outbound: connectingLeg(
      'LHR','FRA','DXB',
      d(FRI,'18:00'), d(FRI,'20:30'), 'LH904', 'Lufthansa','LH', 150,
      75,
      d(FRI,'21:45'), d(SAT,'05:45'), 'LH630', 'Lufthansa','LH', 360,
    ),
    inbound: connectingLeg(
      'DXB','FRA','LHR',
      d(SUN,'15:00'), d(SUN,'18:30'), 'LH631', 'Lufthansa','LH', 390,
      75,
      d(SUN,'19:45'), d(SUN,'22:00'), 'LH903', 'Lufthansa','LH', 135,
    ),
    totalPriceGBP: 389, currency: 'GBP', deepLinks: {}, tags: [], weekendScore: 0,
  },
  // 21. LHR → JFK (1-stop via AMS, 12h30m — exceeds duration)
  {
    id: 'mock-lhr-jfk-1',
    outbound: connectingLeg(
      'LHR','AMS','JFK',
      d(FRI,'18:00'), d(FRI,'20:00'), 'KL1011','KLM','KL', 120,
      90,
      d(FRI,'21:30'), d(SAT,'00:30'), 'KL641', 'KLM','KL', 480,
    ),
    inbound: connectingLeg(
      'JFK','AMS','LHR',
      d(SUN,'17:00'), d(SUN,'06:00'), 'KL642', 'KLM','KL', 480,
      90,
      d(SUN,'07:30'), d(SUN,'09:00'), 'KL1012','KLM','KL', 90,
    ),
    totalPriceGBP: 480, currency: 'GBP', deepLinks: {}, tags: [], weekendScore: 0,
  },
  // 22. LHR → SKG (direct, £179 — fits default filters)
  {
    id: 'mock-lhr-skg-1',
    outbound: directLeg('LHR','SKG', d(FRI,'20:00'), d(SAT,'00:30'), 'EZY8801','easyJet','U2', 270),
    inbound:  directLeg('SKG','LHR', d(SUN,'15:00'), d(SUN,'19:30'), 'EZY8802','easyJet','U2', 270),
    totalPriceGBP: 179, currency: 'GBP', deepLinks: {}, tags: [], weekendScore: 0,
  },
  // 23. LHR → AMS (direct, 06:00 — OUTSIDE outbound window, filtered by default)
  {
    id: 'mock-lhr-ams-2',
    outbound: directLeg('LHR','AMS', d(FRI,'06:00'), d(FRI,'08:15'), 'KL1021','KLM','KL', 135),
    inbound:  directLeg('AMS','LHR', d(SUN,'22:00'), d(SUN,'00:15'), 'KL1022','KLM','KL', 135),
    totalPriceGBP: 65, currency: 'GBP', deepLinks: {}, tags: [], weekendScore: 0,
  },
  // 24. LHR → BCN (direct, 09:00 — OUTSIDE outbound window)
  {
    id: 'mock-lhr-bcn-2',
    outbound: directLeg('LHR','BCN', d(FRI,'09:00'), d(FRI,'12:05'), 'VY7824','Vueling','VY', 185),
    inbound:  directLeg('BCN','LHR', d(SUN,'12:00'), d(SUN,'15:00'), 'VY7825','Vueling','VY', 180),
    totalPriceGBP: 129, currency: 'GBP', deepLinks: {}, tags: [], weekendScore: 0,
  },
  // 25. MAN → BCN (direct, good timing — WRONG ORIGIN unless MAN added)
  {
    id: 'mock-man-bcn-1',
    outbound: directLeg('MAN','BCN', d(FRI,'17:30'), d(FRI,'20:30'), 'VY8871','Vueling','VY', 180),
    inbound:  directLeg('BCN','MAN', d(SUN,'19:30'), d(SUN,'22:30'), 'VY8872','Vueling','VY', 180),
    totalPriceGBP: 119, currency: 'GBP', deepLinks: {}, tags: [], weekendScore: 0,
  },
]
