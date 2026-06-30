import { useState, useEffect } from 'react'

const START = new Date('2026-07-01T00:00:00')

export function getCohortDay() {
  const now = new Date()
  const diff = Math.floor((now - START) / 86400000)
  const day = diff + 1
  if (day < 1 || day > 14) return null
  return day
}

export function getCohortWeek(day) {
  if (!day) return null
  return day <= 7 ? 1 : 2
}

export function getDayDate(dayIndex) {
  const d = new Date(START)
  d.setDate(d.getDate() + dayIndex - 1)
  return d
}

// Formats a Date using its LOCAL year/month/day — never use .toISOString()
// for this, since that converts through UTC and can shift the date by a
// full day for any timezone ahead of UTC (e.g. UAE, UTC+4).
export function toLocalDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function getDayDateKey(dayIndex) {
  return toLocalDateKey(getDayDate(dayIndex))
}

// "Mon", "Tue", etc.
export function getDayShort(dayIndex) {
  return getDayDate(dayIndex).toLocaleDateString('en-US', { weekday: 'short' })
}

// Single letter: M T W T F S S
export function getDayLetter(dayIndex) {
  return getDayDate(dayIndex).toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)
}

export function getDayFull(dayIndex) {
  return getDayDate(dayIndex).toLocaleDateString('en-US', { weekday: 'long' })
}

// Reactive version of getCohortDay() — if this were computed once at module
// load (as it was before), a PWA left open across midnight would freeze on
// yesterday's day number, calendar ring, and week until force-closed and
// reopened. This re-checks whenever the app regains focus, plus a periodic
// backup check, so the day always catches up without a manual refresh.
export function useCohortDay() {
  const [day, setDay] = useState(getCohortDay())

  useEffect(() => {
    function refresh() {
      setDay(getCohortDay())
    }
    document.addEventListener('visibilitychange', refresh)
    window.addEventListener('focus', refresh)
    const interval = setInterval(refresh, 60_000)
    return () => {
      document.removeEventListener('visibilitychange', refresh)
      window.removeEventListener('focus', refresh)
      clearInterval(interval)
    }
  }, [])

  return day
}
