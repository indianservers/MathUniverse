import { Eye, HelpCircle, Lightbulb, Pencil, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import AlgebraLabHeading from "./AlgebraLabHeading";
import { useStudioMode } from "../../hooks/useStudioMode";
import {
  answersMatchChallenge,
  applyBalanceOperation,
  autoBalanceLinear,
  completeSquareText,
  describeLinearSolution,
  formatAlgebraNumber,
  formatBalanceTerm,
  formatInequalitySolution,
  formatLinearSide,
  parseBalanceOperand,
  parseLinearEquation,
  polynomialCoefficients,
  quadraticVertex,
  snapNearZero,
  solveAbsoluteEquation,
  solveQuadraticEquation,
} from "./algebraStudioMath";
import { factorIntegerQuadratic } from "./algebraEnhancementEngine";
import { useAlgebraHistory } from "./useAlgebraHistory";

const fmt = (n: number) => formatAlgebraNumber(n);

function Numeric({ label, value, onChange, min = -20, max = 20, step = 1, onCommit }: { label: string; value: number; onChange: (n: number) => void; min?: number; max?: number; step?: number; onCommit?: (n: number) => void }) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => { setDraft(String(value)); }, [value]);
  return (
    <label className="alg-field">{label}
      <input type="number" min={min} max={max} step={step} value={draft} onChange={(e) => {
        setDraft(e.target.value);
        if (e.target.value === "" || !Number.isFinite(Number(e.target.value))) return;
        onChange(Math.max(min, Math.min(max, Number(e.target.value))));
      }} onBlur={() => { if (draft === "" || !Number.isFinite(Number(draft))) setDraft(String(value)); else onCommit?.(Number(draft)); }} />
    </label>
  );
}

export default function EquationsLab() {
  const modes = ["Linear", "Quadratic", "Absolute Value", "Inequalities"];
  const [mode, setMode] = useStudioMode("mode", modes, "Linear");
  const history = useAlgebraHistory({
    a: 3,
    b: 5,
    c: 2,
    d: -1,
    origA: 3,
    origB: 5,
    origC: 2,
    origD: -1,
    operand: "-2x",
    activeOp: "Subtract" as "Add" | "Subtract" | "Multiply" | "Divide",
    relation: ">" as "<" | "<=" | ">" | ">=",
    autoBalance: true,
    notice: "",
    steps: [] as string[],
    showValues: true,
    goal: "Solve for x",
    draft: "3x + 5 = 2x - 1",
    challengeOn: false,
    challengeAnswer: "",
    challengeChecked: false,
    quadraticMethod: "Quadratic formula",
    infoOpen: false,
  });
  const { a, b, c, d, operand, activeOp, relation, autoBalance, notice, steps, showValues, goal, draft, challengeOn, challengeAnswer, challengeChecked, origA, origB, origC, origD, quadraticMethod, infoOpen } = history.state;
  const linear = describeLinearSolution(a, b, c, d);
  const left = formatLinearSide(a, b);
  const right = formatLinearSide(c, d);
  const equation = mode === "Quadratic" ? `${fmt(a)}x² + (${fmt(b)})x + (${fmt(c)}) = 0`
    : mode === "Absolute Value" ? `|${formatLinearSide(a, b)}| = ${fmt(d)}`
    : mode === "Inequalities" ? `${formatLinearSide(a, b)} ${relation} ${fmt(d)}`
    : `${left} = ${right}`;
  const quadratic = solveQuadraticEquation(a, b, c);
  const vertex = quadraticVertex(a, b, c);
  const absolute = solveAbsoluteEquation(a, b, d);
  const inequality = formatInequalitySolution(a, b, relation, d);
  const result = mode === "Quadratic" ? quadratic.text : mode === "Absolute Value" ? absolute.text : mode === "Inequalities" ? inequality.text : linear.text;
  const balanced = mode === "Linear"
    ? linear.kind !== "none"
    : mode === "Inequalities"
      ? inequality.kind === "constant" ? inequality.truth !== false : true
      : true;
  const parsedOp = parseBalanceOperand(operand);
  const opTerm = parsedOp.ok ? parsedOp.term : { x: 0, n: 0 };
  const startEquation = mode === "Linear"
    ? `${formatLinearSide(origA, origB)} = ${formatLinearSide(origC, origD)}`
    : equation;
  const setCoeff = (patch: Partial<typeof history.state>) => history.replace({ ...history.state, ...patch });
  const commitEq = (state: { a: number; b: number; c: number; d: number }, step: string, extra: Partial<typeof history.state> = {}) => {
    history.commit({
      ...history.state,
      ...state,
      ...extra,
      steps: [...steps, step].slice(-6),
    });
  };
  const operate = (operation: "Add" | "Subtract" | "Multiply" | "Divide") => {
    const applied = applyBalanceOperation({ a, b, c, d }, operation, operand, relation);
    if (!applied.ok) { setCoeff({ notice: applied.error, activeOp: operation }); return; }
    const label = "delta" in applied ? formatBalanceTerm(applied.delta) : formatBalanceTerm(applied.term);
    commitEq(applied.state, `${operation} ${formatBalanceTerm(applied.term)} from both sides → ${formatLinearSide(applied.state.a, applied.state.b)} = ${formatLinearSide(applied.state.c, applied.state.d)}`, {
      activeOp: operation,
      relation: mode === "Inequalities" ? applied.relation : relation,
      notice: `Applied ${label} to both sides.${applied.flipped ? " Inequality sign flipped." : ""}`,
    });
  };
  const applyDraft = () => {
    if (mode === "Quadratic") {
      const left = draft.split("=")[0] ?? draft;
      const parsed = polynomialCoefficients(left);
      if (!parsed.ok) { setCoeff({ notice: parsed.error }); return; }
      const coeffs = parsed.coeffs;
      const nextA = parsed.degree >= 2 ? coeffs[coeffs.length - 3] ?? 0 : 0;
      const nextB = parsed.degree >= 1 ? coeffs[coeffs.length - 2] ?? 0 : 0;
      const nextC = coeffs[coeffs.length - 1] ?? 0;
      history.reset({ ...history.state, a: nextA, b: nextB, c: nextC, draft, steps: [], notice: "Loaded quadratic." });
      return;
    }
    if (mode === "Absolute Value") {
      const normalized = draft.replace(/abs\(([^)]+)\)/i, "|$1|");
      const match = normalized.match(/^\s*\|(.+)\|\s*=\s*(.+)\s*$/);
      if (!match) { setCoeff({ notice: "Enter an equation like |2x+1| = 5." }); return; }
      const inside = parseBalanceOperand(match[1] ?? "");
      const right = parseBalanceOperand(match[2] ?? "");
      if (!inside.ok) { setCoeff({ notice: inside.error }); return; }
      if (!right.ok || right.term.x !== 0) { setCoeff({ notice: "The right side of an absolute-value equation must be a constant." }); return; }
      history.reset({ ...history.state, a: inside.term.x, b: inside.term.n, d: right.term.n, draft, steps: [], notice: "Loaded absolute-value equation." });
      return;
    }
    if (mode === "Inequalities") {
      const match = draft.match(/^(.*)(<=|>=|<|>)(.*)$/);
      if (!match) { setCoeff({ notice: "Enter an inequality such as 2x+1 > 5." }); return; }
      const left = parseBalanceOperand(match[1] ?? "");
      const right = parseBalanceOperand(match[3] ?? "");
      if (!left.ok) { setCoeff({ notice: left.error }); return; }
      if (!right.ok || right.term.x !== 0) { setCoeff({ notice: "Keep the right side a constant." }); return; }
      history.reset({ ...history.state, a: left.term.x, b: left.term.n, d: right.term.n, relation: match[2] as typeof relation, draft, steps: [], notice: "Loaded inequality." });
      return;
    }
    const parsed = parseLinearEquation(draft);
    if (!parsed.ok) { setCoeff({ notice: parsed.error }); return; }
    history.reset({ ...history.state, ...parsed.state, origA: parsed.state.a, origB: parsed.state.b, origC: parsed.state.c, origD: parsed.state.d, draft, steps: [], notice: "Loaded equation." });
  };
  const applyGoal = () => {
    if (goal === "Move x terms left") {
      const applied = applyBalanceOperation({ a, b, c, d }, "Subtract", `${c}x`, relation);
      if (applied.ok) commitEq(applied.state, `Move x terms left → ${formatLinearSide(applied.state.a, applied.state.b)} = ${formatLinearSide(applied.state.c, applied.state.d)}`);
    } else if (goal === "Move constants right") {
      const applied = applyBalanceOperation({ a, b, c, d }, "Subtract", b, relation);
      if (applied.ok) commitEq(applied.state, `Move constants right → ${formatLinearSide(applied.state.a, applied.state.b)} = ${formatLinearSide(applied.state.c, applied.state.d)}`);
    } else if (goal === "Simplify") {
      commitEq({ a, b, c, d }, `Simplified: ${formatLinearSide(a, b)} = ${formatLinearSide(c, d)}`);
    } else {
      const next = autoBalanceLinear({ a, b, c, d });
      commitEq(next, `Solve: ${formatLinearSide(next.a, next.b)} = ${formatLinearSide(next.c, next.d)}`);
    }
  };
  const newEquation = (asChallenge = false) => {
    const aa = 1 + Math.floor(Math.random() * 4);
    const cc = Math.floor(Math.random() * 3);
    const bb = Math.floor(Math.random() * 9) - 4;
    const x = Math.floor(Math.random() * 7) - 3;
    const dd = aa * x + bb - cc * x;
    history.reset({ ...history.state, a: aa, b: bb, c: cc, d: dd, origA: aa, origB: bb, origC: cc, origD: dd, draft: `${formatLinearSide(aa, bb)} = ${formatLinearSide(cc, dd)}`, steps: [], notice: asChallenge ? "Challenge loaded. Isolate x, then check." : "New equation loaded.", operand: cc ? `${cc}x` : String(bb || 1), activeOp: "Subtract", challengeOn: asChallenge || history.state.challengeOn, challengeAnswer: "", challengeChecked: false });
  };
  const marks = mode === "Quadratic" ? quadratic.roots.filter((root) => snapNearZero(root.imaginary) === 0).map((root) => root.real)
    : mode === "Absolute Value" ? absolute.values
    : mode === "Inequalities" && inequality.kind === "interval" ? [inequality.boundary]
    : linear.kind === "one" ? [linear.value] : [];
  const lineMin = -6;
  const lineMax = 6;
  const xTiles = (count: number, label: string) => Array.from({ length: Math.min(5, Math.max(0, Math.abs(Math.round(count)))) }, (_, i) => (
    <i key={`${label}${i}`} className="alg-eq-x">{showValues ? label : ""}</i>
  ));
  const challengeTarget = describeLinearSolution(origA, origB, origC, origD);
  const realQuadraticRoot = quadratic.roots.find((root) => snapNearZero(root.imaginary) === 0)?.real;
  const challengeExpected = mode === "Quadratic"
    ? (typeof realQuadraticRoot === "number" ? realQuadraticRoot : quadratic.text)
    : mode === "Absolute Value"
      ? (absolute.values[0] ?? absolute.text)
      : mode === "Inequalities"
        ? inequality.text
        : challengeTarget.kind === "one" ? challengeTarget.value : linear.text;
  const challengeOk = answersMatchChallenge(challengeAnswer, challengeExpected);
  const challengePrompt = mode === "Quadratic"
    ? `Solve ${equation}. Enter a real root.`
    : mode === "Absolute Value"
      ? `Solve ${equation}. Enter one real solution.`
      : mode === "Inequalities"
        ? `Describe the live inequality solution.`
        : `Solve and check: ${formatLinearSide(origA, origB)} = ${formatLinearSide(origC, origD)}`;
  const factoredQuad = factorIntegerQuadratic(Math.round(a), Math.round(b), Math.round(c));
  const quadraticRewrite = quadraticMethod === "Completing the square"
    ? completeSquareText(a, b, c)
    : quadraticMethod === "Factoring"
      ? (factoredQuad
        ? `(${factoredQuad.left[0] === 1 ? "" : factoredQuad.left[0]}x ${factoredQuad.left[1] >= 0 ? "+" : "−"} ${Math.abs(factoredQuad.left[1])})(${factoredQuad.right[0] === 1 ? "" : factoredQuad.right[0]}x ${factoredQuad.right[1] >= 0 ? "+" : "−"} ${Math.abs(factoredQuad.right[1])}) = 0`
        : "No integer factorization; the quadratic formula still applies.")
      : `x = (−b ± √D) / 2a → ${quadratic.text}`;
  return (
    <div className="alg-page alg-eq-page" data-mode-canvas={mode}>
      <AlgebraLabHeading labId="equations" subtitle="Solve equations and inequalities using the balance model. Explore operations, preserve equality, and check solutions." modes={modes} mode={mode} onMode={(next) => {
        setMode(next);
        const nextEquation = next === "Quadratic" ? `${fmt(a)}x² + (${fmt(b)})x + (${fmt(c)}) = 0`
          : next === "Absolute Value" ? `|${formatLinearSide(a, b)}| = ${fmt(d)}`
          : next === "Inequalities" ? `${formatLinearSide(a, b)} ${relation} ${fmt(d)}`
          : `${formatLinearSide(a, b)} = ${formatLinearSide(c, d)}`;
        history.replace({ ...history.state, draft: nextEquation, challengeChecked: false });
      }} onUndo={history.undo} onRedo={history.redo} canUndo={history.canUndo} canRedo={history.canRedo} onReset={() => history.reset()} helpTitle={`${mode} help`} helpBody="Operations always apply to both sides. Enter 2x then Subtract to remove x terms. Auto-balance does not skip steps. 0x=0 is all reals; 0x=nonzero has no solution.">Equations &amp; Inequalities Lab</AlgebraLabHeading>
      <p className="sr-only" role="status">{notice || "Watch how the scale stays balanced at every step."}</p>
      <div className="alg-eq-layout">
        <section className="alg-card alg-eq-equation" id="algebra-lab-main">
          <h2>Equation</h2>
          <p>Original: {startEquation}</p>
          <p>Current: {equation}</p>
          <p className="alg-kind-badge">{mode === "Linear" ? linear.kind === "one" ? "one solution" : linear.kind === "all" ? "all real numbers" : "no solution" : mode === "Quadratic" ? (quadratic.roots.some((root) => snapNearZero(root.imaginary) !== 0) ? "complex roots — not on the real line" : "real roots") : result}</p>
          <label className="alg-field">Equation
            <span className="alg-eq-input">
              <input value={draft} onChange={(e) => setCoeff({ draft: e.target.value })} onKeyDown={(e) => { if (e.key === "Enter") applyDraft(); }} />
              <button type="button" aria-label="Load equation" onClick={applyDraft}>▶</button>
            </span>
          </label>
          <label className="alg-field">Goal
            <select value={goal} onChange={(e) => setCoeff({ goal: e.target.value })}>
              <option>Solve for x</option>
              <option>Move x terms left</option>
              <option>Move constants right</option>
              <option>Simplify</option>
            </select>
          </label>
          {mode === "Linear" && <>
            <Numeric label="Left x coeff" value={a} onChange={(value) => setCoeff({ a: value, draft: `${formatLinearSide(value, b)} = ${formatLinearSide(c, d)}` })} onCommit={(value) => history.commit({ ...history.state, a: value, origA: value, draft: `${formatLinearSide(value, b)} = ${formatLinearSide(c, d)}` })} />
            <Numeric label="Left constant" value={b} onChange={(value) => setCoeff({ b: value, draft: `${formatLinearSide(a, value)} = ${formatLinearSide(c, d)}` })} onCommit={(value) => history.commit({ ...history.state, b: value, origB: value, draft: `${formatLinearSide(a, value)} = ${formatLinearSide(c, d)}` })} />
            <Numeric label="Right x coeff" value={c} onChange={(value) => setCoeff({ c: value, draft: `${formatLinearSide(a, b)} = ${formatLinearSide(value, d)}` })} onCommit={(value) => history.commit({ ...history.state, c: value, origC: value, draft: `${formatLinearSide(a, b)} = ${formatLinearSide(value, d)}` })} />
            <Numeric label="Right constant" value={d} onChange={(value) => setCoeff({ d: value, draft: `${formatLinearSide(a, b)} = ${formatLinearSide(c, value)}` })} onCommit={(value) => history.commit({ ...history.state, d: value, origD: value, draft: `${formatLinearSide(a, b)} = ${formatLinearSide(c, value)}` })} />
          </>}
          {mode === "Quadratic" && <>
            <Numeric label="a" value={a} onChange={(value) => setCoeff({ a: value, draft: `${fmt(value)}x² + (${fmt(b)})x + (${fmt(c)}) = 0` })} onCommit={(value) => history.commit({ ...history.state, a: value, draft: `${fmt(value)}x² + (${fmt(b)})x + (${fmt(c)}) = 0` })} />
            <Numeric label="b" value={b} onChange={(value) => setCoeff({ b: value, draft: `${fmt(a)}x² + (${fmt(value)})x + (${fmt(c)}) = 0` })} onCommit={(value) => history.commit({ ...history.state, b: value, draft: `${fmt(a)}x² + (${fmt(value)})x + (${fmt(c)}) = 0` })} />
            <Numeric label="c" value={c} onChange={(value) => setCoeff({ c: value, draft: `${fmt(a)}x² + (${fmt(b)})x + (${fmt(value)}) = 0` })} onCommit={(value) => history.commit({ ...history.state, c: value, draft: `${fmt(a)}x² + (${fmt(b)})x + (${fmt(value)}) = 0` })} />
            <label className="alg-field">Method<select value={quadraticMethod} onChange={(e) => setCoeff({ quadraticMethod: e.target.value })}>
              <option>Quadratic formula</option>
              <option>Factoring</option>
              <option>Completing the square</option>
            </select></label>
          </>}
          {mode === "Absolute Value" && <>
            <Numeric label="Inside x coeff" value={a} onChange={(value) => setCoeff({ a: value })} onCommit={(value) => history.commit({ ...history.state, a: value })} />
            <Numeric label="Inside constant" value={b} onChange={(value) => setCoeff({ b: value })} onCommit={(value) => history.commit({ ...history.state, b: value })} />
            <Numeric label="Right side" value={d} onChange={(value) => setCoeff({ d: value })} onCommit={(value) => history.commit({ ...history.state, d: value })} />
          </>}
          {mode === "Inequalities" && <>
            <Numeric label="x coeff" value={a} onChange={(value) => setCoeff({ a: value })} onCommit={(value) => history.commit({ ...history.state, a: value })} />
            <Numeric label="Constant" value={b} onChange={(value) => setCoeff({ b: value })} onCommit={(value) => history.commit({ ...history.state, b: value })} />
            <label className="alg-field">Relation<select value={relation} onChange={(e) => setCoeff({ relation: e.target.value as typeof relation })}>{["<", "<=", ">", ">="].map((r) => <option key={r}>{r}</option>)}</select></label>
            <Numeric label="Right side" value={d} onChange={(value) => setCoeff({ d: value })} onCommit={(value) => history.commit({ ...history.state, d: value })} />
          </>}
        </section>

        <section className="alg-card alg-eq-balance">
          <h2>
            Balance Model
            <button type="button" className="alg-eq-info" aria-label="Balance help" onClick={() => setCoeff({ infoOpen: !infoOpen, notice: "The same operation is applied to both sides, so equivalent equations stay balanced." })}>i</button>
            <label className="alg-toggle alg-eq-show"><span>Show values</span><input type="checkbox" checked={showValues} onChange={(e) => setCoeff({ showValues: e.target.checked })} /></label>
            <button type="button" className="alg-eq-reset" onClick={() => history.commit({ ...history.state, a: origA, b: origB, c: origC, d: origD, steps: [], notice: "Reset to the original equation." })}>↺ Reset</button>
          </h2>
          <div className="alg-eq-scale" aria-label="Balance scale">
            <div className="alg-eq-pan">
              <b>{showValues ? (mode === "Linear" ? left : equation.split("=")[0]) : ""}</b>
              <div>{mode === "Linear" ? <>{xTiles(a, "x")}{b !== 0 ? <i className="alg-eq-n">{showValues ? (b > 0 ? `+${fmt(b)}` : fmt(b)) : ""}</i> : null}</> : <small>{mode}</small>}</div>
            </div>
            <svg viewBox="0 0 90 140" className="alg-eq-post" aria-hidden="true">
              <circle cx="45" cy="18" r="16" fill="#fff" stroke="#94a3b8" strokeWidth="4" />
              <path d="M45 8v6M45 34v12" stroke="#64748b" strokeWidth="3" />
              <path d="M12 52h66" stroke="#94a3b8" strokeWidth="7" strokeLinecap="round" />
              <polygon points="32,62 45,132 58,62" fill="#e2e8f0" stroke="#94a3b8" />
              <circle cx="45" cy="18" r="5" fill={balanced ? "#22c55e" : "#ef4444"} />
            </svg>
            <div className="alg-eq-pan">
              <b>{showValues ? (mode === "Linear" ? right : equation.split("=")[1]) : ""}</b>
              <div>{mode === "Linear" ? <>{xTiles(c, "x")}{d !== 0 ? <i className="alg-eq-n">{showValues ? (d > 0 ? `+${fmt(d)}` : fmt(d)) : ""}</i> : null}</> : <small>{result}</small>}</div>
            </div>
          </div>
          <strong className={balanced ? "alg-balanced" : "alg-balanced is-off"}>{balanced ? "Balanced ✓" : "Not balanced"}</strong>
          {notice.includes("flipped") ? <p className="alg-eq-flip" role="status">Inequality sign reversed because both sides were multiplied or divided by a negative number. Check: 2 &gt; 1, but −2 &lt; −1.</p> : mode === "Inequalities" ? <p className="alg-eq-flip">Multiplying 2 &gt; 1 by −1 yields −2 &lt; −1 — the inequality flips.</p> : null}
          {infoOpen ? <p>Adding, subtracting, multiplying, or dividing both sides by the same nonzero value preserves equality. 0x = 0 is all reals; 0x = nonzero has no solution.</p> : null}
        </section>

        <section className="alg-card alg-eq-steps">
          <h2>Steps <small>{Math.min(steps.length + 1, 6)} / 6</small></h2>
          <ol className="alg-eq-step-list">
            <li><span>1</span><div><b>Start</b><p>{startEquation}</p></div></li>
            {steps.map((step, i) => (
              <li key={`${step}-${i}`}><span>{i + 2}</span><div><p>{step}</p><em>Preserves equality ✓</em></div></li>
            ))}
          </ol>
          <p className="alg-success">All operations applied to both sides. Equality preserved ✓</p>
        </section>

        <section className="alg-card alg-eq-ops">
          <h2>Operations</h2>
          <div className="alg-eq-op-row">
            {([["Add", "+"], ["Subtract", "−"], ["Multiply", "×"], ["Divide", "÷"]] as const).map(([operation, mark]) => (
              <button type="button" key={operation} className={activeOp === operation ? "is-on" : ""} aria-pressed={activeOp === operation} onClick={() => operate(operation)}>{mark} {operation}</button>
            ))}
            <button type="button" aria-label="Undo" onClick={history.undo} disabled={!history.canUndo}>↩ Undo</button>
          </div>
          <div className="alg-apply-row">
            <span>Apply the same operation to both sides</span>
            <label className="alg-eq-op-input">
              <input aria-label="Operand" value={operand} onChange={(e) => setCoeff({ operand: e.target.value })} />
            </label>
            <i>×</i>
            <output>{linear.kind === "one" ? fmt(linear.value) : "—"}</output>
            <i>=</i>
            <output className="is-empty">{linear.kind === "one" ? fmt(opTerm.x * linear.value + opTerm.n) : ""}</output>
            <label className="alg-toggle"><span>Auto-balance</span><input type="checkbox" checked={autoBalance} onChange={(e) => history.commit({ ...history.state, autoBalance: e.target.checked })} /></label>
          </div>
        </section>

        <section className="alg-card alg-eq-line">
          <h2>Solution on Number Line {linear.kind === "one" && mode === "Linear" ? <b>x = {fmt(linear.value)}</b> : null}</h2>
          <div className="alg-eq-numberline" aria-label="Number line">
            <i className="alg-eq-axis" />
            {Array.from({ length: lineMax - lineMin + 1 }, (_, i) => lineMin + i).map((n) => (
              <span key={n} style={{ left: `${((n - lineMin) / (lineMax - lineMin)) * 100}%` }}>{n}</span>
            ))}
            {mode === "Inequalities" && inequality.kind === "interval" && (
              <b className="alg-eq-ray" style={{
                left: inequality.relation.includes(">") ? `${((Math.max(inequality.boundary, lineMin) - lineMin) / (lineMax - lineMin)) * 100}%` : 0,
                width: inequality.relation.includes(">")
                  ? `${((lineMax - Math.max(inequality.boundary, lineMin)) / (lineMax - lineMin)) * 100}%`
                  : `${((Math.min(inequality.boundary, lineMax) - lineMin) / (lineMax - lineMin)) * 100}%`,
              }} />
            )}
            {marks.filter((value) => value >= lineMin && value <= lineMax).map((value) => (
              <em key={value} className={mode === "Inequalities" && inequality.kind === "interval" && !inequality.relation.includes("=") ? "is-out" : undefined} style={{ left: `${((value - lineMin) / (lineMax - lineMin)) * 100}%` }} />
            ))}
          </div>
          <div className="alg-eq-interval">
            <small>Solution (in interval notation)</small>
            <output>{mode === "Inequalities" ? inequality.text : linear.kind === "one" && mode === "Linear" ? `{${fmt(linear.value)}}` : result}</output>
            <p><i /> Solution <i className="is-out" /> Not included</p>
          </div>
        </section>

        <section className="alg-card alg-eq-validate">
          <h2>Solution &amp; Validation</h2>
          <p>Candidate <strong>{result}</strong></p>
          {mode === "Quadratic" && vertex && (
            <div className="alg-eq-check">
              <p>D = {fmt(b * b - 4 * a * c)}. Vertex ({fmt(vertex.x)}, {fmt(vertex.y)}). Axis x = {fmt(vertex.x)}. y-intercept {fmt(c)}.</p>
              <p>{quadraticRewrite}</p>
              <svg className="alg-graph" viewBox="0 0 700 220" role="img" aria-label="Quadratic graph">
                <path d="M30 110H670M350 10V210" stroke="currentColor" fill="none" />
                <path d={Array.from({ length: 80 }, (_, i) => {
                  const x = -6 + i * 12 / 79;
                  const y = a * x * x + b * x + c;
                  const px = 350 + x * 50;
                  const py = 110 - y * 8;
                  return `${i === 0 ? "M" : "L"}${px},${py}`;
                }).join(" ")} fill="none" stroke="#0891b2" strokeWidth="3" />
              </svg>
            </div>
          )}
          {linear.kind === "one" && mode === "Linear" && (
            <div className="alg-eq-check">
              <p>Check in original equation</p>
              <p>{formatLinearSide(origA, 0) ? `${origA}(${fmt(linear.value)})` : ""} {origB >= 0 ? "+" : "−"} {fmt(Math.abs(origB))} ≟ {formatLinearSide(origC, 0) ? `${origC}(${fmt(linear.value)})` : ""} {origD >= 0 ? "+" : "−"} {fmt(Math.abs(origD))}</p>
              <p className="ok">{fmt(origA * linear.value + origB)} = {fmt(origC * linear.value + origD)} Valid solution ✓</p>
            </div>
          )}
          <p className="alg-eq-extra">Extraneous check {mode === "Absolute Value" && d < 0 ? "Right side is negative, so there is no real solution." : "No restrictions detected. ✓"}</p>
          {mode === "Quadratic" ? <p>Discriminant D = {fmt(b * b - 4 * a * c)}{b * b - 4 * a * c > 0 ? " (two real roots)" : b * b - 4 * a * c === 0 ? " (one real root)" : " (complex roots — use Argand, not this number line)"}</p> : null}
          {mode === "Linear" && linear.kind === "one" ? <p>Check candidate in the original {formatLinearSide(origA, origB)} = {formatLinearSide(origC, origD)} at x = {fmt(linear.value)}.</p> : null}
        </section>

        <section className="alg-card alg-eq-why">
          <h2>Why it works</h2>
          <p>We applied the same operations to both sides of the equation, which preserves equality at every step. The balance stayed level, so both sides remained equivalent. Substituting back confirms the solution.</p>
        </section>
      </div>

      <section className="alg-eq-learn" aria-label="Learning loop">
        <div role="button" tabIndex={0} onClick={() => setCoeff({ notice: "Watch both pans stay equivalent after each operation." })} onKeyDown={(e) => { if (e.key === "Enter") setCoeff({ notice: "Watch both pans stay equivalent after each operation." }); }}><Eye /><div><b>Observe</b><small>Watch how the scale stays balanced at every step.</small></div></div>
        <div role="button" tabIndex={0} onClick={() => setCoeff({ notice: "If a = b then a + c = b + c. The same is true for −, ×, and ÷ (except ÷ 0)." })} onKeyDown={(e) => { if (e.key === "Enter") setCoeff({ notice: "If a = b then a + c = b + c." }); }}><Lightbulb /><div><b>Understand</b><small>Operations done to one side must be done to the other. a = b ⇒ a + c = b + c</small></div></div>
        <div role="button" tabIndex={0} onClick={() => applyGoal()} onKeyDown={(e) => { if (e.key === "Enter") applyGoal(); }}><HelpCircle /><div><b>Why</b><small>Equality is preserved by applying inverse operations to isolate x.</small></div></div>
        <div>
          <Pencil />
          <div>
            <b>Try</b>
            <small>Create your own equation and solve it step by step.</small>
            <button type="button" onClick={newEquation}>New Equation</button>
          </div>
        </div>
        <div>
          <Sparkles />
          <div>
            <b>Challenge</b>
            <small>{challengePrompt}</small>
            <button type="button" className="alg-eq-challenge" onClick={() => newEquation(true)}>Challenge Me</button>
          {challengeOn && (
            <label className="alg-field">Your answer
              <input value={challengeAnswer} onChange={(e) => setCoeff({ challengeAnswer: e.target.value, challengeChecked: false })} />
              <button type="button" className="alg-gradient-button" onClick={() => setCoeff({ challengeChecked: true })}>Check answer</button>
              {challengeChecked && <p role="status">{challengeOk ? "Correct." : `Not yet. Current ${mode.toLowerCase()} solution: ${typeof challengeExpected === "number" ? fmt(challengeExpected) : challengeExpected}.`}</p>}
            </label>
          )}
          </div>
        </div>
      </section>
    </div>
  );
}
