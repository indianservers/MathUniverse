import {
  CheckCircle2,
  Copy,
  RefreshCw,
  RotateCcw,
  Shuffle,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { adjacentSchoolLessons } from "../catalog/school/schoolSyllabusCatalog";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./NumberNamingTargetLesson10002.css";

const small = [
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
  ],
  tens = [
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
function below1000(n: number) {
  if (n < 20) return small[n];
  if (n < 100)
    return `${tens[Math.floor(n / 10)]}${n % 10 ? `-${small[n % 10]}` : ""}`;
  return `${small[Math.floor(n / 100)]} hundred${n % 100 ? ` ${below1000(n % 100)}` : ""}`;
}
function internationalWords(n: number) {
  if (!n) return "zero";
  const units: [[number, string], [number, string], [number, string]] = [
    [1_000_000_000, "billion"],
    [1_000_000, "million"],
    [1_000, "thousand"],
  ];
  let rest = n,
    out = "";
  for (const [size, name] of units) {
    const q = Math.floor(rest / size);
    if (q) {
      out += `${below1000(q)} ${name} `;
      rest %= size;
    }
  }
  return `${out}${rest ? below1000(rest) : ""}`.trim();
}
function indianWords(n: number) {
  if (!n) return "zero";
  const crore = Math.floor(n / 10_000_000),
    lakh = Math.floor((n % 10_000_000) / 100_000),
    thousand = Math.floor((n % 100_000) / 1000),
    rest = n % 1000;
  return [
    [crore, "crore"],
    [lakh, "lakh"],
    [thousand, "thousand"],
  ]
    .filter(([v]) => v)
    .map(([v, name]) => `${below1000(Number(v))} ${name}`)
    .concat(rest ? [below1000(rest)] : [])
    .join(" ");
}
const title = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase()),
  indianFormat = (n: number) => new Intl.NumberFormat("en-IN").format(n),
  internationalFormat = (n: number) => new Intl.NumberFormat("en-US").format(n);
const challengeOptions = [
  "Nine Million Eighty-One Thousand Two Hundred Thirty-Four",
  "Nine Million Eight Hundred Twelve Thousand Three Hundred Forty-Six",
  "Ninety Eight Million One Hundred Twenty Three Thousand Four Hundred Fifty Six",
  "Nine Hundred Eighty One Million Twenty Three Thousand Four Hundred Fifty Six",
];

export default function NumberNamingTargetLesson10002({
  lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [number, setNumber] = useState(133215),
    [tab, setTab] = useState("INTERACT"),
    [commaMode, setCommaMode] = useState<"correct" | "swapped">("correct"),
    [practice, setPractice] = useState("7,89,65,432"),
    [practiceGrade, setPracticeGrade] = useState<boolean | null>(null),
    [showAnswer, setShowAnswer] = useState(false),
    [choice, setChoice] = useState<number | null>(null),
    [choiceGrade, setChoiceGrade] = useState<boolean | null>(null),
    [actions, setActions] = useState(0);
  const adjacent = adjacentSchoolLessons(lesson),
    indian = indianFormat(number),
    international = internationalFormat(number),
    indianName = title(indianWords(number)),
    internationalName = title(internationalWords(number));
  const act = (fn: () => void) => {
      fn();
      setActions((v) => v + 1);
    },
    reset = () =>
      act(() => {
        setNumber(133215);
        setTab("INTERACT");
        setCommaMode("correct");
        setPractice("7,89,65,432");
        setPracticeGrade(null);
        setShowAnswer(false);
        setChoice(null);
        setChoiceGrade(null);
      }),
    copy = (text: string) =>
      act(() => void navigator.clipboard?.writeText(text));
  const indianGroups = indian.split(","),
    internationalGroups = international.split(","),
    displayIndian = commaMode === "correct" ? indian : international,
    displayInternational = commaMode === "correct" ? international : indian;
  return (
    <section
      className="nn10002-page"
      data-testid="school-mockup-0676"
      data-object-model="dedicated-draggable-dual-number-grouping-and-naming-model"
      data-number={number}
      data-indian={indian}
      data-international={international}
      data-comma-mode={commaMode}
      data-practice-graded={practiceGrade === null ? "" : practiceGrade}
      data-choice-graded={choiceGrade === null ? "" : choiceGrade}
      data-actions={actions}
    >
      <header className="nn10002-hero">
        <div>
          <h1>Indian and International Number Naming Systems</h1>
          <p>
            Learn how the same number is grouped and named in the Indian
            (lakh-crore) system and the International (million-billion) system.
          </p>
          <dl>
            <span>Class: 6</span>
            <span>Subject: Mathematics</span>
            <span>Chapter: Numbers and Arithmetic</span>
            <span>Topic: Number Systems</span>
            <span>Time: 18 min</span>
            <span>Level: Foundation</span>
          </dl>
        </div>
        <aside>
          <h2>OBJECTIVE</h2>
          <p>
            <CheckCircle2 />
            Convert numbers and their names between Indian (lakh-crore) and
            International (million-billion) systems.
          </p>
        </aside>
      </header>
      <nav className="nn10002-tabs">
        {["INTERACT", "LEARN", "WORKED EXAMPLE", "FORMULA", "PRACTICE"].map(
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
      {tab !== "INTERACT" && (
        <p className="nn10002-tabnote">
          <b>{tab}:</b> The digits keep the same value; only grouping and number
          names change.
        </p>
      )}
      <section className="nn10002-lab">
        <header>
          <i>1</i>
          <div>
            <h2>Observe and Manipulate</h2>
            <p>
              Enter a number or drag the comma separators to see how the
              grouping and names change in both systems.
            </p>
          </div>
          <button onClick={reset}>
            <RotateCcw /> Reset
          </button>
        </header>
        <main>
          <article className="indian">
            <h3>INDIAN SYSTEM (Lakh-Crore)</h3>
            <div className="group-cards">
              {[
                ["Crores", indianGroups.length > 3 ? indianGroups.at(-4) : "0"],
                ["Lakhs", indianGroups.length > 2 ? indianGroups.at(-3) : "0"],
                [
                  "Thousands",
                  indianGroups.length > 1 ? indianGroups.at(-2) : "0",
                ],
                ["Ones", indianGroups.at(-1)],
              ].map(([name, value]) => (
                <span key={name}>
                  <b>{name}</b>
                  <strong>{value}</strong>
                </span>
              ))}
            </div>
            <p className="powers">
              1 Crore (10<sup>7</sup>) | 1 Lakh (10<sup>5</sup>) | 1 Thousand
              (10<sup>3</sup>) | Ones (10<sup>0</sup>)
            </p>
            <label>
              Number (Indian): <output>{displayIndian}</output>
              <button
                aria-label="Copy Indian number"
                onClick={() => copy(displayIndian)}
              >
                <Copy />
              </button>
            </label>
            <label>
              Number Name (Indian): <output>{indianName}</output>
            </label>
          </article>
          <button
            className="swap"
            draggable
            onDragStart={(e) => e.dataTransfer.setData("text/plain", "comma")}
            onClick={() =>
              act(() =>
                setCommaMode((v) => (v === "correct" ? "swapped" : "correct")),
              )
            }
          >
            <Shuffle />
          </button>
          <article
            className="international"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => act(() => setCommaMode("correct"))}
          >
            <h3>INTERNATIONAL SYSTEM (Million-Billion)</h3>
            <div className="group-cards">
              {[
                [
                  "Millions",
                  internationalGroups.length > 2
                    ? internationalGroups.at(-3)
                    : "0",
                ],
                [
                  "Thousands",
                  internationalGroups.length > 1
                    ? internationalGroups.at(-2)
                    : "0",
                ],
                ["Ones", internationalGroups.at(-1)],
              ].map(([name, value]) => (
                <span key={name}>
                  <b>{name}</b>
                  <strong>{value}</strong>
                </span>
              ))}
            </div>
            <p className="powers">
              1 Million (10<sup>6</sup>) | 1 Thousand (10<sup>3</sup>) | Ones
              (10<sup>0</sup>)
            </p>
            <label>
              Number (International): <output>{displayInternational}</output>
              <button
                aria-label="Copy International number"
                onClick={() => copy(displayInternational)}
              >
                <Copy />
              </button>
            </label>
            <label>
              Number Name (International): <output>{internationalName}</output>
            </label>
          </article>
          <section className="entry">
            <label>
              Enter or choose a number
              <input
                aria-label="Number to group"
                type="number"
                min="0"
                max="999999999"
                value={number}
                onChange={(e) =>
                  act(() =>
                    setNumber(
                      Math.max(0, Math.min(999999999, Number(e.target.value))),
                    ),
                  )
                }
              />
            </label>
            <button
              onClick={() =>
                act(() =>
                  setNumber(Math.floor(100000 + Math.random() * 899900000)),
                )
              }
            >
              <RefreshCw /> Random number
            </button>
            <button onClick={() => act(() => setNumber(0))}>
              <X /> Clear
            </button>
          </section>
          <section
            className="comma"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => act(() => setCommaMode("correct"))}
          >
            <h3>Drag comma separators</h3>
            <p>
              Drag the swap control above onto this panel to restore correct
              grouping.
            </p>
            <b className={commaMode === "correct" ? "correct" : "wrong"}>
              <CheckCircle2 />
              {commaMode === "correct"
                ? "Grouping is correct in both systems."
                : "Grouping has been swapped. Drag here to correct it."}
            </b>
          </section>
        </main>
      </section>
      <section className="nn10002-notice">
        <header>
          <i>2</i>
          <h2>Notice the Pattern</h2>
        </header>
        <p>
          <CheckCircle2 />
          Indian system groups digits as 3,2,2,... (rightmost group of 3 digits,
          then groups of 2).
        </p>
        <p>
          <CheckCircle2 />
          International system groups digits as 3,3,3,... (groups of 3 from
          right to left).
        </p>
        <p>
          <CheckCircle2 />
          The digits remain the same; only grouping and the number name change.
        </p>
      </section>
      <section className="nn10002-rules">
        <article>
          <header>
            <i>3</i>
            <div>
              <h2>Understand the Rule</h2>
              <p>
                Only the place-value grouping and names change. The digits and
                the actual quantity stay the same.
              </p>
            </div>
          </header>
          <table>
            <thead>
              <tr>
                <th>System</th>
                <th>Grouping pattern</th>
                <th>Example ({number})</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>
                  Indian
                  <br />
                  (Lakh-Crore)
                </th>
                <td>3, 2, 2, 2, ...</td>
                <td>{indian}</td>
              </tr>
              <tr>
                <th>
                  International
                  <br />
                  (Million-Billion)
                </th>
                <td>3, 3, 3, ...</td>
                <td>{international}</td>
              </tr>
            </tbody>
          </table>
          <p>
            Both representations are correct. Use the system requested in the
            question.
          </p>
        </article>
        <article>
          <header>
            <i>4</i>
            <div>
              <h2>Worked Example</h2>
              <p>Convert 2,45,67,890 (Indian) to the International system.</p>
            </div>
          </header>
          <table>
            <tbody>
              {[
                ["Write in Indian groups", "2 | 45 | 67 | 890"],
                ["Remove commas", "24567890"],
                ["Group in 3's from right", "0 | 24 | 567 | 890"],
                ["Insert commas", "24,567,890"],
                [
                  "Number name",
                  "Twenty Four Million Five Hundred Sixty Seven Thousand Eight Hundred Ninety",
                ],
              ].map(([a, b], i) => (
                <tr key={a}>
                  <th>{i + 1}</th>
                  <td>{a}</td>
                  <td>{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <strong>
            <CheckCircle2 />
            Answer: 24,567,890 (Twenty Four Million Five Hundred Sixty Seven
            Thousand Eight Hundred Ninety)
          </strong>
        </article>
      </section>
      <section className="nn10002-practice">
        <article>
          <header>
            <i>5</i>
            <div>
              <h2>Try Independently</h2>
              <p>
                Convert the following number from Indian system to International
                system.
              </p>
            </div>
          </header>
          <output>7,89,65,432</output>
          <input
            aria-label="International conversion answer"
            value={practice}
            onChange={(e) => {
              setPractice(e.target.value);
              setPracticeGrade(null);
            }}
          />
          <button
            onClick={() =>
              act(() =>
                setPracticeGrade(practice.replace(/,/g, "") === "78965432"),
              )
            }
          >
            <CheckCircle2 /> Check Answer
          </button>
          <button onClick={() => act(() => setShowAnswer((v) => !v))}>
            Show Answer
          </button>
          <p>
            {showAnswer
              ? "78,965,432 — Seventy-Eight Million Nine Hundred Sixty-Five Thousand Four Hundred Thirty-Two"
              : practiceGrade === null
                ? "Your answer will appear here."
                : practiceGrade
                  ? "Correct grouping."
                  : "Regroup from the right in sets of three."}
          </p>
        </article>
        <article>
          <h2>Challenge (Level 1)</h2>
          <p>
            Write the International number name for: <b>9,81,23,456</b>
          </p>
          {challengeOptions.map((option, i) => (
            <button
              className={choice === i ? "selected" : ""}
              onClick={() =>
                act(() => {
                  setChoice(i);
                  setChoiceGrade(i === 2);
                })
              }
              key={option}
            >
              <i>{String.fromCharCode(65 + i)}</i>
              {option}
            </button>
          ))}
          {choiceGrade !== null && (
            <output>
              {choiceGrade
                ? "Correct: 98,123,456."
                : "Check the lakh and crore groups again."}
            </output>
          )}
        </article>
      </section>
      <section className="nn10002-mistake">
        <b>Common Mistake</b>
        <p>
          Do not compare only by subtraction when the concept asks for a
          conversion or naming. Always change the grouping first, then write the
          number name.
        </p>
        <span>
          Avoid by:
          <br />
          First group, then name.
        </span>
      </section>
      <nav className="nn10002-adjacent">
        {adjacent.previous ? (
          <Link to={adjacent.previous.route}>
            ← Previous Lesson<b>{adjacent.previous.title}</b>
          </Link>
        ) : (
          <span />
        )}
        <Link to="/lessons/school">Back to Lessons</Link>
        {adjacent.next ? (
          <Link to={adjacent.next.route}>
            Next Lesson →<b>{adjacent.next.title}</b>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </section>
  );
}
