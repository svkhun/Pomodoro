import { useEffect, useRef } from 'react'
import type { Theme } from './themes/types'
import type { Phase } from './timer'
export function Atmosphere({theme,phase}:{theme:Theme,phase:Phase}) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(()=>{
    const canvas = ref.current!
    const host = canvas.parentElement!
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    let width=1, height=1, frame=0, last=0, age=0, px=-1000, py=-1000, tiltX=0, tiltY=0
    const config=theme.particles
    type Flake = { x:number,y:number,z:number,angle:number }
    let particles:Flake[]=[]
    function resize() {
      width=host.clientWidth; height=host.clientHeight
      const dpr=Math.min(devicePixelRatio||1,1.6)
      canvas.width=width*dpr; canvas.height=height*dpr
      ctx!.setTransform(dpr,0,0,dpr,0,0)
      particles=Array.from({length:Math.min(config.count,Math.ceil(width/17))},()=>({x:Math.random()*width,y:Math.random()*height,z:Math.random(),angle:Math.random()*6.28}))
    }
    function draw(time:number) {
      const dt=Math.min((time-last)/1000,.05); last=time; age+=dt
      ctx!.clearRect(0,0,width,height)
      for(const p of particles) {
        const speed=theme.moods[phase].speed
        p.y+=dt*(8+22*p.z)*speed*(config.kind==='ember'?-1:1)
        p.x+=dt*(5+Math.sin(age*.55+p.angle)*9)
        const dx=p.x-px,dy=p.y-py,dist=Math.hypot(dx,dy)
        if(dist>0 && dist<78){p.x+=dx/dist*(78-dist)*dt*.65;p.y+=dy/dist*(78-dist)*dt*.45}
        if(p.y>height+5)p.y=-4
        if(p.y< -5)p.y=height+4
        if(p.x>width+5)p.x=-4
        ctx!.fillStyle=config.color
        ctx!.globalAlpha=.23+.43*p.z
        ctx!.beginPath();ctx!.arc(p.x,p.y,.55+p.z*1.65,0,2*Math.PI);ctx!.fill()
        if(p.z>.88){ctx!.globalAlpha=.06;ctx!.beginPath();ctx!.arc(p.x,p.y,3.4+p.z,0,2*Math.PI);ctx!.fill()}
      }
      frame=requestAnimationFrame(draw)
    }
    function sync(){
      cancelAnimationFrame(frame)
      if(!document.hidden&&!reduced.matches){last=performance.now();frame=requestAnimationFrame(draw)}
      else {ctx!.clearRect(0,0,width,height);move(0,0)}
    }
    function move(x:number,y:number){host.style.setProperty('--px',x.toFixed(2)+'px');host.style.setProperty('--py',y.toFixed(2)+'px')}
    function pointer(e:PointerEvent){
      if(reduced.matches)return
      const bounds=host.getBoundingClientRect();px=e.clientX-bounds.left;py=e.clientY-bounds.top
      move((px/width-.5)*8,(py/height-.5)*4)
    }
    function leave(){px=py=-1000;move(0,0)}
    function tilt(e:DeviceOrientationEvent){if(!reduced.matches&&e.gamma!==null&&e.beta!==null){
      tiltX=Math.max(-4,Math.min(4,e.gamma/8));tiltY=Math.max(-2,Math.min(2,(e.beta-45)/15));move(tiltX,tiltY)
    }}
    const observer=new ResizeObserver(resize); observer.observe(host)
    resize();sync()
    host.addEventListener('pointermove',pointer);host.addEventListener('pointerleave',leave)
    window.addEventListener('deviceorientation',tilt)
    document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync)
    return ()=>{cancelAnimationFrame(frame);observer.disconnect();leave();host.removeEventListener('pointermove',pointer);host.removeEventListener('pointerleave',leave);window.removeEventListener('deviceorientation',tilt);document.removeEventListener('visibilitychange',sync);reduced.removeEventListener('change',sync)}
  },[theme,phase])
  return <canvas className="particles" ref={ref} aria-hidden="true"/>
}
