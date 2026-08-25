import { Line, OrbitControls, Text } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  BookOpen,
  Check,
  CheckCircle2,
  Crosshair,
  Eye,
  EyeOff,
  Expand,
  Hand,
  Lightbulb,
  Maximize2,
  Move3D,
  Plus,
  RefreshCw,
  Rotate3D,
  Shuffle,
  Target,
  Trash2,
  ZoomIn,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import * as THREE from "three";
import MathExpression from "../components/ui/MathExpression";
import { compileTwoVariableExpression } from "../utils/functionParser";
import "./CalculusMultivariableStudio.css";

type Mode =
  | "partial"
  | "gradient"
  | "plane"
  | "optimization"
  | "multiple"
  | "fields"
  | "theorems";
type MajorMode = "multivariable" | "multiple" | "fields" | "theorems";
type CameraTool = "rotate" | "pan" | "zoom";
type LearningTab = "ideas" | "formulas" | "examples" | "notes";
type SurfaceLayer = {
  id: number;
  expression: string;
  draft: string;
  visible: boolean;
};
type RenderSurface = {
  id: number;
  expression: string;
  fn: SurfaceFn;
  color: string;
};

const extraSurfaceColors = ["#f97316", "#ec4899", "#22c55e", "#eab308"];

const validModes: Mode[] = [
  "partial",
  "gradient",
  "plane",
  "optimization",
  "multiple",
  "fields",
  "theorems",
];
const majorTabs: Array<{ id: MajorMode; label: string; mode: Mode }> = [
  { id: "multivariable", label: "Multivariable", mode: "partial" },
  { id: "multiple", label: "Multiple Integrals", mode: "multiple" },
  { id: "fields", label: "Vector Fields", mode: "fields" },
  { id: "theorems", label: "Theorems", mode: "theorems" },
];
const subTabs: Array<{ id: Mode; label: string }> = [
  { id: "partial", label: "Partial Derivatives" },
  { id: "gradient", label: "Gradient" },
  { id: "plane", label: "Tangent Plane" },
  { id: "optimization", label: "Optimization" },
];

export default function CalculusMultivariableStudio() {
  const [params, setParams] = useSearchParams();
  const requestedMode = params.get("mode") as Mode | null;
  const mode: Mode =
    requestedMode && validModes.includes(requestedMode)
      ? requestedMode
      : "partial";
  const major = majorForMode(mode);
  const [expression, setExpression] = useState(
    () => params.get("v_expression") || "x^2-y^2",
  );
  const [draft, setDraft] = useState(
    () => params.get("v_expression") || "x^2-y^2",
  );
  const [surfaceLayers, setSurfaceLayers] = useState<SurfaceLayer[]>(() =>
    parseSurfaceLayers(params.get("v_surfaces")),
  );
  const [nextLayerId, setNextLayerId] = useState(5);
  const [a, setA] = useState(() =>
    numberParam(params.get("v_a"), 1, -2.5, 2.5),
  );
  const [b, setB] = useState(() =>
    numberParam(params.get("v_b"), 0.5, -2.5, 2.5),
  );
  const [density, setDensity] = useState(() =>
    Math.round(numberParam(params.get("v_n"), 20, 8, 32)),
  );
  const [xSlice, setXSlice] = useState(true);
  const [ySlice, setYSlice] = useState(true);
  const [showGradient, setShowGradient] = useState(true);
  const [showPlane, setShowPlane] = useState(true);
  const [animate, setAnimate] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [cameraTool, setCameraTool] = useState<CameraTool>("rotate");
  const [cameraKey, setCameraKey] = useState(0);
  const [learning, setLearning] = useState<LearningTab>("ideas");
  const [checkVisible, setCheckVisible] = useState(false);
  const compiled = useMemo(() => compileSurface(expression), [expression]);
  const extraSurfaces = useMemo(
    () =>
      surfaceLayers.flatMap((layer, index): RenderSurface[] => {
        if (!layer.visible) return [];
        const result = compileSurface(layer.expression);
        return result.fn
          ? [
              {
                id: layer.id,
                expression: layer.expression,
                fn: result.fn,
                color: extraSurfaceColors[index],
              },
            ]
          : [];
      }),
    [surfaceLayers],
  );
  const analysis = useMemo(
    () => analyzeSurface(compiled.fn, a, b),
    [a, b, compiled.fn],
  );

  useEffect(() => {
    const next = new URLSearchParams(params);
    next.set("mode", mode);
    next.set("v_a", compact(a));
    next.set("v_b", compact(b));
    next.set("v_n", String(density));
    next.set("v_expression", expression);
    if (surfaceLayers.length) {
      next.set(
        "v_surfaces",
        JSON.stringify(
          surfaceLayers.map(({ expression: layerExpression, visible }) => ({
            expression: layerExpression,
            visible,
          })),
        ),
      );
    } else {
      next.delete("v_surfaces");
    }
    if (next.toString() !== params.toString())
      setParams(next, { replace: true });
  }, [a, b, density, expression, mode, params, setParams, surfaceLayers]);

  const chooseMode = (nextMode: Mode) => {
    const next = new URLSearchParams(params);
    next.set("mode", nextMode);
    setParams(next, { replace: true });
    setLearning("ideas");
  };

  const applyExpression = () => {
    if (!compileSurface(draft).error) setExpression(draft);
  };

  const addSurfaceLayer = () => {
    if (surfaceLayers.length >= extraSurfaceColors.length) return;
    setSurfaceLayers((layers) => [
      ...layers,
      {
        id: nextLayerId,
        expression: "sin(x)+cos(y)",
        draft: "sin(x)+cos(y)",
        visible: true,
      },
    ]);
    setNextLayerId((value) => value + 1);
  };

  const updateSurfaceLayer = (id: number, update: Partial<SurfaceLayer>) => {
    setSurfaceLayers((layers) =>
      layers.map((layer) =>
        layer.id === id ? { ...layer, ...update } : layer,
      ),
    );
  };

  const applySurfaceLayer = (id: number) => {
    setSurfaceLayers((layers) =>
      layers.map((layer) =>
        layer.id === id && !compileSurface(layer.draft).error
          ? { ...layer, expression: layer.draft }
          : layer,
      ),
    );
  };

  const reset = () => {
    setExpression("x^2-y^2");
    setDraft("x^2-y^2");
    setSurfaceLayers([]);
    setA(1);
    setB(0.5);
    setDensity(20);
    setXSlice(true);
    setYSlice(true);
    setShowGradient(true);
    setShowPlane(true);
    setAnimate(false);
    setSpeed(1);
    setCameraTool("rotate");
    setCameraKey((value) => value + 1);
    setLearning("ideas");
    setCheckVisible(false);
    setParams(
      {
        mode: "partial",
        v_a: "1",
        v_b: "0.5",
        v_n: "20",
        v_expression: "x^2-y^2",
      },
      { replace: true },
    );
  };

  const randomPoint = () => {
    setA(Number((-2 + Math.random() * 4).toFixed(2)));
    setB(Number((-2 + Math.random() * 4).toFixed(2)));
  };

  return (
    <div className="mvc-studio" data-mode={mode}>
      <nav
        className="mvc-major-tabs"
        role="tablist"
        aria-label="Multivariable calculus domains"
      >
        {majorTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            className={major === tab.id ? "active" : ""}
            aria-selected={major === tab.id}
            onClick={() => chooseMode(tab.mode)}
          >
            {tab.label}
          </button>
        ))}
        <button type="button" className="mvc-reset" onClick={reset}>
          <RefreshCw />
          Reset
        </button>
      </nav>
      {major === "multivariable" && (
        <nav
          className="mvc-sub-tabs"
          role="tablist"
          aria-label="Multivariable calculus topics"
        >
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              className={mode === tab.id ? "active" : ""}
              aria-selected={mode === tab.id}
              onClick={() => chooseMode(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      )}

      <div className="mvc-workspace">
        <aside
          className="mvc-panel mvc-controls"
          aria-label="Multivariable controls"
        >
          <header>
            <h2>Controls</h2>
            <button type="button" title="Reset controls" onClick={reset}>
              <RefreshCw />
            </button>
          </header>
          {major === "fields" || major === "theorems" ? (
            <div className="mvc-fixed-model">
              <span>Vector field</span>
              <MathExpression value={"F(x,y)=\\langle-y,x\\rangle"} />
            </div>
          ) : (
            <div className="mvc-equations">
              <label className="mvc-expression">
                <span>Surface z = f(x,y)</span>
                <div>
                  <input
                    aria-label="Surface expression"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) =>
                      event.key === "Enter" && applyExpression()
                    }
                  />
                  <button type="button" onClick={applyExpression}>
                    f<sub>x</sub>
                  </button>
                </div>
                {compileSurface(draft).error && (
                  <small>{compileSurface(draft).error}</small>
                )}
              </label>
              {surfaceLayers.map((layer, index) => {
                const error = compileSurface(layer.draft).error;
                return (
                  <div className="mvc-equation-row" key={layer.id}>
                    <i
                      aria-hidden="true"
                      style={{ background: extraSurfaceColors[index] }}
                    />
                    <input
                      aria-label={`Surface equation ${index + 2}`}
                      value={layer.draft}
                      onChange={(event) =>
                        updateSurfaceLayer(layer.id, {
                          draft: event.target.value,
                        })
                      }
                      onKeyDown={(event) =>
                        event.key === "Enter" && applySurfaceLayer(layer.id)
                      }
                    />
                    <button
                      type="button"
                      title="Apply equation"
                      onClick={() => applySurfaceLayer(layer.id)}
                      disabled={Boolean(error)}
                    >
                      <Check />
                    </button>
                    <button
                      type="button"
                      title={layer.visible ? "Hide equation" : "Show equation"}
                      aria-pressed={layer.visible}
                      onClick={() =>
                        updateSurfaceLayer(layer.id, {
                          visible: !layer.visible,
                        })
                      }
                    >
                      {layer.visible ? <Eye /> : <EyeOff />}
                    </button>
                    <button
                      type="button"
                      title="Remove equation"
                      onClick={() =>
                        setSurfaceLayers((layers) =>
                          layers.filter((item) => item.id !== layer.id),
                        )
                      }
                    >
                      <Trash2 />
                    </button>
                    {error && <small>{error}</small>}
                  </div>
                );
              })}
              <button
                className="mvc-add-equation"
                type="button"
                onClick={addSurfaceLayer}
                disabled={surfaceLayers.length >= extraSurfaceColors.length}
              >
                <Plus />
                Add equation
              </button>
            </div>
          )}
          <fieldset>
            <legend>
              Point (x<sub>0</sub>, y<sub>0</sub>)
            </legend>
            <div className="mvc-number-grid">
              <label>
                x
                <input
                  aria-label="Point x"
                  type="number"
                  min="-2.5"
                  max="2.5"
                  step="0.05"
                  value={a}
                  onChange={(event) =>
                    setA(clamp(Number(event.target.value), -2.5, 2.5))
                  }
                />
              </label>
              <label>
                y
                <input
                  aria-label="Point y"
                  type="number"
                  min="-2.5"
                  max="2.5"
                  step="0.05"
                  value={b}
                  onChange={(event) =>
                    setB(clamp(Number(event.target.value), -2.5, 2.5))
                  }
                />
              </label>
            </div>
          </fieldset>
          {(major === "fields" ||
            major === "theorems" ||
            major === "multiple") && (
            <RangeControl
              label={
                major === "multiple" ? "Partition density" : "Field density"
              }
              value={density}
              min={8}
              max={32}
              step={1}
              onChange={(value) => setDensity(Math.round(value))}
            />
          )}
          {major !== "fields" && major !== "theorems" && (
            <fieldset className="mvc-switches">
              <legend>Slice planes</legend>
              <Switch
                label={`x-slice (y = ${compact(b)})`}
                checked={xSlice}
                color="orange"
                onChange={setXSlice}
              />
              <Switch
                label={`y-slice (x = ${compact(a)})`}
                checked={ySlice}
                color="violet"
                onChange={setYSlice}
              />
            </fieldset>
          )}
          <fieldset className="mvc-switches">
            <legend>Visual options</legend>
            {major !== "fields" && major !== "theorems" && (
              <>
                <Switch
                  label="Show gradient vector"
                  checked={showGradient}
                  onChange={setShowGradient}
                />
                <Switch
                  label="Show tangent plane"
                  checked={showPlane}
                  onChange={setShowPlane}
                />
              </>
            )}
            <Switch
              label="Animate rotation"
              checked={animate}
              onChange={setAnimate}
            />
          </fieldset>
          <RangeControl
            label="Animation speed"
            value={speed}
            min={0.2}
            max={2}
            step={0.1}
            onChange={setSpeed}
            suffix="x"
          />
          <button type="button" className="mvc-primary" onClick={randomPoint}>
            <Shuffle />
            Random point
          </button>
        </aside>

        <section className="mvc-panel mvc-scene-panel">
          <header className="mvc-scene-head">
            <h2>
              {major === "fields"
                ? "3D Vector Field"
                : major === "theorems"
                  ? "Flux, Divergence & Curl"
                  : major === "multiple"
                    ? "Surface & Accumulation"
                    : "3D Surface & Geometry"}
            </h2>
            <div className="mvc-camera-tools">
              <button
                type="button"
                aria-pressed={cameraTool === "rotate"}
                className={cameraTool === "rotate" ? "active" : ""}
                onClick={() => setCameraTool("rotate")}
              >
                <Rotate3D />
                Rotate
              </button>
              <button
                type="button"
                aria-pressed={cameraTool === "pan"}
                className={cameraTool === "pan" ? "active" : ""}
                onClick={() => setCameraTool("pan")}
              >
                <Hand />
                Pan
              </button>
              <button
                type="button"
                aria-pressed={cameraTool === "zoom"}
                className={cameraTool === "zoom" ? "active" : ""}
                onClick={() => setCameraTool("zoom")}
              >
                <ZoomIn />
                Zoom
              </button>
              <button
                type="button"
                onClick={() => setCameraKey((value) => value + 1)}
              >
                <Maximize2 />
                Reset view
              </button>
              <button
                type="button"
                title="Fullscreen"
                onClick={() => void requestFullscreen()}
              >
                <Expand />
              </button>
            </div>
          </header>
          <div className="mvc-canvas-wrap">
            <Canvas
              key={cameraKey}
              role="img"
              aria-label="Interactive multivariable surface scene"
              camera={{ position: [7.1, 5.7, 8.2], fov: 45 }}
              dpr={[1, 1.6]}
              gl={{ antialias: true }}
            >
              <color attach="background" args={["#f9fcff"]} />
              <ambientLight intensity={1.05} />
              <directionalLight position={[5, 8, 4]} intensity={1.8} />
              <directionalLight
                position={[-5, 3, -4]}
                intensity={0.7}
                color="#a78bfa"
              />
              <SceneRotator active={animate} speed={speed}>
                <MultivariableScene
                  mode={mode}
                  fn={compiled.fn}
                  a={a}
                  b={b}
                  density={density}
                  xSlice={xSlice}
                  ySlice={ySlice}
                  showGradient={showGradient}
                  showPlane={showPlane}
                  analysis={analysis}
                  extraSurfaces={extraSurfaces}
                />
              </SceneRotator>
              <OrbitControls
                makeDefault
                enableDamping
                dampingFactor={0.07}
                enableRotate={cameraTool === "rotate"}
                enablePan={cameraTool === "pan"}
                enableZoom={cameraTool === "zoom" || cameraTool === "rotate"}
                minDistance={4}
                maxDistance={13}
              />
            </Canvas>
            <SceneLegend
              mode={mode}
              expression={expression}
              extraSurfaces={extraSurfaces}
            />
            {major !== "fields" && major !== "theorems" && (
              <ContourMap
                fn={compiled.fn}
                a={a}
                b={b}
                expression={expression}
              />
            )}
            <div className="mvc-point-readout">
              {major === "fields" || major === "theorems" ? (
                <>
                  <strong>
                    Probe: ({compact(a)}, {compact(b)})
                  </strong>
                  <span>
                    F = &lt;{-b}, {a}&gt;
                  </span>
                </>
              ) : (
                <>
                  <strong>
                    Point: ({compact(a)}, {compact(b)}, {fixed(analysis.z, 3)})
                  </strong>
                  <span>
                    z = f({compact(a)}, {compact(b)})
                  </span>
                </>
              )}
            </div>
          </div>
        </section>

        <LocalAnalysis
          mode={mode}
          expression={expression}
          a={a}
          b={b}
          analysis={analysis}
        />
      </div>

      <section className="mvc-learning">
        <nav role="tablist" aria-label="Multivariable learning panels">
          {(["ideas", "formulas", "examples", "notes"] as LearningTab[]).map(
            (tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={learning === tab}
                className={learning === tab ? "active" : ""}
                onClick={() => setLearning(tab)}
              >
                {tab === "ideas" ? (
                  <Lightbulb />
                ) : tab === "formulas" ? (
                  <Move3D />
                ) : tab === "examples" ? (
                  <BookOpen />
                ) : (
                  <Target />
                )}
                {tab === "ideas" ? "Key ideas" : tab}
              </button>
            ),
          )}
        </nav>
        <div>
          {learningContent(learning, mode, expression)}
          <button
            type="button"
            onClick={() => setCheckVisible((value) => !value)}
          >
            <CheckCircle2 />
            Quick check
          </button>
        </div>
        {checkVisible && (
          <p className="mvc-check">
            <Crosshair />
            At a point where grad f = 0, inspect the nearby surface before
            deciding whether the point is a minimum, maximum, or saddle.
          </p>
        )}
      </section>
    </div>
  );
}

function SceneLegend({
  mode,
  expression,
  extraSurfaces,
}: {
  mode: Mode;
  expression: string;
  extraSurfaces: RenderSurface[];
}) {
  if (mode === "fields" || mode === "theorems")
    return (
      <div className="mvc-legend">
        <span>
          <i className="surface" />F = &lt;-y, x&gt;
        </span>
        <span>
          <i className="point" />
          Probe point
        </span>
        <span>
          <i className="gradient" />
          Field vectors
        </span>
        {mode === "theorems" && (
          <span>
            <i className="plane" />
            Boundary path
          </span>
        )}
      </div>
    );
  return (
    <div className="mvc-legend">
      <span>
        <i className="surface" />
        Surface z = {expression}
      </span>
      {extraSurfaces.map((surface) => (
        <span key={surface.id}>
          <i style={{ background: surface.color }} />
          Surface z = {surface.expression}
        </span>
      ))}
      <span>
        <i className="point" />
        Selected point
      </span>
      <span>
        <i className="gradient" />
        Gradient
      </span>
      <span>
        <i className="plane" />
        Tangent plane
      </span>
    </div>
  );
}

function LocalAnalysis({
  mode,
  expression,
  a,
  b,
  analysis,
}: {
  mode: Mode;
  expression: string;
  a: number;
  b: number;
  analysis: SurfaceAnalysis;
}) {
  if (mode === "fields" || mode === "theorems") {
    const magnitude = Math.hypot(a, b);
    return (
      <aside className="mvc-panel mvc-analysis" aria-label="Local analysis">
        <h2>
          {mode === "fields" ? "Vector Field" : "Theorem"} Analysis at (
          {fixed(a, 2)}, {fixed(b, 2)})
        </h2>
        <AnalysisSection title="Field vector">
          <MathExpression
            value={`F(${fixed(a, 2)},${fixed(b, 2)})=\\langle ${fixed(-b, 2)},${fixed(a, 2)}\\rangle`}
          />
          <p>
            Magnitude ||F||
            <strong className="green">{fixed(magnitude, 3)}</strong>
          </p>
        </AnalysisSection>
        <AnalysisSection title="Local derivatives">
          <p>
            Divergence<strong className="green">0.000</strong>
          </p>
          <p>
            Scalar curl<strong className="green">2.000</strong>
          </p>
          <div className="mvc-formula-box">
            <MathExpression
              value={
                "\\nabla\\cdot F=0,\\quad \\partial Q/\\partial x-\\partial P/\\partial y=2"
              }
            />
          </div>
        </AnalysisSection>
        {mode === "theorems" ? (
          <>
            <AnalysisSection title="Green's theorem">
              <MathExpression
                value={
                  "\\oint_C P\\,dx+Q\\,dy=\\iint_R(\\partial Q/\\partial x-\\partial P/\\partial y)\\,dA"
                }
                display
              />
              <div className="mvc-success">Orientation: counterclockwise</div>
            </AnalysisSection>
            <AnalysisSection title="Boundary connection">
              <p>{modeInsight(mode, analysis)}</p>
            </AnalysisSection>
          </>
        ) : (
          <>
            <AnalysisSection title="Circulation">
              <p>The vectors are tangent to circles centered at the origin.</p>
              <MathExpression value={"F\\cdot\\hat t=\\sqrt{x^2+y^2}"} />
            </AnalysisSection>
            <AnalysisSection title="Field behavior">
              <p>{modeInsight(mode, analysis)}</p>
            </AnalysisSection>
          </>
        )}
      </aside>
    );
  }

  if (mode === "multiple") {
    const integral = rectangleIntegral(expression, Math.abs(a), Math.abs(b));
    return (
      <aside className="mvc-panel mvc-analysis" aria-label="Local analysis">
        <h2>
          Accumulation on [0, {fixed(Math.abs(a), 2)}] x [0,{" "}
          {fixed(Math.abs(b), 2)}]
        </h2>
        <AnalysisSection title="Double integral">
          <MathExpression value={`\\iint_R (${expression})\\,dA`} display />
          <p>
            Midpoint approximation
            <strong className="green">{fixed(integral, 4)}</strong>
          </p>
        </AnalysisSection>
        <AnalysisSection title="Region">
          <p>
            Width in x<strong>{fixed(Math.abs(a), 2)}</strong>
          </p>
          <p>
            Width in y<strong>{fixed(Math.abs(b), 2)}</strong>
          </p>
          <p>
            Area<strong>{fixed(Math.abs(a * b), 3)}</strong>
          </p>
        </AnalysisSection>
        <AnalysisSection title="Accumulation">
          <p>{modeInsight(mode, analysis)}</p>
        </AnalysisSection>
      </aside>
    );
  }

  return (
    <aside className="mvc-panel mvc-analysis" aria-label="Local analysis">
      <h2>
        Local Analysis at ({fixed(a, 2)}, {fixed(b, 2)})
      </h2>
      <AnalysisSection title="Partial derivatives">
        <p>
          <MathExpression value={"f_x = \\partial f/\\partial x"} />
          <strong className="green">{fixed(analysis.fx, 3)}</strong>
        </p>
        <p>
          <MathExpression value={"f_y = \\partial f/\\partial y"} />
          <strong className="red">{fixed(analysis.fy, 3)}</strong>
        </p>
      </AnalysisSection>
      <AnalysisSection title="Gradient vector">
        <MathExpression
          value={`\\nabla f = \\langle ${fixed(analysis.fx, 3)}, ${fixed(analysis.fy, 3)} \\rangle`}
        />
        <p>
          Magnitude ||grad f||
          <strong className="green">{fixed(analysis.magnitude, 3)}</strong>
        </p>
      </AnalysisSection>
      <AnalysisSection title="Directional derivative">
        <p>Direction u = (cos theta, sin theta)</p>
        <div className="mvc-formula-box">
          <MathExpression
            value={`D_u f = ${fixed(analysis.fx, 2)}\\cos\\theta + ${fixed(analysis.fy, 2)}\\sin\\theta`}
          />
        </div>
        <p>
          Max rate of change
          <strong className="green">{fixed(analysis.magnitude, 3)}</strong>
        </p>
      </AnalysisSection>
      <AnalysisSection title="Tangent plane">
        <MathExpression
          value={`z=${fixed(analysis.z, 2)}+${fixed(analysis.fx, 2)}(x-${fixed(a, 2)})+${fixed(analysis.fy, 2)}(y-${fixed(b, 2)})`}
          display
        />
        <div className="mvc-success">Local linear model ready</div>
      </AnalysisSection>
      <AnalysisSection
        title={
          mode === "optimization"
            ? "Stationary-point check"
            : "Geometric interpretation"
        }
      >
        <p>{modeInsight(mode, analysis)}</p>
      </AnalysisSection>
    </aside>
  );
}

function SceneRotator({
  active,
  speed,
  children,
}: {
  active: boolean;
  speed: number;
  children: React.ReactNode;
}) {
  const [angle, setAngle] = useState(0);
  useEffect(() => {
    if (!active) return;
    const timer = window.setInterval(
      () => setAngle((value) => value + 0.025 * speed),
      50,
    );
    return () => window.clearInterval(timer);
  }, [active, speed]);
  return <group rotation={[0, angle, 0]}>{children}</group>;
}

function MultivariableScene({
  mode,
  fn,
  a,
  b,
  density,
  xSlice,
  ySlice,
  showGradient,
  showPlane,
  analysis,
  extraSurfaces,
}: {
  mode: Mode;
  fn: SurfaceFn | null;
  a: number;
  b: number;
  density: number;
  xSlice: boolean;
  ySlice: boolean;
  showGradient: boolean;
  showPlane: boolean;
  analysis: SurfaceAnalysis;
  extraSurfaces: RenderSurface[];
}) {
  const surface = useMemo(
    () => surfaceGeometry(fn, Math.max(18, density)),
    [density, fn],
  );
  const tangent = useMemo(
    () => tangentGeometry(a, b, analysis),
    [a, analysis, b],
  );
  const point: [number, number, number] = [a, scaleZ(analysis.z), b];
  const gradientDirection = useMemo(
    () =>
      new THREE.Vector3(
        analysis.fx,
        Math.max(0.35, analysis.magnitude * 0.25),
        analysis.fy,
      ).normalize(),
    [analysis.fx, analysis.fy, analysis.magnitude],
  );
  const vectorField = mode === "fields" || mode === "theorems";
  return (
    <>
      <gridHelper
        args={[7, 14, "#8bb9d3", "#dce8f0"]}
        position={[0, -1.72, 0]}
      />
      <axesHelper args={[3.35]} position={[0, -1.7, 0]} />
      {!vectorField && (
        <>
          <mesh>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[surface.positions, 3]}
              />
              <bufferAttribute
                attach="attributes-normal"
                args={[surface.normals, 3]}
              />
              <bufferAttribute
                attach="attributes-color"
                args={[surface.colors, 3]}
              />
            </bufferGeometry>
            <meshBasicMaterial
              vertexColors
              transparent
              opacity={0.94}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[surface.positions, 3]}
              />
            </bufferGeometry>
            <meshBasicMaterial
              color="#f4fbff"
              wireframe
              transparent
              opacity={0.62}
            />
          </mesh>
          {extraSurfaces.map((surface) => (
            <AdditionalSurface
              key={surface.id}
              surface={surface}
              density={density}
            />
          ))}
        </>
      )}
      {vectorField && (
        <VectorField density={density} theorem={mode === "theorems"} />
      )}
      {xSlice && !vectorField && (
        <mesh position={[0, 0, b]}>
          <planeGeometry args={[6, 5]} />
          <meshBasicMaterial
            color="#f59e0b"
            transparent
            opacity={0.22}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      {ySlice && !vectorField && (
        <mesh position={[a, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[6, 5]} />
          <meshBasicMaterial
            color="#8b5cf6"
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      {showPlane &&
        !vectorField &&
        (mode === "partial" || mode === "plane" || mode === "gradient") && (
          <mesh>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[tangent.positions, 3]}
              />
              <bufferAttribute
                attach="attributes-normal"
                args={[tangent.normals, 3]}
              />
            </bufferGeometry>
            <meshBasicMaterial
              color="#67d88c"
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}
      <mesh position={point}>
        <sphereGeometry args={[0.1, 24, 16]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#0891b2"
          emissiveIntensity={0.35}
        />
      </mesh>
      {showGradient && !vectorField && (
        <arrowHelper
          args={[
            gradientDirection,
            new THREE.Vector3(...point),
            Math.min(1.55, 0.7 + analysis.magnitude * 0.22),
            0x16a34a,
            0.24,
            0.12,
          ]}
        />
      )}
      <Text position={[3.4, -1.62, 0]} fontSize={0.18} color="#0f2747">
        x
      </Text>
      <Text position={[0, 2.4, 0]} fontSize={0.18} color="#0f2747">
        z
      </Text>
      <Text position={[0, -1.62, 3.35]} fontSize={0.18} color="#0f2747">
        y
      </Text>
    </>
  );
}

function AdditionalSurface({
  surface,
  density,
}: {
  surface: RenderSurface;
  density: number;
}) {
  const geometry = useMemo(
    () => surfaceGeometry(surface.fn, Math.max(18, density)),
    [density, surface.fn],
  );
  return (
    <>
      <mesh>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[geometry.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-normal"
            args={[geometry.normals, 3]}
          />
        </bufferGeometry>
        <meshBasicMaterial
          color={surface.color}
          transparent
          opacity={0.48}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[geometry.positions, 3]}
          />
        </bufferGeometry>
        <meshBasicMaterial
          color={surface.color}
          wireframe
          transparent
          opacity={0.6}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

function VectorField({
  density,
  theorem,
}: {
  density: number;
  theorem: boolean;
}) {
  const count = Math.max(5, Math.min(11, Math.round(density / 2.5)));
  const arrows = Array.from({ length: count * count }, (_, index) => {
    const ix = index % count,
      iy = Math.floor(index / count);
    const x = -2.6 + (ix * 5.2) / (count - 1),
      y = -2.6 + (iy * 5.2) / (count - 1);
    const direction = new THREE.Vector3(-y, 0, x).normalize();
    return (
      <arrowHelper
        key={index}
        args={[
          direction,
          new THREE.Vector3(x, -0.6, y),
          0.34,
          theorem ? 0x8b5cf6 : 0x0ea5e9,
          0.1,
          0.06,
        ]}
      />
    );
  });
  const circle = Array.from(
    { length: 65 },
    (_, index): [number, number, number] => {
      const t = (index / 64) * Math.PI * 2;
      return [2.15 * Math.cos(t), -0.57, 2.15 * Math.sin(t)];
    },
  );
  return (
    <>
      {arrows}
      {theorem && <Line points={circle} color="#f59e0b" lineWidth={4} />}
    </>
  );
}

function ContourMap({
  fn,
  a,
  b,
  expression,
}: {
  fn: SurfaceFn | null;
  a: number;
  b: number;
  expression: string;
}) {
  const curves = useMemo(() => contourCurves(fn), [fn]);
  const sx = (x: number) => 18 + ((x + 2.5) / 5) * 204;
  const sy = (y: number) => 142 - ((y + 2.5) / 5) * 118;
  return (
    <div className="mvc-contour">
      <strong>
        Contour map <span>({expression})</span>
      </strong>
      <svg
        viewBox="0 0 240 160"
        role="img"
        aria-label="Synchronized contour map"
      >
        <rect
          x="18"
          y="24"
          width="204"
          height="118"
          fill="#fff"
          stroke="#d7e2ec"
        />
        {curves.map((curve, index) => (
          <path
            key={index}
            d={curve
              .map(
                (point, pointIndex) =>
                  `${pointIndex ? "L" : "M"}${sx(point[0])},${sy(point[1])}`,
              )
              .join(" ")}
            fill="none"
            stroke={index % 2 ? "#8b5cf6" : "#22b9de"}
            opacity="0.65"
          />
        ))}
        <line x1="18" x2="222" y1={sy(0)} y2={sy(0)} stroke="#64748b" />
        <line x1={sx(0)} x2={sx(0)} y1="24" y2="142" stroke="#64748b" />
        <circle
          cx={sx(a)}
          cy={sy(b)}
          r="5"
          fill="#16a34a"
          stroke="#fff"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

function Switch({
  label,
  checked,
  onChange,
  color = "cyan",
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  color?: "cyan" | "orange" | "violet";
}) {
  return (
    <label className={`mvc-switch ${color}`}>
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <i />
    </label>
  );
}

function RangeControl({
  label,
  value,
  min,
  max,
  step,
  onChange,
  suffix = "",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  suffix?: string;
}) {
  return (
    <label className="mvc-range">
      <span>
        {label}
        <b>
          {fixed(value, step < 1 ? 1 : 0)}
          {suffix}
        </b>
      </span>
      <input
        aria-label={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function AnalysisSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3>{title}</h3>
      {children}
    </section>
  );
}

type SurfaceFn = (x: number, y: number) => number;
type SurfaceAnalysis = {
  z: number;
  fx: number;
  fy: number;
  fxx: number;
  fyy: number;
  magnitude: number;
};

export function analyzeSurface(
  fn: SurfaceFn | null,
  x: number,
  y: number,
): SurfaceAnalysis {
  if (!fn)
    return { z: NaN, fx: NaN, fy: NaN, fxx: NaN, fyy: NaN, magnitude: NaN };
  const h = 0.001,
    z = safeSurface(fn, x, y);
  const fx = (safeSurface(fn, x + h, y) - safeSurface(fn, x - h, y)) / (2 * h);
  const fy = (safeSurface(fn, x, y + h) - safeSurface(fn, x, y - h)) / (2 * h);
  const fxx =
    (safeSurface(fn, x + h, y) - 2 * z + safeSurface(fn, x - h, y)) / (h * h);
  const fyy =
    (safeSurface(fn, x, y + h) - 2 * z + safeSurface(fn, x, y - h)) / (h * h);
  return { z, fx, fy, fxx, fyy, magnitude: Math.hypot(fx, fy) };
}

function surfaceGeometry(fn: SurfaceFn | null, segments: number) {
  const positions: number[] = [],
    normals: number[] = [],
    colors: number[] = [];
  if (!fn)
    return {
      positions: new Float32Array(),
      normals: new Float32Array(),
      colors: new Float32Array(),
    };
  const cyan = new THREE.Color("#22c7ee"),
    blue = new THREE.Color("#56aef0"),
    violet = new THREE.Color("#8b5cf6");
  const colorAt = (x: number) => {
    const ratio = clamp((x + 2.6) / 5.2, 0, 1);
    const color =
      ratio < 0.5
        ? cyan.clone().lerp(blue, ratio * 2)
        : blue.clone().lerp(violet, (ratio - 0.5) * 2);
    return color;
  };
  const pushTriangle = (triangle: Array<[number, number, number]>) => {
    const [first, second, third] = triangle.map(
      (vertex) => new THREE.Vector3(...vertex),
    );
    const normal = third
      .clone()
      .sub(first)
      .cross(second.clone().sub(first))
      .normalize();
    triangle.forEach(([x, z, y]) => {
      const color = colorAt(x);
      positions.push(x, z, y);
      normals.push(normal.x, normal.y, normal.z);
      colors.push(color.r, color.g, color.b);
    });
  };
  for (let iy = 0; iy < segments; iy++)
    for (let ix = 0; ix < segments; ix++) {
      const x0 = -2.6 + (ix / segments) * 5.2,
        x1 = -2.6 + ((ix + 1) / segments) * 5.2;
      const y0 = -2.6 + (iy / segments) * 5.2,
        y1 = -2.6 + ((iy + 1) / segments) * 5.2;
      const a: [number, number, number] = [
        x0,
        scaleZ(safeSurface(fn, x0, y0)),
        y0,
      ];
      const b: [number, number, number] = [
        x1,
        scaleZ(safeSurface(fn, x1, y0)),
        y0,
      ];
      const c: [number, number, number] = [
        x1,
        scaleZ(safeSurface(fn, x1, y1)),
        y1,
      ];
      const d: [number, number, number] = [
        x0,
        scaleZ(safeSurface(fn, x0, y1)),
        y1,
      ];
      pushTriangle([a, b, c]);
      pushTriangle([a, c, d]);
    }
  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    colors: new Float32Array(colors),
  };
}

function tangentGeometry(a: number, b: number, analysis: SurfaceAnalysis) {
  const radius = 0.95,
    corners: Array<[number, number]> = [
      [a - radius, b - radius],
      [a + radius, b - radius],
      [a + radius, b + radius],
      [a - radius, b + radius],
    ];
  const point = ([x, y]: [number, number]): [number, number, number] => [
    x,
    scaleZ(analysis.z + analysis.fx * (x - a) + analysis.fy * (y - b)),
    y,
  ];
  const values = [
    point(corners[0]),
    point(corners[1]),
    point(corners[2]),
    point(corners[0]),
    point(corners[2]),
    point(corners[3]),
  ].flat();
  return {
    positions: new Float32Array(values),
    normals: new Float32Array(Array(6).fill([0, 1, 0]).flat()),
  };
}

function contourCurves(fn: SurfaceFn | null) {
  if (!fn) return [];
  return [-2, -1.2, -0.5, 0.5, 1.2, 2].map((level) =>
    Array.from({ length: 70 }, (_, index): [number, number] => {
      const x = -2.35 + (index / 69) * 4.7;
      let bestY = -2.35,
        bestError = Infinity;
      for (let scan = 0; scan <= 100; scan++) {
        const y = -2.35 + (scan / 100) * 4.7,
          error = Math.abs(safeSurface(fn, x, y) - level);
        if (error < bestError) {
          bestError = error;
          bestY = y;
        }
      }
      return [x, bestY];
    }),
  );
}

function rectangleIntegral(expression: string, width: number, height: number) {
  const compiled = compileSurface(expression);
  if (!compiled.fn || width === 0 || height === 0) return 0;
  const cells = 28,
    dx = width / cells,
    dy = height / cells;
  let sum = 0;
  for (let ix = 0; ix < cells; ix++)
    for (let iy = 0; iy < cells; iy++)
      sum +=
        safeSurface(compiled.fn, (ix + 0.5) * dx, (iy + 0.5) * dy) * dx * dy;
  return sum;
}

function learningContent(tab: LearningTab, mode: Mode, expression: string) {
  if (tab === "formulas")
    return (
      <p>
        <MathExpression value={"\\nabla f=\\langle f_x,f_y\\rangle"} /> &nbsp;{" "}
        <MathExpression value="L(x,y)=f(a,b)+f_x(x-a)+f_y(y-b)" />
      </p>
    );
  if (tab === "examples")
    return (
      <p>
        Try <strong>x^2-y^2</strong> for a saddle, <strong>x^2+y^2</strong> for
        a minimum, or <strong>sin(x)+cos(y)</strong> for periodic geometry.
      </p>
    );
  if (tab === "notes")
    return (
      <p>
        The current model is <strong>{expression}</strong>. URL parameters
        preserve the point, density, expression, and active topic.
      </p>
    );
  return (
    <ul>
      <li>
        The gradient is perpendicular to level curves and points toward greatest
        increase.
      </li>
      <li>The tangent plane is the best local linear approximation.</li>
      <li>{modeInsight(mode, null)}</li>
    </ul>
  );
}

function modeInsight(mode: Mode, analysis: SurfaceAnalysis | null) {
  if (mode === "multiple")
    return "Partitions approximate accumulated volume over a two-dimensional region.";
  if (mode === "fields")
    return "The rotational field F = <-y, x> is tangent to circles centered at the origin.";
  if (mode === "theorems")
    return "Green, Stokes, and divergence theorems connect local derivatives to boundary integrals.";
  if (mode === "optimization")
    return analysis && analysis.magnitude < 0.05
      ? "The gradient is near zero; use second derivatives to classify the stationary point."
      : "Move opposite the gradient to descend toward a local minimum.";
  if (mode === "plane")
    return "The plane matches the surface value and first-order rates at the selected point.";
  if (mode === "gradient")
    return "The displayed arrow follows the steepest local ascent direction.";
  return "Hold one input fixed to read each partial derivative as an ordinary one-variable slope.";
}

function compileSurface(expression: string): {
  fn: SurfaceFn | null;
  error: string;
} {
  try {
    return {
      fn: expression ? compileTwoVariableExpression(expression) : null,
      error: expression ? "" : "Enter a surface expression.",
    };
  } catch (error) {
    return {
      fn: null,
      error:
        error instanceof Error ? error.message : "Invalid surface expression.",
    };
  }
}

export function parseSurfaceLayers(value: string | null): SurfaceLayer[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, extraSurfaceColors.length).flatMap((item, index) => {
      const expression =
        typeof item === "string"
          ? item
          : item &&
              typeof item === "object" &&
              "expression" in item &&
              typeof item.expression === "string"
            ? item.expression
            : "";
      if (!expression.trim() || compileSurface(expression).error) return [];
      const visible = !(
        item &&
        typeof item === "object" &&
        "visible" in item &&
        item.visible === false
      );
      return [{ id: index + 1, expression, draft: expression, visible }];
    });
  } catch {
    return [];
  }
}

function safeSurface(fn: SurfaceFn, x: number, y: number) {
  try {
    const value = fn(x, y);
    return Number.isFinite(value) ? value : NaN;
  } catch {
    return NaN;
  }
}
function scaleZ(value: number) {
  return clamp(Number.isFinite(value) ? value * 0.42 : 0, -1.7, 2.1);
}
function numberParam(
  value: string | null,
  fallback: number,
  min: number,
  max: number,
) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? clamp(parsed, min, max) : fallback;
}
function majorForMode(mode: Mode): MajorMode {
  return mode === "multiple"
    ? "multiple"
    : mode === "fields"
      ? "fields"
      : mode === "theorems"
        ? "theorems"
        : "multivariable";
}
function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
function compact(value: number) {
  return Number(value.toFixed(3)).toString();
}
function fixed(value: number, digits: number) {
  return Number.isFinite(value) ? value.toFixed(digits) : "--";
}
async function requestFullscreen() {
  const element = document.querySelector(".mvc-scene-panel");
  if (!document.fullscreenElement) await element?.requestFullscreen?.();
  else await document.exitFullscreen?.();
}
