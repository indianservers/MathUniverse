import type { PointerEvent } from "react";

export type ArgandPoint = { re: number; im: number };

type ArgandFigureProps = {
  re: number;
  im: number;
  wRe?: number;
  wIm?: number;
  resRe?: number;
  resIm?: number;
  showConjugate?: boolean;
  showModulus?: boolean;
  showArgument?: boolean;
  showUnit?: boolean;
  unitRadius?: number;
  showParallelogram?: boolean;
  roots?: ArgandPoint[];
  width?: number;
  height?: number;
  scale?: number;
  label?: string;
  onPick?: (re: number, im: number) => void;
};

function ticks(origin: number, scale: number, count: number) {
  const half = Math.floor(count / 2);
  return Array.from({ length: count }, (_, i) => origin + (i - half) * scale);
}

export default function ArgandFigure({
  re,
  im,
  wRe,
  wIm,
  resRe,
  resIm,
  showConjugate = false,
  showModulus = false,
  showArgument = false,
  showUnit = false,
  unitRadius = 1,
  showParallelogram = false,
  roots,
  width = 420,
  height = 360,
  scale = 28,
  label,
  onPick,
}: ArgandFigureProps) {
  const ox = width / 2;
  const oy = height / 2;
  const r = Math.hypot(re, im);
  const arg = Math.atan2(im, re);
  const zx = ox + re * scale;
  const zy = oy - im * scale;
  const pick = (event: PointerEvent<SVGSVGElement>) => {
    if (!onPick) return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width) * width;
    const y = ((event.clientY - box.top) / box.height) * height;
    onPick((x - ox) / scale, (oy - y) / scale);
  };
  return (
    <svg
      className={`msk-graph cx-mini-art${onPick ? " is-interactive" : ""}`}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={label ?? "Argand plane"}
      onPointerDown={onPick ? pick : undefined}
    >
      <rect width={width} height={height} fill="#f8fbff" />
      {ticks(ox, scale, 13).map((x) => (
        <line key={`v${x}`} x1={x} y1="12" x2={x} y2={height - 12} stroke="#e8eef7" />
      ))}
      {ticks(oy, scale, 11).map((y) => (
        <line key={`h${y}`} x1="12" y1={y} x2={width - 12} y2={y} stroke="#e8eef7" />
      ))}
      <line className="cx-axis" x1="16" y1={oy} x2={width - 16} y2={oy} />
      <line className="cx-axis" x1={ox} y1="16" x2={ox} y2={height - 16} />
      <text x={width - 28} y={oy - 8} fontSize="11" fill="#334155">Re</text>
      <text x={ox + 8} y="22" fontSize="11" fill="#334155">Im</text>
      {showUnit ? <circle cx={ox} cy={oy} r={unitRadius * scale} fill="none" stroke="#94a3b8" strokeDasharray="4 3" /> : null}
      {showModulus ? <circle cx={ox} cy={oy} r={r * scale} fill="none" stroke="#08b9dd" strokeDasharray="5 4" /> : null}
      {showArgument ? (
        <path
          d={`M ${ox + 28} ${oy} A 28 28 0 ${arg < 0 ? 0 : 0} ${arg < 0 ? 0 : 1} ${ox + 28 * Math.cos(arg)} ${oy - 28 * Math.sin(arg)}`}
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2"
        />
      ) : null}
      {showParallelogram && wRe !== undefined && wIm !== undefined && resRe !== undefined && resIm !== undefined ? (
        <polygon
          points={`${ox},${oy} ${ox + re * scale},${oy - im * scale} ${ox + resRe * scale},${oy - resIm * scale} ${ox + wRe * scale},${oy - wIm * scale}`}
          fill="rgba(245,158,11,.08)"
          stroke="#f59e0b"
          strokeDasharray="4 3"
        />
      ) : null}
      {roots?.map((root, index) => (
        <circle key={`${root.re}-${root.im}-${index}`} cx={ox + root.re * scale} cy={oy - root.im * scale} r="5" fill="#147df2" />
      ))}
      {wRe !== undefined && wIm !== undefined ? (
        <line x1={ox} y1={oy} x2={ox + wRe * scale} y2={oy - wIm * scale} stroke="#8b45f4" strokeWidth="2.2" />
      ) : null}
      {resRe !== undefined && resIm !== undefined ? (
        <line x1={ox} y1={oy} x2={ox + resRe * scale} y2={oy - resIm * scale} stroke="#f59e0b" strokeWidth="2.4" />
      ) : null}
      {showConjugate ? (
        <line x1={ox} y1={oy} x2={zx} y2={oy + im * scale} stroke="#f59e0b" strokeDasharray="4 3" strokeWidth="2" />
      ) : null}
      <line x1={ox} y1={oy} x2={zx} y2={zy} stroke="#08a8cf" strokeWidth="3" />
      <circle cx={zx} cy={zy} r="6" fill="#147df2" />
      <text x={zx + 8} y={zy - 8} fontSize="12" fill="#0b1b3f">
        z = {re.toFixed(1)} {im < 0 ? "−" : "+"} {Math.abs(im).toFixed(1)}i
      </text>
    </svg>
  );
}
