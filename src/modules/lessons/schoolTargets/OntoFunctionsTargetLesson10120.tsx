import { Check, Play, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import type { DragEvent } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./OntoFunctionsTargetLesson10120.css";

const domain = [-1, 0, 1, 2],
  codomain = [-2, -1, 0, 1],
  initial = [0, 1, 2, 3];
export default function OntoFunctionsTargetLesson10120({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [mapping, setMapping] = useState<(number | null)[]>(initial),
    [source, setSource] = useState<number | null>(null),
    [tested, setTested] = useState(false),
    [actions, setActions] = useState(0);
  const preimages = useMemo(
    () =>
      codomain.map((_, target) =>
        domain.filter((__, index) => mapping[index] === target),
      ),
    [mapping],
  );
  const mapped = mapping.filter((v) => v !== null).length,
    covered = preimages.filter((items) => items.length).length,
    coverage = covered * 25,
    valid = mapped === 4,
    onto = valid && covered === 4;
  const assign = (from: number, to: number) => {
    setMapping((current) =>
      current.map((value, index) => (index === from ? to : value)),
    );
    setSource(null);
    setTested(false);
    setActions((n) => n + 1);
  };
  const drop = (event: DragEvent<HTMLButtonElement>, target: number) => {
    event.preventDefault();
    const from = Number(event.dataTransfer.getData("text/plain"));
    if (Number.isInteger(from)) assign(from, target);
  };
  return (
    <section
      className="onto10120-page"
      data-testid="school-mockup-0794"
      data-object-model="dedicated-surjectivity-preimage-coverage-engine"
      data-mapping={mapping
        .map(
          (target, index) =>
            `${domain[index]}:${target === null ? "none" : codomain[target]}`,
        )
        .join(";")}
      data-mapped={mapped}
      data-covered={covered}
      data-coverage={coverage}
      data-valid={String(valid)}
      data-onto={String(onto)}
      data-tested={String(tested)}
      data-actions={actions}
    >
      <header>
        <small>CLASS 11 · RELATIONS AND FUNCTIONS</small>
        <h1>Onto Functions</h1>
        <p>
          Onto (surjective) functions: every element of the codomain has at
          least one preimage in the domain.
        </p>
        <nav>
          <span>18 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>surjectivity</span>
        </nav>
        <button>← &nbsp; School lessons</button>
      </header>
      <main>
        <aside>
          <h2>SURJECTIVITY CHALLENGE</h2>
          <p>
            Connect each domain element to exactly one element in the codomain
            using arrows.
          </p>
          <article>
            <h3>Example:</h3>
            <strong>f(x) = x − 1</strong>
            <p>
              Let A = {"{"}−1,0,1,2{"}"} and B = {"{"}−2,−1,0,1{"}"}.
            </p>
            <table>
              <thead>
                <tr>
                  <th>x</th>
                  {domain.map((x) => (
                    <th key={x}>{x}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>f(x)</th>
                  {domain.map((x) => (
                    <td key={x}>{x - 1}</td>
                  ))}
                </tr>
              </tbody>
            </table>
            <footer>
              <Check /> Range(f) = {"{"}−2,−1,0,1{"}"} = B<br />
              So, f is onto.
            </footer>
          </article>
          <article>
            <h3>ⓘ &nbsp; Key Points</h3>
            <p>
              ✓ &nbsp; Onto means every element of the codomain is hit by at
              least one arrow.
            </p>
            <p>
              ✓ &nbsp; Multiple domain elements may map to the same codomain
              element.
            </p>
          </article>
        </aside>
        <section className="onto10120-work">
          <div className="mapper">
            <article>
              <h2>Domain (A)</h2>
              {domain.map((x, index) => (
                <button
                  key={x}
                  draggable
                  onDragStart={(e) =>
                    e.dataTransfer.setData("text/plain", String(index))
                  }
                  onClick={() =>
                    setSource((current) => (current === index ? null : index))
                  }
                  className={source === index ? "selected" : ""}
                >
                  {x}
                  <i />
                </button>
              ))}
            </article>
            <svg viewBox="0 0 570 310" aria-label="Onto function arrows">
              <defs>
                <marker
                  id="onto-arrow"
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
                    d={`M5 ${45 + index * 75} C200 ${45 + index * 75},350 ${45 + target * 75},562 ${45 + target * 75}`}
                    markerEnd="url(#onto-arrow)"
                  />
                ),
              )}
              {domain.map((_, index) => (
                <line
                  key={`guide${index}`}
                  className="guide"
                  x1="5"
                  y1={45 + index * 75}
                  x2="562"
                  y2={45 + index * 75}
                />
              ))}
            </svg>
            <article className="codomain">
              <h2>Codomain (B)</h2>
              {codomain.map((y, index) => (
                <button
                  key={y}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => drop(e, index)}
                  onClick={() => source !== null && assign(source, index)}
                  className={preimages[index].length ? "covered" : ""}
                >
                  {y}
                </button>
              ))}
            </article>
            <article className="coverage">
              <h2>Codomain coverage</h2>
              {codomain.map((y, index) => (
                <div key={y}>
                  <b>{y}</b>
                  <p>
                    Preimages: <strong>{preimages[index].length}</strong>
                    <br />
                    from: {`{${preimages[index].join(", ")}}`}
                  </p>
                  <span>{preimages[index].length ? "✓" : "×"}</span>
                </div>
              ))}
              <footer>
                <b>Coverage meter</b>
                <progress max="100" value={coverage} />
                <strong>{coverage}%</strong>
                <p>
                  {onto
                    ? "All codomain elements are covered. This mapping is ONTO (surjective)."
                    : `${covered} of 4 codomain elements are covered.`}
                </p>
              </footer>
            </article>
          </div>
          <footer>
            <section>
              <h3>Check surjectivity</h3>
              <button
                onClick={() => {
                  setTested(true);
                  setActions((n) => n + 1);
                }}
              >
                <Play /> Test surjective
              </button>
            </section>
            <section className={onto ? "yes" : "no"}>
              {tested && <Check />}
              <p>
                Result:{" "}
                <b>{tested ? (onto ? "ONTO" : "NOT ONTO") : "Not checked"}</b>
                <br />
                Range(f) {onto ? "=" : "≠"} Codomain
              </p>
            </section>
            <section>
              <h3>Exact statement</h3>
              <strong>Range(f) = Codomain</strong>
              <p>Every element of the codomain has at least one preimage.</p>
            </section>
            <button
              className="reset"
              onClick={() => {
                setMapping(domain.map(() => null));
                setSource(null);
                setTested(false);
                setActions((n) => n + 1);
              }}
            >
              <RotateCcw />
              <span>
                <b>Reset arrows</b>
                <small>Start a new mapping</small>
              </span>
            </button>
            <button
              className="restore"
              onClick={() => {
                setMapping(initial);
                setSource(null);
                setTested(false);
                setActions((n) => n + 1);
              }}
            >
              Restore example
            </button>
          </footer>
        </section>
      </main>
    </section>
  );
}
