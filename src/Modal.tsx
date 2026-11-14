import { useEffect, useRef, type ReactNode } from 'react'
import { Icon } from './icons'
export function Modal({title,close,children}:{title:string, close:()=>void, children:ReactNode}){
  const ref=useRef<HTMLDialogElement>(null)
  useEffect(()=>{
    const dialog=ref.current!
    const returnTo=document.activeElement as HTMLElement|null
    dialog.showModal()
    return ()=>{dialog.close();returnTo?.focus()}
  },[])
  return <dialog ref={ref} className="modal" aria-labelledby="modal-heading" onCancel={e=>{e.preventDefault();close()}} onClick={e=>{if(e.target===e.currentTarget){const rect=e.currentTarget.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)close()}}}>
    <header><h2 id="modal-heading">{title}</h2><button className="close-button" onClick={close} aria-label="Close"><Icon name="close"/></button></header>
    {children}
  </dialog>
}
