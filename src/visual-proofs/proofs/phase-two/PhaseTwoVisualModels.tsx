import type { ReactNode } from "react";
import { DraggableHandle } from "../../components/DraggableHandle";
import type { PhaseTwoToggles, PhaseTwoValues } from "../../components/PhaseTwoProofExperience";

type VisualState = {
  values: PhaseTwoValues;
  toggles: PhaseTwoToggles;
  activeStep: number;
  revealed: boolean;
  challengeMode: boolean;
  activeHighlight: string | null;
  onHighlight: (token: string | null) => void;
  onValueChange: (id: string, value: number) => void;
};

export function NaturalNumberSumVisual({ values, toggles, activeStep, activeHighlight, onHighlight }: VisualState) {
  const n = values.n;
  const size = Math.min(32, 360 / (n + 1));
  const originX = 150;
  const originY = 420;
  const showDuplicate = toggles.duplicate && activeStep >= 2;
  const fitDuplicate = activeStep >= 3;
  const showRectangle = activeStep >= 4;
  const labels = toggles.labels;
  const cells = triangleCells(n, originX, originY, size);
  const duplicateCells = Array.from({ length: n }).flatMap((_, col) =>
    Array.from({ length: n - col }, (__, row) => ({
      x: fitDuplicate ? originX + col * size : originX + 360 - col * size,
      y: fitDuplicate ? originY - (col + 1 + row + 1) * size : originY - (row + 1) * size,
      key: `dup-${col}-${row}`,
    })),
  );
  return (
    <VisualFrame label="Staircase duplicate proof for the sum of natural numbers">
      {activeStep >= 0 ? cells.map(({ key, ...cell }) => <Cell key={key} {...cell} size={size} fill="#2563eb" />) : null}
      {showDuplicate ? duplicateCells.map(({ key, ...cell }) => <Cell key={key} {...cell} size={size} fill="#f97316" />) : null}
      {showRectangle ? <rect x={originX} y={originY - (n + 1) * size} width={n * size} height={(n + 1) * size} fill="none" stroke={activeHighlight === "n-plus-1" ? "#fde68a" : "#f8fafc"} strokeWidth={activeHighlight === "n-plus-1" ? "7" : "4"} /> : null}
      {labels ? (
        <>
          <Guide x1={originX} x2={originX + n * size} y={originY + 28} label="n columns" active={activeHighlight === "n"} onFocus={() => onHighlight("n")} onBlur={() => onHighlight(null)} />
          <SideGuide x={originX + n * size + 20} y1={originY - (showRectangle ? n + 1 : n) * size} y2={originY} label={showRectangle ? "n + 1 rows" : "n rows"} active={activeHighlight === "n-plus-1"} onFocus={() => onHighlight("n-plus-1")} onBlur={() => onHighlight(null)} />
          <Info x={535} y={330} lines={[`n = ${n}`, `one staircase = ${(n * (n + 1)) / 2}`, showRectangle ? `rectangle = ${n} x ${n + 1}` : "make a matching copy"]} />
        </>
      ) : null}
    </VisualFrame>
  );
}

export function OddNumberSquareVisual({ values, toggles, activeStep, activeHighlight }: VisualState) {
  const n = values.n;
  const shown = activeStep >= 3 ? n : Math.min(n, Math.max(1, activeStep + 1));
  const cell = Math.min(42, 350 / Math.max(n, 2));
  const startX = 160;
  const startY = 130;
  const labels = toggles.labels;
  return (
    <VisualFrame label="Odd number layers growing into a square">
      {Array.from({ length: shown }).map((_, row) =>
        Array.from({ length: shown }).map((__, col) => {
          const layer = Math.max(row, col) + 1;
          const latest = layer === shown;
          return <Cell key={`${row}-${col}`} x={startX + col * cell} y={startY + row * cell} size={cell} fill={latest ? "#f97316" : layer % 2 ? "#2563eb" : "#14b8a6"} label={labels && latest ? String(2 * layer - 1) : undefined} active={activeHighlight === "latest-odd" && latest} />;
        }),
      )}
      {activeHighlight === "n-square" ? <rect x={startX - 5} y={startY - 5} width={shown * cell + 10} height={shown * cell + 10} fill="none" stroke="#fde68a" strokeWidth="6" /> : null}
      {labels ? <Info x={560} y={285} lines={[`layers shown = ${shown}`, `new layer = ${2 * shown - 1}`, `total = ${shown}^2 = ${shown * shown}`]} /> : null}
    </VisualFrame>
  );
}

export function TriangleAreaVisual({ values, toggles, activeStep, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const base = values.base;
  const height = values.height;
  const scale = 34;
  const x = 150;
  const y = 410;
  const w = base * scale;
  const h = height * scale;
  const showDiagonal = toggles.diagonal || activeStep >= 1;
  const showDuplicate = toggles.duplicate && activeStep >= 2;
  return (
    <VisualFrame label="Rectangle split by a diagonal into two congruent triangles">
      <rect x={x} y={y - h} width={w} height={h} fill="#0f766e" opacity="0.28" stroke="#f8fafc" strokeWidth="3" />
      <polygon points={`${x},${y} ${x + w},${y} ${x + w},${y - h}`} fill="#2563eb" opacity={activeHighlight === "half" ? "1" : "0.9"} stroke={activeHighlight === "half" ? "#fde68a" : "#bfdbfe"} strokeWidth={activeHighlight === "half" ? "5" : "2"} />
      {showDuplicate ? <polygon points={`${x},${y} ${x},${y - h} ${x + w},${y - h}`} fill="#f97316" opacity="0.82" stroke="#fed7aa" strokeWidth="2" /> : null}
      {showDiagonal ? <line x1={x} y1={y} x2={x + w} y2={y - h} stroke="#f8fafc" strokeWidth="4" strokeDasharray={activeStep >= 2 ? "0" : "10 8"} /> : null}
      {toggles.labels ? (
        <>
          <Guide x1={x} x2={x + w} y={y + 28} label={`base = ${base}`} active={activeHighlight === "base"} onFocus={() => onHighlight("base")} onBlur={() => onHighlight(null)} />
          <SideGuide x={x + w + 22} y1={y - h} y2={y} label={`height = ${height}`} active={activeHighlight === "height"} onFocus={() => onHighlight("height")} onBlur={() => onHighlight(null)} />
          <Info x={545} y={320} lines={[`rectangle = ${base} x ${height} = ${base * height}`, `triangle = ${(base * height) / 2}`, "height is perpendicular"]} />
        </>
      ) : null}
      <DraggableHandle label="Drag base" position={{ x: x + w, y: y + 58 }} axis="x" bounds={{ x: [x + 3 * scale, x + 12 * scale] }} snapToGrid={scale} keyboardStep={scale} onChange={(point) => onValueChange("base", Math.round((point.x - x) / scale))} />
      <DraggableHandle label="Drag height" position={{ x: x + w + 56, y: y - h }} axis="y" bounds={{ y: [y - 8 * scale, y - 2 * scale] }} snapToGrid={scale} keyboardStep={scale} onChange={(point) => onValueChange("height", Math.round((y - point.y) / scale))} />
    </VisualFrame>
  );
}

export function ParallelogramShearVisual({ values, toggles, activeStep, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const base = values.base;
  const height = values.height;
  const slant = values.slant;
  const progress = values.progress;
  const scale = 32;
  const x = 135;
  const y = 410;
  const w = base * scale;
  const h = height * scale;
  const offset = slant * scale;
  const slide = activeStep >= 3 ? (progress / 100) * offset : 0;
  const leftCut = `${x + offset},${y - h} ${x + offset - slide},${y} ${x - slide},${y}`;
  return (
    <VisualFrame label="Parallelogram cut and slide area proof">
      <polygon points={`${x + offset},${y - h} ${x + offset + w},${y - h} ${x + w},${y} ${x},${y}`} fill="#2563eb" opacity="0.78" stroke="#bfdbfe" strokeWidth="3" />
      {activeStep >= 2 ? <polygon points={leftCut} fill="#f97316" opacity="0.88" stroke="#fed7aa" strokeWidth="3" /> : null}
      {activeStep >= 4 ? <rect x={x} y={y - h} width={w} height={h} fill="none" stroke={activeHighlight === "base" ? "#fde68a" : "#f8fafc"} strokeWidth={activeHighlight === "base" ? "6" : "4"} /> : null}
      {toggles.heightGuide ? <line x1={x + offset + w + 28} y1={y - h} x2={x + offset + w + 28} y2={y} stroke={activeHighlight === "height" ? "#fde68a" : "#22d3ee"} strokeWidth={activeHighlight === "height" ? "7" : "4"} /> : null}
      {toggles.labels ? (
        <>
          <Guide x1={x} x2={x + w} y={y + 28} label={`base = ${base}`} active={activeHighlight === "base"} onFocus={() => onHighlight("base")} onBlur={() => onHighlight(null)} />
          <SideGuide x={x + offset + w + 40} y1={y - h} y2={y} label={`height = ${height}`} active={activeHighlight === "height"} onFocus={() => onHighlight("height")} onBlur={() => onHighlight(null)} />
          <Info x={555} y={325} lines={[`area = ${base} x ${height} = ${base * height}`, `slant offset = ${slant}`, "cut-and-slide preserves area"]} />
        </>
      ) : null}
      <DraggableHandle label="Drag slant" position={{ x: x + offset, y: y - h - 28 }} axis="x" bounds={{ x: [x, x + 5 * scale] }} snapToGrid={scale} keyboardStep={scale} onChange={(point) => onValueChange("slant", Math.round((point.x - x) / scale))} />
    </VisualFrame>
  );
}

export function SquareOfSumVisual({ values, toggles, activeStep, activeHighlight, onHighlight, onValueChange }: VisualState) {
  const a = values.a;
  const b = values.b;
  const scale = 42;
  const x = 160;
  const y = 110;
  const as = a * scale;
  const bs = b * scale;
  const labelRegions = toggles.labels;
  const showHighlights = toggles.highlights;
  const regionOpacity = (step: number, token: string) => (showHighlights && (activeStep === step || activeHighlight === token || (activeHighlight === "two-ab" && token.startsWith("ab"))) ? 1 : 0.78);
  const regionStroke = (token: string, fallback: string) => (activeHighlight === token || (activeHighlight === "two-ab" && token.startsWith("ab")) ? "#fde68a" : fallback);
  return (
    <VisualFrame label="Area model for the square of a sum">
      <rect x={x} y={y} width={as} height={as} fill="#2563eb" opacity={regionOpacity(3, "a2")} stroke={regionStroke("a2", "#bfdbfe")} strokeWidth={activeHighlight === "a2" ? "6" : "3"} onMouseEnter={() => onHighlight("a2")} onMouseLeave={() => onHighlight(null)} />
      <rect x={x + as} y={y} width={bs} height={as} fill="#14b8a6" opacity={regionOpacity(4, "ab-top")} stroke={regionStroke("ab-top", "#ccfbf1")} strokeWidth={activeHighlight === "ab-top" || activeHighlight === "two-ab" ? "6" : "3"} onMouseEnter={() => onHighlight("ab-top")} onMouseLeave={() => onHighlight(null)} />
      <rect x={x} y={y + as} width={as} height={bs} fill="#14b8a6" opacity={regionOpacity(4, "ab-left")} stroke={regionStroke("ab-left", "#ccfbf1")} strokeWidth={activeHighlight === "ab-left" || activeHighlight === "two-ab" ? "6" : "3"} onMouseEnter={() => onHighlight("ab-left")} onMouseLeave={() => onHighlight(null)} />
      <rect x={x + as} y={y + as} width={bs} height={bs} fill="#f97316" opacity={regionOpacity(3, "b2")} stroke={regionStroke("b2", "#fed7aa")} strokeWidth={activeHighlight === "b2" ? "6" : "3"} onMouseEnter={() => onHighlight("b2")} onMouseLeave={() => onHighlight(null)} />
      <rect x={x} y={y} width={as + bs} height={as + bs} fill="none" stroke="#f8fafc" strokeWidth="4" />
      <line x1={x + as} y1={y} x2={x + as} y2={y + as + bs} stroke="#f8fafc" strokeWidth="3" strokeDasharray="8 6" />
      <line x1={x} y1={y + as} x2={x + as + bs} y2={y + as} stroke="#f8fafc" strokeWidth="3" strokeDasharray="8 6" />
      {labelRegions ? (
        <>
          <Text x={x + as / 2} y={y + as / 2} text="a^2" />
          <Text x={x + as + bs / 2} y={y + as / 2} text="ab" />
          <Text x={x + as / 2} y={y + as + bs / 2} text="ab" />
          <Text x={x + as + bs / 2} y={y + as + bs / 2} text="b^2" />
          <Info x={575} y={320} lines={[`a = ${a}, b = ${b}`, `full = (${a} + ${b})^2 = ${(a + b) ** 2}`, `parts = ${a ** 2} + ${a * b} + ${a * b} + ${b ** 2}`]} />
        </>
      ) : null}
      <DraggableHandle label="Drag a split" position={{ x: x + as, y: y - 28 }} axis="x" bounds={{ x: [x + 2 * scale, x + 8 * scale] }} snapToGrid={scale} keyboardStep={scale} onChange={(point) => onValueChange("a", Math.round((point.x - x) / scale))} />
      <DraggableHandle label="Drag b split" position={{ x: x + as + bs, y: y + as + bs + 30 }} axis="x" bounds={{ x: [x + as + 1 * scale, x + as + 6 * scale] }} snapToGrid={scale} keyboardStep={scale} onChange={(point) => onValueChange("b", Math.round((point.x - x - as) / scale))} />
    </VisualFrame>
  );
}

function triangleCells(n: number, originX: number, originY: number, size: number) {
  return Array.from({ length: n }).flatMap((_, col) =>
    Array.from({ length: col + 1 }, (__, row) => ({
      x: originX + col * size,
      y: originY - (row + 1) * size,
      key: `cell-${col}-${row}`,
    })),
  );
}

function VisualFrame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="bg-white p-2 dark:bg-slate-950">
      <svg viewBox="0 0 900 540" role="img" aria-label={label} className="h-auto min-h-[320px] w-full max-w-full">
        <rect x="28" y="24" width="844" height="492" rx="18" fill="#020617" />
        {children}
      </svg>
    </div>
  );
}

function Cell({ x, y, size, fill, label, active = false }: { x: number; y: number; size: number; fill: string; label?: string; active?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={size - 2} height={size - 2} rx="5" fill={fill} stroke={active ? "#fde68a" : "#f8fafc"} strokeWidth={active ? "4" : "1.5"} />
      {label ? <Text x={x + size / 2} y={y + size / 2 + 5} text={label} small /> : null}
    </g>
  );
}

function Text({ x, y, text, small = false }: { x: number; y: number; text: string; small?: boolean }) {
  return <text x={x} y={y} textAnchor="middle" fill="#f8fafc" fontSize={small ? 14 : 24} fontWeight="900">{text}</text>;
}

function Guide({ x1, x2, y, label, active = false, onFocus, onBlur }: { x1: number; x2: number; y: number; label: string; active?: boolean; onFocus?: () => void; onBlur?: () => void }) {
  return (
    <g tabIndex={0} onFocus={onFocus} onBlur={onBlur}>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={active ? "#fde68a" : "#f8fafc"} strokeWidth={active ? "7" : "3"} />
      <Text x={(x1 + x2) / 2} y={y + 28} text={label} small />
    </g>
  );
}

function SideGuide({ x, y1, y2, label, active = false, onFocus, onBlur }: { x: number; y1: number; y2: number; label: string; active?: boolean; onFocus?: () => void; onBlur?: () => void }) {
  return (
    <g tabIndex={0} onFocus={onFocus} onBlur={onBlur}>
      <line x1={x} y1={y1} x2={x} y2={y2} stroke={active ? "#fde68a" : "#22d3ee"} strokeWidth={active ? "7" : "3"} />
      <text x={x + 14} y={(y1 + y2) / 2 + 5} fill="#f8fafc" fontSize="14" fontWeight="900">{label}</text>
    </g>
  );
}

function Info({ x, y, lines }: { x: number; y: number; lines: string[] }) {
  return (
    <g>
      <rect x={x - 18} y={y - 34} width="310" height={Math.max(82, lines.length * 28 + 24)} rx="16" fill="#0f172a" opacity="0.92" stroke="#334155" />
      {lines.map((line, index) => <text key={line} x={x} y={y + index * 28} fill="#f8fafc" fontSize="14" fontWeight="800">{line}</text>)}
    </g>
  );
}
