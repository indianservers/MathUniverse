import { ArrowLeft, ChevronLeft, ChevronRight, Grid3X3, MoreVertical, Pause, Play, RotateCcw, ScanLine, Waves, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./eigenvector-direction-mobile.css";

const matrices = [
  { a: 1.2, b: 0.4, c: 0.4, d: 1.2, eigenAngle: 45 },
  { a: 1.8, b: 0, c: 0, d: 0.6, eigenAngle: 0 },
  { a: 0.8, b: -0.5, c: -0.5, d: 1.4, eigenAngle: -60 },
];
const toRad = (degrees: number) => degrees * Math.PI / 180;

export default function EigenvectorDirectionMobileProof() {
  const navigate = useNavigate();
  const [matrixIndex, setMatrixIndex] = useState(0);
  const [angle, setAngle] = useState(45);
  const [playing, setPlaying] = useState(false);
  const [showField, setShowField] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const matrix = matrices[matrixIndex];
  const v = { x: Math.cos(toRad(angle)), y: Math.sin(toRad(angle)) };
  const av = { x: matrix.a * v.x + matrix.b * v.y, y: matrix.c * v.x + matrix.d * v.y };
  const lambda = av.x * v.x + av.y * v.y;
  const cross = Math.abs(v.x * av.y - v.y * av.x);
  const aligned = cross < 0.035;
  const scale = 72;
  const origin = { x: 195, y: 240 };

  useEffect(() => {
    if (!playing) return;
    const target = matrix.eigenAngle;
    const delta = target - angle;
    if (Math.abs(delta) < 0.8) { setAngle(target); setPlaying(false); return; }
    const timer = window.setTimeout(() => setAngle((value) => value + Math.sign(delta) * Math.min(3, Math.abs(delta))), 35);
    return () => window.clearTimeout(timer);
  }, [angle, matrix, playing]);

  const changeMatrix = (direction: number) => {
    setPlaying(false);
    const next = (matrixIndex + direction + matrices.length) % matrices.length;
    setMatrixIndex(next);
    setAngle(matrices[next].eigenAngle + 28);
  };
  const reset = () => { setMatrixIndex(0); setAngle(45); setPlaying(false); setShowField(true); setMenuOpen(false); };

  return (
    <main className="eigen-mobile">
      <header>
        <button onClick={() => navigate(-1)} aria-label="Back to visual proofs"><ArrowLeft /></button>
        <h1>Eigenvector Direction</h1><p>18 / 69</p>
        <button onClick={() => setMenuOpen((value) => !value)} aria-label="Lesson options"><MoreVertical /></button>
      </header>

      <section className="eigen-stage">
        <svg viewBox="0 0 390 540" aria-label={aligned ? `v is an eigenvector with lambda ${lambda.toFixed(2)}` : `v changes direction under A; projected lambda ${lambda.toFixed(2)}`}>
          <defs><marker id="eigen-arrow" markerUnits="userSpaceOnUse" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 8 4 0 8Z" /></marker></defs>
          {[-2,-1.5,-1,-.5,0,.5,1,1.5,2].map((value) => <g key={value}><line className="grid" x1={origin.x + value * scale} y1="45" x2={origin.x + value * scale} y2="405" /><line className="grid" x1="20" y1={origin.y - value * scale} x2="370" y2={origin.y - value * scale} /></g>)}
          <line className="axis" x1="18" y1={origin.y} x2="372" y2={origin.y} markerEnd="url(#eigen-arrow)" /><line className="axis" x1={origin.x} y1="407" x2={origin.x} y2="42" markerEnd="url(#eigen-arrow)" />
          {showField ? [-1.5,-.75,0,.75,1.5].flatMap((x) => [-1.5,-.75,0,.75,1.5].map((y) => {
            const dx = matrix.a * x + matrix.b * y;
            const dy = matrix.c * x + matrix.d * y;
            const length = Math.hypot(dx, dy) || 1;
            return <line key={`${x}:${y}`} className="field-vector" x1={origin.x + x * scale} y1={origin.y - y * scale} x2={origin.x + x * scale + dx / length * 25} y2={origin.y - y * scale - dy / length * 25} markerEnd="url(#eigen-arrow)" />;
          })) : null}
          <line className="eigen-line" x1={origin.x - Math.cos(toRad(matrix.eigenAngle)) * 210} y1={origin.y + Math.sin(toRad(matrix.eigenAngle)) * 210} x2={origin.x + Math.cos(toRad(matrix.eigenAngle)) * 210} y2={origin.y - Math.sin(toRad(matrix.eigenAngle)) * 210} />
          <line className="input-vector" x1={origin.x} y1={origin.y} x2={origin.x + v.x * scale * 1.6} y2={origin.y - v.y * scale * 1.6} markerEnd="url(#eigen-arrow)" />
          <line className={aligned ? "output-vector aligned" : "output-vector"} x1={origin.x} y1={origin.y} x2={origin.x + av.x * scale} y2={origin.y - av.y * scale} markerEnd="url(#eigen-arrow)" />
          <text className="v-label" x={origin.x + v.x * scale * 1.75} y={origin.y - v.y * scale * 1.75}>v</text>
          <text className="av-label" x={origin.x + av.x * scale + 12} y={origin.y - av.y * scale}>Av</text>

          <g className={aligned ? "eigen-formula good" : "eigen-formula"} transform="translate(195 460)">
            <rect x="-93" y="-34" width="186" height="68" rx="18" />
            <text x="0" y="9">Av {aligned ? "=" : "≠"} λv</text>
          </g>
          <text className="alignment-status" x="195" y="520">{aligned ? "Direction preserved — eigenvector found" : "Direction turns — rotate v toward the cyan line"}</text>
        </svg>
      </section>

      <section className="eigen-panel">
        <div className="matrix-picker">
          <button onClick={() => changeMatrix(-1)} aria-label="Previous matrix"><ChevronLeft /></button>
          <div><span>A</span><strong>{matrix.a.toFixed(1)} {matrix.b.toFixed(1)}<br />{matrix.c.toFixed(1)} {matrix.d.toFixed(1)}</strong></div>
          <button onClick={() => changeMatrix(1)} aria-label="Next matrix"><ChevronRight /></button>
        </div>
        <div className="lambda-card"><span>λ</span><strong>{lambda.toFixed(2)}</strong><small>{aligned ? "eigenvalue" : "projection"}</small></div>
        <label><span>v angle {Math.round(angle)}°</span><input aria-label="Vector direction" type="range" min="-90" max="90" step="1" value={angle} onChange={(event) => { setPlaying(false); setAngle(Number(event.target.value)); }} /></label>
      </section>

      <nav className="eigen-controls">
        <button className={showField ? "active" : ""} onClick={() => setShowField((value) => !value)} aria-label="Toggle vector field" aria-pressed={showField}><Grid3X3 /></button>
        <button onClick={() => setAngle(matrix.eigenAngle)} aria-label="Snap to eigenvector"><ScanLine /></button>
        <button onClick={() => setAngle((value) => -value)} aria-label="Reverse vector direction"><Waves /></button>
        <button className="play" onClick={() => setPlaying((value) => !value)} aria-label={playing ? "Pause eigenvector animation" : "Animate toward eigenvector"}>{playing ? <Pause /> : <Play />}</button>
      </nav>

      {menuOpen ? <aside role="dialog"><button onClick={() => setMenuOpen(false)} aria-label="Close lesson options"><X /></button><h2>A direction that does not turn</h2><p>For an eigenvector, applying A only stretches, shrinks, or reverses v. The output Av remains on the same line: Av = λv.</p><button onClick={reset} aria-label="Reset eigenvector lesson"><RotateCcw /> Reset</button></aside> : null}
    </main>
  );
}
