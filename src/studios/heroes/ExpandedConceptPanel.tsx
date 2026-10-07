import { useEffect, useRef } from 'react';
import { drawExpandedConcepts, expandedConcepts } from './expandedConcepts';

export default function ExpandedConceptPanel({id,playing,replay,reduced}:{id:string;playing:boolean;replay:number;reduced:boolean}){
 const canvas=useRef<HTMLCanvasElement>(null),clock=useRef(8),lastReplay=useRef(replay);
 const items=expandedConcepts[id];
 useEffect(()=>{
  const element=canvas.current,ctx=element?.getContext('2d');if(!element||!ctx||!items)return;
  if(lastReplay.current!==replay){clock.current=0;lastReplay.current=replay;}
  let frame=0,last=0,painted=0,visible=false,w=0,h=0;
  const draw=(now:number)=>{frame=0;if(!visible||document.hidden)return;if(last&&playing&&!reduced)clock.current+=Math.min(.05,(now-last)/1000);last=now;if(now-painted>32||!playing||reduced){drawExpandedConcepts(ctx,id,reduced?8:clock.current,w,h);painted=now;}if(playing&&!reduced)frame=requestAnimationFrame(draw);};
  const start=()=>{cancelAnimationFrame(frame);last=0;if(visible&&!document.hidden)frame=requestAnimationFrame(draw);};
  const resize=new ResizeObserver(()=>{const bounds=element.getBoundingClientRect();w=bounds.width;h=bounds.height;const dpr=Math.min(devicePixelRatio||1,1.5);element.width=Math.round(w*dpr);element.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);start();});resize.observe(element);
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;start();});observer.observe(element);
  document.addEventListener('visibilitychange',start);
  return()=>{cancelAnimationFrame(frame);resize.disconnect();observer.disconnect();document.removeEventListener('visibilitychange',start);};
 },[id,items,playing,replay,reduced]);
 if(!items)return null;
 return <div className="cinematic-expanded"><h2>Explore 15 more living concepts</h2><p>Each diagram follows the mathematics of this studio. Pause and replay controls above apply to both scenes.</p><canvas ref={canvas} role="img" aria-label={`Additional animated concepts: ${items.map(([name,formula])=>`${name}: ${formula}`).join('. ')}`}/><details><summary>Read all 15 concepts</summary><ul>{items.map(([name,formula])=><li key={name}><b>{name}</b><span>{formula}</span></li>)}</ul></details></div>;
}
