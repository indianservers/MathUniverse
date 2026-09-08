import { ArrowLeft, MoreVertical, Pause, Play, RotateCcw, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./matrix-area-mobile.css";

type Matrix = { a: number; b: number; c: number; d: number };
const initial: Matrix = { a: 2, b: 1, c: 1, d: 2 };

export default function MatrixAreaMobileProof() {
  const navigate = useNavigate();
  const [matrix, setMatrix] = useState(initial);
  const [progress, setProgress] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const determinant = matrix.a * matrix.d - matrix.b * matrix.c;
  const sx = (value: number) => 264 + value * 34;
  const sy = (value: number) => 254 - value * 34;
  const tx = (x: number, y: number) => x * (1 - progress) + (matrix.a * x + matrix.b * y) * progress;
  const ty = (x: number, y: number) => y * (1 - progress) + (matrix.c * x + matrix.d * y) * progress;
  const transformed = [[0,0],[1,0],[1,1],[0,1]].map(([x,y]) => `${sx(tx(x,y))},${sy(ty(x,y))}`).join(" ");

  useEffect(() => {
    if (!playing) return;
    if (progress >= 1) { setPlaying(false); return; }
    const timer = window.setTimeout(() => setProgress((value) => Math.min(1, value + 0.04)), 35);
    return () => window.clearTimeout(timer);
  }, [playing, progress]);

  const setEntry = (key: keyof Matrix, value: number) => setMatrix((current) => ({ ...current, [key]: value }));
  const reset = () => { setMatrix(initial); setProgress(1); setPlaying(false); setMenuOpen(false); };
  const animate = () => {
    if (playing) setPlaying(false);
    else { if (progress >= 1) setProgress(0); setPlaying(true); }
  };

  return (
    <main className="matrix-area-mobile">
      <header>
        <button onClick={() => navigate(-1)} aria-label="Back to visual proofs"><ArrowLeft /></button>
        <div><h1>Matrix Area Transformation</h1><p>17 / 69</p></div>
        <button onClick={() => setMenuOpen((value) => !value)} aria-label="Lesson options"><MoreVertical /></button>
      </header>

      <section className="matrix-area-stage">
        <svg viewBox="0 0 390 500" aria-label={`Matrix determinant ${determinant.toFixed(2)}, absolute area scale ${Math.abs(determinant).toFixed(2)}`}>
          <defs><marker id="matrix-arrow" markerUnits="userSpaceOnUse" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0 0 7 3.5 0 7Z" /></marker></defs>
          {[50,84,118,152,186,220,254,288,322,356].map((value) => <g key={value}><line className="grid" x1={value} y1="52" x2={value} y2="300" /><line className="grid" x1="20" y1={value - 2} x2="370" y2={value - 2} /></g>)}
          <line className="axis" x1="20" y1="254" x2="190" y2="254" markerEnd="url(#matrix-arrow)" /><line className="axis" x1="54" y1="300" x2="54" y2="70" markerEnd="url(#matrix-arrow)" />
          <polygon className="unit-square" points="54,254 122,254 122,186 54,186" />
          <line className="basis e1" x1="54" y1="254" x2="122" y2="254" markerEnd="url(#matrix-arrow)" /><line className="basis e2" x1="54" y1="254" x2="54" y2="186" markerEnd="url(#matrix-arrow)" />
          <text className="basis-label red" x="128" y="250">e₁</text><text className="basis-label amber" x="45" y="178">e₂</text>

          <text className="map-label" x="205" y="160">A</text><path className="map-arrow" d="M177 176h54" markerEnd="url(#matrix-arrow)" />

          <line className="axis" x1="235" y1="254" x2="370" y2="254" markerEnd="url(#matrix-arrow)" /><line className="axis" x1="264" y1="300" x2="264" y2="70" markerEnd="url(#matrix-arrow)" />
          <polygon className={determinant < 0 ? "transformed flipped" : "transformed"} points={transformed} />
          <line className="basis out-one" x1={sx(0)} y1={sy(0)} x2={sx(tx(1,0))} y2={sy(ty(1,0))} markerEnd="url(#matrix-arrow)" />
          <line className="basis out-two" x1={sx(0)} y1={sy(0)} x2={sx(tx(0,1))} y2={sy(ty(0,1))} markerEnd="url(#matrix-arrow)" />

          <g className="matrix-card" transform="translate(195 350)">
            <rect x="-174" y="-39" width="348" height="78" rx="14" />
            <text className="matrix-label" x="-136" y="8">A =</text>
            <text className="matrix-value" x="-82" y="-8">{matrix.a.toFixed(1)}</text><text className="matrix-value" x="-29" y="-8">{matrix.b.toFixed(1)}</text>
            <text className="matrix-value purple" x="-82" y="24">{matrix.c.toFixed(1)}</text><text className="matrix-value purple" x="-29" y="24">{matrix.d.toFixed(1)}</text>
            <line x1="-104" y1="-30" x2="-104" y2="31" /><line x1="0" y1="-30" x2="0" y2="31" />
            <text className="det-label" x="50" y="-10">det(A)</text><text className="det-value" x="50" y="23">{determinant.toFixed(1)}</text>
            <text className="det-label" x="127" y="-10">|det(A)|</text><text className="det-value" x="127" y="23">{Math.abs(determinant).toFixed(1)}</text>
          </g>

          <g className="orientation-card" transform="translate(195 447)">
            <rect x="-174" y="-39" width="348" height="78" rx="14" />
            <text x="0" y="-9">{determinant > 0 ? "Orientation preserved" : determinant < 0 ? "Orientation reversed" : "Area collapsed"}</text>
            <text className="area-message" x="0" y="21">Area × {Math.abs(determinant).toFixed(1)}</text>
          </g>
        </svg>
      </section>

      <section className="matrix-entry-controls" aria-label="Matrix entries">
        {(["a","b","c","d"] as const).map((key) => <label key={key}><span>{key}</span><input aria-label={`Matrix entry ${key}`} type="range" min="-2" max="3" step=".25" value={matrix[key]} onChange={(event) => setEntry(key, Number(event.target.value))} /></label>)}
      </section>

      <nav className="matrix-area-controls">
        <button onClick={reset} aria-label="Reset matrix transformation"><RotateCcw /></button>
        <button className="play" onClick={animate} aria-label={playing ? "Pause matrix transformation" : "Animate matrix transformation"}>{playing ? <Pause /> : <Play />}</button>
        <label><span>Transform</span><input aria-label="Transformation progress" type="range" min="0" max="1" step=".01" value={progress} onChange={(event) => { setPlaying(false); setProgress(Number(event.target.value)); }} /></label>
        <button onClick={() => setMatrix(({ a, b, c, d }) => ({ a: b, b: a, c: d, d: c }))} aria-label="Flip matrix orientation">±</button>
      </nav>

      {menuOpen ? <aside role="dialog"><button onClick={() => setMenuOpen(false)} aria-label="Close lesson options"><X /></button><h2>Determinant measures signed area</h2><p>The transformed basis vectors form a parallelogram. Its area is |det(A)| times the original square; the determinant sign records orientation.</p></aside> : null}
    </main>
  );
}
