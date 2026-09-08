import { ArrowLeft, ChevronLeft, ChevronRight, MoreVertical, RefreshCcw, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./composite-factor-sqrt-mobile.css";

const choices = [84, 60, 72, 90];
const colors = ["#ff5e4b", "#ff7b31", "#efa51f", "#19ae8f", "#079bca", "#5c38df", "#8d4bdb"];

function factorPairs(n: number) {
  const pairs: Array<[number, number]> = [];
  for (let a = 1; a * a <= n; a += 1) if (n % a === 0) pairs.push([a, n / a]);
  return pairs;
}

export default function CompositeFactorSqrtMobileProof() {
  const navigate = useNavigate();
  const [choice, setChoice] = useState(0);
  const [pairIndex, setPairIndex] = useState(5);
  const [menu, setMenu] = useState(false);
  const n = choices[choice];
  const pairs = useMemo(() => factorPairs(n), [n]);
  const safeIndex = Math.min(pairIndex, pairs.length - 1);
  const [a, b] = pairs[safeIndex];
  const max = Math.ceil(n / 10) * 10;
  const x = (value: number) => 46 + value / max * 326;
  const y = (value: number) => 530 - value / max * 430;
  const curve = Array.from({ length: 100 }, (_, index) => {
    const vx = 1 + index * (max - 1) / 99;
    return `${index ? "L" : "M"}${x(vx)} ${y(Math.min(max, n / vx))}`;
  }).join(" ");
  const selectChoice = (index: number) => {
    setChoice(index);
    setPairIndex(factorPairs(choices[index]).length - 1);
    setMenu(false);
  };
  const reset = () => { setChoice(0); setPairIndex(5); setMenu(false); };

  return <main className="sqrt-factor-proof">
    <header>
      <button onClick={() => navigate(-1)} aria-label="Back to visual proofs"><ArrowLeft /></button>
      <div><h1>Composite Factor at Most √n</h1><p>54 / 69</p></div>
      <button onClick={() => setMenu(value => !value)} aria-label="Lesson options"><MoreVertical /></button>
    </header>

    <section className="sqrt-card">
      <svg viewBox="0 0 400 610" role="img" aria-label={`${n} equals ${a} times ${b}; ${a} is at most square root of ${n}`}>
        <text x="200" y="47" className="n-title">n = {n}</text>
        <path d="M46 530H385M46 542V78" className="axis" />
        <path d="M385 530l-10-6v12zM46 78l-6 11h12z" className="axis-fill" />
        {Array.from({ length: 9 }, (_, index) => (index + 1) * max / 9).map(tick => <g key={tick}>
          <line x1={x(tick)} x2={x(tick)} y1="100" y2="530" className="gridline" />
          <line x1="46" x2="372" y1={y(tick)} y2={y(tick)} className="gridline" />
        </g>)}
        <path d={`M${x(Math.sqrt(n) * .55)} ${y(Math.sqrt(n) * .55)}L${x(max)} ${y(max)}`} className="diagonal" />
        <path d={curve} className="factor-curve" />
        <line x1={x(Math.sqrt(n))} x2={x(Math.sqrt(n))} y1={y(Math.sqrt(n))} y2="530" className="root-line" />
        <line x1="46" x2={x(Math.sqrt(n))} y1={y(Math.sqrt(n))} y2={y(Math.sqrt(n))} className="root-line dark" />
        <circle cx={x(Math.sqrt(n))} cy={y(Math.sqrt(n))} r="5" className="root-dot" />
        <text x={x(Math.sqrt(n)) + 8} y={y(Math.sqrt(n)) + 6} className="root-label">√{n}</text>
        {pairs.map(([pa, pb], index) => <g key={pa} className={index === safeIndex ? "selected-pair" : ""}>
          <circle cx={x(pa)} cy={y(pb)} r={index === safeIndex ? 6 : 4.6} fill={colors[index % colors.length]} />
          <text x={x(pa) + 7} y={Math.max(92, y(pb) - 6)} fill={colors[index % colors.length]}>({pa},{pb})</text>
        </g>)}
        <text x="30" y="86" className="axis-name">a</text><text x="380" y="553" className="axis-name">b</text>
        <text x="200" y="585" className="equation">a · b = {n}</text>
      </svg>

      <div className="pair-picker">
        <button onClick={() => setPairIndex(index => Math.max(0, index - 1))} aria-label="Previous factor pair"><ChevronLeft /></button>
        <div>{pairs.map(([pa, pb], index) => <button key={pa} onClick={() => setPairIndex(index)} className={index === safeIndex ? "active" : ""} style={{ "--pair-color": colors[index % colors.length] } as React.CSSProperties} aria-label={`Select factor pair ${pa} times ${pb}`} aria-pressed={index === safeIndex}><i /> <span>({pa},{pb})</span></button>)}</div>
        <button onClick={() => setPairIndex(index => Math.min(pairs.length - 1, index + 1))} aria-label="Next factor pair"><ChevronRight /></button>
      </div>

      <div className="pair-values"><span>a = {a}</span><i>←</i><i>→</i><span>b = {b}</span></div>
      <input aria-label="Factor pair position" type="range" min="0" max={pairs.length - 1} value={safeIndex} onChange={event => setPairIndex(Number(event.target.value))} />
      <div className="sqrt-caption"><span>← a decreases</span><strong>a ≤ √n ≤ b</strong><span>b increases →</span></div>
    </section>

    <button className="sqrt-reset" onClick={reset} aria-label="Reset factor graph"><RefreshCcw /></button>
    {menu ? <aside role="dialog" aria-label="Composite factor explanation">
      <button onClick={() => setMenu(false)} aria-label="Close lesson options"><X /></button>
      <h2>Try another composite</h2>
      <p>If a · b = n and a ≤ b, then a ≤ √n ≤ b. Choose a number to trace its factor pairs.</p>
      <div>{choices.map((value, index) => <button key={value} onClick={() => selectChoice(index)} aria-label={`Use n equals ${value}`}>{value}</button>)}</div>
    </aside> : null}
  </main>;
}
