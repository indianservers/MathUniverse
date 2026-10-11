import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useLabMode } from "../mockup/studioLabKit";
import type { StudioMockupPage } from "../mockup/studioMockupCatalog";
import { useStudioModel, useStudioState } from "../phase1/StudioModelProvider";
import MathExpression from "../../components/ui/MathExpression";
import { fmtC, taylorExpITheta } from "./complexLabMath";
import {
  boundedEulerValue,
  eulerError,
  eulerPoint,
  evaluateEulerIdentity,
  radiansLabel,
} from "./eulerLearningMath";
import { EULER_COLORS, EulerCircle, EulerWaves } from "./EulerLinkedFigures";
import { DEFAULT_EULER_CAMERA, type EulerCamera } from "./eulerLearningMath";
import { markComplexComplete } from "./complexStudioSession";
import ComplexLearningDepth from "./ComplexLearningDepth";
import "./complexExperience.css";
import EulerReference from "./EulerReference";

const Helix = lazy(() => import("./EulerHelixScene"));
const steps = ["Observe", "Understand", "Why", "Try", "Challenge"];
const coaching = [
  "Move θ slowly. The teal point rotates while the helix rises; the blue and purple projections follow cosine and sine.",
  "The radius remains 1 because cos² θ + sin² θ = 1. The helix’s third coordinate records the angle in radians, not another complex component.",
  "Expand eⁱθ into its power series. Even powers of i produce cosine; odd powers produce i times sine. Compare the pink partial sum with the exact teal point.",
  "At θ = π, try 2, 6, 12 and 24 terms. Record the error. Then compare 0 and 2π: same point on the circle, different heights.",
  "Use the quarter-turn prediction below, then explain Euler’s identity. Continue to Quiz for three conceptual checks.",
];
export default function EulerExperience({ page }: { page: StudioMockupPage }) {
  const { tabs, mode, setMode } = useLabMode(page);
  const model = useStudioModel();
  const [rawDegrees, setDegrees] = useStudioState(
    "ComplexNumbersStudioLabs:EulerLab:th",
    336,
  );
  const [rawTerms, setTerms] = useStudioState(
    "ComplexNumbersStudioLabs:EulerLab:terms",
    10,
  );
  const [rawTrace, setTrace] = useStudioState("Euler:trace", 1);
  const [camera, setCamera] = useStudioState<EulerCamera>(
    "Euler:camera",
    DEFAULT_EULER_CAMERA,
  );
  const [split, setSplit] = useStudioState("Euler:split", false);
  const [grid, setGrid] = useStudioState("Euler:grid", false);
  const [labels, setLabels] = useStudioState("Euler:labels", true);
  const [rawZoom, setZoom] = useStudioState("Euler:zoom", 1);
  const [speed, setSpeed] = useStudioState("Euler:speed", 30);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [manualReduced, setManualReduced] = useState(false);
  const [stage, setStage] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [prediction, setPrediction] = useState("");
  const [predictedAt, setPredictedAt] = useState<number | null>(null);
  const [predictionFeedback, setPredictionFeedback] = useState("");
  const [notice, setNotice] = useState("");
  const [help, setHelp] = useState(false);
  const figureRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const advancedRef = useRef<HTMLDetailsElement>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const degrees = boundedEulerValue(rawDegrees, 0, 720, 180);
  const terms = Math.round(
    boundedEulerValue(rawTerms, 1, mode === "Taylor" ? 50 : 32, 6),
  );
  const trace = boundedEulerValue(rawTrace, 0.25, 2, 1);
  const zoom = boundedEulerValue(rawZoom, 0.6, 1.5, 1);
  const point = eulerPoint(degrees),
    rad = (degrees * Math.PI) / 180;
  const approximation = taylorExpITheta(rad, terms),
    error = eulerError(degrees, terms);
  const motionOff = reduced || manualReduced;
  const degreeRef = useRef(degrees);
  degreeRef.current = degrees;
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (motionOff) setPlaying(false);
  }, [motionOff]);
  useEffect(() => {
    if (!playing || motionOff) return;
    model?.ledger.beginGesture();
    let previous = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      const delta = Math.min((now - previous) / 1000, 0.25);
      previous = now;
      const next = Math.min(
        720,
        degreeRef.current + boundedEulerValue(speed, 5, 120, 30) * delta,
      );
      setDegrees(next);
      if (next >= 720) setPlaying(false);
    }, 100);
    return () => {
      window.clearInterval(timer);
      model?.ledger.endGesture();
    };
  }, [playing, motionOff, speed, setDegrees, model?.ledger]);
  const changeAngle = (value: number) => {
    setPlaying(false);
    setDegrees(boundedEulerValue(value, 0, 720, degrees));
  };
  const fit = () => {
    setZoom(1);
    setCamera({
      position: [4, Math.max(4.2, rad / 2 + 3), Math.max(6, rad + 2)],
      target: [0, rad / 2, 0],
    });
  };
  const zoomBy = (factor: number) => {
    setZoom(boundedEulerValue(zoom / factor, 0.6, 1.5, 1));
    setCamera({
      ...camera,
      position: camera.position.map(
        (v, i) => camera.target[i] + (v - camera.target[i]) * factor,
      ) as EulerCamera["position"],
    });
  };
  const preset = (kind: string) => {
    const center = rad / 2,
      distance = Math.max(6, rad + 2);
    setCamera({
      target: [0, center, 0],
      position:
        kind === "Complex plane"
          ? [0, center + distance, 0.001]
          : kind === "Cosine projection"
            ? [0, center, distance]
            : kind === "Sine projection"
              ? [distance, center, 0]
              : [4, center + 3, distance],
    });
  };
  const save = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const exportSVG = () => {
    const figures = [...(exportRef.current?.querySelectorAll("svg") ?? [])];
    if (!figures.length) {
      setNotice("The figure is still loading. Try again shortly.");
      return;
    }
    const serialized = figures.map((figure, i) => {
      const clone = figure.cloneNode(true) as SVGElement;
      clone.setAttribute("width", i === 0 ? "320" : "440");
      clone.setAttribute("height", "280");
      return clone.outerHTML;
    });
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="880" height="400" viewBox="0 0 880 400"><rect width="880" height="400" fill="white"/><text x="20" y="30" font-size="18">Euler linked views · θ=${degrees.toFixed(2)}° · ${terms} Taylor terms</text><g transform="translate(20 60)">${serialized[0]}</g><g transform="translate(360 60)">${serialized[1]}</g><text x="20" y="385" font-size="14">Teal: exact; pink square: Taylor; blue: real; purple: imaginary; error=${error.toPrecision(4)}</text></svg>`;
    save(new Blob([svg], { type: "image/svg+xml" }), "euler-linked-views.svg");
    setNotice("Linked circle, Taylor path and projections exported as SVG.");
  };
  const nextQuarter = (Math.floor(degrees / 90) + 1) * 90;
  const correctPrediction = ["1", "i", "−1", "−i"][
    Math.round(nextQuarter / 90) % 4
  ];
  const circleProps = { degrees, trace, terms, grid, labels, zoom };
  const circle = (
    <EulerCircle {...circleProps} showTaylor={mode === "Taylor"} />
  );
  return (
    <>
      <div
        className="cxs-page euler-experience euler-reference"
        data-complex-owned
        data-lab-pane="workspace"
        data-lab-mode={mode}
        data-mode-canvas={mode}
        data-cx-mode={mode}
        data-guided-stage={stage}
      >
        <div ref={figureRef}>
          <EulerReference
            mode={mode}
            tabs={tabs}
            setMode={(value) => {
              setPlaying(false);
              setMode(value);
            }}
            degrees={degrees}
            terms={terms}
            setDegrees={changeAngle}
            setTerms={setTerms}
            playing={playing}
            motionOff={motionOff}
            play={() => {
              if (degrees >= 720) setDegrees(0);
              setPlaying(!playing);
            }}
            grid={grid}
            setGrid={setGrid}
            zoom={zoom}
            zoomIn={() => zoomBy(0.85)}
            fit={fit}
            reset={() => {
              setCamera(DEFAULT_EULER_CAMERA);
              setZoom(1);
              setGrid(false);
              setLabels(true);
            }}
            share={() => void model?.share()}
            help={() => setHelp(!help)}
            advanced={() => {
              if (advancedRef.current) {
                advancedRef.current.open = true;
                advancedRef.current.scrollIntoView({
                  behavior: motionOff ? "instant" : "smooth",
                  block: "start",
                });
              }
            }}
            scene={
              mode === "Helix" ? (
                <Suspense fallback={<p>Loading 3D helix…</p>}>
                  <Helix
                    degrees={degrees}
                    trace={trace}
                    grid={grid}
                    labels={labels}
                    cameraState={camera}
                    onCamera={setCamera}
                    reduced={motionOff}
                    dark
                  />
                </Suspense>
              ) : mode === "Projections" ? (
                <EulerWaves
                  degrees={degrees}
                  grid={grid}
                  labels={labels}
                  zoom={zoom}
                />
              ) : (
                circle
              )
            }
          />
        </div>
        {help && (
          <div className="euler-help er-help">
            <p>
              Drag the helix to orbit; scroll or pinch to zoom. Use the angle
              slider or enter an exact value up to 720°. Open advanced
              exploration for camera presets, linked views, exports, playback
              speed, undo, and guided practice. The five learning cards open
              explanations, theory, and quizzes.
            </p>
            <button type="button" onClick={() => setHelp(false)}>
              Close help
            </button>
          </div>
        )}
        <details
          ref={advancedRef}
          className="er-advanced"
          onToggle={(event) => setAdvancedOpen(event.currentTarget.open)}
        >
          <summary>
            Advanced exploration · linked views, camera, exports & practice
          </summary>
          <header className="euler-header">
            <div>
              <small>COMPLEX NUMBERS / EULER EXPONENTIALS</small>
              <h1>{page.title}</h1>
              <p>
                <MathExpression
                  value={String.raw`e^{i\theta}=\cos\theta+i\sin\theta`}
                />{" "}
                · One angle, four connected views.
              </p>
            </div>
            <div className="euler-actions">
              <button type="button" onClick={() => void model?.share()}>
                Share exploration
              </button>
              <button
                type="button"
                aria-expanded={help}
                onClick={() => setHelp(!help)}
              >
                Help
              </button>
            </div>
          </header>
          {help && (
            <div className="euler-help">
              <p>
                Drag the 3D scene to orbit; pinch or scroll to zoom. On touch
                screens, use two fingers to pan. Camera presets offer equivalent
                views without dragging. Angle sliders support arrow keys; use
                the number input for exact values. Playback stops at 720°.
              </p>
              <button type="button" onClick={() => setHelp(false)}>
                Close help
              </button>
            </div>
          )}
          <div
            className="euler-modes"
            role="group"
            aria-label="Euler’s Formula Lab modes"
          >
            <span>Mode</span>
            {tabs.map((item) => (
              <button
                type="button"
                key={item}
                aria-pressed={item === mode}
                onClick={() => {
                  setPlaying(false);
                  setMode(item);
                }}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="euler-workspace">
            <div className="euler-main">
              <div
                className="euler-toolbar"
                role="group"
                aria-label="Canvas options"
              >
                <button
                  type="button"
                  aria-label="Zoom in"
                  onClick={() => zoomBy(0.85)}
                >
                  Zoom +
                </button>
                <button
                  type="button"
                  aria-label="Zoom out"
                  onClick={() => zoomBy(1.18)}
                >
                  Zoom −
                </button>
                <button type="button" onClick={fit}>
                  Fit canvas
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCamera(DEFAULT_EULER_CAMERA);
                    setZoom(1);
                    setGrid(true);
                    setLabels(true);
                  }}
                >
                  Reset view
                </button>
                <details>
                  <summary>More</summary>
                  <div className="euler-more">
                    <label>
                      <input
                        type="checkbox"
                        checked={grid}
                        onChange={(e) => setGrid(e.target.checked)}
                      />{" "}
                      Show grid
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={labels}
                        onChange={(e) => setLabels(e.target.checked)}
                      />{" "}
                      Show labels
                    </label>
                    <button type="button" onClick={exportSVG}>
                      Export linked SVG
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const canvas =
                          figureRef.current?.querySelector("canvas");
                        if (!canvas) {
                          setNotice(
                            "Select Helix or enable linked views to export a 3D image.",
                          );
                          return;
                        }
                        canvas.toBlob((blob) => {
                          if (blob) {
                            save(blob, "euler-helix.png");
                            setNotice("Helix image exported.");
                          } else
                            setNotice(
                              "Image export unavailable. Use the linked SVG instead.",
                            );
                        });
                      }}
                    >
                      Export helix PNG
                    </button>
                    <button type="button" onClick={() => window.print()}>
                      Print figure
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const node = figureRef.current;
                        if (document.fullscreenElement)
                          void document.exitFullscreen();
                        else if (node?.requestFullscreen)
                          void node
                            .requestFullscreen()
                            .catch(() =>
                              setNotice(
                                "Fullscreen unavailable in this browser.",
                              ),
                            );
                        else
                          setNotice("Fullscreen unavailable in this browser.");
                      }}
                    >
                      Fullscreen canvas
                    </button>
                  </div>
                </details>
              </div>

              <div className={`euler-figure${split ? " is-split" : ""}`}>
                {advancedOpen && (mode === "Helix" || split) && (
                  <figure>
                    <figcaption>Complex exponential helix</figcaption>
                    <Suspense fallback={<p>Loading 3D helix…</p>}>
                      <Helix
                        degrees={degrees}
                        trace={trace}
                        grid={grid}
                        labels={labels}
                        cameraState={camera}
                        onCamera={setCamera}
                        reduced={motionOff}
                      />
                    </Suspense>
                  </figure>
                )}
                {(mode !== "Helix" || split) && (
                  <figure>
                    <figcaption>
                      {mode === "Projections"
                        ? "Real & imaginary projections"
                        : mode === "Taylor"
                          ? "Taylor partial sums and exact point"
                          : "Unit circle & Argand plane"}
                    </figcaption>
                    {mode === "Projections" ? (
                      <EulerWaves
                        degrees={degrees}
                        grid={grid}
                        labels={labels}
                        zoom={zoom}
                      />
                    ) : (
                      circle
                    )}
                  </figure>
                )}
                {split && mode !== "Projections" && (
                  <figure>
                    <figcaption>Real & imaginary projections</figcaption>
                    <EulerWaves
                      degrees={degrees}
                      grid={grid}
                      labels={labels}
                      zoom={zoom}
                    />
                  </figure>
                )}
              </div>
              <div
                className="euler-camera-presets"
                role="group"
                aria-label="Camera presets"
              >
                {[
                  "3D",
                  "Complex plane",
                  "Cosine projection",
                  "Sine projection",
                ].map((name) => (
                  <button
                    type="button"
                    key={name}
                    onClick={() => {
                      preset(name);
                      setMode("Helix");
                    }}
                  >
                    {name}
                  </button>
                ))}
              </div>
              <p className="euler-gesture-hint">
                Drag to orbit · scroll/pinch to zoom · or choose a camera
                preset. Helix coordinates: (Re, Im, θ); height uses radians.
              </p>
              <ul className="euler-legend">
                {Object.entries(EULER_COLORS).map(([label, color]) => (
                  <li key={label}>
                    <span style={{ background: color }} />
                    {label === "exact"
                      ? "● Exact point / trace"
                      : label === "taylor"
                        ? "■ Taylor approximation"
                        : label === "real"
                          ? "Real: cosine"
                          : label === "imaginary"
                            ? "Imaginary: sine"
                            : "Angle / radius"}
                  </li>
                ))}
              </ul>
              <p className="euler-point-description">
                At {degrees.toFixed(1)}° ({radiansLabel(degrees)}), the point is{" "}
                {fmtC(point, 3)}, modulus 1. Helix height: {rad.toFixed(3)}{" "}
                radians.
              </p>
              <div className="euler-coaching">
                <div role="group" aria-label="Guided learning steps">
                  {steps.map((step, i) => (
                    <button
                      type="button"
                      key={step}
                      aria-pressed={stage === i}
                      onClick={() => {
                        setStage(i);
                        if (i === 2) setMode("Taylor");
                      }}
                    >
                      {i + 1}. {step}
                    </button>
                  ))}
                </div>
                <p role="status">{coaching[stage]}</p>
                <button
                  type="button"
                  disabled={stage === 4}
                  onClick={() => {
                    setStage(stage + 1);
                    if (stage + 1 === 2) setMode("Taylor");
                  }}
                >
                  Next step →
                </button>
              </div>
            </div>
            <aside
              className="euler-controls"
              aria-label="Mathematical parameters"
            >
              <h2>Explore the angle</h2>
              <label className="euler-range">
                Angle θ{" "}
                <output aria-live="off">
                  {degrees.toFixed(1)}° = {radiansLabel(degrees)}
                </output>
                <input
                  type="range"
                  aria-label="Angle θ"
                  aria-valuetext={`${degrees.toFixed(1)} degrees, ${radiansLabel(degrees)}`}
                  min="0"
                  max="720"
                  step="1"
                  value={degrees}
                  onChange={(e) => changeAngle(Number(e.target.value))}
                />
              </label>
              <label>
                Angle in degrees
                <input
                  type="number"
                  aria-label="Angle in degrees"
                  min="0"
                  max="720"
                  step="1"
                  value={Number(degrees.toFixed(2))}
                  onChange={(e) => {
                    if (e.target.value !== "")
                      changeAngle(e.target.valueAsNumber);
                  }}
                />
              </label>
              <div
                className="euler-shortcuts"
                role="group"
                aria-label="Common angles"
              >
                {[
                  [0, "0"],
                  [90, "π/2"],
                  [180, "π"],
                  [270, "3π/2"],
                  [360, "2π"],
                  [720, "4π"],
                ].map(([value, label]) => (
                  <button
                    type="button"
                    key={value}
                    aria-pressed={degrees === value}
                    onClick={() => changeAngle(Number(value))}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="euler-playback">
                <button
                  type="button"
                  disabled={motionOff}
                  aria-pressed={playing}
                  onClick={() => {
                    if (degrees >= 720) setDegrees(0);
                    setPlaying(!playing);
                  }}
                >
                  {playing ? "Pause" : "Play"}
                </button>
                <button type="button" onClick={() => changeAngle(degrees - 15)}>
                  −15°
                </button>
                <button type="button" onClick={() => changeAngle(degrees + 15)}>
                  +15°
                </button>
              </div>
              <label>
                Playback speed
                <select
                  aria-label="Playback speed"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                >
                  {[15, 30, 60, 120].map((v) => (
                    <option key={v} value={v}>
                      {v}° / second
                    </option>
                  ))}
                </select>
              </label>
              <label className="euler-check">
                <input
                  type="checkbox"
                  checked={motionOff}
                  disabled={reduced}
                  onChange={(e) => setManualReduced(e.target.checked)}
                />{" "}
                Reduce motion {reduced && "(system preference)"}
              </label>
              <label className="euler-range">
                Trace length <output aria-live="off">{trace} turns</output>
                <input
                  type="range"
                  aria-label="Trace length"
                  min=".25"
                  max="2"
                  step=".25"
                  value={trace}
                  onChange={(e) => setTrace(Number(e.target.value))}
                />
              </label>
              <label className="euler-check">
                <input
                  type="checkbox"
                  checked={split}
                  onChange={(e) => setSplit(e.target.checked)}
                />{" "}
                Show all linked views
              </label>
              <h2>Taylor series</h2>
              <label className="euler-range">
                Taylor terms <output aria-live="off">{terms}</output>
                <input
                  type="range"
                  aria-label="Taylor terms"
                  min="1"
                  max={mode === "Taylor" ? 50 : 32}
                  step="1"
                  value={terms}
                  onChange={(e) => setTerms(Number(e.target.value))}
                />
              </label>
              <MathExpression
                value={String.raw`S_N=\sum_{n=0}^{N-1}\frac{(i\theta)^n}{n!}`}
              />
              <p>
                N includes the constant term. {terms} terms means powers n = 0
                through {terms - 1}; θ is in radians.
              </p>
              <dl className="euler-values">
                <div>
                  <dt>Exact</dt>
                  <dd>{fmtC(point, 3)}</dd>
                </div>
                <div>
                  <dt>Taylor ({terms})</dt>
                  <dd>{fmtC(approximation, 3)}</dd>
                </div>
                <div>
                  <dt>Absolute error |Sₙ − eⁱθ|</dt>
                  <dd>{error.toExponential(3)}</dd>
                </div>
              </dl>
              <p>
                Finite sums may leave the unit circle. Higher angles need more
                terms; compare error rather than assuming every added term
                improves it.
              </p>
              <div className="euler-history">
                <button
                  type="button"
                  disabled={!model?.ledger.past.length}
                  onClick={() => {
                    setPlaying(false);
                    model?.ledger.undo();
                  }}
                >
                  Undo
                </button>
                <button
                  type="button"
                  disabled={!model?.ledger.future.length}
                  onClick={() => {
                    setPlaying(false);
                    model?.ledger.redo();
                  }}
                >
                  Redo
                </button>
              </div>
            </aside>
          </div>
          <div className="euler-practice-grid">
            <form
              className="euler-practice"
              onSubmit={(e) => {
                e.preventDefault();
                const result = evaluateEulerIdentity(answer);
                setFeedback(result.message);
                if (result.correct) markComplexComplete("euler");
              }}
            >
              <h2>Euler identity</h2>
              <MathExpression value={String.raw`e^{i\pi}+1=?`} />
              <label>
                Your answer
                <input
                  aria-label="Euler identity answer"
                  inputMode="decimal"
                  value={answer}
                  onChange={(e) => {
                    setAnswer(e.target.value);
                    setFeedback("");
                  }}
                />
              </label>
              <button type="submit">Check answer</button>
              {feedback && <p role="status">{feedback}</p>}
            </form>
            <form
              className="euler-practice"
              onSubmit={(e) => {
                e.preventDefault();
                if (!prediction) {
                  setPredictionFeedback("Choose a predicted point first.");
                  return;
                }
                setPredictedAt(nextQuarter);
                setPredictionFeedback(
                  prediction === correctPrediction
                    ? `Correct. At ${nextQuarter}° the point is ${correctPrediction}.`
                    : `At ${nextQuarter}° the point is ${correctPrediction}. Count quarter-turns from 1: i, −1, −i, 1.`,
                );
              }}
            >
              <h2>Predict the next quarter-turn</h2>
              <p>
                {nextQuarter <= 720
                  ? `Starting at ${degrees.toFixed(1)}°, where will the point be at ${nextQuarter}°?`
                  : "Return to an earlier angle to predict another turn."}
              </p>
              <label>
                Predicted point
                <select
                  aria-label="Predicted point"
                  value={prediction}
                  onChange={(e) => {
                    setPrediction(e.target.value);
                    setPredictionFeedback("");
                    setPredictedAt(null);
                  }}
                >
                  <option value="">Choose a point</option>
                  {["1", "i", "−1", "−i"].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
              <button type="submit" disabled={nextQuarter > 720}>
                Check prediction
              </button>
              {predictionFeedback && <p role="status">{predictionFeedback}</p>}
              {predictedAt !== null && (
                <button
                  type="button"
                  onClick={() => {
                    changeAngle(predictedAt);
                    setPrediction("");
                    setPredictedAt(null);
                  }}
                >
                  Reveal on the figure
                </button>
              )}
            </form>
          </div>
        </details>
        {(notice || model?.status) && (
          <p className="er-status" role="status">
            {notice || model?.status}
          </p>
        )}
        <div
          ref={exportRef}
          className="euler-export-figures"
          aria-hidden="true"
        >
          <EulerCircle {...circleProps} zoom={1} labels showTaylor />
          <EulerWaves degrees={degrees} grid={grid} labels />
        </div>
      </div>
      <ComplexLearningDepth pageId="euler" />
    </>
  );
}
