import {useEffect,useRef,useState,type CSSProperties,type PointerEvent,type RefObject} from 'react';
import {flushSync} from 'react-dom';
import {roboEvents,type Action,type ActionOptions,type Target} from './engine';
import type {RoboCharacterHandle} from './RoboCharacter';
import {robotAnchor} from './spatialAwareness';
export type Direction='left'|'right'|'up'|'down';
export type MovementResult={completed:boolean;limited:boolean;position:Target};
export function robotPanelStyle(p:Target,width:number,height:number,actorWidth=76,actorHeight=88):CSSProperties{
 const panelWidth=Math.min(420,width-24),above=p.y-24,below=height-p.y-actorHeight-24;
 const right=width-p.x-actorWidth-24,left=p.x-24;
 const beside=Math.max(left,right)>=panelWidth;
 const panelHeight=Math.min(400,beside?height-24:Math.max(above,below));
 const panelLeft=beside?(right>=panelWidth?p.x+actorWidth+12:p.x-panelWidth-12):Math.max(12,Math.min(width-panelWidth-12,p.x));
 const top=beside?Math.max(12,Math.min(height-panelHeight-12,p.y)):above>=below?Math.max(12,p.y-panelHeight-12):p.y+actorHeight+12;
 return {position:'fixed',left:panelLeft,top,bottom:'auto',right:'auto',width:panelWidth,maxHeight:Math.max(0,panelHeight)};
}
export const clampRobotPosition=(p:Target,width:number,height:number,actorWidth=76,actorHeight=88):Target=>({x:Math.max(8,Math.min(Math.max(8,width-actorWidth-8),p.x)),y:Math.max(8,Math.min(Math.max(8,height-actorHeight-8),p.y))});
export const directionAction=(direction:Direction,crawl:boolean):Action=>`${crawl?'crawl':'walk'}${direction[0].toUpperCase()}${direction.slice(1)}` as Action;
export function jumpArc(t:number,distance:number){return Math.sin(Math.PI*t)*Math.min(100,35+distance*.12);}
const directionFor=(action:Action):Direction=>action.endsWith('Left')?'left':action.endsWith('Up')?'up':action.endsWith('Down')?'down':'right';
export function useRoboPosition(launcher:RefObject<HTMLButtonElement>,character:RefObject<RoboCharacterHandle>,route:string){
 const [position,setPosition]=useState<Target|undefined>(()=>{try{const p=JSON.parse(localStorage.getItem('math-robo-position')??'null');return p&&Number.isFinite(p.x)&&Number.isFinite(p.y)?clampRobotPosition(p,innerWidth,innerHeight):undefined;}catch{return;}});
 const [moving,setMoving]=useState(false);
 const current=useRef(position),drag=useRef<{id:number;x:number;y:number;left:number;top:number}>();
 const moved=useRef(false),motion=useRef<{frame:number;resolve:(result:MovementResult)=>void;limited:boolean;action:Action;destination:Target}>(),mounted=useRef(true);
 function persist(p:Target){try{localStorage.setItem('math-robo-position',JSON.stringify(p));}catch{/* Optional local persistence. */}}
 function commit(p:Target){current.current=p;if(mounted.current)setPosition(p);persist(p);}
 function stop(cancelRig=true){const active=motion.current;if(active){cancelAnimationFrame(active.frame);motion.current=undefined;const p=current.current??{x:8,y:8};commit(p);active.resolve({completed:false,limited:active.limited,position:p});}if(mounted.current)setMoving(false);if(cancelRig)character.current?.cancel();}
 const stopRef=useRef(stop);stopRef.current=stop;const commitRef=useRef(commit);commitRef.current=commit;
 useEffect(()=>{mounted.current=true;const resize=()=>{stopRef.current();const rect=launcher.current?.getBoundingClientRect();if(rect)commitRef.current(clampRobotPosition({x:rect.left,y:rect.top},innerWidth,innerHeight,rect.width,rect.height));};window.addEventListener('resize',resize);return()=>{mounted.current=false;stopRef.current(false);window.removeEventListener('resize',resize);};},[launcher]);
 useEffect(()=>{stopRef.current();},[route]);
 function startMove(destination:Target,action:Action,duration?:number){
  const actor=launcher.current,rig=character.current;
  if(!actor||!rig)return {started:false,completion:Promise.resolve({completed:false,limited:false,position:current.current??{x:8,y:8}})};
  stop(false);
  const rect=actor.getBoundingClientRect(),anchor=robotAnchor(actor),requested={x:destination.x-(anchor.x-rect.left),y:destination.y-(anchor.y-rect.top)};
  const end=clampRobotPosition(requested,innerWidth,innerHeight,rect.width,rect.height),start={x:rect.left,y:rect.top},distance=Math.hypot(end.x-start.x,end.y-start.y),limited=Math.hypot(end.x-requested.x,end.y-requested.y)>1;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,milliseconds=reduced?0:Math.max(300,Math.min(8000,duration??(action==='jump'?Math.min(1500,600+distance):distance/(action.startsWith('crawl')?65:115)*1000)));
  if(!rig.playAction(action,{inPlace:true,priority:5,duration:Math.max(100,milliseconds)}))return {started:false,completion:Promise.resolve({completed:false,limited,position:start})};
  commit(start);setMoving(true);
  const aside=actor.closest<HTMLElement>('.offline-assistant')!,began=performance.now();
  const completion=new Promise<MovementResult>(resolve=>{const tick=(now:number)=>{
   const t=milliseconds?Math.min(1,(now-began)/milliseconds):1,p=clampRobotPosition({x:start.x+(end.x-start.x)*t,y:start.y+(end.y-start.y)*t-(action==='jump'?jumpArc(t,distance):0)},innerWidth,innerHeight,rect.width,rect.height);
   current.current=p;
   // Translation does not rerender the assistant and its mathematical previews every frame.
   aside.style.left=`${p.x}px`;aside.style.top=`${p.y}px`;aside.style.right='auto';aside.style.bottom='auto';
   if(t<1){if(motion.current)motion.current.frame=requestAnimationFrame(tick);}else{motion.current=undefined;flushSync(()=>{commit(p);setMoving(false);});rig.cancel();roboEvents.emit({type:'activity'});resolve({completed:true,limited,position:p});}
  };motion.current={frame:requestAnimationFrame(tick),resolve,limited,action,destination};});
  return {started:true,completion};
 }
 function move(direction:Direction,crawl=false,distance=120){const anchor=launcher.current?robotAnchor(launcher.current):{x:8,y:8};return startMove({x:anchor.x+(direction==='left'?-distance:direction==='right'?distance:0),y:anchor.y+(direction==='up'?-distance:direction==='down'?distance:0)},directionAction(direction,crawl));}
 function travel(action:Action,options:ActionOptions){const direction=directionFor(action),anchor=launcher.current?robotAnchor(launcher.current):{x:8,y:8},distance=options.travel??120;return startMove({x:anchor.x+(direction==='left'?-distance:direction==='right'?distance:0),y:anchor.y+(direction==='up'?-distance:direction==='down'?distance:0)},action,options.duration).started;}
 function moveTo(destination:Target,crawl=false){const anchor=launcher.current?robotAnchor(launcher.current):destination,dx=destination.x-anchor.x,dy=destination.y-anchor.y;return startMove(destination,directionAction(Math.abs(dx)>=Math.abs(dy)?dx<0?'left':'right':dy<0?'up':'down',crawl));}
 const finish=(e:PointerEvent<HTMLButtonElement>)=>{if(!drag.current)return;drag.current=undefined;if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);if(moved.current){if(current.current)persist(current.current);roboEvents.emit({type:'activity'});}};
 return {moving,travel,move,moveTo,jumpTo:(destination:Target)=>startMove(destination,'jump'),stop,getMovement:()=>motion.current?{action:motion.current.action,destination:motion.current.destination}:undefined,
  panelStyle:position?robotPanelStyle(position,innerWidth,innerHeight,launcher.current?.offsetWidth,launcher.current?.offsetHeight):undefined,
  style:position?{left:position.x,top:position.y,right:'auto',bottom:'auto'} as CSSProperties:undefined,
  wasDragged:()=>{const value=moved.current;moved.current=false;return value;},
  handlers:{onPointerDown:(e:PointerEvent<HTMLButtonElement>)=>{if(e.button!==0)return;stop();const rect=e.currentTarget.getBoundingClientRect();drag.current={id:e.pointerId,x:e.clientX,y:e.clientY,left:rect.left,top:rect.top};moved.current=false;e.currentTarget.setPointerCapture(e.pointerId);},onPointerMove:(e:PointerEvent<HTMLButtonElement>)=>{const d=drag.current;if(!d||d.id!==e.pointerId)return;if(Math.hypot(e.clientX-d.x,e.clientY-d.y)>5)moved.current=true;if(moved.current){const rect=e.currentTarget.getBoundingClientRect(),p=clampRobotPosition({x:d.left+e.clientX-d.x,y:d.top+e.clientY-d.y},innerWidth,innerHeight,rect.width,rect.height);current.current=p;setPosition(p);}},onPointerUp:finish,onPointerCancel:finish}
 };
}
