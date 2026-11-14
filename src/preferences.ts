import { defaults, type Clock, type Durations, fresh } from './timer'

export type Preferences = { durations: Durations, auto: boolean, muted: boolean, volume: number, notifications: boolean, theme: string }
const base: Preferences = { durations: defaults, auto: false, muted: false, volume: 0.36, notifications: false, theme: 'auto' }
export const keys = { clock: 'festive-focus.clock.1', prefs: 'festive-focus.preferences.1' }
function read(key: string) {
  try { return JSON.parse(localStorage.getItem(key) ?? 'null') } catch { return null }
}
export function save(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* Storage is optional in private browsing. */ }
}
export function readPrefs(): Preferences {
  const p = read(keys.prefs)
  if (!p) return base
  const durations = { ...defaults }
  for (const phase of ['focus', 'short', 'long'] as const) {
    const minutes = p.durations?.[phase]
    if (Number.isInteger(minutes) && minutes >= 1 && minutes <= 180) durations[phase] = minutes
  }
  return { durations, auto: p.auto === true, muted: p.muted === true, notifications: p.notifications === true,
    volume: Number.isFinite(p.volume) ? Math.max(0, Math.min(1, p.volume)) : base.volume,
    theme: typeof p.theme === 'string' ? p.theme : 'auto' }
}
export function readClock(durations: Durations): Clock {
  const c = read(keys.clock)
  if (c && Object.hasOwn(defaults, c.phase) && Number.isFinite(c.duration) && c.duration >= 60000 && c.duration <= 10800000 &&
    Number.isFinite(c.remaining) && c.remaining >= 0 && c.remaining <= c.duration &&
    (c.endsAt === null || Number.isSafeInteger(c.endsAt)) && Number.isInteger(c.cycle) && c.cycle >= 0 && c.cycle <= 3 &&
    c.days && typeof c.days === 'object' && Object.values(c.days).every(d => {
      const day = d as {count: number, minutes: number}
      return day && Number.isInteger(day.count) && day.count >= 0 && Number.isFinite(day.minutes) && day.minutes >= 0
    })) return c
  return fresh('focus', durations)
}
