import {
  CheckCircle2,
  CirclePause,
  CirclePlay,
  Info,
  Minus,
  Plus,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./ParabolaTangentTargetLesson10147.css";

export default function ParabolaTangentTargetLesson10147({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [t, setT] = useState(1.2),
    [delta, setDelta] = useState(0.4),
    [playing, setPlaying] = useState(false);
  const [showSecond, setShowSecond] = useState(true),
    [showFocus, setShowFocus] = useState(true),
    [zoom, setZoom] = useState(1),
    [actions, setActions] = useState(0);
  const dragging = useRef(false),
    a = 1,
    qT = t + delta;
  const p = { x: a * t * t, y: 2 * a * t },
    q = { x: a * qT * qT, y: 2 * a * qT };
  const tangentSlope = Math.abs(t) < 0.001 ? Infinity : 1 / t;
  const secantSlope =
    Math.abs(delta) < 0.001 ? tangentSlope : (q.y - p.y) / (q.x - p.x);
  const graph = useMemo(() => {
    const W = 720,
      H = 430,
      scale = 52 * zoom,
      sx = (x: number) => W * 0.39 + x * scale,
      sy = (y: number) => H * 0.55 - y * scale;
    const path = Array.from({ length: 181 }, (_, i) => -3 + i / 30)
      .map(
        (u, i) =>
          `${i ? "L" : "M"}${sx(a * u * u).toFixed(1)},${sy(2 * a * u).toFixed(1)}`,
      )
      .join(" ");
    return { W, H, scale, sx, sy, path };
  }, [zoom]);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(
      () => setT((v) => (v >= 2.4 ? -0.8 : v + 0.03)),
      60,
    );
    return () => window.clearInterval(timer);
  }, [playing]);
  const updateT = (value: number) => {
    setT(Math.max(-0.8, Math.min(2.4, value)));
    setActions((v) => v + 1);
  };
  const movePoint = (event: ReactPointerEvent<SVGSVGElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const y =
      (graph.H * 0.55 - ((event.clientY - box.top) * graph.H) / box.height) /
      graph.scale;
    updateT(y / (2 * a));
  };
  const reset = () => {
    setT(1.2);
    setDelta(0.4);
    setPlaying(false);
    setShowSecond(true);
    setShowFocus(true);
    setZoom(1);
    setActions((v) => v + 1);
  };
  const finite = Number.isFinite(tangentSlope);
  return (
    <section
      className="pt10147-page"
      data-testid="school-mockup-0821"
      data-object-model="dedicated-parabola-tangent-secant-limit-engine"
      data-t={t.toFixed(3)}
      data-point={`${p.x.toFixed(3)},${p.y.toFixed(3)}`}
      data-q={`${q.x.toFixed(3)},${q.y.toFixed(3)}`}
      data-tangent-slope={finite ? tangentSlope.toFixed(4) : "Infinity"}
      data-secant-slope={
        Number.isFinite(secantSlope) ? secantSlope.toFixed(4) : "Infinity"
      }
      data-delta={delta.toFixed(2)}
      data-playing={String(playing)}
      data-actions={actions}
    >
      <header>
        <small>CLASS 11 &bull; CONIC SECTIONS</small>
        <h1>Tangent to a Parabola</h1>
        <p>
          Tangent to a Parabola is a school mathematics idea in Conic Sections.
          It helps students model data, functions, curves, proofs,
          <br />
          and 3D directions. We use related ideas in graphs, design, surveys,
          navigation, and measurement.
        </p>
        <div>
          <span>30 min</span>
          <span>RIGOROUS</span>
          <span>PROOF</span>
          <span>geometry2d</span>
        </div>
      </header>
      <main>
        <div className="pt-toolbar">
          <b>EXACT PROOF MINI TOOL</b>
          <span>•</span>
          <strong>TANGENT TO A PARABOLA</strong>
          <button
            onClick={() => setPlaying((v) => !v)}
            aria-label="Play tangent animation"
          >
            {playing ? <CirclePause /> : <CirclePlay />}
          </button>
          <button
            aria-label="Restart animation"
            onClick={() => {
              setT(-0.8);
              setPlaying(true);
            }}
          >
            <RotateCcw />
          </button>
          <label>
            Parameter t{" "}
            <input
              aria-label="Tangent parameter t"
              type="range"
              min="-.8"
              max="2.4"
              step=".01"
              value={t}
              onInput={(e) => updateT(Number(e.currentTarget.value))}
              onChange={(e) => setT(Number(e.target.value))}
            />
          </label>
          <output>t = {t.toFixed(4)}</output>
          <button
            aria-label="Decrease second point gap"
            onClick={() => setDelta((v) => Math.max(0.02, v - 0.1))}
          >
            <Minus />
          </button>
          <button onClick={() => setDelta(0.1)}>+0.1</button>
          <button
            aria-label="Increase second point gap"
            onClick={() => setDelta((v) => Math.min(1.2, v + 0.1))}
          >
            <Plus />
          </button>
          <label>
            <input
              type="checkbox"
              checked={showSecond}
              onChange={() => setShowSecond((v) => !v)}
            />{" "}
            Show second point Q
          </label>
          <label>
            <input
              type="checkbox"
              checked={showFocus}
              onChange={() => setShowFocus((v) => !v)}
            />{" "}
            Show focus &amp; directrix
          </label>
          <button className="reset" onClick={reset}>
            <RotateCcw /> Reset
          </button>
        </div>
        <section className="pt-grid">
          <section className="pt-board">
            <svg
              viewBox={`0 0 ${graph.W} ${graph.H}`}
              aria-label="Interactive parabola tangent graph"
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
              {Array.from({ length: 19 }, (_, i) => i - 6).map((n) => (
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
              {showFocus && (
                <>
                  <line
                    className="directrix"
                    x1={graph.sx(-a)}
                    x2={graph.sx(-a)}
                    y1="0"
                    y2={graph.H}
                  />
                  <circle
                    className="focus"
                    cx={graph.sx(a)}
                    cy={graph.sy(0)}
                    r="5"
                  />
                  <text
                    className="focus-label"
                    x={graph.sx(a) + 9}
                    y={graph.sy(0) - 10}
                  >
                    F(1, 0)
                  </text>
                </>
              )}
              <path className="parabola" d={graph.path} />
              {finite && (
                <line
                  className="tangent"
                  x1={graph.sx(-4)}
                  y1={graph.sy((-4 + a * t * t) / t)}
                  x2={graph.sx(6)}
                  y2={graph.sy((6 + a * t * t) / t)}
                />
              )}{" "}
              {showSecond && (
                <>
                  <line
                    className="secant"
                    x1={graph.sx(p.x)}
                    y1={graph.sy(p.y)}
                    x2={graph.sx(q.x)}
                    y2={graph.sy(q.y)}
                  />
                  <circle
                    className="q"
                    cx={graph.sx(q.x)}
                    cy={graph.sy(q.y)}
                    r="7"
                  />
                  <text
                    className="q-label"
                    x={graph.sx(q.x) + 9}
                    y={graph.sy(q.y) + 22}
                  >
                    Q({q.x.toFixed(2)}, {q.y.toFixed(2)})
                  </text>
                </>
              )}
              <circle
                className="p"
                cx={graph.sx(p.x)}
                cy={graph.sy(p.y)}
                r="7"
              />
              <text
                className="p-label"
                x={graph.sx(p.x) + 9}
                y={graph.sy(p.y) - 10}
              >
                P({p.x.toFixed(2)}, {p.y.toFixed(2)})
              </text>
            </svg>
            <div className="formula">
              <b>Tangent (ty = x + at²)</b>
              <p>
                {t.toFixed(4)}y = x + {(a * t * t).toFixed(4)}
              </p>
              <p>Slope = {finite ? tangentSlope.toFixed(4) : "vertical"}</p>
            </div>
            <div className="legend">
              <span>Parabola y²=4ax</span>
              <span>Tangent at P</span>
              <span>Secant PQ</span>
              <span>Directrix x=-1</span>
            </div>
            <div className="zoom">
              <button onClick={() => setZoom((v) => Math.min(1.5, v + 0.15))}>
                <ZoomIn />
              </button>
              <button onClick={() => setZoom((v) => Math.max(0.7, v - 0.15))}>
                <ZoomOut />
              </button>
            </div>
            <footer>
              <article>
                <b>Point of contact</b>
                <p>P(at²,2at)</p>
                <span>
                  ({p.x.toFixed(4)}, {p.y.toFixed(4)})
                </span>
              </article>
              <article>
                <b>Tangent line</b>
                <p>ty = x + at²</p>
                <span>
                  {t.toFixed(4)}y = x + {(t * t).toFixed(4)}
                </span>
              </article>
              <article>
                <b>Slope at P</b>
                <p>dy/dx = 1/t = {finite ? tangentSlope.toFixed(4) : "∞"}</p>
              </article>
            </footer>
          </section>
          <aside className="pt-proof">
            <article>
              <h2>TANGENT DERIVATION (POINT-SLOPE VERIFICATION)</h2>
              <p>Let P(at², 2at) on y²=4ax.</p>
              <p>Tangent equation: ty = x + at².</p>
              <p>
                At P: t(2at) = 2at² and at² + at² = 2at² <CheckCircle2 />
              </p>
              <p>
                Slope of tangent: dy/dx = 1/t ={" "}
                {finite ? tangentSlope.toFixed(4) : "∞"}
              </p>
            </article>
            <article>
              <h2>SECANT → TANGENT LIMIT</h2>
              <p>Let Q be another point on y²=4ax.</p>
              <p>Current finite secant slope mPQ = {secantSlope.toFixed(4)}</p>
              <div>
                <span>Current δ = {delta.toFixed(2)}</span>
                <span>
                  As Q → P: mPQ → 1/t = {finite ? tangentSlope.toFixed(4) : "∞"}
                </span>
              </div>
            </article>
            <article>
              <h2>SPECIAL CASE t = 0</h2>
              <p>P(0,0), ty=x+at² ⇒ x=0.</p>
              <p>Tangent at the vertex is the y-axis.</p>
              <Info />
            </article>
          </aside>
        </section>
        <section className="pt-context">
          <article>
            <h2>PARABOLA CONTEXT</h2>
            <p>• Equation: y²=4ax</p>
            <p>• Focus: F(a,0)</p>
            <p>• Directrix: x=-a</p>
          </article>
          <article>
            <h2>REMEMBER</h2>
            <p>• Tangent at P(at²,2at) is ty=x+at².</p>
            <p>• As a secant point approaches P, its slope approaches 1/t.</p>
          </article>
          <article>
            <h2>INTUITION</h2>
            <p>The line pivots about P as t changes.</p>
            <p>Large |t| makes the line flatter.</p>
          </article>
        </section>
      </main>
    </section>
  );
}
