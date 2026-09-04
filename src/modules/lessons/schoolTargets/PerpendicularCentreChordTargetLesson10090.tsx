import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  RotateCcw,
  Shuffle,
} from "lucide-react";
import { type PointerEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./PerpendicularCentreChordTargetLesson10090.css";

const round = (n: number, p = 2) => Math.round(n * 10 ** p) / 10 ** p;
export default function PerpendicularCentreChordTargetLesson10090({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [radius, setRadius] = useState(6),
    [chord, setChord] = useState(10),
    [construction, setConstruction] = useState(true),
    [dragging, setDragging] = useState(false),
    [tab, setTab] = useState(0),
    [actions, setActions] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null),
    half = chord / 2,
    om = round(Math.sqrt(Math.max(0, radius * radius - half * half))),
    valid = chord > 0 && chord < 2 * radius;
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const setR = (value: number) => {
    const next = Math.max(3, Math.min(10, round(value, 1)));
    setRadius(next);
    setChord((c) => Math.min(c, round(next * 1.9, 1)));
  };
  const setC = (value: number) =>
    setChord(Math.max(0.5, Math.min(round(radius * 1.99, 1), round(value, 1))));
  const reset = () =>
    act(() => {
      setRadius(6);
      setChord(10);
      setConstruction(true);
    });
  const random = () =>
    act(() => {
      const seed = (actions * 7 + 3) % 8,
        nextR = 4 + seed * 0.5,
        nextC = round(Math.max(2, nextR * (0.9 + ((seed * 3) % 7) / 10)), 1);
      setRadius(nextR);
      setChord(Math.min(nextC, round(nextR * 1.9, 1)));
    });
  const localX = (e: PointerEvent<SVGSVGElement>) => {
    const r = svgRef.current?.getBoundingClientRect();
    return r ? ((e.clientX - r.left) / r.width) * 14 - 7 : 0;
  };
  const keyboard = (direction: number) => act(() => setC(chord + direction));
  const cx = 285,
    cy = 196,
    scale = 27,
    rr = radius * scale,
    y = cy + om * scale,
    ax = cx - half * scale,
    bx = cx + half * scale;
  return (
    <section
      className="pcc10090-page"
      data-testid="school-mockup-0764"
      data-object-model="dedicated-centre-perpendicular-chord-bisection-engine"
      data-radius={radius}
      data-chord={chord}
      data-half={half}
      data-om={om}
      data-am={half}
      data-mb={half}
      data-right-angles="90,90"
      data-congruent={String(valid)}
      data-construction={String(construction)}
      data-actions={actions}
    >
      <header className="pcc10090-hero">
        <small>CLASS 10 · CIRCLE PROOFS</small>
        <h1>Perpendicular from Centre to Chord</h1>
        <p>
          Prove that a perpendicular from a circle&apos;s centre to a chord
          bisects the chord.
        </p>
        <div>
          <span>18 min</span>
          <span>INTERMEDIATE</span>
          <span>CONCEPT</span>
          <span>geometry2d</span>
        </div>
      </header>
      <nav className="pcc10090-tabs">
        {["Interact", "Learn", "Example", "Formula", "Practice"].map((x, i) => (
          <button
            key={x}
            className={tab === i ? "active" : ""}
            onClick={() => act(() => setTab(i))}
          >
            {x}
          </button>
        ))}
      </nav>
      <main>
        <section className="pcc10090-lab">
          <article>
            <header>
              <div>
                <h2>INTERACTIVE DIAGRAM</h2>
                <p>Drag the endpoints A or B to change the chord.</p>
              </div>
              <button onClick={reset}>
                <RotateCcw /> Reset
              </button>
            </header>
            <svg
              ref={svgRef}
              viewBox="0 0 570 430"
              aria-label="Draggable centre perpendicular chord construction"
              onPointerMove={(e) => {
                if (dragging) setC(Math.abs(localX(e)) * 2);
              }}
              onPointerUp={() => dragging && act(() => setDragging(false))}
              onPointerLeave={() => dragging && act(() => setDragging(false))}
            >
              <circle className="circle" cx={cx} cy={cy} r={rr} />
              {construction && (
                <>
                  <line className="radius a" x1={cx} y1={cy} x2={ax} y2={y} />
                  <line className="radius b" x1={cx} y1={cy} x2={bx} y2={y} />
                  <line className="perp" x1={cx} y1={cy} x2={cx} y2={y} />
                  <path className="right" d={`M${cx} ${y - 18}h18v18`} />
                </>
              )}
              <line className="chord" x1={ax} y1={y} x2={bx} y2={y} />
              {[
                [-1, "A"],
                [1, "B"],
              ].map(([side, label]) => (
                <g key={label}>
                  <circle
                    className={`endpoint ${label.toLowerCase()}`}
                    tabIndex={0}
                    aria-label={`Draggable chord endpoint ${label}`}
                    cx={side === -1 ? ax : bx}
                    cy={y}
                    r="8"
                    onPointerDown={(e) => {
                      e.currentTarget.setPointerCapture(e.pointerId);
                      setDragging(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowLeft")
                        keyboard(label === "A" ? 1 : -1);
                      if (e.key === "ArrowRight")
                        keyboard(label === "A" ? -1 : 1);
                    }}
                  />
                  <text
                    x={(side === -1 ? ax : bx) + (side === -1 ? -25 : 14)}
                    y={y + 8}
                  >
                    {label}
                  </text>
                </g>
              ))}
              <circle className="center" cx={cx} cy={cy} r="7" />
              <circle className="mid" cx={cx} cy={y} r="6" />
              <text x={cx - 7} y={cy - 16}>
                O
              </text>
              <text x={cx - 8} y={y + 30}>
                M
              </text>
              {construction && (
                <>
                  <text className="measure" x={ax + 30} y={y + 30}>
                    AM = {half.toFixed(2)} cm
                  </text>
                  <text className="measure" x={cx + 30} y={y + 30}>
                    MB = {half.toFixed(2)} cm
                  </text>
                  <path
                    className="brace"
                    d={`M${ax} ${y + 90}v12M${ax} ${y + 96}H${bx}M${bx} ${y + 90}v12`}
                  />
                  <text className="length" x={cx - 52} y={y + 103}>
                    AB = {chord.toFixed(2)} cm
                  </text>
                </>
              )}
            </svg>
            <footer>
              <CheckCircle2 /> Great! AM = MB. The perpendicular from the centre
              bisects the chord.
            </footer>
          </article>
          <aside>
            <section>
              <h2>CONTROLS</h2>
              <label>
                Radius (r)
                <input
                  aria-label="Circle radius"
                  type="range"
                  min="3"
                  max="10"
                  step=".1"
                  value={radius}
                  onChange={(e) => act(() => setR(+e.target.value))}
                />
                <output>{radius} cm</output>
              </label>
              <label>
                Chord length (AB)
                <input
                  aria-label="Chord length"
                  type="range"
                  min=".5"
                  max={radius * 1.99}
                  step=".1"
                  value={chord}
                  onChange={(e) => act(() => setC(+e.target.value))}
                />
                <output>{chord} cm</output>
              </label>
              <button onClick={random}>
                <Shuffle /> Random chord
              </button>
              <button onClick={() => act(() => setConstruction((v) => !v))}>
                <Eye />{" "}
                {construction ? "Hide construction" : "Show construction"}
              </button>
            </section>
            <section>
              <h2>MEASUREMENTS</h2>
              <p>OA = OB = {radius.toFixed(2)} cm (radii)</p>
              <p>OM = {om.toFixed(2)} cm (perpendicular)</p>
              <p>AM = {half.toFixed(2)} cm</p>
              <p>MB = {half.toFixed(2)} cm</p>
              <strong>∠OMA = 90°</strong>
              <strong>∠OMB = 90°</strong>
            </section>
            <section>
              <h2>TRIANGLE CHECK</h2>
              <strong>△OMA ≅ △OMB (RHS)</strong>
              <p>OA = OB (radii)</p>
              <p>OM = OM (common)</p>
              <p>∠OMA = ∠OMB = 90°</p>
            </section>
          </aside>
        </section>
        <section className="pcc10090-theorem">
          <article>
            <h2>THEOREM (RULE)</h2>
            <p>
              In a circle, the perpendicular from the centre to a chord bisects
              the chord.
            </p>
          </article>
          <article>
            <h2>CONVERSE</h2>
            <p>
              In a circle, the line drawn through the centre and midpoint of a
              chord is perpendicular to the chord.
            </p>
          </article>
        </section>
        <section className="pcc10090-cards">
          <article>
            <h2>WHY IT WORKS</h2>
            <p>Consider △OMA and △OMB.</p>
            <p>✓ OA = OB (radii)</p>
            <p>✓ OM = OM (common side)</p>
            <p>✓ ∠OMA = ∠OMB = 90°</p>
            <p>By RHS congruence, △OMA ≅ △OMB. Therefore, AM = MB.</p>
            <div className="mini">
              ◯<br />A ─── M ─── B
            </div>
          </article>
          <article>
            <h2>WORKED EXAMPLE</h2>
            <p>
              In a circle of radius {radius} cm, chord AB = {chord} cm.
            </p>
            <p>OM ⟂ AB at M. Find AM and MB.</p>
            <strong>
              AM = MB = AB/2 = {chord}/2 = {half.toFixed(2)} cm.
            </strong>
            <em>Answer: AM = MB = {half.toFixed(2)} cm.</em>
          </article>
          <article className="warning">
            <h2>COMMON MISCONCEPTION</h2>
            <strong>
              A radius to an arbitrary point on the chord does NOT necessarily
              bisect the chord.
            </strong>
            <div className="mini wrong">
              ◯<br />A ── P ───── B
            </div>
            <p>The centre line must be perpendicular to AB.</p>
          </article>
        </section>
        <section className="pcc10090-challenge">
          <article>
            <h2>CHALLENGE: YOUR TURN</h2>
            <p>
              Move A or B to change the chord. Keep OM perpendicular to AB.
              Verify that AM always equals MB. Try different chord lengths.
            </p>
          </article>
          <article>
            <h3>Goal</h3>
            <p>Keep ∠OMA = 90°.</p>
            <p>Verify AM = MB.</p>
          </article>
          <article>
            <h3>Live check</h3>
            <p>✓ ∠OMA = 90°</p>
            <p>✓ AM = MB</p>
            <strong>All good!</strong>
          </article>
        </section>
      </main>
      <nav className="pcc10090-nav">
        <Link to="/lessons/school/class-10/class-10-circle-proofs-equal-chords-and-equal-angles">
          <ArrowLeft /> Previous
          <br />
          Equal Chords and Equal Angles
        </Link>
        <Link to="/lessons/school/class-10/class-10-circle-proofs-angle-subtended-by-an-arc">
          Next
          <br />
          Angle Subtended by an Arc <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}
