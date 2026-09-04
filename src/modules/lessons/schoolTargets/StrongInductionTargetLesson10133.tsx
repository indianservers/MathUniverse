import { Boxes, Check, RotateCcw, Trophy } from "lucide-react";
import { useState } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./StrongInductionTargetLesson10133.css";

type BaseValue = 8 | 9 | 10;
const baseModels: Record<BaseValue, number[]> = {
  8: [3, 5],
  9: [3, 3, 3],
  10: [5, 5],
};

const represent = (value: number) => {
  for (let fives = Math.floor(value / 5); fives >= 0; fives -= 1) {
    const rest = value - fives * 5;
    if (rest % 3 === 0)
      return [...Array(fives).fill(5), ...Array(rest / 3).fill(3)];
  }
  return [];
};

function Tiles({ values }: { values: number[] }) {
  return (
    <div className="si10133-tiles">
      {values.map((value, index) => (
        <i className={`t${value}`} key={`${value}-${index}`}>
          {value}
        </i>
      ))}
    </div>
  );
}

export default function StrongInductionTargetLesson10133({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [verified, setVerified] = useState<Record<BaseValue, boolean>>({
    8: true,
    9: true,
    10: true,
  });
  const [mode, setMode] = useState<"strong" | "ordinary">("strong");
  const [k, setK] = useState(13);
  const [actions, setActions] = useState(0);
  const supportValue = k - 2;
  const supportTiles = represent(supportValue);
  const nextTiles = [...supportTiles, 3];
  const basesValid = verified[8] && verified[9] && verified[10];
  const supportAvailable =
    mode === "strong" && supportValue >= 8 && supportTiles.length > 0;
  const proofValid =
    basesValid &&
    supportAvailable &&
    nextTiles.reduce((sum, value) => sum + value, 0) === k + 1;
  const act = () => setActions((value) => value + 1);
  const reset = () => {
    setVerified({ 8: true, 9: true, 10: true });
    setMode("strong");
    setK(13);
    act();
  };

  return (
    <section
      className="si10133-page"
      data-testid="school-mockup-0807"
      data-object-model="dedicated-strong-induction-support-tile-engine"
      data-mode={mode}
      data-k={k}
      data-support-value={supportValue}
      data-support-total={supportTiles.reduce((sum, value) => sum + value, 0)}
      data-next-total={nextTiles.reduce((sum, value) => sum + value, 0)}
      data-bases-valid={String(basesValid)}
      data-support-available={String(supportAvailable)}
      data-proof-valid={String(proofValid)}
      data-actions={actions}
    >
      <header>
        <small>CLASS 11 · MATHEMATICAL INDUCTION</small>
        <h1>Strong Induction Introduction</h1>
        <p>
          Goal: Prove that every integer <strong>n ≥ 8</strong> can be written
          as a sum of 3-unit and 5-unit tiles.
        </p>
      </header>
      <main>
        <section className="si10133-lab">
          <header>
            <div>
              <h2>
                <Boxes /> SUPPORT-BLOCK PROOF LAB
              </h2>
              <p>
                We use strong induction, so we assume all cases up to k are true
                (multiple supports).
              </p>
            </div>
            <label>
              k ={" "}
              <input
                aria-label="Strong induction k"
                type="number"
                min="10"
                max="30"
                value={k}
                onChange={(event) => {
                  setK(Math.max(10, Math.min(30, Number(event.target.value))));
                  act();
                }}
              />
            </label>
            <button onClick={reset}>
              <RotateCcw /> Reset proof
            </button>
          </header>
          <hr />
          <h2>BASE CASES (VERIFY)</h2>
          <p>Check P(8), P(9), P(10) directly.</p>
          <div className="si10133-bases">
            {([8, 9, 10] as BaseValue[]).map((value) => (
              <button
                key={value}
                className={verified[value] ? "valid" : "invalid"}
                onClick={() => {
                  setVerified((current) => ({
                    ...current,
                    [value]: !current[value],
                  }));
                  act();
                }}
              >
                <strong>
                  {value} = {baseModels[value].join(" + ")}
                </strong>
                <Tiles values={baseModels[value]} />
                <span>
                  {verified[value] ? (
                    <>
                      <Check /> Verified
                    </>
                  ) : (
                    "Restore verification"
                  )}
                </span>
              </button>
            ))}
          </div>
          <hr />
          <h2>INDUCTION STEP (k + 1 ≥ 11)</h2>
          <p>Assume P(8), P(9), ..., P(k) are true. Prove P(k + 1).</p>
          <article className={supportAvailable ? "valid" : "invalid"}>
            <p>
              <b>STRONG HYPOTHESIS:</b> We may use P(k - 2) because k - 2 ≥ 8.
            </p>
            <div>
              <strong>
                P({supportValue}) is{" "}
                {supportAvailable ? "true" : "not available"}
              </strong>
              <b>⇒</b>
              <span>{supportValue} can be written using 3s and 5s</span>
              <Tiles values={supportTiles} />
            </div>
          </article>
          <article className={supportAvailable ? "valid" : "invalid"}>
            <p>
              <b>ADD ONE 3-TILE:</b> Adding one 3-tile to the representation of
              k - 2 gives a representation of k + 1.
            </p>
            <div>
              <strong>
                {k + 1} = {supportValue} + 3
              </strong>
              <b>⇒</b>
              <span>
                P({k + 1}) is {supportAvailable ? "true" : "not proved"}
              </span>
              <Tiles values={nextTiles} />
            </div>
          </article>
          <footer className={proofValid ? "valid" : "invalid"}>
            <Trophy />
            <span>
              {proofValid
                ? "Conclusion: By strong induction, every integer n ≥ 8 can be written as a sum of 3-unit and 5-unit tiles."
                : "The conclusion needs all base cases and the strong support P(k - 2)."}
            </span>
          </footer>
        </section>
        <aside className="si10133-side">
          <button
            className={mode === "strong" ? "active" : ""}
            onClick={() => {
              setMode("strong");
              act();
            }}
          >
            <h2>STRONG INDUCTION ASSUMPTION (MULTIPLE SUPPORTS)</h2>
            <p>Assume all cases up to k are true.</p>
            <strong>Assumed true:</strong>
            <div>
              P(8) &nbsp; P(9) &nbsp; P(10) &nbsp; ... &nbsp; P(k-2) &nbsp;
              P(k-1) &nbsp; P(k)
            </div>
          </button>
          <button
            className={mode === "ordinary" ? "active ordinary" : "ordinary"}
            onClick={() => {
              setMode("ordinary");
              act();
            }}
          >
            <h2>ORDINARY INDUCTION (SINGLE SUPPORT)</h2>
            <p>Assume only the single case P(k) is true.</p>
            <strong>Assumed true:</strong>
            <div>P(k)</div>
          </button>
          <article>
            <h2>DEFINITION (OUR STATEMENT)</h2>
            <p>
              P(n): Every integer n ≥ 8 can be written as a sum of 3-unit and
              5-unit tiles.
            </p>
          </article>
          <article>
            <h2>TILE LEGEND</h2>
            <Tiles values={[3, 5]} />
          </article>
        </aside>
      </main>
      <footer>
        <span>← Inequality by Induction</span>
        <span>Strong Induction Applications →</span>
      </footer>
    </section>
  );
}
