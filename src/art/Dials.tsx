import { noise } from './Winter'
export type DialProps = { progress: number }
function Spark({x,y,s=1}:{x:number,y:number,s?:number}) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="m0-5 1.1 3.9L5 0 1.1 1.1 0 5-1.1 1.1-5 0l3.9-1.1z" fill="#ffe8b7"/>
}
export function Ornament({progress}:DialProps) {
  return <svg className="dial-art" viewBox="0 0 360 350" aria-hidden="true">
    <defs>
      <radialGradient id="bauble" cx=".36" cy=".2" r=".88"><stop stopColor="#dc6460"/><stop offset=".35" stopColor="#af393b"/><stop offset=".72" stopColor="#882a32"/><stop offset=".92" stopColor="#5c2532"/><stop offset="1" stopColor="#a85248"/></radialGradient>
      <linearGradient id="gold"><stop stopColor="#92633e"/><stop offset=".24" stopColor="#ffdfa0"/><stop offset=".48" stopColor="#b38550"/><stop offset=".68" stopColor="#f1cd8e"/><stop offset="1" stopColor="#80552f"/></linearGradient>
      <linearGradient id="etch" x2="0" y2="1"><stop stopColor="#ffe0ac"/><stop offset="1" stopColor="#b78863"/></linearGradient>
      <clipPath id="bauble-clip"><circle cx="180" cy="195" r="132"/></clipPath>
    </defs>
    <path d="M180-5v34" stroke="#e5c78b" strokeWidth="1.25"/>
    <path d="M180 41c-18-5-11-18-4-16 6 1 7 9 4 17 5-12 11-15 13-11 2 5-4 10-13 11z" fill="none" stroke="url(#gold)" strokeWidth="2"/>
    <ellipse cx="180" cy="200" rx="139" ry="136" fill="#192437" opacity=".14"/>
    <circle cx="180" cy="195" r="133" fill="url(#bauble)" stroke="url(#gold)" strokeWidth="2"/>
    <g clipPath="url(#bauble-clip)">
      <path d="M73 144q19-63 83-72" stroke="#ffe3bd" opacity=".32" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      {Array.from({length:74},(_,i)=><circle key={i} cx={50+noise(i)*260} cy={70+noise(i+60)*250} r={.5+noise(i+12)*.7} fill="#f6d3a3" opacity=".51"/>)}
      {[[97,125,.64],[252,141,.68],[85,208,.8],[263,210,.7],[210,99,.72],[142,252,.52],[226,243,.55],[124,104,.45]].map(([x,y,s])=><Spark key={x} x={x} y={y} s={s}/>)}
      <path d="M46 276q42-13 74 1t67 3q39-14 82-1t51 0M48 284q44-14 84 0t95-1 82 4" fill="none" stroke="#e1b786" strokeWidth="1.15" opacity=".75"/>
      {[ [84,282,.81],[103,282,1.1],[123,285,.65],[210,280,.66],[233,279,1.2],[248,278,.72],[265,279,1.04] ].map(([x,y,s])=><g key={x} transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke="url(#etch)" strokeWidth="1.45" strokeLinejoin="round"><path d="M0 0v-31m0 3-5 8 5-2 5 2-5-8m0 9-8 9 8-3 8 3-8-9m0 10-11 9 11-3 11 3-11-9"/></g>)}
      <path d="M150 281v-12l10-8 10 8v12m-22-11 12-11 13 10m-15 12v-7h4v7m12-2v-9l7-6 8 6v8m-17-8 9-8 10 8" fill="none" stroke="#e8c495" strokeWidth="1.35"/>
    </g>
    <circle cx="180" cy="195" r="125" fill="none" stroke="#f4d4a0" opacity=".35" strokeWidth=".85"/>
    {Array.from({length:72},(_,i)=>{
      const a=i*Math.PI/36-Math.PI/2, on=i<Math.ceil(72*progress)
      return <circle key={i} cx={180+128*Math.cos(a)} cy={195+128*Math.sin(a)} r={i%3===0?1.7:1.04} fill={on?'#ffe0a8':'#854643'} />
    })}
    <path d="M161 43q19-4 38 0l4 24-6-3-5 4-6-5-6 4-5-4-7 5-5-4-6 2z" fill="url(#gold)" stroke="#e8c28a" strokeWidth="1"/>
    <path d="m164 46-2 15m8-16-1 17m7-17v17m7-17v17m6-17 1 17m5-16 2 15" stroke="#785539" opacity=".6" strokeWidth="1.5"/>
    <rect x="160" y="40" width="40" height="6" rx="2.5" fill="url(#gold)"/>
  </svg>
}
export function LanternDial({progress}:DialProps) {
  return <svg className="dial-art" viewBox="0 0 360 350" aria-hidden="true"><defs><radialGradient id="silk"><stop stopColor="#984b38"/><stop offset=".72" stopColor="#843c31"/><stop offset="1" stopColor="#c58049"/></radialGradient></defs><path d="M180 0v51" stroke="#eac58d"/><rect x="139" y="48" width="82" height="10" rx="4" fill="#d8af75"/>
    <path d="M144 57c-47 22-83 59-83 125s38 102 81 121h76c43-19 81-55 81-121S263 79 216 57z" fill="url(#silk)" stroke="#efc589" strokeWidth="2"/>
    {[0,1,2,3,4,5].map(i=><path key={i} d={`M${144+i*14} 59q${(i-2.5)*48} 123 0 240`} stroke="#ffe2a3" fill="none" opacity=".25"/>)}
    <path d="M140 301h80" stroke="#c5955c" strokeWidth="8"/><path d="M180 307v23m-4-13-2 17m10-17 2 17" stroke="#e2af68" strokeWidth="3"/>
    <path d="M88 254q92 54 184 0" fill="none" pathLength="1" stroke="#f4cf8b" strokeWidth="3" strokeDasharray={`${progress} 1`}/></svg>
}
export function WaterDial({progress}:DialProps) {
  return <svg className="dial-art" viewBox="0 0 360 350" aria-hidden="true"><defs><radialGradient id="water" cx=".34" cy=".24" r=".85"><stop stopColor="#34898b"/><stop offset=".72" stopColor="#186a80"/><stop offset="1" stopColor="#144e69"/></radialGradient></defs>
    <path d="M180 42c-13 42-121 84-121 158a121 121 0 0 0 242 0c0-73-107-118-121-158z" fill="url(#water)" stroke="#d4f7e8" strokeWidth="2"/>
    <path d="M84 166q11-34 56-64" fill="none" stroke="#abf5e8" strokeWidth="3" strokeLinecap="round"/><path d="M84 244q29-17 64 0t67 0 58 0" stroke="#c3fbeb" fill="none" pathLength="1" strokeDasharray={`${progress} 1`} strokeWidth="3"/>
    {[[76,90,7],[248,67,8],[288,112,5],[92,58,3]].map(([x,y,r])=><circle key={x} cx={x} cy={y} r={r} fill="#b0eddb"/>)}</svg>
}
