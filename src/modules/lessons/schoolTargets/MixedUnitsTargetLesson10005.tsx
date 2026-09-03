import { CheckCircle2, Trash2 } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { Link } from "react-router-dom";
import { schoolLessonCatalog } from "../catalog/school/schoolSyllabusCatalog";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./MixedUnitsTargetLesson10005.css";

type Unit = "km" | "m" | "cm" | "mm";
const factors: Record<Unit, number> = { km: 1000, m: 1, cm: 0.01, mm: 0.001 },
  toM = (value: number, unit: Unit) => value * factors[unit],
  convert = (value: number, from: Unit, to: Unit) =>
    toM(value, from) / factors[to],
  fmt = (n: number) =>
    Number.isInteger(n)
      ? String(n)
      : n.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
const factorCards = [
  { label: "1 m / 100 cm", from: "cm", to: "m" },
  { label: "100 cm / 1 m", from: "m", to: "cm" },
  { label: "1 km / 1000 m", from: "m", to: "km" },
  { label: "1000 m / 1 km", from: "km", to: "m" },
  { label: "1 / 10", from: "cm", to: "mm" },
  { label: "10 / 1", from: "mm", to: "cm" },
  { label: "1 / 100", from: "m", to: "cm" },
] as const;
export default function MixedUnitsTargetLesson10005({
  lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [obsA, setObsA] = useState(100),
    [obsB, setObsB] = useState(1),
    [a, setA] = useState(250),
    [aUnit, setAUnit] = useState<Unit>("cm"),
    [b, setB] = useState(1.75),
    [bUnit, setBUnit] = useState<Unit>("m"),
    [chain, setChain] = useState<number | null>(0),
    [tab, setTab] = useState("Interact"),
    [challengeCm, setChallengeCm] = useState(""),
    [challengeM, setChallengeM] = useState(""),
    [winner, setWinner] = useState(""),
    [challengeGrade, setChallengeGrade] = useState<boolean | null>(null),
    [practice, setPractice] = useState(["", "", ""]),
    [practiceGrade, setPracticeGrade] = useState<(boolean | null)[]>([
      null,
      null,
      null,
    ]),
    [solution, setSolution] = useState(false),
    [actions, setActions] = useState(0);
  const lessonIndex = schoolLessonCatalog.findIndex(
      (candidate) => candidate.id === lesson.id,
    ),
    adjacent = {
      previous: lessonIndex > 0 ? schoolLessonCatalog[lessonIndex - 1] : null,
      next:
        lessonIndex >= 0 && lessonIndex < schoolLessonCatalog.length - 1
          ? schoolLessonCatalog[lessonIndex + 1]
          : null,
    },
    aM = toM(a, aUnit),
    bM = toM(b, bUnit),
    difference = Math.abs(aM - bM),
    chainValid = chain === 0,
    chainResult = chainValid ? convert(250, "cm", "m") : null;
  const act = (fn: () => void) => {
      fn();
      setActions((v) => v + 1);
    },
    chooseFactor = (i: number) => act(() => setChain(i)),
    checkChallenge = () =>
      act(() =>
        setChallengeGrade(
          Number(challengeCm) === 320 &&
            Number(challengeM) === 2.8 &&
            winner === "a",
        ),
      ),
    answers = [6.4, 2.75, 5.55],
    checkPractice = (i: number) =>
      act(() =>
        setPracticeGrade((v) =>
          v.map((x, j) =>
            j === i ? Math.abs(Number(practice[i]) - answers[i]) < 0.001 : x,
          ),
        ),
      );
  return (
    <section
      className="mu10005-page"
      data-testid="school-mockup-0679"
      data-object-model="dedicated-drag-drop-dimensional-unit-conversion-and-comparison-model"
      data-observe-difference={Math.abs(
        toM(obsA, "cm") - toM(obsB, "m"),
      ).toFixed(2)}
      data-a-metres={aM.toFixed(2)}
      data-b-metres={bM.toFixed(2)}
      data-difference={difference.toFixed(2)}
      data-chain-valid={chainValid}
      data-chain-result={chainResult ?? ""}
      data-challenge-graded={challengeGrade === null ? "" : challengeGrade}
      data-actions={actions}
    >
      <header className="mu10005-hero">
        <small>CLASS 6 · NUMBERS AND ARITHMETIC</small>
        <h1>Mixed Units and Unit Conversion</h1>
        <p>
          <b>Objective:</b> Convert between mixed units using correct conversion
          factors and unit reasoning.
        </p>
        <dl>
          <span>18 min</span>
          <span>FOUNDATION</span>
          <span>CLASS 6</span>
          <span>numbers</span>
        </dl>
        <aside>
          Lesson 6 of 24
          <nav>
            {adjacent.previous ? (
              <Link to={adjacent.previous.route}>← Previous</Link>
            ) : (
              <span />
            )}
            {adjacent.next ? (
              <Link to={adjacent.next.route}>Next →</Link>
            ) : (
              <span />
            )}
          </nav>
        </aside>
      </header>
      <nav className="mu10005-tabs">
        {["Interact", "Learn", "Worked Example", "Formula", "Practice"].map(
          (n) => (
            <button
              className={tab === n ? "active" : ""}
              onClick={() => act(() => setTab(n))}
              key={n}
            >
              {n}
            </button>
          ),
        )}
      </nav>
      {tab !== "Interact" && (
        <p className="mu10005-tabnote">
          <b>{tab}:</b> Multiply by a conversion factor equal to one and cancel
          units.
        </p>
      )}
      <section className="mu10005-workspace">
        <div>
          <article className="observe">
            <h2>
              1 OBSERVE <small>Explore the mixed-unit relationship.</small>
            </h2>
            <label>
              QUANTITY A <b>{obsA} cm</b>
              <input
                aria-label="Observe centimetres"
                type="range"
                min="0"
                max="300"
                value={obsA}
                onChange={(e) => act(() => setObsA(Number(e.target.value)))}
              />
              <output>{toM(obsA, "cm").toFixed(2)} m</output>
            </label>
            <label>
              QUANTITY B <b>{obsB} m</b>
              <input
                aria-label="Observe metres"
                type="range"
                min="0"
                max="3"
                step=".01"
                value={obsB}
                onChange={(e) => act(() => setObsB(Number(e.target.value)))}
              />
              <output>{obsB.toFixed(2)} m</output>
            </label>
            <div>
              <span>
                A in base unit (m)<b>{toM(obsA, "cm").toFixed(2)} m</b>
              </span>
              <span>
                B in base unit (m)<b>{obsB.toFixed(2)} m</b>
              </span>
              <span>
                Difference<b>{Math.abs(toM(obsA, "cm") - obsB).toFixed(2)} m</b>
              </span>
            </div>
            <p>
              {Math.abs(toM(obsA, "cm") - obsB) < 0.001
                ? "They are equal quantities."
                : toM(obsA, "cm") > obsB
                  ? "Quantity A is greater."
                  : "Quantity B is greater."}
            </p>
          </article>
          <article className="manipulate">
            <h2>
              2 MANIPULATE <small>Adjust values and see linked changes.</small>
            </h2>
            {[
              ["Quantity A", a, aUnit, setA, setAUnit],
              ["Quantity B", b, bUnit, setB, setBUnit],
            ].map(([label, value, unit, setValue, setUnit]) => (
              <label key={String(label)}>
                <b>{String(label)}</b>
                <input
                  aria-label={`${label} value`}
                  type="number"
                  value={Number(value)}
                  onChange={(e) =>
                    act(() =>
                      (setValue as Dispatch<SetStateAction<number>>)(
                        Number(e.target.value),
                      ),
                    )
                  }
                />
                <select
                  aria-label={`${label} unit`}
                  value={String(unit)}
                  onChange={(e) =>
                    act(() =>
                      (setUnit as Dispatch<SetStateAction<Unit>>)(
                        e.target.value as Unit,
                      ),
                    )
                  }
                >
                  {Object.keys(factors).map((u) => (
                    <option key={u}>{u}</option>
                  ))}
                </select>
                <input
                  aria-label={`${label} slider`}
                  type="range"
                  min="0"
                  max="500"
                  step=".25"
                  value={Number(value)}
                  onChange={(e) =>
                    act(() =>
                      (setValue as Dispatch<SetStateAction<number>>)(
                        Number(e.target.value),
                      ),
                    )
                  }
                />
                <output>
                  = {(String(label) === "Quantity A" ? aM : bM).toFixed(2)} m
                </output>
              </label>
            ))}
            <section>
              <b>Linked comparison (base unit: m)</b>
              <div>
                <span>
                  A in m<strong>{aM.toFixed(2)} m</strong>
                </span>
                <span>
                  B in m<strong>{bM.toFixed(2)} m</strong>
                </span>
                <span>
                  Difference<strong>{difference.toFixed(2)} m</strong>
                  <small>
                    {difference < 0.001
                      ? "Equal"
                      : aM > bM
                        ? "A is greater"
                        : "B is greater"}
                  </small>
                </span>
              </div>
            </section>
          </article>
          <article className="pattern">
            <h2>3 NOTICE THE PATTERN</h2>
            <table>
              <thead>
                <tr>
                  <th>A (given)</th>
                  <th>Convert to base</th>
                  <th>B (given)</th>
                  <th>Convert to base</th>
                  <th>Difference</th>
                </tr>
              </thead>
              <tbody>
                {[
                  [300, "cm", 2.4, "m"],
                  [45, "cm", 50, "cm"],
                  [1.2, "m", 90, "cm"],
                  [750, "cm", 6, "m"],
                ].map(([av, au, bv, bu]) => (
                  <tr key={`${av}${au}`}>
                    <td>
                      {av} {au}
                    </td>
                    <td>{toM(Number(av), au as Unit).toFixed(2)} m</td>
                    <td>
                      {bv} {bu}
                    </td>
                    <td>{toM(Number(bv), bu as Unit).toFixed(2)} m</td>
                    <td>
                      {Math.abs(
                        toM(Number(av), au as Unit) -
                          toM(Number(bv), bu as Unit),
                      ).toFixed(2)}{" "}
                      m
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>Convert everything to the same unit, then compare or operate.</p>
          </article>
          <article className="rule">
            <h2>4 UNDERSTAND THE RULE</h2>
            <h3>Key rule for mixed-unit conversion</h3>
            <p>
              Convert all quantities to a common unit using correct conversion
              factors. Then compare, add, subtract, or solve as required.
            </p>
            <div>
              <span>
                <b>Key ideas</b>Use conversion factors equal to 1.
                <br />
                Only multiply or divide; never add unlike units.
                <br />
                Cancel units to confirm the result.
              </span>
              <span>
                <b>Base relationships</b>1 m = 100 cm
                <br />1 cm = 0.01 m
              </span>
            </div>
          </article>
        </div>
        <aside>
          <article className="ladder">
            <h2>UNIT-FACTOR LADDER</h2>
            <p>Use factors equal to 1 to convert.</p>
            <div>
              <b>km</b>
              <i>× 1000 ↓</i>
              <b>m</b>
              <i>× 100 ↓</i>
              <b>cm</b>
              <i>× 10 ↓</i>
              <b>mm</b>
            </div>
          </article>
          <article
            className="chain"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) =>
              chooseFactor(Number(e.dataTransfer.getData("text/plain")))
            }
          >
            <h2>
              BUILD YOUR CONVERSION <small>(Drag factors to the chain)</small>
            </h2>
            <p>
              <b>Goal:</b> Convert 250 cm to m
            </p>
            <div className="equation">
              <b>250 cm</b> ×{" "}
              <span>
                {chain === null ? "drop factor" : factorCards[chain].label}
              </span>{" "}
              ={" "}
              <output>{chainResult === null ? "?" : fmt(chainResult)} m</output>
            </div>
            <div className="factor-cards">
              {factorCards.map((f, i) => (
                <button
                  draggable
                  onDragStart={(e) =>
                    e.dataTransfer.setData("text/plain", String(i))
                  }
                  onClick={() => chooseFactor(i)}
                  key={f.label}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <button onClick={() => act(() => setChain(null))}>
              <Trash2 />
              Clear chain
            </button>
            <section className={chainValid ? "correct" : "wrong"}>
              <b>RESULT</b>
              <p>
                {chainValid
                  ? "250 cm = 2.50 m"
                  : "Units do not cancel. Choose a reciprocal factor."}
              </p>
              {chainValid && <CheckCircle2 />}
            </section>
          </article>
          <article className="dimensional">
            <h2>DIMENSIONAL CHECK</h2>
            <p>Expression: 250 cm × 1 m / 100 cm</p>
            <strong>cm cancels → 1 m / 100 = m</strong>
            <p>
              <CheckCircle2 />
              Surviving unit: m <CheckCircle2 />
              Consistent
            </p>
          </article>
          <article className="misconception">
            <h2>COMMON MISCONCEPTION</h2>
            <b>Do not add or subtract quantities with different units.</b>
            <p>250 cm + 2 m (wrong)</p>
            <p>Convert first: 250 cm = 2.50 m, then 2.50 m + 2 m = 4.50 m.</p>
          </article>
          <article className="challenge">
            <h2>CHALLENGE</h2>
            <p>
              Convert and compare: <b>3.2 m and 280 cm</b>
            </p>
            <div>
              <input
                aria-label="3.2 metres in centimetres"
                value={challengeCm}
                onChange={(e) => setChallengeCm(e.target.value)}
              />{" "}
              cm
              <input
                aria-label="280 centimetres in metres"
                value={challengeM}
                onChange={(e) => setChallengeM(e.target.value)}
              />{" "}
              m
            </div>
            {[
              ["a", "3.2 m"],
              ["b", "280 cm"],
              ["equal", "They are equal"],
            ].map(([v, l]) => (
              <label key={v}>
                <input
                  type="radio"
                  name="winner"
                  value={v}
                  checked={winner === v}
                  onChange={(e) => setWinner(e.target.value)}
                />
                {l}
              </label>
            ))}
            <button onClick={checkChallenge}>Check answer</button>
            {challengeGrade !== null && (
              <output>
                {challengeGrade
                  ? "Correct: 3.2 m is 320 cm and is greater."
                  : "Convert both to one unit first."}
              </output>
            )}
          </article>
        </aside>
      </section>
      <section className="mu10005-worked">
        <h2>
          4 WORKED EXAMPLE <small>(Correct)</small>
        </h2>
        <b>Add 75 cm and 1.2 m.</b>
        <span>
          Step 1: Convert to m<br />
          75 cm = 0.75 m<br />
          1.2 m = 1.2 m
        </span>
        <span>
          Step 2: Add
          <br />
          0.75 m + 1.2 m = 1.95 m
        </span>
        <span>
          Step 3: Write answer with unit
          <br />
          <strong>1.95 m</strong>
        </span>
      </section>
      <section className="mu10005-practice">
        <h2>
          5 TRY INDEPENDENTLY <small>Solve on your own.</small>
        </h2>
        {[
          "Convert 640 cm to m.",
          "Add: 2.4 m + 35 cm.",
          "A ribbon is 3.75 m long. Another piece is 180 cm long. Total in metres?",
        ].map((q, i) => (
          <article key={q}>
            <b>{i + 1}</b>
            <p>{q}</p>
            <input
              aria-label={`Practice answer ${i + 1}`}
              value={practice[i]}
              onChange={(e) =>
                setPractice((v) =>
                  v.map((x, j) => (j === i ? e.target.value : x)),
                )
              }
            />
            <button onClick={() => checkPractice(i)}>Check</button>
            {practiceGrade[i] !== null && (
              <output>
                {practiceGrade[i]
                  ? "Correct"
                  : "Try converting to metres first"}
              </output>
            )}
          </article>
        ))}
        <button onClick={() => act(() => setSolution((v) => !v))}>
          Show solution
        </button>
        {solution && <p>Answers: 6.4 m, 2.75 m, and 5.55 m.</p>}
      </section>
      <nav className="mu10005-adjacent">
        {adjacent.previous ? (
          <Link to={adjacent.previous.route}>
            ← Previous lesson<b>{adjacent.previous.title}</b>
          </Link>
        ) : (
          <span />
        )}
        {adjacent.next ? (
          <Link to={adjacent.next.route}>
            Next lesson →<b>{adjacent.next.title}</b>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </section>
  );
}
