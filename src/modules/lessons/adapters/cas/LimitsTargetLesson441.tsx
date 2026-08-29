import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  Hand,
  Lightbulb,
  Maximize2,
  RefreshCw,
  Target,
  TriangleAlert,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
  type RefObject,
} from "react";
import type { LessonAdapterProps } from "../../types";
import "./LimitsTargetLesson441.css";

type Direction = "both" | "left" | "right";
type Feedback = "idle" | "correct" | "incorrect";
const STEPS = [0.5, 0.1, 0.01],
  EXAMPLES = [2, 3, 4, 5];
export default function LimitsTargetLesson441({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [expression, setExpression] = useState("(x^2-4)/(x-2)"),
    [point, setPoint] = useState(2),
    [direction, setDirection] = useState<Direction>("both"),
    [step, setStep] = useState(0.1),
    [places, setPlaces] = useState(6),
    [actions, setActions] = useState(0),
    [practice, setPractice] = useState(""),
    [feedback, setFeedback] = useState<Feedback>("idle"),
    [challengeDone, setChallengeDone] = useState(false);
  const model = useMemo(
      () => limitModel(expression, point, step),
      [expression, point, step],
    ),
    graphRef = useRef<SVGSVGElement>(null);
  const act = (run: () => void) => {
    run();
    setActions((v) => v + 1);
    onInteraction();
  };
  useEffect(() => {
    setExpression("(x^2-4)/(x-2)");
    setPoint(2);
    setDirection("both");
    setStep(0.1);
    setPlaces(6);
    setActions(0);
    setPractice("");
    setFeedback("idle");
    setChallengeDone(false);
  }, [resetToken]);
  const setExample = (a: number) =>
      act(() => {
        setPoint(a);
        setExpression(`(x^2-${a * a})/(x-${a})`);
      }),
    check = () =>
      act(() => {
        const correct = Math.abs(Number(practice) - 6) < 1e-8;
        setFeedback(correct ? "correct" : "incorrect");
        setChallengeDone(correct);
      });
  const drag = (event: PointerEvent<SVGCircleElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    move = (event: PointerEvent<SVGCircleElement>) => {
      if (
        !event.currentTarget.hasPointerCapture(event.pointerId) ||
        !graphRef.current
      )
        return;
      const box = graphRef.current.getBoundingClientRect(),
        x = -2 + ((event.clientX - box.left) / box.width) * 7,
        next = Math.max(-1, Math.min(4, Math.round(x * 2) / 2));
      if (next !== point) setExample(next);
    };
  return (
    <section
      className="lm441-page"
      data-testid="symbolic-cas-mockup-0347"
      data-dedicated-lesson="441"
      data-object-model="editable-rational-one-sided-table-draggable-hole-limit-practice"
      data-point={point}
      data-expression={expression}
      data-limit={Number.isFinite(model.limit) ? model.limit : "DNE"}
      data-direction={direction}
      data-step={step}
      data-places={places}
      data-actions={actions}
      data-feedback={feedback}
    >
      <h2 className="sr-only">Limits</h2>
      <nav className="lm441-tabs">
        <button className="active" data-lesson-control="limit-tab-interaction">
          <Eye /> Interaction + visualization
        </button>
        <button data-lesson-control="limit-tab-explain">Explain</button>
        <button data-lesson-control="limit-tab-examples">Examples</button>
        <button data-lesson-control="limit-tab-formulas">Formulas</button>
        <button data-lesson-control="limit-tab-more">Know more</button>
      </nav>
      <section className="lm441-work">
        <header>
          <span>
            <h2>Work directly on the model</h2>
            <b>CAS engine</b>
          </span>
          <strong>● &nbsp; All synced</strong>
          <em>{actions} actions</em>
          <button
            data-lesson-control="limit-fullscreen"
            onClick={() =>
              act(() => document.documentElement.requestFullscreen?.())
            }
          >
            <Maximize2 />
          </button>
        </header>
        <div className="lm441-main">
          <aside className="lm441-controls">
            <h3>MODEL CONTROLS</h3>
            <label>
              Expression f(x)
              <input
                data-lesson-control="limit-expression"
                aria-label="Limit expression"
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
              />
            </label>
            <label>
              Limit point a
              <input
                type="number"
                data-lesson-control="limit-point"
                aria-label="Limit point"
                value={point}
                onChange={(e) => setPoint(Number(e.target.value))}
              />
            </label>
            <b>Approach from</b>
            <div>
              {(["both", "left", "right"] as Direction[]).map((value) => (
                <button
                  key={value}
                  className={direction === value ? "active" : ""}
                  data-lesson-control={`limit-direction-${value}`}
                  onClick={() => act(() => setDirection(value))}
                >
                  {value === "both"
                    ? "Both sides"
                    : value === "left"
                      ? "Left (-)"
                      : "Right (+)"}
                </button>
              ))}
            </div>
            <label>
              Table step (h)
              <select
                data-lesson-control="limit-step"
                value={step}
                onChange={(e) => act(() => setStep(Number(e.target.value)))}
              >
                {STEPS.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
            <label>
              Decimal places
              <select
                data-lesson-control="limit-places"
                value={places}
                onChange={(e) => act(() => setPlaces(Number(e.target.value)))}
              >
                {[3, 4, 6].map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
            <button
              data-lesson-control="limit-update"
              onClick={() => act(() => {})}
            >
              Update model
            </button>
            <button
              data-lesson-control="limit-random"
              onClick={() =>
                setExample(
                  EXAMPLES[
                    (EXAMPLES.indexOf(point) + 1 + EXAMPLES.length) %
                      EXAMPLES.length
                  ],
                )
              }
            >
              <RefreshCw /> Random example
            </button>
            <article>
              <h3>
                <Check /> Result
              </h3>
              <strong>
                lim x→{point} f(x) = {fmt(model.limit, places)}
              </strong>
              <p>Left → {fmt(model.limit, places)}</p>
              <p>Right → {fmt(model.limit, places)}</p>
            </article>
          </aside>
          <section className="lm441-table">
            <h3>TWO-SIDED TABLE (x → {point})</h3>
            <table>
              <thead>
                <tr>
                  <th>x</th>
                  <th>f(x)</th>
                  <th>Δx = x - {point}</th>
                </tr>
              </thead>
              <tbody>
                {model.rows
                  .filter(
                    (row) => direction === "both" || row.side === direction,
                  )
                  .map((row, index) => (
                    <tr key={`${row.x}-${index}`} className={row.side}>
                      <td>
                        {row.side === "left" ? "←" : "→"}{" "}
                        {fmt(row.x, Math.max(2, places - 2))}
                      </td>
                      <td>{row.atPoint ? "undefined" : fmt(row.y, places)}</td>
                      <td>{fmt(row.x - point, places)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <footer>
              <p>→ Approach from left (x &lt; {point})</p>
              <p>→ Approach from right (x &gt; {point})</p>
              <p>● Point of interest (x = {point})</p>
            </footer>
          </section>
          <section className="lm441-graph">
            <h3>GRAPH VIEW</h3>
            <p>f(x) = {expression}</p>
            <LimitGraph
              graphRef={graphRef}
              point={point}
              limit={model.limit}
              onPointerDown={drag}
              onPointerMove={move}
            />
            <footer>━ Function f(x) &nbsp; -- x={point} (not in domain)</footer>
          </section>
          <aside className="lm441-learn">
            <h3>LEARN THE PROCESS</h3>
            {[
              [
                Eye,
                "1 Observe",
                "See how f(x) behaves near x=a from both sides.",
              ],
              [
                Hand,
                "2 Manipulate",
                "Change the expression, limit point, or step size.",
              ],
              [
                Lightbulb,
                "3 Notice",
                "Both sides approach the same value even through a hole.",
              ],
              [
                Target,
                "4 Understand",
                "The limit depends on behavior near a, not on the value at a.",
              ],
            ].map(([Icon, title, text]) => (
              <article key={String(title)}>
                <Icon />
                <span>
                  <b>{String(title)}</b>
                  <p>{String(text)}</p>
                </span>
              </article>
            ))}
            <article className="mistake">
              <h3>
                <TriangleAlert /> COMMON MISCONCEPTION
              </h3>
              <p>
                Thinking the limit equals the function value at that point. A
                hole may be undefined while the limit exists.
              </p>
              <b>Always check both sides!</b>
            </article>
          </aside>
        </div>
      </section>
      <section className="lm441-info">
        <article>
          <h3>IMMEDIATE FEEDBACK</h3>
          <p>
            <Check /> Great! The left-hand and right-hand values agree.
          </p>
          <b>Why undefined at x = {point}?</b>
          <p>Because x-{point}=0 makes the denominator zero.</p>
        </article>
        <article>
          <h3>WORKED EXAMPLE</h3>
          <p>
            Factor the numerator, cancel x-{point} for x≠{point}, then
            substitute x={point}.
          </p>
          <strong>Limit exists and equals {fmt(model.limit, 3)}.</strong>
        </article>
        <article>
          <h3>KEY LIMIT RULE</h3>
          <p>
            A two-sided limit exists exactly when both one-sided limits agree.
          </p>
          <strong>lim f(x) = L ⇔ lim⁻ f(x) = L = lim⁺ f(x)</strong>
        </article>
      </section>
      <section className="lm441-practice">
        <header>
          <h3>PRACTICE CHALLENGE</h3>
          <span>Your turn! Try a similar limit.</span>
        </header>
        <div>
          <article>
            <b>Evaluate the limit.</b>
            <strong>lim x→3 (x²-9)/(x-3)</strong>
            <label>
              Your answer
              <input
                data-lesson-control="limit-practice-answer"
                value={practice}
                onChange={(e) => setPractice(e.target.value)}
              />
            </label>
            <button data-lesson-control="limit-practice-check" onClick={check}>
              Check answer
            </button>
          </article>
          <article>
            <b>Try this strategy</b>
            <p>1 Factor x²-9=(x-3)(x+3)</p>
            <p>2 Cancel (x-3), x≠3</p>
            <p>3 Substitute x=3</p>
            <table>
              <tbody>
                <tr>
                  <td>2.9</td>
                  <td>5.9</td>
                </tr>
                <tr>
                  <td>2.99</td>
                  <td>5.99</td>
                </tr>
                <tr>
                  <td>3.01</td>
                  <td>6.01</td>
                </tr>
              </tbody>
            </table>
          </article>
          <article className={challengeDone ? "done" : ""}>
            <h2>{challengeDone ? "Well done!" : "Check both sides"}</h2>
            <strong>lim = {challengeDone ? "6" : "?"}</strong>
            <p>
              {feedback === "incorrect"
                ? "Factor before substituting."
                : "The simplified function is x+3 for x≠3."}
            </p>
            <button
              data-lesson-control="limit-new-challenge"
              onClick={() =>
                act(() => {
                  setPractice("");
                  setFeedback("idle");
                  setChallengeDone(false);
                })
              }
            >
              New challenge
            </button>
          </article>
        </div>
      </section>
      <nav className="lm441-nav">
        <a href="/lessons/symbolic-mathematics/440-integrals">
          <ArrowLeft />
          <span>
            <small>Previous</small>Integrals
          </span>
        </a>
        <a href="/lessons/symbolic-mathematics/442-series-expansions">
          <span>
            <small>Next</small>Series Expansions
          </span>
          <ArrowRight />
        </a>
      </nav>
    </section>
  );
}
const LimitGraph = ({
  graphRef,
  point,
  limit,
  onPointerDown,
  onPointerMove,
}: {
  graphRef: RefObject<SVGSVGElement | null>;
  point: number;
  limit: number;
  onPointerDown: (e: PointerEvent<SVGCircleElement>) => void;
  onPointerMove: (e: PointerEvent<SVGCircleElement>) => void;
}) => {
  const sx = (x: number) => 38 + ((x + 2) / 7) * 250,
    sy = (y: number) => 165 - ((y - 1) / 8) * 145,
    path = Array.from({ length: 80 }, (_, i) => {
      const x = -2 + (i * 7) / 79,
        y = x + point;
      return `${i ? "L" : "M"}${sx(x)} ${sy(y)}`;
    }).join(" ");
  return (
    <svg
      ref={graphRef}
      viewBox="0 0 320 250"
      role="img"
      aria-label="Graph with draggable hole at the limit point"
    >
      <g stroke="#e3e9ef">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <line key={i} x1={38 + i * 36} y1="20" x2={38 + i * 36} y2="220" />
        ))}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line key={i} x1="25" y1={35 + i * 35} x2="300" y2={35 + i * 35} />
        ))}
      </g>
      <line x1="25" y1="165" x2="300" y2="165" stroke="#718096" />
      <line x1="110" y1="15" x2="110" y2="225" stroke="#718096" />
      <line
        x1={sx(point)}
        y1="20"
        x2={sx(point)}
        y2="220"
        stroke="#39a7ef"
        strokeDasharray="5 4"
      />
      <path d={path} fill="none" stroke="#7437eb" strokeWidth="3" />
      {Number.isFinite(limit) && (
        <>
          <circle
            cx={sx(point)}
            cy={sy(limit)}
            r="7"
            fill="white"
            stroke="#ef304a"
            strokeWidth="3"
            data-lesson-control="limit-hole"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            style={{ cursor: "ew-resize", touchAction: "none" }}
          />
          <text
            x={Math.min(225, sx(point) + 10)}
            y={sy(limit) - 12}
            fill="#7437eb"
          >
            Hole at ({point}, {fmt(limit, 2)})
          </text>
        </>
      )}
    </svg>
  );
};
function limitModel(expression: string, point: number, step: number) {
  const match = expression
      .replaceAll(" ", "")
      .match(/^\(x\^2-(-?\d+(?:\.\d+)?)\)\/\(x-(-?\d+(?:\.\d+)?)\)$/),
    constant = match ? Number(match[1]) : point * point,
    denominatorRoot = match ? Number(match[2]) : point,
    removable =
      Math.abs(constant - point * point) < 1e-8 &&
      Math.abs(denominatorRoot - point) < 1e-8,
    limit = removable ? 2 * point : Number.NaN,
    offsets = [-4, -3, -2, -1, -0.1, 0, 0.1, 1, 2, 3, 4].map((v) => v * step),
    rows = offsets.map((offset) => {
      const x = point + offset;
      return {
        x,
        y: offset === 0 ? NaN : (x * x - constant) / (x - denominatorRoot),
        side: offset < 0 ? ("left" as const) : ("right" as const),
        atPoint: offset === 0,
      };
    });
  return { limit, rows };
}
function fmt(value: number, places: number) {
  return Number.isFinite(value)
    ? value.toFixed(places).replace(/\.0+$/, ".0")
    : "DNE";
}
