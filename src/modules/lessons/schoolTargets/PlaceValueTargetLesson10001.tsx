import { Check, RotateCcw, Trophy, Volume2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { adjacentSchoolLessons } from "../catalog/school/schoolSyllabusCatalog";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./PlaceValueTargetLesson10001.css";

const places = [
  ["THOUSANDS", 1000, "purple"],
  ["HUNDREDS", 100, "blue"],
  ["TENS", 10, "cyan"],
  ["ONES", 1, "violet"],
] as const;
const wordsBelowTwenty = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];
const tensWords = [
  "",
  "",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
];
function words(n: number): string {
  if (n < 20) return wordsBelowTwenty[n];
  if (n < 100)
    return `${tensWords[Math.floor(n / 10)]}${n % 10 ? `-${words(n % 10)}` : ""}`;
  if (n < 1000)
    return `${words(Math.floor(n / 100))} hundred${n % 100 ? ` ${words(n % 100)}` : ""}`;
  return `${words(Math.floor(n / 1000))} thousand${n % 1000 ? ` ${words(n % 1000)}` : ""}`;
}

export default function PlaceValueTargetLesson10001({
  lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [digits, setDigits] = useState([4, 3, 8, 2]),
    [selected, setSelected] = useState(0),
    [system, setSystem] = useState("International"),
    [tab, setTab] = useState("Interact"),
    [target, setTarget] = useState([6, 0, 4, 7]),
    [practice, setPractice] = useState([6, 0, 4, 7]),
    [practiceGrade, setPracticeGrade] = useState<boolean | null>(true),
    [quick, setQuick] = useState("50,632"),
    [quickGrade, setQuickGrade] = useState<boolean | null>(true),
    [zeroHelp, setZeroHelp] = useState(false),
    [actions, setActions] = useState(0);
  const adjacent = adjacentSchoolLessons(lesson),
    value = digits.reduce((n, d) => n * 10 + d, 0),
    targetValue = target.reduce((n, d) => n * 10 + d, 0),
    expanded = digits.map((d, i) => d * 10 ** (3 - i)),
    formatted = new Intl.NumberFormat(
      system === "Indian" ? "en-IN" : "en-US",
    ).format(value);
  const act = (fn: () => void) => {
    fn();
    setActions((v) => v + 1);
  };
  const placeDigit = (digit: number, index = selected) =>
    act(() => {
      setDigits((row) => row.map((d, i) => (i === index ? digit : d)));
      setSelected(Math.min(3, index + 1));
    });
  const reset = () =>
    act(() => {
      setDigits([4, 3, 8, 2]);
      setSelected(0);
      setSystem("International");
      setPractice([6, 0, 4, 7]);
      setTarget([6, 0, 4, 7]);
      setPracticeGrade(true);
      setQuick("50,632");
      setQuickGrade(true);
      setZeroHelp(false);
    });
  const rows = [
    [4, 3, 8, 2],
    [4, 3, 8, 7],
    [4, 3, 9, 2],
    [5, 3, 8, 2],
  ];
  return (
    <section
      className="pv10001-page"
      data-testid="school-mockup-0675"
      data-object-model="dedicated-drag-drop-four-place-base-ten-model"
      data-definition="Place value tells the value of a digit from its position in a number."
      data-method="Read digits from right to left."
      data-challenge="In 4,582, what is the place value of 5?"
      data-visual="place value chart visual model: a digit's value depends on its column"
      data-number={value}
      data-system={system}
      data-selected-place={selected}
      data-practice-graded={practiceGrade === null ? "" : practiceGrade}
      data-quick-graded={quickGrade === null ? "" : quickGrade}
      data-actions={actions}
    >
      <header className="pv10001-hero">
        <small>CLASS 6 · NUMBERS AND ARITHMETIC</small>
        <h1>Place Value Explorer</h1>
        <p>
          <b>Objective:</b> Read, write, and represent numbers using Indian and
          International place value systems.
        </p>
        <dl>
          <span>18 min</span>
          <span>FOUNDATION</span>
          <span>CONCEPT</span>
          <span>number</span>
          <span>Grades: 6</span>
        </dl>
        <nav>
          <button>← Previous lesson</button>
          <button>Next lesson →</button>
          <label>
            Lesson 1 of 8<progress value="1" max="8" />
          </label>
        </nav>
      </header>
      <nav className="pv10001-tabs">
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
        <button onClick={reset}>
          <RotateCcw />
          Reset
        </button>
        <button
          aria-label="Read number aloud"
          onClick={() =>
            act(() =>
              window.speechSynthesis?.speak(
                new SpeechSynthesisUtterance(words(value)),
              ),
            )
          }
        >
          <Volume2 />
        </button>
      </nav>
      {tab !== "Interact" && (
        <p className="pv10001-tabnote">
          <b>{tab}:</b> A digit's value equals the digit multiplied by its place
          value.
        </p>
      )}
      <section className="pv10001-main">
        <header>
          <i>1</i>
          <div>
            <h2>OBSERVE &amp; MANIPULATE</h2>
            <p>
              Drag digits to build a number. See how each digit's position
              changes its value.
            </p>
          </div>
          <label>
            System{" "}
            <select
              aria-label="Number system"
              value={system}
              onChange={(e) => act(() => setSystem(e.target.value))}
            >
              <option>International</option>
              <option>Indian</option>
            </select>
          </label>
        </header>
        <main>
          <div className="pv10001-builder">
            <div className="pv10001-place-grid">
              {places.map(([name, multiplier, color], i) => (
                <button
                  className={`${color} ${selected === i ? "selected" : ""}`}
                  key={name}
                  onClick={() => setSelected(i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) =>
                    placeDigit(Number(e.dataTransfer.getData("text/plain")), i)
                  }
                >
                  <b>{name}</b>
                  <small>
                    {multiplier.toLocaleString("en-IN")}
                    <em>(× {multiplier})</em>
                  </small>
                  <strong>{digits[i]}</strong>
                </button>
              ))}
            </div>
            <h3>
              Digit cards <small>(drag to place)</small>
            </h3>
            <div className="pv10001-digits">
              {Array.from({ length: 10 }, (_, d) => (
                <button
                  draggable
                  onDragStart={(e) =>
                    e.dataTransfer.setData("text/plain", String(d))
                  }
                  onClick={() => placeDigit(d)}
                  key={d}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <aside>
            <b>Your number</b>
            <strong>{formatted}</strong>
            <section>
              <b>Expanded form</b>
              {expanded.map((n, i) => (
                <p className={places[i][2]} key={i}>
                  {digits[i]} × {places[i][1].toLocaleString("en-IN")} ={" "}
                  {n.toLocaleString("en-IN")}
                </p>
              ))}
            </section>
            <section>
              <b>Number name</b>
              <p>{words(value)[0].toUpperCase() + words(value).slice(1)}.</p>
            </section>
          </aside>
        </main>
        <footer>
          <b>!</b>
          <span>
            <strong>Zero is a placeholder!</strong> It shows that a place is
            empty but keeps the place value.
            <small>Example: 4,302 (hundreds place is 0)</small>
          </span>
          <button onClick={() => act(() => setZeroHelp((v) => !v))}>
            Why zeros matter →
          </button>
          {zeroHelp && (
            <p>
              Without the zero, 4,302 would become 432 and every following digit
              would move to a different place.
            </p>
          )}
        </footer>
      </section>
      <section className="pv10001-middle">
        <article>
          <header>
            <i>2</i>
            <div>
              <h2>NOTICE THE PATTERN</h2>
              <p>Change the digit in each place and observe.</p>
            </div>
          </header>
          <table>
            <thead>
              <tr>
                {[...places.map((p) => p[0]), "NUMBER"].map((x) => (
                  <th key={x}>{x}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  {r.map((d, j) => (
                    <td key={j}>{d}</td>
                  ))}
                  <th>
                    ={" "}
                    {r.reduce((n, d) => n * 10 + d, 0).toLocaleString("en-IN")}
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
          <p>Moving one place left multiplies the value by 10.</p>
          <p>Moving one place right divides the value by 10.</p>
        </article>
        <article>
          <header>
            <i>3</i>
            <div>
              <h2>UNDERSTAND THE RULE</h2>
              <p>
                Each place has 10 times the value of the place to its right.
              </p>
            </div>
          </header>
          <table>
            <thead>
              <tr>
                <th>Move</th>
                <th>Effect on value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>← Left (× 10)</td>
                <td>Multiply by 10</td>
              </tr>
              <tr>
                <td>→ Right (÷ 10)</td>
                <td>Divide by 10</td>
              </tr>
            </tbody>
          </table>
          <section>
            <b>Key rule</b>
            <p>A digit's value = digit × place value.</p>
            <p>Place values: ... 1,000 | 100 | 10 | 1 ...</p>
          </section>
          <section className="mistake">
            <b>Common mistake</b>
            <p>Reading only the digit and ignoring its place.</p>
          </section>
        </article>
      </section>
      <section className="pv10001-practice">
        <article>
          <header>
            <i>4</i>
            <div>
              <h2>WORKED EXAMPLE</h2>
              <p>Read the number 72,805 (International system).</p>
            </div>
          </header>
          <div className="example-grid">
            {[
              ["TEN THOUSANDS", 7],
              ["THOUSANDS", 2],
              ["HUNDREDS", 8],
              ["TENS", 0],
              ["ONES", 5],
            ].map(([n, d]) => (
              <span key={String(n)}>
                <b>{n}</b>
                <strong>{d}</strong>
              </span>
            ))}
          </div>
          <p>
            <b>Expanded form:</b>
            <br />7 × 10,000 + 2 × 1,000 + 8 × 100 + 0 × 10 + 5 × 1<br />
            <br />= 72,805
          </p>
          <p>
            <b>Number name:</b> Seventy-two thousand eight hundred five.
          </p>
        </article>
        <article>
          <header>
            <i>5</i>
            <div>
              <h2>TRY IT INDEPENDENTLY</h2>
              <p>Use digit cards to make the number shown.</p>
            </div>
          </header>
          <output>
            Target number<strong>{targetValue.toLocaleString("en-IN")}</strong>
          </output>
          <div className="practice-digits">
            {practice.map((d, i) => (
              <input
                key={places[i][0]}
                aria-label={`${places[i][0]} practice digit`}
                min="0"
                max="9"
                type="number"
                value={d}
                onChange={(e) => {
                  setPractice((r) =>
                    r.map((x, j) =>
                      j === i
                        ? Math.max(0, Math.min(9, Number(e.target.value)))
                        : x,
                    ),
                  );
                  setPracticeGrade(null);
                }}
              />
            ))}
          </div>
          <button
            onClick={() =>
              act(() =>
                setPracticeGrade(practice.every((d, i) => d === target[i])),
              )
            }
          >
            Check
          </button>
          <button
            onClick={() =>
              act(() => {
                const n = String(Math.floor(1000 + Math.random() * 9000))
                  .split("")
                  .map(Number);
                setTarget(n);
                setPractice([0, 0, 0, 0]);
                setPracticeGrade(null);
              })
            }
          >
            New number
          </button>
          <button onClick={() => act(() => setPractice(target))}>Hint</button>
          {practiceGrade !== null && (
            <p className={practiceGrade ? "correct" : "wrong"}>
              <Check />
              {practiceGrade
                ? `Correct! Expanded form: ${target.map((d, i) => `${d} × ${10 ** (3 - i)}`).join(" + ")}`
                : "Not yet. Match every place to the target."}
            </p>
          )}
        </article>
      </section>
      <section className="pv10001-challenge">
        <Trophy />
        <div>
          <h2>QUICK CHALLENGE</h2>
          <p>
            Write the number for: 5 ten-thousands, 0 thousands, 6 hundreds, 3
            tens, and 2 ones.
          </p>
        </div>
        <input
          aria-label="Quick challenge answer"
          value={quick}
          onChange={(e) => {
            setQuick(e.target.value);
            setQuickGrade(null);
          }}
        />
        <button
          onClick={() =>
            act(() => setQuickGrade(Number(quick.replace(/,/g, "")) === 50632))
          }
        >
          Check
        </button>
        {quickGrade !== null && (
          <output>
            {quickGrade ? "Great!" : "Try the five place values again."}
          </output>
        )}
      </section>
      <nav className="pv10001-adjacent">
        <span>
          ← Previous lesson
          <b>{adjacent.previous?.title ?? "Reading & Writing Numbers"}</b>
        </span>
        <label>
          Lesson 1 of 8<progress value="1" max="8" />
        </label>
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
