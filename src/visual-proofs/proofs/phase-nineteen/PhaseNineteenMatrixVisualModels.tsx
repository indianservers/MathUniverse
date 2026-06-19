import type { ReactNode } from "react";
import { DraggableHandle } from "../../components/DraggableHandle";
import type { PhaseTwoToggles, PhaseTwoValues } from "../../components/PhaseTwoProofExperience";

type VisualState = {
  values: PhaseTwoValues;
  toggles: PhaseTwoToggles;
  activeStep: number;
  activeHighlight: string | null;
  onHighlight: (token: string | null) => void;
  onValueChange: (id: string, value: number) => void;
};

type Vec = { x: number; y: number };
type Matrix = { a: number; b: number; c: number; d: number };

const colors = { a: "#38bdf8", b: "#f97316", c: "#a855f7", ok: "#22c55e", warn: "#fde68a", red: "#fb7185", muted: "#334155" };

export function MatrixAdditionVisual({ values, toggles, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const a = matrixA(values);
  const b = matrixB(values);
  const row = Math.round(values.row);
  const col = Math.round(values.col);
  const selected = row * 2 + col;
  const result = a.map((item, index) => item + b[index]);
  return (
    <Frame label="Matrix addition as cell-by-cell addition">
      <MatrixGrid title="A" values={a} x={70} y={140} selected={selected} active={activeHighlight === "A-ij"} onHighlight={() => onHighlight("A-ij")} />
      <Text x={240} y={210} text="+" />
      <MatrixGrid title="B" values={b} x={285} y={140} selected={selected} active={activeHighlight === "B-ij"} onHighlight={() => onHighlight("B-ij")} />
      <Text x={455} y={210} text="=" />
      <MatrixGrid title="A+B" values={result} x={500} y={140} selected={selected} active={activeHighlight === "A-plus-B-ij"} onHighlight={() => onHighlight("A-plus-B-ij")} />
      <DraggableHandle label="Adjust selected A entry" position={{ x: 110 + a[selected] * 10, y: 430 }} axis="x" bounds={{ x: [60, 190] }} onChange={(point) => onValueChange(`a${selected + 1}`, Math.round((point.x - 110) / 10))} />
      {toggles.labels ? <Info x={655} y={145} lines={[`dimensions = 2 x 2`, `selected row = ${row + 1}`, `selected column = ${col + 1}`, `A_ij = ${a[selected]}`, `B_ij = ${b[selected]}`, `result entry = ${result[selected]}`]} /> : null}
    </Frame>
  );
}

export function MatrixMultiplicationVisual({ values, toggles }: VisualState) {
  const a = matrixA(values);
  const b = matrixB(values);
  const row = Math.round(values.row);
  const col = Math.round(values.col);
  const rowVector = [a[row * 2], a[row * 2 + 1]];
  const columnVector = [b[col], b[col + 2]];
  const products = rowVector.map((item, index) => item * columnVector[index]);
  const result = products[0] + products[1];
  return (
    <Frame label="Matrix multiplication row-column dot product">
      <MatrixGrid title="A" values={a} x={65} y={135} selectedRow={row} />
      <Text x={235} y={205} text="x" />
      <MatrixGrid title="B" values={b} x={275} y={135} selectedCol={col} />
      <Text x={445} y={205} text="->" />
      <MatrixGrid title="AB" values={multiply2(a, b)} x={500} y={135} selected={row * 2 + col} />
      <Text x={92} y={390} text={`row ${row + 1}: [${rowVector.join(", ")}]`} small />
      <Text x={300} y={390} text={`column ${col + 1}: [${columnVector.join(", ")}]`} small />
      <Text x={92} y={430} text={`dot product = ${products.join(" + ")} = ${result}`} small />
      {toggles.labels ? <Info x={650} y={145} lines={[`selected i,j = ${row + 1},${col + 1}`, `row vector = ${rowVector.join(", ")}`, `column vector = ${columnVector.join(", ")}`, `pairwise products = ${products.join(", ")}`, `dot product sum = ${result}`]} /> : null}
    </Frame>
  );
}

export function LinearTransformationVisual({ values, toggles, onValueChange }: VisualState) {
  const m = liveMatrix(values);
  const v = { x: values.vx, y: values.vy };
  const av = transform(m, v);
  return (
    <Frame label="Matrix as linear transformation">
      <TransformGrid matrix={m} />
      <Vector from={origin} to={pointFromVec({ x: 1, y: 0 })} color={colors.a} label="i" />
      <Vector from={origin} to={pointFromVec({ x: 0, y: 1 })} color={colors.b} label="j" />
      <Vector from={origin} to={pointFromVec({ x: m.a, y: m.c })} color={colors.ok} label="A i" />
      <Vector from={origin} to={pointFromVec({ x: m.b, y: m.d })} color={colors.warn} label="A j" />
      <Vector from={origin} to={pointFromVec(v)} color={colors.red} label="v" />
      <Vector from={origin} to={pointFromVec(av)} color={colors.c} label="Av" />
      <DraggableHandle label="Drag input vector" position={pointFromVec(v)} bounds={{ x: [90, 470], y: [110, 430] }} onChange={(point) => onValueChange("vx", vecFromPoint(point).x)} />
      {toggles.labels ? <Info x={585} y={130} lines={[`A = [[${m.a}, ${m.b}], [${m.c}, ${m.d}]]`, `v = (${fmt(v.x)}, ${fmt(v.y)})`, `Av = (${fmt(av.x)}, ${fmt(av.y)})`, `A i = (${m.a}, ${m.c})`, `A j = (${m.b}, ${m.d})`, `det = ${fmt(det(m))}`]} /> : null}
    </Frame>
  );
}

export function DeterminantAreaVisual({ values, toggles }: VisualState) {
  const m = liveMatrix(values);
  const p1 = pointFromVec({ x: m.a, y: m.c });
  const p2 = pointFromVec({ x: m.b, y: m.d });
  const p3 = pointFromVec({ x: m.a + m.b, y: m.c + m.d });
  const determinant = det(m);
  return (
    <Frame label="Determinant as area scale factor">
      <Grid />
      <polygon points={`${origin.x},${origin.y} ${p1.x},${p1.y} ${p3.x},${p3.y} ${p2.x},${p2.y}`} fill={determinant < 0 ? colors.red : colors.c} opacity="0.45" stroke={colors.warn} strokeWidth="4" />
      <Vector from={origin} to={p1} color={colors.ok} label="col 1" />
      <Vector from={origin} to={p2} color={colors.a} label="col 2" />
      {toggles.labels ? <Info x={585} y={135} lines={[`ad = ${fmt(m.a * m.d)}`, `bc = ${fmt(m.b * m.c)}`, `det = ad - bc = ${fmt(determinant)}`, `area scale = ${fmt(Math.abs(determinant))}`, `orientation = ${determinant < 0 ? "flipped" : "preserved"}`]} /> : null}
    </Frame>
  );
}

export function LinearSystemVisual({ values, toggles }: VisualState) {
  const system = systemValues(values);
  const determinant = system.a1 * system.b2 - system.a2 * system.b1;
  const solution = solveSystem(system);
  return (
    <Frame label="Linear systems as line intersection">
      <Grid />
      <Line a={system.a1} b={system.b1} c={system.c1} color={colors.a} label="equation 1" />
      <Line a={system.a2} b={system.b2} c={system.c2} color={colors.b} label="equation 2" />
      {solution ? <circle cx={pointFromVec(solution).x} cy={pointFromVec(solution).y} r="10" fill={colors.warn} /> : null}
      {toggles.labels ? <Info x={585} y={135} lines={[`eq1: ${system.a1}x + ${system.b1}y = ${system.c1}`, `eq2: ${system.a2}x + ${system.b2}y = ${system.c2}`, `det = ${fmt(determinant)}`, `status = ${solution ? "one solution" : "parallel/no unique solution"}`, `intersection = ${solution ? `(${fmt(solution.x)}, ${fmt(solution.y)})` : "none"}`]} /> : null}
    </Frame>
  );
}

export function RowOperationsVisual({ values, toggles }: VisualState) {
  const k = values.k;
  const original = { a1: 1, b1: 1, c1: 5, a2: 2, b2: -1, c2: 1 };
  const transformed = { ...original, a2: original.a2 + k * original.a1, b2: original.b2 + k * original.b1, c2: original.c2 + k * original.c1 };
  const solution = solveSystem(original);
  const transformedSolution = solveSystem(transformed);
  return (
    <Frame label="Row operations preserve solution set">
      <AugmentedMatrix x={70} y={135} rows={[[original.a1, original.b1, original.c1], [original.a2, original.b2, original.c2]]} title="original" />
      <Text x={260} y={210} text={`R2 + ${fmt(k)}R1`} small />
      <AugmentedMatrix x={360} y={135} rows={[[transformed.a1, transformed.b1, transformed.c1], [transformed.a2, transformed.b2, transformed.c2]]} title="equivalent" />
      <Grid mini />
      {solution ? <circle cx={pointFromVec(solution, true).x} cy={pointFromVec(solution, true).y} r="8" fill={colors.warn} /> : null}
      {toggles.labels ? <Info x={585} y={135} lines={[`operation = R2 + ${fmt(k)}R1`, `original solution = ${solution ? `(${fmt(solution.x)}, ${fmt(solution.y)})` : "none"}`, `transformed solution = ${transformedSolution ? `(${fmt(transformedSolution.x)}, ${fmt(transformedSolution.y)})` : "none"}`, "solution set preserved"]} /> : null}
    </Frame>
  );
}

export function EigenvectorVisual({ values, toggles, onValueChange }: VisualState) {
  const theta = values.theta;
  const v = { x: Math.cos(theta), y: Math.sin(theta) };
  const m = { a: 2, b: 0, c: 0, d: 0.6 };
  const av = transform(m, v);
  const angle = angleBetween(v, av);
  const lambda = Math.abs(v.x) > Math.abs(v.y) ? av.x / v.x : av.y / v.y;
  return (
    <Frame label="Eigenvectors as directions that do not turn">
      <Grid />
      <line x1={origin.x - 240} y1={origin.y} x2={origin.x + 240} y2={origin.y} stroke={colors.ok} strokeWidth="3" strokeDasharray="8 8" />
      <line x1={origin.x} y1={origin.y - 210} x2={origin.x} y2={origin.y + 210} stroke={colors.warn} strokeWidth="3" strokeDasharray="8 8" />
      <Vector from={origin} to={pointFromVec(scale(v, 2))} color={colors.a} label="v" />
      <Vector from={origin} to={pointFromVec(av)} color={colors.c} label="Av" />
      <DraggableHandle label="Drag vector direction" position={pointFromVec(scale(v, 2))} bounds={{ x: [90, 470], y: [110, 430] }} onChange={(point) => onValueChange("theta", Math.atan2(vecFromPoint(point).y, vecFromPoint(point).x))} />
      {toggles.labels ? <Info x={585} y={135} lines={["A = [[2,0],[0,0.6]]", `v = (${fmt(v.x)}, ${fmt(v.y)})`, `Av = (${fmt(av.x)}, ${fmt(av.y)})`, `angle between = ${fmt(angle)} deg`, `lambda estimate = ${fmt(lambda)}`, `eigenvector status = ${angle < 3 ? "aligned" : "not aligned"}`]} /> : null}
    </Frame>
  );
}

export function MatrixInverseVisual({ values, toggles, onValueChange }: VisualState) {
  const m = liveMatrix(values);
  const v = { x: values.vx, y: values.vy };
  const av = transform(m, v);
  const inverse = inverse2(m);
  const restored = inverse ? transform(inverse, av) : null;
  return (
    <Frame label="Matrix inverse as undoing a transformation">
      <Grid />
      <Vector from={origin} to={pointFromVec(v)} color={colors.a} label="v" />
      <Vector from={origin} to={pointFromVec(av)} color={colors.c} label="Av" />
      {restored ? <Vector from={origin} to={pointFromVec(restored)} color={colors.ok} label="A^-1Av" /> : null}
      <DraggableHandle label="Drag input vector" position={pointFromVec(v)} bounds={{ x: [90, 470], y: [110, 430] }} onChange={(point) => onValueChange("vx", vecFromPoint(point).x)} />
      {toggles.labels ? <Info x={585} y={130} lines={[`A = [[${m.a}, ${m.b}], [${m.c}, ${m.d}]]`, `det = ${fmt(det(m))}`, `invertible = ${inverse ? "yes" : "no"}`, `v = (${fmt(v.x)}, ${fmt(v.y)})`, `Av = (${fmt(av.x)}, ${fmt(av.y)})`, `A^-1Av = ${restored ? `(${fmt(restored.x)}, ${fmt(restored.y)})` : "unavailable"}`]} /> : null}
    </Frame>
  );
}

function Frame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="bg-white p-2 dark:bg-slate-950">
      <svg viewBox="0 0 900 540" role="img" aria-label={label} className="h-auto min-h-[320px] w-full max-w-full">
        <rect x="28" y="24" width="844" height="492" rx="18" fill="#020617" />
        <text x="58" y="70" className="fill-white text-xl font-black">{label}</text>
        {children}
      </svg>
    </div>
  );
}

function MatrixGrid({ title, values, x, y, selected, selectedRow, selectedCol, active, onHighlight }: { title: string; values: number[]; x: number; y: number; selected?: number; selectedRow?: number; selectedCol?: number; active?: boolean; onHighlight?: () => void }) {
  return <g onMouseEnter={onHighlight}><Text x={x + 58} y={y - 20} text={title} />{values.map((value, index) => {
    const row = Math.floor(index / 2);
    const col = index % 2;
    const hot = selected === index || selectedRow === row || selectedCol === col;
    return <g key={index}><rect x={x + col * 60} y={y + row * 60} width="48" height="48" rx="10" fill={active || hot ? colors.warn : colors.muted} opacity={hot || active ? 0.95 : 0.7} /><Text x={x + col * 60 + 17} y={y + row * 60 + 31} text={fmt(value)} small /></g>;
  })}</g>;
}

function AugmentedMatrix({ x, y, rows, title }: { x: number; y: number; rows: number[][]; title: string }) {
  return <g><Text x={x + 18} y={y - 20} text={title} small />{rows.flatMap((row, r) => row.map((value, c) => <g key={`${r}-${c}`}><rect x={x + c * 52} y={y + r * 54} width="42" height="42" rx="8" fill={c === 2 ? colors.c : colors.muted} /><Text x={x + c * 52 + 12} y={y + r * 54 + 27} text={fmt(value)} small /></g>))}</g>;
}

function TransformGrid({ matrix }: { matrix: Matrix }) {
  const lines = [];
  for (let i = -4; i <= 4; i += 1) {
    const p1 = pointFromVec(transform(matrix, { x: -4, y: i }));
    const p2 = pointFromVec(transform(matrix, { x: 4, y: i }));
    const q1 = pointFromVec(transform(matrix, { x: i, y: -4 }));
    const q2 = pointFromVec(transform(matrix, { x: i, y: 4 }));
    lines.push(<line key={`h${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#334155" strokeWidth="2" />);
    lines.push(<line key={`v${i}`} x1={q1.x} y1={q1.y} x2={q2.x} y2={q2.y} stroke="#334155" strokeWidth="2" />);
  }
  return <g>{lines}</g>;
}

function Grid({ mini = false }: { mini?: boolean }) {
  const group = [];
  const step = mini ? 22 : 36;
  const cx = mini ? 430 : origin.x;
  const cy = mini ? 410 : origin.y;
  const extent = mini ? 88 : 216;
  for (let x = cx - extent; x <= cx + extent; x += step) group.push(<line key={`x${x}`} x1={x} y1={cy - extent} x2={x} y2={cy + extent} stroke="#334155" />);
  for (let y = cy - extent; y <= cy + extent; y += step) group.push(<line key={`y${y}`} x1={cx - extent} y1={y} x2={cx + extent} y2={y} stroke="#334155" />);
  group.push(<line key="xaxis" x1={cx - extent} y1={cy} x2={cx + extent} y2={cy} stroke="#94a3b8" strokeWidth="3" />);
  group.push(<line key="yaxis" x1={cx} y1={cy - extent} x2={cx} y2={cy + extent} stroke="#94a3b8" strokeWidth="3" />);
  return <g>{group}</g>;
}

function Vector({ from, to, color, label }: { from: Vec; to: Vec; color: string; label: string }) {
  return <g><line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={color} strokeWidth="5" strokeLinecap="round" /><circle cx={to.x} cy={to.y} r="8" fill={color} /><Text x={to.x + 8} y={to.y - 8} text={label} small /></g>;
}

function Line({ a, b, c, color, label }: { a: number; b: number; c: number; color: string; label: string }) {
  const points = [-5, 5].map((x) => ({ x, y: (c - a * x) / b }));
  const p1 = pointFromVec(points[0]);
  const p2 = pointFromVec(points[1]);
  return <g><line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={color} strokeWidth="4" /><Text x={p2.x - 60} y={p2.y - 10} text={label} small /></g>;
}

function Info({ x, y, lines }: { x: number; y: number; lines: string[] }) {
  return <g><rect x={x - 16} y={y - 28} width="292" height={Math.max(76, lines.length * 25 + 28)} rx="14" fill="#0f172a" stroke="#334155" />{lines.map((line, index) => <text key={`${line}-${index}`} x={x} y={y + index * 24} className="fill-slate-100 text-sm font-bold">{line}</text>)}</g>;
}

function Text({ x, y, text, small = false }: { x: number; y: number; text: string; small?: boolean }) {
  return <text x={x} y={y} className={`fill-white ${small ? "text-sm" : "text-base"} font-black`}>{text}</text>;
}

const origin = { x: 280, y: 285 };
const scalePx = 38;
function pointFromVec(vec: Vec, mini = false) {
  const base = mini ? { x: 430, y: 410 } : origin;
  const s = mini ? 22 : scalePx;
  return { x: base.x + vec.x * s, y: base.y - vec.y * s };
}

function vecFromPoint(point: Vec) {
  return { x: Number(((point.x - origin.x) / scalePx).toFixed(2)), y: Number(((origin.y - point.y) / scalePx).toFixed(2)) };
}

function matrixA(values: PhaseTwoValues) { return [values.a1, values.a2, values.a3, values.a4].map(Math.round); }
function matrixB(values: PhaseTwoValues) { return [values.b1, values.b2, values.b3, values.b4].map(Math.round); }
function liveMatrix(values: PhaseTwoValues): Matrix { return { a: values.a, b: values.b, c: values.c, d: values.d }; }
function transform(m: Matrix, v: Vec): Vec { return { x: m.a * v.x + m.b * v.y, y: m.c * v.x + m.d * v.y }; }
function det(m: Matrix) { return m.a * m.d - m.b * m.c; }
function inverse2(m: Matrix): Matrix | null {
  const determinant = det(m);
  if (Math.abs(determinant) < 0.001) return null;
  return { a: m.d / determinant, b: -m.b / determinant, c: -m.c / determinant, d: m.a / determinant };
}
function multiply2(a: number[], b: number[]) {
  return [a[0] * b[0] + a[1] * b[2], a[0] * b[1] + a[1] * b[3], a[2] * b[0] + a[3] * b[2], a[2] * b[1] + a[3] * b[3]];
}
function systemValues(values: PhaseTwoValues) {
  return { a1: values.a1, b1: values.b1, c1: values.c1, a2: values.a2, b2: values.b2, c2: values.c2 };
}
function solveSystem(system: { a1: number; b1: number; c1: number; a2: number; b2: number; c2: number }): Vec | null {
  const determinant = system.a1 * system.b2 - system.a2 * system.b1;
  if (Math.abs(determinant) < 0.001) return null;
  return { x: (system.c1 * system.b2 - system.c2 * system.b1) / determinant, y: (system.a1 * system.c2 - system.a2 * system.c1) / determinant };
}
function scale(v: Vec, factor: number): Vec { return { x: v.x * factor, y: v.y * factor }; }
function angleBetween(v: Vec, w: Vec) {
  const dot = v.x * w.x + v.y * w.y;
  const mag = Math.hypot(v.x, v.y) * Math.hypot(w.x, w.y);
  if (!mag) return 0;
  return Math.acos(Math.max(-1, Math.min(1, dot / mag))) * 180 / Math.PI;
}
function fmt(value: number) {
  return Number.isFinite(value) ? value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "") : "0";
}
