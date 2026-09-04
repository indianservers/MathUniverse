import { Check, Pencil, RotateCcw, ShieldCheck, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { DragEvent } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./OneOneFunctionsTargetLesson10117.css";

const domain = [-2, -1, 0, 1, 2];
const codomain = [-3, -1, 1, 3, 5];
const initial = [0, 1, 2, 3, 4];
const sx = (x: number) => 55 + (x + 3) * 43;
const sy = (y: number) => 150 - y * 18;

export default function OneOneFunctionsTargetLesson10117({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [mapping, setMapping] = useState(initial);
  const [source, setSource] = useState<number | null>(null);
  const [tested, setTested] = useState(false);
  const [editing, setEditing] = useState(false);
  const [slope, setSlope] = useState(2);
  const [intercept, setIntercept] = useState(1);
  const [actions, setActions] = useState(0);
  const counts = useMemo(
    () =>
      codomain.map(
        (_, target) => mapping.filter((value) => value === target).length,
      ),
    [mapping],
  );
  const maxPreimages = Math.max(...counts);
  const injective = maxPreimages <= 1;
  const assign = (from: number, to: number) => {
    setMapping((current) =>
      current.map((value, index) => (index === from ? to : value)),
    );
    setSource(null);
    setTested(false);
    setActions((n) => n + 1);
  };
  const chooseSource = (index: number) =>
    setSource((current) => (current === index ? null : index));
  const drop = (event: DragEvent<HTMLButtonElement>, target: number) => {
    event.preventDefault();
    const from = Number(event.dataTransfer.getData("text/plain"));
    if (Number.isInteger(from)) assign(from, target);
  };
  const applyFunction = () => {
    const next = domain.map((x) => {
      const y = slope * x + intercept;
      let best = 0;
      codomain.forEach((value, index) => {
        if (Math.abs(value - y) < Math.abs(codomain[best] - y)) best = index;
      });
      return best;
    });
    setMapping(next);
    setEditing(false);
    setTested(false);
    setActions((n) => n + 1);
  };
  return (
    <section
      className="inj10117-page"
      data-testid="school-mockup-0791"
      data-object-model="dedicated-injective-mapping-collision-horizontal-line-engine"
      data-mapping={mapping
        .map((target, index) => `${domain[index]}:${codomain[target]}`)
        .join(";")}
      data-max-preimages={maxPreimages}
      data-injective={String(injective)}
      data-tested={String(tested)}
      data-function={`${slope}x+${intercept}`}
      data-actions={actions}
    >
      <header>
        <small>CLASS 11 · RELATIONS AND FUNCTIONS</small>
        <h1>One-One Functions</h1>
        <p>
          One-One Functions are functions in which every output has at most one
          preimage.
          <br />
          Do not confuse one-one with onto.
        </p>
        <nav>
          <span>18 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>MAPPING LAB</span>
        </nav>
        <button>← &nbsp; School lessons</button>
      </header>
      <main>
        <section className="inj10117-mapping">
          <div className="title">
            <h2>☷ &nbsp; MAPPING LAB</h2>
            <button
              onClick={() => {
                setMapping(initial);
                setSource(null);
                setTested(false);
                setSlope(2);
                setIntercept(1);
                setActions((n) => n + 1);
              }}
            >
              <RotateCcw /> Reset
            </button>
          </div>
          <p>Build the mapping, inspect collisions, and test injectivity.</p>
          <div className="mapper">
            <article>
              <h3>DOMAIN (x)</h3>
              {domain.map((x, index) => (
                <button
                  key={x}
                  draggable
                  onDragStart={(e) =>
                    e.dataTransfer.setData("text/plain", String(index))
                  }
                  onClick={() => chooseSource(index)}
                  className={source === index ? "selected" : ""}
                >
                  {x}
                  <i />
                </button>
              ))}
            </article>
            <svg viewBox="0 0 245 340" aria-label="Mapping arrows">
              <defs>
                <marker
                  id="inj-arrow"
                  markerWidth="8"
                  markerHeight="8"
                  refX="7"
                  refY="4"
                  orient="auto"
                >
                  <path d="M0 0L8 4L0 8Z" />
                </marker>
              </defs>
              {mapping.map((target, index) => (
                <line
                  key={index}
                  x1="5"
                  y1={38 + index * 65}
                  x2="238"
                  y2={38 + target * 65}
                  markerEnd="url(#inj-arrow)"
                />
              ))}
            </svg>
            <article className="codomain">
              <h3>CODOMAIN (y)</h3>
              {codomain.map((y, index) => (
                <button
                  key={y}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => drop(e, index)}
                  onClick={() => source !== null && assign(source, index)}
                  className={counts[index] > 1 ? "collision" : ""}
                >
                  <i />
                  {y}
                </button>
              ))}
            </article>
          </div>
          <small>
            ⓘ &nbsp; Drag from a domain value to a codomain value to create a
            mapping.
          </small>
        </section>
        <section className="inj10117-analysis">
          <article>
            <h2>
              <ShieldCheck /> COLLISION DETECTOR
            </h2>
            <p>Any target with more than one arrow is a collision.</p>
            {codomain.map((y, index) => (
              <div key={y}>
                <b>{y}</b>
                <span className={counts[index] > 1 ? "bad" : ""}>
                  {counts[index]} preimage{counts[index] === 1 ? "" : "s"}
                </span>
                {counts[index] <= 1 ? <Check /> : <X />}
              </div>
            ))}
          </article>
          <article className="meter">
            <h2>▥ &nbsp; PREIMAGE-COUNT METER</h2>
            <p>Max preimages of any output (in current mapping)</p>
            <strong>{maxPreimages}</strong>
            <footer>
              Goal for one-one: ≤ 1 &nbsp;&nbsp;{" "}
              <span>{injective ? "✓ Met" : "× Not met"}</span>
            </footer>
          </article>
        </section>
        <section className="inj10117-right">
          <article className="function">
            <h2>
              FUNCTION <em>(example)</em>
            </h2>
            <strong>
              f(x) = {slope}x {intercept >= 0 ? "+" : "−"} {Math.abs(intercept)}
            </strong>
            <button onClick={() => setEditing((v) => !v)}>
              <Pencil /> Edit
            </button>
            {editing && (
              <div>
                <label>
                  Slope{" "}
                  <input
                    aria-label="Function slope"
                    type="number"
                    value={slope}
                    onChange={(e) => setSlope(Number(e.target.value))}
                  />
                </label>
                <label>
                  Intercept{" "}
                  <input
                    aria-label="Function intercept"
                    type="number"
                    value={intercept}
                    onChange={(e) => setIntercept(Number(e.target.value))}
                  />
                </label>
                <button onClick={applyFunction}>Apply mapping</button>
              </div>
            )}
          </article>
          <article className="test">
            <h2>TEST INJECTIVE</h2>
            <p>Test the function on sample domain values.</p>
            <output>Domain sample &nbsp; {`{${domain.join(", ")}}`}</output>
            <button
              onClick={() => {
                setTested(true);
                setActions((n) => n + 1);
              }}
            >
              Test injective
            </button>
          </article>
          <article className={`status ${injective ? "ok" : "bad"}`}>
            {injective ? <Check /> : <X />}
            <div>
              <h2>STATUS</h2>
              <strong>
                {injective
                  ? "Every output has at most one preimage."
                  : "Two or more inputs share an output."}
              </strong>
              <p>
                This mapping is{" "}
                {injective ? "one-one (injective)" : "not one-one"}.
              </p>
              {tested && (
                <small>
                  Test complete on all {domain.length} sample inputs.
                </small>
              )}
            </div>
          </article>
          <article className="mini">
            <h2>LINKED MINI GRAPH</h2>
            <p>
              Horizontal Line Test (no horizontal line hits the graph twice).
            </p>
            <div>
              <svg viewBox="0 0 330 220" aria-label="Function graph">
                <g className="grid">
                  {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                    <line
                      key={`v${i}`}
                      x1={55 + i * 43}
                      y1="25"
                      x2={55 + i * 43}
                      y2="190"
                    />
                  ))}
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <line
                      key={`h${i}`}
                      x1="35"
                      y1={30 + i * 20}
                      x2="315"
                      y2={30 + i * 20}
                    />
                  ))}
                </g>
                <line className="axis" x1="35" y1={sy(0)} x2="315" y2={sy(0)} />
                <line className="axis" x1={sx(0)} y1="20" x2={sx(0)} y2="195" />
                <polyline
                  points={domain
                    .map((x) => `${sx(x)},${sy(slope * x + intercept)}`)
                    .join(" ")}
                />
                {domain.map((x) => (
                  <circle
                    key={x}
                    cx={sx(x)}
                    cy={sy(slope * x + intercept)}
                    r="3"
                  />
                ))}
              </svg>
              <aside>
                {[-2, 1, 4].map((y) => (
                  <p key={y}>
                    y = {y} &nbsp;&nbsp;{" "}
                    {domain.filter((x) => slope * x + intercept === y).length}{" "}
                    hit &nbsp;{" "}
                    {domain.filter((x) => slope * x + intercept === y).length <=
                    1
                      ? "✓"
                      : "×"}
                  </p>
                ))}
              </aside>
            </div>
          </article>
        </section>
      </main>
      <footer>
        <h2>WHY THIS WORKS</h2>
        <p>
          A function is one-one if no two different inputs map to the same
          output.
          <br />
          Here, each output has at most one preimage (max preimages ={" "}
          {maxPreimages}), so the function is{" "}
          {injective ? "injective" : "not injective"}.
        </p>
        <p>
          This does not mean every output in the codomain is used.
          <br />
          Onto (surjective) is a different property.
        </p>
      </footer>
    </section>
  );
}
