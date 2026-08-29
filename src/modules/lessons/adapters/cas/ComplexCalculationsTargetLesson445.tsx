import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  Eraser,
  Lightbulb,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./ComplexCalculationsTargetLesson445.css";

type Complex = { re: number; im: number };
type Operation = "multiply" | "add" | "subtract" | "divide";
const initialZ = { re: 2, im: 3 },
  initialW = { re: -1, im: 4 };

export default function ComplexCalculationsTargetLesson445({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [z, setZ] = useState(initialZ),
    [w, setW] = useState(initialW),
    [operation, setOperation] = useState<Operation>("multiply"),
    [grid, setGrid] = useState(false),
    [answer, setAnswer] = useState<[string, string]>(["", ""]),
    [feedback, setFeedback] = useState<"" | "correct" | "incorrect">(""),
    [hint, setHint] = useState(false),
    [actions, setActions] = useState(0);
  const result = useMemo(() => calculate(z, w, operation), [z, w, operation]);
  const act = (run: () => void) => {
    run();
    setActions((v) => v + 1);
    onInteraction();
  };
  useEffect(() => {
    setZ(initialZ);
    setW(initialW);
    setOperation("multiply");
    setGrid(false);
    setAnswer(["", ""]);
    setFeedback("");
    setHint(false);
    setActions(0);
  }, [resetToken]);
  const input = (which: "z" | "w", part: "re" | "im", value: string) =>
    act(() => {
      const number = finite(value);
      if (which === "z") setZ({ ...z, [part]: number });
      else setW({ ...w, [part]: number });
    });
  return (
    <section
      className="cc445-page"
      data-testid="symbolic-cas-mockup-0351"
      data-dedicated-lesson="445"
      data-object-model="complex-rectangular-polar-operation-argand-vectors-modulus-argument-practice"
      data-z={`${z.re},${z.im}`}
      data-w={`${w.re},${w.im}`}
      data-result={`${result.re},${result.im}`}
      data-operation={operation}
      data-feedback={feedback}
      data-actions={actions}
    >
      <h2 className="sr-only">Complex Calculations</h2>
      <section className="cc445-workspace">
        <header>
          <b>Complex Calculations — exact arithmetic and Argand plane</b>
          <span>Awaiting interaction</span>
          <button
            data-lesson-control="complex-clear"
            onClick={() =>
              act(() => {
                setZ({ re: 0, im: 0 });
                setW({ re: 0, im: 0 });
                setAnswer(["", ""]);
                setFeedback("");
              })
            }
          >
            <Eraser /> Clear all
          </button>
        </header>
        <div className="cc445-lab">
          <aside className="cc445-inputs">
            <h3>Input (z = a + bi)</h3>
            <label>
              Real part (a)
              <input
                aria-label="Real part a"
                data-lesson-control="complex-z-real"
                type="number"
                value={z.re}
                onChange={(e) => input("z", "re", e.target.value)}
              />
            </label>
            <label>
              Imag part (b)
              <input
                aria-label="Imaginary part b"
                data-lesson-control="complex-z-imag"
                type="number"
                value={z.im}
                onChange={(e) => input("z", "im", e.target.value)}
              />
            </label>
            <hr />
            <label>
              Operation
              <select
                aria-label="Complex operation"
                data-lesson-control="complex-operation"
                value={operation}
                onChange={(e) =>
                  act(() => setOperation(e.target.value as Operation))
                }
              >
                <option value="multiply">Multiply</option>
                <option value="add">Add</option>
                <option value="subtract">Subtract</option>
                <option value="divide">Divide</option>
              </select>
            </label>
            <h3>with (w = c + di)</h3>
            <label>
              Real part (c)
              <input
                aria-label="Real part c"
                data-lesson-control="complex-w-real"
                type="number"
                value={w.re}
                onChange={(e) => input("w", "re", e.target.value)}
              />
            </label>
            <label>
              Imag part (d)
              <input
                aria-label="Imaginary part d"
                data-lesson-control="complex-w-imag"
                type="number"
                value={w.im}
                onChange={(e) => input("w", "im", e.target.value)}
              />
            </label>
          </aside>
          <main>
            <header>
              <h3>Argand Plane</h3>
              <label>
                <input
                  aria-label="Show grid"
                  data-lesson-control="complex-grid"
                  type="checkbox"
                  checked={grid}
                  onChange={(e) => act(() => setGrid(e.target.checked))}
                />{" "}
                Show grid
              </label>
            </header>
            <ArgandGraph
              z={z}
              w={w}
              result={result}
              operation={operation}
              grid={grid}
            />
            <div className="cc445-legend">
              <span>z = {format(z)}</span>
              <span>w = {format(w)}</span>
              <span>
                {symbol(operation)} = {format(result)}
              </span>
            </div>
          </main>
          <aside className="cc445-results">
            <h3>Results</h3>
            <ComplexResult name="z" value={z} />
            <ComplexResult name="w" value={w} />
            <ComplexResult name={symbol(operation)} value={result} />
          </aside>
        </div>
        <footer>
          <Check /> Correct! All values and the Argand plane update instantly.
        </footer>
      </section>
      <section className="cc445-flow">
        <b>Learn the pattern</b>
        <div>
          {[
            ["1", "Observe", "See how complex numbers appear as vectors."],
            ["2", "Manipulate", "Change inputs and operations."],
            ["3", "Notice", "Modulus gives length; argument gives direction."],
            ["4", "Understand", "Use polar form and key rules."],
          ].map(([n, t, p]) => (
            <article key={n}>
              <strong>{n}</strong>
              <b>{t}</b>
              <p>{p}</p>
            </article>
          ))}
        </div>
      </section>
      <div className="cc445-learning">
        <article>
          <h3>Core Idea & Rules</h3>
          <p>Every complex number can be written in polar form.</p>
          <output>z = a + bi = r(cos θ + i sin θ) = reⁱᶿ</output>
          <Rule name="Product" formula="z₁z₂ = |z₁||z₂| cis(θ₁ + θ₂)" />
          <Rule name="Quotient" formula="z₁/z₂ = |z₁|/|z₂| cis(θ₁ − θ₂)" />
          <Rule name="Power" formula="zⁿ = |z|ⁿ cis(nθ)" />
          <Rule name="Conjugate" formula="z̄ = |z| cis(−θ)" />
        </article>
        <article>
          <h3>Worked Example</h3>
          <p>
            Compute ({format(z)}) {symbol(operation)} ({format(w)}).
          </p>
          <h4>1 &nbsp; Convert to polar</h4>
          <p>
            {format(z)} = √{norm2(z)} cis({angle(z).toFixed(2)}°)
          </p>
          <p>
            {format(w)} = √{norm2(w)} cis({angle(w).toFixed(2)}°)
          </p>
          <h4>2 &nbsp; Apply the {operation} rule</h4>
          <p>Result modulus = {modulus(result).toFixed(3)}</p>
          <p>Result argument = {angle(result).toFixed(2)}°</p>
          <h4>3 &nbsp; Back to rectangular</h4>
          <output>
            {symbol(operation)} = {format(result)}
          </output>
          <b className="matches">Matches workspace ✓</b>
        </article>
        <article className="cc445-misconception">
          <h3>
            <AlertTriangle /> Common Misconception
          </h3>
          <b>Misusing the argument (angle).</b>
          <p>
            Angles wrap around every 2π. Equivalent angles represent the same
            direction.
          </p>
          <MiniAngle angle={angle(result)} />
          <p>
            Always use a consistent range to avoid sign and quadrant mistakes.
          </p>
        </article>
      </div>
      <section className="cc445-practice">
        <div>
          <h3>Practice Challenge</h3>
          <p>
            Let z = 1 − i and w = −2 + 3i.
            <br />
            Find zw in rectangular form.
          </p>
        </div>
        <label>
          Your answer
          <div>
            <input
              aria-label="Practice real answer"
              value={answer[0]}
              onChange={(e) => {
                setAnswer([e.target.value, answer[1]]);
                setFeedback("");
              }}
            />{" "}
            +{" "}
            <input
              aria-label="Practice imaginary answer"
              value={answer[1]}
              onChange={(e) => {
                setAnswer([answer[0], e.target.value]);
                setFeedback("");
              }}
            />{" "}
            i
          </div>
        </label>
        <button
          data-lesson-control="complex-check"
          onClick={() =>
            act(() =>
              setFeedback(
                Number(answer[0]) === 1 && Number(answer[1]) === 5
                  ? "correct"
                  : "incorrect",
              ),
            )
          }
        >
          Check
        </button>
        <output className={feedback}>
          {feedback === "correct"
            ? "Correct: 1 + 5i"
            : feedback === "incorrect"
              ? "Check distribution"
              : ""}
        </output>
        <button
          data-lesson-control="complex-hint"
          onClick={() => act(() => setHint((v) => !v))}
        >
          <Lightbulb /> Need a hint?
        </button>
        {hint && <p>Use (a+bi)(c+di)=(ac−bd)+(ad+bc)i.</p>}
        <aside>
          <b>Quick check</b>
          <p>|zw| = √26 ≈ 5.099</p>
          <p>arg(zw) = 78.69°</p>
        </aside>
      </section>
      <nav className="cc445-nav">
        <a href="/lessons/symbolic-mathematics/444-matrix-operations">
          <ArrowLeft />
          <span>
            <small>Previous</small>Matrix Operations
          </span>
        </a>
        <a href="/lessons/symbolic-mathematics/446-assumptions">
          <span>
            <small>Next</small>Assumptions
          </span>
          <ArrowRight />
        </a>
      </nav>
    </section>
  );
}
function ArgandGraph({
  z,
  w,
  result,
  operation,
  grid,
}: {
  z: Complex;
  w: Complex;
  result: Complex;
  operation: Operation;
  grid: boolean;
}) {
  const extent = Math.max(
      6,
      Math.abs(z.re),
      Math.abs(z.im),
      Math.abs(w.re),
      Math.abs(w.im),
      Math.abs(result.re),
      Math.abs(result.im),
    ),
    scale = 145 / extent,
    s = (v: number) => 190 + v * scale,
    t = (v: number) => 190 - v * scale;
  return (
    <svg
      viewBox="0 0 380 380"
      role="img"
      aria-label="Argand plane with z, w, and calculated result vectors"
    >
      {grid && (
        <g stroke="#e7edf5">
          {Array.from({ length: 13 }, (_, i) => (
            <line
              key={`v${i}`}
              x1={28 + i * 27}
              x2={28 + i * 27}
              y1="25"
              y2="355"
            />
          ))}
          {Array.from({ length: 13 }, (_, i) => (
            <line
              key={`h${i}`}
              x1="25"
              x2="355"
              y1={28 + i * 27}
              y2={28 + i * 27}
            />
          ))}
        </g>
      )}
      <circle
        cx="190"
        cy="190"
        r="155"
        fill="none"
        stroke="#d4dce8"
        strokeDasharray="3 3"
      />
      <line x1="20" x2="360" y1="190" y2="190" stroke="#64748b" />
      <line x1="190" x2="190" y1="20" y2="360" stroke="#64748b" />
      {[
        [z, "#1769ff", "z"],
        [w, "#8b3dff", "w"],
        [result, "#12b8d0", symbol(operation)],
      ].map(([value, color, label]) => {
        const q = value as Complex;
        return (
          <g key={String(label)}>
            <line
              x1="190"
              y1="190"
              x2={s(q.re)}
              y2={t(q.im)}
              stroke={String(color)}
              strokeWidth="3"
            />
            <circle cx={s(q.re)} cy={t(q.im)} r="4" fill={String(color)} />
            <text
              x={s(q.re) + 6}
              y={t(q.im) - 7}
              fill={String(color)}
              fontWeight="700"
            >
              {String(label)} = {format(q)}
            </text>
          </g>
        );
      })}
      <text x="362" y="184">
        Re
      </text>
      <text x="197" y="20">
        Im
      </text>
    </svg>
  );
}
function ComplexResult({ name, value }: { name: string; value: Complex }) {
  return (
    <article>
      <b>
        {name} = {format(value)}
      </b>
      <p>
        Modulus |{name}| &nbsp; √{norm2(value)} ≈ {modulus(value).toFixed(3)}
      </p>
      <p>
        Argument arg({name}) &nbsp; {angle(value).toFixed(2)}°
      </p>
    </article>
  );
}
function Rule({ name, formula }: { name: string; formula: string }) {
  return (
    <p className="cc445-rule">
      <b>{name}</b>
      <span>{formula}</span>
    </p>
  );
}
function MiniAngle({ angle: theta }: { angle: number }) {
  return (
    <svg viewBox="0 0 220 130">
      <line x1="15" x2="205" y1="95" y2="95" stroke="#334155" />
      <line x1="110" x2="110" y1="115" y2="15" stroke="#334155" />
      <line
        x1="110"
        y1="95"
        x2={110 + 70 * Math.cos((theta * Math.PI) / 180)}
        y2={95 - 70 * Math.sin((theta * Math.PI) / 180)}
        stroke="#8b3dff"
        strokeWidth="3"
      />
      <circle
        cx="110"
        cy="95"
        r="30"
        fill="none"
        stroke="#ef4444"
        strokeDasharray="4 3"
      />
      <text x="145" y="55" fill="#ef4444">
        {theta.toFixed(2)}°
      </text>
    </svg>
  );
}
function calculate(z: Complex, w: Complex, op: Operation): Complex {
  if (op === "add") return { re: z.re + w.re, im: z.im + w.im };
  if (op === "subtract") return { re: z.re - w.re, im: z.im - w.im };
  if (op === "divide") {
    const d = norm2(w);
    return d
      ? {
          re: (z.re * w.re + z.im * w.im) / d,
          im: (z.im * w.re - z.re * w.im) / d,
        }
      : { re: 0, im: 0 };
  }
  return { re: z.re * w.re - z.im * w.im, im: z.re * w.im + z.im * w.re };
}
function norm2(v: Complex) {
  return v.re * v.re + v.im * v.im;
}
function modulus(v: Complex) {
  return Math.sqrt(norm2(v));
}
function angle(v: Complex) {
  return (Math.atan2(v.im, v.re) * 180) / Math.PI;
}
function finite(v: string) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}
function tidy(v: number) {
  return Math.abs(v - Math.round(v)) < 1e-9
    ? String(Math.round(v))
    : v.toFixed(3).replace(/0+$/, "");
}
function format(v: Complex) {
  return `${tidy(v.re)} ${v.im < 0 ? "−" : "+"} ${tidy(Math.abs(v.im))}i`;
}
function symbol(op: Operation) {
  return op === "multiply"
    ? "zw"
    : op === "divide"
      ? "z/w"
      : op === "add"
        ? "z+w"
        : "z−w";
}
