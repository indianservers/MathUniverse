import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleHelp,
  RotateCcw,
  TriangleAlert,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./EuclideanFoundationsTargetLesson10053.css";

type Category =
  "Definitions" | "Common Notions (Axioms)" | "Geometric Postulates";
type Card = { id: number; text: string; category: Category };
const cards: Card[] = [
  {
    id: 1,
    text: "A line segment can be drawn joining any two points.",
    category: "Definitions",
  },
  {
    id: 2,
    text: "Things equal to the same thing are equal.",
    category: "Common Notions (Axioms)",
  },
  {
    id: 3,
    text: "All right angles are equal to each other.",
    category: "Geometric Postulates",
  },
  {
    id: 4,
    text: "Through a given point not on a given line, exactly one line can be drawn parallel to the given line.",
    category: "Geometric Postulates",
  },
  {
    id: 5,
    text: "A circle can be drawn with any center and any radius.",
    category: "Definitions",
  },
  {
    id: 6,
    text: "If equals are added to equals, the wholes are equal.",
    category: "Common Notions (Axioms)",
  },
];
const initial = Object.fromEntries(
  cards.map((card) => [card.id, card.category]),
) as Record<number, Category>;
const categoryCopy: Record<Category, string> = {
  Definitions: "Explain terms.",
  "Common Notions (Axioms)": "General truths accepted without proof.",
  "Geometric Postulates": "Geometry-specific assumptions about space.",
};

export default function EuclideanFoundationsTargetLesson10053({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [assignments, setAssignments] =
    useState<Record<number, Category>>(initial);
  const [tab, setTab] = useState("Interact");
  const [checked, setChecked] = useState(true);
  const [answers, setAnswers] = useState(["", ""]);
  const [challengeChecked, setChallengeChecked] = useState(false);
  const [actions, setActions] = useState(0);
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const correct = cards.filter(
    (card) => assignments[card.id] === card.category,
  ).length;
  const challengeScore = [
    /postulate|accepted|assumed/i.test(answers[0]),
    /axiom|postulate|accepted|without proof/i.test(answers[1]),
  ].filter(Boolean).length;
  const place = (id: number, category: Category) =>
    act(() => {
      setChecked(false);
      setAssignments((current) => ({ ...current, [id]: category }));
    });
  const reset = () =>
    act(() => {
      setAssignments({});
      setChecked(false);
    });
  const restore = () =>
    act(() => {
      setAssignments(initial);
      setChecked(true);
    });

  return (
    <section
      className="ef10053-page"
      data-testid="school-mockup-0727"
      data-object-model="dedicated-euclidean-statement-classification-dependency-and-justification-engine"
      data-correct={correct}
      data-total="6"
      data-checked={String(checked)}
      data-challenge-score={challengeChecked ? challengeScore : "idle"}
      data-actions={actions}
    >
      <header className="ef10053-hero">
        <small>CLASS 9 · EUCLIDEAN GEOMETRY</small>
        <h1>Definitions, Axioms and Postulates</h1>
        <p>
          Clarify the building blocks of Euclidean geometry and how they
          connect.
        </p>
        <div>
          <span>30 min</span>
          <span>RIGOROUS</span>
          <span>PROOF</span>
          <span>geometry2d</span>
        </div>
        <Link to="/lessons/school">
          <ArrowLeft /> School Lessons
        </Link>
      </header>
      <nav className="ef10053-tabs">
        {["Interact", "Learn", "Example", "Formula", "Practice"].map((item) => (
          <button
            key={item}
            className={tab === item ? "active" : ""}
            aria-selected={tab === item}
            onClick={() => act(() => setTab(item))}
          >
            {item}
          </button>
        ))}
      </nav>
      <main>
        <section className="ef10053-studio">
          <header>
            <div>
              <h2>CLASSIFICATION STUDIO</h2>
              <b>Sort each statement into the correct category.</b>
            </div>
            <button onClick={reset}>
              <RotateCcw /> Reset
            </button>
            <button onClick={() => act(() => setChecked(true))}>
              <Check /> Check
            </button>
          </header>
          <div className="ef10053-sort">
            <article className="ef10053-source">
              <h3>DRAG THESE STATEMENTS</h3>
              <small>6 cards</small>
              {cards.map((card) => (
                <button
                  key={card.id}
                  draggable
                  onDragStart={(e) =>
                    e.dataTransfer.setData("card", String(card.id))
                  }
                  onClick={() => place(card.id, card.category)}
                >
                  ⠿ <span>{card.text}</span>
                </button>
              ))}
              <p>Drag cards to the categories →</p>
            </article>
            {(Object.keys(categoryCopy) as Category[]).map((category) => (
              <article
                className="ef10053-category"
                key={category}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) =>
                  place(Number(e.dataTransfer.getData("card")), category)
                }
              >
                <header>
                  <h3>{category.toUpperCase()}</h3>
                  <b>
                    {
                      cards.filter(
                        (c) =>
                          assignments[c.id] === category &&
                          c.category === category,
                      ).length
                    }
                    /2
                  </b>
                </header>
                <p>{categoryCopy[category]}</p>
                <div className="ef10053-drop">Drop here</div>
                {cards
                  .filter((card) => assignments[card.id] === category)
                  .map((card) => (
                    <button
                      key={card.id}
                      className={card.category === category ? "right" : "wrong"}
                      onClick={() =>
                        act(() => {
                          setChecked(false);
                          setAssignments((current) => {
                            const next = { ...current };
                            delete next[card.id];
                            return next;
                          });
                        })
                      }
                    >
                      {card.text}
                      {card.category === category && <Check />}
                    </button>
                  ))}
              </article>
            ))}
          </div>
          {checked && correct === 6 ? (
            <footer>
              <Check /> Excellent! All statements are correctly classified.
            </footer>
          ) : (
            <footer className="pending" onClick={restore}>
              {checked
                ? `${correct} of 6 are correct. Click to restore the model.`
                : "Classify every card, then check your work."}
            </footer>
          )}
        </section>

        <section className="ef10053-middle">
          <article className="ef10053-map">
            <h2>
              DEFINITION DEPENDENCY MAP <CircleHelp />
            </h2>
            <p>Shows how definitions build on each other.</p>
            <div className="ef10053-mapgrid">
              <span className="point">
                <b>Point</b>A location with no size.
              </span>
              <i>↙</i>
              <i>↘</i>
              <span className="line">
                <b>Line</b>A straight path extending infinitely in both
                directions.
              </span>
              <span className="segment">
                <b>Line Segment</b>A part of a line between two points.
              </span>
              <i>↘</i>
              <i>↙</i>
              <span className="circle">
                <b>Circle</b>All points in a plane at a fixed distance (radius)
                from a center.
              </span>
            </div>
            <footer>
              ⟶ directly defined &nbsp;&nbsp;&nbsp; ⇢ uses / depends on
            </footer>
          </article>
          <article className="ef10053-evidence">
            <h2>AXIOM / POSTULATE EVIDENCE</h2>
            <p>Why we accept these without proof.</p>
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Statement (from above)</th>
                  <th>Why accepted?</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <b>Axiom</b>
                  </td>
                  <td>Things equal to the same thing are equal.</td>
                  <td>✓ Observed in all mathematics and daily life.</td>
                </tr>
                <tr>
                  <td>
                    <b>Axiom</b>
                  </td>
                  <td>If equals are added to equals, the wholes are equal.</td>
                  <td>✓ Arithmetic truth—consistent with all numbers.</td>
                </tr>
                <tr>
                  <td>
                    <b>Postulate</b>
                  </td>
                  <td>All right angles are equal to each other.</td>
                  <td>
                    ✓ Measured in practice; assumed as a property of space.
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Postulate</b>
                  </td>
                  <td>
                    Through a given point not on a given line, exactly one line
                    can be drawn parallel.
                  </td>
                  <td>✓ Empirical fact about the Euclidean plane.</td>
                </tr>
              </tbody>
            </table>
          </article>
        </section>

        <section className="ef10053-lower">
          <article>
            <h2>WORKED EXAMPLE</h2>
            <p>
              <b>Statement:</b> Things equal to the same thing are equal.
            </p>
            <p>
              <b>Classification:</b> ✅ Common Notion (Axiom)
            </p>
            <p>
              <b>Why:</b> It holds for all numbers and magnitudes in every
              situation. It does not refer to geometric figures or positions.
            </p>
            <p>
              <b>Symbolically:</b> If a=b and b=c, then a=c.
            </p>
          </article>
          <article className="ef10053-warning">
            <h2>
              <TriangleAlert /> MISCONCEPTION WARNING
            </h2>
            <strong>
              A theorem is proved.
              <br />
              An axiom or postulate is assumed.
            </strong>
            <div>
              <span>
                Axiom / Postulate
                <br />
                (assumed)
              </span>
              <b>→</b>
              <span>
                Theorem
                <br />
                (proved)
              </span>
            </div>
            <p>Never try to prove an axiom or postulate—use it.</p>
          </article>
          <article className="ef10053-challenge">
            <h2>CHALLENGE</h2>
            <p>Borderline? Justify your choice.</p>
            {[
              "Is “A circle can be drawn with any center and any radius.” a definition or a postulate? Why?",
              "Is “All right angles are equal to each other.” an axiom or a theorem? Why?",
            ].map((question, i) => (
              <label key={question}>
                <b>{i + 1}</b>
                <span>{question}</span>
                <textarea
                  aria-label={`Justification ${i + 1}`}
                  placeholder="Your justification..."
                  value={answers[i]}
                  onChange={(e) =>
                    act(() =>
                      setAnswers((current) =>
                        current.map((value, index) =>
                          index === i ? e.target.value : value,
                        ),
                      ),
                    )
                  }
                />
              </label>
            ))}
            <button onClick={() => act(() => setChallengeChecked(true))}>
              Check my answers
            </button>
            {challengeChecked && (
              <strong className={challengeScore === 2 ? "right" : "retry"}>
                {challengeScore}/2 justified correctly
              </strong>
            )}
          </article>
        </section>
      </main>
      <nav className="ef10053-adjacent">
        <Link to="/lessons/school">
          <ArrowLeft />
          <span>
            Previous Lesson<b>Introduction to Euclidean Geometry</b>
          </span>
        </Link>
        <Link to="/lessons/school">
          <span>
            Next Lesson<b>Euclid's Five Postulates</b>
          </span>
          <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}
