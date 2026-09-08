import { ArrowLeft, BarChart3, MoreVertical, Pause, Play, RotateCcw, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./normal-probability-mobile.css";

function erf(value: number) {
  const sign = value < 0 ? -1 : 1, x = Math.abs(value), t = 1 / (1 + 0.3275911 * x);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return sign * y;
}
const cdf = (z: number) => 0.5 * (1 + erf(z / Math.sqrt(2)));
const px = (z: number) => 195 + z * 50;
const py = (z: number) => 320 - 245 * Math.exp(-z * z / 2);

export default function NormalProbabilityMobileProof() {
  const navigate = useNavigate();
  const [z1, setZ1] = useState(-1);
  const [z2, setZ2] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const probability = Math.max(0, cdf(z2) - cdf(z1));
  const curve = useMemo(() => Array.from({ length: 129 }, (_, index) => -3.2 + index * 0.05).map((z, index) => `${index ? "L" : "M"}${px(z).toFixed(1)} ${py(z).toFixed(1)}`).join(" "), []);
  const shade = useMemo(() => {
    const points = Array.from({ length: 81 }, (_, index) => z1 + (z2 - z1) * index / 80);
    return `M${px(z1)} 320 ${points.map((z) => `L${px(z).toFixed(1)} ${py(z).toFixed(1)}`).join(" ")} L${px(z2)} 320Z`;
  }, [z1, z2]);
  useEffect(() => {
    if (!playing) return;
    if (z2 >= 2.5) { setPlaying(false); return; }
    const timer = window.setTimeout(() => setZ2((value) => Math.min(2.5, value + 0.08)), 45);
    return () => window.clearTimeout(timer);
  }, [playing, z2]);
  const reset = () => { setZ1(-1); setZ2(1); setPlaying(false); setMenuOpen(false); };

  return <main className="normal-mobile">
    <header><button onClick={() => navigate(-1)} aria-label="Back to visual proofs"><ArrowLeft /></button><h1>Normal Probability Area</h1><p>21 / 69</p><button onClick={() => setMenuOpen((value) => !value)} aria-label="Lesson options"><MoreVertical /></button></header>
    <section className="normal-stage">
      <svg viewBox="0 0 390 470" aria-label={`Probability between z ${z1.toFixed(2)} and ${z2.toFixed(2)} is ${probability.toFixed(4)}`}>
        <defs><linearGradient id="normal-fill" x1="0" x2="1"><stop stopColor="#25c7db" /><stop offset="1" stopColor="#7358ef" /></linearGradient></defs>
        {[45,95,145,195,245,295,345].map((x) => <line key={x} className="grid" x1={x} y1="40" x2={x} y2="340" />)}
        {[90,170,250,330].map((y) => <line key={y} className="grid" x1="20" y1={y} x2="370" y2={y} />)}
        <path className="shade" d={shade} /><path className="curve" d={curve} />
        <line className="axis" x1="20" y1="320" x2="373" y2="320" />
        {[-3,-2,-1,0,1,2,3].map((z) => <g key={z}><line className="tick" x1={px(z)} y1="320" x2={px(z)} y2="329" /><text x={px(z)} y="350">{z}</text></g>)}
        <line className="bound one" x1={px(z1)} y1={py(z1)} x2={px(z1)} y2="320" /><line className="bound two" x1={px(z2)} y1={py(z2)} x2={px(z2)} y2="320" />
        <circle className="handle one" cx={px(z1)} cy="320" r="10" /><circle className="handle two" cx={px(z2)} cy="320" r="10" />
        <g className="probability-chip" transform="translate(195 225)"><rect x="-55" y="-22" width="110" height="44" rx="22" /><circle cx="-35" r="5" /><text x="11" y="8">{probability.toFixed(4)}</text></g>
        <g className="formula" transform="translate(195 420)"><rect x="-165" y="-38" width="330" height="76" rx="13" /><text x="0" y="9">P({z1.toFixed(2)} &lt; Z &lt; {z2.toFixed(2)}) = {probability.toFixed(4)}</text></g>
      </svg>
    </section>
    <section className="normal-inputs">
      <label><span>z₁ <strong>{z1.toFixed(2)}</strong></span><input aria-label="Lower z bound" type="range" min="-3" max="2.8" step=".05" value={z1} onChange={(event) => setZ1(Math.min(Number(event.target.value), z2 - .1))} /></label>
      <label><span>z₂ <strong>{z2.toFixed(2)}</strong></span><input aria-label="Upper z bound" type="range" min="-2.8" max="3" step=".05" value={z2} onChange={(event) => setZ2(Math.max(Number(event.target.value), z1 + .1))} /></label>
    </section>
    <nav className="normal-controls"><button onClick={reset} aria-label="Reset normal probability"><RotateCcw /></button><button onClick={() => { setZ1(-2); setZ2(2); }} aria-label="Show central 95 percent"><BarChart3 /></button><button className="play" onClick={() => { if (!playing && z2 >= 2.5) setZ2(z1 + .1); setPlaying((value) => !value); }} aria-label={playing ? "Pause probability sweep" : "Play probability sweep"}>{playing ? <Pause /> : <Play />}</button></nav>
    {menuOpen ? <aside role="dialog"><button onClick={() => setMenuOpen(false)} aria-label="Close lesson options"><X /></button><h2>Probability is area</h2><p>The total area under the standard normal curve is 1. Moving z₁ and z₂ changes the shaded fraction between them.</p></aside> : null}
  </main>;
}
