import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Shuffle,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./PiecewiseModelsTargetLesson611.css";

type Rule = { slope: number; intercept: number; text: string };
type DragKey = "left" | "right" | null;

const defaults = {
  left: -1,
  right: 3,
  rules: [
    { slope: 1, intercept: 4, text: "x + 4" },
    { slope: 0, intercept: 3, text: "3" },
    { slope: 1, intercept: -4, text: "x - 4" },
  ] as Rule[],
};

const parseRule = (text: string, fallback: Rule): Rule => {
  const value = text.toLowerCase().replace(/\s+/g, "").replace(/\*/g, "");
  if (/^[+-]?\d*\.?\d+$/.test(value))
    return { slope: 0, intercept: Number(value), text };
  const match = value.match(/^([+-]?\d*\.?\d*)x(?:([+-]\d*\.?\d+))?$/);
  if (!match) return { ...fallback, text };
  const slope =
    match[1] === "" || match[1] === "+"
      ? 1
      : match[1] === "-"
        ? -1
        : Number(match[1]);
  return { slope, intercept: match[2] ? Number(match[2]) : 0, text };
};

const show = (value: number) =>
  Number.isInteger(value)
    ? String(value)
    : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");

export default function PiecewiseModelsTargetLesson611({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [left, setLeft] = useState(defaults.left);
  const [right, setRight] = useState(defaults.right);
  const [rules, setRules] = useState<Rule[]>(defaults.rules);
  const [closed, setClosed] = useState([true, false, true, false]);
  const [evaluateAt, setEvaluateAt] = useState(2);
  const [drag, setDrag] = useState<DragKey>(null);
  const [tab, setTab] = useState("Interact");
  const [challenge, setChallenge] = useState(["", "", ""]);
  const [graded, setGraded] = useState<boolean | null>(null);
  const [hint, setHint] = useState(false);
  const [actions, setActions] = useState(0);

  const reset = () => {
    setLeft(defaults.left);
    setRight(defaults.right);
    setRules(defaults.rules);
    setClosed([true, false, true, false]);
    setEvaluateAt(2);
    setDrag(null);
    setTab("Interact");
    setChallenge(["", "", ""]);
    setGraded(null);
    setHint(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (update: () => void) => {
    update();
    setActions((value) => value + 1);
    onInteraction();
  };
  const atRule = (index: number, x: number) =>
    rules[index].slope * x + rules[index].intercept;
  const intervalMatches = (index: number, x: number) => {
    if (index === 0) return x < left || (closed[0] && x === left);
    if (index === 1)
      return (
        (x > left || (closed[1] && x === left)) &&
        (x < right || (closed[2] && x === right))
      );
    return x > right || (closed[3] && x === right);
  };
  const evaluate = (x: number) => {
    const index = [0, 1, 2].find((candidate) => intervalMatches(candidate, x));
    return index === undefined ? null : atRule(index, x);
  };
  const current = evaluate(evaluateAt);
  const leftValues = [atRule(0, left), atRule(1, left)];
  const rightValues = [atRule(1, right), atRule(2, right)];
  const leftContinuous = Math.abs(leftValues[0] - leftValues[1]) < 1e-8;
  const rightContinuous = Math.abs(rightValues[0] - rightValues[1]) < 1e-8;
  const rows = [-5, left, 0, evaluateAt, right, 4, 8]
    .filter((x, index, values) => values.indexOf(x) === index)
    .sort((a, b) => a - b)
    .map((x) => ({ x, y: evaluate(x) }));
  const px = (x: number) => 25 + ((x + 10) / 20) * 365;
  const py = (y: number) => 245 - ((y + 6) / 12) * 220;
  const pathFor = (index: number, from: number, to: number) =>
    Array.from({ length: 81 }, (_, point) => from + ((to - from) * point) / 80)
      .map((x, point) => `${point ? "L" : "M"}${px(x)},${py(atRule(index, x))}`)
      .join(" ");
  const paths = [
    pathFor(0, -10, left),
    pathFor(1, left, right),
    pathFor(2, right, 10),
  ];
  const setBreakpoint = (key: Exclude<DragKey, null>, value: number) => {
    if (key === "left")
      setLeft(Math.min(right - 1, Math.max(-8, Math.round(value))));
    else setRight(Math.max(left + 1, Math.min(8, Math.round(value))));
  };
  const move = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!drag) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = -10 + ((event.clientX - rect.left) / rect.width) * 20;
    act(() => setBreakpoint(drag, x));
  };
  const randomize = () =>
    act(() => {
      const nextLeft = left === -2 ? -1 : -2;
      const nextRight = right === 4 ? 3 : 4;
      setLeft(nextLeft);
      setRight(nextRight);
      setRules([
        { slope: 1, intercept: 2, text: "x + 2" },
        { slope: 0, intercept: 1, text: "1" },
        { slope: -1, intercept: 6, text: "-x + 6" },
      ]);
      setClosed([true, false, true, false]);
    });
  const updateRule = (index: number, text: string) =>
    act(() =>
      setRules((currentRules) =>
        currentRules.map((rule, candidate) =>
          candidate === index ? parseRule(text, rule) : rule,
        ),
      ),
    );
  const check = () =>
    act(() =>
      setGraded(
        Number(challenge[0]) === 0 &&
          Number(challenge[1]) === -6 &&
          Number(challenge[2]) === 4,
      ),
    );
  const intervalLabels = [
    `x ${closed[0] ? "≤" : "<"} ${left}`,
    `${left} ${closed[1] ? "≤" : "<"} x ${closed[2] ? "≤" : "<"} ${right}`,
    `x ${closed[3] ? "≥" : ">"} ${right}`,
  ];
  const endpointButtons = [
    { label: `Endpoint at ${left}`, closedIndex: 0, alternateIndex: 1 },
    { label: `Left endpoint at ${left}`, closedIndex: 1, alternateIndex: 0 },
    { label: `Right endpoint at ${right}`, closedIndex: 2, alternateIndex: 3 },
    { label: `Endpoint at ${right}`, closedIndex: 3, alternateIndex: 2 },
  ];
  const setEndpoint = (
    closedIndex: number,
    alternateIndex: number,
    value: boolean,
  ) =>
    act(() =>
      setClosed((current) =>
        current.map((item, index) =>
          index === closedIndex
            ? value
            : index === alternateIndex
              ? !value
              : item,
        ),
      ),
    );
  const endpoint = (
    x: number,
    y: number,
    isClosed: boolean,
    color: string,
    key: string,
  ) => (
    <circle
      key={key}
      cx={px(x)}
      cy={py(y)}
      r="4.5"
      fill={isClosed ? color : "#07142a"}
      stroke={color}
      strokeWidth="2"
    />
  );

  return (
    <section
      className="pw611-page"
      data-testid="finance-mockup-0668"
      data-object-model="dedicated-draggable-interval-rule-endpoint-piecewise-model"
      data-left={left}
      data-right={right}
      data-value={current === null ? "undefined" : show(current)}
      data-left-continuous={leftContinuous}
      data-right-continuous={rightContinuous}
      data-rules={rules
        .map((rule) => `${rule.slope},${rule.intercept}`)
        .join("|")}
      data-closed={closed.map(Number).join("")}
      data-dragging={drag ?? ""}
      data-graded={graded === null ? "" : graded}
      data-actions={actions}
    >
      <header className="pw611-hero">
        <div className="pw611-badges">
          <b>DISCRETE AND APPLIED MATHEMATICS</b>
          <b>FINANCIAL MATHEMATICS AND MODELLING</b>
        </div>
        <h1>611 Piecewise Models</h1>
        <p>
          <b>Objective:</b> Represent rule changes using piecewise functions,
          identify intervals and endpoints,
          <br />
          and evaluate, graph, and interpret piecewise models.
        </p>
        <dl>
          <dt>Difficulty</dt>
          <dd>Intermediate</dd>
          <dt>Estimated time</dt>
          <dd>20-30 min</dd>
          <dt>Skills</dt>
          <dd>
            Piecewise functions, intervals,
            <br />
            continuity, modelling
          </dd>
        </dl>
        <nav>
          {["Interact", "Learn", "Worked Example", "Formula", "Practice"].map(
            (name) => (
              <button
                key={name}
                className={tab === name ? "active" : ""}
                onClick={() => act(() => setTab(name))}
              >
                {name}
              </button>
            ),
          )}
        </nav>
      </header>
      {tab !== "Interact" && (
        <p className="pw611-tabnote">
          <b>{tab}:</b> Select the rule whose interval contains the input, then
          substitute.
        </p>
      )}
      <ol className="pw611-sequence">
        {[
          ["Observe", "See the model"],
          ["Manipulate", "Adjust breakpoints"],
          ["Notice the pattern", "What’s changing?"],
          ["Understand the rule", "How piecewise works"],
          ["Try independently", "Test your skills"],
        ].map(([title, sub], index) => (
          <li className={index === 1 ? "active" : ""} key={title}>
            <i>{index + 1}</i>
            <span>
              <b>{title}</b>
              <small>{sub}</small>
            </span>
            {index < 4 && <ChevronRight />}
          </li>
        ))}
      </ol>
      <section className="pw611-builder">
        <article className="pw611-graphcard">
          <header>
            <div>
              <h2>Piecewise Function Builder</h2>
              <p>
                Drag breakpoints or edit rules. Watch the graph and readouts
                update in real time.
              </p>
            </div>
            <span>
              <button onClick={() => act(reset)}>
                <RotateCcw /> Reset
              </button>
              <button onClick={randomize}>
                <Shuffle /> Randomize
              </button>
            </span>
          </header>
          <div className="pw611-graphwrap">
            <svg
              viewBox="0 0 415 270"
              aria-label="Interactive piecewise function graph"
              onPointerMove={move}
              onPointerUp={() => setDrag(null)}
              onPointerLeave={() => setDrag(null)}
            >
              {Array.from({ length: 13 }, (_, index) => -6 + index).map((y) => (
                <line
                  className="grid"
                  key={`h${y}`}
                  x1="25"
                  x2="390"
                  y1={py(y)}
                  y2={py(y)}
                />
              ))}
              {Array.from({ length: 21 }, (_, index) => -10 + index).map(
                (x) => (
                  <line
                    className="grid"
                    key={`v${x}`}
                    x1={px(x)}
                    x2={px(x)}
                    y1="25"
                    y2="245"
                  />
                ),
              )}
              <line className="axis" x1="20" x2="398" y1={py(0)} y2={py(0)} />
              <line className="axis" x1={px(0)} x2={px(0)} y1="18" y2="250" />
              {[-10, -8, -6, -4, -2, 2, 4, 6, 8, 10].map((x) => (
                <text key={x} x={px(x) - 5} y={py(0) + 14}>
                  {x}
                </text>
              ))}
              {[-6, -4, -2, 2, 4, 6].map((y) => (
                <text key={y} x={px(0) - 15} y={py(y) + 3}>
                  {y}
                </text>
              ))}
              <path className="one" d={paths[0]} />
              <path className="two" d={paths[1]} />
              <path className="three" d={paths[2]} />
              {endpoint(left, leftValues[0], closed[0], "#13bce8", "l1")}
              {endpoint(left, leftValues[1], closed[1], "#ff920d", "l2")}
              {endpoint(right, rightValues[0], closed[2], "#ff920d", "r1")}
              {endpoint(right, rightValues[1], closed[3], "#9f4fe6", "r2")}
              <line
                className="dragline"
                x1={px(left)}
                x2={px(left)}
                y1="24"
                y2="245"
                onPointerDown={() => setDrag("left")}
              />
              <line
                className="dragline"
                x1={px(right)}
                x2={px(right)}
                y1="24"
                y2="245"
                onPointerDown={() => setDrag("right")}
              />
            </svg>
          </div>
          <div className="pw611-legend">
            {rules.map((rule, index) => (
              <span key={index}>
                <i /> f(x) = {rule.text}
                <small>for {intervalLabels[index]}</small>
              </span>
            ))}
          </div>
          <section className="pw611-diagnostics">
            <h3>Continuity at breakpoints</h3>
            <p>
              <b>At x = {left}</b>
              <span>Left: {show(leftValues[0])}</span>
              <span>Right: {show(leftValues[1])}</span>
              <strong className={leftContinuous ? "ok" : "bad"}>
                {leftContinuous ? "Continuous ✓" : "Jump discontinuity △"}
              </strong>
            </p>
            <p>
              <b>At x = {right}</b>
              <span>Left: {show(rightValues[0])}</span>
              <span>Right: {show(rightValues[1])}</span>
              <strong className={rightContinuous ? "ok" : "bad"}>
                {rightContinuous ? "Continuous ✓" : "Jump discontinuity △"}
              </strong>
            </p>
          </section>
          <section className="pw611-domain">
            <h3>Domain and Range</h3>
            <span>Domain: &nbsp; (-∞, ∞)</span>
            <span>Range: &nbsp; computed from all active rules</span>
          </section>
        </article>
        <article className="pw611-rules">
          <h2>Intervals &amp; Rules</h2>
          {rules.map((rule, index) => {
            const controls =
              index === 0
                ? [endpointButtons[0]]
                : index === 1
                  ? [endpointButtons[1], endpointButtons[2]]
                  : [endpointButtons[3]];
            return (
              <section key={index}>
                <header>
                  <b>Interval {index + 1}</b>
                  <strong>{intervalLabels[index]}</strong>
                  <Trash2 />
                </header>
                <label>
                  Rule
                  <input
                    aria-label={`Rule ${index + 1}`}
                    value={rule.text}
                    onChange={(event) => updateRule(index, event.target.value)}
                  />
                </label>
                {controls.map((control) => (
                  <fieldset key={control.label}>
                    <legend>{control.label}</legend>
                    <button
                      className={closed[control.closedIndex] ? "active" : ""}
                      onClick={() =>
                        setEndpoint(
                          control.closedIndex,
                          control.alternateIndex,
                          true,
                        )
                      }
                    >
                      ● &nbsp; Closed
                    </button>
                    <button
                      className={!closed[control.closedIndex] ? "active" : ""}
                      onClick={() =>
                        setEndpoint(
                          control.closedIndex,
                          control.alternateIndex,
                          false,
                        )
                      }
                    >
                      ○ &nbsp; Open
                    </button>
                  </fieldset>
                ))}
              </section>
            );
          })}
          <footer>
            <b>Breakpoints</b>
            <label>
              <input
                aria-label="Left breakpoint"
                type="number"
                value={left}
                min="-8"
                max={right - 1}
                onChange={(event) =>
                  act(() => setBreakpoint("left", Number(event.target.value)))
                }
              />
            </label>
            <label>
              <input
                aria-label="Right breakpoint"
                type="number"
                value={right}
                min={left + 1}
                max="8"
                onChange={(event) =>
                  act(() => setBreakpoint("right", Number(event.target.value)))
                }
              />
            </label>
            <span>Drag to move</span>
            <ChevronLeft />
            <ChevronRight />
          </footer>
        </article>
        <article className="pw611-evaluate">
          <h2>Evaluate &amp; Explore</h2>
          <p>Evaluate f(x) at any value.</p>
          <label>
            <b>x</b>
            <input
              aria-label="Evaluate x"
              type="number"
              value={evaluateAt}
              min="-10"
              max="10"
              onChange={(event) =>
                act(() => setEvaluateAt(Number(event.target.value)))
              }
            />
            <input
              aria-label="Evaluate x slider"
              type="range"
              min="-10"
              max="10"
              value={evaluateAt}
              onChange={(event) =>
                act(() => setEvaluateAt(Number(event.target.value)))
              }
            />
            <small>
              <span>-10</span>
              <span>10</span>
            </small>
          </label>
          <output>
            f({evaluateAt}) = {current === null ? "undefined" : show(current)}
          </output>
          <section>
            <h3>Step-by-step</h3>
            <p>
              {current === null ? (
                `No interval includes x = ${evaluateAt}.`
              ) : (
                <>
                  2 lies in the interval{" "}
                  {
                    intervalLabels[
                      [0, 1, 2].find((index) =>
                        intervalMatches(index, evaluateAt),
                      ) ?? 0
                    ]
                  }
                  .<br />
                  <br />
                  Use the rule f(x) ={" "}
                  {
                    rules[
                      [0, 1, 2].find((index) =>
                        intervalMatches(index, evaluateAt),
                      ) ?? 0
                    ].text
                  }
                  .<br />
                  <br />
                  Therefore, f({evaluateAt}) = {show(current)}.
                </>
              )}
            </p>
          </section>
          <h3>Sample values</h3>
          <table>
            <thead>
              <tr>
                <th>x</th>
                <th>f(x)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  className={row.x === evaluateAt ? "active" : ""}
                  key={row.x}
                >
                  <td>{row.x}</td>
                  <td>{row.y === null ? "-" : show(row.y)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </section>
      <section className="pw611-theory">
        <article>
          <h2>Worked Example</h2>
          <p>Graph and evaluate the function</p>
          <strong>
            f(x) = &#123; x + 4, &nbsp; x ≤ −1
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3, &nbsp; −1 &lt; x
            ≤ 3<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;x − 4, &nbsp; x &gt;
            3
          </strong>
          <p>Find f(−2), f(1), and f(6).</p>
          <h3>Solution:</h3>
          <p>• f(−2): use x + 4 → f(−2) = 2</p>
          <p>• f(1): use 3 → f(1) = 3</p>
          <p>• f(6): use x − 4 → f(6) = 2</p>
          <aside>✓ Matches the interactive model.</aside>
        </article>
        <article>
          <h2>Key Rule / Definition</h2>
          <h3>Definition (Piecewise Function)</h3>
          <p>A function defined by different rules over different intervals.</p>
          <strong>
            f(x) = &#123; f₁(x), &nbsp; x ∈ I₁
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;f₂(x), &nbsp; x ∈ I₂
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⋮
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;fₙ(x), &nbsp; x ∈ Iₙ
          </strong>
          <h3>Rules:</h3>
          <p>
            • Intervals should not overlap.
            <br />• Endpoints must be specified (open/closed).
            <br />• Continuity requires equal one-sided limits.
          </p>
        </article>
        <aside>
          <article>
            <h2>⚠ Common Misconception</h2>
            <p>Using the wrong rule at a breakpoint.</p>
            <p>
              At x = 3, the middle interval includes 3, so f(3) = 3, not −1.
            </p>
            <div className="pw611-numberline">
              <ChevronLeft />
              <i />
              <i />
              <i />
              <ChevronRight />
            </div>
          </article>
          <article className="pw611-challenge">
            <h2>Quick Challenge</h2>
            <p>Let g(x) = &#123; 2x, x ≤ 0; &nbsp; x², x &gt; 0</p>
            <p>Find g(0), g(−3), g(2).</p>
            <div>
              {["g(0)", "g(-3)", "g(2)"].map((label, index) => (
                <label key={label}>
                  {label}
                  <input
                    aria-label={`Challenge ${label}`}
                    value={challenge[index]}
                    onChange={(event) =>
                      act(() =>
                        setChallenge((values) =>
                          values.map((value, candidate) =>
                            candidate === index ? event.target.value : value,
                          ),
                        ),
                      )
                    }
                  />
                </label>
              ))}
            </div>
            <button onClick={check}>Check Answer</button>
            <button
              className="link"
              onClick={() => act(() => setHint((value) => !value))}
            >
              Hint
            </button>
            {graded !== null && (
              <output className={graded ? "correct" : ""}>
                {graded
                  ? "Correct: 0, -6, 4."
                  : "Check the interval before substituting."}
              </output>
            )}
            {hint && (
              <small>
                Zero belongs to the first rule because its endpoint is closed.
              </small>
            )}
          </article>
        </aside>
      </section>
      <nav className="pw611-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/610-periodic-models">
          <ChevronLeft />
          <span>
            <b>Previous Lesson</b>Periodic Models
          </span>
        </a>
        <span>Lesson 611 of Discrete and Applied Mathematics</span>
        <a href="/lessons/discrete-and-applied-mathematics/612-parameter-estimation">
          <span>
            <b>Next Lesson</b>Parameter Estimation
          </span>
          <ChevronRight />
        </a>
      </nav>
    </section>
  );
}
