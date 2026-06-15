import { useEffect, useMemo, useRef, useState, type CSSProperties, type Dispatch, type PointerEvent, type ReactNode, type SetStateAction } from "react";
import FormulaPanel from "../../components/FormulaPanel";
import ProofControls from "../../components/ProofControls";
import SymbolLegendPanel, { buildSymbolMeanings } from "../../components/SymbolLegendPanel";
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
  const [visualProgress, setVisualProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [labelsVisible, setLabelsVisible] = useState(true);
  const [formulaVisible, setFormulaVisible] = useState(true);
  const [secondaryVisible, setSecondaryVisible] = useState(false);
  const [interactionResetKey, setInteractionResetKey] = useState(0);
  const visualProgressRef = useRef(0);
  const [values, setValues] = useState<GeometryValues>(() => ({
    ...emptyValues,
    ...Object.fromEntries(config.parameters.map((parameter) => [parameter.key, parameter.defaultValue])),
  }));

  useEffect(() => {
    visualProgressRef.current = visualProgress;
  }, [visualProgress]);

  useEffect(() => {
    if (!isPlaying) return undefined;
    const maxProgress = config.steps.length - 1;
    const stepDurationMs = 1250;
    let frame = 0;
    let previousTime = performance.now();

    function tick(now: number) {
      const deltaSteps = (now - previousTime) / stepDurationMs;
      previousTime = now;
      const nextProgress = Math.min(maxProgress, visualProgressRef.current + deltaSteps);
      visualProgressRef.current = nextProgress;
      setVisualProgress(nextProgress);
      setActiveStep(Math.min(maxProgress, Math.floor(nextProgress + 0.0001)));
      if (nextProgress >= maxProgress) {
        setIsPlaying(false);
        return;
      }
      frame = window.requestAnimationFrame(tick);
    }

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [config.steps.length, isPlaying]);

  const formulas = useMemo(() => dynamicFormulas(config.formulas, config.kind, values), [config.formulas, config.kind, values]);
  const symbolMeanings = useMemo(
    () => buildSymbolMeanings({
      proof,
      formulas,
      parameters: config.parameters.map((parameter) => ({
        key: parameter.key,
        label: parameter.label,
        value: values[parameter.key],
        unit: parameter.unit,
      })),
    }),
    [config.parameters, formulas, proof, values],
  );

  function reset() {
    setIsPlaying(false);
    setActiveStep(0);
    setVisualProgress(0);
    visualProgressRef.current = 0;
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
        playLabel={`Play ${proof.title}`}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onReset={reset}
        onPrevious={() => {
          setIsPlaying(false);
          setActiveStep((step) => {
            const nextStep = Math.max(0, step - 1);
            setVisualProgress(nextStep);
            visualProgressRef.current = nextStep;
            return nextStep;
          });
        }}
        onNext={() => {
          setIsPlaying(false);
          setActiveStep((step) => {
            const nextStep = Math.min(config.steps.length - 1, step + 1);
            setVisualProgress(nextStep);
            visualProgressRef.current = nextStep;
            return nextStep;
          });
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
      visual={<GeometryVisual kind={config.kind} values={values} activeStep={activeStep} progress={visualProgress} labelsVisible={labelsVisible} secondaryVisible={secondaryVisible} resetKey={interactionResetKey} />}
      controls={controls}
      steps={<StepPanel steps={config.steps} activeStep={activeStep} onSelectStep={(step) => { setIsPlaying(false); setActiveStep(step); setVisualProgress(step); visualProgressRef.current = step; }} />}
      symbolLegend={<SymbolLegendPanel meanings={symbolMeanings} />}
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
  progress,
  labelsVisible,
  secondaryVisible,
  resetKey,
}: {
  kind: GeometryProofConfig["kind"];
  values: GeometryValues;
  activeStep: number;
  progress: number;
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
        {renderGeometry(kind, values, activeStep, progress, labelsVisible, secondaryVisible, resetKey)}
      </svg>
    </div>
  );
}

function renderGeometry(kind: GeometryProofConfig["kind"], values: GeometryValues, step: number, progress: number, labels: boolean, secondary: boolean, resetKey: number) {
  switch (kind) {
    case "PythagoreanAreaRearrangementProof":
      return <PythagoreanSvg values={values} step={step} labels={labels} secondary={secondary} resetKey={resetKey} />;
    case "TriangleAreaHalfRectangleProof":
      return <TriangleAreaSvg values={values} step={step} labels={labels} secondary={secondary} />;
    case "TriangleAngleSumProof":
      return <TriangleAngleSvg values={values} step={step} labels={labels} secondary={secondary} resetKey={resetKey} />;
    case "ExteriorAngleTheoremProof":
      return <ExteriorAngleSvg values={values} step={step} labels={labels} secondary={secondary} resetKey={resetKey} />;
    case "SimilarTrianglesProof":
      return <SimilarTrianglesSvg values={values} step={step} labels={labels} secondary={secondary} />;
    case "CircleCircumferenceUnwrappingProof":
      return <CircumferenceSvg values={values} step={step} progress={progress} labels={labels} secondary={secondary} />;
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
  const drag = useSvgDrag({ minX: -46, maxX: 46, minY: -46, maxY: 46 });
  const { setOffsets } = drag;
  const leftOrigin = { x: 94, y: 172 };
  const rightOrigin = { x: 556, y: 172 };
  const outerSide = 218;
  const unit = outerSide / (a + b);
  const startPieces = pythagoreanTiltedPieces(a, b, unit, leftOrigin, "start");
  const rearrangedPieces = pythagoreanSplitPieces(a, b, unit, rightOrigin, "split");

  useEffect(() => {
    setOffsets({});
  }, [a, b, resetKey, secondary, step, setOffsets]);

  return (
    <g>
      <defs>
        <filter id="pythagorean-soft-shadow" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#0f172a" floodOpacity="0.12" />
        </filter>
        <linearGradient id="pythagorean-stage" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ecfeff" />
        </linearGradient>
      </defs>
      <Title title="Pythagorean area rearrangement" subtitle={`Drag pieces. Change a or b. The equation updates: ${a}^2 + ${b}^2 = ${formatNumber(c)}^2`} />
      <PythagoreanFormulaBar
        x={270}
        y={104}
        width={360}
        main={`${formatNumber(a * a)} + ${formatNumber(b * b)} = ${formatNumber(c * c)}`}
        detail="same outside square + same four triangles -> a^2 + b^2 = c^2"
      />
      <PythagoreanBoard
        clipId="pythagorean-start-board"
        title="One tilted empty square"
        subtitle={`leftover area = c^2 = ${formatNumber(c * c)}`}
        origin={leftOrigin}
        side={outerSide}
        active={!useSplit}
        footer="four triangles around one c^2 square"
      >
        {startPieces.map((piece) => <PythagoreanPiece key={piece.id} piece={piece} drag={drag} labels={labels} />)}
      </PythagoreanBoard>
      <PythagoreanBoard
        clipId="pythagorean-split-board"
        title="Two straight empty squares"
        subtitle={`leftover area = a^2 + b^2 = ${formatNumber(a * a + b * b)}`}
        origin={rightOrigin}
        side={outerSide}
        active={useSplit}
        footer="same four triangles, now showing a^2 and b^2"
      >
        {rearrangedPieces.map((piece) => <PythagoreanPiece key={piece.id} piece={piece} drag={drag} labels={labels} />)}
      </PythagoreanBoard>
      <path d="M 446 198 C 475 198 475 288 446 288 M 454 240 L 506 240" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" opacity="0.85" markerEnd="url(#vp-arrow)" />
      <PythagoreanInsight x={257} y={448} width={386} text="Both pictures use the same outside square and the same four triangles." />
      {labels && (
        <>
          <SideLabel x={leftOrigin.x + outerSide / 2} y={leftOrigin.y + outerSide + 30} text="a + b" />
          <SideLabel x={rightOrigin.x + outerSide / 2} y={rightOrigin.y + outerSide + 30} text="a + b" />
          <SideLabel x={leftOrigin.x - 28} y={leftOrigin.y + outerSide / 2} text="a + b" rotate />
          <SideLabel x={rightOrigin.x + outerSide + 28} y={rightOrigin.y + outerSide / 2} text="a + b" rotate />
        </>
      )}
    </g>
  );
}

type PythagoreanPieceData = {
  fill: string;
  id: string;
  label: string;
  name: string;
  points: GeometryPoint[];
  stroke: string;
};

function PythagoreanBoard({
  clipId,
  title,
  subtitle,
  origin,
  side,
  active,
  footer,
  children,
}: {
  children: ReactNode;
  clipId: string;
  footer: string;
  origin: GeometryPoint;
  side: number;
  active: boolean;
  subtitle: string;
  title: string;
}) {
  return (
    <g filter="url(#pythagorean-soft-shadow)">
      <clipPath id={clipId}>
        <rect x={origin.x - 1} y={origin.y - 1} width={side + 2} height={side + 2} rx="8" />
      </clipPath>
      <rect x={origin.x - 28} y={origin.y - 70} width={side + 56} height={side + 136} rx="24" fill="url(#pythagorean-stage)" stroke={active ? "#06b6d4" : "#cbd5e1"} strokeWidth={active ? 3 : 1.5} />
      <rect x={origin.x - 12} y={origin.y - 54} width={side + 24} height="42" rx="14" fill="#f8fafc" stroke="#e2e8f0" />
      <text x={origin.x + side / 2} y={origin.y - 35} textAnchor="middle" className="fill-slate-950 text-[15px] font-black dark:fill-white">{title}</text>
      <text x={origin.x + side / 2} y={origin.y - 18} textAnchor="middle" className="fill-slate-600 text-[11px] font-black dark:fill-slate-300">{subtitle}</text>
      <rect x={origin.x} y={origin.y} width={side} height={side} rx="8" fill="#ffffff" stroke="#0f172a" strokeWidth="3" />
      <g clipPath={`url(#${clipId})`}>{children}</g>
      <text x={origin.x + side / 2} y={origin.y + side + 48} textAnchor="middle" className="fill-slate-600 text-[11px] font-black dark:fill-slate-300">{footer}</text>
      <circle cx={origin.x + side + 13} cy={origin.y - 48} r="8" fill={active ? "#22c55e" : "#94a3b8"} />
    </g>
  );
}

function PythagoreanPiece({ piece, drag, labels }: { piece: PythagoreanPieceData; drag: DragController; labels: boolean }) {
  const center = polygonCentroid(piece.points);
  const labelWidth = piece.name.includes("triangle") ? 74 : 52;
  return (
    <g {...drag.draggableProps(piece.id, piece.label)}>
      <polygon points={polygonPoints(piece.points)} fill={piece.fill} stroke={piece.stroke} strokeWidth="2.25" opacity="0.93" />
      <circle cx={center.x} cy={center.y} r="12" fill="#ffffff" stroke={piece.stroke} strokeWidth="2.6" opacity="0.98" />
      <path d={`M ${center.x - 5} ${center.y} L ${center.x + 5} ${center.y} M ${center.x} ${center.y - 5} L ${center.x} ${center.y + 5}`} stroke={piece.stroke} strokeWidth="2.5" strokeLinecap="round" />
      {labels && (
        <g>
          <rect x={center.x - labelWidth / 2} y={center.y + 17} width={labelWidth} height="24" rx="12" fill="#ffffff" stroke={piece.stroke} strokeWidth="1.4" opacity="0.95" />
          <text x={center.x} y={center.y + 33} textAnchor="middle" className="fill-slate-950 text-[11px] font-black dark:fill-white">{piece.name}</text>
        </g>
      )}
    </g>
  );
}

function PythagoreanFormulaBar({ x, y, width, main, detail }: { x: number; y: number; width: number; main: string; detail: string }) {
  return (
    <g>
      <rect x={x} y={y} width={width} height="48" rx="18" fill="#020617" opacity="0.94" />
      <circle cx={x + 28} cy={y + 24} r="11" fill="#22d3ee" opacity="0.95" />
      <text x={x + 52} y={y + 21} className="fill-white text-[15px] font-black">{main}</text>
      <text x={x + 52} y={y + 39} className="fill-cyan-100 text-[10px] font-bold">{detail}</text>
    </g>
  );
}

function PythagoreanInsight({ x, y, width, text }: { x: number; y: number; width: number; text: string }) {
  return (
    <g>
      <rect x={x} y={y} width={width} height="34" rx="17" fill="#ecfeff" stroke="#67e8f9" />
      <text x={x + width / 2} y={y + 22} textAnchor="middle" className="fill-slate-900 text-[12px] font-black">{text}</text>
    </g>
  );
}

function pythagoreanTiltedPieces(a: number, b: number, unit: number, origin: GeometryPoint, prefix: string): PythagoreanPieceData[] {
  const point = (x: number, y: number) => ({ x: origin.x + x * unit, y: origin.y + y * unit });
  return [
    trianglePiece(`${prefix}-tri-1`, "triangle 1", [point(0, 0), point(b, 0), point(0, a)], "#67e8f9"),
    trianglePiece(`${prefix}-tri-2`, "triangle 2", [point(b, 0), point(a + b, 0), point(a + b, b)], "#c4b5fd"),
    trianglePiece(`${prefix}-tri-3`, "triangle 3", [point(a + b, b), point(a + b, a + b), point(a, a + b)], "#67e8f9"),
    trianglePiece(`${prefix}-tri-4`, "triangle 4", [point(0, a), point(a, a + b), point(0, a + b)], "#c4b5fd"),
    {
      fill: "#fef3c7",
      id: `${prefix}-c-square`,
      label: "Drag the c squared tilted square",
      name: "c^2",
      points: [point(b, 0), point(a + b, b), point(a, a + b), point(0, a)],
      stroke: "#d97706",
    },
  ];
}

function pythagoreanSplitPieces(a: number, b: number, unit: number, origin: GeometryPoint, prefix: string): PythagoreanPieceData[] {
  const point = (x: number, y: number) => ({ x: origin.x + x * unit, y: origin.y + y * unit });
  return [
    {
      fill: "#bae6fd",
      id: `${prefix}-a-square`,
      label: "Drag the a squared square",
      name: "a^2",
      points: [point(0, 0), point(a, 0), point(a, a), point(0, a)],
      stroke: "#0369a1",
    },
    {
      fill: "#ddd6fe",
      id: `${prefix}-b-square`,
      label: "Drag the b squared square",
      name: "b^2",
      points: [point(a, a), point(a + b, a), point(a + b, a + b), point(a, a + b)],
      stroke: "#7c3aed",
    },
    trianglePiece(`${prefix}-tri-1`, "triangle 1", [point(a, 0), point(a + b, 0), point(a + b, a)], "#67e8f9"),
    trianglePiece(`${prefix}-tri-2`, "triangle 2", [point(a, 0), point(a + b, a), point(a, a)], "#c4b5fd"),
    trianglePiece(`${prefix}-tri-3`, "triangle 3", [point(0, a), point(a, a), point(0, a + b)], "#67e8f9"),
    trianglePiece(`${prefix}-tri-4`, "triangle 4", [point(a, a), point(a, a + b), point(0, a + b)], "#c4b5fd"),
  ];
}

function trianglePiece(id: string, name: string, points: GeometryPoint[], fill: string): PythagoreanPieceData {
  return {
    fill,
    id,
    label: `Drag ${name}`,
    name,
    points,
    stroke: "#0f172a",
  };
}

function polygonCentroid(points: GeometryPoint[]) {
  return {
    x: points.reduce((total, point) => total + point.x, 0) / points.length,
    y: points.reduce((total, point) => total + point.y, 0) / points.length,
  };
}

function SideLabel({ x, y, text, rotate = false }: { x: number; y: number; text: string; rotate?: boolean }) {
  return <text x={x} y={y} textAnchor="middle" transform={rotate ? `rotate(-90 ${x} ${y})` : undefined} className="fill-slate-700 text-[13px] font-black dark:fill-slate-200">{text}</text>;
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

function TriangleAngleSvg({ values, step, labels, secondary, resetKey = 0 }: SvgProps) {
  const defaultPoints = useMemo(() => defaultTriangleAnglePoints(values), [values]);
  const [points, setPoints] = useState(defaultPoints);
  const [dragging, setDragging] = useState<"left" | "top" | "right" | null>(null);
  const activeVertex = useRef<"left" | "top" | "right" | null>(null);

  useEffect(() => {
    setPoints(defaultPoints);
    setDragging(null);
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
  const stripActive = step >= 2 || secondary;

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
        setDragging(null);
        event.currentTarget.releasePointerCapture(event.pointerId);
      },
      onPointerDown: (event: PointerEvent<SVGGElement>) => {
        event.preventDefault();
        activeVertex.current = id;
        setDragging(id);
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
        setDragging(null);
        event.currentTarget.releasePointerCapture(event.pointerId);
      },
      role: "button" as const,
      style: { cursor: dragging === id ? "grabbing" : "grab", touchAction: "none" },
      tabIndex: 0,
    };
  }

  return (
    <g>
      <Title title="Triangle angle sum" subtitle="Drag A, B, or C. The three angle values update live." />
      <polygon points={polygonPoints([left, top, right])} fill="#ecfeff" stroke="#0891b2" strokeWidth="3.5" />
      <line x1={left.x} y1={left.y} x2={right.x} y2={right.y} stroke="#0f172a" strokeWidth="1.5" opacity="0.18" />
      <DynamicAngleArc vertex={left} pointA={top} pointB={right} color="#f59e0b" radius={48} />
      <DynamicAngleArc vertex={top} pointA={left} pointB={right} color="#22c55e" radius={46} />
      <DynamicAngleArc vertex={right} pointA={left} pointB={top} color="#a855f7" radius={48} />
      <AngleValueLabel point={left} dx={-48} dy={-20} color="#b45309" label={`A ${formatNumber(angles.left, 1)}`} />
      <AngleValueLabel point={top} dx={0} dy={-38} color="#15803d" label={`B ${formatNumber(angles.top, 1)}`} />
      <AngleValueLabel point={right} dx={58} dy={-20} color="#7e22ce" label={`C ${formatNumber(angles.right, 1)}`} />
      <DraggableVertex point={left} fill="#f59e0b" label="A" active={dragging === "left"} {...vertexProps("left", "Drag vertex A")} />
      <DraggableVertex point={top} fill="#22c55e" label="B" active={dragging === "top"} {...vertexProps("top", "Drag vertex B")} />
      <DraggableVertex point={right} fill="#a855f7" label="C" active={dragging === "right"} {...vertexProps("right", "Drag vertex C")} />
      {(secondary || step >= 1) && (
        <>
          <line x1="78" y1={top.y} x2="492" y2={top.y} stroke="#64748b" strokeWidth="2" strokeDasharray="9 8" />
          {labels && <Text x="605" y={top.y - 14}>parallel guide</Text>}
        </>
      )}
      <AngleSumValueCard x={585} y={120} angles={angles} total={total} />
      <StraightAngleStrip x={560} y={392} angles={angles} active={stripActive} labels={labels} />
      <Text x="695" y="490">The colored parts always fill one straight angle.</Text>
    </g>
  );
}

function AngleSumValueCard({
  x,
  y,
  angles,
  total,
}: {
  x: number;
  y: number;
  angles: { left: number; top: number; right: number };
  total: number;
}) {
  const rows = [
    { label: "A", value: angles.left, color: "#f59e0b" },
    { label: "B", value: angles.top, color: "#22c55e" },
    { label: "C", value: angles.right, color: "#a855f7" },
  ];

  return (
    <g aria-label="Live angle values">
      <rect x={x} y={y} width="260" height="220" rx="18" fill="#0f172a" opacity="0.94" />
      <text x={x + 20} y={y + 34} fill="#ffffff" fontSize="18" fontWeight="900">Live angle values</text>
      {rows.map((row, index) => (
        <g key={row.label} transform={`translate(${x + 20} ${y + 58 + index * 39})`}>
          <rect x="0" y="0" width="220" height="30" rx="10" fill="#ffffff" opacity="0.09" />
          <circle cx="18" cy="15" r="8" fill={row.color} />
          <text x="36" y="20" fill="#ffffff" fontSize="15" fontWeight="900">
            {row.label} = {formatNumber(row.value, 1)} deg
          </text>
        </g>
      ))}
      <line x1={x + 20} y1={y + 180} x2={x + 240} y2={y + 180} stroke="#ffffff" strokeWidth="1.5" opacity="0.28" />
      <text x={x + 130} y={y + 207} textAnchor="middle" fill="#67e8f9" fontSize="18" fontWeight="900">
        A + B + C = {formatNumber(total, 1)} deg
      </text>
    </g>
  );
}

function StraightAngleStrip({
  x,
  y,
  angles,
  active,
  labels,
}: {
  x: number;
  y: number;
  angles: { left: number; top: number; right: number };
  active: boolean;
  labels: boolean;
}) {
  const width = 280;
  const scale = width / 180;
  const segments = [
    { label: "A", value: angles.left, color: "#f59e0b" },
    { label: "B", value: angles.top, color: "#22c55e" },
    { label: "C", value: angles.right, color: "#a855f7" },
  ];
  let cursor = x;

  return (
    <g aria-label="Straight angle comparison" opacity={active ? 1 : 0.74}>
      <text x={x + width / 2} y={y - 22} textAnchor="middle" fill="#0f172a" fontSize="16" fontWeight="900">
        copied angles on a straight line
      </text>
      <line x1={x} y1={y} x2={x + width} y2={y} stroke="#0f172a" strokeWidth="4" strokeLinecap="round" opacity="0.78" />
      {segments.map((segment) => {
        const segmentWidth = Math.max(1, segment.value * scale);
        const start = cursor;
        cursor += segmentWidth;
        return (
          <g key={segment.label}>
            <rect x={start} y={y - 18} width={segmentWidth} height="36" rx="8" fill={segment.color} opacity="0.88" />
            <line x1={start} y1={y - 27} x2={start} y2={y + 27} stroke="#ffffff" strokeWidth="2" opacity="0.86" />
            {labels && segmentWidth > 38 && (
              <text x={start + segmentWidth / 2} y={y + 6} textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="900">
                {segment.label}
              </text>
            )}
          </g>
        );
      })}
      <line x1={x + width} y1={y - 27} x2={x + width} y2={y + 27} stroke="#ffffff" strokeWidth="2" opacity="0.86" />
      <path d={`M ${x} ${y + 38} Q ${x + width / 2} ${y + 60} ${x + width} ${y + 38}`} fill="none" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
      <text x={x + width / 2} y={y + 82} textAnchor="middle" fill="#0f172a" fontSize="15" fontWeight="900">
        180 deg
      </text>
    </g>
  );
}

function ExteriorAngleSvg({ values, step, labels, secondary, resetKey = 0 }: SvgProps) {
  const defaultPoints = useMemo(() => defaultExteriorAnglePoints(values), [values]);
  const [points, setPoints] = useState(defaultPoints);
  const [dragging, setDragging] = useState<"left" | "top" | "right" | null>(null);
  const activeVertex = useRef<"left" | "top" | "right" | null>(null);

  useEffect(() => {
    setPoints(defaultPoints);
    setDragging(null);
  }, [defaultPoints, resetKey]);

  const left = points.left;
  const top = points.top;
  const right = points.right;
  const extension = { x: Math.min(830, right.x + 220), y: right.y };
  const angles = {
    left: angleAt(left, top, right),
    top: angleAt(top, left, right),
    rightInterior: angleAt(right, left, top),
    exterior: angleAt(right, extension, top),
  };
  const remoteSum = angles.left + angles.top;

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
        setDragging(null);
        event.currentTarget.releasePointerCapture(event.pointerId);
      },
      onPointerDown: (event: PointerEvent<SVGGElement>) => {
        event.preventDefault();
        activeVertex.current = id;
        setDragging(id);
        event.currentTarget.setPointerCapture(event.pointerId);
      },
      onPointerMove: (event: PointerEvent<SVGGElement>) => {
        if (activeVertex.current !== id) return;
        const point = svgPoint(event);
        const limits = id === "top"
          ? { minX: 140, maxX: 500, minY: 105, maxY: 310 }
          : id === "left"
            ? { minX: 70, maxX: Math.max(120, right.x - 90), minY: 265, maxY: 420 }
            : { minX: Math.min(720, left.x + 90), maxX: 720, minY: 265, maxY: 420 };
        const nextPoint = {
          x: clamp(point.x, limits.minX, limits.maxX),
          y: clamp(point.y, limits.minY, limits.maxY),
        };
        setPoints((current) => {
          if (id === "left") {
            return { ...current, left: nextPoint, right: { ...current.right, y: nextPoint.y } };
          }
          if (id === "right") {
            return { ...current, left: { ...current.left, y: nextPoint.y }, right: nextPoint };
          }
          return { ...current, top: nextPoint };
        });
      },
      onPointerUp: (event: PointerEvent<SVGGElement>) => {
        activeVertex.current = null;
        setDragging(null);
        event.currentTarget.releasePointerCapture(event.pointerId);
      },
      role: "button" as const,
      style: { cursor: dragging === id ? "grabbing" : "grab", touchAction: "none" },
      tabIndex: 0,
    };
  }

  return (
    <g>
      <Title title="Exterior angle theorem" subtitle="Drag A, B, or C. The outside angle updates with A + B." />
      <line x1={right.x} y1={right.y} x2={extension.x} y2={extension.y} stroke="#0f172a" strokeWidth="4" strokeLinecap="round" className="dark:stroke-white" />
      <polygon points={polygonPoints([left, top, right])} fill="#ecfeff" stroke="#0891b2" strokeWidth="3.5" />
      <line x1={left.x} y1={left.y} x2={right.x} y2={right.y} stroke="#0f172a" strokeWidth="1.5" opacity="0.16" />
      <DynamicAngleArc vertex={left} pointA={right} pointB={top} color="#f59e0b" radius={44} />
      <DynamicAngleArc vertex={top} pointA={left} pointB={right} color="#22c55e" radius={45} />
      <DynamicAngleArc vertex={right} pointA={left} pointB={top} color="#38bdf8" radius={42} />
      <DynamicAngleArc vertex={right} pointA={extension} pointB={top} color="#ef4444" radius={64} />
      <AngleValueLabel point={left} dx={-44} dy={-18} color="#b45309" label={`A ${formatNumber(angles.left, 1)}`} />
      <AngleValueLabel point={top} dx={0} dy={-38} color="#15803d" label={`B ${formatNumber(angles.top, 1)}`} />
      <AngleValueLabel point={right} dx={-48} dy={-38} color="#0369a1" label={`C ${formatNumber(angles.rightInterior, 1)}`} />
      <AngleValueLabel point={right} dx={116} dy={-38} color="#dc2626" label={`exterior ${formatNumber(angles.exterior, 1)}`} />
      <DraggableVertex point={left} fill="#f59e0b" label="A" active={dragging === "left"} {...vertexProps("left", "Drag vertex A")} />
      <DraggableVertex point={top} fill="#22c55e" label="B" active={dragging === "top"} {...vertexProps("top", "Drag vertex B")} />
      <DraggableVertex point={right} fill="#ef4444" label="C" active={dragging === "right"} {...vertexProps("right", "Drag vertex C and the exterior ray")} />
      {labels && (
        <>
          <Text x={(left.x + top.x) / 2 - 12} y={(left.y + top.y) / 2 - 12}>side AC</Text>
          <Text x={(top.x + right.x) / 2 + 18} y={(top.y + right.y) / 2 - 12}>side BC</Text>
          <Text x={(right.x + extension.x) / 2} y={right.y + 34}>extended side</Text>
        </>
      )}
      <ExteriorAngleLivePanel x={586} y={100} angles={angles} remoteSum={remoteSum} />
      <ExteriorStraightLineComparison x={540} y={392} angles={angles} active={step >= 4 || secondary} labels={labels} />
    </g>
  );
}

function ExteriorAngleLivePanel({
  x,
  y,
  angles,
  remoteSum,
}: {
  x: number;
  y: number;
  angles: { left: number; top: number; rightInterior: number; exterior: number };
  remoteSum: number;
}) {
  const difference = Math.abs(remoteSum - angles.exterior);
  const rows = [
    { label: "A", value: angles.left, color: "#f59e0b" },
    { label: "B", value: angles.top, color: "#22c55e" },
    { label: "C", value: angles.rightInterior, color: "#38bdf8" },
    { label: "Exterior", value: angles.exterior, color: "#ef4444" },
  ];

  return (
    <g aria-label="Live exterior angle values">
      <rect x={x} y={y} width="270" height="238" rx="18" fill="#0f172a" opacity="0.94" />
      <text x={x + 20} y={y + 34} fill="#ffffff" fontSize="18" fontWeight="900">Live angle values</text>
      {rows.map((row, index) => (
        <g key={row.label} transform={`translate(${x + 20} ${y + 58 + index * 34})`}>
          <rect x="0" y="0" width="230" height="27" rx="9" fill="#ffffff" opacity="0.09" />
          <circle cx="17" cy="13.5" r="7.5" fill={row.color} />
          <text x="34" y="19" fill="#ffffff" fontSize="14" fontWeight="900">
            {row.label} = {formatNumber(row.value, 1)} deg
          </text>
        </g>
      ))}
      <line x1={x + 20} y1={y + 199} x2={x + 250} y2={y + 199} stroke="#ffffff" strokeWidth="1.5" opacity="0.28" />
      <text x={x + 135} y={y + 220} textAnchor="middle" fill="#67e8f9" fontSize="16" fontWeight="900">
        A + B = {formatNumber(remoteSum, 1)} deg = exterior
      </text>
      <text x={x + 135} y={y + 238} textAnchor="middle" fill="#cbd5e1" fontSize="12" fontWeight="800">
        gap {formatNumber(difference, 2)} deg
      </text>
    </g>
  );
}

function ExteriorStraightLineComparison({
  x,
  y,
  angles,
  active,
  labels,
}: {
  x: number;
  y: number;
  angles: { left: number; top: number; exterior: number };
  active: boolean;
  labels: boolean;
}) {
  const width = 292;
  const scale = width / 180;
  const exteriorWidth = Math.max(1, Math.min(width, angles.exterior * scale));
  const aWidth = Math.max(1, Math.min(width, angles.left * scale));
  const bWidth = Math.max(1, Math.min(width - aWidth, angles.top * scale));

  return (
    <g aria-label="Straight line exterior angle comparison" opacity={active ? 1 : 0.78}>
      <text x={x + width / 2} y={y - 28} textAnchor="middle" fill="#0f172a" fontSize="16" fontWeight="900">
        straight-line comparison
      </text>
      <line x1={x} y1={y} x2={x + width} y2={y} stroke="#0f172a" strokeWidth="4" strokeLinecap="round" opacity="0.72" />
      <rect x={x} y={y - 47} width={exteriorWidth} height="30" rx="8" fill="#ef4444" opacity="0.86" />
      <text x={x + exteriorWidth / 2} y={y - 27} textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="900">
        exterior {formatNumber(angles.exterior, 1)}
      </text>
      <rect x={x} y={y + 17} width={aWidth} height="34" rx="8" fill="#f59e0b" opacity="0.9" />
      <rect x={x + aWidth} y={y + 17} width={bWidth} height="34" rx="8" fill="#22c55e" opacity="0.9" />
      <line x1={x + exteriorWidth} y1={y - 55} x2={x + exteriorWidth} y2={y + 59} stroke="#ef4444" strokeWidth="2.5" strokeDasharray="6 5" />
      {labels && (
        <>
          <text x={x + aWidth / 2} y={y + 39} textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="900">A</text>
          <text x={x + aWidth + bWidth / 2} y={y + 39} textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="900">B</text>
        </>
      )}
      <path d={`M ${x} ${y + 68} Q ${x + exteriorWidth / 2} ${y + 86} ${x + exteriorWidth} ${y + 68}`} fill="none" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
      <text x={x + width / 2} y={y + 105} textAnchor="middle" fill="#0f172a" fontSize="15" fontWeight="900">
        A + B = {formatNumber(angles.left + angles.top, 1)} deg
      </text>
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

function CircumferenceSvg({ values, step, progress = step, labels, secondary }: SvgProps) {
  const r = values.radius || 75;
  const startX = 120;
  const groundY = 330;
  const travel = 2 * Math.PI * r;
  const rollProgress = smoothstep(clamp01((progress - 1) / 2));
  const distance = travel * rollProgress;
  const cx = startX + distance;
  const cy = groundY - r;
  const markerAngle = -90 + 360 * rollProgress;
  const marker = { x: cx + r * Math.cos(degToRad(markerAngle)), y: cy + r * Math.sin(degToRad(markerAngle)) };
  const unwrapProgress = secondary ? 1 : smoothstep(clamp01((progress - 3) / 1.5));
  const unwrappedLength = travel * unwrapProgress;
  const trail = cycloidPath(startX, cy, r, rollProgress);
  const circumferenceLabelX = Math.min(startX + travel + 18, 760);
  return (
    <g>
      <Title title="Circle circumference by rolling" subtitle="One full turn travels one circumference" />
      <line x1="70" y1={groundY} x2="830" y2={groundY} stroke="#64748b" strokeWidth="3" />
      <line x1={startX} y1={groundY + 15} x2={startX + travel} y2={groundY + 15} stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" opacity={step >= 2 ? 0.35 : 0} />
      {step >= 2 && <line x1={startX} y1={groundY + 15} x2={startX + distance} y2={groundY + 15} stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />}
      {step >= 1 && <path d={trail} fill="none" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="5 6" opacity="0.5" />}
      <ellipse cx={cx} cy={groundY + 8} rx={r * 0.82} ry="8" fill="#0f172a" opacity="0.11" />
      <circle cx={cx} cy={cy} r={r} fill="#ecfeff" stroke="#0891b2" strokeWidth="4" />
      <g transform={`rotate(${360 * rollProgress} ${cx} ${cy})`} opacity="0.58">
        {Array.from({ length: 8 }, (_, index) => {
          const angle = index * 45;
          const end = { x: cx + r * 0.82 * Math.cos(degToRad(angle)), y: cy + r * 0.82 * Math.sin(degToRad(angle)) };
          return <line key={angle} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="#0891b2" strokeWidth="1.4" />;
        })}
      </g>
      <line x1={cx} y1={cy} x2={marker.x} y2={marker.y} stroke="#ef4444" strokeWidth="3" />
      <circle cx={marker.x} cy={marker.y} r="7" fill="#ef4444" />
      <circle cx={cx} cy={groundY} r="4" fill="#0f172a" opacity="0.45" />
      {(step >= 4 || secondary) && (
        <>
          <line x1={startX} y1="405" x2={startX + travel} y2="405" stroke="#bbf7d0" strokeWidth="7" strokeLinecap="round" />
          <line x1={startX} y1="405" x2={startX + unwrappedLength} y2="405" stroke="#22c55e" strokeWidth="7" strokeLinecap="round" />
          <circle cx={startX + unwrappedLength} cy="405" r="6" fill="#22c55e" />
        </>
      )}
      {labels && (
        <>
          <Text x={cx + r / 2} y={cy - 10}>r</Text>
          {step >= 2 && <Text x={Math.min(cx + 28, 745)} y={groundY - 12}>distance rolled = r theta</Text>}
          {(step >= 3 || secondary) && <Text x={circumferenceLabelX} y={groundY + 22}>one full turn = 2 pi r</Text>}
          {(step >= 4 || secondary) && <Text x={startX + 245} y="392">unwrapped boundary = 2 pi r</Text>}
        </>
      )}
    </g>
  );
}

function cycloidPath(startX: number, cy: number, r: number, progress: number) {
  if (progress <= 0) return "";
  const points = Array.from({ length: 40 }, (_, index) => {
    const t = progress * (index / 39);
    const angle = degToRad(-90 + 360 * t);
    return {
      x: startX + 2 * Math.PI * r * t + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  });
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
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
  progress?: number;
  labels: boolean;
  secondary: boolean;
  resetKey?: number;
};

type DragOffset = { x: number; y: number };
type GeometryPoint = { x: number; y: number };
type DragBounds = { maxX: number; maxY: number; minX: number; minY: number };

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

function useSvgDrag(bounds?: DragBounds): DragController {
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
    const clamp = (value: DragOffset) => {
      if (!bounds) return value;
      return {
        x: Math.min(bounds.maxX, Math.max(bounds.minX, value.x)),
        y: Math.min(bounds.maxY, Math.max(bounds.minY, value.y)),
      };
    };
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
          [id]: clamp({
            x: drag.origin.x + point.x - drag.start.x,
            y: drag.origin.y + point.y - drag.start.y,
          }),
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

function defaultExteriorAnglePoints(values: GeometryValues) {
  return {
    left: { x: values.a || 120, y: 360 },
    top: { x: values.b || 260, y: 360 - (values.height || 150) },
    right: { x: 430, y: 360 },
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

function DraggableVertex({ point, fill, label, active, ...props }: { point: GeometryPoint; fill: string; label: string; active?: boolean } & Omit<ReturnType<DragController["draggableProps"]>, "transform">) {
  return (
    <g {...props}>
      <circle cx={point.x} cy={point.y} r={active ? 32 : 27} fill={fill} opacity="0.18" />
      <circle cx={point.x} cy={point.y} r={active ? 20 : 17} fill={fill} stroke="#0f172a" strokeWidth="3.5" />
      <text x={point.x} y={point.y + 5} textAnchor="middle" className="fill-white text-[13px] font-black">{label}</text>
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

function clamp01(value: number) {
  return clamp(value, 0, 1);
}

function smoothstep(value: number) {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
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
