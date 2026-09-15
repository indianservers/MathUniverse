import { useMemo, useState } from "react";
import { ChallengeBox, NControl, usePlayer } from "./patternsUi";
import {
  PHI,
  constantDifferenceDepth,
  differenceTable,
  fibonacciRatios,
  generateArithmeticSequence,
  generateCustomRecurrence,
  generateFibonacci,
  generateGeometricSequence,
  parseRatio,
  parseSequenceInput,
} from "./patternsMath";

const KINDS = ["Arithmetic", "Geometric", "Fibonacci", "Custom", "Differences", "Predict"] as const;

type Props = { teacherReveal?: boolean; hideFormula?: boolean; onOpenPascalFib?: () => void };

export default function RecursivePanel({ teacherReveal, hideFormula, onOpenPascalFib }: Props) {
  const [kind, setKind] = useState<(typeof KINDS)[number]>("Arithmetic");
  const [a1, setA1] = useState(3);
  const [d, setD] = useState(4);
  const [rText, setRText] = useState("3");
  const [terms, setTerms] = useState(8);
  const [shown, setShown] = useState(8);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  const [a2, setA2] = useState(1);
  const [rule, setRule] = useState("a[n-1]+a[n-2]");
  const [rawSeq, setRawSeq] = useState("1, 4, 9, 16, 25");
  const [fibView, setFibView] = useState("sequence");
  const [challengeKey, setChallengeKey] = useState(0);
  const ratio = parseRatio(rText);
  const arith = generateArithmeticSequence(a1, d, terms);
  const geo = ratio.ok ? generateGeometricSequence(a1, ratio.value, terms) : [];
  const fib = generateFibonacci(Math.min(80, terms));
  const custom = generateCustomRecurrence(a1, a2, rule, terms);
  const parsed = parseSequenceInput(rawSeq);
  const table = parsed.ok ? differenceTable(parsed.values) : [];
  const depth = parsed.ok ? constantDifferenceDepth(parsed.values) : null;
  const active = kind === "Arithmetic" ? arith : kind === "Geometric" ? geo : kind === "Fibonacci" ? fib.map(Number) : custom.ok ? custom.values : [];
  const visible = active.slice(0, Math.max(1, Math.min(shown, active.length)));

  usePlayer(playing, speed, () => {
    setShown((s) => {
      if (s >= active.length) {
        setPlaying(false);
        return active.length;
      }
      return s + 1;
    });
  });

  const challenge = useMemo(() => {
    const i = challengeKey % 4;
    if (i === 0) return { prompt: "If 2, 5, 8, ?, 14, what is the missing term?", expected: 11, hint: "Common difference 3." };
    if (i === 1) return { prompt: "a₁=3, d=4. What is a₅?", expected: 19, hint: "a_n = a₁+(n−1)d." };
    if (i === 2) return { prompt: "Geometric: 2, 6, 18, 54. What is a₁·r³?", expected: 54, hint: "r=3, a₄ = 2·27." };
    return { prompt: "F₈ (with F₀=0, F₁=1) equals?", expected: 21, hint: "0,1,1,2,3,5,8,13,21." };
  }, [challengeKey]);

  const maxAbs = Math.max(1, ...visible.map((v) => Math.abs(v)));
  const ratios = fibonacciRatios(Math.min(40, terms));

  return (
    <>
      <div className="np-head">
        <div>
          <h2>Recursive Sequences</h2>
          <p>Generate arithmetic, geometric, Fibonacci and custom recurrences. Explore differences and hidden terms.</p>
        </div>
      </div>
      <div className="np-seg" style={{ marginBottom: 12 }}>
        {KINDS.map((item) => (
          <button key={item} type="button" className={kind === item ? "is-on" : ""} onClick={() => { setKind(item); setShown(terms); setPlaying(false); }}>{item}</button>
        ))}
      </div>
      <div className="np-work">
        <section className="np-card">
          {kind !== "Differences" && kind !== "Predict" ? (
            <>
              <NControl label="Number of terms n" value={terms} min={3} max={kind === "Fibonacci" ? 80 : 40} onChange={(v) => { setTerms(v); setShown(v); }} />
              {kind !== "Fibonacci" ? <NControl label="First term a₁" value={a1} min={-20} max={40} onChange={setA1} /> : null}
              {kind === "Arithmetic" ? <NControl label="Common difference d" value={d} min={-12} max={12} onChange={setD} /> : null}
              {kind === "Geometric" ? (
                <label className="np-label">Ratio r
                  <input className="np-num" style={{ width: 80 }} value={rText} onChange={(e) => setRText(e.target.value)} aria-label="Common ratio" />
                </label>
              ) : null}
              {kind === "Custom" ? (
                <>
                  <NControl label="Second seed a₂" value={a2} min={-20} max={40} onChange={setA2} />
                  <label className="np-label">Rule
                    <input className="np-num" style={{ width: "100%" }} value={rule} onChange={(e) => setRule(e.target.value)} aria-label="Recurrence rule" />
                  </label>
                  <p className="np-note">Use a[n-1], a[n-2], n and + − × ÷. No eval().</p>
                </>
              ) : null}
            </>
          ) : (
            <label className="np-label">Sequence
              <input className="np-num" style={{ width: "100%" }} value={rawSeq} onChange={(e) => setRawSeq(e.target.value)} aria-label="Sequence values" />
            </label>
          )}
          <button type="button" className="np-go" onClick={() => { setShown(1); setPlaying(true); }}>▶ Animate terms</button>
          <div className="np-row">
            <button type="button" className="np-ghost" onClick={() => setPlaying(false)}>Pause</button>
            <button type="button" className="np-ghost" onClick={() => { setPlaying(false); setShown(active.length); }}>Reset</button>
            <label className="np-toggle">Speed <input type="range" min={1} max={5} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} /></label>
          </div>
          {kind === "Fibonacci" ? (
            <div className="np-seg">
              {["sequence", "tiles", "spiral", "ratio"].map((id) => (
                <button key={id} type="button" className={fibView === id ? "is-on" : ""} onClick={() => setFibView(id)}>{id}</button>
              ))}
            </div>
          ) : null}
        </section>
        <section className="np-card np-stage">
          <div className="np-viz-title">
            <h3>{kind}</h3>
            <span className="np-pill">{visible.length} terms</span>
          </div>
          {kind === "Differences" && parsed.ok ? (
            <div>
              {table.map((row, i) => (
                <p key={i} className="np-work-eq" style={{ paddingLeft: i * 16 }}>{row.map((v) => Number.isInteger(v) ? v : v.toFixed(2)).join("   ")}</p>
              ))}
            </div>
          ) : (
            <>
              <p className="np-work-eq">{visible.join(", ")}</p>
              <div className="np-bars">
                {visible.map((v, i) => (
                  <b key={i} style={{ height: `${8 + (Math.abs(v) / maxAbs) * 120}px`, background: i >= visible.length - 2 && kind === "Fibonacci" ? "#f59e0b" : "#147df2" }} title={String(v)} />
                ))}
              </div>
              <svg className="np-svg" viewBox="0 0 420 140" aria-label="Sequence graph" style={{ minHeight: 140 }}>
                {visible.map((v, i) => {
                  const x = 30 + (i * 360) / Math.max(1, visible.length - 1);
                  const y = 110 - ((v - Math.min(0, ...visible)) / Math.max(1, maxAbs - Math.min(0, ...visible))) * 90;
                  return <g key={i}><circle cx={x} cy={y} r="5" fill="#147df2" /><text x={x - 4} y={y - 10} fontSize="10">{v}</text></g>;
                })}
              </svg>
            </>
          )}
          {kind === "Fibonacci" && fibView === "ratio" ? (
            <p className="np-note">Fₙ₊₁/Fₙ → φ ≈ {PHI.toFixed(10)}. Last ratio {ratios.at(-1)?.toFixed(8) ?? "—"} (convergence, not equality).</p>
          ) : null}
          {kind === "Fibonacci" && fibView === "spiral" ? (
            <svg className="np-svg" viewBox="0 0 260 160" aria-label="Fibonacci spiral approximation">
              {(() => {
                const sizes = [1, 1, 2, 3, 5, 8].map((v) => v * 10);
                let x = 20, y = 20, dir = 0;
                return sizes.map((s, i) => {
                  const rect = <rect key={i} x={x} y={y} width={s} height={s} fill="none" stroke="#147df2" />;
                  if (dir === 0) x += s;
                  else if (dir === 1) y += s;
                  else if (dir === 2) x -= s;
                  dir = (dir + 1) % 4;
                  return rect;
                });
              })()}
            </svg>
          ) : null}
          {kind === "Fibonacci" && visible.length >= 3 ? (
            <p className="np-work-eq">{visible.at(-3)} + {visible.at(-2)} → {visible.at(-1)}</p>
          ) : null}
        </section>
        <aside className="np-card np-insight">
          {!hideFormula && kind === "Arithmetic" ? <p className="np-formula">aₙ = a₁ + (n−1)d</p> : null}
          {!hideFormula && kind === "Geometric" ? <p className="np-formula">aₙ = a₁ rⁿ⁻¹</p> : null}
          {!hideFormula && kind === "Fibonacci" ? <p className="np-formula">Fₙ = Fₙ₋₁ + Fₙ₋₂</p> : null}
          {kind === "Arithmetic" ? <p className="np-work-eq">a₁={a1}, d={d} → {arith.slice(0, 6).join(", ")}…</p> : null}
          {kind === "Geometric" && !ratio.ok ? <p className="np-fail">{ratio.error}</p> : null}
          {kind === "Custom" && !custom.ok ? <p className="np-fail">{custom.error}</p> : null}
          {kind === "Differences" ? (
            <p className="np-note">
              {depth === 1 ? "Constant first difference → linear / arithmetic." : depth === 2 ? "Constant second difference → quadratic." : depth === 3 ? "Constant third difference → cubic." : "No constant difference in this table — do not force a polynomial degree."}
            </p>
          ) : null}
          {kind === "Predict" && parsed.ok && parsed.values.length >= 4 ? (
            <PredictInner values={parsed.values} teacherReveal={teacherReveal} />
          ) : null}
          {onOpenPascalFib && kind === "Fibonacci" ? <button type="button" className="np-ghost" onClick={onOpenPascalFib}>Show Fibonacci diagonals in Pascal</button> : null}
          <ChallengeBox {...challenge} onNew={() => setChallengeKey((x) => x + 1)} reveal={teacherReveal} />
        </aside>
      </div>
    </>
  );
}

function PredictInner({ values, teacherReveal }: { values: number[]; teacherReveal?: boolean }) {
  const hide = Math.floor(values.length / 2);
  const expected = values[hide]!;
  const shown = values.map((v, i) => (i === hide ? "?" : String(v))).join(", ");
  return <ChallengeBox prompt={`Fill the gap: ${shown}`} expected={expected} hint="Use the live difference table on the Differences tab." onNew={() => undefined} reveal={teacherReveal} />;
}
