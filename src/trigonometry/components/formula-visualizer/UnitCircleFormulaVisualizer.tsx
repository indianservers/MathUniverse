import { type PointerEvent, useMemo } from "react";
import {
  type TrigFormulaId,
  type TrigFormulaValues,
  formatTrigNumber,
  specialAngleMarkers,
} from "../../utils/trigFormulaUtils";

type UnitCircleFormulaVisualizerProps = {
  values: TrigFormulaValues;
  selectedFormulaId: TrigFormulaId;
  onAngleChange: (degrees: number) => void;
  compareEvenOdd?: boolean;
  compareComplementary?: boolean;
};

const viewBox = { width: 560, height: 430 };
const center = { x: 210, y: 215 };
const radius = 132;
const tangentX = center.x + radius;
const markerRadius = 148;

export default function UnitCircleFormulaVisualizer({
  values,
  selectedFormulaId,
  onAngleChange,
  compareEvenOdd = false,
  compareComplementary = false,
}: UnitCircleFormulaVisualizerProps) {
  const geometry = useMemo(() => {
    const angle = values.radians;
    const point = {
      x: center.x + Math.cos(angle) * radius,
      y: center.y - Math.sin(angle) * radius,
    };
    const tanY = values.tan === null ? null : center.y - values.tan * radius;
    return {
      point,
      projectionX: { x: point.x, y: center.y },
      projectionY: { x: center.x, y: point.y },
      tanY,
      tanVisibleY: tanY === null ? null : Math.max(32, Math.min(viewBox.height - 32, tanY)),
    };
  }, [values]);

  const highlightSin = ["sin", "tan-ratio", "cot-ratio", "cosec", "sin-square", "pythagorean", "pythagorean-cot", "even-sin", "comp-cos"].includes(selectedFormulaId);
  const highlightCos = ["cos", "tan-ratio", "cot-ratio", "sec", "cos-square", "pythagorean", "pythagorean-tan", "even-cos", "comp-sin"].includes(selectedFormulaId);
  const highlightTan = ["tan", "cot", "tan-ratio", "cot-ratio", "pythagorean-tan", "even-tan", "comp-tan"].includes(selectedFormulaId);
  const showSquares = ["sin-square", "cos-square", "pythagorean", "pythagorean-tan", "pythagorean-cot"].includes(selectedFormulaId);
  const mirroredPoint = { x: geometry.point.x, y: center.y + (center.y - geometry.point.y) };
  const complementaryDegrees = 90 - Math.min(90, Math.max(0, values.degrees));
  const complementaryRadians = (complementaryDegrees * Math.PI) / 180;
  const complementaryPoint = {
    x: center.x + Math.cos(complementaryRadians) * radius,
    y: center.y - Math.sin(complementaryRadians) * radius,
  };

  function updateFromPointer(event: PointerEvent<SVGSVGElement>) {
    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * viewBox.width;
    const y = ((event.clientY - rect.top) / rect.height) * viewBox.height;
    const raw = (Math.atan2(center.y - y, x - center.x) * 180) / Math.PI;
    onAngleChange(raw < 0 ? raw + 360 : raw);
  }

  function handlePointerDown(event: PointerEvent<SVGSVGElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    updateFromPointer(event);
  }

  function handlePointerMove(event: PointerEvent<SVGSVGElement>) {
    if (event.buttons !== 1) return;
    updateFromPointer(event);
  }

  const sinSide = 76 * Math.abs(values.sin);
  const cosSide = 76 * Math.abs(values.cos);
  const identityWidth = 150;
  const sinBar = identityWidth * values.sinSquare;
  const cosBar = identityWidth * values.cosSquare;

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-950 p-3 shadow-inner shadow-cyan-950/30 dark:border-white/10" data-testid="unit-circle-formula-visualizer">
      <svg
        viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
        className="h-[430px] w-full touch-none select-none"
        role="img"
        aria-label="Interactive unit circle formula visualizer"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        data-testid="formula-unit-circle-svg"
      >
        <defs>
          <radialGradient id="formula-visualizer-bg" cx="38%" cy="38%" r="76%">
            <stop offset="0%" stopColor="#164e63" stopOpacity="0.55" />
            <stop offset="62%" stopColor="#0f172a" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>
          <filter id="formula-visualizer-glow" x="-45%" y="-45%" width="190%" height="190%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width={viewBox.width} height={viewBox.height} rx="18" fill="url(#formula-visualizer-bg)" />
        <g opacity="0.18">
          {[-2, -1, 0, 1, 2].map((offset) => (
            <line key={`v-${offset}`} x1={center.x + offset * 66} x2={center.x + offset * 66} y1="36" y2="392" stroke="#e2e8f0" />
          ))}
          {[-2, -1, 0, 1, 2].map((offset) => (
            <line key={`h-${offset}`} x1="42" x2="380" y1={center.y + offset * 66} y2={center.y + offset * 66} stroke="#e2e8f0" />
          ))}
        </g>

        <line x1="40" x2="390" y1={center.y} y2={center.y} stroke="#cbd5e1" strokeOpacity="0.75" />
        <line x1={center.x} x2={center.x} y1="42" y2="388" stroke="#cbd5e1" strokeOpacity="0.75" />
        <circle cx={center.x} cy={center.y} r={radius} fill="rgba(34,211,238,0.08)" stroke="#67e8f9" strokeWidth="3" />

        {specialAngleMarkers.map((angle) => {
          const radians = (angle * Math.PI) / 180;
          const x = center.x + Math.cos(radians) * markerRadius;
          const y = center.y - Math.sin(radians) * markerRadius;
          return (
            <g key={angle}>
              <line
                x1={center.x + Math.cos(radians) * (radius - 5)}
                y1={center.y - Math.sin(radians) * (radius - 5)}
                x2={center.x + Math.cos(radians) * (radius + 7)}
                y2={center.y - Math.sin(radians) * (radius + 7)}
                stroke="#94a3b8"
                strokeWidth="2"
              />
              <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill="#cbd5e1" fontSize="12" fontWeight="700">
                {angle} deg
              </text>
            </g>
          );
        })}

        <path
          d={`M ${center.x + 44} ${center.y} A 44 44 0 ${values.degrees > 180 ? 1 : 0} 0 ${center.x + Math.cos(values.radians) * 44} ${center.y - Math.sin(values.radians) * 44}`}
          fill="none"
          stroke="#f59e0b"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <text x={center.x + 52} y={center.y - 22} fill="#fef3c7" fontSize="15" fontWeight="900">
          theta
        </text>

        <line
          x1={center.x}
          y1={center.y}
          x2={geometry.point.x}
          y2={geometry.point.y}
          stroke="#c084fc"
          strokeWidth="5"
          strokeLinecap="round"
          filter="url(#formula-visualizer-glow)"
        />
        {compareEvenOdd && (
          <>
            <line x1={center.x} y1={center.y} x2={mirroredPoint.x} y2={mirroredPoint.y} stroke="#fb7185" strokeWidth="4" strokeLinecap="round" opacity="0.78" />
            <circle cx={mirroredPoint.x} cy={mirroredPoint.y} r="6" fill="#fb7185" />
            <text x={mirroredPoint.x + 10} y={mirroredPoint.y + 18} fill="#fecdd3" fontSize="12" fontWeight="800">
              -theta
            </text>
          </>
        )}
        {compareComplementary && (
          <>
            <line x1={center.x} y1={center.y} x2={complementaryPoint.x} y2={complementaryPoint.y} stroke="#22d3ee" strokeWidth="4" strokeLinecap="round" opacity="0.78" />
            <circle cx={complementaryPoint.x} cy={complementaryPoint.y} r="6" fill="#22d3ee" />
            <text x={complementaryPoint.x + 10} y={complementaryPoint.y - 12} fill="#cffafe" fontSize="12" fontWeight="800">
              90 deg - theta
            </text>
          </>
        )}
        <line
          x1={center.x}
          y1={center.y}
          x2={geometry.projectionX.x}
          y2={geometry.projectionX.y}
          stroke={highlightCos ? "#38bdf8" : "#94a3b8"}
          strokeWidth={highlightCos ? 6 : 3}
          strokeLinecap="round"
          opacity={highlightCos ? 1 : 0.65}
        />
        <line
          x1={geometry.projectionX.x}
          y1={geometry.projectionX.y}
          x2={geometry.point.x}
          y2={geometry.point.y}
          stroke={highlightSin ? "#fb7185" : "#94a3b8"}
          strokeWidth={highlightSin ? 6 : 3}
          strokeLinecap="round"
          opacity={highlightSin ? 1 : 0.65}
        />
        <line x1={geometry.point.x} y1={geometry.point.y} x2={geometry.projectionX.x} y2={geometry.projectionX.y} stroke="#f8fafc" strokeOpacity="0.35" strokeDasharray="5 5" />

        <line x1={tangentX} y1="50" x2={tangentX} y2="380" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="7 5" />
        {geometry.tanVisibleY !== null && (
          <>
            <line
              x1={center.x}
              y1={center.y}
              x2={tangentX}
              y2={geometry.tanVisibleY}
              stroke="#f59e0b"
              strokeWidth="2"
              strokeDasharray="6 5"
              opacity="0.72"
            />
            <line
              x1={tangentX}
              y1={center.y}
              x2={tangentX}
              y2={geometry.tanVisibleY}
              stroke={highlightTan ? "#facc15" : "#fbbf24"}
              strokeWidth={highlightTan ? 7 : 3}
              strokeLinecap="round"
              opacity={highlightTan ? 1 : 0.68}
            />
            <circle cx={tangentX} cy={geometry.tanVisibleY} r="5" fill="#facc15" />
          </>
        )}

        <circle cx={geometry.point.x} cy={geometry.point.y} r="8" fill="#f59e0b" filter="url(#formula-visualizer-glow)" />
        <text x={geometry.point.x + 12} y={geometry.point.y - 12} fill="#fef9c3" fontSize="13" fontWeight="800">
          (cos theta, sin theta)
        </text>

        <g transform="translate(405 56)">
          <rect x="0" y="0" width="132" height="120" rx="14" fill="rgba(15,23,42,0.86)" stroke="rgba(148,163,184,0.45)" />
          <text x="14" y="26" fill="#e2e8f0" fontSize="13" fontWeight="900">
            Live values
          </text>
          <text x="14" y="52" fill="#fb7185" fontSize="12" fontWeight="800">
            sin = {formatTrigNumber(values.sin)}
          </text>
          <text x="14" y="74" fill="#38bdf8" fontSize="12" fontWeight="800">
            cos = {formatTrigNumber(values.cos)}
          </text>
          <text x="14" y="96" fill="#facc15" fontSize="12" fontWeight="800">
            tan = {values.tan === null ? "undefined" : formatTrigNumber(values.tan)}
          </text>
          <text x="14" y="116" fill="#a7f3d0" fontSize="12" fontWeight="800">
            cot = {values.cot === null ? "undefined" : formatTrigNumber(values.cot)}
          </text>
        </g>

        <g transform="translate(398 205)" opacity={showSquares ? 1 : 0.46}>
          <rect x="0" y="0" width="146" height="170" rx="14" fill="rgba(15,23,42,0.86)" stroke="rgba(148,163,184,0.45)" />
          <text x="14" y="27" fill="#e2e8f0" fontSize="13" fontWeight="900">
            Square areas
          </text>
          <rect x="18" y="48" width={cosSide} height={cosSide} fill="rgba(56,189,248,0.55)" stroke="#38bdf8" strokeWidth="2" />
          <rect x="90" y="48" width={sinSide} height={sinSide} fill="rgba(251,113,133,0.55)" stroke="#fb7185" strokeWidth="2" />
          <text x="18" y="139" fill="#38bdf8" fontSize="11" fontWeight="800">
            cos^2 {formatTrigNumber(values.cosSquare)}
          </text>
          <text x="18" y="157" fill="#fb7185" fontSize="11" fontWeight="800">
            sin^2 {formatTrigNumber(values.sinSquare)}
          </text>
        </g>

        <g transform="translate(54 372)" opacity={selectedFormulaId === "pythagorean" ? 1 : 0.58}>
          <rect x="0" y="0" width={identityWidth} height="14" rx="7" fill="rgba(56,189,248,0.28)" stroke="#38bdf8" />
          <rect x={cosBar} y="0" width={sinBar} height="14" rx="7" fill="rgba(251,113,133,0.72)" />
          <line x1={cosBar} x2={cosBar} y1="-4" y2="18" stroke="#f8fafc" strokeOpacity="0.72" />
          <text x="0" y="-9" fill="#e2e8f0" fontSize="12" fontWeight="900">
            cos^2 + sin^2 = {formatTrigNumber(values.identitySum)}
          </text>
        </g>
      </svg>
    </div>
  );
}
