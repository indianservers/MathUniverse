import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Target,
} from "lucide-react";
import { type PointerEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import depressionScene from "../../../assets/lessons/angle-depression-lighthouse.png";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./AngleDepressionTargetLesson10099.css";

const round = (value: number, places = 2) =>
  Math.round(value * 10 ** places) / 10 ** places;
const angleFor = (height: number, distance: number) =>
  (Math.atan(height / distance) * 180) / Math.PI;

export default function AngleDepressionTargetLesson10099({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [height, setHeight] = useState(40);
  const [distance, setDistance] = useState(round(40 / Math.tan(Math.PI / 6)));
  const [dragging, setDragging] = useState(false);
  const [tab, setTab] = useState(0);
  const [actions, setActions] = useState(0);
  const sceneRef = useRef<SVGSVGElement>(null);
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const angle = angleFor(height, distance);
  const equalAngles = true;
  const challengeDifference = Math.abs(distance - height);
  const challengeComplete = Math.abs(angle - 45) < 0.08;
  const boatX = 175 + ((distance - 5) / 195) * 455;
  const observerY = 70;
  const waterY = 345;
  const setD = (value: number) =>
    setDistance(Math.max(5, Math.min(200, round(value))));
  const updateBoat = (event: PointerEvent<SVGSVGElement>) => {
    const box = sceneRef.current?.getBoundingClientRect();
    if (!box) return;
    const x = ((event.clientX - box.left) / box.width) * 700;
    setD(5 + ((Math.max(175, Math.min(630, x)) - 175) / 455) * 195);
  };
  const reset = () =>
    act(() => {
      setHeight(40);
      setDistance(round(40 / Math.tan(Math.PI / 6)));
    });
  const Range = ({
    label,
    value,
    min,
    max,
    unit,
    onChange,
  }: {
    label: string;
    value: number;
    min: number;
    max: number;
    unit: string;
    onChange: (value: number) => void;
  }) => (
    <label className="aod10099-range">
      <b>{label}</b>
      <input
        aria-label={label}
        type="range"
        min={min}
        max={max}
        step=".01"
        value={value}
        onChange={(event) => act(() => onChange(+event.target.value))}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            act(() => onChange(Math.max(min, round(value - 1))));
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            act(() => onChange(Math.min(max, round(value + 1))));
          }
          if (event.key === "Home" && label === "Boat position") {
            event.preventDefault();
            act(() => onChange(height));
          }
        }}
      />
      <strong>
        {value.toFixed(2)} {unit}
      </strong>
      <small>
        Range: {min} – {max} {unit}
      </small>
    </label>
  );

  return (
    <section
      className="aod10099-page"
      data-testid="school-mockup-0773"
      data-object-model="dedicated-angle-depression-parallel-lines-engine"
      data-height={round(height)}
      data-distance={round(distance)}
      data-depression-angle={round(angle)}
      data-elevation-angle={round(angle)}
      data-equal-angles={String(equalAngles)}
      data-challenge-difference={round(challengeDifference)}
      data-challenge-complete={String(challengeComplete)}
      data-actions={actions}
    >
      <header className="aod10099-hero">
        <small>CLASS 10 · TRIGONOMETRY APPLICATIONS</small>
        <h1>Angle of Depression</h1>
        <p>
          Relate a downward line of sight to the equal alternate angle of
          elevation.
        </p>
        <div>
          <span>24 min</span>
          <span>INTERACTIVE</span>
          <span>VISUAL</span>
          <span>CLASS 10</span>
          <span>geometry2d</span>
        </div>
      </header>
      <nav className="aod10099-tabs">
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
        <section className="aod10099-scene">
          <header>
            <h2>OBSERVATION SCENE</h2>
            <p>
              Adjust the height or move the boat to see how the angles stay
              equal.
            </p>
          </header>
          <div className="scene-grid">
            <aside>
              <Range
                label="Observer height"
                value={height}
                min={10}
                max={100}
                unit="m"
                onChange={setHeight}
              />
              <Range
                label="Boat position"
                value={distance}
                min={5}
                max={200}
                unit="m"
                onChange={setD}
              />
              <section className="measure">
                <h3>Live Measurements</h3>
                <p>
                  Angle of depression (∠A)<b>{angle.toFixed(1)}°</b>
                </p>
                <p>
                  Angle of elevation (∠B)<b>{angle.toFixed(1)}°</b>
                </p>
                <strong>
                  <CheckCircle2 /> ∠A = ∠B (alternate angles)
                </strong>
              </section>
            </aside>
            <article>
              <div className="scene-image">
                <img
                  src={depressionScene}
                  alt="Lighthouse on a cliff and a sailboat at sea"
                />
                <svg
                  ref={sceneRef}
                  viewBox="0 0 700 430"
                  aria-label="Draggable boat in an angle of depression scene"
                  onPointerMove={(event) => dragging && updateBoat(event)}
                  onPointerUp={() => dragging && act(() => setDragging(false))}
                  onPointerLeave={() =>
                    dragging && act(() => setDragging(false))
                  }
                >
                  <line
                    className="eye-line"
                    x1="120"
                    y1={observerY}
                    x2="660"
                    y2={observerY}
                  />
                  <line
                    className="ground-line"
                    x1="120"
                    y1={waterY}
                    x2={boatX}
                    y2={waterY}
                  />
                  <line
                    className="height-line"
                    x1="120"
                    y1={observerY}
                    x2="120"
                    y2={waterY}
                  />
                  <line
                    className="sight"
                    x1="120"
                    y1={observerY}
                    x2={boatX}
                    y2={waterY}
                  />
                  <path
                    className="angle top"
                    d={`M175 ${observerY} A55 55 0 0 1 164 ${observerY + 32}`}
                  />
                  <path
                    className="angle bottom"
                    d={`M${boatX - 58} ${waterY} A58 58 0 0 1 ${boatX - 48} ${waterY - 32}`}
                  />
                  <circle className="observer" cx="120" cy={observerY} r="8" />
                  <text x="105" y="48">
                    A
                  </text>
                  <text x="638" y="54">
                    X
                  </text>
                  <text className="angle-text" x="175" y="105">
                    {angle.toFixed(1)}°
                  </text>
                  <text className="angle-text" x={boatX - 90} y={waterY - 25}>
                    {angle.toFixed(1)}°
                  </text>
                  <text className="horizontal-label" x="370" y="55">
                    Horizontal eye line
                  </text>
                  <text
                    className="horizontal-label"
                    x={(120 + boatX) / 2}
                    y={waterY - 12}
                  >
                    Horizontal ground
                  </text>
                  <text className="height-label" x="125" y="220">
                    h = {height.toFixed(0)} m
                  </text>
                  <text
                    className="distance-label"
                    x={(120 + boatX) / 2 - 35}
                    y="398"
                  >
                    d = {distance.toFixed(2)} m
                  </text>
                  <circle
                    className="boat-handle"
                    cx={boatX}
                    cy={waterY}
                    r="11"
                    role="slider"
                    tabIndex={0}
                    aria-label="Boat B"
                    aria-valuemin={5}
                    aria-valuemax={200}
                    aria-valuenow={round(distance)}
                    onPointerDown={(event) => {
                      event.currentTarget.setPointerCapture(event.pointerId);
                      act(() => setDragging(true));
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "ArrowLeft") {
                        event.preventDefault();
                        act(() => setD(distance - 1));
                      }
                      if (event.key === "ArrowRight") {
                        event.preventDefault();
                        act(() => setD(distance + 1));
                      }
                      if (event.key === "Home") {
                        event.preventDefault();
                        act(() => setD(height));
                      }
                    }}
                  />
                  <text x={boatX - 8} y={waterY + 30}>
                    B
                  </text>
                </svg>
              </div>
              <footer>
                <span>∠A: Angle of depression</span>
                <span>Horizontal lines (AX ∥ CB)</span>
                <span>∠B: Angle of elevation</span>
                <span>Line of sight (AB)</span>
              </footer>
            </article>
          </div>
        </section>
        <section className="aod10099-cards">
          <article>
            <h2>WHY IT WORKS</h2>
            <p>
              AX (eye line) is parallel to CB (ground). With AB as a
              transversal, ∠A and ∠B are alternate interior angles, so they are
              equal.
            </p>
            <div className="parallel">
              <b>A</b>
              <b>B</b>
              <span>AX</span>
              <span>CB</span>
            </div>
            <strong>Therefore, ∠A = ∠B</strong>
          </article>
          <article>
            <h2>WORKED EXAMPLE</h2>
            <p>
              A lighthouse is 40 m high. The angle of depression to a boat is
              30°. Find the horizontal distance.
            </p>
            <p>
              <b>Given:</b> h=40 m, ∠A=30°
            </p>
            <p>
              tan θ = h/d
              <br />
              tan 30° = 40/d
              <br />d = 40/tan 30°
            </p>
            <strong>The boat is 69.28 m from the base.</strong>
          </article>
          <article className="mistake">
            <h2>
              <Lightbulb /> COMMON MISTAKE
            </h2>
            <p>
              Measuring the angle from the vertical gives the complementary
              angle.
            </p>
            <div className="wrong">
              <b>60°</b>
              <span>30°</span>
            </div>
            <p>
              Here 60° is from the vertical. The angle of depression is measured
              from the horizontal, so the correct angle is 30°.
            </p>
            <strong>Always measure from the horizontal eye line.</strong>
          </article>
        </section>
        <section className="aod10099-challenge">
          <article>
            <h2>
              <Target /> YOUR CHALLENGE
            </h2>
            <p>
              Move the boat to make the angle of depression 45°. What is the
              horizontal distance when the lighthouse height is 40 m?
            </p>
            <button onClick={reset}>Reset Scene</button>
          </article>
          <article>
            <h3>Set ∠A = 45°</h3>
            <p className={challengeComplete ? "success" : "pending"}>
              {challengeComplete ? (
                <>
                  <CheckCircle2 /> Great! Angle of depression = 45.0°
                </>
              ) : (
                `Current angle = ${angle.toFixed(1)}°`
              )}
            </p>
            <p>
              Horizontal distance (d) <b>{distance.toFixed(2)} m</b>
            </p>
            <small>
              Expected: {height.toFixed(2)} m · Difference:{" "}
              {challengeDifference.toFixed(2)} m
            </small>
          </article>
          <article>
            <h3>Why {height.toFixed(0)} m?</h3>
            <p>When ∠A=45°, tan 45°=1.</p>
            <p>
              So, d = h/tan45° = {height.toFixed(0)}/1 = {height.toFixed(0)} m.
            </p>
          </article>
        </section>
        <nav className="aod10099-next">
          <Link to="/lessons/school/class-10/class-10-trigonometry-applications-angle-of-elevation">
            <ArrowLeft /> Angle of Elevation
          </Link>
          <Link to="/lessons/school/class-10/class-10-trigonometry-applications-shadow-length-modelling">
            Shadow-Length Modelling <ArrowRight />
          </Link>
        </nav>
      </main>
    </section>
  );
}
