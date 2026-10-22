import { ArrowLeft, ChevronLeft, ChevronRight, MoreVertical, Pause, Play, RotateCcw, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./equation-balance-mobile.css";

function Tile({ x, y, variable = false, faded = false }: { x: number; y: number; variable?: boolean; faded?: boolean }) {
  return <g className={`balance-tile ${variable ? "variable" : "unit"} ${faded ? "faded" : ""}`}><rect x={x} y={y} width={variable ? 35 : 22} height={variable ? 35 : 25} rx="3" /><text x={x + (variable ? 17.5 : 11)} y={y + (variable ? 25 : 18)}>{variable ? "x" : ""}</text></g>;
}

function Scale({ y, afterSubtract = false, divided = false, active = true }: { y: number; afterSubtract?: boolean; divided?: boolean; active?: boolean }) {
  const leftUnits = afterSubtract ? 4 : 3;
  const rightUnits = afterSubtract ? 8 : 11;
  return (
    <g className={active ? "" : "future"}>
      <line className="beam" x1="72" y1={y} x2="318" y2={y} />
      <line className="stand" x1="195" y1={y} x2="195" y2={y + 73} />
      <path className="base" d={`M174 ${y + 74}h42l15 12h-72Z`} />
      <line className="chain" x1="76" y1={y} x2="55" y2={y + 55} /><line className="chain" x1="76" y1={y} x2="97" y2={y + 55} />
      <line className="chain" x1="314" y1={y} x2="293" y2={y + 55} /><line className="chain" x1="314" y1={y} x2="335" y2={y + 55} />
      <path className="pan" d={`M35 ${y + 55} Q76 ${y + 72} 117 ${y + 55}`} /><path className="pan" d={`M273 ${y + 55} Q314 ${y + 72} 355 ${y + 55}`} />
      <Tile x={42} y={y + 22} variable /><Tile x={80} y={y + 22} variable />
      {Array.from({ length: leftUnits }).map((_, index) => <Tile key={`l${index}`} x={37 + index * 24} y={y + 51 - (index % 2) * 27} faded={!afterSubtract && index < 3} />)}
      {Array.from({ length: rightUnits }).map((_, index) => <Tile key={`r${index}`} x={276 + (index % 4) * 24} y={y + 51 - Math.floor(index / 4) * 27} faded={!afterSubtract && index < 3} />)}
      {divided ? <line className="divide-mark" x1="76" y1={y + 12} x2="76" y2={y + 59} /> : null}
      {divided ? <line className="divide-mark" x1="314" y1={y + 12} x2="314" y2={y + 59} /> : null}
    </g>
  );
}

export default function EquationBalanceMobileProof() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!playing) return;
    if (step >= 2) { setPlaying(false); return; }
    const timer = window.setTimeout(() => setStep((value) => value + 1), 850);
    return () => window.clearTimeout(timer);
  }, [playing, step]);

  const reset = () => { setStep(0); setPlaying(false); setMenuOpen(false); };

  return (
    <main className="balance-mobile">
      <header>
        <button onClick={() => navigate(-1)} aria-label="Back to visual proofs"><ArrowLeft /></button>
        <h1>Equation as a Balance</h1>
        <p>16 / 69</p>
        <button onClick={() => setMenuOpen((value) => !value)} aria-label="Lesson options"><MoreVertical /></button>
      </header>

      <section className="balance-stage">
        <svg viewBox="0 0 390 780" aria-label={`Equation balance at step ${step + 1} of 3`}>
          <text className="equation" x="195" y="49">{step === 0 ? "2x + 3 = 11" : step === 1 ? "2x = 8" : "x = 4"}</text>
          <Scale y={91} afterSubtract={step >= 1} active />

          <g className="operation" role="button" tabIndex={0} aria-label="Apply subtract 3 to both sides" aria-disabled={step >= 1} onClick={() => setStep((value) => Math.max(1, value))} transform="translate(195 283)">
            <circle r="24" /><text y="8">−3</text>
          </g>
          <path className="operation-arrows" d="M171 283Q105 270 74 300M219 283Q285 270 316 300" />

          <g className={step >= 1 ? "" : "future"}>
            <Scale y={335} afterSubtract active={step >= 1} />
            <text className="step-equation" x="195" y="450">2x = 8</text>
          </g>

          <g className={step >= 1 ? "operation divide" : "operation divide future"} role="button" tabIndex={0} aria-label="Divide both sides by 2" aria-disabled={step < 1 || step >= 2} onClick={() => { if (step >= 1) setStep(2); }} transform="translate(195 491)">
            <circle r="24" /><text y="7">÷2</text>
          </g>

          <g className={step >= 2 ? "" : "future"}>
            <Scale y={544} afterSubtract divided active={step >= 2} />
            <g className="answer" transform="translate(195 713)"><rect x="-160" y="-42" width="320" height="84" rx="14" /><Tile x={-112} y="-18" variable /><text x="-51" y="13">=</text>{[0,1,2,3].map((item) => <Tile key={item} x={-10 + item * 28} y="-13" />)}<line x1="116" y1="-28" x2="116" y2="28" /><text className="result" x="140" y="13">x = 4</text></g>
          </g>
        </svg>
      </section>

      <nav className="balance-controls" aria-label="Equation steps">
        <button onClick={() => { setPlaying(false); setStep((value) => Math.max(0, value - 1)); }} disabled={step === 0} aria-label="Previous equation step"><ChevronLeft /></button>
        <button className="play" onClick={() => setPlaying((value) => !value)} aria-label={playing ? "Pause balance animation" : "Play balance animation"}>{playing ? <Pause /> : <Play />}</button>
        <span>Step {step + 1} of 3</span>
        <button onClick={() => { setPlaying(false); setStep((value) => Math.min(2, value + 1)); }} disabled={step === 2} aria-label="Next equation step"><ChevronRight /></button>
      </nav>

      {menuOpen ? <aside role="dialog"><button onClick={() => setMenuOpen(false)} aria-label="Close lesson options"><X /></button><h2>Keep both sides equal</h2><p>Subtract 3 from both pans, then divide both pans into two equal groups. Doing the same operation to both sides preserves balance.</p><button onClick={reset} aria-label="Reset equation balance"><RotateCcw /> Reset</button></aside> : null}
    </main>
  );
}
