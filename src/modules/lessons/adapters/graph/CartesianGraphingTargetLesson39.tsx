import { RotateCcw, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../../types";
import {
  CARTESIAN_SAMPLE_POINTS,
  cartesianPointAnalysis,
  graphPosition,
  pointFromGraphPosition,
} from "./cartesianGraphingLesson39Model";
import "./CartesianGraphingTargetLesson39.css";
import { LessonTopicStudyBoard } from "../../components/LessonTopicStudyBoard";

const tabs = [
  "Interaction + visualization",
  "Explain",
  "Examples",
  "Formulas",
  "Know more",
];

export default function CartesianGraphingTargetLesson39({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [x, setX] = useState(2),
    [y, setY] = useState(3),
    [tab, setTab] = useState(tabs[0]),
    [language, setLanguage] = useState<"en" | "hi">("en"),
    [actions, setActions] = useState(0);
  const point = useMemo(() => cartesianPointAnalysis(x, y), [x, y]),
    position = graphPosition(point);

  const reset = () => {
    setX(2);
    setY(3);
    setTab(tabs[0]);
    setLanguage("en");
    setActions(0);
  };
  useEffect(reset, [resetToken]);

  const act = (run: () => void) => {
      run();
      setActions((value) => value + 1);
      onInteraction();
    },
    setPoint = (nextX: number, nextY: number) =>
      act(() => {
        const next = cartesianPointAnalysis(nextX, nextY);
        setX(next.x);
        setY(next.y);
      }),
    movePoint = (event: ReactPointerEvent<SVGCircleElement>) => {
      if (event.buttons !== 1) return;
      const svg = event.currentTarget.ownerSVGElement,
        rect = svg?.getBoundingClientRect();
      if (!rect) return;
      const next = pointFromGraphPosition(
        ((event.clientX - rect.left) / rect.width) * 760,
        ((event.clientY - rect.top) / rect.height) * 620,
      );
      setPoint(next.x, next.y);
    },
    moveByKeyboard = (event: ReactKeyboardEvent<SVGCircleElement>) => {
      const offsets: Record<string, [number, number]> = {
        ArrowLeft: [-0.5, 0],
        ArrowRight: [0.5, 0],
        ArrowUp: [0, 0.5],
        ArrowDown: [0, -0.5],
      };
      const offset = offsets[event.key];
      if (!offset) return;
      event.preventDefault();
      setPoint(x + offset[0], y + offset[1]);
    };

  return (
    <section
      className="cg39-page"
      data-testid="2d-graphing-mockup-0131"
      data-dedicated-lesson="39"
      data-object-model="ordered-pair-x-first-y-second-snapped-pointer-keyboard-draggable-point-quadrant-classification-coordinate-steppers-sample-pairs-confirmation-and-navigation"
      data-point={point.orderedPair}
      data-x={point.x}
      data-y={point.y}
      data-quadrant={point.quadrant}
      data-language={language}
      data-tab={tab}
      data-actions={actions}
    >
      <header className="cg39-hero">
        <span>
          <b>GRAPHS AND FUNCTIONS</b>
          <b>2D GRAPHING CALCULATOR</b>
        </span>
        <h1>{language === "en" ? "Cartesian Graphing" : "कार्तीय आलेखन"}</h1>
        <p>
          {language === "en"
            ? "Plot relationships on coordinate axes."
            : "निर्देशांक अक्षों पर संबंधों का आलेखन करें।"}
        </p>
        <div>
          {[
            "Foundational-Advanced",
            "Graph Explorer",
            "Graphing Calculator",
            "6-10 min",
          ].map((label) => (
            <b key={label}>{label}</b>
          ))}
        </div>
        <nav>
          <select
            aria-label="Lesson language"
            value={language}
            onChange={(event) =>
              act(() => setLanguage(event.target.value as "en" | "hi"))
            }
          >
            <option value="en">English (English)</option>
            <option value="hi">हिन्दी (Hindi)</option>
          </select>
          <button onClick={() => act(reset)}>
            <RotateCcw /> Reset
          </button>
          <button
            onClick={() =>
              act(() => navigator.clipboard?.writeText(`P${point.orderedPair}`))
            }
          >
            <Share2 /> Share
          </button>
          <button
            onClick={() => {
              act(() => setTab(tabs[0]));
              document
                .getElementById("cg39-workspace")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Workspace
          </button>
        </nav>
      </header>

      <nav className="cg39-tabs">
        {tabs.map((label) => (
          <button
            key={label}
            className={tab === label ? "active" : ""}
            onClick={() => {
              act(() => setTab(label));
              document
                .getElementById(
                  label === tabs[0] ? "cg39-workspace" : "cg39-guide",
                )
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {label}
          </button>
        ))}
      </nav>

      <section className="cg39-workspace" id="cg39-workspace">
        <aside className="cg39-steps" id="cg39-guide">
          <small>HOW TO PLOT</small>
          <h2>Ordered Pair</h2>
          <ol>
            <li>
              <i>1</i>
              <div>
                <b>Read the ordered pair</b>
                <strong>P{point.orderedPair}</strong>
              </div>
            </li>
            <li>
              <i>2</i>
              <div>
                <b>Move on the coordinate plane</b>
                <p>
                  <strong>→</strong> x first
                  <span>Move {point.horizontalDirection}</span>
                </p>
                <p>
                  <strong>↓</strong> y second
                  <span>Then move {point.verticalDirection}</span>
                </p>
              </div>
            </li>
            <li>
              <i>3</i>
              <div>
                <b>Plot the point</b>
                <p>Drag or use the controls to place P.</p>
              </div>
            </li>
          </ol>
          <article>
            <b>Tip</b>
            <p>Always read the x-coordinate before the y-coordinate.</p>
          </article>
        </aside>

        <main className="cg39-plot">
          <h2>Plot the point. Read x first, then y.</h2>
          <svg
            viewBox="0 0 760 620"
            role="img"
            aria-label={`Cartesian plane with P at ${point.orderedPair}`}
          >
            <defs>
              <pattern
                id="cg39-grid"
                width="30"
                height="25"
                patternUnits="userSpaceOnUse"
              >
                <path d="M30 0H0V25" fill="none" stroke="#dfe8f4" />
              </pattern>
              <marker
                id="cg39-arrow"
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="4"
                orient="auto"
              >
                <path d="M0 0L8 4L0 8Z" fill="#2563eb" />
              </marker>
              <marker
                id="cg39-violet-arrow"
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="4"
                orient="auto"
              >
                <path d="M0 0L8 4L0 8Z" fill="#7c3aed" />
              </marker>
            </defs>
            <rect
              x="50"
              y="30"
              width="660"
              height="550"
              rx="16"
              fill="url(#cg39-grid)"
              stroke="#d8e5f3"
            />
            <line
              x1="50"
              y1="310"
              x2="714"
              y2="310"
              className="axis"
              markerEnd="url(#cg39-arrow)"
            />
            <line
              x1="380"
              y1="580"
              x2="380"
              y2="28"
              className="axis"
              markerEnd="url(#cg39-arrow)"
            />
            {[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map((value) => (
              <text
                key={`x-${value}`}
                x={380 + value * 60}
                y="334"
                textAnchor="middle"
              >
                {value}
              </text>
            ))}
            {[-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].map((value) => (
              <text
                key={`y-${value}`}
                x="365"
                y={315 - value * 50}
                textAnchor="end"
              >
                {value}
              </text>
            ))}
            <text x="690" y="294" className="axis-label">
              x
            </text>
            <text x="395" y="48" className="axis-label">
              y
            </text>
            <g className="quadrants">
              <text x="590" y="75">
                Quadrant I
                <tspan x="615" dy="18">
                  (+,+)
                </tspan>
              </text>
              <text x="120" y="75">
                Quadrant II
                <tspan x="145" dy="18">
                  (-,+)
                </tspan>
              </text>
              <text x="115" y="535">
                Quadrant III
                <tspan x="145" dy="18">
                  (-,-)
                </tspan>
              </text>
              <text x="585" y="535">
                Quadrant IV
                <tspan x="615" dy="18">
                  (+,-)
                </tspan>
              </text>
            </g>
            <line
              x1="380"
              y1="310"
              x2={position.x}
              y2="310"
              className="ordered-path"
              markerEnd="url(#cg39-violet-arrow)"
            />
            <line
              x1={position.x}
              y1="310"
              x2={position.x}
              y2={position.y}
              className="ordered-path dashed"
              markerEnd="url(#cg39-violet-arrow)"
            />
            <text x={(380 + position.x) / 2} y="355" className="path-label">
              x first
              <tspan x={(380 + position.x) / 2} dy="17">
                Move horizontally
              </tspan>
            </text>
            <text
              x={position.x + 18}
              y={(310 + position.y) / 2}
              className="path-label"
            >
              y second
              <tspan x={position.x + 18} dy="17">
                Then move vertically
              </tspan>
            </text>
            <circle
              aria-label="Drag point P"
              tabIndex={0}
              cx={position.x}
              cy={position.y}
              r="11"
              onPointerDown={(event) =>
                event.currentTarget.setPointerCapture(event.pointerId)
              }
              onPointerMove={movePoint}
              onKeyDown={moveByKeyboard}
            />
            <g
              className="point-label"
              transform={`translate(${Math.min(615, position.x + 18)} ${Math.max(45, position.y - 42)})`}
            >
              <rect width="104" height="38" rx="8" />
              <text x="52" y="25" textAnchor="middle">
                P{point.orderedPair}
              </text>
            </g>
          </svg>
          <footer>
            <span>● P{point.orderedPair}</span>
            <span>━━➤ Path</span>
            <span>Shows the order: x first, then y</span>
          </footer>
        </main>

        <aside className="cg39-controls">
          <section>
            <h2>Your point</h2>
            <strong>P{point.orderedPair}</strong>
            <output>
              <b>✓ Ordered pair confirmed</b>
              <span>x-coordinate read before y-coordinate.</span>
            </output>
          </section>
          <section>
            <h2>Adjust coordinates</h2>
            {(
              [
                ["x first (horizontal)", x, setX, "x"],
                ["y second (vertical)", y, setY, "y"],
              ] as const
            ).map(([label, value, setter, coordinate]) => (
              <label key={coordinate}>
                {label}
                <input
                  aria-label={label}
                  type="range"
                  min="-5"
                  max="5"
                  step="0.5"
                  value={value}
                  onChange={(event) =>
                    setPoint(
                      coordinate === "x" ? Number(event.target.value) : x,
                      coordinate === "y" ? Number(event.target.value) : y,
                    )
                  }
                />
                <span>
                  <button
                    aria-label={`Decrease ${coordinate}`}
                    onClick={() =>
                      setPoint(
                        coordinate === "x" ? x - 0.5 : x,
                        coordinate === "y" ? y - 0.5 : y,
                      )
                    }
                  >
                    −
                  </button>
                  <input
                    aria-label={`${coordinate} coordinate`}
                    type="number"
                    min="-5"
                    max="5"
                    step="0.5"
                    value={value}
                    onChange={(event) => {
                      const next = Number(event.target.value);
                      setter(
                        cartesianPointAnalysis(
                          coordinate === "x" ? next : x,
                          coordinate === "y" ? next : y,
                        )[coordinate],
                      );
                      setActions((current) => current + 1);
                      onInteraction();
                    }}
                  />
                  <button
                    aria-label={`Increase ${coordinate}`}
                    onClick={() =>
                      setPoint(
                        coordinate === "x" ? x + 0.5 : x,
                        coordinate === "y" ? y + 0.5 : y,
                      )
                    }
                  >
                    +
                  </button>
                </span>
              </label>
            ))}
          </section>
          <section className="cg39-order">
            <h2>Read in order</h2>
            <p>x first, then y</p>
            <div>
              <b>x</b>
              <strong>{x}</strong>
              <i>→</i>
              <b>y</b>
              <strong>{y}</strong>
            </div>
          </section>
          <section className="cg39-samples">
            <h2>Sample ordered pairs</h2>
            <table>
              <thead>
                <tr>
                  <th>Point</th>
                  <th>Ordered Pair (x, y)</th>
                </tr>
              </thead>
              <tbody>
                {CARTESIAN_SAMPLE_POINTS.map((sample) => (
                  <tr key={sample.name}>
                    <td>
                      <i className={sample.tone} />
                      {sample.name}
                    </td>
                    <td>
                      <button onClick={() => setPoint(sample.x, sample.y)}>
                        ({sample.x}, {sample.y})
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </aside>
      </section>
      <LessonTopicStudyBoard lessonId={39} view={tab} onInteraction={onInteraction} />

    </section>
  );
}
