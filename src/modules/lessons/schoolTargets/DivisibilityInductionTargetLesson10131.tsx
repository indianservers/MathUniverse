import { Check, RotateCcw } from "lucide-react";
import { useState } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./DivisibilityInductionTargetLesson10131.css";

type ProofStep = 1 | 2 | 3 | 4;
type Hypothesis = "1" | "2" | "k" | "k+1";

const cards: Array<{
  id: Hypothesis;
  label: string;
  value: string;
  note: string;
}> = [
  { id: "1", label: "n = 1", value: "7^1 - 1", note: "= 6" },
  { id: "2", label: "n = 2", value: "7^2 - 1", note: "= 48" },
  { id: "k", label: "n = k", value: "7^k - 1", note: "(assume)" },
  { id: "k+1", label: "n = k + 1", value: "7^(k+1) - 1", note: "?" },
];

function SixGroup({ count = 6 }: { count?: number }) {
  return (
    <div className="di10131-six">
      {Array.from({ length: count }, (_, index) => (
        <i key={index}>1</i>
      ))}
    </div>
  );
}

export default function DivisibilityInductionTargetLesson10131({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [step, setStep] = useState<ProofStep>(1);
  const [baseHolds, setBaseHolds] = useState(true);
  const [hypothesis, setHypothesis] = useState<Hypothesis>("k");
  const [mode, setMode] = useState<"proof" | "language" | "remainder">("proof");
  const [sampleN, setSampleN] = useState(1);
  const [actions, setActions] = useState(0);
  const sampleValue = 7 ** sampleN - 1;
  const quotient = Math.floor(sampleValue / 6);
  const remainder = sampleValue % 6;
  const hypothesisValid = hypothesis === "k";
  const theoremProved = baseHolds && hypothesisValid;
  const act = () => setActions((value) => value + 1);
  const reset = () => {
    setStep(1);
    setBaseHolds(true);
    setHypothesis("k");
    setMode("proof");
    setSampleN(1);
    act();
  };

  return (
    <section
      className="di10131-page"
      data-testid="school-mockup-0805"
      data-object-model="dedicated-divisibility-induction-remainder-engine"
      data-step={step}
      data-base={String(baseHolds)}
      data-hypothesis={hypothesis}
      data-hypothesis-valid={String(hypothesisValid)}
      data-sample-n={sampleN}
      data-sample-value={sampleValue}
      data-quotient={quotient}
      data-remainder={remainder}
      data-theorem-proved={String(theoremProved)}
      data-actions={actions}
    >
      <header>
        <div>
          <small>CLASS 11 · MATHEMATICAL INDUCTION</small>
          <h1>Divisibility by Induction</h1>
          <p>
            Prove that for all natural numbers n ≥ 1,{" "}
            <strong>6 | (7ⁿ - 1)</strong>
          </p>
          <nav>
            <button
              className={mode === "proof" ? "active" : ""}
              onClick={() => {
                setMode("proof");
                act();
              }}
            >
              Induction Proof Lab
            </button>
            <button
              className={mode === "language" ? "active" : ""}
              onClick={() => {
                setMode("language");
                act();
              }}
            >
              Exact Theorem Language
            </button>
            <button
              className={mode === "remainder" ? "active" : ""}
              onClick={() => {
                setMode("remainder");
                act();
              }}
            >
              Remainder Visualizer
            </button>
          </nav>
        </div>
        <aside>
          <h2>PROOF GOAL</h2>
          <p>Show that 6 | (7ⁿ - 1) for all n ≥ 1.</p>
          <hr />
          <b>Notation:</b> 6 | (7ⁿ - 1) means “7ⁿ - 1 is divisible by 6”.
        </aside>
      </header>

      {mode === "language" && (
        <aside className="di10131-mode">
          <h2>Exact theorem language</h2>
          <p>
            For every natural number n ≥ 1, there exists an integer q such that
            7ⁿ - 1 = 6q.
          </p>
          <button
            onClick={() => {
              setMode("proof");
              act();
            }}
          >
            Return to proof
          </button>
        </aside>
      )}
      {mode === "remainder" && (
        <aside className="di10131-mode">
          <h2>Remainder visualizer</h2>
          <label>
            Choose n{" "}
            <input
              aria-label="Remainder sample n"
              type="number"
              min="1"
              max="7"
              value={sampleN}
              onChange={(event) => {
                setSampleN(
                  Math.max(1, Math.min(7, Number(event.target.value))),
                );
                act();
              }}
            />
          </label>
          <p>
            7^{sampleN} - 1 = {sampleValue} = 6 × {quotient} + {remainder}
          </p>
          <strong>
            {remainder === 0 ? "Divisible by 6" : `Remainder ${remainder}`}
          </strong>
        </aside>
      )}

      <main>
        <section className="di10131-top">
          <div className="di10131-proof">
            <h2>EXACT PROOF LAB</h2>
            <nav>
              {([1, 2, 3, 4] as ProofStep[]).map((item) => (
                <button
                  key={item}
                  className={step === item ? "active" : ""}
                  onClick={() => {
                    setStep(item);
                    act();
                  }}
                >
                  <b>{item}</b>
                  {item === 1
                    ? "Base Case"
                    : item === 2
                      ? "Inductive Step (Hypothesis)"
                      : item === 3
                        ? "Inductive Step (Show Next)"
                        : "Conclusion"}
                </button>
              ))}
            </nav>
            <h3>
              Step 1: Base Case &nbsp; <span>(n = 1)</span>
            </h3>
            <p>Compute the first term.</p>
            <strong className="formula">7¹ - 1 = 6</strong>
            <div className="di10131-answer">
              <span>Is &nbsp; 6 | (7¹ - 1)?</span>
              <button
                className={baseHolds ? "active" : ""}
                onClick={() => {
                  setBaseHolds(true);
                  act();
                }}
              >
                <Check /> Yes
              </button>
              <button
                className={!baseHolds ? "active no" : ""}
                onClick={() => {
                  setBaseHolds(false);
                  act();
                }}
              >
                No
              </button>
            </div>
            <footer className={baseHolds ? "valid" : "invalid"}>
              {baseHolds ? <Check /> : "×"}
              <span>
                {baseHolds
                  ? "Base case holds: 6 | (7¹ - 1)."
                  : "The selected answer contradicts 7¹ - 1 = 6."}
              </span>
            </footer>
          </div>
          <aside className="di10131-group">
            <h2>GROUP INTO SIXES</h2>
            <p>Group the value into blocks of 6 (remainder check).</p>
            <div>
              <SixGroup />
              <b>= 6</b>
            </div>
            <strong>
              6 = 6 × 1 + 0 &nbsp; → &nbsp; Remainder 0 <em>Divisible by 6</em>
            </strong>
          </aside>
        </section>

        <section className="di10131-middle">
          <article>
            <h2>STEP 2: INDUCTIVE HYPOTHESIS</h2>
            <p>Assume for some k ≥ 1, &nbsp; 6 | (7ᵏ - 1).</p>
            <p>Mark the term for which you assume divisibility.</p>
            <div className="di10131-cards">
              {cards.map((card) => (
                <button
                  key={card.id}
                  className={hypothesis === card.id ? "active" : ""}
                  onClick={() => {
                    setHypothesis(card.id);
                    act();
                  }}
                >
                  <small>{card.label}</small>
                  <strong>{card.value}</strong>
                  <span>{card.note}</span>
                  {hypothesis === card.id && <Check />}
                </button>
              ))}
            </div>
            <footer className={hypothesisValid ? "valid" : "invalid"}>
              Inductive hypothesis (IH): &nbsp;{" "}
              {hypothesisValid
                ? "6 | (7ᵏ - 1)"
                : `n = ${hypothesis} cannot serve as the arbitrary-k hypothesis.`}
            </footer>
          </article>
          <article>
            <h2>STEP 3: SHOW THE NEXT TERM IS DIVISIBLE</h2>
            <p>Starting from 7ᵏ⁺¹ - 1, rewrite using the key decomposition.</p>
            <strong className="decomposition">
              7ᵏ⁺¹ - 1 &nbsp; = &nbsp; 7(7ᵏ - 1) + 6
            </strong>
            <p>By IH, 7ᵏ - 1 = 6m for some integer m.</p>
            <p className="math">7ᵏ⁺¹ - 1 = 7(6m) + 6 = 42m + 6 = 6(7m + 1)</p>
            <hr />
            <p className="math">Hence, &nbsp; 6 | (7ᵏ⁺¹ - 1).</p>
          </article>
          <aside>
            <h2>GROUP INTO SIXES</h2>
            <p>The “+ 6” is one full group of six.</p>
            <SixGroup />
            <strong>= 6</strong>
            <b>Divisible by 6</b>
          </aside>
        </section>

        <section className="di10131-conclusion">
          <div>
            <h2>STEP 4: CONCLUSION</h2>
            <p>
              Base case is {baseHolds ? "true" : "not established"}. If 6 | (7ᵏ
              - 1), then 6 | (7ᵏ⁺¹ - 1). Therefore, by mathematical induction, 6
              | (7ⁿ - 1) for all n ≥ 1.
            </p>
          </div>
          <strong className={theoremProved ? "valid" : "invalid"}>
            {theoremProved && <Check />}
            <span>
              {theoremProved ? "Theorem Proved" : "Proof Incomplete"}
              <small>
                {theoremProved
                  ? "6 | (7ⁿ - 1) for all n ≥ 1."
                  : "Restore the base case and choose n = k."}
              </small>
            </span>
          </strong>
        </section>
        <footer>
          <button onClick={reset}>
            <RotateCcw /> Reset proof
          </button>
          <span>Previous: Sum Formula by Induction</span>
          <span>Next: Inequality by Induction →</span>
        </footer>
      </main>
    </section>
  );
}
