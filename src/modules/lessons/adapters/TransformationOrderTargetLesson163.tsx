import { Check, Lightbulb, RotateCcw, X } from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import type { LessonAdapterProps } from "../types";
import "./TransformationOrderTargetLesson163.css";

type Stage = "Observe" | "Manipulate" | "Notice" | "Understand" | "Try";
type Operation = { kind: "reflect" } | { kind: "shift"; amount: number };
const STAGES: Stage[] = [
  "Observe",
  "Manipulate",
  "Notice",
  "Understand",
  "Try",
];
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const snap = (value: number, step = 0.5) => Math.round(value / step) * step;
const tidy = (value: number) => {
  const rounded = Math.round(value * 100) / 100;
  return Object.is(rounded, -0) ? "0" : String(rounded);
};
const operationLabel = (operation: Operation) =>
  operation.kind === "reflect"
    ? "Reflect in y-axis"
    : `${operation.amount >= 0 ? "Shift input right" : "Shift input left"} by ${Math.abs(operation.amount)}`;
const operationRule = (operation: Operation) =>
  operation.kind === "reflect"
    ? "x → -x"
    : `x → x ${operation.amount >= 0 ? "+" : "-"} ${Math.abs(operation.amount)}`;

function coefficients(operations: Operation[], enabled: boolean[]) {
  let p = 1;
  let q = 0;
  operations.forEach((operation, index) => {
    if (!enabled[index]) return;
    if (operation.kind === "reflect") {
      p *= -1;
    } else {
      q += p * operation.amount;
    }
  });
  const A = p * p;
  const B = 2 * p * q;
  const C = q * q - 1;
  return { p, q, A, B, C, vertex: -q / p };
}

function expanded({ A, B, C }: ReturnType<typeof coefficients>) {
  const bx =
    B === 0 ? "" : B > 0 ? ` + ${tidy(B)}x` : ` - ${tidy(Math.abs(B))}x`;
  const constant =
    C === 0 ? "" : C > 0 ? ` + ${tidy(C)}` : ` - ${tidy(Math.abs(C))}`;
  return `y = ${A === 1 ? "" : tidy(A)}x²${bx}${constant}`;
}

function OrderGraph({
  pipelineA,
  pipelineB,
  enabledA,
  enabledB,
  onShift,
  onInteraction,
}: {
  pipelineA: Operation[];
  pipelineB: Operation[];
  enabledA: boolean[];
  enabledB: boolean[];
  onShift: (value: number) => void;
  onInteraction: () => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const width = 398;
  const height = 320;
  const centerX = 199;
  const centerY = 176;
  const unit = 28;
  const px = (x: number) => centerX + x * unit;
  const py = (y: number) => centerY - y * unit;
  const resultA = coefficients(pipelineA, enabledA);
  const resultB = coefficients(pipelineB, enabledB);
  const path = (fn: (x: number) => number) => {
    const points: string[] = [];
    for (let index = 0; index <= 360; index += 1) {
      const x = -7 + index / 24;
      const y = fn(x);
      if (y < -5.2 || y > 7.2) continue;
      points.push(
        `${points.length ? "L" : "M"}${px(x).toFixed(2)},${py(y).toFixed(2)}`,
      );
    }
    return points.join(" ");
  };
  const parentPath = useMemo(() => path((x) => x * x - 1), []); // eslint-disable-line react-hooks/exhaustive-deps
  const pathA = useMemo(
    () => path((x) => (resultA.p * x + resultA.q) ** 2 - 1),
    [resultA.p, resultA.q], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const pathB = useMemo(
    () => path((x) => (resultB.p * x + resultB.q) ** 2 - 1),
    [resultB.p, resultB.q], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const pointer = (event: PointerEvent<SVGCircleElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const box = svg.getBoundingClientRect();
    const svgX = ((event.clientX - box.left) / box.width) * width;
    onShift(snap(clamp(-(svgX - centerX) / unit, -4, 4)));
  };
  const key = (event: KeyboardEvent<SVGCircleElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const current = -resultA.vertex;
    onShift(clamp(current + (event.key === "ArrowLeft" ? 0.5 : -0.5), -4, 4));
  };
  return (
    <svg
      ref={svgRef}
      className="to163-graph"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Transformation order graph comparison"
      onPointerDown={onInteraction}
    >
      <defs>
        <pattern
          id="to163-grid"
          width="28"
          height="28"
          patternUnits="userSpaceOnUse"
        >
          <path d="M28 0H0V28" fill="none" stroke="#e3e9ef" />
        </pattern>
        <marker
          id="to163-axis-arrow"
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0 0 6 3 0 6Z" fill="#263650" />
        </marker>
      </defs>
      <rect width={width} height={height} fill="url(#to163-grid)" />
      <line
        x1="5"
        x2="393"
        y1={centerY}
        y2={centerY}
        className="axis"
        markerEnd="url(#to163-axis-arrow)"
      />
      <line
        x1={centerX}
        x2={centerX}
        y1="316"
        y2="5"
        className="axis"
        markerEnd="url(#to163-axis-arrow)"
      />
      <text x="384" y={centerY - 9} className="axis-label">
        x
      </text>
      <text x={centerX + 9} y="15" className="axis-label">
        y
      </text>
      {[-6, -4, -2, 0, 2, 4, 6].map((tick) => (
        <text
          key={`x-${tick}`}
          x={px(tick)}
          y={centerY + 20}
          textAnchor="middle"
          className="tick"
        >
          {tick}
        </text>
      ))}
      {[-4, -2, 2, 4, 6].map((tick) => (
        <text
          key={`y-${tick}`}
          x={centerX - 11}
          y={py(tick) + 4}
          textAnchor="end"
          className="tick"
        >
          {tick}
        </text>
      ))}
      <path d={parentPath} className="parent" />
      <path d={pathA} className="pipeline-a" />
      <path d={pathB} className="pipeline-b" />
      <circle cx={px(resultA.vertex)} cy={py(-1)} r="6" className="vertex-a" />
      <circle cx={px(resultB.vertex)} cy={py(-1)} r="6" className="vertex-b" />
      <circle
        cx={px(resultA.vertex)}
        cy={py(-1)}
        r="15"
        className="drag-vertex"
        role="slider"
        tabIndex={0}
        aria-label="Drag Pipeline A vertex"
        aria-valuemin={-4}
        aria-valuemax={4}
        aria-valuenow={resultA.vertex}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          pointer(event);
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId))
            pointer(event);
        }}
        onKeyDown={key}
      />
    </svg>
  );
}

function PipelineCard({
  name,
  operations,
  enabled,
  onToggle,
  result,
  color,
}: {
  name: string;
  operations: Operation[];
  enabled: boolean[];
  onToggle: (index: number) => void;
  result: ReturnType<typeof coefficients>;
  color: "a" | "b";
}) {
  return (
    <aside className={`to163-pipeline ${color}`}>
      <header>
        <h3>{name}</h3>
        <p>
          Order:{" "}
          {operations
            .map((operation) =>
              operation.kind === "reflect" ? "Reflect" : "Shift",
            )
            .join(" → ")}
        </p>
      </header>
      {operations.map((operation, index) => (
        <section key={`${operation.kind}-${index}`}>
          <i>{index + 1}</i>
          <p>
            <b>{operationLabel(operation)}</b>
            <span>{operationRule(operation)}</span>
          </p>
          <button
            type="button"
            role="switch"
            aria-checked={enabled[index]}
            aria-label={`${name} step ${index + 1}`}
            onClick={() => onToggle(index)}
          >
            <span />
          </button>
        </section>
      ))}
      <footer>
        <h3>Result {color.toUpperCase()}</h3>
        <strong>{expanded(result)}</strong>
        <i />
        <dl>
          <dt>Vertex</dt>
          <dd>({tidy(result.vertex)}, -1)</dd>
          <dt>Axis</dt>
          <dd>x = {tidy(result.vertex)}</dd>
        </dl>
      </footer>
    </aside>
  );
}

const optionFrom = (value: string): Operation =>
  value === "reflect"
    ? { kind: "reflect" }
    : { kind: "shift", amount: Number(value.replace("shift", "")) };

export default function TransformationOrderTargetLesson163({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [pipelineA, setPipelineA] = useState<Operation[]>([
      { kind: "reflect" },
      { kind: "shift", amount: 1 },
    ]),
    [pipelineB, setPipelineB] = useState<Operation[]>([
      { kind: "shift", amount: 1 },
      { kind: "reflect" },
    ]),
    [enabledA, setEnabledA] = useState([true, true]),
    [enabledB, setEnabledB] = useState([true, true]),
    [stage, setStage] = useState<Stage>("Observe"),
    [tryA, setTryA] = useState(["reflect", "shift3"]),
    [tryB, setTryB] = useState(["shift3", "reflect"]),
    [workTab, setWorkTab] = useState<"Graph" | "Notes">("Graph"),
    [notes, setNotes] = useState(""),
    [status, setStatus] = useState("");
  const act = () => onInteraction();
  const resultA = coefficients(pipelineA, enabledA),
    resultB = coefficients(pipelineB, enabledB);
  const setShift = (value: number) => {
    setPipelineA((current) =>
      current.map((operation) =>
        operation.kind === "shift"
          ? { ...operation, amount: value }
          : operation,
      ),
    );
    setPipelineB((current) =>
      current.map((operation) =>
        operation.kind === "shift"
          ? { ...operation, amount: value }
          : operation,
      ),
    );
    act();
  };
  const reset = (notify = true) => {
    setPipelineA([{ kind: "reflect" }, { kind: "shift", amount: 1 }]);
    setPipelineB([{ kind: "shift", amount: 1 }, { kind: "reflect" }]);
    setEnabledA([true, true]);
    setEnabledB([true, true]);
    setStage("Observe");
    setTryA(["reflect", "shift3"]);
    setTryB(["shift3", "reflect"]);
    setWorkTab("Graph");
    setNotes("");
    setStatus("");
    if (notify) act();
  };
  useEffect(() => reset(false), [resetToken]); // eslint-disable-line react-hooks/exhaustive-deps
  const applyTry = () => {
    setPipelineA(tryA.map(optionFrom));
    setPipelineB(tryB.map(optionFrom));
    setEnabledA([true, true]);
    setEnabledB([true, true]);
    setStatus("Comparison applied");
    act();
  };
  const differs =
    Math.abs(resultA.vertex - resultB.vertex) > 1e-8 ||
    Math.abs(resultA.B - resultB.B) > 1e-8;
  return (
    <div
      className="to163-page"
      data-testid="graph-mockup-0220"
      data-dedicated-lesson="163"
      data-object-model="editable-noncommutative-two-pipeline-input-substitution-steps-pointer-keyboard-draggable-linked-vertices-generated-curves-equations-observation-table-custom-order-practice-notes-and-navigation"
      data-a-vertex={resultA.vertex}
      data-b-vertex={resultB.vertex}
      data-a-equation={expanded(resultA)}
      data-b-equation={expanded(resultB)}
      data-a-enabled={enabledA.join(",")}
      data-b-enabled={enabledB.join(",")}
      data-stage={stage}
      data-work-tab={workTab}
      data-different={differs}
    >
      <header className="to163-header">
        <h1>Transformation Order</h1>
        <p>Understand non-commutative sequences of transformations.</p>
        <nav>
          <b>
            Level: <span>Intermediate</span>
          </b>
          <b>
            Topic: <span>Transformations</span>
          </b>
          <b>
            ◷ Est. time: <span>10–12 min</span>
          </b>
          <b>
            Focus: <span>Understand &amp; apply</span>
          </b>
        </nav>
      </header>
      <nav className="to163-stages">
        {STAGES.map((name) => (
          <button
            type="button"
            key={name}
            className={stage === name ? "active" : ""}
            onClick={() => {
              setStage(name);
              act();
            }}
          >
            {name}
          </button>
        ))}
      </nav>
      <section className="to163-compare">
        <header>
          <h2>Compare two orders of the same transformations</h2>
          <button type="button" onClick={() => reset()}>
            <RotateCcw />
            Reset all
          </button>
        </header>
        <div>
          <PipelineCard
            name="Pipeline A"
            operations={pipelineA}
            enabled={enabledA}
            onToggle={(index) => {
              setEnabledA((current) =>
                current.map((value, i) => (i === index ? !value : value)),
              );
              act();
            }}
            result={resultA}
            color="a"
          />
          <article className="to163-live">
            <h2>
              Graph <small>(live)</small>
            </h2>
            <div className="to163-legend">
              <span>
                <i />
                Original y = x² - 1
              </span>
              <span>
                <i />
                Pipeline A
              </span>
              <span>
                <i />
                Pipeline B
              </span>
            </div>
            <OrderGraph
              pipelineA={pipelineA}
              pipelineB={pipelineB}
              enabledA={enabledA}
              enabledB={enabledB}
              onShift={setShift}
              onInteraction={act}
            />
            <footer>
              Base function: <b>f(x) = x² - 1</b>
            </footer>
          </article>
          <PipelineCard
            name="Pipeline B"
            operations={pipelineB}
            enabled={enabledB}
            onToggle={(index) => {
              setEnabledB((current) =>
                current.map((value, i) => (i === index ? !value : value)),
              );
              act();
            }}
            result={resultB}
            color="b"
          />
        </div>
      </section>
      <section className="to163-insights">
        <article>
          <h2>
            <Lightbulb />
            Observation
          </h2>
          <p>
            Applying the same transformations in a different order gives
            different results.
          </p>
          <table>
            <thead>
              <tr>
                <th>Same shape</th>
                <th>Same orientation</th>
                <th>Same position</th>
                <th>Same equation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Check />
                  Yes
                </td>
                <td>
                  <Check />
                  Yes
                </td>
                <td>
                  <X />
                  No
                </td>
                <td>
                  <X />
                  No
                </td>
              </tr>
            </tbody>
          </table>
          <footer>
            So, transformations are <b>non-commutative.</b>
          </footer>
        </article>
        <article>
          <h2>Key difference</h2>
          <table>
            <thead>
              <tr>
                <th />
                <th>Pipeline A</th>
                <th>Pipeline B</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Vertex</th>
                <td>({tidy(resultA.vertex)}, -1)</td>
                <td>({tidy(resultB.vertex)}, -1)</td>
              </tr>
              <tr>
                <th>Axis</th>
                <td>x = {tidy(resultA.vertex)}</td>
                <td>x = {tidy(resultB.vertex)}</td>
              </tr>
            </tbody>
          </table>
          <footer>✦ Positions are mirror images.</footer>
        </article>
      </section>
      <section className="to163-cards">
        <article>
          <h2>Worked example</h2>
          <p>
            Goal: Reflect in y-axis and then shift input by{" "}
            {Math.abs(pipelineA.find((op) => op.kind === "shift")?.amount ?? 1)}
            .
          </p>
          <ol>
            <li>
              Start with <b>f(x) = x² - 1</b>
            </li>
            <li>
              Reflect in y-axis <b>x → -x</b>
              <span>g(x) = f(-x) = x² - 1</span>
            </li>
            <li>
              Shift the reflected input
              <span>h(x) = {expanded(resultA).replace("y = ", "")}</span>
            </li>
          </ol>
          <footer>
            <b>Result: {expanded(resultA)}</b>
            <span>Vertex ({tidy(resultA.vertex)}, -1)</span>
          </footer>
        </article>
        <article>
          <h2>Understanding the rule</h2>
          <p>For transformations T₁ and T₂:</p>
          <strong>T₁(T₂(f(x))) ≠ T₂(T₁(f(x)))</strong>
          <p>Some pairs that do not commute:</p>
          <ul>
            <li>Reflect ↔ Shift</li>
            <li>Rotate ↔ Reflect</li>
            <li>Shear ↔ Shift</li>
          </ul>
          <footer>
            <Lightbulb />
            <p>
              <b>Tip</b>
              <span>
                A good habit: apply operations from inside to outside.
              </span>
            </p>
          </footer>
        </article>
        <article className="to163-try">
          <h2>Try it yourself</h2>
          <p>Your turn: Compare orders.</p>
          <b>Base function: f(x) = x² - 1</b>
          <fieldset>
            <legend>Pipeline A</legend>
            {tryA.map((value, index) => (
              <label key={index}>
                <i>{index + 1}</i>
                <select
                  aria-label={`Try Pipeline A step ${index + 1}`}
                  value={value}
                  onChange={(event) =>
                    setTryA((current) =>
                      current.map((item, i) =>
                        i === index ? event.target.value : item,
                      ),
                    )
                  }
                >
                  <option value="reflect">Reflect in y-axis (x → -x)</option>
                  <option value="shift1">Shift input by 1</option>
                  <option value="shift2">Shift input by 2</option>
                  <option value="shift3">Shift input by 3</option>
                  <option value="shift-1">Shift input left by 1</option>
                </select>
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend>Pipeline B</legend>
            {tryB.map((value, index) => (
              <label key={index}>
                <i>{index + 1}</i>
                <select
                  aria-label={`Try Pipeline B step ${index + 1}`}
                  value={value}
                  onChange={(event) =>
                    setTryB((current) =>
                      current.map((item, i) =>
                        i === index ? event.target.value : item,
                      ),
                    )
                  }
                >
                  <option value="reflect">Reflect in y-axis (x → -x)</option>
                  <option value="shift1">Shift input by 1</option>
                  <option value="shift2">Shift input by 2</option>
                  <option value="shift3">Shift input by 3</option>
                  <option value="shift-1">Shift input left by 1</option>
                </select>
              </label>
            ))}
          </fieldset>
          <button type="button" onClick={applyTry}>
            Apply &amp; Compare
          </button>
          {status && <output>{status}</output>}
        </article>
      </section>
      <section className="to163-practice">
        <article>
          <h2>Practice</h2>
          <p>Q1. For f(x) = x² - 1, compare the results of the two orders:</p>
          <div>
            <b>A: Reflect in y-axis, then shift input by 1.</b>
            <b>B: Shift input by 1, then reflect in y-axis.</b>
          </div>
          <p>a) Write the final equations for A and B.</p>
          <p>b) Do the graphs coincide? Why or why not?</p>
        </article>
        <article>
          <nav>
            <button
              type="button"
              className={workTab === "Graph" ? "active" : ""}
              onClick={() => {
                setWorkTab("Graph");
                act();
              }}
            >
              Graph
            </button>
            <button
              type="button"
              className={workTab === "Notes" ? "active" : ""}
              onClick={() => {
                setWorkTab("Notes");
                act();
              }}
            >
              Notes
            </button>
          </nav>
          {workTab === "Graph" ? (
            <p>Use the graph above or the pipelines to check your answer.</p>
          ) : (
            <textarea
              aria-label="Transformation order notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Record why the orders differ..."
            />
          )}
        </article>
      </section>
      <nav className="to163-nav">
        <a href="/lessons/graphs-and-functions/162-combined-transformations">
          <span>←</span>
          <p>
            <small>Previous</small>
            <b>Combined Transformations</b>
          </p>
        </a>
        <div>
          <small>Lesson progress</small>
          <i>
            <span />
          </i>
          <b>40%</b>
        </div>
        <a href="/lessons/graphs-and-functions/164-parameter-explorer">
          <p>
            <small>Next</small>
            <b>Parameter Explorer</b>
          </p>
          <span>→</span>
        </a>
      </nav>
    </div>
  );
}
