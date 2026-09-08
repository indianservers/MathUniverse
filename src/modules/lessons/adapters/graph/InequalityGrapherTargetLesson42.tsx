import {
  ArrowDown,
  ArrowUp,
  Expand,
  Maximize2,
  Minus,
  Move,
  RotateCcw,
  Share2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import {
  DEFAULT_INEQUALITY_RULES,
  inequalityGraphPosition,
  inequalityLabel,
  inequalityLinePoints,
  inequalityPointFromPixels,
  inequalityRegionPolygon,
  inequalitySystemResult,
  type InequalityRule,
  type ShadeDirection,
} from "./inequalityGrapherLesson42Model";
import "./InequalityGrapherTargetLesson42.css";

export default function InequalityGrapherTargetLesson42({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [rules, setRules] = useState<InequalityRule[]>(() =>
    DEFAULT_INEQUALITY_RULES.map((rule) => ({ ...rule })),
  );
  const [point, setPointState] = useState({ x: 2, y: 2 });
  const [actions, setActions] = useState(0);
  const result = useMemo(
    () => inequalitySystemResult(rules, point.x, point.y),
    [rules, point],
  );
  const graphPoint = inequalityGraphPosition(point.x, point.y);
  const reset = () => {
    setRules(DEFAULT_INEQUALITY_RULES.map((rule) => ({ ...rule })));
    setPointState({ x: 2, y: 2 });
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (run: () => void) => {
    run();
    setActions((value) => value + 1);
    onInteraction();
  };
  const updateRule = (
    id: InequalityRule["id"],
    update: Partial<InequalityRule>,
  ) =>
    act(() =>
      setRules((items) =>
        items.map((item) => (item.id === id ? { ...item, ...update } : item)),
      ),
    );
  const setPoint = (x: number, y: number) =>
    act(() =>
      setPointState({
        x: Math.max(-7, Math.min(7, x)),
        y: Math.max(-7, Math.min(7, y)),
      }),
    );
  const dragPoint = (event: ReactPointerEvent<SVGCircleElement>) => {
    if (event.buttons !== 1) return;
    const rect = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!rect) return;
    const next = inequalityPointFromPixels(
      ((event.clientX - rect.left) / rect.width) * 720,
      ((event.clientY - rect.top) / rect.height) * 630,
    );
    setPoint(next.x, next.y);
  };
  const keyPoint = (event: ReactKeyboardEvent<SVGCircleElement>) => {
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-0.5, 0],
      ArrowRight: [0.5, 0],
      ArrowUp: [0, 0.5],
      ArrowDown: [0, -0.5],
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    setPoint(point.x + move[0], point.y + move[1]);
  };

  return (
    <section
      className="ig42-page"
      data-testid="2d-graphing-mockup-0134"
      data-dedicated-lesson="42"
      data-object-model="editable-inclusive-boundaries-and-shade-directions-clipped-overlap-regions-pointer-keyboard-draggable-test-point-live-system-membership-and-navigation"
      data-point={`${point.x},${point.y}`}
      data-solution={result.satisfies}
      data-actions={actions}
    >
      <nav className="ig42-breadcrumb">
        ← &nbsp; Home &gt; Lessons &gt; Graphs And Functions &gt;{" "}
        <b>42 Inequality Grapher</b>
      </nav>
      <header className="ig42-hero">
        <small>GRAPHS AND FUNCTIONS</small>
        <h1>Inequality Grapher</h1>
        <p>Understand feasible regions.</p>
        <nav>
          <b>⚡ Graph Explorer</b>
          <button onClick={() => act(reset)}>
            <RotateCcw />
            Reset
          </button>
          <button
            onClick={() =>
              act(() =>
                navigator.clipboard?.writeText(
                  rules.map(inequalityLabel).join("\n"),
                ),
              )
            }
          >
            <Share2 />
            Share
          </button>
          <b>◷ 6-10 min</b>
        </nav>
      </header>
      <section className="ig42-workspace">
        <main className="ig42-graph">
          <header>
            <h2>▧ Graph</h2>
            <b>● Overlap = solution region</b>
            <nav>
              <button
                aria-label="Reset inequality view"
                onClick={() => act(reset)}
              >
                <RotateCcw />
              </button>
              <button
                aria-label="Fit inequality view"
                onClick={() => act(() => setPointState({ x: 2, y: 2 }))}
              >
                <Maximize2 />
              </button>
              <button
                aria-label="Expand inequality view"
                onClick={() =>
                  act(() =>
                    document
                      .querySelector(".ig42-graph")
                      ?.requestFullscreen?.(),
                  )
                }
              >
                <Expand />
              </button>
            </nav>
          </header>
          <svg
            viewBox="0 0 720 630"
            role="img"
            aria-label="Two shaded linear inequalities and their overlap"
          >
            <defs>
              <pattern
                id="ig42-grid"
                width="44"
                height="44"
                patternUnits="userSpaceOnUse"
              >
                <path d="M44 0H0V44" fill="none" stroke="#cfdaeb" />
              </pattern>
              <clipPath id="ig42-a-clip">
                <polygon points={inequalityRegionPolygon(rules[0])} />
              </clipPath>
            </defs>
            <rect
              x="52"
              y="8"
              width="616"
              height="612"
              rx="10"
              fill="url(#ig42-grid)"
              stroke="#d6e2ee"
            />
            {rules[0].shade !== "none" && (
              <polygon
                points={inequalityRegionPolygon(rules[0])}
                fill="#7dd3fc"
                opacity=".35"
              />
            )}
            {rules[1].shade !== "none" && (
              <polygon
                points={inequalityRegionPolygon(rules[1])}
                fill="#c4b5fd"
                opacity=".35"
              />
            )}
            {rules.every((rule) => rule.shade !== "none") && (
              <g clipPath="url(#ig42-a-clip)">
                <polygon
                  points={inequalityRegionPolygon(rules[1])}
                  fill="#2dd4bf"
                  opacity=".45"
                />
              </g>
            )}
            <line x1="52" x2="672" y1="315" y2="315" className="axis" />
            <line x1="360" x2="360" y1="620" y2="8" className="axis" />
            {rules.map((rule) => (
              <polyline
                key={rule.id}
                points={inequalityLinePoints(rule)}
                fill="none"
                stroke={rule.color}
                strokeWidth="3"
                strokeDasharray={rule.inclusive ? undefined : "9 7"}
              />
            ))}
            <g className="ig42-line-label" transform="translate(455 110)">
              <rect width="134" height="38" rx="7" />
              <text x="67" y="25" textAnchor="middle">
                {inequalityLabel(rules[0])}
              </text>
            </g>
            <g className="ig42-line-label violet" transform="translate(125 92)">
              <rect width="136" height="38" rx="7" />
              <text x="68" y="25" textAnchor="middle">
                {inequalityLabel(rules[1])}
              </text>
            </g>
            <circle
              aria-label="Drag inequality test point"
              tabIndex={0}
              cx={graphPoint.x}
              cy={graphPoint.y}
              r="11"
              className="test-point"
              onPointerDown={(event) =>
                event.currentTarget.setPointerCapture(event.pointerId)
              }
              onPointerMove={dragPoint}
              onKeyDown={keyPoint}
            />
            <g
              className="ig42-point-label"
              transform={`translate(${graphPoint.x - 25} ${graphPoint.y - 50})`}
            >
              <rect width="80" height="36" rx="8" />
              <text x="40" y="23" textAnchor="middle">
                A({point.x}, {point.y})
              </text>
            </g>
          </svg>
          <p>ⓘ The solution region is where both inequalities are true.</p>
        </main>
        <aside className="ig42-controls">
          {rules.map((rule) => (
            <section key={rule.id} style={{ borderColor: rule.color }}>
              <h2>
                <i style={{ background: rule.color }} />
                {inequalityLabel(rule)}
              </h2>
              <b>Boundary style</b>
              <div className="ig42-segments">
                <button
                  className={rule.inclusive ? "active" : ""}
                  onClick={() => updateRule(rule.id, { inclusive: true })}
                >
                  <Minus />
                </button>
                <button
                  className={!rule.inclusive ? "active" : ""}
                  onClick={() => updateRule(rule.id, { inclusive: false })}
                >
                  - - -
                </button>
              </div>
              <b>Shade direction</b>
              <div className="ig42-segments three">
                {(["below", "none", "above"] as ShadeDirection[]).map(
                  (direction) => (
                    <button
                      key={direction}
                      aria-label={`${rule.id} shade ${direction}`}
                      className={rule.shade === direction ? "active" : ""}
                      onClick={() => updateRule(rule.id, { shade: direction })}
                    >
                      {direction === "below" ? (
                        <ArrowDown />
                      ) : direction === "above" ? (
                        <ArrowUp />
                      ) : (
                        <Minus />
                      )}
                    </button>
                  ),
                )}
              </div>
            </section>
          ))}
          <section className="ig42-test">
            <h2>
              Test point A({point.x}, {point.y})
            </h2>
            <small>Drag the point to test different locations.</small>
            <label>
              <span>
                x
                <input
                  aria-label="Inequality point x"
                  type="number"
                  value={point.x}
                  onChange={(event) =>
                    setPoint(Number(event.target.value), point.y)
                  }
                />
              </span>
              <span>
                y
                <input
                  aria-label="Inequality point y"
                  type="number"
                  value={point.y}
                  onChange={(event) =>
                    setPoint(point.x, Number(event.target.value))
                  }
                />
              </span>
              <button aria-label="Move test point">
                <Move />
              </button>
            </label>
            {result.results.map((item) => (
              <p key={item.rule.id}>
                <i style={{ background: item.rule.color }} />
                {inequalityLabel(item.rule)} <span>LHS: {item.lhs}</span>
                <span>RHS: {item.rhs.toFixed(1)}</span>
                <b className={item.satisfies ? "yes" : "no"}>
                  {item.satisfies ? "True" : "False"}
                </b>
              </p>
            ))}
            <output className={result.satisfies ? "yes" : "no"}>
              ✓{" "}
              <span>
                Result
                <b>
                  {result.satisfies
                    ? "Solution (lies in overlap region)"
                    : "Not a solution"}
                </b>
              </span>
            </output>
          </section>
          <footer>
            <span>■ {inequalityLabel(rules[0])}</span>
            <span>■ {inequalityLabel(rules[1])}</span>
            <span>■ Overlap = solution region</span>
            <hr />
            <span>━━ Boundary included</span>
            <span>┅┅ Boundary not included</span>
          </footer>
        </aside>
      </section>
      <nav className="ig42-adjacent">
        <a href="/lessons/graphs-and-functions/41-equation-grapher">
          ←{" "}
          <span>
            PREVIOUS<b>Equation Grapher</b>
          </span>
        </a>
        <a href="/lessons/graphs-and-functions/43-parametric-curves">
          <span>
            NEXT<b>Parametric Curves</b>
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}
