import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Expand,
  Lightbulb,
  RefreshCw,
  RotateCcw,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MathExpression from "../components/ui/MathExpression";
import "./CalculusIntegrationTechniquesStudio.css";

type Props = { mode: string };
export type TechniqueId =
  "substitution" | "parts" | "partial" | "trig" | "trig-sub" | "improper";
type TechniqueConfig = {
  title: string;
  problem: string;
  original: string;
  choiceTitle: string;
  choice: string;
  differential: string;
  transformed: string;
  evaluation: string;
  result: string;
  numeric: (lower: number, upper: number) => number;
  xCurve: (x: number) => number;
  uCurve: (u: number) => number;
  xLabel: string;
  uLabel: string;
  mapBound: (x: number) => number;
  parts: Array<{ formula: string; tone: "cyan" | "violet" }>;
  scaling: string;
  insight: string;
  defaults: [number, number];
};

const techniques: Record<TechniqueId, TechniqueConfig> = {
  substitution: {
    title: "Substitution",
    problem: "\\int_0^2 x\\sqrt{x^2+1}\\,dx",
    original: "I=\\int_0^2 x\\sqrt{x^2+1}\\,dx",
    choiceTitle: "Suggested substitution",
    choice: "u=x^2+1",
    differential: "du=2x\\,dx\\quad\\Rightarrow\\quad x\\,dx=\\frac12du",
    transformed: "I=\\frac12\\int_1^5 u^{1/2}\\,du",
    evaluation:
      "\\frac12\\left[\\frac23u^{3/2}\\right]_1^5=\\frac13(5\\sqrt5-1)",
    result: "3.3939",
    numeric: (lower, upper) =>
      (Math.pow(upper * upper + 1, 1.5) - Math.pow(lower * lower + 1, 1.5)) / 3,
    xCurve: (x) => x * Math.sqrt(x * x + 1),
    uCurve: (u) => 0.5 * Math.sqrt(Math.max(0, u)),
    xLabel: "y=x\\sqrt{x^2+1}",
    uLabel: "y=\\frac12\\sqrt{u}",
    mapBound: (x) => x * x + 1,
    parts: [
      { formula: "x", tone: "cyan" },
      { formula: "\\sqrt{x^2+1}", tone: "violet" },
    ],
    scaling: "du=2x\\,dx\\quad\\Rightarrow\\quad x\\,dx=\\frac12du",
    insight:
      "Substitution simplifies the integrand by changing variables. The bounds and differential are transformed together, preserving the integral value.",
    defaults: [0, 2],
  },
  parts: {
    title: "Integration by parts",
    problem: "\\int_0^2 xe^x\\,dx",
    original: "I=\\int_0^2 xe^x\\,dx",
    choiceTitle: "Choose the product split",
    choice: "u=x,\\quad dv=e^x\\,dx",
    differential: "du=dx,\\quad v=e^x",
    transformed: "I=[xe^x]_0^2-\\int_0^2e^x\\,dx",
    evaluation: "[e^x(x-1)]_0^2=e^2+1",
    result: "8.3891",
    numeric: (lower, upper) =>
      Math.exp(upper) * (upper - 1) - Math.exp(lower) * (lower - 1),
    xCurve: (x) => Math.max(0, x * Math.exp(x)),
    uCurve: (u) => Math.exp(u),
    xLabel: "y=xe^x",
    uLabel: "v=e^x",
    mapBound: (x) => x,
    parts: [
      { formula: "x", tone: "cyan" },
      { formula: "e^x", tone: "violet" },
    ],
    scaling: "\\int u\\,dv=uv-\\int v\\,du",
    insight:
      "Integration by parts reverses the product rule. Choose u to simplify when differentiated and dv to remain easy to integrate.",
    defaults: [0, 2],
  },
  partial: {
    title: "Partial fractions",
    problem: "\\int_2^4\\frac{dx}{x^2-1}",
    original: "I=\\int_2^4\\frac{dx}{(x-1)(x+1)}",
    choiceTitle: "Decompose the rational function",
    choice: "\\frac1{x^2-1}=\\frac12\\left(\\frac1{x-1}-\\frac1{x+1}\\right)",
    differential: "A=\\frac12,\\quad B=-\\frac12",
    transformed:
      "I=\\frac12\\int_2^4\\left(\\frac1{x-1}-\\frac1{x+1}\\right)dx",
    evaluation: "\\frac12\\left[\\ln|x-1|-\\ln|x+1|\\right]_2^4",
    result: "0.2939",
    numeric: (lower, upper) =>
      0.5 *
      Math.log(
        Math.abs(((upper - 1) * (lower + 1)) / ((upper + 1) * (lower - 1))),
      ),
    xCurve: (x) => 1 / Math.max(0.08, Math.abs(x * x - 1)),
    uCurve: (u) => 0.5 / Math.max(0.08, Math.abs(u - 1)),
    xLabel: "y=1/(x^2-1)",
    uLabel: "A/(x-1)+B/(x+1)",
    mapBound: (x) => x,
    parts: [
      { formula: "x-1", tone: "cyan" },
      { formula: "x+1", tone: "violet" },
    ],
    scaling: "\\frac{A}{x-1}+\\frac{B}{x+1}",
    insight:
      "Partial fractions replace one rational expression with simpler fractions whose antiderivatives are logarithms.",
    defaults: [2, 4],
  },
  trig: {
    title: "Trigonometric integrals",
    problem: "\\int_0^{\\pi/2}\\sin^2x\\,dx",
    original: "I=\\int_0^{\\pi/2}\\sin^2x\\,dx",
    choiceTitle: "Apply a power-reduction identity",
    choice: "\\sin^2x=\\frac{1-\\cos2x}{2}",
    differential: "\\int\\sin^2x\\,dx=\\frac{x}{2}-\\frac{\\sin2x}{4}",
    transformed: "I=\\frac12\\int_0^{\\pi/2}(1-\\cos2x)\\,dx",
    evaluation:
      "\\left[\\frac{x}{2}-\\frac{\\sin2x}{4}\\right]_0^{\\pi/2}=\\frac\\pi4",
    result: "0.7854",
    numeric: (lower, upper) =>
      upper / 2 -
      Math.sin(2 * upper) / 4 -
      (lower / 2 - Math.sin(2 * lower) / 4),
    xCurve: (x) => Math.sin(x) ** 2,
    uCurve: (u) => (1 - Math.cos(2 * u)) / 2,
    xLabel: "y=\\sin^2x",
    uLabel: "y=(1-\\cos2x)/2",
    mapBound: (x) => x,
    parts: [
      { formula: "\\sin x", tone: "cyan" },
      { formula: "\\sin x", tone: "violet" },
    ],
    scaling: "\\sin^2x=\\frac{1-\\cos2x}{2}",
    insight:
      "Power-reduction identities turn even trigonometric powers into sums that integrate term by term.",
    defaults: [0, Math.PI / 2],
  },
  "trig-sub": {
    title: "Trigonometric substitution",
    problem: "\\int_0^2\\sqrt{9-x^2}\\,dx",
    original: "I=\\int_0^2\\sqrt{9-x^2}\\,dx",
    choiceTitle: "Match the radical to an identity",
    choice: "x=3\\sin\\theta",
    differential: "dx=3\\cos\\theta\\,d\\theta",
    transformed: "I=9\\int_0^{\\sin^{-1}(2/3)}\\cos^2\\theta\\,d\\theta",
    evaluation: "\\frac12[x\\sqrt{9-x^2}+9\\sin^{-1}(x/3)]_0^2",
    result: "5.4789",
    numeric: (lower, upper) => primitiveCircle(upper) - primitiveCircle(lower),
    xCurve: (x) => Math.sqrt(Math.max(0, 9 - x * x)),
    uCurve: (u) => 9 * Math.cos(u) ** 2,
    xLabel: "y=\\sqrt{9-x^2}",
    uLabel: "y=9\\cos^2\\theta",
    mapBound: (x) => Math.asin(clamp(x / 3, -1, 1)),
    parts: [
      { formula: "x", tone: "cyan" },
      { formula: "\\sqrt{9-x^2}", tone: "violet" },
    ],
    scaling: "9-x^2=9(1-\\sin^2\\theta)=9\\cos^2\\theta",
    insight:
      "A trigonometric substitution replaces a radical with a Pythagorean identity and transforms both dx and the bounds.",
    defaults: [0, 2],
  },
  improper: {
    title: "Improper integrals",
    problem: "\\int_1^\\infty\\frac1{x^2}\\,dx",
    original: "I=\\int_1^\\infty x^{-2}\\,dx",
    choiceTitle: "Replace infinity with a limit",
    choice: "I=\\lim_{b\\to\\infty}\\int_1^b x^{-2}\\,dx",
    differential: "\\int x^{-2}dx=-x^{-1}",
    transformed: "I=\\lim_{b\\to\\infty}[-1/x]_1^b",
    evaluation: "\\lim_{b\\to\\infty}(1-1/b)=1",
    result: "1.0000",
    numeric: (lower, upper) =>
      1 / Math.max(0.1, lower) - 1 / Math.max(0.1, upper),
    xCurve: (x) => 1 / Math.max(0.1, x * x),
    uCurve: (u) => 1 - 1 / Math.max(1, u),
    xLabel: "y=1/x^2",
    uLabel: "A(b)=1-1/b",
    mapBound: (x) => x,
    parts: [
      { formula: "1", tone: "cyan" },
      { formula: "x^2", tone: "violet" },
    ],
    scaling: "\\int_a^\\infty f(x)dx=\\lim_{b\\to\\infty}\\int_a^bf(x)dx",
    insight:
      "An improper integral is defined by a limit. Convergence means the finite-bound areas approach a finite value.",
    defaults: [1, 8],
  },
};

const workflow = [
  "Choose Technique",
  "Set Up",
  "Transform Integral",
  "Evaluate",
  "Verify",
];

export default function CalculusIntegrationTechniquesStudio({ mode }: Props) {
  const [params, setParams] = useSearchParams();
  const technique = isTechnique(mode) ? mode : "substitution";
  const config = techniques[technique];
  const initialLower = numberParam(params.get("v_b"), config.defaults[0]);
  const initialUpper = numberParam(params.get("v_a"), config.defaults[1]);
  const [lower, setLower] = useState(Math.min(initialLower, initialUpper));
  const [upper, setUpper] = useState(Math.max(initialLower, initialUpper));
  const [resolution, setResolution] = useState(
    clamp(Math.round(numberParam(params.get("v_n"), 20)), 8, 80),
  );
  const [step, setStep] = useState(
    clamp(Math.round(numberParam(params.get("v_step"), 2)), 1, 6),
  );
  const [showBounds, setShowBounds] = useState(true);
  const [selectedPart, setSelectedPart] = useState(0);
  const [tipsOpen, setTipsOpen] = useState(false);
  const previousTechnique = useRef(technique);

  useEffect(() => {
    const next = new URLSearchParams(params);
    next.set("v_a", trim(upper));
    next.set("v_b", trim(lower));
    next.set("v_n", String(resolution));
    next.set("v_step", String(step));
    if (next.toString() !== params.toString())
      setParams(next, { replace: true });
  }, [lower, params, resolution, setParams, step, upper]);

  useEffect(() => {
    if (previousTechnique.current === technique) return;
    previousTechnique.current = technique;
    setLower(config.defaults[0]);
    setUpper(config.defaults[1]);
    setStep(2);
    setSelectedPart(0);
    setTipsOpen(false);
  }, [config, technique]);

  const mappedLower = config.mapBound(lower);
  const mappedUpper = config.mapBound(upper);
  const currentValue = useMemo(
    () => config.numeric(lower, upper),
    [config, lower, upper],
  );
  const validValue = Number.isFinite(currentValue);
  const nextExample = () => {
    const [baseLower, baseUpper] = config.defaults;
    const shiftedUpper =
      technique === "improper"
        ? upper >= 16
          ? 6
          : upper + 2
        : upper >= baseUpper + 1
          ? baseUpper
          : upper + 0.5;
    setLower(baseLower);
    setUpper(Math.max(baseLower + 0.25, shiftedUpper));
    setStep(1);
  };
  const reset = () => {
    setLower(config.defaults[0]);
    setUpper(config.defaults[1]);
    setResolution(20);
    setStep(2);
    setShowBounds(true);
    setSelectedPart(0);
    setTipsOpen(false);
  };

  return (
    <section className="its-studio" aria-label={`${config.title} workspace`}>
      <div className="its-screen-badge">Screen 6 of 10</div>
      <div className="its-layout">
        <aside className="its-left">
          <Panel title="Problem">
            <p>Evaluate the integral</p>
            <MathExpression value={config.problem} display />
          </Panel>
          <Panel title={config.choiceTitle} tone="success">
            <MathExpression value={config.choice} display />
            <span className="its-valid">
              <Check /> Valid transformation
            </span>
            <MathExpression value={config.differential} display />
          </Panel>
          <Panel title="Expression parts">
            <p>Click to highlight matching parts</p>
            <div
              className="its-parts"
              role="group"
              aria-label="Expression parts"
            >
              {config.parts.map((part, index) => (
                <button
                  key={`${part.formula}-${index}`}
                  type="button"
                  className={`${part.tone} ${selectedPart === index ? "active" : ""}`}
                  aria-pressed={selectedPart === index}
                  onClick={() => setSelectedPart(index)}
                >
                  <MathExpression value={part.formula} />
                </button>
              ))}
              <MathExpression value="dx" />
            </div>
            <div className="its-part-key">
              <i className="cyan" /> matches the differential{" "}
              <i className="violet" /> becomes the transformed power
            </div>
          </Panel>
          <Panel
            title="Bounds transformation"
            action={
              <Toggle
                checked={showBounds}
                onChange={setShowBounds}
                label="Show transformed bounds"
              />
            }
          >
            {showBounds ? (
              <div className="its-bound-table">
                <div>
                  <span>x</span>
                  <span>
                    {technique === "trig-sub"
                      ? "theta"
                      : technique === "improper"
                        ? "b"
                        : "u"}
                  </span>
                </div>
                <label>
                  <input
                    aria-label="Lower bound"
                    type="number"
                    step="0.1"
                    value={lower}
                    onChange={(event) =>
                      setLower(
                        Math.min(Number(event.target.value), upper - 0.1),
                      )
                    }
                  />
                  <ArrowRight />
                  <b>{trim(mappedLower)}</b>
                </label>
                <label>
                  <input
                    aria-label="Upper bound"
                    type="number"
                    step="0.1"
                    value={upper}
                    onChange={(event) =>
                      setUpper(
                        Math.max(Number(event.target.value), lower + 0.1),
                      )
                    }
                  />
                  <ArrowRight />
                  <b>{trim(mappedUpper)}</b>
                </label>
              </div>
            ) : (
              <p className="its-muted">
                Original bounds remain visible on the graphs.
              </p>
            )}
          </Panel>
          <Panel title="Step controls">
            <div className="its-stepper">
              <button
                type="button"
                aria-label="First step"
                onClick={() => setStep(1)}
              >
                <ChevronLeft />
                <ChevronLeft />
              </button>
              <button
                type="button"
                aria-label="Previous step"
                onClick={() => setStep((value) => Math.max(1, value - 1))}
              >
                <ChevronLeft />
              </button>
              <strong>Step {step} of 6</strong>
              <button
                type="button"
                aria-label="Next step"
                onClick={() => setStep((value) => Math.min(6, value + 1))}
              >
                <ChevronRight />
              </button>
              <button
                type="button"
                aria-label="Last step"
                onClick={() => setStep(6)}
              >
                <ChevronRight />
                <ChevronRight />
              </button>
            </div>
            <button
              className="its-outline-command"
              type="button"
              onClick={nextExample}
            >
              <RefreshCw /> Try another{" "}
              {technique === "substitution" ? "substitution" : "example"}
            </button>
          </Panel>
        </aside>

        <main className="its-main">
          <section className="its-panel its-symbolic">
            <header>
              <PanelHeading title="Symbolic Transformation" />
              <button
                type="button"
                aria-label="Fullscreen transformation"
                onClick={() => void toggleFullscreen()}
              >
                <Expand />
              </button>
            </header>
            <div className="its-flow">
              <FormulaStage
                title="Original Integral"
                formula={config.original}
                active={step <= 2}
              />
              <ArrowRight />
              <FormulaStage
                title={technique === "parts" ? "Choose u and dv" : "Transform"}
                formula={[config.choice, config.differential]}
              />
              <ArrowRight />
              <FormulaStage
                title="Transformed Integral"
                formula={config.transformed}
                active={step >= 3}
                violet
              />
            </div>
          </section>
          <section className="its-panel its-geometry">
            <h2>Geometric View: Region Before and After {config.title}</h2>
            <div className="its-graphs">
              <TechniqueGraph
                title="x-space (original)"
                label={config.xLabel}
                curve={config.xCurve}
                lower={lower}
                upper={upper}
                resolution={resolution}
                color="#06aeda"
              />
              <div className="its-map-arrow">
                <ArrowLeft />
                <ArrowRight />
              </div>
              <TechniqueGraph
                title={
                  technique === "trig-sub"
                    ? "theta-space (transformed)"
                    : technique === "improper"
                      ? "limit view"
                      : "u-space (transformed)"
                }
                label={config.uLabel}
                curve={config.uCurve}
                lower={mappedLower}
                upper={mappedUpper}
                resolution={resolution}
                color="#7c3aed"
              />
            </div>
            <div className="its-graph-meta">
              <span>
                <i className="cyan" /> {trim(lower)}
              </span>
              <span>
                <i className="cyan" /> {trim(upper)}
              </span>
              <strong>
                Area = {validValue ? Math.abs(currentValue).toFixed(3) : "--"}
              </strong>
              <span>
                <i className="violet" /> {trim(mappedLower)}
              </span>
              <span>
                <i className="violet" /> {trim(mappedUpper)}
              </span>
              <strong>
                Area = {validValue ? Math.abs(currentValue).toFixed(3) : "--"}
              </strong>
            </div>
          </section>
          <section className="its-insight">
            <Lightbulb />
            <p>
              The transformation maps the original interval to its new variable
              while preserving the integral value.{" "}
              <MathExpression value={config.scaling} />
            </p>
          </section>
        </main>

        <aside className="its-right">
          <Panel
            title={
              technique === "substitution"
                ? "Live substitution values"
                : "Live transformation values"
            }
          >
            <div className="its-live-bounds">
              <span>When x = {trim(lower)}</span>
              <ArrowRight />
              <MathExpression value={`u=${trim(mappedLower)}`} />
              <span>When x = {trim(upper)}</span>
              <ArrowRight />
              <MathExpression value={`u=${trim(mappedUpper)}`} />
            </div>
            <span className="its-valid">
              Bounds transformed <Check />
            </span>
          </Panel>
          <Panel title="Transformed integral">
            <div className="its-result-formula">
              <MathExpression value={config.transformed} display />
            </div>
            <b>Evaluate</b>
            <MathExpression value={config.evaluation} display />
            <b>Numeric value</b>
            <div className="its-numeric">
              = {validValue ? currentValue.toFixed(4) : config.result}
              <Check />
            </div>
          </Panel>
          <Panel title="Step validation">
            <span className="its-valid">
              {step === 6 ? "All steps complete" : `Step ${step} is valid`}
            </span>
            <div className="its-validation">
              {Array.from({ length: 6 }, (_, index) => (
                <button
                  type="button"
                  key={index}
                  className={index + 1 <= step ? "done" : ""}
                  onClick={() => setStep(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </Panel>
          <Panel title="Jacobian scaling insight">
            <MathExpression value={config.scaling} display />
            <p>
              This factor accounts for the change in the differential and keeps
              both integral values equal.
            </p>
          </Panel>
          <Panel title="Why this works">
            <p>{config.insight}</p>
          </Panel>
          <Panel title="Resolution">
            <label className="its-resolution">
              <span>Graph samples</span>
              <b>{resolution}</b>
              <input
                aria-label="Graph samples"
                type="range"
                min="8"
                max="80"
                step="1"
                value={resolution}
                onChange={(event) => setResolution(Number(event.target.value))}
              />
            </label>
          </Panel>
        </aside>
      </div>

      <footer className="its-guided">
        <strong>
          <RefreshCw /> Guided Learning
        </strong>
        {workflow.map((label, index) => (
          <button
            type="button"
            key={label}
            className={
              step === index + 1 ? "active" : step > index + 1 ? "done" : ""
            }
            onClick={() => setStep(index + 1)}
          >
            <span>{index + 1}</span>
            {label}
            {step > index + 1 && <Check />}
          </button>
        ))}
        <button
          type="button"
          className={tipsOpen ? "active" : ""}
          aria-expanded={tipsOpen}
          onClick={() => setTipsOpen((value) => !value)}
        >
          <Lightbulb /> Tips
        </button>
      </footer>
      {tipsOpen && (
        <div className="its-tip" role="status">
          Track the differential first, then transform the bounds before
          evaluating. Both graphs should report the same shaded area.
        </div>
      )}
      <button className="its-reset" type="button" onClick={reset}>
        <RotateCcw /> Reset studio
      </button>
    </section>
  );
}

function Panel({
  title,
  children,
  action,
  tone = "plain",
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  tone?: "plain" | "success";
}) {
  return (
    <section
      className={`its-panel its-small-panel ${tone === "success" ? "success" : ""}`}
    >
      <header>
        <PanelHeading title={title} />
        {action}
      </header>
      {children}
    </section>
  );
}

function PanelHeading({ title }: { title: string }) {
  return (
    <h2>
      <i />
      {title}
    </h2>
  );
}

function FormulaStage({
  title,
  formula,
  active = false,
  violet = false,
}: {
  title: string;
  formula: string | string[];
  active?: boolean;
  violet?: boolean;
}) {
  return (
    <div
      className={`its-formula-stage ${active ? "active" : ""} ${violet ? "violet" : ""}`}
    >
      <strong>{title}</strong>
      {(Array.isArray(formula) ? formula : [formula]).map((value) => (
        <MathExpression key={value} value={value} display />
      ))}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      className={`its-toggle ${checked ? "on" : ""}`}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
    >
      <span />
    </button>
  );
}

function TechniqueGraph({
  title,
  label,
  curve,
  lower,
  upper,
  resolution,
  color,
}: {
  title: string;
  label: string;
  curve: (x: number) => number;
  lower: number;
  upper: number;
  resolution: number;
  color: string;
}) {
  const width = 360,
    height = 270,
    pad = 38;
  const lo = Math.min(lower, upper),
    hi = Math.max(lower, upper);
  const span = Math.max(0.2, hi - lo),
    xMin = lo - span * 0.32,
    xMax = hi + span * 0.32;
  const points = Array.from(
    { length: Math.max(16, resolution) },
    (_, index) => {
      const x = xMin + (index / (Math.max(16, resolution) - 1)) * (xMax - xMin);
      return { x, y: safe(curve, x) };
    },
  );
  const finite = points.map((point) => point.y).filter(Number.isFinite);
  const yMax = Math.max(1, Math.min(20, Math.max(...finite)));
  const sx = (x: number) =>
    pad + ((x - xMin) / (xMax - xMin)) * (width - pad * 2);
  const sy = (y: number) =>
    height - pad - (clamp(y, 0, yMax) / yMax) * (height - pad * 2);
  const curvePath = path(points, sx, sy);
  const areaPoints = points.filter(
    (point) => point.x >= lo && point.x <= hi && Number.isFinite(point.y),
  );
  const areaPath = areaPoints.length
    ? `M${sx(areaPoints[0].x)},${sy(0)} ${areaPoints.map((point) => `L${sx(point.x)},${sy(point.y)}`).join(" ")} L${sx(areaPoints.at(-1)?.x ?? hi)},${sy(0)} Z`
    : "";
  return (
    <figure className="its-graph-card">
      <figcaption>{title}</figcaption>
      <MathExpression value={label} />
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`${title} graph`}
      >
        <defs>
          <clipPath id={`its-clip-${title.replace(/[^a-z]/gi, "-")}`}>
            <rect x={pad} y={pad} width={width-pad*2} height={height-pad*2} />
          </clipPath>
        </defs>
        <rect width={width} height={height} fill="#fff" />
        {Array.from({ length: 7 }, (_, index) => (
          <line
            key={`v${index}`}
            x1={pad + (index * (width - pad * 2)) / 6}
            x2={pad + (index * (width - pad * 2)) / 6}
            y1={pad}
            y2={height - pad}
            className="grid"
          />
        ))}
        {Array.from({ length: 6 }, (_, index) => (
          <line
            key={`h${index}`}
            x1={pad}
            x2={width - pad}
            y1={pad + (index * (height - pad * 2)) / 5}
            y2={pad + (index * (height - pad * 2)) / 5}
            className="grid"
          />
        ))}
        <line
          x1={pad}
          x2={width - pad}
          y1={sy(0)}
          y2={sy(0)}
          className="axis"
        />
        <line
          x1={sx(0)}
          x2={sx(0)}
          y1={pad}
          y2={height - pad}
          className="axis"
        />
        <g clipPath={`url(#its-clip-${title.replace(/[^a-z]/gi, "-")})`}>
          <path d={areaPath} fill="#f7c64a" opacity=".42" />
          <path d={curvePath} fill="none" stroke={color} strokeWidth="3" />
        </g>
        <line
          x1={sx(lo)}
          x2={sx(lo)}
          y1={sy(0)}
          y2={sy(safe(curve, lo))}
          className="bound"
        />
        <line
          x1={sx(hi)}
          x2={sx(hi)}
          y1={sy(0)}
          y2={sy(safe(curve, hi))}
          className="bound"
        />
        <circle cx={sx(lo)} cy={sy(safe(curve, lo))} r="4" fill={color} />
        <circle cx={sx(hi)} cy={sy(safe(curve, hi))} r="4" fill={color} />
        <text className="tick-label" x={sx(lo)} y={height-pad+18}>{trim(lo)}</text>
        <text className="tick-label" x={sx(hi)} y={height-pad+18}>{trim(hi)}</text>
        <text className="axis-label" x={width-pad+8} y={height-pad+4}>{title.startsWith("x-") ? "x" : title.startsWith("theta-") ? "θ" : title.startsWith("limit") ? "b" : "u"}</text>
        <text className="axis-label" x={sx(0)+7} y={pad-8}>y</text>
      </svg>
    </figure>
  );
}

function isTechnique(value: string): value is TechniqueId {
  return value in techniques;
}

export function evaluateTechnique(
  technique: TechniqueId,
  lower: number,
  upper: number,
) {
  const config = techniques[technique];
  return {
    value: config.numeric(lower, upper),
    mappedBounds: [config.mapBound(lower), config.mapBound(upper)] as const,
    original: config.original,
    transformed: config.transformed,
  };
}

function primitiveCircle(x: number) {
  const value = clamp(x, -3, 3);
  return (
    0.5 *
    (value * Math.sqrt(Math.max(0, 9 - value * value)) +
      9 * Math.asin(value / 3))
  );
}

function numberParam(value: string | null, fallback: number) {
  if (value === null || value.trim() === "") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function safe(fn: (x: number) => number, x: number) {
  try {
    const value = fn(x);
    return Number.isFinite(value) ? value : NaN;
  } catch {
    return NaN;
  }
}

function path(
  points: Array<{ x: number; y: number }>,
  sx: (x: number) => number,
  sy: (y: number) => number,
) {
  let open = false;
  return points
    .map((point) => {
      if (!Number.isFinite(point.y)) {
        open = false;
        return "";
      }
      const command = open ? "L" : "M";
      open = true;
      return `${command}${sx(point.x).toFixed(2)},${sy(point.y).toFixed(2)}`;
    })
    .join(" ");
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function trim(value: number) {
  return Number.isFinite(value) ? Number(value.toFixed(3)).toString() : "--";
}

async function toggleFullscreen() {
  const target = document.querySelector(".its-main");
  if (!target) return;
  if (document.fullscreenElement) await document.exitFullscreen();
  else await target.requestFullscreen();
}
