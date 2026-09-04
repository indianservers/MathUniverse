import { GripVertical, Info, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import type { DragEvent } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./IntoFunctionsTargetLesson10119.css";

const domain = ["a", "b", "c", "d"];
const codomain = [1, 2, 3, 4, 5];
const initial = [0, 2, 2, 3];
export default function IntoFunctionsTargetLesson10119({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [mapping, setMapping] = useState<(number | null)[]>(initial);
  const [source, setSource] = useState<number | null>(null);
  const [actions, setActions] = useState(0);
  const range = useMemo(
    () => codomain.filter((_, target) => mapping.includes(target)),
    [mapping],
  );
  const unused = codomain.filter((value) => !range.includes(value));
  const mapped = mapping.filter((value) => value !== null).length;
  const valid = mapped === domain.length;
  const into = valid && unused.length > 0;
  const coverage = (range.length / codomain.length) * 100;
  const assign = (from: number, to: number) => {
    setMapping((current) =>
      current.map((value, index) => (index === from ? to : value)),
    );
    setSource(null);
    setActions((n) => n + 1);
  };
  const drop = (event: DragEvent<HTMLButtonElement>, target: number) => {
    event.preventDefault();
    const from = Number(event.dataTransfer.getData("text/plain"));
    if (Number.isInteger(from)) assign(from, target);
  };
  return (
    <section
      className="into10119-page"
      data-testid="school-mockup-0793"
      data-object-model="dedicated-into-function-range-coverage-engine"
      data-mapping={mapping
        .map(
          (target, index) =>
            `${domain[index]}:${target === null ? "none" : codomain[target]}`,
        )
        .join(";")}
      data-range={range.join(",")}
      data-unused={unused.join(",")}
      data-mapped={mapped}
      data-coverage={coverage}
      data-valid={String(valid)}
      data-into={String(into)}
      data-actions={actions}
    >
      <header>
        <small>CLASS 11 · RELATIONS AND FUNCTIONS</small>
        <h1>Into Functions</h1>
        <p>
          Explore how the image (range) can occupy only part of the codomain.
          <br />
          An into function leaves at least one codomain element without a
          preimage.
        </p>
        <nav>
          <span>18 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>graph</span>
        </nav>
        <button>← &nbsp; School lessons</button>
      </header>
      <main>
        <section className="into10119-lab">
          <div className="title">
            <h2>☷ &nbsp; INTERACTIVE LAB</h2>
            <button
              onClick={() => {
                setMapping(initial);
                setSource(null);
                setActions((n) => n + 1);
              }}
            >
              <RotateCcw /> Reset mapping
            </button>
          </div>
          <h3>Domain–Codomain Mapper</h3>
          <p>
            Create a mapping from the domain to the codomain. The image (range)
            is the set of codomain elements that receive at least one arrow.
          </p>
          <div className="mapper">
            <article>
              <h2>DOMAIN (A)</h2>
              {domain.map((item, index) => (
                <button
                  key={item}
                  draggable
                  onDragStart={(e) =>
                    e.dataTransfer.setData("text/plain", String(index))
                  }
                  onClick={() =>
                    setSource((current) => (current === index ? null : index))
                  }
                  className={source === index ? "selected" : ""}
                >
                  <GripVertical />
                  {item}
                  <i />
                </button>
              ))}
            </article>
            <svg
              viewBox="0 0 420 330"
              aria-label="Into function mapping arrows"
            >
              <defs>
                <marker
                  id="into-arrow"
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
                  <path
                    key={index}
                    d={`M5 ${45 + index * 75} C155 ${45 + index * 75},250 ${35 + target * 60},412 ${35 + target * 60}`}
                    markerEnd="url(#into-arrow)"
                  />
                ),
              )}
            </svg>
            <article className="codomain">
              <h2>CODOMAIN (B)</h2>
              {codomain.map((item, index) => (
                <button
                  key={item}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => drop(e, index)}
                  onClick={() => source !== null && assign(source, index)}
                  className={mapping.includes(index) ? "used" : ""}
                >
                  <i />
                  {item}
                </button>
              ))}
            </article>
          </div>
          <aside>
            <Info /> Drag from a domain element to a codomain element to create
            an arrow.
          </aside>
          <footer>
            <section>
              <h2>IMAGE (RANGE)</h2>
              <p>Elements in codomain that receive at least one arrow.</p>
              <strong>{`{ ${range.join(", ")} }`}</strong>
            </section>
            <section>
              <h2>CODOMAIN</h2>
              <p>All possible output elements (target set).</p>
              <strong>{`{ ${codomain.join(", ")} }`}</strong>
            </section>
            <section>
              <h2>UNUSED (NO PREIMAGE)</h2>
              <p>Codomain elements with no arrow coming in.</p>
              <strong>{`{ ${unused.join(", ")} }`}</strong>
            </section>
          </footer>
        </section>
        <aside className="into10119-analysis">
          <article className="coverage">
            <header>
              Coverage meter{" "}
              <span>
                {range.length} of {codomain.length} used
              </span>
            </header>
            <progress max="100" value={coverage} />
            <p>{coverage}% codomain elements have a preimage.</p>
          </article>
          <div>
            <article>
              <h3>Mapping summary</h3>
              <p>
                |A| (domain size) <b>= 4</b>
              </p>
              <p>
                |B| (codomain size) <b>= 5</b>
              </p>
              <p>
                |Im(f)| (image size) <b>= {range.length}</b>
              </p>
              <p>
                Inputs mapped <b>= {mapped}/4</b>
              </p>
            </article>
            <article>
              <h3>Relation statement</h3>
              <strong>Range(f) {into ? "⊂" : "="} Codomain</strong>
            </article>
          </div>
          <article className={`status ${into ? "yes" : "no"}`}>
            <div>
              <h3>Into status</h3>
              <p>
                {valid
                  ? into
                    ? "At least one codomain element has no preimage."
                    : "Every codomain element has a preimage."
                  : "Every domain element needs an output."}
              </p>
            </div>
            <strong>
              {valid ? (into ? "INTO ✓ TRUE" : "ONTO ✕ FALSE") : "INCOMPLETE"}
            </strong>
          </article>
          <article className="example">
            <h3>Example mapping</h3>
            <div>
              <pre>
                {domain
                  .map(
                    (item, index) =>
                      `${item}  →  ${mapping[index] === null ? "?" : codomain[mapping[index]!]}`,
                  )
                  .join("\n")}
              </pre>
              <p>
                Image (Range)
                <br />
                <b>{`{ ${range.join(", ")} }`}</b>
                <br />
                <br />
                Codomain
                <br />
                <b>{`{ ${codomain.join(", ")} }`}</b>
              </p>
            </div>
            <button
              onClick={() => {
                setMapping([0, 1, 2, 3]);
                setSource(null);
                setActions((n) => n + 1);
              }}
            >
              Use four distinct outputs
            </button>
            <button
              onClick={() => {
                setMapping(domain.map(() => null));
                setSource(null);
                setActions((n) => n + 1);
              }}
            >
              Clear mapping
            </button>
          </article>
        </aside>
      </main>
    </section>
  );
}
