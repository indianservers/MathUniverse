import {
  Check,
  CirclePlay,
  Eraser,
  Info,
  Link2,
  RotateCcw,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./FocusDirectrixTargetLesson10142.css";

type Point = { x: number; y: number };
const round = (value: number) => Math.round(value * 100) / 100;
const pointOnParabola = (x: number, focusY: number, directrixY: number) => ({
  x,
  y:
    (x * x + focusY * focusY - directrixY * directrixY) /
    (2 * (focusY - directrixY)),
});

export default function FocusDirectrixTargetLesson10142({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [focusY, setFocusY] = useState(1.5),
    [directrixY, setDirectrixY] = useState(-5),
    [point, setPoint] = useState<Point>(() => pointOnParabola(4, 1.5, -5));
  const [trace, setTrace] = useState<Point[]>([]),
    [drag, setDrag] = useState<"point" | "directrix" | null>(null),
    [playing, setPlaying] = useState(false),
    [phase, setPhase] = useState(0),
    [actions, setActions] = useState(0);
  const dragRef = useRef<"point" | "directrix" | null>(null);
  const pf = Math.hypot(point.x, point.y - focusY),
    pd = Math.abs(point.y - directrixY),
    difference = Math.abs(pf - pd),
    equal = difference < 0.035,
    eccentricity = pd ? pf / pd : 0,
    vertexY = (focusY + directrixY) / 2;
  const graph = useMemo(() => {
    const W = 940,
      H = 430,
      sx = (x: number) => W / 2 + x * 38,
      sy = (y: number) => H / 2 - y * 25;
    const samples = Array.from({ length: 161 }, (_, i) => -8 + i / 10)
      .map((x) => pointOnParabola(x, focusY, directrixY))
      .filter((q) => q.y < 9);
    return {
      W,
      H,
      sx,
      sy,
      path: samples
        .map(
          (q, i) =>
            `${i ? "L" : "M"}${sx(q.x).toFixed(1)},${sy(q.y).toFixed(1)}`,
        )
        .join(" "),
    };
  }, [focusY, directrixY]);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setPhase((v) => v + 0.12), 80);
    return () => window.clearInterval(timer);
  }, [playing]);
  useEffect(() => {
    if (!playing) return;
    const x = 6 * Math.sin(phase),
      next = pointOnParabola(x, focusY, directrixY);
    setPoint(next);
    setTrace((old) => [...old.slice(-139), next]);
  }, [phase, playing, focusY, directrixY]);
  const updatePoint = (next: Point) => {
    setPoint(next);
    const nextPf = Math.hypot(next.x, next.y - focusY),
      nextPd = Math.abs(next.y - directrixY);
    if (Math.abs(nextPf - nextPd) < 0.12)
      setTrace((old) => [...old.slice(-139), next]);
    setActions((v) => v + 1);
  };
  const svgPoint = (event: ReactPointerEvent<SVGSVGElement>) => {
    const box = event.currentTarget.getBoundingClientRect(),
      scaleX = graph.W / box.width,
      scaleY = graph.H / box.height;
    return {
      x: ((event.clientX - box.left) * scaleX - graph.W / 2) / 38,
      y: -((event.clientY - box.top) * scaleY - graph.H / 2) / 25,
    };
  };
  const move = (event: ReactPointerEvent<SVGSVGElement>) => {
    const activeDrag = dragRef.current ?? drag;
    if (!activeDrag || event.buttons !== 1) return;
    const q = svgPoint(event);
    if (activeDrag === "directrix") {
      const d = Math.max(-8, Math.min(vertexY - 0.5, q.y));
      setDirectrixY(round(d));
      setPoint(pointOnParabola(point.x, focusY, d));
      setTrace([]);
      setActions((v) => v + 1);
    } else if (activeDrag === "point")
      updatePoint({
        x: round(Math.max(-8, Math.min(8, q.x))),
        y: round(Math.max(-8, Math.min(8, q.y))),
      });
  };
  const snap = () => updatePoint(pointOnParabola(point.x, focusY, directrixY));
  const reset = () => {
    setFocusY(1.5);
    setDirectrixY(-5);
    setPoint(pointOnParabola(4, 1.5, -5));
    setTrace([]);
    setPlaying(false);
    setPhase(0);
    setActions((v) => v + 1);
  };
  return (
    <section
      className="fd10142-page"
      data-testid="school-mockup-0816"
      data-object-model="dedicated-focus-directrix-locus-trace-engine"
      data-focus-y={focusY.toFixed(2)}
      data-directrix-y={directrixY.toFixed(2)}
      data-point={`${point.x.toFixed(2)},${point.y.toFixed(2)}`}
      data-pf={pf.toFixed(3)}
      data-pd={pd.toFixed(3)}
      data-equal={String(equal)}
      data-eccentricity={eccentricity.toFixed(3)}
      data-trace-count={trace.length}
      data-playing={String(playing)}
      data-actions={actions}
    >
      <header>
        <small>CLASS 11 &bull; CONIC SECTIONS</small>
        <h1>Focus-Directrix Definition</h1>
        <p>
          Focus-Directrix Definition is a school mathematics idea in Conic
          Sections. Explore the distance rule that creates a parabola and its
          locus.
        </p>
        <div>
          <span>18 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>geometry2d</span>
        </div>
      </header>
      <main>
        <aside className="fd-readout">
          <h2>INTERACTIVE LAB</h2>
          <h3>Locus Tracer: Parabola</h3>
          <p>
            Drag point P anywhere in the plane. Only positions with PF = PD
            leave a trace. Drag the directrix to change the parabola.
          </p>
          <article>
            <b>
              PF <small>(P to Focus)</small>
            </b>
            <strong>{pf.toFixed(3)}</strong>
            <span>
              <Link2 /> units
            </span>
          </article>
          <article>
            <b>
              PD <small>(Perp. dist. to Directrix)</small>
            </b>
            <strong>{pd.toFixed(3)}</strong>
            <span>
              <Link2 /> units
            </span>
          </article>
          <article className={equal ? "ok" : "bad"}>
            <b>Equality Check</b>
            <strong>PF {equal ? "=" : "≠"} PD</strong>
            {equal && <Check />}
          </article>
          <article className="ratio">
            <strong>e = PF / PD = {eccentricity.toFixed(3)}</strong>
            <p>For a parabola, e = 1</p>
          </article>
          <button onClick={snap}>Snap P to locus</button>
        </aside>
        <section className="fd-board">
          <div className="tools">
            <button
              aria-label="Play locus animation"
              onClick={() => setPlaying((v) => !v)}
            >
              <CirclePlay />
              {playing ? "Pause" : "Play"}
            </button>
            <button
              onClick={() => {
                setTrace([]);
                setActions((v) => v + 1);
              }}
            >
              <Eraser /> Clear Trace
            </button>
            <button onClick={reset}>
              <RotateCcw /> Reset
            </button>
          </div>
          <svg
            viewBox="0 0 940 430"
            onPointerDownCapture={(event) => {
              const q = svgPoint(event);
              if (Math.hypot(q.x - point.x, q.y - point.y) < 0.75) {
                dragRef.current = "point";
                setDrag("point");
              } else if (Math.abs(q.y - directrixY) < 0.45) {
                dragRef.current = "directrix";
                setDrag("directrix");
              }
            }}
            onPointerMove={move}
            onPointerUp={() => {
              dragRef.current = null;
              setDrag(null);
            }}
            onPointerLeave={() => {
              dragRef.current = null;
              setDrag(null);
            }}
            aria-label="Focus directrix locus graph"
          >
            {Array.from({ length: 25 }, (_, i) => (
              <g key={i}>
                <line
                  className="grid"
                  x1={graph.sx(i - 12)}
                  x2={graph.sx(i - 12)}
                  y1="0"
                  y2="430"
                />
                <line
                  className="grid"
                  x1="0"
                  x2="940"
                  y1={graph.sy(i - 12)}
                  y2={graph.sy(i - 12)}
                />
              </g>
            ))}
            <line
              className="axis"
              x1="0"
              x2="940"
              y1={graph.sy(0)}
              y2={graph.sy(0)}
            />
            <line
              className="axis"
              x1={graph.sx(0)}
              x2={graph.sx(0)}
              y1="0"
              y2="430"
            />
            <path className="curve" d={graph.path} />
            {trace.map((q, i) => (
              <circle
                className="trace"
                key={i}
                cx={graph.sx(q.x)}
                cy={graph.sy(q.y)}
                r="2"
              />
            ))}
            <line
              className="directrix"
              x1="0"
              x2="940"
              y1={graph.sy(directrixY)}
              y2={graph.sy(directrixY)}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                dragRef.current = "directrix";
                setDrag("directrix");
              }}
            />
            <circle
              className="directrix-handle"
              role="slider"
              aria-label="Draggable directrix"
              tabIndex={0}
              cx={graph.sx(0)}
              cy={graph.sy(directrixY)}
              r="9"
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                dragRef.current = "directrix";
                setDrag("directrix");
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowUp" || e.key === "ArrowRight") {
                  const d = directrixY + 0.25;
                  setDirectrixY(d);
                  setPoint(pointOnParabola(point.x, focusY, d));
                  setTrace([]);
                }
                if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
                  const d = directrixY - 0.25;
                  setDirectrixY(d);
                  setPoint(pointOnParabola(point.x, focusY, d));
                  setTrace([]);
                }
              }}
            />
            <circle
              className="focus"
              cx={graph.sx(0)}
              cy={graph.sy(focusY)}
              r="7"
            />
            <line
              className="pf"
              x1={graph.sx(0)}
              y1={graph.sy(focusY)}
              x2={graph.sx(point.x)}
              y2={graph.sy(point.y)}
            />
            <line
              className="pd"
              x1={graph.sx(point.x)}
              y1={graph.sy(point.y)}
              x2={graph.sx(point.x)}
              y2={graph.sy(directrixY)}
            />
            <circle
              className="point"
              role="slider"
              aria-label="Draggable locus point P"
              tabIndex={0}
              cx={graph.sx(point.x)}
              cy={graph.sy(point.y)}
              r="8"
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                dragRef.current = "point";
                setDrag("point");
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight")
                  updatePoint({ ...point, x: round(point.x + 0.25) });
                if (e.key === "ArrowLeft")
                  updatePoint({ ...point, x: round(point.x - 0.25) });
                if (e.key === "ArrowUp")
                  updatePoint({ ...point, y: round(point.y + 0.25) });
                if (e.key === "ArrowDown")
                  updatePoint({ ...point, y: round(point.y - 0.25) });
              }}
            />
            <text x={graph.sx(point.x) + 10} y={graph.sy(point.y) - 10}>
              P ({point.x.toFixed(2)}, {point.y.toFixed(2)})
            </text>
            <text x={graph.sx(0) + 12} y={graph.sy(focusY) + 5}>
              F (0, {focusY.toFixed(2)})
            </text>
            <text x={graph.sx(0) + 12} y={graph.sy(vertexY) + 18}>
              Vertex (0, {vertexY.toFixed(2)})
            </text>
            <text
              className="directrix-label"
              x="760"
              y={graph.sy(directrixY) - 10}
            >
              Directrix y = {directrixY.toFixed(2)}
            </text>
          </svg>
          <footer>
            <Info />
            <span>
              Only points equidistant from the focus and directrix leave a
              trace. Move P to explore.
            </span>
            <div>
              <i /> Trace (PF = PD)
              <b /> Perp. distance PD
              <em /> Directrix
            </div>
          </footer>
        </section>
      </main>
    </section>
  );
}
