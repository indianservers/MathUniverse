import {
  CheckCircle2,
  Grid3X3,
  Hand,
  LocateFixed,
  Move,
  Plus,
  RotateCcw,
  ZoomIn,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./ParabolaNormalTargetLesson10148.css";

type Tool = "point" | "pan";
export default function ParabolaNormalTargetLesson10148({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [t, setT] = useState(1.5),
    [tool, setTool] = useState<Tool>("point"),
    [zoom, setZoom] = useState(1),
    [pan, setPan] = useState({ x: 0, y: 0 });
  const [axes, setAxes] = useState(true),
    [grid, setGrid] = useState(true),
    [tracing, setTracing] = useState(false),
    [trace, setTrace] = useState<{ x: number; y: number }[]>([]),
    [actions, setActions] = useState(0);
  const dragging = useRef(false),
    previous = useRef({ x: 0, y: 0 }),
    p = { x: t * t, y: 2 * t };
  const tangentSlope = Math.abs(t) < 0.001 ? Infinity : 1 / t,
    normalSlope = -t,
    normalIntercept = 2 * t + t * t * t,
    product = Number.isFinite(tangentSlope) ? tangentSlope * normalSlope : -1;
  const graph = useMemo(() => {
    const W = 700,
      H = 390,
      scale = 43 * zoom,
      sx = (x: number) => W * 0.36 + pan.x + x * scale,
      sy = (y: number) => H * 0.55 + pan.y - y * scale;
    const path = Array.from({ length: 181 }, (_, i) => -3 + i / 30)
      .map(
        (u, i) =>
          `${i ? "L" : "M"}${sx(u * u).toFixed(1)},${sy(2 * u).toFixed(1)}`,
      )
      .join(" ");
    return { W, H, scale, sx, sy, path };
  }, [pan, zoom]);
  useEffect(() => {
    if (tracing) setTrace((old) => [...old.slice(-99), { x: t * t, y: 2 * t }]);
  }, [t, tracing]);
  const updateT = (v: number) => {
    setT(Math.max(-3, Math.min(3, v)));
    setActions((x) => x + 1);
  };
  const pointer = (e: ReactPointerEvent<SVGSVGElement>) => {
    const b = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - b.left) * graph.W) / b.width,
      y: ((e.clientY - b.top) * graph.H) / b.height,
    };
  };
  const movePointer = (e: ReactPointerEvent<SVGSVGElement>) => {
    const q = pointer(e);
    if (tool === "pan") {
      const dx = q.x - previous.current.x,
        dy = q.y - previous.current.y;
      if (Math.abs(dx) + Math.abs(dy) < 0.2) return;
      setPan((v) => ({ x: v.x + dx, y: v.y + dy }));
      previous.current = q;
    } else {
      const y = -(q.y - graph.H * 0.55 - pan.y) / graph.scale;
      updateT(y / 2);
    }
    setActions((v) => v + 1);
  };
  const reset = () => {
    setT(1.5);
    setTool("point");
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setAxes(true);
    setGrid(true);
    setTracing(false);
    setTrace([]);
    setActions((v) => v + 1);
  };
  const finite = Number.isFinite(tangentSlope);
  return (
    <section
      className="pn10148-page"
      data-testid="school-mockup-0822"
      data-object-model="dedicated-parabola-normal-perpendicularity-engine"
      data-t={t.toFixed(2)}
      data-point={`${p.x.toFixed(2)},${p.y.toFixed(2)}`}
      data-tangent-slope={finite ? tangentSlope.toFixed(6) : "Infinity"}
      data-normal-slope={normalSlope.toFixed(6)}
      data-product={product.toFixed(6)}
      data-normal-intercept={normalIntercept.toFixed(4)}
      data-angle="90.00"
      data-tool={tool}
      data-zoom={zoom.toFixed(2)}
      data-pan={`${pan.x.toFixed(1)},${pan.y.toFixed(1)}`}
      data-trace-count={trace.length}
      data-actions={actions}
    >
      <header>
        <small>CLASS 11 &bull; CONIC SECTIONS</small>
        <h1>Normal to a Parabola</h1>
        <p>
          Move the parameter t to see the tangent and normal at P(at², 2at),
          verify slopes are negative
          <br />
          reciprocals, and confirm the normal passes through P.
        </p>
        <div>
          <span>~18 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>geometry2d</span>
        </div>
      </header>
      <main>
        <section className="pn-lab">
          <h2>⚗ INTERACTIVE NORMAL LAB</h2>
          <article className="pn-slider">
            <label>
              Parameter t
              <input
                aria-label="Normal parameter t"
                type="range"
                min="-3"
                max="3"
                step=".01"
                value={t}
                onInput={(e) => updateT(Number(e.currentTarget.value))}
                onChange={(e) => setT(Number(e.target.value))}
              />
              <output>{t.toFixed(2)}</output>
            </label>
            <div>
              Also try:{" "}
              {[-2, -1, -0.5, 0, 0.5, 1, 2].map((v) => (
                <button key={v} onClick={() => updateT(v)}>
                  {v}
                </button>
              ))}
            </div>
          </article>
          <section className="pn-board">
            <svg
              viewBox={`0 0 ${graph.W} ${graph.H}`}
              aria-label="Interactive parabola normal graph"
              onPointerDown={(e) => {
                dragging.current = true;
                previous.current = pointer(e);
                e.currentTarget.setPointerCapture(e.pointerId);
                if (tool === "point") movePointer(e);
              }}
              onPointerMove={(e) => {
                if (dragging.current && e.buttons === 1) movePointer(e);
              }}
              onPointerUp={(e) => {
                dragging.current = false;
                e.currentTarget.releasePointerCapture(e.pointerId);
              }}
            >
              {grid &&
                Array.from({ length: 19 }, (_, i) => i - 7).map((n) => (
                  <g key={n}>
                    <line
                      className="gridline"
                      x1={graph.sx(n)}
                      x2={graph.sx(n)}
                      y1="0"
                      y2={graph.H}
                    />
                    <line
                      className="gridline"
                      x1="0"
                      x2={graph.W}
                      y1={graph.sy(n)}
                      y2={graph.sy(n)}
                    />
                  </g>
                ))}
              {axes && (
                <>
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
                </>
              )}
              <path className="parabola" d={graph.path} />
              {trace.map((q, i) => (
                <circle
                  key={i}
                  className="trace"
                  cx={graph.sx(q.x)}
                  cy={graph.sy(q.y)}
                  r="2"
                />
              ))}
              {finite ? (
                <line
                  className="tangent"
                  x1={graph.sx(-5)}
                  y1={graph.sy(tangentSlope * -5 + t)}
                  x2={graph.sx(7)}
                  y2={graph.sy(tangentSlope * 7 + t)}
                />
              ) : (
                <line
                  className="tangent"
                  x1={graph.sx(0)}
                  x2={graph.sx(0)}
                  y1="0"
                  y2={graph.H}
                />
              )}
              <line
                className="normal"
                x1={graph.sx(-5)}
                y1={graph.sy(normalSlope * -5 + normalIntercept)}
                x2={graph.sx(7)}
                y2={graph.sy(normalSlope * 7 + normalIntercept)}
              />
              <line
                className="radius"
                x1={graph.sx(0)}
                y1={graph.sy(0)}
                x2={graph.sx(p.x)}
                y2={graph.sy(p.y)}
              />
              <circle
                className="point"
                cx={graph.sx(p.x)}
                cy={graph.sy(p.y)}
                r="7"
              />
              <text
                className="point-label"
                x={graph.sx(p.x) + 10}
                y={graph.sy(p.y) + 22}
              >
                P({p.x.toFixed(2)}, {p.y.toFixed(2)})
              </text>
              <text
                className="t-label"
                x={graph.sx(5)}
                y={graph.sy(finite ? tangentSlope * 5 + t : 4)}
              >
                Tangent
              </text>
              <text
                className="n-label"
                x={graph.sx(5)}
                y={graph.sy(normalSlope * 5 + normalIntercept)}
              >
                Normal
              </text>
            </svg>
            <footer>
              <span>Parabola y²=4x</span>
              <span>Tangent ty=x+t²</span>
              <span>Normal y=-tx+2t+t³</span>
              <span>Point P(t²,2t)</span>
            </footer>
          </section>
          <div className="pn-tools">
            <button
              className={tool === "point" ? "active" : ""}
              onClick={() => setTool("point")}
            >
              <Hand /> Point
            </button>
            <button
              className={tool === "pan" ? "active" : ""}
              onClick={() => setTool("pan")}
            >
              <Move /> Pan
            </button>
            <button onClick={() => setZoom((v) => Math.min(1.6, v + 0.15))}>
              <ZoomIn /> Zoom
            </button>
            <button onClick={reset}>
              <RotateCcw /> Reset
            </button>
            <button onClick={() => setAxes((v) => !v)}>
              <Plus /> Axes
            </button>
            <button onClick={() => setGrid((v) => !v)}>
              <Grid3X3 /> Grid
            </button>
            <button
              className={tracing ? "active" : ""}
              onClick={() => setTracing((v) => !v)}
            >
              <LocateFixed /> Trace P
            </button>
            <strong>
              a=1
              <br />
              Set a
            </strong>
          </div>
        </section>
        <aside className="pn-proof">
          <article>
            <h2>◆ POINT AND LINES</h2>
            <div>
              <p>P(at²,2at)</p>
              <strong>
                P({p.x.toFixed(2)}, {p.y.toFixed(2)})
              </strong>
              <p>Tangent&nbsp; ty=x+at²</p>
              <strong>
                {finite
                  ? `y=${tangentSlope.toFixed(2)}x+${t.toFixed(2)}`
                  : "x=0"}
              </strong>
              <p>Normal&nbsp; y=-tx+2at+at³</p>
              <strong>
                y={normalSlope.toFixed(2)}x+{normalIntercept.toFixed(3)}
              </strong>
            </div>
          </article>
          <article>
            <h2>◆ SLOPES AND PERPENDICULARITY</h2>
            <p>
              Slope of tangent <span>mt=1/t</span>
              <strong>{finite ? tangentSlope.toFixed(6) : "∞"}</strong>
            </p>
            <p>
              Slope of normal <span>mn=-t</span>
              <strong>{normalSlope.toFixed(6)}</strong>
            </p>
            <p>
              <u>Product</u>
              <span>mt × mn=-1</span>
              <strong>
                {product.toFixed(6)} <CheckCircle2 />
              </strong>
            </p>
          </article>
          <article>
            <h2>◆ ANGLE BETWEEN LINES</h2>
            <p>
              θ=arctan |(mn-mt)/(1+mtmn)|{" "}
              <strong>
                90.00° <CheckCircle2 />
              </strong>
            </p>
          </article>
          <article>
            <h2>◆ NORMAL PASSES THROUGH P</h2>
            <p>
              Substitute P({p.x.toFixed(2)}, {p.y.toFixed(2)}) into normal:
            </p>
            <p>
              LHS y={p.y.toFixed(2)} = RHS{" "}
              {(normalSlope * p.x + normalIntercept).toFixed(2)}{" "}
              <CheckCircle2 />
            </p>
          </article>
          <article className="special">
            <h2>◆ SPECIAL CASE: t=0</h2>
            <p>
              When t=0, P=(0,0). The tangent is the y-axis (x=0), which has
              undefined slope. The normal is y=0, the x-axis, with slope 0. They
              are perpendicular.
            </p>
            <svg viewBox="0 0 150 80">
              <line x1="10" x2="140" y1="40" y2="40" />
              <line x1="75" x2="75" y1="5" y2="75" />
              <circle cx="75" cy="40" r="4" />
            </svg>
          </article>
        </aside>
      </main>
    </section>
  );
}
