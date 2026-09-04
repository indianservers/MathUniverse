import { Check, Info, Lightbulb, RotateCcw } from "lucide-react";
import { useState } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./InequalityInductionTargetLesson10132.css";

type Reason = "natural" | "two" | "positive";

export default function InequalityInductionTargetLesson10132({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [selectedN, setSelectedN] = useState(8);
  const [viewTo, setViewTo] = useState(16);
  const [reason, setReason] = useState<Reason>("natural");
  const [checked, setChecked] = useState(true);
  const [actions, setActions] = useState(0);
  const values = Array.from({ length: viewTo }, (_, index) => {
    const n = index + 1;
    return { n, power: 2 ** n, linear: n + 1, holds: 2 ** n >= n + 1 };
  });
  const reasonCorrect = reason === "natural";
  const proofValid = checked && reasonCorrect;
  const selected = values[Math.min(selectedN, viewTo) - 1];
  const maxPower = 2 ** viewTo;
  const act = () => setActions((value) => value + 1);
  const reset = () => {
    setSelectedN(8);
    setViewTo(16);
    setReason("natural");
    setChecked(true);
    act();
  };

  return (
    <section
      className="ii10132-page"
      data-testid="school-mockup-0806"
      data-object-model="dedicated-exponential-inequality-induction-engine"
      data-selected-n={selected.n}
      data-power={selected.power}
      data-linear={selected.linear}
      data-view-to={viewTo}
      data-reason={reason}
      data-reason-correct={String(reasonCorrect)}
      data-checked={String(checked)}
      data-proof-valid={String(proofValid)}
      data-actions={actions}
    >
      <header>
        <small>CLASS 11 · MATHEMATICAL INDUCTION</small>
        <h1>Inequality by Induction</h1>
        <p>
          Prove by mathematical induction that 2ⁿ ≥ n + 1 for all natural
          numbers n ≥ 1.
        </p>
        <div>
          <span>INDUCTION</span>
          <span>INEQUALITY</span>
          <span>PURE MATH</span>
          <span>PROOF LAB</span>
        </div>
      </header>
      <main>
        <section className="ii10132-proof">
          <h2>▱ &nbsp; PROOF LAB</h2>
          <article>
            <b>1</b>
            <div>
              <h3>BASE CASE</h3>
              <p>Check n = 1.</p>
              <strong>
                2¹ = 2 &nbsp;&nbsp; and &nbsp;&nbsp; 1 + 1 = 2<br />2 ≥ 2 &nbsp;{" "}
                <Check /> True
              </strong>
            </div>
          </article>
          <article>
            <b>2</b>
            <div>
              <h3>INDUCTION HYPOTHESIS</h3>
              <p>Assume for some k ≥ 1,</p>
              <strong className="box">2ᵏ ≥ k + 1</strong>
            </div>
          </article>
          <article>
            <b>3</b>
            <div>
              <h3>INDUCTION STEP</h3>
              <p>Show it holds for k + 1.</p>
              <div className="ii10132-lines">
                <span>2ᵏ⁺¹ &nbsp; = &nbsp; 2 · 2ᵏ</span>
                <em>(Power rule)</em>
                <span>≥ &nbsp; 2(k + 1)</span>
                <em>(By IH: 2ᵏ ≥ k + 1)</em>
                <span>= &nbsp; 2k + 2</span>
                <em>(Distribute)</em>
                <span>≥ &nbsp; k + 2</span>
                <em>(Because k ≥ 0)</em>
              </div>
              <fieldset>
                <legend>
                  Justify the last inequality: Why is 2k + 2 ≥ k + 2 true?
                </legend>
                <p>This reduces to showing k ≥ 0.</p>
                {(
                  [
                    ["natural", "Because k is a natural number."],
                    ["two", "Because 2 > 1."],
                    ["positive", "Because k + 2 > 0."],
                  ] as Array<[Reason, string]>
                ).map(([id, label]) => (
                  <label key={id}>
                    <input
                      type="radio"
                      name="induction-reason"
                      checked={reason === id}
                      onChange={() => {
                        setReason(id);
                        setChecked(false);
                        act();
                      }}
                    />
                    {label}
                  </label>
                ))}
                <button
                  onClick={() => {
                    setChecked(true);
                    act();
                  }}
                >
                  Check answer
                </button>
                <strong
                  className={
                    checked ? (reasonCorrect ? "valid" : "invalid") : ""
                  }
                >
                  {checked
                    ? reasonCorrect
                      ? "Correct: k ≥ 1 implies k ≥ 0."
                      : "That fact does not justify the final comparison."
                    : "Choose a reason, then check it."}
                </strong>
              </fieldset>
            </div>
          </article>
          <footer className={proofValid ? "valid" : "invalid"}>
            {proofValid
              ? "Therefore, by mathematical induction, 2ⁿ ≥ n + 1 for all n ≥ 1."
              : "Repair the final justification to complete the proof."}
          </footer>
        </section>

        <section className="ii10132-evidence">
          <header>
            <h2>
              VISUAL EVIDENCE <span>(CHECKING EXAMPLES, NOT THE PROOF)</span>
            </h2>
            <label>
              n{" "}
              <input
                aria-label="Selected evidence n"
                type="range"
                min="1"
                max={viewTo}
                value={selected.n}
                onChange={(event) => {
                  setSelectedN(Number(event.target.value));
                  act();
                }}
              />
              <output>{selected.n}</output>
            </label>
            <label>
              View up to n ={" "}
              <select
                aria-label="Evidence table range"
                value={viewTo}
                onChange={(event) => {
                  const next = Number(event.target.value);
                  setViewTo(next);
                  setSelectedN((current) => Math.min(current, next));
                  act();
                }}
              >
                <option value="8">8</option>
                <option value="12">12</option>
                <option value="16">16</option>
              </select>
            </label>
          </header>
          <div className="ii10132-table">
            <table>
              <tbody>
                <tr>
                  <th>n</th>
                  {values.map((value) => (
                    <th
                      className={value.n === selected.n ? "selected" : ""}
                      key={value.n}
                    >
                      {value.n}
                    </th>
                  ))}
                </tr>
                <tr>
                  <th>2ⁿ</th>
                  {values.map((value) => (
                    <td key={value.n}>
                      <i
                        style={{
                          height: `${Math.max(5, (value.power / maxPower) * 45)}px`,
                        }}
                      />
                      <span>{value.power}</span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <th>n + 1</th>
                  {values.map((value) => (
                    <td key={value.n}>
                      <i
                        className="linear"
                        style={{
                          height: `${8 + (value.linear / (viewTo + 1)) * 37}px`,
                        }}
                      />
                      <span>{value.linear}</span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <th>2ⁿ ≥ n + 1</th>
                  {values.map((value) => (
                    <td key={value.n}>{value.holds ? <Check /> : "×"}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="ii10132-legend">
            <span>■ 2ⁿ (grows exponentially)</span>
            <span>■ n + 1 (grows linearly)</span>
            <span>
              <Check /> Inequality holds
            </span>
          </div>
          <aside>
            <Info />
            <p>
              These bars give evidence for specific values of n. The proof shows
              the inequality is true for all natural numbers n ≥ 1.
            </p>
          </aside>
          <section>
            <article>
              <h2>
                <Lightbulb /> KEY IDEA
              </h2>
              <p>Induction proves a statement for all natural numbers by:</p>
              <ol>
                <li>Check the first case.</li>
                <li>Assume it’s true for k.</li>
                <li>Prove it must then be true for k + 1.</li>
              </ol>
              <strong>
                Checking many cases builds confidence; the proof gives
                certainty.
              </strong>
            </article>
            <article>
              <h2>▣ &nbsp; TAKEAWAYS</h2>
              <p>
                <Check /> Base case: verified for n = 1.
              </p>
              <p>
                <Check /> Induction hypothesis: 2ᵏ ≥ k + 1.
              </p>
              <p>
                <Check /> Induction step: uses the hypothesis and k ≥ 0.
              </p>
              <p>
                <Check /> Conclusion: 2ⁿ ≥ n + 1 for all n ≥ 1.
              </p>
            </article>
          </section>
        </section>
      </main>
      <footer>
        <button onClick={reset}>
          <RotateCcw /> Reset lesson
        </button>
        <span>← Divisibility by Induction</span>
        <span>Strong Induction Introduction →</span>
      </footer>
    </section>
  );
}
