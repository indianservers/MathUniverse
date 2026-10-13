import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { Link } from 'react-router-dom';

export const algebraTopicArt: Record<string,string> = Object.fromEntries(
  ['expressions','equations','functions','polynomials','systems','exponents','sequences','proof','cas'].map(id=>[id,`/assets/algebra-studio/topic-icons-v2/${id}.png`]),
);

/** Decorative topic artwork: the surrounding card remains the accessible link. */
export default function AlgebraTopicIcon({ topic, href }: { topic: string; href: string }) {
  const ref=useRef<HTMLAnchorElement>(null);
  const [visible,setVisible]=useState(false);
  useEffect(()=>{
    const element=ref.current;
    if(!element)return;
    const observer=new IntersectionObserver(entries=>setVisible(entries[0]?.isIntersecting??false));
    observer.observe(element);
    return()=>observer.disconnect();
  },[]);
  const tilt=(event:PointerEvent<HTMLAnchorElement>)=>{
    if(event.pointerType==='touch'||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const box=event.currentTarget.getBoundingClientRect();
    const x=Math.max(-1,Math.min(1,2*(event.clientX-box.left)/box.width-1));
    const y=Math.max(-1,Math.min(1,2*(event.clientY-box.top)/box.height-1));
    event.currentTarget.style.setProperty('--art-rotate-x',`${-y*9}deg`);
    event.currentTarget.style.setProperty('--art-rotate-y',`${x*12}deg`);
    event.currentTarget.style.setProperty('--art-glow-x',`${50+x*30}%`);
    event.currentTarget.style.setProperty('--art-glow-y',`${50+y*30}%`);
  };
  const reset=()=>{
    ref.current?.style.setProperty('--art-rotate-x','0deg');
    ref.current?.style.setProperty('--art-rotate-y','0deg');
  };
  return <Link ref={ref} to={href} tabIndex={-1} className={`alg-topic-art alg-topic-art--${topic}${visible?' is-visible':''}`} aria-hidden="true"
    onPointerMove={tilt} onPointerLeave={reset} onPointerCancel={reset} style={{'--art-delay':`${Object.keys(algebraTopicArt).indexOf(topic)*-.45}s`} as CSSProperties}>
    <span className="alg-topic-art__glow"/>
    <span className="alg-topic-art__tilt"><img className="alg-topic-art__image" src={algebraTopicArt[topic]} alt="" width="160" height="160" loading="lazy" decoding="async" draggable={false}/></span>
    <span className="alg-topic-art__sparkle"/>
  </Link>;
}
