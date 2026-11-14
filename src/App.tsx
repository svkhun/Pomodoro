import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { flushSync } from 'react-dom'
import { Atmosphere } from './Atmosphere'
import { Icon, type IconName } from './icons'
import { Modal } from './Modal'
import { advance, catchUp, dayKey, fresh, left, names, toggle, type Clock, type Phase } from './timer'
import { keys, readClock, readPrefs, save, type Preferences } from './preferences'
import { resolveTheme, themes } from './themes'
const phases: Phase[]=['focus','short','long']
const phaseIcons:Record<Phase,IconName>={focus:'clock',short:'coffee',long:'moon'}
const two=(n:number)=>String(n).padStart(2,'0')
type Panel='theme'|'settings'|null

function Settings({prefs,onChange}:{prefs:Preferences,onChange:(p:Preferences)=>void}){
  const [message,setMessage]=useState('')
  async function notification(){
    if(prefs.notifications){onChange({...prefs,notifications:false});return}
    if(!('Notification' in window)){setMessage('This browser does not support notifications.');return}
    try {
      const choice=await Notification.requestPermission()
      if(choice==='granted') onChange({...readPrefs(),notifications:true})
      else setMessage(choice==='denied'?'Notifications are blocked in your browser settings.':'Notification permission was not granted.')
    } catch {setMessage('Notifications are unavailable in this browser.')}
  }
  return <div className="settings-body">
    <fieldset><legend>Session length <small>(minutes)</small></legend><div className="duration-inputs">{phases.map(p=><label key={p}>{names[p]}
      <input type="number" min="1" max="180" step="1" defaultValue={prefs.durations[p]} onBlur={e=>{
        const raw=e.currentTarget.valueAsNumber
        const value=Number.isFinite(raw)?Math.min(180,Math.max(1,Math.round(raw))):prefs.durations[p]
        e.currentTarget.value=String(value); onChange({...prefs,durations:{...prefs.durations,[p]:value}})
      }}/></label>)}</div></fieldset>
    <label className="setting-row">Auto-start next phase<input type="checkbox" checked={prefs.auto} onChange={e=>onChange({...prefs,auto:e.target.checked})}/></label>
    <label className="setting-row">End-of-session chime<input type="checkbox" checked={!prefs.muted} onChange={e=>onChange({...prefs,muted:!e.target.checked})}/></label>
    <label className="setting-row">Chime volume<input type="range" min="0" max="100" value={Math.round(prefs.volume*100)} onChange={e=>onChange({...prefs,volume:+e.target.value/100})}/></label>
    <label className="setting-row">Browser notifications<input type="checkbox" checked={prefs.notifications} onChange={notification}/></label>
    {message&&<p role="status">{message}</p>}
  </div>
}

export default function App(){
  const [prefs,setPrefs]=useState(readPrefs)
  const [clock,setClock]=useState(()=>readClock(prefs.durations))
  const [now,setNow]=useState(Date.now)
  const [panel,setPanel]=useState<Panel>(null)
  const [burst,setBurst]=useState(0)
  const [announcement,announce]=useState('')
  const [reveal,setReveal]=useState(0)
  const clockRef=useRef(clock), prefsRef=useRef(prefs), sound=useRef<AudioContext|null>(null)
  const theme=resolveTheme(prefs.theme,new Date(now)), {phase}=clock
  const running=clock.endsAt!==null, remaining=left(clock,now), secs=Math.ceil(remaining/1000)
  const display=two(Math.floor(secs/60))+':'+two(secs%60)
  const action=running?'Pause':clock.remaining<clock.duration?'Resume':'Start'
  const stats=clock.days[dayKey(now)]??{count:0,minutes:0}
  const commit=useCallback((c:Clock)=>{clockRef.current=c;save(keys.clock,c);setClock(c)},[])
  function unlock(){
    if(!sound.current){try{sound.current=new AudioContext()}catch{return}}
    if(sound.current.state==='suspended')void sound.current.resume().catch(()=>{})
  }
  function chime(notes:number[],volume:number){
    const ctx=sound.current
    if(!ctx||ctx.state!=='running'||volume===0)return
    notes.forEach((hz,i)=>{
      const oscillator=ctx.createOscillator(),gain=ctx.createGain(),start=ctx.currentTime+i*.16
      oscillator.type='sine';oscillator.frequency.value=hz
      gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(.12*volume+.0001,start+.035);gain.gain.exponentialRampToValueAtTime(.0001,start+1.15)
      oscillator.connect(gain);gain.connect(ctx.destination);oscillator.start(start);oscillator.stop(start+1.2)
      oscillator.onended=()=>{oscillator.disconnect();gain.disconnect()}
    })
  }
  const sync=useCallback(()=>{
    const t=Date.now(),p=prefsRef.current,last=clockRef.current
    const current=catchUp(last,p.durations,p.auto,t)
    if(current!==last){
      commit(current)
      const msg=`${names[last.phase]} complete. ${names[current.phase]} ${current.endsAt?'started':'is ready'}.`
      announce(msg);setBurst(n=>n+1)
      if(!p.muted)chime(resolveTheme(p.theme,new Date(t)).notes,p.volume)
      if(p.notifications&&'Notification' in window&&Notification.permission==='granted'){
        try {new Notification('Festive Focus',{body:msg,tag:'festive-focus'})} catch { /* Some mobile browsers require a service worker. */ }
      }
    }
    setNow(t);return current
  },[commit])
  useEffect(()=>{
    sync()
    const id=window.setInterval(sync,running?220:15000)
    document.addEventListener('visibilitychange',sync);window.addEventListener('pageshow',sync)
    function storage(e:StorageEvent){
      if(e.key===keys.prefs){const p=readPrefs();prefsRef.current=p;setPrefs(p)}
      if(e.key===keys.clock){const c=readClock(prefsRef.current.durations);clockRef.current=c;setClock(c)}
      sync()
    }
    window.addEventListener('storage',storage)
    return ()=>{clearInterval(id);document.removeEventListener('visibilitychange',sync);window.removeEventListener('pageshow',sync);window.removeEventListener('storage',storage)}
  },[running,sync])
  useEffect(()=>{document.title=`${display} · ${names[phase]}`},[display,phase])
  function change(p:Preferences){
    unlock()
    const c=sync()
    prefsRef.current=p;save(keys.prefs,p);setPrefs(p)
    if(c.endsAt===null&&c.remaining===c.duration&&c.duration!==p.durations[c.phase]*60000)commit(fresh(c.phase,p.durations,c))
  }
  function control(cmd:'toggle'|'reset'|'skip'|Phase){
    unlock()
    const t=Date.now(), c=sync(),p=prefsRef.current
    if(cmd==='toggle'){commit(toggle(c,t));return}
    const next=cmd==='skip'?advance(c,p.durations,p.auto,t,false):fresh(cmd==='reset'?c.phase:cmd,p.durations,c)
    commit(next);announce(cmd==='reset'?`${names[next.phase]} reset.`:`${names[next.phase]} ${next.endsAt?'started':'ready'}.`)
  }
  useEffect(()=>{
    const onKey=(e:KeyboardEvent)=>{
      if(e.altKey||e.metaKey||e.ctrlKey||e.repeat||panel||(e.target instanceof HTMLElement&&(e.target.isContentEditable||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))))return
      const k=e.key.toLowerCase()
      if(k===' '&&e.target instanceof HTMLElement&&e.target.closest('button'))return
      if(![' ','r','s','t'].includes(k))return
      e.preventDefault()
      if(k==='t')setPanel('theme');else control(k===' '?'toggle':k==='r'?'reset':'skip')
    }
    document.addEventListener('keydown',onKey);return ()=>document.removeEventListener('keydown',onKey)
  })
  function selectTheme(id:string){
    const update=()=>flushSync(()=>{change({...prefs,theme:id});setPanel(null)})
    if(matchMedia('(prefers-reduced-motion: reduce)').matches||resolveTheme(id,new Date()).id===theme.id){update();return}
    // Flush React's commit inside the snapshot callback so the reveal captures the new world.
    if(document.startViewTransition)document.startViewTransition(update)
    else {update();setReveal(n=>n+1)}
  }
  const style={'--sky':theme.tokens.sky,'--horizon':theme.tokens.horizon,'--accent':theme.tokens.accent,'--paper':theme.tokens.surface,'--heading':theme.tokens.heading,'--mood':theme.moods[phase].light} as CSSProperties
  return <div className="app" style={style}>
    <main className="world" data-phase={phase} data-theme={theme.id}>
      <div className="mood-layer"/><theme.Scene/><Atmosphere theme={theme} phase={phase}/>
      <header className="topbar">
        <div className="brand"><span className="brand-icon"><Icon name="tree" size={24}/></span>Festive Focus</div>
        <nav aria-label="Timer preferences"><button className="theme-trigger" onClick={()=>setPanel('theme')} aria-label={`Theme menu, current theme ${theme.name}`}><Icon name={theme.icon} size={17}/><span>{theme.name}</span><Icon name="down" size={14}/></button>
          <button className="round top-icon" aria-label={prefs.muted?'Unmute chime':'Mute chime'} aria-pressed={prefs.muted} title={prefs.muted?'Unmute':'Mute'} onClick={()=>change({...prefs,muted:!prefs.muted})}><Icon name={prefs.muted?'mute':'sound'}/></button>
          <button className="round top-icon" aria-label="Timer settings" title="Settings" onClick={()=>setPanel('settings')}><Icon name="gear"/></button></nav>
      </header>
      {theme.Canopy&&<theme.Canopy/>}
      <section className="focus-area" aria-label="Festival timer">
        <div className="scene-heading"><div className="eyebrow"><i/><span>Pomodoro timer</span><i/></div><h1>{theme.title}</h1></div>
        <div className={`dial ${running&&secs<=10?'finishing':''}`}>
          <theme.Dial progress={remaining/clock.duration}/>
          <div className="dial-face"><div className="dial-label"><Icon name={phaseIcons[phase]} size={13}/>{phase==='focus'?'Focus time':names[phase]}</div>
            <div className="digits" role="timer" aria-live="off" aria-label={`${Math.floor(secs/60)} minutes ${secs%60} seconds`}>{display.split('').map((d,i)=><span className={d===':'?'colon':'digit'} key={i}><b key={d}>{d}</b></span>)}</div>
            <div className="session-label">Session {two(phase==='focus'?clock.cycle+1:clock.cycle|| (phase==='long'?4:1))} <span>/</span> 04</div>
          </div>
          {burst>0&&<div className="burst" key={burst} aria-hidden="true">{Array.from({length:18},(_,i)=><i style={{'--angle':`${i*20}deg`} as CSSProperties} key={i}/>)}</div>}
        </div>
        <div className="phase-tabs" role="group" aria-label="Timer mode">{phases.map(p=><button key={p} className={p===phase?'active':''} aria-pressed={p===phase} onClick={()=>{if(p!==phase)control(p)}}><Icon name={phaseIcons[p]} size={15}/>{names[p]}</button>)}</div>
        <div className="controls">
          <button className="round secondary" onClick={()=>control('reset')} title="Reset (R)" aria-label="Reset timer"><Icon name="reset" size={18}/></button>
          <button className="primary" onClick={()=>control('toggle')}><Icon name={running?'pause':'play'} size={17}/>{action} {phase==='focus'?'focus':'break'}</button>
          <button className="round secondary" onClick={()=>control('skip')} title="Skip (S)" aria-label="Skip phase"><Icon name="skip" size={17}/></button>
        </div>
      </section>
    </main>
    <footer className="dashboard"><div className="stat-grid">
      <div className="today"><div className="eyebrow small"><i/>Daily overview</div><h2>Today’s progress</h2></div>
      <div className="stat"><span className="stat-icon"><Icon name="ornament" size={23}/></span><div><strong>{stats.count}</strong><div className="stat-label">Sessions completed</div></div></div>
      <div className="stat"><span className="stat-icon"><Icon name="clock" size={23}/></span><div><strong>{stats.minutes} <small>min</small></strong><div className="stat-label">Focus time</div></div></div>
      <div className="cycle"><div className="cycle-title">Focus cycle <b>{clock.cycle} / 4</b></div><div className="cycle-dots" aria-hidden="true">{[0,1,2,3].map(i=><span key={i} className={i<clock.cycle?'done':''}/>)}</div></div>
    </div>
    <div className="shortcuts" aria-label="Keyboard shortcuts">{[['Space','Start / pause'],['R','Reset'],['S','Skip'],['T','Themes']].map(([key,label])=><span key={key}><kbd>{key}</kbd>{label}</span>)}</div></footer>
    <div className="sr-only" role="status" aria-live="polite">{announcement}</div>
    {reveal>0&&<div className="fallback-reveal" key={reveal} aria-hidden="true"/>}
    {panel&&<Modal title={panel==='theme'?'Choose a theme':'Timer settings'} close={()=>setPanel(null)}>{panel==='theme'?<div className="theme-options">
      {[{id:'auto',name:'Auto by date',icon:'calendar' as IconName},...themes].map(t=><button onClick={()=>selectTheme(t.id)} aria-pressed={prefs.theme===t.id} key={t.id}><span className={`swatch swatch-${t.id}`}><Icon name={t.icon}/></span>{t.name}{prefs.theme===t.id&&<Icon name="check"/>}</button>)}
    </div>:<Settings prefs={prefs} onChange={change}/>}</Modal>}
  </div>
}
