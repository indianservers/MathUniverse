import { cursorAngle } from "./eulerCursorMath";
import { useEulerCursor } from "./EulerCursor";
import { useId, useMemo, useRef, useState, type CSSProperties } from "react";
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
  Waves,
  Sigma,
  Eye,
  Brain,
  FlaskConical,
  Trophy,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import MathExpression from "../../components/ui/MathExpression";
import { taylorExpITheta, type C } from "./complexLabMath";
import { eulerError, taylorPartialSums } from "./eulerLearningMath";
import { useStudioState } from "../phase1/StudioModelProvider";
import { markComplexComplete } from "./complexStudioSession";
import "./taylorReference.css";
import nebulaUrl from "../../assets/euler-taylor-nebula.png";

type Props = {
  tabs: string[];
  setMode: (s: string) => void;
  degrees: number;
  setDegrees: (n: number) => void;
  terms: number;
  setTerms: (n: number) => void;
  playing: boolean;
  play: () => void;
  motionOff: boolean;
  grid: boolean;
  setGrid: (b: boolean) => void;
  reset: () => void;
  advanced: () => void;
};
const series = String.raw`e^{i\theta}=1+i\theta+\frac{(i\theta)^2}{2!}+\frac{(i\theta)^3}{3!}+\cdots=\sum_{k=0}^{\infty}\frac{(i\theta)^k}{k!}`;
const defaults = {
  exact: true,
  approximation: true,
  path: true,
  error: true,
  circle: true,
  labels: false,
};
const fmt = (n: number, digits = 4) =>
  (Math.abs(n) < 0.5 * 10 ** -digits ? 0 : n).toFixed(digits).replace("-", "−");
const pair = (p: C) => `(${fmt(p.re)}, ${fmt(p.im)})`;
// Give the reference's 1, 5, 10, 20, 50 landmarks equal space while keeping n integral.
const termLandmarks = [1, 5, 10, 20, 50];
const termPosition = (count: number) => {
  const index = Math.min(
    3,
    Math.max(0, termLandmarks.findIndex((value) => value > count) - 1),
  );
  if (count >= 50) return 100;
  return (
    25 *
    (index +
      (count - termLandmarks[index]) /
        (termLandmarks[index + 1] - termLandmarks[index]))
  );
};
const termsAtPosition = (position: number) => {
  const index = Math.min(3, Math.floor(position / 25));
  return Math.round(
    termLandmarks[index] +
      (position / 25 - index) *
        (termLandmarks[index + 1] - termLandmarks[index]),
  );
};
const scientific = (n: number) => {
  if (n === 0) return "0";
  const exponent = Math.floor(Math.log10(n));
  return String.raw`${(n / 10 ** exponent).toFixed(3)}\times10^{${exponent}}`;
};
export default function TaylorReference(p: Props) {
  const id = useId().replace(/:/g, "");
  const [display, setDisplay] = useStudioState("EulerTaylor:display", defaults);
  const [view, setView] = useState<"2D" | "3D" | "Both">("2D"),
    [stepMode, setStepMode] = useState(false),
    [step, setStep] = useState(1),
    [fit, setFit] = useState(false),
    [termsOpen, setTermsOpen] = useState(false),
    [choice, setChoice] = useState<number | null>(null),
    [feedback, setFeedback] = useState(""),
    [notice, setNotice] = useState(""),
    [challengeOpen, setChallengeOpen] = useState(false),
    [challengeAnswer, setChallengeAnswer] = useState(""),
    [challengeFeedback, setChallengeFeedback] = useState("");
  const [question, setQuestion] = useState({ angle: 336, terms: 10 });
  const sceneRef = useRef<HTMLDivElement>(null),
    tableRef = useRef<HTMLDivElement>(null);
  const angle =
    p.degrees === 360
      ? 360
      : Math.round((((p.degrees % 360) + 360) % 360) * 100) / 100;
  const theta = (angle * Math.PI) / 180,
    n = Math.max(1, Math.min(50, Math.round(p.terms))),
    activeTerms = stepMode ? Math.min(step, n) : n;
  const sums = useMemo(() => taylorPartialSums(theta, n), [theta, n]);
  const exact = { re: Math.cos(theta), im: Math.sin(theta) },
    approximation = sums[activeTerms - 1];
  const error = Math.hypot(
    exact.re - approximation.re,
    exact.im - approximation.im,
  );
  const extent = fit
    ? Math.max(
        1.25,
        ...sums
          .slice(0, activeTerms)
          .map((v) => Math.max(Math.abs(v.re), Math.abs(v.im))),
      ) * 1.1
    : 1;
  const scale = 160 / extent,
    px = (v: C) => [353 + v.re * scale, 248 - v.im * scale];
  const cursor = useEulerCursor({
    degrees: p.degrees,
    setDegrees: p.setDegrees,
    projectAngle: (x, y) =>
      view === "3D"
        ? Math.max(0, Math.min(360, ((x - 45) / 520) * 360))
        : view === "Both" && x > 350
          ? Math.max(0, Math.min(360, ((x - 350) / 370) * 360))
          : cursorAngle(
              x - (view === "Both" ? 5 + 353 * 0.57 : 353),
              (view === "Both" ? 105 + 248 * 0.57 : 248) - y,
              p.degrees,
              0,
            ),
    terms: n,
    setTerms: p.setTerms,
  });
  const [ex, ey] = px(exact),
    [ax, ay] = px(approximation);
  const path = sums
    .slice(0, activeTerms)
    .map((v) => px(v).join(","))
    .join(" ");
  const outside = ax < 45 || ax > 570 || ay < 65 || ay > 448;
  const q = taylorExpITheta((question.angle * Math.PI) / 180, question.terms);
  const correctChoice =
    question.angle === 336 ? 0 : question.angle === 90 ? 2 : 1;
  const rawAnswers = [
    q,
    { re: -q.im, im: q.re },
    { re: -q.re, im: -q.im },
    { re: q.im, im: -q.re },
  ];
  const answers = rawAnswers.map(
    (_, index) => rawAnswers[(index - correctChoice + 4) % 4],
  );
  const term = sums[activeTerms - 1],
    previous = activeTerms > 1 ? sums[activeTerms - 2] : { re: 0, im: 0 };
  const navigate = (pane: string) =>
    document.getElementById(`lab-tab-${pane}`)?.click();
  const pause = () => {
    if (p.playing) p.play();
  };
  const reset = () => {
    pause();
    p.reset();
    p.setDegrees(336);
    p.setTerms(10);
    setStepMode(false);
    setStep(1);
    setDisplay(defaults);
    setView("2D");
    setFit(false);
    setTermsOpen(false);
    setChoice(null);
    setFeedback("");
    setQuestion({ angle: 336, terms: 10 });
    setNotice("");
    setChallengeOpen(false);
    setChallengeAnswer("");
    setChallengeFeedback("");
  };
  const screenshot = async () => {
    const svg = sceneRef.current?.querySelector("svg.tr-plot");
    if (!svg) return;
    const copy = svg.cloneNode(true) as SVGSVGElement;
    copy.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    for (const [y, text] of [
      [26, "Euler’s Formula Lab · Taylor Series"],
      [
        49,
        `${activeTerms} terms · θ = ${angle}° · error = ${error.toPrecision(5)}`,
      ],
    ] as const) {
      const caption = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      caption.setAttribute("x", "20");
      caption.setAttribute("y", String(y));
      caption.setAttribute("fill", "#e8f6ff");
      caption.setAttribute("font-family", "Arial");
      caption.setAttribute("font-size", "15");
      caption.textContent = text;
      copy.appendChild(caption);
    }
    let url = "";
    try {
      // Embed the background so the saved SVG can be rasterized without external image requests.
      const response = await fetch(nebulaUrl);
      if (!response.ok) throw new Error("Artwork unavailable");
      const blob = await response.blob();
      const artwork = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      copy
        .querySelectorAll("image")
        .forEach((image) => image.setAttribute("href", artwork));
      url = URL.createObjectURL(
        new Blob([new XMLSerializer().serializeToString(copy)], {
          type: "image/svg+xml",
        }),
      );
      const image = new Image();
      image.src = url;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = 1488;
      canvas.height = 1068;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas unavailable");
      ctx.drawImage(image, 0, 0, 1488, 1068);
      const png = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve),
      );
      if (!png) throw new Error("Export unavailable");
      const download = URL.createObjectURL(png),
        link = document.createElement("a");
      link.href = download;
      link.download = "euler-taylor-series.png";
      link.click();
      setTimeout(() => URL.revokeObjectURL(download), 1000);
      setNotice("Taylor approximation screenshot saved.");
    } catch {
      setNotice(
        "Screenshot unavailable. Try again in a browser that supports image export.",
      );
    } finally {
      URL.revokeObjectURL(url);
    }
  };
  const stars = (count: number, width: number, height: number) =>
    Array.from({ length: count }, (_, i) => (
      <circle
        key={i}
        cx={(Math.sin(i * 47.13) * 0.5 + 0.5) * width}
        cy={(Math.cos(i * 13.79) * 0.5 + 0.5) * height}
        r={i % 9 === 0 ? 1.5 : 0.65}
        fill={i % 3 === 0 ? "#745bff" : "#5dc9ff"}
        opacity={0.15 + (i % 5) * 0.13}
      />
    ));
  const plot3D = (offset: number, width: number) => {
    const max = Math.max(
      1.25,
      ...sums
        .slice(0, activeTerms)
        .map((v) => Math.max(Math.abs(v.re), Math.abs(v.im))),
    );
    const position = (v: C, k: number) => [
      offset + width * 0.5 + ((v.re - v.im) * width * 0.18) / max,
      370 +
        ((v.re + v.im) * width * 0.07) / max -
        (k / Math.max(n - 1, 1)) * 230,
    ];
    const points = sums.slice(0, activeTerms).map((v, i) => position(v, i));
    const target = position(exact, activeTerms - 1);
    return (
      <g transform="translate(0 -50)">
        <polygon
          points={`${offset + width * 0.15},370 ${offset + width * 0.5},320 ${offset + width * 0.85},370 ${offset + width * 0.5},420`}
          fill="#103454"
          fillOpacity=".5"
          stroke="#365b82"
        />
        <g stroke="#61bbff" strokeWidth="1.3">
          <path
            d={`M ${offset + width * 0.5} 370 V 115 M ${offset + width * 0.5} 370 L ${offset + width * 0.1} 426 M ${offset + width * 0.5} 370 L ${offset + width * 0.9} 426`}
            fill="none"
          />
        </g>
        <g fontSize="15" fontFamily="Arial" fill="#a1d4ff">
          <text x={offset + width * 0.5 + 9} y="125">
            k (term index)
          </text>
          <text x={offset + width * 0.1} y="443">
            Re
          </text>
          <text x={offset + width * 0.85} y="443">
            Im
          </text>
        </g>
        {display.path && (
          <polyline
            points={points.map((v) => v.join(",")).join(" ")}
            fill="none"
            stroke="#ffdb58"
            strokeWidth="2"
          />
        )}
        {display.approximation &&
          points.map(([x, y], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={i === activeTerms - 1 ? 5 : 2.5}
              fill="#ffcf36"
            />
          ))}
        {display.exact && (
          <circle
            cx={target[0]}
            cy={target[1]}
            r="6"
            fill="#02d6ff"
            stroke="#c0ffff"
          />
        )}
        {display.error && display.exact && display.approximation && (
          <line
            x1={points.at(-1)?.[0]}
            y1={points.at(-1)?.[1]}
            x2={target[0]}
            y2={target[1]}
            stroke="#ff9e46"
            strokeDasharray="5 4"
          />
        )}
      </g>
    );
  };
  return (
    <div className="tr-shell">
      <header className="tr-hero">
        <svg
          viewBox="0 0 1672 174"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id={`${id}hero`}>
              <stop stopColor="#064077" />
              <stop offset=".65" stopColor="#081747" />
              <stop offset="1" stopColor="#021028" />
            </radialGradient>
            <linearGradient id={`${id}nebula`}>
              <stop stopColor="#039dff" />
              <stop offset=".4" stopColor="#056bff" />
              <stop offset=".7" stopColor="#b643ff" />
              <stop offset="1" stopColor="#0ad9ff" />
            </linearGradient>
            <filter id={`${id}blur`}>
              <feGaussianBlur stdDeviation="5" />
            </filter>
          </defs>
          <rect width="1672" height="174" fill={`url(#${id}hero)`} />
          <image
            href={nebulaUrl}
            width="1672"
            height="174"
            preserveAspectRatio="xMidYMid slice"
          />
          <rect
            width="1672"
            height="174"
            fill={`url(#${id}hero)`}
            opacity=".35"
          />
          {stars(180, 1672, 174)}
          {Array.from({ length: 15 }, (_, i) => (
            <path
              key={i}
              d={`M ${400 + i * 8} -40 C ${580 - i * 4} ${290 - i * 9}, ${1020 + i * 6} ${210 - i * 7}, ${1100 + i * 3} -70 M 1580 -50 C ${1400 + i * 8} ${80 + i * 3}, ${1640 - i * 8} ${200 + i * 5}, 1150 220`}
              stroke={`url(#${id}nebula)`}
              strokeWidth={i % 4 === 0 ? 3 : 1}
              fill="none"
              opacity={0.2 + (i % 5) * 0.08}
            />
          ))}
          <path
            d="M 560 -40 C 550 190 990 190 1120 -30 M 1390 -30 C 1540 170 1250 210 1140 200"
            fill="none"
            stroke={`url(#${id}nebula)`}
            strokeWidth="12"
            opacity=".65"
            filter={`url(#${id}blur)`}
          />
          <g transform="translate(1285 105)" stroke="#6fe3ff" fill="none">
            <circle r="69" stroke="#64c4ff" strokeWidth="2" />
            <path d="M -101 0 H 123 l -9 -4 m 9 4 l -9 4 M 0 68 V -91 l -4 9 m 4 -9 l 4 9 M 0 0 L 59 -35" />
            <circle
              cx="59"
              cy="-35"
              r="6"
              fill="#fff"
              stroke="#cc91ff"
              filter={`url(#${id}blur)`}
            />
            <circle cx="59" cy="-35" r="5" fill="#fff" />
            <text x="13" y="-80" fill="#83e8ff" stroke="none" fontSize="18">
              Im
            </text>
            <text x="111" y="24" fill="#bac4ff" stroke="none" fontSize="18">
              Re
            </text>
          </g>
        </svg>
        <h1>Euler's Formula Lab</h1>
        <h2>Taylor Series</h2>
        <h3>
          Approximate <MathExpression value={String.raw`e^{i\theta}`} /> using
          its Taylor expansion
        </h3>
        <p>
          See how the infinite series{" "}
          <MathExpression
            value={String.raw`e^{i\theta}=1+i\theta+\frac{(i\theta)^2}{2!}+\frac{(i\theta)^3}{3!}+\cdots`}
          />{" "}
          converges to a point on the unit circle.
        </p>
        <div className="tr-hero-formula">
          <MathExpression
            value={String.raw`\displaystyle e^{i\theta}=\sum_{k=0}^{\infty}\frac{(i\theta)^k}{k!}`}
          />
        </div>
        <blockquote>
          “Analysis reveals
          <br />
          the harmony
          <br />
          behind complex
          <br />
          numbers.”<small>EXPLORE THE SERIES</small>
        </blockquote>
      </header>
      <div className="tr-toolbar">
        <div className="er-mode-buttons">
          <strong>Mode:</strong>
          {p.tabs.map((tab, i) => {
            const Icon = [CircleDashed, Waves, Box, Sigma][i];
            return (
              <button
                key={tab}
                aria-pressed={tab === "Taylor"}
                onClick={() => p.setMode(tab)}
              >
                <Icon />
                {tab === "Taylor" ? "Taylor Series" : tab}
              </button>
            );
          })}
        </div>
        <div className="tr-actions">
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
          <button
            aria-expanded={termsOpen}
            onClick={() => {
              setTermsOpen(!termsOpen);
              if (!termsOpen)
                requestAnimationFrame(() =>
                  tableRef.current?.scrollIntoView({
                    behavior: p.motionOff ? "instant" : "smooth",
                    block: "nearest",
                  }),
                );
            }}
          >
            <Sigma />
            Terms
          </button>
          <button aria-pressed={p.grid} onClick={() => p.setGrid(!p.grid)}>
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
                  setNotice("Fullscreen unavailable in this browser."),
                );
            }}
          >
            <Expand />
            Fullscreen
          </button>
        </div>
      </div>
      <div className="tr-panes">
        <section className="tr-panel tr-parameters">
          <header>
            <SlidersHorizontal />
            <h3>Parameters</h3>
            <span className="tr-live">✦ Live</span>
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
              name: "Taylor terms (n)",
              value: n,
              min: 1,
              max: 50,
              step: 1,
              ticks: ["1", "5", "10", "20", "50"],
              change: (value: number) => {
                pause();
                p.setTerms(value);
                setStep(Math.min(step, value));
              },
              unit: "",
            },
          ].map((f) => (
            <div className="tr-field" key={f.name}>
              <label>{f.name}</label>
              <div>
                <input
                  type="range"
                  aria-label={f.name}
                  aria-valuetext={`${f.value} ${f.unit ? "degrees" : "terms"}`}
                  min={0}
                  max={f.unit ? 360 : 100}
                  step={f.unit ? 1 : 0.1}
                  value={f.unit ? f.value : termPosition(f.value)}
                  onChange={(e) =>
                    f.change(
                      f.unit
                        ? Number(e.target.value)
                        : termsAtPosition(Number(e.target.value)),
                    )
                  }
                  onKeyDown={(event) => {
                    if (f.unit) return;
                    const delta =
                      event.key === "ArrowRight" || event.key === "ArrowUp"
                        ? 1
                        : event.key === "ArrowLeft" || event.key === "ArrowDown"
                          ? -1
                          : 0;
                    if (delta) {
                      event.preventDefault();
                      f.change(Math.max(1, Math.min(50, n + delta)));
                    }
                  }}
                  style={
                    {
                      "--tr-progress": `${f.unit ? ((f.value - f.min) / (f.max - f.min)) * 100 : termPosition(f.value)}%`,
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
              <div className="tr-ticks">
                {f.ticks.map((t) => (
                  <small key={t}>{t}</small>
                ))}
              </div>
              {f.unit && (
                <small className="tr-radians">{theta.toFixed(4)} rad</small>
              )}
            </div>
          ))}
          <h4>Approximation mode</h4>
          <div className="tr-approx-mode">
            <button aria-pressed={!stepMode} onClick={() => setStepMode(false)}>
              Partial sum (default)
            </button>
            <button
              aria-pressed={stepMode}
              onClick={() => {
                pause();
                setStepMode(true);
                setStep(1);
              }}
            >
              Show step-by-step
            </button>
          </div>
          <h4>Display options</h4>
          {(
            [
              ["exact", "Show exact point eⁱθ"],
              ["approximation", "Show Taylor approximation"],
              ["path", "Show partial sum path"],
              ["error", "Show error (distance)"],
              ["circle", "Show unit circle"],
              ["labels", "Show term labels"],
            ] as const
          ).map(([key, label]) => (
            <label className="tr-check" key={key}>
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
        <div className="tr-visual" data-view={view} ref={sceneRef}>
          <header>
            <Box />
            <div>
              <h3>
                Taylor Approximation of{" "}
                <MathExpression value={String.raw`e^{i\theta}`} />
              </h3>
              <p>
                {view === "2D"
                  ? "Complex plane view"
                  : view === "3D"
                    ? "Partial sums by term index"
                    : "Complex plane + partial sums in 3D"}
              </p>
            </div>
            <div className="tr-views">
              <span>View:</span>
              {(["2D", "3D", "Both"] as const).map((v) => (
                <button
                  key={v}
                  aria-pressed={view === v}
                  onClick={() => setView(v)}
                >
                  {v}
                </button>
              ))}
            </div>
            <button
              className="tr-exit-fullscreen"
              aria-label="Exit fullscreen"
              onClick={() => {
                void document.exitFullscreen();
              }}
            >
              <Expand />
            </button>
          </header>
          {cursor.panel}
          <p className="ec-mode-hint">
            {view === "2D"
              ? "Drag around the exact-point circle to change angle. Click a gold partial sum to inspect that step."
              : "Drag horizontally across the 3D pane to scrub 0 to 360 degrees. In Both view, drag the left circle to rotate."}
          </p>
          <svg
            {...cursor.bind}
            className="tr-plot"
            viewBox="0 0 744 534"
            role="slider"
            aria-label={`Taylor ${view} view: ${activeTerms} terms at ${angle} degrees, approximation ${pair(approximation)}, error ${error.toPrecision(5)}`}
          >
            <defs>
              <radialGradient id={`${id}plotbg`}>
                <stop stopColor="#0c203f" />
                <stop offset=".7" stopColor="#061329" />
                <stop offset="1" stopColor="#02112a" />
              </radialGradient>
              <linearGradient id={`${id}plotnebula`}>
                <stop stopColor="#1339cd" />
                <stop offset=".5" stopColor="#6731c6" />
                <stop offset="1" stopColor="#076297" />
              </linearGradient>
              <filter
                id={`${id}glow`}
                x="-100%"
                y="-100%"
                width="300%"
                height="300%"
              >
                <feGaussianBlur stdDeviation="4" />
              </filter>
              <clipPath id={`${id}clip`}>
                <rect x="42" y="64" width="528" height="384" />
              </clipPath>
            </defs>
            <rect width="744" height="534" fill={`url(#${id}plotbg)`} />
            <image
              href={nebulaUrl}
              width="744"
              height="534"
              preserveAspectRatio="xMidYMid slice"
              opacity=".4"
            />
            <rect
              width="744"
              height="534"
              fill={`url(#${id}plotbg)`}
              opacity=".65"
            />
            {stars(85, 744, 534)}
            {Array.from({ length: 9 }, (_, i) => (
              <path
                key={i}
                d={`M ${240 + i * 5} 35 C ${-180 + i * 10} 160, ${-70 + i * 10} 440, ${260 - i * 5} 540 M 744 80 C ${610 - i * 2} 90, ${850 - i * 8} 350, 690 510`}
                fill="none"
                stroke={`url(#${id}plotnebula)`}
                opacity=".15"
                strokeWidth={i === 4 ? 4 : 1}
              />
            ))}
            {view !== "3D" && (
              <g
                transform={
                  view === "Both" ? "translate(5 105) scale(.57)" : undefined
                }
              >
                <g clipPath={`url(#${id}clip)`}>
                  {Array.from({ length: 11 }, (_, i) => (
                    <g
                      key={i}
                      stroke="#4f79a5"
                      strokeWidth=".5"
                      opacity={p.grid ? 0.22 : 0.045}
                    >
                      <path
                        d={`M ${193 + i * 32} 80 V 448 M 120 ${88 + i * 32} H 570`}
                      />
                    </g>
                  ))}
                  <g stroke="#96b9e0" strokeWidth="1.2">
                    <path
                      d="M 145 248 H 570 l -9 -4 m 9 4 l -9 4 M 353 445 V 43 l -4 9 m 4 -9 l 4 9"
                      fill="none"
                    />
                  </g>
                  {display.circle && (
                    <circle
                      cx="353"
                      cy="248"
                      r={scale}
                      fill="none"
                      stroke="#b9c9fc"
                      strokeWidth="1.2"
                      strokeDasharray="5 4"
                    />
                  )}
                  <g fontFamily="Georgia" fontSize="18" fill="#d9e7ff">
                    <text x="548" y="235">
                      Re
                    </text>
                    <text x="365" y="53">
                      Im
                    </text>
                    <text x={353 + scale + 8} y="274">
                      1
                    </text>
                    <text x={353 - scale - 28} y="274">
                      −1
                    </text>
                    <text x="366" y={248 - scale + 8}>
                      1
                    </text>
                    <text x="366" y={248 + scale - 6}>
                      −1
                    </text>
                  </g>
                  {display.exact && (
                    <>
                      <line
                        x1="353"
                        y1="248"
                        x2={ex}
                        y2={ey}
                        stroke="#00d7ff"
                        strokeWidth="2"
                      />
                      <path
                        d={`M ${353 + Math.min(60, scale * 0.4)} 248 A ${Math.min(60, scale * 0.4)} ${Math.min(60, scale * 0.4)} 0 0 ${angle > 180 ? 1 : 0} ${353 + Math.min(60, scale * 0.4) * Math.cos(theta)} ${248 - Math.min(60, scale * 0.4) * Math.sin(theta)}`}
                        fill="none"
                        stroke="#6bafff"
                        strokeOpacity=".65"
                      />
                      <text
                        x="421"
                        y="272"
                        fill="#8adcff"
                        fontFamily="Georgia"
                        fontStyle="italic"
                        fontSize="16"
                      >
                        θ = {angle}°
                      </text>
                    </>
                  )}
                  {display.path && (
                    <polyline
                      points={path}
                      fill="none"
                      stroke="#e2d58c"
                      strokeWidth="1.6"
                      strokeOpacity=".85"
                    />
                  )}
                  {display.path &&
                    sums.slice(0, activeTerms).map((v, i) => {
                      const [x, y] = px(v);
                      return (
                        <g
                          key={i}
                          className="ec-term-target"
                          role="button"
                          tabIndex={0}
                          aria-label={`Inspect Taylor partial sum ${i + 1}`}
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            pause();
                            setStepMode(true);
                            setStep(i + 1);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              e.stopPropagation();
                              pause();
                              setStepMode(true);
                              setStep(i + 1);
                            }
                          }}
                        >
                          <title>{`Partial sum ${i + 1}: ${pair(v)}`}</title>
                          <circle cx={x} cy={y} r="10" fill="transparent" />
                          <circle
                            cx={x}
                            cy={y}
                            r="3.5"
                            fill="#ffd044"
                            stroke="#fff39b"
                            strokeWidth=".5"
                          />
                          {display.labels && (
                            <text
                              x={x + 6}
                              y={y - 6}
                              fill="#f9e8a2"
                              fontSize="11"
                              fontFamily="Arial"
                            >
                              {i}
                            </text>
                          )}
                        </g>
                      );
                    })}
                  {display.error && display.exact && display.approximation && (
                    <line
                      x1={ex}
                      y1={ey}
                      x2={ax}
                      y2={ay}
                      stroke="#ffb93b"
                      strokeWidth="1.4"
                      strokeDasharray="5 4"
                    />
                  )}
                  {display.approximation && (
                    <>
                      <circle
                        cx={ax}
                        cy={ay}
                        r="7"
                        fill="#ffcf35"
                        stroke="#fff5af"
                        strokeWidth="2"
                      />
                      <circle
                        cx={ax}
                        cy={ay}
                        r="8"
                        fill="#ffd044"
                        opacity=".35"
                        filter={`url(#${id}glow)`}
                      />
                    </>
                  )}
                  {display.exact && (
                    <>
                      <circle
                        cx={ex}
                        cy={ey}
                        r="9"
                        fill="#00d7ff"
                        filter={`url(#${id}glow)`}
                      />
                      <circle
                        cx={ex}
                        cy={ey}
                        r="7"
                        fill="#d9ffff"
                        stroke="#16c8ff"
                        strokeWidth="3"
                      />
                    </>
                  )}
                </g>
                {display.exact && (
                  <g fontFamily="Arial" fontSize="15" fill="#00dcff">
                    <path
                      d={`M ${ex + 12} ${ey - 5} l 37 -18 h 8`}
                      stroke="#00baff"
                      fill="none"
                    />
                    <text x="563" y="280">
                      Exact eⁱθ
                    </text>
                    <text x="563" y="301">
                      {pair(exact)}
                    </text>
                  </g>
                )}
                {display.approximation && (
                  <g fontFamily="Arial" fontSize="14" fill="#ffd044">
                    <text x="548" y="338">
                      Taylor partial sum
                    </text>
                    <text x="548" y="357">
                      n = {activeTerms}
                    </text>
                    <text x="548" y="377">
                      {pair(approximation)}
                    </text>
                    {outside && (
                      <>
                        <path
                          d="M 534 75 l 12 -12 m -12 0 h 12 v 12"
                          fill="none"
                          stroke="#ffcf35"
                          strokeWidth="2"
                        />
                        <text x="190" y="81" fontSize="12">
                          Partial sum outside view ↗
                        </text>
                      </>
                    )}
                  </g>
                )}
              </g>
            )}
            {view !== "2D" &&
              plot3D(view === "Both" ? 350 : 45, view === "Both" ? 370 : 520)}
          </svg>
          <div className="tr-legend">
            <span>
              <i className="tr-exact-dot" />
              Exact eⁱθ (on unit circle)
            </span>
            <span>
              <i className="tr-approx-dot" />
              Taylor partial sum (n = {activeTerms})
            </span>
            <span>
              <i className="tr-path-line" />
              Partial sum path
            </span>
            <span>
              <i className="tr-circle-line" />
              Unit circle (|z| = 1)
            </span>
          </div>
          {display.error && (
            <div className="tr-error">
              <strong>Approximation Error</strong>
              <MathExpression
                value={String.raw`|e^{i\theta}-S_{${activeTerms}}(\theta)|=${scientific(error)}`}
              />
              <div
                className="tr-error-meter"
                role="meter"
                aria-label="Approximation accuracy"
                aria-valuemin={0}
                aria-valuemax={8}
                aria-valuenow={Math.max(
                  0,
                  Math.min(8, -Math.log10(Math.max(error, 1e-16))),
                )}
              >
                <span
                  style={{
                    width: `${Math.max(3, Math.min(100, (-Math.log10(Math.max(error, 1e-16)) / 8) * 100))}%`,
                    background:
                      error < 1e-6
                        ? "#00e990"
                        : error < 0.01
                          ? "#97e748"
                          : "#ffb83c",
                  }}
                />
              </div>
              {view !== "3D" && outside && display.approximation ? (
                <button onClick={() => setFit(true)}>Fit approximation</button>
              ) : (
                <small>More terms bring the sum toward eⁱθ.</small>
              )}
              {fit && view !== "3D" && (
                <button onClick={() => setFit(false)}>
                  Return to unit-circle scale
                </button>
              )}
            </div>
          )}
          <footer>
            <button
              className="tr-play"
              aria-label={
                p.playing ? "Pause Taylor animation" : "Play Taylor animation"
              }
              disabled={p.motionOff}
              onClick={p.play}
            >
              {p.playing ? <Pause /> : <Play />}
            </button>
            <div className="tr-timeline">
              <input
                aria-label="Taylor timeline"
                type="range"
                min="0"
                max="360"
                value={angle}
                onChange={(e) => p.setDegrees(Number(e.target.value))}
              />
              <span>
                0° <b>θ = {angle}°</b>
                <small>360°</small>
              </span>
            </div>
          </footer>
        </div>
        <div className="tr-right">
          <section className="tr-panel tr-formula">
            <header>
              <BookOpen />
              <h3>Formula &amp; Interpretation</h3>
              <select
                aria-label="Taylor formula view"
                value={view}
                onChange={(e) => setView(e.target.value as typeof view)}
              >
                <option value="2D">Taylor Series View</option>
                <option value="3D">3D Term View</option>
                <option value="Both">Both Views</option>
              </select>
            </header>
            <div className="tr-equation">
              <MathExpression value={series} />
            </div>
            <p>
              Euler's formula comes from the Taylor expansion of{" "}
              <MathExpression value={String.raw`e^x`} /> with{" "}
              <MathExpression value={String.raw`x=i\theta`} />. Even powers give
              cosine terms and odd powers give sine terms:
            </p>
            <div className="tr-even-odd">
              <div>
                <MathExpression
                  value={String.raw`\cos\theta=1-\frac{\theta^2}{2!}+\frac{\theta^4}{4!}-\cdots`}
                />
                <small>(even powers)</small>
              </div>
              <div>
                <MathExpression
                  value={String.raw`\sin\theta=\theta-\frac{\theta^3}{3!}+\frac{\theta^5}{5!}-\cdots`}
                />
                <small>(odd powers)</small>
              </div>
            </div>
            <p>
              Thus{" "}
              <MathExpression
                value={String.raw`e^{i\theta}=\cos\theta+i\sin\theta`}
              />{" "}
              lies on the unit circle for all real θ.
            </p>
          </section>
          <section className="tr-panel tr-quiz">
            <header>
              <Lightbulb />
              <h3>Concept Check</h3>
              <button
                onClick={() => {
                  setQuestion({
                    angle:
                      question.angle === 336
                        ? 90
                        : question.angle === 90
                          ? 180
                          : 336,
                    terms: question.terms === 10 ? 6 : 10,
                  });
                  setChoice(null);
                  setFeedback("");
                }}
              >
                New Question
              </button>
            </header>
            <p>
              For θ = {question.angle}°, what is the {question.terms}-term
              Taylor approximation?
            </p>
            <div className="tr-quiz-sum">
              <MathExpression
                value={String.raw`S_{${question.terms}}(\theta)=\sum_{k=0}^{${question.terms - 1}}\frac{(i\theta)^k}{k!}\;?`}
              />
            </div>
            <div className="tr-answers">
              {answers.map((value, i) => (
                <button
                  key={i}
                  aria-pressed={choice === i}
                  onClick={() => {
                    setChoice(i);
                    setFeedback("");
                  }}
                >
                  <b>{"ABCD"[i]}</b>
                  <span>{pair(value)}</span>
                </button>
              ))}
            </div>
            <button
              className="er-primary"
              onClick={() => {
                if (choice === null) setFeedback("Choose an answer first.");
                else if (choice === correctChoice) {
                  setFeedback(
                    `Correct. ${question.terms} terms include powers k = 0 through ${question.terms - 1}.`,
                  );
                  markComplexComplete("euler");
                } else
                  setFeedback(
                    "Try again. Add the even powers to the real coordinate and the odd powers to the imaginary coordinate.",
                  );
              }}
            >
              Check Answer
            </button>
            {feedback && <p role="status">{feedback}</p>}
          </section>
        </div>
      </div>
      {stepMode && (
        <section className="tr-step tr-panel">
          <header>
            <Sigma />
            <h3>
              Step {activeTerms} of {n}: add power k = {activeTerms - 1}
            </h3>
            <button
              disabled={activeTerms === 1}
              onClick={() => setStep(Math.max(1, activeTerms - 1))}
            >
              <ChevronLeft />
              Previous
            </button>
            <button
              disabled={activeTerms === n}
              onClick={() => setStep(Math.min(n, activeTerms + 1))}
            >
              Next
              <ChevronRight />
            </button>
          </header>
          <p>
            Term {activeTerms}:{" "}
            <MathExpression
              value={String.raw`\frac{(i\theta)^{${activeTerms - 1}}}{${activeTerms - 1}!}`}
            />{" "}
            = {pair({ re: term.re - previous.re, im: term.im - previous.im })}.
            Running sum: {pair(term)}. Error: {error.toPrecision(5)}.
          </p>
        </section>
      )}
      <div className="er-learning-cards tr-learning">
        {[
          {
            title: "Observe",
            icon: Eye,
            text: "Move θ and n to see the Taylor approximation converge to eⁱθ.",
            action: () => {
              pause();
              p.setTerms(24);
            },
          },
          {
            title: "Understand",
            icon: BookOpen,
            text: "Learn how the series for eⁱθ splits into cosine and sine.",
            action: () => navigate("meaning"),
          },
          {
            title: "Why",
            icon: Brain,
            text: "See why even terms form cos θ and odd terms form sin θ.",
            action: () => navigate("more"),
          },
          {
            title: "Try",
            icon: FlaskConical,
            text: "Experiment with more terms, animations, and step-by-step view.",
            action: () => {
              pause();
              setStepMode(true);
              setStep(1);
            },
          },
          {
            title: "Challenge",
            icon: Trophy,
            text: "Find the smallest n with error below 10⁻⁶ for θ = 336°.",
            action: () => {
              setChallengeOpen(true);
              requestAnimationFrame(() =>
                document.getElementById(`${id}challenge`)?.scrollIntoView({
                  behavior: p.motionOff ? "instant" : "smooth",
                  block: "nearest",
                }),
              );
            },
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
      {challengeOpen && (
        <form
          className="tr-challenge tr-panel"
          id={`${id}challenge`}
          onSubmit={(event) => {
            event.preventDefault();
            const guess = Number(challengeAnswer);
            if (
              !challengeAnswer.trim() ||
              !Number.isInteger(guess) ||
              guess < 1 ||
              guess > 50
            ) {
              setChallengeFeedback(
                "Enter a whole number of terms from 1 to 50.",
              );
              return;
            }
            const err = eulerError(336, guess);
            if (err >= 1e-6)
              setChallengeFeedback(
                `${guess} terms have error ${err.toPrecision(4)}. Increase n.`,
              );
            else if (guess > 1 && eulerError(336, guess - 1) < 1e-6)
              setChallengeFeedback(
                "That meets the tolerance, but a smaller n also works. Try one fewer term.",
              );
            else {
              setChallengeFeedback(
                `Correct: ${guess} terms are the first to reach error below 10⁻⁶.`,
              );
              markComplexComplete("euler");
            }
          }}
        >
          <header>
            <Trophy />
            <h3>Find the smallest Taylor sum</h3>
            <button type="button" onClick={() => setChallengeOpen(false)}>
              Close challenge
            </button>
          </header>
          <p>
            At θ = 336°, find the smallest n for which |eⁱθ − Sₙ(θ)| &lt; 10⁻⁶.
            Count the constant term.
          </p>
          <div>
            <input
              aria-label="Smallest Taylor term count"
              type="number"
              min="1"
              max="50"
              step="1"
              value={challengeAnswer}
              onChange={(e) => {
                setChallengeAnswer(e.target.value);
                setChallengeFeedback("");
              }}
              placeholder="Number of terms"
            />
            <button className="er-primary">Check minimum</button>
          </div>
          {challengeFeedback && <p role="status">{challengeFeedback}</p>}
        </form>
      )}
      {termsOpen && (
        <div ref={tableRef} className="tr-terms tr-panel">
          <header>
            <Sigma />
            <h3>Taylor terms at θ = {angle}°</h3>
            <button onClick={() => setTermsOpen(false)}>Close terms</button>
          </header>
          <p>
            n counts the constant term: Sₙ includes powers k = 0 through n − 1.
            A low-order sum can be far from the unit circle, especially for
            large angles.
          </p>
          <div>
            <table>
              <thead>
                <tr>
                  <th>Power k</th>
                  <th>Term (iθ)ᵏ/k!</th>
                  <th>Partial sum Sₖ₊₁</th>
                  <th>Error</th>
                </tr>
              </thead>
              <tbody>
                {sums.map((sum, i) => {
                  const prev = i ? sums[i - 1] : { re: 0, im: 0 };
                  return (
                    <tr key={i}>
                      <td>{i}</td>
                      <td>
                        {pair({ re: sum.re - prev.re, im: sum.im - prev.im })}
                      </td>
                      <td>{pair(sum)}</td>
                      <td>
                        {Math.hypot(
                          exact.re - sum.re,
                          exact.im - sum.im,
                        ).toPrecision(5)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {notice && (
        <p role="status" className="tr-notice">
          {notice}
        </p>
      )}
    </div>
  );
}
