import {
  Info,
  Lightbulb,
  LocateFixed,
  MousePointer2,
  Move,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./EccentricityTargetLesson10145.css";

type Mode = "point" | "pan";
const classify = (e: number) =>
  e < 0.01
    ? "Circle"
    : e < 0.995
      ? "Ellipse"
      : e < 1.005
        ? "Parabola"
        : "Hyperbola";

export default function EccentricityTargetLesson10145({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [eccentricity, setEccentricity] = useState(0.6);
  const [theta, setTheta] = useState(0.65);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [mode, setMode] = useState<Mode>("point");
  const [actions, setActions] = useState(0);
  const dragging = useRef(false);
  const previous = useRef({ x: 0, y: 0 });
  const e = Math.max(0.001, eccentricity);
  const semiLatus = 3;
  const radius =
    eccentricity < 0.01
      ? semiLatus
      : semiLatus / Math.max(0.08, 1 + e * Math.cos(theta));
  const point = { x: radius * Math.cos(theta), y: radius * Math.sin(theta) };
  const directrixX = eccentricity < 0.01 ? 8 : semiLatus / e;
  const pf = Math.hypot(point.x, point.y);
  const pd = Math.abs(directrixX - point.x);
  const ratio = eccentricity < 0.01 ? 0 : pf / pd;
  const regime = classify(eccentricity);
  const graph = useMemo(() => {
    const W = 620,
      H = 390,
      scale = 39 * zoom;
    const sx = (x: number) => W / 2 + pan.x + x * scale;
    const sy = (y: number) => H / 2 + pan.y - y * scale;
    const samples = Array.from(
      { length: 721 },
      (_, index) => -Math.PI + (index * Math.PI * 2) / 720,
    ).map((angle) => {
      const denominator = 1 + Math.max(0.001, eccentricity) * Math.cos(angle);
      if (eccentricity >= 1 && Math.abs(denominator) < 0.035) return null;
      const r = eccentricity < 0.01 ? semiLatus : semiLatus / denominator;
      const x = r * Math.cos(angle),
        y = r * Math.sin(angle);
      return Math.abs(x) > 10 || Math.abs(y) > 7 ? null : { x, y };
    });
    let pen = false;
    const path = samples
      .map((p) => {
        if (!p) {
          pen = false;
          return "";
        }
        const command = pen ? "L" : "M";
        pen = true;
        return `${command}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`;
      })
      .join(" ");
    return { W, H, scale, sx, sy, path };
  }, [eccentricity, pan, zoom]);

  const pointer = (event: ReactPointerEvent<SVGSVGElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    return {
      x: ((event.clientX - box.left) * graph.W) / box.width,
      y: ((event.clientY - box.top) * graph.H) / box.height,
    };
  };
  const movePointer = (event: ReactPointerEvent<SVGSVGElement>) => {
    const q = pointer(event);
    if (mode === "pan") {
      const dx = q.x - previous.current.x;
      const dy = q.y - previous.current.y;
      if (Math.abs(dx) + Math.abs(dy) < 0.2) return;
      setPan((value) => ({
        x: value.x + dx,
        y: value.y + dy,
      }));
      previous.current = q;
    } else {
      const x = (q.x - graph.W / 2 - pan.x) / graph.scale;
      const y = -(q.y - graph.H / 2 - pan.y) / graph.scale;
      setTheta(Math.atan2(y, x));
    }
    setActions((value) => value + 1);
  };
  const reset = () => {
    setEccentricity(0.6);
    setTheta(0.65);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setMode("point");
    setActions((value) => value + 1);
  };
  const changeZoom = (delta: number) => {
    setZoom((value) => Math.max(0.65, Math.min(1.6, value + delta)));
    setActions((value) => value + 1);
  };

  return (
    <section
      className="ec10145-page"
      data-testid="school-mockup-0819"
      data-object-model="dedicated-focus-directrix-eccentricity-morph-engine"
      data-eccentricity={eccentricity.toFixed(2)}
      data-regime={regime}
      data-point={`${point.x.toFixed(2)},${point.y.toFixed(2)}`}
      data-pf={pf.toFixed(3)}
      data-pd={pd.toFixed(3)}
      data-ratio={ratio.toFixed(3)}
      data-zoom={zoom.toFixed(2)}
      data-pan={`${pan.x.toFixed(1)},${pan.y.toFixed(1)}`}
      data-mode={mode}
      data-actions={actions}
    >
      <header>
        <small>CLASS 11 &bull; CONIC SECTIONS</small>
        <h1>Eccentricity</h1>
        <p>
          Eccentricity is a school mathematics idea in Conic Sections. It helps
          students model data, functions, curves, proofs, and 3D
          <br />
          directions. We use related ideas in graphs, design, surveys,
          navigation, and measurement.
        </p>
        <div>
          <span>18 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>geometry2d</span>
        </div>
      </header>
      <main>
        <div className="ec-title">
          <h2>INTERACTIVE LAB</h2>
          <h3>Focus-Directrix Morph Lab</h3>
          <p>
            Move the slider to change e and watch the locus of points P such
            that
            <br />
            PF/PD = e. The conic morphs through all regimes.
          </p>
          <button onClick={reset}>
            <RotateCcw /> Reset lab
          </button>
        </div>
        <section className="ec-grid">
          <aside className="ec-controls">
            <article className="ec-slider">
              <p>
                <b>Eccentricity&nbsp; e</b>
                <strong>{eccentricity.toFixed(2)}</strong>
              </p>
              <input
                aria-label="Eccentricity e"
                type="range"
                min="0"
                max="1.8"
                step="0.01"
                value={eccentricity}
                onInput={(event) => {
                  setEccentricity(Number(event.currentTarget.value));
                  setActions((value) => value + 1);
                }}
                onChange={(event) =>
                  setEccentricity(Number(event.target.value))
                }
              />
              <div>
                <span>0</span>
                <span>1.8</span>
              </div>
            </article>
            <article className="ec-ratio">
              <small>Live ratio</small>
              <p>
                PF / PD = e = <strong>{ratio.toFixed(2)}</strong>
              </p>
            </article>
            <article className="ec-note">
              <Info />
              <p>
                As e → 0, the conic becomes a circle.
                <br />
                Circle is the e = 0 limiting classification.
              </p>
            </article>
            <article className={`ec-regime ${regime.toLowerCase()}`}>
              <small>CURRENT REGIME</small>
              <p>
                <strong>{regime}</strong>
                <span>
                  {regime === "Circle"
                    ? "e = 0"
                    : regime === "Ellipse"
                      ? "0 < e < 1"
                      : regime === "Parabola"
                        ? "e = 1"
                        : "e > 1"}
                </span>
              </p>
            </article>
          </aside>
          <section className="ec-board">
            <h4>Locus of P&nbsp; (PF/PD = e)</h4>
            <svg
              viewBox={`0 0 ${graph.W} ${graph.H}`}
              aria-label="Interactive eccentricity locus"
              onPointerDown={(event) => {
                dragging.current = true;
                previous.current = pointer(event);
                event.currentTarget.setPointerCapture(event.pointerId);
                if (mode === "point") movePointer(event);
              }}
              onPointerMove={(event) => {
                if (dragging.current && event.buttons === 1) movePointer(event);
              }}
              onPointerUp={(event) => {
                dragging.current = false;
                event.currentTarget.releasePointerCapture(event.pointerId);
              }}
            >
              {Array.from({ length: 21 }, (_, i) => i - 10).map((n) => (
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
                className="directrix"
                x1={graph.sx(directrixX)}
                x2={graph.sx(directrixX)}
                y1="0"
                y2={graph.H}
              />
              <path
                className={`locus ${regime.toLowerCase()}`}
                d={graph.path}
              />
              <line
                className="measure"
                x1={graph.sx(0)}
                y1={graph.sy(0)}
                x2={graph.sx(point.x)}
                y2={graph.sy(point.y)}
              />
              <line
                className="measure"
                x1={graph.sx(point.x)}
                y1={graph.sy(point.y)}
                x2={graph.sx(directrixX)}
                y2={graph.sy(point.y)}
              />
              <circle
                className="focus"
                cx={graph.sx(0)}
                cy={graph.sy(0)}
                r="7"
              />
              <text
                className="focus-label"
                x={graph.sx(0) - 30}
                y={graph.sy(0) + 22}
              >
                Focus F
              </text>
              <circle
                className="point"
                cx={graph.sx(point.x)}
                cy={graph.sy(point.y)}
                r="6"
              />
              <text x={graph.sx(point.x) + 10} y={graph.sy(point.y) - 10}>
                P
              </text>
              <text
                className="directrix-label"
                x={graph.sx(directrixX) + 8}
                y="35"
              >
                Directrix d
              </text>
              <text
                x={(graph.sx(point.x) + graph.sx(0)) / 2}
                y={(graph.sy(point.y) + graph.sy(0)) / 2 - 8}
              >
                PF
              </text>
              <text
                x={(graph.sx(point.x) + graph.sx(directrixX)) / 2}
                y={graph.sy(point.y) - 8}
              >
                PD
              </text>
            </svg>
            <div className="ec-tools">
              <button
                className={mode === "point" ? "active" : ""}
                aria-label="Move point"
                onClick={() => setMode("point")}
              >
                <MousePointer2 />
              </button>
              <button
                className={mode === "pan" ? "active" : ""}
                aria-label="Pan graph"
                onClick={() => setMode("pan")}
              >
                <Move />
              </button>
              <button aria-label="Zoom in" onClick={() => changeZoom(0.15)}>
                <ZoomIn />
              </button>
              <button aria-label="Zoom out" onClick={() => changeZoom(-0.15)}>
                <ZoomOut />
              </button>
              <button
                aria-label="Reset graph view"
                onClick={() => {
                  setPan({ x: 0, y: 0 });
                  setZoom(1);
                  setActions((v) => v + 1);
                }}
              >
                <LocateFixed />
              </button>
            </div>
          </section>
          <aside className="ec-guide">
            <article>
              <h2>REGIME GUIDE BY e</h2>
              <p className="ellipse">
                <i />0 = e &lt; 1 <span>Ellipse</span>
              </p>
              <p className="parabola">
                <i />e = 1 <span>Parabola</span>
              </p>
              <p className="hyperbola">
                <i />e &gt; 1 <span>Hyperbola</span>
              </p>
              <p className="circle">
                <i />e = 0 <span>Circle (limiting case)</span>
              </p>
            </article>
            <article>
              <h2>COMPARISON TABLE</h2>
              <table>
                <thead>
                  <tr>
                    <th>Range of e</th>
                    <th>Conic</th>
                    <th>Key Property</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>e = 0</td>
                    <td>Circle</td>
                    <td>PF = PD</td>
                  </tr>
                  <tr>
                    <td>0 &lt; e &lt; 1</td>
                    <td>Ellipse</td>
                    <td>PF &lt; PD</td>
                  </tr>
                  <tr>
                    <td>e = 1</td>
                    <td>Parabola</td>
                    <td>PF = PD</td>
                  </tr>
                  <tr>
                    <td>e &gt; 1</td>
                    <td>Hyperbola</td>
                    <td>PF &gt; PD</td>
                  </tr>
                </tbody>
              </table>
            </article>
          </aside>
        </section>
      </main>
      <footer>
        <Lightbulb />
        <p>
          <i>Definition:</i> For a fixed point F (focus) and a fixed line d
          (directrix), the set of all points P in the plane such that{" "}
          <strong>PF/PD = e</strong> is a conic section.
        </p>
      </footer>
    </section>
  );
}
