import { Check, Pencil, Plus, RotateCcw, TriangleAlert } from "lucide-react";
import { useMemo, useState } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./BinaryOperationsTargetLesson10123.css";

type Preset = "add" | "multiply" | "subtract" | "custom";

const mod = (value: number, size: number) => ((value % size) + size) % size;

export default function BinaryOperationsTargetLesson10123({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [size, setSize] = useState(4);
  const [preset, setPreset] = useState<Preset>("add");
  const [coefficients, setCoefficients] = useState([1, 1, 0]);
  const [wrap, setWrap] = useState(true);
  const [a, setA] = useState(2);
  const [b, setB] = useState(3);
  const [recomputes, setRecomputes] = useState(0);
  const values = useMemo(
    () => Array.from({ length: size }, (_, i) => i),
    [size],
  );
  const operate = (left: number, right: number) => {
    if (preset === "multiply") return mod(left * right, size);
    if (preset === "subtract") return mod(left - right, size);
    if (preset === "custom") {
      const raw =
        coefficients[0] * left + coefficients[1] * right + coefficients[2];
      return wrap ? mod(raw, size) : raw;
    }
    return mod(left + right, size);
  };
  const table = values.map((left) =>
    values.map((right) => operate(left, right)),
  );
  const identity = values.find((candidate) =>
    values.every(
      (value) =>
        operate(value, candidate) === value &&
        operate(candidate, value) === value,
    ),
  );
  const inverses = values.map((value) =>
    identity === undefined
      ? undefined
      : values.find(
          (candidate) =>
            operate(value, candidate) === identity &&
            operate(candidate, value) === identity,
        ),
  );
  const closure = table.flat().every((value) => values.includes(value));
  const hasInverses =
    identity !== undefined && inverses.every((value) => value !== undefined);
  const commutative = values.every((x) =>
    values.every((y) => operate(x, y) === operate(y, x)),
  );
  const associative = values.every((x) =>
    values.every((y) =>
      values.every(
        (z) => operate(operate(x, y), z) === operate(x, operate(y, z)),
      ),
    ),
  );
  const result = operate(a, b);
  const presetLabel =
    preset === "add"
      ? `Addition modulo ${size}`
      : preset === "multiply"
        ? `Multiplication modulo ${size}`
        : preset === "subtract"
          ? `Subtraction modulo ${size}`
          : `${coefficients[0]}a + ${coefficients[1]}b + ${coefficients[2]}${wrap ? ` (mod ${size})` : ""}`;
  const chooseSize = (next: number) => {
    setSize(next);
    setA(Math.min(2, next - 1));
    setB(next - 1);
  };
  const reset = () => {
    setSize(4);
    setPreset("add");
    setCoefficients([1, 1, 0]);
    setWrap(true);
    setA(2);
    setB(3);
    setRecomputes((value) => value + 1);
  };
  const checks = [
    ["Closure", closure, "For all a,b ∈ A, a * b ∈ A."],
    [
      "Identity",
      identity !== undefined,
      "There exists e ∈ A with a * e = e * a = a.",
    ],
    ["Inverses", hasInverses, "Every element has a two-sided inverse."],
    ["Commutativity", commutative, "For all a,b ∈ A, a * b = b * a."],
    ["Associativity", associative, `Tested all ${size ** 3} triples in A.`],
  ] as const;

  return (
    <section
      className="bin10123-page"
      data-testid="school-mockup-0797"
      data-object-model="dedicated-cayley-operation-property-engine"
      data-size={size}
      data-preset={preset}
      data-pair={`${a},${b}`}
      data-result={result}
      data-closure={String(closure)}
      data-identity={identity ?? "none"}
      data-inverses={String(hasInverses)}
      data-commutative={String(commutative)}
      data-associative={String(associative)}
      data-wrap={String(wrap)}
      data-recomputes={recomputes}
    >
      <header>
        <small>CLASS 11 · RELATIONS AND FUNCTIONS</small>
        <h1>Binary Operations</h1>
        <p>
          Explore operations on a finite set, inspect every ordered pair, and
          test the algebraic properties that make the rule well behaved.
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
        <header>
          <small>☷ INTERACTIVE LAB</small>
          <h2>
            Cayley Table Lab – {presetLabel} on ℤ<sub>{size}</sub>
          </h2>
          <p>Explore the binary operation * : A × A → A.</p>
        </header>
        <section className="bin10123-controls">
          <label>
            Set
            <select
              aria-label="Set size"
              value={size}
              onChange={(e) => chooseSize(Number(e.target.value))}
            >
              {[3, 4, 5, 6].map((value) => (
                <option key={value} value={value}>
                  A = ℤ{value} = {`{0,…,${value - 1}}`}
                </option>
              ))}
            </select>
          </label>
          <label>
            Operation preset
            <select
              aria-label="Operation preset"
              value={preset}
              onChange={(e) => setPreset(e.target.value as Preset)}
            >
              <option value="add">Addition modulo n</option>
              <option value="multiply">Multiplication modulo n</option>
              <option value="subtract">Subtraction modulo n</option>
              <option value="custom">Custom affine operation</option>
            </select>
          </label>
          <button onClick={() => setPreset("custom")}>
            <Plus /> Define custom operation
          </button>
          {preset === "custom" && (
            <div className="bin10123-custom">
              {coefficients.map((value, index) => (
                <label key={index}>
                  {["a coefficient", "b coefficient", "constant"][index]}
                  <input
                    aria-label={
                      ["a coefficient", "b coefficient", "constant"][index]
                    }
                    type="number"
                    value={value}
                    onChange={(e) =>
                      setCoefficients((current) =>
                        current.map((item, i) =>
                          i === index ? Number(e.target.value) : item,
                        ),
                      )
                    }
                  />
                </label>
              ))}
              <label className="bin10123-wrap">
                <input
                  aria-label="Reduce modulo n"
                  type="checkbox"
                  checked={wrap}
                  onChange={(event) => setWrap(event.target.checked)}
                />
                Reduce modulo n
              </label>
            </div>
          )}
        </section>
        <section className="bin10123-workspace">
          <article className="bin10123-table">
            <h3>
              Cayley table for * on ℤ<sub>{size}</sub>
            </h3>
            <table>
              <thead>
                <tr>
                  <th>*</th>
                  {values.map((value) => (
                    <th
                      className={b === value ? "column" : ""}
                      key={value}
                      onClick={() => setB(value)}
                    >
                      {value}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {values.map((left) => (
                  <tr key={left}>
                    <th
                      className={a === left ? "row" : ""}
                      onClick={() => setA(left)}
                    >
                      {left}
                    </th>
                    {values.map((right) => (
                      <td
                        className={a === left && b === right ? "result" : ""}
                        key={right}
                        onClick={() => {
                          setA(left);
                          setB(right);
                        }}
                      >
                        {table[left][right]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p>Click a row a and column b to highlight a * b.</p>
            <footer>
              <span>□ Selected row a</span>
              <span>□ Selected column b</span>
              <span>□ a * b</span>
            </footer>
          </article>
          <aside className="bin10123-inspector">
            <article>
              <h3>Pair inspector</h3>
              <p>
                <i>a</i> = {a}
              </p>
              <p>
                <i>b</i> = {b}
              </p>
              <strong>
                a * b = <em>{result}</em>
              </strong>
              <hr />
              <small>Operation</small>
              <p>a * b = {presetLabel}</p>
              <p>= {result}</p>
            </article>
            <article>
              <h3>Identity & Inverses</h3>
              <p className={identity === undefined ? "bad" : "good"}>
                Identity element (e): {identity ?? "none"}
              </p>
              {values.map((value) => (
                <span key={value}>
                  {value}⁻¹ = {inverses[value] ?? "—"}
                </span>
              ))}
              <button onClick={() => setRecomputes((value) => value + 1)}>
                <RotateCcw /> Recompute
              </button>
            </article>
          </aside>
          <aside className="bin10123-properties">
            <h3>Operation property checks</h3>
            {checks.map(([name, holds, detail]) => (
              <article key={name} className={holds ? "holds" : "fails"}>
                <Check />
                <div>
                  <strong>{name}</strong>
                  <p>{detail}</p>
                </div>
                <b>{holds ? "Holds" : "Fails"}</b>
              </article>
            ))}
            <footer>
              <TriangleAlert />
              <div>
                <strong>Binary operation validity</strong>
                <p>If any result leaves A, the operation is NOT binary on A.</p>
                <p>
                  {closure
                    ? "All results are in A. The operation is binary on A."
                    : "At least one result leaves A."}
                </p>
              </div>
            </footer>
          </aside>
        </section>
      </main>
      <aside className="bin10123-tip">
        <Pencil />{" "}
        <div>
          <strong>Tips</strong>
          <p>
            Try editing the preset or define your own operation. Property checks
            recompute from every table entry.
          </p>
        </div>
      </aside>
    </section>
  );
}
