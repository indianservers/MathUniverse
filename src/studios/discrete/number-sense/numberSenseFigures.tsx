import MathExpression from "../../../components/ui/MathExpression";
import { unitRate } from "./numberSenseMath";

export function Formula({ value }: { value: string }) {
  return (
    <span className="msk-formula ns-math">
      <MathExpression value={value} />
    </span>
  );
}

export function Legend({ items }: { items: { color: string; label: string; pattern?: boolean }[] }) {
  return (
    <div className="ns-legend">
      {items.map((item) => (
        <span key={item.label}>
          <i style={{ background: item.color, backgroundImage: item.pattern ? "repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,.45) 3px, rgba(255,255,255,.45) 6px)" : undefined }} />
          {item.label}
        </span>
      ))}
    </div>
  );
}

export function BoardProof({ steps }: { steps: string[] }) {
  return (
    <ol className="ns-board-proof">
      {steps.map((step, index) => (
        <li key={step}>
          <b>{index + 1}</b>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  );
}

export function RatioFigure({
  a,
  b,
  k,
  swapped,
  view,
  partWhole,
  cursor,
  onCursor,
  laser,
}: {
  a: number;
  b: number;
  k: number;
  swapped: boolean;
  view: "tape" | "double" | "lattice";
  partWhole: boolean;
  cursor: number;
  onCursor: (n: number) => void;
  laser: boolean;
}) {
  const first = swapped ? b : a;
  const second = swapped ? a : b;
  const steps = Math.max(3, k, cursor);
  const rate = unitRate(first, second);
  if (view === "lattice") {
    const maxX = Math.max(first * steps, 8);
    const maxY = Math.max(second * steps, 8);
    const xOf = (n: number) => 60 + (n / maxX) * 680;
    const yOf = (n: number) => 260 - (n / maxY) * 200;
    return (
      <svg className="ns-line" viewBox="0 0 800 300" role="img" aria-label={`Ratio graph through the origin for ${first}:${second}.`}>
        <rect width="800" height="300" fill="#f4f8ff" />
        <line x1="60" y1="260" x2="760" y2="260" stroke="#334155" strokeWidth="6" />
        <line x1="60" y1="260" x2="60" y2="40" stroke="#334155" strokeWidth="6" />
        <line x1="60" y1="260" x2={xOf(first * steps)} y2={yOf(second * steps)} stroke="#0f766e" strokeWidth="8" />
        {Array.from({ length: steps }, (_, i) => {
          const n = i + 1;
          return <circle key={n} cx={xOf(first * n)} cy={yOf(second * n)} r={n === cursor ? 16 : 12} fill={n === cursor ? "#f59e0b" : "#147df2"} stroke="#071641" strokeWidth="3" />;
        })}
        <text x="400" y="32" textAnchor="middle" fontSize="22" fill="#071641" fontWeight={900}>Lattice: ({first},{second}), ({first * 2},{second * 2})… through the origin</text>
      </svg>
    );
  }
  if (view === "tape") {
    const cells = first + second;
    const w = 700 / Math.max(cells, 1);
    return (
      <svg className="ns-line" viewBox="0 0 800 220" role="img" aria-label={`Tape diagram ${first}:${second} scaled by ${k}.`}>
        <rect width="800" height="220" fill="#f4f8ff" />
        <text x="400" y="32" textAnchor="middle" fontSize="22" fontWeight={900} fill="#071641">
          Tape · {first}:{second}{k > 1 ? ` × ${k} → ${first * k}:${second * k}` : ""} · order {swapped ? "swapped" : "as written"}
        </text>
        {Array.from({ length: first }, (_, i) => (
          <g key={`f${i}`}>
            <rect x={50 + i * w} y="52" width={w - 4} height="64" fill="#147df2" fillOpacity="0.95" stroke="#071641" strokeWidth="2" />
            <path d={`M${50 + i * w} 52 l8 10 l-8 10`} fill="none" stroke="#fff" strokeWidth="3" />
          </g>
        ))}
        {Array.from({ length: second }, (_, i) => (
          <rect key={`s${i}`} x={50 + (first + i) * w} y="52" width={w - 4} height="64" fill="#8b45f4" stroke="#071641" strokeWidth="2" />
        ))}
        <text x="50" y="140" fill="#147df2" fontSize="20" fontWeight={800}>{first} first</text>
        <text x="400" y="140" fill="#8b45f4" fontSize="20" fontWeight={800}>{second} second</text>
        {partWhole ? <text x="400" y="168" textAnchor="middle" fontSize="18" fontWeight={700}>{first} of {cells} is the first share</text> : <text x="400" y="168" textAnchor="middle" fontSize="18" fontWeight={700}>Part–part {first}:{second} — not the single number {first}</text>}
        <text x="400" y="192" textAnchor="middle" fontSize="18" fontWeight={700}>Unit rate: 1 first ↔ {Number.isFinite(rate.perFirst) ? rate.perFirst.toFixed(2) : "—"} second</text>
        <text x="400" y="214" textAnchor="middle" fontSize="16" fill="#334155" fontWeight={700}>Add +{first} and +{second} is a different story from ×k</text>
      </svg>
    );
  }
  const xs = Array.from({ length: steps + 1 }, (_, step) => 70 + step * (640 / steps));
  return (
    <svg className="ns-line" viewBox="0 0 800 240" role="img" aria-label={`Double number line for ${first}:${second} scaled by ${k}.`}>
      <rect width="800" height="240" fill="#f4f8ff" />
      <text x="400" y="30" textAnchor="middle" fontSize="22" fontWeight={900} fill="#071641">{first}:{second} on a double number line · order matters</text>
      <line x1="70" y1="90" x2="710" y2="90" stroke="#147df2" strokeWidth="8" />
      <line x1="70" y1="150" x2="710" y2="150" stroke="#8b45f4" strokeWidth="8" />
      {xs.map((x, step) => (
        <g key={step}>
          <line x1={x} y1="74" x2={x} y2="166" stroke="#64748b" strokeWidth="4" />
          <text x={x} y="66" textAnchor="middle" fill="#147df2" fontSize="20" fontWeight={800}>{first * step}</text>
          <text x={x} y="192" textAnchor="middle" fill="#8b45f4" fontSize="20" fontWeight={800}>{second * step}</text>
        </g>
      ))}
      <circle cx={xs[Math.min(cursor, steps)] ?? 70} cy="120" r={laser ? 18 : 14} fill="#f59e0b" stroke="#071641" strokeWidth={laser ? 4 : 3} />
      {xs.map((x, step) => (
        <rect key={`hit${step}`} x={x - 16} y="70" width="32" height="90" fill="transparent" className="ns-hit" onClick={() => onCursor(step)} />
      ))}
      <text x="724" y="94" fill="#147df2" fontSize="12">first</text>
      <text x="724" y="144" fill="#8b45f4" fontSize="12">second</text>
      <rect x="70" y="196" width={Math.max(8, 28 * first * k)} height="16" fill="#147df2" />
      <rect x={70 + Math.max(8, 28 * first * k)} y="196" width={Math.max(8, 28 * second * k)} height="16" fill="#8b45f4" />
    </svg>
  );
}

export function FractionTiles({ num, den }: { num: number; den: number }) {
  const d = Math.max(1, den);
  const wholes = Math.max(1, Math.ceil(Math.abs(num) / d));
  const abs = Math.abs(num);
  return (
    <svg className="ns-line" viewBox={`0 0 ${80 + wholes * 120} 86`} role="img" aria-label={`${num}/${den} as equal parts`}>
      <rect width="100%" height="86" fill="#f4f8ff" />
      {Array.from({ length: wholes }, (_, w) => (
        <g key={w} transform={`translate(${20 + w * 120},16)`}>
          {Array.from({ length: d }, (_, i) => {
            const idx = w * d + i;
            const on = idx < abs;
            return <rect key={i} x={i * (100 / d)} y="0" width={100 / d - 2} height="56" fill={on ? "#147df2" : "#e2e8f0"} stroke="#071641" strokeWidth="2" />;
          })}
        </g>
      ))}
    </svg>
  );
}

export function DecimalGrid({ value }: { value: number }) {
  const frac = Math.round((value - Math.trunc(value)) * 100);
  const cells = Math.min(100, Math.max(0, frac));
  return (
    <svg className="ns-line ns-grid-fig" viewBox="0 0 220 220" role="img" aria-label={`${cells} hundredths shaded`}>
      <rect width="220" height="220" fill="#f4f8ff" />
      {Array.from({ length: 100 }, (_, i) => {
        const c = i % 10;
        const r = Math.floor(i / 10);
        return <rect key={i} x={8 + c * 20.4} y={8 + r * 20.4} width="18.4" height="18.4" fill={i < cells ? "#147df2" : "#e2e8f0"} stroke="#071641" strokeWidth="1.2" />;
      })}
    </svg>
  );
}

export function PowerTiles({ base, exp }: { base: number; exp: number }) {
  if (exp < 0) return <p className="msk-note">Negative exponent: 1 / {base}^{Math.abs(exp)} as a unit fraction on the line.</p>;
  if (exp === 0) return <p className="msk-ok">Empty product: {base}^0 = 1.</p>;
  const n = Math.min(16, base ** Math.min(exp, 4));
  return (
    <div className="ns-tiles" aria-hidden="true">
      {Array.from({ length: Math.min(32, n) }, (_, i) => <i key={i} />)}
      <span>{base} used as a factor {exp} times</span>
    </div>
  );
}

export function MapStrip({ cm, kmPerCm }: { cm: number; kmPerCm: number }) {
  const ticks = Math.max(1, cm);
  return (
    <svg className="ns-line" viewBox="0 0 800 140" role="img" aria-label={`Map ${cm} cm at ${kmPerCm} km per cm`}>
      <rect width="800" height="140" fill="#ecfdf3" />
      <text x="400" y="28" textAnchor="middle" fontSize="22" fontWeight={900} fill="#065f46">Map strip · 1 cm : {kmPerCm} km</text>
      <rect x="40" y="44" width="720" height="40" fill="#bbf7d0" stroke="#047857" strokeWidth="4" />
      {Array.from({ length: ticks + 1 }, (_, i) => {
        const x = 40 + (i / ticks) * 720;
        return (
          <g key={i}>
            <line x1={x} y1="44" x2={x} y2="96" stroke="#047857" strokeWidth="4" />
            <text x={x} y="116" textAnchor="middle" fontSize="16" fontWeight={800}>{i} cm</text>
            <text x={x} y="134" textAnchor="middle" fontSize="16" fontWeight={800} fill="#147df2">{i * kmPerCm} km</text>
          </g>
        );
      })}
    </svg>
  );
}

export function UnitRulers({ lengthCm }: { lengthCm: number }) {
  const cm = Math.max(1, lengthCm);
  const w = 720;
  return (
    <svg className="ns-line" viewBox="0 0 800 150" role="img" aria-label="mm, cm, and m showing the same length">
      <rect width="800" height="150" fill="#f4f8ff" />
      <text x="40" y="28" fontSize="20" fontWeight={800}>Same length in mm / cm / m</text>
      <line x1="40" y1="48" x2={40 + w} y2="48" stroke="#147df2" strokeWidth="12" strokeLinecap="round" />
      <text x="40" y="74" fontSize="18" fontWeight={800}>{cm * 10} mm</text>
      <line x1="40" y1="92" x2={40 + w} y2="92" stroke="#8b45f4" strokeWidth="12" strokeLinecap="round" />
      <text x="40" y="118" fontSize="18" fontWeight={800}>{cm} cm</text>
      <line x1="40" y1="132" x2={40 + w} y2="132" stroke="#10b981" strokeWidth="12" strokeLinecap="round" />
      <text x="40" y="148" fontSize="18" fontWeight={800}>{(cm / 100).toFixed(2)} m</text>
    </svg>
  );
}
