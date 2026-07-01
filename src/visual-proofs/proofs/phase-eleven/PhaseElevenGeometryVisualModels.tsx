import { useState, useEffect, useRef, type ReactNode } from "react";
import { DraggableHandle } from "../../components/DraggableHandle";
import type { PhaseTwoToggles, PhaseTwoValues } from "../../components/PhaseTwoProofExperience";

type Point = { x: number; y: number };

type VisualState = {
  values: PhaseTwoValues;
  toggles: PhaseTwoToggles;
  activeStep: number;
  activeHighlight: string | null;
  onHighlight: (token: string | null) => void;
  onValueChange: (id: string, value: number) => void;
};

const round = (value: number, digits = 2) => Number(value.toFixed(digits));
const toRad = (degrees: number) => (degrees * Math.PI) / 180;

export function ExteriorAngleGuide({ values, toggles, activeStep, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const a = { x: values.ax, y: values.ay };
  const b = { x: values.bx, y: values.by };
  const c = { x: values.cx, y: values.cy };
  const angles = triangleAngles(a, b, c);
  const exterior = 180 - angles.B;
  const extension = extendPoint(a, b, 150);
  const remoteActive = activeHighlight === "remote1" || activeHighlight === "remote2" || activeHighlight === "sum";
  const setPoint = (prefix: "a" | "b" | "c", point: Point) => {
    onValueChange(`${prefix}x`, point.x);
    onValueChange(`${prefix}y`, point.y);
  };

  return (
    <Frame label="Exterior angle theorem visual proof">
      <polygon points={`${a.x},${a.y} ${b.x},${b.y} ${c.x},${c.y}`} fill="#0ea5e9" opacity="0.28" stroke="#bae6fd" strokeWidth="4" />
      <line x1={a.x} y1={a.y} x2={extension.x} y2={extension.y} stroke="#94a3b8" strokeWidth="4" strokeDasharray="10 8" />
      <TokenArc cx={b.x} cy={b.y} r={52} token="exterior" active={activeHighlight} onHighlight={onHighlight} label="exterior angle" color="#f59e0b" />
      <TokenArc cx={a.x} cy={a.y} r={42} token="remote1" active={activeHighlight} onHighlight={onHighlight} label="remote interior angle 1" color="#22d3ee" />
      <TokenArc cx={c.x} cy={c.y} r={42} token="remote2" active={activeHighlight} onHighlight={onHighlight} label="remote interior angle 2" color="#a78bfa" />
      {activeStep >= 4 ? <AngleCopyGuide active={remoteActive} /> : null}
      {toggles.labels ? (
        <>
          <Info x={560} y={255} lines={[`angle A = ${round(angles.A)} deg`, `angle B = ${round(angles.B)} deg`, `angle C = ${round(angles.C)} deg`, `exterior = ${round(exterior)} deg`, `remote sum = ${round(angles.A + angles.C)} deg`]} />
          <Label x={b.x + 84} y={b.y - 34} text="exterior angle" active={activeHighlight === "exterior"} />
        </>
      ) : null}
      <DraggableHandle label="Drag vertex A" position={a} axis="xy" bounds={{ x: [150, 360], y: [220, 420] }} keyboardStep={8} onChange={(point) => setPoint("a", point)} />
      <DraggableHandle label="Drag vertex B" position={b} axis="xy" bounds={{ x: [470, 680], y: [220, 420] }} keyboardStep={8} onChange={(point) => setPoint("b", point)} />
      <DraggableHandle label="Drag vertex C" position={c} axis="xy" bounds={{ x: [260, 560], y: [95, 260] }} keyboardStep={8} onChange={(point) => setPoint("c", point)} />
    </Frame>
  );
}

export function SimilarTriangleGuide({ values, toggles, activeStep, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const scale = values.scale;
  const base = [{ x: 170, y: 380 }, { x: 320, y: 380 }, { x: 230, y: 230 }];
  const copyOrigin = { x: 510, y: 405 };
  const copy = base.map((point) => ({ x: copyOrigin.x + (point.x - 170) * scale, y: copyOrigin.y + (point.y - 380) * scale }));
  const baseSides = sideLengths(base);
  const copySides = sideLengths(copy);
  return (
    <Frame label="Similar triangles and proportional sides visual proof">
      <Triangle points={base} fill="#0ea5e9" />
      <Triangle points={copy} fill="#a855f7" />
      <SidePair p1={base[0]} p2={base[1]} q1={copy[0]} q2={copy[1]} token="ratio1" active={activeHighlight} onHighlight={onHighlight} color="#22d3ee" />
      <SidePair p1={base[1]} p2={base[2]} q1={copy[1]} q2={copy[2]} token="ratio2" active={activeHighlight} onHighlight={onHighlight} color="#f59e0b" />
      <SidePair p1={base[2]} p2={base[0]} q1={copy[2]} q2={copy[0]} token="ratio3" active={activeHighlight} onHighlight={onHighlight} color="#34d399" />
      {activeStep >= 2 ? <CorrespondingAngleMarks points={base} copy={copy} active={activeHighlight === "scale"} /> : null}
      {activeStep >= 4 ? <RatioBars x={560} y={120} scale={scale} active={activeHighlight === "scale"} /> : null}
      {toggles.labels ? <Info x={548} y={315} lines={[`scale factor = ${scale}`, `AB/DE = ${round(copySides.ab / baseSides.ab)}`, `BC/EF = ${round(copySides.bc / baseSides.bc)}`, `AC/DF = ${round(copySides.ac / baseSides.ac)}`]} /> : null}
      <DraggableHandle label="Drag scale factor" position={{ x: 510 + 150 * scale, y: 430 }} axis="x" bounds={{ x: [660, 810] }} keyboardStep={10} onChange={(point) => onValueChange("scale", round((point.x - 510) / 150, 1))} />
    </Frame>
  );
}

export function SectorCircleGuide({ values, toggles, activeStep, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const radius = values.radius;
  const theta = values.theta;
  const cx = 300;
  const cy = 285;
  const scale = 24;
  const r = radius * scale;
  const sectorPath = sectorD(cx, cy, r, -90, theta - 90);
  const angleHandle = polar(cx, cy, r, theta - 90);
  const radiusHandle = { x: cx + r, y: cy };
  const fraction = theta / 360;
  return (
    <Frame label="Sector area formula visual proof">
      <circle cx={cx} cy={cy} r={r} fill="#1d4ed8" opacity="0.16" stroke="#bfdbfe" strokeWidth="4" />
      <path d={sectorPath} fill="#f59e0b" opacity={activeHighlight === "sector" ? "0.88" : "0.58"} stroke={strokeFor("sector", activeHighlight, "#fde68a")} strokeWidth={widthFor("sector", activeHighlight)} onMouseEnter={() => onHighlight("sector")} onMouseLeave={() => onHighlight(null)} />
      <line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke={strokeFor("area", activeHighlight, "#22d3ee")} strokeWidth={widthFor("area", activeHighlight)} />
      <line x1={cx} y1={cy} x2={angleHandle.x} y2={angleHandle.y} stroke={strokeFor("theta", activeHighlight, "#fde68a")} strokeWidth={widthFor("theta", activeHighlight)} onMouseEnter={() => onHighlight("theta")} onMouseLeave={() => onHighlight(null)} />
      <circle cx={cx} cy={cy} r={48} fill="none" stroke={strokeFor("theta", activeHighlight, "#f8fafc")} strokeWidth={widthFor("theta", activeHighlight)} />
      {activeStep >= 3 ? <FractionRing cx={cx} cy={cy} r={r + 24} fraction={fraction} active={activeHighlight === "full"} /> : null}
      {toggles.labels ? <Info x={555} y={265} lines={[`radius = ${radius}`, `theta = ${theta} deg`, `theta = ${round(toRad(theta))} rad`, `fraction = ${round(fraction)}`, `sector area = ${round(fraction * Math.PI * radius * radius)}`]} /> : null}
      <DraggableHandle label="Drag angle theta" position={angleHandle} axis="xy" bounds={{ x: [cx - r, cx + r], y: [cy - r, cy + r] }} keyboardStep={8} onChange={(point) => onValueChange("theta", clamp(round((Math.atan2(point.y - cy, point.x - cx) * 180) / Math.PI + 90), 20, 330))} />
      <DraggableHandle label="Drag radius" position={radiusHandle} axis="x" bounds={{ x: [cx + 3 * scale, cx + 8 * scale] }} snapToGrid={scale} keyboardStep={scale} onChange={(point) => onValueChange("radius", Math.round((point.x - cx) / scale))} />
    </Frame>
  );
}

export function TrapezoidDuplicationGuide({ values, toggles, activeStep, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const a = values.a;
  const b = values.b;
  const h = values.h;
  const scale = 32;
  const x = 160;
  const y = 370;
  const topW = a * scale;
  const bottomW = b * scale;
  const height = h * scale;
  const topX = x + (bottomW - topW) / 2;
  const points = `${x},${y} ${x + bottomW},${y} ${topX + topW},${y - height} ${topX},${y - height}`;
  const duplicateY = activeStep >= 3 ? y - height : y + 30;
  return (
    <Frame label="Trapezoid area by duplication visual proof">
      <polygon points={points} fill="#0ea5e9" opacity="0.72" stroke="#bae6fd" strokeWidth="4" />
      {activeStep >= 2 ? <polygon points={`${x + bottomW + 40},${duplicateY - height} ${x + bottomW + 40 + bottomW},${duplicateY - height} ${x + bottomW + 40 + bottomW - (bottomW - topW) / 2},${duplicateY} ${x + bottomW + 40 + (bottomW - topW) / 2},${duplicateY}`} fill="#a855f7" opacity="0.6" stroke="#ddd6fe" strokeWidth="4" /> : null}
      {activeStep >= 4 ? <rect x="505" y={y - height} width={(a + b) * 22} height={height} fill="#14b8a6" opacity="0.24" stroke={strokeFor("combined", activeHighlight, "#99f6e4")} strokeWidth={widthFor("combined", activeHighlight)} onMouseEnter={() => onHighlight("combined")} onMouseLeave={() => onHighlight(null)} /> : null}
      <Dimension x1={topX} y1={y - height - 18} x2={topX + topW} y2={y - height - 18} token="a" active={activeHighlight} onHighlight={onHighlight} label="a" />
      <Dimension x1={x} y1={y + 24} x2={x + bottomW} y2={y + 24} token="b" active={activeHighlight} onHighlight={onHighlight} label="b" />
      <Dimension x1={x - 30} y1={y} x2={x - 30} y2={y - height} token="h" active={activeHighlight} onHighlight={onHighlight} label="perpendicular height" />
      {toggles.labels ? <Info x={565} y={295} lines={[`base a = ${a}`, `base b = ${b}`, `height h = ${h}`, `parallelogram = ${(a + b) * h}`, `one trapezoid = ${round(((a + b) * h) / 2)}`]} /> : null}
      <DraggableHandle label="Drag top base a" position={{ x: topX + topW, y: y - height }} axis="x" bounds={{ x: [topX + 2 * scale, topX + 8 * scale] }} snapToGrid={scale} keyboardStep={scale} onChange={(point) => onValueChange("a", Math.round((point.x - topX) / scale))} />
      <DraggableHandle label="Drag bottom base b" position={{ x: x + bottomW, y }} axis="x" bounds={{ x: [x + 4 * scale, x + 10 * scale] }} snapToGrid={scale} keyboardStep={scale} onChange={(point) => onValueChange("b", Math.round((point.x - x) / scale))} />
      <DraggableHandle label="Drag perpendicular height" position={{ x: x - 30, y: y - height }} axis="y" bounds={{ y: [y - 7 * scale, y - 3 * scale] }} snapToGrid={scale} keyboardStep={scale} onChange={(point) => onValueChange("h", Math.round((y - point.y) / scale))} />
    </Frame>
  );
}

export function PolygonTriangulationGuide({ values, toggles, activeStep, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const n = Math.round(values.n);
  const radius = values.radius;
  const rotation = values.rotation;
  const points = regularPolygon(n, 330, 275, radius * 22, rotation);
  const triangles = Math.max(1, n - 2);
  return (
    <Frame label="Polygon interior angle sum triangulation proof">
      <polygon points={points.map((point) => `${point.x},${point.y}`).join(" ")} fill="#0ea5e9" opacity="0.22" stroke="#bae6fd" strokeWidth="4" />
      {activeStep >= 2 ? points.slice(2, -1).map((point, index) => <line key={index} x1={points[0].x} y1={points[0].y} x2={point.x} y2={point.y} stroke="#fde68a" strokeWidth="4" strokeDasharray="8 6" />) : null}
      {activeStep >= 3 ? Array.from({ length: triangles }, (_, index) => <text key={index} x={245 + index * 38} y="455" fill="#f8fafc" fontSize="22" fontWeight="900">180</text>) : null}
      <circle cx={points[0].x} cy={points[0].y} r="11" fill={activeHighlight === "n" ? "#fde68a" : "#f8fafc"} onMouseEnter={() => onHighlight("n")} onMouseLeave={() => onHighlight(null)} />
      {activeStep >= 4 ? <FormulaBanner active={activeHighlight === "total"} text={`(${n} - 2) x 180 deg = ${triangles * 180} deg`} /> : null}
      {toggles.labels ? <Info x={565} y={260} lines={[`n = ${n} sides`, `diagonals from vertex = ${Math.max(0, n - 3)}`, `triangles formed = ${triangles}`, `angle sum = ${triangles * 180} deg`]} /> : null}
      <DraggableHandle label="Drag polygon size" position={{ x: 330 + radius * 22, y: 275 }} axis="x" bounds={{ x: [330 + 4 * 22, 330 + 8 * 22] }} snapToGrid={22} keyboardStep={22} onChange={(point) => onValueChange("radius", Math.round((point.x - 330) / 22))} />
    </Frame>
  );
}

export function CircleAreaUnrollGuide({ values, toggles, activeStep, activeHighlight, onHighlight }: VisualState) {
  const radius = Math.round(values.radius);
  const sectors = Math.round(values.sectors);
  const R = Math.min(radius * 20, 100); // visual radius in px

  const CX = 450;
  const CY = 215;

  const LINE_Y = CY + R + 70;
  const LINE_START_X = CX - Math.PI * R; // left end, centered under circle
  const stackVisible = activeStep >= 4;
  const triangleVisible = activeStep >= 5;
  const stripCount = Math.min(12, Math.max(5, Math.round(sectors / 5)));
  const stackBase = 280;
  const stackHeight = 112;
  const stackX = 95;
  const stackY = 430;
  const hCircumference = activeHighlight === "circumference";

  // Animation
  const [vizP, setVizP] = useState(0);
  const rafRef = useRef<number | undefined>(undefined);
  const t0Ref = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
    if (activeStep < 2) {
      setVizP(0);
      return;
    }
    t0Ref.current = undefined;
    const DURATION = 4000;
    const tick = (now: number) => {
      if (t0Ref.current === undefined) t0Ref.current = now;
      const raw = Math.min((now - t0Ref.current) / DURATION, 1);
      const p = raw < 0.5 ? 4 * raw * raw * raw : 1 - Math.pow(-2 * raw + 2, 3) / 2;
      setVizP(p);
      if (raw < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current);
    };
  }, [activeStep, radius]);

  const p = activeStep >= 3 ? 1 : vizP;

  // Polyline that morphs from a circle (p=0) to a straight line (p=1).
  // Parameterise by phi from 0 to 2*pi, starting from the top cut point.
  const N_PTS = 120;
  const polyPoints = Array.from({ length: N_PTS }, (_, i) => {
    const phi = (i / (N_PTS - 1)) * 2 * Math.PI;
    // Circle position: clockwise from the top
    const cx = CX + R * Math.sin(phi);
    const cy = CY - R * Math.cos(phi);
    // Straight line position: maps arc length → x
    const lx = LINE_START_X + R * phi;
    const ly = LINE_Y;
    return `${cx + p * (lx - cx)},${cy + p * (ly - cy)}`;
  }).join(" ");

  const hR = activeHighlight === "r";
  const dim = (tok: string) => (activeHighlight === tok ? "#fde68a" : "#f8fafc");

  return (
    <Frame label="Circle area proof — unrolling the outermost ring into a line">
      {/* Radius line (always visible) */}
      <line
        x1={CX} y1={CY} x2={CX + R} y2={CY}
        stroke={hR ? "#fde68a" : "#f8fafc"} strokeWidth={hR ? 4 : 2}
        onMouseEnter={() => onHighlight("r")} onMouseLeave={() => onHighlight(null)}
      />
      <text
        x={CX + R / 2} y={CY - 10}
        textAnchor="middle" fill={dim("r")}
        fontSize="17" fontStyle="italic" fontWeight="bold"
        style={{ pointerEvents: "none" }}
      >r</text>

      {/* The circle/line — morphs as p goes 0→1 */}
      <polyline
        points={polyPoints}
        fill="none"
        stroke={hCircumference ? "#fde68a" : "#00bfff"}
        strokeWidth={hCircumference ? "5" : "3"}
        strokeLinecap="round"
        strokeLinejoin="round"
        onMouseEnter={() => onHighlight("circumference")}
        onMouseLeave={() => onHighlight(null)}
      />

      {/* Cut marker at the top of the circle (visible in steps 1 before animation) */}
      {activeStep >= 1 && p < 0.04 && (
        <g>
          <circle cx={CX} cy={CY - R} r={7} fill="#f59e0b" opacity="0.95" />
          <line x1={CX - 5} y1={CY - R - 5} x2={CX + 5} y2={CY - R + 5}
            stroke="#020617" strokeWidth="2" strokeLinecap="round" />
          <line x1={CX + 5} y1={CY - R - 5} x2={CX - 5} y2={CY - R + 5}
            stroke="#020617" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}

      {/* 2*pi*r dimension under the straight line (fades in as line forms) */}
      {p > 0.85 && (
        <g
          opacity={Math.min((p - 0.85) / 0.15, 1)}
          onMouseEnter={() => onHighlight("circumference")}
          onMouseLeave={() => onHighlight(null)}
        >
          <line
            x1={LINE_START_X} y1={LINE_Y + 18}
            x2={LINE_START_X + 2 * Math.PI * R} y2={LINE_Y + 18}
            stroke={dim("circumference")} strokeWidth="2"
          />
          <line x1={LINE_START_X} y1={LINE_Y + 12} x2={LINE_START_X} y2={LINE_Y + 24}
            stroke={dim("circumference")} strokeWidth="2" />
          <line
            x1={LINE_START_X + 2 * Math.PI * R} y1={LINE_Y + 12}
            x2={LINE_START_X + 2 * Math.PI * R} y2={LINE_Y + 24}
            stroke={dim("circumference")} strokeWidth="2"
          />
          <text
            x={CX} y={LINE_Y + 42}
            textAnchor="middle" fill={dim("circumference")}
            fontSize="19" fontWeight="bold" fontStyle="italic"
          >2*pi*r</text>
        </g>
      )}

      {stackVisible ? (
        <g onMouseEnter={() => onHighlight("area")} onMouseLeave={() => onHighlight(null)}>
          <text x={stackX} y={stackY - stackHeight - 22} fill={dim("area")} fontSize="15" fontWeight="900">
            Stack ring strips from center to edge
          </text>
          {Array.from({ length: stripCount }, (_, index) => {
            const t = (index + 1) / stripCount;
            const width = stackBase * t;
            const y = stackY - index * (stackHeight / stripCount);
            return (
              <line
                key={`circle-strip-${index}`}
                x1={stackX}
                y1={y}
                x2={stackX + width}
                y2={y}
                stroke={activeHighlight === "area" ? "#fde68a" : "#22d3ee"}
                strokeWidth="7"
                strokeLinecap="round"
                opacity={0.45 + t * 0.5}
              />
            );
          })}
          {triangleVisible ? (
            <g>
              <polygon
                points={`${stackX},${stackY} ${stackX + stackBase},${stackY} ${stackX},${stackY - stackHeight}`}
                fill="#22d3ee"
                opacity="0.14"
                stroke={dim("area")}
                strokeWidth="3"
                strokeDasharray="8 8"
              />
              <line x1={stackX} y1={stackY + 18} x2={stackX + stackBase} y2={stackY + 18} stroke={dim("circumference")} strokeWidth="2" />
              <text x={stackX + stackBase / 2} y={stackY + 42} fill={dim("circumference")} textAnchor="middle" fontSize="15" fontWeight="900">
                base = 2*pi*r
              </text>
              <line x1={stackX - 18} y1={stackY} x2={stackX - 18} y2={stackY - stackHeight} stroke={dim("r")} strokeWidth="2" />
              <text x={stackX - 34} y={stackY - stackHeight / 2} fill={dim("r")} textAnchor="middle" fontSize="15" fontWeight="900" transform={`rotate(-90 ${stackX - 34} ${stackY - stackHeight / 2})`}>
                height = r
              </text>
              <text x={stackX + stackBase + 42} y={stackY - 44} fill={dim("area")} textAnchor="middle" fontSize="16" fontWeight="900">
                area = pi*r^2
              </text>
            </g>
          ) : null}
        </g>
      ) : null}

      {/* Info */}
      {toggles.labels && (
        <Info
          x={60}
          y={80}
          lines={[`radius r = ${radius}`, `circumference 2*pi*r = ${round(2 * Math.PI * radius)}`, `area pi*r^2 = ${round(Math.PI * radius * radius)}`]}
        />
      )}
    </Frame>
  );
}

function Frame({ label, children }: { label: string; children: ReactNode }) {
  return <div className="bg-white p-2 dark:bg-slate-950"><svg viewBox="0 0 900 540" role="img" aria-label={label} className="h-auto min-h-[320px] w-full max-w-full"><rect x="28" y="24" width="844" height="492" rx="18" fill="#020617" />{children}</svg></div>;
}

function AngleCopyGuide({ active }: { active: boolean }) {
  return <g><path d="M 560 405 A 54 54 0 0 1 620 360" fill="none" stroke={active ? "#fde68a" : "#22d3ee"} strokeWidth="8" /><path d="M 620 360 A 54 54 0 0 1 690 385" fill="none" stroke={active ? "#fde68a" : "#a78bfa"} strokeWidth="8" /><text x="622" y="438" textAnchor="middle" fill="#f8fafc" fontSize="16" fontWeight="900">remote angles fill the exterior angle</text></g>;
}

function TokenArc({ cx, cy, r, token, active, onHighlight, label, color }: { cx: number; cy: number; r: number; token: string; active: string | null; onHighlight: (token: string | null) => void; label: string; color: string }) {
  return <g onMouseEnter={() => onHighlight(token)} onMouseLeave={() => onHighlight(null)}><circle cx={cx} cy={cy} r={active === token ? r + 8 : r} fill="none" stroke={active === token ? "#fde68a" : color} strokeWidth={active === token ? "8" : "5"} strokeDasharray="70 260" /><title>{label}</title></g>;
}

function Triangle({ points, fill }: { points: Point[]; fill: string }) {
  return <polygon points={points.map((point) => `${point.x},${point.y}`).join(" ")} fill={fill} opacity="0.32" stroke="#f8fafc" strokeWidth="4" />;
}

function SidePair({ p1, p2, q1, q2, token, active, onHighlight, color }: { p1: Point; p2: Point; q1: Point; q2: Point; token: string; active: string | null; onHighlight: (token: string | null) => void; color: string }) {
  const highlighted = active === token;
  return <g onMouseEnter={() => onHighlight(token)} onMouseLeave={() => onHighlight(null)}><line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={highlighted ? "#fde68a" : color} strokeWidth={highlighted ? "8" : "5"} /><line x1={q1.x} y1={q1.y} x2={q2.x} y2={q2.y} stroke={highlighted ? "#fde68a" : color} strokeWidth={highlighted ? "8" : "5"} /></g>;
}

function CorrespondingAngleMarks({ points, copy, active }: { points: Point[]; copy: Point[]; active: boolean }) {
  return <g>{points.map((point, index) => <circle key={`a-${index}`} cx={point.x} cy={point.y} r={18 + index * 4} fill="none" stroke={active ? "#fde68a" : "#f8fafc"} strokeWidth="3" />)}{copy.map((point, index) => <circle key={`b-${index}`} cx={point.x} cy={point.y} r={18 + index * 4} fill="none" stroke={active ? "#fde68a" : "#f8fafc"} strokeWidth="3" />)}</g>;
}

function RatioBars({ x, y, scale, active }: { x: number; y: number; scale: number; active: boolean }) {
  return <g><rect x={x} y={y} width="90" height="16" rx="8" fill="#22d3ee" /><rect x={x} y={y + 26} width={90 * scale} height="16" rx="8" fill={active ? "#fde68a" : "#a78bfa"} /><text x={x} y={y + 68} fill="#f8fafc" fontSize="14" fontWeight="900">each side is multiplied by {scale}</text></g>;
}

function FractionRing({ cx, cy, r, fraction, active }: { cx: number; cy: number; r: number; fraction: number; active: boolean }) {
  return <g><circle cx={cx} cy={cy} r={r} fill="none" stroke="#334155" strokeWidth="8" /><path d={sectorD(cx, cy, r, -90, -90 + 360 * fraction)} fill="none" stroke={active ? "#fde68a" : "#34d399"} strokeWidth="10" /></g>;
}

function Dimension({ x1, y1, x2, y2, token, active, onHighlight, label }: { x1: number; y1: number; x2: number; y2: number; token: string; active: string | null; onHighlight: (token: string | null) => void; label: string }) {
  const highlighted = active === token;
  return <g onMouseEnter={() => onHighlight(token)} onMouseLeave={() => onHighlight(null)}><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={highlighted ? "#fde68a" : "#f8fafc"} strokeWidth={highlighted ? "7" : "4"} /><text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 10} textAnchor="middle" fill={highlighted ? "#fde68a" : "#f8fafc"} fontSize="14" fontWeight="900">{label}</text></g>;
}

function FormulaBanner({ active, text }: { active: boolean; text: string }) {
  return <g><rect x="250" y="455" width="410" height="42" rx="16" fill={active ? "#f59e0b" : "#0f172a"} stroke="#f8fafc" opacity="0.94" /><text x="455" y="482" textAnchor="middle" fill="#f8fafc" fontSize="18" fontWeight="900">{text}</text></g>;
}

function _UnrolledSectors({ x, y, width, height, count, active, onEnter, onLeave }: { x: number; y: number; width: number; height: number; count: number; active: boolean; onEnter: () => void; onLeave: () => void }) {
  const visible = Math.min(count, 32);
  return <g onMouseEnter={onEnter} onMouseLeave={onLeave}>{Array.from({ length: visible }, (_, index) => {
    const x1 = x + (index * width) / visible;
    const x2 = x + ((index + 1) * width) / visible;
    const apexY = index % 2 === 0 ? y - height : y;
    const baseY = index % 2 === 0 ? y : y - height;
    return <polygon key={index} points={`${x1},${baseY} ${x2},${baseY} ${(x1 + x2) / 2},${apexY}`} fill={index % 2 === 0 ? "#22d3ee" : "#a78bfa"} opacity={active ? "0.9" : "0.58"} stroke="#f8fafc" strokeOpacity="0.22" />;
  })}</g>;
}

function Label({ x, y, text, active = false }: { x: number; y: number; text: string; active?: boolean }) {
  return <text x={x} y={y} textAnchor="middle" fill={active ? "#fde68a" : "#f8fafc"} fontSize="14" fontWeight="900">{text}</text>;
}

function Info({ x, y, lines }: { x: number; y: number; lines: string[] }) {
  return <g><rect x={x - 18} y={y - 34} width="310" height={Math.max(82, lines.length * 27 + 24)} rx="16" fill="#0f172a" opacity="0.93" stroke="#334155" />{lines.map((line, index) => <text key={`${line}-${index}`} x={x} y={y + index * 27} fill="#f8fafc" fontSize="14" fontWeight="800">{line}</text>)}</g>;
}

function sideLengths(points: Point[]) {
  return { ab: distance(points[0], points[1]), bc: distance(points[1], points[2]), ac: distance(points[0], points[2]) };
}

function distance(a: Point, b: Point) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function triangleAngles(a: Point, b: Point, c: Point) {
  const angle = (p: Point, q: Point, r: Point) => {
    const v1 = { x: p.x - q.x, y: p.y - q.y };
    const v2 = { x: r.x - q.x, y: r.y - q.y };
    const dot = v1.x * v2.x + v1.y * v2.y;
    const mag = Math.max(0.001, Math.hypot(v1.x, v1.y) * Math.hypot(v2.x, v2.y));
    return (Math.acos(clamp(dot / mag, -1, 1)) * 180) / Math.PI;
  };
  return { A: angle(b, a, c), B: angle(a, b, c), C: angle(a, c, b) };
}

function extendPoint(from: Point, through: Point, length: number) {
  const dx = through.x - from.x;
  const dy = through.y - from.y;
  const mag = Math.max(1, Math.hypot(dx, dy));
  return { x: through.x + (dx / mag) * length, y: through.y + (dy / mag) * length };
}

function regularPolygon(n: number, cx: number, cy: number, r: number, rotation: number) {
  return Array.from({ length: n }, (_, index) => polar(cx, cy, r, rotation - 90 + (index * 360) / n));
}

function polar(cx: number, cy: number, r: number, degrees: number) {
  const angle = toRad(degrees);
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

function sectorD(cx: number, cy: number, r: number, startDegrees: number, endDegrees: number) {
  const start = polar(cx, cy, r, startDegrees);
  const end = polar(cx, cy, r, endDegrees);
  const largeArc = Math.abs(endDegrees - startDegrees) > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
}

function strokeFor(token: string, active: string | null, fallback: string) {
  return active === token ? "#fde68a" : fallback;
}

function widthFor(token: string, active: string | null) {
  return active === token ? "7" : "3";
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
