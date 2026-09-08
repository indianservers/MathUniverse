import { ArrowLeft, Minus, MoreVertical, Pause, Play, Plus, RotateCcw, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./congruence-clock-mobile.css";

export default function CongruenceClockMobileProof() {
  const navigate = useNavigate();
  const [modulus, setModulus] = useState(12);
  const [start, setStart] = useState(9);
  const [amount, setAmount] = useState(7);
  const [travelled, setTravelled] = useState(7);
  const [playing, setPlaying] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const result = ((start + amount) % modulus + modulus) % modulus || modulus;
  const current = ((start + travelled) % modulus + modulus) % modulus || modulus;
  const center = 195, radius = 142;
  const point = (value: number, r = radius) => {
    const angle = (value / modulus) * Math.PI * 2 - Math.PI / 2;
    return { x: center + Math.cos(angle) * r, y: 190 + Math.sin(angle) * r };
  };
  useEffect(() => {
    if (!playing) return;
    if (travelled >= amount) { setPlaying(false); return; }
    const timer = window.setTimeout(() => setTravelled((value) => value + 1), 270);
    return () => window.clearTimeout(timer);
  }, [amount, playing, travelled]);
  const changeModulus = (delta: number) => {
    const next = Math.max(3, Math.min(16, modulus + delta));
    setModulus(next); setStart(Math.min(start, next)); setTravelled(Math.min(amount, travelled));
  };
  const reset = () => { setModulus(12); setStart(9); setAmount(7); setTravelled(7); setPlaying(false); setMenuOpen(false); };
  const startPoint = point(start), currentPoint = point(current);

  return <main className="clock-mobile">
    <header><button onClick={() => navigate(-1)} aria-label="Back to visual proofs"><ArrowLeft /></button><div><h1>Congruence on a Clock</h1><p>20 / 69</p></div><button onClick={() => setMenuOpen((value) => !value)} aria-label="Lesson options"><MoreVertical /></button></header>
    <section className="clock-stage">
      <svg viewBox="0 0 390 690" aria-label={`${start} plus ${amount} is congruent to ${result} modulo ${modulus}`}>
        <defs><linearGradient id="clock-ring" x1="0" x2="1"><stop stopColor="#4a7be7" /><stop offset=".35" stopColor="#13bea5" /><stop offset=".7" stopColor="#ffb332" /><stop offset="1" stopColor="#ef4d59" /></linearGradient><marker id="clock-arrow" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0 0 9 4.5 0 9Z" /></marker></defs>
        <circle className="ring" cx={center} cy="190" r={radius} />
        {Array.from({ length: modulus }, (_, index) => index + 1).map((value) => {
          const p = point(value);
          const selected = value === start || value === current;
          return <g key={value} role="button" tabIndex={0} aria-label={`Set start to ${value}`} onClick={() => { setStart(value); setTravelled(amount); }} className={selected ? "clock-number selected" : "clock-number"}><circle cx={p.x} cy={p.y} r={selected ? 21 : 16} /><text x={p.x} y={p.y + 6}>{value}</text></g>;
        })}
        <path className="journey" d={`M${startPoint.x} ${startPoint.y} Q195 270 ${currentPoint.x} ${currentPoint.y}`} markerEnd="url(#clock-arrow)" />
        <circle className="center-dot" cx={center} cy="190" r="4" />
        <g className="statement" transform="translate(195 415)"><rect x="-165" y="-48" width="330" height="96" rx="13" /><text x="0" y="8">{start} + {amount} ≡ {result} <tspan>(mod {modulus})</tspan></text></g>
        <g className="negative" transform="translate(195 530)"><rect x="-165" y="-42" width="330" height="84" rx="13" /><text x="0" y="8">{result - modulus} ≡ {result} <tspan>(mod {modulus})</tspan></text></g>
        <g className="input-row" transform="translate(195 630)">
          <text x="-127" y="-22">start</text><text x="0" y="-22">steps</text><text x="127" y="-22">modulus</text>
          <text x="-127" y="18">{start}</text><text x="0" y="18">{amount}</text><text x="127" y="18">{modulus}</text>
        </g>
      </svg>
    </section>
    <nav className="clock-controls">
      <button onClick={() => setAmount((value) => value - 1)} aria-label="Decrease steps"><Minus /></button>
      <label><span>steps</span><input aria-label="Steps around clock" type="range" min={-15} max={15} value={amount} onChange={(event) => { setAmount(Number(event.target.value)); setTravelled(Number(event.target.value)); setPlaying(false); }} /></label>
      <button onClick={() => setAmount((value) => value + 1)} aria-label="Increase steps"><Plus /></button>
      <button onClick={() => { setTravelled(0); setPlaying(true); }} aria-label={playing ? "Pause clock journey" : "Play clock journey"}>{playing ? <Pause /> : <Play />}</button>
      <button onClick={() => changeModulus(-1)} aria-label="Decrease modulus">m−</button>
      <button onClick={() => changeModulus(1)} aria-label="Increase modulus">m+</button>
    </nav>
    {menuOpen ? <aside role="dialog"><button onClick={() => setMenuOpen(false)} aria-label="Close lesson options"><X /></button><h2>Same landing point</h2><p>Numbers are congruent modulo m when they land on the same clock position. Adding or subtracting m does not change the remainder.</p><button onClick={reset} aria-label="Reset congruence clock"><RotateCcw /> Reset</button></aside> : null}
  </main>;
}
