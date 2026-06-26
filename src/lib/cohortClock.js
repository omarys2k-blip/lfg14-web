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

export function getDayDateKey(dayIndex) {
  return getDayDate(dayIndex).toISOString().split('T')[0]
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
