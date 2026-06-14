import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import FormulaPanel from "../../components/FormulaPanel";
import ProofControls from "../../components/ProofControls";
import StepPanel from "../../components/StepPanel";
import VisualProofLayout from "../../components/VisualProofLayout";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { formatCoefficient, getAreaModelRects } from "../../utils/algebraMath";
import type { AlgebraParameterKey, AlgebraProofConfig } from "./algebraProofConfigs";

type AlgebraProofTemplateProps = {
  category: VisualProofCategory;
  proof: VisualProof;
  config: AlgebraProofConfig;
};

type AlgebraValues = Record<AlgebraParameterKey, number>;

const emptyValues: AlgebraValues = { a: 0, b: 0, c: 0, d: 0, x: 0, m: 0, n: 0 };

export default function AlgebraProofTemplate({ category, proof, config }: AlgebraProofTemplateProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [labelsVisible, setLabelsVisible] = useState(true);
  const [formulaVisible, setFormulaVisible] = useState(true);
  const [secondaryVisible, setSecondaryVisible] = useState(false);
  const [values, setValues] = useState<AlgebraValues>(() => ({
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
    }, 1050);
    return () => window.clearInterval(timer);
  }, [config.steps.length, isPlaying]);

  const formulas = useMemo(() => dynamicFormulas(config.formulas, config.kind, values, secondaryVisible), [config.formulas, config.kind, secondaryVisible, values]);

  function reset() {
    setIsPlaying(false);
    setActiveStep(0);
    setLabelsVisible(true);
    setFormulaVisible(true);
    setSecondaryVisible(false);
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
          setActiveStep((step) => Math.max(0, step - 1));
        }}
        onNext={() => {
          setIsPlaying(false);
          setActiveStep((step) => Math.min(config.steps.length - 1, step + 1));
        }}
        onToggleLabels={() => setLabelsVisible((value) => !value)}
        onToggleFormula={() => setFormulaVisible((value) => !value)}
      />
      <section className="rounded-xl border border-slate-200 bg-white/88 p-4 dark:border-white/10 dark:bg-white/[0.05]" aria-label="Algebra proof parameters">
        <h2 className="text-base font-black text-slate-950 dark:text-white">Algebra controls</h2>
        {config.parameters.map((parameter) => (
          <Slider
            key={parameter.key}
            label={parameter.label}
            value={values[parameter.key]}
            min={parameter.min}
            max={safeMax(parameter.key, parameter.max, values)}
            step={parameter.step ?? 1}
            onChange={(value) => setValues((current) => ({ ...current, [parameter.key]: value }))}
          />
        ))}
        {config.secondaryToggle && (
          <button type="button" className="action-secondary mt-4 w-full rounded-xl" onClick={() => setSecondaryVisible((value) => !value)}>
            {config.secondaryToggle}
          </button>
        )}
      </section>
    </div>
  );

  return (
    <VisualProofLayout
      category={category}
      proof={proof}
      visual={<AlgebraVisual config={config} values={values} activeStep={activeStep} labelsVisible={labelsVisible} secondaryVisible={secondaryVisible} />}
      controls={controls}
      steps={<StepPanel steps={config.steps} activeStep={activeStep} onSelectStep={(step) => { setIsPlaying(false); setActiveStep(step); }} />}
      formula={<FormulaPanel visible={formulaVisible} title="Formula and symbolic derivation" formulas={formulas} />}
      conceptNotes={<p>{config.notes}</p>}
      reflectionQuestions={config.questions}
    />
  );
}

function AlgebraVisual({ config, values, activeStep, labelsVisible, secondaryVisible }: { config: AlgebraProofConfig; values: AlgebraValues; activeStep: number; labelsVisible: boolean; secondaryVisible: boolean }) {
  return (
    <div className="bg-white p-3 dark:bg-slate-950">
      <svg viewBox="0 0 900 520" role="img" aria-label={`${config.kind} algebraic identity area model`} className="h-[520px] w-full max-w-full">
        <defs>
          <pattern id="algebra-removed" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 0 10 L 10 0" stroke="#ef4444" strokeWidth="1.4" opacity="0.55" />
          </pattern>
        </defs>
        <rect x="18" y="18" width="864" height="484" rx="18" className="fill-slate-50 stroke-slate-200 dark:fill-slate-900 dark:stroke-white/10" />
        <Title title={titleForKind(config.kind)} subtitle={subtitleForKind(config.kind, values, secondaryVisible)} />
        {renderAlgebraModel(config.kind, values, activeStep, labelsVisible, secondaryVisible)}
      </svg>
    </div>
  );
}

function renderAlgebraModel(kind: AlgebraProofConfig["kind"], values: AlgebraValues, step: number, labels: boolean, secondary: boolean) {
  if (kind === "CubeOfSumProof" || kind === "CubeOfDifferenceProof") return <CubeModel kind={kind} values={values} step={step} labels={labels} secondary={secondary} />;
  if (kind === "ThreeTermSquareProof") return <GridModel values={values} step={step} labels={labels} parts={["a", "b", "c"]} />;
  if (kind === "DistributiveLawAreaModelProof") return <RectGridModel values={values} step={step} labels={labels} widthKeys={["a", "b"]} heightKeys={["c", "d"]} terms={["ac", "bc", "ad", "bd"]} />;
  if (kind === "CompletingTheSquareProof") return <CompletingSquareModel values={values} step={step} labels={labels} secondary={secondary} />;
  if (kind === "QuadraticFactorizationAreaModelProof") return <RectGridModel values={{ ...values, a: values.m, b: values.n }} step={step} labels={labels} widthKeys={["x", "m"]} heightKeys={["x", "n"]} terms={["x^2", "nx", "mx", "mn"]} />;
  if (kind === "PerfectSquareTrinomialRecognitionProof") return <SquareGridModel values={{ ...values, b: values.a }} step={step} labels={labels} mode={secondary ? "minus" : "sum"} />;
  if (kind === "ProductOfBinomialsProof") return <RectGridModel values={values} step={step} labels={labels} widthKeys={["x", "a"]} heightKeys={["x", "b"]} terms={["x^2", "bx", "ax", "ab"]} />;
  if (kind === "SquareOfDifferenceProof") return <SquareGridModel values={values} step={step} labels={labels} mode="difference" secondary={secondary} />;
  if (kind === "DifferenceOfSquaresProof") return <DifferenceSquaresModel values={values} step={step} labels={labels} secondary={secondary} />;
  if (kind === "SumAndDifferenceProductProof") return <DifferenceSquaresModel values={values} step={step} labels={labels} secondary={secondary} productMode />;
  return <SquareGridModel values={values} step={step} labels={labels} mode="sum" secondary={secondary} />;
}

function SquareGridModel({ values, step, labels, mode, secondary = false }: { values: AlgebraValues; step: number; labels: boolean; mode: "sum" | "difference" | "minus"; secondary?: boolean }) {
  const a = values.a || values.x || 5;
  const b = values.b || 3;
  const x = 140;
  const y = 130;
  const size = 280;
  const split = (a / (a + b)) * size;
  const negative = mode !== "sum";
  const rects = [
    { x, y, width: split, height: split, label: mode === "minus" ? "x^2" : "a^2", fill: "#bae6fd" },
    { x: x + split, y, width: size - split, height: split, label: negative ? "-ab" : "ab", fill: negative ? "url(#algebra-removed)" : "#fde68a" },
    { x, y: y + split, width: split, height: size - split, label: negative ? "-ab" : "ab", fill: negative ? "url(#algebra-removed)" : "#fcd34d" },
    { x: x + split, y: y + split, width: size - split, height: size - split, label: mode === "minus" ? "a^2" : "b^2", fill: "#c4b5fd" },
  ];
  return (
    <g>
      {rects.map((rect, index) => (
        <AreaRect key={rect.label + index} rect={rect} active={step >= Math.min(index + 2, 5)} labels={labels} dashed={negative && (index === 1 || index === 2)} />
      ))}
      {secondary && labels && <DimensionBraces x={x} y={y} size={size} split={split} left="a" right="b" />}
      <Text x="635" y="205">{negative ? "subtract strips, then correct overlap" : "whole square = sum of all regions"}</Text>
      <Text x="635" y="250">{mode === "minus" ? "x^2 +/- 2ax + a^2" : mode === "difference" ? "(a - b)^2 = a^2 - 2ab + b^2" : "(a + b)^2 = a^2 + 2ab + b^2"}</Text>
      <NumericExample kind={mode === "sum" ? "sum" : "difference"} values={values} />
    </g>
  );
}

function RectGridModel({ values, step, labels, widthKeys, heightKeys, terms }: { values: AlgebraValues; step: number; labels: boolean; widthKeys: AlgebraParameterKey[]; heightKeys: AlgebraParameterKey[]; terms: string[] }) {
  const widthParts = widthKeys.map((key) => values[key] || 2);
  const heightParts = heightKeys.map((key) => values[key] || 2);
  const rects = getAreaModelRects(widthParts, heightParts, 120, 150, 330, 230);
  return (
    <g>
      {rects.map((rect, index) => (
        <AreaRect key={`${rect.row}-${rect.column}`} rect={{ ...rect, label: terms[index], fill: ["#bae6fd", "#fde68a", "#c4b5fd", "#bbf7d0"][index % 4] }} active={step >= Math.min(index + 2, 5)} labels={labels} />
      ))}
      <Text x="285" y="420">{widthKeys.join(" + ")} by {heightKeys.join(" + ")}</Text>
      <Text x="640" y="225">Each rectangle is one product term.</Text>
      <Text x="640" y="275">{terms.join(" + ")}</Text>
      <NumericExample kind="binomial" values={values} />
    </g>
  );
}

function GridModel({ values, step, labels, parts }: { values: AlgebraValues; step: number; labels: boolean; parts: AlgebraParameterKey[] }) {
  const partValues = parts.map((key) => values[key] || 2);
  const rects = getAreaModelRects(partValues, partValues, 120, 125, 300, 300);
  const termLabels = ["a^2", "ab", "ac", "ba", "b^2", "bc", "ca", "cb", "c^2"];
  return (
    <g>
      {rects.map((rect, index) => (
        <AreaRect key={index} rect={{ ...rect, label: termLabels[index], fill: index % 2 ? "#fde68a" : "#bae6fd" }} active={step >= Math.min(index + 1, 5)} labels={labels} />
      ))}
      <Text x="640" y="230">Pair symmetric regions:</Text>
      <Text x="640" y="275">ab + ba, bc + cb, ca + ac</Text>
      <Text x="640" y="320">a^2 + b^2 + c^2 + 2ab + 2bc + 2ca</Text>
    </g>
  );
}

function CompletingSquareModel({ values, step, labels, secondary }: { values: AlgebraValues; step: number; labels: boolean; secondary: boolean }) {
  const x = 150;
  const y = 150;
  const xSize = 170;
  const half = ((values.b || 4) / 2) * 24;
  return (
    <g>
      <AreaRect rect={{ x, y, width: xSize, height: xSize, label: "x^2", fill: "#bae6fd" }} active labels={labels} />
      <AreaRect rect={{ x: x + xSize, y, width: half, height: xSize, label: "(b/2)x", fill: "#fde68a" }} active={step >= 2} labels={labels} />
      <AreaRect rect={{ x, y: y + xSize, width: xSize, height: half, label: "(b/2)x", fill: "#fcd34d" }} active={step >= 2} labels={labels} />
      <AreaRect rect={{ x: x + xSize, y: y + xSize, width: half, height: half, label: "(b/2)^2", fill: secondary || step >= 4 ? "#c4b5fd" : "none" }} active={secondary || step >= 4} labels={labels} dashed />
      <Text x="650" y="245">missing corner completes the square</Text>
      <Text x="650" y="295">side = x + b/2</Text>
    </g>
  );
}

function DifferenceSquaresModel({ values, step, labels, secondary, productMode = false }: { values: AlgebraValues; step: number; labels: boolean; secondary: boolean; productMode?: boolean }) {
  const a = values.a || 8;
  const b = Math.min(values.b || 3, a - 1);
  const x = 135;
  const y = 125;
  const size = 290;
  const small = (b / a) * size;
  return (
    <g>
      <rect x={x} y={y} width={size} height={size} fill="#bae6fd" stroke="#0891b2" strokeWidth="4" />
      <rect x={x + size - small} y={y + size - small} width={small} height={small} fill="url(#algebra-removed)" stroke="#ef4444" strokeWidth="4" strokeDasharray="8 6" />
      {labels && (
        <>
          <Text x={x + size / 2} y={y + size / 2}>a^2</Text>
          <Text x={x + size - small / 2} y={y + size - small / 2}>b^2 removed</Text>
        </>
      )}
      {(secondary || step >= 3) && <rect x="520" y="185" width="260" height="110" fill="#fef3c7" stroke="#d97706" strokeWidth="4" />}
      <Text x="650" y="335">{productMode ? "(a + b)(a - b)" : "(a - b)(a + b)"}</Text>
      <NumericExample kind="diffSquares" values={{ ...values, b }} />
    </g>
  );
}

function CubeModel({ kind, values, step, labels, secondary }: { kind: AlgebraProofConfig["kind"]; values: AlgebraValues; step: number; labels: boolean; secondary: boolean }) {
  const minus = kind === "CubeOfDifferenceProof";
  const blocks = [
    { x: 170, y: 235, w: 100, h: 80, label: minus ? "a^3" : "a^3", fill: "#bae6fd" },
    { x: 285, y: 215, w: 90, h: 60, label: minus ? "-a^2b" : "a^2b", fill: minus ? "url(#algebra-removed)" : "#fde68a" },
    { x: 225, y: 145, w: 95, h: 55, label: minus ? "+ab^2" : "ab^2", fill: minus ? "#bbf7d0" : "#c4b5fd" },
    { x: 345, y: 145, w: 58, h: 48, label: minus ? "-b^3" : "b^3", fill: minus ? "url(#algebra-removed)" : "#fca5a5" },
  ];
  return (
    <g>
      {blocks.map((block, index) => (
        <IsoBlock key={block.label} block={block} active={step >= index + 1} labels={labels} offset={secondary ? index * 18 : 0} />
      ))}
      <Text x="650" y="220">{minus ? "subtract slabs, correct overlaps" : "volume blocks group as 1, 3, 3, 1"}</Text>
      <Text x="650" y="270">{minus ? "(a - b)^3 = a^3 - 3a^2b + 3ab^2 - b^3" : "(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3"}</Text>
      <NumericExample kind={minus ? "cubeDiff" : "cubeSum"} values={values} />
    </g>
  );
}

function AreaRect({ rect, active, labels, dashed = false }: { rect: { x: number; y: number; width: number; height: number; label: string; fill: string }; active: boolean; labels: boolean; dashed?: boolean }) {
  return (
    <g opacity={active ? 1 : 0.35} className="transition-opacity duration-500">
      <rect x={rect.x} y={rect.y} width={rect.width} height={rect.height} fill={rect.fill} stroke={dashed ? "#ef4444" : "#0f172a"} strokeWidth="3" strokeDasharray={dashed ? "8 6" : undefined} />
      {labels && rect.width > 38 && rect.height > 30 && <Text x={rect.x + rect.width / 2} y={rect.y + rect.height / 2 + 5}>{rect.label}</Text>}
    </g>
  );
}

function IsoBlock({ block, active, labels, offset }: { block: { x: number; y: number; w: number; h: number; label: string; fill: string }; active: boolean; labels: boolean; offset: number }) {
  const x = block.x + offset;
  const y = block.y - offset * 0.4;
  return (
    <g opacity={active ? 1 : 0.28} className="transition-opacity duration-500">
      <polygon points={`${x},${y} ${x + block.w},${y} ${x + block.w + 35},${y - 28} ${x + 35},${y - 28}`} fill={block.fill} stroke="#0f172a" strokeWidth="2" />
      <polygon points={`${x + block.w},${y} ${x + block.w + 35},${y - 28} ${x + block.w + 35},${y + block.h - 28} ${x + block.w},${y + block.h}`} fill={block.fill} opacity="0.75" stroke="#0f172a" strokeWidth="2" />
      <polygon points={`${x},${y} ${x + block.w},${y} ${x + block.w},${y + block.h} ${x},${y + block.h}`} fill={block.fill} opacity="0.9" stroke="#0f172a" strokeWidth="2" />
      {labels && <Text x={x + block.w / 2} y={y + block.h / 2 + 5}>{block.label}</Text>}
    </g>
  );
}

function DimensionBraces({ x, y, size, split, left, right }: { x: number; y: number; size: number; split: number; left: string; right: string }) {
  return (
    <g>
      <line x1={x} y1={y - 20} x2={x + split} y2={y - 20} stroke="#0891b2" strokeWidth="3" />
      <line x1={x + split} y1={y - 20} x2={x + size} y2={y - 20} stroke="#d97706" strokeWidth="3" />
      <Text x={x + split / 2} y={y - 30}>{left}</Text>
      <Text x={x + split + (size - split) / 2} y={y - 30}>{right}</Text>
    </g>
  );
}

function NumericExample({ kind, values }: { kind: string; values: AlgebraValues }) {
  const a = values.a || 5;
  const b = values.b || 3;
  const x = values.x || 5;
  const m = values.m || 2;
  const n = values.n || 3;
  let line = `Example: (${a} + ${b})^2 = ${(a + b) ** 2}`;
  if (kind === "difference") line = `Example: (${a} - ${b})^2 = ${(a - b) ** 2}`;
  if (kind === "diffSquares") line = `Example: ${a}^2 - ${b}^2 = ${a ** 2 - b ** 2}`;
  if (kind === "binomial") line = `Example: (${x} + ${m || a})(${x} + ${n || b})`;
  if (kind === "cubeSum") line = `Example: (${a} + ${b})^3 = ${(a + b) ** 3}`;
  if (kind === "cubeDiff") line = `Example: (${a} - ${b})^3 = ${(a - b) ** 3}`;
  return <Text x="650" y="385">{line}</Text>;
}

function Slider({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void }) {
  const safeValue = Math.min(value, max);
  const progress = `${((safeValue - min) / (max - min)) * 100}%`;
  return (
    <label className="mt-4 block">
      <span className="flex items-center justify-between gap-3 text-sm font-bold text-slate-700 dark:text-slate-200">
        {label}
        <span className="mini-chip">{formatCoefficient(safeValue)}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={safeValue} onChange={(event) => onChange(Number(event.target.value))} style={{ "--slider-progress": progress } as CSSProperties} className="mt-3 w-full accent-cyan-500" aria-label={label} />
    </label>
  );
}

function safeMax(key: AlgebraParameterKey, max: number, values: AlgebraValues) {
  if (key === "b" && values.a > 0) return Math.min(max, Math.max(1, values.a - 1));
  return max;
}

function dynamicFormulas(formulas: string[], kind: AlgebraProofConfig["kind"], values: AlgebraValues, secondary: boolean) {
  const a = values.a || 5;
  const b = values.b || 3;
  const x = values.x || 5;
  const m = values.m || 2;
  const n = values.n || 3;
  if (kind === "SquareOfSumProof") return [...formulas, `For a = ${a}, b = ${b}: (${a} + ${b})^2 = ${a ** 2} + 2(${a})(${b}) + ${b ** 2} = ${(a + b) ** 2}`];
  if (kind === "SquareOfDifferenceProof") return [...formulas, `For a = ${a}, b = ${b}: (${a} - ${b})^2 = ${a ** 2} - 2(${a})(${b}) + ${b ** 2} = ${(a - b) ** 2}`];
  if (kind === "ProductOfBinomialsProof") return [...formulas, `For x = ${x}, a = ${a}, b = ${b}: x^2 + ${(a + b)}x + ${a * b}`];
  if (kind === "QuadraticFactorizationAreaModelProof") return [...formulas, `For m = ${m}, n = ${n}: x^2 + ${m + n}x + ${m * n} = (x + ${m})(x + ${n})`];
  if (kind === "PerfectSquareTrinomialRecognitionProof") return [...formulas, secondary ? `Minus version: x^2 - ${2 * a}x + ${a ** 2} = (x - ${a})^2` : `Plus version: x^2 + ${2 * a}x + ${a ** 2} = (x + ${a})^2`];
  return formulas;
}

function titleForKind(kind: AlgebraProofConfig["kind"]) {
  return kind.replace(/Proof$/, "").replace(/([A-Z])/g, " $1").trim();
}

function subtitleForKind(kind: AlgebraProofConfig["kind"], values: AlgebraValues, secondary: boolean) {
  if (kind.includes("Cube")) return secondary ? "Exploded isometric volume model" : "Isometric SVG volume model";
  if (kind === "PerfectSquareTrinomialRecognitionProof") return secondary ? "Checking x^2 - 2ax + a^2" : "Checking x^2 + 2ax + a^2";
  return `Current values: a=${values.a || "-"}, b=${values.b || "-"}, x=${values.x || "-"}`;
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
  return <text x={x} y={y} textAnchor="middle" className="fill-slate-800 text-[15px] font-black dark:fill-slate-100">{children}</text>;
}
