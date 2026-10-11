import { useEulerCursor } from "./EulerCursor";
import { nearestProjectedAngle } from "./eulerCursorMath";
import { useId, useRef, useState, type CSSProperties } from "react";
import {
  Box,
  SlidersHorizontal,
  BookOpen,
  Lightbulb,
  RotateCcw,
  Play,
  Pause,
  Camera,
  Expand,
  Grid3X3,
  CircleDashed,
  Shapes,
  ChartNoAxesCombined,
  Eye,
  Brain,
  FlaskConical,
  Flag,
  ChevronRight,
} from "lucide-react";
import MathExpression from "../../components/ui/MathExpression";
import { useStudioState } from "../phase1/StudioModelProvider";
import { markComplexComplete } from "./complexStudioSession";
import "./projectionsReference.css";

type Props = {
  tabs: string[];
  setMode: (s: string) => void;
  degrees: number;
  setDegrees: (n: number) => void;
  playing: boolean;
  play: () => void;
  motionOff: boolean;
  grid: boolean;
  setGrid: (b: boolean) => void;
  reset: () => void;
  advanced: () => void;
};
const formula = String.raw`e^{i\theta}=\cos\theta+i\sin\theta`;
type View = "3D" | "XY" | "XZ" | "YZ";
const initialDisplay = {
  xy: true,
  xz: true,
  yz: true,
  vector: true,
  trace: false,
  shadows: true,
};
export default function ProjectionsReference(p: Props) {
  const id = useId().replace(/:/g, "");
  const [rawRadius, setRadius] = useStudioState("EulerProjections:radius", 1);
  const [display, setDisplay] = useStudioState(
    "EulerProjections:display",
    initialDisplay,
  );
  const [view, setView] = useState<View>("3D"),
    [question, setQuestion] = useState(p.degrees % 360),
    [choice, setChoice] = useState<number | null>(null),
    [feedback, setFeedback] = useState(""),
    [notice, setNotice] = useState("");
  const sceneRef = useRef<HTMLDivElement>(null);
  const angle =
      p.degrees === 360
        ? 360
        : Math.round((((p.degrees % 360) + 360) % 360) * 100) / 100,
    theta = (angle * Math.PI) / 180;
  const radius = Math.max(
    0.5,
    Math.min(2, Number.isFinite(rawRadius) ? rawRadius : 1),
  );
  const re = radius * Math.cos(theta),
    im = radius * Math.sin(theta);
  const project = (x: number, y: number, z: number): [number, number] =>
    view === "XY"
      ? [390 + x * 130, 240 - y * 130]
      : view === "XZ"
        ? [390 + x * 130, 395 - z * 30]
        : view === "YZ"
          ? [390 + y * 130, 395 - z * 30]
          : [370 - x * 90 + y * 90, 290 + x * 35 + y * 35 - z * 30];
  const cursor = useEulerCursor({
    degrees: p.degrees,
    setDegrees: p.setDegrees,
    projectAngle: (x, y) =>
      nearestProjectedAngle(x, y, (d) => {
        const t = (d * Math.PI) / 180;
        return project(radius * Math.cos(t), radius * Math.sin(t), t);
      }),
  });
  const poly = (points: number[][]) =>
    points.map(([x, y, z]) => project(x, y, z).join(",")).join(" ");
  const wave = (fn: (t: number) => number[], end = 2 * Math.PI) =>
    poly(Array.from({ length: 181 }, (_, i) => fn((i / 180) * end)));
  const pt = project(re, im, theta),
    base = project(re, im, 0),
    origin = project(0, 0, 0);
  const qr = Math.cos((question * Math.PI) / 180),
    qi = Math.sin((question * Math.PI) / 180);
  const options = [
    [qr, qi],
    [-qi, qr],
    [-qr, -qi],
    [qi, -qr],
  ];
  const fmt = (n: number, digits = 3) =>
    (Math.abs(n) < 0.00005 ? 0 : n).toFixed(digits).replace("-", "−");
  const navigate = (pane: string) =>
    document.getElementById(`lab-tab-${pane}`)?.click();
  const reset = () => {
    if (p.playing) p.play();
    p.reset();
    p.setDegrees(336);
    setRadius(1);
    setDisplay(initialDisplay);
    setView("3D");
    setFeedback("");
    setChoice(null);
  };
  const screenshot = async () => {
    const svg = sceneRef.current?.querySelector("svg.pr-diagram");
    if (!svg) return;
    const copy = svg.cloneNode(true) as SVGSVGElement;
    copy.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    const url = URL.createObjectURL(
      new Blob([new XMLSerializer().serializeToString(copy)], {
        type: "image/svg+xml",
      }),
    );
    try {
      const image = new Image();
      image.src = url;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = 1560;
      canvas.height = 820;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas unavailable");
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve),
      );
      if (!blob) throw new Error("Export unavailable");
      const download = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = download;
      link.download = "euler-projections.png";
      link.click();
      setTimeout(() => URL.revokeObjectURL(download), 1000);
      setNotice("Projection screenshot saved.");
    } catch {
      setNotice(
        "Screenshot unavailable. Try again in a browser that supports image export.",
      );
    } finally {
      URL.revokeObjectURL(url);
    }
  };
  return (
    <div className="pr-shell">
      <header className="pr-hero">
        <svg
          viewBox="0 0 1672 174"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id={`${id}halo`}>
              <stop stopColor="#073d8c" />
              <stop offset="1" stopColor="#020c1e" />
            </radialGradient>
            <linearGradient id={`${id}ribbon`}>
              <stop stopColor="#1723ff" stopOpacity=".1" />
              <stop offset=".5" stopColor="#03d6ff" />
              <stop offset=".8" stopColor="#7940ff" />
              <stop offset="1" stopColor="#102764" />
            </linearGradient>
            <filter id={`${id}blur`}>
              <feGaussianBlur stdDeviation="5" />
            </filter>
          </defs>
          <rect width="1672" height="174" fill={`url(#${id}halo)`} />
          {Array.from({ length: 19 }, (_, i) => (
            <path
              key={i}
              d={`M 300 ${-100 + i * 9} C 720 ${-210 + i * 14}, 410 ${260 - i * 4}, 860 ${166 + i * 2} S 1320 ${-150 + i * 6}, 1450 ${-70 + i * 8}`}
              fill="none"
              stroke={`url(#${id}ribbon)`}
              strokeWidth={i % 5 === 0 ? 3 : 1}
              opacity={0.25 + (i % 4) * 0.12}
            />
          ))}
          <path
            d="M 410 -20 C 800 -100 420 240 930 160 S 1410 100 1360 -50"
            fill="none"
            stroke="#304cff"
            strokeWidth="15"
            opacity=".5"
            filter={`url(#${id}blur)`}
          />
          <path
            d="M 1247 32 C 1080 45 1340 74 1233 91 S 1100 118 1250 133 S 1240 168 1170 181"
            fill="none"
            stroke="#16cfff"
            strokeWidth="7"
            filter={`url(#${id}blur)`}
          />
          <path
            d="M 1247 32 C 1080 45 1340 74 1233 91 S 1100 118 1250 133 S 1240 168 1170 181"
            fill="none"
            stroke="#65f9ff"
            strokeWidth="3"
          />
          <path
            d="M 1260 172 V 20 l -4 10 m 4 -10 l 4 10"
            fill="none"
            stroke="#39d9ff"
            strokeWidth="2"
          />
          <text x="1275" y="34" fill="#73e8ff" fontSize="18">
            z
          </text>
        </svg>
        <h1>Euler's Formula Lab</h1>
        <h2>Projections</h2>
        <h3>See complex numbers from every angle</h3>
        <p>
          Visualize eⁱθ as projections on different planes and explore how 3D
          views reveal its structure.
        </p>
        <div className="pr-hero-formula">
          <MathExpression value={formula} />
        </div>
        <blockquote>
          “Complex numbers
          <br />
          turn rotations into
          <br />
          algebra.”<small>EXPLORE EVERY ANGLE</small>
        </blockquote>
      </header>
      <div className="pr-toolbar">
        <div className="er-mode-buttons">
          <strong>Mode:</strong>
          {p.tabs.map((tab, i) => {
            const Icon = [CircleDashed, Shapes, Box, ChartNoAxesCombined][i];
            return (
              <button
                key={tab}
                aria-pressed={tab === "Projections"}
                onClick={() => p.setMode(tab)}
              >
                <Icon />
                {tab === "Taylor" ? "Taylor Series" : tab}
              </button>
            );
          })}
        </div>
        <div className="pr-actions">
          <button onClick={reset}>
            <RotateCcw />
            Reset
          </button>
          <button
            onClick={p.play}
            disabled={p.motionOff}
            aria-pressed={p.playing}
          >
            {p.playing ? <Pause /> : <Play />}
            {p.playing ? "Pause" : "Animate"}
          </button>
          <button onClick={() => p.setGrid(!p.grid)} aria-pressed={p.grid}>
            <Grid3X3 />
            Grid
          </button>
          <button onClick={screenshot}>
            <Camera />
            Screenshot
          </button>
          <button
            onClick={() => {
              void sceneRef.current
                ?.requestFullscreen()
                .catch(() =>
                  setNotice("Fullscreen is unavailable in this browser."),
                );
            }}
          >
            <Expand />
            Fullscreen
          </button>
        </div>
      </div>
      <div className="pr-panes">
        <section className="pr-parameters pr-panel">
          <header>
            <SlidersHorizontal />
            <h3>Parameters</h3>
            <span className="pr-live">✦ Live</span>
          </header>
          {[
            {
              name: "Angle θ",
              value: angle,
              min: 0,
              max: 360,
              step: 1,
              ticks: ["0°", "90°", "180°", "270°", "360°"],
              change: p.setDegrees,
              unit: "°",
            },
            {
              name: "Radius (|r eⁱθ|)",
              value: radius,
              min: 0.5,
              max: 2,
              step: 0.01,
              ticks: ["0.5", "1", "1.5", "2"],
              change: setRadius,
              unit: "",
            },
          ].map((f) => (
            <div className="pr-field" key={f.name}>
              <label>{f.name}</label>
              <div>
                <input
                  type="range"
                  aria-label={f.name}
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  value={f.value}
                  onChange={(e) => f.change(Number(e.target.value))}
                  style={
                    {
                      "--pr-progress": `${((f.value - f.min) / (f.max - f.min)) * 100}%`,
                    } as CSSProperties
                  }
                />
                <input
                  type="number"
                  aria-label={`${f.name} value`}
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  value={f.value}
                  onChange={(e) => {
                    if (e.target.value != "")
                      f.change(
                        Math.max(
                          f.min,
                          Math.min(f.max, Number(e.target.value)),
                        ),
                      );
                  }}
                />
                <span>{f.unit}</span>
              </div>
              <div className="pr-ticks">
                {f.ticks.map((t) => (
                  <small key={t}>{t}</small>
                ))}
              </div>
              {f.unit && (
                <small className="pr-radians">{theta.toFixed(4)} rad</small>
              )}
            </div>
          ))}
          <h4>Projection view</h4>
          {(
            [
              ["xy", "XY plane (cos θ, sin θ)"],
              ["xz", "XZ plane (cos θ)"],
              ["yz", "YZ plane (sin θ)"],
              ["vector", "Show 3D vector"],
              ["trace", "Show helix trace"],
              ["shadows", "Show shadows"],
            ] as const
          ).map(([key, label]) => (
            <label className="pr-check" key={key}>
              <input
                type="checkbox"
                checked={display[key]}
                onChange={(e) =>
                  setDisplay({ ...display, [key]: e.target.checked })
                }
              />
              {label}
            </label>
          ))}
        </section>
        <div className="pr-visual" ref={sceneRef}>
          <header>
            <Box />
            <h3>
              3D Projections of{" "}
              <MathExpression value={String.raw`e^{i\theta}`} />
            </h3>
            <button
              className="pr-exit-fullscreen"
              aria-label="Exit fullscreen"
              onClick={() => {
                void document
                  .exitFullscreen()
                  .catch(() => setNotice("Use Escape to leave fullscreen."));
              }}
            >
              <Expand />
            </button>
          </header>
          {cursor.panel}
          <svg
            {...cursor.bind}
            className="pr-diagram"
            viewBox="0 0 780 410"
            role="slider"
            aria-label={`${view} projection: real ${fmt(re)}, imaginary ${fmt(im)}, height ${theta.toFixed(3)} radians`}
          >
            <defs>
              <radialGradient id={`${id}bg`}>
                <stop stopColor="#102e54" />
                <stop offset="1" stopColor="#021026" />
              </radialGradient>
              <filter
                id={`${id}glow`}
                x="-100%"
                y="-100%"
                width="300%"
                height="300%"
              >
                <feGaussianBlur stdDeviation="3" />
              </filter>
              <linearGradient id={`${id}coil`}>
                <stop stopColor="#00d5ff" />
                <stop offset=".5" stopColor="#247cff" />
                <stop offset="1" stopColor="#814dff" />
              </linearGradient>
            </defs>
            <rect width="780" height="410" fill={`url(#${id}bg)`} />
            {view === "3D" && (
              <>
                {display.xy && (
                  <polygon
                    points={poly([
                      [-1.5, -1.5, 0],
                      [1.5, -1.5, 0],
                      [1.5, 1.5, 0],
                      [-1.5, 1.5, 0],
                    ])}
                    fill="#12466a"
                    fillOpacity=".38"
                    stroke="#3c6387"
                    strokeWidth="1"
                  />
                )}
                {display.xz && (
                  <polygon
                    points={poly([
                      [-1.5, -1.5, 0],
                      [1.5, -1.5, 0],
                      [1.5, -1.5, 5.2],
                      [-1.5, -1.5, 5.2],
                    ])}
                    fill="#66558c"
                    fillOpacity=".14"
                    stroke="#3c6387"
                  />
                )}
                {display.yz && (
                  <polygon
                    points={poly([
                      [-1.5, -1.5, 0],
                      [-1.5, 1.5, 0],
                      [-1.5, 1.5, 5.2],
                      [-1.5, -1.5, 5.2],
                    ])}
                    fill="#287978"
                    fillOpacity=".2"
                    stroke="#3c6387"
                  />
                )}
              </>
            )}
            {p.grid &&
              Array.from({ length: 7 }, (_, i) => (
                <g key={i} stroke="#365879" strokeOpacity=".6" strokeWidth=".6">
                  <polyline
                    points={poly([
                      [-1.5 + i * 0.5, -1.5, 0],
                      [-1.5 + i * 0.5, 1.5, 0],
                    ])}
                    fill="none"
                  />
                  <polyline
                    points={poly([
                      [-1.5, -1.5 + i * 0.5, 0],
                      [1.5, -1.5 + i * 0.5, 0],
                    ])}
                    fill="none"
                  />
                </g>
              ))}
            <g fill="none" strokeWidth="2">
              <polyline
                points={poly([
                  [-1.7, 0, 0],
                  [2.15, 0, 0],
                ])}
                stroke="#ff3489"
              />
              <polyline
                points={poly([
                  [0, -1.7, 0],
                  [0, 2.15, 0],
                ])}
                stroke="#00ec71"
              />
              <polyline
                points={poly([
                  [0, 0, 0],
                  [0, 0, 8.2],
                ])}
                stroke="#00d9ff"
              />
            </g>
            <g fontFamily="Arial" fontSize="16" fontWeight="600">
              <text
                x={project(2.3, 0, 0)[0]}
                y={project(2.3, 0, 0)[1] + 10}
                fill="#ff3489"
              >
                x (cos θ)
              </text>
              <text
                x={project(0, 2.3, 0)[0]}
                y={project(0, 2.3, 0)[1] + 10}
                fill="#00ef71"
              >
                y
              </text>
              <text
                x={project(0, 0, 8.2)[0] + 17}
                y={project(0, 0, 8.2)[1] + 12}
                fill="#00dcff"
              >
                z (θ)
              </text>
            </g>
            {display.xy && (
              <polyline
                points={wave((t) => [
                  radius * Math.cos(t),
                  radius * Math.sin(t),
                  0,
                ])}
                fill="none"
                stroke="#00dfff"
                strokeWidth="2"
                strokeDasharray="6 4"
              />
            )}
            {display.xz && (
              <>
                <polyline
                  points={wave((t) => [radius * Math.cos(t), -1.5, t])}
                  fill="none"
                  stroke="#ff398b"
                  strokeWidth="1.5"
                />
                <text
                  x="160"
                  y="178"
                  fill="#ff398b"
                  fontFamily="Arial"
                  fontSize="18"
                >
                  cos θ
                </text>
              </>
            )}
            {display.yz && (
              <>
                <polyline
                  points={wave((t) => [-1.5, radius * Math.sin(t), t])}
                  fill="none"
                  stroke="#00e779"
                  strokeWidth="1.5"
                />
                <text
                  x="570"
                  y="202"
                  fill="#00e779"
                  fontFamily="Arial"
                  fontSize="18"
                >
                  sin θ
                </text>
              </>
            )}
            <polyline
              points={wave((t) => [
                radius * Math.cos(t),
                radius * Math.sin(t),
                t,
              ])}
              fill="none"
              stroke={`url(#${id}coil)`}
              strokeWidth="3"
              strokeDasharray={display.trace ? undefined : "7 5"}
            />
            <polyline
              points={wave((t) => [
                radius * Math.cos(t),
                radius * Math.sin(t),
                t,
              ])}
              fill="none"
              stroke="#00ccff"
              strokeWidth="5"
              opacity=".35"
              filter={`url(#${id}glow)`}
            />
            {display.shadows && (
              <g fill="none" strokeWidth="1.8" strokeDasharray="6 5">
                <polyline
                  points={poly([
                    [re, im, theta],
                    [re, im, 0],
                  ])}
                  stroke="#ffc239"
                />
                {display.xz && (
                  <polyline
                    points={poly([
                      [re, im, theta],
                      [re, -1.5, theta],
                    ])}
                    stroke="#ff398b"
                  />
                )}
                {display.yz && (
                  <polyline
                    points={poly([
                      [re, im, theta],
                      [-1.5, im, theta],
                    ])}
                    stroke="#00e779"
                  />
                )}
              </g>
            )}
            {display.vector && (
              <g>
                <line
                  x1={origin[0]}
                  y1={origin[1]}
                  x2={pt[0]}
                  y2={pt[1]}
                  stroke="#ffd044"
                  strokeWidth="2"
                  strokeOpacity=".75"
                />
                <line
                  x1={origin[0]}
                  y1={origin[1]}
                  x2={base[0]}
                  y2={base[1]}
                  stroke="#ffd044"
                  strokeWidth="2"
                />
              </g>
            )}
            <circle cx={base[0]} cy={base[1]} r="4" fill="#ffd044" />
            <circle
              cx={pt[0]}
              cy={pt[1]}
              r="7"
              fill="#ffc939"
              stroke="#fff2ae"
              strokeWidth="1.5"
            />
            <g
              transform="translate(599 12)"
              fontFamily="Arial"
              fontSize="14"
              fill="#edf6ff"
            >
              <rect
                width="171"
                height="109"
                rx="12"
                fill="#10223d"
                stroke="#526b8c"
              />
              <text x="14" y="25">
                θ = {angle}° ({theta.toFixed(4)} rad)
              </text>
              <text x="14" y="49">
                cos θ = {fmt(Math.cos(theta), 4)}
              </text>
              <text x="14" y="72">
                sin θ = {fmt(Math.sin(theta), 4)}
              </text>
              <text x="14" y="95">
                r eⁱθ = {fmt(re)} {im < 0 ? "−" : "+"} {fmt(Math.abs(im))}i
              </text>
            </g>
          </svg>
          <footer>
            <button
              className="pr-play"
              aria-label={
                p.playing
                  ? "Pause projection animation"
                  : "Play projection animation"
              }
              onClick={p.play}
              disabled={p.motionOff}
            >
              {p.playing ? <Pause /> : <Play />}
            </button>
            <div className="pr-timeline">
              <input
                aria-label="Projection timeline"
                type="range"
                min="0"
                max="360"
                value={angle}
                onChange={(e) => p.setDegrees(Number(e.target.value))}
              />
              <span>
                0° <small>360°</small>
              </span>
            </div>
            <div className="pr-views">
              <Box />
              {(["3D", "XY", "XZ", "YZ"] as const).map((v) => (
                <button
                  key={v}
                  aria-pressed={view === v}
                  onClick={() => setView(v)}
                >
                  {v}
                </button>
              ))}
            </div>
          </footer>
        </div>
        <div className="pr-right">
          <section className="pr-panel pr-formula">
            <header>
              <BookOpen />
              <h3>Formula &amp; Interpretation</h3>
              <select
                aria-label="Projection interpretation"
                value={view}
                onChange={(e) => setView(e.target.value as View)}
              >
                <option value="3D">Projection View</option>
                <option>XY</option>
                <option>XZ</option>
                <option>YZ</option>
              </select>
            </header>
            <div className="pr-equation">
              <MathExpression
                value={
                  radius === 1
                    ? formula
                    : String.raw`r e^{i\theta}=r\cos\theta+i r\sin\theta`
                }
              />
            </div>
            <p>
              The projections show how a point on the{" "}
              {radius === 1 ? "unit circle" : "complex plane"} appears on
              different coordinate planes.
            </p>
            {[
              ["XY", "(r cos θ, r sin θ)"],
              ["XZ", "(r cos θ, 0, θ)"],
              ["YZ", "(0, r sin θ, θ)"],
            ].map(([name, text], i) => (
              <button
                key={name}
                className={`pr-plane pr-plane-${i}`}
                onClick={() => setView(name as View)}
                aria-pressed={view === name}
              >
                <i />
                <strong>{name} plane:</strong>
                <span>{radius === 1 ? text.replaceAll("r ", "") : text}</span>
              </button>
            ))}
          </section>
          <section className="pr-panel pr-quiz">
            <header>
              <Lightbulb />
              <h3>Concept Check</h3>
              <button
                onClick={() => {
                  setQuestion((question + 45) % 360);
                  setChoice(null);
                  setFeedback("");
                }}
              >
                New Question
              </button>
            </header>
            <p>
              For θ = {question}°, what is the unit-circle projection on XY?
            </p>
            <div className="pr-answers">
              {options.map(([x, y], i) => (
                <button
                  key={i}
                  aria-pressed={choice === i}
                  onClick={() => {
                    setChoice(i);
                    setFeedback("");
                  }}
                >
                  <b>{"ABCD"[i]}</b>
                  <span>
                    ({fmt(x)}, {fmt(y)})
                  </span>
                </button>
              ))}
            </div>
            <button
              className="er-primary"
              onClick={() => {
                if (choice === null) setFeedback("Choose an answer first.");
                else if (choice === 0) {
                  setFeedback(
                    "Correct — XY preserves the real and imaginary coordinates.",
                  );
                  markComplexComplete("euler");
                } else
                  setFeedback(
                    "Try again: the XY coordinates are (cos θ, sin θ).",
                  );
              }}
            >
              Check Answer
            </button>
            {feedback && <p role="status">{feedback}</p>}
          </section>
        </div>
      </div>
      <div className="er-learning-cards pr-learning">
        {[
          {
            title: "Observe",
            icon: Eye,
            text: "Move θ and see its projections on different planes.",
            action: () => {
              p.setDegrees(0);
              if (!p.playing && !p.motionOff) p.play();
            },
          },
          {
            title: "Understand",
            icon: BookOpen,
            text: "Learn how projections link the unit circle to 3D space.",
            action: () => navigate("meaning"),
          },
          {
            title: "Why",
            icon: Brain,
            text: "Projections reveal the structure of complex numbers and rotations.",
            action: () => navigate("more"),
          },
          {
            title: "Try",
            icon: FlaskConical,
            text: "Change θ, explore projections, and compare with the helix.",
            action: p.advanced,
          },
          {
            title: "Challenge",
            icon: Flag,
            text: "Can you find an angle θ where cos θ = sin θ?",
            action: () => navigate("quiz"),
          },
        ].map(({ title, icon: Icon, text, action }) => (
          <button key={title} onClick={action}>
            <span className="er-card-icon">
              <Icon />
            </span>
            <span>
              <strong>{title}</strong>
              <small>{text}</small>
            </span>
            <ChevronRight />
          </button>
        ))}
      </div>
      {notice && (
        <p role="status" className="pr-notice">
          {notice}
        </p>
      )}
    </div>
  );
}
