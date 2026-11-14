import { memo } from 'react'
import { noise } from './Winter'
function River({bright}:{bright:boolean}) {
  return <svg className="world-art" viewBox="0 0 1600 820" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
    <defs><linearGradient id="river-surface" x2="0" y2="1"><stop stopColor={bright?'#64b7b3':'#786475'}/><stop offset="1" stopColor={bright?'#37868f':'#282944'}/></linearGradient></defs>
    <g className="sky-layer"><circle cx="1260" cy="169" r={bright?40:25} fill={bright?'#ffdd99':'#f4ce9e'}/>
    {Array.from({length:bright?12:50},(_,i)=><circle key={i} cx={noise(i)*1600} cy={noise(i+99)*390} r={bright?3:1.5} fill="#fff1cf" opacity=".6"/>)}</g>
    <g className="far-layer"><path d="M-30 493q176-183 354-72t326 4q169-118 331-40t288-8q170-95 360 47v170H-30z" fill={bright?'#6eafa5':'#55475d'}/>
    <path d="M-30 526q112-8 214-51l83 3 62-22 104 34 144 1 143 44 172-32 144-7 118-29 143 2 116-43 206 42v90H-30z" fill={bright?'#488c87':'#38374f'}/></g>
    <path d="M-40 533q236-34 494-6t512 2 699-28v345H-40z" fill="url(#river-surface)"/>
    {Array.from({length:110},(_,i)=><path key={i} d={`M${noise(i)*1600} ${540+noise(i+98)*280}q${9+noise(i+2)*22} -2 ${23+noise(i+2)*47} 0`} fill="none" stroke={bright?'#c4eee7':'#f0c5a0'} opacity={.09+noise(i)*.2} strokeWidth="2"/>)}
    {bright ? Array.from({length:16},(_,i)=><g key={i} transform={`translate(${noise(i)*1600} ${585+noise(i+8)*160}) scale(${.3+noise(i+21)})`}><path d="M-46 0q28 18 81 0-10 20-57 17z" fill="#a35340"/><path d="M-21 4q11-42 24 1m-10-12q14-42 29-8" fill="none" stroke="#c9f5e9" strokeWidth="4"/></g>) :
    Array.from({length:26},(_,i)=>{const floating=i%2===0;return <g key={i} transform={`translate(${noise(i)*1600} ${floating?110+noise(i+5)*335:553+noise(i+8)*173}) scale(${.3+noise(i+4)*.65})`}><g className="floating-light">{floating?<><path d="M-15-26q13-6 30 0l-5 29h-20z" fill="#efa86c"/><ellipse rx="10" ry="3" cy="4" fill="#ffe9aa"/></>:<><path d="m-23 0 13 2L0-8l8 10 15-2-10 11h-27z" fill="#95906d"/><path d="M0 0v-8" stroke="#f9ce90" strokeWidth="3"/><ellipse rx="3" ry="6" cy="-13" fill="#ffe5a0"/></>}</g></g>})}
  </svg>
}
export const LanternRiver = memo(()=> <River bright={false}/>)
export const SplashRiver = memo(()=> <River bright/>)
