import { ArrowLeft, MoreVertical, Pause, Play, RotateCcw, Undo2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./pythagorean-rearrangement-mobile.css";

const triangleColors = ["#ff7865", "#ffad35", "#43bfd8", "#7068d8"];

export default function PythagoreanRearrangementMobileProof() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [selectedTriangle, setSelectedTriangle] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) return;
    timer.current = window.setInterval(() => setStep((value) => (value + 1) % 4), 1500);
    return () => { if (timer.current !== null) window.clearInterval(timer.current); };
  }, [playing]);

  const reset = () => {
    setStep(0);
    setPlaying(false);
    setSelectedTriangle(null);
    setMenuOpen(false);
  };

  return (
    <main className="pythagorean-proof-mobile" aria-label="Pythagorean rearrangement interactive proof">
      <header className="pythagorean-proof-header">
        <button type="button" onClick={() => navigate(-1)} aria-label="Back to visual proofs"><ArrowLeft /></button>
        <div><h1>Pythagorean Rearrangement</h1><p>2 / 69</p></div>
        <button type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label="Lesson options"><MoreVertical /></button>
      </header>

      <section className="pythagorean-proof-stage" aria-label="Two equal-square rearrangements">
        <svg viewBox="0 0 390 570" role="img" aria-label="Four congruent right triangles leave area c squared in one arrangement and areas a squared plus b squared in the other">
          <g className={step % 2 === 0 ? "pythagorean-panel active" : "pythagorean-panel"}>
            <OuterSquare x={18} y={174} />
            <Triangle index={1} points="18,174 125,174 18,239" color={triangleColors[0]} selected={selectedTriangle === 1} onSelect={setSelectedTriangle} />
            <Triangle index={2} points="125,174 178,174 178,264" color={triangleColors[1]} selected={selectedTriangle === 2} onSelect={setSelectedTriangle} />
            <Triangle index={3} points="178,264 178,334 70,334" color={triangleColors[2]} selected={selectedTriangle === 3} onSelect={setSelectedTriangle} />
            <Triangle index={4} points="70,334 18,334 18,239" color={triangleColors[3]} selected={selectedTriangle === 4} onSelect={setSelectedTriangle} />
            <polygon points="125,174 178,264 70,334 18,239" fill="#fbfaf5" stroke="#242c31" strokeWidth="1.7" />
            <text className="pythagorean-math-label" x="99" y="261">c²</text>
            <text className="pythagorean-side-label" x="98" y="352">a</text>
            <text className="pythagorean-side-label" x="8" y="257">b</text>
            <CornerBadges x={18} y={174} size={160} selected={selectedTriangle} onSelect={setSelectedTriangle} />
          </g>

          <line className="pythagorean-divider" x1="195" y1="80" x2="195" y2="452" />
          <g className="pythagorean-swap" role="button" tabIndex={0} aria-label="Compare the two rearrangements" onClick={() => { setPlaying(false); setStep((value) => value + 1); }}>
            <circle cx="195" cy="254" r="25" />
            <path d="M 190 247 L 183 254 L 190 261 M 200 247 L 207 254 L 200 261" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </g>

          <g className={step % 2 === 1 ? "pythagorean-panel active" : "pythagorean-panel"}>
            <OuterSquare x={212} y={174} />
            <Triangle index={1} points="212,174 282,174 212,250" color={triangleColors[0]} selected={selectedTriangle === 1} onSelect={setSelectedTriangle} />
            <Triangle index={2} points="212,250 282,174 282,250" color={triangleColors[1]} selected={selectedTriangle === 2} onSelect={setSelectedTriangle} />
            <rect x="282" y="174" width="90" height="76" fill="#fbfaf5" stroke="#242c31" strokeWidth="1.5" />
            <rect x="212" y="250" width="70" height="84" fill="#fbfaf5" stroke="#242c31" strokeWidth="1.5" />
            <Triangle index={3} points="282,250 372,250 372,334" color={triangleColors[2]} selected={selectedTriangle === 3} onSelect={setSelectedTriangle} />
            <Triangle index={4} points="282,250 372,334 282,334" color={triangleColors[3]} selected={selectedTriangle === 4} onSelect={setSelectedTriangle} />
            <text className="pythagorean-math-label" x="327" y="218">a²</text>
            <text className="pythagorean-math-label" x="247" y="300">b²</text>
            <text className="pythagorean-side-label" x="300" y="352">a</text>
            <CornerBadges x={212} y={174} size={160} selected={selectedTriangle} onSelect={setSelectedTriangle} />
          </g>
        </svg>
      </section>

      <section className="pythagorean-proof-controls" aria-label="Rearrangement controls">
        <button type="button" onClick={() => { setPlaying(false); setStep((value) => (value + 3) % 4); }} aria-label="Previous rearrangement"><Undo2 /></button>
        <button type="button" className="primary" onClick={() => setPlaying((value) => !value)} aria-label={playing ? "Pause rearrangement" : "Play rearrangement"}>{playing ? <Pause /> : <Play />}</button>
        <button type="button" onClick={reset} aria-label="Reset rearrangement"><RotateCcw /></button>
      </section>

      <section className="pythagorean-formula-card" aria-label="Pythagorean theorem equation">
        <span className="a-term">a²</span><span> + </span><span className="b-term">b²</span><span> = </span><span className="c-term">c²</span>
      </section>

      {menuOpen ? (
        <section className="pythagorean-proof-menu" role="dialog" aria-label="Lesson options">
          <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close lesson options"><X /></button>
          <h2>Same outer area</h2>
          <p>Both large squares contain the same four congruent right triangles. The space left over must be equal: the first is c², while the second is a² + b².</p>
          <p className="hint">Tap a numbered corner to track the same triangle in both arrangements.</p>
        </section>
      ) : null}
    </main>
  );
}

function OuterSquare({ x, y }: { x: number; y: number }) {
  return <rect x={x} y={y} width="160" height="160" fill="#fff" stroke="#242c31" strokeWidth="2" />;
}

function Triangle({ index, points, color, selected, onSelect }: { index: number; points: string; color: string; selected: boolean; onSelect: (index: number | null) => void }) {
  return <polygon className={selected ? "pythagorean-triangle selected" : "pythagorean-triangle"} points={points} fill={color} stroke="#242c31" strokeWidth="1.4" onClick={() => onSelect(selected ? null : index)} role="button" aria-label={`Highlight triangle ${index}`} tabIndex={0} />;
}

function CornerBadges({ x, y, size, selected, onSelect }: { x: number; y: number; size: number; selected: number | null; onSelect: (index: number | null) => void }) {
  return <>{[[x, y, 1], [x + size, y, 2], [x + size, y + size, 3], [x, y + size, 4]].map(([cx, cy, n], index) => <g className="pythagorean-corner-button" role="button" tabIndex={0} aria-label={`Track triangle ${n}`} key={n} onClick={() => onSelect(selected === n ? null : n)}><circle cx={cx} cy={cy - 7} r="10" fill={triangleColors[index]} stroke="#fff" strokeWidth="1" /><text className="pythagorean-badge" x={cx} y={cy - 7}>{n}</text></g>)}</>;
}
