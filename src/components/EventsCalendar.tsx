'use client'

import { useMemo, useState } from 'react'
import {
  EVENT_CATEGORIES,
  formatDateLabel,
  formatMonthLabel,
  type CalendarEvent,
  type EventCategory,
} from '@/data/events'

type Filter = EventCategory | 'All'

const FILTERS: Filter[] = ['All', ...EVENT_CATEGORIES]

export default function EventsCalendar({ events }: { events: CalendarEvent[] }) {
  const [filter, setFilter] = useState<Filter>('All')

  const filtered = useMemo(() => {
    return filter === 'All' ? events : events.filter((e) => e.category === filter)
  }, [events, filter])

  const groups = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    for (const event of filtered) {
      const key = event.date.slice(0, 7)
      const list = map.get(key) ?? []
      list.push(event)
      map.set(key, list)
    }
    return Array.from(map.entries())
  }, [filtered])

  return (
    <div>
      <div className="mb-12 flex flex-wrap gap-2">
        {FILTERS.map((option) => {
          const active = option === filter
          const count =
            option === 'All'
              ? events.length
              : events.filter((e) => e.category === option).length
          return (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              className={
                active
                  ? 'rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper'
                  : 'rounded-full bg-fog px-5 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:text-ink'
              }
              aria-pressed={active}
            >
              {option}
              <span className={active ? 'ml-2 text-paper/70' : 'ml-2 text-stone'}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {groups.length === 0 ? (
        <div className="rounded-[var(--radius-card)] bg-fog px-6 py-16 text-center">
          <p className="text-lg text-ink">
            No upcoming {filter === 'All' ? 'events' : `${filter.toLowerCase()} events`} on the
            calendar yet.
          </p>
          <p className="mt-3 text-sm text-ink-soft">
            Try another category, or browse the everyday resources on the home page.
          </p>
        </div>
      ) : (
        <div className="space-y-14">
          {groups.map(([monthKey, monthEvents]) => (
            <section key={monthKey}>
              <h2 className="mb-6 text-xl font-semibold tracking-tight">
                {formatMonthLabel(monthKey)}
              </h2>
              <ul className="space-y-4">
                {monthEvents.map((event) => (
                  <li key={`${event.date}-${event.title}`}>
                    <EventRow event={event} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

function EventRow({ event }: { event: CalendarEvent }) {
  const dayLabel = formatDateLabel(event.date)
  const [monthAbbr, dayNum] = dayLabel.split(' ')

  const Wrapper = event.url ? 'a' : 'div'
  const wrapperProps = event.url
    ? {
        href: event.url,
        target: '_blank',
        rel: 'noopener noreferrer',
      }
    : {}

  return (
    <Wrapper
      {...wrapperProps}
      className={
        'flex flex-col gap-5 rounded-[var(--radius-card)] border border-line bg-paper p-6 transition-colors md:flex-row md:p-7 ' +
        (event.url ? 'hover:border-[#c9c9c9]' : '')
      }
    >
      <div className="flex md:flex-col items-baseline md:items-center gap-3 md:gap-1 md:w-20 shrink-0">
        <div className="text-sm font-medium capitalize text-ember-deep">
          {monthAbbr.toLowerCase()}
        </div>
        <div className="text-[2.375rem] font-semibold leading-none tracking-tight">{dayNum}</div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="rounded-full bg-fog px-3 py-1 text-xs text-ink">
            {event.category}
          </span>
          <span className="text-sm text-ink-soft">{event.location}</span>
        </div>
        <h3 className="mb-2 text-lg font-semibold leading-snug tracking-tight">
          {event.title}
        </h3>
        <p className="leading-relaxed text-ink-soft">{event.summary}</p>
      </div>
    </Wrapper>
  )
}
