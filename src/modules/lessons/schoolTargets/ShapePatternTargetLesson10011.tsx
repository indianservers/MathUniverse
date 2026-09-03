import { CheckCircle2, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { schoolLessonCatalog } from "../catalog/school/schoolSyllabusCatalog";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./ShapePatternTargetLesson10011.css";
const total = (n: number) => 2 * n - 1;
function Tiles({ n, showAdded = true }: { n: number; showAdded?: boolean }) {
  return (
    <span className="sp10011-tiles">
      {Array.from({ length: total(n) }, (_, i) => (
        <i
          className={showAdded && n > 1 && i >= total(n) - 2 ? "added" : ""}
          key={i}
        />
      ))}
    </span>
  );
}
export default function ShapePatternTargetLesson10011({
  lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [n, setN] = useState(4),
    [showAdded, setShowAdded] = useState(true),
    [answer, setAnswer] = useState("29"),
    [graded, setGraded] = useState<boolean | null>(true),
    [explanation, setExplanation] = useState(false),
    [tab, setTab] = useState("Interact"),
    [actions, setActions] = useState(0);
  const act = (fn: () => void) => {
      fn();
      setActions((v) => v + 1);
    },
    idx = schoolLessonCatalog.findIndex((x) => x.id === lesson.id),
    prev = schoolLessonCatalog[idx - 1],
    next = schoolLessonCatalog[idx + 1],
    check = () => act(() => setGraded(Number(answer) === total(15))),
    reset = () =>
      act(() => {
        setN(4);
        setShowAdded(true);
        setAnswer("29");
        setGraded(true);
        setExplanation(false);
      });
  return (
    <section
      className="sp10011-page"
      data-testid="school-mockup-0685"
      data-object-model="dedicated-growing-odd-tile-pattern-breakdown-and-rule-model"
      data-figure={n}
      data-total={total(n)}
      data-added={n === 1 ? 1 : 2}
      data-show-added={showAdded}
      data-graded={graded === null ? "" : graded}
      data-actions={actions}
    >
      <header className="sp10011-hero">
        <small>CLASS 6 · PATTERNS</small>
        <h1>Shape Pattern Completion</h1>
        <p>
          <b>Objective:</b> Represent the given shape pattern, read the total
          number of tiles (pieces) and find the rule that connects figure number
          (n) to total number of tiles (T).
        </p>
        <dl>
          <span>18 min</span>
          <span>FOUNDATION</span>
          <span>CONCEPT</span>
          <span>learning</span>
        </dl>
        <aside>
          <h2>Lesson overview</h2>
          <p>
            Class: 6
            <br />
            Topic: Patterns
            <br />
            Skill: Shape pattern completion
            <br />
            Concept: Number relationship
          </p>
        </aside>
      </header>
      <nav className="sp10011-tabs">
        {["Interact", "Learn", "Worked Example", "Formula", "Practice"].map(
          (x) => (
            <button
              className={tab === x ? "active" : ""}
              onClick={() => act(() => setTab(x))}
              key={x}
            >
              {x}
            </button>
          ),
        )}
      </nav>
      <section className="sp10011-observe">
        <header>
          <h2>1 OBSERVE & MANIPULATE</h2>
          <p>Use the slider to see how the pattern grows.</p>
          <button onClick={reset}>
            <RotateCcw />
            Reset
          </button>
        </header>
        <div className="figures">
          {[1, 2, 3, 4, 5].map((value) => (
            <article key={value}>
              <b>Figure {value}</b>
              <Tiles n={value} showAdded={showAdded && value === n} />
            </article>
          ))}
        </div>
        <footer>
          <label>
            Select term (n) <b>{n}</b>
            <input
              aria-label="Figure number"
              type="range"
              min="1"
              max="6"
              value={n}
              onChange={(e) => act(() => setN(Number(e.target.value)))}
            />
          </label>
          <strong>
            n = {n}
            <small>Figure {n}</small>
          </strong>
          <label>
            Show added pieces{" "}
            <input
              aria-label="Show added pieces"
              type="checkbox"
              checked={showAdded}
              onChange={(e) => act(() => setShowAdded(e.target.checked))}
            />
            <i className="added" />
            Added in this step
            <i />
            Already present
          </label>
        </footer>
      </section>
      <section className="sp10011-middle">
        <article>
          <h2>2 COUNT TABLE</h2>
          <p>Read the total number of tiles.</p>
          <table>
            <thead>
              <tr>
                <th>Figure (n)</th>
                <th>New tiles added</th>
                <th>Total tiles (T)</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5, 6].map((value) => (
                <tr className={value === n ? "active" : ""} key={value}>
                  <td>{value}</td>
                  <td>{value === 1 ? 1 : "+2"}</td>
                  <td>{total(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <aside>
            Notice: After the first step, 2 tiles are added each time.
          </aside>
        </article>
        <article>
          <h2>3 VISUAL BREAKDOWN</h2>
          <p>
            Figure {n} has {total(n)} tiles.
          </p>
          <div>
            <b>Added in this step = {n === 1 ? 1 : 2}</b>
            <Tiles n={n} showAdded={showAdded} />
            <strong>
              Total
              <br />T = {total(n)}
            </strong>
            <small>
              Already present from previous step = {Math.max(0, total(n) - 2)}
            </small>
          </div>
          <p>
            So, T = {n === 1 ? 1 : `${total(n) - 2} + 2`} = {total(n)}
          </p>
        </article>
      </section>
      <section className="sp10011-rules">
        <article>
          <h2>4 UNDERSTAND THE RULE</h2>
          <p>The total number of tiles (T) depends on the figure number (n).</p>
          <strong>T = 2n − 1</strong>
          <p>Each figure has one less than twice the figure number tiles.</p>
          {[1, 2, 3, 4].map((value) => (
            <p key={value}>
              ✓ n = {value} → T = 2({value}) − 1 = {total(value)} ✓
            </p>
          ))}
        </article>
        <article>
          <h2>⚠ COMMON MISCONCEPTION</h2>
          <b>Mistake: Adding the figure number to the previous total.</b>
          <p>If n = 4, the wrong method gives 1 + 2 + 3 + 4 = 10 ✕</p>
          <aside>
            <b>Why it's wrong:</b>
            <p>
              Only 2 new tiles are added after the first step. The total follows
              T = 2n − 1.
            </p>
          </aside>
        </article>
      </section>
      <section className="sp10011-lower">
        <article>
          <h2>5 WORKED EXAMPLE</h2>
          <p>
            <b>Question:</b> How many tiles are in Figure 10?
          </p>
          <p>
            <b>Solution:</b>
            <br />
            Use T = 2n − 1.
            <br />
            For n = 10,
          </p>
          <strong>T = 2(10) − 1 = 19</strong>
          <p>
            <b>Answer:</b> Figure 10 has 19 tiles.
          </p>
          <p>✓ Check: Pattern grows by 2 each time after the first step.</p>
        </article>
        <article>
          <h2>6 TRY IT YOURSELF</h2>
          <p>Find the total number of tiles.</p>
          <label>
            n = 15{" "}
            <input
              aria-label="Tile answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            {graded && <CheckCircle2 />}
          </label>
          <button onClick={check}>Check answer</button>
          {graded !== null && (
            <output>{graded ? "Correct" : "Use T = 2n − 1"}</output>
          )}
          <p>
            <b>Hint:</b> Use the rule T = 2n − 1.
          </p>
          <button onClick={() => act(() => setExplanation((v) => !v))}>
            Show explanation
          </button>
          {explanation && <p>2 × 15 − 1 = 29 tiles.</p>}
        </article>
      </section>
      <nav className="sp10011-adjacent">
        <Link to={prev.route}>
          ← Previous lesson<b>{prev.title}</b>
        </Link>
        <Link to={next.route}>
          Next lesson →<b>{next.title}</b>
        </Link>
      </nav>
    </section>
  );
}
