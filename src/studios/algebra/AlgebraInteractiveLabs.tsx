import PolynomialsDashboard from "./PolynomialsDashboard";
import FunctionsDashboard from "./FunctionsDashboard";
import SystemsDashboard from "./SystemsDashboard";
import { useStudioState, useStudioModel } from "../phase1/StudioModelProvider";
import AlgebraLabHeading, { ExactBadge } from "./AlgebraLabHeading";
import { FlaskConical, Lightbulb, Sparkles, Target, Trophy } from "lucide-react";
import { useEffect, useMemo, useState, type DragEvent, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useStudioMode } from "../../hooks/useStudioMode";
import { runCasOperation, type CasOperation } from "../../utils/mathEngine/casUtils";
import { sampleFunction } from "../../utils/mathEngine/graphSampler";
import { exponentLawCounterexample, changeLogBase } from "./algebraEnhancementEngine";
import { recordChallengeResult } from "./algebraStudioProgress";
import {
  answersMatchChallenge,
  combination,
  evaluateAlgebraExpression,
  expressionsEquivalent,
  factorQuadraticFromTiles,
  factorial,
  formatAlgebraNumber,
  geometricSeriesSum,
  geometricInfiniteSum,
  logWithBase,
  nthRoot,
  polynomialCoefficients,
  snapNearZero,
  simplifySquareRadical,
  solveExponentialEquation,
} from "./algebraStudioMath";
import { useAlgebraHistory } from "./useAlgebraHistory";

export const fmt = (n: number) => formatAlgebraNumber(n);
export function Card({ title, children }: { title: string; children: ReactNode }) { return <section className="alg-card"><h2>{title}</h2>{children}</section>; }
export function Numeric({ label, value, onChange, min = -20, max = 20, step = 1, onCommit }: { label: string; value: number; onChange: (n: number) => void; min?: number; max?: number; step?: number; onCommit?: (n: number) => void }) {
  const model = useStudioModel();
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);
  const apply = (raw: string, commit = false) => {
    setDraft(raw);
    if (raw === "" || !Number.isFinite(Number(raw))) return;
    const next = Math.max(min, Math.min(max, Number(raw)));
    onChange(next);
    if (commit) onCommit?.(next);
  };
  return <label className="alg-field">{label}<input type="number" min={min} max={max} step={step} value={draft} onFocus={() => model?.ledger.beginGesture()} onChange={(e) => apply(e.target.value)} onBlur={() => { if (draft === "" || !Number.isFinite(Number(draft))) setDraft(String(value)); else onCommit?.(Number(draft)); model?.ledger.endGesture(); }} /></label>;
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
  domains = [],
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
  domains?: Array<{ min?: number; max?: number; minExclusive?: boolean; maxExclusive?: boolean } | null>;
}) {
  const yScale = equalAspect ? 50 : 11;
  const paths = useMemo(() => expressions.map((expression, index) => {
    const sampled = sampleFunction(expression, -6, 6, 240).points;
    let drawing = false;
    let lastY: number | null = null;
    const line: string[] = [];
    const fill: string[] = [];
    const domain = domains[index];
    sampled.forEach((p) => {
      if (domain) {
        if (typeof domain.min === "number" && (domain.minExclusive ? p.x <= domain.min : p.x < domain.min)) {
          drawing = false;
          lastY = null;
          return;
        }
        if (typeof domain.max === "number" && (domain.maxExclusive ? p.x >= domain.max : p.x > domain.max)) {
          drawing = false;
          lastY = null;
          return;
        }
      }
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
  }), [domains, expressions, shade, yScale]);
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
  const tiles = useAlgebraHistory([1, 1, -2], "AlgebraInteractiveLabs.tsx:ExpressionsLab");
  const [draft, setDraft] = useStudioState("AlgebraInteractiveLabs:ExpressionsLab:draft", "(x-1)*(x+2)");
  const [subX, setSubX] = useStudioState("AlgebraInteractiveLabs:ExpressionsLab:subX", 2);
  const [subY, setSubY] = useStudioState("AlgebraInteractiveLabs:ExpressionsLab:subY", 5);
  const [groups, setGroups] = useStudioState<{ a: number[]; b: number[] }>("AlgebraInteractiveLabs:ExpressionsLab:groups", { a: [], b: [] });
  const [focus, setFocus] = useStudioState("AlgebraInteractiveLabs:ExpressionsLab:focus", "Observe tiles, the area model, and equivalent forms.");
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
    ? `Live grouping: A sums to ${groups.a.reduce((s, n) => s + n, 0)} (x-tiles) and B sums to ${groups.b.reduce((s, n) => s + n, 0)} (units).`
    : "Drop tiles to group factors.";
  const sumA = groups.a.reduce((s, n) => s + n, 0);
  const sumB = groups.b.reduce((s, n) => s + n, 0);
  const areaCols = `${Math.max(0.4, Math.abs(a))}fr ${Math.max(0.4, Math.abs(b) || 1)}fr`;
  const areaRows = `${Math.max(0.4, Math.abs(a))}fr ${Math.max(0.4, Math.abs(c) || 1)}fr`;
  const expandTarget = expandedDraft.ok ? expandedDraft.output : pretty;
  const factorTarget = factored.ok ? factored.output : pretty;
  const challengeSpec = mode === "Expand"
    ? { expected: expandTarget, prompt: `Expand ${draft} and enter an equivalent polynomial.`, hint: expandTarget }
    : mode === "Factor"
      ? { expected: factorTarget, prompt: `Factor ${pretty}. Live grouping sums: A = ${sumA}, B = ${sumB}.`, hint: factorTarget }
      : mode === "Combine Terms"
        ? { expected: pretty, prompt: `Combine like terms and write ${pretty}.`, hint: pretty }
        : { expected: pretty, prompt: `Simplify: write an expression equivalent to ${pretty}.`, hint: pretty };
  const factoredMatch = factored.ok && expressionsEquivalent(expression, factored.output);
  return (
    <div className="alg-page" data-mode-canvas={mode}>
      <AlgebraLabHeading labId="expressions" subtitle="Build, transform, and factor algebraic expressions with interactive tiles and visual models." modes={modes} mode={mode} onMode={setMode} onUndo={tiles.undo} onRedo={tiles.redo} canUndo={tiles.canUndo} canRedo={tiles.canRedo} onReset={() => { tiles.reset([1, 1, -2]); setDraft("(x-1)*(x+2)"); setGroups({ a: [], b: [] }); }} helpTitle={`${mode} help`} helpBody={help.expressions[mode as keyof typeof help.expressions]}>{`Expressions & Algebra Tiles Lab`}</AlgebraLabHeading>
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
          {mode === "Expand" && <button type="button" className="alg-gradient-button" onClick={() => {
            const result = runCasOperation(draft, "expand");
            if (result.ok) {
              const parsed = polynomialCoefficients(result.output);
              if (parsed.ok) {
                const coeffs = parsed.coeffs;
                const nextA = parsed.degree >= 2 ? coeffs[coeffs.length - 3] ?? 0 : 0;
                const nextB = parsed.degree >= 1 ? coeffs[coeffs.length - 2] ?? 0 : 0;
                const nextC = coeffs[coeffs.length - 1] ?? 0;
                tiles.commit([
                  Math.max(-20, Math.min(20, nextA)),
                  Math.max(-20, Math.min(20, nextB)),
                  Math.max(-20, Math.min(20, nextC)),
                ]);
              }
              setFocus(`Expanded: ${result.output}. Coefficients committed to tiles.`);
            } else {
              setFocus(result.output);
            }
          }}>Expand</button>}
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
          <p>{grouped} Factor by grouping uses these live A/B sums to split the linear and constant tiles.</p>
          {!(groups.a.length && groups.b.length) ? <p>Why these trays? Drop a shared factor into each tray so the rectangle can close.</p> : null}
        </Card>
        <Card title="4. Factor rectangle (area model)">
          <div className="alg-area-model" aria-label="Factor rectangle" style={{ gridTemplateColumns: areaCols, gridTemplateRows: areaRows }}>
            <span>x²</span><span>{Math.abs(b) || 1}x</span>
            <span>{b >= 0 ? "+x" : "−x"}</span><span>{c}</span>
          </div>
        </Card>
        <Card title="5. Visual model">
          <div className="alg-area-wrap">
            <small>x</small><small>{b >= 0 ? `+${b}` : b}</small><small>x</small><small>{c >= 0 ? `+${c}` : c}</small>
            <div className="alg-area-model large" aria-label="Area model" style={{ gridTemplateColumns: areaCols, gridTemplateRows: areaRows }}>
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
      <Challenge expected={challengeSpec.expected} prompt={challengeSpec.prompt} hint={challengeSpec.hint} onNew={() => tiles.commit([1, Math.floor(Math.random() * 5) - 2, Math.floor(Math.random() * 7) - 3])} />
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

export function FunctionsLab() { return <FunctionsDashboard />; }

export function PolynomialsLab() { return <PolynomialsDashboard />; }

export function SystemsLab() { return <SystemsDashboard />; }

export function ExponentsLab() {
  const modes = ["Exponent Laws", "Radicals", "Exponential & Logs", "Equations"];
  const [mode, setMode] = useStudioMode("mode", modes, "Exponent Laws");
  const history = useAlgebraHistory({ base: 2, point: 2, n: 2, radicand: 72, target: 64, law: "Product" }, "AlgebraInteractiveLabs.tsx:ExponentsLab");
  const { base, point, n, radicand, target, law } = history.state;
  const [focus, setFocus] = useStudioState("AlgebraInteractiveLabs:ExponentsLab:focus", "Exponential and log are reflections.");
  const valid = base > 0 && base !== 1;
  const laws: Record<string, [number, number, string]> = { Product: [base ** point * base ** n, base ** (point + n), "aᵐ · aⁿ = aᵐ⁺ⁿ"], Quotient: [snapNearZero(base ** n) === 0 ? Number.NaN : base ** point / base ** n, base ** (point - n), "aᵐ / aⁿ = aᵐ⁻ⁿ"], Power: [(base ** point) ** n, base ** (point * n), "(aᵐ)ⁿ = aᵐⁿ"], Negative: [base ** -n, snapNearZero(base ** n) === 0 ? Number.NaN : 1 / base ** n, "a⁻ⁿ = 1/aⁿ"], Zero: [base ** 0, 1, "a⁰ = 1"] };
  const squareForm = n === 2 ? simplifySquareRadical(radicand) : null;
  const radical = nthRoot(radicand, n);
  const exponential = solveExponentialEquation(base, target);
  const logarithm = logWithBase(Math.max(target, Number.MIN_VALUE), base);
  const setLive = (patch: Partial<typeof history.state>) => history.replace({ ...history.state, ...patch });
  return <div className="alg-page alg-dash-page" data-mode-canvas={mode}><AlgebraLabHeading labId="exponents" subtitle="Explore exponent laws, radicals, exponential & logarithmic functions, and their inverse relationship." modes={modes} mode={mode} onMode={setMode} onUndo={history.undo} onRedo={history.redo} canUndo={history.canUndo} canRedo={history.canRedo} onReset={() => history.reset()} helpTitle={`${mode} help`} helpBody="Laws compare both sides numerically. Radicals use the current index n. Equations solve a^x = target and report the matching log.">Exponents Radicals &amp; Logarithms Lab</AlgebraLabHeading><p role="status">{focus}</p><div className="alg-dash-banner" data-lab-mode={mode}><b>y = aˣ and y = log_a x</b><small>Reflections across y = x. Laws keep a common base; radicals rewrite as rational exponents.</small></div><div className="alg-dash-layout alg-exp-layout"><Card title="Base, exponent, and target"><Numeric label="Base a" min={-5} max={5} step={0.1} value={base} onChange={(value) => setLive({ base: value })} onCommit={(value) => history.commit({ ...history.state, base: value })} /><Numeric label="Exponent m" value={point} onChange={(value) => setLive({ point: value })} onCommit={(value) => history.commit({ ...history.state, point: value })} />{(mode === "Exponent Laws" || mode === "Radicals") && <Numeric label={mode === "Radicals" ? "Root index n" : "Exponent n"} value={n} min={mode === "Radicals" ? 1 : -10} onChange={(value) => setLive({ n: value })} onCommit={(value) => history.commit({ ...history.state, n: value })} />}{mode === "Radicals" && <Numeric label="Radicand" min={-100} max={1000} value={radicand} onChange={(value) => setLive({ radicand: value })} onCommit={(value) => history.commit({ ...history.state, radicand: value })} />}{mode === "Equations" && <Numeric label="Target" min={-100} max={1000} value={target} onChange={(value) => setLive({ target: value })} onCommit={(value) => history.commit({ ...history.state, target: value })} />}</Card><Card title={`${mode} model`}>{mode === "Radicals" ? <Result>{radical.ok ? `${fmt(radical.value)}${squareForm?.ok ? ` = ${squareForm.text}` : ""} ; CAS ${runCasOperation(`(${radicand})^(1/${n})`, "simplify").output}` : radical.error}</Result> : mode === "Exponent Laws" ? <><div className="alg-law-grid">{Object.keys(laws).map((name) => <button type="button" aria-pressed={law === name} key={name} onClick={() => history.commit({ ...history.state, law: name })}>{name}</button>)}</div><Result>{laws[law][2]}: {fmt(laws[law][0])} = {fmt(laws[law][1])}</Result><p>{exponentLawCounterexample(base, point, n, "sum").explanation}</p></> : !valid ? <p className="alg-domain-guard">Domain error: exponential and log require a &gt; 0 and a ≠ 1. The graph is not y = 1.</p> : <><Plot expressions={[`${base}^x`, `log(x)/log(${base})`, "x"]} equalAspect verticals={[0]} />{(mode === "Exponential & Logs" || mode === "Equations") && (() => { const changed = changeLogBase(Math.max(target, 0.1), base, 10); return changed ? <p>Change of base: log_{fmt(base)}({target}) = {fmt(changed.inFromBase)} = {fmt(changed.inToBase)} / log_10({fmt(base)}).</p> : <p>Need a&gt;0, a≠1, and a positive argument for logs.</p>; })()}</>}</Card><Card title="Live Algebra & Validation"><Result>{mode === "Equations" ? `${base}^x = ${target}: ${exponential.kind === "one" ? `x = ${fmt(exponential.value)}; log_${fmt(base)}(${target}) = ${fmt(logarithm ?? Number.NaN)}` : exponential.kind === "all" ? "All real values" : "No real solution"}` : mode === "Radicals" ? radical.ok ? `Power check: (${fmt(radical.value)})^${n} ≈ ${fmt(radical.value ** n)}` : radical.error : valid ? `f(${point}) = ${fmt(base ** point)}; log base ${base} of ${fmt(base ** point)} = ${point}` : "Domain error: a ≤ 0 or a = 1 has no logarithmic inverse."}</Result></Card></div><Challenge expected={mode === "Equations" && exponential.kind === "one" ? exponential.value : n} prompt={mode === "Equations" ? `Solve ${base}^x = ${target}.` : `Rewrite the current radical as a rational exponent and enter the index n.`} onNew={() => history.commit({ ...history.state, n: n === 3 ? 2 : 3, target: target === 64 ? 8 : 64 })} /><LabStrip onSelect={(title) => { if (title === "Try") history.commit({ ...history.state, base: base === 2 ? 0.5 : 2 }); setFocus(title === "Challenge" ? "Rewrite a radical as a rational exponent." : title === "Try" ? "Compare bases 2 and 1/2 on the inverse graphs." : title === "Why" ? "Log undoes the exponential." : title === "Understand" ? "Laws keep the same base." : "Exponential and log are reflections."); }} items={[["Observe", "Exponential and log are reflections."], ["Understand", "Laws keep the same base."], ["Why", "Log undoes the exponential."], ["Try", "Solve a^x = target."], ["Challenge", "Rewrite a radical as a rational exponent."]]} /></div>;
}

export function SequencesLab() {
  const modes = ["Arithmetic", "Geometric", "Recursive", "Sigma", "Patterns"];
  const [mode, setMode] = useStudioMode("mode", modes, "Arithmetic");
  const history = useAlgebraHistory({ first: 3, parameter: 4, count: 10, recurrence: "fibonacci" as "fibonacci" | "arithmetic" | "geometric", family: "Arithmetic" as "Arithmetic" | "Geometric" | "Patterns" }, "AlgebraInteractiveLabs.tsx:SequencesLab");
  const { first, parameter, count, recurrence, family } = history.state;
  const [focus, setFocus] = useStudioState("AlgebraInteractiveLabs:SequencesLab:focus", "Terms step by a fixed difference or ratio.");
  const chooseMode = (next: string) => {
    setMode(next);
    if (next === "Arithmetic" || next === "Geometric" || next === "Patterns") {
      history.replace({ ...history.state, family: next });
    }
  };
  const activeFamily = mode === "Sigma" ? family : mode === "Geometric" ? "Geometric" : mode === "Patterns" ? "Patterns" : "Arithmetic";
  const term = (i: number): number => {
    if (mode === "Recursive") {
      if (recurrence === "arithmetic") return first + parameter * i;
      if (recurrence === "geometric") return first * parameter ** i;
      if (i === 0) return first;
      if (i === 1) return parameter;
      let older = first, newer = parameter;
      for (let step = 2; step <= i; step += 1) { const next = older + newer; older = newer; newer = next; }
      return newer;
    }
    if (activeFamily === "Geometric") return first * parameter ** i;
    if (activeFamily === "Patterns") return first + parameter * i * i;
    return first + parameter * i;
  };
  const terms = Array.from({ length: count }, (_, i) => term(i));
  const sum = activeFamily === "Geometric" ? geometricSeriesSum(first, parameter, count) : activeFamily === "Arithmetic" ? count * (first + term(count - 1)) / 2 : terms.reduce((a, b) => a + b, 0);
  const infinite = activeFamily === "Geometric" ? geometricInfiniteSum(first, parameter) : null;
  const setLive = (patch: Partial<typeof history.state>) => history.replace({ ...history.state, ...patch });
  return <div className="alg-page alg-dash-page" data-mode-canvas={mode}><AlgebraLabHeading labId="sequences" subtitle="Explore patterns, formulas, and sums across different types of sequences." modes={modes} mode={mode} onMode={chooseMode} onUndo={history.undo} onRedo={history.redo} canUndo={history.canUndo} canRedo={history.canRedo} onReset={() => history.reset()} helpTitle={`${mode} help`} helpBody="Arithmetic uses a common difference. Geometric uses a common ratio. Recursive can be Fibonacci, repeated add, or geometric aₙ = r·aₙ₋₁. Sigma adds the current family.">Sequences &amp; Progressions Lab</AlgebraLabHeading><p role="status">{focus}</p><div className="alg-dash-banner" data-lab-mode={mode}><b>aₙ closed form · Sₙ partial sums</b><small>Dots plot terms; the table lists n, aₙ, and running totals.</small></div><div className="alg-dash-layout alg-seq-layout"><Card title="Sequence rule"><Numeric label="First term" value={first} onChange={(value) => setLive({ first: value })} onCommit={(value) => history.commit({ ...history.state, first: value })} /><Numeric label={mode === "Geometric" || (mode === "Recursive" && recurrence === "geometric") || (mode === "Sigma" && family === "Geometric") ? "Common ratio" : mode === "Recursive" ? "Second term" : mode === "Patterns" || (mode === "Sigma" && family === "Patterns") ? "Quadratic coefficient" : "Common difference"} value={parameter} min={-10} max={10} onChange={(value) => setLive({ parameter: value })} onCommit={(value) => history.commit({ ...history.state, parameter: value })} /><Numeric label="Number of terms" min={1} max={20} value={count} onChange={(n) => setLive({ count: Math.round(n) })} onCommit={(n) => history.commit({ ...history.state, count: Math.round(n) })} />{mode === "Recursive" && <div className="alg-segmented"><button type="button" className={recurrence === "fibonacci" ? "active" : ""} onClick={() => history.commit({ ...history.state, recurrence: "fibonacci" })}>Fibonacci</button><button type="button" className={recurrence === "arithmetic" ? "active" : ""} onClick={() => history.commit({ ...history.state, recurrence: "arithmetic" })}>Repeated add</button><button type="button" className={recurrence === "geometric" ? "active" : ""} onClick={() => history.commit({ ...history.state, recurrence: "geometric" })}>Geometric</button></div>}{mode === "Sigma" && <div className="alg-segmented">{(["Arithmetic", "Geometric", "Patterns"] as const).map((item) => <button type="button" key={item} className={family === item ? "active" : ""} onClick={() => history.commit({ ...history.state, family: item })}>{item}</button>)}</div>}<Result>{mode === "Recursive" ? (recurrence === "arithmetic" ? `a₁ = ${first}; aₙ = aₙ₋₁ + ${parameter}` : recurrence === "geometric" ? `a₁ = ${first}; aₙ = ${parameter} · aₙ₋₁` : `a₁ = ${first}; a₂ = ${parameter}; aₙ = aₙ₋₁ + aₙ₋₂`) : activeFamily === "Geometric" ? `aₙ = ${first} × ${parameter}^(n−1)` : activeFamily === "Patterns" ? `aₙ = ${first} + ${parameter}(n−1)²` : `aₙ = ${first} + (n−1) × ${parameter}`}{mode === "Sigma" ? ` · Σ uses the ${family} family.` : ""}</Result>{mode === "Patterns" ? <p>n! = {factorial(Math.max(0, Math.round(count))) ?? "undefined"}; C(n,2) = {combination(Math.max(0, Math.round(count)), 2) ?? "undefined"}</p> : null}</Card><Card title={mode === "Sigma" ? "Partial sums" : "Term Table"}><table className="alg-table"><thead><tr><th>n</th><th>aₙ</th><th>Sₙ</th></tr></thead><tbody>{terms.map((value, i) => <tr key={i}><td>{i + 1}</td><td>{fmt(value)}</td><td>{fmt(terms.slice(0, i + 1).reduce((acc, item) => acc + item, 0))}</td></tr>)}</tbody></table><svg viewBox="0 0 600 260" role="img" aria-label="Sequence plot" className="alg-sequence-graph"><polyline points={terms.map((v, i) => { const min = Math.min(0, ...terms); const max = Math.max(1, ...terms); return `${30 + i * 540 / Math.max(1, count - 1)},${230 - 200 * (v - min) / (max - min)}`; }).join(" ")} /><g>{terms.map((v, i) => { const min = Math.min(0, ...terms), max = Math.max(1, ...terms); return <g key={i}><circle cx={30 + i * 540 / Math.max(1, count - 1)} cy={230 - 200 * (v - min) / (max - min)} r="5" /><text x={30 + i * 540 / Math.max(1, count - 1)} y="252">{i + 1}</text></g>; })}</g></svg><Result>Sum: {fmt(sum)}; next term: {fmt(term(count))}{infinite ? `; S∞ ${infinite.ok ? `= ${infinite.text}` : infinite.text}` : ""}</Result>{mode === "Patterns" ? <Link to="/discrete-world/number-patterns">Open Discrete number patterns</Link> : null}</Card><Challenge expected={term(19)} prompt={`What is the 20th term of the live ${mode === "Recursive" ? recurrence : activeFamily.toLowerCase()} sequence?`} onNew={() => history.commit({ ...history.state, first: first === 3 ? 5 : 3 })} /></div><LabStrip onSelect={(title) => setFocus(title === "Challenge" ? "What is the 20th term?" : title === "Try" ? "Change d or r and watch the plot." : title === "Why" ? "Sigma just adds the same rule." : title === "Understand" ? "Closed form names the nth term." : "Terms step by a fixed difference or ratio.")} items={[["Observe", "Terms step by a fixed difference or ratio."], ["Understand", "Closed form names the nth term."], ["Why", "Sigma just adds the same rule."], ["Try", "Change d or r and watch the plot."], ["Challenge", "What is the 20th term?"]]} /></div>;
}

export { default as ProofLab } from "./AlgebraProofLab";

export function CasGateway() {
  const modes = ["Solve", "Simplify", "Factor", "Expand", "Substitute", "Differentiate"];
  const [mode, setMode] = useStudioMode("mode", modes, "Solve");
  const history = useAlgebraHistory({ draft: "2*x^2-8*x-10", x: 2, y: 1, result: "", entries: [] as Array<{ mode: string; input: string; output: string }> }, "AlgebraInteractiveLabs.tsx:CasGateway");
  const { draft, x, y, result, entries } = history.state;
  const [focus, setFocus] = useStudioState("AlgebraInteractiveLabs:CasGateway:focus", "Each operation rewrites the expression.");
  const [candidate, setCandidate] = useStudioState("AlgebraInteractiveLabs:CasGateway:candidate", "");
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
  const casChallenge = (() => {
    const source = draft.split("=")[0] || draft;
    if (mode === "Solve") {
      const solved = runCasOperation(draft.includes("=") ? draft : `${draft}=0`, "solve");
      return { expected: solved.ok ? solved.output : "0", prompt: `Solve ${draft} and enter a root or the CAS solution.` };
    }
    if (mode === "Simplify") {
      const simplified = runCasOperation(source, "simplify");
      return { expected: simplified.ok ? simplified.output : source, prompt: `Simplify ${draft}.` };
    }
    if (mode === "Expand") {
      const expanded = runCasOperation(source, "expand");
      return { expected: expanded.ok ? expanded.output : source, prompt: `Expand ${draft}.` };
    }
    if (mode === "Substitute") {
      const value = evaluateAlgebraExpression(source, { x, y });
      return { expected: value.ok ? value.value : 0, prompt: `Substitute x=${x}, y=${y} into ${draft}.` };
    }
    if (mode === "Differentiate") {
      const derivative = runCasOperation(source, "differentiate");
      return { expected: derivative.ok ? derivative.output : source, prompt: `Differentiate ${draft} with respect to x.` };
    }
    const factored = runCasOperation(source, "factor");
    return { expected: factored.ok ? factored.output : "2*(x-5)*(x+1)", prompt: `Factor ${draft}, or enter an equivalent form.` };
  })();
  return <div className="alg-page alg-dash-page" data-mode-canvas={mode}><AlgebraLabHeading labId="cas" subtitle="Computer Algebra System — step-by-step transformations and verification." modes={modes} mode={mode} onMode={(next) => { setMode(next); history.replace({ ...history.state, result: "" }); }} onUndo={history.undo} onRedo={history.redo} canUndo={history.canUndo} canRedo={history.canRedo} onReset={() => history.reset()} helpTitle={`${mode} help`} helpBody="The CAS never uses eval(). Invalid expressions return an error. History stores each successful or failed compute.">CAS Step Explorer — candidate verification</AlgebraLabHeading><p role="status">{focus}</p><div className="alg-cas-notice"><b>Connected to the existing CAS workspace</b><p>Check candidates against the live graph — not a Wolfram language.</p><Link to="/workspace/data/cas">Open CAS Workspace</Link></div><div className="alg-dash-banner" data-lab-mode={mode}><b>CAS Step Explorer · {mode}</b><small>Each compute rewrites the expression with the same engine as the CAS workspace. Click a history row to restore it.</small></div><div className="alg-dash-layout alg-cas-layout"><Card title="CAS expression"><label className="alg-field">CAS expression<input value={draft} placeholder={mode === "Solve" ? "2x+3=7" : mode === "Differentiate" ? "x^2" : "(x-1)*(x+2)"} onChange={(e) => history.replace({ ...history.state, draft: e.target.value, result: "" })} onKeyDown={(e) => { if (e.key === "Enter") compute(); }} /></label><p>Use * for multiply and ^ for powers. Plotting uses the left of “=” when present.</p>{mode === "Substitute" && <><Numeric label="Substitute x" value={x} onChange={(v) => history.replace({ ...history.state, x: v, result: "" })} /><Numeric label="Substitute y" value={y} onChange={(v) => history.replace({ ...history.state, y: v, result: "" })} /></>}<button type="button" className="alg-gradient-button" disabled={!draft.trim()} onClick={compute}>Compute {mode}</button><label className="alg-field">Candidate to check against the figure<input value={candidate} onChange={(e) => setCandidate(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") setFocus(figureOk ? "Candidate pass." : "Candidate fail."); }} placeholder="2*(x-5)*(x+1)" /></label><p className={residualTone} role="status">{candidate ? (figureOk ? "Candidate matches the figure." : "Not equivalent to the current expression.") : "Enter a candidate to check against the graph."}</p><Link className="alg-soft" to="/algebra/advanced?tool=ALG-25">Open workbench tool 25</Link></Card><Card title={`${mode} result`}><Result>{result || "Enter an expression and compute."}</Result><ol className="alg-cas-steps">{entries.map((entry) => <li key={`${entry.mode}-${entry.input}-${entry.output}`}><button type="button" onClick={() => history.replace({ ...history.state, draft: entry.input, result: entry.output })}>{entry.mode}: {entry.input} → {entry.output}</button></li>)}</ol><button type="button" onClick={() => history.commit({ ...history.state, entries: [], result: "" })}>Clear history</button></Card><Card title="Expression graph"><Plot expressions={[draft.split("=")[0] || "0", ...(candidate.trim() ? [candidate.split("=")[0] ?? candidate] : [])]} dashed={[false, true]} /></Card></div><Challenge expected={casChallenge.expected} prompt={casChallenge.prompt} onNew={() => history.commit({ ...history.state, draft: mode === "Solve" ? "2*x+6=0" : mode === "Differentiate" ? "x^3" : "x^2-5*x+6" })} /><LabStrip onSelect={(title) => { if (title === "Try") { const answer = runCasOperation("2*x^2-8*x-10", "factor"); history.commit({ ...history.state, draft: "2*x^2-8*x-10", result: answer.ok ? answer.output : answer.output }); } setFocus(title === "Challenge" ? "Check a candidate by substituting." : title === "Try" ? "Factor 2x²−8x−10." : title === "Why" ? "Equivalent forms share values." : title === "Understand" ? "CAS applies the same algebra laws." : "Each operation rewrites the expression."); }} items={[["Observe", "Each operation rewrites the expression."], ["Understand", "CAS applies the same algebra laws."], ["Why", "Equivalent forms share values."], ["Try", "Factor 2x²−8x−10."], ["Challenge", "Check a candidate by substituting."]]} /></div>;
}
