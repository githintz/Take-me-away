import type { Airport } from '@/types/flight'

export const ALL_AIRPORTS: Airport[] = [
  // United Kingdom
  { iata: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom', timezone: 'Europe/London' },
  { iata: 'LGW', name: 'Gatwick Airport', city: 'London', country: 'United Kingdom', timezone: 'Europe/London' },
  { iata: 'LCY', name: 'London City Airport', city: 'London', country: 'United Kingdom', timezone: 'Europe/London' },
  { iata: 'STN', name: 'Stansted Airport', city: 'London', country: 'United Kingdom', timezone: 'Europe/London' },
  { iata: 'LTN', name: 'Luton Airport', city: 'London', country: 'United Kingdom', timezone: 'Europe/London' },
  { iata: 'MAN', name: 'Manchester Airport', city: 'Manchester', country: 'United Kingdom', timezone: 'Europe/London' },
  { iata: 'EDI', name: 'Edinburgh Airport', city: 'Edinburgh', country: 'United Kingdom', timezone: 'Europe/London' },
  { iata: 'BRS', name: 'Bristol Airport', city: 'Bristol', country: 'United Kingdom', timezone: 'Europe/London' },
  { iata: 'BHX', name: 'Birmingham Airport', city: 'Birmingham', country: 'United Kingdom', timezone: 'Europe/London' },
  { iata: 'GLA', name: 'Glasgow Airport', city: 'Glasgow', country: 'United Kingdom', timezone: 'Europe/London' },
  // Netherlands
  { iata: 'AMS', name: 'Schiphol Airport', city: 'Amsterdam', country: 'Netherlands', timezone: 'Europe/Amsterdam' },
  // Spain
  { iata: 'BCN', name: 'El Prat Airport', city: 'Barcelona', country: 'Spain', timezone: 'Europe/Madrid' },
  { iata: 'MAD', name: 'Barajas Airport', city: 'Madrid', country: 'Spain', timezone: 'Europe/Madrid' },
  { iata: 'PMI', name: 'Son Sant Joan Airport', city: 'Palma de Mallorca', country: 'Spain', timezone: 'Europe/Madrid' },
  { iata: 'AGP', name: 'Costa del Sol Airport', city: 'Malaga', country: 'Spain', timezone: 'Europe/Madrid' },
  // France
  { iata: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', timezone: 'Europe/Paris' },
  { iata: 'ORY', name: 'Orly Airport', city: 'Paris', country: 'France', timezone: 'Europe/Paris' },
  { iata: 'NCE', name: "Côte d'Azur Airport", city: 'Nice', country: 'France', timezone: 'Europe/Paris' },
  { iata: 'MRS', name: 'Marseille Provence', city: 'Marseille', country: 'France', timezone: 'Europe/Paris' },
  // Germany
  { iata: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', timezone: 'Europe/Berlin' },
  { iata: 'MUC', name: 'Munich Airport', city: 'Munich', country: 'Germany', timezone: 'Europe/Berlin' },
  { iata: 'HAM', name: 'Hamburg Airport', city: 'Hamburg', country: 'Germany', timezone: 'Europe/Berlin' },
  { iata: 'DUS', name: 'Düsseldorf Airport', city: 'Düsseldorf', country: 'Germany', timezone: 'Europe/Berlin' },
  { iata: 'BER', name: 'Brandenburg Airport', city: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin' },
  // Italy
  { iata: 'FCO', name: 'Fiumicino Airport', city: 'Rome', country: 'Italy', timezone: 'Europe/Rome' },
  { iata: 'MXP', name: 'Malpensa Airport', city: 'Milan', country: 'Italy', timezone: 'Europe/Rome' },
  { iata: 'VCE', name: 'Marco Polo Airport', city: 'Venice', country: 'Italy', timezone: 'Europe/Rome' },
  { iata: 'NAP', name: 'Naples International', city: 'Naples', country: 'Italy', timezone: 'Europe/Rome' },
  { iata: 'PSA', name: 'Galileo Galilei Airport', city: 'Pisa', country: 'Italy', timezone: 'Europe/Rome' },
  // Portugal
  { iata: 'LIS', name: 'Humberto Delgado Airport', city: 'Lisbon', country: 'Portugal', timezone: 'Europe/Lisbon' },
  { iata: 'OPO', name: 'Francisco Sá Carneiro Airport', city: 'Porto', country: 'Portugal', timezone: 'Europe/Lisbon' },
  { iata: 'FAO', name: 'Faro Airport', city: 'Faro', country: 'Portugal', timezone: 'Europe/Lisbon' },
  // Greece
  { iata: 'ATH', name: 'Eleftherios Venizelos Airport', city: 'Athens', country: 'Greece', timezone: 'Europe/Athens' },
  { iata: 'SKG', name: 'Makedonia Airport', city: 'Thessaloniki', country: 'Greece', timezone: 'Europe/Athens' },
  { iata: 'HER', name: 'Nikos Kazantzakis Airport', city: 'Heraklion', country: 'Greece', timezone: 'Europe/Athens' },
  { iata: 'CFU', name: 'Ioannis Kapodistrias Airport', city: 'Corfu', country: 'Greece', timezone: 'Europe/Athens' },
  { iata: 'RHO', name: 'Diagoras Airport', city: 'Rhodes', country: 'Greece', timezone: 'Europe/Athens' },
  // Czech Republic
  { iata: 'PRG', name: 'Václav Havel Airport', city: 'Prague', country: 'Czech Republic', timezone: 'Europe/Prague' },
  // Austria
  { iata: 'VIE', name: 'Vienna International Airport', city: 'Vienna', country: 'Austria', timezone: 'Europe/Vienna' },
  // Hungary
  { iata: 'BUD', name: 'Ferenc Liszt Airport', city: 'Budapest', country: 'Hungary', timezone: 'Europe/Budapest' },
  // Poland
  { iata: 'WAW', name: 'Chopin Airport', city: 'Warsaw', country: 'Poland', timezone: 'Europe/Warsaw' },
  { iata: 'KRK', name: 'John Paul II Airport', city: 'Kraków', country: 'Poland', timezone: 'Europe/Warsaw' },
  { iata: 'GDN', name: 'Lech Wałęsa Airport', city: 'Gdańsk', country: 'Poland', timezone: 'Europe/Warsaw' },
  // Ireland
  { iata: 'DUB', name: 'Dublin Airport', city: 'Dublin', country: 'Ireland', timezone: 'Europe/Dublin' },
  { iata: 'ORK', name: 'Cork Airport', city: 'Cork', country: 'Ireland', timezone: 'Europe/Dublin' },
  // Belgium
  { iata: 'BRU', name: 'Brussels Airport', city: 'Brussels', country: 'Belgium', timezone: 'Europe/Brussels' },
  // Denmark
  { iata: 'CPH', name: 'Kastrup Airport', city: 'Copenhagen', country: 'Denmark', timezone: 'Europe/Copenhagen' },
  // Sweden
  { iata: 'ARN', name: 'Arlanda Airport', city: 'Stockholm', country: 'Sweden', timezone: 'Europe/Stockholm' },
  { iata: 'GOT', name: 'Landvetter Airport', city: 'Gothenburg', country: 'Sweden', timezone: 'Europe/Stockholm' },
  // Norway
  { iata: 'OSL', name: 'Gardermoen Airport', city: 'Oslo', country: 'Norway', timezone: 'Europe/Oslo' },
  // Finland
  { iata: 'HEL', name: 'Helsinki-Vantaa Airport', city: 'Helsinki', country: 'Finland', timezone: 'Europe/Helsinki' },
  // Switzerland
  { iata: 'ZRH', name: 'Zürich Airport', city: 'Zürich', country: 'Switzerland', timezone: 'Europe/Zurich' },
  { iata: 'GVA', name: 'Geneva Airport', city: 'Geneva', country: 'Switzerland', timezone: 'Europe/Zurich' },
  // Iceland
  { iata: 'KEF', name: 'Keflavík International Airport', city: 'Reykjavík', country: 'Iceland', timezone: 'Atlantic/Reykjavik' },
  // Croatia
  { iata: 'DBV', name: 'Dubrovnik Airport', city: 'Dubrovnik', country: 'Croatia', timezone: 'Europe/Zagreb' },
  { iata: 'SPU', name: 'Split Airport', city: 'Split', country: 'Croatia', timezone: 'Europe/Zagreb' },
  { iata: 'ZAG', name: 'Zagreb Airport', city: 'Zagreb', country: 'Croatia', timezone: 'Europe/Zagreb' },
  // Romania
  { iata: 'OTP', name: 'Henri Coandă Airport', city: 'Bucharest', country: 'Romania', timezone: 'Europe/Bucharest' },
  // Bulgaria
  { iata: 'SOF', name: 'Sofia Airport', city: 'Sofia', country: 'Bulgaria', timezone: 'Europe/Sofia' },
  // Turkey
  { iata: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey', timezone: 'Europe/Istanbul' },
  { iata: 'SAW', name: 'Sabiha Gökçen Airport', city: 'Istanbul', country: 'Turkey', timezone: 'Europe/Istanbul' },
  { iata: 'AYT', name: 'Antalya Airport', city: 'Antalya', country: 'Turkey', timezone: 'Europe/Istanbul' },
  // Cyprus
  { iata: 'LCA', name: 'Larnaca Airport', city: 'Larnaca', country: 'Cyprus', timezone: 'Asia/Nicosia' },
  { iata: 'PFO', name: 'Paphos Airport', city: 'Paphos', country: 'Cyprus', timezone: 'Asia/Nicosia' },
  // Malta
  { iata: 'MLA', name: 'Malta International Airport', city: 'Valletta', country: 'Malta', timezone: 'Europe/Malta' },
  // Israel
  { iata: 'TLV', name: 'Ben Gurion Airport', city: 'Tel Aviv', country: 'Israel', timezone: 'Asia/Jerusalem' },
  // UAE
  { iata: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai' },
  { iata: 'AUH', name: 'Abu Dhabi International', city: 'Abu Dhabi', country: 'UAE', timezone: 'Asia/Dubai' },
  // USA
  { iata: 'JFK', name: 'John F. Kennedy International', city: 'New York', country: 'USA', timezone: 'America/New_York' },
  { iata: 'EWR', name: 'Newark Liberty International', city: 'New York', country: 'USA', timezone: 'America/New_York' },
  { iata: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'USA', timezone: 'America/Los_Angeles' },
  { iata: 'MIA', name: 'Miami International Airport', city: 'Miami', country: 'USA', timezone: 'America/New_York' },
  { iata: 'BOS', name: 'Logan International Airport', city: 'Boston', country: 'USA', timezone: 'America/New_York' },
  // Morocco
  { iata: 'RAK', name: 'Marrakesh Menara Airport', city: 'Marrakesh', country: 'Morocco', timezone: 'Africa/Casablanca' },
  { iata: 'CMN', name: 'Mohammed V Airport', city: 'Casablanca', country: 'Morocco', timezone: 'Africa/Casablanca' },
]

const _byIata = new Map<string, Airport>(ALL_AIRPORTS.map(a => [a.iata, a]))

export function getAirport(iata: string): Airport | undefined {
  return _byIata.get(iata.toUpperCase())
}

export function searchAirports(query: string): Airport[] {
  if (!query.trim()) return []
  const q = query.toLowerCase()
  return ALL_AIRPORTS.filter(
    a =>
      a.iata.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q),
  ).slice(0, 8)
}
