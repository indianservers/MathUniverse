import {
  ArrowLeft,
  ArrowRight,
  Check,
  Lightbulb,
  Lock,
  Pencil,
  RotateCcw,
  X,
} from "lucide-react";
import { Fragment, useState } from "react";
import type { DragEvent } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./InvertibleFunctionsTargetLesson10122.css";

const letters = ["a", "b", "c", "d"];
export default function InvertibleFunctionsTargetLesson10122({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [size, setSize] = useState(3),
    [mapping, setMapping] = useState<(number | null)[]>([0, 1, 2]),
    [source, setSource] = useState<number | null>(null),
    [flipped, setFlipped] = useState(false),
    [auto, setAuto] = useState(true),
    [actions, setActions] = useState(0);
  const domain = Array.from({ length: size }, (_, i) => i + 1),
    codomain = letters.slice(0, size);
  const counts = codomain.map(
    (_, target) => mapping.filter((value) => value === target).length,
  );
  const valid =
      mapping.length === size && mapping.every((value) => value !== null),
    injective = valid && counts.every((count) => count <= 1),
    onto = valid && counts.every((count) => count >= 1),
    invertible = injective && onto,
    showInverse = invertible && (auto || flipped);
  const assign = (from: number, to: number) => {
    setMapping((current) =>
      current.map((value, index) => (index === from ? to : value)),
    );
    setSource(null);
    setFlipped(false);
    setActions((n) => n + 1);
  };
  const drop = (event: DragEvent<HTMLButtonElement>, target: number) => {
    event.preventDefault();
    const from = Number(event.dataTransfer.getData("text/plain"));
    if (Number.isInteger(from)) assign(from, target);
  };
  const editSets = () => {
    const next = size === 3 ? 4 : 3;
    setSize(next);
    setMapping(Array.from({ length: next }, (_, i) => i));
    setSource(null);
    setFlipped(false);
    setActions((n) => n + 1);
  };
  const reset = () => {
    setSize(3);
    setMapping([0, 1, 2]);
    setSource(null);
    setFlipped(false);
    setAuto(true);
    setActions((n) => n + 1);
  };
  return (
    <section
      className="inv10122-page"
      data-testid="school-mockup-0796"
      data-object-model="dedicated-bijection-inverse-verification-engine"
      data-size={size}
      data-mapping={mapping
        .map(
          (target, index) =>
            `${domain[index]}:${target === null ? "none" : codomain[target]}`,
        )
        .join(";")}
      data-injective={String(injective)}
      data-onto={String(onto)}
      data-invertible={String(invertible)}
      data-inverse-visible={String(showInverse)}
      data-auto={String(auto)}
      data-actions={actions}
    >
      <header>
        <small>CLASS 11 · RELATIONS AND FUNCTIONS</small>
        <h1>Invertible Functions</h1>
        <p>
          Build a function from finite sets, test for one-one and onto, flip
          arrows to get the inverse, and verify the inverse property.
        </p>
        <nav>
          <span>◷ 18 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>graph</span>
        </nav>
        <button onClick={reset}>
          <RotateCcw /> Reset lab
        </button>
      </header>
      <main>
        <section className="inv10122-left">
          <div className="build">
            <h2>
              1. BUILD A FUNCTION &nbsp; <em>f : A → B</em>
            </h2>
            <button onClick={editSets}>
              <Pencil /> Edit sets
            </button>
            <div>
              <article>
                <h3>A (Domain)</h3>
                {domain.map((value, index) => (
                  <button
                    key={value}
                    draggable
                    onDragStart={(e) =>
                      e.dataTransfer.setData("text/plain", String(index))
                    }
                    onClick={() =>
                      setSource((current) => (current === index ? null : index))
                    }
                    className={source === index ? "selected" : ""}
                  >
                    {value}
                    <i />
                  </button>
                ))}
              </article>
              <svg viewBox="0 0 210 250" aria-label="Forward function arrows">
                <defs>
                  <marker
                    id="inv-arrow"
                    markerWidth="8"
                    markerHeight="8"
                    refX="7"
                    refY="4"
                    orient="auto"
                  >
                    <path d="M0 0L8 4L0 8Z" />
                  </marker>
                </defs>
                {mapping.map((target, index) =>
                  target === null ? null : (
                    <line
                      key={index}
                      x1="5"
                      y1={38 + index * 55}
                      x2="202"
                      y2={38 + target * 55}
                      markerEnd="url(#inv-arrow)"
                    />
                  ),
                )}
              </svg>
              <article className="codomain">
                <h3>B (Codomain)</h3>
                {codomain.map((value, index) => (
                  <button
                    key={value}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => drop(e, index)}
                    onClick={() => source !== null && assign(source, index)}
                    className={
                      counts[index] > 1
                        ? "collision"
                        : counts[index] === 0
                          ? "uncovered"
                          : ""
                    }
                  >
                    <i />
                    {value}
                  </button>
                ))}
              </article>
            </div>
          </div>
          <div className="graph">
            <h2>
              2. MINI GRAPH &nbsp; <em>(x, f(x))</em>
            </h2>
            <svg viewBox="0 0 440 260" aria-label="Finite function mini graph">
              <g>
                {domain.map((value) => (
                  <Fragment key={value}>
                    <line
                      x1={70 + value * 75}
                      y1="30"
                      x2={70 + value * 75}
                      y2="220"
                    />
                    <line
                      x1="65"
                      y1={230 - value * 55}
                      x2="390"
                      y2={230 - value * 55}
                    />
                  </Fragment>
                ))}
              </g>
              <line className="axis" x1="65" y1="220" x2="410" y2="220" />
              <line className="axis" x1="70" y1="230" x2="70" y2="20" />
              {mapping.map((target, index) =>
                target === null ? null : (
                  <circle
                    key={index}
                    cx={70 + (index + 1) * 75}
                    cy={230 - (target + 1) * 55}
                    r="6"
                  />
                ),
              )}
            </svg>
          </div>
        </section>
        <section className="inv10122-tests">
          <h2>3. TESTS FOR INVERTIBILITY</h2>
          <article>
            <header>
              ONE-ONE (Injective){" "}
              <strong className={injective ? "pass" : "fail"}>
                {injective ? "PASS ✓" : "FAIL ×"}
              </strong>
            </header>
            <p>Every element in B has at most one preimage.</p>
            <div>
              {codomain.map((value, index) => (
                <span key={value}>
                  {value}
                  <i className={counts[index] > 1 ? "bad" : ""} />
                </span>
              ))}
            </div>
          </article>
          <article>
            <header>
              ONTO (Surjective){" "}
              <strong className={onto ? "pass" : "fail"}>
                {onto ? "PASS ✓" : "FAIL ×"}
              </strong>
            </header>
            <p>Every element in B has at least one preimage.</p>
            <div>
              {codomain.map((value, index) => (
                <span key={value}>
                  {value}
                  <i className={counts[index] === 0 ? "bad" : ""} />
                </span>
              ))}
            </div>
          </article>
          <button
            disabled={!invertible}
            onClick={() => {
              setFlipped(true);
              setActions((n) => n + 1);
            }}
          >
            {invertible ? (
              <>
                <Check /> Flip Arrows &nbsp; f⁻¹
              </>
            ) : (
              <>
                <Lock /> Both tests must PASS to unlock
              </>
            )}
          </button>
          <footer>
            <span>— Mapping</span>
            <span>— Collision (not one-one)</span>
            <span>— Uncovered (not onto)</span>
          </footer>
          <aside>
            {invertible
              ? "Both tests pass. The inverse is a function."
              : "Fix the mapping to make both tests pass."}
          </aside>
        </section>
        <section className="inv10122-right">
          <article className="inverse">
            <h2>4. INVERSE FUNCTION &nbsp; f⁻¹ : B → A</h2>
            <div className="auto-control">
              <span>Auto</span>
              <button
                type="button"
                role="switch"
                aria-label="Automatic inverse"
                aria-checked={auto}
                onMouseDown={(event) => {
                  event.preventDefault();
                  setAuto((current) => !current);
                  if (auto) setFlipped(false);
                }}
              >
                <i />
              </button>
            </div>
            {showInverse ? (
              <>
                <div>
                  <section>
                    {codomain.map((value) => (
                      <b key={value}>{value}</b>
                    ))}
                  </section>
                  <svg viewBox="0 0 210 190">
                    <defs>
                      <marker
                        id="inv-back"
                        markerWidth="8"
                        markerHeight="8"
                        refX="7"
                        refY="4"
                        orient="auto"
                      >
                        <path d="M0 0L8 4L0 8Z" />
                      </marker>
                    </defs>
                    {mapping.map((target, index) =>
                      target === null ? null : (
                        <line
                          key={index}
                          x1="205"
                          y1={30 + index * 50}
                          x2="5"
                          y2={30 + target * 50}
                          markerEnd="url(#inv-back)"
                        />
                      ),
                    )}
                  </svg>
                  <section>
                    {domain.map((value) => (
                      <b key={value}>{value}</b>
                    ))}
                  </section>
                </div>
                <footer>
                  {codomain.map((value, index) => (
                    <span key={value}>
                      f⁻¹({value}) = {mapping.indexOf(index) + 1}
                    </span>
                  ))}
                </footer>
              </>
            ) : (
              <p className="locked">
                <Lock /> Inverse hidden until both tests pass and arrows are
                flipped.
              </p>
            )}
          </article>
          <article className="verify">
            <h2>5. VERIFY: &nbsp; x → f(x) → f⁻¹(f(x)) = x</h2>
            {domain.map((value, index) => {
              const target = mapping[index],
                back = target === null ? -1 : mapping.indexOf(target),
                ok = back === index;
              return (
                <p key={value}>
                  <b>{value}</b> →{" "}
                  <i>{target === null ? "?" : codomain[target]}</i> →{" "}
                  <em>{back < 0 ? "?" : back + 1}</em>{" "}
                  <span>{ok ? <Check /> : <X />}</span>
                </p>
              );
            })}
          </article>
          <article className="table">
            <h2>6. INVERSE-PAIR TABLE</h2>
            <table>
              <thead>
                <tr>
                  <th>x ∈ A</th>
                  <th>f(x) ∈ B</th>
                  <th>f⁻¹(f(x))</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {domain.map((value, index) => {
                  const target = mapping[index],
                    back = target === null ? -1 : mapping.indexOf(target);
                  return (
                    <tr key={value}>
                      <td>{value}</td>
                      <td>{target === null ? "?" : codomain[target]}</td>
                      <td>{back < 0 ? "?" : back + 1}</td>
                      <td>{back === index ? "✓" : "×"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <footer className={invertible ? "good" : "bad"}>
              {invertible
                ? "✓ All good! f is invertible and f⁻¹ is its inverse."
                : "× The current mapping is not invertible."}
            </footer>
          </article>
        </section>
      </main>
      <aside className="inv10122-tip">
        <Lightbulb /> Best classroom move: if either test fails, ask learners to
        adjust the mapping and try again. Both must PASS to get an inverse.
      </aside>
      <nav className="inv10122-pager" aria-label="Adjacent lessons">
        <button type="button">
          <ArrowLeft /> Composition of Functions
        </button>
        <button type="button">
          Binary Operations <ArrowRight />
        </button>
      </nav>
    </section>
  );
}
