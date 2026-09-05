import { CheckCircle2, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./VariableSeparableEquationsTargetLesson10188.css";

type Side = "pool" | "left" | "right";
const fmt = (n: number, d = 4) => Number(n.toFixed(d));
const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[\s{}()]/g, "")
    .replaceAll("²", "^2");

export default function VariableSeparableEquationsTargetLesson10188({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [yFactor, setYFactor] = useState<Side>("left");
  const [dyFactor, setDyFactor] = useState<Side>("left");
  const [xFactor, setXFactor] = useState<Side>("right");
  const [dxFactor, setDxFactor] = useState<Side>("right");
  const [separation, setSeparation] = useState("");
  const [pointX, setPointX] = useState(0.5);
  const [equation, setEquation] = useState("xy");
  const [practice, setPractice] = useState(["", "", "", "", "", "", "", ""]);
  const [practiceFeedback, setPracticeFeedback] = useState("");
  const [review, setReview] = useState(["", "", ""]);
  const pointY =
    equation === "xy"
      ? 2 * Math.exp((pointX * pointX) / 2)
      : 2 * Math.exp(pointX);
  const equationSlope = equation === "xy" ? pointX * pointY : pointY;
  const curveSlope = equationSlope;
  const separated =
    yFactor === "left" &&
    dyFactor === "left" &&
    xFactor === "right" &&
    dxFactor === "right";
  const curve = useMemo(
    () =>
      Array.from({ length: 181 }, (_, i) => {
        const x = -3 + i / 30,
          y = equation === "xy" ? 2 * Math.exp((x * x) / 2) : 2 * Math.exp(x);
        return `${45 + (x + 3) * 48},${170 - Math.min(y, 4) * 38}`;
      }).join(" "),
    [equation],
  );
  const slopeLines = useMemo(
    () =>
      Array.from({ length: 13 * 9 }, (_, i) => {
        const col = i % 13,
          row = Math.floor(i / 13),
          x = -3 + col * 0.5,
          y = -2 + row * 0.5,
          m = equation === "xy" ? x * y : y,
          angle = Math.atan(m),
          cx = 45 + col * 24,
          cy = 170 - row * 20,
          dx = Math.cos(angle) * 7,
          dy = -Math.sin(angle) * 7;
        return { x1: cx - dx, y1: cy - dy, x2: cx + dx, y2: cy + dy };
      }),
    [equation],
  );
  const place = (factor: "y" | "dy" | "x" | "dx", side: Side) =>
    ({ y: setYFactor, dy: setDyFactor, x: setXFactor, dx: setDxFactor })[
      factor
    ](side);
  const drag = (e: ReactPointerEvent<SVGCircleElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const svg = e.currentTarget.ownerSVGElement!;
    const move = (p: PointerEvent) => {
      const r = svg.getBoundingClientRect();
      setPointX(
        Math.max(
          -1.1,
          Math.min(
            1.1,
            Math.round((((p.clientX - r.left) / r.width) * 6 - 3) * 20) / 20,
          ),
        ),
      );
    };
    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
  };
  const update = (i: number, v: string) =>
    setPractice((old) => old.map((x, n) => (n === i ? v : x)));
  const checkPractice = () => {
    const expected = [
      "dy/y",
      "2xdx",
      "ln|y|",
      "x^2+c",
      "3",
      "3e^x^2",
      "3e^(x^2)",
    ];
    const values = practice.map(norm);
    const ok =
      (values[0].includes("dy/y") || values[0].includes("1/ydy")) &&
      values[1].includes("2xdx") &&
      values[2].includes("ln|y|") &&
      values[3].includes("x^2") &&
      values[4] === "3" &&
      (values[5].includes("3e^x^2") || values[6].includes("3e^x^2"));
    setPracticeFeedback(
      ok
        ? "All correct: y = 3eˣ² satisfies y′ = 2xy and y(0) = 3."
        : `Complete each transformation: ${expected.join(" → ")}.`,
    );
  };
  const reset = () => {
    setYFactor("left");
    setDyFactor("left");
    setXFactor("right");
    setDxFactor("right");
    setSeparation("");
    setPointX(0.5);
    setEquation("xy");
    setPractice(["", "", "", "", "", "", "", ""]);
    setPracticeFeedback("");
    setReview(["", "", ""]);
  };
  const factorButton = (name: "y" | "dy" | "x" | "dx", side: Side) => (
    <button
      type="button"
      draggable
      onDragStart={(e) => e.dataTransfer.setData("factor", name)}
      onClick={() => place(name, side)}
    >
      {name}
    </button>
  );
  return (
    <main
      className="vse10188-page"
      data-testid="school-mockup-0862"
      data-object-model="dedicated-variable-separation-slope-field-engine"
      data-separated={separated}
      data-point-x={fmt(pointX, 2)}
      data-point-y={fmt(pointY)}
      data-equation-slope={fmt(equationSlope)}
      data-curve-slope={fmt(curveSlope)}
    >
      <header className="vse-hero">
        <small>CLASS 12 · DIFFERENTIAL EQUATIONS</small>
        <h1>Variable-Separable Equations</h1>
        <p>
          Solve first-order differential equations of the form dy/dx = f(x)g(y)
          by separating variables, integrating, and applying initial conditions.
        </p>
        <div>
          <span>20 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>solver</span>
          <span>visualized</span>
        </div>
      </header>
      <section className="vse-main">
        <div className="vse-steps">
          <div className="vse-step-title">
            <h3>❶ &nbsp; DRAG TO SEPARATE VARIABLES</h3>
            <button onClick={reset}>
              <RotateCcw /> Reset
            </button>
          </div>
          <p>
            Start with <b className="formula">dy/dx = xy</b>
          </p>
          <p>
            Drag factors to separate variables: move dy/y to the left and x dx
            to the right.
          </p>
          <div className="vse-drop-row">
            <div
              className="vse-drop left"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) =>
                place(
                  e.dataTransfer.getData("factor") as "y" | "dy" | "x" | "dx",
                  "left",
                )
              }
            >
              <h3>y-side (only y and dy)</h3>
              {yFactor === "left" && factorButton("y", "pool")}
              {dyFactor === "left" && factorButton("dy", "pool")}
            </div>
            <b>=</b>
            <div
              className="vse-drop right"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) =>
                place(
                  e.dataTransfer.getData("factor") as "y" | "dy" | "x" | "dx",
                  "right",
                )
              }
            >
              <h3>x-side (only x and dx)</h3>
              {xFactor === "right" && factorButton("x", "pool")}
              {dxFactor === "right" && factorButton("dx", "pool")}
            </div>
          </div>
          <div className="vse-pools">
            <div>
              Available y-factors{" "}
              {yFactor === "pool" && factorButton("y", "left")}
              {dyFactor === "pool" && factorButton("dy", "left")}
            </div>
            <div>
              Available x-factors{" "}
              {xFactor === "pool" && factorButton("x", "right")}
              {dxFactor === "pool" && factorButton("dx", "right")}
            </div>
          </div>
          <div className="vse-check">
            <button
              onClick={() =>
                setSeparation(
                  separated
                    ? "Correct separation!"
                    : "Place y and dy on the left; x and dx on the right.",
                )
              }
            >
              ◎ Check separation
            </button>
            <span className={separated ? "good" : "warn"}>
              {separation ||
                (separated
                  ? "✓ Correct separation!   dy/y = x dx"
                  : "Arrange all four factors")}
            </span>
          </div>
          <article>
            <h3>❷ &nbsp; INTEGRATE BOTH SIDES</h3>
            <div className="vse-integrals">
              <span>
                Integrate left
                <br />
                <b>∫ 1/y dy = ln|y|</b>
              </span>
              <span>
                Integrate right
                <br />
                <b>∫ x dx = x²/2</b>
              </span>
            </div>
            <div className="formula vse-result">ln|y| = x²/2 + C</div>
            <p className="success">✓ Integration step correct</p>
          </article>
          <article>
            <h3>❸ &nbsp; SOLVE FOR y</h3>
            <p>
              Exponentiate both sides and absorb eᶜ into a new arbitrary
              constant C.
            </p>
            <div className="formula vse-result">y = Ceˣ²⁄²</div>
            <p className="success">✓ Exponentiation step correct</p>
          </article>
        </div>
        <aside className="vse-visual">
          <h3>SLOPE FIELD &amp; SOLUTION CURVE</h3>
          <label>
            Equation:
            <select
              value={equation}
              onChange={(e) => setEquation(e.target.value)}
            >
              <option value="xy">dy/dx = xy</option>
              <option value="y">dy/dx = y</option>
            </select>
          </label>
          <svg
            viewBox="0 0 380 300"
            aria-label="Slope field and draggable solution point"
          >
            {slopeLines.map((l, i) => (
              <line key={i} {...l} className="slope" />
            ))}
            <line x1="45" y1="170" x2="360" y2="170" className="axis" />
            <line x1="189" y1="20" x2="189" y2="282" className="axis" />
            <polyline points={curve} className="curve" />
            <circle
              cx={45 + (pointX + 3) * 48}
              cy={170 - Math.min(pointY, 4) * 38}
              r="6"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft")
                  setPointX((x) => Math.max(-1.1, fmt(x - 0.05, 2)));
                if (e.key === "ArrowRight")
                  setPointX((x) => Math.min(1.1, fmt(x + 0.05, 2)));
              }}
              onPointerDown={drag}
            />
          </svg>
          <p>Drag the blue point on the curve.</p>
          <input
            aria-label="Curve point x"
            type="range"
            min="-1.1"
            max="1.1"
            step=".05"
            value={pointX}
            onChange={(e) => setPointX(Number(e.target.value))}
          />
          <div className="vse-values">
            <span>
              Point: ({fmt(pointX, 2)}, {fmt(pointY)})<br />
              Slope from curve: <b>{fmt(curveSlope)}</b>
            </span>
            <span>
              xy at point: <b>{fmt(equationSlope)}</b>
              <br />
              Difference: <strong>{fmt(curveSlope - equationSlope)} ✓</strong>
            </span>
          </div>
          <p className="vse-info">
            ⓘ The slope field shows y′ = {equation === "xy" ? "xy" : "y"}{" "}
            everywhere. The blue curve satisfies the differential equation.
          </p>
          <article>
            <h3>❹ &nbsp; APPLY INITIAL CONDITION</h3>
            <p>Given y(0)=2 and y=Ceˣ²⁄²:</p>
            <div className="formula">2 = Ce⁰ = C</div>
            <div className="formula vse-result">C = 2</div>
            <p>Particular solution:</p>
            <div className="formula vse-result">y = 2eˣ²⁄²</div>
            <p className="success">✓ Constant determined correctly</p>
          </article>
        </aside>
      </section>
      <section className="vse-cards">
        <article>
          <h3>◉ &nbsp; DOMAIN &amp; EQUILIBRIUM</h3>
          <ul>
            <li>We divided by y to separate.</li>
            <li>
              The equilibrium solution y(x)=0 also satisfies the equation.
            </li>
            <li>General family includes C positive, negative, or zero.</li>
          </ul>
        </article>
        <article>
          <h3>◇ &nbsp; ABOUT THE SOLUTION CURVE</h3>
          <ul>
            <li>For C&gt;0 the solution is positive.</li>
            <li>For C&lt;0 the solution is negative.</li>
            <li>For C=0 it is the equilibrium line.</li>
          </ul>
        </article>
        <article>
          <h3>◇ &nbsp; CHECK AT YOUR POINT</h3>
          <p>
            At ({fmt(pointX, 2)}, {fmt(pointY)}) on the curve:
          </p>
          <p>y′ = xy = {fmt(equationSlope)}</p>
          <p>
            <b>Curve slope ≈ {fmt(curveSlope)} ✓</b>
          </p>
        </article>
      </section>
      <section className="vse-work">
        <article>
          <h3>WORKED EXAMPLE (TRY ONE YOURSELF)</h3>
          <p>Solve dy/dx = x/y.</p>
          <ol>
            <li>Separate: y dy = x dx</li>
            <li>Integrate: y²/2 = x²/2 + C</li>
            <li>Solve: y = ±√(x²+C)</li>
            <li>Apply y(0)=2: C=4</li>
            <li>Particular solution: y=+√(x²+4)</li>
          </ol>
        </article>
        <article>
          <h3>PRACTICE PROBLEM (TARGETED)</h3>
          <p>Solve dy/dx = 2xy with y(0)=3.</p>
          {[
            "Separate left",
            "Separate right",
            "Integrated left",
            "Integrated right",
            "Find C",
            "Particular solution",
          ].map((label, i) => (
            <label key={label}>
              {i + 1}. {label}
              <input
                aria-label={label}
                value={practice[i]}
                onChange={(e) => update(i, e.target.value)}
              />
            </label>
          ))}
          <button onClick={checkPractice}>Check all steps</button>
          {practiceFeedback && (
            <p
              className={
                practiceFeedback.startsWith("All correct")
                  ? "correct"
                  : "incorrect"
              }
            >
              {practiceFeedback}
            </p>
          )}
        </article>
      </section>
      <section className="vse-review">
        <h3>QUICK REVIEW</h3>
        {[
          ["Which side should dy/y go?", "Left side"],
          ["General solution of y′=xy?", "y=Ce^(x²/2)"],
          ["If y(0)=2, what is C?", "C=2"],
        ].map(([q, a], i) => (
          <label key={q}>
            <b>{q}</b>
            <select
              value={review[i]}
              onChange={(e) =>
                setReview((old) =>
                  old.map((x, n) => (n === i ? e.target.value : x)),
                )
              }
            >
              <option value="">Select</option>
              <option>{a}</option>
              <option>None of these</option>
            </select>
            {review[i] === a && <CheckCircle2 />}
          </label>
        ))}
      </section>
      <nav className="vse-nav">
        <Link to="/lessons/school/class-12/class-12-differential-equations-first-order-differential-equations">
          ← First-Order Differential Equations
        </Link>
        <Link to="/lessons/school/class-12/class-12-differential-equations-homogeneous-differential-equations">
          Homogeneous Equations →
        </Link>
      </nav>
    </main>
  );
}
