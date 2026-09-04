import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  Lightbulb,
  RotateCcw,
  Target,
  Trophy,
} from "lucide-react";
import { type PointerEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./TwoObserverHeightTargetLesson10101.css";

const round = (value: number, places = 2) =>
  Math.round(value * 10 ** places) / 10 ** places;
const tangent = (degrees: number) => Math.tan((degrees * Math.PI) / 180);

export default function TwoObserverHeightTargetLesson10101({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [nearAngle, setNearAngle] = useState(60);
  const [farAngle, setFarAngle] = useState(30);
  const [observerGap, setObserverGap] = useState(20);
  const [dragging, setDragging] = useState<"near" | "far" | null>(null);
  const [tab, setTab] = useState(0);
  const [nearAnswer, setNearAnswer] = useState("");
  const [heightAnswer, setHeightAnswer] = useState("");
  const [graded, setGraded] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [actions, setActions] = useState(0);
  const sceneRef = useRef<SVGSVGElement>(null);

  const tanNear = tangent(nearAngle);
  const tanFar = tangent(farAngle);
  const valid = tanNear > tanFar + 0.01;
  const nearDistance = valid ? (observerGap * tanFar) / (tanNear - tanFar) : 0;
  const height = valid ? nearDistance * tanNear : 0;
  const farDistance = nearDistance + observerGap;
  const towerX = 620;
  const groundY = 300;
  const topY = 50;
  const visualScale = valid ? Math.min(8.5, 250 / Math.max(height, 1)) : 6;
  const nearX = Math.max(95, towerX - nearDistance * visualScale);
  const farX = Math.max(45, towerX - farDistance * visualScale);
  const challengeNear = (30 * tangent(22.5)) / (tangent(45) - tangent(22.5));
  const challengeHeight = challengeNear * tangent(45);
  const challengeCorrect =
    Math.abs(Number(nearAnswer) - challengeNear) <= 0.02 &&
    Math.abs(Number(heightAnswer) - challengeHeight) <= 0.02;

  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const setNear = (value: number) => {
    setNearAngle(Math.max(farAngle + 1, Math.min(80, round(value, 1))));
    setGraded(false);
  };
  const setFar = (value: number) => {
    setFarAngle(Math.max(10, Math.min(nearAngle - 1, round(value, 1))));
    setGraded(false);
  };
  const setGap = (value: number) => {
    setObserverGap(Math.max(5, Math.min(100, round(value))));
    setGraded(false);
  };
  const reset = () =>
    act(() => {
      setNearAngle(60);
      setFarAngle(30);
      setObserverGap(20);
      setNearAnswer("");
      setHeightAnswer("");
      setGraded(false);
      setShowSolution(false);
    });
  const updateObserver = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const box = sceneRef.current?.getBoundingClientRect();
    if (!box) return;
    const x = ((event.clientX - box.left) / box.width) * 700;
    const angle = (Math.atan2(groundY - topY, towerX - x) * 180) / Math.PI;
    if (dragging === "near") setNear(angle);
    else setFar(angle);
  };

  const ObserverHandle = ({
    kind,
    x,
    angle,
  }: {
    kind: "near" | "far";
    x: number;
    angle: number;
  }) => (
    <circle
      className={`toh10101-handle ${kind}`}
      cx={x}
      cy={groundY}
      r="11"
      role="slider"
      tabIndex={0}
      aria-label={`${kind === "near" ? "Near" : "Far"} observer`}
      aria-valuemin={kind === "near" ? farAngle + 1 : 10}
      aria-valuemax={kind === "near" ? 80 : nearAngle - 1}
      aria-valuenow={angle}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        act(() => setDragging(kind));
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          act(() => (kind === "near" ? setNear(angle - 1) : setFar(angle - 1)));
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          act(() => (kind === "near" ? setNear(angle + 1) : setFar(angle + 1)));
        }
        if (event.key === "Home") {
          event.preventDefault();
          act(() => (kind === "near" ? setNear(60) : setFar(30)));
        }
      }}
    />
  );

  return (
    <section
      className="toh10101-page"
      data-testid="school-mockup-0775"
      data-object-model="dedicated-two-observer-linked-tangent-engine"
      data-near-angle={nearAngle}
      data-far-angle={farAngle}
      data-observer-gap={observerGap}
      data-near-distance={round(nearDistance)}
      data-far-distance={round(farDistance)}
      data-height={round(height, 3)}
      data-valid={String(valid)}
      data-challenge-near={round(challengeNear)}
      data-challenge-height={round(challengeHeight)}
      data-challenge-correct={String(graded && challengeCorrect)}
      data-actions={actions}
    >
      <header className="toh10101-hero">
        <small>CLASS 10 · TRIGONOMETRY APPLICATIONS</small>
        <h1>Two-Observer Height Problems</h1>
        <p>
          Determine the height of an inaccessible object using angles of
          elevation measured from two points on the same side.
        </p>
        <div>
          <span>20 min</span>
          <span>INTERMEDIATE</span>
          <span>PRACTICE</span>
          <span>trigonometry</span>
          <span>two observers</span>
        </div>
      </header>

      <nav className="toh10101-tabs">
        {["Interact", "Learn", "Example", "Formula", "Practice"].map(
          (label, index) => (
            <button
              key={label}
              className={tab === index ? "active" : ""}
              onClick={() => act(() => setTab(index))}
            >
              {label}
            </button>
          ),
        )}
        <button className="toh10101-reset" onClick={reset}>
          <RotateCcw /> Reset
        </button>
      </nav>

      <main>
        <section className="toh10101-lab">
          <p>
            Drag the observers or adjust the angles. Distances update
            automatically.
          </p>
          <svg
            ref={sceneRef}
            viewBox="0 0 700 350"
            aria-label="Two observers measuring a tower"
            onPointerMove={(event) => dragging && updateObserver(event)}
            onPointerUp={() => dragging && act(() => setDragging(null))}
            onPointerLeave={() => dragging && act(() => setDragging(null))}
          >
            <defs>
              <pattern
                id="toh-bricks"
                width="24"
                height="16"
                patternUnits="userSpaceOnUse"
              >
                <path d="M0 0h24v16H0z" fill="#d98a54" />
                <path
                  d="M0 0h24M0 16h24M12 0v8M0 8h24M4 8v8"
                  fill="none"
                  stroke="#99502f"
                  strokeWidth=".7"
                />
              </pattern>
            </defs>
            <rect className="toh10101-sky" width="700" height="300" />
            <path
              className="toh10101-cloud"
              d="M85 120c8-24 37-23 46-5 13-12 36-3 36 13H74c0-5 5-8 11-8zM250 68c7-21 31-20 39-5 11-10 29-2 30 11h-77c0-4 3-6 8-6z"
            />
            <line
              className="toh10101-ground"
              x1="0"
              y1={groundY}
              x2="700"
              y2={groundY}
            />
            <rect
              x="565"
              y={topY + 28}
              width="110"
              height={groundY - topY - 28}
              fill="url(#toh-bricks)"
              stroke="#78452f"
            />
            <path
              className="toh10101-roof"
              d={`M550 ${topY + 30}L620 ${topY - 5}l70 35z`}
            />
            <rect
              className="toh10101-window"
              x="580"
              y={topY + 40}
              width="24"
              height="22"
            />
            <rect
              className="toh10101-window"
              x="612"
              y={topY + 40}
              width="24"
              height="22"
            />
            <rect
              className="toh10101-window"
              x="644"
              y={topY + 40}
              width="20"
              height="22"
            />
            <path
              className="toh10101-door"
              d={`M610 ${groundY}v-28a13 13 0 0 1 26 0v28`}
            />
            <line
              className="toh10101-sight near"
              x1={nearX}
              y1={groundY}
              x2={towerX}
              y2={topY}
            />
            <line
              className="toh10101-sight far"
              x1={farX}
              y1={groundY}
              x2={towerX}
              y2={topY}
            />
            <path
              className="toh10101-angle near"
              d={`M${nearX + 48} ${groundY} A48 48 0 0 0 ${nearX + 24} ${groundY - 42}`}
            />
            <path
              className="toh10101-angle far"
              d={`M${farX + 55} ${groundY} A55 55 0 0 0 ${farX + 47} ${groundY - 28}`}
            />
            <ObserverHandle kind="near" x={nearX} angle={nearAngle} />
            <ObserverHandle kind="far" x={farX} angle={farAngle} />
            <text
              className="toh10101-label near"
              x={nearX - 25}
              y={groundY - 25}
            >
              A (near)
            </text>
            <text className="toh10101-label far" x={farX - 20} y={groundY - 25}>
              B (far)
            </text>
            <text
              className="toh10101-angle-text near"
              x={nearX + 55}
              y={groundY - 32}
            >
              {nearAngle.toFixed(1)}°
            </text>
            <text
              className="toh10101-angle-text far"
              x={farX + 58}
              y={groundY - 18}
            >
              {farAngle.toFixed(1)}°
            </text>
            <text x={(nearX + farX) / 2 - 15} y="330">
              {observerGap.toFixed(0)} m
            </text>
            <text x={(nearX + towerX) / 2 - 25} y="346">
              x = {nearDistance.toFixed(2)} m
            </text>
            <text className="toh10101-height-label" x="654" y="180">
              h
            </text>
          </svg>
          <section className="toh10101-controls">
            <article>
              <h3>ANGLE AT A (NEAR)</h3>
              <strong>{nearAngle.toFixed(1)}°</strong>
              <div>
                <button onClick={() => act(() => setNear(nearAngle - 1))}>
                  −
                </button>
                <button onClick={() => act(() => setNear(nearAngle + 1))}>
                  +
                </button>
              </div>
            </article>
            <article>
              <h3>ANGLE AT B (FAR)</h3>
              <strong>{farAngle.toFixed(1)}°</strong>
              <div>
                <button onClick={() => act(() => setFar(farAngle - 1))}>
                  −
                </button>
                <button onClick={() => act(() => setFar(farAngle + 1))}>
                  +
                </button>
              </div>
            </article>
            <article>
              <h3>DISTANCE AB</h3>
              <label>
                <input
                  aria-label="Observer distance"
                  type="number"
                  min="5"
                  max="100"
                  value={observerGap}
                  onChange={(event) => act(() => setGap(+event.target.value))}
                />{" "}
                m
              </label>
              <input
                aria-label="Observer distance slider"
                type="range"
                min="5"
                max="100"
                value={observerGap}
                onChange={(event) => act(() => setGap(+event.target.value))}
                onKeyDown={(event) => {
                  if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    act(() => setGap(observerGap - 1));
                  }
                  if (event.key === "ArrowRight") {
                    event.preventDefault();
                    act(() => setGap(observerGap + 1));
                  }
                }}
              />
            </article>
            <article className={valid ? "consistent" : "invalid"}>
              <h3>CALCULATED HEIGHT</h3>
              <strong>
                {valid ? `h = ${height.toFixed(3)} m` : "Angles must differ"}
              </strong>
              <p>
                {valid
                  ? `Near distance x = ${nearDistance.toFixed(2)} m`
                  : "Near angle must exceed far angle."}
              </p>
              <span>
                {valid ? (
                  <>
                    <CheckCircle2 /> Consistent
                  </>
                ) : (
                  <>
                    <AlertTriangle /> Invalid
                  </>
                )}
              </span>
            </article>
          </section>
        </section>

        <section className="toh10101-equations">
          <article>
            <h2>LINKED EQUATIONS</h2>
            <p>For observers on the same side:</p>
            <strong>h = x tan α = (x + d) tan β</strong>
            <div className="toh10101-eq-pair">
              <span>
                From A: h = {nearDistance.toFixed(2)} tan {nearAngle.toFixed(1)}
                °
              </span>
              <span>
                From B: h = {farDistance.toFixed(2)} tan {farAngle.toFixed(1)}°
              </span>
            </div>
            <p>x = d tan β / (tan α − tan β) = {nearDistance.toFixed(2)} m</p>
            <b>h = x tan α = {height.toFixed(3)} m</b>
          </article>
          <article>
            <h2>SOLVE STEPS</h2>
            <ol>
              <li>Write the two tangent equations.</li>
              <li>Equate both expressions for h.</li>
              <li>Solve for near distance x.</li>
              <li>Substitute x to find height.</li>
            </ol>
            <div className="toh10101-answer">
              <Trophy />
              <span>
                <b>ANSWER</b>Near distance x = {nearDistance.toFixed(2)} m<br />
                Height h = {height.toFixed(3)} m
              </span>
            </div>
          </article>
        </section>

        <section className="toh10101-cards">
          <article>
            <h2>
              <Lightbulb /> WHY IT WORKS
            </h2>
            <p>
              The two right triangles formed by the tower and observers share
              the same height h. Tangent relates height to each horizontal
              distance.
            </p>
            <div className="toh10101-mini">
              <span>α</span>
              <span>β</span>
              <b>h</b>
            </div>
            <strong>Key: Larger angle is at the nearer point.</strong>
          </article>
          <article>
            <h2>
              <CheckCircle2 /> WORKED EXAMPLE
            </h2>
            <p>Two observers are 20 m apart. Their angles are 60° and 30°.</p>
            <p>x = 20 tan30° / (tan60° − tan30°) = 10 m</p>
            <p>h = 10 tan60° = 10√3 m</p>
            <strong>Answer: x = 10 m, h ≈ 17.321 m</strong>
          </article>
          <article className="toh10101-mistake">
            <h2>
              <AlertTriangle /> COMMON MISTAKE
            </h2>
            <p>
              Assigning the larger angle to the farther observer reverses the
              geometry and gives a wrong or negative height.
            </p>
            <div className="toh10101-wrong">
              30° <span>60°</span>
            </div>
            <strong>Larger angle must be at the nearer observer.</strong>
          </article>
        </section>

        <section className="toh10101-challenge">
          <header>
            <h2>
              <Target /> YOUR CHALLENGE
            </h2>
            <p>
              Two observers are 30 m apart on level ground. The near angle is
              45° and the far angle is 22.5°. Find the near distance and tower
              height.
            </p>
          </header>
          <div>
            <label>
              Near distance x ={" "}
              <input
                aria-label="Challenge near distance"
                type="number"
                step="0.01"
                value={nearAnswer}
                onChange={(event) => {
                  setNearAnswer(event.target.value);
                  setGraded(false);
                }}
              />{" "}
              m
            </label>
            <label>
              Height h ={" "}
              <input
                aria-label="Challenge height"
                type="number"
                step="0.01"
                value={heightAnswer}
                onChange={(event) => {
                  setHeightAnswer(event.target.value);
                  setGraded(false);
                }}
              />{" "}
              m
            </label>
            <button onClick={() => act(() => setGraded(true))}>
              Check Answer
            </button>
            <button
              onClick={() => act(() => setShowSolution((value) => !value))}
            >
              <Eye /> Show Solution
            </button>
          </div>
          {graded && (
            <p className={challengeCorrect ? "correct" : "incorrect"}>
              {challengeCorrect ? (
                <>
                  <CheckCircle2 /> Correct: x = h = {challengeHeight.toFixed(2)}{" "}
                  m.
                </>
              ) : (
                "Check both linked tangent equations and try again."
              )}
            </p>
          )}
          {showSolution && (
            <p className="solution">
              tan 22.5° = √2 − 1. Therefore x = 30(√2 − 1)/(1 − (√2 − 1)) =
              21.21 m and h = x tan45° = 21.21 m.
            </p>
          )}
          <aside>
            <b>Hint</b>tan 22.5° = √2 − 1
          </aside>
        </section>

        <nav className="toh10101-next">
          <Link to="/lessons/school/class-10/class-10-trigonometry-applications-angle-of-depression">
            <ArrowLeft /> Previous: Angle Ratio Explorer
          </Link>
          <Link to="/lessons/school/class-10/class-10-trigonometry-applications-shadow-length-modelling">
            Next: Shadow-Length Modelling <ArrowRight />
          </Link>
        </nav>
      </main>
    </section>
  );
}
