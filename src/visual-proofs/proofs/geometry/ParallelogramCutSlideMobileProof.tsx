import { ArrowLeft, MoreVertical, Pause, Play, RotateCcw, X } from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./parallelogram-cut-slide-mobile.css";

export default function ParallelogramCutSlideMobileProof() {
  const navigate = useNavigate();
  const [slant, setSlant] = useState(52);
  const [progress, setProgress] = useState(64);
  const [playing, setPlaying] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const dragging = useRef(false);
  const lastFrame = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    const tick = (time: number) => {
      if (lastFrame.current === null) lastFrame.current = time;
      const elapsed = time - lastFrame.current; lastFrame.current = time;
      setProgress((value) => { const next = value + elapsed / 430; return next >= 100 ? 0 : next; });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); lastFrame.current = null; };
  }, [playing]);

  const moveSlant = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!dragging.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 390;
    setSlant(Math.max(28, Math.min(88, 108 - x)));
  };
  const reset = () => { setSlant(52); setProgress(0); setPlaying(false); setMenuOpen(false); };
  const movingX = 55 + (250 - 55) * progress / 100;
  return (
    <main className="parallelogram-mobile" aria-label="Parallelogram Cut and Slide interactive proof">
      <header className="parallelogram-header"><button type="button" onClick={() => navigate(-1)} aria-label="Back to visual proofs"><ArrowLeft /></button><h1>Parallelogram Cut and Slide</h1><p>4 / 69</p><button type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label="Lesson options"><MoreVertical /></button></header>
      <section className="parallelogram-stage" aria-label="Cut and slide area diagram">
        <svg viewBox="0 0 390 700" role="img" aria-label="A triangular end of a parallelogram slides to make a rectangle with the same base and height" onPointerMove={moveSlant} onPointerUp={() => { dragging.current = false; }} onPointerCancel={() => { dragging.current = false; }}>
          <polygon points={`${55 + slant},112 335,112 ${335 - slant},260 55,260`} fill="#fffaf0" fillOpacity=".55" stroke="#21384a" strokeWidth="2.7" strokeLinejoin="round" />
          <polygon points={`${55 + slant},112 ${55 + slant},260 55,260`} fill="#fb7658" fillOpacity=".9" stroke="#21384a" strokeWidth="2" />
          <line x1={55 + slant} y1="112" x2={55 + slant} y2="260" stroke="#21384a" strokeWidth="2" strokeDasharray="6 6" />
          <g className="parallelogram-shear-handle" role="slider" tabIndex={0} aria-label="Change parallelogram slant" aria-valuemin={28} aria-valuemax={88} aria-valuenow={Math.round(slant)} onPointerDown={(event) => { dragging.current = true; event.currentTarget.setPointerCapture(event.pointerId); }} onKeyDown={(event) => { if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); setSlant((value) => Math.max(28, Math.min(88, value + (event.key === "ArrowLeft" ? -4 : 4)))); } }} transform={`translate(${55 + slant / 2} 187)`}><circle r="17" fill="#fff" stroke="#e7ddd1"/><path d="M-9 0H9M-9 0l5-5M-9 0l5 5M9 0l-5-5M9 0l-5 5" fill="none" stroke="#ee7052" strokeWidth="2.4" strokeLinecap="round"/></g>
          <Measure x1={55} y1={282} x2={335 - slant} y2={282} label="b" lx={(390 - slant) / 2} ly={306} />
          <HeightMeasure x={360} y1={112} y2={260} />
          <path d="M 55 326 Q 45 380 246 380" fill="none" stroke="#8a9298" strokeWidth="2.2" strokeDasharray="2 7" strokeLinecap="round"/><path d="M242 374l8 6-8 6" fill="none" stroke="#8a9298" strokeWidth="2.2"/>
          <polygon points={`${movingX + slant},320 ${movingX + slant},394 ${movingX},394`} fill="#fb7658" stroke="#21384a" strokeWidth="2" opacity={.4 + progress / 170} />
          <polygon points={`${55 + slant},432 335,432 ${335},568 55,568`} fill="#fffaf0" fillOpacity=".62" stroke="#21384a" strokeWidth="2.7" />
          <polygon points={`${335 - slant},568 335,432 335,568`} fill="#fb7658" fillOpacity=".9" stroke="#21384a" strokeWidth="2" />
          <path d={`M ${55 + slant} 432 L 55 568 L ${55 + slant} 568`} fill="none" stroke="#8a9298" strokeWidth="2" strokeDasharray="6 6" />
          <Measure x1={55} y1={590} x2={335} y2={590} label="b" lx="195" ly="615" />
          <HeightMeasure x={360} y1={432} y2={568} />
          <g className="parallelogram-formula" transform="translate(195 660)"><rect x="-65" y="-28" width="130" height="56" rx="6"/><text x="0" y="3"><tspan fill="#253445">A = </tspan><tspan fill="#218ebc">bh</tspan></text></g>
        </svg>
      </section>
      <section className="parallelogram-controls" aria-label="Cut and slide controls"><button type="button" onClick={() => setPlaying((value) => !value)} aria-label={playing ? "Pause cut and slide" : "Play cut and slide"}>{playing ? <Pause/> : <Play/>}</button><button type="button" onClick={reset} aria-label="Reset cut and slide"><RotateCcw/></button></section>
      {menuOpen ? <section className="parallelogram-menu" role="dialog" aria-label="Lesson options"><button type="button" onClick={() => setMenuOpen(false)} aria-label="Close lesson options"><X/></button><h2>Area is preserved</h2><p>Cutting the triangular end and translating it does not stretch or overlap any piece. The new rectangle has the same base b and perpendicular height h, so A = bh.</p><p>Drag the double arrow to change the slant; the area formula remains the same.</p></section> : null}
    </main>
  );
}

function Measure({x1,y1,x2,y2,label,lx,ly}:{x1:number;y1:number;x2:number;y2:number;label:string;lx:number|string;ly:number|string}){return <g><line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#218ebc" strokeWidth="1.7"/><line x1={x1} y1={y1-7} x2={x1} y2={y1+7} stroke="#218ebc" strokeWidth="1.7"/><line x1={x2} y1={y2-7} x2={x2} y2={y2+7} stroke="#218ebc" strokeWidth="1.7"/><text className="parallelogram-measure" x={lx} y={ly}>{label}</text></g>}
function HeightMeasure({x,y1,y2}:{x:number;y1:number;y2:number}){return <g><line x1={x} y1={y1} x2={x} y2={y2} stroke="#218ebc" strokeWidth="1.8"/><circle cx={x} cy={(y1+y2)/2} r="4" fill="#218ebc"/><line x1={x-16} y1={y1} x2={x+16} y2={y1} stroke="#8a9298" strokeWidth="1.5" strokeDasharray="2 5"/><line x1={x-16} y1={y2} x2={x+16} y2={y2} stroke="#8a9298" strokeWidth="1.5" strokeDasharray="2 5"/><text className="parallelogram-measure" x={376} y={(y1+y2)/2+4}>h</text></g>}
