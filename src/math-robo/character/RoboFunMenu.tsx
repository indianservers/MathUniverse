import {useEffect,useRef} from 'react';
import type {Target} from './engine';
import type {FunAction} from './useRoboFun';
import './roboFun.css';
const items:Array<[FunAction,string,string]>=[['buttons','🚶','Walk between buttons'],['jump','🦘','Jump between buttons'],['text','🐾','Crawl across text'],['heading','🔎','Visit a heading'],['graph','📈','Visit a graph object'],['dance','🎉','Happy dance'],['wave','👋','Wave hello'],['wink','😉','Give me a wink'],['surprise','🎲','Surprise me'],['where','📍','Where am I?'],['stop','⏹','Stop moving']];
export function RoboFunMenu({point,location,onClose,onAction}:{point:Target;location:string;onClose:()=>void;onAction:(action:FunAction)=>void}){
 const root=useRef<HTMLDivElement>(null),close=useRef(onClose);close.current=onClose;
 useEffect(()=>{root.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus({preventScroll:true});const outside=(event:PointerEvent)=>{if(!root.current?.contains(event.target as Node))close.current();};const dismiss=()=>close.current();document.addEventListener('pointerdown',outside,true);window.addEventListener('resize',dismiss);return()=>{document.removeEventListener('pointerdown',outside,true);window.removeEventListener('resize',dismiss);};},[]);
 return <div ref={root} role="menu" aria-label="Ruhi’s fun menu" data-robo-ignore className="robo-fun-menu" style={{left:Math.max(12,Math.min(innerWidth-280,point.x)),top:Math.max(12,Math.min(innerHeight-532,point.y))}} onContextMenu={event=>event.preventDefault()} onKeyDown={event=>{
  const buttons=[...root.current!.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')],index=buttons.indexOf(document.activeElement as HTMLButtonElement);
  if(event.key==='Escape'){event.preventDefault();event.stopPropagation();onClose();}
  else if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?buttons.length-1:(index+(event.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length;buttons[next]?.focus();}
 }}>
  <div className="robo-fun-heading"><strong>Play with Ruhi</strong><small>{location}</small></div>
  {items.map(([action,icon,label])=><button key={action} role="menuitem" type="button" onClick={()=>onAction(action)}><span aria-hidden="true">{icon}</span>{label}</button>)}
  <p>Nearby elements become landing spots. Escape closes this menu.</p>
 </div>;
}
export function RoboFunStatus({message,active,onStop,onDismiss}:{message:string;active:boolean;onStop:()=>void;onDismiss:()=>void}){
 if(!message)return null;
 return <div className="robo-fun-status" data-robo-ignore data-testid="ruhi-adventure"><span role="status">{message}</span><button type="button" onClick={active?onStop:onDismiss} aria-label={active?'Stop Ruhi adventure':'Dismiss Ruhi adventure status'}>{active?'Stop':'×'}</button></div>;
}
