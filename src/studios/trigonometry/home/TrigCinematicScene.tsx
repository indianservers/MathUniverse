import { useEffect, useId, useRef, useState } from 'react';
import { orbit, TAU, wavePath } from './trigHeroMath';

export default function TrigCinematicScene() {
  const id = useId().replace(/:/g, '');
  const svg = useRef<SVGSVGElement>(null);
  const dragging = useRef(false), moved = useRef(false);
  const [visible, setVisible] = useState(true);
  const [theta, setTheta] = useState(Math.PI / 4), [playing, setPlaying] = useState(true), [reduced, setReduced] = useState(false), [tooltip, setTooltip] = useState(false);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches); update(); query.addEventListener('change', update);
    const observer = new IntersectionObserver(entries => { setVisible(entries[0].isIntersecting); });
    if (svg.current) observer.observe(svg.current);
    return () => { query.removeEventListener('change', update); observer.disconnect(); };
  }, []);
  useEffect(() => {
    if (!visible || !playing || reduced) return;
    let frame = 0, last = 0;
    const tick = (now: number) => {
      if (last && !dragging.current) setTheta(t => (t + Math.min((now - last) / 1000, .05) * TAU / 16) % TAU);
      last = now; frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick); return () => cancelAnimationFrame(frame);
  }, [playing, reduced, visible]);
  const p = orbit(theta), angle = ((theta * 180 / Math.PI) % 360 + 360) % 360;
  const setFromPointer = (clientX: number, clientY: number) => {
    const el = svg.current; if (!el) return;
    const pt = new DOMPoint(clientX, clientY).matrixTransform(el.getScreenCTM()!.inverse());
    setTheta((Math.atan2(205 - pt.y, pt.x - 420) + TAU) % TAU);
  };
  return <div className={`tgh-scene ${reduced ? 'reduced' : ''} ${!visible ? 'offscreen' : ''}`} onPointerMove={e => {
    if (reduced) return; const r = e.currentTarget.getBoundingClientRect();
    setParallax({ x: ((e.clientX - r.left) / r.width - .5) * 12, y: ((e.clientY - r.top) / r.height - .5) * 12 });
  }} onPointerLeave={() => setParallax({ x: 0, y: 0 })}>
    <svg ref={svg} viewBox="0 0 1000 400" className="tgh-space" aria-label="Interactive unit circle and synchronized sine and cosine waves">
      <defs>
        <radialGradient id={`${id}sky`}><stop stopColor="#113575"/><stop offset="1" stopColor="#020c24"/></radialGradient>
        <linearGradient id={`${id}ice`} x2="0" y2="1"><stop stopColor="#aecff4"/><stop offset="1" stopColor="#061535"/></linearGradient>
        <filter id={`${id}bloom`} x="-70%" y="-70%" width="240%" height="240%"><feGaussianBlur stdDeviation="5"/></filter>
        <filter id={`${id}soft`}><feGaussianBlur stdDeviation="1.4"/></filter>
      </defs>
      <rect width="1000" height="400" fill={`url(#${id}sky)`}/>
      <g style={{ transform: `translate(${parallax.x}px,${parallax.y}px)` }}>
        {Array.from({ length: 160 }, (_, i) => <circle key={i} cx={(i * 173.23) % 1000} cy={(i * i * 7.31) % 355} r={i % 9 === 0 ? 1.7 : .65} fill={i % 3 ? '#6baaff' : '#ba8eff'} opacity={.18 + i % 5 * .13}/>)}
        <path d="M0 388L80 362 120 377 190 330 226 369 275 355 322 385 730 388 780 365 820 374 892 312 926 352 970 322 1000 341V400H0Z" fill={`url(#${id}ice)`}/>
        <path d="M190 330L182 362 226 369M892 312L868 364 926 352M970 322L940 377" fill="none" stroke="#d4e9ff" opacity=".5"/>
        <g className="tgh-float" stroke="#74cfff" fill="#76baff" fillOpacity=".06"><path d="M93 130L148 197 70 184ZM93 130L112 178 148 197M112 178L70 184M172 235L235 312 114 285ZM172 235L179 285 235 312M179 285L114 285"/>{[[93,130],[148,197],[70,184],[172,235],[235,312],[114,285]].map(([x,y]) => <circle key={x} cx={x} cy={y} r="3" fill="#c2fbff"/>)}</g>
      </g>
      <g fill="none" stroke="#0aaaff">
        <ellipse cx="420" cy="363" rx="221" ry="31" strokeWidth="12" opacity=".25" filter={`url(#${id}bloom)`}/>
        {[213,190,165,138].map((r,i) => <ellipse key={r} cx="420" cy="363" rx={r} ry={r/7} stroke={i%2 ? '#7a57ff' : '#49dcff'} strokeWidth={i===0?2:1} opacity=".8"/>)}
      </g>
      <g className="tgh-hud" style={{ transformOrigin:'420px 205px' }} fill="none">
        {[151,164,178,190].map((r,i) => <circle key={r} cx="420" cy="205" r={r} stroke={i%2?'#734dff':'#199fff'} strokeWidth={i===1?3:1} strokeDasharray={i%2?'4 15':'100 28 10 65'} opacity=".55" className={`tgh-ring ring-${i}`}/>)}
        {Array.from({length:100},(_,i) => {const a=i*TAU/100;return <path key={i} d={`M${420+170*Math.cos(a)},${205+170*Math.sin(a)}L${420+175*Math.cos(a)},${205+175*Math.sin(a)}`} stroke="#51caff" opacity=".7"/>;})}
        <circle className="tgh-scan" cx="420" cy="205" r="183" stroke="#61e9ff" strokeWidth="4" strokeDasharray="75 1075" filter={`url(#${id}soft)`}/>
      </g>
      <g className="tgh-circle" role="slider" aria-label="Unit circle angle; click to pause or resume, use arrow keys to change" aria-valuemin={0} aria-valuemax={360} aria-valuenow={Math.round(angle)} aria-valuetext={`${angle.toFixed(1)} degrees, sine ${p.y.toFixed(4)}, cosine ${p.x.toFixed(4)}`} tabIndex={0}
        onKeyDown={e => { if (['ArrowLeft','ArrowDown','ArrowRight','ArrowUp','Home',' '].includes(e.key)) {e.preventDefault(); if(e.key===' ')setPlaying(v=>!v); else {setPlaying(false);setTheta(t=>e.key==='Home'?0:(t+(['ArrowLeft','ArrowDown'].includes(e.key)?-1:1)*Math.PI/180+TAU)%TAU);} } }}
        onPointerDown={e=>{dragging.current=true;moved.current=false;e.currentTarget.setPointerCapture(e.pointerId);}}
        onPointerMove={e=>{if(dragging.current){moved.current=true;setPlaying(false);setFromPointer(e.clientX,e.clientY);}}}
        onPointerUp={()=>{dragging.current=false;if(!moved.current)setPlaying(v=>!v);}} onPointerCancel={()=>{dragging.current=false;}}>
        <circle cx="420" cy="205" r="139" fill="#073b75" fillOpacity=".22" stroke="transparent" strokeWidth="20"/>
        <circle cx="420" cy="205" r="119" stroke="#058eff" strokeWidth="15" opacity=".65" fill="none" filter={`url(#${id}bloom)`}/>
        <circle cx="420" cy="205" r="119" stroke="#85eeff" strokeWidth="2.2" fill="none"/>
        <g stroke="#2588d8" opacity=".2">{[-90,-60,-30,30,60,90].map(n=><path key={n} d={`M${420+n} 88V322M301 ${205+n}H539`}/>)}</g>
        <path d="M233 205H606M420 342V29" stroke="#b9faff" strokeWidth="1.6" fill="none"/>
        <path d="M606 205l-12 -5v10ZM420 29l-5 14h10Z" fill="#d8ffff"/>
        <path d={`M420 205L${p.px} ${p.py}`} stroke="#13bfff" strokeWidth="9" opacity=".5" filter={`url(#${id}bloom)`}/>
        <path d={`M420 205L${p.px} ${p.py}`} stroke="#d3ffff" strokeWidth="2"/>
        <path d={`M${p.px} 205V${p.py}H420`} stroke="#85d6ff" strokeDasharray="4 4" fill="none"/>
        <path d={`M451 205A31 31 0 ${angle>180?1:0} 0 ${420+31*p.x} ${205-31*p.y}`} stroke="#6fe8ff" fill="none"/>
        <g fill="#dbfaff" fontSize="23" fontFamily="Georgia" fontStyle="italic"><text x="613" y="231">x</text><text x="430" y="35">y</text><text x="429" y="78">1</text><text x="547" y="232">1</text><text x="258" y="232">−1</text><text x="429" y="339">−1</text><text x="451" y="193">θ</text></g>
        <circle cx={p.px} cy={p.py} r="12" fill="#16cfff" filter={`url(#${id}bloom)`}/>
        <circle cx={p.px} cy={p.py} r="6" fill="#e4ffff" onPointerEnter={()=>setTooltip(true)} onPointerLeave={()=>setTooltip(false)}/>
        <text x={p.px+12} y={p.py-15} fill="#b4faff" fontFamily="Georgia" fontStyle="italic" fontSize="18">(cos θ, sin θ)</text>
      </g>
      <g fill="none"><path d={`M${p.px} ${p.py}H582L610 ${205-68*p.y}`} stroke="#65e6ff" strokeDasharray="3 5" opacity=".4"/>
      {[false,true].map(c=><g key={String(c)} stroke={c?'#b447ff':'#00d9ff'}><path d={wavePath(theta,c)} strokeWidth="12" opacity=".5" filter={`url(#${id}bloom)`}/><path d={wavePath(theta,c)} strokeWidth="4" opacity=".65"/><path d={wavePath(theta,c)} stroke={c?'#ebbbff':'#b1ffff'} strokeWidth="1.5"/></g>)}</g>
      <g fontFamily="Georgia" fontStyle="italic" fontSize="24" fill="#5cddff"><text x="119" y="95">sin θ = y</text><text x="119" y="127">cos θ = x</text><text x="680" y="122">y = sin θ</text><text x="796" y="151" fill="#d980ff">y = cos θ</text></g>
      <g transform="translate(894 329)" fill="none" stroke="#63c9ff" opacity=".8"><circle r="43"/><ellipse rx="43" ry="14"/><ellipse rx="18" ry="43"/><ellipse rx="53" ry="9" transform="rotate(-22)"/><path d="M-43 0H43M0-43V43"/></g>
      <g fill="#91bcfa" fontSize="12" letterSpacing="2"><text x="744" y="43" fontFamily="Georgia" fontStyle="italic" fontSize="24" letterSpacing="0">Angles move the world</text><text x="902" y="217">EXPLORE</text><text x="902" y="239">VISUALIZE</text><text x="902" y="261">APPLY</text><text x="617" y="331">TRIGONOMETRY</text><text x="617" y="351">IN EVERY DIRECTION</text></g>
    </svg>
    <div className="tgh-scene-controls"><button onClick={()=>setPlaying(v=>!v)} aria-label={playing&&!reduced?'Pause circle animation':'Play circle animation'}>{playing&&!reduced?'Ⅱ':'▶'}</button><span>θ {angle.toFixed(1)}° · sin {p.y.toFixed(4)} · cos {p.x.toFixed(4)}</span></div>
    {tooltip&&<div className="tgh-tooltip">θ = {angle.toFixed(1)}°<br/>sin θ = {p.y.toFixed(4)}<br/>cos θ = {p.x.toFixed(4)}<br/>P = ({p.x.toFixed(4)}, {p.y.toFixed(4)})</div>}
  </div>;
}
