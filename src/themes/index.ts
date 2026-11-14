import type { Theme } from './types'
// Each folder contributes its own descriptor at build time, with no central switch.
const modules = import.meta.glob<{default: Theme}>('./*/theme.ts', { eager: true })
export const themes = Object.values(modules).map(m=>m.default).sort((a,b)=>a.order-b.order)
export function resolveTheme(choice: string, date: Date) {
  return themes.find(t=>t.id===choice) ?? themes.find(t=>t.matches(date)) ?? themes[0]
}
