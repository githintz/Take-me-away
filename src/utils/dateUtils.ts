export interface WeekendPair {
  friday: string   // "YYYY-MM-DD"
  sunday: string   // "YYYY-MM-DD"
  label: string    // "Fri 3 Apr – Sun 5 Apr"
}

const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** Returns the ISO date string "YYYY-MM-DD" for the given local Date */
function toDateStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function shortDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  return `${SHORT_DAYS[d.getDay()]} ${d.getDate()} ${SHORT_MONTHS[d.getMonth()]}`
}

/** Returns next N upcoming Friday→Sunday pairs starting from today */
export function getUpcomingWeekends(count = 6): WeekendPair[] {
  const pairs: WeekendPair[] = []
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  // Find next Friday (day 5)
  const day = now.getDay()
  const daysUntilFriday = (5 - day + 7) % 7 || 7
  const nextFriday = new Date(now)
  nextFriday.setDate(now.getDate() + daysUntilFriday)

  for (let i = 0; i < count; i++) {
    const friday = new Date(nextFriday)
    friday.setDate(nextFriday.getDate() + i * 7)
    const sunday = new Date(friday)
    sunday.setDate(friday.getDate() + 2)

    const fridayStr = toDateStr(friday)
    const sundayStr = toDateStr(sunday)
    pairs.push({
      friday: fridayStr,
      sunday: sundayStr,
      label: `${shortDate(fridayStr)} – ${shortDate(sundayStr)}`,
    })
  }
  return pairs
}

/** "2h 35m" from total minutes */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

/** "Fri 3 Apr · 18:30" from ISO date-time string */
export function formatDateTime(iso: string): string {
  // iso is like "2026-04-03T18:30:00" — treat as local
  const [datePart, timePart] = iso.split('T')
  if (!datePart || !timePart) return iso
  const d = new Date(datePart + 'T12:00:00')
  const time = timePart.substring(0, 5)
  return `${SHORT_DAYS[d.getDay()]} ${d.getDate()} ${SHORT_MONTHS[d.getMonth()]} · ${time}`
}

/** "18:30" from ISO date-time string */
export function formatTime(iso: string): string {
  const timePart = iso.split('T')[1]
  return timePart ? timePart.substring(0, 5) : iso
}

/** "Fri 3 Apr" from ISO date string */
export function formatShortDate(iso: string): string {
  const datePart = iso.split('T')[0]
  if (!datePart) return iso
  return shortDate(datePart)
}

/** Extract hour (0–23) from ISO date-time string */
export function extractHour(iso: string): number {
  const timePart = iso.split('T')[1]
  if (!timePart) return 0
  return parseInt(timePart.substring(0, 2), 10)
}

/** Shift an ISO date-time string by the given millisecond offset */
export function shiftIso(iso: string, shiftMs: number): string {
  const d = new Date(iso)
  d.setTime(d.getTime() + shiftMs)
  // Format as local ISO (no Z suffix)
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  )
}

/**
 * Fraction of the weekend (Fri 23:59 → Sun 23:59, 48h) spent at the destination.
 * Higher = better weekend use.
 */
export function computeWeekendFraction(outboundArrIso: string, inboundDepIso: string): number {
  const arrMs = new Date(outboundArrIso).getTime()
  const depMs = new Date(inboundDepIso).getTime()
  const atDestMs = Math.max(0, depMs - arrMs)
  const weekendMs = 48 * 60 * 60 * 1000
  return Math.min(1, atDestMs / weekendMs)
}

/** Format hour as "16:00" */
export function hourLabel(h: number): string {
  return `${String(h).padStart(2, '0')}:00`
}
