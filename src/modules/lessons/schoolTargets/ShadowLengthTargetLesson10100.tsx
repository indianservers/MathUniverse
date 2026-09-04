import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  RotateCcw,
  Target,
  TreePine,
  Triangle,
} from "lucide-react";
import { type PointerEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./ShadowLengthTargetLesson10100.css";

const round = (value: number, places = 2) =>
  Math.round(value * 10 ** places) / 10 ** places;

export default function ShadowLengthTargetLesson10100({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [angle, setAngle] = useState(45);
  const [shadow, setShadow] = useState(6);
  const [unit, setUnit] = useState<"m" | "cm">("m");
  const [tab, setTab] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [actions, setActions] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const height = round(shadow * Math.tan((angle * Math.PI) / 180));
  const endpointX = 210 + Math.pow((shadow - 0.5) / 19.5, 0.25) * 390;
  const objectX = 210;
  const groundY = 325;
  const pixelsPerMetre = (endpointX - objectX) / shadow;
  const objectTopY = Math.max(62, groundY - height * pixelsPerMetre);
  const challengeHeight = round(8.4 * (1.5 / 2));

  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const setA = (value: number) =>
    setAngle(Math.max(10, Math.min(80, round(value, 1))));
  const setS = (value: number) =>
    setShadow(Math.max(0.5, Math.min(20, round(value))));
  const reset = () =>
    act(() => {
      setAngle(45);
      setShadow(6);
      setUnit("m");
    });
  const updateShadow = (event: PointerEvent<SVGSVGElement>) => {
    const box = svgRef.current?.getBoundingClientRect();
    if (!box) return;
    const x = ((event.clientX - box.left) / box.width) * 680;
    const position = (Math.max(210, Math.min(600, x)) - 210) / 390;
    setS(0.5 + Math.pow(position, 4) * 19.5);
  };

  return (
    <section
      className="slm10100-page"
      data-testid="school-mockup-0774"
      data-object-model="dedicated-shadow-similar-triangle-engine"
      data-angle={round(angle)}
      data-shadow={round(shadow)}
      data-height={height}
      data-ratio={round(height / shadow, 4)}
      data-challenge-height={challengeHeight}
      data-actions={actions}
    >
      <header className="slm10100-hero">
        <small>CLASS 10 · TRIGONOMETRY APPLICATIONS</small>
        <h1>Shadow Length Modelling</h1>
        <p>Use shadow length and solar elevation to determine object height.</p>
        <div>
          <span>Class 10</span>
          <span>Trigonometry Applications</span>
          <span>Level: Intermediate</span>
          <span>15–20 min</span>
        </div>
      </header>

      <nav className="slm10100-tabs">
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
        <section className="slm10100-lab">
          <article className="slm10100-scene">
            <header>
              <h2>MODEL THE SCENE</h2>
              <span>
                <Triangle /> Same sun, similar triangles
              </span>
            </header>
            <svg
              ref={svgRef}
              viewBox="0 0 680 390"
              aria-label="Interactive object and shadow model"
              onPointerMove={(event) => dragging && updateShadow(event)}
              onPointerUp={() => dragging && act(() => setDragging(false))}
              onPointerLeave={() => dragging && act(() => setDragging(false))}
            >
              <g className="slm10100-sun">
                <circle cx="90" cy="72" r="25" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((degree) => {
                  const radians = (degree * Math.PI) / 180;
                  return (
                    <line
                      key={degree}
                      x1={90 + Math.cos(radians) * 34}
                      y1={72 + Math.sin(radians) * 34}
                      x2={90 + Math.cos(radians) * 47}
                      y2={72 + Math.sin(radians) * 47}
                    />
                  );
                })}
              </g>
              <line
                className="slm10100-ground"
                x1="170"
                y1={groundY}
                x2="630"
                y2={groundY}
              />
              <line
                className="slm10100-object"
                x1={objectX}
                y1={groundY}
                x2={objectX}
                y2={objectTopY}
              />
              <line
                className="slm10100-ray"
                x1="112"
                y1="95"
                x2={endpointX}
                y2={groundY}
              />
              <line
                className="slm10100-hypotenuse"
                x1={objectX}
                y1={objectTopY}
                x2={endpointX}
                y2={groundY}
              />
              <path className="slm10100-right" d={`M210 307h18v18`} />
              <path
                className="slm10100-angle"
                d={`M${endpointX - 55} 325 A55 55 0 0 1 ${endpointX - 39} 286`}
              />
              <circle cx={objectX} cy={groundY} r="7" />
              <circle cx={objectX} cy={objectTopY} r="7" />
              <circle
                className="slm10100-handle"
                cx={endpointX}
                cy={groundY}
                r="11"
                role="slider"
                tabIndex={0}
                aria-label="Shadow endpoint"
                aria-valuemin={0.5}
                aria-valuemax={20}
                aria-valuenow={shadow}
                onPointerDown={(event) => {
                  event.currentTarget.setPointerCapture(event.pointerId);
                  act(() => setDragging(true));
                }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    act(() => setS(shadow - 0.5));
                  }
                  if (event.key === "ArrowRight") {
                    event.preventDefault();
                    act(() => setS(shadow + 0.5));
                  }
                  if (event.key === "Home") {
                    event.preventDefault();
                    act(() => setS(6));
                  }
                }}
              />
              <text x="198" y="345">
                0
              </text>
              <text className="slm10100-solar" x="205" y="46">
                Solar elevation (θ)
              </text>
              <text className="slm10100-solar-value" x="230" y="76">
                {angle.toFixed(1)}°
              </text>
              <text x="92" y="222">
                Object (vertical)
              </text>
              <text className="slm10100-height-text" x="100" y="250">
                h = {height.toFixed(2)} {unit}
              </text>
              <text className="slm10100-angle-text" x={endpointX - 120} y="307">
                θ = {angle.toFixed(1)}°
              </text>
              <text
                className="slm10100-shadow-text"
                x={(objectX + endpointX) / 2 - 50}
                y="370"
              >
                Shadow length: {shadow.toFixed(2)} {unit}
              </text>
            </svg>
          </article>

          <aside className="slm10100-controls">
            <h2>CONTROLS</h2>
            <label>
              <b>Solar elevation (θ)</b>
              <strong>{angle.toFixed(1)}°</strong>
              <input
                aria-label="Solar elevation"
                type="range"
                min="10"
                max="80"
                step="0.1"
                value={angle}
                onChange={(event) => act(() => setA(+event.target.value))}
                onKeyDown={(event) => {
                  if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    act(() => setA(angle - 1));
                  }
                  if (event.key === "ArrowRight") {
                    event.preventDefault();
                    act(() => setA(angle + 1));
                  }
                }}
              />
              <small>
                10° <span>80°</span>
              </small>
            </label>
            <label>
              <b>Shadow length (s)</b>
              <strong>
                {shadow.toFixed(2)} {unit}
              </strong>
              <input
                aria-label="Shadow length"
                type="range"
                min="0.5"
                max="20"
                step="0.01"
                value={shadow}
                onChange={(event) => act(() => setS(+event.target.value))}
                onKeyDown={(event) => {
                  if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    act(() => setS(shadow - 0.5));
                  }
                  if (event.key === "ArrowRight") {
                    event.preventDefault();
                    act(() => setS(shadow + 0.5));
                  }
                }}
              />
              <small>
                0.5 {unit} <span>20 {unit}</span>
              </small>
            </label>
            <div className="slm10100-units">
              <b>Units</b>
              <button
                className={unit === "m" ? "active" : ""}
                onClick={() => act(() => setUnit("m"))}
              >
                m
              </button>
              <button
                className={unit === "cm" ? "active" : ""}
                onClick={() => act(() => setUnit("cm"))}
              >
                cm
              </button>
            </div>
            <section>
              <h3>INSTANT RESULT</h3>
              <p>Object height (h)</p>
              <strong>
                {height.toFixed(2)} {unit}
              </strong>
              <p>Formula: tan θ = h/s</p>
            </section>
            <button className="slm10100-reset" onClick={reset}>
              <RotateCcw /> Reset
            </button>
          </aside>
        </section>

        <section className="slm10100-calc">
          <article>
            <h2>SIMILAR TRIANGLE COMPARISON</h2>
            <div className="slm10100-triangles">
              <span>Reference (sun)</span>
              <b>∿</b>
              <span>Your scene</span>
            </div>
            <p>The same solar angle fixes the same height-to-shadow ratio.</p>
          </article>
          <article>
            <h2>HEIGHT CALCULATION</h2>
            <p>tan θ = h/s</p>
            <p>h = s tan θ</p>
            <p>
              = {shadow.toFixed(2)} × tan({angle.toFixed(1)}°)
            </p>
            <strong>
              = {height.toFixed(2)} {unit}
            </strong>
          </article>
          <article className="slm10100-check">
            <h2>CHECK</h2>
            <p>
              tan {angle.toFixed(1)}° ={" "}
              {Math.tan((angle * Math.PI) / 180).toFixed(4)}
            </p>
            <p>h/s = {(height / shadow).toFixed(4)}</p>
            <strong>
              <CheckCircle2 /> Ratios agree.
            </strong>
          </article>
        </section>

        <section className="slm10100-theory">
          <article>
            <h2>
              <Lightbulb /> WHY IT WORKS
            </h2>
            <p>
              Sun rays are effectively parallel. The object and its shadow form
              a right triangle with angle θ.
            </p>
            <p>
              Every object measured under the same sun forms a similar right
              triangle.
            </p>
            <strong>tan θ = height / shadow length</strong>
          </article>
          <article className="slm10100-mistake">
            <h2>
              <AlertTriangle /> COMMON MISCONCEPTION
            </h2>
            <p>
              Using a sloped surface as the base breaks the right angle. The
              model assumes horizontal ground.
            </p>
            <div className="slm10100-slope">
              <TreePine aria-label="Tree on sloped ground" />
            </div>
            <strong>Keep the base horizontal.</strong>
          </article>
        </section>

        <section className="slm10100-examples">
          <article>
            <h2>WORKED EXAMPLE</h2>
            <p>
              A vertical pole casts a 6.0 m shadow when solar elevation is 45°.
              Find its height.
            </p>
            <p>tan 45° = h/6.0</p>
            <p>h = 6.0 × 1</p>
            <strong>Height = 6.0 m</strong>
          </article>
          <article>
            <h2>REFERENCE STICK</h2>
            <p>A 1.5 m stick casts a 2.0 m shadow. Find the solar elevation.</p>
            <p>tan θ = 1.5/2.0 = 0.75</p>
            <strong>θ = 36.87°</strong>
          </article>
          <article className="slm10100-practice">
            <h2>
              <Target /> PRACTICE CHALLENGE
            </h2>
            <p>
              A tree casts an 8.40 m shadow. A 1.5 m stick casts a 2.00 m shadow
              at the same time.
            </p>
            <div className="slm10100-tree">
              <TreePine aria-label="Tree casting an 8.4 metre shadow" />
              <span>8.40 m</span>
            </div>
            <p>h = 8.40 × (1.5/2.0)</p>
            <strong>Estimated height = {challengeHeight.toFixed(2)} m</strong>
          </article>
        </section>

        <nav className="slm10100-next">
          <Link to="/lessons/school/class-10/class-10-trigonometry-applications-angle-of-depression">
            <ArrowLeft />{" "}
            <span>
              Previous<small>Angle of Depression</small>
            </span>
          </Link>
          <Link to="/lessons/school/class-10/class-10-trigonometry-applications-two-observer-height-problems">
            <span>
              Next<small>Two-Observer Height Problems</small>
            </span>
            <ArrowRight />
          </Link>
        </nav>
      </main>
    </section>
  );
}
