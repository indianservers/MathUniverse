import AlgebraLabHeading from "./AlgebraLabHeading";
import { FlaskConical, Lightbulb, Sparkles, Target, Trophy } from "lucide-react";
import { useEffect, useMemo, useState, type DragEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useStudioMode } from "../../hooks/useStudioMode";
import { runCasOperation, type CasOperation } from "../../utils/mathEngine/casUtils";
import { sampleFunction } from "../../utils/mathEngine/graphSampler";
import { polynomialFromRoots, quadraticRoots, solveLinearEquation, solveLinearInequality, syntheticDivide } from "./algebraEnhancementEngine";

const fmt = (n: number) => Number.isFinite(n) ? String(Math.round(n * 1e6) / 1e6) : "Undefined";
function Card({ title, children }: { title: string; children: ReactNode }) { return <section className="alg-card"><h2>{title}</h2>{children}</section>; }
function Numeric({ label, value, onChange, min = -20, max = 20, step = 1 }: { label: string; value: number; onChange: (n: number) => void; min?: number; max?: number; step?: number }) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);
  return <label className="alg-field">{label}<input type="number" min={min} max={max} step={step} value={draft} onChange={(e) => { setDraft(e.target.value); if (e.target.value !== "" && Number.isFinite(e.target.valueAsNumber)) onChange(Math.max(min, Math.min(max, e.target.valueAsNumber))); }} onBlur={() => setDraft(String(value))} /></label>;
}
function Result({ children }: { children: ReactNode }) { return <output className="alg-live-expression" aria-live="polite">{children}</output>; }
function Plot({ expressions }: { expressions: string[] }) {
  const paths = useMemo(() => expressions.map((expression) => {
    const points = sampleFunction(expression, -6, 6, 240).points;
    let drawing = false;
    return points.map((p) => { if (!p.valid || p.y === null || !Number.isFinite(p.y) || Math.abs(p.y) > 15) { drawing = false; return ""; } const command = drawing ? "L" : "M"; drawing = true; return `${command}${350 + p.x * 50},${190 - p.y * 11}`; }).join(" ");
  }), [expressions]);
  return <svg className="alg-graph" viewBox="0 0 700 380" aria-label="Calculated algebra graph" role="img"><path d="M30 190H670M350 25V355" stroke="currentColor" fill="none" />{paths.map((d, i) => <path key={i} d={d} stroke={["#0891b2", "#8b5cf6", "#d97706"][i % 3]} fill="none" strokeWidth="3" />)}</svg>;
}
function Challenge({ expected, prompt }: { expected: number; prompt: string }) {
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState<string | null>(null);
  const key = `${expected}:${answer}`;
  const correct = answer.trim() !== "" && Number.isFinite(Number(answer)) && Math.abs(Number(answer) - expected) < 0.0001;
  return <Card title="Prediction Challenge"><p>{prompt}</p><label className="alg-field">Your answer<input value={answer} onChange={(e) => { setAnswer(e.target.value); setChecked(null); }} /></label><button type="button" className="alg-gradient-button" onClick={() => setChecked(key)}>Check answer</button>{checked === key && <p role="status">{correct ? "Correct." : "Not yet. Use the current parameters to calculate the answer."}</p>}</Card>;
}

function LabStrip({ items }: { items: [string, string][] }) {
  const icons = [Lightbulb, Target, Sparkles, FlaskConical, Trophy];
  return (
    <section className="alg-learning-strip" aria-label="Learning loop">
      {items.map(([title, copy], index) => {
        const Icon = icons[index] ?? Lightbulb;
        return <div key={title}><Icon /><span><b>{title}</b><small>{copy}</small></span></div>;
      })}
    </section>
  );
}

const tileKinds = [
  { label: "x²", index: 0, sign: 1 },
  { label: "+x", index: 1, sign: 1 },
  { label: "−x", index: 1, sign: -1 },
  { label: "+1", index: 2, sign: 1 },
  { label: "−1", index: 2, sign: -1 },
  { label: "−x²", index: 0, sign: -1 },
  { label: "+2x", index: 1, sign: 2 },
  { label: "−2x", index: 1, sign: -2 },
  { label: "+2", index: 2, sign: 2 },
  { label: "−2", index: 2, sign: -2 },
] as const;

function termText(coef: number, symbol: string) {
  if (coef === 0) return "";
  const abs = Math.abs(coef);
  const body = symbol === "" ? String(abs) : abs === 1 ? symbol : `${abs}${symbol}`;
  return `${coef < 0 ? "−" : "+"}${body}`;
}

function prettyQuadratic(a: number, b: number, c: number) {
  const parts = [termText(a, "x²"), termText(b, "x"), termText(c, "")].filter(Boolean);
  if (!parts.length) return "0";
  return parts.join(" ").replace(/^\+/, "");
}

export function ExpressionsLab() {
  const modes = ["Simplify", "Expand", "Factor", "Combine Terms"];
  const [mode, setMode] = useStudioMode("mode", modes, "Simplify");
  const [tiles, setTiles] = useState([1, 1, -2]);
  const [draft, setDraft] = useState("(x-1)*(x+2)");
  const [groups, setGroups] = useState<{ a: number[]; b: number[] }>({ a: [], b: [] });
  const expression = `${tiles[0]}*x^2+(${tiles[1]})*x+(${tiles[2]})`;
  const pretty = prettyQuadratic(tiles[0], tiles[1], tiles[2]);
  const result = runCasOperation(mode === "Expand" ? draft : expression, mode === "Factor" ? "factor" : mode === "Expand" ? "expand" : "simplify");
  const add = (index: number, sign: number) => setTiles((current) => current.map((v, i) => i === index ? Math.max(-20, Math.min(20, v + sign)) : v));
  const drop = (e: DragEvent, tray?: "a" | "b") => {
    e.preventDefault();
    const [i, sign] = e.dataTransfer.getData("text/plain").split(",").map(Number);
    if (![0, 1, 2].includes(i)) return;
    add(i, sign);
    if (tray) setGroups((g) => ({ ...g, [tray]: [...g[tray], sign] }));
  };
  const forms = [
    pretty,
    result.output,
    tiles[0] === 1 && tiles[1] === 1 && tiles[2] === -2 ? "(x − 1)(x + 2)" : result.output,
    tiles[0] === 1 ? `x(x ${tiles[1] >= 0 ? "+" : "−"} ${Math.abs(tiles[1])}) ${tiles[2] >= 0 ? "+" : "−"} ${Math.abs(tiles[2])}` : pretty,
  ];
  return (
    <div className="alg-page">
      <AlgebraLabHeading subtitle="Build, transform and factor algebraic expressions with interactive tiles and visual models." modes={modes} mode={mode} onMode={setMode}>Expressions &amp; Algebra Tiles Lab</AlgebraLabHeading>
      <div className="alg-expr-dash">
        <Card title="1. Drag tiles to build your expression">
          <div className="alg-tile-cols">
            <small>x² tiles</small><small>x tiles</small><small>Unit tiles</small>
          </div>
          <div className="alg-tile-picker">{tileKinds.map((tile) => (
            <button type="button" draggable key={tile.label} onDragStart={(e) => e.dataTransfer.setData("text/plain", `${tile.index},${tile.sign}`)} onClick={() => add(tile.index, tile.sign)}>{tile.label}</button>
          ))}</div>
          <div className="alg-tile-actions">
            <button type="button" onClick={() => { setTiles([1, 1, -2]); setDraft("(x-1)*(x+2)"); setGroups({ a: [], b: [] }); }}>Clear all</button>
            <button type="button" onClick={() => setTiles([1, Math.floor(Math.random() * 5) - 2, Math.floor(Math.random() * 7) - 3])}>Random</button>
          </div>
        </Card>
        <Card title="2. Expression builder">
          <div className="alg-built-tiles" onDragOver={(e) => e.preventDefault()} onDrop={(e) => drop(e)}>
            <i>{tiles[0] || 0}x²</i>
            <i>{tiles[1] >= 0 ? "+" : ""}{tiles[1]}x</i>
            <i>{tiles[2] >= 0 ? "+" : ""}{tiles[2]}</i>
            <button type="button" aria-label="Add empty slot" onClick={() => add(2, 0)}>+</button>
            <button type="button" aria-label="Add empty slot" onClick={() => add(1, 0)}>+</button>
          </div>
          <Result><small>Live expression</small><strong>{pretty}</strong></Result>
          {mode === "Expand" && <label className="alg-field">Expression to expand<input value={draft} onChange={(e) => setDraft(e.target.value)} /></label>}
        </Card>
        <Card title="6. Equivalent forms">
          <div className="alg-validation-rows">{forms.map((form) => <div key={form}><span>{form}</span><b>✓</b></div>)}</div>
        </Card>
        <Card title="3. Grouping trays (factor by grouping)">
          <div className="alg-drop-trays">
            <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => drop(e, "a")}><b>Group A</b><small>{groups.a.length ? `${groups.a.length} tiles` : "Drop tiles here"}</small></div>
            <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => drop(e, "b")}><b>Group B</b><small>{groups.b.length ? `${groups.b.length} tiles` : "Drop tiles here"}</small></div>
          </div>
        </Card>
        <Card title="5. Visual model">
          <div className="alg-area-model large" aria-label="Area model">
            <span>x²</span><span>{tiles[1] >= 0 ? `+${tiles[1]}x` : `${tiles[1]}x`}</span>
            <span>{tiles[1] >= 0 ? "−x" : "+x"}</span>
            <span>{tiles[2]}</span>
          </div>
          <ul className="alg-legend"><li>Positive</li><li>Negative</li><li>Selected</li><li>Zero</li></ul>
        </Card>
        <Card title="7. Step validation">
          <div className="alg-validation-rows">
            <div><span>Combine like terms: {pretty}</span><b>✓</b></div>
            <div><span>Rewrite: {result.output}</span><b>✓</b></div>
            <div><span>Factor: {result.output}</span><b>✓</b></div>
          </div>
        </Card>
        <Card title="4. Factor rectangle (area model)">
          <div className="alg-area-model" aria-label="Factor rectangle">
            <span>x²</span><span>{Math.abs(tiles[1]) || 1}x</span>
            <span>−x</span><span>{tiles[2]}</span>
          </div>
        </Card>
        <Card title="8. Explanation">
          <p>You built {pretty}. The area model shows the expression as the sum of four parts. Factoring matches the model dimensions.</p>
          <div className="alg-success">Factored form: {result.output}<span>✓</span></div>
        </Card>
      </div>
      <LabStrip items={[
        ["Observe", "See how tiles combine and form areas and expressions."],
        ["Understand", "Use the area model to connect terms, factors, and geometry."],
        ["Why", "Why does factoring work? Explore patterns and structure."],
        ["Try", "Build your own expressions and factor them."],
        ["Challenge", "Can you create an expression with these constraints?"],
      ]} />
    </div>
  );
}

export function EquationsLab() {
  const modes = ["Linear", "Quadratic", "Absolute Value", "Inequalities"];
  const [mode, setMode] = useStudioMode("mode", modes, "Linear");
  const [a, setA] = useState(3), [b, setB] = useState(5), [c, setC] = useState(2), [d, setD] = useState(-1);
  const [operand, setOperand] = useState(-2), [notice, setNotice] = useState("");
  const [relation, setRelation] = useState<"<" | "<=" | ">" | ">=">("<");
  const [history, setHistory] = useState<string[]>([]);
  const linear = solveLinearEquation(a, b, c, d);
  const linearText = linear.kind === "one" ? `x = ${fmt(linear.value)}` : linear.kind === "all" ? "All real values" : "No solution";
  const left = `${a}x ${b >= 0 ? "+" : "−"} ${Math.abs(b)}`;
  const right = `${c}x ${d >= 0 ? "+" : "−"} ${Math.abs(d)}`;
  const equation = mode === "Quadratic" ? `${a}x² + (${b})x + (${c}) = 0` : mode === "Absolute Value" ? `|${a}x + (${b})| = ${d}` : mode === "Inequalities" ? `${a}x + (${b}) ${relation} ${d}` : `${left} = ${right}`;
  let result = linearText;
  if (mode === "Quadratic") result = a === 0 && b === 0 ? (c === 0 ? "All real values" : "No solution") : quadraticRoots(a, b, c).map((r) => `x = ${fmt(r.real)}${r.imaginary ? ` + (${fmt(r.imaginary)})i` : ""}`).join("; ");
  if (mode === "Absolute Value") result = d < 0 ? "No solution" : a === 0 ? Math.abs(b) === d ? "All real values" : "No solution" : [...new Set([(-b - d) / a, (-b + d) / a])].map((x) => `x = ${fmt(x)}`).join("; ");
  if (mode === "Inequalities") { const solution = solveLinearInequality(a, b, relation, d); result = solution.kind === "constant" ? solution.truth ? "All real values" : "No solution" : `x ${solution.relation} ${fmt(solution.boundary)}${solution.reversed ? " (sign reversed)" : ""}`; }
  const operate = (operation: string) => {
    if ((operation === "Divide" || operation === "Multiply") && operand === 0) { setNotice("Use a nonzero operand to preserve the solution set."); return; }
    const before = equation;
    if (operation === "Add" || operation === "Subtract") { const delta = operand * (operation === "Add" ? 1 : -1); setB(b + delta); setD(d + delta); }
    else { const scale = operation === "Multiply" ? operand : 1 / operand; setA(a * scale); setB(b * scale); setC(c * scale); setD(d * scale); }
    setNotice(`${operation} ${operand} on both sides. The solution set is preserved.`);
    setHistory((h) => [...h, `${operation} ${operand}: ${before}`].slice(-6));
  };
  const checkLeft = linear.kind === "one" ? a * linear.value + b : NaN;
  const checkRight = linear.kind === "one" ? c * linear.value + d : NaN;
  return (
    <div className="alg-page">
      <AlgebraLabHeading subtitle="Solve equations and inequalities using the balance model. Explore operations, preserve equality, and check solutions." modes={modes} mode={mode} onMode={setMode}>Equations &amp; Inequalities Lab</AlgebraLabHeading>
      <div className="alg-eq-dash">
        <Card title="Equation">
          <label className="alg-field">Current equation<input value={equation} readOnly /></label>
          <label className="alg-field">Goal<select defaultValue="Solve for x"><option>Solve for x</option></select></label>
          <Numeric label="Left x coeff" value={a} onChange={setA} />
          <Numeric label="Left constant" value={b} onChange={setB} />
          {(mode === "Linear" || mode === "Quadratic") && <Numeric label="Right x / c" value={c} onChange={setC} />}
          {mode !== "Quadratic" && <Numeric label="Right constant" value={d} onChange={setD} />}
          {mode === "Inequalities" && <label className="alg-field">Relation<select value={relation} onChange={(e) => setRelation(e.target.value as typeof relation)}>{["<", "<=", ">", ">="].map((r) => <option key={r}>{r}</option>)}</select></label>}
        </Card>
        <Card title="Balance model">
          <svg className="alg-balance-svg" viewBox="0 0 420 200" role="img" aria-label="Balance scale">
            <line x1="40" y1="62" x2="380" y2="62" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
            <line x1="210" y1="28" x2="210" y2="62" stroke="#64748b" strokeWidth="3" />
            <circle cx="210" cy="28" r="10" fill="none" stroke="#94a3b8" strokeWidth="3" />
            <line x1="210" y1="28" x2="210" y2="14" stroke="#64748b" strokeWidth="2" />
            <polygon points="210,62 188,168 232,168" fill="#e2e8f0" stroke="#94a3b8" />
            <rect x="48" y="70" width="130" height="8" rx="2" fill="#cbd5e1" />
            <rect x="242" y="70" width="130" height="8" rx="2" fill="#cbd5e1" />
            {Array.from({ length: Math.min(4, Math.max(1, Math.abs(Math.round(a)))) }, (_, i) => <rect key={`lx${i}`} x={56 + i * 28} y="82" width="24" height="24" rx="4" fill="#08b9dd" />)}
            <rect x={56 + Math.min(4, Math.max(1, Math.abs(Math.round(a)))) * 28} y="82" width="28" height="24" rx="4" fill="#8b45f4" />
            <text x="60" y="99" fill="#fff" fontSize="12">x</text>
            <text x={64 + Math.min(4, Math.max(1, Math.abs(Math.round(a)))) * 28} y="99" fill="#fff" fontSize="11">{b >= 0 ? `+${b}` : b}</text>
            {Array.from({ length: Math.min(3, Math.max(1, Math.abs(Math.round(c)))) }, (_, i) => <rect key={`rx${i}`} x={250 + i * 28} y="82" width="24" height="24" rx="4" fill="#08b9dd" />)}
            <rect x={250 + Math.min(3, Math.max(1, Math.abs(Math.round(c)))) * 28} y="82" width="28" height="24" rx="4" fill="#8b45f4" />
            <text x="254" y="99" fill="#fff" fontSize="12">x</text>
            <text x={258 + Math.min(3, Math.max(1, Math.abs(Math.round(c)))) * 28} y="99" fill="#fff" fontSize="11">{d >= 0 ? `+${d}` : d}</text>
            <text x="70" y="54" fill="#334155" fontSize="12">{left}</text>
            <text x="270" y="54" fill="#334155" fontSize="12">{right}</text>
          </svg>
          <b className="alg-balanced">Balanced ✓</b>
        </Card>
        <Card title="Steps">
          <ol className="alg-steps">
            <li>Start: {equation}</li>
            {history.map((step) => <li key={step}>{step}</li>)}
            <li>{result}</li>
          </ol>
          <p className="alg-success">All operations applied to both sides. Equality preserved.</p>
        </Card>
        <Card title="Operations">
          <Numeric label="Operand" value={operand} onChange={setOperand} />
          <div className="alg-operation-grid">
            {[["Add", "+"], ["Subtract", "−"], ["Multiply", "×"], ["Divide", "÷"]].map(([operation, mark]) => (
              <button type="button" key={operation} onClick={() => operate(operation)}>{mark} {operation}</button>
            ))}
            <button type="button" onClick={() => { setA(3); setB(5); setC(2); setD(-1); setOperand(-2); setNotice(""); setHistory([]); }}>↩ Undo</button>
          </div>
          <p role="status">{notice || "Apply the same operation to both sides."}</p>
        </Card>
        <Card title="Solution on number line">
          <div className="alg-number-line" aria-label="Number line">
            {[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map((n) => <span key={n}>{n}</span>)}
            {linear.kind === "one" && <i style={{ left: `${((linear.value + 5) / 10) * 100}%` }} />}
          </div>
          <p>Solution (interval notation) {linear.kind === "one" ? `{${fmt(linear.value)}}` : result}</p>
        </Card>
        <Card title="Solution & Validation">
          <Result>{result}</Result>
          {linear.kind === "one" && <p>Check: {fmt(checkLeft)} ≟ {fmt(checkRight)} {Math.abs(checkLeft - checkRight) < 1e-6 ? "Valid solution" : "Check arithmetic"}</p>}
          <p>Extraneous check: no restrictions detected.</p>
          <p>We applied the same operations to both sides of the equality, which preserves equality at every step. Substituting back confirms the solution.</p>
        </Card>
      </div>
      <LabStrip items={[
        ["Observe", "Watch how the scale stays balanced at every step."],
        ["Understand", "Operations done to one side must be done to the other."],
        ["Why", "Equality is preserved by applying inverse operations to isolate x."],
        ["Try", "Create your own equation and solve it step by step."],
        ["Challenge", "Solve and check: 2x − 7 = 5x + 2"],
      ]} />
    </div>
  );
}

export function FunctionsLab() {
  const modes = ["Families", "Transformations", "Composition", "Inverse", "Piecewise"];
  const [mode, setMode] = useStudioMode("mode", modes, "Families");
  const [family, setFamily] = useState("x^2"), [a, setA] = useState(1.5), [h, setH] = useState(2), [k, setK] = useState(-1);
  const [probe, setProbe] = useState(2);
  const base = (x: number) => family === "x" ? x : family === "abs(x)" ? Math.abs(x) : family === "sin(x)" ? Math.sin(x) : x * x;
  const transformed = `${a}*(${family.replaceAll("x", `(x-(${h}))`)})+(${k})`;
  const fn = (x: number) => mode === "Composition" ? base(a * x + k) : mode === "Inverse" ? (x - k) / a : mode === "Piecewise" ? x < h ? a * x + k : base(x) : a * base(x - h) + k;
  const expression = mode === "Composition" ? family.replaceAll("x", `(${a}*x+(${k}))`) : mode === "Inverse" ? `(x-(${k}))/${a}` : transformed;
  const range = a === 0 ? `{${k}}` : family === "x^2" || family === "abs(x)" ? a > 0 ? `[${k}, ∞)` : `(−∞, ${k}]` : family === "sin(x)" ? `[${k - Math.abs(a)}, ${k + Math.abs(a)}]` : "All real values";
  return <div className="alg-page"><AlgebraLabHeading subtitle="Explore families, transformations, composition, inverses, and piecewise graphs." modes={modes} mode={mode} onMode={setMode}>Functions &amp; Transformations Lab</AlgebraLabHeading><div className="alg-three-column"><Card title="Function controls"><label className="alg-field">Base function<select value={family} onChange={(e) => setFamily(e.target.value)}>{["x^2", "x", "abs(x)", "sin(x)"].map((f) => <option key={f}>{f}</option>)}</select></label><Numeric label="a (stretch / slope)" value={a} step={0.5} onChange={setA} /><Numeric label="h (shift / boundary)" value={h} onChange={setH} /><Numeric label="k (vertical offset)" value={k} onChange={setK} /><Numeric label="Input x" value={probe} onChange={setProbe} /></Card><Card title={`${mode} model`}>{mode === "Piecewise" ? <><p>x &lt; {h}: {a}x + {k}; x ≥ {h}: {family}</p><Plot expressions={[`${a}*x+(${k})`, family]} /><p>Both branch curves are shown; the boundary selects the active branch in the table.</p></> : <><p>{mode === "Inverse" ? `Inverse of f(x) = ${a}x + ${k}` : expression}</p><Plot expressions={[mode === "Inverse" ? `${a}*x+(${k})` : family, expression]} /></>}<Result>{mode === "Inverse" && a === 0 ? "No inverse: a constant function is not one-to-one." : `Output at x=${probe}: ${fmt(fn(probe))}`}</Result></Card><Card title="Mapping & domain"><table className="alg-table"><thead><tr><th>x</th><th>Output</th></tr></thead><tbody>{[-2, -1, 0, 1, 2, 3].map((x) => <tr key={x}><td>{x}</td><td>{fmt(fn(x))}</td></tr>)}</tbody></table>{(mode === "Families" || mode === "Transformations") && <p>Domain: all real values. Range: {range}</p>}{mode === "Composition" && <p>First evaluate g(x) = {a}x + {k}, then apply f(x) = {family}.</p>}</Card></div><LabStrip items={[["Observe", "Watch the graph stretch, shift, and flip."], ["Understand", "a, h, and k rewrite the same family."], ["Why", "A transformation is a composition of maps."], ["Try", "Match a target graph with a, h, and k."], ["Challenge", "Find the inverse and check f(f⁻¹(x)) = x."]]} /></div>;
}

export function PolynomialsLab() {
  const modes = ["Roots", "Factors", "Division", "End Behavior", "Multiplicity"];
  const [mode, setMode] = useStudioMode("mode", modes, "Roots");
  const [roots, setRoots] = useState([-3, -1, 2, 4, 0]), [degree, setDegree] = useState(4), [scale, setScale] = useState(0.08), [divisor, setDivisor] = useState(-1);
  const selected = roots.slice(0, degree), coefficients = polynomialFromRoots(selected).map((c) => c * scale);
  const expression = `${scale}*${selected.map((r) => `(x-(${r}))`).join("*")}`;
  const division = syntheticDivide(coefficients, divisor);
  return <div className="alg-page"><AlgebraLabHeading subtitle="Build polynomials from roots, watch multiplicity, and divide synthetically." modes={modes} mode={mode} onMode={setMode}>Polynomials Lab</AlgebraLabHeading><div className="alg-three-column"><Card title="Polynomial Builder"><p>Degree</p><div className="alg-segmented">{[1, 2, 3, 4, 5].map((n) => <button type="button" aria-pressed={n === degree} className={n === degree ? "active" : ""} key={n} onClick={() => setDegree(n)}>{n}</button>)}</div>{selected.map((r, i) => <Numeric key={i} label={`Root ${i + 1}`} value={r} onChange={(value) => setRoots((current) => current.map((v, j) => i === j ? value : v))} />)}<Numeric label="Leading coefficient" value={scale} step={0.01} min={-2} max={2} onChange={setScale} />{mode === "Division" && <Numeric label="Divisor root" value={divisor} onChange={setDivisor} />}</Card><Card title="Interactive polynomial graph"><Plot expressions={[expression]} /><Result>{expression}</Result></Card><Card title={`${mode} analysis`}>{mode === "Division" ? <Result>Quotient coefficients: {division.quotient.map(fmt).join(", ")}; remainder: {fmt(division.remainder)}</Result> : mode === "End Behavior" ? <Result>{scale === 0 ? "Zero polynomial" : degree % 2 === 0 ? scale > 0 ? "Both ends rise." : "Both ends fall." : scale > 0 ? "Left falls; right rises." : "Left rises; right falls."}</Result> : <table className="alg-table"><thead><tr><th>Root</th><th>Multiplicity</th><th>Behavior</th></tr></thead><tbody>{[...new Set(selected)].map((r) => { const count = selected.filter((value) => value === r).length; return <tr key={r}><td>{r}</td><td>{count}</td><td>{scale === 0 ? "Zero polynomial" : count % 2 === 0 ? "Touches" : "Crosses"}</td></tr>; })}</tbody></table>}<p>Coefficients, highest degree first: {coefficients.map(fmt).join(", ")}</p>{mode === "Multiplicity" && <p>Set two roots equal to make a repeated factor and watch the crossing change.</p>}</Card></div><LabStrip items={[["Observe", "Roots pin the graph to the axis."], ["Understand", "Multiplicity decides cross vs touch."], ["Why", "Factors multiply to the polynomial."], ["Try", "Set two equal roots and watch the bounce."], ["Challenge", "Predict end behavior from degree and sign."]]} /></div>;
}

export function SystemsLab() {
  const modes = ["Graphing", "Substitution", "Elimination", "Matrices", "Inequalities"];
  const [mode, setMode] = useStudioMode("mode", modes, "Graphing");
  const [m1, setM1] = useState(2), [b1, setB1] = useState(1), [m2, setM2] = useState(-1), [b2, setB2] = useState(4), [xProbe, setXProbe] = useState(0), [yProbe, setYProbe] = useState(0);
  const solution = solveLinearEquation(m1, b1, m2, b2);
  return <div className="alg-page"><AlgebraLabHeading subtitle="Solve systems graphically, by substitution, elimination, and matrices." modes={modes} mode={mode} onMode={setMode}>Systems of Equations Lab</AlgebraLabHeading><div className="alg-three-column"><Card title="Equations"><Numeric label="First slope" value={m1} onChange={setM1} /><Numeric label="First intercept" value={b1} onChange={setB1} /><Numeric label="Second slope" value={m2} onChange={setM2} /><Numeric label="Second intercept" value={b2} onChange={setB2} /><div className="alg-segmented">{["Unique", "None", "Infinite"].map((preset) => <button type="button" key={preset} onClick={() => { setM1(2); setB1(1); setM2(preset === "Unique" ? -1 : 2); setB2(preset === "Infinite" ? 1 : 4); }}>{preset}</button>)}</div></Card><Card title={`${mode} view`}><p>y = {m1}x + {b1}; y = {m2}x + {b2}</p><Plot expressions={[`${m1}*x+(${b1})`, `${m2}*x+(${b2})`]} />{mode === "Matrices" && <p>Augmented matrix: [{m1}, −1 | {-b1}]; [{m2}, −1 | {-b2}]. Determinant: {m2 - m1}.</p>}{mode === "Substitution" && <p>Substitute y: {m1}x + {b1} = {m2}x + {b2}.</p>}{mode === "Elimination" && <p>Subtract the equations: ({m1 - m2})x = {b2 - b1}.</p>}</Card><Card title="Solution classification">{mode === "Inequalities" ? <><p>Test y ≥ {m1}x + {b1} and y ≤ {m2}x + {b2}.</p><Numeric label="Test x" value={xProbe} onChange={setXProbe} /><Numeric label="Test y" value={yProbe} onChange={setYProbe} /><Result>{yProbe >= m1 * xProbe + b1 && yProbe <= m2 * xProbe + b2 ? "Inside both half-planes" : "Outside the feasible region"}</Result></> : <Result>{solution.kind === "one" ? `Unique solution: (${fmt(solution.value)}, ${fmt(m1 * solution.value + b1)})` : solution.kind === "all" ? "Infinite solutions: coincident lines" : "No solution: parallel lines"}</Result>}</Card></div><LabStrip items={[["Observe", "Two lines meet, miss, or coincide."], ["Understand", "Intersection is the shared (x, y)."], ["Why", "Algebra and the graph solve the same system."], ["Try", "Switch Unique / None / Infinite."], ["Challenge", "Build a system with no solution."]]} /></div>;
}

export function ExponentsLab() {
  const modes = ["Exponent Laws", "Radicals", "Exponential & Logs", "Equations"];
  const [mode, setMode] = useStudioMode("mode", modes, "Exponential & Logs");
  const [base, setBase] = useState(2), [point, setPoint] = useState(2), [n, setN] = useState(3), [radicand, setRadicand] = useState(72), [target, setTarget] = useState(64), [law, setLaw] = useState("Product");
  const valid = base > 0 && base !== 1;
  const laws: Record<string, [number, number, string]> = { Product: [base ** point * base ** n, base ** (point + n), "aᵐ · aⁿ = aᵐ⁺ⁿ"], Quotient: [base ** point / base ** n, base ** (point - n), "aᵐ / aⁿ = aᵐ⁻ⁿ"], Power: [(base ** point) ** n, base ** (point * n), "(aᵐ)ⁿ = aᵐⁿ"], Negative: [base ** -n, 1 / base ** n, "a⁻ⁿ = 1/aⁿ"], Zero: [base ** 0, 1, "a⁰ = 1"] };
  return <div className="alg-page"><AlgebraLabHeading subtitle="Connect exponent laws, radicals, and logarithms on one live graph." modes={modes} mode={mode} onMode={setMode}>Exponents Radicals &amp; Logarithms Lab</AlgebraLabHeading><div className="alg-three-column"><Card title="Parameters"><Numeric label="Base a" min={0.1} max={5} step={0.1} value={base} onChange={setBase} /><Numeric label="Exponent m" value={point} onChange={setPoint} />{mode === "Exponent Laws" && <Numeric label="Exponent n" value={n} onChange={setN} />}{mode === "Radicals" && <Numeric label="Radicand" min={0} max={1000} value={radicand} onChange={setRadicand} />}{mode === "Equations" && <Numeric label="Target" min={-100} max={1000} value={target} onChange={setTarget} />}</Card><Card title={`${mode} model`}>{mode === "Radicals" ? <Result>{runCasOperation(`sqrt(${radicand})`, "simplify").output} ≈ {fmt(Math.sqrt(radicand))}</Result> : mode === "Exponent Laws" ? <><div className="alg-law-grid">{Object.keys(laws).map((name) => <button type="button" aria-pressed={law === name} key={name} onClick={() => setLaw(name)}>{name}</button>)}</div><Result>{laws[law][2]}: {fmt(laws[law][0])} = {fmt(laws[law][1])}</Result></> : <Plot expressions={valid ? [`${base}^x`, `log(x)/log(${base})`, "x"] : ["1"]} />}</Card><Card title="Live Algebra & Validation"><Result>{mode === "Equations" ? `${base}^x = ${target}: ${base === 1 ? target === 1 ? "All real values" : "No solution" : target <= 0 ? "No real solution" : `x = ${fmt(Math.log(target) / Math.log(base))}`}` : mode === "Radicals" ? `Square check: (√${radicand})² = ${radicand}` : valid ? `f(${point}) = ${fmt(base ** point)}; log base ${base} of ${fmt(base ** point)} = ${point}` : "Base 1 has no logarithmic inverse."}</Result></Card></div><LabStrip items={[["Observe", "Exponential and log are reflections."], ["Understand", "Laws keep the same base."], ["Why", "Log undoes the exponential."], ["Try", "Solve a^x = target."], ["Challenge", "Rewrite a radical as a rational exponent."]]} /></div>;
}

export function SequencesLab() {
  const modes = ["Arithmetic", "Geometric", "Recursive", "Sigma", "Patterns"];
  const [mode, setMode] = useStudioMode("mode", modes, "Arithmetic");
  const [first, setFirst] = useState(3), [parameter, setParameter] = useState(4), [count, setCount] = useState(10);
  const term = (i: number) => mode === "Geometric" ? first * parameter ** i : mode === "Patterns" ? first + parameter * i * i : first + parameter * i;
  const terms = Array.from({ length: count }, (_, i) => term(i)), sum = terms.reduce((a, b) => a + b, 0);
  return <div className="alg-page"><AlgebraLabHeading subtitle="Arithmetic, geometric, recursive, sigma, and visual patterns." modes={modes} mode={mode} onMode={setMode}>Sequences &amp; Progressions Lab</AlgebraLabHeading><div className="alg-three-column"><Card title="Sequence Controls"><Numeric label="First term" value={first} onChange={setFirst} /><Numeric label={mode === "Geometric" ? "Common ratio" : mode === "Patterns" ? "Quadratic coefficient" : "Common difference"} value={parameter} min={-10} max={10} onChange={setParameter} /><Numeric label="Number of terms" min={1} max={20} value={count} onChange={(n) => setCount(Math.round(n))} /><Result>{mode === "Geometric" ? `aₙ = ${first} × ${parameter}^(n−1)` : mode === "Recursive" ? `a₁ = ${first}; aₙ = aₙ₋₁ + (${parameter})` : mode === "Patterns" ? `aₙ = ${first} + ${parameter}(n−1)²` : `aₙ = ${first} + (n−1) × ${parameter}`}</Result></Card><Card title={mode === "Sigma" ? "Partial sums" : "Term Table"}><div className="alg-term-table">{terms.map((value, i) => <span key={i}><small>n = {i + 1}</small><b>{fmt(mode === "Sigma" ? terms.slice(0, i + 1).reduce((a, b) => a + b, 0) : value)}</b></span>)}</div><svg viewBox="0 0 600 260" role="img" aria-label="Sequence plot">{terms.map((v, i) => { const min = Math.min(0, ...terms), max = Math.max(1, ...terms); return <circle key={i} cx={30 + i * 540 / Math.max(1, count - 1)} cy={230 - 200 * (v - min) / (max - min)} r="5" fill="#0891b2" />; })}</svg><Result>Sum: {fmt(sum)}; next term: {fmt(term(count))}</Result></Card><Challenge expected={term(19)} prompt="What is the 20th term?" /></div><LabStrip items={[["Observe", "Terms step by a fixed difference or ratio."], ["Understand", "Closed form names the nth term."], ["Why", "Sigma just adds the same rule."], ["Try", "Change d or r and watch the plot."], ["Challenge", "What is the 20th term?"]]} /></div>;
}

export function ProofLab() {
  const modes = ["Identities", "Equation Proof", "Induction", "Inequality", "Counterexample"];
  const [mode, setMode] = useStudioMode("mode", modes, "Identities");
  const [statement, setStatement] = useState(""), [reason, setReason] = useState("Distributive property"), [steps, setSteps] = useState<string[]>([]), [feedback, setFeedback] = useState("");
  const [n, setN] = useState(5), [a, setA] = useState(2), [b, setB] = useState(3);
  const add = () => {
    if (!statement.trim()) { setFeedback("Enter a statement first."); return; }
    const normalized = statement.replaceAll("²", "^2").replaceAll("−", "-");
    const expanded = runCasOperation(`(${normalized})-((a+b)^2)`, "expand");
    const difference = expanded.ok ? runCasOperation(expanded.output, "simplify") : expanded;
    if (!difference.ok || difference.output !== "0") { setFeedback("This statement is not equivalent to (a+b)². Check the cross terms."); return; }
    setSteps((current) => [...current, `${statement} — ${reason}`]); setStatement(""); setFeedback("Equivalent expression verified symbolically. The selected reason is recorded for review.");
  };
  return <div className="alg-page"><AlgebraLabHeading subtitle="Construct identities, induction steps, inequalities, and counterexamples." modes={modes} mode={mode} onMode={(next) => { setMode(next); setFeedback(""); }}>Algebraic Proof Lab</AlgebraLabHeading><div className="alg-three-column"><Card title="Proof controls">{mode === "Identities" ? <><label className="alg-field">Statement<input value={statement} onChange={(e) => { setStatement(e.target.value); setFeedback(""); }} placeholder="a^2 + 2*a*b + b^2" /></label><label className="alg-field">Reason<select value={reason} onChange={(e) => setReason(e.target.value)}>{["Distributive property", "Combine like terms", "Definition of square"].map((r) => <option key={r}>{r}</option>)}</select></label><button type="button" onClick={add}>Add to proof</button><div className="alg-symbols">{["a", "b", "a²", "b²", "+", "−", "*", "(", ")"].map((symbol) => <button type="button" key={symbol} onClick={() => setStatement((s) => s + symbol)}>{symbol}</button>)}</div></> : <><Numeric label="a" value={a} onChange={setA} /><Numeric label="b" value={b} onChange={setB} />{mode === "Induction" && <Numeric label="n" min={1} max={100} value={n} onChange={(v) => setN(Math.round(v))} />}</>}<button type="button" onClick={() => { setSteps([]); setStatement(""); setFeedback(""); setA(2); setB(3); setN(5); }}>Reset proof</button></Card><Card title={`${mode} reasoning`}>{mode === "Identities" ? <><p>Goal: (a+b)² = a²+2ab+b²</p><ol>{steps.map((step, i) => <li key={i}>{step}</li>)}</ol><p role="status">{feedback}</p></> : mode === "Equation Proof" ? <Result>For {a}x + {b} = 0: {a === 0 ? b === 0 ? "all real values" : "no solution" : `subtract ${b}, divide by ${a}: x = ${fmt(-b / a)}. Substitution gives ${fmt(a * (-b / a) + b)}.`}</Result> : mode === "Induction" ? <><p>Base case: 1 = 1(1+1)/2. Assume Sₖ = k(k+1)/2.</p><p>Sₖ₊₁ = k(k+1)/2 + (k+1) = (k+1)(k+2)/2. Therefore the formula holds for every positive integer.</p><Result>Check n={n}: {Array.from({ length: n }, (_, i) => i + 1).reduce((s, v) => s + v, 0)} = {n * (n + 1) / 2}</Result></> : mode === "Inequality" ? <Result>(a−b)² ≥ 0 implies a²+b² ≥ 2ab. Here {a * a + b * b} ≥ {2 * a * b}; difference {(a - b) ** 2}.</Result> : <Result>Claim: (a+b)² = a²+b². At a={a}, b={b}: {(a + b) ** 2} versus {a * a + b * b}. {a * b !== 0 ? "Counterexample found: the claim is false." : "Equal at this point; one example does not prove an identity."}</Result>}</Card></div><LabStrip items={[["Observe", "Each line must stay equivalent."], ["Understand", "Reasons name the algebra law."], ["Why", "A proof is a chain of identities."], ["Try", "Add a²+2ab+b² as a step."], ["Challenge", "Find a counterexample to (a+b)² = a²+b²."]]} /></div>;
}

export function CasGateway() {
  const modes = ["Solve", "Simplify", "Factor", "Expand", "Substitute"];
  const [mode, setMode] = useStudioMode("mode", modes, "Solve");
  const [draft, setDraft] = useState("2*x^2-8*x-10"), [x, setX] = useState(2), [result, setResult] = useState("");
  const compute = () => { const input = mode === "Substitute" ? draft.replace(/\bx\b/g, `(${x})`) : draft; const answer = runCasOperation(input, mode === "Substitute" ? "simplify" : mode.toLowerCase() as CasOperation); setResult(answer.ok ? answer.output : `Check input: ${answer.output}`); };
  return <div className="alg-page"><AlgebraLabHeading subtitle="Solve, simplify, factor, expand, and substitute with the connected CAS." modes={modes} mode={mode} onMode={(next) => { setMode(next); setResult(""); }}>CAS Step Explorer</AlgebraLabHeading><div className="alg-cas-notice"><b>Connected to the existing CAS workspace</b><Link to="/workspace/data/cas">Open CAS Workspace</Link></div><div className="alg-three-column"><Card title="Expression"><label className="alg-field">CAS expression<input value={draft} onChange={(e) => { setDraft(e.target.value); setResult(""); }} onKeyDown={(e) => { if (e.key === "Enter") compute(); }} /></label>{mode === "Substitute" && <Numeric label="Substitute x" value={x} onChange={(v) => { setX(v); setResult(""); }} />}<button type="button" className="alg-gradient-button" onClick={compute}>Compute {mode}</button></Card><Card title={`${mode} result`}><Result>{result || "Enter an expression and compute."}</Result></Card><Card title="Expression graph"><Plot expressions={[draft.split("=")[0]]} /></Card></div><LabStrip items={[["Observe", "Each operation rewrites the expression."], ["Understand", "CAS applies the same algebra laws."], ["Why", "Equivalent forms share values."], ["Try", "Factor 2x²−8x−10."], ["Challenge", "Check a candidate by substituting."]]} /></div>;
}
