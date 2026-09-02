import { Check, Lightbulb, RotateCcw, Share2, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { DragEvent } from "react";
import type { LessonAdapterProps } from "../../types";
import "./ProofMethodsTargetLesson590.css";
type Strategy = "direct" | "contrapositive" | "contradiction" | "induction";
type Step = { id: string; text: string; reason: string };
const correct: Step[] = [
    {
      id: "define",
      text: "Let a = 2m and b = 2n, where m, n ∈ Z.",
      reason: "Definition of even",
    },
    { id: "substitute", text: "a + b = 2m + 2n.", reason: "Substitution" },
    { id: "factor", text: "a + b = 2(m + n).", reason: "Algebra: factor 2" },
    {
      id: "closure",
      text: "Since m + n ∈ Z, 2(m + n) is even.",
      reason: "Closure of even integers",
    },
    { id: "conclude", text: "Therefore a + b is even.", reason: "Conclusion" },
  ],
  wrong: Step = {
    id: "odd",
    text: "Therefore a + b is odd.",
    reason: "Invalid step",
  };
const strategies: Record<Strategy, [string, string]> = {
  direct: ["Direct proof", "Start from assumptions and prove the claim."],
  contrapositive: ["Contrapositive", "Prove the contrapositive is true."],
  contradiction: [
    "Contradiction",
    "Assume the negation and derive a contradiction.",
  ],
  induction: ["Induction", "Prove base case and inductive step."],
};
export default function ProofMethodsTargetLesson590({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [strategy, setStrategy] = useState<Strategy>("direct"),
    [placed, setPlaced] = useState<Step[]>([correct[0], correct[1], wrong]),
    [tab, setTab] = useState("Interact"),
    [challenge, setChallenge] = useState(false),
    [challengeAnswer, setChallengeAnswer] = useState(""),
    [challengeGraded, setChallengeGraded] = useState<boolean | null>(null),
    [actions, setActions] = useState(0);
  const reset = () => {
    setStrategy("direct");
    setPlaced([correct[0], correct[1], wrong]);
    setTab("Interact");
    setChallenge(false);
    setChallengeAnswer("");
    setChallengeGraded(null);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const act = (fn: () => void) => {
      fn();
      setActions((n) => n + 1);
      onInteraction();
    },
    correctCount = placed.filter(
      (step, index) => step.id === correct[index]?.id,
    ).length,
    complete = placed.length === 5 && correctCount === 5,
    available = [...correct, wrong].filter(
      (step) => !placed.some((item) => item.id === step.id),
    ),
    add = (id: string) =>
      act(() => {
        const step = [...correct, wrong].find((item) => item.id === id);
        if (step) setPlaced((current) => [...current, step]);
      }),
    drop = (event: DragEvent) => {
      event.preventDefault();
      add(event.dataTransfer.getData("text/step"));
    },
    challengeCorrect =
      /2\s*\(\s*m\s*-\s*n\s*\)|2m\s*-\s*2n/i.test(challengeAnswer) &&
      /even/i.test(challengeAnswer);
  return (
    <section
      className="pm590-page"
      data-testid="discrete-mockup-0647"
      data-object-model="dedicated-ordered-proof-construction-model"
      data-strategy={strategy}
      data-placed={placed.map((s) => s.id).join(",")}
      data-correct={correctCount}
      data-complete={complete}
      data-challenge={challengeGraded === null ? "" : challengeGraded}
      data-actions={actions}
    >
      <header className="pm590-hero">
        <span>
          <b>DISCRETE AND APPLIED MATHEMATICS</b>
          <b>PROOF METHODS</b>
        </span>
        <h1>Proof Methods – Discrete Lab</h1>
        <p>
          <b>Objective:</b> Prove that the sum of two even integers is even.
        </p>
        <dl>
          <strong>Level: Intermediate-Advanced</strong>
          <strong>Tool: Proof Strategy Studio</strong>
          <strong>Est. time: 6-10 min</strong>
        </dl>
        <aside>
          <button onClick={() => act(reset)}>
            <RotateCcw /> Reset
          </button>
          <button
            onClick={() =>
              navigator.clipboard?.writeText(
                "The sum of two even integers is even.",
              )
            }
          >
            <Share2 /> Share
          </button>
          <article>
            <b>YOUR PROGRESS</b>
            <strong>
              {Math.round((correctCount / Math.max(1, placed.length)) * 100)}%
            </strong>
            <p>
              Correct steps {correctCount} / {placed.length}
            </p>
            <p>Approach {strategies[strategy][0]}</p>
          </article>
        </aside>
      </header>
      <nav className="pm590-tabs">
        {["Interact", "Learn", "Worked Example", "Formula", "Practice"].map(
          (name) => (
            <button
              key={name}
              className={tab === name ? "active" : ""}
              onClick={() => act(() => setTab(name))}
            >
              {name}
            </button>
          ),
        )}
      </nav>
      {tab !== "Interact" && (
        <p className="pm590-note">
          <b>{tab}:</b> A proof is valid only when every inference follows from
          earlier statements.
        </p>
      )}
      <section className="pm590-studio">
        <header>
          <b>PROOF STRATEGY STUDIO</b>
          <p>
            Choose a strategy, then build a valid proof by ordering the steps.
          </p>
        </header>
        <div className="pm590-strategy">
          <aside>
            <h3>1 &nbsp; Choose a proof strategy</h3>
            {(Object.keys(strategies) as Strategy[]).map((id) => (
              <button
                key={id}
                className={strategy === id ? "active" : ""}
                onClick={() => act(() => setStrategy(id))}
              >
                <b>{strategies[id][0]}</b>
                <small>{strategies[id][1]}</small>
              </button>
            ))}
          </aside>
          <article>
            <h3>Claim</h3>
            <p>The sum of two even integers is even.</p>
            <hr />
            <h3>Given</h3>
            <p>Let a and b be even integers.</p>
            <h3>To prove</h3>
            <p>a + b is even.</p>
          </article>
        </div>
        <section className="pm590-builder">
          <h3>
            2 &nbsp; Build your proof <small>(drag steps to order)</small>
            <button onClick={() => act(() => setPlaced([]))}>Clear</button>
          </h3>
          <div className="placed">
            {placed.map((step, index) => {
              const valid = step.id === correct[index]?.id;
              return (
                <button
                  key={step.id}
                  draggable
                  onDragStart={(e) =>
                    e.dataTransfer.setData("text/step", step.id)
                  }
                  onClick={() =>
                    act(() =>
                      setPlaced((current) =>
                        current.filter((item) => item.id !== step.id),
                      ),
                    )
                  }
                  className={valid ? "valid" : "invalid"}
                >
                  <i>{index + 1}</i>
                  <span>{step.text}</span>
                  <b>{step.reason}</b>
                  {valid ? <Check /> : <X />}
                </button>
              );
            })}
            <div
              className="drop"
              onDragOver={(e) => e.preventDefault()}
              onDrop={drop}
            >
              Drop a step here
            </div>
          </div>
          <div className="pool">
            <article>
              <h3>
                Available steps <small>(drag to order)</small>
              </h3>
              {available.map((step) => (
                <button
                  key={step.id}
                  draggable
                  onDragStart={(e) =>
                    e.dataTransfer.setData("text/step", step.id)
                  }
                  onClick={() => add(step.id)}
                >
                  <span>{step.text}</span>
                  <b>{step.reason}</b>
                </button>
              ))}
            </article>
            <aside className={complete ? "success" : ""}>
              <Lightbulb />
              <b>{complete ? "Proof complete" : "Why the next step matters"}</b>
              <p>
                {complete
                  ? "Every inference is valid and the conclusion follows."
                  : placed.some((s) => s.id === "odd")
                    ? "The odd conclusion is the opposite of what must be proved. Remove it and factor out 2."
                    : "Choose the statement justified by the current line."}
              </p>
            </aside>
          </div>
        </section>
      </section>
      <section className="pm590-theory">
        <article>
          <h2>Notice the pattern</h2>
          <p>
            Even integers are multiples of 2. Their sum is 2 × (an integer),
            which is even.
          </p>
          <strong>2m + 2n = 2(m + n) → even</strong>
        </article>
        <article>
          <h2>Understand the rule</h2>
          <b>Key Rule (Closure)</b>
          <p>If a and b are even integers, then a+b is even.</p>
          <hr />
          <b>Definition (Even Integer)</b>
          <p>An integer k is even if k=2t for some integer t.</p>
        </article>
        <article className="warning">
          <h2>Common misconception</h2>
          <p>“The sum of two even numbers could be odd.”</p>
          <p>Both are multiples of 2, so their sum is also a multiple of 2.</p>
        </article>
      </section>
      <section className={`pm590-bottom${challenge ? " challenge" : ""}`}>
        <article>
          <h2>Worked Example (Complete Proof)</h2>
          {correct.map((step, i) => (
            <p key={step.id}>
              <i>{i + 1}</i>
              {step.text}
            </p>
          ))}
        </article>
        <aside>
          <h2>Try Independently</h2>
          <p>
            <b>Challenge</b>
            <br />
            Prove: The difference of two even integers is even.
          </p>
          <button onClick={() => act(() => setChallenge(true))}>
            Start Challenge
          </button>
          {challenge && (
            <>
              <textarea
                aria-label="Even difference proof"
                value={challengeAnswer}
                onChange={(e) => setChallengeAnswer(e.target.value)}
                placeholder="Use a=2m and b=2n..."
              />
              <button
                onClick={() => act(() => setChallengeGraded(challengeCorrect))}
              >
                Check proof
              </button>
              <output>
                {challengeGraded === null
                  ? ""
                  : challengeGraded
                    ? "Correct: a-b=2(m-n), and m-n is an integer."
                    : "Factor 2 and conclude even."}
              </output>
            </>
          )}
        </aside>
      </section>
      <nav className="pm590-adjacent">
        <a href="/lessons/discrete-and-applied-mathematics/589-quantifiers">
          ←{" "}
          <span>
            Previous<b>Quantifiers</b>
          </span>
        </a>
        <a href="/lessons/discrete-and-applied-mathematics/591-simple-interest">
          <span>
            Next<b>Equivalence Relations</b>
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}
