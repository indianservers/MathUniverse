import AlgebraLabHeading, { ExactBadge } from "./AlgebraLabHeading";
import { FlaskConical, Lightbulb, Sparkles, Target, Trophy } from "lucide-react";
import { useEffect, useMemo, useState, type DragEvent, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useStudioMode } from "../../hooks/useStudioMode";
import { runCasOperation, type CasOperation } from "../../utils/mathEngine/casUtils";
import { sampleFunction } from "../../utils/mathEngine/graphSampler";
import { polynomialFromRoots, syntheticDivide, exponentLawCounterexample, changeLogBase } from "./algebraEnhancementEngine";
import { recordChallengeResult } from "./algebraStudioProgress";
import {
  addPolynomials,
  answersMatchChallenge,
  combination,
  evaluateAlgebraExpression,
  expressionsEquivalent,
  factorQuadraticFromTiles,
  factorial,
  formatAlgebraNumber,
  geometricSeriesSum,
  geometricInfiniteSum,
  inverseExpression,
  inverseFamilyStatus,
  inverseOfTransformedFamily,
  logWithBase,
  multiplyPolynomials,
  dividePolynomialStrings,
  nthRoot,
  polynomialCoefficients,
  reduceMatrix,
  slopeInterceptSystem,
  snapNearZero,
  simplifySquareRadical,
  solveExponentialEquation,
  solveTwoByTwo,
} from "./algebraStudioMath";
import { useAlgebraHistory } from "./useAlgebraHistory";

export const fmt = (n: number) => formatAlgebraNumber(n);
export function Card({ title, children }: { title: string; children: ReactNode }) { return <section className="alg-card"><h2>{title}</h2>{children}</section>; }
export function Numeric({ label, value, onChange, min = -20, max = 20, step = 1, onCommit }: { label: string; value: number; onChange: (n: number) => void; min?: number; max?: number; step?: number; onCommit?: (n: number) => void }) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);
  const apply = (raw: string, commit = false) => {
    setDraft(raw);
    if (raw === "" || !Number.isFinite(Number(raw))) return;
    const next = Math.max(min, Math.min(max, Number(raw)));
    onChange(next);
    if (commit) onCommit?.(next);
  };
  return <label className="alg-field">{label}<input type="number" min={min} max={max} step={step} value={draft} onChange={(e) => apply(e.target.value)} onBlur={() => { if (draft === "" || !Number.isFinite(Number(draft))) setDraft(String(value)); else onCommit?.(Number(draft)); }} /></label>;
}
export function Result({ children }: { children: ReactNode }) { return <output className="alg-live-expression" aria-live="polite">{children}</output>; }
export function Plot({
  expressions,
  shade = [],
  dashed = [],
  handles,
  roots = [],
  onRootChange,
  intersections = [],
  verticals = [],
  traceX,
  onTrace,
  equalAspect = false,
  xLabel = "x",
  yLabel = "y",
  points = [],
  onProbe,
  endBehavior,
}: {
  expressions: string[];
  shade?: Array<"above" | "below" | null>;
  dashed?: boolean[];
  handles?: { h: number; k: number; a: number; onChange: (next: { h?: number; k?: number; a?: number }) => void };
  roots?: number[];
  onRootChange?: (index: number, value: number) => void;
  intersections?: Array<{ x: number; y: number }>;
  verticals?: number[];
  traceX?: number;
  onTrace?: (x: number) => void;
  equalAspect?: boolean;
  xLabel?: string;
  yLabel?: string;
  points?: Array<{ x: number; y: number; label?: string }>;
  onProbe?: (point: { x: number; y: number }) => void;
  endBehavior?: { leftUp: boolean; rightUp: boolean };
}) {
  const yScale = equalAspect ? 50 : 11;
  const paths = useMemo(() => expressions.map((expression, index) => {
    const sampled = sampleFunction(expression, -6, 6, 240).points;
    let drawing = false;
    let lastY: number | null = null;
    const line: string[] = [];
    const fill: string[] = [];
    sampled.forEach((p) => {
      if (!p.valid || p.y === null || !Number.isFinite(p.y) || Math.abs(p.y) > 15 || (lastY !== null && Math.abs(p.y - lastY) > 12)) {
        drawing = false;
        lastY = null;
        return;
      }
      const x = 350 + p.x * 50;
      const y = 190 - p.y * yScale;
      line.push(`${drawing ? "L" : "M"}${x},${y}`);
      const mode = shade[index];
      if (mode) fill.push(`${drawing ? "L" : "M"}${x},${y} L${x},${mode === "above" ? 25 : 355}`);
      drawing = true;
      lastY = p.y;
    });
    return { line: line.join(" "), fill: fill.join(" ") };
  }), [expressions, shade, yScale]);
  const worldFromEvent = (event: PointerEvent<SVGSVGElement>, svg: SVGSVGElement) => {
    const box = svg.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width * 700;
    const y = (event.clientY - box.top) / box.height * 380;
    return { x: (x - 350) / 50, y: (190 - y) / yScale, px: x, py: y };
  };
  return (
    <div className="alg-graph-stack" id="algebra-graph">
    <svg
      className="alg-graph"
      data-studio-graph="1"
      viewBox="0 0 700 380"
      aria-label="Calculated algebra graph"
      role="img"
      tabIndex={0}
      onKeyDown={(event: KeyboardEvent<SVGSVGElement>) => {
        const step = event.shiftKey ? 1 : 0.2;
        if (!handles) return;
        if (event.key === "ArrowLeft") { event.preventDefault(); handles.onChange({ h: Math.max(-5, handles.h - step) }); }
        if (event.key === "ArrowRight") { event.preventDefault(); handles.onChange({ h: Math.min(5, handles.h + step) }); }
        if (event.key === "ArrowUp") { event.preventDefault(); handles.onChange({ k: Math.min(8, handles.k + step) }); }
        if (event.key === "ArrowDown") { event.preventDefault(); handles.onChange({ k: Math.max(-8, handles.k - step) }); }
      }}
      onPointerDown={(event: PointerEvent<SVGSVGElement>) => {
        const world = worldFromEvent(event, event.currentTarget);
        onProbe?.(world);
        if (onTrace) onTrace(Math.max(-6, Math.min(6, world.x)));
        if (onRootChange && roots.length) {
          const nearest = roots.reduce((best, root, index) => Math.abs(root - world.x) < Math.abs((roots[best] ?? 0) - world.x) ? index : best, 0);
          if (Math.abs((roots[nearest] ?? 0) - world.x) < 0.45) onRootChange(nearest, Math.max(-5, Math.min(5, world.x)));
        }
      }}
      onPointerMove={(event: PointerEvent<SVGSVGElement>) => {
        const world = worldFromEvent(event, event.currentTarget);
        if (onTrace && event.buttons !== 0) onTrace(Math.max(-6, Math.min(6, world.x)));
        if (onRootChange && event.buttons !== 0 && roots.length) {
          const nearest = roots.reduce((best, root, index) => Math.abs(root - world.x) < Math.abs((roots[best] ?? 0) - world.x) ? index : best, 0);
          onRootChange(nearest, Math.max(-5, Math.min(5, world.x)));
          return;
        }
        if (!handles || event.buttons === 0) return;
        const hx = 350 + handles.h * 50;
        const ky = 190 - handles.k * yScale;
        if (Math.hypot(world.px - hx, world.py - ky) < 36) handles.onChange({ h: Math.max(-5, Math.min(5, world.x)), k: Math.max(-8, Math.min(8, world.y)) });
        else if (Math.abs(world.px - hx) < 28) handles.onChange({ a: Math.max(-4, Math.min(4, world.y - handles.k)) });
      }}
    >
      {[-6, -4, -2, 0, 2, 4, 6].map((tick) => (
        <g key={tick}>
          <line x1={350 + tick * 50} y1={185} x2={350 + tick * 50} y2={195} stroke="currentColor" />
          <text x={350 + tick * 50} y={212} fontSize="10" textAnchor="middle" fill="currentColor">{tick}</text>
        </g>
      ))}
      <text x="670" y="208" fontSize="11">{xLabel}</text>
      <text x="360" y="22" fontSize="11">{yLabel}</text>
      <path d="M30 190H670M350 25V355" stroke="currentColor" fill="none" />
      {paths.map((d, i) => d.fill ? <path key={`s${i}`} d={d.fill} stroke="none" fill={["#0891b233", "#8b5cf633"][i % 2]} /> : null)}
      {paths.map((d, i) => <path key={i} d={d.line} stroke={["#0891b2", "#8b5cf6", "#d97706"][i % 3]} fill="none" strokeWidth="3" strokeDasharray={dashed[i] ? "8 6" : undefined} />)}
      {verticals.map((x) => <line key={`v${x}`} x1={350 + x * 50} x2={350 + x * 50} y1={25} y2={355} stroke="#d97706" strokeDasharray="5 4" />)}
      {roots.map((root, index) => <circle key={`r${index}`} cx={350 + root * 50} cy={190} r="7" fill="#f59e0b" />)}
      {intersections.map((point, index) => <circle key={`i${index}`} cx={350 + point.x * 50} cy={190 - point.y * yScale} r="7" fill="#ef4444" />)}
      {typeof traceX === "number" ? <line x1={350 + traceX * 50} x2={350 + traceX * 50} y1={25} y2={355} stroke="#10b981" strokeDasharray="3 3" /> : null}
      {points.map((point) => <g key={`${point.x}-${point.y}`}><circle cx={350 + point.x * 50} cy={190 - point.y * yScale} r="5" fill="#0891b2" /><text x={358 + point.x * 50} y={186 - point.y * yScale} fontSize="10">{point.label ?? ""}</text></g>)}
      {endBehavior ? (
        <g fill="#0f766e">
          <polygon points={endBehavior.leftUp ? "36,48 24,72 48,72" : "36,332 24,308 48,308"} />
          <polygon points={endBehavior.rightUp ? "664,48 652,72 676,72" : "664,332 652,308 676,308"} />
        </g>
      ) : null}
      {handles ? (
        <>
          <circle cx={350 + handles.h * 50} cy={190 - handles.k * yScale} r="8" fill="#10b981" />
          <text x={358 + handles.h * 50} y={186 - handles.k * yScale} fontSize="12" fill="#047857">h,k</text>
          <circle cx={350 + handles.h * 50} cy={190 - (handles.a + handles.k) * yScale} r="8" fill="#0891b2" />
          <text x={358 + handles.h * 50} y={186 - (handles.a + handles.k) * yScale} fontSize="12" fill="#0e7490">A</text>
        </>
      ) : null}
    </svg>
    </div>
  );
}
export function Challenge({ expected, prompt, onNew, hint }: { expected: number | string; prompt: string; onNew?: () => void; hint?: string }) {
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [variant, setVariant] = useState(0);
  const [misses, setMisses] = useState(0);
  const correct = answersMatchChallenge(answer, expected) || (typeof expected === "string" && expressionsEquivalent(answer, expected));
  const check = () => {
    setChecked(true);
    if (!correct) setMisses((n) => n + 1);
    recordChallengeResult(correct);
  };
  return <div className="alg-challenge-card"><Card title="Prediction Challenge"><p>{prompt}</p><p className="alg-hint">Press Enter to submit. Equivalent forms are accepted.</p><label className="alg-field">Your answer<input value={answer} onChange={(e) => { setAnswer(e.target.value); setChecked(false); }} onKeyDown={(e) => { if (e.key === "Enter") check(); }} /></label><div className="alg-tile-actions"><button type="button" className="alg-gradient-button" onClick={check}>Check answer</button><button type="button" onClick={() => { setAnswer(""); setChecked(false); setMisses(0); setVariant((n) => n + 1); onNew?.(); }}>New Challenge</button></div>{checked && <p role="status">{correct ? "Correct." : "Not yet. Use the current parameters to calculate the answer."}</p>}{misses >= 2 && hint ? <p>Acceptable idea: {hint}</p> : null}<span className="sr-only">{variant}</span></Card></div>;
}

export function LabStrip({ items, onSelect }: { items: [string, string][]; onSelect?: (title: string) => void }) {
  const icons = [Lightbulb, Target, Sparkles, FlaskConical, Trophy];
  return (
    <section className="alg-learning-strip alg-learn-cards" aria-label="Learning loop">
      {items.map(([title, copy], index) => {
        const Icon = icons[index] ?? Lightbulb;
        return (
          <div key={title} role="button" tabIndex={0} onClick={() => onSelect?.(title)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect?.(title); } }}>
            <Icon /><span><b>{title}</b><small>{copy}</small></span>
          </div>
        );
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

const help = {
  expressions: {
    Simplify: "Drag tiles to build ax²+bx+c. Simplify combines like terms. Equivalent forms are checked with the CAS, not hardcoded examples.",
    Expand: "Type a product such as (x-1)*(x+2). Expand distributes and the area model updates from the resulting coefficients.",
    Factor: "Factoring uses integer binomial search and the CAS. Grouping trays collect tile signs so you can factor by grouping.",
    "Combine Terms": "Each tile changes one coefficient. Zero pairs cancel. The live expression is the combined polynomial.",
  },
  equations: {
    Linear: "Operations always apply to both sides. 0x=0 is all real values; 0x=nonzero has no solution. Auto-balance isolates x.",
    Quadratic: "Solves ax²+bx+c=0, including complex roots. The number line marks real roots only.",
    "Absolute Value": "|ax+b|=c has no solution when c<0. If a=0, it is all reals only when |b|=c.",
    Inequalities: "Multiplying or dividing by a negative flips the inequality. The number line shows the solution ray.",
  },
  functions: {
    Families: "y = a f(x-h)+k. Change a, h, and k to stretch, shift, and reflect the chosen family.",
    Transformations: "The same a, h, k rewrite the parent graph. The machine evaluates the live rule at the probe x.",
    Composition: "First evaluate g(x)=ax+k, then apply the selected family f.",
    Inverse: "Linear maps invert when a≠0. Quadratics invert only on a one-sided domain.",
    Piecewise: "The left branch is ax+k for x<h and the family applies for x≥h. Graphs break at discontinuities.",
  },
};

export function ExpressionsLab() {
  const modes = ["Simplify", "Expand", "Factor", "Combine Terms"];
  const [mode, setMode] = useStudioMode("mode", modes, "Simplify");
  const tiles = useAlgebraHistory([1, 1, -2]);
  const [draft, setDraft] = useState("(x-1)*(x+2)");
  const [subX, setSubX] = useState(2);
  const [subY, setSubY] = useState(5);
  const [groups, setGroups] = useState<{ a: number[]; b: number[] }>({ a: [], b: [] });
  const [focus, setFocus] = useState("Observe tiles, the area model, and equivalent forms.");
  const [a, b, c] = tiles.state;
  const expression = `${a}*x^2+(${b})*x+(${c})`;
  const pretty = prettyQuadratic(a, b, c);
  const expandedDraft = runCasOperation(draft, "expand");
  const simplified = runCasOperation(mode === "Expand" && expandedDraft.ok ? expandedDraft.output : expression, "simplify");
  const factored = factorQuadraticFromTiles(a, b, c);
  const add = (index: number, sign: number) => tiles.commit(tiles.state.map((v, i) => i === index ? Math.max(-20, Math.min(20, v + sign)) : v));
  const drop = (e: DragEvent, tray?: "a" | "b") => {
    e.preventDefault();
    const [i, sign] = e.dataTransfer.getData("text/plain").split(",").map(Number);
    if (![0, 1, 2].includes(i)) return;
    add(i, sign);
    if (tray) setGroups((g) => ({ ...g, [tray]: [...g[tray], sign] }));
  };
  const forms = [pretty, simplified.ok ? simplified.output : pretty, factored.ok ? factored.output : pretty];
  const grouped = groups.a.length || groups.b.length
    ? `${groups.a.reduce((s, n) => s + n, 0)}x from A and ${groups.b.reduce((s, n) => s + n, 0)} units from B`
    : "Drop tiles to group factors.";
  const factoredMatch = factored.ok && expressionsEquivalent(expression, factored.output);
  return (
    <div className="alg-page" data-mode-canvas={mode}>
      <AlgebraLabHeading labId="expressions" subtitle="Build, transform and factor algebraic expressions with interactive tiles and visual models." modes={modes} mode={mode} onMode={setMode} onUndo={tiles.undo} onRedo={tiles.redo} canUndo={tiles.canUndo} canRedo={tiles.canRedo} onReset={() => { tiles.reset([1, 1, -2]); setDraft("(x-1)*(x+2)"); setGroups({ a: [], b: [] }); }} helpTitle={`${mode} help`} helpBody={help.expressions[mode as keyof typeof help.expressions]}>{`Expressions & Algebra Tiles Lab`}</AlgebraLabHeading>
      <p role="status">{focus}</p>
      <div className="alg-expr-dash" id="algebra-lab-main">
        <Card title="1. Drag tiles to build your expression">
          <div className="alg-tile-cols">
            <small>x² tiles</small><small>x tiles</small><small>Unit tiles</small>
          </div>
          <div className="alg-tile-picker">{tileKinds.map((tile) => (
            <button type="button" draggable key={tile.label} onDragStart={(e) => e.dataTransfer.setData("text/plain", `${tile.index},${tile.sign}`)} onClick={() => add(tile.index, tile.sign)}>{tile.label}</button>
          ))}</div>
          <div className="alg-tile-actions">
            <button type="button" onClick={() => { tiles.reset([1, 1, -2]); setDraft("(x-1)*(x+2)"); setGroups({ a: [], b: [] }); }}>Clear all</button>
            <button type="button" onClick={() => {
              const p = 1, r = 1, q = -1, s = 2;
              tiles.commit([p * r, p * s + q * r, q * s]);
              setFocus("Loaded an integer-factorable quadratic.");
            }}>Random factorable</button>
            <button type="button" onClick={() => tiles.commit([1, Math.floor(Math.random() * 5) - 2, Math.floor(Math.random() * 7) - 3])}>Random</button>
            <button type="button" onClick={() => {
              tiles.commit([a, b, c === 0 ? 0 : c > 0 ? c - 1 : c + 1]);
              setFocus("Zero pair cancelled: +1 and −1 leave the board.");
            }}>Cancel a zero pair</button>
          </div>
        </Card>
        <Card title="2. Expression builder">
          <div className="alg-built-tiles" onDragOver={(e) => e.preventDefault()} onDrop={(e) => drop(e)}>
            <i>{a || 0}x²</i>
            <i>{b >= 0 ? "+" : ""}{b}x</i>
            <i>{c >= 0 ? "+" : ""}{c}</i>
            <button type="button" aria-label="Add empty slot" onClick={() => add(2, 1)}>+</button>
            <button type="button" aria-label="Add empty slot" onClick={() => add(1, 1)}>+</button>
          </div>
          <Result><small>Live expression</small><strong>{pretty}</strong><ExactBadge exact={Number.isInteger(a) && Number.isInteger(b) && Number.isInteger(c)} /></Result>
          <p>Before combining: {a}x² and {b}x stay separate. After: {pretty}. Typed cubics such as x^3+x stay in the expression field; tiles cover ax²+bx+c.</p>
          {mode === "Expand" && <label className="alg-field">Expression to expand<input value={draft} onChange={(e) => setDraft(e.target.value)} /></label>}
          {mode === "Simplify" && (
            <>
              <label className="alg-field">Expression<input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="3x+4-x+2" /></label>
              <button type="button" className="alg-gradient-button" onClick={() => {
                const result = runCasOperation(draft, "simplify");
                setFocus(result.ok ? `Simplified: ${result.output}` : result.output);
              }}>Simplify</button>
              <Numeric label="x" value={subX} onChange={setSubX} />
              <Numeric label="y" value={subY} onChange={setSubY} />
              <Result>{(() => { const v = evaluateAlgebraExpression(draft.includes("x") || draft.includes("y") ? draft : pretty, { x: subX, y: subY }); return v.ok ? `Substitute x=${subX}, y=${subY}: ${fmt(v.value)}` : v.error; })()}</Result>
            </>
          )}
          {mode === "Factor" && <button type="button" className="alg-gradient-button" onClick={() => setFocus(factored.ok ? `Factored: ${factored.output}` : "No integer factorization")}>Factor</button>}
          {mode === "Expand" && <button type="button" className="alg-gradient-button" onClick={() => { const result = runCasOperation(draft, "expand"); setFocus(result.ok ? `Expanded: ${result.output}` : result.output); }}>Expand</button>}
        </Card>
        <Card title="3. Grouping trays (factor by grouping)">
          <div className="alg-drop-trays">
            <div tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter") setGroups((g) => ({ ...g, a: [...g.a, 1] })); if (e.key === "Backspace") { e.preventDefault(); setGroups((g) => ({ ...g, a: g.a.slice(0, -1) })); } }} onDragOver={(e) => e.preventDefault()} onDrop={(e) => drop(e, "a")}><b>Group A</b><small>{groups.a.length ? `${groups.a.reduce((s, n) => s + n, 0)} x-tiles` : "Drop tiles here"}</small></div>
            <div tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter") setGroups((g) => ({ ...g, b: [...g.b, 1] })); if (e.key === "Backspace") { e.preventDefault(); setGroups((g) => ({ ...g, b: g.b.slice(0, -1) })); } }} onDragOver={(e) => e.preventDefault()} onDrop={(e) => drop(e, "b")}><b>Group B</b><small>{groups.b.length ? `${groups.b.reduce((s, n) => s + n, 0)} units` : "Drop tiles here"}</small></div>
          </div>
          <div className="alg-tile-actions">
            <button type="button" onClick={() => setGroups((g) => ({ ...g, a: [...g.a, Math.sign(b) || 1] }))}>Send x-tile to A</button>
            <button type="button" onClick={() => setGroups((g) => ({ ...g, b: [...g.b, Math.sign(c) || 1] }))}>Send unit to B</button>
          </div>
          <p>{grouped}</p>
          {!(groups.a.length && groups.b.length) ? <p>Why these trays? Drop a shared factor into each tray so the rectangle can close.</p> : null}
        </Card>
        <Card title="4. Factor rectangle (area model)">
          <div className="alg-area-model" aria-label="Factor rectangle">
            <span>x²</span><span>{Math.abs(b) || 1}x</span>
            <span>{b >= 0 ? "+x" : "−x"}</span><span>{c}</span>
          </div>
        </Card>
        <Card title="5. Visual model">
          <div className="alg-area-wrap">
            <small>x</small><small>{b >= 0 ? `+${b}` : b}</small><small>x</small><small>{c >= 0 ? `+${c}` : c}</small>
            <div className="alg-area-model large" aria-label="Area model">
              <span>x²</span><span>{b >= 0 ? `+${b}x` : `${b}x`}</span>
              <span>{factored.ok ? factored.output : pretty}</span>
              <span>{c}</span>
            </div>
          </div>
          <ul className="alg-legend"><li>Positive</li><li>Negative</li><li>Selected</li><li>Zero</li></ul>
        </Card>
        <Card title="6. Equivalent forms">
          <div className="alg-validation-rows">{forms.map((form) => <div key={form}><span>{form}</span><b>{expressionsEquivalent(form, expression) || expressionsEquivalent(form, draft) ? "✓" : "•"}</b></div>)}</div>
        </Card>
        <Card title="7. Step validation">
          <div className="alg-validation-rows">
            <div><span>Combine like terms: {pretty}</span><b>✓</b></div>
            <div><span>Unlike terms stay unlike: x² does not add to x</span><b>✓</b></div>
            <div><span>Rewrite: {simplified.ok ? simplified.output : "Check the expression."}</span><b>{simplified.ok ? "✓" : "✗"}</b></div>
            <div><span>Factor: {factored.ok ? factored.output : "No integer factorization"}</span><b>{factoredMatch ? "✓" : "•"}</b></div>
          </div>
        </Card>
        <Card title="8. Explanation">
          <p>You built {pretty}. The area model shows the expression as the sum of its terms. Factoring matches the model when the CAS or integer search finds binomials. Garden-plot reading: x² is the square plot, x strips are borders, units are leftover squares.</p>
          <div className="alg-success">Factored form: {factored.ok ? factored.output : "Not factorable over the integers"}<span>{factoredMatch ? "✓" : ""}</span></div>
        </Card>
      </div>
      <Challenge expected={pretty} prompt={`Write an expression equivalent to ${pretty}.`} onNew={() => tiles.commit([1, Math.floor(Math.random() * 5) - 2, Math.floor(Math.random() * 7) - 3])} />
      <LabStrip onSelect={(title) => setFocus(title === "Try" ? "Change tiles or expand a product, then read the equivalent forms." : title === "Challenge" ? `Write a form equivalent to ${pretty}.` : title === "Why" ? "Factoring undoes expansion: the area pieces multiply back to the polynomial." : title === "Understand" ? "Like terms share the same power of x, so their coefficients add." : "Watch coefficients update as tiles are added or cancelled.")} items={[
        ["Observe", "See how tiles combine and form areas and expressions."],
        ["Understand", "Use the area model to connect terms, factors, and geometry."],
        ["Why", "Why does factoring work? Explore patterns and structure."],
        ["Try", "Build your own expressions and factor them."],
        ["Challenge", "Can you create an expression with these constraints?"],
      ]} />
    </div>
  );
}

export function FunctionsLab() {
  const modes = ["Families", "Transformations", "Composition", "Inverse", "Piecewise"];
  const [mode, setMode] = useStudioMode("mode", modes, "Families");
  const history = useAlgebraHistory({ family: "x^2", a: 1.5, h: 2, k: -1, probe: 2, composeFg: true });
  const { family, a, h, k, probe, composeFg } = history.state;
  const [focus, setFocus] = useState("Watch the graph stretch, shift, and flip.");
  const base = (x: number) => {
    if (family === "x") return x;
    if (family === "abs(x)") return Math.abs(x);
    if (family === "sin(x)") return Math.sin(x);
    if (family === "sqrt(x)") return x < 0 ? Number.NaN : Math.sqrt(x);
    if (family === "1/x") return snapNearZero(x) === 0 ? Number.NaN : 1 / x;
    if (family === "1/x^2") return snapNearZero(x) === 0 ? Number.NaN : 1 / (x * x);
    if (family === "log(x)") return x <= 0 ? Number.NaN : Math.log(x) / Math.LN10;
    if (family === "2^x") return 2 ** x;
    return x * x;
  };
  const transformed = `${a}*(${family.replaceAll("x", `(x-(${h}))`)})+(${k})`;
  const inverseStatus = inverseFamilyStatus(family, a);
  const fn = (x: number) => {
    if (mode === "Composition") return composeFg ? base(a * x + k) : a * base(x) + k;
    if (mode === "Inverse") return inverseOfTransformedFamily(family, a, h, k, x);
    if (mode === "Piecewise") return x < h ? a * x + k : x === h ? base(x) : base(x);
    return a * base(x - h) + k;
  };
  const expression = mode === "Composition"
    ? (composeFg ? family.replaceAll("x", `(${a}*x+(${k}))`) : `${a}*(${family})+(${k})`)
    : mode === "Inverse" ? inverseExpression(family, a, h, k)
    : transformed;
  const domain = family === "sqrt(x)" ? `[${fmt(h)}, ∞)` : family === "1/x" || family === "1/x^2" ? `x ≠ ${fmt(h)}` : family === "log(x)" ? `(${fmt(h)}, ∞)` : "all real values";
  const range = a === 0 ? `{${k}}` : family === "x^2" || family === "abs(x)" || family === "sqrt(x)" ? a > 0 ? `[${k}, ∞)` : `(−∞, ${k}]` : family === "sin(x)" ? `[${fmt(k - Math.abs(a))}, ${fmt(k + Math.abs(a))}]` : "All real values";
  const setLive = (patch: Partial<typeof history.state>) => history.replace({ ...history.state, ...patch });
  return <div className="alg-page alg-dash-page" data-mode-canvas={mode}><AlgebraLabHeading labId="functions" subtitle="Explore families, transformations, composition, inverses, and piecewise graphs." modes={modes} mode={mode} onMode={setMode} onUndo={history.undo} onRedo={history.redo} canUndo={history.canUndo} canRedo={history.canRedo} onReset={() => history.reset()} helpTitle={`${mode} help`} helpBody={help.functions[mode as keyof typeof help.functions]}>Functions &amp; Transformations Lab</AlgebraLabHeading><p role="status">{focus}</p><div className="alg-dash-banner" data-lab-mode={mode}><b>y = a · f(x − h) + k</b><small>Parent in dashed cyan, transformed in solid violet. Domain: {domain}. Range: {range}.</small></div><div className="alg-dash-layout alg-fn-layout"><Card title="Transform parameters a, h, k"><label className="alg-field">Base function<select value={family} onChange={(e) => history.commit({ ...history.state, family: e.target.value })}>{["x", "x^2", "sqrt(x)", "abs(x)", "1/x", "1/x^2", "2^x", "log(x)", "sin(x)"].map((f) => <option key={f}>{f}</option>)}</select></label><Numeric label="a (stretch / slope)" value={a} step={0.5} onChange={(value) => setLive({ a: value })} onCommit={(value) => history.commit({ ...history.state, a: value })} /><Numeric label="h (shift / boundary)" value={h} onChange={(value) => setLive({ h: value })} onCommit={(value) => history.commit({ ...history.state, h: value })} /><Numeric label="k (vertical offset)" value={k} onChange={(value) => setLive({ k: value })} onCommit={(value) => history.commit({ ...history.state, k: value })} /><Numeric label="Input x" value={probe} onChange={(value) => setLive({ probe: value })} />{mode === "Composition" && <div className="alg-segmented"><button type="button" aria-pressed={composeFg} className={composeFg ? "active" : ""} onClick={() => history.commit({ ...history.state, composeFg: true })}>f∘g</button><button type="button" aria-pressed={!composeFg} className={!composeFg ? "active" : ""} onClick={() => history.commit({ ...history.state, composeFg: false })}>g∘f</button></div>}{mode === "Transformations" && <p>1. Shift {h >= 0 ? `right ${h}` : `left ${fmt(-h)}`}. 2. {a < 0 ? "Reflect across the x-axis and " : ""}stretch vertically ×{fmt(Math.abs(a))}. 3. Shift {k >= 0 ? `up ${fmt(k)}` : `down ${fmt(-k)}`}.</p>}<div className="alg-machine" aria-label="Function machine"><span>x = {probe}</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h12M13 7l7 5-7 5" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg><em>f</em><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h12M13 7l7 5-7 5" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg><b>{fmt(fn(probe))}</b></div></Card><Card title="Parent vs transformed graph">{mode === "Piecewise" ? <><p>x &lt; {h}: {a}x + {k}; x ≥ {h}: {family} (closed at x = {h})</p><Plot expressions={[`${a}*x+(${k})`, family]} /><p>Both branch curves are shown; the table uses the closed right branch at the boundary.</p></> : <><p>{mode === "Inverse" ? (inverseStatus.invertible ? expression : inverseStatus.note) : expression}</p><Plot expressions={mode === "Inverse" ? (inverseStatus.invertible && a !== 0 ? [transformed, expression, "x"] : [transformed, "x"]) : [family, expression]} equalAspect={mode === "Inverse"} handles={(mode === "Transformations" || mode === "Families") ? { a, h, k, onChange: (next) => setLive({ a: next.a ?? a, h: next.h ?? h, k: next.k ?? k }) } : undefined} verticals={(family === "1/x" || family === "1/x^2" || family === "log(x)") ? [h] : []} /></>}<Result>{mode === "Inverse" ? (inverseStatus.invertible ? `f⁻¹(${probe}) = ${fmt(fn(probe))}. ${inverseStatus.note}` : inverseStatus.note) : `Output at x=${probe}: ${fmt(fn(probe))}`}</Result></Card><Card title="Mapping & domain"><table className="alg-table"><thead><tr><th>x</th><th>Output</th></tr></thead><tbody>{[-2, -1, 0, 1, 2, 3].map((x) => <tr key={x}><td>{x}</td><td>{Number.isFinite(fn(x)) ? fmt(fn(x)) : "undefined"}</td></tr>)}</tbody></table>{a === 0 ? <p className="alg-domain-guard">a = 0 is a constant map; inverse is disabled.</p> : null}<p>Probe steps: x → x−h = {fmt(probe - h)} → f → ×a → +k.</p>{(mode === "Families" || mode === "Transformations") && <p>Domain: {domain}. Range: {range}</p>}{mode === "Composition" && <p>{composeFg ? `f(g(x)): first g(x)=${a}x+${k}, then f(x)=${family}.` : `g(f(x)): first f(x)=${family}, then g(t)=${a}t+${k}.`}</p>}{mode === "Inverse" && <p>{inverseStatus.note || "The graph shows f, f⁻¹, and y = x."}</p>}</Card></div><Challenge expected={fn(probe)} prompt={`What is the current output at x = ${probe}?`} onNew={() => history.commit({ ...history.state, probe: probe === 2 ? 0 : 2 })} /><LabStrip onSelect={(title) => { if (title === "Try") history.commit({ ...history.state, a: 2, h: 3, k: 1, family: "x^2" }); setFocus(title === "Challenge" ? "Find the inverse and check f(f⁻¹(x)) = x." : title === "Try" ? "Loaded g(x)=2(x-3)²+1." : title === "Why" ? "A transformation is a composition of maps." : title === "Understand" ? "a, h, and k rewrite the same family." : "Watch the graph stretch, shift, and flip."); }} items={[["Observe", "Watch the graph stretch, shift, and flip."], ["Understand", "a, h, and k rewrite the same family."], ["Why", "A transformation is a composition of maps."], ["Try", "Match a target graph with a, h, and k."], ["Challenge", "Find the inverse and check f(f⁻¹(x)) = x."]]} /></div>;
}

export function PolynomialsLab() {
  const modes = ["Roots", "Factors", "Division", "End Behavior", "Multiplicity"];
  const [mode, setMode] = useStudioMode("mode", modes, "Roots");
  const history = useAlgebraHistory({ roots: [-3, -1, 2, 4, 0], degree: 4, scale: 0.08, divisor: -1, extra: "x-1" });
  const { roots, degree, scale, divisor, extra } = history.state;
  const [focus, setFocus] = useState("Roots pin the graph to the axis.");
  const selected = roots.slice(0, degree);
  const coefficients = polynomialFromRoots(selected).map((c) => c * scale);
  const expression = `${scale}*${selected.map((r) => `(x-(${r}))`).join("*")}`;
  const parsedExtra = polynomialCoefficients(extra);
  const typedPlot = parsedExtra.ok && parsedExtra.degree >= 2;
  const plotExpression = typedPlot ? extra : expression;
  const division = syntheticDivide(coefficients, divisor);
  const extraDivision = dividePolynomialStrings(expression, extra);
  const solvedTyped = typedPlot ? runCasOperation(`${extra}=0`, "solve") : null;
  const setLive = (patch: Partial<typeof history.state>) => history.replace({ ...history.state, ...patch });
  return <div className="alg-page alg-dash-page" data-mode-canvas={mode}><AlgebraLabHeading labId="polynomials" subtitle="Build polynomials from roots, watch multiplicity, and divide synthetically." modes={modes} mode={mode} onMode={setMode} onUndo={history.undo} onRedo={history.redo} canUndo={history.canUndo} canRedo={history.canRedo} onReset={() => history.reset()} helpTitle={`${mode} help`} helpBody="Roots determine factors. Multiplicity decides whether the graph crosses or touches. Synthetic division uses the current divisor root.">Polynomials Lab</AlgebraLabHeading><p role="status">{focus}</p><div className="alg-dash-banner" data-lab-mode={mode}><b>p(x) = {plotExpression}</b><small>Drag roots to pin intercepts. Even multiplicity touches; odd multiplicity crosses.</small></div><div className="alg-dash-layout alg-poly-layout"><Card title="Root &amp; degree builder"><p>Degree</p><div className="alg-segmented">{[1, 2, 3, 4, 5].map((n) => <button type="button" aria-pressed={n === degree} className={n === degree ? "active" : ""} key={n} onClick={() => history.commit({ ...history.state, degree: n })}>{n}</button>)}</div>{selected.map((r, i) => <Numeric key={i} label={`Root ${i + 1}`} value={r} onChange={(value) => setLive({ roots: roots.map((v, j) => i === j ? value : v) })} onCommit={(value) => history.commit({ ...history.state, roots: roots.map((v, j) => i === j ? value : v) })} />)}<Numeric label="Leading coefficient" value={scale} step={0.01} min={-2} max={2} onChange={(value) => setLive({ scale: value })} onCommit={(value) => history.commit({ ...history.state, scale: value })} />{mode === "Division" && <Numeric label="Divisor root" value={divisor} onChange={(value) => setLive({ divisor: value })} onCommit={(value) => history.commit({ ...history.state, divisor: value })} />}<label className="alg-field">Polynomial<input value={extra} onChange={(e) => setLive({ extra: e.target.value })} onBlur={() => { const parsed = polynomialCoefficients(extra); if (parsed.ok) { history.commit({ ...history.state, extra }); setFocus(`Degree ${parsed.degree}, leading ${fmt(parsed.leading)}, constant ${fmt(parsed.constant)}.`); } }} placeholder="x^3-4x^2+x+6" /></label></Card><Card title="Interactive polynomial graph"><Plot expressions={[plotExpression]} roots={selected} onRootChange={(index, value) => setLive({ roots: roots.map((v, j) => index === j ? value : v) })} endBehavior={scale === 0 ? undefined : { leftUp: degree % 2 === 0 ? scale > 0 : scale < 0, rightUp: scale > 0 }} /><Result>{plotExpression}</Result></Card><Card title={`${mode} analysis`}>{mode === "Division" ? <Result>Quotient coefficients: {division.quotient.map(fmt).join(", ")}; remainder: {fmt(division.remainder)}. Remainder theorem: p({divisor}) should match the remainder. {extra} into the builder: {extraDivision.ok ? extraDivision.output : extraDivision.output}</Result> : mode === "End Behavior" ? <Result>{scale === 0 ? "Zero polynomial" : degree % 2 === 0 ? scale > 0 ? "Both ends rise." : "Both ends fall." : scale > 0 ? "Left falls; right rises." : "Left rises; right falls."}</Result> : mode === "Factors" ? <Result>{expression}</Result> : <table className="alg-table"><thead><tr><th>Root</th><th>Multiplicity</th><th>Behavior</th></tr></thead><tbody>{[...new Set(selected)].map((r) => { const count = selected.filter((value) => value === r).length; return <tr key={r}><td>{r}</td><td>{count}</td><td>{scale === 0 ? "Zero polynomial" : count % 2 === 0 ? "Touches" : "Crosses"}</td></tr>; })}</tbody></table>}<p>Coefficients, highest degree first: {coefficients.map(fmt).join(", ")}</p>
          {typedPlot && solvedTyped && <p>Typed polynomial roots: {solvedTyped.output} <Link to="/complex-numbers">Complex roots on the Argand plane</Link></p>}
          {mode === "Factors" && <p>Times (x−1): {multiplyPolynomials(coefficients, [1, -1]).map(fmt).join(", ")}. Minus that polynomial: {addPolynomials(coefficients, multiplyPolynomials(polynomialFromRoots([1]), [-1])).map(fmt).join(", ")}. Plus x: {addPolynomials(coefficients, [1, 0]).map(fmt).join(", ")}.</p>}
          {mode === "Multiplicity" && <p>Set two roots equal to make a repeated factor and watch the crossing change.</p>}</Card></div><Challenge expected={degree % 2 === 0 ? 1 : -1} prompt="Enter 1 if both ends go the same direction for an even degree, or -1 for opposite ends." onNew={() => history.commit({ ...history.state, degree: degree === 4 ? 3 : 4 })} /><LabStrip onSelect={(title) => { if (title === "Try") history.commit({ ...history.state, roots: [-1, -1, 2, 4, 0], degree: 3 }); setFocus(title === "Challenge" ? "Predict end behavior from degree and sign." : title === "Try" ? "Set two equal roots and watch the bounce." : title === "Why" ? "Factors multiply to the polynomial." : title === "Understand" ? "Multiplicity decides cross vs touch." : "Roots pin the graph to the axis."); }} items={[["Observe", "Roots pin the graph to the axis."], ["Understand", "Multiplicity decides cross vs touch."], ["Why", "Factors multiply to the polynomial."], ["Try", "Set two equal roots and watch the bounce."], ["Challenge", "Predict end behavior from degree and sign."]]} /></div>;
}

export function SystemsLab() {
  const modes = ["Graphing", "Substitution", "Elimination", "Matrices", "Inequalities"];
  const [mode, setMode] = useStudioMode("mode", modes, "Graphing");
  const history = useAlgebraHistory({ m1: 2, b1: 1, m2: -1, b2: 4, xProbe: 0, yProbe: 0 });
  const { m1, b1, m2, b2, xProbe, yProbe } = history.state;
  const [focus, setFocus] = useState("Two lines meet, miss, or coincide.");
  const [matrix, setMatrix] = useState([[m1, -1, -b1], [m2, -1, -b2]]);
  useEffect(() => { setMatrix([[m1, -1, -b1], [m2, -1, -b2]]); }, [m1, b1, m2, b2]);
  const solution = slopeInterceptSystem(m1, b1, m2, b2);
  const setLive = (patch: Partial<typeof history.state>) => history.replace({ ...history.state, ...patch });
  const preset = (kind: "Unique" | "None" | "Infinite") => history.commit({ ...history.state, m1: 2, b1: 1, m2: kind === "Unique" ? -1 : 2, b2: kind === "Infinite" ? 1 : 4 });
  const swapRows = () => setMatrix(([r1, r2]) => [r2 ?? r1 ?? [0, 0, 0], r1 ?? r2 ?? [0, 0, 0]]);
  const scaleRow1 = () => setMatrix((rows) => rows.map((row, i) => i === 0 ? row.map((v) => v * 2) : row));
  const addRows = () => setMatrix((rows) => rows.map((row, i) => i === 1 ? row.map((v, j) => v + (rows[0]?.[j] ?? 0)) : row));
  const reduced = reduceMatrix(matrix);
  return <div className="alg-page alg-dash-page" data-mode-canvas={mode}><AlgebraLabHeading labId="systems" subtitle="Solve systems graphically, by substitution, elimination, and matrices." modes={modes} mode={mode} onMode={setMode} onUndo={history.undo} onRedo={history.redo} canUndo={history.canUndo} canRedo={history.canRedo} onReset={() => history.reset()} helpTitle={`${mode} help`} helpBody="Unique, none, and infinite are classified from the same 2×2 system. Matrices show the RREF of the augmented matrix. Inequalities test and shade half-planes.">Systems of Equations Lab</AlgebraLabHeading><p role="status">{focus}</p><div className="alg-dash-banner" data-lab-mode={mode}><b>y = {m1}x + {b1}  ·  y = {m2}x + {b2}</b><small>General form: {m1}x + (−1)y = { -b1 } and {m2}x + (−1)y = { -b2 }. Unique, none, or infinite — from slopes and from RREF.</small></div><div className="alg-dash-layout alg-sys-layout"><Card title="Linear system"><Numeric label="First slope" value={m1} onChange={(value) => setLive({ m1: value })} onCommit={(value) => history.commit({ ...history.state, m1: value })} /><Numeric label="First intercept" value={b1} onChange={(value) => setLive({ b1: value })} onCommit={(value) => history.commit({ ...history.state, b1: value })} /><Numeric label="Second slope" value={m2} onChange={(value) => setLive({ m2: value })} onCommit={(value) => history.commit({ ...history.state, m2: value })} /><Numeric label="Second intercept" value={b2} onChange={(value) => setLive({ b2: value })} onCommit={(value) => history.commit({ ...history.state, b2: value })} /><div className="alg-segmented">{(["Unique", "None", "Infinite"] as const).map((item) => <button type="button" key={item} onClick={() => preset(item)}>{item}</button>)}</div>{mode === "Matrices" && <div className="alg-tile-actions"><button type="button" onClick={swapRows}>Swap rows</button><button type="button" onClick={scaleRow1}>Scale row 1 ×2</button><button type="button" onClick={addRows}>Add row 1 to row 2</button></div>}</Card><Card title="Intersection graph"><p>y = {m1}x + {b1}; y = {m2}x + {b2}</p><Plot expressions={[`${m1}*x+(${b1})`, `${m2}*x+(${b2})`]} shade={mode === "Inequalities" ? ["above", "below"] : []} dashed={mode === "Inequalities" ? [false, true] : []} intersections={solution.kind === "one" ? [{ x: solution.x, y: solution.y }] : []} onProbe={(point) => setLive({ xProbe: point.x, yProbe: point.y })} />{mode === "Matrices" && <><p>Augmented table. RREF shown as rows. {solution.kind === "one" ? `Unique (${fmt(solution.x)}, ${fmt(solution.y)})` : solution.kind === "all" ? "Infinite solutions" : "No solution"}</p><table className="alg-table"><tbody>{matrix.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{fmt(cell)}</td>)}</tr>)}</tbody></table></>}{mode === "Substitution" && <p>y = {m1}x + {b1} into the second: {m1}x + {b1} = {m2}x + {b2} ⇒ {(fmt(m1 - m2))}x = {fmt(b2 - b1)} ⇒ {solution.kind === "one" ? `x = ${fmt(solution.x)}, y = ${fmt(solution.y)}` : solution.kind === "all" ? "identity (infinite solutions)" : "contradiction (no solution)"}.</p>}{mode === "Elimination" && <p>Write {m1}x − y = {-b1} and {m2}x − y = {-b2}. Subtract: ({fmt(m1 - m2)})x = {fmt(b2 - b1)}. {solution.kind === "one" ? `x = ${fmt(solution.x)}, then y = ${fmt(solution.y)}.` : solution.kind === "all" ? "Rows are dependent." : "Rows are inconsistent."}</p>}</Card><Card title="Unique / none / infinite">{mode === "Inequalities" ? <><p>Test y ≥ {m1}x + {b1} and y &lt; {m2}x + {b2} (solid first boundary, dashed second).</p><Numeric label="Test x" value={xProbe} onChange={(value) => setLive({ xProbe: value })} /><Numeric label="Test y" value={yProbe} onChange={(value) => setLive({ yProbe: value })} /><Result>{yProbe >= m1 * xProbe + b1 && yProbe < m2 * xProbe + b2 ? "Inside both half-planes" : "Outside the feasible region"}</Result></> : <Result>{solution.kind === "one" ? `Unique solution: (${fmt(solution.x)}, ${fmt(solution.y)}). Residual L1 ${fmt(solution.y - (m1 * solution.x + b1))}, L2 ${fmt(solution.y - (m2 * solution.x + b2))}.` : solution.kind === "all" ? "Infinite solutions: coincident lines (dependent rows)." : "No solution: parallel lines (inconsistent rows)."}</Result>}<Link className="alg-soft" to="/linear-algebra/matrices?mode=Inverse">Open Linear Algebra row-reduction</Link></Card></div><Challenge expected={solution.kind === "one" ? solution.x : 0} prompt="If the system has a unique solution, enter its x-value. Enter 0 if there is no unique x." onNew={() => preset(solution.kind === "one" ? "None" : "Unique")} /><LabStrip onSelect={(title) => { if (title === "Try") preset("None"); setFocus(title === "Challenge" ? "Build a system with no solution." : title === "Why" ? "Algebra and the graph solve the same system." : title === "Understand" ? "Intersection is the shared (x, y)." : "Two lines meet, miss, or coincide."); }} items={[["Observe", "Two lines meet, miss, or coincide."], ["Understand", "Intersection is the shared (x, y)."], ["Why", "Algebra and the graph solve the same system."], ["Try", "Switch Unique / None / Infinite."], ["Challenge", "Build a system with no solution."]]} /></div>;
}

export function ExponentsLab() {
  const modes = ["Exponent Laws", "Radicals", "Exponential & Logs", "Equations"];
  const [mode, setMode] = useStudioMode("mode", modes, "Exponent Laws");
  const history = useAlgebraHistory({ base: 2, point: 2, n: 2, radicand: 72, target: 64, law: "Product" });
  const { base, point, n, radicand, target, law } = history.state;
  const [focus, setFocus] = useState("Exponential and log are reflections.");
  const valid = base > 0 && base !== 1;
  const laws: Record<string, [number, number, string]> = { Product: [base ** point * base ** n, base ** (point + n), "aᵐ · aⁿ = aᵐ⁺ⁿ"], Quotient: [snapNearZero(base ** n) === 0 ? Number.NaN : base ** point / base ** n, base ** (point - n), "aᵐ / aⁿ = aᵐ⁻ⁿ"], Power: [(base ** point) ** n, base ** (point * n), "(aᵐ)ⁿ = aᵐⁿ"], Negative: [base ** -n, snapNearZero(base ** n) === 0 ? Number.NaN : 1 / base ** n, "a⁻ⁿ = 1/aⁿ"], Zero: [base ** 0, 1, "a⁰ = 1"] };
  const squareForm = n === 2 ? simplifySquareRadical(radicand) : null;
  const radical = nthRoot(radicand, n);
  const exponential = solveExponentialEquation(base, target);
  const logarithm = logWithBase(Math.max(target, Number.MIN_VALUE), base);
  const setLive = (patch: Partial<typeof history.state>) => history.replace({ ...history.state, ...patch });
  return <div className="alg-page alg-dash-page" data-mode-canvas={mode}><AlgebraLabHeading labId="exponents" subtitle="Connect exponent laws, radicals, and logarithms on one live graph." modes={modes} mode={mode} onMode={setMode} onUndo={history.undo} onRedo={history.redo} canUndo={history.canUndo} canRedo={history.canRedo} onReset={() => history.reset()} helpTitle={`${mode} help`} helpBody="Laws compare both sides numerically. Radicals use the current index n. Equations solve a^x = target and report the matching log.">Exponents Radicals &amp; Logarithms Lab</AlgebraLabHeading><p role="status">{focus}</p><div className="alg-dash-banner" data-lab-mode={mode}><b>y = aˣ and y = log_a x</b><small>Reflections across y = x. Laws keep a common base; radicals rewrite as rational exponents.</small></div><div className="alg-dash-layout alg-exp-layout"><Card title="Base, exponent, and target"><Numeric label="Base a" min={0.1} max={5} step={0.1} value={base} onChange={(value) => setLive({ base: value })} onCommit={(value) => history.commit({ ...history.state, base: value })} /><Numeric label="Exponent m" value={point} onChange={(value) => setLive({ point: value })} onCommit={(value) => history.commit({ ...history.state, point: value })} />{(mode === "Exponent Laws" || mode === "Radicals") && <Numeric label={mode === "Radicals" ? "Root index n" : "Exponent n"} value={n} min={mode === "Radicals" ? 1 : -10} onChange={(value) => setLive({ n: value })} onCommit={(value) => history.commit({ ...history.state, n: value })} />}{mode === "Radicals" && <Numeric label="Radicand" min={-100} max={1000} value={radicand} onChange={(value) => setLive({ radicand: value })} onCommit={(value) => history.commit({ ...history.state, radicand: value })} />}{mode === "Equations" && <Numeric label="Target" min={-100} max={1000} value={target} onChange={(value) => setLive({ target: value })} onCommit={(value) => history.commit({ ...history.state, target: value })} />}</Card><Card title={`${mode} model`}>{mode === "Radicals" ? <Result>{radical.ok ? `${fmt(radical.value)}${squareForm?.ok ? ` = ${squareForm.text}` : ""} ; CAS ${runCasOperation(`(${radicand})^(1/${n})`, "simplify").output}` : radical.error}</Result> : mode === "Exponent Laws" ? <><div className="alg-law-grid">{Object.keys(laws).map((name) => <button type="button" aria-pressed={law === name} key={name} onClick={() => history.commit({ ...history.state, law: name })}>{name}</button>)}</div><Result>{laws[law][2]}: {fmt(laws[law][0])} = {fmt(laws[law][1])}</Result><p>{exponentLawCounterexample(base, point, n, "sum").explanation}</p>{(() => { const changed = changeLogBase(Math.max(target, 0.1), base, 10); return changed ? <p>Change of base: log_{fmt(base)}({target}) = {fmt(changed.inFromBase)} = {fmt(changed.inToBase)} / log_10({fmt(base)}).</p> : <p>Need a&gt;0, a≠1, and a positive argument for logs.</p>; })()}</> : <Plot expressions={valid ? [`${base}^x`, `log(x)/log(${base})`, "x"] : ["1"]} equalAspect verticals={valid ? [0] : []} />}</Card><Card title="Live Algebra & Validation"><Result>{mode === "Equations" ? `${base}^x = ${target}: ${exponential.kind === "one" ? `x = ${fmt(exponential.value)}; log_${fmt(base)}(${target}) = ${fmt(logarithm ?? Number.NaN)}` : exponential.kind === "all" ? "All real values" : "No real solution"}` : mode === "Radicals" ? radical.ok ? `Power check: (${fmt(radical.value)})^${n} ≈ ${fmt(radical.value ** n)}` : radical.error : valid ? `f(${point}) = ${fmt(base ** point)}; log base ${base} of ${fmt(base ** point)} = ${point}` : "Base 1 has no logarithmic inverse."}</Result></Card></div><Challenge expected={mode === "Equations" && exponential.kind === "one" ? exponential.value : n} prompt={mode === "Equations" ? `Solve ${base}^x = ${target}.` : `Rewrite the current radical as a rational exponent and enter the index n.`} onNew={() => history.commit({ ...history.state, n: n === 3 ? 2 : 3, target: target === 64 ? 8 : 64 })} /><LabStrip onSelect={(title) => { if (title === "Try") history.commit({ ...history.state, base: base === 2 ? 0.5 : 2 }); setFocus(title === "Challenge" ? "Rewrite a radical as a rational exponent." : title === "Try" ? "Compare bases 2 and 1/2 on the inverse graphs." : title === "Why" ? "Log undoes the exponential." : title === "Understand" ? "Laws keep the same base." : "Exponential and log are reflections."); }} items={[["Observe", "Exponential and log are reflections."], ["Understand", "Laws keep the same base."], ["Why", "Log undoes the exponential."], ["Try", "Solve a^x = target."], ["Challenge", "Rewrite a radical as a rational exponent."]]} /></div>;
}

export function SequencesLab() {
  const modes = ["Arithmetic", "Geometric", "Recursive", "Sigma", "Patterns"];
  const [mode, setMode] = useStudioMode("mode", modes, "Arithmetic");
  const history = useAlgebraHistory({ first: 3, parameter: 4, count: 10, recurrence: "fibonacci" as "fibonacci" | "arithmetic" });
  const { first, parameter, count, recurrence } = history.state;
  const [focus, setFocus] = useState("Terms step by a fixed difference or ratio.");
  const term = (i: number): number => {
    if (mode === "Geometric") return first * parameter ** i;
    if (mode === "Patterns") return first + parameter * i * i;
    if (mode === "Recursive") {
      if (recurrence === "arithmetic") return first + parameter * i;
      if (i === 0) return first;
      if (i === 1) return parameter;
      let older = first, newer = parameter;
      for (let step = 2; step <= i; step += 1) { const next = older + newer; older = newer; newer = next; }
      return newer;
    }
    return first + parameter * i;
  };
  const terms = Array.from({ length: count }, (_, i) => term(i));
  const sum = mode === "Geometric" ? geometricSeriesSum(first, parameter, count) : mode === "Arithmetic" || mode === "Sigma" ? count * (first + term(count - 1)) / 2 : terms.reduce((a, b) => a + b, 0);
  const infinite = mode === "Geometric" ? geometricInfiniteSum(first, parameter) : null;
  const setLive = (patch: Partial<typeof history.state>) => history.replace({ ...history.state, ...patch });
  return <div className="alg-page alg-dash-page" data-mode-canvas={mode}><AlgebraLabHeading labId="sequences" subtitle="Arithmetic, geometric, recursive, sigma, and visual patterns." modes={modes} mode={mode} onMode={setMode} onUndo={history.undo} onRedo={history.redo} canUndo={history.canUndo} canRedo={history.canRedo} onReset={() => history.reset()} helpTitle={`${mode} help`} helpBody="Arithmetic uses a common difference. Geometric uses a common ratio. Recursive here is Fibonacci-like: a1, a2, then each term is the sum of the previous two. Sigma adds the displayed family.">Sequences &amp; Progressions Lab</AlgebraLabHeading><p role="status">{focus}</p><div className="alg-dash-banner" data-lab-mode={mode}><b>aₙ closed form · Sₙ partial sums</b><small>Dots plot terms; the table lists n, aₙ, and running totals.</small></div><div className="alg-dash-layout alg-seq-layout"><Card title="Sequence rule"><Numeric label="First term" value={first} onChange={(value) => setLive({ first: value })} onCommit={(value) => history.commit({ ...history.state, first: value })} /><Numeric label={mode === "Geometric" ? "Common ratio" : mode === "Recursive" ? "Second term" : mode === "Patterns" ? "Quadratic coefficient" : "Common difference"} value={parameter} min={-10} max={10} onChange={(value) => setLive({ parameter: value })} onCommit={(value) => history.commit({ ...history.state, parameter: value })} /><Numeric label="Number of terms" min={1} max={20} value={count} onChange={(n) => setLive({ count: Math.round(n) })} onCommit={(n) => history.commit({ ...history.state, count: Math.round(n) })} />{mode === "Recursive" && <div className="alg-segmented"><button type="button" className={recurrence === "fibonacci" ? "active" : ""} onClick={() => history.commit({ ...history.state, recurrence: "fibonacci" })}>Fibonacci</button><button type="button" className={recurrence === "arithmetic" ? "active" : ""} onClick={() => history.commit({ ...history.state, recurrence: "arithmetic" })}>Repeated add</button></div>}<Result>{mode === "Geometric" ? `aₙ = ${first} × ${parameter}^(n−1)` : mode === "Recursive" ? (recurrence === "arithmetic" ? `a₁ = ${first}; aₙ = aₙ₋₁ + ${parameter}` : `a₁ = ${first}; a₂ = ${parameter}; aₙ = aₙ₋₁ + aₙ₋₂`) : mode === "Patterns" ? `aₙ = ${first} + ${parameter}(n−1)²` : `aₙ = ${first} + (n−1) × ${parameter}`}</Result>{mode === "Patterns" ? <p>n! = {factorial(Math.max(0, Math.round(count))) ?? "undefined"}; C(n,2) = {combination(Math.max(0, Math.round(count)), 2) ?? "undefined"}</p> : null}</Card><Card title={mode === "Sigma" ? "Partial sums" : "Term Table"}><table className="alg-table"><thead><tr><th>n</th><th>aₙ</th><th>Sₙ</th></tr></thead><tbody>{terms.map((value, i) => <tr key={i}><td>{i + 1}</td><td>{fmt(value)}</td><td>{fmt(terms.slice(0, i + 1).reduce((acc, item) => acc + item, 0))}</td></tr>)}</tbody></table><svg viewBox="0 0 600 260" role="img" aria-label="Sequence plot" className="alg-sequence-graph"><polyline points={terms.map((v, i) => { const min = Math.min(0, ...terms); const max = Math.max(1, ...terms); return `${30 + i * 540 / Math.max(1, count - 1)},${230 - 200 * (v - min) / (max - min)}`; }).join(" ")} /><g>{terms.map((v, i) => { const min = Math.min(0, ...terms), max = Math.max(1, ...terms); return <g key={i}><circle cx={30 + i * 540 / Math.max(1, count - 1)} cy={230 - 200 * (v - min) / (max - min)} r="5" /><text x={30 + i * 540 / Math.max(1, count - 1)} y="252">{i + 1}</text></g>; })}</g></svg><Result>Sum: {fmt(sum)}; next term: {fmt(term(count))}{infinite ? `; S∞ ${infinite.ok ? `= ${infinite.text}` : infinite.text}` : ""}</Result>{mode === "Patterns" ? <Link to="/discrete-world/number-patterns">Open Discrete number patterns</Link> : null}</Card><Challenge expected={term(19)} prompt="What is the 20th term?" onNew={() => history.commit({ ...history.state, first: first === 3 ? 5 : 3 })} /></div><LabStrip onSelect={(title) => setFocus(title === "Challenge" ? "What is the 20th term?" : title === "Try" ? "Change d or r and watch the plot." : title === "Why" ? "Sigma just adds the same rule." : title === "Understand" ? "Closed form names the nth term." : "Terms step by a fixed difference or ratio.")} items={[["Observe", "Terms step by a fixed difference or ratio."], ["Understand", "Closed form names the nth term."], ["Why", "Sigma just adds the same rule."], ["Try", "Change d or r and watch the plot."], ["Challenge", "What is the 20th term?"]]} /></div>;
}

export { default as ProofLab } from "./AlgebraProofLab";

export function CasGateway() {
  const modes = ["Solve", "Simplify", "Factor", "Expand", "Substitute", "Differentiate"];
  const [mode, setMode] = useStudioMode("mode", modes, "Solve");
  const history = useAlgebraHistory({ draft: "2*x^2-8*x-10", x: 2, y: 1, result: "", entries: [] as Array<{ mode: string; input: string; output: string }> });
  const { draft, x, y, result, entries } = history.state;
  const [focus, setFocus] = useState("Each operation rewrites the expression.");
  const [candidate, setCandidate] = useState("");
  const residual = (value: number) => {
    const left = draft.split("=")[0] ?? draft;
    const evaluated = evaluateAlgebraExpression(left, { x: value, y });
    return evaluated.ok ? evaluated.value : Number.NaN;
  };
  const figureOk = candidate.trim() !== "" && (
    mode === "Solve"
      ? Number.isFinite(Number(candidate)) && Math.abs(residual(Number(candidate))) <= 1e-6
      : expressionsEquivalent(draft.split("=")[0] || draft, candidate) || (result ? expressionsEquivalent(result, candidate) : false)
  );
  const residualTone = !candidate.trim() || mode !== "Solve" || !Number.isFinite(Number(candidate)) ? "" : Math.abs(residual(Number(candidate))) <= 1e-6 ? "is-pass" : Math.abs(residual(Number(candidate))) < 0.2 ? "is-near" : "is-fail";
  const compute = () => {
    if (!draft.trim()) return;
    const substituted = mode === "Substitute" ? evaluateAlgebraExpression(draft, { x, y }) : null;
    const answer = mode === "Substitute"
      ? substituted && substituted.ok ? { ok: true as const, output: formatAlgebraNumber(substituted.value) } : { ok: false as const, output: substituted?.error ?? "Invalid expression." }
      : runCasOperation(draft, (mode === "Differentiate" ? "differentiate" : mode.toLowerCase()) as CasOperation);
    const output = answer.ok ? answer.output : `Check input near “${draft.slice(0, 24)}”: ${answer.output}`;
    history.commit({ ...history.state, result: output, entries: [...entries, { mode, input: draft, output }].slice(-8) });
  };
  return <div className="alg-page alg-dash-page" data-mode-canvas={mode}><AlgebraLabHeading labId="cas" subtitle="Check a candidate against the live expression and graph — not a Wolfram language. Solve, simplify, factor, expand, substitute, and differentiate with the connected CAS." modes={modes} mode={mode} onMode={(next) => { setMode(next); history.replace({ ...history.state, result: "" }); }} onUndo={history.undo} onRedo={history.redo} canUndo={history.canUndo} canRedo={history.canRedo} onReset={() => history.reset()} helpTitle={`${mode} help`} helpBody="The CAS never uses eval(). Invalid expressions return an error. History stores each successful or failed compute.">Candidate checker</AlgebraLabHeading><p role="status">{focus}</p><div className="alg-cas-notice"><b>Connected to the existing CAS workspace</b><Link to="/workspace/data/cas">Open CAS Workspace</Link></div><div className="alg-dash-banner" data-lab-mode={mode}><b>CAS Step Explorer · {mode}</b><small>Each compute rewrites the expression with the same engine as the CAS workspace. Click a history row to restore it.</small></div><div className="alg-dash-layout alg-cas-layout"><Card title="CAS expression"><label className="alg-field">CAS expression<input value={draft} placeholder={mode === "Solve" ? "2x+3=7" : mode === "Differentiate" ? "x^2" : "(x-1)*(x+2)"} onChange={(e) => history.replace({ ...history.state, draft: e.target.value, result: "" })} onKeyDown={(e) => { if (e.key === "Enter") compute(); }} /></label><p>Use * for multiply and ^ for powers. Plotting uses the left of “=” when present.</p>{mode === "Substitute" && <><Numeric label="Substitute x" value={x} onChange={(v) => history.replace({ ...history.state, x: v, result: "" })} /><Numeric label="Substitute y" value={y} onChange={(v) => history.replace({ ...history.state, y: v, result: "" })} /></>}<button type="button" className="alg-gradient-button" disabled={!draft.trim()} onClick={compute}>Compute {mode}</button><label className="alg-field">Candidate to check against the figure<input value={candidate} onChange={(e) => setCandidate(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") setFocus(figureOk ? "Candidate pass." : "Candidate fail."); }} placeholder="2*(x-5)*(x+1)" /></label><p className={residualTone} role="status">{candidate ? (figureOk ? "Candidate matches the figure." : "Not equivalent to the current expression.") : "Enter a candidate to check against the graph."}</p><Link className="alg-soft" to="/algebra/advanced?tool=ALG-25">Open workbench tool 25</Link></Card><Card title={`${mode} result`}><Result>{result || "Enter an expression and compute."}</Result><ol className="alg-cas-steps">{entries.map((entry) => <li key={`${entry.mode}-${entry.input}-${entry.output}`}><button type="button" onClick={() => history.replace({ ...history.state, draft: entry.input, result: entry.output })}>{entry.mode}: {entry.input} → {entry.output}</button></li>)}</ol><button type="button" onClick={() => history.commit({ ...history.state, entries: [], result: "" })}>Clear history</button></Card><Card title="Expression graph"><Plot expressions={[draft.split("=")[0] || "0", ...(candidate.trim() ? [candidate.split("=")[0] ?? candidate] : [])]} dashed={[false, true]} /></Card></div><Challenge expected="2*(x-5)*(x+1)" prompt="Factor 2x²−8x−10, or enter an equivalent factored form." onNew={() => history.commit({ ...history.state, draft: "x^2-5*x+6" })} /><LabStrip onSelect={(title) => { if (title === "Try") { const answer = runCasOperation("2*x^2-8*x-10", "factor"); history.commit({ ...history.state, draft: "2*x^2-8*x-10", result: answer.ok ? answer.output : answer.output }); } setFocus(title === "Challenge" ? "Check a candidate by substituting." : title === "Try" ? "Factor 2x²−8x−10." : title === "Why" ? "Equivalent forms share values." : title === "Understand" ? "CAS applies the same algebra laws." : "Each operation rewrites the expression."); }} items={[["Observe", "Each operation rewrites the expression."], ["Understand", "CAS applies the same algebra laws."], ["Why", "Equivalent forms share values."], ["Try", "Factor 2x²−8x−10."], ["Challenge", "Check a candidate by substituting."]]} /></div>;
}
