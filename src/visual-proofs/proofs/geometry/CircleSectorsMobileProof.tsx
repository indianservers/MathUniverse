import { ArrowLeft, Minus, MoreVertical, Pause, Play, Plus, RotateCcw, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./circle-sectors-mobile.css";

const COLORS = ["#62c7c7", "#ff8069"];
const polar = (cx: number, cy: number, r: number, degrees: number) => { const radians = (degrees - 90) * Math.PI / 180; return { x: cx + r * Math.cos(radians), y: cy + r * Math.sin(radians) }; };
const sectorPath = (cx: number, cy: number, r: number, start: number, end: number) => { const a = polar(cx, cy, r, end); const b = polar(cx, cy, r, start); return `M${cx} ${cy}L${a.x} ${a.y}A${r} ${r} 0 ${end-start>180?1:0} 0 ${b.x} ${b.y}Z`; };

export default function CircleSectorsMobileProof() {
  const navigate = useNavigate();
  const [pieces, setPieces] = useState(16);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastFrame = useRef<number | null>(null);
  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    const tick = (time: number) => {
      if (lastFrame.current === null) lastFrame.current = time;
      const elapsed = time - lastFrame.current; lastFrame.current = time;
      setProgress((value) => { const next = value + elapsed / 45; if (next >= 100) { setPlaying(false); return 100; } return next; });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); lastFrame.current = null; };
  }, [playing]);
  const changePieces = (delta: number) => { setPieces((value) => Math.max(8, Math.min(32, value + delta))); setProgress(0); setPlaying(false); };
  const restart = () => { setProgress(0); setPlaying(true); };
  const reset = () => { setPieces(16); setProgress(0); setPlaying(false); setMenuOpen(false); };
  const angle = 360 / pieces;
  const travel = Math.min(1, progress / 72);
  return <main className="circle-sectors-mobile" aria-label="Circle Sectors to Rectangle interactive lesson">
    <header className="circle-sectors-header"><button type="button" onClick={() => navigate(-1)} aria-label="Back to visual proofs"><ArrowLeft /></button><div><h1>Circle Sectors to Rectangle</h1><p>6 / 69</p></div><button type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label="Lesson options"><MoreVertical /></button></header>
    <section className="circle-sectors-stage" aria-label="Circle sector rearrangement diagram">
      <svg viewBox="0 0 390 700" role="img" aria-label={`${pieces} alternating circle sectors rearrange into a rectangle with base pi r and height r`}>
        <defs><filter id="sector-shadow" x="-30%" y="-30%" width="170%" height="170%"><feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity=".16"/></filter></defs>
        <g aria-label={`${pieces} sectors in the original circle`}>{Array.from({length: pieces}, (_, index) => <path key={index} d={sectorPath(153,177,101,index*angle,(index+1)*angle)} fill={COLORS[index%2]} stroke="#26343b" strokeWidth="1" />)}<circle cx="153" cy="177" r="101" fill="none" stroke="#26343b" strokeWidth="1.8" /></g>
        <RadiusMeasure x={31} y1={76} y2={278} />
        {[1,4,7,10].map((index, order) => { const targets=[{x:278,y:66,a:1},{x:320,y:146,a:202},{x:320,y:231,a:126},{x:285,y:298,a:238}]; const target=targets[order]; const cx=153+(target.x-153)*travel, cy=177+(target.y-177)*travel, r=101-43*travel, original=index*angle, start=original+(target.a-original)*travel; return <path key={`travel-${index}`} d={sectorPath(cx,cy,r,start,start+angle)} fill={COLORS[index%2]} stroke="#26343b" strokeWidth="1.2" opacity={.12+.88*travel} filter="url(#sector-shadow)"/>; })}
        <g strokeWidth="1.2" fill="none" strokeDasharray="4 3" opacity={.35+.65*travel}>{["M208 99Q248 48 281 72","M246 144Q292 111 326 139","M249 191Q296 181 325 218","M231 236Q276 249 296 286"].map((d,i)=><path key={d} d={d} stroke={COLORS[(i+1)%2]}/>)}</g>
        <path d="M153 304v27m-8-8 8 8 8-8" fill="none" stroke="#8c8e8e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <g transform="translate(45 354)" opacity={.3+.7*Math.max(0,(progress-28)/72)}>{Array.from({length: pieces},(_,index)=>{const width=280/pieces,x=index*width,up=index%2===0;return <path key={index} d={up?`M${x} 84L${x+width*.12} 0Q${x+width/2} -4 ${x+width*.88} 0L${x+width} 84Q${x+width/2} 89 ${x} 84Z`:`M${x} 0Q${x+width/2} -4 ${x+width} 0L${x+width*.88} 84Q${x+width/2} 89 ${x+width*.12} 84Z`} fill={COLORS[index%2]} stroke="#26343b" strokeWidth="1"/>})}</g>
        <RadiusMeasure x={350} y1={354} y2={438} compact />
        <g className="circle-pi-measure"><line x1="45" y1="460" x2="325" y2="460"/><line x1="45" y1="452" x2="45" y2="468"/><line x1="325" y1="452" x2="325" y2="468"/><text x="185" y="472">πr</text></g>
        <g className="circle-area-formula" transform="translate(195 530)"><rect x="-74" y="-27" width="148" height="54" rx="7"/><text x="0" y="4">A = πr²</text></g>
      </svg>
    </section>
    <section className="circle-sectors-controls" aria-label="Sector controls"><button type="button" onClick={reset} aria-label="Reset circle sectors"><RotateCcw /></button><div className="circle-piece-count"><button type="button" onClick={()=>changePieces(-2)} disabled={pieces===8} aria-label="Decrease sector count"><Minus /></button><output aria-label="Sector count">{pieces}</output><button type="button" onClick={()=>changePieces(2)} disabled={pieces===32} aria-label="Increase sector count"><Plus /></button></div><button className="primary" type="button" onClick={()=>setPlaying((value)=>!value)} aria-label={playing?"Pause rearrangement":"Play rearrangement"}>{playing?<Pause/>:<Play/>}</button><button type="button" onClick={restart} aria-label="Restart rearrangement animation"><RotateCcw /></button></section>
    {menuOpen?<section className="circle-sectors-menu" role="dialog" aria-label="Lesson options"><button type="button" onClick={()=>setMenuOpen(false)} aria-label="Close lesson options"><X/></button><h2>Why the rectangle appears</h2><p>Alternating thin sectors makes opposite curved edges nearly straight. The shape approaches a rectangle with height r and base half the circumference, πr.</p><p>So A = πr × r = πr². Increase the sector count to make the edges straighter.</p></section>:null}
  </main>;
}

function RadiusMeasure({x,y1,y2,compact=false}:{x:number;y1:number;y2:number;compact?:boolean}) { return <g className="circle-radius-measure"><line x1={x} y1={y1} x2={x} y2={y2}/><circle cx={x} cy={y1} r="2.4"/><circle cx={x} cy={y2} r="2.4"/><line x1={x-10} y1={y1} x2={x+10} y2={y1}/><line x1={x-10} y1={y2} x2={x+10} y2={y2}/><text x={compact?x+11:x-8} y={(y1+y2)/2+5}>r</text></g> }
