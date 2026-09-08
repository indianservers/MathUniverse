import { ArrowLeft, MoreVertical, RotateCcw, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./triangular-numbers-mobile.css";

const coral = "#ff6654";
const cyan = "#20b6c5";

function Dots({ n, rotated }: { n: number; rotated: boolean }) {
  const gap = Math.min(28, 150 / n);
  const r = Math.max(4.8, Math.min(8.2, gap * .3));
  return <g className={rotated ? "tn-duplicate rotated" : "tn-original"}>
    {Array.from({ length: n }, (_, row) => Array.from({ length: row + 1 }, (__, col) =>
      <circle key={`${row}-${col}`} cx={col * gap} cy={row * gap} r={r} fill={rotated ? cyan : coral} />
    ))}
  </g>;
}

export default function TriangularNumbersMobileProof() {
  const nav = useNavigate();
  const [n, setN] = useState(7);
  const [joined, setJoined] = useState(true);
  const [menu, setMenu] = useState(false);
  const cols = n + 1;
  const cell = Math.min(25, 315 / cols, 180 / n);
  const dotR = Math.max(4.5, Math.min(8, cell * .3));
  const reset = () => { setN(7); setJoined(true); setMenu(false); };

  return <main className="tn-mobile">
    <header>
      <button onClick={() => nav(-1)} aria-label="Back to visual proofs"><ArrowLeft /></button>
      <div><h1>Triangular Numbers</h1><p>32 / 69</p></div>
      <button onClick={() => setMenu(v => !v)} aria-label="Lesson options"><MoreVertical /></button>
    </header>

    <section className="tn-stage">
      <svg viewBox="0 0 390 650" role="img" aria-label={`Two triangular arrays of ${n * (n + 1) / 2} dots make a ${n} by ${n + 1} rectangle`}>
        <defs><filter id="tn-shadow"><feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity=".22" /></filter></defs>
        <g transform="translate(72 54)"><Dots n={n} rotated={false} /></g>
        <path className="tn-bracket" d="M37 51h12M43 51v160M37 211h12" /><text className="tn-n" x="20" y="140">n</text>
        <path className="tn-dash" d="M145 70 C215 28 270 61 278 132" /><path className="tn-arrow-tip" d="m271 126 8 13 5-15" />
        <g transform="translate(248 115)"><Dots n={n} rotated /></g>
        <g className="tn-rotate" transform="translate(324 123)" role="button" tabIndex={0} aria-label="Rotate duplicate triangle" onClick={() => setJoined(v => !v)} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") setJoined(v => !v); }}><RotateCcw /><path d="M0 0" /></g>
        <path className="tn-down" d="m178 263 12 12 12-12" />

        <g transform={`translate(${195 - cols * cell / 2} 310)`}>
          {Array.from({ length: n }, (_, row) => Array.from({ length: cols }, (__, col) => {
            const duplicate = col >= cols - 2;
            const visible = joined || !duplicate;
            return <circle key={`${row}-${col}`} className={visible ? "" : "tn-hidden"} cx={col * cell + cell / 2} cy={row * cell + cell / 2} r={dotR} fill={duplicate ? cyan : coral} />;
          }))}
          <path className="tn-dimension" d={`M-10 0h-9v${n * cell}h9M-19 0V${n * cell}`} />
          <text className="tn-n" x="-38" y={n * cell / 2 + 7}>n</text>
          <path className="tn-dimension" d={`M0 ${n * cell + 20}v9h${cols * cell}v-9M0 ${n * cell + 29}H${cols * cell}`} />
          <text className="tn-n cyan" x={cols * cell / 2} y={n * cell + 56}>n + 1</text>
        </g>

        <g className="tn-formula" transform="translate(195 565)"><rect x="-145" y="-42" width="290" height="84" rx="13" /><text x="0" y="10"><tspan className="coral">Tₙ</tspan><tspan> = </tspan><tspan className="coral">n</tspan><tspan>(</tspan><tspan className="cyan">n + 1</tspan><tspan>) / </tspan><tspan className="blue">2</tspan></text></g>
      </svg>
    </section>

    <nav className="tn-controls" aria-label="Choose triangular number">
      <div className="tn-stepper"><button onClick={() => setN(v => Math.max(2, v - 1))} aria-label="Decrease n">−</button><strong>{n}</strong><button onClick={() => setN(v => Math.min(10, v + 1))} aria-label="Increase n">+</button></div>
      <input aria-label="n value" type="range" min="2" max="10" value={n} onChange={e => setN(Number(e.target.value))} />
      <button className="tn-reset" onClick={reset} aria-label="Reset triangular numbers"><RotateCcw /></button>
    </nav>

    {menu ? <aside role="dialog"><button onClick={() => setMenu(false)} aria-label="Close lesson options"><X /></button><h2>Why it works</h2><p>Each triangle has Tₙ dots. Rotate a copy and the two triangles form an n by n + 1 rectangle, so one triangle contains n(n + 1) ÷ 2 dots.</p></aside> : null}
  </main>;
}
