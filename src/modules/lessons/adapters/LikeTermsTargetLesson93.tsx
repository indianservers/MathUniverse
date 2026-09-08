import {
  ArrowLeft,
  ArrowRight,
  Check,
  Flame,
  Lightbulb,
  RotateCcw,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useState, type DragEvent } from "react";
import type { LessonAdapterProps } from "../types";
import {
  LIKE_TERMS_PROBLEMS_93,
  addLikeTerm93,
  evaluateLikeTerms93,
  isLikePracticeCorrect93,
  likeCoefficient93,
  originalLikeExpression93,
  signedLikeConstant93,
  simplifiedLikeExpression93,
  type LikeTermKind93 as TermKind,
  type LikeTermsProblem93 as LikeProblem,
} from "./likeTermsLesson93Model";
import "./LikeTermsTargetLesson93.css";

const signed = signedLikeConstant93;
const originalExpression = originalLikeExpression93;
const problems = LIKE_TERMS_PROBLEMS_93;

export default function LikeTermsTargetLesson93({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [problemIndex, setProblemIndex] = useState(0);
  const [problem, setProblem] = useState<LikeProblem>(
    LIKE_TERMS_PROBLEMS_93[0],
  );
  const [checkValue, setCheckValue] = useState(4);
  const [stage, setStage] = useState(3);
  const [tab, setTab] = useState("Interact");
  const [dragging, setDragging] = useState("");
  const [practiceAnswer, setPracticeAnswer] = useState("2a + 6");
  const [practiceChecked, setPracticeChecked] = useState(true);
  const [hintVisible, setHintVisible] = useState(true);
  const [actions, setActions] = useState(0);
  const interact = () => {
    setActions((count) => count + 1);
    onInteraction();
  };
  const reset = () => {
    setProblemIndex(0);
    setProblem(LIKE_TERMS_PROBLEMS_93[0]);
    setCheckValue(4);
    setStage(3);
    setTab("Interact");
    setDragging("");
    setPracticeAnswer("2a + 6");
    setPracticeChecked(true);
    setHintVisible(true);
    setActions(0);
  };
  useEffect(() => {
    reset();
  }, [resetToken]);

  const coefficient = likeCoefficient93(problem);
  const original = originalLikeExpression93(problem);
  const simplified = simplifiedLikeExpression93(problem);
  const originalValue = evaluateLikeTerms93(problem, checkValue);
  const simplifiedValue = evaluateLikeTerms93(problem, checkValue);
  const practiceCorrect = isLikePracticeCorrect93(practiceAnswer);
  const addTerm = (kind: TermKind) => {
    setProblem((current) => addLikeTerm93(current, kind));
    setStage(1);
    interact();
  };
  const startDrag = (
    event: DragEvent<HTMLButtonElement>,
    kind: TermKind,
    source = "bank",
  ) => {
    event.dataTransfer.setData("text/like-term", kind);
    event.dataTransfer.setData("text/like-source", source);
    setDragging(`${source}:${kind}`);
  };
  const dropTerm = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    const kind = event.dataTransfer.getData("text/like-term") as TermKind;
    const source = event.dataTransfer.getData("text/like-source");
    if (kind && source === "bank") addTerm(kind);
    setDragging("");
  };
  const chooseProblem = (index: number) => {
    setProblemIndex(index);
    setProblem(LIKE_TERMS_PROBLEMS_93[index]);
    setStage(3);
    interact();
  };
  const checkPractice = () => {
    setPracticeChecked(true);
    interact();
  };

  return (
    <div
      className="like93-page"
      data-testid="algebra-mockup-0150"
      data-dedicated-lesson="93"
      data-object-model="dedicated-tested-draggable-like-term-coefficient-grouping-real-unit-inventory-simplification-substitution-equivalence-graded-practice-and-functional-learning-tabs-model"
      data-expression={original}
      data-simplified={simplified}
      data-coefficient={coefficient}
      data-check-value={checkValue}
      data-original-value={originalValue}
      data-simplified-value={simplifiedValue}
      data-equivalent={originalValue === simplifiedValue}
      data-stage={stage}
      data-tab={tab}
      data-dragging={dragging}
      data-problem={problemIndex}
      data-practice-correct={practiceChecked && practiceCorrect}
      data-hint={hintVisible}
      data-actions={actions}
    >
      <nav className="like93-breadcrumb">
        <a href="/">Home</a>
        <span>&gt;</span>
        <a href="/lessons">Lessons</a>
        <span>&gt;</span>
        <a href="/lessons/algebra">Algebra</a>
        <span>&gt;</span>
        <a href="/lessons/algebra">Expressions and Manipulation</a>
        <span>&gt;</span>
        <b>Like Terms</b>
      </nav>
      <header className="like93-header">
        <div className="like93-eyebrows">
          <b>ALGEBRA</b>
          <strong>EXPRESSIONS AND MANIPULATION</strong>
        </div>
        <h1>Like Terms</h1>
        <p>
          Like terms have the same variable part with the same powers. We can
          add or subtract
          <br />
          their coefficients while keeping unlike terms separate.
        </p>
        <div className="like93-badges">
          <b>Intermediate</b>
          <b>Algebra</b>
          <b>6-10 min</b>
          <b>Tile model</b>
        </div>
        <nav>
          {["Interact", "Learn", "Examples", "Formula", "Practice"].map(
            (name) => (
              <button
                type="button"
                className={tab === name ? "active" : ""}
                key={name}
                onClick={() => {
                  setTab(name);
                  interact();
                }}
              >
                {name}
              </button>
            ),
          )}
        </nav>
      </header>
      {tab !== "Interact" && <LikeTermsTab93 tab={tab} problem={problem} />}
      <main className={`like93-layout ${tab === "Interact" ? "" : "hidden"}`}>
        <section className="like93-lab">
          <header>
            <div>
              <h2>Tile Lab: Combine like terms</h2>
              <p>Use algebra tiles to combine {original}.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                reset();
                interact();
              }}
            >
              <RotateCcw />
              Reset
            </button>
          </header>
          <section className="like93-workspace">
            <aside>
              <h3>Expression tiles</h3>
              <p>Drag tiles to the workspace</p>
              <TermButton
                kind="positive"
                variable={problem.variable}
                label="Add positive variable tile"
                onDragStart={startDrag}
                onClick={addTerm}
              />
              <TermButton
                kind="negative"
                variable={problem.variable}
                label="Add negative variable tile"
                onDragStart={startDrag}
                onClick={addTerm}
              />
              <TermButton
                kind="constant"
                variable={problem.variable}
                label="Add positive unit tile"
                onDragStart={startDrag}
                onClick={addTerm}
              />
            </aside>
            <div
              className="like93-drop"
              onDragOver={(event) => event.preventDefault()}
              onDrop={dropTerm}
            >
              <h3>Workspace</h3>
              <p>Build and group the expression</p>
              <div>
                <TermRow
                  count={problem.positive}
                  kind="positive"
                  variable={problem.variable}
                  onDragStart={startDrag}
                />
                <TermRow
                  count={problem.negative}
                  kind="negative"
                  variable={problem.variable}
                  onDragStart={startDrag}
                />
                <UnitTiles93
                  count={problem.constant}
                  onDragStart={(event) =>
                    startDrag(event, "constant", "workspace")
                  }
                />
              </div>
            </div>
          </section>
          <StageOne problem={problem} />
          <StageTwo problem={problem} coefficient={coefficient} />
          <StageThree
            variable={problem.variable}
            coefficient={coefficient}
            constant={problem.constant}
          />
          <div className="like93-result">
            <small>Simplified result</small>
            <strong>{simplified}</strong>
          </div>
        </section>
        <aside className="like93-controls">
          <header>
            <h2>Controls &amp; Check</h2>
            <p>Manage the lab and check your result</p>
          </header>
          <div className="like93-control-body">
            <label>
              Expression
              <select
                aria-label="Expression"
                value={problemIndex}
                onChange={(event) => chooseProblem(Number(event.target.value))}
              >
                {problems.map((item, index) => (
                  <option value={index} key={item.variable}>
                    {originalExpression(item)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              x value for check
              <input
                aria-label="x value for check"
                type="number"
                value={checkValue}
                onChange={(event) => {
                  setCheckValue(Number(event.target.value));
                  interact();
                }}
              />
            </label>
            <div className="like93-stage-buttons">
              {[
                [1, "Group like terms"],
                [2, "Combine coefficients"],
                [3, "Check by substitution"],
              ].map(([number, label]) => (
                <button
                  type="button"
                  className={stage === number ? "active" : ""}
                  onClick={() => {
                    setStage(Number(number));
                    interact();
                  }}
                  key={number}
                >
                  <i>{number}</i>
                  {label}
                  <Check />
                </button>
              ))}
            </div>
          </div>
          <section className="like93-check">
            <h3>Result</h3>
            <p>Simplified expression</p>
            <strong>{simplified}</strong>
            <h4>
              Substitution check ({problem.variable} = {checkValue})
            </h4>
            <article>
              <b>Original: {original}</b>
              <span>
                {problem.positive}({checkValue}) − {problem.negative}(
                {checkValue}) {signed(problem.constant)}
              </span>
              <span>
                = {problem.positive * checkValue} −{" "}
                {problem.negative * checkValue} {signed(problem.constant)} ={" "}
                {originalValue}
              </span>
              <em>{originalValue}</em>
            </article>
            <article>
              <b>Simplified: {simplified}</b>
              <span>
                {coefficient}({checkValue}) {signed(problem.constant)}
              </span>
              <span>
                = {coefficient * checkValue} {signed(problem.constant)} ={" "}
                {simplifiedValue}
              </span>
              <em>{simplifiedValue}</em>
            </article>
            <footer>
              <Check />
              <span>
                <b>Same value: {simplifiedValue}</b>
                <small>Great! The expressions are equivalent.</small>
              </span>
            </footer>
          </section>
        </aside>
        <section className="like93-notes">
          <article>
            <h2>
              <Lightbulb />
              Key Idea
            </h2>
            <b>Like terms can be combined.</b>
            <p>
              They must have the same variable
              <br />
              part and the same powers.
            </p>
            <div>
              Like terms: <strong>3x, −8x, 12x</strong>
              <br />
              Unlike terms: <strong>5x, 3x², 4</strong>
            </div>
          </article>
          <article>
            <h2>▣ General Rule</h2>
            <strong>ax + bx + c = (a + b)x + c</strong>
            <ol>
              <li>Match like terms (same variable and power).</li>
              <li>Add or subtract coefficients.</li>
              <li>Keep constants as they are.</li>
            </ol>
          </article>
          <article>
            <h2>
              <TriangleAlert />
              Warning
            </h2>
            <b>Do not combine different powers.</b>
            <p>x and x² are not like terms.</p>
            <div>
              Example:
              <br />
              <strong>x + x²</strong> is not 2x.
              <br />
              They remain x + x².
            </div>
          </article>
        </section>
        <section className="like93-bottom">
          <article>
            <h2>Worked Example</h2>
            <p>Combine like terms and verify by substitution.</p>
            <strong>
              {original} = ({problem.positive} − {problem.negative})
              {problem.variable} {signed(problem.constant)} = {simplified}
            </strong>
            <p>
              Check with{" "}
              <b>
                {problem.variable} = {checkValue}
              </b>
            </p>
            <div>
              <span>
                <b>Original:</b>
                <br />
                {problem.positive}({checkValue}) − {problem.negative}(
                {checkValue}) {signed(problem.constant)}
                <br />= {originalValue}
              </span>
              <span>
                <b>Simplified:</b>
                <br />
                {coefficient}({checkValue}) {signed(problem.constant)}
                <br />= {simplifiedValue}
              </span>
            </div>
            <em>Both give {simplifiedValue}, so the expressions are equal.</em>
            <button
              type="button"
              onClick={() => {
                setStage(3);
                interact();
              }}
            >
              Verified! <Check />
            </button>
          </article>
          <article>
            <h2>Try it: Your Turn</h2>
            <p>Simplify the expression.</p>
            <strong>3a + 6 − a</strong>
            <label>
              Your answer
              <input
                aria-label="Your answer"
                value={practiceAnswer}
                onChange={(event) => {
                  setPracticeAnswer(event.target.value);
                  setPracticeChecked(false);
                  interact();
                }}
              />
            </label>
            <button type="button" onClick={checkPractice}>
              {practiceChecked ? "Checked" : "Check"}
            </button>
            <b className={practiceChecked && practiceCorrect ? "correct" : ""}>
              {practiceChecked
                ? practiceCorrect
                  ? "Correct!"
                  : "Try again"
                : ""}
            </b>
            <button
              type="button"
              className="like93-reveal"
              onClick={() => {
                setPracticeAnswer("2a + 6");
                setPracticeChecked(true);
                setHintVisible(true);
                interact();
              }}
            >
              Reveal
            </button>
            {hintVisible && (
              <aside>
                Step-by-step hint
                <br />
                <span>Group like terms: (3a − a) + 6 = 2a + 6</span>
              </aside>
            )}
          </article>
        </section>
        <nav className="like93-navigation">
          <a href="/lessons/algebra/92-algebra-tiles">
            <ArrowLeft />
            <span>
              Previous<b>Algebra Tiles</b>
            </span>
          </a>
          <a href="/lessons/algebra/94-substitution">
            <span>
              Next<b>Substitution</b>
            </span>
            <ArrowRight />
          </a>
        </nav>
        <footer className="like93-footer">
          <b>Math Universe</b>
          <p>
            Interactive math labs, visual proofs, NCERT explorations, graphing,
            CAS-style tools, and classroom-ready activities.
          </p>
          <nav>
            <a href="/sitemap">Sitemap</a>
            <a href="/docs">Docs</a>
            <a href="/about">About</a>
          </nav>
        </footer>
      </main>
      <aside className="like93-streak">
        <h2>
          <Flame />
          <span>
            Learning Streak<strong>3 days</strong>
          </span>
        </h2>
        <p>
          Keep going! You're building
          <br />
          great momentum.
        </p>
        <div>
          <b>✓</b>
          <b>✓</b>
          <b>✓</b>
          <b>✓</b>
          <i></i>
          <i></i>
          <i></i>
        </div>
        <small>
          M&nbsp;&nbsp;&nbsp;&nbsp;T&nbsp;&nbsp;&nbsp;&nbsp;W&nbsp;&nbsp;&nbsp;&nbsp;T&nbsp;&nbsp;&nbsp;&nbsp;F&nbsp;&nbsp;&nbsp;&nbsp;S&nbsp;&nbsp;&nbsp;&nbsp;S
        </small>
      </aside>
    </div>
  );
}

function TermButton({
  kind,
  variable,
  label,
  onDragStart,
  onClick,
}: {
  kind: TermKind;
  variable: string;
  label: string;
  onDragStart: (event: DragEvent<HTMLButtonElement>, kind: TermKind) => void;
  onClick?: (kind: TermKind) => void;
}) {
  return (
    <button
      type="button"
      draggable
      aria-label={label}
      className={`like93-term ${kind}`}
      onDragStart={(event) => onDragStart(event, kind)}
      onClick={() => onClick?.(kind)}
    >
      {kind === "positive"
        ? `+${variable}`
        : kind === "negative"
          ? `−${variable}`
          : "+1"}
    </button>
  );
}
function TermRow({
  count,
  kind,
  variable,
  onDragStart,
}: {
  count: number;
  kind: TermKind;
  variable: string;
  onDragStart?: (
    event: DragEvent<HTMLButtonElement>,
    kind: TermKind,
    source?: string,
  ) => void;
}) {
  return (
    <span className={`like93-term-row ${kind}`}>
      {Array.from({ length: count }, (_, index) =>
        onDragStart ? (
          <button
            type="button"
            draggable
            aria-label={`${kind} ${variable} tile ${index + 1}`}
            onDragStart={(event) => onDragStart(event, kind, "workspace")}
            key={index}
          >
            {kind === "positive" ? variable : `−${variable}`}
          </button>
        ) : (
          <span key={index}>
            {kind === "positive" ? variable : `−${variable}`}
          </span>
        ),
      )}
    </span>
  );
}
function StageOne({ problem }: { problem: LikeProblem }) {
  return (
    <section className="like93-stage">
      <i>1</i>
      <div>
        <h3>Match variable parts</h3>
        <p>Tile the {problem.variable}-terms together.</p>
        <div className="like93-stage-row">
          <TermRow
            count={problem.positive}
            kind="positive"
            variable={problem.variable}
          />
          <TermRow
            count={problem.negative}
            kind="negative"
            variable={problem.variable}
          />
          <span>│</span>
          <UnitTiles93 count={problem.constant} />
        </div>
      </div>
    </section>
  );
}
function StageTwo({
  problem,
  coefficient,
}: {
  problem: LikeProblem;
  coefficient: number;
}) {
  return (
    <section className="like93-stage">
      <i>2</i>
      <div>
        <h3>Combine coefficients</h3>
        <p>
          Pair +{problem.variable} with −{problem.variable} to combine:{" "}
          {problem.positive}
          {problem.variable} − {problem.negative}
          {problem.variable} = {coefficient}
          {problem.variable}
        </p>
        <div className="like93-cancel-row">
          {Array.from({ length: problem.negative }, (_, index) => (
            <span key={index}>
              <b>{problem.variable}</b>
              <b>−{problem.variable}</b>
            </span>
          ))}
          {Array.from({ length: coefficient }, (_, index) => (
            <span key={`p${index}`}>
              <b>{problem.variable}</b>
              <b>−</b>
            </span>
          ))}
          <em>→</em>
          <strong>
            {coefficient}
            {problem.variable}
          </strong>
          <i>{problem.constant >= 0 ? "+" : "−"}</i>
          <b>{Math.abs(problem.constant)}</b>
        </div>
      </div>
    </section>
  );
}
function StageThree({
  variable,
  coefficient,
  constant,
}: {
  variable: string;
  coefficient: number;
  constant: number;
}) {
  return (
    <section className="like93-stage compact">
      <i>3</i>
      <div>
        <h3>Keep the constant</h3>
        <p>Constants stay as they are.</p>
        <div>
          <strong>
            {coefficient}
            {variable}
          </strong>
          <span>{constant >= 0 ? "+" : "−"}</span>
          <b>{Math.abs(constant)}</b>
        </div>
      </div>
    </section>
  );
}

function UnitTiles93({
  count,
  onDragStart,
}: {
  count: number;
  onDragStart?: (event: DragEvent<HTMLButtonElement>) => void;
}) {
  const negative = count < 0;
  return (
    <span className="like93-unit-row">
      {Array.from({ length: Math.abs(count) }, (_, index) =>
        onDragStart ? (
          <button
            type="button"
            draggable
            aria-label={`${negative ? "Negative" : "Positive"} unit tile ${index + 1}`}
            className={`like93-term constant ${negative ? "negative-constant" : ""}`}
            onDragStart={onDragStart}
            key={index}
          >
            {negative ? "−1" : "+1"}
          </button>
        ) : (
          <b className={negative ? "negative-constant" : ""} key={index}>
            {negative ? "−1" : "+1"}
          </b>
        ),
      )}
    </span>
  );
}

function LikeTermsTab93({
  tab,
  problem,
}: {
  tab: string;
  problem: LikeProblem;
}) {
  const coefficient = likeCoefficient93(problem);
  const content =
    tab === "Learn"
      ? [
          "Like terms have identical variable parts and powers.",
          "Combine coefficients and preserve the variable part.",
        ]
      : tab === "Examples"
        ? LIKE_TERMS_PROBLEMS_93.map(
            (item) =>
              `${originalLikeExpression93(item)} → ${simplifiedLikeExpression93(item)}`,
          )
        : tab === "Formula"
          ? [
              `a${problem.variable} + b${problem.variable} + c = (a + b)${problem.variable} + c`,
              `${problem.positive} − ${problem.negative} = ${coefficient}`,
            ]
          : [
              "Simplify the current expression, then verify it at any chosen value.",
              `At ${problem.variable} = 4, both forms equal ${evaluateLikeTerms93(problem, 4)}.`,
            ];
  return (
    <section className="like93-tab-panel" data-active-learning-tab={tab}>
      <h2>{tab}</h2>
      <strong>{simplifiedLikeExpression93(problem)}</strong>
      {content.map((item) => (
        <p key={item}>{item}</p>
      ))}
    </section>
  );
}
