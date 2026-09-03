import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Lightbulb,
  RotateCcw,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./DimensionalAnalysisTargetLesson613.css";
type Unit = "km" | "m" | "h" | "min" | "s";
type Factor = { id: string; n: number; num: Unit; d: number; den: Unit };
const factors: Factor[] = [
  { id: "km/m", n: 1, num: "km", d: 1000, den: "m" },
  { id: "m/km", n: 1000, num: "m", d: 1, den: "km" },
  { id: "h/min", n: 1, num: "h", d: 60, den: "min" },
  { id: "min/h", n: 60, num: "min", d: 1, den: "h" },
  { id: "min/s", n: 1, num: "min", d: 60, den: "s" },
  { id: "s/min", n: 60, num: "s", d: 1, den: "min" },
  { id: "h/h", n: 1, num: "h", d: 1, den: "h" },
];
const get = (id: string) => factors.find((f) => f.id === id)!;
const solve = (value: number, num: Unit, den: Unit, chain: string[]) => {
  const units = new Map<Unit, number>([
    [num, 1],
    [den, -1],
  ]);
  let result = value;
  for (const id of chain) {
    const x = get(id);
    result *= x.n / x.d;
    units.set(x.num, (units.get(x.num) ?? 0) + 1);
    units.set(x.den, (units.get(x.den) ?? 0) - 1);
  }
  return { result, units: [...units].filter(([, power]) => power !== 0) };
};
const FactorCard = ({
  id,
  onAdd,
}: {
  id: string;
  onAdd: (id: string) => void;
}) => {
  const x = get(id);
  return (
    <button
      draggable
      onDragStart={(e) => e.dataTransfer.setData("text/plain", id)}
      onClick={() => onAdd(id)}
    >
      <span>
        {x.n} {x.num}
      </span>
      <span>
        {x.d} {x.den}
      </span>
    </button>
  );
};
export default function DimensionalAnalysisTargetLesson613({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [chain, setChain] = useState(["m/km", "h/min", "h/h"]),
    [challenge, setChallenge] = useState<string[]>([]),
    [show, setShow] = useState(true),
    [hint, setHint] = useState(false),
    [solution, setSolution] = useState(false),
    [graded, setGraded] = useState<boolean | null>(null),
    [tab, setTab] = useState("Interact"),
    [actions, setActions] = useState(0);
  const reset = () => {
    setChain(["m/km", "h/min", "h/h"]);
    setChallenge([]);
    setShow(true);
    setHint(false);
    setSolution(false);
    setGraded(null);
    setTab("Interact");
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (fn: () => void) => {
    fn();
    setActions((v) => v + 1);
    onInteraction();
  };
  const main = solve(5, "km", "h", chain),
    practice = solve(2.5, "m", "s", challenge),
    valid =
      main.units.length === 2 &&
      main.units.some(([u, p]) => u === "m" && p === 1) &&
      main.units.some(([u, p]) => u === "min" && p === -1),
    practiceValid =
      practice.units.length === 2 &&
      practice.units.some(([u, p]) => u === "km" && p === 1) &&
      practice.units.some(([u, p]) => u === "h" && p === -1);
  const add = (zone: "main" | "challenge", id: string) =>
    act(() =>
      zone === "main"
        ? setChain((c) => (c.length < 3 ? [...c, id] : c))
        : setChallenge((c) => (c.length < 3 ? [...c, id] : c)),
    );
  const drop = (e: React.DragEvent, zone: "main" | "challenge") => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (get(id)) add(zone, id);
  };
  return (
    <section
      className="da613-page"
      data-testid="finance-mockup-0670"
      data-object-model="dedicated-draggable-unit-exponent-cancellation-chain-model"
      data-result={main.result.toFixed(2)}
      data-valid={valid}
      data-chain={chain.join("|")}
      data-challenge-result={practice.result.toFixed(2)}
      data-challenge-valid={practiceValid}
      data-graded={graded === null ? "" : graded}
      data-actions={actions}
    >
      <header className="da613-hero">
        <div>
          <b>DISCRETE AND APPLIED MATHEMATICS</b>
          <b>FINANCIAL MATHEMATICS AND MODELLING</b>
        </div>
        <h1>Dimensional Analysis</h1>
        <p>Convert units using cancellation.</p>
        <dl>
          <span>▣ &nbsp; Lesson 613</span>
          <span>♙ &nbsp; Intermediate–Advanced</span>
          <span>ϟ &nbsp; Applied Modelling Lab</span>
          <span>◴ &nbsp; 6–10 min</span>
        </dl>
        <aside>
          <b>◎ &nbsp; Objective</b> Convert a quantity to a desired unit using
          dimensional-analysis chains.
        </aside>
      </header>
      <nav className="da613-tabs">
        {["Interact", "Learn", "Worked Example", "Formula", "Practice"].map(
          (n) => (
            <button
              key={n}
              className={tab === n ? "active" : ""}
              onClick={() => act(() => setTab(n))}
            >
              {n}
            </button>
          ),
        )}
      </nav>
      {tab !== "Interact" && (
        <p className="da613-note">
          <b>{tab}:</b> Multiply by ratios equal to one so unwanted units
          cancel.
        </p>
      )}
      <section className="da613-lab">
        <header>
          <div>
            <b>INTERACT</b>
            <h2>Build a valid dimensional-analysis chain</h2>
            <p>
              Drag conversion factors to form a chain. Units cancel in green.
              Get the final unit shown.
            </p>
          </div>
          <span>
            <button onClick={() => act(reset)}>
              <RotateCcw />
              Reset
            </button>
            <button onClick={() => act(() => setHint((v) => !v))}>
              <Lightbulb />
              Hint
            </button>
            <strong className={valid ? "valid" : ""}>
              <CheckCircle2 />
              Chain {valid ? "valid" : "invalid"}
            </strong>
          </span>
        </header>
        <main>
          <section className="da613-chain">
            <article>
              <small>Given quantity</small>
              <strong>
                5.00{" "}
                <i>
                  km
                  <br />h
                </i>
              </strong>
            </article>
            <b>→</b>
            {chain.map((id, i) => (
              <div
                key={`${id}${i}`}
                onClick={() =>
                  act(() => setChain((c) => c.filter((_, j) => j !== i)))
                }
              >
                <FactorCard id={id} onAdd={() => {}} />
                {show && <i>✓</i>}
              </div>
            ))}
            {Array.from({ length: Math.max(0, 3 - chain.length) }, (_, i) => (
              <div
                className="drop"
                key={i}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => drop(e, "main")}
              >
                Drag factor here
              </div>
            ))}
            <b>=</b>
            <article>
              <small>Result</small>
              <strong>
                = {main.result.toFixed(2)}{" "}
                <i>
                  {valid ? (
                    <span>
                      m<br />
                      min
                    </span>
                  ) : (
                    "?"
                  )}
                </i>
              </strong>
            </article>
          </section>
          <aside>
            <h3>Live readouts</h3>
            <p>
              Numerator units{" "}
              <b>
                {main.units
                  .filter(([, p]) => p > 0)
                  .map(([u]) => u)
                  .join(" · ") || "1"}
              </b>
            </p>
            <p>
              Denominator units{" "}
              <b>
                {main.units
                  .filter(([, p]) => p < 0)
                  .map(([u]) => u)
                  .join(" · ") || "1"}
              </b>
            </p>
            <p>
              Final unit <b>{valid ? "m/min" : "not valid"}</b>
            </p>
            <p>
              Numeric result <b>{main.result.toFixed(2)}</b>
            </p>
          </aside>
          <section className="da613-pool">
            <h3>Available conversion factors</h3>
            <p>Drag a factor above to use it.</p>
            <div>
              {factors
                .filter((x) => x.id !== "h/h")
                .map((x) => (
                  <FactorCard
                    key={x.id}
                    id={x.id}
                    onAdd={(id) => add("main", id)}
                  />
                ))}
            </div>
          </section>
        </main>
        <output className={valid ? "valid" : ""}>
          <CheckCircle2 />
          {valid
            ? "Excellent! All intermediate units cancel. Final unit is m/min."
            : "Keep arranging factors until only m/min remains."}
        </output>
        <label>
          Show cancellations{" "}
          <input
            type="checkbox"
            checked={show}
            onChange={() => act(() => setShow((v) => !v))}
          />
        </label>
        {hint && (
          <small className="hint">
            Use metres per kilometre, then hours per minute.
          </small>
        )}
      </section>
      <section className="da613-theory">
        <article>
          <h2>WORKED EXAMPLE</h2>
          <h3>Convert 5.00 km/h to m/min</h3>
          <strong>5.00 km/h × 1000 m/1 km × 1 h/60 min = 83.33 m/min</strong>
          <p>All intermediate units cancel, leaving m/min.</p>
        </article>
        <article>
          <h2>KEY RULE</h2>
          <p>
            Arrange conversion factors so that every unit except the desired one
            cancels. Multiply all numeric values.
          </p>
          <strong>
            Final quantity = Given quantity × ∏ (conversion factors)
          </strong>
          <aside>Units cancel &nbsp; | &nbsp; Numbers multiply</aside>
        </article>
        <article>
          <h2>DEFINITION</h2>
          <p>
            <b>Conversion factor:</b> An expression equal to 1 that relates two
            equivalent units. Multiplying by it changes the units but not the
            value.
          </p>
          <strong>1000 m / 1 km = 1 &nbsp;&nbsp;&nbsp; 1 h / 60 min = 1</strong>
        </article>
        <article>
          <h2>⚠ &nbsp; COMMON MISCONCEPTION</h2>
          <p>
            <b>Adding or subtracting unlike units.</b>
            <br />
            You cannot add 5 km + 3 m. First convert to the same unit, then add.
          </p>
          <strong>
            ✕ Incorrect: 5 km + 300 m = 5300 m &nbsp;&nbsp; ✓ Correct: 5 km +
            300 m = 5.3 km
          </strong>
        </article>
      </section>
      <section className="da613-challenge">
        <header>
          <b>TRY IT</b>
          <h2>Challenge: Convert 2.5 m/s to km/h</h2>
        </header>
        <article>
          <small>Given</small>
          <strong>2.5 m/s</strong>
        </article>
        <b>→</b>
        <div
          className="zones"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => drop(e, "challenge")}
        >
          {challenge.map((id, i) => (
            <span
              key={`${id}${i}`}
              onClick={() =>
                act(() => setChallenge((c) => c.filter((_, j) => j !== i)))
              }
            >
              {id}
            </span>
          ))}
          {Array.from({ length: 3 - challenge.length }, (_, i) => (
            <i key={i}>Drop factor</i>
          ))}
        </div>
        <b>= {practiceValid ? practice.result.toFixed(2) : "?"} km/h</b>
        <section>
          <button
            onClick={() =>
              act(() =>
                setGraded(
                  practiceValid && Math.abs(practice.result - 9) < 0.001,
                ),
              )
            }
          >
            Check
          </button>
          <button onClick={() => act(() => setSolution((v) => !v))}>
            <Eye /> Show solution
          </button>
          {graded !== null && (
            <output>
              {graded
                ? "Correct: 9 km/h"
                : "Build a chain that cancels m and s."}
            </output>
          )}
        </section>
        <aside>
          <Lightbulb />
          <b>Tip</b>
          <p>
            Use factors to go from m→km and s→h. Remember: 1 km=1000 m and 1
            h=3600 s.
          </p>
          {solution && <strong>2.5 × 1/1000 × 60 × 60 = 9</strong>}
        </aside>
      </section>
      <nav className="da613-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/612-parameter-estimation">
          <ChevronLeft />
          <span>
            <b>Previous</b>Parameter Estimation
          </span>
        </a>
        <a href="/lessons/discrete-and-applied-mathematics/614-sensitivity-analysis">
          <span>
            <b>Next</b>Sensitivity Analysis
          </span>
          <ChevronRight />
        </a>
      </nav>
    </section>
  );
}
