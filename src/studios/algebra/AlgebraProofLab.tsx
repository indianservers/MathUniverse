import { AlertTriangle, Check, Eye, FlaskConical, HelpCircle, Lightbulb, Maximize2, RotateCcw, RotateCw, Sparkles, Trophy } from "lucide-react";
import { useMemo, useState, type CSSProperties } from "react";
import AlgebraLabHeading from "./AlgebraLabHeading";
import { useStudioMode } from "../../hooks/useStudioMode";
import {
  answersMatchChallenge,
  classifyProofReason,
  evaluateAlgebraExpression,
  expressionsEquivalent,
  formatAlgebraNumber,
  reasonMatchesStep,
} from "./algebraStudioMath";
import { useAlgebraHistory } from "./useAlgebraHistory";

const modes = ["Identities", "Equation Proof", "Induction", "Inequality", "Counterexample"] as const;
type ProofMode = (typeof modes)[number];

type ProofStep = { statement: string; reason: string };

type ProofState = {
  steps: ProofStep[];
  draft: string;
  template: string;
  selected: number;
  a: number;
  b: number;
  n: number;
  numeric: string;
  challengeOn: boolean;
  challengeAnswer: string;
  challengeChecked: boolean;
};

const REASONS = [
  { id: "commutative", label: "Commutative Property", color: "#0891b2" },
  { id: "associative", label: "Associative Property", color: "#8b5cf6" },
  { id: "combine", label: "Combine like terms", color: "#f59e0b" },
  { id: "distributive", label: "Distributive Property", color: "#2563eb" },
  { id: "square", label: "Definition of square", color: "#0ea5e9" },
  { id: "given", label: "Given", color: "#64748b" },
] as const;

const TEMPLATES: Record<string, string> = {
  "Expand using distributive property": "a(a+b)+b(a+b)",
  "Write as a product": "(a+b)(a+b)",
  "Expand both factors": "a^2+ab+ab+b^2",
  "Combine like terms": "a^2+2*a*b+b^2",
  "Start from the square": "(a+b)^2",
};

function pretty(expr: string) {
  return expr
    .replace(/\*/g, "")
    .replace(/\^2/g, "²")
    .replace(/\^3/g, "³")
    .replace(/-/g, "−")
    .replace(/\+/g, " + ")
    .replace(/−/g, " − ")
    .replace(/\s+/g, " ")
    .trim();
}

function seed(mode: ProofMode): ProofStep[] {
  if (mode === "Equation Proof") {
    return [
      { statement: "2*x+6=0", reason: "Given" },
      { statement: "2*x=-6", reason: "Subtract 6 from both sides" },
      { statement: "x=-3", reason: "Divide both sides by 2" },
    ];
  }
  if (mode === "Induction") {
    return [
      { statement: "1=1*(1+1)/2", reason: "Base case n=1" },
      { statement: "S_k=k*(k+1)/2", reason: "Induction hypothesis" },
      { statement: "S_(k+1)=k*(k+1)/2+(k+1)", reason: "Add the next term" },
      { statement: "S_(k+1)=(k+1)*(k+2)/2", reason: "Factor (k+1)" },
    ];
  }
  if (mode === "Inequality") {
    return [
      { statement: "(a-b)^2>=0", reason: "Squares of reals are nonnegative" },
      { statement: "a^2-2*a*b+b^2>=0", reason: "Expand the square" },
      { statement: "a^2+b^2>=2*a*b", reason: "Add 2ab to both sides" },
    ];
  }
  if (mode === "Counterexample") {
    return [
      { statement: "(a+b)^2=a^2+b^2", reason: "Claim (to disprove)" },
      { statement: "(a+b)^2=a^2+2*a*b+b^2", reason: "Definition of square and distribute" },
      { statement: "a=2, b=3: 25 ≠ 13", reason: "Numerical counterexample" },
    ];
  }
  return [
    { statement: "(a+b)^2", reason: "Given" },
    { statement: "(a+b)(a+b)", reason: "Definition of square: x² = x · x" },
    { statement: "a(a+b)+b(a+b)", reason: "Distributive Property" },
      { statement: "a^2+a*b+a*b+b^2", reason: "Distributive Property" },
      { statement: "a^2+2*a*b+b^2", reason: "" },
  ];
}

function goalCopy(mode: ProofMode) {
  if (mode === "Equation Proof") return { label: "Prove the solution", math: "2x + 6 = 0  ⇒  x = −3" };
  if (mode === "Induction") return { label: "Prove by induction", math: "1 + 2 + ⋯ + n = n(n+1)/2" };
  if (mode === "Inequality") return { label: "Prove the inequality", math: "a² + b² ≥ 2ab" };
  if (mode === "Counterexample") return { label: "Disprove the claim", math: "(a+b)² = a² + b²" };
  return { label: "Prove the identity", math: "(a+b)² = a² + 2ab + b²" };
}

function withTimes(expr: string) {
  return expr.replace(/ab/gi, "a*b").replace(/ba/gi, "b*a");
}

function identityHoldsAtSamples(left: string, right: string) {
  const a = withTimes(left);
  const b = withTimes(right);
  if (expressionsEquivalent(a, b)) return true;
  const samples = [[1, 1], [2, 3], [-1, 4], [0, 2], [5, -2]] as const;
  return samples.every(([av, bv]) => {
    const L = evaluateAlgebraExpression(a, { a: av, b: bv });
    const R = evaluateAlgebraExpression(b, { a: av, b: bv });
    return L.ok && R.ok && Math.abs(L.value - R.value) < 1e-6;
  });
}

function identityTarget(statement: string, previous: string, index: number) {
  const normalized = withTimes(statement);
  if (!identityHoldsAtSamples(normalized, "(a+b)^2") && !identityHoldsAtSamples(normalized, "a^2+2*a*b+b^2")) {
    return { valid: false as const, suggested: "", reason: "not-equivalent" as const };
  }
  if (index === 0 || normalized.replace(/\s/g, "") === "(a+b)^2") {
    return { valid: true as const, suggested: "Given", reason: "given" as const };
  }
  const classified = classifyProofReason(normalized, withTimes(previous) || "(a+b)^2");
  if (classified.valid) return classified;
  return classifyProofReason(normalized, "(a+b)^2");
}

function stepStatus(step: ProofStep, previous: string, mode: ProofMode, index: number) {
  if (!step.statement.trim()) return { ok: false, note: "Missing statement" };
  if (!step.reason.trim()) return { ok: false, note: "Check reason" };
  if (mode === "Identities") {
    const classified = identityTarget(step.statement, previous, index);
    if (!classified.valid) return { ok: false, note: "Not equivalent" };
    const reason = step.reason.toLowerCase();
    if (index === 0) return { ok: reason.includes("given"), note: reason.includes("given") ? "Given" : "Use Given" };
    if (reason.includes("square")) return { ok: true, note: "Definition of square" };
    if (reason.includes("distribut")) return { ok: true, note: "Distributive Property" };
    if (reason.includes("like") || reason.includes("combin")) return { ok: true, note: "Combine like terms" };
    if (reason.includes("commut") || reason.includes("assoc")) return { ok: true, note: classified.suggested || "Valid" };
    if (reasonMatchesStep(step.reason, classified)) return { ok: true, note: classified.suggested };
    return { ok: false, note: `Use ${classified.suggested}` };
  }
  return { ok: true, note: "Recorded" };
}

function fmt(n: number) {
  return formatAlgebraNumber(n);
}

export default function ProofLab() {
  const [mode, setMode] = useStudioMode("mode", modes, "Identities");
  const history = useAlgebraHistory<ProofState>({
    steps: seed("Identities"),
    draft: "",
    template: "Expand using distributive property",
    selected: 4,
    a: 2,
    b: 3,
    n: 5,
    numeric: "",
    challengeOn: false,
    challengeAnswer: "",
    challengeChecked: false,
  });
  const { steps, draft, template, selected, a, b, n, numeric, challengeOn, challengeAnswer, challengeChecked } = history.state;
  const [focusTile, setFocusTile] = useState<"a2" | "ab" | "b2" | null>(null);
  const [expanded, setExpanded] = useState(false);

  const patch = (next: Partial<ProofState>, commit = true) => {
    const value = { ...history.state, ...next };
    if (commit) history.commit(value);
    else history.replace(value);
  };

  const statuses = steps.map((step, index) => stepStatus(step, steps[index - 1]?.statement ?? "", mode as ProofMode, index));
  const complete = statuses.filter((item) => item.ok).length;
  const expected = Math.max(steps.length, 1);
  const percent = Math.round((complete / expected) * 100);
  const goal = goalCopy(mode as ProofMode);
  const selectedStatus = statuses[selected];
  const lhs = (a + b) ** 2;
  const rhs = a * a + 2 * a * b + b * b;
  const identityHolds = Math.abs(lhs - rhs) < 1e-9;
  const counterLeft = (a + b) ** 2;
  const counterRight = a * a + b * b;
  const sumCheck = n * (n + 1) / 2;
  const sumDirect = (n * (n + 1)) / 2;
  const challengeExpected = (a + b) ** 2;
  const challengeOk = answersMatchChallenge(challengeAnswer, challengeExpected);

  const explanation = useMemo(() => {
    if (mode === "Equation Proof") return "The same operation on both sides preserves equality. Subtracting 6 isolates 2x; dividing by 2 isolates x. Substituting x = −3 recovers 0 = 0.";
    if (mode === "Induction") return "The base case holds at n = 1. Adding (k+1) to the inductive formula factors as (k+1)(k+2)/2, so the statement advances to every next integer.";
    if (mode === "Inequality") return "(a−b)² is never negative. Expanding and rearranging immediately gives a² + b² ≥ 2ab, with equality exactly when a = b.";
    if (mode === "Counterexample") return "The missing 2ab rectangle is why (a+b)² is not a²+b². Any pair with ab ≠ 0, such as a=2, b=3, is a counterexample: 25 ≠ 13.";
    return "We expanded (a+b)² using the distributive property to get four terms, then combined the like terms ab and ab to obtain 2ab.";
  }, [mode]);

  const addStep = () => {
    const statement = draft.trim() || TEMPLATES[template] || "";
    if (!statement) return;
    const previous = steps.at(-1)?.statement ?? "(a+b)^2";
    const classified = identityTarget(statement, previous, steps.length);
    const reason = classified.valid ? classified.suggested : "";
    patch({ steps: [...steps, { statement, reason }], draft: "", selected: steps.length });
  };

  const dropReason = (index: number, reason: string) => {
    patch({ steps: steps.map((step, i) => i === index ? { ...step, reason } : step), selected: index });
  };

  const dropStatement = (statement: string) => {
    if (selected >= 0 && selected < steps.length && !steps[selected]!.statement) {
      patch({ steps: steps.map((step, i) => i === selected ? { ...step, statement } : step) });
      return;
    }
    patch({ steps: [...steps, { statement, reason: "" }], selected: steps.length });
  };

  const insertSymbol = (symbol: string) => patch({ draft: `${draft}${symbol}` }, false);

  const verifyNumeric = () => {
    if (mode === "Counterexample") {
      patch({ numeric: `(${fmt(a)}+${fmt(b)})² = ${fmt(counterLeft)}, but ${fmt(a)}²+${fmt(b)}² = ${fmt(counterRight)}. ${counterLeft !== counterRight ? "Claim fails." : "Pick nonzero a and b."}` }, false);
      return;
    }
    patch({ numeric: identityHolds ? `LHS = RHS = ${fmt(lhs)} at a=${fmt(a)}, b=${fmt(b)}.` : `Mismatch: ${fmt(lhs)} ≠ ${fmt(rhs)}.` }, false);
  };

  const switchMode = (next: string) => {
    setMode(next);
    history.reset({ ...history.state, steps: seed(next as ProofMode), selected: 0, numeric: "", challengeOn: false, challengeChecked: false, challengeAnswer: "" });
  };

  return (
    <div className="alg-page alg-proof-page" data-mode-canvas={mode}>
      <AlgebraLabHeading
        subtitle="Build and validate algebraic proofs with interactive visual models."
        labId="proof"
        modes={modes}
        mode={mode}
        onMode={switchMode}
        onUndo={history.undo}
        onRedo={history.redo}
        canUndo={history.canUndo}
        canRedo={history.canRedo}
        onReset={() => history.reset()}
        helpTitle={`${mode} help`}
        helpBody="Drag a reason chip onto a row. Identity lines must stay equivalent to (a+b)². Click an area-model tile to see which terms it names."
      >
        Algebraic Proof Lab
      </AlgebraLabHeading>

      <section className="alg-proof-goal" aria-label="Proof goal">
        <span>Goal</span>
        <p>{goal.label} <strong>{goal.math}</strong></p>
        <div>
          <small>Proof progress</small>
          <progress max={expected} value={complete} />
          <b>{complete} / {expected} steps · {percent}%</b>
        </div>
      </section>

      <div className="alg-proof-shell">
        <div className="alg-proof-main">
          <section className="alg-card alg-proof-builder">
            <h2>Two-Column Proof Builder</h2>
            <p>Drag steps or reasons to build your proof.</p>
            <table className="alg-proof-table">
              <thead>
                <tr><th>Statements</th><th>Reasons</th></tr>
              </thead>
              <tbody>
                {steps.map((step, index) => {
                  const status = statuses[index]!;
                  const lit = focusTile && mode === "Identities" && (index >= 3);
                  return (
                    <tr key={`${step.statement}-${index}`} className={`${selected === index ? "is-on" : ""} ${lit ? "is-lit" : ""}`} onClick={() => patch({ selected: index }, false)}>
                      <td>
                        <span>{index + 1}</span>
                        <em>{pretty(step.statement) || "…"}</em>
                      </td>
                      <td
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={(event) => {
                          event.preventDefault();
                          const reason = event.dataTransfer.getData("text/proof-reason");
                          if (reason) dropReason(index, reason);
                        }}
                      >
                        <span>{index + 1}</span>
                        {step.reason || <i>Drop a reason</i>}
                        {status.ok ? <Check aria-label="Valid step" /> : <AlertTriangle aria-label={status.note} />}
                        {!status.ok ? <small>{status.note}</small> : null}
                        <button type="button" aria-label="Move step up" disabled={index === 0} onClick={(event) => { event.stopPropagation(); if (index === 0) return; const next = [...steps]; const swap = next[index - 1]!; next[index - 1] = next[index]!; next[index] = swap; patch({ steps: next, selected: index - 1 }); }}>↑</button>
                        <button type="button" aria-label="Move step down" disabled={index === steps.length - 1} onClick={(event) => { event.stopPropagation(); if (index >= steps.length - 1) return; const next = [...steps]; const swap = next[index + 1]!; next[index + 1] = next[index]!; next[index] = swap; patch({ steps: next, selected: index + 1 }); }}>↓</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="alg-proof-drop">
              <button
                type="button"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  const statement = event.dataTransfer.getData("text/proof-statement");
                  if (statement) dropStatement(statement);
                }}
              >
                Drag a statement here
              </button>
              {selectedStatus && !selectedStatus.ok ? (
                <p role="status"><AlertTriangle /> Invalid or missing reason: {selectedStatus.note}</p>
              ) : null}
            </div>
            <div className="alg-proof-chips">
              {REASONS.map((reason) => (
                <button
                  key={reason.id}
                  type="button"
                  draggable
                  style={{ "--chip": reason.color } as CSSProperties}
                  onDragStart={(event) => event.dataTransfer.setData("text/proof-reason", reason.label)}
                  onClick={() => dropReason(selected, reason.label)}
                >
                  {reason.label}
                </button>
              ))}
            </div>
          </section>

          <div className="alg-proof-tools">
            <section className="alg-card">
              <h2>Add Step</h2>
              <label className="alg-field">Select a statement template
                <select value={template} onChange={(event) => patch({ template: event.target.value, draft: TEMPLATES[event.target.value] ?? draft }, false)}>
                  {Object.keys(TEMPLATES).map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className="alg-field">Enter your statement
                <input
                  value={draft}
                  placeholder="e.g., a(a+b)+b(a+b)"
                  onChange={(event) => patch({ draft: event.target.value }, false)}
                  onKeyDown={(event) => { if (event.key === "Enter") addStep(); }}
                />
              </label>
              <button type="button" className="alg-gradient-button" onClick={addStep}>Add to proof</button>
            </section>
            <section className="alg-card">
              <h2>Symbol Palette</h2>
              <div className="alg-symbols">
                {["a", "b", "a²", "b²", "(", ")", "+", "−", "·", "=", "^2"].map((symbol) => (
                  <button
                    type="button"
                    key={symbol}
                    draggable
                    onDragStart={(event) => event.dataTransfer.setData("text/proof-statement", symbol.replace("²", "^2").replace("·", "*").replace("−", "-"))}
                    onClick={() => insertSymbol(symbol.replace("²", "^2").replace("·", "*").replace("−", "-"))}
                  >
                    {symbol}
                  </button>
                ))}
              </div>
            </section>
            <section className="alg-card alg-proof-status">
              <h2>Quick Actions</h2>
              <div className="alg-proof-actions">
                <button type="button" disabled={!history.canUndo} onClick={history.undo}><RotateCcw /> Undo</button>
                <button type="button" disabled={!history.canRedo} onClick={history.redo}><RotateCw /> Redo</button>
                <button type="button" onClick={() => patch({ steps: steps.slice(0, 1), selected: 0 })}>Clear proof</button>
                <button type="button" onClick={() => history.reset()}>Start over</button>
              </div>
              <div className="alg-proof-meter" style={{ "--pct": `${percent}` } as CSSProperties}>
                <strong>{percent}%</strong>
                <small>{percent >= 100 ? "Proven" : percent >= 80 ? "Almost there!" : "Keep going"}</small>
                <p>{percent >= 100 ? "Every line is justified." : `Fix the reason for Step ${(statuses.findIndex((item) => !item.ok) + 1) || expected} to complete the proof.`}</p>
              </div>
            </section>
          </div>
        </div>

        <aside className="alg-proof-rail">
          <section className={`alg-card alg-proof-visual${expanded ? " is-wide" : ""}`}>
            <header>
              <h2>{mode === "Identities" ? "Visual Model: Area Model" : mode === "Equation Proof" ? "Visual Model: Balance" : mode === "Induction" ? "Visual Model: Staircase" : mode === "Inequality" ? "Visual Model: Nonnegative Square" : "Visual Model: Missing 2ab"}</h2>
              <button type="button" aria-label="Expand visual" onClick={() => setExpanded((value) => !value)}><Maximize2 /></button>
            </header>
            {mode === "Induction" ? (
              <div className="alg-proof-regions">
                <p><b>P(n)</b> {goal.math}</p>
                <p><b>Base</b> n = 1</p>
                <p><b>Hypothesis</b> assume P(k)</p>
                <p><b>Step</b> prove P(k+1)</p>
              </div>
            ) : null}
            <p>
              {mode === "Identities" && "(a+b)² as the area of a square."}
              {mode === "Equation Proof" && "Same operation on both pans keeps the scale level."}
              {mode === "Induction" && `Check n = ${n}: ${sumDirect} = ${n}(${n}+1)/2.`}
              {mode === "Inequality" && `(a−b)² = ${fmt((a - b) ** 2)} ≥ 0.`}
              {mode === "Counterexample" && "The orange rectangles are the 2ab the false claim forgets."}
            </p>
            {mode === "Identities" || mode === "Counterexample" ? (
              <div className="alg-proof-area-wrap">
                <small className="is-top">a + b</small>
                <div className="alg-proof-area">
                  <button type="button" className={focusTile === "a2" ? "is-on" : ""} onClick={() => setFocusTile(focusTile === "a2" ? null : "a2")}><b>a²</b></button>
                  <button type="button" className={focusTile === "ab" ? "is-on" : ""} onClick={() => setFocusTile(focusTile === "ab" ? null : "ab")}><b>ab</b></button>
                  <button type="button" className={focusTile === "ab" ? "is-on" : ""} onClick={() => setFocusTile(focusTile === "ab" ? null : "ab")}><b>ab</b></button>
                  <button type="button" className={focusTile === "b2" ? "is-on" : ""} onClick={() => setFocusTile(focusTile === "b2" ? null : "b2")}><b>b²</b></button>
                </div>
                <small className="is-left-a">a</small>
                <small className="is-left-b">b</small>
                <small className="is-bottom-a">a</small>
                <small className="is-bottom-b">b</small>
              </div>
            ) : mode === "Induction" ? (
              <svg className="alg-proof-stairs" viewBox="0 0 280 160" role="img" aria-label="Induction staircase">
                {Array.from({ length: n }, (_, row) => Array.from({ length: row + 1 }, (_, col) => (
                  <rect key={`${row}-${col}`} x={24 + col * 18} y={130 - row * 18} width="16" height="16" rx="3" fill={row === n - 1 ? "#8b5cf6" : "#22d3ee"} />
                )))}
              </svg>
            ) : mode === "Inequality" ? (
              <svg className="alg-proof-stairs" viewBox="0 0 240 160" role="img" aria-label="Nonnegative square">
                <rect x="40" y="20" width="120" height="120" rx="10" fill="#dbeafe" stroke="#2563eb" />
                <text x="100" y="88" textAnchor="middle" fill="#1d4ed8" fontSize="18" fontWeight="800">(a−b)²</text>
              </svg>
            ) : (
              <svg className="alg-proof-stairs" viewBox="0 0 280 140" role="img" aria-label="Equation balance">
                <line x1="40" y1="70" x2="240" y2="70" stroke="#64748b" strokeWidth="8" />
                <rect x="50" y="28" width="70" height="36" rx="8" fill="#22d3ee" />
                <rect x="160" y="28" width="70" height="36" rx="8" fill="#c084fc" />
                <text x="85" y="52" textAnchor="middle" fill="#fff" fontWeight="800">2x</text>
                <text x="195" y="52" textAnchor="middle" fill="#fff" fontWeight="800">−6</text>
                <text x="140" y="120" textAnchor="middle" fill="#059669" fontWeight="800">Balanced</text>
              </svg>
            )}
            <p className="alg-proof-total">
              {mode === "Identities" && `Total area = a² + ab + ab + b² = a² + 2ab + b²`}
              {mode === "Counterexample" && `True area ${fmt(counterLeft)} vs claimed ${fmt(counterRight)}`}
              {mode === "Induction" && `Sₙ = ${fmt(sumCheck)}`}
              {mode === "Inequality" && `${fmt(a * a + b * b)} ≥ ${fmt(2 * a * b)}`}
              {mode === "Equation Proof" && `x = −3 checks: 2(−3)+6 = 0`}
            </p>
          </section>

          <section className="alg-card">
            <h2>Assumptions</h2>
            <ul>
              <li>a, b ∈ ℝ</li>
              <li>All expressions are defined.</li>
              {mode === "Induction" && <li>n is a positive integer.</li>}
            </ul>
          </section>

          <section className="alg-card alg-proof-equiv">
            <h2>Equivalence Check</h2>
            <p className={identityHolds ? "ok" : "bad"}>{mode === "Counterexample" ? "Claim is false" : "LHS = RHS"}</p>
            <strong>{mode === "Counterexample" ? `${pretty("(a+b)^2")} ≢ ${pretty("a^2+b^2")}` : `${pretty("(a+b)^2")} ≡ ${pretty("a^2+2*a*b+b^2")}`}</strong>
            <div className="alg-slider-row">
              <label className="alg-field">a<input type="number" value={a} onChange={(event) => patch({ a: Number(event.target.value) || 0 }, false)} /></label>
              <label className="alg-field">b<input type="number" value={b} onChange={(event) => patch({ b: Number(event.target.value) || 0 }, false)} /></label>
            </div>
            <button type="button" className="alg-soft-button" onClick={verifyNumeric}>Verify numerically</button>
            {numeric ? <p role="status">{numeric}</p> : null}
          </section>

          <section className="alg-card">
            <h2>Step Validation</h2>
            <ol className="alg-proof-validate">
              {statuses.map((status, index) => (
                <li key={index} className={status.ok ? "ok" : "bad"}>
                  <b>{index + 1}</b>
                  {status.ok ? <Check /> : <AlertTriangle />}
                  <span>{status.note}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="alg-card">
            <h2>Explanation</h2>
            <p>{explanation}</p>
          </section>
        </aside>
      </div>

      <section className="alg-eq-learn" aria-label="Learning loop">
        <div role="button" tabIndex={0} onClick={() => setFocusTile("ab")}><Eye /><div><b>Observe</b><small>Explore the expression and its visual representation.</small></div></div>
        <div role="button" tabIndex={0} onClick={() => dropReason(selected, "Distributive Property")}><Lightbulb /><div><b>Understand</b><small>Learn the properties and rules used in proofs.</small></div></div>
        <div role="button" tabIndex={0} onClick={verifyNumeric}><HelpCircle /><div><b>Why</b><small>See why each step is valid and necessary.</small></div></div>
        <div>
          <FlaskConical />
          <div>
            <b>Try</b>
            <small>Build your own proof and check your reasoning.</small>
            <button type="button" onClick={() => patch({ draft: "a^2+2*a*b+b^2", template: "Combine like terms" }, false)}>Fill final line</button>
          </div>
        </div>
        <div>
          <Trophy />
          <div>
            <b>Challenge</b>
            <small>Attempt variations and strengthen your skills.</small>
            <button type="button" className="alg-eq-challenge" onClick={() => patch({ challengeOn: true })}>If a={fmt(a)}, b={fmt(b)}, (a+b)² = ?</button>
            {challengeOn && (
              <label className="alg-field">Your answer
                <input value={challengeAnswer} onChange={(event) => patch({ challengeAnswer: event.target.value, challengeChecked: false }, false)} />
                <button type="button" className="alg-gradient-button" onClick={() => patch({ challengeChecked: true }, false)}>Check</button>
                {challengeChecked && <p role="status">{challengeOk ? `Correct: ${fmt(challengeExpected)}.` : `Expand: ${fmt(a * a)} + ${fmt(2 * a * b)} + ${fmt(b * b)}.`}</p>}
              </label>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
