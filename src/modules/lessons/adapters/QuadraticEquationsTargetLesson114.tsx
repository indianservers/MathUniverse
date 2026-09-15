import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Lightbulb,
  ListChecks,
  RotateCcw,
  Shuffle,
  Sparkles,
} from "lucide-react";
import type { LessonAdapterProps } from "../types";
import {
  QUADRATIC_EXAMPLES_114 as examples,
  evaluateQuadratic114,
  isIntegerFactorableQuadratic114,
  isQuadraticPracticeCorrect114,
  quadraticEquationText114 as equationText,
  quadraticExpressionText114 as expressionText,
  quadraticFactorText114 as factorText,
  quadraticFromRoots114,
  quadraticMethodSteps114,
  solveQuadratic114 as solveQuadratic,
  tidyQuadratic114 as tidy,
  type Quadratic114 as Quadratic,
  type QuadraticMethod114,
  type QuadraticRoots114 as Roots,
} from "./quadraticEquationsLesson114Model";
import "./QuadraticEquationsTargetLesson114.css";
import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";

function QuadraticGraph({
  quadratic,
  roots,
  variable = "x",
  interactive = false,
  onRootMove,
}: {
  quadratic: Quadratic;
  roots: Roots;
  variable?: string;
  interactive?: boolean;
  onRootMove?: (index: 0 | 1, value: number) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<0 | 1 | null>(null);
  const width = 310;
  const height = 255;
  const bounds = { left: 34, right: 295, top: 24, bottom: 224 };
  const xMin = -1;
  const xMax = 7;
  const yMin = -3.5;
  const yMax = 5;
  const px = (x: number) =>
    bounds.left + ((x - xMin) / (xMax - xMin)) * (bounds.right - bounds.left);
  const py = (y: number) =>
    bounds.bottom - ((y - yMin) / (yMax - yMin)) * (bounds.bottom - bounds.top);
  const points = Array.from({ length: 101 }, (_, index) => {
    const x = xMin + ((xMax - xMin) * index) / 100;
    const y = evaluateQuadratic114(quadratic, x);
    return `${px(x)},${py(y)}`;
  }).join(" ");
  const vertexX = roots.vertexX;
  const vertexY = roots.vertexY;
  const move = (event: PointerEvent<SVGSVGElement>) => {
    if (dragging === null || !onRootMove || !svgRef.current) return;
    const box = svgRef.current.getBoundingClientRect();
    const local = ((event.clientX - box.left) / box.width) * width;
    const x =
      xMin +
      ((local - bounds.left) / (bounds.right - bounds.left)) * (xMax - xMin);
    onRootMove(dragging, Math.round(Math.max(-4, Math.min(8, x)) * 2) / 2);
  };
  return (
    <svg
      ref={svgRef}
      className="quad114-graph"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Graph of y equals ${expressionText(quadratic)}`}
      onPointerMove={move}
      onPointerUp={() => setDragging(null)}
      onPointerLeave={() => setDragging(null)}
    >
      <g className="grid">
        {Array.from({ length: 9 }, (_, index) => (
          <line
            key={`v${index}`}
            x1={px(index - 1)}
            x2={px(index - 1)}
            y1={bounds.top}
            y2={bounds.bottom}
          />
        ))}
        {Array.from({ length: 9 }, (_, index) => (
          <line
            key={`h${index}`}
            x1={bounds.left}
            x2={bounds.right}
            y1={py(index - 3)}
            y2={py(index - 3)}
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
      {Array.from({ length: 9 }, (_, index) => (
        <text key={index} x={px(index - 1)} y={py(0) + 14}>
          {index - 1}
        </text>
      ))}
      <text x={bounds.right + 2} y={py(0) - 5}>
        {variable}
      </text>
      <text x={px(0) + 6} y={bounds.top}>
        y
      </text>
      <polyline className="curve" points={points} />
      {roots.discriminant >= 0 &&
        [roots.first, roots.second].map((root, index) => (
          <g key={index}>
            <circle
              className={interactive ? "root draggable" : "root"}
              cx={px(root)}
              cy={py(0)}
              r="6"
              role={interactive ? "slider" : undefined}
              aria-label={interactive ? `Drag root ${index + 1}` : undefined}
              tabIndex={interactive ? 0 : undefined}
              onPointerDown={(event) => {
                if (!interactive) return;
                event.currentTarget.setPointerCapture(event.pointerId);
                setDragging(index as 0 | 1);
              }}
              onKeyDown={(event) => {
                if (!interactive || !onRootMove) return;
                if (event.key === "ArrowLeft")
                  onRootMove(index as 0 | 1, root - 0.5);
                if (event.key === "ArrowRight")
                  onRootMove(index as 0 | 1, root + 0.5);
              }}
            />
            <text className="root-label" x={px(root)} y={py(0) - 10}>
              ({tidy(root)}, 0)
            </text>
          </g>
        ))}
      {Number.isFinite(vertexX) && (
        <>
          <circle className="vertex" cx={px(vertexX)} cy={py(vertexY)} r="4" />
          <text className="vertex-label" x={px(vertexX)} y={py(vertexY) + 18}>
            Vertex
          </text>
          <text className="vertex-label" x={px(vertexX)} y={py(vertexY) + 31}>
            ({tidy(vertexX)}, {tidy(vertexY)})
          </text>
        </>
      )}
    </svg>
  );
}

export default function QuadraticEquationsTargetLesson114({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [quadratic, setQuadratic] = useState<Quadratic>(examples[0]);
  const [showFactors, setShowFactors] = useState(true);
  const [markRoots, setMarkRoots] = useState(true);
  const [checkRoots, setCheckRoots] = useState(true);
  const [method, setMethod] = useState<QuadraticMethod114>("Factoring");
  const [activeTab, setActiveTab] = useState("Interactive");
  const [practiceAnswers, setPracticeAnswers] = useState(["3", "4"]);
  const [practiceChecked, setPracticeChecked] = useState(true);
  const [showSteps, setShowSteps] = useState(false);
  const [actions, setActions] = useState(0);
  const roots = useMemo(() => solveQuadratic(quadratic), [quadratic]);
  const factorable = isIntegerFactorableQuadratic114(quadratic);
  const practice = examples[1];
  const practiceRoots = solveQuadratic(practice);
  const practiceCorrect = isQuadraticPracticeCorrect114(
    practice,
    practiceAnswers.map(Number) as [number, number],
  );
  const act = () => {
    setActions((value) => value + 1);
    onInteraction();
  };
  const reset = (notify = true) => {
    setExampleIndex(0);
    setQuadratic(examples[0]);
    setShowFactors(true);
    setMarkRoots(true);
    setCheckRoots(true);
    setMethod("Factoring");
    setActiveTab("Interactive");
    setPracticeAnswers(["3", "4"]);
    setPracticeChecked(true);
    setShowSteps(false);
    setActions(0);
    if (notify) onInteraction();
  };
  useEffect(() => reset(false), [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps
  const updateCoefficient = (key: keyof Quadratic, value: number) => {
    setQuadratic((current) => ({ ...current, [key]: value }));
    setCheckRoots(false);
    act();
  };
  const moveRoot = (index: 0 | 1, value: number) => {
    const nextRoots: [number, number] = [roots.first, roots.second];
    nextRoots[index] = value;
    setQuadratic(
      quadraticFromRoots114(quadratic.a, nextRoots[0], nextRoots[1]),
    );
    setCheckRoots(false);
    act();
  };
  const nextEquation = () => {
    const next = (exampleIndex + 1) % examples.length;
    setExampleIndex(next);
    setQuadratic(examples[next]);
    setCheckRoots(false);
    act();
  };

  return (
    <div
      className="quad114-page"
      data-testid="algebra-mockup-0171"
      data-dedicated-lesson="114"
      data-object-model="dedicated-tested-editable-quadratic-coefficients-discriminant-multiple-solving-methods-factor-pairs-zero-product-rule-pointer-draggable-root-graph-synchronized-verification-graded-practice-functional-tabs-model"
      data-equation={`${quadratic.a},${quadratic.b},${quadratic.c}`}
      data-roots={`${roots.first},${roots.second}`}
      data-factorable={factorable}
      data-method={method}
      data-discriminant={roots.discriminant}
      data-vertex={`${roots.vertexX},${roots.vertexY}`}
      data-practice-correct={practiceChecked && practiceCorrect}
      data-actions={actions}
    >
      <nav className="quad114-breadcrumb">
        <a href="/">Home</a>
        <span>&gt;</span>
        <a href="/lessons">Lessons</a>
        <span>&gt;</span>
        <a href="/lessons/algebra">Algebra</a>
        <span>&gt;</span>
        <b>114 Quadratic Equations</b>
      </nav>
      <header className="quad114-intro">
        <small>
          <b>INTERMEDIATE-ADVANCED ALGEBRA</b>
          <b>◷ 6-10 min</b>
          <b>ROOTS + GRAPH</b>
        </small>
        <h1>Quadratic Equations</h1>
        <p>Solve by factoring and apply the zero-product rule.</p>
        <nav>
          {[
            "Interactive",
            "Guided Practice",
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
      </header>

      {activeTab !== "Interactive" && (
        <QuadraticTabPanel114
          tab={activeTab}
          onChooseExample={(index) => {
            setExampleIndex(index);
            setQuadratic(examples[index]);
            setCheckRoots(false);
            act();
          }}
        />
      )}

      <section className="quad114-controls">
        <label className="equation">
          <span>Equation</span>
          <strong>{equationText(quadratic)}</strong>
        </label>
        {(["a", "b", "c"] as const).map((key) => (
          <label key={key}>
            <span>{key}</span>
            <input
              aria-label={`Quadratic coefficient ${key}`}
              type="number"
              value={quadratic[key]}
              onChange={(event) =>
                updateCoefficient(key, Number(event.target.value))
              }
            />
          </label>
        ))}
        <label className="method">
          <span>Method</span>
          <select
            aria-label="Quadratic solving method"
            value={method}
            onChange={(event) => {
              setMethod(event.target.value as QuadraticMethod114);
              setShowSteps(true);
              act();
            }}
          >
            <option>Factoring</option>
            <option>Quadratic formula</option>
            <option>Complete the square</option>
          </select>
        </label>
        <footer>
          <Toggle
            label="Show factors"
            checked={showFactors}
            onChange={() => {
              setShowFactors((v) => !v);
              act();
            }}
          />
          <Toggle
            label="Mark roots"
            checked={markRoots}
            onChange={() => {
              setMarkRoots((v) => !v);
              act();
            }}
          />
          <Toggle
            label="Check roots"
            checked={checkRoots}
            onChange={() => {
              setCheckRoots((v) => !v);
              act();
            }}
          />
          <button onClick={() => reset()}>
            <RotateCcw />
            Reset
          </button>
          <button className="new" onClick={nextEquation}>
            <Shuffle />
            New equation
          </button>
        </footer>
      </section>

      <section className="quad114-lab">
        <header>
          <h2>
            {method === "Factoring" ? "Factor-to-Roots Lab" : `${method} Lab`}
          </h2>
          <p>
            Factor the quadratic, apply the zero-product rule, and verify on the
            graph.
          </p>
        </header>
        <div className="quad114-flow">
          <article className="factors">
            <h3>1. Factors</h3>
            <p>From factoring {expressionText(quadratic)}</p>
            {factorable && showFactors ? (
              [roots.first, roots.second].map((root, index) => (
                <section key={index}>
                  <strong>
                    x {root < 0 ? "+" : "−"} {tidy(Math.abs(root))}
                  </strong>
                  <p>Set equal to zero:</p>
                  <span>
                    x {root < 0 ? "+" : "−"} {tidy(Math.abs(root))} = 0
                  </span>
                  <b>x = {tidy(root)}</b>
                  <i />
                </section>
              ))
            ) : (
              <section className="unfactorable">
                <strong>
                  {roots.discriminant < 0
                    ? "No real factors"
                    : "Non-integer factors"}
                </strong>
                <p>Use the quadratic formula for this equation.</p>
              </section>
            )}
          </article>
          <article className="zero">
            <h3>2. Zero-Product Rule</h3>
            <p>If ab = 0, then a = 0 or b = 0</p>
            <section>
              <strong>
                {factorable ? factorText(roots) : `Δ = ${roots.discriminant}`}
              </strong>
              <span>Either factor can be zero.</span>
            </section>
            <section>
              <strong>
                {factorable
                  ? `x = ${tidy(roots.first)}  or  x = ${tidy(roots.second)}`
                  : "Try another method"}
              </strong>
              <span>Solutions (roots)</span>
            </section>
          </article>
          <article className="graph-panel">
            <h3>3. Graph Check</h3>
            <strong>y = {expressionText(quadratic)}</strong>
            <QuadraticGraph
              quadratic={quadratic}
              roots={roots}
              interactive={markRoots && factorable}
              onRootMove={moveRoot}
            />
          </article>
        </div>
        <footer className={checkRoots && factorable ? "verified" : ""}>
          <Check />
          <span>
            <b>Result</b>
            <strong>
              {factorable
                ? `Roots: ${tidy(roots.first)}, ${tidy(roots.second)}`
                : "No integer roots"}
            </strong>
            <p>
              {factorable
                ? `The parabola crosses the x-axis at x = ${tidy(roots.first)} and x = ${tidy(roots.second)}.`
                : "Choose a suitable solving method."}
            </p>
          </span>
          <button
            onClick={() => {
              setShowSteps((v) => !v);
              act();
            }}
          >
            <ListChecks />
            Step-by-step solution
          </button>
        </footer>
        {showSteps && (
          <aside className="steps">
            {quadraticMethodSteps114(quadratic, method)}
          </aside>
        )}
      </section>

      <section className="quad114-practice">
        <header>
          <h2>Practice: Your Turn</h2>
          <p>Apply the same steps to solve.</p>
        </header>
        <div>
          <article>
            <b>Solve for the roots.</b>
            <strong>{equationText(practice, "y")}</strong>
            <section>
              <b>Your work</b>
              <p>1. Factor the quadratic.</p>
              <label>
                {factorText(practiceRoots, "y")}
                <Check />
              </label>
              <p>2. Apply the zero-product rule.</p>
              {practiceAnswers.map((answer, index) => (
                <label key={index}>
                  y −{" "}
                  {tidy(
                    index === 0 ? practiceRoots.first : practiceRoots.second,
                  )}{" "}
                  = 0 <ArrowRight />
                  <input
                    aria-label={`Practice root ${index + 1}`}
                    value={answer}
                    onChange={(event) => {
                      const next = [...practiceAnswers];
                      next[index] = event.target.value;
                      setPracticeAnswers(next);
                      setPracticeChecked(false);
                      act();
                    }}
                  />
                  <Check />
                </label>
              ))}
              <p>3. Solutions (roots)</p>
              <label>
                y = {practiceAnswers[0] || "?"} or y ={" "}
                {practiceAnswers[1] || "?"}
                <Check />
              </label>
            </section>
          </article>
          <article className="practice-graph">
            <b>Check on the graph</b>
            <strong>y = y² − 7y + 12</strong>
            <QuadraticGraph
              quadratic={practice}
              roots={practiceRoots}
              variable="y"
            />
          </article>
        </div>
        <footer>
          <button
            onClick={() => {
              setPracticeChecked(true);
              act();
            }}
          >
            <Check />
            Check Answer
          </button>
          <span
            className={
              practiceChecked && practiceCorrect ? "correct" : "pending"
            }
          >
            {practiceChecked
              ? practiceCorrect
                ? "Correct! Both roots are correct."
                : "Check both roots and try again."
              : "Ready to check your roots."}
          </span>
        </footer>
        <aside>
          <Lightbulb />
          <span>
            <b>Hint</b>
            <p>
              Always use the zero-product rule: if (ax + b)(cx + d) = 0, then ax
              + b = 0 or cx + d = 0.
            </p>
          </span>
          <button
            onClick={() => {
              setShowSteps((v) => !v);
              act();
            }}
          >
            <ListChecks />
            Show steps
          </button>
        </aside>
      </section>

      <nav className="quad114-adjacent">
        <a href="/lessons/algebra/113-three-variable-systems">
          <ArrowLeft />
          <span>
            <small>PREVIOUS</small>Three-Variable Systems
          </span>
        </a>
        <a href="/lessons/algebra/115-polynomial-equations">
          <span>
            <small>NEXT</small>Polynomial Equations
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="quad114-footer">
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
      </footer>
      <LessonTopicStudyBoard lessonId={114} view={activeTab} onInteraction={onInteraction} />

    </div>
  );
}

function QuadraticTabPanel114({
  tab,
  onChooseExample,
}: {
  tab: string;
  onChooseExample: (index: number) => void;
}) {
  const content: Record<string, { title: string; body: string }> = {
    "Guided Practice": {
      title: "Guided practice",
      body: "Enter both roots, check the ordered pair, and compare them with the x-intercepts below.",
    },
    Examples: {
      title: "Calculated examples",
      body: "Load a quadratic with synchronized coefficients, roots, factors, vertex, and parabola.",
    },
    Formulas: {
      title: "Quadratic formula",
      body: "For ax² + bx + c = 0, use x = (-b ± √(b² - 4ac)) / 2a.",
    },
    "Know more": {
      title: "Roots and discriminant",
      body: "The discriminant determines whether the parabola has two, one, or no real x-intercepts.",
    },
  };
  const selected = content[tab] ?? content.Formulas;
  return (
    <section className="quad114-tab-panel">
      <small>QUADRATIC EQUATIONS</small>
      <h2>{selected.title}</h2>
      <p>{selected.body}</p>
      {tab === "Examples" && (
        <div>
          {examples.map((example, index) => {
            const roots = solveQuadratic(example);
            return (
              <button
                type="button"
                key={`${example.a}-${example.b}-${example.c}`}
                onClick={() => onChooseExample(index)}
              >
                <span>{equationText(example)}</span>
                <b>
                  {tidy(roots.first)}, {tidy(roots.second)}
                </b>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="quad114-toggle">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <i />
      <span>{label}</span>
    </label>
  );
}
