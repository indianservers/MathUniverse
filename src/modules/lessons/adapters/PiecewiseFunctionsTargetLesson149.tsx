import { useEffect, useRef, useState, type PointerEvent } from "react";
import {
  Check,
  Eye,
  EyeOff,
  ExternalLink,
  Languages,
  RefreshCcw,
  Share2,
} from "lucide-react";
import type { LessonAdapterProps } from "../types";
import "./PiecewiseFunctionsTargetLesson149.css";

type Branch = "left" | "middle" | "right";
const clamp = (value: number, min: number, max: number, step = 0.1) =>
  Math.max(min, Math.min(max, Math.round(value / step) * step));
const tidy = (value: number, digits = 2) =>
  Math.abs(value) < 0.00001
    ? "0"
    : Number.isInteger(value)
      ? String(value)
      : value.toFixed(digits).replace(/0+$/, "").replace(/\.$/, "");
const branchAt = (x: number, s1: number, s2: number): Branch =>
  x < s1 ? "left" : x < s2 ? "middle" : "right";
const evaluate = (branch: Branch, x: number, shift: number) =>
  branch === "left"
    ? -x - 1 + shift
    : branch === "middle"
      ? x * x + shift
      : 3 + shift;

function PiecewiseGraph({
  x,
  s1,
  s2,
  shift,
  visible,
  onX,
  onS1,
  onS2,
}: {
  x: number;
  s1: number;
  s2: number;
  shift: number;
  visible: Record<Branch, boolean>;
  onX: (v: number) => void;
  onS1: (v: number) => void;
  onS2: (v: number) => void;
}) {
  const svg = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<"x" | "s1" | "s2" | null>(null);
  const px = (v: number) => 330 + v * 67,
    py = (v: number) => 245 - v * 50;
  const active = branchAt(x, s1, s2),
    result = evaluate(active, x, shift);
  const move = (event: PointerEvent<SVGSVGElement>) => {
    const box = svg.current?.getBoundingClientRect();
    if (!box || !dragging) return;
    const value = clamp(
      (((event.clientX - box.left) / box.width) * 690 - 330) / 67,
      -4,
      5,
      0.1,
    );
    if (dragging === "x") onX(value);
    if (dragging === "s1") onS1(Math.min(value, s2 - 0.5));
    if (dragging === "s2") onS2(Math.max(value, s1 + 0.5));
  };
  const middlePath = Array.from({ length: 81 }, (_, i) => {
    const u = s1 + ((s2 - s1) * i) / 80;
    return `${i ? "L" : "M"}${px(u)},${py(u * u + shift)}`;
  }).join(" ");
  return (
    <svg
      ref={svg}
      className="piece149-graph"
      viewBox="0 0 690 480"
      role="img"
      aria-label="Piecewise function graph with draggable probe and switch points"
      onPointerMove={move}
      onPointerUp={() => setDragging(null)}
      onPointerLeave={() => setDragging(null)}
    >
      <defs>
        <pattern
          id="piece149-grid"
          width="67"
          height="50"
          patternUnits="userSpaceOnUse"
        >
          <path d="M67 0H0V50" fill="none" stroke="#dce5ed" />
        </pattern>
        <marker
          id="piece149-axis"
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0 0L6 3L0 6Z" fill="#25334c" />
        </marker>
      </defs>
      <rect width="690" height="480" fill="#fff" />
      <rect x="0" y="25" width={px(s1)} height="400" className="left-zone" />
      <rect
        x={px(s1)}
        y="25"
        width={px(s2) - px(s1)}
        height="400"
        className="middle-zone"
      />
      <rect
        x={px(s2)}
        y="25"
        width={690 - px(s2)}
        height="400"
        className="right-zone"
      />
      <rect width="690" height="450" fill="url(#piece149-grid)" />
      <line
        x1="8"
        x2="680"
        y1={py(0)}
        y2={py(0)}
        className="axis"
        markerEnd="url(#piece149-axis)"
      />
      <line
        x1={px(0)}
        x2={px(0)}
        y1="445"
        y2="14"
        className="axis"
        markerEnd="url(#piece149-axis)"
      />
      {[-3, -2, -1, 0, 1, 2, 3, 4].map((v) => (
        <text key={`x${v}`} x={px(v) - 6} y={py(0) + 22}>
          {v}
        </text>
      ))}
      {[-3, -2, -1, 1, 2, 3, 4].map((v) => (
        <text key={`y${v}`} x={px(0) - 23} y={py(v) + 5}>
          {v}
        </text>
      ))}
      <text x={Math.max(15, px(s1) - 135)} y="48" className="left-label">
        x &lt; {tidy(s1)}
      </text>
      <text x={px(s1) + 30} y="48" className="middle-label">
        {tidy(s1)} ≤ x &lt; {tidy(s2)}
      </text>
      <text x={px(s2) + 35} y="48" className="right-label">
        x ≥ {tidy(s2)}
      </text>
      <line
        x1={px(s1)}
        x2={px(s1)}
        y1="28"
        y2="445"
        className="boundary left-boundary"
      />
      <line
        x1={px(s2)}
        x2={px(s2)}
        y1="28"
        y2="445"
        className="boundary right-boundary"
      />
      {visible.left && (
        <g className="left-branch">
          <line
            x1="0"
            x2={px(s1)}
            y1={py(3 + shift)}
            y2={py(-s1 - 1 + shift)}
          />
          <circle
            cx={px(s1)}
            cy={py(-s1 - 1 + shift)}
            r="7"
            className="closed"
          />
          <text x={Math.max(30, px(s1) - 155)} y={py(-s1 + shift) - 20}>
            f(x) = −x − 1 + {tidy(shift)}
          </text>
        </g>
      )}
      {visible.middle && (
        <g className="middle-branch">
          <path d={middlePath} />
          <circle
            cx={px(s1)}
            cy={py(s1 * s1 + shift)}
            r="7"
            className="closed"
          />
          <circle cx={px(s2)} cy={py(s2 * s2 + shift)} r="7" className="open" />
          <text x={px(s1) + 55} y={py(2 + shift)}>
            f(x) = x² + {tidy(shift)}
          </text>
        </g>
      )}
      {visible.right && (
        <g className="right-branch">
          <line x1={px(s2)} x2="690" y1={py(3 + shift)} y2={py(3 + shift)} />
          <circle cx={px(s2)} cy={py(3 + shift)} r="7" className="closed" />
          <text x={px(s2) + 60} y={py(3 + shift) + 35}>
            f(x) = 3 + {tidy(shift)}
          </text>
        </g>
      )}
      <line x1={px(x)} x2={px(x)} y1="24" y2="445" className="probe-line" />
      <rect
        x={Math.max(4, Math.min(610, px(x) - 40))}
        y="7"
        width="80"
        height="30"
        rx="6"
        className="probe-tag"
      />
      <text
        x={Math.max(44, Math.min(650, px(x)))}
        y="27"
        textAnchor="middle"
        className="probe-text"
      >
        x = {tidy(x)}
      </text>
      <circle
        data-testid="piecewise-probe-handle"
        cx={px(x)}
        cy={py(result)}
        r="13"
        className={`probe-handle ${active}`}
        role="slider"
        tabIndex={0}
        aria-label="Drag piecewise x probe"
        aria-valuemin={-4}
        aria-valuemax={5}
        aria-valuenow={x}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          setDragging("x");
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") onX(clamp(x + 0.1, -4, 5));
          if (e.key === "ArrowLeft") onX(clamp(x - 0.1, -4, 5));
        }}
      />
      <circle
        data-testid="piecewise-left-boundary-handle"
        cx={px(s1)}
        cy={py(0)}
        r="16"
        className="boundary-handle left"
        role="slider"
        tabIndex={0}
        aria-label="Drag first piecewise switch point"
        aria-valuemin={-3}
        aria-valuemax={s2 - 0.5}
        aria-valuenow={s1}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          setDragging("s1");
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight")
            onS1(clamp(Math.min(s1 + 0.1, s2 - 0.5), -3, 3));
          if (e.key === "ArrowLeft") onS1(clamp(s1 - 0.1, -3, 3));
        }}
      />
      <circle
        data-testid="piecewise-right-boundary-handle"
        cx={px(s2)}
        cy={py(0)}
        r="16"
        className="boundary-handle right"
        role="slider"
        tabIndex={0}
        aria-label="Drag second piecewise switch point"
        aria-valuemin={s1 + 0.5}
        aria-valuemax={4}
        aria-valuenow={s2}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          setDragging("s2");
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") onS2(clamp(s2 + 0.1, -2, 4));
          if (e.key === "ArrowLeft")
            onS2(clamp(Math.max(s2 - 0.1, s1 + 0.5), -2, 4));
        }}
      />
    </svg>
  );
}

const branchInfo: Record<Branch, { formula: string; color: string }> = {
  left: { formula: "f(x) = −x − 1", color: "purple" },
  middle: { formula: "f(x) = x²", color: "teal" },
  right: { formula: "f(x) = 3", color: "orange" },
};
export default function PiecewiseFunctionsTargetLesson149({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [x, setX] = useState(1.4),
    [s1, setS1] = useState(0),
    [s2, setS2] = useState(2),
    [shift, setShift] = useState(0),
    [visible, setVisible] = useState<Record<Branch, boolean>>({
      left: true,
      middle: true,
      right: true,
    });
  const [activeTab, setActiveTab] = useState("Interaction + visualization"),
    [language, setLanguage] = useState("English (English)"),
    [workspace, setWorkspace] = useState(false),
    [notice, setNotice] = useState("");
  const update = (setter: (v: number) => void) => (value: number) => {
    setter(value);
    onInteraction();
  };
  const active = branchAt(x, s1, s2),
    result = evaluate(active, x, shift);
  const condition =
    active === "left"
      ? `x < ${tidy(s1)}`
      : active === "middle"
        ? `${tidy(s1)} ≤ x < ${tidy(s2)}`
        : `x ≥ ${tidy(s2)}`;
  const reset = () => {
    setX(1.4);
    setS1(0);
    setS2(2);
    setShift(0);
    setVisible({ left: true, middle: true, right: true });
    setActiveTab("Interaction + visualization");
    setLanguage("English (English)");
    setWorkspace(false);
    setNotice("");
  };
  useEffect(reset, [resetToken]);
  const choose = (branch: Branch) => {
    setX(
      branch === "left" ? s1 - 1 : branch === "middle" ? (s1 + s2) / 2 : s2 + 1,
    );
    onInteraction();
  };
  return (
    <section
      className="piece149-page"
      data-testid="graph-mockup-0206"
      data-dedicated-lesson="149"
      data-object-model="editable-piecewise-probe-switch-points-vertical-shift-and-branch-visibility-pointer-keyboard-draggable-probe-and-boundaries-generated-three-rule-graph-open-closed-endpoint-ownership-condition-first-evaluation-and-boundary-trace"
      data-x={x}
      data-switch-one={s1}
      data-switch-two={s2}
      data-shift={shift}
      data-branch={active}
      data-result={result}
      data-visible={Object.entries(visible)
        .filter(([, v]) => v)
        .map(([k]) => k)
        .join(",")}
      data-tab={activeTab}
      data-workspace={workspace}
    >
      <nav className="piece149-breadcrumb">
        ← Home › Lessons › Graphs And Functions › <b>149 Piecewise Functions</b>
      </nav>
      <header className="piece149-header">
        <small>
          <b>GRAPHS AND FUNCTIONS</b>
          <b>FUNCTIONS</b>
        </small>
        <h1>Piecewise Functions</h1>
        <p>Model multiple rules.</p>
        <div className="piece149-badges">
          <b>Intermediate-Advanced</b>
          <b>Graph Explorer</b>
          <b>Graphing Calculator</b>
          <b>6-10 min</b>
        </div>
        <div className="piece149-actions">
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
        </div>
      </header>
      <nav className="piece149-tabs">
        {[
          "Interaction + visualization",
          "Explain",
          "Examples",
          "Formulas",
          "Know more",
        ].map((tab) => (
          <button
            className={activeTab === tab ? "active" : ""}
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              onInteraction();
            }}
          >
            {tab}
          </button>
        ))}
      </nav>
      <section className="piece149-lab">
        <main>
          <h2>Piecewise Function</h2>
          <span className="piece149-drag-label">
            ⊕ <b>DRAG GRAPH</b>
            <small>Drag the x cursor</small>
          </span>
          <PiecewiseGraph
            x={x}
            s1={s1}
            s2={s2}
            shift={shift}
            visible={visible}
            onX={update(setX)}
            onS1={update(setS1)}
            onS2={update(setS2)}
          />
          <footer>
            {(["left", "middle", "right"] as Branch[]).map((branch) => (
              <span key={branch} className={branchInfo[branch].color}>
                <i />
                {branchInfo[branch].formula}
                <small>
                  {branch === "left"
                    ? `x < ${tidy(s1)}`
                    : branch === "middle"
                      ? `${tidy(s1)} ≤ x < ${tidy(s2)}`
                      : `x ≥ ${tidy(s2)}`}
                </small>
              </span>
            ))}
            <b>● Included ○ Excluded</b>
          </footer>
        </main>
        <aside>
          <section className="piece149-chooser">
            <h2>Choose the rule whose condition is true</h2>
            {(["left", "middle", "right"] as Branch[]).map((branch) => (
              <button
                key={branch}
                className={active === branch ? "active" : ""}
                onClick={() => choose(branch)}
              >
                <i className={branchInfo[branch].color} />
                {branch === "left"
                  ? `x < ${tidy(s1)}`
                  : branch === "middle"
                    ? `${tidy(s1)} ≤ x < ${tidy(s2)}`
                    : `x ≥ ${tidy(s2)}`}
                {active === branch && <Check />}
              </button>
            ))}
          </section>
          <section className="piece149-active">
            <h2>Active rule</h2>
            <div>
              <b>{branchInfo[active].formula}</b>
              <strong>{condition}</strong>
            </div>
          </section>
          <section className="piece149-controls">
            <h2>Controls</h2>
            <label>
              Switch points
              <div>
                x ={" "}
                <input
                  aria-label="First piecewise switch point"
                  type="number"
                  min="-3"
                  max={s2 - 0.5}
                  step=".1"
                  value={s1}
                  onChange={(e) =>
                    update(setS1)(Math.min(Number(e.target.value), s2 - 0.5))
                  }
                />
                x ={" "}
                <input
                  aria-label="Second piecewise switch point"
                  type="number"
                  min={s1 + 0.5}
                  max="4"
                  step=".1"
                  value={s2}
                  onChange={(e) =>
                    update(setS2)(Math.max(Number(e.target.value), s1 + 0.5))
                  }
                />
              </div>
            </label>
            <label>
              Vertical shift
              <input
                aria-label="Piecewise vertical shift"
                type="range"
                min="-5"
                max="5"
                step=".25"
                value={shift}
                onChange={(e) => update(setShift)(Number(e.target.value))}
              />
              <output>{tidy(shift)}</output>
            </label>
            <p>Show / hide branches</p>
            {(["left", "middle", "right"] as Branch[]).map((branch) => (
              <button
                key={branch}
                onClick={() => {
                  setVisible((v) => ({ ...v, [branch]: !v[branch] }));
                  onInteraction();
                }}
              >
                <i className={branchInfo[branch].color} />
                {branchInfo[branch].formula}
                {visible[branch] ? <Eye /> : <EyeOff />}
              </button>
            ))}
          </section>
        </aside>
      </section>
      <section className="piece149-insights">
        <article>
          <i>⚖</i>
          <div>
            <h2>Boundary decides</h2>
            <p>
              At x = {tidy(s1)}, the middle rule applies (x ≥ {tidy(s1)}).
            </p>
            <p>
              At x = {tidy(s2)}, the right rule applies (x ≥ {tidy(s2)}).
            </p>
          </div>
        </article>
        <article>
          <i>✓</i>
          <div>
            <h2>Condition first</h2>
            <p>Check which condition is true for the given x.</p>
            <p>Then use the formula of that rule.</p>
          </div>
        </article>
        <article>
          <i>fx</i>
          <div>
            <h2>Then use the formula</h2>
            <p>
              For x = {tidy(x)}, {condition} is true.
            </p>
            <p>
              So, f({tidy(x)}) = {tidy(result)}.
            </p>
          </div>
        </article>
      </section>
      <nav className="piece149-adjacent">
        <span>
          ← <small>PREVIOUS</small>
          <b>Sign Function</b>
        </span>
        <span>
          <small>NEXT</small>
          <b>Composite Functions</b> →
        </span>
      </nav>
      {workspace && (
        <button
          className="piece149-workspace"
          onClick={() => setWorkspace(false)}
        >
          Piecewise workspace active · close
        </button>
      )}
      {notice && (
        <button className="piece149-notice" onClick={() => setNotice("")}>
          {notice}
        </button>
      )}
    </section>
  );
}
