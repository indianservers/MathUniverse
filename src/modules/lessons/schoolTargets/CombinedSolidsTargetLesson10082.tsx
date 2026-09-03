import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./CombinedSolidsTargetLesson10082.css";
type Kind = "cylinder" | "cone" | "hemisphere";
const labels: Record<Kind, string> = {
  cylinder: "Cylinder",
  cone: "Cone",
  hemisphere: "Hemisphere",
};
const rr = (n: number, p = 2) => Math.round(n * 10 ** p) / 10 ** p;
const challengeCorrect = [true, false, false, true, true];
export default function CombinedSolidsTargetLesson10082({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [parts, setParts] = useState<Kind[]>(["cylinder", "hemisphere"]),
    [radius, setRadius] = useState(3),
    [height, setHeight] = useState(8),
    [rotation, setRotation] = useState(0),
    [mode, setMode] = useState<"solid" | "wireframe" | "net">("solid"),
    [exploded, setExploded] = useState(false),
    [hidden, setHidden] = useState(false),
    [tab, setTab] = useState(0),
    [challenge, setChallenge] = useState(challengeCorrect),
    [graded, setGraded] = useState(true),
    [actions, setActions] = useState(0);
  const metrics = useMemo(() => {
    let volume = 0,
      surface = 0;
    for (const p of parts) {
      if (p === "cylinder") {
        volume += Math.PI * radius ** 2 * height;
        surface += 2 * Math.PI * radius * height + 2 * Math.PI * radius ** 2;
      } else if (p === "cone") {
        volume += (Math.PI * radius ** 2 * height) / 3;
        surface += Math.PI * radius * (Math.hypot(radius, height) + radius);
      } else {
        volume += (2 * Math.PI * radius ** 3) / 3;
        surface += 3 * Math.PI * radius ** 2;
      }
    }
    surface -= Math.max(0, parts.length - 1) * 2 * Math.PI * radius ** 2;
    return {
      volume: rr(volume),
      surface: rr(Math.max(0, surface)),
      vPi: rr(volume / Math.PI),
      sPi: rr(Math.max(0, surface) / Math.PI),
    };
  }, [parts, radius, height]);
  const correct = challenge.every((v, i) => v === challengeCorrect[i]);
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const reset = () =>
    act(() => {
      setParts(["cylinder", "hemisphere"]);
      setRadius(3);
      setHeight(8);
      setRotation(0);
      setMode("solid");
      setExploded(false);
      setHidden(false);
      setChallenge(challengeCorrect);
      setGraded(true);
    });
  return (
    <section
      className="cs10082-page"
      data-testid="school-mockup-0756"
      data-object-model="dedicated-component-solid-volume-external-surface-engine"
      data-parts={parts.join(",")}
      data-radius={radius}
      data-height={height}
      data-volume={metrics.volume}
      data-surface={metrics.surface}
      data-volume-pi={metrics.vPi}
      data-surface-pi={metrics.sPi}
      data-rotation={rotation}
      data-mode={mode}
      data-exploded={String(exploded)}
      data-hidden={String(hidden)}
      data-correct={String(graded && correct)}
      data-actions={actions}
    >
      <header className="cs10082-hero">
        <small>CLASS 9 · MENSURATION</small>
        <h1>Combined Solids</h1>
        <p>
          Find surface area and volume of solids formed by joining simpler
          solids.
        </p>
        <p>
          Rule: Add component volumes, but for external surface area exclude
          joined internal faces.
        </p>
        <div>
          <span>18 min</span>
          <span>INTERMEDIATE</span>
          <span>CONCEPT</span>
          <span>number</span>
        </div>
      </header>
      <nav className="cs10082-tabs">
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
        <section className="cs10082-builder">
          <aside>
            <h2>1 &nbsp; BUILD YOUR COMBINED SOLID</h2>
            <p>Add shapes, set dimensions, and explore.</p>
            <h3>ADD COMPONENT</h3>
            <div className="cs10082-add">
              {(["cylinder", "cone", "hemisphere"] as Kind[]).map((k) => (
                <button
                  key={k}
                  onClick={() => act(() => setParts((v) => [...v, k]))}
                >
                  <i className={k} />
                  {labels[k]}
                </button>
              ))}
            </div>
            <h3>
              COMPONENTS <small>(top to bottom)</small>
            </h3>
            <ol>
              {parts.map((p, i) => (
                <li key={`${p}${i}`}>
                  <span>{i + 1}</span>
                  <b>{labels[p]}</b>
                  <button
                    aria-label={`Remove ${labels[p]} ${i + 1}`}
                    onClick={() =>
                      act(() => setParts((v) => v.filter((_, j) => j !== i)))
                    }
                  >
                    <Trash2 />
                  </button>
                </li>
              ))}
            </ol>
            <h3>DIMENSIONS</h3>
            <label>
              Radius r
              <input
                aria-label="Radius"
                type="number"
                min="1"
                max="8"
                value={radius}
                onChange={(e) =>
                  act(() => setRadius(Math.max(1, +e.target.value)))
                }
              />
              cm
            </label>
            <label>
              Cylinder height h
              <input
                aria-label="Cylinder height"
                type="number"
                min="1"
                max="16"
                value={height}
                onChange={(e) =>
                  act(() => setHeight(Math.max(1, +e.target.value)))
                }
              />
              cm
            </label>
            <h3>ORIENTATION</h3>
            <label>
              Rotate solid
              <input
                aria-label="Solid rotation"
                type="range"
                min="-45"
                max="45"
                value={rotation}
                onChange={(e) => act(() => setRotation(+e.target.value))}
              />
              <b>{rotation}°</b>
            </label>
            <h3>VIEW OPTIONS</h3>
            <label>
              <input
                type="checkbox"
                checked={exploded}
                onChange={() => act(() => setExploded((v) => !v))}
              />{" "}
              Exploded view
            </label>
            <label>
              <input
                type="checkbox"
                checked={hidden}
                onChange={() => act(() => setHidden((v) => !v))}
              />{" "}
              Show hidden surfaces
            </label>
          </aside>
          <article
            className={`cs10082-model ${mode} ${exploded ? "exploded" : ""} ${hidden ? "hidden" : ""}`}
          >
            <div className="modes">
              {(["solid", "wireframe", "net"] as const).map((x) => (
                <button
                  key={x}
                  className={mode === x ? "active" : ""}
                  onClick={() => act(() => setMode(x))}
                >
                  {x[0].toUpperCase() + x.slice(1)}
                </button>
              ))}
            </div>
            <div
              className="solid-stack"
              style={{ transform: `rotate(${rotation / 8}deg)` }}
            >
              {parts
                .slice()
                .reverse()
                .map((p, i) => (
                  <div key={`${p}${i}`} className={`shape ${p}`}>
                    <span>{labels[p]}</span>
                  </div>
                ))}
            </div>
            <p className="measure">
              r = {radius} cm &nbsp; | &nbsp; h = {height} cm
            </p>
            <div className="turn">
              <button aria-label="Reset combined solid" onClick={reset}>
                <RotateCcw /> Reset
              </button>
              <button
                onClick={() =>
                  act(() => setRotation((v) => Math.max(-45, v - 15)))
                }
              >
                -45°
              </button>
              <button onClick={() => act(() => setRotation(0))}>0°</button>
              <button
                onClick={() =>
                  act(() => setRotation((v) => Math.min(45, v + 15)))
                }
              >
                +45°
              </button>
            </div>
          </article>
          <aside className="cs10082-results">
            <section>
              <h3>EXPLODED VIEW</h3>
              {parts.map((p, i) => (
                <div key={`${p}${i}`} className={`mini ${p}`}>
                  {labels[p]}
                </div>
              ))}
            </section>
            <section>
              <h2>LIVE RESULTS</h2>
              <div>
                <small>Volume (V)</small>
                <b>{metrics.vPi}π cm³</b>
                <span>≈ {metrics.volume} cm³</span>
              </div>
              <div>
                <small>External Surface Area (TSA)</small>
                <b>{metrics.sPi}π cm²</b>
                <span>≈ {metrics.surface} cm²</span>
              </div>
            </section>
          </aside>
        </section>
        <section className="cs10082-ledger">
          <h2>FORMULA LEDGER</h2>
          <div>
            <article>
              <h3>Volume (add all components)</h3>
              <p>V = Σ component volumes</p>
              <p>Cylinder: πr²h &nbsp; Cone: ⅓πr²h &nbsp; Hemisphere: ⅔πr³</p>
              <strong>
                V = {metrics.vPi}π cm³ ≈ {metrics.volume} cm³
              </strong>
            </article>
            <article>
              <h3>External Surface Area (exclude joined faces)</h3>
              <p>TSA = Σ full surfaces − 2πr² per join</p>
              <p>
                {parts.length} components create {Math.max(0, parts.length - 1)}{" "}
                joined face(s).
              </p>
              <strong>
                TSA = {metrics.sPi}π cm² ≈ {metrics.surface} cm²
              </strong>
            </article>
            <aside>
              <h3>What&apos;s excluded?</h3>
              <p>
                Shared circular faces between joined components are internal and
                not counted.
              </p>
              <i />
            </aside>
          </div>
        </section>
        <section className="cs10082-cards">
          <article>
            <h2>2 &nbsp; WHY IT WORKS</h2>
            <p>Add volumes because space combines.</p>
            <p>Exclude joined faces from TSA because they are hidden inside.</p>
            <div className="joined-demo">
              <i />
              <b>
                Joined face (internal)
                <br />
                not counted in TSA.
              </b>
            </div>
          </article>
          <article>
            <h2>3 &nbsp; WORKED EXAMPLE</h2>
            <p>Cylinder (r=3 cm, h=8 cm) + Hemisphere (r=3 cm)</p>
            <p>
              <b>Volume</b>
              <br />V = π(3²)(8) + ⅔π(3³) = 90π cm³
            </p>
            <p>
              <b>External Surface Area</b>
              <br />
              TSA = 2πrh + πr² + 2πr² = 75π cm²
            </p>
          </article>
          <article className="mistake">
            <h2>4 &nbsp; COMMON MISTAKE</h2>
            <p>Counting the shared circular face overstates TSA.</p>
            <p>Wrong: includes internal face.</p>
            <p>Correct: subtract both copies of every joined face.</p>
          </article>
        </section>
        <section className="cs10082-challenge">
          <h2>5 &nbsp; YOUR TURN: CAPSULE CHALLENGE</h2>
          <div>
            <h3>Build a capsule (cylinder + two hemispheres)</h3>
            <p>Select all surfaces exposed on the outside.</p>
            <div className="capsule">
              <i />
              <i />
              <i />
            </div>
          </div>
          <fieldset>
            <legend>Select exposed surfaces</legend>
            {[
              "Curved surface (cylinder)",
              "Top circular face (internal)",
              "Bottom circular face (internal)",
              "Top hemisphere (curved)",
              "Bottom hemisphere (curved)",
            ].map((x, i) => (
              <label key={x}>
                <input
                  type="checkbox"
                  checked={challenge[i]}
                  onChange={() =>
                    act(() => {
                      setChallenge((v) => v.map((n, j) => (j === i ? !n : n)));
                      setGraded(false);
                    })
                  }
                />
                {x}
              </label>
            ))}
            <button onClick={() => act(() => setGraded(true))}>
              Check Answer
            </button>
          </fieldset>
          <aside className={graded && correct ? "yes" : ""}>
            <h3>Challenge result</h3>
            {graded ? (
              correct ? (
                <p>
                  <CheckCircle2 /> Well done! You selected all and only the
                  exposed surfaces.
                </p>
              ) : (
                <p>Review the joined circular faces.</p>
              )
            ) : (
              <p>Ready to check.</p>
            )}
            <b>Correct TSA: 2πrh + 4πr²</b>
          </aside>
        </section>
      </main>
      <nav className="cs10082-nav">
        <Link to="/lessons/school/class-9/class-9-mensuration-coordinate-area-versus-heron-s-formula">
          <ArrowLeft /> Previous: Coordinate Area versus Heron&apos;s Formula
        </Link>
        <Link to="/lessons/school/class-9/class-9-mensuration-truncated-cone-frustum">
          Next: Truncated Cone (Frustum) <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}
