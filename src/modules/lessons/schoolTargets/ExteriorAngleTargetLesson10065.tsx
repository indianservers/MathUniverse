import { ArrowLeft, ArrowRight, Check, RotateCcw, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./ExteriorAngleTargetLesson10065.css";

export default function ExteriorAngleTargetLesson10065({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [extended, setExtended] = useState(true),
    [tilt, setTilt] = useState(0),
    [tab, setTab] = useState(0),
    [answer, setAnswer] = useState("73"),
    [graded, setGraded] = useState(true),
    [actions, setActions] = useState(0);
  const remoteA = 42,
    remoteC = 73,
    exterior = 115 + tilt,
    adjacent = 65 - tilt,
    valid = extended && exterior === remoteA + remoteC;
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const reset = () =>
    act(() => {
      setExtended(true);
      setTilt(0);
    });
  const correct = graded && Number(answer) === 73;
  return (
    <section
      className="ea10065-page"
      data-testid="school-mockup-0739"
      data-object-model="dedicated-exterior-ray-remote-angle-balance-engine"
      data-extended={String(extended)}
      data-tilt={tilt}
      data-angles={`${remoteA},${remoteC},${adjacent},${exterior}`}
      data-valid={String(valid)}
      data-answer={answer}
      data-correct={String(correct)}
      data-actions={actions}
    >
      <header className="ea10065-hero">
        <small>CLASS 9 · EUCLIDEAN GEOMETRY</small>
        <h1>Exterior Angle Theorem</h1>
        <p>
          <b>Objective:</b> Relate a triangle's exterior angle to its two remote
          interior angles.
        </p>
        <div>
          <span>
            ◷ <b>10–12 min</b>
            <small>Estimated time</small>
          </span>
          <span>
            ♙ <b>Class 9</b>
            <small>Grade</small>
          </span>
          <span>
            ⌂ <b>Geometry</b>
            <small>Subject</small>
          </span>
        </div>
        <nav>
          <button className="active">Theory</button>
          <button>▣ Diagram</button>
          <button>⌁ Proof Tools</button>
        </nav>
      </header>
      <nav className="ea10065-tabs">
        {["Interact", "Learn", "Example", "Formula", "Practice"].map((x, i) => (
          <button
            key={x}
            className={tab === i ? "active" : ""}
            aria-selected={tab === i}
            onClick={() => act(() => setTab(i))}
          >
            {x}
          </button>
        ))}
      </nav>
      <main>
        <section className="ea10065-lab">
          <aside>
            <h2>Interactive Triangle Explorer</h2>
            <p>Extend AB and drag point D to form the exterior angle ∠CBD.</p>
            <section>
              <h3>
                <i>1</i> Extend side
              </h3>
              <p>Drag point B to extend side AB.</p>
              <label>
                Extended
                <input
                  type="checkbox"
                  checked={extended}
                  onChange={(e) => act(() => setExtended(e.target.checked))}
                />
                <i />
              </label>
            </section>
            <section>
              <h3>
                <i>2</i> Drag exterior ray
              </h3>
              <p>Drag point D to change the exterior angle.</p>
              <input
                aria-label="Exterior ray tilt"
                type="range"
                min="-25"
                max="25"
                value={tilt}
                onChange={(e) => act(() => setTilt(+e.target.value))}
              />
            </section>
            <section>
              <h3>Live Angle Measures</h3>
              {[
                ["∠A (remote)", remoteA, "blue"],
                ["∠C (remote)", remoteC, "green"],
                ["∠CBD (exterior)", exterior, "purple"],
                ["∠ABC (adjacent)", adjacent, "orange"],
              ].map(([label, value, color]) => (
                <p key={String(label)} className={String(color)}>
                  <i />
                  {label}
                  <b>{value}°</b>
                </p>
              ))}
            </section>
            <footer className={valid ? "success" : "pending"}>
              <Check />
              <b>{valid ? "Excellent!" : "Adjust the extension."}</b>
              <strong>∠CBD = ∠A + ∠C</strong>
              <span>
                {exterior}° = {remoteA}° + {remoteC}°
              </span>
              <p>
                The Exterior Angle Theorem{" "}
                {valid ? "holds." : "needs a straight extension."}
              </p>
            </footer>
          </aside>
          <article>
            <button onClick={reset}>
              <RotateCcw /> Reset Diagram
            </button>
            <ExteriorDiagram
              tilt={tilt}
              extended={extended}
              onTilt={(value) => act(() => setTilt(value))}
            />
            <div className="ea10065-notes">
              <p>
                <i className="blue" /> ∠A and ∠C are the remote interior angles.
              </p>
              <p>
                <i className="purple" /> ∠CBD is the exterior angle at B.
              </p>
            </div>
            <section>
              <h3>Equation Balance</h3>
              <p>
                ∠CBD <b>=</b> ∠A <b>+</b> ∠C
              </p>
              <div>
                <span>{exterior}°</span>
                <b>=</b>
                <span>{remoteA}°</span>
                <b>+</b>
                <span>{remoteC}°</span>
              </div>
            </section>
          </article>
        </section>
        <section className="ea10065-theory">
          <article>
            <h2>💡 Why it works</h2>
            <p>
              The exterior angle and the adjacent interior angle form a linear
              pair (sum 180°). The three interior angles of a triangle sum to
              180°.
            </p>
            <p>So,</p>
            <strong>∠CBD + ∠ABC = 180°</strong>
            <strong>(∠A + ∠B + ∠C) − ∠ABC = 180°</strong>
            <footer>∴ ∠CBD = ∠A + ∠C</footer>
          </article>
          <article>
            <h2>🚀 Worked Example</h2>
            <p>
              If the remote interior angles are 42° and 73°, find the exterior
              angle.
            </p>
            <MiniExterior />
            <p>
              x = 42° + 73°
              <br />= <b>115°</b>
            </p>
            <footer>Exterior angle = 115°</footer>
          </article>
          <article className="warning">
            <h2>⊗ Common Misconception</h2>
            <p>
              The adjacent interior angle is NOT one of the two remote interior
              angles.
            </p>
            <MiniExterior wrong />
            <footer>
              <b>Incorrect: ∠CBD ≠ ∠A + ∠ABC</b>
              <br />
              (115° ≠ 42° + 65°)
            </footer>
          </article>
        </section>
        <section className="ea10065-challenge">
          <header>
            <h2>🏆 Your Turn: Challenge</h2>
            <p>
              The exterior angle at B is 128°. One remote interior angle (at A)
              is 55°.
              <br />
              What is the measure of the other remote interior angle (at C)?
            </p>
          </header>
          <MiniChallenge />
          <section>
            <h3>Find ∠C</h3>
            <label>
              x ={" "}
              <input
                aria-label="Challenge remote angle"
                type="number"
                value={answer}
                onChange={(e) =>
                  act(() => {
                    setAnswer(e.target.value);
                    setGraded(false);
                  })
                }
              />{" "}
              °
            </label>
            <button onClick={() => act(() => setGraded(true))}>
              <Check /> Check Answer
            </button>
          </section>
          <aside className={correct ? "correct" : "incorrect"}>
            {correct ? <Check /> : <X />}
            <h2>{correct ? "Correct!" : "Try again"}</h2>
            <strong>∠C = 73°</strong>
            <p>
              <b>Check:</b>
              <br />
              55° + 73° = 128°
            </p>
          </aside>
        </section>
        <section className="ea10065-takeaway">
          <h2>☆ Key Takeaway</h2>
          <p>
            An exterior angle of a triangle equals the sum of the two remote
            interior angles.
          </p>
          <strong>∠CBD = ∠A + ∠C</strong>
        </section>
      </main>
      <nav className="ea10065-adjacent">
        <Link to="/lessons/school/class-9/class-9-euclidean-geometry-triangle-angle-sum-theorem">
          <ArrowLeft />
          <span>
            Previous Lesson
            <br />
            <b>Triangle Angle Sum Theorem</b>
          </span>
        </Link>
        <Link to="/lessons/school">
          <span>
            Next Lesson
            <br />
            <b>Isosceles Triangle Theorem</b>
          </span>
          <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}
function ExteriorDiagram({
  tilt,
  extended,
  onTilt,
}: {
  tilt: number;
  extended: boolean;
  onTilt: (v: number) => void;
}) {
  return (
    <svg
      className="ea10065-diagram"
      viewBox="0 0 600 520"
      aria-label="Interactive exterior angle triangle"
    >
      <path className="triangle" d="M80 390L390 390L195 65Z" />
      <path className="a" d="M195 65L177 95A35 35 0 0 0 217 99Z" />
      <path className="c" d="M80 390H125A45 45 0 0 0 96 348Z" />
      <path className="b" d="M390 390H342A48 48 0 0 1 361 350Z" />
      {extended && (
        <>
          <line
            className="ray"
            x1="390"
            y1="390"
            x2="555"
            y2={390 - tilt * 2}
          />
          <path
            className="ext"
            d={`M390 390H438A48 48 0 0 0 419 ${350 - tilt}Z`}
          />
          <circle
            className="handle"
            cx="555"
            cy={390 - tilt * 2}
            r="9"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp") onTilt(Math.min(25, tilt + 1));
              if (e.key === "ArrowDown") onTilt(Math.max(-25, tilt - 1));
            }}
          />
        </>
      )}
      <text x="186" y="50">
        A
      </text>
      <text x="66" y="417">
        C
      </text>
      <text x="385" y="417">
        B
      </text>
      <text x="555" y="417">
        D
      </text>
      <text className="blue" x="182" y="125">
        42°
      </text>
      <text className="green" x="125" y="365">
        73°
      </text>
      <text className="orange" x="322" y="365">
        {65 - tilt}°
      </text>
      {extended && (
        <text className="purple" x="422" y="360">
          {115 + tilt}°
        </text>
      )}
    </svg>
  );
}
function MiniExterior({ wrong = false }: { wrong?: boolean }) {
  return (
    <svg className="ea10065-mini" viewBox="0 0 230 130">
      <path d="M15 105L155 105L75 15Z" />
      <line x1="155" y1="105" x2="220" y2="105" />
      <path className="green" d="M15 105H40A25 25 0 0 0 28 84Z" />
      <path className="blue" d="M75 15L64 35A23 23 0 0 0 91 38Z" />
      <path className="purple" d="M155 105H183A28 28 0 0 0 168 81Z" />
      {wrong && (
        <text className="x" x="165" y="65">
          ×
        </text>
      )}
      <text x="63" y="52">
        42°
      </text>
      <text x="37" y="95">
        73°
      </text>
      <text x="167" y="95">
        115°
      </text>
    </svg>
  );
}
function MiniChallenge() {
  return (
    <svg className="ea10065-mini challenge" viewBox="0 0 260 145">
      <path d="M15 120L190 120L75 15Z" />
      <line x1="190" y1="120" x2="250" y2="120" />
      <text x="65" y="55">
        55°
      </text>
      <text x="23" y="110">
        x°
      </text>
      <text x="190" y="105">
        128°
      </text>
    </svg>
  );
}
