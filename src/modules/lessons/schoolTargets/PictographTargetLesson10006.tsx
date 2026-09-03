import { CheckCircle2, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { schoolLessonCatalog } from "../catalog/school/schoolSyllabusCatalog";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./PictographTargetLesson10006.css";

const categories = ["Apples", "Bananas", "Mangoes", "Oranges"] as const;
const icons = ["🍎", "🍌", "🥭", "🍊"];
const challengeDays = ["Monday", "Tuesday", "Wednesday", "Thursday"] as const;
const expectedChallenge = [14, 10, 6, 8];

function PictureRun({
  count,
  unit,
  icon,
}: {
  count: number;
  unit: number;
  icon: string;
}) {
  const full = Math.floor(count / unit);
  const half = count % unit >= unit / 2;
  return (
    <span className="pg10006-run">
      {Array.from({ length: full }, (_, index) => (
        <i key={index}>{icon}</i>
      ))}
      {half && <i className="half">{icon}</i>}
    </span>
  );
}

export default function PictographTargetLesson10006({
  lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [counts, setCounts] = useState([7, 5, 3, 9]);
  const [keyValue, setKeyValue] = useState(1);
  const [customKey, setCustomKey] = useState(1);
  const [activeTab, setActiveTab] = useState("Interact");
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [countGrade, setCountGrade] = useState<boolean | null>(null);
  const [challenge, setChallenge] = useState([0, 0, 0, 0]);
  const [challengeGrade, setChallengeGrade] = useState<boolean | null>(null);
  const [actions, setActions] = useState(0);
  const lessonIndex = schoolLessonCatalog.findIndex(
    (item) => item.id === lesson.id,
  );
  const previous =
    lessonIndex > 0 ? schoolLessonCatalog[lessonIndex - 1] : null;
  const next =
    lessonIndex < schoolLessonCatalog.length - 1
      ? schoolLessonCatalog[lessonIndex + 1]
      : null;
  const totalIcons = useMemo(
    () => counts.reduce((sum, count) => sum + count / keyValue, 0),
    [counts, keyValue],
  );
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const addToCategory = (amount: number, category = selectedCategory) =>
    act(() =>
      setCounts((values) =>
        values.map((value, index) =>
          index === category ? Math.max(0, value + amount) : value,
        ),
      ),
    );
  const addChallenge = (day: number, amount: number) =>
    act(() =>
      setChallenge((values) =>
        values.map((value, index) => (index === day ? value + amount : value)),
      ),
    );
  const dropAmount = (
    event: React.DragEvent,
    callback: (amount: number) => void,
  ) => {
    event.preventDefault();
    callback(Number(event.dataTransfer.getData("text/plain")));
  };
  return (
    <section
      className="pg10006-page"
      data-testid="school-mockup-0680"
      data-object-model="dedicated-draggable-keyed-pictograph-and-row-challenge-model"
      data-key={keyValue}
      data-counts={counts.join(",")}
      data-total-icons={totalIcons}
      data-count-graded={countGrade === null ? "" : countGrade}
      data-challenge={challenge.join(",")}
      data-challenge-graded={challengeGrade === null ? "" : challengeGrade}
      data-actions={actions}
    >
      <header className="pg10006-hero">
        <small>CLASS 6 · DATA HANDLING</small>
        <h1>
          Pictograph Builder <b>Interact</b>
        </h1>
        <p>
          <strong>Objective:</strong> Represent data using a pictograph and
          interpret it correctly.
        </p>
        <dl>
          <span>18 min</span>
          <span>FOUNDATION</span>
          <span>CONCEPT</span>
          <span>graph</span>
          <span>Class 6</span>
        </dl>
        <aside>
          <Link to="/lessons/school">← Back to lesson list</Link>
          <div>
            <b>Lesson Progress</b>
            <i>
              <em />
            </i>
            <small>2 / 5 Done</small>
          </div>
        </aside>
      </header>
      <nav className="pg10006-tabs">
        {["Interact", "Learn", "Worked Example", "Formula", "Practice"].map(
          (tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => act(() => setActiveTab(tab))}
            >
              {tab}
            </button>
          ),
        )}
      </nav>
      <section className="pg10006-builder">
        <article className="pg10006-controls">
          <h2>1 OBSERVE & MANIPULATE</h2>
          <h3>Build a pictograph</h3>
          <p>
            Enter the counts for each category, choose a key, then use the icons
            to build the pictograph. Counts update automatically.
          </p>
          <div className="pg10006-controlgrid">
            <fieldset>
              <legend>Enter counts</legend>
              {categories.map((category, index) => (
                <label key={category}>
                  {category}
                  <input
                    aria-label={`${category} count`}
                    type="number"
                    min="0"
                    value={counts[index]}
                    onChange={(event) =>
                      act(() =>
                        setCounts((values) =>
                          values.map((value, item) =>
                            item === index ? Number(event.target.value) : value,
                          ),
                        ),
                      )
                    }
                  />
                </label>
              ))}
            </fieldset>
            <fieldset>
              <legend>Choose a key (icon represents)</legend>
              {[1, 2, 5].map((value, index) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="picture-key"
                    checked={keyValue === value}
                    onChange={() => act(() => setKeyValue(value))}
                  />
                  {icons[index]} <b>{value}</b> fruit{value > 1 ? "s" : ""}
                </label>
              ))}
              <label>
                <input
                  type="radio"
                  name="picture-key"
                  checked={![1, 2, 5].includes(keyValue)}
                  onChange={() => act(() => setKeyValue(customKey))}
                />
                Custom:{" "}
                <input
                  aria-label="Custom key"
                  type="number"
                  min="1"
                  value={customKey}
                  onChange={(event) => {
                    const value = Math.max(1, Number(event.target.value));
                    setCustomKey(value);
                    act(() => setKeyValue(value));
                  }}
                />{" "}
                fruits
              </label>
            </fieldset>
          </div>
          <section className="pg10006-palette">
            <b>Icon palette (drag to the chart)</b>
            <div>
              {icons.map((icon, index) => (
                <button
                  key={icon}
                  draggable
                  onDragStart={(event) =>
                    event.dataTransfer.setData(
                      "text/plain",
                      String(index % 2 ? keyValue / 2 : keyValue),
                    )
                  }
                  onClick={() =>
                    addToCategory(index % 2 ? keyValue / 2 : keyValue)
                  }
                >
                  {icon}
                  <small>+{index % 2 ? "½" : "1"}</small>
                </button>
              ))}
            </div>
          </section>
          <div className="pg10006-actions">
            <button onClick={() => act(() => setCounts([0, 0, 0, 0]))}>
              <Trash2 />
              Clear chart
            </button>
            <button
              onClick={() =>
                act(() => setCountGrade(counts.every((value) => value >= 0)))
              }
            >
              <CheckCircle2 />
              Check counts
            </button>
          </div>
          <table>
            <caption>Current counts (auto-updated)</caption>
            <thead>
              <tr>
                {categories.map((category) => (
                  <th key={category}>{category}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {counts.map((count, index) => (
                  <td key={categories[index]}>{count}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </article>
        <article className="pg10006-chart">
          <header>
            <h2>Pictograph</h2>
            <button onClick={() => act(() => setKeyValue(1))}>
              Need a hint?
            </button>
          </header>
          <p>
            <b>Key:</b> 🍎 = {keyValue} fruit{keyValue > 1 ? "s" : ""}
          </p>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>
                  Pictograph (each icon = {keyValue} fruit
                  {keyValue > 1 ? "s" : ""})
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <tr
                  key={category}
                  className={selectedCategory === index ? "selected" : ""}
                  onClick={() => setSelectedCategory(index)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) =>
                    dropAmount(event, (amount) => addToCategory(amount, index))
                  }
                >
                  <th>{category}</th>
                  <td>
                    <PictureRun
                      count={counts[index]}
                      unit={keyValue}
                      icon={icons[index]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <aside>
            <b>Interpret the key:</b>
            <p>
              So, {counts[0]} apples means <strong>{counts[0]}</strong> fruits.
            </p>
          </aside>
        </article>
      </section>
      <section className="pg10006-concepts">
        <article>
          <h2>2 NOTICE THE PATTERN</h2>
          <b>Each full icon shows 1 unit.</b>
          <p>A half icon shows half of the key value.</p>
          <strong>🍎 ＋ 🍎 = 2 fruits</strong>
        </article>
        <i>→</i>
        <article>
          <h2>3 UNDERSTAND THE RULE</h2>
          <p>Total = (Full icons × Key) + (Half icons × Key ÷ 2)</p>
        </article>
        <i>→</i>
        <article className="warning">
          <h2>⚠ COMMON MISCONCEPTION</h2>
          <b>Do not count every half icon as 1 full icon.</b>
          <p>Half icon = Half of the key value.</p>
        </article>
        <i>→</i>
        <article className="try">
          <h2>5 TRY INDEPENDENTLY</h2>
          <p>
            <b>Challenge:</b> Build the pictograph for the data below.
          </p>
          <a href="#pg10006-challenge">Go to Challenge →</a>
        </article>
      </section>
      <section className="pg10006-theory">
        <article>
          <h2>Correct Worked Example</h2>
          <p>
            The table shows the number of books read by four students in a week.
            Represent the data using a pictograph. Use the key: ▣ = 2 books.
          </p>
          <div>
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>No. of Books</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Aarti", 6],
                  ["Bala", 2],
                  ["Chetan", 8],
                  ["Dev", 4],
                ].map(([name, value]) => (
                  <tr key={String(name)}>
                    <td>{name}</td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Pictograph</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Aarti", 3],
                  ["Bala", 1],
                  ["Chetan", 4],
                  ["Dev", 2],
                ].map(([name, value]) => (
                  <tr key={String(name)}>
                    <td>{name}</td>
                    <td>{"▣ ".repeat(Number(value))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <aside>
            Check: Aarti → 3 × 2 = 6 books, Bala → 1 × 2 = 2 books, Chetan → 4 ×
            2 = 8 books, Dev → 2 × 2 = 4 books. ✓
          </aside>
        </article>
        <aside>
          <section>
            <h2>Key Rule / Definition</h2>
            <p>A pictograph uses pictures or symbols to represent data.</p>
            <ul>
              <li>Key tells how many units each picture represents.</li>
              <li>Full icon = value of the key.</li>
              <li>Half icon = half of the key value.</li>
            </ul>
          </section>
          <section>
            <h2>Why it works</h2>
            <p>Pictures make data easy to see and compare quickly.</p>
            <strong>🍎 ＋ 🍎 = 2 units</strong>
          </section>
        </aside>
      </section>
      <section className="pg10006-challenge" id="pg10006-challenge">
        <h2>
          LESSON CHALLENGE <small>(Quick Check)</small>
        </h2>
        <p>
          The table shows the number of pencils sold by a shop on four days.
        </p>
        <div>
          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th>Pencils Sold</th>
              </tr>
            </thead>
            <tbody>
              {challengeDays.map((day, index) => (
                <tr key={day}>
                  <td>{day}</td>
                  <td>{expectedChallenge[index]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th>Pictograph (each icon = 2 pencils)</th>
              </tr>
            </thead>
            <tbody>
              {challengeDays.map((day, index) => (
                <tr
                  key={day}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) =>
                    dropAmount(event, (amount) => addChallenge(index, amount))
                  }
                >
                  <td>{day}</td>
                  <td>
                    {"✏ ".repeat(Math.floor(challenge[index] / 2))}
                    {challenge[index] % 2 ? "◐" : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th>Pencils Sold</th>
              </tr>
            </thead>
            <tbody>
              {challengeDays.map((day, index) => (
                <tr key={day}>
                  <td>{day}</td>
                  <td>{challenge[index] || "–"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <footer>
          <button
            draggable
            onDragStart={(event) =>
              event.dataTransfer.setData("text/plain", "2")
            }
          >
            ✏ +2
          </button>
          <button
            draggable
            onDragStart={(event) =>
              event.dataTransfer.setData("text/plain", "1")
            }
          >
            ✏ +1
          </button>
          <button onClick={() => act(() => setChallenge([0, 0, 0, 0]))}>
            <Trash2 />
            Clear challenge
          </button>
          <button
            onClick={() =>
              act(() =>
                setChallengeGrade(
                  challenge.every(
                    (value, index) => value === expectedChallenge[index],
                  ),
                ),
              )
            }
          >
            Check my answer
          </button>
          {challengeGrade !== null && (
            <output>
              {challengeGrade
                ? "Correct pictograph!"
                : "Counts do not match yet."}
            </output>
          )}
        </footer>
      </section>
      <nav className="pg10006-adjacent">
        {previous && (
          <Link to={previous.route}>
            ← Previous<b>{previous.title}</b>
          </Link>
        )}
        {next && (
          <Link to={next.route}>
            Next →<b>{next.title}</b>
          </Link>
        )}
      </nav>
    </section>
  );
}
