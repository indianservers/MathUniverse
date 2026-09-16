import "./lessonGraphInk.css";

export const LESSON_GRAPH_INK = {
  chord: "#2563eb",
  chord2: "#7c3aed",
  tangent: "#f59e0b",
  angle: "#ec4899",
} as const;

const SWATCHES = [
  { id: "chord", label: "Chord", color: LESSON_GRAPH_INK.chord, glow: true },
  { id: "tangent", label: "Tangent", color: LESSON_GRAPH_INK.tangent, glow: true },
  { id: "angle", label: "Angle", color: LESSON_GRAPH_INK.angle, glow: true },
] as const;

/** Color key for lesson figures. Studios / workspaces must not import this. */
export function LessonGraphInkLegend({ x = 16, y = 16 }: { x?: number; y?: number }) {
  return (
    <g data-lesson-ink-legend aria-label="Chord, tangent, and angle colors">
      {SWATCHES.map((item, index) => (
        <g key={item.id} transform={`translate(${x + index * 118} ${y})`}>
          <line
            className={item.id}
            x1="0"
            y1="0"
            x2="26"
            y2="0"
            stroke={item.color}
            strokeWidth="4"
            strokeLinecap="round"
            data-glow="true"
          />
          <text x="32" y="4" fontSize="11" fontWeight="800" fill="#334155">
            {item.label}
            {item.glow ? " · glow" : ""}
          </text>
        </g>
      ))}
    </g>
  );
}

export const lessonGraphInkProps = {
  "data-lesson-graph-ink": true,
} as const;
