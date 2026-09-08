import {useRef,type PointerEvent as ReactPointerEvent} from "react";
type Point={x:number;y:number};
const formatDistance=(p:Point)=>Math.hypot(p.x,p.y).toFixed(2);
export function LegacyPointGraph27({
  point,
  projections,
  label,
  onPoint,
}: {
  point: Point;
  projections: boolean;
  label: string;
  onPoint: (point: Point) => void;
}) {
  const svg = useRef<SVGSVGElement>(null),
    dragging = useRef(false),
    map = (p: Point) => ({ x: 192 + p.x * 32, y: 232 - p.y * 32 }),
    mapped = map(point);
  const update = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!dragging.current || !svg.current) return;
    const matrix = svg.current.getScreenCTM();
    if (!matrix) return;
    const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(
      matrix.inverse(),
    );
    onPoint({ x: (p.x - 192) / 32, y: (232 - p.y) / 32 });
  };
  return (
    <svg
      ref={svg}
      className="labels-graph"
      viewBox="0 0 445 463"
      role="img"
      aria-label="Draggable point P with dynamic label"
      onPointerMove={update}
      onPointerUp={() => {
        dragging.current = false;
      }}
    >
      <defs>
        <pattern
          id="labels-grid"
          width="16"
          height="16"
          patternUnits="userSpaceOnUse"
        >
          <path d="M16 0H0V16" fill="none" stroke="#e8edf1" />
        </pattern>
      </defs>
      <rect width="445" height="463" fill="url(#labels-grid)" />
      <line className="axis" x1="0" y1="232" x2="445" y2="232" />
      <line className="axis" x1="192" y1="0" x2="192" y2="463" />
      {projections ? (
        <>
          <line
            className="projection"
            x1={mapped.x}
            y1={mapped.y}
            x2={mapped.x}
            y2="232"
          />
          <line
            className="projection"
            x1="192"
            y1={mapped.y}
            x2={mapped.x}
            y2={mapped.y}
          />
          <line
            className="label-radius-line"
            x1="192"
            y1="232"
            x2={mapped.x}
            y2={mapped.y}
          />
        </>
      ) : null}
      <circle
        data-testid="dynamic-label-point-handle"
        cx={mapped.x}
        cy={mapped.y}
        r="7"
        onPointerDown={(event) => {
          dragging.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
      />
      <text className="p-label" x={mapped.x + 8} y={mapped.y - 8}>
        P
      </text>
      <g
        className="dynamic-callout"
        transform={`translate(${Math.min(mapped.x + 26, 268)} ${Math.max(mapped.y - 103, 18)})`}
      >
        <rect width="170" height="63" rx="8" />
        <text x="14" y="25">
          {label.split(/, distance| \| d| -> distance/)[0]}
        </text>
        <text x="14" y="48">
          {label.includes("distance")
            ? `distance from origin = ${formatDistance(point)}`
            : label.includes("d =")
              ? `d = ${formatDistance(point)}`
              : ""}
        </text>
      </g>
      {Array.from({ length: 13 }, (_, index) => index - 6).map((value) => (
        <text className="tick" key={value} x={188 + value * 32} y="250">
          {value}
        </text>
      ))}
      {Array.from({ length: 13 }, (_, index) => index - 6)
        .filter(Boolean)
        .map((value) => (
          <text className="tick" key={`y-${value}`} x="176" y={236 - value * 32}>
            {value}
          </text>
        ))}
    </svg>
  );
}
export function LegacyPreviewGraph27({ label }: { label: string }) {
  return (
    <div className="preview-graph">
      <span className="axis x" />
      <span className="axis y" />
      <i>●</i>
      <b>P</b>
      <output>{label}</output>
    </div>
  );
}

