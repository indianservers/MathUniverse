import { useEffect, useRef, useState, type PointerEvent } from "react";
import { ExternalLink, Languages, RefreshCcw, Share2 } from "lucide-react";
import type { LessonAdapterProps } from "../types";
import "./SignFunctionTargetLesson148.css";

const clamp = (value: number, min: number, max: number, step: number) =>
  Math.max(min, Math.min(max, Math.round(value / step) * step));
const tidy = (value: number) =>
  Math.abs(value) < 0.00001
    ? "0"
    : Number.isInteger(value)
      ? String(value)
      : value.toFixed(1).replace(/\.0$/, "");
const signAt = (x: number, threshold: number) =>
  Math.abs(x - threshold) < 0.00001 ? 0 : x < threshold ? -1 : 1;

function SignGraph({
  x,
  threshold,
  scale,
  onX,
  onThreshold,
}: {
  x: number;
  threshold: number;
  scale: number;
  onX: (value: number) => void;
  onThreshold: (value: number) => void;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<"x" | "threshold" | null>(null);
  const px = (value: number) => 340 + (value / scale) * 295,
    py = (value: number) => 205 - value * 80;
  const move = (event: PointerEvent<SVGSVGElement>) => {
    const box = svg.current?.getBoundingClientRect();
    if (!box || !dragging) return;
    const value = clamp(
      ((((event.clientX - box.left) / box.width) * 680 - 340) / 295) * scale,
      -scale,
      scale,
      0.1,
    );
    if (dragging === "x") onX(value);
    else onThreshold(clamp(value, -2, 2, 0.1));
  };
  const output = signAt(x, threshold);
  return (
    <svg
      ref={svg}
      className="sign148-graph"
      viewBox="0 0 680 430"
      role="img"
      aria-label="Sign function with draggable input cursor and zero threshold"
      onPointerMove={move}
      onPointerUp={() => setDragging(null)}
      onPointerLeave={() => setDragging(null)}
    >
      <defs>
        <pattern
          id="sign148-grid"
          width="98"
          height="80"
          patternUnits="userSpaceOnUse"
        >
          <path d="M98 0H0V80" fill="none" stroke="#dce4ec" />
        </pattern>
        <marker
          id="sign148-teal-arrow"
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0 0L6 3L0 6Z" fill="#078b83" />
        </marker>
        <marker
          id="sign148-red-arrow"
          markerWidth="8"
          markerHeight="8"
          refX="2"
          refY="3"
          orient="auto"
        >
          <path d="M6 0L0 3L6 6Z" fill="#f12f52" />
        </marker>
        <marker
          id="sign148-axis-arrow"
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0 0L6 3L0 6Z" fill="#53647b" />
        </marker>
      </defs>
      <rect width="680" height="430" fill="#fff" />
      <rect x="12" y="22" width="656" height="332" fill="url(#sign148-grid)" />
      <line
        x1="10"
        x2="670"
        y1={py(0)}
        y2={py(0)}
        className="axis"
        markerEnd="url(#sign148-axis-arrow)"
      />
      <line
        x1={px(0)}
        x2={px(0)}
        y1="370"
        y2="12"
        className="axis"
        markerEnd="url(#sign148-axis-arrow)"
      />
      {[-6, -4, -2, 0, 2, 4, 6]
        .filter((v) => Math.abs(v) <= scale)
        .map((v) => (
          <text key={v} x={px(v) - 7} y={py(0) + 23}>
            {v}
          </text>
        ))}
      {[-2, -1, 1, 2].map((v) => (
        <text key={v} x={px(0) - 25} y={py(v) + 5}>
          {v}
        </text>
      ))}
      <line
        x1="18"
        x2={px(threshold) - 10}
        y1={py(-1)}
        y2={py(-1)}
        className="negative-ray"
        markerStart="url(#sign148-red-arrow)"
      />
      <circle cx={px(threshold)} cy={py(-1)} r="7" className="negative-open" />
      <line
        x1={px(threshold) + 10}
        x2="662"
        y1={py(1)}
        y2={py(1)}
        className="positive-ray"
        markerEnd="url(#sign148-teal-arrow)"
      />
      <circle cx={px(threshold)} cy={py(1)} r="7" className="positive-open" />
      <circle cx={px(threshold)} cy={py(0)} r="8" className="zero-point" />
      <line x1={px(x)} x2={px(x)} y1="31" y2="368" className="cursor-line" />
      <rect
        x={Math.max(12, Math.min(583, px(x) - 38))}
        y="8"
        width="76"
        height="29"
        rx="7"
        className="cursor-tag"
      />
      <text
        x={Math.max(50, Math.min(621, px(x)))}
        y="27"
        textAnchor="middle"
        className="cursor-text"
      >
        x = {tidy(x)}
      </text>
      <circle
        data-testid="sign-input-handle"
        cx={px(x)}
        cy={py(0)}
        r="13"
        className={`input-handle out-${output}`}
        role="slider"
        tabIndex={0}
        aria-label="Drag sign input cursor"
        aria-valuemin={-scale}
        aria-valuemax={scale}
        aria-valuenow={x}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragging("x");
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight")
            onX(clamp(x + 0.1, -scale, scale, 0.1));
          if (event.key === "ArrowLeft")
            onX(clamp(x - 0.1, -scale, scale, 0.1));
        }}
      />
      <circle
        data-testid="sign-threshold-handle"
        cx={px(threshold)}
        cy={py(0)}
        r="16"
        className="threshold-handle"
        role="slider"
        tabIndex={0}
        aria-label="Drag sign zero threshold"
        aria-valuemin={-2}
        aria-valuemax={2}
        aria-valuenow={threshold}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragging("threshold");
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight")
            onThreshold(clamp(threshold + 0.1, -2, 2, 0.1));
          if (event.key === "ArrowLeft")
            onThreshold(clamp(threshold - 0.1, -2, 2, 0.1));
        }}
      />
    </svg>
  );
}

export default function SignFunctionTargetLesson148({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [x, setX] = useState(-2.4),
    [threshold, setThreshold] = useState(0),
    [scale, setScale] = useState(10),
    [language, setLanguage] = useState("English (English)"),
    [workspace, setWorkspace] = useState(false),
    [notice, setNotice] = useState("");
  const update = (setter: (value: number) => void) => (value: number) => {
    setter(value);
    onInteraction();
  };
  const reset = () => {
    setX(-2.4);
    setThreshold(0);
    setScale(10);
    setLanguage("English (English)");
    setWorkspace(false);
    setNotice("");
  };
  useEffect(reset, [resetToken]);
  const output = signAt(x, threshold),
    word = output < 0 ? "negative" : output > 0 ? "positive" : "zero",
    color = output < 0 ? "negative" : output > 0 ? "positive" : "zero";
  const cases = [
    {
      x: threshold - 2.4,
      label: "x < threshold",
      out: -1,
      text: "Negative inputs output -1",
    },
    {
      x: threshold,
      label: "x = threshold",
      out: 0,
      text: "Zero input outputs 0",
    },
    {
      x: threshold + 3.1,
      label: "x > threshold",
      out: 1,
      text: "Positive inputs output 1",
    },
  ];
  return (
    <section
      className="sign148-page"
      data-testid="graph-mockup-0205"
      data-dedicated-lesson="148"
      data-object-model="editable-sign-input-threshold-and-domain-scale-pointer-keyboard-draggable-input-and-threshold-generated-negative-zero-positive-rays-live-classifier-selectable-cases-piecewise-definition-magnitude-ignored-direction-model"
      data-x={x}
      data-threshold={threshold}
      data-scale={scale}
      data-result={output}
      data-region={word}
      data-workspace={workspace}
    >
      <nav className="sign148-breadcrumb">
        ← Home › Lessons › Graphs And Functions ›<b>148 Sign Function</b>
      </nav>
      <header className="sign148-header">
        <div>
          <small>
            <b>GRAPHS AND FUNCTIONS</b>
            <b>INTERACTION</b>
          </small>
          <h1>Sign Function</h1>
          <p>Classify positive, zero and negative inputs.</p>
        </div>
        <aside>
          <button
            onClick={() => {
              setLanguage((v) =>
                v.startsWith("English")
                  ? "हिन्दी (Hindi)"
                  : "English (English)",
              );
              onInteraction();
            }}
          >
            <Languages />
            {language}⌄
          </button>
          <button onClick={reset}>
            <RefreshCcw />
            Reset
          </button>
          <button
            onClick={() => {
              void navigator.clipboard?.writeText(window.location.href);
              setNotice("Lesson link copied");
              onInteraction();
            }}
          >
            <Share2 />
            Share
          </button>
          <button
            onClick={() => {
              setWorkspace((v) => !v);
              onInteraction();
            }}
          >
            <ExternalLink />
            Workspace
          </button>
        </aside>
        <footer>
          <button onClick={() => update(setX)(threshold - 2.4)}>
            sgn({tidy(threshold - 2.4)}) = −1
          </button>
          <button onClick={() => update(setX)(threshold)}>
            sgn({tidy(threshold)}) = 0
          </button>
          <button onClick={() => update(setX)(threshold + 3.1)}>
            sgn({tidy(threshold + 3.1)}) = 1
          </button>
        </footer>
      </header>
      <div className="sign148-layout">
        <main>
          <article className="sign148-plot">
            <h2>sgn(x)</h2>
            <SignGraph
              x={x}
              threshold={threshold}
              scale={scale}
              onX={update(setX)}
              onThreshold={update(setThreshold)}
            />
            <div className="sign148-cases">
              {cases.map((item) => (
                <button
                  key={item.out}
                  className={output === item.out ? "active" : ""}
                  onClick={() => update(setX)(item.x)}
                >
                  <i />
                  <b>{item.label}</b>
                  <strong>→ {item.out}</strong>
                  <span>{item.text}</span>
                </button>
              ))}
            </div>
            <footer>
              <div>
                <b>Drag the x cursor</b>
                <span>Move along the x-axis to see the sign change.</span>
              </div>
              <output>
                Current input <b>x = {tidy(x)}</b>
              </output>
              <output className={color}>
                Output <b>sgn(x) = {output}</b>
              </output>
            </footer>
          </article>
          <div className="sign148-insights">
            <article>
              <i>|x|</i>
              <div>
                <b>Magnitude ignored</b>
                <p>Whether x is −0.1 or −100, the output is always −1.</p>
              </div>
            </article>
            <article>
              <i>÷</i>
              <div>
                <b>Only direction/sign matters</b>
                <p>Negative → −1, Zero → 0, Positive → 1.</p>
              </div>
            </article>
          </div>
        </main>
        <aside className="sign148-rail">
          <section>
            <h2>Graph Controls</h2>
            <label>
              Input scale
              <input
                aria-label="Sign graph input scale"
                type="range"
                min="6"
                max="14"
                step="1"
                value={scale}
                onChange={(e) => update(setScale)(Number(e.target.value))}
              />
              <output>{scale}</output>
              <small>
                <span>−{scale}</span>
                <span>{scale}</span>
              </small>
            </label>
            <label>
              Threshold shift
              <input
                aria-label="Sign threshold shift"
                type="range"
                min="-2"
                max="2"
                step=".1"
                value={threshold}
                onChange={(e) => update(setThreshold)(Number(e.target.value))}
              />
              <output>{tidy(threshold)}</output>
              <small>
                <span>−2</span>
                <span>2</span>
              </small>
            </label>
            <p>Shift the zero boundary. The sign changes at x = threshold.</p>
          </section>
          <section className="sign148-classifier">
            <h2>Live Sign Classifier</h2>
            <div>
              <label>
                Input (x)<b>{tidy(x)}</b>
              </label>
              <label>
                Sign (sgn(x))<strong className={color}>{output}</strong>
              </label>
              <p>
                The input is <b className={color}>{word}</b>.<br />
                Output is <b className={color}>{output}</b>.
              </p>
            </div>
          </section>
          <section className="sign148-definition">
            <h2>What is sgn(x)?</h2>
            <p>
              The sign function returns only the direction of x, not its
              magnitude.
            </p>
            <strong>
              sgn(x) = {"{"}{" "}
              <span>
                −1, x &lt; {tidy(threshold)}
                <br />
                0, x = {tidy(threshold)}
                <br />
                1, x &gt; {tidy(threshold)}
              </span>
            </strong>
          </section>
        </aside>
      </div>
      {workspace && (
        <button
          className="sign148-workspace"
          onClick={() => setWorkspace(false)}
        >
          Interactive sign workspace active · close
        </button>
      )}
      {notice && (
        <button className="sign148-notice" onClick={() => setNotice("")}>
          {notice}
        </button>
      )}
    </section>
  );
}
