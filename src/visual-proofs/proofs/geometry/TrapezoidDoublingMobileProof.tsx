import { ArrowLeft, LockKeyhole, MoreVertical, Pause, Play, RotateCcw, X } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import "./trapezoid-doubling-mobile.css";

export default function TrapezoidDoublingMobileProof() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(48);
  const [playing, setPlaying] = useState(true);
  const [locked, setLocked] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastFrame = useRef<number | null>(null);
  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    const tick = (time: number) => {
      if (lastFrame.current === null) lastFrame.current = time;
      const elapsed = time - lastFrame.current; lastFrame.current = time;
      setProgress((value) => { const next = value + elapsed / 500; return next >= 100 ? 0 : next; });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); lastFrame.current = null; };
  }, [playing]);
  const reset = () => { setProgress(0); setPlaying(false); setLocked(true); setMenuOpen(false); };
  return (
    <main className="trapezoid-mobile" aria-label="Trapezoid Doubling Proof interactive lesson">
      <header className="trapezoid-header"><button type="button" onClick={() => navigate(-1)} aria-label="Back to visual proofs"><ArrowLeft/></button><div><h1>Trapezoid Doubling Proof</h1><p>5 / 69</p></div><button type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label="Lesson options"><MoreVertical/></button></header>
      <section className="trapezoid-stage" aria-label="Trapezoid duplication diagram">
        <svg viewBox="0 0 390 700" role="img" aria-label="Two congruent trapezoids form a parallelogram of base a plus b and height h">
          <g><polygon points="96,108 185,108 240,244 45,244" fill="#aba9dd" fillOpacity=".78" stroke="#1f3550" strokeWidth="2.5"/><line x1="160" y1="108" x2="180" y2="244" stroke="#1f3550" strokeWidth="1.7" strokeDasharray="6 6"/>
            <Measure x1={96} x2={185} y={95} color="#248eca" label="a" lx={140} ly={77}/><Measure x1={45} x2={240} y={257} color="#ef6c4d" label="b      a" lx={143} ly={279}/><Height x={32} y1={108} y2={244}/>
          </g>
          <path d="M190 91 Q250 48 324 101" fill="none" stroke="#797fc2" strokeWidth="2.2" strokeDasharray="8 7"/><path d="M316 93l10 10-13 2" fill="#797fc2"/>
          <g transform={`translate(${progress * .42} 0) rotate(${progress * 1.8} 270 176)`} opacity={.22 + progress / 130}><polygon points="262,108 332,108 376,244 218,244" fill="#c5c3e8" fillOpacity=".5" stroke="#797fc2" strokeWidth="2" strokeDasharray="7 6"/></g>
          <g className="trapezoid-rotate-button" role="button" tabIndex={0} aria-label="Rotate duplicate trapezoid" onClick={() => { setPlaying(false); setProgress((value) => value < 70 ? 100 : 0); }}><circle cx="222" cy="183" r="21"/><path d="M213 184a10 10 0 1 0 4-9M216 169l2 8-8-1" fill="none" stroke="#5854c9" strokeWidth="2.5" strokeLinecap="round"/></g>
          <foreignObject x="35" y="315" width="320" height="38"><label className="trapezoid-progress" style={{"--trap-progress":`${progress}%`} as CSSProperties}><input type="range" min="0" max="100" value={Math.round(progress)} onChange={(event)=>{setPlaying(false);setProgress(Number(event.target.value));}} aria-label="Doubling progress"/><span><Pause/></span></label></foreignObject>
          <g><polygon points="96,430 335,430 275,560 45,560" fill="#aaa8dc" fillOpacity=".78" stroke="#1f3550" strokeWidth="2.5"/><line x1="196" y1="430" x2="168" y2="560" stroke="#1f3550" strokeWidth="2"/>
            <Measure x1={96} x2={196} y={417} color="#248eca" label="a" lx={146} ly={400}/><Measure x1={196} x2={335} y={417} color="#ef6c4d" label="b" lx={264} ly={400}/><Measure x1={45} x2={275} y={575} color="#efa321" label="a + b" lx={160} ly={598}/><Height x={32} y1={430} y2={560}/>
            <g className={locked?"trapezoid-lock active":"trapezoid-lock"} role="button" tabIndex={0} aria-label={locked?"Unlock congruent trapezoids":"Lock congruent trapezoids"} onClick={()=>setLocked(v=>!v)}><rect x="188" y="424" width="20" height="24" rx="5"/><LockKeyhole x="190" y="426" width="16" height="16"/><rect x="158" y="536" width="20" height="24" rx="5"/><LockKeyhole x="160" y="538" width="16" height="16"/></g>
          </g>
          <g className="trapezoid-formula" transform="translate(195 648)"><rect x="-112" y="-26" width="224" height="52" rx="8"/><text x="0" y="3"><tspan fill="#26323e">A = ½(</tspan><tspan fill="#278fc6">a</tspan><tspan fill="#26323e"> + </tspan><tspan fill="#ef6c4d">b</tspan><tspan fill="#26323e">)h</tspan></text></g>
        </svg>
      </section>
      <section className="trapezoid-controls" aria-label="Doubling controls"><button type="button" onClick={reset} aria-label="Reset doubling proof"><RotateCcw/></button><button className="primary" type="button" onClick={()=>setPlaying(v=>!v)} aria-label={playing?"Pause doubling proof":"Play doubling proof"}>{playing?<Pause/>:<Play/>}</button></section>
      {menuOpen?<section className="trapezoid-menu" role="dialog" aria-label="Lesson options"><button type="button" onClick={()=>setMenuOpen(false)} aria-label="Close lesson options"><X/></button><h2>Double, then halve</h2><p>A rotated copy joins the original to make a parallelogram with base a + b and height h. One trapezoid is half of that area: A = ½(a + b)h.</p><p>Use the purple progress bar to control the rotation.</p></section>:null}
    </main>
  );
}

function Measure({x1,x2,y,color,label,lx,ly}:{x1:number;x2:number;y:number;color:string;label:string;lx:number;ly:number}){return <g><line x1={x1} y1={y} x2={x2} y2={y} stroke={color} strokeWidth="1.6"/><line x1={x1} y1={y-6} x2={x1} y2={y+6} stroke={color} strokeWidth="1.6"/><line x1={x2} y1={y-6} x2={x2} y2={y+6} stroke={color} strokeWidth="1.6"/><text className="trapezoid-measure" x={lx} y={ly} fill={color}>{label}</text></g>}
function Height({x,y1,y2}:{x:number;y1:number;y2:number}){return <g><line x1={x} y1={y1} x2={x} y2={y2} stroke="#888f98" strokeWidth="1.5"/><path d={`M${x} ${y1}l-5 9h10zM${x} ${y2}l-5-9h10z`} fill="#888f98"/><line x1={x-12} y1={y1} x2={x+12} y2={y1} stroke="#888f98" strokeDasharray="2 5"/><line x1={x-12} y1={y2} x2={x+12} y2={y2} stroke="#888f98" strokeDasharray="2 5"/><text className="trapezoid-measure" x={31} y={(y1+y2)/2} fill="#5556c4">h</text></g>}
