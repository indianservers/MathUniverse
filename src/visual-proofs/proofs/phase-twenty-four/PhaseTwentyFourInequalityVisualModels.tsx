import type { ReactNode } from "react";
import { DraggableHandle } from "../../components/DraggableHandle";
import type { PhaseTwoToggles, PhaseTwoValues } from "../../components/PhaseTwoProofExperience";

type VisualState = {
  values: PhaseTwoValues;
  toggles: PhaseTwoToggles;
  activeHighlight: string | null;
  onValueChange: (id: string, value: number) => void;
};

type Point = { x: number; y: number };

const colors = {
  line: "#38bdf8",
  shade: "#14b8a6",
  accent: "#f97316",
  guide: "#facc15",
  danger: "#fb7185",
  axis: "#94a3b8",
  purple: "#a78bfa",
  green: "#22c55e",
};

export function InequalityNumberLineVisual({ values, toggles, activeHighlight, onValueChange }: VisualState) {
  const operator = inequalityOperator(values.operator);
  const boundary = values.boundary;
  const testX = values.testX;
  const truth = compare(testX, boundary, operator);
  return (
    <Frame label="Inequality on a number line">
      <NumberLine min={-6} max={6} y={285} />
      <RayShade boundary={boundary} operator={operator} y={285} active={highlight(activeHighlight, ["x", "operator", "open-closed-circle"])} />
      <BoundaryMarker x={boundary} y={285} inclusive={isInclusive(operator)} active={highlight(activeHighlight, ["a", "open-closed-circle"])} />
      <PointMarker x={testX} y={285} label="test x" color={truth ? colors.green : colors.danger} />
      <DraggableHandle label="Drag boundary a" position={{ x: nx(boundary), y: 285 }} bounds={{ x: [nx(-6), nx(6)], y: [285, 285] }} onChange={(next) => onValueChange("boundary", fromNx(next.x))} />
      <DraggableHandle label="Drag test value x" position={{ x: nx(testX), y: 338 }} bounds={{ x: [nx(-6), nx(6)], y: [338, 338] }} onChange={(next) => onValueChange("testX", fromNx(next.x))} />
      <OperatorPanel operator={operator} x={580} y={145} active={activeHighlight === "operator"} />
      {toggles.labels ? <Info lines={[`a = ${fmt(boundary)}`, `operator = ${operator}`, `test x = ${fmt(testX)}`, `truth = ${truth ? "satisfies" : "does not satisfy"}`, `interval = ${intervalForRay(boundary, operator)}`, `circle = ${isInclusive(operator) ? "closed" : "open"}`]} /> : null}
    </Frame>
  );
}

export function SolvingLinearInequalityVisual({ values, toggles, activeHighlight, onValueChange }: VisualState) {
  const a = values.a;
  const b = values.b;
  const c = values.c;
  const operator = inequalityOperator(values.operator);
  const solvedOperator = a < 0 ? flip(operator) : operator;
  const boundary = (c - b) / a;
  const truth = compare(values.testX, boundary, solvedOperator);
  return (
    <Frame label="Solving linear inequalities">
      <NumberLine min={-6} max={6} y={330} />
      <RayShade boundary={boundary} operator={solvedOperator} y={330} active={highlight(activeHighlight, ["final-interval", "negative-division"])} />
      <BoundaryMarker x={boundary} y={330} inclusive={isInclusive(solvedOperator)} active={activeHighlight === "final-interval"} />
      <PointMarker x={values.testX} y={330} label="check x" color={truth ? colors.green : colors.danger} />
      <line x1="96" y1="190" x2="390" y2="190" stroke={colors.axis} strokeWidth="5" />
      <circle cx="210" cy="190" r="34" fill={activeHighlight === "ax-plus-b" ? colors.guide : "#0f172a"} stroke={colors.line} strokeWidth="4" />
      <circle cx="300" cy="190" r="34" fill={activeHighlight === "c" ? colors.guide : "#0f172a"} stroke={colors.accent} strokeWidth="4" />
      <Text x={175} y={247} text={`${fmt(a)}x + ${fmt(b)}`} />
      <Text x={284} y={247} text={fmt(c)} />
      <StepStack lines={[`1. ${fmt(a)}x + ${fmt(b)} ${operator} ${fmt(c)}`, `2. ${fmt(a)}x ${operator} ${fmt(c - b)}`, `3. x ${solvedOperator} ${fmt(boundary)}`, a < 0 ? "dividing by negative flips sign" : "positive divisor keeps sign"]} active={activeHighlight === "negative-division"} />
      <DraggableHandle label="Drag test x" position={{ x: nx(values.testX), y: 385 }} bounds={{ x: [nx(-6), nx(6)], y: [385, 385] }} onChange={(next) => onValueChange("testX", fromNx(next.x))} />
      {toggles.labels ? <Info lines={[`a = ${fmt(a)}`, `b = ${fmt(b)}`, `c = ${fmt(c)}`, `operator = ${operator}`, `boundary = ${fmt(boundary)}`, `sign flip = ${a < 0 ? "yes" : "no"}`, `solution = ${intervalForRay(boundary, solvedOperator)}`, `test = ${truth ? "true" : "false"}`]} /> : null}
    </Frame>
  );
}

export function CompoundIntervalsVisual({ values, toggles, activeHighlight, onValueChange }: VisualState) {
  const left = Math.min(values.left, values.right);
  const right = Math.max(values.left, values.right);
  const connector = Math.round(values.connector) === 0 ? "AND" : "OR";
  const leftInclusive = values.leftInclusive >= 0.5;
  const rightInclusive = values.rightInclusive >= 0.5;
  const testX = values.testX;
  const truth = connector === "AND" ? testX > left && testX < right || (leftInclusive && testX === left) || (rightInclusive && testX === right) : testX < left || testX > right || (leftInclusive && testX === left) || (rightInclusive && testX === right);
  return (
    <Frame label="Compound inequalities and intervals">
      <NumberLine min={-6} max={6} y={288} />
      {connector === "AND" ? (
        <line x1={nx(left)} y1="288" x2={nx(right)} y2="288" stroke={activeHighlight === "and" ? colors.guide : colors.shade} strokeWidth="18" strokeLinecap="round" opacity="0.85" />
      ) : (
        <>
          <line x1={nx(-6)} y1="288" x2={nx(left)} y2="288" stroke={activeHighlight === "or" ? colors.guide : colors.shade} strokeWidth="18" strokeLinecap="round" opacity="0.85" />
          <line x1={nx(right)} y1="288" x2={nx(6)} y2="288" stroke={activeHighlight === "or" ? colors.guide : colors.shade} strokeWidth="18" strokeLinecap="round" opacity="0.85" />
        </>
      )}
      <BoundaryMarker x={left} y={288} inclusive={leftInclusive} active={highlight(activeHighlight, ["endpoints", "interval-notation"])} />
      <BoundaryMarker x={right} y={288} inclusive={rightInclusive} active={highlight(activeHighlight, ["endpoints", "interval-notation"])} />
      <PointMarker x={testX} y={288} label="test x" color={truth ? colors.green : colors.danger} />
      <DraggableHandle label="Drag boundary a" position={{ x: nx(values.left), y: 240 }} bounds={{ x: [nx(-6), nx(6)], y: [240, 240] }} onChange={(next) => onValueChange("left", fromNx(next.x))} />
      <DraggableHandle label="Drag boundary b" position={{ x: nx(values.right), y: 336 }} bounds={{ x: [nx(-6), nx(6)], y: [336, 336] }} onChange={(next) => onValueChange("right", fromNx(next.x))} />
      <DraggableHandle label="Drag test x" position={{ x: nx(testX), y: 385 }} bounds={{ x: [nx(-6), nx(6)], y: [385, 385] }} onChange={(next) => onValueChange("testX", fromNx(next.x))} />
      <ConnectorBadge connector={connector} active={highlight(activeHighlight, ["and", "or"])} />
      {toggles.labels ? <Info lines={[`a = ${fmt(left)}`, `b = ${fmt(right)}`, `connector = ${connector}`, `left endpoint = ${leftInclusive ? "closed" : "open"}`, `right endpoint = ${rightInclusive ? "closed" : "open"}`, `interval = ${compoundInterval(left, right, connector, leftInclusive, rightInclusive)}`, `test = ${truth ? "inside" : "outside"}`]} /> : null}
    </Frame>
  );
}

export function QuadraticInequalityVisual({ values, toggles, activeHighlight, onValueChange }: VisualState) {
  const a = values.a;
  const b = values.b;
  const c = values.c;
  const mode = Math.round(values.mode) === 0 ? "> 0" : "< 0";
  const roots = quadraticRoots(a, b, c);
  const point = p(values.testX, quad(a, b, c, values.testX));
  return (
    <Frame label="Quadratic inequalities by graph regions">
      <Grid />
      <RegionBand mode={mode} active={highlight(activeHighlight, ["f-positive", "f-negative", "solution-interval"])} />
      <Curve points={range(-5, 5, 0.16).map((x) => p(x, quad(a, b, c, x)))} active={highlight(activeHighlight, ["f-positive", "f-negative"])} />
      {roots.map((root) => <BoundaryMarker key={root} x={root} y={gy(0)} inclusive={false} active={activeHighlight === "roots"} />)}
      <PointMark point={point} label="test" color={point.y > 0 ? colors.green : colors.danger} />
      <DraggableHandle label="Drag test x" position={{ x: gx(values.testX), y: gy(clamp(point.y, -5, 5)) }} bounds={gridBounds()} onChange={(next) => onValueChange("testX", fromGx(next.x))} />
      {toggles.labels ? <Info lines={[`f(x) = ${fmt(a)}x^2 + ${fmt(b)}x + ${fmt(c)}`, `discriminant = ${fmt(b * b - 4 * a * c)}`, `roots = ${roots.length ? roots.map(fmt).join(", ") : "none real"}`, `selected = f(x) ${mode}`, `test f(x) = ${fmt(point.y)}`, `solution = ${quadraticSolutionText(a, b, c, mode)}`]} /> : null}
    </Frame>
  );
}

export function AmGmInequalityVisual({ values, toggles, activeHighlight, onValueChange }: VisualState) {
  const a = Math.max(0, values.a);
  const b = Math.max(0, values.b);
  const am = (a + b) / 2;
  const gm = Math.sqrt(a * b);
  const scale = 42;
  return (
    <Frame label="AM-GM inequality">
      <Bar x={105} y={360} width={a * scale} label={`a = ${fmt(a)}`} color={colors.line} active={activeHighlight === "arithmetic-mean"} />
      <Bar x={105} y={410} width={b * scale} label={`b = ${fmt(b)}`} color={colors.accent} active={activeHighlight === "geometric-mean"} />
      <Bar x={105} y={230} width={am * scale} label={`AM = ${fmt(am)}`} color={activeHighlight === "arithmetic-mean" ? colors.guide : colors.green} />
      <Bar x={105} y={280} width={gm * scale} label={`GM = ${fmt(gm)}`} color={activeHighlight === "geometric-mean" ? colors.guide : colors.purple} />
      <rect x="500" y="195" width={Math.max(18, gm * 42)} height={Math.max(18, gm * 42)} fill="#581c87" opacity="0.55" stroke={activeHighlight === "geometric-mean" ? colors.guide : colors.purple} strokeWidth="4" />
      <rect x="500" y="390" width={Math.max(20, a * 35)} height={Math.max(20, b * 35)} fill="#064e3b" opacity="0.45" stroke={colors.green} strokeWidth="4" />
      <Text x={498} y={170} text="square side sqrt(ab)" />
      <Text x={498} y={376} text="rectangle area ab" />
      <DraggableHandle label="Drag a" position={{ x: 105 + a * scale, y: 360 }} bounds={{ x: [105, 105 + 6 * scale], y: [360, 360] }} onChange={(next) => onValueChange("a", (next.x - 105) / scale)} />
      <DraggableHandle label="Drag b" position={{ x: 105 + b * scale, y: 410 }} bounds={{ x: [105, 105 + 6 * scale], y: [410, 410] }} onChange={(next) => onValueChange("b", (next.x - 105) / scale)} />
      {toggles.labels ? <Info lines={[`a = ${fmt(a)}`, `b = ${fmt(b)}`, `AM = ${fmt(am)}`, `GM = ${fmt(gm)}`, `AM - GM = ${fmt(am - gm)}`, `equality = ${Math.abs(a - b) < 0.05 ? "yes" : "only when a=b"}`]} /> : null}
    </Frame>
  );
}

export function TriangleInequalityVisual({ values, toggles, activeHighlight }: VisualState) {
  const a = values.sideA;
  const b = values.sideB;
  const angle = values.angle;
  const start = p(120, 365);
  const joint = p(start.x + a * 70, start.y);
  const end = p(joint.x + b * 70 * Math.cos(rad(angle)), joint.y - b * 70 * Math.sin(rad(angle)));
  const c = Math.hypot(end.x - start.x, end.y - start.y) / 70;
  return (
    <Frame label="Triangle inequality">
      <line x1={start.x} y1={start.y} x2={joint.x} y2={joint.y} stroke={activeHighlight === "side-a" ? colors.guide : colors.line} strokeWidth="9" strokeLinecap="round" />
      <line x1={joint.x} y1={joint.y} x2={end.x} y2={end.y} stroke={activeHighlight === "side-b" ? colors.guide : colors.accent} strokeWidth="9" strokeLinecap="round" />
      <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke={highlight(activeHighlight, ["side-c", "a-plus-b-greater-c"]) ? colors.guide : colors.green} strokeWidth="6" strokeDasharray="10 8" />
      <circle cx={start.x} cy={start.y} r="8" fill={colors.line} />
      <circle cx={joint.x} cy={joint.y} r="8" fill={colors.accent} />
      <circle cx={end.x} cy={end.y} r="8" fill={colors.green} />
      <path d={`M ${joint.x - 48} ${joint.y} A 48 48 0 0 0 ${joint.x - 48 * Math.cos(rad(180 - angle))} ${joint.y - 48 * Math.sin(rad(180 - angle))}`} fill="none" stroke={colors.guide} strokeWidth="4" />
      <Text x={start.x + 70} y={start.y - 22} text={`a = ${fmt(a)}`} />
      <Text x={(joint.x + end.x) / 2 + 12} y={(joint.y + end.y) / 2 - 12} text={`b = ${fmt(b)}`} />
      <Text x={(start.x + end.x) / 2} y={(start.y + end.y) / 2 + 36} text={`c = ${fmt(c)}`} />
      {toggles.labels ? <Info lines={[`a = ${fmt(a)}`, `b = ${fmt(b)}`, `angle = ${fmt(angle)} deg`, `c = ${fmt(c)}`, `a + b = ${fmt(a + b)}`, `a+b-c = ${fmt(a + b - c)}`, `status = ${angle >= 179 ? "degenerate limit" : "valid triangle"}`]} /> : null}
    </Frame>
  );
}

export function CauchySchwarzVisual({ values, toggles, activeHighlight, onValueChange }: VisualState) {
  const u = p(values.ux, values.uy);
  const v = p(values.vx, values.vy);
  const dot = u.x * v.x + u.y * v.y;
  const mu = Math.hypot(u.x, u.y);
  const mv = Math.hypot(v.x, v.y);
  const ratio = mu * mv === 0 ? 0 : Math.abs(dot) / (mu * mv);
  const projection = mv === 0 ? p(0, 0) : p((dot / (mv * mv)) * v.x, (dot / (mv * mv)) * v.y);
  return (
    <Frame label="Cauchy-Schwarz dot product bound">
      <Grid />
      <VectorArrow vector={u} color={activeHighlight === "u-dot-v" || activeHighlight === "u-magnitude" ? colors.guide : colors.line} label="u" />
      <VectorArrow vector={v} color={activeHighlight === "v-magnitude" || activeHighlight === "cos-theta" ? colors.guide : colors.accent} label="v" />
      <line x1={gx(0)} y1={gy(0)} x2={gx(projection.x)} y2={gy(projection.y)} stroke={activeHighlight === "bound" ? colors.guide : colors.purple} strokeWidth="8" opacity="0.7" />
      <circle cx={gx(0)} cy={gy(0)} r="42" fill="none" stroke={activeHighlight === "cos-theta" ? colors.guide : colors.axis} strokeWidth="3" strokeDasharray="7 6" />
      <DraggableHandle label="Drag vector u" position={{ x: gx(u.x), y: gy(u.y) }} bounds={gridBounds()} onChange={(next) => { onValueChange("ux", fromGx(next.x)); onValueChange("uy", fromGy(next.y)); }} />
      <DraggableHandle label="Drag vector v" position={{ x: gx(v.x), y: gy(v.y) }} bounds={gridBounds()} onChange={(next) => { onValueChange("vx", fromGx(next.x)); onValueChange("vy", fromGy(next.y)); }} />
      {toggles.labels ? <Info lines={[`u = (${fmt(u.x)}, ${fmt(u.y)})`, `v = (${fmt(v.x)}, ${fmt(v.y)})`, `theta = ${fmt(angleBetween(u, v))} deg`, `cos theta = ${fmt(mu * mv ? dot / (mu * mv) : 0)}`, `u dot v = ${fmt(dot)}`, `|u||v| = ${fmt(mu * mv)}`, `ratio = ${fmt(ratio)}`]} /> : null}
    </Frame>
  );
}

export function LinearInequalityRegionsVisual({ values, toggles, activeHighlight, onValueChange }: VisualState) {
  const a = values.a;
  const b = values.b;
  const c = values.c;
  const operator = inequalityOperator(values.operator);
  const test = p(values.testX, values.testY);
  const value = a * test.x + b * test.y;
  const truth = compare(value, c, operator);
  const inclusive = isInclusive(operator);
  const line = lineEndpoints(a, b, c);
  return (
    <Frame label="Linear inequality regions">
      <Grid />
      <HalfPlaneShade a={a} b={b} c={c} operator={operator} active={highlight(activeHighlight, ["operator", "test-point"])} />
      <line x1={gx(line[0].x)} y1={gy(line[0].y)} x2={gx(line[1].x)} y2={gy(line[1].y)} stroke={highlight(activeHighlight, ["ax-plus-by", "c", "operator"]) ? colors.guide : colors.line} strokeWidth="5" strokeDasharray={inclusive ? undefined : "10 8"} />
      <PointMark point={test} label="test" color={truth ? colors.green : colors.danger} />
      <DraggableHandle label="Drag test point" position={{ x: gx(test.x), y: gy(test.y) }} bounds={gridBounds()} onChange={(next) => { onValueChange("testX", fromGx(next.x)); onValueChange("testY", fromGy(next.y)); }} />
      {toggles.labels ? <Info lines={[`a = ${fmt(a)}`, `b = ${fmt(b)}`, `c = ${fmt(c)}`, `operator = ${operator}`, `test point = (${fmt(test.x)}, ${fmt(test.y)})`, `ax+by = ${fmt(value)}`, `truth = ${truth ? "shaded" : "not shaded"}`, `boundary = ${inclusive ? "solid" : "dashed"}`]} /> : null}
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

function NumberLine({ min, max, y }: { min: number; max: number; y: number }) {
  return (
    <g>
      <line x1={nx(min)} y1={y} x2={nx(max)} y2={y} stroke={colors.axis} strokeWidth="5" />
      {range(min, max, 1).map((x) => (
        <g key={x}>
          <line x1={nx(x)} y1={y - 14} x2={nx(x)} y2={y + 14} stroke="#cbd5e1" strokeWidth="2" />
          <text x={nx(x) - 8} y={y + 42} className="fill-slate-200 text-xs font-bold">{x}</text>
        </g>
      ))}
    </g>
  );
}

function RayShade({ boundary, operator, y, active }: { boundary: number; operator: string; y: number; active: boolean }) {
  const left = operator.includes("<");
  return <line x1={left ? nx(-6) : nx(boundary)} y1={y} x2={left ? nx(boundary) : nx(6)} y2={y} stroke={active ? colors.guide : colors.shade} strokeWidth="18" strokeLinecap="round" opacity="0.85" />;
}

function BoundaryMarker({ x, y, inclusive, active }: { x: number; y: number; inclusive: boolean; active: boolean }) {
  return <circle cx={typeof y === "number" && y > 100 ? nx(x) : gx(x)} cy={y} r={active ? 14 : 11} fill={inclusive ? (active ? colors.guide : colors.line) : "#020617"} stroke={active ? colors.guide : colors.line} strokeWidth="4" />;
}

function PointMarker({ x, y, label, color }: { x: number; y: number; label: string; color: string }) {
  return <g><circle cx={nx(x)} cy={y} r="9" fill={color} /><Text x={nx(x) + 12} y={y - 18} text={label} /></g>;
}

function PointMark({ point, label, color }: { point: Point; label: string; color: string }) {
  return <g><circle cx={gx(point.x)} cy={gy(point.y)} r="8" fill={color} /><Text x={gx(point.x) + 12} y={gy(point.y) - 10} text={label} /></g>;
}

function Grid() {
  return (
    <g>
      {range(-6, 6, 1).map((v) => <line key={`x${v}`} x1={gx(v)} y1={gy(-5)} x2={gx(v)} y2={gy(5)} stroke="#1e293b" />)}
      {range(-5, 5, 1).map((v) => <line key={`y${v}`} x1={gx(-6)} y1={gy(v)} x2={gx(6)} y2={gy(v)} stroke="#1e293b" />)}
      <line x1={gx(-6)} y1={gy(0)} x2={gx(6)} y2={gy(0)} stroke={colors.axis} strokeWidth="3" />
      <line x1={gx(0)} y1={gy(-5)} x2={gx(0)} y2={gy(5)} stroke={colors.axis} strokeWidth="3" />
    </g>
  );
}

function Curve({ points, active = false }: { points: Point[]; active?: boolean }) {
  return <polyline points={points.map((q) => `${gx(q.x)},${gy(clamp(q.y, -5.2, 5.2))}`).join(" ")} fill="none" stroke={active ? colors.guide : colors.line} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />;
}

function RegionBand({ mode, active }: { mode: string; active: boolean }) {
  return <rect x={gx(-6)} y={mode === "> 0" ? gy(5) : gy(0)} width={gx(6) - gx(-6)} height={Math.abs(gy(0) - (mode === "> 0" ? gy(5) : gy(-5)))} fill={active ? colors.guide : colors.shade} opacity="0.14" />;
}

function HalfPlaneShade({ a, b, c, operator, active }: { a: number; b: number; c: number; operator: string; active: boolean }) {
  const originSatisfies = compare(0, c, operator);
  const target = originSatisfies ? p(0, 0) : p(a, b);
  const fill = active ? colors.guide : colors.shade;
  if (Math.abs(b) > Math.abs(a)) {
    const yLeft = (c - a * -6) / b;
    const yRight = (c - a * 6) / b;
    const above = target.y > (c - a * target.x) / b;
    const points = above ? [[gx(-6), gy(5)], [gx(6), gy(5)], [gx(6), gy(yRight)], [gx(-6), gy(yLeft)]] : [[gx(-6), gy(-5)], [gx(6), gy(-5)], [gx(6), gy(yRight)], [gx(-6), gy(yLeft)]];
    return <polygon points={points.map((q) => q.join(",")).join(" ")} fill={fill} opacity="0.22" />;
  }
  const xBottom = (c - b * -5) / a;
  const xTop = (c - b * 5) / a;
  const rightSide = target.x > (c - b * target.y) / a;
  const points = rightSide ? [[gx(6), gy(-5)], [gx(6), gy(5)], [gx(xTop), gy(5)], [gx(xBottom), gy(-5)]] : [[gx(-6), gy(-5)], [gx(-6), gy(5)], [gx(xTop), gy(5)], [gx(xBottom), gy(-5)]];
  return <polygon points={points.map((q) => q.join(",")).join(" ")} fill={fill} opacity="0.22" />;
}

function VectorArrow({ vector, color, label }: { vector: Point; color: string; label: string }) {
  return (
    <g>
      <defs><marker id={`arrow-${label}`} markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill={color} /></marker></defs>
      <line x1={gx(0)} y1={gy(0)} x2={gx(vector.x)} y2={gy(vector.y)} stroke={color} strokeWidth="6" markerEnd={`url(#arrow-${label})`} />
      <Text x={gx(vector.x) + 10} y={gy(vector.y) - 8} text={label} />
    </g>
  );
}

function OperatorPanel({ operator, x, y, active }: { operator: string; x: number; y: number; active: boolean }) {
  return <g><rect x={x} y={y} width="130" height="76" rx="14" fill={active ? colors.guide : "#0f172a"} stroke="#334155" /><Text x={x + 22} y={y + 48} text={`x ${operator} a`} /></g>;
}

function ConnectorBadge({ connector, active }: { connector: string; active: boolean }) {
  return <g><rect x="385" y="138" width="130" height="72" rx="14" fill={active ? colors.guide : "#0f172a"} stroke="#334155" /><Text x={418} y={183} text={connector} /></g>;
}

function StepStack({ lines, active }: { lines: string[]; active: boolean }) {
  return <g><rect x="435" y="126" width="365" height="142" rx="14" fill={active ? "#713f12" : "#0f172a"} stroke="#334155" />{lines.map((line, index) => <text key={line} x="455" y={160 + index * 28} className="fill-white text-sm font-bold">{line}</text>)}</g>;
}

function Bar({ x, y, width, label, color, active = false }: { x: number; y: number; width: number; label: string; color: string; active?: boolean }) {
  return <g><rect x={x} y={y - 24} width={Math.max(6, width)} height="28" rx="7" fill={active ? colors.guide : color} opacity="0.85" /><Text x={x} y={y - 34} text={label} /></g>;
}

function Info({ lines }: { lines: string[] }) {
  return <g><rect x="612" y="104" width="252" height={Math.max(95, lines.length * 23 + 34)} rx="14" fill="#0f172a" stroke="#334155" />{lines.map((line, index) => <text key={`${line}-${index}`} x="628" y={134 + index * 22} className="fill-slate-100 text-xs font-bold">{line}</text>)}</g>;
}

function Text({ x, y, text }: { x: number | string; y: number | string; text: string }) {
  return <text x={x} y={y} className="fill-white text-sm font-black">{text}</text>;
}

const nStart = 100;
const nScale = 52;
function nx(x: number) { return nStart + (x + 6) * nScale; }
function fromNx(x: number) { return clamp((x - nStart) / nScale - 6, -6, 6); }

const origin = { x: 300, y: 292 };
const gScale = 34;
function gx(x: number) { return origin.x + x * gScale; }
function gy(y: number) { return origin.y - y * gScale; }
function fromGx(x: number) { return clamp((x - origin.x) / gScale, -6, 6); }
function fromGy(y: number) { return clamp((origin.y - y) / gScale, -5, 5); }
function gridBounds(): { x: [number, number]; y: [number, number] } {
  return { x: [gx(-6), gx(6)], y: [gy(5), gy(-5)] };
}

function inequalityOperator(value: number) {
  const selected = Math.round(value);
  if (selected === 0) return "<";
  if (selected === 1) return "<=";
  if (selected === 2) return ">";
  return ">=";
}
function isInclusive(operator: string) { return operator.includes("="); }
function flip(operator: string) {
  if (operator === "<") return ">";
  if (operator === "<=") return ">=";
  if (operator === ">") return "<";
  return "<=";
}
function compare(left: number, right: number, operator: string) {
  if (operator === "<") return left < right;
  if (operator === "<=") return left <= right;
  if (operator === ">") return left > right;
  return left >= right;
}
function intervalForRay(boundary: number, operator: string) {
  if (operator === "<") return `(-inf, ${fmt(boundary)})`;
  if (operator === "<=") return `(-inf, ${fmt(boundary)}]`;
  if (operator === ">") return `(${fmt(boundary)}, inf)`;
  return `[${fmt(boundary)}, inf)`;
}
function compoundInterval(left: number, right: number, connector: string, leftInclusive: boolean, rightInclusive: boolean) {
  if (connector === "AND") return `${leftInclusive ? "[" : "("}${fmt(left)}, ${fmt(right)}${rightInclusive ? "]" : ")"}`;
  return `(-inf, ${fmt(left)}${leftInclusive ? "]" : ")"} U ${rightInclusive ? "[" : "("}${fmt(right)}, inf)`;
}
function quadraticRoots(a: number, b: number, c: number) {
  const d = b * b - 4 * a * c;
  if (d < 0) return [];
  const rootD = Math.sqrt(d);
  return [(-b - rootD) / (2 * a), (-b + rootD) / (2 * a)].sort((x, y) => x - y);
}
function quadraticSolutionText(a: number, b: number, c: number, mode: string) {
  const roots = quadraticRoots(a, b, c);
  if (!roots.length) return mode === "> 0" === (a > 0) ? "all real" : "no real x";
  const outside = mode === "> 0" ? a > 0 : a < 0;
  return outside ? `(-inf, ${fmt(roots[0])}) U (${fmt(roots[1])}, inf)` : `(${fmt(roots[0])}, ${fmt(roots[1])})`;
}
function lineEndpoints(a: number, b: number, c: number): [Point, Point] {
  if (Math.abs(b) > 0.2) return [p(-6, (c - a * -6) / b), p(6, (c - a * 6) / b)];
  return [p(c / a, -5), p(c / a, 5)];
}
function angleBetween(u: Point, v: Point) {
  const denom = Math.hypot(u.x, u.y) * Math.hypot(v.x, v.y);
  return denom ? Math.acos(clamp((u.x * v.x + u.y * v.y) / denom, -1, 1)) * 180 / Math.PI : 0;
}
function quad(a: number, b: number, c: number, x: number) { return a * x * x + b * x + c; }
function p(x: number, y: number): Point { return { x, y }; }
function range(start: number, end: number, step: number) {
  const items: number[] = [];
  for (let value = start; value <= end + 0.0001; value += step) items.push(Number(value.toFixed(3)));
  return items;
}
function rad(value: number) { return value * Math.PI / 180; }
function clamp(value: number, min: number, max: number) { return Math.min(max, Math.max(min, value)); }
function highlight(active: string | null, ids: string[]) { return !!active && ids.includes(active); }
function fmt(value: number) { return Number.isFinite(value) ? value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "") : "0"; }
