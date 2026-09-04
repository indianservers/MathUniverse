import {
  Check,
  FlaskConical,
  GripVertical,
  RotateCcw,
  Shuffle,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { DragEvent } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./SumFormulaInductionTargetLesson10130.css";

type StepId = "A" | "B" | "C" | "D" | "E";

const correctOrder: StepId[] = ["A", "B", "C", "D", "E"];
const stepText: Record<StepId, string> = {
  A: "1 + 2 + ... + (k + 1) = (1 + 2 + ... + k) + (k + 1)",
  B: "By the induction hypothesis, 1 + 2 + ... + k = k(k + 1) / 2",
  C: "= k(k + 1) / 2 + (k + 1)",
  D: "= (k + 1)(k + 2) / 2",
  E: "Therefore, 1 + 2 + ... + (k + 1) = (k + 1)(k + 2) / 2",
};

function TriangleDots({
  k,
  completed = false,
}: {
  k: number;
  completed?: boolean;
}) {
  const rows = completed ? k + 1 : k;
  return (
    <svg viewBox="0 0 310 145" aria-label={`${rows}-row triangular dot model`}>
      {Array.from({ length: rows }, (_, row) => {
        const count = row + 1;
        const start = 155 - ((count - 1) * 25) / 2;
        return Array.from({ length: count }, (__, column) => (
          <circle
            key={`${row}-${column}`}
            cx={start + column * 25}
            cy={18 + row * (110 / Math.max(rows - 1, 1))}
            r="6"
            className={completed && row === k ? "new" : "old"}
          />
        ));
      })}
    </svg>
  );
}

export default function SumFormulaInductionTargetLesson10130({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [k, setK] = useState(5);
  const [sourceOrder, setSourceOrder] = useState<StepId[]>(correctOrder);
  const [slots, setSlots] = useState<Array<StepId | null>>([
    null,
    null,
    null,
    null,
    null,
  ]);
  const [dragged, setDragged] = useState<StepId | null>(null);
  const [checked, setChecked] = useState(false);
  const [actions, setActions] = useState(0);
  const sumK = (k * (k + 1)) / 2;
  const sumNext = ((k + 1) * (k + 2)) / 2;
  const full = slots.every(Boolean);
  const correct =
    full && slots.every((step, index) => step === correctOrder[index]);
  const available = sourceOrder.filter((step) => !slots.includes(step));
  const equality = sumK + (k + 1) === sumNext;
  const act = () => setActions((count) => count + 1);

  const place = (step: StepId, index?: number) => {
    setSlots((current) => {
      const next = current.map((value) => (value === step ? null : value));
      const destination = index ?? next.findIndex((value) => value === null);
      if (destination < 0) return current;
      const displaced = next[destination];
      next[destination] = step;
      if (displaced) {
        const vacancy = next.findIndex((value) => value === null);
        if (vacancy >= 0) next[vacancy] = displaced;
      }
      return next;
    });
    setChecked(false);
    act();
  };

  const drop = (event: DragEvent, index: number) => {
    event.preventDefault();
    const step = (dragged ??
      event.dataTransfer.getData("text/plain")) as StepId;
    if (correctOrder.includes(step)) place(step, index);
    setDragged(null);
  };

  const reset = () => {
    setK(5);
    setSourceOrder(correctOrder);
    setSlots([null, null, null, null, null]);
    setDragged(null);
    setChecked(false);
    act();
  };

  const shuffled = useMemo<StepId[]>(() => ["C", "A", "E", "B", "D"], []);

  return (
    <section
      className="sf10130-page"
      data-testid="school-mockup-0804"
      data-object-model="dedicated-triangular-sum-induction-order-engine"
      data-k={k}
      data-sum-k={sumK}
      data-next-term={k + 1}
      data-sum-next={sumNext}
      data-filled={slots.filter(Boolean).length}
      data-order-correct={String(correct)}
      data-checked={String(checked)}
      data-proof-valid={String(checked && correct && equality)}
      data-actions={actions}
    >
      <header>
        <small>CLASS 11 · MATHEMATICAL INDUCTION</small>
        <h1>Sum Formula by Induction</h1>
        <p>
          Prove by mathematical induction that{" "}
          <strong>1 + 2 + ··· + n = n(n + 1) / 2</strong> for all positive
          integers n.
        </p>
        <div>
          <span>30 min</span>
          <span>RIGOROUS</span>
          <span>PROOF LAB</span>
          <span>learning</span>
        </div>
      </header>

      <main>
        <h2>
          <FlaskConical /> Proof lab
        </h2>
        <section className="sf10130-summary">
          <article>
            <small>BASE CASE &nbsp; n = 1</small>
            <p>
              <b>LHS:</b> 1 = 1 &nbsp;&nbsp; <b>RHS:</b> 1(1 + 1) / 2 = 1
            </p>
            <strong>
              <Check /> Base case holds.
            </strong>
          </article>
          <article>
            <small>INDUCTION HYPOTHESIS &nbsp; n = k</small>
            <p>
              Assume &nbsp; 1 + 2 + ··· + k = <b>k(k + 1) / 2</b>
            </p>
            <p>for some k ≥ 1.</p>
          </article>
          <article>
            <small>GOAL &nbsp; n = k + 1</small>
            <p>
              Prove &nbsp; 1 + 2 + ··· + (k + 1) = <b>(k + 1)(k + 2) / 2</b>
            </p>
          </article>
        </section>

        <section className="sf10130-visual">
          <article>
            <h3>Sum to k</h3>
            <TriangleDots k={k} />
            <strong>{sumK} dots = k(k + 1) / 2</strong>
          </article>
          <div className="sf10130-add">
            <b>Add next row (k + 1 dots)</b>
            <span>→</span>
            <div>
              {Array.from({ length: k + 1 }, (_, index) => (
                <i key={index} />
              ))}
            </div>
            <strong>{k + 1} new dots</strong>
          </div>
          <article>
            <h3>Sum to k + 1</h3>
            <TriangleDots k={k} completed />
            <strong>{sumNext} dots = (k + 1)(k + 2) / 2</strong>
          </article>
          <aside>
            <span>● Existing terms</span>
            <span>● New added terms</span>
            <label>
              k ={" "}
              <input
                aria-label="Triangular model k"
                type="number"
                min="3"
                max="8"
                value={k}
                onChange={(event) => {
                  setK(Math.max(3, Math.min(8, Number(event.target.value))));
                  setChecked(false);
                  act();
                }}
              />
            </label>
          </aside>
        </section>

        <section className="sf10130-algebra">
          <h3>ALGEBRA STRIP: FROM k TO k + 1</h3>
          <div>
            <span>1 + 2 + ··· + (k + 1)</span>
            <b>→</b>
            <span>(1 + 2 + ··· + k) + (k + 1)</span>
            <b>→</b>
            <span>k(k + 1) / 2 + (k + 1)</span>
            <b>→</b>
            <span>(k + 1)(k + 2) / 2</span>
            <strong>
              <Check /> Goal reached
            </strong>
          </div>
        </section>

        <section className="sf10130-builder">
          <div className="sf10130-steps">
            <h3>PROOF STEPS - DRAG TO ORDER</h3>
            {available.map((step) => (
              <button
                key={step}
                draggable
                onDragStart={(event) => {
                  setDragged(step);
                  event.dataTransfer.setData("text/plain", step);
                }}
                onClick={() => place(step)}
              >
                <GripVertical />
                <b>{step}</b>
                <span>{stepText[step]}</span>
              </button>
            ))}
            {!available.length && <p>All proof steps have been placed.</p>}
          </div>
          <div className="sf10130-slots">
            {slots.map((step, index) => (
              <button
                key={index}
                className={step ? "filled" : ""}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => drop(event, index)}
                onClick={() => {
                  if (step) {
                    setSlots((current) =>
                      current.map((value, slot) =>
                        slot === index ? null : value,
                      ),
                    );
                    setChecked(false);
                    act();
                  }
                }}
              >
                <b>{index + 1}</b>
                <span>
                  {step ? stepText[step] : "Drag or click a step here"}
                </span>
                {step && <em>{step}</em>}
              </button>
            ))}
          </div>
          <aside>
            <h3>EQUALITY CHECK</h3>
            <p>Verify with k = {k}:</p>
            <strong>
              {sumK} + {k + 1} = {sumNext}
            </strong>
            <p>
              {sumK} + {k + 1} = (({k + 1})({k + 2})) / 2
            </p>
            <b>
              <Check />{" "}
              {equality
                ? "Exactly matches the goal."
                : "Equality needs repair."}
            </b>
          </aside>
        </section>

        <footer>
          <button onClick={reset}>
            <RotateCcw /> Reset proof
          </button>
          <button
            onClick={() => {
              setSourceOrder(shuffled);
              setSlots([null, null, null, null, null]);
              setChecked(false);
              act();
            }}
          >
            <Shuffle /> Shuffle steps
          </button>
          <span>
            {checked
              ? correct
                ? "Proof order is valid."
                : "The proof has a gap. Reorder the steps."
              : `${slots.filter(Boolean).length} of 5 steps placed`}
          </span>
          <button
            className="check"
            disabled={!full}
            onClick={() => {
              setChecked(true);
              act();
            }}
          >
            <Check /> Check proof
          </button>
        </footer>
      </main>
    </section>
  );
}
