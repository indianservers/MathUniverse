import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  RotateCcw,
  Share2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./VectorAdditionTargetLesson186.css";

type Point = { x: number; y: number };
type Drag = "u" | "v" | "origin";
const INITIAL_U = { x: 3, y: 2 },
  INITIAL_V = { x: -1, y: 3 },
  PROBLEMS = [
    { u: { x: 2, y: 1 }, v: { x: 0, y: 4 } },
    { u: { x: -2, y: 3 }, v: { x: 4, y: -1 } },
    { u: { x: 1, y: -3 }, v: { x: -4, y: 2 } },
  ];
const clamp = (n: number) => Math.max(-5, Math.min(5, Math.round(n))),
  add = (a: Point, b: Point) => ({ x: a.x + b.x, y: a.y + b.y }),
  magnitude = (p: Point) => Math.hypot(p.x, p.y),
  angle = (p: Point) => (Math.atan2(p.y, p.x) * 180) / Math.PI;

function MainGraph({
  u,
  v,
  origin,
  grid,
  headToTail,
  parallelogram,
  scale,
  onVector,
  onOrigin,
}: {
  u: Point;
  v: Point;
  origin: Point;
  grid: boolean;
  headToTail: boolean;
  parallelogram: boolean;
  scale: number;
  onVector: (key: "u" | "v", p: Point) => void;
  onOrigin: (p: Point) => void;
}) {
  const ref = useRef<SVGSVGElement>(null),
    drag = useRef<Drag | null>(null),
    unit = 38 * scale,
    s = (p: Point) => ({
      x: 315 + (origin.x + p.x) * unit,
      y: 280 - (origin.y + p.y) * unit,
    }),
    o = s({ x: 0, y: 0 }),
    ue = s(u),
    result = add(u, v),
    re = s(result),
    vTail = headToTail ? ue : o,
    vEnd = headToTail ? re : s(v),
    world = (event: PointerEvent<SVGSVGElement>) => {
      const r = ref.current!.getBoundingClientRect();
      return {
        x: clamp(
          (((event.clientX - r.left) / r.width) * 630 - 315) / unit - origin.x,
        ),
        y: clamp(
          (280 - ((event.clientY - r.top) / r.height) * 560) / unit - origin.y,
        ),
      };
    };
  const key = (which: Drag) => (event: KeyboardEvent<SVGCircleElement>) => {
    const d: Record<string, Point> = {
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        ArrowUp: { x: 0, y: 1 },
        ArrowDown: { x: 0, y: -1 },
      },
      m = d[event.key];
    if (!m) return;
    event.preventDefault();
    if (which === "origin")
      onOrigin({ x: clamp(origin.x + m.x), y: clamp(origin.y + m.y) });
    else {
      const p = which === "u" ? u : v;
      onVector(which, { x: clamp(p.x + m.x), y: clamp(p.y + m.y) });
    }
  };
  const moved = (event: PointerEvent<SVGSVGElement>) => {
    if (!drag.current) return;
    const p = world(event);
    if (drag.current === "origin") onOrigin({ x: clamp(p.x), y: clamp(p.y) });
    else if (drag.current === "u") onVector("u", p);
    else
      onVector(
        "v",
        headToTail ? { x: clamp(p.x - u.x), y: clamp(p.y - u.y) } : p,
      );
  };
  return (
    <svg
      ref={ref}
      className={`va186-graph${grid ? " grid" : ""}`}
      viewBox="0 0 630 560"
      aria-label="Interactive vector addition graph"
      onPointerMove={moved}
      onPointerUp={() => {
        drag.current = null;
      }}
      onPointerLeave={() => {
        drag.current = null;
      }}
    >
      <defs>
        <pattern
          id="va186Grid"
          width={unit}
          height={unit}
          patternUnits="userSpaceOnUse"
        >
          <path d={`M${unit} 0H0V${unit}`} fill="none" stroke="#dfe7ed" />
        </pattern>
        {[
          ["u", "#08a5b5"],
          ["v", "#f59e0b"],
          ["sum", "#7436ed"],
        ].map(([id, color]) => (
          <marker
            key={id}
            id={`va186-${id}`}
            markerWidth="9"
            markerHeight="9"
            refX="8"
            refY="4.5"
            orient="auto"
          >
            <path d="M0 0L9 4.5L0 9Z" fill={color} />
          </marker>
        ))}
      </defs>
      <rect width="630" height="560" className="grid-fill" />
      <line x1="0" x2="630" y1={o.y} y2={o.y} className="axis" />
      <line x1={o.x} x2={o.x} y1="0" y2="560" className="axis" />
      {parallelogram && (
        <>
          <line x1={ue.x} y1={ue.y} x2={re.x} y2={re.y} className="copy" />
          <line x1={s(v).x} y1={s(v).y} x2={re.x} y2={re.y} className="copy" />
        </>
      )}
      <line
        x1={o.x}
        y1={o.y}
        x2={ue.x}
        y2={ue.y}
        className="u"
        markerEnd="url(#va186-u)"
      />
      <line
        x1={vTail.x}
        y1={vTail.y}
        x2={vEnd.x}
        y2={vEnd.y}
        className="v"
        markerEnd="url(#va186-v)"
      />
      <line
        x1={o.x}
        y1={o.y}
        x2={re.x}
        y2={re.y}
        className="sum"
        markerEnd="url(#va186-sum)"
      />
      <circle
        data-testid="addition-origin"
        role="slider"
        aria-label="Vector addition origin"
        tabIndex={0}
        cx={o.x}
        cy={o.y}
        r="8"
        className="origin"
        onPointerDown={(event) => {
          drag.current = "origin";
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onKeyDown={key("origin")}
      />
      <circle
        data-testid="addition-u-tip"
        role="slider"
        aria-label="Vector u tip"
        tabIndex={0}
        cx={ue.x}
        cy={ue.y}
        r="9"
        className="u-tip"
        onPointerDown={(event) => {
          drag.current = "u";
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onKeyDown={key("u")}
      />
      <circle
        data-testid="addition-v-tip"
        role="slider"
        aria-label="Vector v tip"
        tabIndex={0}
        cx={vEnd.x}
        cy={vEnd.y}
        r="9"
        className="v-tip"
        onPointerDown={(event) => {
          drag.current = "v";
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onKeyDown={key("v")}
      />
      <text x={ue.x - 34} y={ue.y + 26} className="u-label">
        u
      </text>
      <text x={vEnd.x + 10} y={vEnd.y + 4} className="v-label">
        v
      </text>
      <text
        x={(o.x + re.x) / 2 - 20}
        y={(o.y + re.y) / 2 - 14}
        className="sum-label"
      >
        u + v
      </text>
    </svg>
  );
}

function VectorControl({
  name,
  value,
  color,
  onValue,
}: {
  name: "u" | "v";
  value: Point;
  color: string;
  onValue: (p: Point) => void;
}) {
  return (
    <article
      className="va186-vector-control"
      style={{ "--tone": color } as React.CSSProperties}
    >
      <h3>● Vector {name}</h3>
      {(["x", "y"] as const).map((axis) => (
        <label key={axis}>
          {name}
          <sub>{axis}</sub>
          <span>-5</span>
          <input
            aria-label={`${name} ${axis} component`}
            type="range"
            min="-5"
            max="5"
            value={value[axis]}
            onChange={(event) =>
              onValue({ ...value, [axis]: +event.target.value })
            }
          />
          <span>5</span>
          <input
            aria-label={`${name} ${axis} value`}
            type="number"
            min="-5"
            max="5"
            value={value[axis]}
            onChange={(event) =>
              onValue({ ...value, [axis]: clamp(+event.target.value) })
            }
          />
        </label>
      ))}
      <output>
        {name} = ⟨{value.x}, {value.y}⟩
      </output>
    </article>
  );
}

function PracticeGraph({
  problem,
  answer,
  onAnswer,
}: {
  problem: { u: Point; v: Point };
  answer: Point;
  onAnswer: (p: Point) => void;
}) {
  const ref = useRef<SVGSVGElement>(null),
    drag = useRef(false),
    sx = (x: number) => 120 + x * 25,
    sy = (y: number) => 110 - y * 25,
    target = add(problem.u, problem.v),
    move = (event: PointerEvent<SVGSVGElement>) => {
      const r = ref.current!.getBoundingClientRect();
      onAnswer({
        x: clamp((((event.clientX - r.left) / r.width) * 240 - 120) / 25),
        y: clamp((110 - ((event.clientY - r.top) / r.height) * 220) / 25),
      });
    };
  return (
    <svg
      ref={ref}
      className="va186-practice-graph"
      viewBox="0 0 240 220"
      aria-label="Practice vector addition graph"
      onPointerMove={(event) => drag.current && move(event)}
      onPointerUp={() => {
        drag.current = false;
      }}
    >
      <line x1="0" x2="240" y1={sy(0)} y2={sy(0)} />
      <line x1={sx(0)} x2={sx(0)} y1="0" y2="220" />
      <line
        x1={sx(0)}
        y1={sy(0)}
        x2={sx(problem.u.x)}
        y2={sy(problem.u.y)}
        className="u"
      />
      <line
        x1={sx(problem.u.x)}
        y1={sy(problem.u.y)}
        x2={sx(target.x)}
        y2={sy(target.y)}
        className="v"
      />
      <line
        x1={sx(0)}
        y1={sy(0)}
        x2={sx(answer.x)}
        y2={sy(answer.y)}
        className="answer"
      />
      <circle
        data-testid="addition-practice-tip"
        role="slider"
        aria-label="Practice resultant tip"
        tabIndex={0}
        cx={sx(answer.x)}
        cy={sy(answer.y)}
        r="8"
        onPointerDown={(event) => {
          drag.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onKeyDown={(event) => {
          const d: Record<string, Point> = {
              ArrowLeft: { x: -1, y: 0 },
              ArrowRight: { x: 1, y: 0 },
              ArrowUp: { x: 0, y: 1 },
              ArrowDown: { x: 0, y: -1 },
            },
            m = d[event.key];
          if (m) {
            event.preventDefault();
            onAnswer({ x: clamp(answer.x + m.x), y: clamp(answer.y + m.y) });
          }
        }}
      />
    </svg>
  );
}

export default function VectorAdditionTargetLesson186({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [u, setU] = useState(INITIAL_U),
    [v, setV] = useState(INITIAL_V),
    [origin, setOrigin] = useState({ x: 0, y: 0 }),
    [headToTail, setHeadToTail] = useState(true),
    [parallelogram, setParallelogram] = useState(true),
    [grid, setGrid] = useState(true),
    [scale, setScale] = useState(1),
    [tab, setTab] = useState("Model"),
    [stage, setStage] = useState(1),
    [language, setLanguage] = useState("English (English)"),
    [shared, setShared] = useState(false),
    [problemIndex, setProblemIndex] = useState(0),
    [answer, setAnswer] = useState({ x: 2, y: 5 }),
    [feedback, setFeedback] = useState("");
  const result = add(u, v),
    problem = PROBLEMS[problemIndex],
    target = add(problem.u, problem.v),
    correct = answer.x === target.x && answer.y === target.y,
    theta = Math.abs(angle(u) - angle(v));
  const interact = () => onInteraction(),
    reset = () => {
      setU(INITIAL_U);
      setV(INITIAL_V);
      setOrigin({ x: 0, y: 0 });
      setHeadToTail(true);
      setParallelogram(true);
      setGrid(true);
      setScale(1);
      setTab("Model");
      setStage(1);
      setLanguage("English (English)");
      setShared(false);
      setProblemIndex(0);
      setAnswer({ x: 2, y: 5 });
      setFeedback("");
      interact();
    };
  useEffect(() => {
    setU(INITIAL_U);
    setV(INITIAL_V);
    setOrigin({ x: 0, y: 0 });
    setHeadToTail(true);
    setParallelogram(true);
    setGrid(true);
    setScale(1);
    setTab("Model");
    setStage(1);
    setLanguage("English (English)");
    setShared(false);
    setProblemIndex(0);
    setAnswer({ x: 2, y: 5 });
    setFeedback("");
  }, [resetToken]);
  const updateAnswer = (p: Point) => {
    setAnswer(p);
    setFeedback("");
    interact();
  };
  return (
    <main
      className="va186-page"
      data-testid="vector-mockup-0243"
      data-dedicated-lesson="186"
      data-object-model="head-to-tail-parallelogram-component-sum-resultant-practice"
      data-u={`${u.x}:${u.y}`}
      data-v={`${v.x}:${v.y}`}
      data-result={`${result.x}:${result.y}`}
      data-origin={`${origin.x}:${origin.y}`}
      data-head-tail={headToTail}
      data-parallelogram={parallelogram}
      data-grid={grid}
      data-scale={scale.toFixed(2)}
      data-tab={tab}
      data-stage={stage}
      data-language={language}
      data-practice={`${answer.x}:${answer.y}`}
      data-target={`${target.x}:${target.y}`}
      data-correct={correct}
      data-feedback={feedback}
      data-problem={problemIndex}
      data-shared={shared}
    >
      <header className="va186-header">
        <div>
          <span>GEOMETRY</span>
          <span>VECTORS</span>
          <h1>Vector Addition</h1>
          <p>Add vectors using head-to-tail or the parallelogram rule.</p>
          <section>
            <b>♙ Intermediate-Advanced</b>
            <b>ϟ Applied Lab</b>
            <b>▣ Vector Tools</b>
            <b>◷ 6-10 min</b>
          </section>
        </div>
        <aside>
          <nav>
            <select
              aria-label="Lesson language"
              value={language}
              onChange={(event) => {
                setLanguage(event.target.value);
                interact();
              }}
            >
              <option>English (English)</option>
              <option>हिन्दी (Hindi)</option>
            </select>
            <button onClick={reset}>
              <RotateCcw />
              Reset
            </button>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(`u+v=<${result.x},${result.y}>`);
                setShared(true);
                interact();
              }}
            >
              <Share2 />
              Share
            </button>
          </nav>
          <section>
            <b>Learning Path</b>
            <div>
              {["Observe", "Manipulate", "Pattern", "Rule", "Try"].map(
                (name, index) => (
                  <button
                    key={name}
                    className={stage === index ? "active" : ""}
                    onClick={() => {
                      setStage(index);
                      interact();
                    }}
                  >
                    <i>{index + 1}</i>
                    <small>{name}</small>
                  </button>
                ),
              )}
            </div>
          </section>
          <output>{shared ? "Copied" : ""}</output>
        </aside>
      </header>
      <nav className="va186-tabs">
        {["Model", "Components", "Steps", "Rule", "Practice"].map((name) => (
          <button
            key={name}
            className={tab === name ? "active" : ""}
            onClick={() => {
              setTab(name);
              document
                .getElementById(`va186-${name.toLowerCase()}`)
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
              interact();
            }}
          >
            {name}
          </button>
        ))}
      </nav>
      <section className="va186-work" id="va186-model">
        <header>
          <div>
            <h2>Interactive Vector Model</h2>
            <p>
              Drag arrows by their tips. Toggle head-to-tail or move the origin.
            </p>
          </div>
          <label>
            Head-to-tail{" "}
            <input
              aria-label="Head-to-tail"
              type="checkbox"
              checked={headToTail}
              onChange={() => {
                setHeadToTail((value) => !value);
                interact();
              }}
            />
          </label>
          <button
            className={parallelogram ? "active" : ""}
            onClick={() => {
              setParallelogram((value) => !value);
              interact();
            }}
          >
            ⌁ Parallelogram
          </button>
          <label>
            <input
              aria-label="Grid"
              type="checkbox"
              checked={grid}
              onChange={() => {
                setGrid((value) => !value);
                interact();
              }}
            />{" "}
            Grid
          </label>
        </header>
        <div>
          <article>
            <MainGraph
              u={u}
              v={v}
              origin={origin}
              grid={grid}
              headToTail={headToTail}
              parallelogram={parallelogram}
              scale={scale}
              onVector={(key, p) => {
                (key === "u" ? setU : setV)(p);
                interact();
              }}
              onOrigin={(p) => {
                setOrigin(p);
                interact();
              }}
            />
            <footer>
              <button
                onClick={() => {
                  setOrigin({ x: 0, y: 0 });
                  interact();
                }}
              >
                Origin ◌
              </button>
              <section>
                <b>Scale</b>
                <button
                  aria-label="Decrease graph scale"
                  onClick={() => {
                    setScale((value) => Math.max(0.75, value - 0.25));
                    interact();
                  }}
                >
                  <Minus />
                </button>
                <span>{Math.round(scale * 100)}%</span>
                <button
                  aria-label="Increase graph scale"
                  onClick={() => {
                    setScale((value) => Math.min(1.5, value + 0.25));
                    interact();
                  }}
                >
                  <Plus />
                </button>
              </section>
            </footer>
          </article>
          <aside id="va186-components">
            <h2>Vectors & Resultant</h2>
            <VectorControl
              name="u"
              value={u}
              color="#08a5b5"
              onValue={(p) => {
                setU(p);
                interact();
              }}
            />
            <VectorControl
              name="v"
              value={v}
              color="#f59e0b"
              onValue={(p) => {
                setV(p);
                interact();
              }}
            />
            <article className="va186-result">
              <h3>● Resultant u + v</h3>
              <p>
                (u+v)ₓ <progress min="-5" max="5" value={result.x} />
                <b>{result.x}</b>
              </p>
              <p>
                (u+v)ᵧ <progress min="-5" max="5" value={result.y} />
                <b>{result.y}</b>
              </p>
              <output>
                u + v = ⟨{result.x}, {result.y}⟩
              </output>
            </article>
            <footer>
              <b>
                |u|<span>{magnitude(u).toFixed(2)}</span>
              </b>
              <b>
                |v|<span>{magnitude(v).toFixed(2)}</span>
              </b>
              <b>
                |u+v|<span>{magnitude(result).toFixed(2)}</span>
              </b>
              <b>
                θ(u,v)<span>{theta.toFixed(1)}°</span>
              </b>
            </footer>
          </aside>
        </div>
      </section>
      <section className="va186-learn" id="va186-steps">
        <article>
          <h2>Construction Steps</h2>
          <ol>
            <li>
              Draw vector u from the origin.
              <b>
                u = ⟨{u.x},{u.y}⟩
              </b>
            </li>
            <li>
              From the head of u, draw vector v.
              <b>
                v = ⟨{v.x},{v.y}⟩
              </b>
            </li>
            <li>The resultant u+v goes from the origin to the head of v.</li>
            <li>Complete the parallelogram. Its diagonal is u+v.</li>
          </ol>
        </article>
        <article>
          <h2>What Do You Notice?</h2>
          <p>
            ✓ The resultant components are the sums of the respective
            components.
          </p>
          <output>
            (u+v)ₓ = uₓ+vₓ
            <br />
            (u+v)ᵧ = uᵧ+vᵧ
          </output>
          <p>✓ Head-to-tail and diagonal give the same resultant.</p>
          <p>✓ The order of addition does not change the resultant.</p>
        </article>
        <article id="va186-rule">
          <h2>The Rule</h2>
          <p>For any vectors u=⟨uₓ,uᵧ⟩ and v=⟨vₓ,vᵧ⟩,</p>
          <output>u + v = ⟨uₓ+vₓ, uᵧ+vᵧ⟩</output>
          <h3>Properties</h3>
          <p>✓ Commutative: u+v=v+u</p>
          <p>✓ Associative: (u+v)+w=u+(v+w)</p>
          <p>✓ Identity: u+0=u</p>
          <p>✓ Inverse: u+(-u)=0</p>
        </article>
      </section>
      <section className="va186-practice" id="va186-practice">
        <h2>Try It Yourself</h2>
        <p>Add the vectors shown. Drag the resultant tip or use the sliders.</p>
        <div>
          <PracticeGraph
            problem={problem}
            answer={answer}
            onAnswer={updateAnswer}
          />
          <article>
            <b>Given</b>
            <p>
              u = ⟨{problem.u.x},{problem.u.y}⟩
            </p>
            <p>
              v = ⟨{problem.v.x},{problem.v.y}⟩
            </p>
          </article>
          <article>
            <b>Your Answer</b>
            {(["x", "y"] as const).map((axis) => (
              <label key={axis}>
                (u+v)<sub>{axis}</sub>
                <input
                  aria-label={`Practice result ${axis}`}
                  type="range"
                  min="-5"
                  max="5"
                  value={answer[axis]}
                  onChange={(event) =>
                    updateAnswer({ ...answer, [axis]: +event.target.value })
                  }
                />
                <input
                  aria-label={`Practice result ${axis} value`}
                  type="number"
                  min="-5"
                  max="5"
                  value={answer[axis]}
                  onChange={(event) =>
                    updateAnswer({
                      ...answer,
                      [axis]: clamp(+event.target.value),
                    })
                  }
                />
              </label>
            ))}
            <output>
              u + v = ⟨{answer.x}, {answer.y}⟩
            </output>
          </article>
          <aside className={correct ? "correct" : ""}>
            <h2>{correct ? "Correct!" : "Keep going"}</h2>
            <p>
              {feedback || correct
                ? "Both components are correct."
                : "Match each component sum."}
            </p>
          </aside>
        </div>
        <footer>
          <button
            onClick={() => {
              setFeedback(
                correct ? "Correct!" : "Not yet. Add matching components.",
              );
              interact();
            }}
          >
            Check Answer
          </button>
          <button
            onClick={() => {
              const next = (problemIndex + 1) % PROBLEMS.length;
              setProblemIndex(next);
              setAnswer({ x: 0, y: 0 });
              setFeedback("");
              interact();
            }}
          >
            New Problem
          </button>
        </footer>
      </section>
      <nav className="va186-nav">
        <a href="/lessons/geometry/185-position-vectors">
          <ArrowLeft />
          <span>
            <small>Previous</small>
            <b>Position Vectors</b>
          </span>
        </a>
        <a href="/lessons/geometry/187-vector-subtraction">
          <span>
            <small>Next</small>
            <b>Vector Subtraction</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="va186-footer">
        <b>⌁ Math Universe</b>
        <p>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </p>
        <a>Sitemap</a>
        <a>Docs</a>
        <a>About</a>
        <small>
          © 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.
        </small>
      </footer>
    </main>
  );
}
