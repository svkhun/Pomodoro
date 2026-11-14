export type Phase = 'focus' | 'short' | 'long'
export type Durations = Record<Phase, number>
export const names: Record<Phase, string> = { focus: 'Focus', short: 'Short break', long: 'Long break' }
export const defaults: Durations = { focus: 25, short: 5, long: 15 }
export type Clock = {
  phase: Phase
  duration: number
  remaining: number
  endsAt: number | null
  cycle: number
  days: Record<string, { count: number, minutes: number }>
}
export const dayKey = (t: number) => new Date(t).toLocaleDateString('en-CA')
export const left = (clock: Clock, now: number) => Math.max(0, clock.endsAt === null ? clock.remaining : clock.endsAt - now)
export function fresh(phase: Phase, durations: Durations, prior?: Clock): Clock {
  const duration = durations[phase] * 60000
  return { phase, duration, remaining: duration, endsAt: null, cycle: prior?.cycle ?? 0, days: prior?.days ?? {} }
}
export function toggle(clock: Clock, now: number): Clock {
  if (clock.endsAt === null) return { ...clock, endsAt: now + clock.remaining }
  return { ...clock, remaining: left(clock, now), endsAt: null }
}
export function advance(clock: Clock, durations: Durations, auto: boolean, at: number, completed: boolean) {
  let { cycle, days } = clock
  let next: Phase = 'focus'
  if (clock.phase === 'focus') {
    if (completed) {
      const key = dayKey(at)
      const today = days[key] ?? { count: 0, minutes: 0 }
      days = { ...days, [key]: { count: today.count + 1, minutes: today.minutes + clock.duration / 60000 } }
      cycle = (cycle + 1) % 4
    }
    next = completed && cycle === 0 ? 'long' : 'short'
  }
  const result = fresh(next, durations, { ...clock, cycle, days })
  return auto ? toggle(result, at) : result
}
// Each new deadline is anchored to the previous deadline, including after sleep.
export function catchUp(clock: Clock, durations: Durations, auto: boolean, now: number) {
  let result = clock
  while (result.endsAt !== null && result.endsAt <= now) {
    result = advance(result, durations, auto, result.endsAt, true)
  }
  return result
}
