import { ArrowLeft, MoreVertical, Pause, Play, RotateCcw, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./odd-squares-mobile.css";

const colors = ["#343b48", "#ff6a4e", "#ffb52b", "#31c0c8", "#6654cc", "#48a8e8"];

function SquareLayer({ n, size, x, y, active }: { n: number; size: number; x: number; y: number; active: boolean }) {
  const cell = size / n;
  return <g className={active ? "" : "muted"}>{Array.from({ length: n }).flatMap((_, row) => Array.from({ length: n }).map((__, col) => {
    const layer = Math.max(row, col);
    return <rect key={`${row}-${col}`} x={x + col * cell} y={y + row * cell} width={cell - 1} height={cell - 1} rx="2" fill={colors[layer]} />;
  }))}</g>;
}

export default function OddSquaresMobileProof() {
  const navigate = useNavigate();
  const [n, setN] = useState(4);
  const [playing, setPlaying] = useState(false);
  const [highlight, setHighlight] = useState(4);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    if (!playing) return;
    if (n >= 6) { setPlaying(false); return; }
    const timer = window.setTimeout(() => { setN((value) => value + 1); setHighlight((value) => value + 1); }, 700);
    return () => window.clearTimeout(timer);
  }, [n, playing]);
  const setStep = (value: number) => { setN(value); setHighlight(value); setPlaying(false); };
  const reset = () => { setN(4); setHighlight(4); setPlaying(false); setMenuOpen(false); };
  const terms = Array.from({ length: n }, (_, index) => index * 2 + 1);

  return <main className="odd-mobile">
    <header><button onClick={() => navigate(-1)} aria-label="Back to visual proofs"><ArrowLeft /></button><h1>Odd Numbers Build Squares</h1><p>19 / 69</p><button onClick={() => setMenuOpen((value) => !value)} aria-label="Lesson options"><MoreVertical /></button></header>
    <section className="odd-stage">
      <svg viewBox="0 0 390 720" aria-label={`First ${n} odd numbers build a ${n} by ${n} square`}>
        {[1,2,3,4].map((step) => {
          const y = 28 + (step - 1) * 137, size = 42 + step * 13;
          return <g key={step} className={highlight === step ? "row active" : "row"}>
            <circle className="step-circle" cx="31" cy={y + size / 2} r="18" /><text className="step-number" x="31" y={y + size / 2 + 7}>{step}</text>
            <SquareLayer n={step} size={size} x={72} y={y} active={step <= n} />
            <text className="add-label" x="202" y={y + size / 2 + 8}>{step === 1 ? "→" : `+${2 * step - 1}  →`}</text>
            <SquareLayer n={step} size={size} x={274} y={y} active={step <= n} />
          </g>;
        })}
        {n > 4 ? <g className="extension"><text x="195" y="580">Continue the same L-shaped rule</text><SquareLayer n={n} size={105} x={142.5} y={592} active /></g> : null}
        <g className="formula" transform="translate(195 665)"><rect x="-170" y="-45" width="340" height="90" rx="13" /><text x="0" y="8">{terms.join(" + ")} = {n}² = {n * n}</text></g>
      </svg>
    </section>
    <nav className="odd-controls" aria-label="Square growth steps">
      <button onClick={() => setStep(Math.max(1, n - 1))} aria-label="Previous odd layer">−</button>
      <div>{[1,2,3,4,5,6].map((value) => <button key={value} className={n === value ? "selected" : ""} onClick={() => setStep(value)} aria-label={`Build ${value} by ${value} square`}>{value}</button>)}</div>
      <button onClick={() => setPlaying((value) => !value)} aria-label={playing ? "Pause square growth" : "Play square growth"}>{playing ? <Pause /> : <Play />}</button>
      <button onClick={reset} aria-label="Reset odd square proof"><RotateCcw /></button>
    </nav>
    {menuOpen ? <aside role="dialog"><button onClick={() => setMenuOpen(false)} aria-label="Close lesson options"><X /></button><h2>Each border has odd size</h2><p>Growing an (n−1)² square to n² adds one row and one column, sharing a corner: n+n−1 = 2n−1 new tiles.</p></aside> : null}
  </main>;
}
