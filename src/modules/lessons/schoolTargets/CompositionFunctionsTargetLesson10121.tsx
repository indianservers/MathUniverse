import { Check, Info, Plus, RotateCcw, Trash2, X } from "lucide-react";
import { useState } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./CompositionFunctionsTargetLesson10121.css";

type Row = { input: number; output: number };
const initialF: Row[] = [
  { input: -2, output: -3 },
  { input: -1, output: -1 },
  { input: 0, output: 1 },
  { input: 1, output: 3 },
  { input: 2, output: 5 },
];
const initialG: Row[] = [
  { input: -3, output: -1 },
  { input: -1, output: 0 },
  { input: 1, output: 2 },
  { input: 3, output: 5 },
  { input: 5, output: 8 },
];
const lookup = (rows: Row[], input: number) =>
  rows.find((row) => row.input === input)?.output;
const unique = (values: number[]) =>
  Array.from(new Set(values)).sort((a, b) => a - b);
const fmt = (value: number | undefined) =>
  value === undefined ? "undefined" : String(value);

export default function CompositionFunctionsTargetLesson10121({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [fRows, setFRows] = useState(initialF),
    [gRows, setGRows] = useState(initialG),
    [x, setX] = useState(0),
    [actions, setActions] = useState(0);
  const fValue = lookup(fRows, x),
    gValue = fValue === undefined ? undefined : lookup(gRows, fValue);
  const rangeF = unique(fRows.map((r) => r.output)),
    domainG = unique(gRows.map((r) => r.input));
  const missing = rangeF.filter((value) => !domainG.includes(value)),
    compatible = missing.length === 0;
  const update = (
    kind: "f" | "g",
    index: number,
    field: keyof Row,
    value: number,
  ) => {
    const setter = kind === "f" ? setFRows : setGRows;
    setter((rows) =>
      rows.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
    setActions((n) => n + 1);
  };
  const remove = (kind: "f" | "g", index: number) => {
    (kind === "f" ? setFRows : setGRows)((rows) =>
      rows.filter((_, i) => i !== index),
    );
    setActions((n) => n + 1);
  };
  const add = (kind: "f" | "g") => {
    if (kind === "f")
      setFRows((rows) => [
        ...rows,
        {
          input: Math.max(...rows.map((r) => r.input)) + 1,
          output: Math.max(...rows.map((r) => r.output)) + 2,
        },
      ]);
    else
      setGRows((rows) => [
        ...rows,
        {
          input: Math.max(...rows.map((r) => r.input)) + 2,
          output: Math.max(...rows.map((r) => r.output)) + 3,
        },
      ]);
    setActions((n) => n + 1);
  };
  const reverse = (value: number) => {
    const gv = lookup(gRows, value);
    return gv === undefined ? undefined : lookup(fRows, gv);
  };
  const reset = () => {
    setFRows(initialF);
    setGRows(initialG);
    setX(0);
    setActions((n) => n + 1);
  };
  const editor = (kind: "f" | "g", rows: Row[]) => (
    <section>
      <h2>
        {kind}: {kind === "f" ? "A → B" : "B → C"}
      </h2>
      <p>Mapping rules</p>
      {rows.map((row, index) => (
        <div key={`${kind}${index}`}>
          <input
            aria-label={`${kind} input ${index + 1}`}
            type="number"
            value={row.input}
            onChange={(e) =>
              update(kind, index, "input", Number(e.target.value))
            }
          />
          <span>→</span>
          <input
            aria-label={`${kind} output ${index + 1}`}
            type="number"
            value={row.output}
            onChange={(e) =>
              update(kind, index, "output", Number(e.target.value))
            }
          />
          <button
            aria-label={`Remove ${kind} mapping ${index + 1}`}
            onClick={() => remove(kind, index)}
          >
            <Trash2 />
          </button>
        </div>
      ))}
      <button onClick={() => add(kind)}>
        <Plus /> Add mapping
      </button>
    </section>
  );
  return (
    <section
      className="cmp10121-page"
      data-testid="school-mockup-0795"
      data-object-model="dedicated-editable-function-composition-pipeline-engine"
      data-x={x}
      data-f-value={fmt(fValue)}
      data-composed={fmt(gValue)}
      data-compatible={String(compatible)}
      data-missing={missing.join(",")}
      data-f-rows={fRows.length}
      data-g-rows={gRows.length}
      data-actions={actions}
    >
      <header>
        <small>CLASS 11 · RELATIONS AND FUNCTIONS</small>
        <h1>Composition of Functions</h1>
        <p>
          Model how outputs of one function become inputs to another. Trace
          values through a pipeline X → Y → Z.
        </p>
        <nav>
          <span>18 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>INTERACTIVE</span>
        </nav>
        <button>← &nbsp; School lessons</button>
        <button className="reset" onClick={reset}>
          <RotateCcw /> Reset
        </button>
      </header>
      <main>
        <section className="cmp10121-pipeline">
          <article>
            <h2>
              X (Domain of f) <Info />
            </h2>
            <h3>A</h3>
            {unique(fRows.map((r) => r.input)).map((value) => (
              <button
                key={value}
                onClick={() => setX(value)}
                className={x === value ? "selected" : ""}
              >
                {value}
              </button>
            ))}
            <label>
              x (start value)
              <input
                aria-label="Start value"
                type="number"
                value={x}
                onChange={(e) => setX(Number(e.target.value))}
              />
            </label>
            <strong>x = {x}</strong>
          </article>
          <div className="fn">
            <b>f</b>
            <span>f: A → B</span>⟶
          </div>
          <article>
            <h2>
              Y (Codomain of f = Domain of g) <Info />
            </h2>
            <h3>B</h3>
            {unique([...rangeF, ...domainG]).map((value) => (
              <button
                key={value}
                className={fValue === value ? "selected" : ""}
              >
                {value}
              </button>
            ))}
            <strong>
              f({x}) = {fmt(fValue)}
            </strong>
          </article>
          <div className="fn purple">
            <b>g</b>
            <span>g: B → C</span>⟶
          </div>
          <article>
            <h2>
              Z (Codomain of g) <Info />
            </h2>
            <h3>C</h3>
            {unique(gRows.map((r) => r.output)).map((value) => (
              <button
                key={value}
                className={gValue === value ? "selected" : ""}
              >
                {value}
              </button>
            ))}
            <strong>
              g(f({x})) = {fmt(gValue)}
            </strong>
          </article>
        </section>
        <section className="cmp10121-lower">
          <article className="edit">
            <h2>
              EDIT FUNCTIONS <Info />
            </h2>
            <div>
              {editor("f", fRows)}
              <button
                className="swap"
                onClick={() => {
                  const f = [...fRows],
                    g = [...gRows];
                  setFRows(g);
                  setGRows(f);
                  setActions((n) => n + 1);
                }}
              >
                ⇄
              </button>
              {editor("g", gRows)}
            </div>
          </article>
          <aside>
            <article>
              <h2>COMPOSITION FORMULA</h2>
              <strong>g ∘ f : A → C</strong>
              <em>(g ∘ f)(x) = g(f(x))</em>
              <p>Read as: “g circle f of x”</p>
            </article>
            <article>
              <h2>
                DOMAIN COMPATIBILITY GATE <Info />
              </h2>
              <strong>Range(f) ⊆ Domain(g)?</strong>
              <p>
                Range(f) = {`{${rangeF.join(", ")}}`}{" "}
                {compatible ? <Check /> : <X />}
              </p>
              <p>
                Domain(g) = {`{${domainG.join(", ")}}`}{" "}
                {compatible ? <Check /> : <X />}
              </p>
              <footer className={compatible ? "ok" : "bad"}>
                {compatible
                  ? "✓ Compatible: composition is defined for all x ∈ A."
                  : `× Missing intermediate values: ${missing.join(", ")}`}
              </footer>
            </article>
            <article className="order">
              <h2>
                ORDER MATTERS <em>(Generally)</em>
              </h2>
              <div>
                <section>
                  <b>g ∘ f(x)</b>
                  {[0, 1, 2].map((value) => (
                    <p key={value}>
                      (g ∘ f)({value}) ={" "}
                      {fmt(
                        (() => {
                          const fv = lookup(fRows, value);
                          return fv === undefined
                            ? undefined
                            : lookup(gRows, fv);
                        })(),
                      )}
                    </p>
                  ))}
                </section>
                <section>
                  <b>f ∘ g(x)</b>
                  {[0, 1, 2].map((value) => (
                    <p key={value}>
                      (f ∘ g)({value}) = {fmt(reverse(value))}
                    </p>
                  ))}
                </section>
              </div>
              <strong>
                g ∘ f ≠ f ∘ g (in general)
                <br />
                Order matters.
              </strong>
            </article>
          </aside>
        </section>
        <footer>
          <b>RESULT</b>
          <span>
            x → <i>f</i> → f(x) → <i>g</i> → g(f(x)) = (g ∘ f)(x)
          </span>
          <strong>
            {x} → {fmt(fValue)} → {fmt(gValue)}
          </strong>
        </footer>
      </main>
    </section>
  );
}
