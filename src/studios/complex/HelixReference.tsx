import {
  lazy,
  Suspense,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from "react";
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
  Hand,
  ZoomIn,
  Home,
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
import { useStudioModel, useStudioState } from "../phase1/StudioModelProvider";
import { markComplexComplete } from "./complexStudioSession";
import type { HelixDisplay } from "./HelixReferenceScene";
import "./helixReference.css";
const Scene = lazy(() => import("./HelixReferenceScene"));
type Props = {
  tabs: string[];
  setMode: (s: string) => void;
  motionOff: boolean;
  advanced: () => void;
};
export default function HelixReference(p: Props) {
  const id = useId().replace(/:/g, "");
  const model = useStudioModel();
  const [theta, setTheta] = useStudioState("EulerHelix:theta", 6 * Math.PI),
    [radius, setRadius] = useStudioState("EulerHelix:radius", 1),
    [stretch, setStretch] = useStudioState("EulerHelix:stretch", 0.5);
  const [display, setDisplay] = useStudioState<HelixDisplay>(
    "EulerHelix:display",
    { circle: true, helix: true, projections: true, axes: true, point: true },
  );
  const [playing, setPlaying] = useState(false),
    [cameraPreset, setCameraPreset] = useState(0),
    [zoom, setZoom] = useState(1),
    [pan, setPan] = useState(false),
    [form, setForm] = useState("parametric"),
    [question, setQuestion] = useState(0),
    [answer, setAnswer] = useState(""),
    [feedback, setFeedback] = useState(""),
    [notice, setNotice] = useState("");
  const sceneRef = useRef<HTMLDivElement>(null),
    thetaRef = useRef(theta);
  thetaRef.current = theta;
  const safeTheta = Math.max(
      0,
      Math.min(8 * Math.PI, Number.isFinite(theta) ? theta : 6 * Math.PI),
    ),
    safeRadius = Math.max(
      0.1,
      Math.min(2, Number.isFinite(radius) ? radius : 1),
    ),
    safeStretch = Math.max(
      0,
      Math.min(2, Number.isFinite(stretch) ? stretch : 0.5),
    );
  const x = safeRadius * Math.cos(safeTheta),
    y = safeRadius * Math.sin(safeTheta),
    z = safeStretch * safeTheta;
  useEffect(() => {
    if (p.motionOff) setPlaying(false);
  }, [p.motionOff]);
  useEffect(() => {
    if (!playing || p.motionOff) return;
    model?.ledger.beginGesture();
    const timer = window.setInterval(() => {
      const next = Math.min(8 * Math.PI, thetaRef.current + 0.035);
      setTheta(next);
      if (next >= 8 * Math.PI) setPlaying(false);
    }, 60);
    return () => {
      clearInterval(timer);
      model?.ledger.endGesture();
    };
  }, [playing, p.motionOff, setTheta, model?.ledger]);
  const play = () => {
    if (safeTheta >= 8 * Math.PI) setTheta(0);
    setPlaying(!playing);
  };
  const reset = () => {
    setPlaying(false);
    setTheta(6 * Math.PI);
    setRadius(1);
    setStretch(0.5);
    setDisplay({
      circle: true,
      helix: true,
      projections: true,
      axes: true,
      point: true,
    });
    setCameraPreset((current) => Math.floor(current / 3) * 3 + 3);
    setZoom(1);
    setPan(false);
  };
  const screenshot = () => {
    const canvas = sceneRef.current?.querySelector("canvas");
    if (!canvas) {
      setNotice("The 3D scene is loading. Try again shortly.");
      return;
    }
    canvas.toBlob((blob) => {
      if (!blob) {
        setNotice("Screenshot unavailable in this browser.");
        return;
      }
      const url = URL.createObjectURL(blob),
        a = document.createElement("a");
      a.href = url;
      a.download = "euler-helix.png";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setNotice("Helix screenshot saved.");
    });
  };
  const fullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else
      void sceneRef.current
        ?.requestFullscreen?.()
        .catch(() => setNotice("Fullscreen is unavailable in this browser."));
  };
  const navigate = (pane: string) =>
    document.getElementById(`lab-tab-${pane}`)?.click();
  const questions = [
    { theta: 4, c: 0.5 },
    { theta: 2, c: 1 },
    { theta: 6, c: 0.25 },
  ];
  const q = questions[question];
  const parseAnswer = (value: string) => {
    const normalized = value.trim().replace(/\s/g, "").replace(/π/g, "pi");
    if (!normalized) return NaN;
    const match = normalized.match(
      /^([+-]?(?:\d+(?:\.\d*)?|\.\d+))?\*?pi(?:\/([1-9]\d*))?$/i,
    );
    return match
      ? (Number(match[1] || 1) * Math.PI) / Number(match[2] || 1)
      : Number(normalized);
  };
  const field = (
    title: string,
    value: number,
    set: (n: number) => void,
    min: number,
    max: number,
    step: number,
    ticks: string[],
    pi = false,
  ) => (
    <div className="hr-field">
      <strong>{title}</strong>
      <div>
        <div>
          <input
            type="range"
            aria-label={title}
            style={
              {
                "--hr-progress": `${((value - min) / (max - min)) * 100}%`,
              } as CSSProperties
            }
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => {
              setPlaying(false);
              set(+e.target.value);
            }}
          />
          <div className="hr-ticks">
            {ticks.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
        <label className="hr-number">
          <input
            aria-label={`${title} exact value${pi ? " in multiples of π" : ""}`}
            type="number"
            min={pi ? min / Math.PI : min}
            max={pi ? max / Math.PI : max}
            step={pi ? 0.1 : step}
            value={pi ? +(value / Math.PI).toFixed(2) : +value.toFixed(2)}
            onChange={(e) => {
              if (e.target.value !== "") {
                setPlaying(false);
                set(
                  Math.max(
                    min,
                    Math.min(max, +e.target.value * (pi ? Math.PI : 1)),
                  ),
                );
              }
            }}
          />
          {pi && <span>π</span>}
        </label>
      </div>
    </div>
  );
  return (
    <div className="hr-shell">
      <header className="hr-hero">
        <svg
          viewBox="0 0 1600 180"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={`${id}ribbon`}>
              <stop stopColor="#008cff" stopOpacity="0" />
              <stop offset=".35" stopColor="#7139ef" />
              <stop offset=".65" stopColor="#06bdeb" />
              <stop offset="1" stopColor="#244aff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id={`${id}coil`}>
              <stop stopColor="#07ddff" />
              <stop offset=".6" stopColor="#259aff" />
              <stop offset="1" stopColor="#d667ff" />
            </linearGradient>
            <filter
              id={`${id}glow`}
              x="-80%"
              y="-80%"
              width="260%"
              height="260%"
            >
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect width="1600" height="180" fill="#030e20" />
          {Array.from({ length: 28 }, (_, i) => (
            <path
              key={i}
              d={`M${290 + i * 5} -40 C${610 - i * 3} ${-90 + i * 7}, ${410 + i * 6} ${220 - i * 3}, ${680 + i * 5} 120 S${850 + i * 5} ${210 + i * 2}, ${1090 + i * 6} 130 S${1270 + i * 3} ${-10 + i * 2}, 1430 -50`}
              fill="none"
              stroke={`url(#${id}ribbon)`}
              strokeWidth={i % 8 === 0 ? 4 : 1}
              opacity={i % 8 === 0 ? 0.9 : 0.25}
              filter={i % 8 === 0 ? `url(#${id}glow)` : undefined}
            />
          ))}
          <g
            transform="translate(1065 -10)"
            fill="none"
            stroke={`url(#${id}coil)`}
            filter={`url(#${id}glow)`}
          >
            {[0, 1, 2, 3].map((i) => (
              <path
                key={i}
                d={`M-65 ${i * 55} C-120 ${i * 55 + 22}, 120 ${i * 55 + 6}, 65 ${i * 55 + 33} S-120 ${i * 55 + 52}, -65 ${i * 55 + 55}`}
                strokeWidth="3.5"
              />
            ))}
          </g>
          <path d="M1065 0V180" stroke="#19bcf8" strokeDasharray="2 8" />
        </svg>
        <div>
          <h1>Euler’s Formula Lab</h1>
          <h2>Helix</h2>
          <h3>From complex numbers to beautiful 3D curves</h3>
          <p>
            Visualize <MathExpression value={String.raw`e^{i\theta}`} /> as
            rotation and see how adding a linear term creates a helix.
          </p>
        </div>
        <div className="hr-hero-equation">
          <MathExpression value={String.raw`z=e^{i\theta}`} />
        </div>
        <blockquote>
          “From circles
          <br />
          to spirals,
          <br />
          from numbers
          <br />
          to shapes.”
        </blockquote>
      </header>
      <div className="hr-toolbar">
        <div className="er-mode-buttons">
          <strong>Mode:</strong>
          {p.tabs.map((mode, i) => {
            const Icon =
              [CircleDashed, Shapes, ChartNoAxesCombined, SlidersHorizontal][
                i
              ] || Shapes;
            return (
              <button
                key={mode}
                aria-pressed={mode === "Helix"}
                onClick={() => {
                  setPlaying(false);
                  p.setMode(mode);
                }}
              >
                <Icon />
                {mode === "Taylor" ? "Taylor Series" : mode}
              </button>
            );
          })}
        </div>
        <div className="hr-tools">
          <button onClick={reset}>
            <RotateCcw />
            Reset
          </button>
          <button
            disabled={p.motionOff}
            aria-pressed={playing && !p.motionOff}
            onClick={play}
          >
            {playing && !p.motionOff ? <Pause /> : <Play />}Animate
          </button>
          <button onClick={screenshot}>
            <Camera />
            Screenshot
          </button>
          <button onClick={fullscreen}>
            <Expand />
            Fullscreen
          </button>
        </div>
      </div>
      <div className="hr-panels">
        <aside className="hr-parameters hr-panel">
          <header>
            <SlidersHorizontal />
            <h3>Parameters</h3>
            <span>
              <i />
              Live
            </span>
          </header>
          <div className="hr-parameter-body">
            {field(
              "t (θ)",
              safeTheta,
              setTheta,
              0,
              8 * Math.PI,
              Math.PI / 100,
              ["0", "π", "2π", "4π", "6π", "8π"],
              true,
            )}
            {field("Radius (|reⁱθ|)", safeRadius, setRadius, 0.1, 2, 0.01, [
              "0.1",
              "0.5",
              "1",
              "1.5",
              "2",
            ])}
            {field(
              "Vertical stretch (c)",
              safeStretch,
              setStretch,
              0,
              2,
              0.01,
              ["0", "0.5", "1", "2"],
            )}
            <div className="hr-display">
              <strong>Display options</strong>
              {[
                ["circle", "Show unit circle (xy-plane)"],
                ["helix", "Show helix"],
                ["projections", "Show projections"],
                ["axes", "Show axes and grid"],
                ["point", "Show parametric point"],
              ].map(([key, text]) => (
                <label key={key}>
                  <input
                    type="checkbox"
                    checked={display[key as keyof HelixDisplay]}
                    onChange={(e) =>
                      setDisplay({ ...display, [key]: e.target.checked })
                    }
                  />
                  {text}
                </label>
              ))}
            </div>
          </div>
        </aside>
        <section className="hr-visual hr-panel">
          <header>
            <Box />
            <h3>3D Visualization</h3>
          </header>
          <div className="hr-scene" ref={sceneRef}>
            <Suspense
              fallback={
                <div className="hr-loading">Loading interactive 3D helix…</div>
              }
            >
              <Scene
                theta={safeTheta}
                radius={safeRadius}
                stretch={safeStretch}
                display={display}
                cameraPreset={cameraPreset}
                zoom={zoom}
                pan={pan}
                reduced={p.motionOff}
              />
            </Suspense>
            <dl className="hr-live-values">
              <div>
                <dt>t =</dt>
                <dd>{(safeTheta / Math.PI).toFixed(1)}π</dd>
              </div>
              <div>
                <dt>x =</dt>
                <dd>{x.toFixed(3)}</dd>
              </div>
              <div>
                <dt>y =</dt>
                <dd>{Math.abs(y) < 0.0005 ? "0.000" : y.toFixed(3)}</dd>
              </div>
              <div>
                <dt>z =</dt>
                <dd>{z.toFixed(3)}</dd>
              </div>
            </dl>
            <div className="hr-camera-tools">
              <button
                aria-label="Pan camera"
                aria-pressed={pan}
                onClick={() => setPan(!pan)}
              >
                <Hand />
              </button>
              <button
                aria-label="Reset camera"
                onClick={() => {
                  setCameraPreset((current) => Math.floor(current / 3) * 3 + 3);
                  setZoom(1);
                  setPan(false);
                }}
              >
                <RotateCcw />
              </button>
              <button
                aria-label="Zoom helix"
                onClick={() => setZoom(Math.min(2, zoom + 0.15))}
              >
                <ZoomIn />
              </button>
              <button
                aria-label="Change 3D view"
                onClick={() => setCameraPreset(cameraPreset + 1)}
              >
                <Box />
              </button>
              <button
                aria-label="Fit helix"
                onClick={() => {
                  setCameraPreset((current) => Math.floor(current / 3) * 3 + 3);
                  setZoom(1);
                }}
              >
                <Home />
              </button>
            </div>
            <div className="hr-playback">
              <button
                aria-label={
                  playing && !p.motionOff ? "Pause helix" : "Play helix"
                }
                disabled={p.motionOff}
                onClick={play}
              >
                {playing && !p.motionOff ? (
                  <Pause />
                ) : (
                  <Play fill="currentColor" />
                )}
              </button>
              <input
                aria-label="Helix timeline"
                type="range"
                min="0"
                max={8 * Math.PI}
                step=".01"
                value={safeTheta}
                onChange={(e) => {
                  setPlaying(false);
                  setTheta(+e.target.value);
                }}
              />
              <span>0 → 8π</span>
            </div>
          </div>
        </section>
        <div className="hr-right">
          <aside className="hr-formula hr-panel">
            <header>
              <BookOpen />
              <h3>Formula & Explanation</h3>
              <select
                aria-label="Formula form"
                value={form}
                onChange={(e) => setForm(e.target.value)}
              >
                <option value="parametric">Parametric Form</option>
                <option value="exponential">Exponential Form</option>
              </select>
            </header>
            <div className="hr-equation">
              <MathExpression
                value={String.raw`z=e^{i\theta}=\cos\theta+i\sin\theta`}
              />
            </div>
            <strong>Helix in 3D: add a linear term in z</strong>
            <div className="hr-parametric">
              <MathExpression
                value={
                  form === "parametric"
                    ? safeRadius === 1
                      ? String.raw`(x,y,z)=(\cos\theta,\sin\theta,c\theta)`
                      : String.raw`(x,y,z)=(r\cos\theta,r\sin\theta,c\theta)`
                    : String.raw`x+iy=re^{i\theta},\quad z=c\theta`
                }
              />
            </div>
            <ul>
              <li>
                Projection on xy-plane is{" "}
                {safeRadius === 1
                  ? "a unit circle"
                  : `a circle of radius ${safeRadius.toFixed(2)}`}
                .
              </li>
              <li>
                Height {safeStretch === 0 ? "stays zero" : "increases linearly"}{" "}
                with θ.
              </li>
              <li>
                This links complex numbers, trigonometry, and 3D geometry.
              </li>
            </ul>
          </aside>
          <form
            className="hr-concept hr-panel"
            onSubmit={(e) => {
              e.preventDefault();
              const correct =
                Math.abs(parseAnswer(answer) - q.theta * Math.PI * q.c) < 0.01;
              setFeedback(
                correct
                  ? "Correct! z = cθ = " + q.theta * q.c + "π."
                  : answer.trim()
                    ? "Use z = cθ. Multiply the angle by the vertical stretch."
                    : "Enter a value first, for example 2π.",
              );
              if (correct) markComplexComplete("euler");
            }}
          >
            <header>
              <Lightbulb />
              <h3>Concept Check</h3>
              <button
                type="button"
                onClick={() => {
                  setQuestion((question + 1) % questions.length);
                  setAnswer("");
                  setFeedback("");
                }}
              >
                <RotateCcw />
                New Question
              </button>
            </header>
            <p>
              What is the <em>z</em>-coordinate when{" "}
              <MathExpression value={String.raw`\theta=${q.theta}\pi`} /> and c
              = {q.c}?
            </p>
            <div>
              <input
                aria-label="Helix concept answer"
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value);
                  setFeedback("");
                }}
                placeholder="Enter your answer (e.g. 2π)"
              />
              <button className="er-primary">Check</button>
            </div>
            {feedback && <p role="status">{feedback}</p>}
          </form>
        </div>
      </div>
      <div className="er-learning-cards hr-learning">
        {[
          {
            title: "Observe",
            icon: Eye,
            text: "Watch eⁱθ rotate and trace the helix in 3D.",
            action: () => {
              setTheta(0);
              if (!p.motionOff) setPlaying(true);
            },
          },
          {
            title: "Understand",
            icon: BookOpen,
            text: "See how a circle becomes a helix by adding a linear term.",
            action: () => navigate("meaning"),
          },
          {
            title: "Why",
            icon: Brain,
            text: "Connects complex numbers, exponential functions, and 3D geometry.",
            action: () => navigate("more"),
          },
          {
            title: "Try",
            icon: FlaskConical,
            text: "Change parameters and explore different helixes.",
            action: p.advanced,
          },
          {
            title: "Challenge",
            icon: Flag,
            text: "Can you create a double helix or a conical helix?",
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
        <p className="hr-notice" role="status">
          {notice}
        </p>
      )}
    </div>
  );
}
