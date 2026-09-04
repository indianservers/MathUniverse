import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
} from "lucide-react";
import { type PointerEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import elevationScene from "../../../assets/lessons/angle-elevation-scene-v2.png";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./AngleElevationTargetLesson10098.css";

const round = (value: number, places = 2) =>
  Math.round(value * 10 ** places) / 10 ** places;
const heightFrom = (distance: number, angle: number) =>
  distance * Math.tan((angle * Math.PI) / 180);

export default function AngleElevationTargetLesson10098({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [distance, setDistance] = useState(20);
  const [angle, setAngle] = useState(45);
  const [eyeHeight, setEyeHeight] = useState(1.6);
  const [dragging, setDragging] = useState(false);
  const [estimate, setEstimate] = useState("");
  const [checked, setChecked] = useState(false);
  const [tab, setTab] = useState(0);
  const [actions, setActions] = useState(0);
  const modelRef = useRef<SVGSVGElement>(null);
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const height = heightFrom(distance, angle);
  const totalHeight = height + eyeHeight;
  const expected = heightFrom(30, 35) + 1.6;
  const estimateCorrect =
    checked &&
    estimate.trim() !== "" &&
    Math.abs(Number(estimate) - expected) <= 0.25;
  const triangleHeight = 80 + 180 * (height / (height + distance));
  const ax = 72,
    ay = 332,
    bx = 410,
    by = 332,
    cy = ay - triangleHeight;
  const sceneTopY = Math.max(45, 292 - Math.tan((angle * Math.PI) / 180) * 215);
  const updateAngleFromPointer = (event: PointerEvent<SVGSVGElement>) => {
    const box = modelRef.current?.getBoundingClientRect();
    if (!box) return;
    const y = ((event.clientY - box.top) / box.height) * 400;
    const fraction = Math.max(0, Math.min(1, (ay - y - 80) / 180));
    const ratio =
      fraction >= 0.99 ? 20 : fraction / Math.max(0.01, 1 - fraction);
    const next = (Math.atan(ratio) * 180) / Math.PI;
    setAngle(Math.max(5, Math.min(80, round(next))));
    setChecked(false);
  };
  const reset = () =>
    act(() => {
      setDistance(20);
      setAngle(45);
      setEyeHeight(1.6);
      setEstimate("");
      setChecked(false);
    });
  const Range = ({
    label,
    value,
    min,
    max,
    step,
    unit,
    onChange,
  }: {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    unit: string;
    onChange: (value: number) => void;
  }) => (
    <label className="aoe10098-range">
      <b>{label}</b>
      <input
        aria-label={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) =>
          act(() => {
            onChange(+event.target.value);
            setChecked(false);
          })
        }
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            act(() => {
              onChange(Math.max(min, round(value - step, 2)));
              setChecked(false);
            });
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            act(() => {
              onChange(Math.min(max, round(value + step, 2)));
              setChecked(false);
            });
          }
        }}
      />
      <strong>
        {round(value, 1)} {unit}
      </strong>
    </label>
  );

  return (
    <section
      className="aoe10098-page"
      data-testid="school-mockup-0772"
      data-object-model="dedicated-angle-elevation-surveying-triangle-engine"
      data-distance={round(distance)}
      data-angle={round(angle)}
      data-eye-height={round(eyeHeight)}
      data-height={round(height)}
      data-total-height={round(totalHeight)}
      data-challenge-expected={round(expected)}
      data-estimate-correct={String(estimateCorrect)}
      data-actions={actions}
    >
      <header className="aoe10098-hero">
        <small>CLASS 10 · TRIGONOMETRY APPLICATIONS</small>
        <h1>Angle of Elevation</h1>
        <p>
          Model heights and horizontal distances using an upward line of sight.
        </p>
        <div>
          <span>24 min</span>
          <span>Intermediate</span>
          <span>geometry2d</span>
        </div>
      </header>
      <nav className="aoe10098-tabs">
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
      </nav>
      <main>
        <section className="aoe10098-lab">
          <article className="scene">
            <header>
              <h2>Real-world scene</h2>
              <b>Observer looking up at a tower</b>
            </header>
            <div className="scene-image">
              <img
                src={elevationScene}
                alt="Observer using a clinometer while looking toward a tower"
              />
              <svg
                viewBox="0 0 500 360"
                aria-label="Line of sight over the tower scene"
              >
                <line
                  className="horizontal"
                  x1="92"
                  y1="292"
                  x2="430"
                  y2="292"
                />
                <line
                  className="sight"
                  x1="92"
                  y1="292"
                  x2="430"
                  y2={sceneTopY}
                />
                <path className="arc" d="M130 292 A38 38 0 0 0 119 265" />
                <text x="133" y="276">
                  θ = {round(angle, 1)}°
                </text>
                <text x="90" y="320">
                  Eye level {round(eyeHeight, 1)} m
                </text>
                <text x="246" y="318">
                  d = {round(distance, 1)} m
                </text>
              </svg>
            </div>
            <div className="scene-controls">
              <Range
                label="Horizontal distance"
                value={distance}
                min={5}
                max={100}
                step={1}
                unit="m"
                onChange={setDistance}
              />
              <Range
                label="Angle of elevation"
                value={angle}
                min={5}
                max={80}
                step={1}
                unit="°"
                onChange={setAngle}
              />
              <Range
                label="Eye level height"
                value={eyeHeight}
                min={1}
                max={2.2}
                step={0.1}
                unit="m"
                onChange={setEyeHeight}
              />
            </div>
          </article>
          <article className="model">
            <header>
              <h2>Right-triangle model</h2>
              <b>Linked to the scene</b>
            </header>
            <svg
              ref={modelRef}
              viewBox="0 0 480 400"
              aria-label="Draggable right-triangle elevation model"
              onPointerMove={(event) =>
                dragging && updateAngleFromPointer(event)
              }
              onPointerUp={() => dragging && act(() => setDragging(false))}
              onPointerLeave={() => dragging && act(() => setDragging(false))}
            >
              <line className="base" x1={ax} y1={ay} x2={bx} y2={by} />
              <line className="tower" x1={bx} y1={by} x2={bx} y2={cy} />
              <line className="hypotenuse" x1={ax} y1={ay} x2={bx} y2={cy} />
              <path
                className="angle-arc"
                d={`M${ax + 50} ${ay} A50 50 0 0 0 ${ax + 44} ${ay - 24}`}
              />
              <rect
                className="right"
                x={bx - 22}
                y={by - 22}
                width="20"
                height="20"
              />
              <circle
                className="top-handle"
                cx={bx}
                cy={cy}
                r="10"
                role="slider"
                tabIndex={0}
                aria-label="Tower top C"
                aria-valuemin={5}
                aria-valuemax={80}
                aria-valuenow={round(angle)}
                onPointerDown={(event) => {
                  event.currentTarget.setPointerCapture(event.pointerId);
                  act(() => setDragging(true));
                }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowUp") {
                    event.preventDefault();
                    act(() => setAngle(Math.min(80, angle + 1)));
                  }
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    act(() => setAngle(Math.max(5, angle - 1)));
                  }
                }}
              />
              <text x={ax - 18} y={ay + 25}>
                A
              </text>
              <text x={bx - 5} y={by + 25}>
                B
              </text>
              <text x={bx - 4} y={cy - 18}>
                C
              </text>
              <text className="theta" x={ax + 58} y={ay - 18}>
                θ
              </text>
              <text className="h" x={bx + 18} y={(by + cy) / 2}>
                h
              </text>
              <text className="d" x={(ax + bx) / 2} y={by + 38}>
                d
              </text>
            </svg>
            <section className="aoe10098-result">
              <p>Height above eye level, h</p>
              <strong>{height.toFixed(2)} m</strong>
              <hr />
              <p>Total height of tower, H = h + eye level</p>
              <b>{totalHeight.toFixed(2)} m</b>
            </section>
            <p className="consistent">
              <CheckCircle2 /> Great! The model and calculations are consistent.
            </p>
          </article>
        </section>
        <section className="aoe10098-rule">
          <h2>Rule / Theorem</h2>
          <strong>tan θ = opposite / adjacent = h / d</strong>
          <div>
            <p>
              <b>h</b> = height above eye level
            </p>
            <p>
              <b>d</b> = horizontal distance
            </p>
            <p>
              <b>θ</b> = angle measured from the horizontal
            </p>
          </div>
          <aside>
            <b>Key idea</b>
            <p>
              If eye level is not at ground, total height H = h + eye-level
              height.
            </p>
          </aside>
        </section>
        <section className="aoe10098-cards">
          <article>
            <h2>
              <Lightbulb /> Why it works
            </h2>
            <p>
              The line of sight, horizontal distance, and vertical height form a
              right triangle.
            </p>
            <p>Using tan θ = h/d lets us find unknown heights or distances.</p>
            <div className="mini">
              <i>θ</i>
              <b>h</b>
              <span>d</span>
            </div>
          </article>
          <article>
            <h2>Worked example</h2>
            <p>
              A person is 20 m from a tower and the angle of elevation is 45°.
              Eye level is 1.6 m.
            </p>
            <p>
              <b>Solution:</b>
            </p>
            <ul>
              <li>tan 45° = h/20</li>
              <li>1 = h/20</li>
              <li>h = 20 m</li>
              <li>H = h + 1.6 = 21.6 m</li>
            </ul>
            <strong>Answer: Total height = 21.6 m</strong>
          </article>
          <article className="mistake">
            <h2>
              <AlertTriangle /> Common misconception
            </h2>
            <p>
              The angle of elevation is measured from the horizontal, not the
              vertical.
            </p>
            <p className="correct">Correct ✓</p>
            <div className="mini">
              <i>θ</i>
              <b>h</b>
              <span>Horizontal</span>
            </div>
            <p className="incorrect">Incorrect: measured from vertical ✕</p>
          </article>
        </section>
        <section className="aoe10098-challenge">
          <article>
            <h2>Your challenge</h2>
            <p>
              A person is 30 m from a tower. The angle of elevation to the top
              is 35°. Eye level is 1.6 m. Estimate the total height.
            </p>
          </article>
          <article>
            <h3>Given</h3>
            <p>
              d = 30 m<br />θ = 35°
              <br />
              Eye level = 1.6 m
            </p>
          </article>
          <article>
            <label>
              Your estimate
              <input
                aria-label="Tower height estimate"
                type="number"
                value={estimate}
                onChange={(event) =>
                  act(() => {
                    setEstimate(event.target.value);
                    setChecked(false);
                  })
                }
                onInput={(event) =>
                  act(() => {
                    setEstimate(event.currentTarget.value);
                    setChecked(false);
                  })
                }
              />
            </label>
            <button onClick={() => act(() => setChecked(true))}>
              Check answer
            </button>
          </article>
          <article>
            <h3>Expected result</h3>
            <strong>H ≈ {expected.toFixed(2)} m</strong>
            {checked && (
              <p className={estimateCorrect ? "correct" : "incorrect"}>
                {estimateCorrect
                  ? "Correct. Your estimate matches the model."
                  : "Use H = 30 tan(35°) + 1.6."}
              </p>
            )}
          </article>
        </section>
        <nav className="aoe10098-next">
          <button onClick={reset}>
            <ArrowLeft /> Reset lesson
          </button>
          <Link to="/lessons/school/class-10/class-10-trigonometry-applications-angle-of-depression">
            Angle of Depression <ArrowRight />
          </Link>
        </nav>
      </main>
    </section>
  );
}
