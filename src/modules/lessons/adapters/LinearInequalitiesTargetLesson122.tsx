import { useEffect, useRef, useState, type PointerEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  CircleAlert,
  Expand,
  Languages,
  Lightbulb,
  RotateCcw,
  Share2,
  Sparkles,
  TriangleAlert,
  X,
} from "lucide-react";
import type { LessonAdapterProps } from "../types";
import {
  LINEAR_INEQUALITY_EXAMPLES_122,
  evaluateLinearInequality122 as evaluate,
  linearRelationSymbol122 as symbol,
  rightSideForBoundary122,
  solveLinearInequality122,
  type LinearInequalityProblem122 as Problem,
  type LinearInequalityRelation122 as Relation,
} from "./linearInequalitiesLesson122Model";
import "./LinearInequalitiesTargetLesson122.css";
import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";
const formatTerm = (value: number) =>
  value >= 0 ? ` + ${value}` : ` − ${Math.abs(value)}`;

function SolutionLine({
  boundary,
  relation,
  draggable = false,
  onBoundary,
  ariaLabel,
}: {
  boundary: number;
  relation: Relation;
  draggable?: boolean;
  onBoundary?: (value: number) => void;
  ariaLabel: string;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState(false);
  const min = Math.min(-4, Math.floor(boundary) - 4);
  const max = Math.max(10, Math.ceil(boundary) + 4);
  const width = 430;
  const px = (value: number) => 20 + ((value - min) / (max - min)) * 390;
  const right = relation.startsWith(">");
  const closed = relation.includes("=");
  const move = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragging || !ref.current || !onBoundary) return;
    const box = ref.current.getBoundingClientRect();
    const local = ((event.clientX - box.left) / box.width) * width;
    const value =
      Math.round((min + ((local - 20) / 390) * (max - min)) * 2) / 2;
    onBoundary(value);
  };
  return (
    <svg
      ref={ref}
      className="lin122-line"
      viewBox="0 0 430 150"
      role="img"
      aria-label={ariaLabel}
      onPointerMove={move}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
    >
      <defs>
        <marker
          id={`lin122-arrow-${ariaLabel.replace(/\W/g, "")}`}
          markerWidth="14"
          markerHeight="14"
          refX="11"
          refY="7"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M0 0L14 7L0 14z" />
        </marker>
      </defs>
      <line className="axis" x1="14" x2="416" y1="64" y2="64" />
      {Array.from({ length: max - min + 1 }, (_, index) => min + index).map(
        (tick) => (
          <g key={tick}>
            <line
              className="tick"
              x1={px(tick)}
              x2={px(tick)}
              y1="56"
              y2="72"
            />
            <text x={px(tick)} y="92">
              {tick}
            </text>
          </g>
        ),
      )}
      <line
        className="shade"
        x1={right ? px(boundary) : 15}
        x2={right ? 415 : px(boundary)}
        y1="64"
        y2="64"
        markerEnd={
          right
            ? `url(#lin122-arrow-${ariaLabel.replace(/\W/g, "")})`
            : undefined
        }
        markerStart={
          !right
            ? `url(#lin122-arrow-${ariaLabel.replace(/\W/g, "")})`
            : undefined
        }
      />
      <circle
        className={closed ? "boundary closed" : "boundary"}
        cx={px(boundary)}
        cy="64"
        r="10"
        role={draggable ? "slider" : undefined}
        tabIndex={draggable ? 0 : undefined}
        aria-label={draggable ? "Drag linear inequality boundary" : undefined}
        onPointerDown={
          draggable
            ? (event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                setDragging(true);
              }
            : undefined
        }
        onKeyDown={
          draggable
            ? (event) => {
                if (event.key === "ArrowLeft") onBoundary?.(boundary - 0.5);
                if (event.key === "ArrowRight") onBoundary?.(boundary + 0.5);
              }
            : undefined
        }
      />
      <rect x="20" y="111" width="390" height="31" rx="6" />
      <text className="caption" x="215" y="130">
        {closed ? "Closed" : "Open"} circle at {boundary}. Shade to the{" "}
        {right ? "right" : "left"} because x {symbol(relation)} {boundary}.
      </text>
    </svg>
  );
}

function LinearInequalityTabPanel122({
  tab,
  onLoadExample,
}: {
  tab: string;
  onLoadExample: () => void;
}) {
  const content: Record<string, { title: string; body: string }> = {
    Explain: {
      title: "Solve, orient, test",
      body: "Isolate x, reverse the comparator only when dividing by a negative coefficient, then verify the shaded side with a test point.",
    },
    Examples: {
      title: "Sign-flip example",
      body: "Load a negative-coefficient inequality and recalculate its reversed comparator, boundary, direction, interval, and test points.",
    },
    Formulas: {
      title: "Interval endpoints",
      body: "Strict inequalities use open endpoints; inequalities that include equality use closed endpoints.",
    },
    "Know more": {
      title: "Why the sign reverses",
      body: "Multiplication by a negative number reverses order on the number line, so division by a negative must reverse the inequality symbol.",
    },
  };
  const selected = content[tab] ?? content.Explain;
  return (
    <section className="lin122-tab-panel">
      <small>LINEAR INEQUALITIES</small>
      <h2>{selected.title}</h2>
      <p>{selected.body}</p>
      {tab === "Examples" && (
        <button type="button" onClick={onLoadExample}>
          Load negative-coefficient example
        </button>
      )}
    </section>
  );
}

export default function LinearInequalitiesTargetLesson122({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const [problem, setProblem] = useState<Problem>({
    a: 2,
    b: 3,
    relation: ">",
    c: 9,
  });
  const [activeTab, setActiveTab] = useState("Interaction + visualization");
  const [language, setLanguage] = useState("English (English)");
  const [shared, setShared] = useState(false);
  const [workspace, setWorkspace] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [actions, setActions] = useState(0);
  const solution = solveLinearInequality122(problem);
  const {
    boundary,
    solvedRelation,
    flipped,
    right,
    closed,
    passPoint,
    interval,
  } = solution;
  const hindi = language.startsWith("Hindi");
  const act = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const reset = (notify = true) => {
    setProblem(LINEAR_INEQUALITY_EXAMPLES_122[0]);
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
  const update = (next: Partial<Problem>) => {
    setProblem((current) => ({ ...current, ...next }));
    act();
  };
  const moveBoundary = (value: number) =>
    update({ c: rightSideForBoundary122(problem, value) });
  const loadNegativeExample = () => {
    setProblem(LINEAR_INEQUALITY_EXAMPLES_122[1]);
    act();
  };
  const loadPractice = () => {
    setProblem(LINEAR_INEQUALITY_EXAMPLES_122[2]);
    act();
  };
  const toggleFullscreen = async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await pageRef.current?.requestFullscreen();
    act();
  };
  const shareLesson = async () => {
    const data = {
      title: "Linear Inequalities",
      text: `Solve ${problem.a}x ${problem.b >= 0 ? "+" : "-"} ${Math.abs(problem.b)} ${symbol(problem.relation)} ${problem.c}.`,
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
      className={`lin122-page ${fullscreen ? "fullscreen" : ""}`}
      data-testid="algebra-mockup-0179"
      data-dedicated-lesson="122"
      data-object-model="dedicated-tested-editable-linear-inequality-coefficients-sign-aware-calculated-comparator-flip-pointer-keyboard-draggable-boundary-linked-open-closed-number-line-interval-notation-evaluated-test-points-functional-practice-tabs-language-native-fullscreen-sharing-and-workspace-model"
      data-valid={solution.valid}
      data-problem={`${problem.a},${problem.b},${problem.relation},${problem.c}`}
      data-boundary={boundary}
      data-solved-relation={solvedRelation}
      data-flipped={flipped}
      data-interval={interval}
      data-actions={actions}
    >
      <nav className="lin122-breadcrumb">
        <a href="/">Home</a>
        <span>&gt;</span>
        <a href="/lessons">Lessons</a>
        <span>&gt;</span>
        <a href="/lessons/algebra">Algebra</a>
        <span>&gt;</span>
        <b>122 Linear Inequalities</b>
      </nav>
      <header className="lin122-intro">
        <small>
          <b>ALGEBRA</b>
          <b>EQUATIONS AND INEQUALITIES</b>
        </small>
        <h1>{hindi ? "रैखिक असमिकाएँ" : "Linear Inequalities"}</h1>
        <p>
          {hindi
            ? "अंतराल हल करें और छायांकित करें।"
            : "Solve and shade intervals."}
        </p>
        <nav>
          <b>♙ Intermediate-Advanced</b>
          <b>ϟ Guided Practice</b>
          <b>▣ Solve / Nsolve / Inequality Graphing</b>
        </nav>
        <div>
          <label>
            <Languages />
            <select
              aria-label="Linear inequalities language"
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
        <aside>
          <SolutionLine
            boundary={boundary}
            relation={solvedRelation}
            ariaLabel="Linear inequality hero number line"
          />
        </aside>
      </header>
      <nav className="lin122-tabs">
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
        <LinearInequalityTabPanel122
          tab={activeTab}
          onLoadExample={loadNegativeExample}
        />
      )}
      {workspace && (
        <section
          className="lin122-workspace-panel"
          aria-label="Linear inequality workspace"
        >
          <b>Current solution</b>
          <span>
            x {symbol(solvedRelation)} {boundary}
          </span>
          <span>{interval}</span>
          <button onClick={toggleFullscreen}>
            <Expand />
            Full screen
          </button>
        </section>
      )}
      <main className="lin122-lab">
        <header>
          <span>
            <small>INTERACTION + VISUALIZATION</small>
            <h2>Solve on the number line</h2>
            <p>Solve the inequality and graph the solution set.</p>
          </span>
          <b>
            <Check />
            All steps correct
          </b>
        </header>
        <section className="lin122-body">
          <div className="lin122-left">
            <section className="lin122-equation">
              <h3>Solve this inequality</h3>
              <div>
                <input
                  aria-label="Linear inequality coefficient"
                  type="number"
                  value={problem.a}
                  onChange={(event) =>
                    update({ a: Number(event.target.value) || 1 })
                  }
                />
                x <span>{problem.b >= 0 ? "+" : "−"}</span>
                <input
                  aria-label="Linear inequality constant term"
                  type="number"
                  value={Math.abs(problem.b)}
                  onChange={(event) =>
                    update({
                      b: (problem.b >= 0 ? 1 : -1) * Number(event.target.value),
                    })
                  }
                />
                <select
                  aria-label="Linear inequality relation"
                  value={problem.relation}
                  onChange={(event) =>
                    update({ relation: event.target.value as Relation })
                  }
                >
                  <option value=">">&gt;</option>
                  <option value=">=">≥</option>
                  <option value="<">&lt;</option>
                  <option value="<=">≤</option>
                </select>
                <input
                  aria-label="Linear inequality right side"
                  type="number"
                  value={problem.c}
                  onChange={(event) =>
                    update({ c: Number(event.target.value) })
                  }
                />
              </div>
            </section>
            <section className="lin122-algebra">
              <h3>Work the algebra</h3>
              <article>
                <i>1</i>
                <p>Subtract {problem.b} from both sides.</p>
                <strong>
                  {problem.a}x{formatTerm(problem.b)} − {problem.b}{" "}
                  {symbol(problem.relation)} {problem.c} − {problem.b}
                  <br />
                  {problem.a}x {symbol(problem.relation)}{" "}
                  {problem.c - problem.b}
                </strong>
                <Check />
              </article>
              <article>
                <i>2</i>
                <p>
                  Divide both sides by {flipped ? "negative" : "positive"}{" "}
                  {problem.a}.
                </p>
                <strong>
                  {problem.a}x / {problem.a} {symbol(solvedRelation)}{" "}
                  {problem.c - problem.b} / {problem.a}
                  <br />x {symbol(solvedRelation)} {boundary}
                </strong>
                <Check />
              </article>
              <footer>
                <b>
                  Solution: x {symbol(solvedRelation)} {boundary}
                </b>
                <b>Interval notation: {interval}</b>
              </footer>
            </section>
            <section className="lin122-graph">
              <h3>Graph the solution</h3>
              <SolutionLine
                boundary={boundary}
                relation={solvedRelation}
                draggable
                onBoundary={moveBoundary}
                ariaLabel={`Draggable solution line at ${boundary}`}
              />
            </section>
            <section className="lin122-checks">
              <h3>Check with test points</h3>
              <div>
                <article>
                  <header>
                    Test point: x = {passPoint}
                    <b>
                      <Check />
                      PASS
                    </b>
                  </header>
                  <strong>
                    {problem.a}({passPoint}){formatTerm(problem.b)}{" "}
                    {symbol(problem.relation)} {problem.c}
                  </strong>
                  <p>
                    {evaluate(problem, passPoint) ? "True" : "False"} <Check />
                  </p>
                  <small>x = {passPoint} is in the solution set.</small>
                </article>
                <article>
                  <header>
                    Test point: x = {boundary}
                    <b>
                      <X />
                      {closed ? "INCLUDED" : "NOT INCLUDED"}
                    </b>
                  </header>
                  <strong>
                    {problem.a}({boundary}){formatTerm(problem.b)}{" "}
                    {symbol(problem.relation)} {problem.c}
                  </strong>
                  <p>
                    {evaluate(problem, boundary) ? "True" : "False"}{" "}
                    {closed ? <Check /> : <X />}
                  </p>
                  <small>
                    x = {boundary} is {closed ? "" : "not "}in the solution set.
                  </small>
                </article>
              </div>
              <footer>
                <CircleAlert />
                We use {closed ? "a closed" : "an open"} circle because equality
                is {closed ? "included" : "not included"}.
              </footer>
            </section>
          </div>
          <aside className="lin122-right">
            <section className="lin122-summary">
              <h2>Solution summary</h2>
              <p>
                <span>Boundary</span>
                <b>
                  {boundary} ({closed ? "closed" : "open"} circle)
                </b>
              </p>
              <p>
                <span>Direction</span>
                <b>{right ? "Right" : "Left"}</b>
              </p>
              <p>
                <span>Test point</span>
                <b>x = {passPoint} (True)</b>
              </p>
              <p>
                <span>Interval notation</span>
                <b>{interval}</b>
              </p>
            </section>
            <section className="lin122-warning">
              <TriangleAlert />
              <div>
                <b>Warning</b>
                <h3>MISSED_SIGN_FLIP</h3>
                <p>
                  When dividing by a negative number, flip the inequality sign.
                </p>
                <p>Example:</p>
                <strong>−2x &lt; 6</strong>
                <p>Divide both sides by −2.</p>
                <em>x &gt; −3</em>
              </div>
            </section>
            <section className="lin122-practice">
              <h2>♧ Quick practice</h2>
              <p>Try another inequality</p>
              <strong>5y − 4 ≤ 11</strong>
              <b>Solution: y ≤ 3</b>
              <SolutionLine
                boundary={3}
                relation="<="
                ariaLabel="Quick practice number line"
              />
              <em>Interval: (−∞, 3]</em>
              <button onClick={loadPractice}>Try similar</button>
            </section>
            <section className="lin122-tip">
              <Lightbulb />
              <div>
                <h2>Pro tip</h2>
                <p>
                  Greater than (&gt;) and less than (&lt;) use open circles.
                </p>
                <p>
                  Greater than or equal (≥) and less than or equal (≤) use
                  closed circles.
                </p>
              </div>
            </section>
          </aside>
        </section>
      </main>
      <nav className="lin122-adjacent">
        <a href="/lessons/algebra/121-absolute-value-equations">
          <ArrowLeft />
          <span>
            <small>PREVIOUS</small>Absolute-Value Equations
          </span>
        </a>
        <a href="/lessons/algebra/123-compound-inequalities">
          <span>
            <small>NEXT</small>Compound Inequalities
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="lin122-footer">
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
      <LessonTopicStudyBoard lessonId={122} view={activeTab} onInteraction={onInteraction} />

    </div>
  );
}
