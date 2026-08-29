import { ArrowLeft, ArrowRight, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./ForceVectorsTargetLesson197.css";
type Force = { m: number; a: number };
type P = { x: number; y: number };
const F10 = { m: 40, a: 0 },
  F20 = { m: 30, a: 90 },
  F30 = { m: 50, a: 216.9 },
  vector = (f: Force): P => ({
    x: f.m * Math.cos((f.a * Math.PI) / 180),
    y: f.m * Math.sin((f.a * Math.PI) / 180),
  }),
  add = (a: P, b: P) => ({ x: a.x + b.x, y: a.y + b.y }),
  mag = (p: P) => Math.hypot(p.x, p.y),
  angle = (p: P) => ((Math.atan2(p.y, p.x) * 180) / Math.PI + 360) % 360,
  clamp = (n: number, min = 0, max = 100) =>
    Math.max(min, Math.min(max, Math.round(n * 10) / 10)),
  fmt = (n: number) => (Math.abs(n) < 0.05 ? "0.0" : n.toFixed(1));
function ForceBoard({
  f1,
  f2,
  f3,
  components,
  resultant,
  equilibrant,
  onF3,
}: {
  f1: Force;
  f2: Force;
  f3: Force;
  components: boolean;
  resultant: boolean;
  equilibrant: boolean;
  onF3: (f: Force) => void;
}) {
  const ref = useRef<SVGSVGElement>(null),
    drag = useRef(false),
    c = 250,
    k = 4.5,
    r = add(vector(f1), vector(f2)),
    e = { x: -r.x, y: -r.y },
    end = (p: P) => ({ x: c + p.x * k, y: c - p.y * k }),
    toForce = (ev: PointerEvent<SVGSVGElement>) => {
      const b = ref.current!.getBoundingClientRect(),
        x = ((ev.clientX - b.left) / b.width) * 500 - c,
        y = c - ((ev.clientY - b.top) / b.height) * 500;
      return {
        m: clamp(Math.hypot(x, y) / k),
        a: clamp(((Math.atan2(y, x) * 180) / Math.PI + 360) % 360, 0, 360),
      };
    };
  const arrows: [[string, P, string]] | Array<[string, P, string]> = [
    ["F1", vector(f1), "f1"],
    ["F2", vector(f2), "f2"],
    ...(resultant ? [["R", r, "r"] as [string, P, string]] : []),
    ...(equilibrant ? [["E", e, "e"] as [string, P, string]] : []),
  ];
  return (
    <svg
      ref={ref}
      className="fv197-board"
      viewBox="0 0 500 500"
      aria-label="Force vector balance protractor"
      onPointerMove={(ev) => drag.current && onF3(toForce(ev))}
      onPointerUp={() => {
        drag.current = false;
      }}
      onPointerLeave={() => {
        drag.current = false;
      }}
    >
      <defs>
        {["f1", "f2", "f3", "r", "e"].map((id) => (
          <marker
            key={id}
            id={`fv197-${id}`}
            markerWidth="9"
            markerHeight="9"
            refX="8"
            refY="4.5"
            orient="auto"
          >
            <path d="M0 0L9 4.5L0 9Z" />
          </marker>
        ))}
      </defs>
      <circle cx={c} cy={c} r="218" className="dial" />
      {Array.from({ length: 72 }, (_, i) => i * 5).map((a) => (
        <line
          key={a}
          x1={c + 205 * Math.cos((a * Math.PI) / 180)}
          y1={c - 205 * Math.sin((a * Math.PI) / 180)}
          x2={c + 218 * Math.cos((a * Math.PI) / 180)}
          y2={c - 218 * Math.sin((a * Math.PI) / 180)}
          className="tick"
        />
      ))}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <text
          key={a}
          x={c + 235 * Math.cos((a * Math.PI) / 180) - 12}
          y={c - 235 * Math.sin((a * Math.PI) / 180) + 5}
        >
          {a}°
        </text>
      ))}
      {arrows.map(([name, p, cls]) => {
        const q = end(p);
        return (
          <g key={name}>
            {components && (
              <>
                <line
                  x1={c}
                  y1={q.y}
                  x2={q.x}
                  y2={q.y}
                  className={`component ${cls}`}
                />
                <line
                  x1={q.x}
                  y1={c}
                  x2={q.x}
                  y2={q.y}
                  className={`component ${cls}`}
                />
              </>
            )}
            <line
              x1={c}
              y1={c}
              x2={q.x}
              y2={q.y}
              className={`force ${cls}`}
              markerEnd={`url(#fv197-${cls})`}
            />
            <text x={q.x + 8} y={q.y - 8} className={cls}>
              {name}
              <tspan x={q.x + 8} dy="14">
                {fmt(mag(p))} N
              </tspan>
            </text>
          </g>
        );
      })}
      {(() => {
        const p = vector(f3),
          q = end(p);
        return (
          <>
            <line
              x1={c}
              y1={c}
              x2={q.x}
              y2={q.y}
              className="force f3"
              markerEnd="url(#fv197-f3)"
            />
            <circle
              data-testid="force-f3-tip"
              role="slider"
              aria-label="Force F3 tip"
              tabIndex={0}
              cx={q.x}
              cy={q.y}
              r="10"
              onPointerDown={(ev) => {
                drag.current = true;
                ev.currentTarget.setPointerCapture(ev.pointerId);
              }}
            />
          </>
        );
      })()}
      <circle cx={c} cy={c} r="15" className="ring-center" />
    </svg>
  );
}
function ForceControl({
  name,
  f,
  color,
  onF,
}: {
  name: string;
  f: Force;
  color: string;
  onF: (f: Force) => void;
}) {
  return (
    <section style={{ "--tone": color } as React.CSSProperties}>
      <h3>● {name}</h3>
      <label>
        Angle
        <input
          aria-label={`${name} angle`}
          type="number"
          min="0"
          max="360"
          step=".1"
          value={f.a}
          onChange={(e) => onF({ ...f, a: clamp(+e.target.value, 0, 360) })}
        />
      </label>
      <input
        aria-label={`${name} magnitude`}
        type="range"
        min="0"
        max="100"
        value={f.m}
        onChange={(e) => onF({ ...f, m: +e.target.value })}
      />
      <input
        aria-label={`${name} exact magnitude`}
        type="number"
        min="0"
        max="100"
        value={f.m}
        onChange={(e) => onF({ ...f, m: clamp(+e.target.value) })}
      />
    </section>
  );
}
export default function ForceVectorsTargetLesson197({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [f1, setF1] = useState(F10),
    [f2, setF2] = useState(F20),
    [f3, setF3] = useState(F30),
    [components, setComponents] = useState(true),
    [resultant, setResultant] = useState(true),
    [equilibrant, setEquilibrant] = useState(true),
    [checked, setChecked] = useState(false),
    [tab, setTab] = useState(0),
    [shared, setShared] = useState(false);
  const p1 = vector(f1),
    p2 = vector(f2),
    r = add(p1, p2),
    e = { x: -r.x, y: -r.y },
    p3 = vector(f3),
    net = add(r, p3),
    balanced = mag(net) < 0.6,
    isBalanced = checked && balanced,
    interact = () => onInteraction();
  useEffect(() => {
    setF1(F10);
    setF2(F20);
    setF3(F30);
    setComponents(true);
    setResultant(true);
    setEquilibrant(true);
    setChecked(false);
    setTab(0);
    setShared(false);
  }, [resetToken]);
  const reset = () => {
    setF1(F10);
    setF2(F20);
    setF3(F30);
    setComponents(true);
    setResultant(true);
    setEquilibrant(true);
    setChecked(false);
    interact();
  };
  return (
    <main
      className="fv197-page"
      data-testid="vector-mockup-0254"
      data-dedicated-lesson="197"
      data-object-model="force-resultant-equilibrant-components-balance-protractor"
      data-f1={`${f1.m}:${f1.a}`}
      data-f2={`${f2.m}:${f2.a}`}
      data-f3={`${f3.m}:${f3.a}`}
      data-result={`${r.x.toFixed(1)}:${r.y.toFixed(1)}`}
      data-net={`${net.x.toFixed(1)}:${net.y.toFixed(1)}`}
      data-balanced={isBalanced}
      data-checked={checked}
      data-components={components}
      data-show-resultant={resultant}
      data-equilibrant={equilibrant}
      data-tab={tab}
      data-shared={shared}
    >
      <header className="fv197-header">
        <section>
          <span>GEOMETRY</span>
          <span>VECTORS</span>
          <h1>Force Vectors</h1>
          <p>Combine physical quantities</p>
          <aside>
            <b>♙ Intermediate-Advanced</b>
            <b>ϟ Applied Lab</b>
            <b>▣ Vector Tools</b>
            <b>◷ 6-10 min</b>
          </aside>
        </section>
        <article>
          <h3>Free-body diagram</h3>
          <svg viewBox="0 0 160 130">
            <line x1="75" y1="70" x2="130" y2="70" />
            <line x1="75" y1="70" x2="75" y2="15" />
            <line x1="75" y1="70" x2="38" y2="118" />
          </svg>
        </article>
        <article>
          <p>F1 = {fmt(f1.m)} N east</p>
          <p>F2 = {fmt(f2.m)} N north</p>
          <hr />
          <p>
            R = ({fmt(r.x)}, {fmt(r.y)}) N
          </p>
          <p>
            |R| = {fmt(mag(r))} N · θ = {fmt(angle(r))}°
          </p>
          <p>
            Equilibrant E = ({fmt(e.x)}, {fmt(e.y)}) N
          </p>
          <strong>Forces balance only when the net vector is zero.</strong>
        </article>
      </header>
      <section className="fv197-mode">
        <nav>
          {[
            ["Interact", "Force Board"],
            ["Learn", "Concepts"],
            ["Examples", "Worked out"],
            ["Formula", "Key relationships"],
            ["Practice", "Your turn"],
          ].map(([n, s], i) => (
            <button
              key={n}
              className={tab === i ? "active" : ""}
              onClick={() => {
                setTab(i);
                interact();
              }}
            >
              <b>{n}</b>
              <small>{s}</small>
            </button>
          ))}
        </nav>
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
      </section>
      <section className="fv197-main">
        <article className="fv197-work">
          <h2>Force board: combine and balance forces</h2>
          <header>
            {[
              ["Show components", components, setComponents],
              ["Show resultant", resultant, setResultant],
              ["Show equilibrant", equilibrant, setEquilibrant],
            ].map(([n, v, s]) => (
              <label key={String(n)}>
                {n}
                <input
                  aria-label={String(n)}
                  type="checkbox"
                  checked={v as boolean}
                  onChange={() => {
                    (s as (f: (x: boolean) => boolean) => void)((x) => !x);
                    interact();
                  }}
                />
              </label>
            ))}
            <button onClick={reset}>
              <RotateCcw />
              Reset
            </button>
          </header>
          <ForceBoard
            f1={f1}
            f2={f2}
            f3={f3}
            components={components}
            resultant={resultant}
            equilibrant={equilibrant}
            onF3={(f) => {
              setF3(f);
              setChecked(false);
              interact();
            }}
          />
          <p>
            Drag the ring or sliders to adjust forces. Grid = 10 N per square.
          </p>
          <footer>
            <h3>Balance gauge</h3>
            <div className={isBalanced ? "balanced" : ""} />
            <section>
              <output>
                Net force: {fmt(mag(checked ? net : r))} N,{" "}
                {isBalanced ? "balanced" : "not balanced"}
              </output>
              <p>Direction: {fmt(angle(checked ? net : r))}° above east</p>
              <p>
                Equilibrant needed: {fmt(mag(r))} N at {fmt(angle(e))}°
              </p>
            </section>
          </footer>
        </article>
        <aside className="fv197-rail">
          <article>
            <h2>Adjust forces</h2>
            <ForceControl
              name="F1 (east)"
              f={f1}
              color="#079b9b"
              onF={(f) => {
                setF1(f);
                setChecked(false);
                interact();
              }}
            />
            <ForceControl
              name="F2 (north)"
              f={f2}
              color="#1871d8"
              onF={(f) => {
                setF2(f);
                setChecked(false);
                interact();
              }}
            />
            <ForceControl
              name="F3 (your turn)"
              f={f3}
              color="#7b38df"
              onF={(f) => {
                setF3(f);
                setChecked(false);
                interact();
              }}
            />
            <footer>
              Try: add F3 = ({fmt(e.x)}, {fmt(e.y)}) N{" "}
              <button
                onClick={() => {
                  setChecked(true);
                  interact();
                }}
              >
                Check balance
              </button>
            </footer>
          </article>
          <article>
            <h2>Results</h2>
            <table>
              <thead>
                <tr>
                  <th>Vector</th>
                  <th>Fx</th>
                  <th>Fy</th>
                  <th>Magnitude</th>
                  <th>Angle</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["F1", p1, f1],
                  ["F2", p2, f2],
                  ["R", r, { m: mag(r), a: angle(r) }],
                  ["E", e, { m: mag(e), a: angle(e) }],
                ].map(([n, p, f]) => (
                  <tr key={String(n)}>
                    <td>{n}</td>
                    <td>{fmt((p as P).x)}</td>
                    <td>{fmt((p as P).y)}</td>
                    <td>{fmt((f as Force).m)}</td>
                    <td>{fmt((f as Force).a)}°</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
          <article>
            <h2>Component breakdown</h2>
            <p>
              F1 components ({fmt(p1.x)}, {fmt(p1.y)}) N
            </p>
            <p>
              F2 components ({fmt(p2.x)}, {fmt(p2.y)}) N
            </p>
            <p>
              R components ({fmt(r.x)}, {fmt(r.y)}) N
            </p>
            <p>
              E components ({fmt(e.x)}, {fmt(e.y)}) N
            </p>
          </article>
        </aside>
      </section>
      <nav className="fv197-nav">
        <a href="/lessons/geometry/196-relative-motion">
          <ArrowLeft />
          <span>
            Previous<b>Relative Motion</b>
          </span>
        </a>
        <a href="/lessons/geometry/617-vector-addition-polygon-method">
          <span>
            Next<b>Vector Addition (Polygon Method)</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="fv197-footer">
        <b>Math Universe</b>
        <span>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </span>
        <nav>
          <a href="/sitemap">Sitemap</a>
          <a href="/docs">Docs</a>
          <a href="/about">About</a>
        </nav>
        <small>© 2026 INDIAN SERVERS PRIVATE LIMITED.</small>
      </footer>
    </main>
  );
}
