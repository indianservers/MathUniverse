import type { ReactNode } from "react";
import { DraggableHandle } from "../../components/DraggableHandle";
import type { PhaseTwoToggles, PhaseTwoValues } from "../../components/PhaseTwoProofExperience";

type VisualState = {
  values: PhaseTwoValues;
  toggles: PhaseTwoToggles;
  activeHighlight: string | null;
  onValueChange: (id: string, value: number) => void;
};

const colors = {
  area: "#38bdf8",
  volume: "#22c55e",
  surface: "#f97316",
  boundary: "#facc15",
  cut: "#fb7185",
  net: "#a78bfa",
  grid: "#334155",
  label: "#f8fafc",
};

export function RectangleSquareAreaVisual({ values, toggles, activeHighlight, onValueChange }: VisualState) {
  const length = whole(values.length);
  const width = whole(values.width);
  const squareMode = length === width;
  const area = length * width;
  const cell = Math.min(34, 260 / Math.max(length, width, 1));
  const start = { x: 120, y: 130 };
  return (
    <Frame label="Rectangle and square area by unit-square counting">
      <rect x={start.x} y={start.y} width={length * cell} height={width * cell} fill={highlight(activeHighlight, ["length-x-width", "side-squared"]) ? "#0ea5e9" : "#0369a1"} opacity="0.45" stroke={colors.area} strokeWidth="4" />
      {Array.from({ length }, (_, column) => Array.from({ length: width }, (__, row) => (
        <rect key={`${column}-${row}`} x={start.x + column * cell} y={start.y + row * cell} width={cell} height={cell} fill="none" stroke="#bae6fd" strokeWidth="1.5" />
      )))}
      <DimensionLine x1={start.x} y1={start.y + width * cell + 30} x2={start.x + length * cell} y2={start.y + width * cell + 30} label={`length = ${length}`} active={activeHighlight === "length"} />
      <DimensionLine x1={start.x - 30} y1={start.y} x2={start.x - 30} y2={start.y + width * cell} label={`width = ${width}`} active={activeHighlight === "width"} vertical />
      <DraggableHandle label="Drag length" position={{ x: start.x + length * cell, y: start.y + width * cell + 30 }} bounds={{ x: [start.x + cell * 2, start.x + cell * 10], y: [start.y + width * cell + 30, start.y + width * cell + 30] }} onChange={(point) => onValueChange("length", Math.max(2, Math.min(10, Math.round((point.x - start.x) / cell))))} />
      <DraggableHandle label="Drag width" position={{ x: start.x - 30, y: start.y + width * cell }} bounds={{ x: [start.x - 30, start.x - 30], y: [start.y + cell * 2, start.y + cell * 8] }} onChange={(point) => onValueChange("width", Math.max(2, Math.min(8, Math.round((point.y - start.y) / cell))))} />
      {toggles.labels ? <Info lines={[`unit squares = ${length} x ${width}`, `area = ${area} square units`, squareMode ? `square mode: side^2 = ${length ** 2}` : "square mode: off", "invariant: area equals grid count"]} /> : null}
    </Frame>
  );
}

export function PerimeterCircumferenceVisual({ values, toggles, activeHighlight, onValueChange }: VisualState) {
  const circleMode = values.shapeMode >= 0.5;
  const length = whole(values.length);
  const width = whole(values.width);
  const radius = values.radius;
  const perimeter = 2 * (length + width);
  const circumference = 2 * Math.PI * radius;
  const activeBoundary = highlight(activeHighlight, ["perimeter", "two-l-plus-w", "two-pi-r", "pi-d"]);
  return (
    <Frame label="Perimeter and circumference as outside boundary length">
      {circleMode ? (
        <g>
          <circle cx="240" cy="250" r={radius * 24} fill="#0f172a" stroke={activeBoundary ? colors.boundary : colors.area} strokeWidth="7" />
          <line x1="240" y1="250" x2={240 + radius * 24} y2="250" stroke={colors.boundary} strokeWidth="4" />
          <line x1={240 - radius * 24} y1="250" x2={240 + radius * 24} y2="250" stroke={colors.net} strokeWidth="3" strokeDasharray="6 6" />
          <DraggableHandle label="Drag radius" position={{ x: 240 + radius * 24, y: 250 }} bounds={{ x: [288, 408], y: [250, 250] }} onChange={(point) => onValueChange("radius", (point.x - 240) / 24)} />
          <rect x="95" y="380" width={circumference * 6} height="24" rx="12" fill={colors.boundary} opacity="0.85" />
          <Text x="95" y="430" text="circle boundary unwrapped into a line" />
        </g>
      ) : (
        <g>
          <rect x="120" y="150" width={length * 36} height={width * 36} fill="#0f172a" stroke={activeBoundary ? colors.boundary : colors.area} strokeWidth="7" />
          <DimensionLine x1="120" y1={170 + width * 36} x2={120 + length * 36} y2={170 + width * 36} label={`l=${length}`} active={activeHighlight === "two-l-plus-w"} />
          <DimensionLine x1={95 + length * 36} y1="150" x2={95 + length * 36} y2={150 + width * 36} label={`w=${width}`} active={activeHighlight === "two-l-plus-w"} vertical />
          <DraggableHandle label="Drag length" position={{ x: 120 + length * 36, y: 170 + width * 36 }} bounds={{ x: [192, 480], y: [170 + width * 36, 170 + width * 36] }} onChange={(point) => onValueChange("length", Math.max(2, Math.min(10, Math.round((point.x - 120) / 36))))} />
          <DraggableHandle label="Drag width" position={{ x: 95 + length * 36, y: 150 + width * 36 }} bounds={{ x: [95 + length * 36, 95 + length * 36], y: [222, 438] }} onChange={(point) => onValueChange("width", Math.max(2, Math.min(8, Math.round((point.y - 150) / 36))))} />
        </g>
      )}
      {toggles.labels ? <Info lines={circleMode ? [`shape = circle`, `radius = ${fmt(radius)}`, `diameter = ${fmt(2 * radius)}`, `circumference ~= ${fmt(circumference)}`, "pi values are rounded"] : [`shape = rectangle`, `length = ${length}`, `width = ${width}`, `perimeter = ${perimeter}`, "boundary length, not inside area"]} /> : null}
    </Frame>
  );
}

export function CuboidCubeSurfaceAreaVisual({ values, toggles, activeHighlight }: VisualState) {
  const l = whole(values.length);
  const w = whole(values.width);
  const h = whole(values.height);
  const cubeMode = l === w && w === h;
  return (
    <Frame label="Cuboid surface area from three pairs of faces">
      <Cuboid x={120} y={205} l={l} w={w} h={h} active={activeHighlight} />
      <Net x={415} y={170} l={l} w={w} h={h} active={activeHighlight} />
      {toggles.labels ? <Info lines={[`lw pair = ${2 * l * w}`, `lh pair = ${2 * l * h}`, `wh pair = ${2 * w * h}`, `surface area = ${2 * (l * w + l * h + w * h)}`, cubeMode ? `cube mode: 6s^2 = ${6 * l * l}` : "cube mode: off"]} /> : null}
    </Frame>
  );
}

export function CuboidCubeVolumeVisual({ values, toggles, activeHighlight }: VisualState) {
  const l = whole(values.length);
  const w = whole(values.width);
  const h = whole(values.height);
  const cubeMode = l === w && w === h;
  return (
    <Frame label="Cuboid volume by stacked unit cubes">
      <UnitCubeStack x={105} y={380} l={l} w={w} h={h} active={activeHighlight} />
      <rect x="430" y="185" width={l * 24} height={w * 24} fill={highlight(activeHighlight, ["length-width", "lwh"]) ? colors.volume : "#064e3b"} opacity="0.7" stroke="#bbf7d0" />
      <Text x="430" y="170" text={`base layer = ${l} x ${w} = ${l * w}`} />
      <rect x="430" y="250" width="34" height={h * 28} fill={highlight(activeHighlight, ["height", "lwh", "side-cubed"]) ? colors.boundary : colors.net} opacity="0.9" />
      <Text x="475" y="285" text={`height layers = ${h}`} />
      {toggles.labels ? <Info lines={[`base area = ${l * w}`, `layers = ${h}`, `volume = ${l * w * h} cubic units`, cubeMode ? `cube mode: side^3 = ${l ** 3}` : "cube mode: off", "invariant: volume equals unit cubes"]} /> : null}
    </Frame>
  );
}

export function CylinderVolumeSurfaceAreaVisual({ values, toggles, activeHighlight, onValueChange }: VisualState) {
  const radius = values.radius;
  const height = values.height;
  const baseArea = Math.PI * radius ** 2;
  const circumference = 2 * Math.PI * radius;
  return (
    <Frame label="Cylinder volume and curved surface area">
      <Cylinder x={180} y={300} r={radius} h={height} active={activeHighlight} />
      <DraggableHandle label="Drag radius" position={{ x: 180 + radius * 24, y: 300 }} bounds={{ x: [228, 348], y: [300, 300] }} onChange={(point) => onValueChange("radius", (point.x - 180) / 24)} />
      <DraggableHandle label="Drag height" position={{ x: 105, y: 300 - height * 20 }} bounds={{ x: [105, 105], y: [120, 260] }} onChange={(point) => onValueChange("height", (300 - point.y) / 20)} />
      <rect x="420" y="155" width={circumference * 7} height={height * 22} fill={highlight(activeHighlight, ["two-pi-r", "two-pi-r-h"]) ? colors.surface : "#7c2d12"} opacity="0.8" stroke="#fed7aa" />
      <Text x="420" y="140" text="curved side unrolls to rectangle" />
      <circle cx="455" cy="385" r={radius * 14} fill={highlight(activeHighlight, ["pi-r-squared", "two-pi-r-squared"]) ? colors.area : "#075985"} opacity="0.85" />
      <circle cx="540" cy="385" r={radius * 14} fill={highlight(activeHighlight, ["two-pi-r-squared"]) ? colors.area : "#075985"} opacity="0.6" />
      {toggles.labels ? <Info lines={[`radius = ${fmt(radius)}`, `height = ${fmt(height)}`, `base area ~= ${fmt(baseArea)}`, `circumference ~= ${fmt(circumference)}`, `volume ~= ${fmt(baseArea * height)}`, `curved area ~= ${fmt(circumference * height)}`, `total area ~= ${fmt(2 * Math.PI * radius * (height + radius))}`]} /> : null}
    </Frame>
  );
}

export function ConeVolumeSurfaceAreaVisual({ values, toggles, activeHighlight, onValueChange }: VisualState) {
  const radius = values.radius;
  const height = values.height;
  const slant = Math.hypot(radius, height);
  const cylinderVolume = Math.PI * radius ** 2 * height;
  return (
    <Frame label="Cone volume and surface area">
      <Cone x={190} y={340} r={radius} h={height} active={activeHighlight} />
      <Cylinder x={340} y={340} r={radius} h={height} active="pi-r-squared-h" ghost />
      <DraggableHandle label="Drag radius" position={{ x: 190 + radius * 24, y: 340 }} bounds={{ x: [238, 358], y: [340, 340] }} onChange={(point) => onValueChange("radius", (point.x - 190) / 24)} />
      <DraggableHandle label="Drag height" position={{ x: 190, y: 340 - height * 22 }} bounds={{ x: [190, 190], y: [120, 296] }} onChange={(point) => onValueChange("height", (340 - point.y) / 22)} />
      <path d="M 475 350 A 125 125 0 0 1 675 205 L 575 350 Z" fill={highlight(activeHighlight, ["pi-r-l", "slant-height"]) ? colors.surface : "#7c2d12"} opacity="0.78" stroke="#fed7aa" strokeWidth="3" />
      <Text x="490" y="385" text="curved surface sector" />
      {toggles.labels ? <Info lines={[`radius = ${fmt(radius)}`, `height = ${fmt(height)}`, `slant height = ${fmt(slant)}`, `matching cylinder ~= ${fmt(cylinderVolume)}`, `cone volume ~= ${fmt(cylinderVolume / 3)}`, `curved area ~= ${fmt(Math.PI * radius * slant)}`, `total area ~= ${fmt(Math.PI * radius * (slant + radius))}`]} /> : null}
    </Frame>
  );
}

export function SphereSurfaceAreaVolumeVisual({ values, toggles, activeHighlight, onValueChange }: VisualState) {
  const radius = values.radius;
  const greatCircle = Math.PI * radius ** 2;
  return (
    <Frame label="Sphere surface area and volume scaling">
      <Sphere x={235} y={285} r={radius} active={activeHighlight} />
      <DraggableHandle label="Drag radius" position={{ x: 235 + radius * 31, y: 285 }} bounds={{ x: [297, 421], y: [285, 285] }} onChange={(point) => onValueChange("radius", (point.x - 235) / 31)} />
      {[0, 1, 2, 3].map((index) => (
        <circle key={index} cx={455 + index * 72} cy="235" r={radius * 13} fill={highlight(activeHighlight, ["pi-r-squared", "four-pi-r-squared"]) ? colors.area : "#075985"} opacity={0.85 - index * 0.08} stroke="#bae6fd" />
      ))}
      <rect x="455" y="335" width={radius ** 2 * 16} height="28" fill={colors.area} opacity="0.75" />
      <rect x="455" y="385" width={radius ** 3 * 5} height="28" fill={colors.volume} opacity="0.75" />
      <Text x="455" y="325" text="area grows with r^2" />
      <Text x="455" y="378" text="volume grows with r^3" />
      {toggles.labels ? <Info lines={[`radius = ${fmt(radius)}`, `great circle ~= ${fmt(greatCircle)}`, `surface area ~= ${fmt(4 * greatCircle)}`, `volume ~= ${fmt((4 / 3) * Math.PI * radius ** 3)}`, "double radius: volume becomes 8x"]} /> : null}
    </Frame>
  );
}

export function CompositeSolidsUnitsVisual({ values, toggles, activeHighlight }: VisualState) {
  const volumeMode = values.mode >= 0.5;
  const includeHole = values.includeCutout >= 0.5;
  const l = whole(values.length);
  const w = whole(values.width);
  const h = whole(values.height);
  const areaTotal = l * w + 3 * w - (includeHole ? 4 : 0);
  const volumeTotal = l * w * h + 2 * w * h - (includeHole ? h * 2 : 0);
  return (
    <Frame label="Composite measurement by decomposing and checking units">
      {volumeMode ? (
        <g>
          <UnitCubeStack x={115} y={365} l={l} w={w} h={h} active={activeHighlight} compact />
          <UnitCubeStack x={360} y={365} l={2} w={w} h={h} active={activeHighlight} compact />
          {includeHole ? <rect x="255" y="260" width="54" height="58" fill={colors.cut} opacity="0.8" /> : null}
        </g>
      ) : (
        <g>
          <rect x="120" y="165" width={l * 38} height={w * 38} fill={highlight(activeHighlight, ["add-parts"]) ? colors.area : "#075985"} opacity="0.75" stroke="#bae6fd" />
          <rect x={120 + l * 38} y={165 + (w - 3) * 38} width={3 * 38} height={3 * 38} fill={highlight(activeHighlight, ["add-parts"]) ? colors.volume : "#166534"} opacity="0.75" stroke="#bbf7d0" />
          {includeHole ? <rect x={120 + 2 * 38} y={165 + 38} width="76" height="76" fill={highlight(activeHighlight, ["subtract-holes"]) ? colors.cut : "#7f1d1d"} opacity="0.9" stroke="#fecdd3" /> : null}
        </g>
      )}
      <UnitBadge x={465} y={180} label={volumeMode ? "cm^3" : "cm^2"} active={highlight(activeHighlight, [volumeMode ? "cm-cubed" : "cm-squared"])} />
      <Text x="465" y="260" text={volumeMode ? "Add volumes, subtract cutout volumes" : "Add areas, subtract cutout areas"} />
      {toggles.labels ? <Info lines={[`mode = ${volumeMode ? "volume" : "area"}`, `main dimensions = ${l} x ${w}${volumeMode ? ` x ${h}` : ""}`, `cutout = ${includeHole ? "subtract" : "off"}`, `total = ${volumeMode ? volumeTotal : areaTotal} ${volumeMode ? "cm^3" : "cm^2"}`, "invariant: only like units combine"]} /> : null}
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

function Cuboid({ x, y, l, w, h, active }: { x: number; y: number; l: number; w: number; h: number; active: string | null }) {
  const width = l * 28;
  const depth = w * 16;
  const height = h * 24;
  return (
    <g>
      <polygon points={`${x},${y} ${x + width},${y} ${x + width + depth},${y - depth} ${x + depth},${y - depth}`} fill={highlight(active, ["lw", "two-face-pairs"]) ? colors.area : "#075985"} opacity="0.78" />
      <polygon points={`${x + width},${y} ${x + width + depth},${y - depth} ${x + width + depth},${y - depth - height} ${x + width},${y - height}`} fill={highlight(active, ["wh", "two-face-pairs"]) ? colors.net : "#581c87"} opacity="0.78" />
      <polygon points={`${x},${y} ${x + width},${y} ${x + width},${y - height} ${x},${y - height}`} fill={highlight(active, ["lh", "two-face-pairs", "six-s-squared"]) ? colors.surface : "#7c2d12"} opacity="0.78" />
      <polyline points={`${x},${y} ${x + width},${y} ${x + width + depth},${y - depth} ${x + depth},${y - depth} ${x},${y}`} fill="none" stroke="#e2e8f0" strokeWidth="3" />
      <Text x={x} y={y + 34} text={`l=${l}, w=${w}, h=${h}`} />
    </g>
  );
}

function Net({ x, y, l, w, h, active }: { x: number; y: number; l: number; w: number; h: number; active: string | null }) {
  const lw = { width: l * 18, height: w * 18 };
  const lh = { width: l * 18, height: h * 18 };
  const wh = { width: w * 18, height: h * 18 };
  return (
    <g>
      <Text x={x} y={y - 22} text="net: three face pairs" />
      <rect x={x} y={y + lh.height} width={lw.width} height={lw.height} fill={highlight(active, ["lw", "two-face-pairs"]) ? colors.area : "#075985"} opacity="0.7" stroke="#bae6fd" />
      <rect x={x} y={y} width={lh.width} height={lh.height} fill={highlight(active, ["lh", "two-face-pairs"]) ? colors.surface : "#7c2d12"} opacity="0.7" stroke="#fed7aa" />
      <rect x={x} y={y + lh.height + lw.height} width={lh.width} height={lh.height} fill={highlight(active, ["lh", "two-face-pairs"]) ? colors.surface : "#7c2d12"} opacity="0.45" stroke="#fed7aa" />
      <rect x={x - wh.width} y={y + lh.height} width={wh.width} height={wh.height} fill={highlight(active, ["wh", "two-face-pairs"]) ? colors.net : "#581c87"} opacity="0.7" stroke="#ddd6fe" />
      <rect x={x + lw.width} y={y + lh.height} width={wh.width} height={wh.height} fill={highlight(active, ["wh", "two-face-pairs"]) ? colors.net : "#581c87"} opacity="0.45" stroke="#ddd6fe" />
    </g>
  );
}

function UnitCubeStack({ x, y, l, w, h, active, compact = false }: { x: number; y: number; l: number; w: number; h: number; active: string | null; compact?: boolean }) {
  const size = compact ? 18 : 22;
  const cubes = [];
  for (let layer = 0; layer < Math.min(h, 6); layer += 1) {
    for (let row = 0; row < Math.min(w, 6); row += 1) {
      for (let column = 0; column < Math.min(l, 8); column += 1) {
        cubes.push(<rect key={`${layer}-${row}-${column}`} x={x + column * size + row * 6} y={y - layer * 12 - row * 6} width={size} height={size} fill={highlight(active, ["lwh", "side-cubed", "add-parts"]) ? colors.volume : "#166534"} opacity="0.55" stroke="#bbf7d0" />);
      }
    }
  }
  return <g>{cubes}<Text x={x} y={y + 45} text={`${l} x ${w} x ${h} unit cubes`} /></g>;
}

function Cylinder({ x, y, r, h, active, ghost = false }: { x: number; y: number; r: number; h: number; active: string | null; ghost?: boolean }) {
  const rx = r * 24;
  const top = y - h * 20;
  return (
    <g opacity={ghost ? 0.35 : 1}>
      <path d={`M ${x - rx} ${top} L ${x - rx} ${y} A ${rx} 16 0 0 0 ${x + rx} ${y} L ${x + rx} ${top} A ${rx} 16 0 0 1 ${x - rx} ${top}`} fill={highlight(active, ["h", "pi-r-squared-h"]) ? colors.volume : "#064e3b"} opacity="0.62" stroke="#bbf7d0" strokeWidth="3" />
      <ellipse cx={x} cy={top} rx={rx} ry="16" fill={highlight(active, ["pi-r-squared", "two-pi-r-squared"]) ? colors.area : "#075985"} stroke="#bae6fd" strokeWidth="3" />
      <line x1={x} y1={top} x2={x + rx} y2={top} stroke={colors.boundary} strokeWidth="3" />
      <Text x={x - rx} y={y + 38} text={ghost ? "matching cylinder" : `r=${fmt(r)}, h=${fmt(h)}`} />
    </g>
  );
}

function Cone({ x, y, r, h, active }: { x: number; y: number; r: number; h: number; active: string | null }) {
  const rx = r * 24;
  const top = y - h * 22;
  return (
    <g>
      <path d={`M ${x - rx} ${y} L ${x} ${top} L ${x + rx} ${y} A ${rx} 16 0 0 1 ${x - rx} ${y}`} fill={highlight(active, ["one-third", "pi-r-squared-h"]) ? colors.volume : "#064e3b"} opacity="0.62" stroke="#bbf7d0" strokeWidth="3" />
      <ellipse cx={x} cy={y} rx={rx} ry="16" fill={highlight(active, ["pi-r-squared"]) ? colors.area : "#075985"} stroke="#bae6fd" strokeWidth="3" />
      <line x1={x} y1={y} x2={x} y2={top} stroke={colors.boundary} strokeWidth="3" />
      <line x1={x + rx} y1={y} x2={x} y2={top} stroke={highlight(active, ["slant-height", "pi-r-l"]) ? colors.surface : colors.net} strokeWidth="4" />
      <Text x={x - rx} y={y + 38} text={`r=${fmt(r)}, h=${fmt(h)}`} />
    </g>
  );
}

function Sphere({ x, y, r, active }: { x: number; y: number; r: number; active: string | null }) {
  const radius = r * 31;
  return (
    <g>
      <circle cx={x} cy={y} r={radius} fill={highlight(active, ["four-pi-r-squared", "four-thirds-pi-r-cubed"]) ? colors.net : "#1e3a8a"} opacity="0.78" stroke="#bfdbfe" strokeWidth="4" />
      <ellipse cx={x} cy={y} rx={radius} ry={radius * 0.35} fill="none" stroke={colors.area} strokeWidth="3" strokeDasharray="7 6" />
      <line x1={x} y1={y} x2={x + radius} y2={y} stroke={highlight(active, ["radius"]) ? colors.boundary : "#fef3c7"} strokeWidth="4" />
      <Text x={x - radius} y={y + radius + 32} text={`radius = ${fmt(r)}`} />
    </g>
  );
}

function UnitBadge({ x, y, label, active }: { x: number; y: number; label: string; active: boolean }) {
  return <g><rect x={x} y={y} width="130" height="52" rx="16" fill={active ? colors.boundary : "#0f172a"} stroke="#e2e8f0" /><text x={x + 24} y={y + 34} className="fill-white text-xl font-black">{label}</text></g>;
}

function DimensionLine({ x1, y1, x2, y2, label, active, vertical = false }: { x1: number | string; y1: number | string; x2: number | string; y2: number | string; label: string; active?: boolean; vertical?: boolean }) {
  const nx1 = Number(x1);
  const ny1 = Number(y1);
  const nx2 = Number(x2);
  const ny2 = Number(y2);
  return (
    <g>
      <line x1={nx1} y1={ny1} x2={nx2} y2={ny2} stroke={active ? colors.boundary : "#e2e8f0"} strokeWidth="4" strokeLinecap="round" />
      <text x={vertical ? nx1 - 70 : (nx1 + nx2) / 2 - 36} y={vertical ? (ny1 + ny2) / 2 : ny1 + 24} className="fill-white text-sm font-black">{label}</text>
    </g>
  );
}

function Info({ lines }: { lines: string[] }) {
  return <g><rect x="610" y="104" width="254" height={Math.max(95, lines.length * 24 + 34)} rx="14" fill="#0f172a" stroke="#334155" />{lines.map((line, index) => <text key={`${line}-${index}`} x="627" y={135 + index * 23} className="fill-slate-100 text-xs font-bold">{line}</text>)}</g>;
}

function Text({ x, y, text }: { x: number | string; y: number | string; text: string }) {
  return <text x={x} y={y} className="fill-white text-sm font-black">{text}</text>;
}

function highlight(active: string | null, ids: string[]) {
  return !!active && ids.includes(active);
}

function whole(value: number) {
  return Math.max(1, Math.round(value));
}

function fmt(value: number) {
  return Number.isFinite(value) ? value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "") : "0";
}
