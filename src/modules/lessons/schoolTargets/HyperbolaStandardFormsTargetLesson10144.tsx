import { CheckCircle2, Hand, RotateCcw } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./HyperbolaStandardFormsTargetLesson10144.css";

type Orientation = "horizontal" | "vertical";
type Branch = 1 | -1;

export default function HyperbolaStandardFormsTargetLesson10144({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [orientation, setOrientation] = useState<Orientation>("horizontal");
  const [a, setA] = useState(4);
  const [b, setB] = useState(3);
  const [parameter, setParameter] = useState(1.047);
  const [branch, setBranch] = useState<Branch>(1);
  const [actions, setActions] = useState(0);
  const dragging = useRef(false);
  const c = Math.hypot(a, b);
  const horizontal = orientation === "horizontal";
  const point = horizontal
    ? { x: branch * a * Math.cosh(parameter), y: b * Math.sinh(parameter) }
    : { x: b * Math.sinh(parameter), y: branch * a * Math.cosh(parameter) };
  const f1 = horizontal ? { x: -c, y: 0 } : { x: 0, y: -c };
  const f2 = horizontal ? { x: c, y: 0 } : { x: 0, y: c };
  const pf1 = Math.hypot(point.x - f1.x, point.y - f1.y);
  const pf2 = Math.hypot(point.x - f2.x, point.y - f2.y);
  const difference = Math.abs(pf1 - pf2);
  const graph = useMemo(() => {
    const W = 850,
      H = 470,
      scale = 34;
    const sx = (x: number) => W / 2 + x * scale;
    const sy = (y: number) => H / 2 - y * scale;
    const paths = (side: Branch) =>
      Array.from({ length: 81 }, (_, index) => -1.65 + index * (3.3 / 80))
        .map((t) =>
          horizontal
            ? { x: side * a * Math.cosh(t), y: b * Math.sinh(t) }
            : { x: b * Math.sinh(t), y: side * a * Math.cosh(t) },
        )
        .filter((p) => Math.abs(p.x) < 13 && Math.abs(p.y) < 7)
        .map(
          (p, index) =>
            `${index ? "L" : "M"}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`,
        )
        .join(" ");
    return { W, H, scale, sx, sy, left: paths(-1), right: paths(1) };
  }, [a, b, horizontal]);

  const movePoint = (event: ReactPointerEvent<SVGSVGElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const x =
      (((event.clientX - box.left) * graph.W) / box.width - graph.W / 2) /
      graph.scale;
    const y =
      (graph.H / 2 - ((event.clientY - box.top) * graph.H) / box.height) /
      graph.scale;
    if (horizontal) {
      setBranch(x < 0 ? -1 : 1);
      setParameter(Math.max(-1.65, Math.min(1.65, Math.asinh(y / b))));
    } else {
      setBranch(y < 0 ? -1 : 1);
      setParameter(Math.max(-1.65, Math.min(1.65, Math.asinh(x / b))));
    }
    setActions((value) => value + 1);
  };
  const reset = () => {
    setOrientation("horizontal");
    setA(4);
    setB(3);
    setParameter(1.047);
    setBranch(1);
    setActions((value) => value + 1);
  };
  const equation = horizontal
    ? `x²/${a * a} − y²/${b * b} = 1`
    : `y²/${a * a} − x²/${b * b} = 1`;
  const vertices = horizontal
    ? `(±${a.toFixed(1)}, 0)`
    : `(0, ±${a.toFixed(1)})`;
  const foci = horizontal ? `(±${c.toFixed(1)}, 0)` : `(0, ±${c.toFixed(1)})`;
  const coVertices = horizontal
    ? `(0, ±${b.toFixed(1)})`
    : `(±${b.toFixed(1)}, 0)`;

  return (
    <section
      className="hy10144-page"
      data-testid="school-mockup-0818"
      data-object-model="dedicated-hyperbola-focal-difference-engine"
      data-orientation={orientation}
      data-a={a.toFixed(2)}
      data-b={b.toFixed(2)}
      data-c={c.toFixed(4)}
      data-point={`${point.x.toFixed(2)},${point.y.toFixed(2)}`}
      data-distance-difference={difference.toFixed(4)}
      data-eccentricity={(c / a).toFixed(4)}
      data-actions={actions}
    >
      <header>
        <small>CLASS 11 &bull; CONIC SECTIONS</small>
        <h1>Hyperbola Standard Forms</h1>
        <p>
          Explore both standard forms of a hyperbola. Adjust parameters, drag
          point P,
          <br />
          and verify that |PF₁ − PF₂| = 2a (constant).
        </p>
        <button onClick={reset}>
          <RotateCcw /> Reset explorer
        </button>
      </header>
      <main>
        <aside className="hy-controls">
          <h2>CHOOSE STANDARD FORM</h2>
          <div
            className="hy-forms"
            role="group"
            aria-label="Hyperbola orientation"
          >
            <button
              className={horizontal ? "active" : ""}
              onClick={() => {
                setOrientation("horizontal");
                setActions((v) => v + 1);
              }}
            >
              <b>Horizontal</b>
              <span>x²/a² − y²/b² = 1</span>
            </button>
            <button
              className={!horizontal ? "active" : ""}
              onClick={() => {
                setOrientation("vertical");
                setActions((v) => v + 1);
              }}
            >
              <b>Vertical</b>
              <span>y²/a² − x²/b² = 1</span>
            </button>
          </div>
          <h2>PARAMETERS (a, b &gt; 0)</h2>
          <label>
            <b>a (transverse)</b>
            <input
              aria-label="Transverse parameter a"
              type="range"
              min="2"
              max="6"
              step="0.1"
              value={a}
              onInput={(e) => {
                setA(Number(e.currentTarget.value));
                setActions((v) => v + 1);
              }}
              onChange={(e) => setA(Number(e.target.value))}
            />
            <output>{a.toFixed(1)}</output>
          </label>
          <label>
            <b>b (conjugate)</b>
            <input
              aria-label="Conjugate parameter b"
              type="range"
              min="1"
              max="5"
              step="0.1"
              value={b}
              onInput={(e) => {
                setB(Number(e.currentTarget.value));
                setActions((v) => v + 1);
              }}
              onChange={(e) => setB(Number(e.target.value))}
            />
            <output>{b.toFixed(1)}</output>
          </label>
          <article>
            <h2>KEY VALUES</h2>
            <p>a = {a.toFixed(1)}</p>
            <p>b = {b.toFixed(1)}</p>
            <p>c = √(a² + b²) = {c.toFixed(3)}</p>
            <p>Eccentricity e = c/a = {(c / a).toFixed(3)}</p>
          </article>
          <article className="hy-elements">
            <h2>CALCULATED ELEMENTS</h2>
            <p>
              <i className="cyan" />
              Vertices <span>{vertices}</span>
            </p>
            <p>
              <i className="orange" />
              Foci <span>{foci}</span>
            </p>
            <p>
              <i className="violet" />
              Co-vertices <span>{coVertices}</span>
            </p>
            <p>
              <i className="dash" />
              Asymptotes{" "}
              <span>
                {horizontal
                  ? `y = ±${(b / a).toFixed(2)}x`
                  : `y = ±${(a / b).toFixed(2)}x`}
              </span>
            </p>
            <p>
              <i className="rect" />
              Conjugate Rect.{" "}
              <span>
                2a × 2b = {(2 * a).toFixed(1)} × {(2 * b).toFixed(1)}
              </span>
            </p>
          </article>
        </aside>
        <section className="hy-work">
          <div className="hy-board">
            <h2>HYPERBOLA EXPLORER</h2>
            <div className="equation">
              Equation:<strong>{equation}</strong>
            </div>
            <div className="drag-hint">
              <Hand /> Drag point P anywhere on the hyperbola
            </div>
            <svg
              viewBox={`0 0 ${graph.W} ${graph.H}`}
              aria-label="Interactive hyperbola graph"
              onPointerDown={(e) => {
                dragging.current = true;
                e.currentTarget.setPointerCapture(e.pointerId);
                movePoint(e);
              }}
              onPointerMove={(e) => {
                if (dragging.current && e.buttons === 1) movePoint(e);
              }}
              onPointerUp={(e) => {
                dragging.current = false;
                e.currentTarget.releasePointerCapture(e.pointerId);
              }}
            >
              {Array.from({ length: 27 }, (_, i) => i - 13).map((n) => (
                <g key={n}>
                  <line
                    className="grid"
                    x1={graph.sx(n)}
                    x2={graph.sx(n)}
                    y1="0"
                    y2={graph.H}
                  />
                  <line
                    className="grid"
                    x1="0"
                    x2={graph.W}
                    y1={graph.sy(n)}
                    y2={graph.sy(n)}
                  />
                </g>
              ))}
              <line
                className="axis"
                x1="0"
                x2={graph.W}
                y1={graph.sy(0)}
                y2={graph.sy(0)}
              />
              <line
                className="axis"
                x1={graph.sx(0)}
                x2={graph.sx(0)}
                y1="0"
                y2={graph.H}
              />
              <line
                className="asymptote"
                x1={graph.sx(-13)}
                y1={graph.sy(horizontal ? (-13 * b) / a : (-13 * a) / b)}
                x2={graph.sx(13)}
                y2={graph.sy(horizontal ? (13 * b) / a : (13 * a) / b)}
              />
              <line
                className="asymptote"
                x1={graph.sx(-13)}
                y1={graph.sy(horizontal ? (13 * b) / a : (13 * a) / b)}
                x2={graph.sx(13)}
                y2={graph.sy(horizontal ? (-13 * b) / a : (-13 * a) / b)}
              />
              <rect
                className="conjugate"
                x={graph.sx(-a)}
                y={graph.sy(b)}
                width={2 * a * graph.scale}
                height={2 * b * graph.scale}
              />
              <path className="curve" d={graph.left} />
              <path className="curve" d={graph.right} />
              <line
                className="distance"
                x1={graph.sx(f1.x)}
                y1={graph.sy(f1.y)}
                x2={graph.sx(point.x)}
                y2={graph.sy(point.y)}
              />
              <line
                className="distance"
                x1={graph.sx(f2.x)}
                y1={graph.sy(f2.y)}
                x2={graph.sx(point.x)}
                y2={graph.sy(point.y)}
              />
              <g className="foci">
                <circle cx={graph.sx(f1.x)} cy={graph.sy(f1.y)} r="6" />
                <circle cx={graph.sx(f2.x)} cy={graph.sy(f2.y)} r="6" />
              </g>
              <g className="vertices">
                <circle
                  cx={graph.sx(horizontal ? -a : 0)}
                  cy={graph.sy(horizontal ? 0 : -a)}
                  r="6"
                />
                <circle
                  cx={graph.sx(horizontal ? a : 0)}
                  cy={graph.sy(horizontal ? 0 : a)}
                  r="6"
                />
              </g>
              <g className="point">
                <circle cx={graph.sx(point.x)} cy={graph.sy(point.y)} r="8" />
                <text x={graph.sx(point.x) + 10} y={graph.sy(point.y) - 10}>
                  P ({point.x.toFixed(2)}, {point.y.toFixed(2)})
                </text>
              </g>
            </svg>
            <aside className="verify">
              <p>
                PF₁ = <b>{pf1.toFixed(2)}</b>
              </p>
              <p>
                PF₂ = <b>{pf2.toFixed(2)}</b>
              </p>
              <p>
                |PF₁ − PF₂| = <b>{difference.toFixed(2)}</b>
              </p>
              <strong>= 2a = {(2 * a).toFixed(2)}</strong>
              <span>
                <CheckCircle2 /> Verified
              </span>
            </aside>
          </div>
          <div className="hy-summary">
            <article>
              <h2>ELEMENT SUMMARY</h2>
              <p>
                Vertices <span>{vertices}</span>
              </p>
              <p>
                Foci <span>{foci}</span>
              </p>
              <p>
                Asymptotes{" "}
                <span>{horizontal ? "y = ±(b/a)x" : "y = ±(a/b)x"}</span>
              </p>
              <p>
                Eccentricity <span>e = c/a &gt; 1</span>
              </p>
            </article>
            <article>
              <h2>BRANCHES</h2>
              <p>
                Two separate branches open{" "}
                {horizontal
                  ? "left and right along the transverse x-axis."
                  : "up and down along the transverse y-axis."}
              </p>
            </article>
            <article>
              <h2>PROPERTIES</h2>
              <p>✓ |PF₁ − PF₂| = 2a for any point P</p>
              <p>✓ Asymptotes intersect at the center</p>
              <p>✓ The conjugate rectangle has sides 2a and 2b</p>
              <p>✓ Eccentricity e &gt; 1</p>
            </article>
          </div>
        </section>
      </main>
    </section>
  );
}
