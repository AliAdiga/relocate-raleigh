import eventsData from './events.json'

export const EVENT_CATEGORIES = [
  'Networking',
  'Cultural',
  'Tech',
  'Family',
  'Outdoor',
] as const

export type EventCategory = (typeof EVENT_CATEGORIES)[number]

export type CalendarEvent = {
  title: string
  date: string
  location: string
  category: EventCategory
  url: string | null
  summary: string
}

const MONTH_ABBR = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
]

export function formatDateLabel(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map((part) => Number(part))
  if (!year || !month || !day) return isoDate
  return `${MONTH_ABBR[month - 1]} ${String(day).padStart(2, '0')}`
}

/** Today's date in the Triangle's time zone (YYYY-MM-DD), so evening visits don't drop same-day events. */
function triangleToday(now: Date) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now)
}

export function getUpcomingEvents(limit = 3, now: Date = new Date()): CalendarEvent[] {
  const today = triangleToday(now)
  return (eventsData.events as CalendarEvent[])
    .filter((e) => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, limit)
}

export function getAllUpcomingEvents(now: Date = new Date()): CalendarEvent[] {
  const today = triangleToday(now)
  return (eventsData.events as CalendarEvent[])
    .filter((e) => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
}

export function formatMonthLabel(yearMonth: string): string {
  const [year, month] = yearMonth.split('-').map(Number)
  if (!year || !month) return yearMonth
  const date = new Date(year, month - 1, 1)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

/** Days since the events feed was last generated. */
export function eventsFeedAgeDays(generatedAt: string, now: Date = new Date()): number {
  return Math.floor((now.getTime() - new Date(generatedAt).getTime()) / 86_400_000)
}
