import { ArrowLeft, ArrowRight, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./RelativeMotionTargetLesson196.css";
type P = { x: number; y: number };
const A0 = { x: 6, y: 4 },
  B0 = { x: 2, y: 1 },
  sub = (a: P, b: P) => ({ x: a.x - b.x, y: a.y - b.y }),
  scale = (p: P, k: number) => ({ x: p.x * k, y: p.y * k }),
  mag = (p: P) => Math.hypot(p.x, p.y),
  bearing = (p: P) => ((Math.atan2(p.y, p.x) * 180) / Math.PI + 360) % 360,
  clamp = (n: number) => Math.max(-20, Math.min(20, Math.round(n)));
function NavMap({
  a,
  b,
  time,
  trails,
  relative,
  locked,
  onVelocity,
}: {
  a: P;
  b: P;
  time: number;
  trails: boolean;
  relative: boolean;
  locked: boolean;
  onVelocity: (name: "a" | "b", p: P) => void;
}) {
  const ref = useRef<SVGSVGElement>(null),
    drag = useRef<"a" | "b" | null>(null),
    c = 260,
    unit = 13,
    pa = scale(a, time),
    pb = scale(b, time),
    sx = (x: number) => c + x * unit,
    sy = (y: number) => c - y * unit,
    toP = (e: PointerEvent<SVGSVGElement>) => {
      const r = ref.current!.getBoundingClientRect();
      return {
        x: clamp((((e.clientX - r.left) / r.width) * 520 - c) / unit / time),
        y: clamp((c - ((e.clientY - r.top) / r.height) * 520) / unit / time),
      };
    };
  return (
    <svg
      ref={ref}
      className="rm196-map"
      viewBox="0 0 520 520"
      aria-label="Relative motion navigation map"
      onPointerMove={(e) => drag.current && onVelocity(drag.current, toP(e))}
      onPointerUp={() => {
        drag.current = null;
      }}
      onPointerLeave={() => {
        drag.current = null;
      }}
    >
      <defs>
        {[
          ["a", "#058fd4"],
          ["b", "#f07d00"],
          ["r", "#6d31de"],
        ].map(([id, color]) => (
          <marker
            key={id}
            id={`rm196-${id}`}
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
      {[65, 130, 195, 250].map((r) => (
        <circle key={r} cx={c} cy={c} r={r} className="ring" />
      ))}
      {[0, 45, 90, 135].map((n) => (
        <line
          key={n}
          x1={c - 250 * Math.cos((n * Math.PI) / 180)}
          y1={c - 250 * Math.sin((n * Math.PI) / 180)}
          x2={c + 250 * Math.cos((n * Math.PI) / 180)}
          y2={c + 250 * Math.sin((n * Math.PI) / 180)}
          className="radial"
        />
      ))}
      <text x="255" y="15">
        N
      </text>
      <text x="500" y="264">
        E
      </text>
      <text x="255" y="515">
        S
      </text>
      <text x="7" y="264">
        W
      </text>
      {trails && (
        <>
          {[0.25, 0.5, 0.75, 1].map((k) => (
            <circle
              key={`a${k}`}
              cx={sx(pa.x * k)}
              cy={sy(pa.y * k)}
              r="3"
              className="a-trail"
            />
          ))}
          {[0.25, 0.5, 0.75, 1].map((k) => (
            <circle
              key={`b${k}`}
              cx={sx(pb.x * k)}
              cy={sy(pb.y * k)}
              r="3"
              className="b-trail"
            />
          ))}
        </>
      )}
      <line
        x1={c}
        y1={c}
        x2={sx(pa.x)}
        y2={sy(pa.y)}
        className="a-vector"
        markerEnd="url(#rm196-a)"
      />
      <line
        x1={c}
        y1={c}
        x2={sx(pb.x)}
        y2={sy(pb.y)}
        className="b-vector"
        markerEnd="url(#rm196-b)"
      />
      {relative && (
        <line
          x1={sx(pb.x)}
          y1={sy(pb.y)}
          x2={sx(pa.x)}
          y2={sy(pa.y)}
          className="relative"
          markerEnd="url(#rm196-r)"
        />
      )}
      <circle
        data-testid="motion-a-tip"
        role="slider"
        aria-label="Object A velocity tip"
        tabIndex={0}
        cx={sx(pa.x)}
        cy={sy(pa.y)}
        r="10"
        className="a-tip"
        onPointerDown={(e) => {
          drag.current = "a";
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
      />
      <circle
        data-testid="motion-b-tip"
        role="slider"
        aria-label="Observer B velocity tip"
        tabIndex={0}
        cx={sx(pb.x)}
        cy={sy(pb.y)}
        r="10"
        className="b-tip"
        onPointerDown={(e) => {
          if (!locked) {
            drag.current = "b";
            e.currentTarget.setPointerCapture(e.pointerId);
          }
        }}
      />
      <text x={sx(pa.x) + 15} y={sy(pa.y) - 10} className="a-label">
        A
      </text>
      <text x={sx(pb.x) - 30} y={sy(pb.y) - 10} className="b-label">
        B
      </text>
    </svg>
  );
}
function VectorProof({ a, b, reverse }: { a: P; b: P; reverse: boolean }) {
  const r = reverse ? sub(b, a) : sub(a, b),
    base = { x: 45, y: 145 },
    k = 17;
  return (
    <svg viewBox="0 0 310 210" aria-label="Tail-to-tail relative vector proof">
      <defs>
        <marker
          id="rm196-proof"
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="4"
          orient="auto"
        >
          <path d="M0 0L8 4L0 8Z" fill="#6d31de" />
        </marker>
      </defs>
      <line
        x1={base.x}
        y1={base.y}
        x2={base.x + a.x * k}
        y2={base.y - a.y * k}
        className="proof-a"
      />
      <line
        x1={base.x}
        y1={base.y}
        x2={base.x + b.x * k}
        y2={base.y - b.y * k}
        className="proof-b"
      />
      <line
        x1={base.x + b.x * k}
        y1={base.y - b.y * k}
        x2={base.x + a.x * k}
        y2={base.y - a.y * k}
        className="proof-r"
        markerEnd="url(#rm196-proof)"
      />
      <text x="105" y="38">
        vA
      </text>
      <text x="90" y="138">
        vB
      </text>
      <text x="195" y="93">
        vA/B
      </text>
      <text x="82" y="190" className="formula">
        vA/B = vA − vB
      </text>
      <metadata>{`${r.x},${r.y}`}</metadata>
    </svg>
  );
}
export default function RelativeMotionTargetLesson196({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [a, setA] = useState(A0),
    [b, setB] = useState(B0),
    [time, setTime] = useState(2),
    [trails, setTrails] = useState(true),
    [showRelative, setShowRelative] = useState(true),
    [locked, setLocked] = useState(true),
    [reverse, setReverse] = useState(false),
    [tab, setTab] = useState(0),
    [language, setLanguage] = useState("English (English)"),
    [shared, setShared] = useState(false);
  const rel = reverse ? sub(b, a) : sub(a, b),
    speed = mag(rel),
    angle = bearing(rel),
    status = a.x * b.x + a.y * b.y >= 0 ? "Separating" : "Closing",
    interact = () => onInteraction();
  useEffect(() => {
    setA(A0);
    setB(B0);
    setTime(2);
    setTrails(true);
    setShowRelative(true);
    setLocked(true);
    setReverse(false);
    setTab(0);
    setLanguage("English (English)");
    setShared(false);
  }, [resetToken]);
  const reset = () => {
    setA(A0);
    setB(B0);
    setTime(2);
    setTrails(true);
    setShowRelative(true);
    setLocked(true);
    setReverse(false);
    interact();
  };
  return (
    <main
      className="rm196-page"
      data-testid="vector-mockup-0253"
      data-dedicated-lesson="196"
      data-object-model="relative-motion-moving-observer-velocity-subtraction-bearing-navigation"
      data-a={`${a.x}:${a.y}`}
      data-b={`${b.x}:${b.y}`}
      data-relative={`${rel.x}:${rel.y}`}
      data-time={time}
      data-trails={trails}
      data-show-relative={showRelative}
      data-locked={locked}
      data-reverse={reverse}
      data-tab={tab}
      data-language={language}
      data-shared={shared}
      data-speed={speed.toFixed(2)}
      data-bearing={angle.toFixed(1)}
    >
      <header className="rm196-header">
        <section>
          <span>GEOMETRY</span>
          <span>VECTORS</span>
          <h1>Relative Motion</h1>
          <p>Apply vectors to navigation</p>
          <aside>
            <b>♙ Intermediate-Advanced</b>
            <b>ϟ Applied Lab</b>
            <b>▣ Vector Tools</b>
            <b>◷ 6-10 min</b>
          </aside>
        </section>
        <nav>
          <select
            aria-label="Lesson language"
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
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
              setShared(true);
              navigator.clipboard
                ?.writeText(location.href)
                .catch(() => undefined);
              interact();
            }}
          >
            <Share2 />
            {shared ? "Shared" : "Share"}
          </button>
          <a href="/workspace/geometry">Workspace</a>
        </nav>
      </header>
      <nav className="rm196-tabs">
        {[
          ["Interact", "Navigation workbench"],
          ["Learn", "Concepts & notes"],
          ["Examples", "Worked examples"],
          ["Formula", "Key equations"],
          ["Practice", "Check understanding"],
        ].map(([name, sub], i) => (
          <button
            key={name}
            className={tab === i ? "active" : ""}
            onClick={() => {
              setTab(i);
              interact();
            }}
          >
            <b>{name}</b>
            <small>{sub}</small>
          </button>
        ))}
      </nav>
      <section className="rm196-main">
        <article className="rm196-work">
          <h2>Navigation workbench</h2>
          <aside>
            <label>
              Time<output>{time.toFixed(1)} h</output>
              <input
                aria-label="Motion time"
                type="range"
                min="0"
                max="5"
                step=".5"
                value={time}
                onChange={(e) => {
                  setTime(+e.target.value);
                  interact();
                }}
              />
            </label>
            {[
              ["Show ground trails", trails, setTrails],
              ["Show relative vector", showRelative, setShowRelative],
              ["Lock observer B", locked, setLocked],
            ].map(([name, value, setter]) => (
              <label key={String(name)}>
                {name}
                <input
                  aria-label={String(name)}
                  type="checkbox"
                  checked={value as boolean}
                  onChange={() => {
                    (setter as (f: (x: boolean) => boolean) => void)((x) => !x);
                    interact();
                  }}
                />
              </label>
            ))}
            <h3>Observer (reference)</h3>
            <button
              className={!reverse ? "active" : ""}
              onClick={() => {
                setReverse(false);
                interact();
              }}
            >
              A from B
            </button>
            <button
              className={reverse ? "active" : ""}
              onClick={() => {
                setReverse(true);
                interact();
              }}
            >
              B from A
            </button>
          </aside>
          <NavMap
            a={a}
            b={b}
            time={Math.max(0.2, time)}
            trails={trails}
            relative={showRelative}
            locked={locked}
            onVelocity={(name, p) => {
              if (name === "a") setA(p);
              else setB(p);
              interact();
            }}
          />
          <footer>
            1 grid = 10 km <span>A (Object) &nbsp; B (Observer)</span>
          </footer>
        </article>
        <aside className="rm196-side">
          <article>
            <h2>Vector subtraction (tail-to-tail)</h2>
            <VectorProof a={a} b={b} reverse={reverse} />
          </article>
          <article>
            <h2>What observer B sees</h2>
            <p>From B's perspective, A appears to move along vA/B.</p>
            <VectorProof
              a={scale(a, 0.45)}
              b={scale(b, 0.45)}
              reverse={reverse}
            />
          </article>
        </aside>
      </section>
      <section className="rm196-lower">
        <article>
          <h2>Set velocities (km/h)</h2>
          <div>
            {[
              ["Object A", a, setA],
              ["Observer B", b, setB],
            ].map(([name, value, setter]) => (
              <section key={String(name)}>
                <h3>{name}</h3>
                {(["x", "y"] as const).map((axis) => (
                  <label key={axis}>
                    {axis === "x" ? "East (x)" : "North (y)"}
                    <input
                      aria-label={`${name} ${axis} velocity`}
                      type="number"
                      value={(value as P)[axis]}
                      onChange={(e) => {
                        (setter as (p: P) => void)({
                          ...(value as P),
                          [axis]: clamp(+e.target.value),
                        });
                        interact();
                      }}
                    />
                  </label>
                ))}
                <input
                  aria-label={`${name} speed control`}
                  type="range"
                  min="-20"
                  max="20"
                  value={(value as P).x}
                  onChange={(e) => {
                    (setter as (p: P) => void)({
                      ...(value as P),
                      x: +e.target.value,
                    });
                    interact();
                  }}
                />
              </section>
            ))}
          </div>
        </article>
        <article>
          <h2>Relative velocity ({reverse ? "B from A" : "A from B"})</h2>
          <p>
            vA = ({a.x}, {a.y}) km/h
          </p>
          <p>
            vB = ({b.x}, {b.y}) km/h
          </p>
          <hr />
          <output>
            vA/B = ({rel.x}, {rel.y}) km/h
          </output>
          <p>Speed = {speed.toFixed(1)} km/h</p>
          <p>Bearing = {angle.toFixed(1)} degrees</p>
          <strong>{status}</strong>
        </article>
        <article>
          <h2>Key insight</h2>
          <strong>Order matters: A from B means vA − vB.</strong>
          <p>Reversing the order gives the opposite vector.</p>
          <button
            onClick={() => {
              setReverse((x) => !x);
              interact();
            }}
          >
            Try: find B from A
          </button>
        </article>
      </section>
      <p className="rm196-note">
        Relative velocity tells how one object appears to move from another
        moving observer. Compute it by subtracting vectors.
      </p>
      <nav className="rm196-nav">
        <a href="/lessons/geometry/195-vector-equation-of-a-plane">
          <ArrowLeft />
          <span>
            PREVIOUS<b>Vector Equation of a Plane</b>
          </span>
        </a>
        <a href="/lessons/geometry/197-force-vectors">
          <span>
            NEXT<b>Force Vectors</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="rm196-footer">
        <b>Math Universe</b>
        <span>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </span>
        <small>© 2026 INDIAN SERVERS PRIVATE LIMITED.</small>
        <nav>
          <a href="/sitemap">Sitemap</a>
          <a href="/docs">Docs</a>
          <a href="/about">About</a>
        </nav>
      </footer>
    </main>
  );
}
