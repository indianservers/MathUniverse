import { Check, Info, RotateCcw, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { DragEvent } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./ManyOneFunctionsTargetLesson10118.css";

const domain = [-2, -1, 0, 1, 2];
const codomain = [0, 1, 2, 3, 4];
type Formula = "square" | "absolute" | "shift";
const presets: Record<Formula, { label: string; map: number[] }> = {
  square: { label: "f(x) = x²", map: [4, 1, 0, 1, 4] },
  absolute: { label: "f(x) = |x|", map: [2, 1, 0, 1, 2] },
  shift: { label: "f(x) = x + 2", map: [0, 1, 2, 3, 4] },
};

export default function ManyOneFunctionsTargetLesson10118({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [mapping, setMapping] = useState<(number | null)[]>(presets.square.map);
  const [formula, setFormula] = useState<Formula>("square");
  const [source, setSource] = useState<number | null>(null);
  const [actions, setActions] = useState(0);
  const fibres = useMemo(
    () =>
      codomain.map((_, target) =>
        domain.filter((__, index) => mapping[index] === target),
      ),
    [mapping],
  );
  const mapped = mapping.filter((value) => value !== null).length;
  const valid = mapped === domain.length;
  const manyOne = valid && fibres.some((fibre) => fibre.length > 1);
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
  const apply = (value: Formula) => {
    setFormula(value);
    setMapping([...presets[value].map]);
    setSource(null);
    setActions((n) => n + 1);
  };
  return (
    <section
      className="mny10118-page"
      data-testid="school-mockup-0792"
      data-object-model="dedicated-many-one-fibre-bucket-mapping-engine"
      data-mapping={mapping
        .map(
          (target, index) =>
            `${domain[index]}:${target === null ? "none" : codomain[target]}`,
        )
        .join(";")}
      data-mapped={mapped}
      data-distinct={fibres.filter((f) => f.length).length}
      data-valid={String(valid)}
      data-many-one={String(manyOne)}
      data-formula={formula}
      data-actions={actions}
    >
      <header>
        <small>CLASS 11 · RELATIONS AND FUNCTIONS</small>
        <h1>Many-One Functions</h1>
        <p>
          Many-One Functions send at least two distinct inputs to the same
          output.
          <br />
          Model fibres and compare many-one with one-one mappings.
        </p>
        <nav>
          <span>18 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>graph</span>
        </nav>
        <button>← &nbsp; School lessons</button>
        <button className="reset" onClick={() => apply("square")}>
          <RotateCcw /> Reset lab
        </button>
      </header>
      <main>
        <section className="mny10118-lab">
          <div className="title">
            <h2>
              MAPPING LAB: MANY-ONE FUNCTIONS <Info />
            </h2>
            <label>
              Function:{" "}
              <select
                aria-label="Function preset"
                value={formula}
                onChange={(e) => apply(e.target.value as Formula)}
              >
                {Object.entries(presets).map(([id, item]) => (
                  <option key={id} value={id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p>
            Example: <em>{presets[formula].label}</em> on A = {"{"}-2, -1, 0, 1,
            2{"}"}
          </p>
          <aside>
            ✓ &nbsp; Drag each input to exactly one output.
            <br />
            <span>Distinct inputs may go to the same output.</span>
          </aside>
          <div className="mny10118-map">
            <article>
              <h3>Domain A (inputs)</h3>
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
            <svg viewBox="0 0 390 350" aria-label="Many-one mapping arrows">
              <defs>
                <marker
                  id="mny-arrow"
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
                    d={`M5 ${35 + index * 68} C150 ${35 + index * 68},230 ${35 + target * 68},382 ${35 + target * 68}`}
                    markerEnd="url(#mny-arrow)"
                  />
                ),
              )}
            </svg>
            <article className="outputs">
              <h3>Codomain B (outputs)</h3>
              {codomain.map((y, index) => (
                <button
                  key={y}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => drop(e, index)}
                  onClick={() => source !== null && assign(source, index)}
                  className={fibres[index].length > 1 ? "shared" : ""}
                >
                  <i />
                  {y}
                </button>
              ))}
            </article>
            <article className="fibres">
              <h3>Preimages f⁻¹(y)</h3>
              {codomain.map((y, index) => (
                <output
                  key={y}
                  className={fibres[index].length > 1 ? "shared" : ""}
                >{`{${fibres[index].join(", ")}}`}</output>
              ))}
            </article>
          </div>
          <div className="legend">
            ⟶ Mapping (exactly one output per input) &nbsp;&nbsp;&nbsp; ▧ Fibre
            bucket (all inputs that map here)
          </div>
          <footer>
            <section>
              <Check />
              <p>
                <b>Function check: {valid ? "VALID" : "INCOMPLETE"}</b>
                <br />
                Every input has exactly one arrow to an output.
              </p>
            </section>
            <p>
              Mappings
              <br />
              <b>{mapped} / 5</b>
              <br />
              All inputs mapped
            </p>
            <p>
              Distinct outputs
              <br />
              <b>{fibres.filter((f) => f.length).length}</b>
              <br />
              {`{${codomain.filter((_, i) => fibres[i].length).join(", ")}}`}
            </p>
            <button
              onClick={() => {
                setMapping(domain.map(() => null));
                setSource(null);
                setActions((n) => n + 1);
              }}
            >
              <Trash2 /> Clear all
            </button>
          </footer>
        </section>
        <aside className="mny10118-info">
          <article>
            <h2>What is a Many-One Function?</h2>
            <p>
              A function may send different inputs to the same output. Here, −2
              and 2 both map to 4. This is a <b>many-one</b> (not one-one)
              function.
            </p>
            <strong>
              ✓ &nbsp; Rule: Exactly one output per input.
              <br />
              <span>Many inputs → same output allowed.</span>
            </strong>
          </article>
          <article>
            <h2>Not One-One (Contrast)</h2>
            <p>One-one functions give each output at most one preimage.</p>
            <table>
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Many-One</th>
                  <th>One-One</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Each input → one output</td>
                  <td>✓</td>
                  <td>✓</td>
                </tr>
                <tr>
                  <td>Two inputs → same output</td>
                  <td>✓</td>
                  <td>×</td>
                </tr>
                <tr>
                  <td>All fibre sizes ≤ 1</td>
                  <td>×</td>
                  <td>✓</td>
                </tr>
              </tbody>
            </table>
            <p>
              Current model: <b>{manyOne ? "Many-one" : "Not many-one"}</b>
            </p>
            <button onClick={() => apply("shift")}>
              ⚗ &nbsp; Try one-one example
            </button>
          </article>
        </aside>
      </main>
    </section>
  );
}
