import { memo } from 'react'

// Repeatable silhouettes keep the painted landscape still across timer renders.
export function noise(n: number) {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return v - Math.floor(v)
}
const Pine = ({x,y,s,front=false}:{x:number,y:number,s:number,front?:boolean}) => <g transform={`translate(${x} ${y}) scale(${s})`}>
  <path fill={front?'#182d40':'#31465b'} d="M-3 0v-17h-21l10-12-8 2 12-17-7 2 10-16-5 2L0-82 12-56l-5-2 11 17-7-2 12 17-8-3 12 13H4V0z"/>
  {[-62,-47,-31,-17].map((a,i)=><g key={a}><path d={`M${-6-i*4} ${a+2}q${5+i*2} -3 ${7+i*3} ${-10-i} q2 5 ${6+i*3} ${9+i} l-4 -1 1 2 -5 -2 -2 1 -2 -2z`} fill={front?'#a7b7c4':'#b9c3cd'}/><path d={`M-1 ${a-6}l${-4-i*3} ${7+i} 4 -1-1 2 4 -2z`} fill="#e0dfe0" opacity=".65"/></g>)}
</g>
function Lamp({x,y,s=1}:{x:number,y:number,s?:number}){
  return <g transform={`translate(${x} ${y}) scale(${s})`}><ellipse cy="-1" rx="11" ry="2" fill="#607082" opacity=".45"/><path d="M0 0v-40m-4 41h8" stroke="#374453" strokeWidth="3"/><circle cy="-44" r="24" fill="url(#lamp-glow)"/><path d="m-5-50 1 11h8l2-11z" fill="#ffda8e" stroke="#4d5053" strokeWidth="1.6"/><path d="m-7-50 7-6 8 6z" fill="#404756"/></g>
}
function Cabin({x,y,s,wide=1}:{x:number,y:number,s:number,wide?:number}) {
  return <g transform={`translate(${x} ${y}) scale(${s*wide} ${s})`}>
    <g className="smoke" opacity=".34" fill="none" stroke="#d7c9d0" strokeLinecap="round"><path d="M21-67q10-11 0-20t3-20" strokeWidth="3"/></g>
    <path d="M-31-31 4-64l34 31v33H-31z" fill="#7b504a"/>
    <path d="M4-64 69-57 92-28l-54-5z" fill="#4b4f64"/>
    <path d="m38-33 54 5v28H38z" fill="#543e41"/>
    <path d="M18-58v-16l9 1v17" fill="#644848"/><path d="m16-75 13 1v4l-13-1z" fill="#e3d8d6"/>
    <path d="m-39-29 41-41 8 1 34 35-6 4L3-58l-34 32z" fill="#e3dedb"/>
    <path d="m3-69 66 7 29 34-55-5z" fill="#afbac8"/><path d="m43-33 55 5-1 4-12 1-8-3-9 1-6-2-11 1z" fill="#e0dddf"/>
    <g fill="#ffcf85" className="window-light"><path d="M-22-26h13v14h-13z M11-26h13v14H11z M49-22h11v12H49z M73-20h10v11H73z"/><circle cx="2" cy="-43" r="4"/></g>
    <g stroke="#805031" fill="none" strokeWidth="1.6"><path d="M-16-26v14m-6-7h13m26-7v14m-6-7h13m30-3v12m-5-6h11m17-4v11"/></g>
    <path d="M-5 0v-20q5-5 11 0V0" fill="#393544"/><circle cx="3" cy="-9" r="1" fill="#f8c27b"/>
    <path d="M-36-1q16-6 34-1t43-2l54 3 4 4H-36z" fill="#ddd9dd"/>
    {Array.from({length:13},(_,i)=><circle key={i} cx={-31+i*5.6} cy={i<6?-28-i*5:-58+(i-6)*5} r="1.45" fill={i%3===0?'#ed9364':'#ffe5a4'}/>)}
  </g>
}
function Chapel() {
  return <g transform="translate(1185 613)"><path d="M-54 0v-55l32-24 48 29V0z" fill="#785b60"/>
    <path d="m-64-52 40-33 57 28-5 7-51-24-33 29z" fill="#d2ced6"/>
    <path d="M21 0v-87h31V0z" fill="#71616b"/><path d="M17-86 37-142l20 56z" fill="#3f4a61"/>
    <path d="m36-141-13 53-6 2z" fill="#d8d6dc"/><path d="M36-141v-13m-4 4h8" stroke="#edc68a" strokeWidth="2"/>
    <g fill="#ffd18b" className="window-light"><path d="M31-62v-10q5-11 11 0v10z M-42-21v-16q6-13 12 0v16z M-17-21v-16q6-13 12 0v16z"/><circle cx="37" cy="-45" r="6"/></g></g>
}
function Garland({right=false}:{right?:boolean}) {
  return <g transform={right?'translate(1600 2) scale(-1 1)':'translate(0 0)'}>
    <path d="M-20 24Q120 103 349 0" stroke="#1b2b31" strokeWidth="3" fill="none"/>
    {Array.from({length:12},(_,i)=>{
      const t=(i+.5)/12, x=-20*(1-t)**2+240*(1-t)*t+349*t*t, y=24*(1-t)**2+206*(1-t)*t
      return <g key={i} transform={`translate(${x} ${y}) rotate(${14-31*t})`}><path d="M0 0v7" stroke="#5c5548" strokeWidth="2"/><ellipse cy="12" rx="3.6" ry="6.5" fill={i%4===1?'#eaa174':'#ffdd90'} className="fairy-light"/></g>
    })}
  </g>
}
export const Winter = memo(function Winter(){
  return <svg className="world-art winter-art" viewBox="0 0 1600 820" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
    <defs>
      <linearGradient id="hill" x2=".3" y2="1" gradientUnits="objectBoundingBox"><stop stopColor="#757b91"/><stop offset="1" stopColor="#303e57"/></linearGradient>
      <linearGradient id="drift" x1="0" x2=".2" y2="1"><stop stopColor="#b7bbc7"/><stop offset=".47" stopColor="#8f9daf"/><stop offset="1" stopColor="#536479"/></linearGradient>
      <linearGradient id="frontsnow" x2=".25" y2="1"><stop stopColor="#a7b3c3"/><stop offset="1" stopColor="#677a92"/></linearGradient>
      <radialGradient id="moon-glow"><stop stopColor="#ffedc7" stopOpacity=".24"/><stop offset="1" stopColor="#ffdcac" stopOpacity="0"/></radialGradient>
      <radialGradient id="lamp-glow"><stop stopColor="#ffce78" stopOpacity=".55"/><stop offset="1" stopColor="#ffbc6d" stopOpacity="0"/></radialGradient>
    </defs>
    <g className="sky-layer">
      {Array.from({length:105},(_,i)=><circle key={i} cx={noise(i)*1600} cy={noise(i+125)*545} r={.6+noise(i+23)*1.2} fill="#fff2d2" opacity={.22+noise(i+42)*.6}/>)}
      {[ [245,125],[435,234],[1032,148],[1352,245],[874,68],[150,320],[1160,306],[522,102] ].map(([x,y],i)=><path key={x} className="twinkle" style={{animationDelay:`${-i*1.3}s`}} transform={`translate(${x} ${y})`} d="m0-4 1 3 3 1-3 1-1 4-1-4-3-1 3-1z" fill="#f3d59e"/>)}
      <circle cx="1273" cy="170" r="73" fill="url(#moon-glow)"/>
      <path d="M1281 146a24 24 0 1 0 12 38 23 23 0 0 1-12-38z" fill="#f7dba6"/>
      <path className="meteor" d="m354 135 52-21" stroke="#eed8ad" strokeWidth="1.6"/>
    </g>
    <g className="far-layer"><path d="m-40 461 90-55q47-35 91-3l77 49 124-71q41-23 83 3l125 67 95-39 144 63 168-91q39-22 74-8l106 38 132-68q46-24 82-5l190 100v260H-40z" fill="#494f68"/>
      <path d="M-40 437q81-50 163-8l100 49 115-59q35-18 70-7l173 70 110-38 170 51 113-32 150-34 140 33 116-57q65-31 200 22v266H-40z" fill="url(#hill)"/>
      {Array.from({length:115},(_,i)=><Pine key={i} x={i*15-30} y={491+16*Math.sin(i*.13)+noise(i+77)*16} s={.18+noise(i)*.31}/>)}
      <path d="M-30 494q182-36 332 2t355 26q188-50 353-21t311-21q131-33 312-2v210H-30z" fill="#9b9dab"/>
    </g>
    <g className="village-layer">
      {Array.from({length:71},(_,i)=><Pine key={i} x={i*24-46} y={548+24*Math.sin(i*.15)} s={.28+noise(i+13)*.48}/>)}
      <path d="M-30 550q132-44 305-5t333 11q222 33 420-12t315-6q109 18 285-22v211H-30z" fill="#b5b5c1"/>
      <Cabin x={96} y={546} s={.55}/><Cabin x={210} y={550} s={.49}/><Cabin x={380} y={560} s={.64}/><Cabin x={487} y={552} s={.42}/>
      <Cabin x={1048} y={553} s={.46}/><Cabin x={1320} y={534} s={.54}/><Cabin x={1415} y={546} s={.64}/>
      <path d="M-30 569q161-33 339 13t352 9q170-29 375-9t370-25q113-37 239-24v310H-30z" fill="url(#drift)"/>
      <Chapel/><Cabin x={1070} y={598} s={.74}/><Cabin x={1384} y={596} s={.92}/>
      <Cabin x={178} y={613} s={1.1}/><Cabin x={355} y={601} s={.83}/>
      <Pine x={311} y={621} s={1.02}/><Pine x={1288} y={611} s={1.09}/>
      <path d="M-40 641q164-22 328 1t334 7q221-29 421-13t360-22q109-31 227-12v240H-40z" fill="url(#frontsnow)"/>
      <path d="M-40 684q199-77 379-24t360 22q207-29 386-10t295-10q153-52 270-25" stroke="#c9cfda" opacity=".4" fill="none" strokeWidth="3"/>
      {Array.from({length:42},(_,i)=><path key={i} d={`M${noise(i+12)*1600} ${661+noise(i+55)*150}q9-2 21-1`} stroke="#c0c7d1" opacity=".35" fill="none"/>)}
    </g>
    <g className="near-layer"><Cabin x={-22} y={676} s={1.38}/><Cabin x={1485} y={663} s={1.15}/>
      <Lamp x={288} y={632} s={.79}/><Lamp x={1331} y={629} s={.76}/>
      <g transform="translate(70 660)" strokeLinecap="round"><path d="m0-12 126 13m-126-21 126 12" stroke="#777078" strokeWidth="3"/><path d="m0-22 126 12" stroke="#d6d7db" strokeWidth="2"/>{[0,31,63,94,126].map(a=><path key={a} d={`M${a} ${a*.1}v-24`} stroke="#6c656b" strokeWidth="4"/>)}</g>
      <Pine x={52} y={687} s={2.7} front/><Pine x={118} y={675} s={1.42} front/>
      <Pine x={1552} y={692} s={2.68} front/><Pine x={1463} y={674} s={1.55} front/>
      <Pine x={-14} y={769} s={3.45} front/><Pine x={1623} y={765} s={3.6} front/>
    </g>
    <g className="mobile-village"><Cabin x={544} y={590} s={.91}/><Pine x={620} y={596} s={.7}/><Cabin x={984} y={582} s={.82}/><Lamp x={968} y={603} s={.72}/></g>
  </svg>
})
export const StringLights = memo(()=><svg viewBox="0 0 1600 115" preserveAspectRatio="none" className="string-lights" aria-hidden="true"><Garland/><Garland right/></svg>)
