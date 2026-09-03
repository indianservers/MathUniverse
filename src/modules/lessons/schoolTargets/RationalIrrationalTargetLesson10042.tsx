import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  Scale,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useState } from "react";
import type { DragEvent } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./RationalIrrationalTargetLesson10042.css";

type Kind = "rational" | "irrational";
type Evidence = "fraction" | "recurring" | "nonrepeating";
type Card = { id: string; label: string; kind: Kind; evidence: Evidence };

const cards: Card[] = [
  { id: "sqrt2", label: "√2", kind: "irrational", evidence: "nonrepeating" },
  { id: "pi", label: "π", kind: "irrational", evidence: "nonrepeating" },
  { id: "0375", label: "0.375", kind: "rational", evidence: "fraction" },
  { id: "027", label: "0.2727…", kind: "rational", evidence: "recurring" },
  { id: "sqrt49", label: "√49", kind: "rational", evidence: "fraction" },
  { id: "sqrt5", label: "√5", kind: "irrational", evidence: "nonrepeating" },
  {
    id: "nonrepeat",
    label: "0.1010010001…",
    kind: "irrational",
    evidence: "nonrepeating",
  },
  { id: "23", label: "2.3̅", kind: "rational", evidence: "recurring" },
];
const challenge = [cards[4], cards[5], cards[6], cards[7]];
const tabs = ["Interact", "Learn", "Example", "Formula", "Practice"];

export default function RationalIrrationalTargetLesson10042({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [placements, setPlacements] = useState<Record<string, Kind>>({});
  const [evidence, setEvidence] = useState<Record<string, Evidence>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [tab, setTab] = useState("Interact");
  const [challengeAnswers, setChallengeAnswers] = useState<
    Record<string, { kind?: Kind; evidence?: Evidence }>
  >({});
  const [challengeChecked, setChallengeChecked] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [actions, setActions] = useState(0);
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const placedCards = cards.filter((card) => placements[card.id]);
  const correct = placedCards.filter(
    (card) =>
      placements[card.id] === card.kind && evidence[card.id] === card.evidence,
  ).length;
  const incorrect = placedCards.filter(
    (card) =>
      evidence[card.id] &&
      (placements[card.id] !== card.kind ||
        evidence[card.id] !== card.evidence),
  ).length;
  const remaining = cards.length - placedCards.length;
  const place = (id: string, kind: Kind) =>
    act(() => {
      setPlacements((p) => ({ ...p, [id]: kind }));
      setSelected(id);
    });
  const drop = (event: DragEvent, kind: Kind) => {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/card");
    if (id) place(id, kind);
  };
  const reset = () =>
    act(() => {
      setPlacements({});
      setEvidence({});
      setSelected(null);
    });
  const selectedCard = cards.find((card) => card.id === selected);
  const challengeCorrect = challenge.every(
    (card) =>
      challengeAnswers[card.id]?.kind === card.kind &&
      challengeAnswers[card.id]?.evidence === card.evidence,
  );

  return (
    <section
      className="ri10042-page"
      data-testid="school-mockup-0716"
      data-object-model="dedicated-rational-irrational-drag-evidence-engine"
      data-correct={correct}
      data-incorrect={incorrect}
      data-remaining={remaining}
      data-selected={selected ?? "none"}
      data-challenge={challengeChecked ? String(challengeCorrect) : "idle"}
      data-actions={actions}
    >
      <header className="ri10042-hero">
        <small>CLASS 9 · REAL NUMBERS</small>
        <h1>Rational and Irrational Classification</h1>
        <p>
          <b>Objective:</b> Classify real numbers as rational or irrational
          using exact definitions and representations.
        </p>
        <div>
          <span>◷ 18 min</span>
          <span>▥ INTERMEDIATE</span>
          <span>CONCEPT</span>
          <span>♙ Real Numbers</span>
        </div>
        <Link to="/lessons/school">
          <ArrowLeft /> Lesson overview
        </Link>
      </header>
      <nav className="ri10042-tabs">
        {tabs.map((item) => (
          <button
            key={item}
            className={tab === item ? "active" : ""}
            onClick={() => act(() => setTab(item))}
          >
            {item}
          </button>
        ))}
      </nav>
      <main className="ri10042-main">
        <section className="ri10042-sort">
          <header>
            <div>
              <h2>♙ CLASSIFY &amp; JUSTIFY</h2>
              <p>
                Drag each number card into the correct region. Then open its
                evidence panel and select the correct justification.
              </p>
            </div>
            <button onClick={reset}>
              <RotateCcw /> Reset all
            </button>
          </header>
          <div className="ri-definitions">
            <p>
              <i /> <b>Rational:</b> can be written as p/q, where p, q are
              integers and q ≠ 0.
            </p>
            <p>
              <i /> <b>Irrational:</b> decimal form is non-terminating and
              non-recurring.
            </p>
          </div>
          <div className="ri-dropzones">
            <DropZone
              kind="rational"
              cards={placedCards.filter((c) => placements[c.id] === "rational")}
              onDrop={drop}
              onSelect={setSelected}
            />
            <DropZone
              kind="irrational"
              cards={placedCards.filter(
                (c) => placements[c.id] === "irrational",
              )}
              onDrop={drop}
              onSelect={setSelected}
            />
          </div>
          <div className="ri-tray">
            <h3>DRAG THESE NUMBER CARDS</h3>
            <div>
              {cards
                .filter((c) => !placements[c.id])
                .map((card) => (
                  <button
                    key={card.id}
                    draggable
                    onDragStart={(e) =>
                      e.dataTransfer.setData("text/card", card.id)
                    }
                    onClick={() =>
                      act(() =>
                        setSelected(selected === card.id ? null : card.id),
                      )
                    }
                    className={selected === card.id ? "selected" : ""}
                  >
                    ⠿ <b>{card.label}</b>
                  </button>
                ))}
            </div>
            {selectedCard && !placements[selectedCard.id] ? (
              <aside>
                <span>Place {selectedCard.label}:</span>
                <button onClick={() => place(selectedCard.id, "rational")}>
                  Rational
                </button>
                <button onClick={() => place(selectedCard.id, "irrational")}>
                  Irrational
                </button>
              </aside>
            ) : null}
          </div>
          <section className="ri-evidence">
            <header>
              <h3>▣ EVIDENCE PANEL (SELECT A CARD ABOVE)</h3>
              <span>★ Evidence required for full credit</span>
            </header>
            <p>
              {selectedCard
                ? `Choose why ${selectedCard.label} belongs in its region.`
                : "Open the panel for any placed card to see and choose the correct justification."}
            </p>
            <div>
              {(["fraction", "recurring", "nonrepeating"] as Evidence[]).map(
                (type) => (
                  <button
                    key={type}
                    disabled={!selectedCard}
                    className={
                      selectedCard && evidence[selectedCard.id] === type
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      selectedCard &&
                      act(() =>
                        setEvidence((e) => ({ ...e, [selectedCard.id]: type })),
                      )
                    }
                  >
                    <b>
                      {type === "fraction"
                        ? "FRACTION FORM"
                        : type === "recurring"
                          ? "TERMINATING/RECURRING DECIMAL"
                          : "NON-REPEATING DECIMAL"}
                    </b>
                    <span>
                      {type === "fraction"
                        ? "Can be written exactly as p/q, where p, q are integers and q ≠ 0."
                        : type === "recurring"
                          ? "Decimal terminates or repeats in a pattern."
                          : "Decimal is non-terminating and non-recurring."}
                    </span>
                    <small>
                      {type === "fraction"
                        ? "Example: 0.375 = 3/8"
                        : type === "recurring"
                          ? "Example: 0.2727… = 3/11"
                          : "Examples: √2, π"}
                    </small>
                  </button>
                ),
              )}
            </div>
          </section>
          <footer className={incorrect ? "has-error" : ""}>
            <CheckCircle2 />
            <b>{incorrect ? "Keep checking" : "Great!"}</b>
            <span>
              {placedCards.length
                ? "Classification and evidence are checked together."
                : "Start by sorting a number card."}
            </span>
            <em>{correct} correct</em>
            <em>{incorrect} incorrect</em>
            <em>{remaining} remaining</em>
          </footer>
        </section>
        <section className="ri10042-theory">
          <article>
            <h2>WHY IT WORKS</h2>
            <p>
              Rational numbers can be counted or measured with a finite or
              repeating decimal.
            </p>
            <p>
              Irrational numbers cannot be expressed as p/q and their decimals
              go on forever without repeating.
            </p>
            <div className="ri-line">←●—●—●—●—●—●—●→</div>
            <small>
              ● Rational <span>● Irrational</span>
            </small>
          </article>
          <article>
            <h2>▣ WORKED EXAMPLE</h2>
            <p>Classify √2 and 0.375.</p>
            <b>Solution:</b>
            <p>
              √2 is irrational because its decimal form is non-terminating,
              non-recurring.
            </p>
            <p>0.375 = 375/1000 = 3/8, so it is rational.</p>
            <strong>Result: √2 is irrational; 0.375 is rational.</strong>
          </article>
          <article className="warning">
            <h2>⚠ COMMON MISCONCEPTION</h2>
            <b>
              Every non-terminating decimal is not irrational; recurring
              decimals are rational.
            </b>
            <p>
              0.272727… = 0.27̅ = 27/99 = 3/11 is rational, even though it goes
              on forever.
            </p>
          </article>
        </section>
        <section className="ri10042-challenge">
          <header>
            <div>
              <h2>
                <Trophy /> MINI CHALLENGE
              </h2>
              <p>Sort and justify these numbers.</p>
            </div>
            <button onClick={() => act(() => setShowSolution(!showSolution))}>
              <Sparkles />
              {showSolution ? "Hide solution" : "Show solution"}
            </button>
          </header>
          <div>
            {challenge.map((card, index) => (
              <article key={card.id}>
                <h3>
                  <b>{index + 1}</b>
                  {card.label}
                </h3>
                <label>
                  Classify:
                  <select
                    aria-label={`${card.label} classification`}
                    value={challengeAnswers[card.id]?.kind ?? ""}
                    onChange={(e) =>
                      act(() =>
                        setChallengeAnswers((a) => ({
                          ...a,
                          [card.id]: {
                            ...a[card.id],
                            kind: e.target.value as Kind,
                          },
                        })),
                      )
                    }
                  >
                    <option value="">Select</option>
                    <option value="rational">Rational</option>
                    <option value="irrational">Irrational</option>
                  </select>
                </label>
                <label>
                  Justify:
                  <select
                    aria-label={`${card.label} reasoning`}
                    value={challengeAnswers[card.id]?.evidence ?? ""}
                    onChange={(e) =>
                      act(() =>
                        setChallengeAnswers((a) => ({
                          ...a,
                          [card.id]: {
                            ...a[card.id],
                            evidence: e.target.value as Evidence,
                          },
                        })),
                      )
                    }
                  >
                    <option value="">Select reasoning</option>
                    <option value="fraction">Fraction form</option>
                    <option value="recurring">Terminating/recurring</option>
                    <option value="nonrepeating">Non-repeating decimal</option>
                  </select>
                </label>
                {showSolution ? (
                  <small>
                    {card.kind}; {card.evidence}
                  </small>
                ) : null}
              </article>
            ))}
          </div>
          <button
            className="ri-check"
            onClick={() => act(() => setChallengeChecked(true))}
          >
            Check challenge
          </button>
          {challengeChecked ? (
            <p className={challengeCorrect ? "correct" : "retry"}>
              {challengeCorrect
                ? "All four classifications and reasons are correct."
                : "Some choices need another look."}
            </p>
          ) : null}
        </section>
      </main>
      <nav className="ri10042-adjacent">
        <Link to="/lessons/school/class-9/class-9-real-numbers-number-line-and-order">
          <ArrowLeft /> Previous: Number Line &amp; Order
        </Link>
        <Link to="/lessons/school">Lesson overview</Link>
        <Link to="/lessons/school/class-9/class-9-real-numbers-practice-problems">
          Next: Practice Problems <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}

function DropZone({
  kind,
  cards: onCards,
  onDrop,
  onSelect,
}: {
  kind: Kind;
  cards: Card[];
  onDrop: (event: DragEvent, kind: Kind) => void;
  onSelect: (id: string) => void;
}) {
  return (
    <article
      className={kind}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(e, kind)}
    >
      <h2>{kind.toUpperCase()} NUMBERS</h2>
      <p>
        {kind === "rational"
          ? "Can be written as p/q, (q ≠ 0)"
          : "Decimal is non-terminating and non-recurring"}
      </p>
      <div>
        <Scale />
        <strong>Drop {kind} number cards here</strong>
        {onCards.map((card) => (
          <button key={card.id} onClick={() => onSelect(card.id)}>
            {card.label}
          </button>
        ))}
      </div>
    </article>
  );
}
