import {
  Expand,
  Languages,
  Minus,
  Play,
  Plus,
  RotateCcw,
  Share2,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import type { LessonAdapterProps } from "../../types";
import {
  DEFAULT_DYNAMIC_55,
  animatedParameters55,
  dynamicCurve55,
  dynamicGraphPoint55,
  dynamicPeriod55,
  dynamicRange55,
  scaledBounds55,
  type DynamicParameters55,
} from "./dynamicParametersLesson55Model";
import "./DynamicParametersTargetLesson55.css";

type Tab55 =
  | "Interaction + visualization"
  | "Explain"
  | "Examples"
  | "Formulas"
  | "Know more";

const tabs55: Tab55[] = [
  "Interaction + visualization",
  "Explain",
  "Examples",
  "Formulas",
  "Know more",
];

function ParameterControl55({
  id,
  title,
  value,
  min,
  max,
  step,
  color,
  onChange,
}: {
  id: "a" | "b" | "c";
  title: string;
  value: number;
  min: number;
  max: number;
  step: number;
  color: string;
  onChange: (value: number) => void;
}) {
  return (
    <section
      className="dp55-parameter"
      style={{ "--parameter-color": color } as CSSProperties}
    >
      <h3>
        <i>{id}</i> ={" "}
        {value
          .toFixed(id === "c" ? 1 : 2)
          .replace(/0$/, "")
          .replace(/\.$/, "")}
      </h3>
      <label>
        {title}
        <span>
          <input
            aria-label={`${title} parameter`}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(event) => onChange(Number(event.target.value))}
          />
          <output>
            {value
              .toFixed(id === "c" ? 1 : 2)
              .replace(/0$/, "")
              .replace(/\.$/, "")}
          </output>
        </span>
      </label>
      <small>
        {id === "a"
          ? "Controls the height of the wave."
          : id === "b"
            ? "Controls how often the wave repeats."
            : "Moves the midline up or down."}
      </small>
    </section>
  );
}

export default function DynamicParametersTargetLesson55({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [parameters, setParameters] = useState(DEFAULT_DYNAMIC_55);
  const [previous, setPrevious] = useState<DynamicParameters55[]>([]);
  const [activeTab, setActiveTab] = useState<Tab55>(
    "Interaction + visualization",
  );
  const [language, setLanguage] = useState("en");
  const [scale, setScale] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [actions, setActions] = useState(0);
  const bounds = scaledBounds55(scale);
  const width = 660;
  const height = 500;
  const origin = dynamicGraphPoint55(0, 0, bounds, width, height);
  const midline = dynamicGraphPoint55(0, parameters.c, bounds, width, height).y;
  const range = dynamicRange55(parameters);

  const reset = () => {
    setParameters(DEFAULT_DYNAMIC_55);
    setPrevious([]);
    setActiveTab("Interaction + visualization");
    setLanguage("en");
    setScale(1);
    setExpanded(false);
    setAnimating(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);

  useEffect(() => {
    if (!animating) return;
    let step = 0;
    const timer = window.setInterval(() => {
      setParameters(animatedParameters55(step));
      step += 2;
    }, 60);
    return () => window.clearInterval(timer);
  }, [animating]);

  const act = (run: () => void) => {
    run();
    setActions((value) => value + 1);
    onInteraction();
  };
  const update = (id: keyof DynamicParameters55, value: number) =>
    act(() => {
      setPrevious((items) => [parameters, ...items].slice(0, 4));
      setParameters((current) => ({ ...current, [id]: value }));
      setAnimating(false);
    });

  return (
    <section
      className={`dp55-page${expanded ? " expanded" : ""}`}
      data-testid="2d-graphing-mockup-0147"
      data-dedicated-lesson="55"
      data-object-model="editable-sine-family-amplitude-frequency-and-midline-sliders-generated-current-and-history-curves-live-period-and-range-animated-parameter-sweep-functional-tabs-zoom-fullscreen-language-reset-share-workspace-and-navigation"
      data-a={parameters.a.toFixed(2)}
      data-b={parameters.b.toFixed(2)}
      data-c={parameters.c.toFixed(2)}
      data-period={dynamicPeriod55(parameters).toFixed(6)}
      data-actions={actions}
    >
      <nav className="dp55-breadcrumb">
        ← &nbsp; Home &gt; Lessons &gt; Graphs And Functions &gt;{" "}
        <b>55 Dynamic Parameters</b>
      </nav>
      <header className="dp55-hero">
        <h1>Dynamic Parameters</h1>
        <p>Study function families.</p>
        <nav>
          <b>Foundational-Advanced</b>
          <b>⚡ Graph Explorer</b>
          <b>▣ Graphing Calculator</b>
          <b>◷ 6-10 min</b>
        </nav>
        <section>
          <label>
            <Languages />
            <select
              aria-label="Dynamic parameters language"
              value={language}
              onChange={(event) => act(() => setLanguage(event.target.value))}
            >
              <option value="en">English (English)</option>
              <option value="hi">Hindi</option>
            </select>
          </label>
          <button onClick={() => act(reset)}>
            <RotateCcw />
            Reset
          </button>
          <button
            onClick={() =>
              act(() =>
                navigator.clipboard?.writeText(
                  `y=${parameters.a}sin(${parameters.b}x)+${parameters.c}`,
                ),
              )
            }
          >
            <Share2 />
            Share
          </button>
          <a href="#dp55-workspace">↗ Workspace</a>
        </section>
      </header>

      <nav className="dp55-tabs">
        {tabs55.map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => act(() => setActiveTab(tab))}
          >
            {tab}
          </button>
        ))}
      </nav>

      {activeTab === "Interaction + visualization" ? (
        <>
          <section className="dp55-workspace" id="dp55-workspace">
            <article className="dp55-graph-card">
              <header>
                <h2>Function family explorer</h2>
                <p>See how changing parameters affects the sine family.</p>
              </header>
              <svg
                viewBox={`0 0 ${width} ${height}`}
                role="img"
                aria-label="Sine family graph controlled by live parameters"
              >
                <defs>
                  <pattern
                    id="dp55-grid"
                    width="48"
                    height="48"
                    patternUnits="userSpaceOnUse"
                  >
                    <path d="M48 0H0V48" fill="none" stroke="#e3eaf1" />
                  </pattern>
                </defs>
                <rect width={width} height={height} fill="url(#dp55-grid)" />
                <line
                  className="axis"
                  x1="0"
                  x2={width}
                  y1={origin.y}
                  y2={origin.y}
                />
                <line
                  className="axis"
                  x1={origin.x}
                  x2={origin.x}
                  y1="0"
                  y2={height}
                />
                {previous.map((item, index) => (
                  <polyline
                    key={index}
                    className="previous-curve"
                    points={dynamicCurve55(item, bounds, width, height)}
                  />
                ))}
                <line
                  className="midline"
                  x1="0"
                  x2={width}
                  y1={midline}
                  y2={midline}
                />
                <polyline
                  className="current-curve"
                  points={dynamicCurve55(parameters, bounds, width, height)}
                />
                <g className="amplitude-guide">
                  <line
                    x1="42"
                    x2="42"
                    y1={
                      dynamicGraphPoint55(0, range.max, bounds, width, height).y
                    }
                    y2={midline}
                  />
                  <text
                    x="8"
                    y={
                      (dynamicGraphPoint55(0, range.max, bounds, width, height)
                        .y +
                        midline) /
                      2
                    }
                  >
                    a = {parameters.a.toFixed(1)}
                  </text>
                </g>
                <g className="period-guide">
                  <line
                    x1={origin.x}
                    x2={
                      dynamicGraphPoint55(
                        dynamicPeriod55(parameters),
                        0,
                        bounds,
                        width,
                        height,
                      ).x
                    }
                    y1={height - 35}
                    y2={height - 35}
                  />
                  <text
                    x={
                      (origin.x +
                        dynamicGraphPoint55(
                          dynamicPeriod55(parameters),
                          0,
                          bounds,
                          width,
                          height,
                        ).x) /
                      2
                    }
                    y={height - 12}
                  >
                    Period = 2π / {parameters.b.toFixed(1)}
                  </text>
                </g>
                <text
                  className="midline-label"
                  x={width - 118}
                  y={midline - 10}
                >
                  Midline y = {parameters.c.toFixed(1)}
                </text>
              </svg>
              <footer>
                <span>
                  <i />
                  Current
                </span>
                <span className="previous">
                  <i />
                  Previous values
                </span>
                <button
                  aria-label="Zoom out"
                  onClick={() =>
                    act(() => setScale((value) => Math.min(1.6, value + 0.15)))
                  }
                >
                  <Minus />
                </button>
                <button
                  aria-label="Zoom in"
                  onClick={() =>
                    act(() => setScale((value) => Math.max(0.65, value - 0.15)))
                  }
                >
                  <Plus />
                </button>
                <button
                  aria-label="Toggle full graph"
                  onClick={() => act(() => setExpanded((value) => !value))}
                >
                  <Expand />
                </button>
              </footer>
            </article>

            <aside className="dp55-controls">
              <h2>
                y = <i>a</i> sin(<em>b</em>x) + <strong>c</strong>
              </h2>
              <ParameterControl55
                id="a"
                title="Amplitude"
                value={parameters.a}
                min={0.1}
                max={5}
                step={0.1}
                color="#f56b00"
                onChange={(value) => update("a", value)}
              />
              <ParameterControl55
                id="b"
                title="Frequency"
                value={parameters.b}
                min={0.2}
                max={4}
                step={0.1}
                color="#7c45df"
                onChange={(value) => update("b", value)}
              />
              <ParameterControl55
                id="c"
                title="Vertical shift"
                value={parameters.c}
                min={-3}
                max={3}
                step={0.1}
                color="#0899c2"
                onChange={(value) => update("c", value)}
              />
              <button
                className={animating ? "animating" : ""}
                onClick={() => act(() => setAnimating((value) => !value))}
              >
                <Play />
                {animating
                  ? "Pause parameter sweep"
                  : "Animate parameter sweep"}
              </button>
            </aside>
          </section>

          <section className="dp55-understand">
            <h2>Understand the parameters</h2>
            <div>
              <article>
                <b>a</b>
                <p>Amplitude: vertical stretch from the midline.</p>
              </article>
              <article>
                <b>b</b>
                <p>Frequency: controls the period 2π / b.</p>
              </article>
              <article>
                <b>c</b>
                <p>Vertical shift: moves the midline to y = c.</p>
              </article>
            </div>
          </section>
        </>
      ) : (
        <section className="dp55-tab-panel">
          <h2>{activeTab}</h2>
          <p>
            {activeTab === "Explain"
              ? "Each parameter changes one measurable feature of the sine family."
              : activeTab === "Examples"
                ? "Compare waves by changing one parameter at a time."
                : activeTab === "Formulas"
                  ? `Amplitude = |${parameters.a}|, period = 2π / |${parameters.b}|, midline = ${parameters.c}.`
                  : "Dynamic parameters connect equations, simulations, and fitted models."}
          </p>
        </section>
      )}

      <nav className="dp55-adjacent">
        <a href="/lessons/graphs-and-functions/54-graph-inspector">
          ←{" "}
          <span>
            PREVIOUS<b>Graph Inspector</b>
          </span>
        </a>
        <a href="/lessons/graphs-and-functions/56-export-graph">
          <span>
            NEXT<b>Export Graph</b>
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}
