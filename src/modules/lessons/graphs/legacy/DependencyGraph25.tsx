import { useRef, type PointerEvent as ReactPointerEvent } from "react";
type Point = {x:number;y:number};
const fmt=(value:number)=>Number.isInteger(value)?String(value):value.toFixed(1);
export function LegacyDependencyGraph25({
  a,
  b,
  midpoint,
  onPoint,
}: {
  a: Point;
  b: Point;
  midpoint: Point;
  onPoint: (name: "a" | "b", point: Point) => void;
}) {
  const svg = useRef<SVGSVGElement>(null),
    dragging = useRef<"a" | "b" | null>(null),
    map = (point: Point) => ({ x: 80 + point.x * 72, y: 300 - point.y * 52 });
  const pa = map(a),
    pb = map(b),
    pm = map(midpoint);
  const update = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!dragging.current || !svg.current) return;
    const matrix = svg.current.getScreenCTM();
    if (!matrix) return;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(
      matrix.inverse(),
    );
    onPoint(dragging.current, {
      x: (point.x - 80) / 72,
      y: (300 - point.y) / 52,
    });
  };
  return (
    <svg
      ref={svg}
      viewBox="0 0 720 365"
      role="img"
      aria-label="Draggable independent points A and B with dependent midpoint"
      onPointerMove={update}
      onPointerUp={() => {
        dragging.current = null;
      }}
    >
      <defs>
        <pattern
          id="dependency-grid"
          width="36"
          height="26"
          patternUnits="userSpaceOnUse"
        >
          <path d="M36 0H0V26" fill="none" stroke="#e7ebef" />
        </pattern>
        <filter id="point-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity=".28" />
        </filter>
      </defs>
      <rect width="720" height="365" fill="url(#dependency-grid)" />
      <line className="axis" x1="8" y1="300" x2="705" y2="300" />
      <line className="axis" x1="80" y1="16" x2="80" y2="360" />
      <text x="700" y="291">
        x
      </text>
      <text x="89" y="19">
        y
      </text>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((value) => (
        <text className="tick" key={`x${value}`} x={75 + value * 72} y="320">
          {value}
        </text>
      ))}
      {[-1, 1, 2, 3, 4, 5].map((value) => (
        <text className="tick" key={`y${value}`} x="58" y={305 - value * 52}>
          {value}
        </text>
      ))}
      <line className="segment" x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} />
      <circle
        data-testid="dependency-handle-a"
        className="parent"
        cx={pa.x}
        cy={pa.y}
        r="8"
        onPointerDown={(event) => {
          dragging.current = "a";
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
      />
      <circle
        data-testid="dependency-handle-b"
        className="parent"
        cx={pb.x}
        cy={pb.y}
        r="8"
        onPointerDown={(event) => {
          dragging.current = "b";
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
      />
      <circle className="child" cx={pm.x} cy={pm.y} r="8" />
      <text className="parent-label" x={pa.x - 20} y={pa.y - 23}>
        A({a.x}, {a.y})
      </text>
      <text className="parent-label" x={pb.x - 20} y={pb.y - 23}>
        B({b.x}, {b.y})
      </text>
      <text className="child-label" x={pm.x - 30} y={pm.y - 23}>
        M({fmt(midpoint.x)}, {fmt(midpoint.y)})
      </text>
    </svg>
  );
}

