import { useEffect, useRef, useState, type PointerEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Expand,
  Languages,
  RotateCcw,
  Share2,
  Sparkles,
  TriangleAlert,
  X,
} from "lucide-react";
import type { LessonAdapterProps } from "../types";
import {
  COMPOUND_INEQUALITY_EXAMPLES_123,
  compoundConditionPass123 as conditionPass,
  compoundPointPasses123,
  compoundRelationText123 as relationText,
  solveCompoundInequality123,
  type CompoundBoundary123 as BoundaryName,
  type CompoundMode123 as Mode,
} from "./compoundInequalitiesLesson123Model";
import "./CompoundInequalitiesTargetLesson123.css";
import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";

function CompoundLine({
  lower,
  upper,
  lowerClosed,
  upperClosed,
  mode,
  variant,
  draggable = false,
  onMove,
  onToggle,
}: {
  lower: number;
  upper: number;
  lowerClosed: boolean;
  upperClosed: boolean;
  mode: Mode;
  variant: "lower" | "upper" | "combined";
  draggable?: boolean;
  onMove?: (name: BoundaryName, value: number) => void;
  onToggle?: (name: BoundaryName) => void;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<BoundaryName | null>(null);
  const min = Math.min(0, lower - 2);
  const max = Math.max(8, upper + 2);
  const frozen = useRef({ min, max });
  const width = 390;
  const px = (value: number, range = { min, max }) =>
    18 + ((value - range.min) / (range.max - range.min)) * 354;
  const move = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragging || !ref.current || !onMove) return;
    const box = ref.current.getBoundingClientRect();
    const local = ((event.clientX - box.left) / box.width) * width;
    const range = frozen.current;
    const value = Math.round(
      range.min + ((local - 18) / 354) * (range.max - range.min),
    );
    onMove(dragging, value);
  };
  const markerId = `comp123-${variant}`;
  const drawLowerRay =
    variant === "lower" || (variant === "combined" && mode === "OR");
  const drawUpperRay =
    variant === "upper" || (variant === "combined" && mode === "OR");
  const drawBetween = variant === "combined" && mode === "AND";
  return (
    <svg
      ref={ref}
      className="comp123-line"
      viewBox="0 0 390 105"
      role="img"
      aria-label={`${variant} compound inequality number line`}
      onPointerMove={move}
      onPointerUp={() => setDragging(null)}
      onPointerLeave={() => setDragging(null)}
    >
      <defs>
        <marker
          id={markerId}
          markerWidth="12"
          markerHeight="12"
          refX="10"
          refY="6"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M0 0L12 6L0 12z" />
        </marker>
      </defs>
      <line className="axis" x1="10" x2="380" y1="52" y2="52" />
      {[lower, (lower + upper) / 2, upper].map((tick, index) => (
        <g key={`${index}-${tick}`}>
          <line className="tick" x1={px(tick)} x2={px(tick)} y1="45" y2="61" />
          <text x={px(tick)} y="82">
            {tick}
          </text>
        </g>
      ))}
      {variant === "lower" && (
        <line
          className="shade"
          x1={px(lower)}
          x2="380"
          y1="52"
          y2="52"
          markerEnd={`url(#${markerId})`}
        />
      )}
      {variant === "upper" && (
        <line
          className="shade"
          x1="10"
          x2={px(upper)}
          y1="52"
          y2="52"
          markerStart={`url(#${markerId})`}
        />
      )}
      {drawBetween && lower <= upper && (
        <line className="shade" x1={px(lower)} x2={px(upper)} y1="52" y2="52" />
      )}
      {drawLowerRay && variant === "combined" && (
        <line
          className="shade"
          x1="10"
          x2={px(lower)}
          y1="52"
          y2="52"
          markerStart={`url(#${markerId})`}
        />
      )}
      {drawUpperRay && variant === "combined" && (
        <line
          className="shade"
          x1={px(upper)}
          x2="380"
          y1="52"
          y2="52"
          markerEnd={`url(#${markerId})`}
        />
      )}
      {variant !== "upper" && (
        <circle
          className={lowerClosed ? "endpoint closed" : "endpoint"}
          cx={px(lower)}
          cy="52"
          r="8"
          role={draggable ? "slider" : undefined}
          tabIndex={draggable ? 0 : undefined}
          aria-label={draggable ? "Drag compound lower boundary" : undefined}
          onPointerDown={
            draggable
              ? (event) => {
                  frozen.current = { min, max };
                  event.currentTarget.setPointerCapture(event.pointerId);
                  setDragging("lower");
                }
              : undefined
          }
          onKeyDown={
            draggable
              ? (event) => {
                  if (event.key === "ArrowLeft") onMove?.("lower", lower - 1);
                  if (event.key === "ArrowRight") onMove?.("lower", lower + 1);
                  if (event.key === "Enter" || event.key === " ")
                    onToggle?.("lower");
                }
              : undefined
          }
        />
      )}
      {variant !== "lower" && (
        <circle
          className={upperClosed ? "endpoint closed" : "endpoint"}
          cx={px(upper)}
          cy="52"
          r="8"
          role={draggable ? "slider" : undefined}
          tabIndex={draggable ? 0 : undefined}
          aria-label={draggable ? "Drag compound upper boundary" : undefined}
          onPointerDown={
            draggable
              ? (event) => {
                  frozen.current = { min, max };
                  event.currentTarget.setPointerCapture(event.pointerId);
                  setDragging("upper");
                }
              : undefined
          }
          onKeyDown={
            draggable
              ? (event) => {
                  if (event.key === "ArrowLeft") onMove?.("upper", upper - 1);
                  if (event.key === "ArrowRight") onMove?.("upper", upper + 1);
                  if (event.key === "Enter" || event.key === " ")
                    onToggle?.("upper");
                }
              : undefined
          }
        />
      )}
      {drawBetween && lower > upper && (
        <text className="empty" x="195" y="32">
          No overlap: empty set
        </text>
      )}
    </svg>
  );
}

function CompoundInequalityTabPanel123({
  tab,
  onLoadExample,
}: {
  tab: string;
  onLoadExample: () => void;
}) {
  const content: Record<string, { title: string; body: string }> = {
    Explain: {
      title: "Intersect AND, unite OR",
      body: "AND keeps values satisfying both inequalities; OR keeps values satisfying either inequality.",
    },
    Examples: {
      title: "Calculated union example",
      body: "Load an OR statement and update both rays, endpoint inclusion, interval union, and test points together.",
    },
    Formulas: {
      title: "Set notation from endpoints",
      body: "Parentheses represent excluded endpoints, brackets represent included endpoints, and infinity always uses a parenthesis.",
    },
    "Know more": {
      title: "Empty intersections",
      body: "An AND statement is empty when its lower boundary lies beyond its upper boundary, or when equal boundaries are not both included.",
    },
  };
  const selected = content[tab] ?? content.Explain;
  return (
    <section className="comp123-tab-panel">
      <small>COMPOUND INEQUALITIES</small>
      <h2>{selected.title}</h2>
      <p>{selected.body}</p>
      {tab === "Examples" && (
        <button type="button" onClick={onLoadExample}>
          Load OR union example
        </button>
      )}
    </section>
  );
}

export default function CompoundInequalitiesTargetLesson123({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const [lower, setLower] = useState(2);
  const [upper, setUpper] = useState(6);
  const [lowerClosed, setLowerClosed] = useState(false);
  const [upperClosed, setUpperClosed] = useState(true);
  const [mode, setMode] = useState<Mode>("AND");
  const [activeTab, setActiveTab] = useState("Interaction + visualization");
  const [language, setLanguage] = useState("English (English)");
  const [shared, setShared] = useState(false);
  const [workspace, setWorkspace] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [actions, setActions] = useState(0);
  const problem = { mode, lower, upper, lowerClosed, upperClosed };
  const solution = solveCompoundInequality123(problem);
  const { interval, empty } = solution;
  const tests = solution.testPoints.map(({ value }) => value);
  const hindi = language.startsWith("Hindi");
  const act = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const reset = (notify = true) => {
    const initial = COMPOUND_INEQUALITY_EXAMPLES_123[0];
    setLower(initial.lower);
    setUpper(initial.upper);
    setLowerClosed(initial.lowerClosed);
    setUpperClosed(initial.upperClosed);
    setMode(initial.mode);
    setActiveTab("Interaction + visualization");
    setLanguage("English (English)");
    setShared(false);
    setWorkspace(false);
    setFullscreen(false);
    setActions(0);
    if (notify) onInteraction();
  };
  useEffect(() => reset(false), [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const sync = () =>
      setFullscreen(document.fullscreenElement === pageRef.current);
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);
  const moveBoundary = (name: BoundaryName, value: number) => {
    if (name === "lower") setLower(value);
    else setUpper(value);
    act();
  };
  const toggleBoundary = (name: BoundaryName) => {
    if (name === "lower") setLowerClosed((value) => !value);
    else setUpperClosed((value) => !value);
    act();
  };
  const loadOrExample = () => {
    const example = COMPOUND_INEQUALITY_EXAMPLES_123[1];
    setLower(example.lower);
    setUpper(example.upper);
    setLowerClosed(example.lowerClosed);
    setUpperClosed(example.upperClosed);
    setMode(example.mode);
    act();
  };
  const toggleFullscreen = async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await pageRef.current?.requestFullscreen();
    act();
  };
  const shareLesson = async () => {
    const data = {
      title: "Compound Inequalities",
      text: `Solution set: ${interval}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) await navigator.share(data);
      else await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      act();
    } catch {
      setShared(false);
    }
  };

  return (
    <div
      ref={pageRef}
      className={`comp123-page ${fullscreen ? "fullscreen" : ""}`}
      data-testid="algebra-mockup-0180"
      data-dedicated-lesson="123"
      data-object-model="dedicated-tested-editable-compound-inequality-and-intersection-or-union-two-pointer-keyboard-draggable-boundaries-open-closed-endpoints-linked-number-lines-calculated-interval-notation-evaluated-test-points-empty-set-functional-practice-tabs-language-native-fullscreen-sharing-and-workspace-model"
      data-problem={`${mode},${lower},${upper},${lowerClosed},${upperClosed}`}
      data-interval={interval}
      data-empty={empty}
      data-actions={actions}
    >
      <nav className="comp123-breadcrumb">
        <a href="/">Home</a>
        <span>&gt;</span>
        <a href="/lessons">Lessons</a>
        <span>&gt;</span>
        <a href="/lessons/algebra">Algebra</a>
        <span>&gt;</span>
        <b>123 Compound Inequalities</b>
      </nav>
      <header className="comp123-intro">
        <small>
          <b>ALGEBRA</b>
          <b>EQUATIONS AND INEQUALITIES</b>
        </small>
        <h1>{hindi ? "संयुक्त असमिकाएँ" : "Compound Inequalities"}</h1>
        <p>
          {hindi
            ? "प्रतिच्छेद और संघ को समझें।"
            : "Understand intersection and union."}
        </p>
        <nav>
          <b>♙ Intermediate-Advanced</b>
          <b>ϟ Guided Practice</b>
          <b>▣ Solve / Nsolve / Inequality Graphing</b>
          <b>◷ 6-10 min</b>
        </nav>
        <div>
          <label>
            <Languages />
            <select
              aria-label="Compound inequalities language"
              value={language}
              onChange={(event) => {
                setLanguage(event.target.value);
                act();
              }}
            >
              <option>English (English)</option>
              <option>Hindi (हिन्दी)</option>
            </select>
            <ChevronDown />
          </label>
          <button onClick={() => reset()}>
            <RotateCcw />
            Reset
          </button>
          <button onClick={shareLesson}>
            <Share2 />
            {shared ? "Link ready" : "Share"}
          </button>
          <button
            onClick={() => {
              setWorkspace((value) => !value);
              act();
            }}
          >
            ↗ {workspace ? "Close workspace" : "Workspace"}
          </button>
        </div>
      </header>
      <nav className="comp123-tabs">
        {[
          "Interaction + visualization",
          "Explain",
          "Examples",
          "Formulas",
          "Know more",
        ].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => {
              setActiveTab(tab);
              act();
            }}
          >
            {tab}
          </button>
        ))}
      </nav>
      {activeTab !== "Interaction + visualization" && (
        <CompoundInequalityTabPanel123
          tab={activeTab}
          onLoadExample={loadOrExample}
        />
      )}
      {workspace && (
        <section
          className="comp123-workspace-panel"
          aria-label="Compound inequality workspace"
        >
          <b>Current set operation</b>
          <span>
            {mode === "AND" ? "Intersection" : "Union"}: {interval}
          </span>
        </section>
      )}
      <main className="comp123-lab">
        <header>
          <span>
            <small>INTERACTION + VISUALIZATION</small>
            <h2>
              Build the {mode === "AND" ? "intersection" : "union"} on a number
              line
            </h2>
            <p>
              Find the solution to: x {relationText(mode, "lower", lowerClosed)}{" "}
              {lower} <b>{mode}</b> x {relationText(mode, "upper", upperClosed)}{" "}
              {upper}
            </p>
          </span>
          <b>
            <Check />
            All changes saved
          </b>
          <b>{actions} actions</b>
          <button
            aria-label="Expand compound inequality workspace"
            onClick={toggleFullscreen}
          >
            <Expand />
          </button>
        </header>
        <section className="comp123-top">
          <div className="comp123-lines">
            <article>
              <h3>
                1. x {relationText(mode, "lower", lowerClosed)} {lower}
              </h3>
              <CompoundLine
                lower={lower}
                upper={upper}
                lowerClosed={lowerClosed}
                upperClosed={upperClosed}
                mode={mode}
                variant="lower"
              />
            </article>
            <article>
              <h3>
                2. x {relationText(mode, "upper", upperClosed)} {upper}
              </h3>
              <CompoundLine
                lower={lower}
                upper={upper}
                lowerClosed={lowerClosed}
                upperClosed={upperClosed}
                mode={mode}
                variant="upper"
              />
            </article>
            <article>
              <h3>3. Combined ({mode === "AND" ? "intersection" : "union"})</h3>
              <CompoundLine
                lower={lower}
                upper={upper}
                lowerClosed={lowerClosed}
                upperClosed={upperClosed}
                mode={mode}
                variant="combined"
                draggable
                onMove={moveBoundary}
                onToggle={toggleBoundary}
              />
            </article>
            <footer>
              <Check />
              <span>
                <b>Result</b>
                <strong>
                  {empty
                    ? "No solution"
                    : mode === "AND"
                      ? `${lower} ${relationText(mode, "lower", lowerClosed) === ">" ? "<" : "≤"} x ${relationText(mode, "upper", upperClosed)} ${upper}`
                      : `x ${relationText(mode, "lower", lowerClosed)} ${lower} or x ${relationText(mode, "upper", upperClosed)} ${upper}`}
                </strong>
              </span>
              <b>Interval notation: {interval}</b>
            </footer>
          </div>
          <aside className="comp123-rail">
            <section>
              <h2>Worked steps</h2>
              {[
                mode === "AND"
                  ? `Mark values greater than ${lower}.`
                  : `Mark values less than ${lower}.`,
                mode === "AND"
                  ? `Also keep values up to ${upperClosed ? "and including " : ""}${upper}.`
                  : `Also keep values from ${upperClosed ? "and including " : ""}${upper}.`,
                `${mode} means ${mode === "AND" ? "intersection" : "union"}.`,
                `${lowerClosed ? "Closed" : "Open"} at ${lower} because ${lower} is ${lowerClosed ? "" : "not "}included.`,
                `${upperClosed ? "Closed" : "Open"} at ${upper} because ${upper} is ${upperClosed ? "" : "not "}included.`,
              ].map((step, index) => (
                <p key={index}>
                  <i>{index + 1}</i>
                  {step}
                </p>
              ))}
            </section>
            <section>
              <h2>Test points</h2>
              {tests.map((value, index) => {
                const result = compoundPointPasses123(problem, value);
                const lowerTruth = conditionPass(
                  mode,
                  "lower",
                  value,
                  lower,
                  lowerClosed,
                );
                const upperTruth = conditionPass(
                  mode,
                  "upper",
                  value,
                  upper,
                  upperClosed,
                );
                return (
                  <article
                    key={`${index}-${value}`}
                    className={result ? "pass" : "fail"}
                  >
                    {result ? <Check /> : <X />}
                    <div>
                      <strong>x = {value}</strong>
                      <p>
                        {value} {relationText(mode, "lower", lowerClosed)}{" "}
                        {lower} is {lowerTruth ? "true" : "false"}
                        <br />
                        {value} {relationText(mode, "upper", upperClosed)}{" "}
                        {upper} is {upperTruth ? "true" : "false"}
                      </p>
                    </div>
                    <b>
                      {result
                        ? `Passes ${mode === "AND" ? "both" : "one"}`
                        : "Fails"}
                    </b>
                  </article>
                );
              })}
            </section>
          </aside>
        </section>
        <section className="comp123-lower">
          <article className="warning">
            <TriangleAlert />
            <div>
              <b>Warning</b>
              <h3>AND_OR_MIXED</h3>
              <p>Using union for an AND statement gives too many values.</p>
              <small>Example (incorrect):</small>
              <CompoundLine
                lower={2}
                upper={6}
                lowerClosed={false}
                upperClosed={false}
                mode="OR"
                variant="combined"
              />
              <p>This includes values not between 2 and 6.</p>
              <p>Always use intersection for AND.</p>
            </div>
          </article>
          <article className="practice">
            <header>
              <b>▣ Practice</b>
              <button onClick={loadOrExample}>↗</button>
            </header>
            <p>Graph the solution to:</p>
            <strong>y &lt; −1 OR y ≥ 3</strong>
            <CompoundLine
              lower={-1}
              upper={3}
              lowerClosed={false}
              upperClosed={true}
              mode="OR"
              variant="combined"
            />
            <footer>
              <b>Answer</b>
              <span>(−∞, −1) ∪ [3, ∞)</span>
            </footer>
          </article>
          <article className="trace">
            <h2>♜ Concept trace</h2>
            <b>BOUNDARY</b>
            <p>Endpoints depend on the inequality sign.</p>
            <b>DIRECTION</b>
            <p>Left/right rays show which values are included.</p>
            <b>CHECK</b>
            <p>Test points confirm correctness.</p>
            <strong>
              Compound inequalities use intersection for AND and union for OR.
            </strong>
          </article>
        </section>
        <p className="comp123-note">
          This algebra page uses a lesson-specific symbolic workspace instead of
          a default line graph.
        </p>
        <footer className="comp123-tags">
          <span>☷ primary-control</span>
          <span>▣ expression</span>
          <span>▣ symbolic result</span>
        </footer>
      </main>
      <nav className="comp123-adjacent">
        <a href="/lessons/algebra/122-linear-inequalities">
          <ArrowLeft />
          <span>
            <small>PREVIOUS</small>Linear Inequalities
          </span>
        </a>
        <a href="/lessons/algebra/124-quadratic-inequalities">
          <span>
            <small>NEXT</small>Quadratic Inequalities
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="comp123-footer">
        <b>
          <Sparkles />
          Math Universe
        </b>
        <span>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </span>
        <nav>
          <a href="/sitemap">Sitemap</a>
          <a href="/docs">Docs</a>
          <a href="/about">About</a>
        </nav>
        <hr />
        <small>
          © 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.
        </small>
        <small>www.IndianServers.com info@IndianServers.com</small>
      </footer>
      <LessonTopicStudyBoard lessonId={123} view={activeTab} onInteraction={onInteraction} />

    </div>
  );
}
