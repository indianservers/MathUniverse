import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  Eye,
  Languages,
  ListChecks,
  RotateCcw,
  Share2,
  Sparkles,
  Trophy,
} from "lucide-react";
import type { LessonAdapterProps } from "../types";
import {
  POLYNOMIAL_EXAMPLES_115 as examples,
  POLYNOMIAL_PRACTICES_115 as practices,
  coefficientsFromRoots115 as coefficientsFor,
  evaluatePolynomialRoots115 as valueAt,
  isPolynomialPracticeCorrect115,
  polynomialExpandedText115 as expandedText,
  polynomialFactor115 as factor,
  polynomialFactoredText115 as factoredText,
  polynomialFromRootMove115,
  polynomialRootChecks115,
  type PolynomialRoots115 as Triple,
} from "./polynomialEquationsLesson115Model";
import "./PolynomialEquationsTargetLesson115.css";
import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";

const colors = ["#08a5bd", "#9a43e8", "#ff8319"];

function PolynomialGraph({
  roots,
  marked,
  onMove,
}: {
  roots: Triple;
  marked: boolean;
  onMove: (index: number, value: number) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const width = 360;
  const height = 340;
  const bounds = { left: 38, right: 344, top: 28, bottom: 305 };
  const xMin = -2.5;
  const xMax = 5;
  const yMin = -7;
  const yMax = 7;
  const px = (x: number) =>
    bounds.left + ((x - xMin) / (xMax - xMin)) * (bounds.right - bounds.left);
  const py = (y: number) =>
    bounds.bottom - ((y - yMin) / (yMax - yMin)) * (bounds.bottom - bounds.top);
  const points = Array.from({ length: 181 }, (_, index) => {
    const x = xMin + ((xMax - xMin) * index) / 180;
    return `${px(x)},${py(valueAt(roots, x))}`;
  }).join(" ");
  const move = (event: PointerEvent<SVGSVGElement>) => {
    if (dragging === null || !svgRef.current) return;
    const box = svgRef.current.getBoundingClientRect();
    const localX = ((event.clientX - box.left) / box.width) * width;
    const value =
      xMin +
      ((localX - bounds.left) / (bounds.right - bounds.left)) * (xMax - xMin);
    onMove(dragging, Math.round(Math.max(-4, Math.min(7, value))));
  };
  return (
    <svg
      ref={svgRef}
      className="poly115-graph"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Cubic graph with roots ${roots.join(", ")}`}
      onPointerMove={move}
      onPointerUp={() => setDragging(null)}
      onPointerLeave={() => setDragging(null)}
    >
      <defs>
        <clipPath id="poly115-plot-clip">
          <rect
            x={bounds.left}
            y={bounds.top}
            width={bounds.right - bounds.left}
            height={bounds.bottom - bounds.top}
          />
        </clipPath>
      </defs>
      <g className="grid">
        {Array.from({ length: 8 }, (_, i) => (
          <line
            key={`v${i}`}
            x1={px(i - 2)}
            x2={px(i - 2)}
            y1={bounds.top}
            y2={bounds.bottom}
          />
        ))}
        {Array.from({ length: 8 }, (_, i) => (
          <line
            key={`h${i}`}
            x1={bounds.left}
            x2={bounds.right}
            y1={py((i - 3) * 2)}
            y2={py((i - 3) * 2)}
          />
        ))}
      </g>
      <line
        className="axis"
        x1={bounds.left}
        x2={bounds.right + 5}
        y1={py(0)}
        y2={py(0)}
      />
      <line
        className="axis"
        x1={px(0)}
        x2={px(0)}
        y1={bounds.top - 5}
        y2={bounds.bottom}
      />
      {Array.from({ length: 8 }, (_, i) => (
        <text key={i} x={px(i - 2)} y={py(0) + 14}>
          {i - 2}
        </text>
      ))}
      <text x={bounds.right + 7} y={py(0) - 6}>
        x
      </text>
      <text x={px(0) + 7} y={bounds.top}>
        y
      </text>
      {[-6, -4, -2, 2, 4, 6].map((value) => (
        <text key={value} x={px(0) - 10} y={py(value) + 3}>
          {value}
        </text>
      ))}
      <polyline
        className="curve"
        points={points}
        clipPath="url(#poly115-plot-clip)"
      />
      {marked &&
        roots.map((root, index) => (
          <circle
            key={index}
            cx={px(root)}
            cy={py(0)}
            r="6"
            fill={colors[index]}
            role="slider"
            tabIndex={0}
            aria-label={`Drag polynomial root ${index + 1}`}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              setDragging(index);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft") onMove(index, root - 1);
              if (event.key === "ArrowRight") onMove(index, root + 1);
            }}
          />
        ))}
    </svg>
  );
}

export default function PolynomialEquationsTargetLesson115({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [roots, setRoots] = useState<Triple>(examples[0]);
  const [factorEnabled, setFactorEnabled] = useState<
    [boolean, boolean, boolean]
  >([true, true, true]);
  const [form, setForm] = useState<"factored" | "expanded">("factored");
  const [showFactors, setShowFactors] = useState(true);
  const [markRoots, setMarkRoots] = useState(true);
  const [checked, setChecked] = useState(true);
  const [testValue, setTestValue] = useState(2);
  const [activeTab, setActiveTab] = useState("Interaction + visualization");
  const [language, setLanguage] = useState("English (English)");
  const [shared, setShared] = useState(false);
  const [workspace, setWorkspace] = useState(false);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiceAnswers, setPracticeAnswers] = useState<
    [string, string, string]
  >(["-1", "2", "4"]);
  const [practiceChecked, setPracticeChecked] = useState(true);
  const [practiceSteps, setPracticeSteps] = useState(false);
  const [actions, setActions] = useState(0);
  const coefficients = useMemo(() => coefficientsFor(roots), [roots]);
  const rootChecks = useMemo(() => polynomialRootChecks115(roots), [roots]);
  const activeRoots = roots.filter((_, index) => factorEnabled[index]);
  const allChecked = checked && factorEnabled.every(Boolean);
  const testedValue = valueAt(roots, testValue);
  const practice = practices[practiceIndex];
  const practiceCorrect =
    practiceChecked &&
    isPolynomialPracticeCorrect115(
      practice,
      practiceAnswers.map(Number) as Triple,
    );
  const act = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const reset = (notify = true) => {
    setExampleIndex(0);
    setRoots(examples[0]);
    setFactorEnabled([true, true, true]);
    setForm("factored");
    setShowFactors(true);
    setMarkRoots(true);
    setChecked(true);
    setTestValue(2);
    setActiveTab("Interaction + visualization");
    setLanguage("English (English)");
    setShared(false);
    setWorkspace(false);
    setPracticeIndex(0);
    setPracticeAnswers(["-1", "2", "4"]);
    setPracticeChecked(true);
    setPracticeSteps(false);
    setActions(0);
    if (notify) onInteraction();
  };
  useEffect(() => reset(false), [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps
  const moveRoot = (index: number, value: number) => {
    setRoots(polynomialFromRootMove115(roots, index, value));
    setChecked(false);
    act();
  };
  const nextExample = () => {
    const next = (exampleIndex + 1) % examples.length;
    setExampleIndex(next);
    setRoots(examples[next]);
    setFactorEnabled([true, true, true]);
    setChecked(false);
    act();
  };
  const nextPractice = () => {
    const next = (practiceIndex + 1) % practices.length;
    setPracticeIndex(next);
    setPracticeAnswers(["", "", ""]);
    setPracticeChecked(false);
    setPracticeSteps(false);
    act();
  };
  const shareLesson = async () => {
    const shareData = {
      title: "Polynomial Equations",
      text: `Explore roots ${roots.join(", ")}.`,
      url: window.location.href,
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      act();
    } catch {
      setShared(false);
    }
  };
  const hindi = language.startsWith("Hindi");

  return (
    <div
      className="poly115-page"
      data-testid="algebra-mockup-0172"
      data-dedicated-lesson="115"
      data-object-model="dedicated-tested-editable-three-root-cubic-factor-stack-vieta-expansion-pointer-draggable-roots-zero-product-switches-svg-graph-substitution-check-lost-factor-warning-three-root-graded-practice-functional-tabs-language-and-native-sharing-model"
      data-roots={roots.join(",")}
      data-coefficients={`${coefficients.cubic},${coefficients.square},${coefficients.linear},${coefficients.constant}`}
      data-factor-enabled={factorEnabled.join(",")}
      data-test-value={testValue}
      data-test-result={testedValue}
      data-root-checks={rootChecks.join(",")}
      data-all-checked={allChecked}
      data-practice-index={practiceIndex}
      data-practice-correct={practiceCorrect}
      data-actions={actions}
    >
      <nav className="poly115-breadcrumb">
        <a href="/">Home</a>
        <span>&gt;</span>
        <a href="/lessons">Lessons</a>
        <span>&gt;</span>
        <a href="/lessons/algebra">Algebra</a>
        <span>&gt;</span>
        <b>115 Polynomial Equations</b>
      </nav>
      <header className="poly115-intro">
        <section>
          <small>
            <b>ALGEBRA</b>
            <b>EQUATIONS AND INEQUALITIES</b>
          </small>
          <h1>{hindi ? "बहुपद समीकरण" : "Polynomial Equations"}</h1>
          <p>
            {hindi
              ? "गुणनखंड करें, प्रत्येक गुणनखंड को शून्य रखें और सभी मूल ज्ञात करें।"
              : "Factor, set each factor to zero, and find all roots."}
          </p>
          <nav>
            <b>▣ Intermediate-Advanced</b>
            <b>⌁ Factor roots</b>
            <b>◷ 6-10 min</b>
          </nav>
          <div>
            <label>
              <Languages />
              <select
                aria-label="Polynomial equations language"
                value={language}
                onChange={(event) => {
                  setLanguage(event.target.value);
                  act();
                }}
              >
                <option>English (English)</option>
                <option>Hindi (हिन्दी)</option>
              </select>
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
        </section>
        <aside>
          <b>Key idea</b>
          {[
            "Move everything to one side: set equal to 0.",
            "Factor the polynomial.",
            "Set each factor equal to 0.",
            "Check each root in the original equation.",
          ].map((line, index) => (
            <p key={line}>
              <i>{index + 1}</i>
              {line}
            </p>
          ))}
        </aside>
      </header>
      <nav className="poly115-tabs">
        {[
          "Interaction + visualization",
          "Explain",
          "Examples",
          "Practice",
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
        <PolynomialTabPanel115 tab={activeTab} onChooseExample={nextExample} />
      )}
      {workspace && (
        <section
          className="poly115-workspace-panel"
          aria-label="Polynomial equation workspace"
        >
          <b>Current polynomial</b>
          <span>{expandedText(roots)}</span>
          <span>Roots: {roots.join(", ")}</span>
        </section>
      )}
      <main className="poly115-lab">
        <header>
          <span>
            <small>INTERACTION • FACTOR-STACK ROOTS LAB</small>
            <h2>Factor-stack roots lab</h2>
            <p>
              Solve by moving everything to one side, factoring, and setting
              each factor equal to zero.
            </p>
          </span>
          <nav>
            <Toggle
              label="Show factors"
              checked={showFactors}
              onChange={() => {
                setShowFactors((value) => !value);
                act();
              }}
              icon={<Eye />}
            />
            <Toggle
              label="Mark roots"
              checked={markRoots}
              onChange={() => {
                setMarkRoots((value) => !value);
                act();
              }}
            />
            <button
              onClick={() => {
                setChecked(true);
                act();
              }}
            >
              <Check />
              Check all
            </button>
          </nav>
        </header>
        <section className="poly115-work">
          <article className="poly115-stack">
            <small>Equation</small>
            <nav>
              <button
                className={form === "factored" ? "active" : ""}
                onClick={() => {
                  setForm("factored");
                  act();
                }}
              >
                Factored form
              </button>
              <button
                className={form === "expanded" ? "active" : ""}
                onClick={() => {
                  setForm("expanded");
                  act();
                }}
              >
                Expanded form
              </button>
            </nav>
            <strong>
              {form === "factored" ? factoredText(roots) : expandedText(roots)}
            </strong>
            <p>{expandedText(roots)}</p>
            {showFactors &&
              roots.map((root, index) => (
                <section className={`factor factor-${index + 1}`} key={index}>
                  <b>Factor {index + 1}</b>
                  <label>
                    x <span>{root < 0 ? "+" : "−"}</span>
                    <input
                      type="number"
                      aria-label={`Polynomial root ${index + 1}`}
                      value={Math.abs(root)}
                      onChange={(event) =>
                        moveRoot(
                          index,
                          (root < 0 ? -1 : 1) * Number(event.target.value),
                        )
                      }
                    />{" "}
                    = 0
                  </label>
                  <div>
                    <em>Root: x = {root}</em>
                    <Toggle
                      label="Set factor to zero"
                      checked={factorEnabled[index]}
                      onChange={() => {
                        const next = [...factorEnabled] as [
                          boolean,
                          boolean,
                          boolean,
                        ];
                        next[index] = !next[index];
                        setFactorEnabled(next);
                        setChecked(false);
                        act();
                      }}
                    />
                  </div>
                </section>
              ))}
            <section className="solution">
              <header>
                <b>Roots (solutions)</b>
                <span>All roots from factors set to zero</span>
              </header>
              <div>
                {roots.map((root, index) => (
                  <i
                    key={index}
                    className={factorEnabled[index] ? "active" : ""}
                    style={{ borderColor: colors[index] }}
                  >
                    {root}
                  </i>
                ))}
              </div>
              <footer>
                <b>Solution set:</b>
                <strong>
                  x ={" "}
                  {activeRoots.length
                    ? activeRoots.join(", ")
                    : "none selected"}
                </strong>
              </footer>
            </section>
          </article>
          <article className="poly115-visual">
            <section className="poly115-graph-card">
              <h3>Graph: y = {roots.map((root) => factor(root)).join("")}</h3>
              <PolynomialGraph
                roots={roots}
                marked={markRoots}
                onMove={moveRoot}
              />
              <aside>
                <b>Roots</b>
                {roots.map((root, index) => (
                  <span key={index}>
                    <i style={{ background: colors[index] }} />x = {root}
                  </span>
                ))}
              </aside>
            </section>
            <section className="test-root">
              <h3>Test a root</h3>
              <p>
                Substitute a value to verify it makes the original equation
                equal to 0.
              </p>
              <label>
                Test value{" "}
                <input
                  aria-label="Polynomial root test value"
                  type="number"
                  value={testValue}
                  onChange={(event) => {
                    setTestValue(Number(event.target.value));
                    setChecked(false);
                    act();
                  }}
                />
              </label>
              <strong>
                ({testValue} − {roots[0]})({testValue} − {roots[1]})({testValue}{" "}
                − {roots[2]}) ={" "}
                {roots.map((root) => testValue - root).join(" • ")} ={" "}
                {testedValue}
              </strong>
              <span className={testedValue === 0 ? "good" : "bad"}>
                {testedValue === 0
                  ? `✓ ${testValue} is a root.`
                  : `✕ ${testValue} is not a root.`}
              </span>
            </section>
          </article>
        </section>
        <section className="poly115-summary">
          <article>
            <CircleAlert />
            <span>
              <h3>Warning</h3>
              <b>Dropping a factor loses a solution.</b>
              <p>
                If you solve (x − 1)(x − 2)(x − 3) = 0 but drop (x − 2), you may
                only get x = 1 or x = 3 and miss x = 2.
              </p>
              <small>Always set each factor equal to zero.</small>
            </span>
            <aside>
              <b>Example: Dropping (x − 2)</b>
              <p>(x − 1)(x − 3) = 0 → x = 1 or x = 3</p>
              <strong>⚠ Missed solution: x = 2</strong>
            </aside>
          </article>
          <article>
            <Trophy />
            <span>
              <h3>Result</h3>
              <p>{allChecked ? "All roots found" : "Check every factor"}</p>
              <strong>x = {activeRoots.join(", ") || "—"}</strong>
              <small>Total roots: {activeRoots.length}</small>
            </span>
          </article>
        </section>
      </main>
      <section className="poly115-practice">
        <header>
          <span>
            <small>PRACTICE</small>
            <h2>Try another</h2>
            <p>Solve by factoring and setting each factor equal to zero.</p>
          </span>
          <nav>
            <button onClick={nextPractice}>▣ New practice</button>
            <button
              onClick={() => {
                setPracticeSteps((value) => !value);
                act();
              }}
            >
              <ListChecks />
              Show steps
            </button>
          </nav>
        </header>
        <div>
          <article>
            <b>Problem</b>
            <strong>{factoredText(practice, "y")}</strong>
          </article>
          <article>
            <b>Your answer</b>
            <p>Enter all roots in increasing order.</p>
            <section>
              {practiceAnswers.map((answer, index) => (
                <label key={index}>
                  <input
                    aria-label={`Polynomial practice root ${index + 1}`}
                    value={answer}
                    onChange={(event) => {
                      const next = [...practiceAnswers] as [
                        string,
                        string,
                        string,
                      ];
                      next[index] = event.target.value;
                      setPracticeAnswers(next);
                      setPracticeChecked(false);
                      act();
                    }}
                  />
                  {practiceChecked &&
                    Number(answer) ===
                      [...practice].sort((a, b) => a - b)[index] && <Check />}
                </label>
              ))}
            </section>
            <button
              onClick={() => {
                setPracticeChecked(true);
                act();
              }}
            >
              {practiceCorrect
                ? "Great! All roots are correct."
                : practiceChecked
                  ? "Check all three roots."
                  : "Check answer"}
            </button>
          </article>
          <article>
            <b>Answer</b>
            <strong>y = {practice.join(", ")}</strong>
            <p>Check</p>
            {practice.map((root) => (
              <span key={root}>
                {practice
                  .map(
                    (item) =>
                      `(${root} ${item < 0 ? "+" : "−"} ${Math.abs(item)})`,
                  )
                  .join("")}{" "}
                = 0 <Check />
              </span>
            ))}
          </article>
        </div>
        {practiceSteps && (
          <aside>
            Set each factor equal to zero, solve the three one-step equations,
            then list every root in increasing order.
          </aside>
        )}
      </section>
      <nav className="poly115-adjacent">
        <a href="/lessons/algebra/114-quadratic-equations">
          <ArrowLeft />
          <span>
            <small>PREVIOUS</small>Quadratic Equations
          </span>
        </a>
        <a href="/lessons/algebra/116-rational-equations">
          <span>
            <small>NEXT</small>Rational Equations
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="poly115-footer">
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
      <LessonTopicStudyBoard lessonId={115} view={activeTab} onInteraction={onInteraction} />

    </div>
  );
}

function PolynomialTabPanel115({
  tab,
  onChooseExample,
}: {
  tab: string;
  onChooseExample: () => void;
}) {
  const content: Record<string, { title: string; body: string }> = {
    Explain: {
      title: "Zero-product reasoning",
      body: "A product is zero when at least one factor is zero. Every factor must be solved so no root is lost.",
    },
    Examples: {
      title: "Calculated cubic examples",
      body: "Load another root set and rebuild its factors, expanded coefficients, checks, and graph.",
    },
    Practice: {
      title: "Three-root practice",
      body: "Enter all roots. Grading compares the complete solution set regardless of entry order.",
    },
    Formulas: {
      title: "Vieta expansion",
      body: "For roots r1, r2, r3, the coefficients come from their sum, pairwise products, and product.",
    },
    "Know more": {
      title: "Multiplicity and intercepts",
      body: "Each real root is an x-intercept. Repeated roots touch the axis without crossing it.",
    },
  };
  const selected = content[tab] ?? content.Explain;
  return (
    <section className="poly115-tab-panel">
      <small>POLYNOMIAL EQUATIONS</small>
      <h2>{selected.title}</h2>
      <p>{selected.body}</p>
      {tab === "Examples" && (
        <button type="button" onClick={onChooseExample}>
          Load next cubic example
        </button>
      )}
    </section>
  );
}

function Toggle({
  label,
  checked,
  onChange,
  icon,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <label className="poly115-toggle">
      {icon}
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <i />
    </label>
  );
}
