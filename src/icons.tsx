const paths = {
  tree: 'm12 2-5 6h3l-6 6h4l-5 5h18l-5-5h4l-6-6h3z M12 19v3',
  gear: 'm9 3 1-1h4l1 3 2 1 3-.4 2 3-2 2v3l2 2-2 3-3-.4-2 1-1 3h-4l-1-3-2-1-3 .4-2-3 2-2v-3l-2-2 2-3 3 .4 2-1z M15.5 12a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0',
  sound: 'M3 9h4l5-4v14l-5-4H3z M16 8q4 4 0 8 M19 5q7 7 0 14',
  mute: 'M3 9h4l5-4v14l-5-4H3z M16 9l6 6m0-6-6 6',
  down: 'm7 10 5 5 5-5', close: 'm6 6 12 12m0-12L6 18',
  play: 'm8 5 11 7-11 7z', pause: 'M8 5v14m8-14v14',
  reset: 'M4 5v6h6 M4 11a8 8 0 1 1 1 7', skip: 'm5 5 10 7-10 7z M19 5v14',
  clock: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0 M12 6v6l4 2',
  coffee: 'M3 9h14v5a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6z M17 9h2a3 3 0 0 1 0 6h-2 M6 3v3m4-4v4m4-3v3',
  moon: 'M20 15A9 9 0 0 1 9 3a9 9 0 1 0 11 12z',
  star: 'm12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z',
  flame: 'M12 2c1 6 8 7 8 13a8 8 0 1 1-16 0c0-3 2-6 5-9 0 3 1 4 2 5 2-3 2-5 1-9z',
  check: 'm4 12 5 5L20 6', water: 'M12 2S4 10 4 15a8 8 0 0 0 16 0c0-5-8-13-8-13z',
  lantern: 'M6 7h12l-2 10H8z M8 4h8 M10 20h4', calendar:'M3 5h18v16H3z M7 2v6m10-6v6M3 10h18',
  ornament:'M19 14a7 7 0 1 1-14 0 7 7 0 0 1 14 0 M9 7V4h6v3 M12 4V1 M8 14q0-3 3-4'
}
export type IconName = keyof typeof paths
export function Icon({ name, size = 18 }: { name: IconName, size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={name === 'play' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]}/></svg>
}
