import { useEffect, useMemo, useRef, useState, type CSSProperties, type Dispatch, type PointerEvent, type ReactNode, type SetStateAction } from "react";
import FormulaPanel from "../../components/FormulaPanel";
import ProofControls from "../../components/ProofControls";
import StepPanel from "../../components/StepPanel";
import VisualProofLayout from "../../components/VisualProofLayout";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { degToRad, formatNumber, polygonPoints, regularPolygonPoints } from "../../utils/geometryMath";
import type { GeometryParameterKey, GeometryProofConfig } from "./geometryProofConfigs";

type GeometryProofTemplateProps = {
  category: VisualProofCategory;
  proof: VisualProof;
  config: GeometryProofConfig;
};

type GeometryValues = Record<GeometryParameterKey, number>;

const emptyValues: GeometryValues = {
  a: 0,
  b: 0,
  base: 0,
  height: 0,
  offset: 0,
  scale: 0,
  radius: 0,
  angle: 0,
  sides: 0,
};

export default function GeometryProofTemplate({ category, proof, config }: GeometryProofTemplateProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [labelsVisible, setLabelsVisible] = useState(true);
  const [formulaVisible, setFormulaVisible] = useState(true);
  const [secondaryVisible, setSecondaryVisible] = useState(false);
  const [interactionResetKey, setInteractionResetKey] = useState(0);
  const [values, setValues] = useState<GeometryValues>(() => ({
    ...emptyValues,
    ...Object.fromEntries(config.parameters.map((parameter) => [parameter.key, parameter.defaultValue])),
  }));

  useEffect(() => {
    if (!isPlaying) return undefined;
    const timer = window.setInterval(() => {
      setActiveStep((step) => {
        if (step >= config.steps.length - 1) {
          window.clearInterval(timer);
          setIsPlaying(false);
          return step;
        }
        return step + 1;
      });
    }, 1100);
    return () => window.clearInterval(timer);
  }, [config.steps.length, isPlaying]);

  const formulas = useMemo(() => dynamicFormulas(config.formulas, config.kind, values), [config.formulas, config.kind, values]);

  function reset() {
    setIsPlaying(false);
    setActiveStep(0);
    setSecondaryVisible(false);
    setLabelsVisible(true);
    setFormulaVisible(true);
    setInteractionResetKey((key) => key + 1);
    setValues({
      ...emptyValues,
      ...Object.fromEntries(config.parameters.map((parameter) => [parameter.key, parameter.defaultValue])),
    });
  }

  const controls = (
    <div className="space-y-4">
      <ProofControls
        activeStep={activeStep}
        totalSteps={config.steps.length}
        isPlaying={isPlaying}
        labelsVisible={labelsVisible}
        formulaVisible={formulaVisible}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onReset={reset}
        onPrevious={() => {
          setIsPlaying(false);
          setActiveStep((step) => Math.max(0, step - 1));
        }}
        onNext={() => {
          setIsPlaying(false);
          setActiveStep((step) => Math.min(config.steps.length - 1, step + 1));
        }}
        onToggleLabels={() => setLabelsVisible((value) => !value)}
        onToggleFormula={() => setFormulaVisible((value) => !value)}
      />
      <section className="rounded-xl border border-slate-200 bg-white/88 p-4 dark:border-white/10 dark:bg-white/[0.05]" aria-label="Geometry proof parameters">
        <h2 className="text-base font-black text-slate-950 dark:text-white">Parameters</h2>
        {config.parameters.map((parameter) => (
          <Slider
            key={parameter.key}
            label={parameter.label}
            value={values[parameter.key]}
            min={parameter.min}
            max={parameter.max}
            step={parameter.step ?? 1}
            unit={parameter.unit}
            onChange={(value) => setValues((current) => ({ ...current, [parameter.key]: value }))}
          />
        ))}
        {config.toggles.secondary && (
          <button type="button" className="action-secondary mt-4 w-full rounded-xl" onClick={() => setSecondaryVisible((value) => !value)}>
            {config.toggles.secondary}
          </button>
        )}
      </section>
    </div>
  );

  return (
    <VisualProofLayout
      category={category}
      proof={proof}
      visual={<GeometryVisual kind={config.kind} values={values} activeStep={activeStep} labelsVisible={labelsVisible} secondaryVisible={secondaryVisible} resetKey={interactionResetKey} />}
      controls={controls}
      steps={<StepPanel steps={config.steps} activeStep={activeStep} onSelectStep={(step) => { setIsPlaying(false); setActiveStep(step); }} />}
      formula={<FormulaPanel visible={formulaVisible} formulas={formulas} />}
      conceptNotes={<p>{config.notes}</p>}
      reflectionQuestions={config.questions}
    />
  );
}

function GeometryVisual({
  kind,
  values,
  activeStep,
  labelsVisible,
  secondaryVisible,
  resetKey,
}: {
  kind: GeometryProofConfig["kind"];
  values: GeometryValues;
  activeStep: number;
  labelsVisible: boolean;
  secondaryVisible: boolean;
  resetKey: number;
}) {
  return (
    <div className="bg-white p-3 dark:bg-slate-950">
      <svg viewBox="0 0 900 520" role="img" aria-label="Interactive geometry visual proof diagram" className="h-[520px] w-full max-w-full">
        <defs>
          <pattern id="vp-hatch" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 0 10 L 10 0" stroke="#0f766e" strokeWidth="1" opacity="0.35" />
          </pattern>
          <marker id="vp-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#0891b2" />
          </marker>
        </defs>
        <rect x="18" y="18" width="864" height="484" rx="18" className="fill-slate-50 stroke-slate-200 dark:fill-slate-900 dark:stroke-white/10" />
        {renderGeometry(kind, values, activeStep, labelsVisible, secondaryVisible, resetKey)}
      </svg>
    </div>
  );
}

function renderGeometry(kind: GeometryProofConfig["kind"], values: GeometryValues, step: number, labels: boolean, secondary: boolean, resetKey: number) {
  switch (kind) {
    case "PythagoreanAreaRearrangementProof":
      return <PythagoreanSvg values={values} step={step} labels={labels} secondary={secondary} resetKey={resetKey} />;
    case "TriangleAreaHalfRectangleProof":
      return <TriangleAreaSvg values={values} step={step} labels={labels} secondary={secondary} />;
    case "TriangleAngleSumProof":
      return <TriangleAngleSvg values={values} step={step} labels={labels} secondary={secondary} resetKey={resetKey} />;
    case "ExteriorAngleTheoremProof":
      return <ExteriorAngleSvg values={values} step={step} labels={labels} secondary={secondary} />;
    case "SimilarTrianglesProof":
      return <SimilarTrianglesSvg values={values} step={step} labels={labels} secondary={secondary} />;
    case "CircleCircumferenceUnwrappingProof":
      return <CircumferenceSvg values={values} step={step} labels={labels} secondary={secondary} />;
    case "SectorAreaFormulaProof":
      return <SectorSvg values={values} step={step} labels={labels} secondary={secondary} />;
    case "ParallelogramAreaShearingProof":
      return <ParallelogramSvg values={values} step={step} labels={labels} secondary={secondary} />;
    case "TrapezoidAreaDuplicationProof":
      return <TrapezoidSvg values={values} step={step} labels={labels} secondary={secondary} />;
    case "PolygonInteriorAngleSumProof":
      return <PolygonSvg values={values} step={step} labels={labels} secondary={secondary} />;
  }
}

function PythagoreanSvg({ values, step, labels, secondary, resetKey = 0 }: SvgProps) {
  const a = values.a || 3;
  const b = values.b || 4;
  const c = Math.sqrt(a * a + b * b);
  const useSplit = secondary || step >= 3;
  const drag = useSvgDrag();
  const { setOffsets } = drag;

  useEffect(() => {
    setOffsets({});
  }, [a, b, resetKey, secondary, setOffsets]);

  return (
    <g>
      <Title title="Pythagorean area rearrangement" subtitle={`a = ${a}, b = ${b}, c = ${formatNumber(c)}`} />
      <rect x="110" y="140" width="250" height="250" fill="#ecfeff" stroke="#0891b2" strokeWidth="3" />
      {useSplit ? (
        <>
          <g {...drag.draggableProps("a-square", "Drag the a squared area block")}>
            <rect x="150" y="180" width="80" height="80" fill="#bae6fd" stroke="#0369a1" strokeWidth="3" />
            {labels && <Text x={190} y={225}>a^2</Text>}
          </g>
          <g {...drag.draggableProps("b-square", "Drag the b squared area block")}>
            <rect x="235" y="180" width="110" height="110" fill="#ddd6fe" stroke="#7c3aed" strokeWidth="3" />
            {labels && <Text x={290} y={240}>b^2</Text>}
          </g>
        </>
      ) : (
        <>
          <g {...drag.draggableProps("c-square", "Drag the c squared tilted square")}>
            <polygon points="235,145 355,265 235,385 115,265" fill="#fef3c7" stroke="#d97706" strokeWidth="3" />
            {labels && <Text x={235} y={270}>c^2</Text>}
          </g>
        </>
      )}
      <TriangleGroup opacity={step >= 1 ? 0.82 : 0.25} drag={drag} />
      <path d="M 470 170 L 720 170 L 720 390 L 470 390 Z" fill="none" stroke="#22c55e" strokeWidth="3" strokeDasharray="9 8" />
      <Text x={595} y={115}>Drag any colored piece to test the rearrangement</Text>
      <Text x={595} y={150}>same outer square and four triangles</Text>
      <Text x={595} y={425}>{useSplit ? "leftover = a^2 + b^2" : "leftover = c^2"}</Text>
      <Text x={595} y={465}>{`Dynamic: ${a}^2 + ${b}^2 = ${formatNumber(c)}^2`}</Text>
    </g>
  );
}

function TriangleGroup({ opacity, drag }: { opacity: number; drag: DragController }) {
  const triangles = [
    { id: "triangle-top-left", points: "110,140 235,140 110,265", label: "Drag top left right triangle" },
    { id: "triangle-top-right", points: "360,140 360,265 235,140", label: "Drag top right right triangle" },
    { id: "triangle-bottom-right", points: "360,390 235,390 360,265", label: "Drag bottom right right triangle" },
    { id: "triangle-bottom-left", points: "110,390 110,265 235,390", label: "Drag bottom left right triangle" },
  ];
  return (
    <g opacity={opacity}>
      {triangles.map((triangle, index) => (
        <g key={triangle.id} {...drag.draggableProps(triangle.id, triangle.label)}>
          <polygon points={triangle.points} fill={index % 2 ? "#67e8f9" : "#c4b5fd"} stroke="#0f172a" strokeWidth="1.5" />
        </g>
      ))}
    </g>
  );
}

function TriangleAreaSvg({ values, step, labels, secondary }: SvgProps) {
  const base = values.base || 210;
  const height = values.height || 150;
  const offset = values.offset || 160;
  const x = 115;
  const y = 360;
  const top = { x: x + offset, y: y - height };
  return (
    <g>
      <Title title="Triangle area is half a rectangle" subtitle="Works for oblique triangles too" />
      {(step >= 1 || secondary) && <rect x={x} y={y - height} width={base} height={height} fill="#ecfeff" stroke="#0891b2" strokeWidth="3" strokeDasharray="8 7" />}
      <polygon points={`${x},${y} ${x + base},${y} ${top.x},${top.y}`} fill="#fef3c7" stroke="#d97706" strokeWidth="3" />
      {(step >= 2 || secondary) && <polygon points={`${x},${y - height} ${x + base},${y - height} ${top.x},${top.y}`} fill="#bae6fd" stroke="#0369a1" strokeWidth="3" opacity="0.78" />}
      {labels && (
        <>
          <line x1={top.x} y1={top.y} x2={top.x} y2={y} stroke="#22c55e" strokeWidth="3" strokeDasharray="7 6" />
          <Text x={x + base / 2} y={y + 34}>base b</Text>
          <Text x={top.x + 35} y={y - height / 2}>height h</Text>
          <Text x={560} y={240}>Two equal triangles fill b x h</Text>
          <Text x={560} y={285}>One triangle = 1/2 bh</Text>
        </>
      )}
    </g>
  );
}

function TriangleAngleSvg({ values, labels, secondary, resetKey = 0 }: SvgProps) {
  const defaultPoints = useMemo(() => defaultTriangleAnglePoints(values), [values]);
  const [points, setPoints] = useState(defaultPoints);
  const activeVertex = useRef<"left" | "top" | "right" | null>(null);

  useEffect(() => {
    setPoints(defaultPoints);
  }, [defaultPoints, resetKey]);

  const left = points.left;
  const top = points.top;
  const right = points.right;
  const angles = {
    left: angleAt(left, top, right),
    top: angleAt(top, left, right),
    right: angleAt(right, left, top),
  };
  const total = angles.left + angles.top + angles.right;

  function svgPoint(event: PointerEvent<SVGGElement>) {
    const svg = event.currentTarget.ownerSVGElement;
    const transform = svg?.getScreenCTM();
    if (!svg || !transform) return { x: event.clientX, y: event.clientY };
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const transformed = point.matrixTransform(transform.inverse());
    return { x: transformed.x, y: transformed.y };
  }

  function vertexProps(id: "left" | "top" | "right", label: string) {
    return {
      "aria-label": label,
      onPointerCancel: (event: PointerEvent<SVGGElement>) => {
        activeVertex.current = null;
        event.currentTarget.releasePointerCapture(event.pointerId);
      },
      onPointerDown: (event: PointerEvent<SVGGElement>) => {
        event.preventDefault();
        activeVertex.current = id;
        event.currentTarget.setPointerCapture(event.pointerId);
      },
      onPointerMove: (event: PointerEvent<SVGGElement>) => {
        if (activeVertex.current !== id) return;
        const point = svgPoint(event);
        setPoints((current) => ({
          ...current,
          [id]: {
            x: clamp(point.x, 95, 480),
            y: clamp(point.y, 125, 405),
          },
        }));
      },
      onPointerUp: (event: PointerEvent<SVGGElement>) => {
        activeVertex.current = null;
        event.currentTarget.releasePointerCapture(event.pointerId);
      },
      role: "button" as const,
      style: { cursor: "grab", touchAction: "none" },
      tabIndex: 0,
    };
  }

  return (
    <g>
      <Title title="Triangle angle sum" subtitle="Drag vertices; angle values update live" />
      <polygon points={polygonPoints([left, top, right])} fill="#ecfeff" stroke="#0891b2" strokeWidth="3" />
      <DynamicAngleArc vertex={left} pointA={top} pointB={right} color="#f59e0b" radius={48} />
      <DynamicAngleArc vertex={top} pointA={left} pointB={right} color="#22c55e" radius={46} />
      <DynamicAngleArc vertex={right} pointA={left} pointB={top} color="#a855f7" radius={48} />
      <DraggableVertex point={left} fill="#f59e0b" label="A" {...vertexProps("left", "Drag vertex A")} />
      <DraggableVertex point={top} fill="#22c55e" label="B" {...vertexProps("top", "Drag vertex B")} />
      <DraggableVertex point={right} fill="#a855f7" label="C" {...vertexProps("right", "Drag vertex C")} />
      {secondary && <line x1="80" y1={top.y} x2="440" y2={top.y} stroke="#64748b" strokeWidth="2" strokeDasharray="9 8" />}
      {labels && (
        <>
          <AngleValueLabel point={left} dx={-44} dy={-18} color="#f59e0b" label={`A = ${formatNumber(angles.left, 1)} deg`} />
          <AngleValueLabel point={top} dx={0} dy={-34} color="#22c55e" label={`B = ${formatNumber(angles.top, 1)} deg`} />
          <AngleValueLabel point={right} dx={58} dy={-18} color="#a855f7" label={`C = ${formatNumber(angles.right, 1)} deg`} />
          <Text x="650" y="205">A = {formatNumber(angles.left, 1)} deg</Text>
          <Text x="650" y="250">B = {formatNumber(angles.top, 1)} deg</Text>
          <Text x="650" y="295">C = {formatNumber(angles.right, 1)} deg</Text>
          <Text x="650" y="355">A + B + C = {formatNumber(total, 1)} degrees</Text>
        </>
      )}
    </g>
  );
}

function ExteriorAngleSvg({ values, step, labels }: SvgProps) {
  const left = { x: values.a || 120, y: 360 };
  const top = { x: values.b || 260, y: 360 - (values.height || 150) };
  const right = { x: 390, y: 360 };
  return (
    <g>
      <Title title="Exterior angle theorem" subtitle="Remote interior angles fill the exterior angle" />
      <polygon points={polygonPoints([left, top, right])} fill="#ecfeff" stroke="#0891b2" strokeWidth="3" />
      {step >= 1 && <line x1={right.x} y1={right.y} x2="560" y2={right.y} stroke="#0f172a" strokeWidth="3" className="dark:stroke-white" />}
      <AngleArc cx={right.x} cy={right.y} start={0} end={145} color="#ef4444" show={step >= 2} />
      <AngleArc cx={left.x} cy={left.y} start={-35} end={0} color="#f59e0b" show={step >= 3} />
      <AngleArc cx={top.x} cy={top.y} start={110} end={240} color="#22c55e" show={step >= 3} />
      {step >= 4 && (
        <>
          <path d="M 585 310 A 60 60 0 0 1 705 310" fill="none" stroke="#f59e0b" strokeWidth="9" />
          <path d="M 705 310 A 70 70 0 0 1 835 310" fill="none" stroke="#22c55e" strokeWidth="9" />
        </>
      )}
      {labels && <Text x={690} y={380}>Exterior angle = A + B</Text>}
    </g>
  );
}

function SimilarTrianglesSvg({ values, step, labels, secondary }: SvgProps) {
  const k = values.scale || 1.7;
  const sep = secondary ? 20 : values.offset || 200;
  const base = [{ x: 110, y: 350 }, { x: 240, y: 350 }, { x: 165, y: 235 }];
  const large = base.map((point) => ({ x: 360 + sep + (point.x - 110) * k, y: 350 + (point.y - 350) * k }));
  return (
    <g>
      <Title title="Similar triangles" subtitle={`Scale factor k = ${formatNumber(k, 1)}`} />
      <polygon points={polygonPoints(base)} fill="#ecfeff" stroke="#0891b2" strokeWidth="3" />
      {step >= 1 && <polygon points={polygonPoints(large)} fill="#fef3c7" stroke="#d97706" strokeWidth="3" opacity="0.86" />}
      {step >= 2 && labels && (
        <>
          <Text x="175" y="220">A, B, C</Text>
          <Text x={large[2].x + 35} y={large[2].y - 15}>A', B', C'</Text>
          <Text x="610" y="420">Corresponding ratios = k</Text>
        </>
      )}
      {step >= 3 && <line x1="175" y1="350" x2={large[1].x - 20} y2="350" stroke="#22c55e" strokeWidth="3" strokeDasharray="8 8" />}
    </g>
  );
}

function CircumferenceSvg({ values, step, labels, secondary }: SvgProps) {
  const r = values.radius || 75;
  const travel = 2 * Math.PI * r;
  const cx = 150 + Math.min(travel, 450) * Math.min(1, step / 5);
  const cy = 330 - r;
  const markerAngle = -90 + 360 * Math.min(1, step / 5);
  const marker = { x: cx + r * Math.cos(degToRad(markerAngle)), y: cy + r * Math.sin(degToRad(markerAngle)) };
  return (
    <g>
      <Title title="Circle circumference by rolling" subtitle="One full turn travels one circumference" />
      <line x1="80" y1="330" x2="810" y2="330" stroke="#64748b" strokeWidth="3" />
      {step >= 2 && <line x1="150" y1="345" x2={cx} y2="345" stroke="#f59e0b" strokeWidth="6" />}
      <circle cx={cx} cy={cy} r={r} fill="#ecfeff" stroke="#0891b2" strokeWidth="4" />
      <line x1={cx} y1={cy} x2={marker.x} y2={marker.y} stroke="#ef4444" strokeWidth="3" />
      <circle cx={marker.x} cy={marker.y} r="7" fill="#ef4444" />
      {(step >= 4 || secondary) && <line x1="500" y1="180" x2="780" y2="180" stroke="#22c55e" strokeWidth="7" />}
      {labels && (
        <>
          <Text x={cx + r / 2} y={cy - 10}>r</Text>
          <Text x="640" y="215">unwrapped boundary = 2 pi r</Text>
        </>
      )}
    </g>
  );
}

function SectorSvg({ values, step, labels, secondary }: SvgProps) {
  const r = values.radius || 90;
  const angle = values.angle || 120;
  const cx = 260;
  const cy = 280;
  const end = { x: cx + r * Math.cos(degToRad(angle - 90)), y: cy + r * Math.sin(degToRad(angle - 90)) };
  const start = { x: cx, y: cy - r };
  const large = angle > 180 ? 1 : 0;
  return (
    <g>
      <Title title="Sector area formula" subtitle={`theta = ${formatNumber(angle)} degrees`} />
      <circle cx={cx} cy={cy} r={r} fill="#ecfeff" stroke="#0891b2" strokeWidth="3" />
      {step >= 1 && <path d={`M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y} Z`} fill="#fef3c7" stroke="#d97706" strokeWidth="4" />}
      {secondary && <Text x="650" y="205">Radians: 1/2 r^2 theta</Text>}
      {labels && (
        <>
          <Text x="620" y="260">sector fraction = theta / 360</Text>
          <Text x="620" y="305">area = theta / 360 x pi r^2</Text>
        </>
      )}
    </g>
  );
}

function ParallelogramSvg({ values, step, labels, secondary }: SvgProps) {
  const base = values.base || 220;
  const height = values.height || 140;
  const offset = values.offset || 70;
  const x = 130;
  const y = 365;
  const points = `${x},${y} ${x + base},${y} ${x + base + offset},${y - height} ${x + offset},${y - height}`;
  return (
    <g>
      <Title title="Parallelogram area by shearing" subtitle="Cut and move the side triangle" />
      <polygon points={points} fill="#ecfeff" stroke="#0891b2" strokeWidth="3" />
      {step >= 3 && <polygon points={`${x},${y} ${x + offset},${y - height} ${x + offset},${y}`} fill="#fef3c7" stroke="#d97706" strokeWidth="3" />}
      {(step >= 4 || secondary) && <polygon points={`${x + base},${y} ${x + base + offset},${y - height} ${x + base + offset},${y}`} fill="#fef3c7" stroke="#d97706" strokeWidth="3" opacity="0.82" />}
      {(step >= 5 || secondary) && <rect x="510" y={y - height} width={base} height={height} fill="url(#vp-hatch)" stroke="#22c55e" strokeWidth="3" />}
      {labels && (
        <>
          <line x1={x + offset} y1={y - height} x2={x + offset} y2={y} stroke="#22c55e" strokeWidth="3" strokeDasharray="7 6" />
          <Text x={x + base / 2} y={y + 35}>base b</Text>
          <Text x={x + offset + 35} y={y - height / 2}>height h</Text>
          <Text x="620" y="430">Area = b x h</Text>
        </>
      )}
    </g>
  );
}

function TrapezoidSvg({ values, step, labels, secondary }: SvgProps) {
  const top = values.a || 120;
  const bottom = values.b || 230;
  const height = values.height || 130;
  const offset = values.offset || 50;
  const x = 120;
  const y = 365;
  const trap = `${x},${y} ${x + bottom},${y} ${x + offset + top},${y - height} ${x + offset},${y - height}`;
  return (
    <g>
      <Title title="Trapezoid / trapezium duplication" subtitle="Two copies form a parallelogram" />
      <polygon points={trap} fill="#ecfeff" stroke="#0891b2" strokeWidth="3" />
      {(step >= 2 || secondary) && <polygon points={`${x + bottom + 35},${y - height} ${x + bottom + 35 + bottom},${y - height} ${x + bottom + 35 + bottom - offset},${y} ${x + bottom + 35 + bottom - offset - top},${y}`} fill="#fef3c7" stroke="#d97706" strokeWidth="3" opacity="0.8" />}
      {step >= 4 && <path d="M 505 220 L 790 220 L 720 365 L 435 365 Z" fill="none" stroke="#22c55e" strokeWidth="4" strokeDasharray="9 8" />}
      {labels && (
        <>
          <Text x={x + offset + top / 2} y={y - height - 18}>a</Text>
          <Text x={x + bottom / 2} y={y + 34}>b</Text>
          <Text x="610" y="430">Area = 1/2(a + b)h</Text>
        </>
      )}
    </g>
  );
}

function PolygonSvg({ values, step, labels, secondary }: SvgProps) {
  const sides = Math.round(values.sides || 5);
  const points = regularPolygonPoints(sides, 270, 280, 125, secondary ? -75 : -90);
  const sum = (sides - 2) * 180;
  return (
    <g>
      <Title title="Polygon interior angle sum" subtitle={`${sides} sides split into ${sides - 2} triangles`} />
      <polygon points={polygonPoints(points)} fill="#ecfeff" stroke="#0891b2" strokeWidth="3" />
      {step >= 2 && points.slice(2, -1).map((point) => <line key={`${point.x}-${point.y}`} x1={points[0].x} y1={points[0].y} x2={point.x} y2={point.y} stroke="#d97706" strokeWidth="3" />)}
      {labels && (
        <>
          <circle cx={points[0].x} cy={points[0].y} r="7" fill="#ef4444" />
          <Text x="640" y="235">triangles = n - 2 = {sides - 2}</Text>
          <Text x="640" y="280">sum = ({sides} - 2) x 180</Text>
          <Text x="640" y="325">{sum} degrees</Text>
        </>
      )}
    </g>
  );
}

type SvgProps = {
  values: GeometryValues;
  step: number;
  labels: boolean;
  secondary: boolean;
  resetKey?: number;
};

type DragOffset = { x: number; y: number };
type GeometryPoint = { x: number; y: number };

type DragController = {
  setOffsets: Dispatch<SetStateAction<Record<string, DragOffset>>>;
  draggableProps: (id: string, label: string) => {
    "aria-label": string;
    onPointerCancel: (event: PointerEvent<SVGGElement>) => void;
    onPointerDown: (event: PointerEvent<SVGGElement>) => void;
    onPointerMove: (event: PointerEvent<SVGGElement>) => void;
    onPointerUp: (event: PointerEvent<SVGGElement>) => void;
    role: "button";
    style: CSSProperties;
    tabIndex: number;
    transform: string;
  };
};

function useSvgDrag(): DragController {
  const [offsets, setOffsets] = useState<Record<string, DragOffset>>({});
  const activeDrag = useRef<{ id: string; origin: DragOffset; start: DragOffset } | null>(null);

  function svgPoint(event: PointerEvent<SVGGElement>): DragOffset {
    const svg = event.currentTarget.ownerSVGElement;
    const transform = svg?.getScreenCTM();
    if (!svg || !transform) return { x: event.clientX, y: event.clientY };
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const transformed = point.matrixTransform(transform.inverse());
    return { x: transformed.x, y: transformed.y };
  }

  function draggableProps(id: string, label: string) {
    const offset = offsets[id] ?? { x: 0, y: 0 };
    return {
      "aria-label": label,
      onPointerCancel: (event: PointerEvent<SVGGElement>) => {
        activeDrag.current = null;
        event.currentTarget.releasePointerCapture(event.pointerId);
      },
      onPointerDown: (event: PointerEvent<SVGGElement>) => {
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        activeDrag.current = { id, origin: offset, start: svgPoint(event) };
      },
      onPointerMove: (event: PointerEvent<SVGGElement>) => {
        const drag = activeDrag.current;
        if (!drag || drag.id !== id) return;
        const point = svgPoint(event);
        setOffsets((current) => ({
          ...current,
          [id]: {
            x: drag.origin.x + point.x - drag.start.x,
            y: drag.origin.y + point.y - drag.start.y,
          },
        }));
      },
      onPointerUp: (event: PointerEvent<SVGGElement>) => {
        activeDrag.current = null;
        event.currentTarget.releasePointerCapture(event.pointerId);
      },
      role: "button" as const,
      style: { cursor: "grab", touchAction: "none" },
      tabIndex: 0,
      transform: `translate(${offset.x} ${offset.y})`,
    };
  }

  return { draggableProps, setOffsets };
}

function defaultTriangleAnglePoints(values: GeometryValues) {
  return {
    left: { x: values.a || 110, y: 360 },
    top: { x: values.b || 260, y: 360 - (values.height || 150) },
    right: { x: 390, y: 360 },
  };
}

function angleAt(vertex: GeometryPoint, pointA: GeometryPoint, pointB: GeometryPoint) {
  const vectorA = { x: pointA.x - vertex.x, y: pointA.y - vertex.y };
  const vectorB = { x: pointB.x - vertex.x, y: pointB.y - vertex.y };
  const dot = vectorA.x * vectorB.x + vectorA.y * vectorB.y;
  const lengthA = Math.hypot(vectorA.x, vectorA.y);
  const lengthB = Math.hypot(vectorB.x, vectorB.y);
  if (lengthA === 0 || lengthB === 0) return 0;
  return (Math.acos(clamp(dot / (lengthA * lengthB), -1, 1)) * 180) / Math.PI;
}

function DynamicAngleArc({ vertex, pointA, pointB, color, radius }: { vertex: GeometryPoint; pointA: GeometryPoint; pointB: GeometryPoint; color: string; radius: number }) {
  let start = Math.atan2(pointA.y - vertex.y, pointA.x - vertex.x);
  let end = Math.atan2(pointB.y - vertex.y, pointB.x - vertex.x);
  let delta = normalizeRadians(end - start);
  if (delta > Math.PI) {
    const previousStart = start;
    start = end;
    end = previousStart;
    delta = normalizeRadians(end - start);
  }
  const startPoint = { x: vertex.x + radius * Math.cos(start), y: vertex.y + radius * Math.sin(start) };
  const endPoint = { x: vertex.x + radius * Math.cos(end), y: vertex.y + radius * Math.sin(end) };
  return <path d={`M ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 0 1 ${endPoint.x} ${endPoint.y}`} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" opacity="0.92" />;
}

function DraggableVertex({ point, fill, label, ...props }: { point: GeometryPoint; fill: string; label: string } & Omit<ReturnType<DragController["draggableProps"]>, "transform">) {
  return (
    <g {...props}>
      <circle cx={point.x} cy={point.y} r="12" fill={fill} stroke="#0f172a" strokeWidth="3" />
      <text x={point.x} y={point.y + 5} textAnchor="middle" className="fill-white text-[12px] font-black">{label}</text>
    </g>
  );
}

function AngleValueLabel({ point, dx, dy, color, label }: { point: GeometryPoint; dx: number; dy: number; color: string; label: string }) {
  return (
    <text x={point.x + dx} y={point.y + dy} textAnchor="middle" fill={color} fontSize="15" fontWeight="900">
      {label}
    </text>
  );
}

function normalizeRadians(value: number) {
  return (value + Math.PI * 2) % (Math.PI * 2);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function AngleArc({ cx, cy, start, end, color, show }: { cx: number; cy: number; start: number; end: number; color: string; show: boolean }) {
  if (!show) return null;
  const r = 42;
  const startPoint = { x: cx + r * Math.cos(degToRad(start)), y: cy + r * Math.sin(degToRad(start)) };
  const endPoint = { x: cx + r * Math.cos(degToRad(end)), y: cy + r * Math.sin(degToRad(end)) };
  return <path d={`M ${startPoint.x} ${startPoint.y} A ${r} ${r} 0 0 1 ${endPoint.x} ${endPoint.y}`} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" />;
}

function Title({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <>
      <text x="54" y="58" className="fill-slate-900 text-[22px] font-black dark:fill-white">{title}</text>
      <text x="54" y="84" className="fill-slate-500 text-[13px] font-bold dark:fill-slate-300">{subtitle}</text>
    </>
  );
}

function Text({ x, y, children }: { x: number | string; y: number | string; children: ReactNode }) {
  return <text x={x} y={y} textAnchor="middle" className="fill-slate-800 text-[16px] font-black dark:fill-slate-100">{children}</text>;
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
}) {
  const progress = `${((value - min) / (max - min)) * 100}%`;
  return (
    <label className="mt-4 block">
      <span className="flex items-center justify-between gap-3 text-sm font-bold text-slate-700 dark:text-slate-200">
        {label}
        <span className="mini-chip">{formatNumber(value, 1)}{unit ? ` ${unit}` : ""}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{ "--slider-progress": progress } as CSSProperties}
        className="mt-3 w-full accent-cyan-500"
        aria-label={label}
      />
    </label>
  );
}

function dynamicFormulas(formulas: string[], kind: GeometryProofConfig["kind"], values: GeometryValues) {
  if (kind === "PythagoreanAreaRearrangementProof") {
    const a = values.a || 3;
    const b = values.b || 4;
    const c = Math.sqrt(a * a + b * b);
    return [...formulas, `Example: ${a}^2 + ${b}^2 = ${formatNumber(c)}^2`, `${a * a} + ${b * b} = ${formatNumber(c * c)}`];
  }
  if (kind === "PolygonInteriorAngleSumProof") {
    const sides = Math.round(values.sides || 5);
    return [...formulas, `For n = ${sides}: (${sides} - 2) x 180 = ${(sides - 2) * 180} degrees`];
  }
  if (kind === "SectorAreaFormulaProof") {
    const angle = values.angle || 120;
    return [...formulas, `For theta = ${formatNumber(angle)} degrees: fraction = ${formatNumber(angle / 360, 3)}`];
  }
  return formulas;
}
