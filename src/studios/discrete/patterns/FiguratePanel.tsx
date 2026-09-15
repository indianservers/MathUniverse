import { useMemo, useState } from "react";
import { ChallengeBox, NControl, usePlayer } from "./patternsUi";
import {
  figuratePoints,
  firstDifferences,
  hexagonalNumber,
  polygonalNumber,
  polygonalSequence,
  squareGnomon,
  squareTriangularNumbers,
  triangularNumber,
} from "./patternsMath";

const KINDS = [
  { id: 3, name: "Triangular", seq: "1, 3, 6, 10, 15…" },
  { id: 4, name: "Square", seq: "1, 4, 9, 16, 25…" },
  { id: 5, name: "Pentagonal", seq: "1, 5, 12, 22, 35…" },
  { id: 6, name: "Hexagonal", seq: "1, 6, 15, 28, 45…" },
  { id: 7, name: "Heptagonal", seq: "1, 7, 18, 34, 55…" },
] as const;

const COLORS: Record<number, string> = { 3: "#147df2", 4: "#10b981", 5: "#f59e0b", 6: "#8b45f4", 7: "#ef4444" };

const REAL: Record<number, string> = {
  3: "Bowling pins, stacked cannonballs in a triangle, and triangular numbers in combinatorics (C(n+1,2)).",
  4: "Windows, chessboards, and pixel grids are square numbers: n rows of n.",
  5: "Pentagonal numbers appear in some tilings and in Euler’s pentagonal-number theorem.",
  6: "Honeycomb cells grow hexagonally. Every hexagonal number is also an odd triangular number.",
  7: "Heptagonal numbers continue the same polygonal family with seven sides.",
};

type Props = {
  n: number;
  setN: (n: number) => void;
  sides: number;
  setSides: (n: number) => void;
  teacherReveal?: boolean;
  hideFormula?: boolean;
  onOpenPascal?: () => void;
};

export default function FiguratePanel({ n, setN, sides, setSides, teacherReveal, hideFormula, onOpenPascal }: Props) {
  const [shown, setShown] = useState(n);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  const [showNumbers, setShowNumbers] = useState(true);
  const [showFormula, setShowFormula] = useState(true);
  const [insight, setInsight] = useState("formula");
  const [compare, setCompare] = useState(4);
  const [generalK, setGeneralK] = useState(8);
  const [challengeKey, setChallengeKey] = useState(0);
  const k = sides === 0 ? generalK : sides;
  const value = polygonalNumber(k, n);
  const visible = Math.min(shown, n);
  const pts = useMemo(() => figuratePoints(k, visible, k <= 4 ? 28 : 16), [k, visible]);
  const seq = polygonalSequence(k, Math.max(n, 8));
  const diffs = firstDifferences(seq);
  const second = firstDifferences(diffs);
  const kind = KINDS.find((item) => item.id === k);
  const color = COLORS[k] ?? "#147df2";

  usePlayer(playing, speed, () => {
    setShown((s) => {
      if (s >= n) {
        setPlaying(false);
        return n;
      }
      return s + 1;
    });
  });

  const setIndex = (v: number) => {
    setN(v);
    setShown(playing ? Math.min(shown, v) : v);
    if (!playing) setShown(v);
  };

  const runningSum = k === 3 ? Array.from({ length: visible }, (_, i) => i + 1).reduce((a, b) => a + b, 0) : polygonalNumber(k, visible);

  const challenge = useMemo(() => {
    const kindN = challengeKey % 7;
    if (kindN === 0) return { prompt: "Find T₂₀ without counting every dot.", expected: 210, hint: "T_n = n(n+1)/2." };
    if (kindN === 1) return { prompt: "Which triangular number equals 55? Enter n.", expected: 10, hint: "Solve n(n+1)/2 = 55." };
    if (kindN === 2) return { prompt: "Is 45 triangular? Enter 1 for yes, 0 for no.", expected: 1, hint: "n(n+1)/2 = 45 → n = 9." };
    if (kindN === 3) return { prompt: "Find the 8th square number.", expected: 64, hint: "8²." };
    if (kindN === 4) return { prompt: "Which term of square numbers equals 144? Enter n.", expected: 12, hint: "√144." };
    if (kindN === 5) return { prompt: "Find the 6th pentagonal number.", expected: 51, hint: "n(3n−1)/2 with n=6." };
    return { prompt: "Which number is both triangular and hexagonal? Enter the smallest > 1.", expected: 6, hint: "H₂ = 6 = T₃." };
  }, [challengeKey]);

  const both = squareTriangularNumbers(2000);
  const formula =
    k === 3 ? "T_n = n(n+1)/2"
      : k === 4 ? "S_n = n²"
        : k === 5 ? "P_n = n(3n−1)/2"
          : k === 6 ? "H_n = n(2n−1)"
            : `P(${k},n) = ((${k}-2)n² − (${k}-4)n)/2`;

  const worked =
    k === 3 ? `T_${n} = ${n}(${n}+1)/2 = ${n * (n + 1)}/2 = ${value}`
      : k === 4 ? `S_${n} = ${n}² = ${value}`
        : k === 5 ? `P_${n} = ${n}(3·${n}−1)/2 = ${n}(${3 * n - 1})/2 = ${value}`
          : k === 6 ? `H_${n} = ${n}(2·${n}−1) = ${n}(${2 * n - 1}) = ${value}`
            : `P(${k},${n}) = ${value}`;

  const w = 420;
  const h = 320;
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const minX = Math.min(...xs, 0);
  const maxX = Math.max(...xs, 1);
  const minY = Math.min(...ys, 0);
  const maxY = Math.max(...ys, 1);
  const sx = 300 / Math.max(1, maxX - minX);
  const sy = 240 / Math.max(1, maxY - minY);
  const s = Math.min(sx, sy);
  const map = (p: { x: number; y: number }) => ({ x: 210 + (p.x - (minX + maxX) / 2) * s, y: 40 + (p.y - minY) * s });

  return (
    <>
      <div className="np-head">
        <div>
          <h2>Figurate Numbers</h2>
          <p>Numbers that can be arranged in regular geometric patterns. Explore triangular, square, pentagonal, hexagonal and more!</p>
        </div>
        <label>
          Select Type
          <select className="np-select" value={sides === 0 ? "g" : String(sides)} onChange={(e) => {
            if (e.target.value === "g") setSides(0);
            else setSides(Number(e.target.value));
            setShown(1);
          }}>
            {KINDS.map((item) => <option key={item.id} value={item.id}>{item.name} Numbers</option>)}
            <option value="g">General Polygonal</option>
          </select>
        </label>
      </div>
      <div className="np-work">
        <section className="np-card">
          <NControl label={`Number of rows (n)`} value={n} min={1} max={50} onChange={(v) => { setIndex(v); setShown(playing ? 1 : v); }} />
          {sides === 0 ? <NControl label="Sides k" value={generalK} min={3} max={12} onChange={setGeneralK} /> : null}
          <button type="button" className="np-go" onClick={() => { setShown(1); setPlaying(true); }}>▶ Animate Build</button>
          <div className="np-row">
            <button type="button" className="np-ghost" onClick={() => setPlaying(false)}>Pause</button>
            <button type="button" className="np-ghost" onClick={() => { setPlaying(false); setIndex(Math.max(1, n - 1)); }}>← Previous</button>
            <button type="button" className="np-ghost" onClick={() => { setPlaying(false); setIndex(Math.min(50, n + 1)); }}>Next →</button>
          </div>
          <div className="np-row">
            <label className="np-toggle"><input type="checkbox" checked={showNumbers} onChange={(e) => setShowNumbers(e.target.checked)} /> Show numbers</label>
            <label className="np-toggle"><input type="checkbox" checked={showFormula} onChange={(e) => setShowFormula(e.target.checked)} /> Show formula</label>
          </div>
          <label className="np-label">Compare with
            <select className="np-select" value={compare} onChange={(e) => setCompare(Number(e.target.value))}>
              {KINDS.filter((item) => item.id !== k).map((item) => <option key={item.id} value={item.id}>{item.name} Numbers</option>)}
            </select>
          </label>
          <div className="np-row">
            <button type="button" className="np-ghost" onClick={() => { setPlaying(false); setShown(n); }}>Reset</button>
            <button type="button" className="np-ghost" onClick={() => { const v = Math.floor(Math.random() * 12) + 3; setIndex(v); setShown(1); }}>Random n</button>
            <label className="np-toggle">Speed <input type="range" min={1} max={5} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} /></label>
          </div>
        </section>
        <section className="np-card np-stage">
          <div className="np-viz-title">
            <h3>{kind?.name ?? "Polygonal"} Number {showFormula ? <i style={{ fontStyle: "italic", fontWeight: 600 }}>{k === 3 ? `T_${n}` : k === 4 ? `S_${n}` : `P(${k},${n})`}</i> : null}</h3>
            <span className="np-pill">n = {n}</span>
          </div>
          <svg className="np-svg" viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`${kind?.name ?? "Polygonal"} arrangement`}>
            {k === 3 && showNumbers ? Array.from({ length: visible }, (_, r) => (
              <text key={`r${r}`} x="390" y={map({ x: 0, y: r * 28 * 0.9 }).y + 6} fontSize="12" fill="#64748b">{r + 1}</text>
            )) : null}
            {pts.map((p, i) => {
              const q = map(p);
              const gnomon = k === 4 && visible > 1 && (p.x >= (visible - 1) * 28 || p.y >= (visible - 1) * 28);
              return <circle key={i} cx={q.x} cy={q.y} r={n > 20 ? 4 : 8} fill={gnomon ? "#f59e0b" : color} />;
            })}
          </svg>
          <p className="np-work-eq">
            {k === 3 ? `1+2+…+${visible} = ${runningSum}` : `${kind?.name ?? "P"} layer ${visible} → ${polygonalNumber(k, visible)}`}
            {k === 4 && n > 1 ? ` · ${n}² − ${n - 1}² = ${squareGnomon(n)} (odd gnomon)` : ""}
            {k === 6 ? ` · H_n = T_{2n−1} → ${hexagonalNumber(n)} = ${triangularNumber(2 * n - 1)}` : ""}
          </p>
          {k === 3 && insight === "formula" ? (
            <p className="np-note">Two copies of T_{n} make an {n} × {n + 1} rectangle = {n * (n + 1)} dots, so each triangle is {value}.</p>
          ) : null}
        </section>
        <aside className="np-card np-insight">
          <div className="np-tabs-sm">
            {["formula", "values", "properties", "world"].map((id) => (
              <button key={id} type="button" className={insight === id ? "is-on" : ""} onClick={() => setInsight(id)}>
                {id === "world" ? "Real World" : id[0]!.toUpperCase() + id.slice(1)}
              </button>
            ))}
          </div>
          {insight === "formula" && !hideFormula ? (
            <>
              <p className="np-formula">{formula}</p>
              <p className="np-work-eq">For n = {n}:<br />{worked}</p>
              <p className="np-ok">{kind?.name ?? "Polygonal"} number {value} can be arranged in this {k}-gonal pattern with {n} layers.</p>
            </>
          ) : null}
          {insight === "values" ? (
            <table className="np-table">
              <thead><tr><th>n</th><th>P(k,n)</th><th>compare</th></tr></thead>
              <tbody>
                {seq.slice(0, 10).map((v, i) => (
                  <tr key={i}><td>{i + 1}</td><td>{v}</td><td>{polygonalNumber(compare, i + 1)}</td></tr>
                ))}
              </tbody>
            </table>
          ) : null}
          {insight === "properties" ? (
            <>
              <p className="np-note">First differences: {diffs.slice(0, 8).join(", ")}</p>
              <p className="np-note">Second differences: {second.slice(0, 7).join(", ") || "—"}</p>
              <p className="np-work-eq">Constant second difference {second[0] ?? "—"} means the sequence is quadratic.</p>
              <p className="np-note">Square-triangular numbers ≤ 2000: {both.join(", ")}</p>
              {onOpenPascal && k === 3 ? <button type="button" className="np-ghost" onClick={onOpenPascal}>Open triangular diagonal in Pascal</button> : null}
            </>
          ) : null}
          {insight === "world" ? <p className="np-note">{REAL[k] ?? "Polygonal numbers count dots that tile a regular polygon layer by layer."}</p> : null}
          <ChallengeBox {...challenge} onNew={() => setChallengeKey((x) => x + 1)} reveal={teacherReveal} />
        </aside>
      </div>
      <div className="np-carousel">
        <b>Other Figurative Numbers ›</b>
        {KINDS.map((item) => (
          <button key={item.id} type="button" className={`np-chip${item.id === k ? " is-on" : ""}`} onClick={() => { setSides(item.id); setShown(n); }}>
            <b>{item.name}</b>
            <small>{item.seq}</small>
          </button>
        ))}
      </div>
    </>
  );
}
