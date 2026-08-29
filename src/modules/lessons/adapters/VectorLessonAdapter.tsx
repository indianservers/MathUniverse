import { useEffect, useState, type PointerEvent } from "react";
import SliderControl, {
  SliderGroup,
} from "../../../components/ui/SliderControl";
import {
  dotProduct,
  vectorAdd,
  vectorMagnitude,
  vectorProjection,
  type Vector2,
} from "../../../utils/mathEngine/linearAlgebraUtils";
import AdapterFrame from "../components/AdapterFrame";
import type { LessonAdapterProps } from "../types";
import VectorIntroductionTargetLesson183 from "./VectorIntroductionTargetLesson183";
import ComponentFormTargetLesson184 from "./ComponentFormTargetLesson184";
import PositionVectorsTargetLesson185 from "./PositionVectorsTargetLesson185";
import VectorAdditionTargetLesson186 from "./VectorAdditionTargetLesson186";
import VectorSubtractionTargetLesson187 from "./VectorSubtractionTargetLesson187";
import ScalarMultiplicationTargetLesson188 from "./ScalarMultiplicationTargetLesson188";
import MagnitudeUnitVectorsTargetLesson189 from "./MagnitudeUnitVectorsTargetLesson189";
import DotProductTargetLesson190 from "./DotProductTargetLesson190";

function guidanceFor(title: string) {
  const name = title.toLowerCase();
  if (name.includes("introduction"))
    return [
      "Vector rule",
      "A vector has size and direction.",
      "It describes movement, not just a point.",
    ];
  if (name.includes("component"))
    return [
      "Component form",
      "Write horizontal part first and vertical part second.",
      "Component order is (x,y).",
    ];
  if (name.includes("position"))
    return [
      "Position vector",
      "A position vector starts at the origin.",
      "Point (a,b) has vector (a,b).",
    ];
  if (name.includes("addition"))
    return [
      "Vector addition",
      "Add matching components.",
      "Head-to-tail arrows show the same result.",
    ];
  if (name.includes("subtraction"))
    return [
      "Vector subtraction",
      "Subtract matching components in order.",
      "u-v is different from v-u.",
    ];
  if (name.includes("scalar"))
    return [
      "Scalar multiplication",
      "Multiply every component by the scalar.",
      "A negative scalar reverses direction.",
    ];
  if (name.includes("magnitude"))
    return [
      "Magnitude",
      "Length is sqrt(x^2+y^2).",
      "A unit vector has length 1.",
    ];
  if (name.includes("dot product"))
    return [
      "Dot product",
      "Multiply matching components and add.",
      "The answer is a scalar.",
    ];
  if (name.includes("cross product"))
    return [
      "Cross product",
      "In 3D it gives a perpendicular vector.",
      "Magnitude gives parallelogram area.",
    ];
  if (name.includes("projection"))
    return [
      "Projection",
      "Projection is a vector shadow along another vector.",
      "It keeps only the target-direction part.",
    ];
  if (name.includes("linear combinations"))
    return [
      "Linear combination",
      "Scale vectors first, then add.",
      "This builds new vectors from given directions.",
    ];
  if (name.includes("line"))
    return [
      "Vector line",
      "r = a + tv uses a point and direction.",
      "t is a scalar parameter.",
    ];
  if (name.includes("plane"))
    return [
      "Vector plane",
      "A plane needs a point and two non-parallel directions.",
      "Two parameters move across the plane.",
    ];
  if (name.includes("relative motion"))
    return [
      "Relative motion",
      "Subtract velocities to compare from another object.",
      "Use direction as well as speed.",
    ];
  if (name.includes("force"))
    return [
      "Force vectors",
      "Add force components to find resultant force.",
      "Force has size and direction.",
    ];
  return [
    "Vector rule",
    "Use components and arrows together.",
    "Check whether the result is a vector or scalar.",
  ];
}

export default function VectorLessonAdapter({
  lesson,
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [ux, setUx] = useState(3);
  const [uy, setUy] = useState(2);
  const [vx, setVx] = useState(-1);
  const [vy, setVy] = useState(3);
  const [activeVector, setActiveVector] = useState<"u" | "v">("u");
  useEffect(() => {
    setUx(3);
    setUy(2);
    setVx(-1);
    setVy(3);
    setActiveVector("u");
  }, [resetToken]);

  if (lesson.id === 183)
    return (
      <VectorIntroductionTargetLesson183
        lesson={lesson}
        resetToken={resetToken}
        onInteraction={onInteraction}
      />
    );
  if (lesson.id === 184)
    return (
      <ComponentFormTargetLesson184
        lesson={lesson}
        resetToken={resetToken}
        onInteraction={onInteraction}
      />
    );
  if (lesson.id === 185)
    return (
      <PositionVectorsTargetLesson185
        lesson={lesson}
        resetToken={resetToken}
        onInteraction={onInteraction}
      />
    );
  if (lesson.id === 186)
    return (
      <VectorAdditionTargetLesson186
        lesson={lesson}
        resetToken={resetToken}
        onInteraction={onInteraction}
      />
    );
  if (lesson.id === 187)
    return (
      <VectorSubtractionTargetLesson187
        lesson={lesson}
        resetToken={resetToken}
        onInteraction={onInteraction}
      />
    );
  if (lesson.id === 188)
    return (
      <ScalarMultiplicationTargetLesson188
        lesson={lesson}
        resetToken={resetToken}
        onInteraction={onInteraction}
      />
    );
  if (lesson.id === 189)
    return (
      <MagnitudeUnitVectorsTargetLesson189
        lesson={lesson}
        resetToken={resetToken}
        onInteraction={onInteraction}
      />
    );
  if (lesson.id === 190)
    return (
      <DotProductTargetLesson190
        lesson={lesson}
        resetToken={resetToken}
        onInteraction={onInteraction}
      />
    );

  const u: Vector2 = [ux, uy];
  const v: Vector2 = [vx, vy];
  const sum = vectorAdd(u, v);
  const dot = dotProduct(u, v);
  const projection = vectorProjection(u, v).result;
  const angle =
    (Math.acos(
      Math.max(
        -1,
        Math.min(1, dot / (vectorMagnitude(u) * vectorMagnitude(v) || 1)),
      ),
    ) *
      180) /
    Math.PI;
  const guidance = guidanceFor(lesson.title);
  const update = (setter: (value: number) => void) => (value: number) => {
    setter(value);
    onInteraction();
  };
  const updateVectorFromPointer = (event: PointerEvent<SVGSVGElement>) => {
    if (event.type === "pointermove" && event.buttons !== 1) return;
    if (event.type === "pointerdown")
      event.currentTarget.setPointerCapture?.(event.pointerId);
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(
      -5,
      Math.min(
        5,
        Math.round(
          (((event.clientX - rect.left) / rect.width) * 640 - 320) / 19,
        ) / 2,
      ),
    );
    const y = Math.max(
      -5,
      Math.min(
        5,
        Math.round(
          (180 - ((event.clientY - rect.top) / rect.height) * 360) / 19,
        ) / 2,
      ),
    );
    const distanceToU = Math.hypot(x - ux, y - uy);
    const distanceToV = Math.hypot(x - vx, y - vy);
    const target =
      event.type === "pointerdown"
        ? distanceToU <= distanceToV
          ? "u"
          : "v"
        : activeVector;
    if (event.type === "pointerdown") setActiveVector(target);
    if (target === "u") {
      setUx(x);
      setUy(y);
    } else {
      setVx(x);
      setVy(y);
    }
    onInteraction();
  };

  return (
    <AdapterFrame
      title={`${lesson.title} - vector plane`}
      value={`u dot v = ${dot.toFixed(1)}`}
      footer="Drag vector tips directly on the plane; components, resultant, magnitude, angle, and projection are calculated by the existing linear-algebra engine."
    >
      <div className="lesson-engine lesson-engine-vector">
        <div
          className="lesson-engine-axis lesson-direct-surface"
          data-direct-interaction="true"
        >
          <span className="lesson-direct-cue">Drag vector tips</span>
          <svg
            viewBox="0 0 640 360"
            className="h-full min-h-[360px] w-full"
            role="img"
            aria-label="Linked vector diagram"
            onPointerDown={updateVectorFromPointer}
            onPointerMove={updateVectorFromPointer}
          >
            <defs>
              <marker
                id="cyan-arrow"
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L0,6 L7,3 z" fill="#0891b2" />
              </marker>
              <marker
                id="amber-arrow"
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L0,6 L7,3 z" fill="#f59e0b" />
              </marker>
            </defs>
            <line x1="0" x2="640" y1="180" y2="180" stroke="#94a3b8" />
            <line x1="320" x2="320" y1="0" y2="360" stroke="#94a3b8" />
            <Arrow
              vector={u}
              color="#0891b2"
              marker="url(#cyan-arrow)"
              label="u"
            />
            <Arrow
              vector={v}
              color="#f59e0b"
              marker="url(#amber-arrow)"
              label="v"
            />
            <Arrow
              vector={sum as Vector2}
              color="#8b5cf6"
              marker="url(#cyan-arrow)"
              label="u+v"
              dashed
            />
            <Arrow
              vector={projection}
              color="#10b981"
              marker="url(#cyan-arrow)"
              label="proj"
              dashed
            />
          </svg>
        </div>
        <div className="lesson-engine-controls">
          <div className="rounded-xl bg-slate-100 p-3 text-sm font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-100">
            <p>{guidance[0]}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
              {guidance[1]}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
              {guidance[2]}
            </p>
          </div>
          <SliderGroup title="Vector u">
            <SliderControl
              density="compact"
              label="u x"
              value={ux}
              min={-5}
              max={5}
              step={0.5}
              onChange={update(setUx)}
            />
            <SliderControl
              density="compact"
              label="u y"
              value={uy}
              min={-5}
              max={5}
              step={0.5}
              onChange={update(setUy)}
            />
          </SliderGroup>
          <SliderGroup title="Vector v">
            <SliderControl
              density="compact"
              label="v x"
              value={vx}
              min={-5}
              max={5}
              step={0.5}
              onChange={update(setVx)}
            />
            <SliderControl
              density="compact"
              label="v y"
              value={vy}
              min={-5}
              max={5}
              step={0.5}
              onChange={update(setVy)}
            />
          </SliderGroup>
          <div className="grid grid-cols-2 gap-2">
            <Metric label="|u|" value={vectorMagnitude(u).toFixed(2)} />
            <Metric label="Angle" value={`${angle.toFixed(1)} deg`} />
            <Metric label="u + v" value={`(${sum.join(", ")})`} />
            <Metric
              label="proj_v u"
              value={`(${projection.map((n) => n.toFixed(1)).join(", ")})`}
            />
          </div>
        </div>
      </div>
    </AdapterFrame>
  );
}

function Arrow({
  vector,
  color,
  marker,
  label,
  dashed = false,
}: {
  vector: Vector2;
  color: string;
  marker: string;
  label: string;
  dashed?: boolean;
}) {
  const x = 320 + vector[0] * 38;
  const y = 180 - vector[1] * 38;
  return (
    <g>
      <line
        x1="320"
        y1="180"
        x2={x}
        y2={y}
        stroke={color}
        strokeWidth="4"
        markerEnd={marker}
        strokeDasharray={dashed ? "8 6" : undefined}
      />
      <text x={x + 8} y={y - 8} fill={color} fontWeight="900">
        {label}
      </text>
    </g>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-100 p-2 text-center text-xs dark:bg-white/10">
      <span className="block text-[10px] font-bold text-slate-500">
        {label}
      </span>
      <strong>{value}</strong>
    </div>
  );
}
