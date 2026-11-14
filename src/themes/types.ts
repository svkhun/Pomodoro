import type { ComponentType } from 'react'
import type { Phase } from '../timer'
import type { DialProps } from '../art/Dials'
import type { IconName } from '../icons'
export type Theme = {
  id: string, name: string, title: string, icon: IconName, order: number,
  matches: (date: Date) => boolean,
  tokens: { sky: string, horizon: string, accent: string, surface: string, heading: string },
  moods: Record<Phase, { light: string, speed: number }>,
  particles: { kind: 'snow' | 'ember' | 'water', color: string, count: number },
  notes: number[], Scene: ComponentType, Dial: ComponentType<DialProps>, Canopy?: ComponentType
}
