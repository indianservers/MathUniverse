import { useMemo, useState } from "react";
import { ChallengeBox, NControl, usePlayer } from "./patternsUi";
import { binomialExpansion, combination, hockeyStick, pascalTriangle, rowSum } from "./patternsMath";

const PATTERNS = [
  "None",
  "Natural",
  "Triangular",
  "Tetrahedral",
  "Powers of 2",
  "Fibonacci",
  "Symmetry",
  "Hockey-stick",
  "Alternating",
] as const;

type Props = {
  rows: number;
  setRows: (n: number) => void;
  teacherReveal?: boolean;
  hideFormula?: boolean;
  hideValues?: boolean;
  pattern?: string;
  setPattern?: (id: string) => void;
  onOpenFractal?: (rows: number) => void;
};

export default function PascalPanel({ rows, setRows, teacherReveal, hideFormula, hideValues, pattern, setPattern, onOpenFractal }: Props) {
  const maxRow = Math.min(30, Math.max(0, rows));
  const triangle = useMemo(() => pascalTriangle(maxRow + 1), [maxRow]);
  const [shownRows, setShownRows] = useState(maxRow + 1);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  const [sel, setSel] = useState({ n: Math.min(6, maxRow), k: 2 });
  const [modN, setModN] = useState(0);
  const [showVals, setShowVals] = useState(true);
  const [pat, setPat] = useState<(typeof PATTERNS)[number]>("None");
  const [challengeKey, setChallengeKey] = useState(0);
  const activePat = (pattern as (typeof PATTERNS)[number]) ?? pat;
  const setActivePat = (id: (typeof PATTERNS)[number]) => {
    setPat(id);
    setPattern?.(id);
  };

  usePlayer(playing, speed, () => {
    setShownRows((s) => {
      if (s >= maxRow + 1) {
        setPlaying(false);
        return maxRow + 1;
      }
      return s + 1;
    });
  });

  const n = Math.min(sel.n, maxRow);
  const k = Math.min(sel.k, n);
  const value = combination(n, k);
  const parents = n > 0 && k > 0 && k < n ? [combination(n - 1, k - 1), combination(n - 1, k)] : null;
  const expansion = binomialExpansion(Math.min(8, n));
  const hs = hockeyStick(Math.min(8, n), Math.min(2, n));
  const visible = triangle.slice(0, Math.min(shownRows, triangle.length));

  const mark = (r: number, c: number) => {
    if (activePat === "Natural" && c === 1) return "is-on";
    if (activePat === "Triangular" && c === 2) return "is-on";
    if (activePat === "Tetrahedral" && c === 3) return "is-on";
    if (activePat === "Fibonacci" && r + c === Math.min(maxRow, Math.max(0, shownRows - 1))) return "is-on";
    if (activePat === "Symmetry" && r === n && (c === k || c === n - k)) return "is-on";
    if (activePat === "Hockey-stick" && c === 2 && r >= 2 && r <= 5) return "is-on";
    if (activePat === "Hockey-stick" && r === 6 && c === 3) return "is-parent";
    if (r === n && c === k) return "is-on";
    if (parents && r === n - 1 && (c === k - 1 || c === k)) return "is-parent";
    if (modN >= 2) {
      const v = triangle[r]?.[c] ?? 0;
      return v % modN === 1 || (modN === 2 && v % 2 === 1) ? "is-odd" : "is-even";
    }
    return "";
  };

  const challenge = useMemo(() => {
    const i = challengeKey % 5;
    if (i === 0) return { prompt: "What is C(10,3)?", expected: 120, hint: "10! / (3! 7!)." };
    if (i === 1) return { prompt: "What is the sum of row 12?", expected: 4096, hint: "2¹²." };
    if (i === 2) return { prompt: "Find the missing value: 1 7 21 ? 35 21 7 1", expected: 35, hint: "Row 7 is palindromic; C(7,3)=35." };
    if (i === 3) return { prompt: "Which Pascal row gives coefficients of (a+b)⁸? Enter the row index.", expected: 8, hint: "Row n ↔ (a+b)^n." };
    return { prompt: "Find C(20,18) using symmetry. C(20,2) = ?", expected: 190, hint: "C(n,k)=C(n,n−k); 20×19/2." };
  }, [challengeKey]);

  return (
    <>
      <div className="np-head">
        <div>
          <h2>Pascal’s Triangle</h2>
          <p>Build binomial coefficients row by row. Click any cell for C(n,k), expansions, and classic patterns.</p>
        </div>
      </div>
      <div className="np-work">
        <section className="np-card">
          <NControl label="Last row n" value={maxRow} min={0} max={30} onChange={(v) => { setRows(v); setShownRows(v + 1); setSel((s) => ({ n: Math.min(s.n, v), k: Math.min(s.k, v) })); }} />
          <NControl label="Row n" value={n} min={0} max={maxRow} onChange={(v) => setSel({ n: v, k: Math.min(k, v) })} />
          <NControl label="Position k" value={k} min={0} max={Math.max(0, n)} onChange={(v) => setSel({ n, k: v })} />
          <NControl label="Color by mod (0 = off)" value={modN} min={0} max={8} onChange={setModN} />
          <label className="np-toggle"><input type="checkbox" checked={showVals && !hideValues} onChange={(e) => setShowVals(e.target.checked)} /> Show values</label>
          <button type="button" className="np-go" onClick={() => { setShownRows(1); setPlaying(true); }}>▶ Animate rows</button>
          <div className="np-row">
            <button type="button" className="np-ghost" onClick={() => setPlaying(false)}>Pause</button>
            <button type="button" className="np-ghost" onClick={() => { setPlaying(false); setShownRows(maxRow + 1); }}>Reset</button>
          </div>
          <div className="np-seg">
            {PATTERNS.map((item) => (
              <button key={item} type="button" className={activePat === item ? "is-on" : ""} onClick={() => setActivePat(item)}>{item}</button>
            ))}
          </div>
          {onOpenFractal ? <button type="button" className="np-ghost" onClick={() => onOpenFractal(maxRow)}>Explore as Sierpiński fractal</button> : null}
        </section>
        <section className="np-card np-stage">
          <div className="np-pascal" role="img" aria-label="Pascal triangle">
            {visible.map((row, r) => (
              <span key={r}>
                {row.map((v, c) => (
                  <i
                    key={c}
                    className={mark(r, c)}
                    onClick={() => setSel({ n: r, k: c })}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSel({ n: r, k: c }); } }}
                    tabIndex={0}
                    role="button"
                    aria-label={`C(${r},${c}) = ${v}`}
                  >
                    {showVals && !hideValues ? v : ""}
                  </i>
                ))}
              </span>
            ))}
          </div>
          {parents ? <p className="np-work-eq">{parents[0]} + {parents[1]} → {value}</p> : <p className="np-note">Every row begins and ends with 1.</p>}
        </section>
        <aside className="np-card np-insight">
          {!hideFormula ? <p className="np-formula">C({n},{k}) = {value}</p> : null}
          <p className="np-work-eq">
            C({n},{k}) = {n}! / ({k}! {(n - k)}!)
            {n <= 12 ? ` = ${value}` : ""}
          </p>
          <p className="np-note">Mirror: C({n},{n - k}) = {combination(n, n - k)}{n === sel.n ? " (symmetry)." : ""}</p>
          <p className="np-work-eq">(a+b)^{n} = {expansion.map((t) => `${t.coef === 1 ? "" : t.coef}a${t.a ? `^${t.a}` : ""}${t.b ? `b^${t.b}` : ""}`).join(" + ").replace(/\^1/g, "")}</p>
          <p className="np-note">Sum of row {n} = 2^{n} = {rowSum(n)}. Hockey-stick: {hs.sum} = C({Math.min(8, n) + 1},{Math.min(2, n) + 1}) = {hs.result}.</p>
          {activePat === "Powers of 2" ? <p className="np-ok">Each row sum is a power of two because (1+1)^n = 2^n.</p> : null}
          {activePat === "Alternating" ? <p className="np-note">Alternating sum of row n is (1−1)^n = 0 for n&gt;0.</p> : null}
          {modN === 2 ? <p className="np-ok">Odd cells (mod 2 = 1) draw the Sierpiński triangle.</p> : null}
          <ChallengeBox {...challenge} onNew={() => setChallengeKey((x) => x + 1)} reveal={teacherReveal} />
        </aside>
      </div>
    </>
  );
}
