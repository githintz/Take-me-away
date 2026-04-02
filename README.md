# Take Me Away ✈️ — Weekend Flight Planner

> Find the best weekend escape flights. Filter by exact departure windows, budget, and stops. 100% free — no account, no API key, no backend.

## Live Demo

After deploying: `https://<your-github-username>.github.io/Take-me-away/`

## Why this exists

Cheap flights often depart at terrible times — 6am Saturday, or returning Sunday at noon. This tool lets you search within **exact time windows** (e.g. Friday 16:00–22:00 outbound, Sunday 14:00–23:00 return) so you only see flights that actually give you a useful weekend away.

---

## Features

| Feature | Details |
|---|---|
| Time window filtering | Outbound + return departure hour ranges (dual slider) |
| Multi-origin | Search from multiple airports simultaneously |
| "Anywhere" destination | Leave destination open for inspiration |
| Weekend picker | Next 8 upcoming weekends, selectable |
| Flexible dates | ±1 day toggle for more results |
| Best Weekend Score | Algorithm scores each itinerary 0–100 on destination time, price, directness, timing |
| Sort | Price · Duration · Outbound time · Return time · Stops |
| Two views | Card list + sortable table |
| Deep links | Opens Google Flights, Skyscanner, Kiwi pre-filled with your route + filters |
| Preset saving | Save named filter sets to localStorage — no account needed |
| Mobile-friendly | Responsive, slide-in filter drawer on small screens |

---

## How it's free to run

**Zero ongoing cost.** The app is a fully static site:

- Hosted on **GitHub Pages** (free)
- All filtering runs **client-side** in the browser
- Flight data uses a **mock dataset** of 25 realistic itineraries
- Clicking any result opens **Google Flights / Skyscanner / Kiwi** — the aggregators do the real search, for free

No server. No database. No API keys. No bills.

---

## Tech Stack

- **React 18** + **TypeScript** (strict mode)
- **Vite 5** (build tool, `base: '/Take-me-away/'` for GitHub Pages)
- **Tailwind CSS 4** (`@tailwindcss/vite` plugin)
- **lucide-react** (icons)
- **gh-pages** (manual deploy script)
- **GitHub Actions** (automatic deploy on push to `main`)

---

## Getting Started

```bash
git clone https://github.com/<you>/Take-me-away.git
cd Take-me-away
npm install
npm run dev
# → http://localhost:5173/Take-me-away/
```

### Build for production

```bash
npm run build
npm run preview   # preview the production build locally
```

### Deploy manually to GitHub Pages

```bash
npm run deploy    # runs build then gh-pages -d dist
```

### Deploy via GitHub Actions (automatic)

Push to `main` — the workflow in `.github/workflows/deploy.yml` builds and publishes to the `gh-pages` branch automatically.

Enable GitHub Pages in your repo settings:
- **Settings → Pages → Source → Deploy from branch → `gh-pages` → `/ (root)`**

---

## Project Structure

```
src/
├── types/          TypeScript interfaces (flight, filters, provider, presets)
├── data/           mockFlights.ts — 25 hand-crafted itineraries
├── utils/          airports, dateUtils, filterUtils, scoring
├── services/
│   ├── FlightProvider.ts        Interface + factory (swap providers via env var)
│   ├── providers/
│   │   └── MockFlightProvider.ts
│   └── deeplinks/
│       ├── googleFlights.ts
│       ├── skyscanner.ts
│       └── kiwi.ts
├── hooks/          useFilters, useFlights, usePresets, useSortedFlights, useWeekends
└── components/
    ├── ui/         Button, Badge, Slider
    ├── filters/    FilterPanel, AirportSelect, DateRangePicker, DepartureWindowPicker, ...
    ├── results/    FlightCard, FlightTable, ResultsList, BestPick, AggregatorLinks, ...
    └── layout/     AppHeader, AppLayout, EmptyState
```

---

## Adding a Real Flight API

The `FlightProvider` interface is the single extension point:

```ts
// src/types/provider.ts
export interface FlightProvider {
  readonly name: string
  readonly supportsRealtime: boolean
  search(query: FlightQuery): Promise<FlightResult>
}
```

**Steps to add a new provider:**

1. Create `src/services/providers/YourProvider.ts`
2. Implement `FlightProvider` — `search()` receives `{ filters, outboundDate, inboundDate }`
3. Add a case to the factory in `src/services/FlightProvider.ts`
4. Set `VITE_PROVIDER=yourprovider` in `.env.local`

**Free-tier APIs worth trying:**

| API | Free tier | Notes |
|---|---|---|
| Amadeus Self-Service | 2,000 calls/month | IATA route search, needs signup |
| Aviationstack | 500 calls/month | Basic schedule data |
| AviationEdge | 100 calls/month | Schedules only |

None of these provide real-time pricing — you'll likely need to keep the deep-link approach for booking.

---

## Weekend Scoring Algorithm

Each itinerary is scored 0–100:

| Component | Weight | What it measures |
|---|---|---|
| Destination time | 40% | Hours actually at destination ÷ 48h weekend |
| Price efficiency | 30% | Inverse of price relative to result-set median |
| Directness | 20% | Direct=100, 1-stop=75, 2-stop=50 |
| Outbound timing | 10% | Fri 17–20:00 ideal, tapers off earlier/later |

The "Best Weekend Pick" badge goes to the highest-scoring result.

---

## Deep Link URL Formats

### Google Flights
```
https://www.google.com/travel/flights#flt=LHR.BCN.2026-04-03*BCN.LHR.2026-04-05;c:GBP;e:1;s:1;sd:1;t:f
```

### Skyscanner
```
https://www.skyscanner.net/transport/flights/lhr/bcn/260403/260405/?adults=1&cabinclass=economy&rtn=1&preferdirects=false
```

### Kiwi.com
```
https://www.kiwi.com/deep?from=LHR&to=BCN&departure=2026-04-03&return=2026-04-05&adults=1&cabinClass=ECONOMY
```

---

## localStorage Keys

| Key | Contents |
|---|---|
| `tma_filters` | Current filter state (persisted across sessions) |
| `tma_presets` | Saved named filter presets |

Clear with `localStorage.removeItem('tma_filters')` in the browser console.

---

## License

MIT
