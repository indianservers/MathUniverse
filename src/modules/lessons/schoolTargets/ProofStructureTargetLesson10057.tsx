import {
  ArrowLeft,
  ArrowRight,
  Check,
  Lightbulb,
  RotateCcw,
  TriangleAlert,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./ProofStructureTargetLesson10057.css";
type Fact = {
  id: string;
  statement: string;
  reason: string;
  kind: string;
  cardTitle?: string;
  cardDetail?: string;
};
const facts: Fact[] = [
  { id: "G1", statement: "AB = AC", reason: "Given", kind: "Given" },
  {
    id: "D1",
    statement: "△ABC is isosceles.",
    reason: "Definition of isosceles triangle",
    kind: "Definition",
    cardTitle: "Definition of isosceles triangle",
  },
  {
    id: "T1",
    statement: "∠B = ∠C",
    reason: "Isosceles Triangle Theorem",
    kind: "Axiom / Theorem",
    cardTitle: "Isosceles Triangle Theorem",
    cardDetail: "If AB = AC, then ∠B = ∠C.",
  },
  {
    id: "R1",
    statement: "AB = AB",
    reason: "Reflexive Property",
    kind: "Axiom / Theorem",
    cardTitle: "Reflexive Property",
    cardDetail: "AB = AB.",
  },
  {
    id: "D2",
    statement: "An angle is formed by two rays with a common endpoint.",
    reason: "Definition of ∠",
    kind: "Definition",
    cardTitle: "Definition of ∠",
    cardDetail:
      "An angle is the figure formed by two rays with a common endpoint.",
  },
  { id: "G2", statement: "Given: △ABC", reason: "Given", kind: "Given" },
];
const expected = ["G1", "D1", "T1"];
export default function ProofStructureTargetLesson10057({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [proof, setProof] = useState([...expected]),
    [tab, setTab] = useState("Interact"),
    [checked, setChecked] = useState(true),
    [extraGiven, setExtraGiven] = useState(false),
    [fixes, setFixes] = useState(["wrong", "wrong", "wrong"]),
    [fixChecked, setFixChecked] = useState(false),
    [hints, setHints] = useState(2),
    [actions, setActions] = useState(0);
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const valid =
    proof.length === 3 && proof.every((id, i) => id === expected[i]);
  const add = (id: string) =>
    act(() => {
      setChecked(false);
      setProof((current) =>
        current.includes(id) ? current : [...current, id],
      );
    });
  const clear = () =>
    act(() => {
      setProof([]);
      setChecked(false);
    });
  const resetChallenge = () =>
    act(() => {
      setFixes(["wrong", "wrong", "wrong"]);
      setFixChecked(false);
      setHints(2);
    });
  const fixScore = fixes.filter(
    (value, i) => value === ["G1", "D1", "T1"][i],
  ).length;
  return (
    <section
      className="ps10057-page"
      data-testid="school-mockup-0731"
      data-object-model="dedicated-ordered-proof-reason-and-repair-engine"
      data-proof={proof.join(",")}
      data-valid={String(checked && valid)}
      data-extra-given={String(extraGiven)}
      data-fix-score={fixChecked ? fixScore : "idle"}
      data-actions={actions}
    >
      <header className="ps10057-hero">
        <small>CLASS 9 · EUCLIDEAN GEOMETRY</small>
        <h1>Proof Structure and Logical Statements</h1>
        <p>
          Learn how to build valid geometric proofs using logical structure and
          correct reasons.
        </p>
        <div>
          <span>◴ 30 min</span>
          <span>RIGOROUS</span>
          <span>PROOF</span>
          <span>geometry2d</span>
        </div>
        <Link to="/lessons/school">
          <ArrowLeft /> School lessons
        </Link>
      </header>
      <nav className="ps10057-tabs">
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
        <section className="ps10057-builder">
          <header>
            <div>
              <h2>INTERACTIVE PROOF BUILDER</h2>
              <p>
                Drag facts on the left to build your proof. Connect each step to
                a valid reason.
              </p>
            </div>
            <strong className={valid ? "ok" : "bad"}>
              <Check /> {valid ? "All steps valid" : "Proof incomplete"}
            </strong>
          </header>
          <div className="ps10057-work">
            <aside>
              <article>
                <h3>PROBLEM</h3>
                <p>In △ABC, AB = AC.</p>
                <b>Prove: ∠B = ∠C.</b>
                <IsoscelesDiagram marked />
              </article>
              <article>
                <h3>GIVEN</h3>
                <p>
                  <i>1</i> AB = AC
                </p>
                {extraGiven && (
                  <p>
                    <i>2</i> △ABC
                  </p>
                )}
                <button onClick={() => act(() => setExtraGiven((v) => !v))}>
                  ＋ Add given (optional)
                </button>
              </article>
            </aside>
            <article className="ps10057-main">
              <h3>Drag a fact below to add a step.</h3>
              <div className="ps10057-kinds">
                <span>Given</span>
                <span>Definition</span>
                <span>Axiom / Theorem</span>
                <span>Conclusion</span>
              </div>
              <div className="ps10057-facts">
                {facts.map((fact) => (
                  <button
                    key={fact.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("fact", fact.id)}
                    onClick={() => add(fact.id)}
                    className={
                      fact.kind.startsWith("Given")
                        ? "given"
                        : fact.kind.startsWith("Definition")
                          ? "definition"
                          : "theorem"
                    }
                  >
                    <b>{fact.cardTitle ?? fact.statement}</b>
                    <span>{fact.cardDetail ?? fact.reason}</span>
                  </button>
                ))}
              </div>
              <h3>YOUR PROOF</h3>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>STATEMENT</th>
                    <th>REASON</th>
                  </tr>
                </thead>
                <tbody>
                  {proof.map((id, index) => {
                    const f = facts.find((item) => item.id === id)!;
                    return (
                      <tr key={id}>
                        <td>
                          <i>{index + 1}</i>
                        </td>
                        <td>{f.statement}</td>
                        <td>
                          <i>{index + 1}</i> {f.reason}{" "}
                          {id === expected[index] && <Check />}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div
                className="ps10057-drop"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => add(e.dataTransfer.getData("fact"))}
              >
                ◴ Drop the next fact here to add a step
              </div>
              <footer>
                <button onClick={clear}>
                  <RotateCcw /> Clear proof
                </button>
                <button onClick={() => act(() => setChecked(true))}>
                  <Check /> Check proof
                </button>
              </footer>
            </article>
          </div>
          <footer className={checked && valid ? "success" : "pending"}>
            {checked && valid ? (
              <>
                <Check />
                <span>
                  <b>Correct! Your proof is valid.</b>Every conclusion follows
                  from previous facts using an acceptable reason.
                </span>
              </>
            ) : (
              "Complete the ordered proof, then check it."
            )}
          </footer>
        </section>
        <section className="ps10057-example">
          <article>
            <h2>WORKED EXAMPLE</h2>
            <p>
              <b>Example:</b> Prove ∠B = ∠C
            </p>
            <p>
              <b>Given:</b> In △ABC, AB = AC.
              <br />
              <b>Prove:</b> ∠B = ∠C
            </p>
            <ProofTable />
            <aside>
              <Lightbulb />
              <b>Why it works</b>
              <p>
                Step 2 classifies the triangle using the definition.
                <br />
                Step 3 applies a proven theorem that guarantees the base angles
                are equal.
              </p>
            </aside>
          </article>
          <article className="warning">
            <h2>
              <TriangleAlert /> MISCONCEPTION WARNING
            </h2>
            <strong>
              A diagram's appearance cannot be used as an unstated premise.
            </strong>
            <IsoscelesDiagram marked={false} />
            <p>
              Even if it looks isosceles, you cannot conclude ∠B = ∠C unless AB
              = AC (or another valid reason) is stated or proved.
            </p>
          </article>
        </section>
        <section className="ps10057-challenge">
          <header>
            <div>
              <h2>CHALLENGE: REPAIR THE PROOF</h2>
              <p>
                This proof contains one circular argument and one missing
                reason. Fix both issues.
              </p>
            </div>
            <button onClick={resetChallenge}>
              <RotateCcw /> Reset challenge
            </button>
          </header>
          <p>
            <b>Problem:</b> In △ABC, AB = AC. Prove: ∠B = ∠C.
          </p>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>STATEMENT</th>
                <th>REASON</th>
                <th>FIX</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["∠B = ∠C", "Given"],
                ["△ABC is isosceles.", "Isosceles Triangle Theorem"],
                ["AB = AC", "Definition of isosceles triangle"],
              ].map((row, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{row[0]}</td>
                  <td>{row[1]}</td>
                  <td>
                    <select
                      aria-label={`Repair step ${index + 1}`}
                      value={fixes[index]}
                      onChange={(e) =>
                        act(() => {
                          setFixChecked(false);
                          setFixes((current) =>
                            current.map((v, i) =>
                              i === index ? e.target.value : v,
                            ),
                          );
                        })
                      }
                    >
                      <option value="wrong">
                        {
                          [
                            "Replace with the correct first statement.",
                            "This reason uses the conclusion. Replace it.",
                            "Missing reason. Choose the correct one.",
                          ][index]
                        }
                      </option>
                      {facts
                        .filter((f) => expected.includes(f.id))
                        .map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.statement} — {f.reason}
                          </option>
                        ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <footer>
            <button onClick={() => act(() => setFixChecked(true))}>
              Check my fixes
            </button>
            <button
              onClick={() => act(() => setHints((h) => Math.max(0, h - 1)))}
            >
              <Lightbulb /> Hints ({hints})
            </button>
            {fixChecked && (
              <strong>
                {fixScore === 3
                  ? "All repairs are logically valid."
                  : `${fixScore}/3 repairs are correct.`}
              </strong>
            )}
          </footer>
        </section>
      </main>
      <nav className="ps10057-adjacent">
        <Link to="/lessons/school/class-9/class-9-euclidean-geometry-axiom-versus-theorem">
          <ArrowLeft /> Axiom versus Theorem
        </Link>
        <Link to="/lessons/school">
          Vertically Opposite Angles <ArrowRight />
        </Link>
      </nav>
    </section>
  );
}
function IsoscelesDiagram({ marked }: { marked: boolean }) {
  return (
    <svg className="ps10057-triangle" viewBox="0 0 210 180">
      <path d="M25 155L105 20l80 135Z" />
      <circle cx="105" cy="20" r="3" />
      <circle cx="25" cy="155" r="3" />
      <circle cx="185" cy="155" r="3" />
      {marked && (
        <>
          <line className="mark" x1="59" y1="91" x2="69" y2="97" />
          <line className="mark" x1="141" y1="97" x2="151" y2="91" />
        </>
      )}
      <text x="101" y="12">
        A
      </text>
      <text x="12" y="167">
        B
      </text>
      <text x="190" y="167">
        C
      </text>
    </svg>
  );
}
function ProofTable() {
  return (
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>STATEMENT</th>
          <th>REASON</th>
        </tr>
      </thead>
      <tbody>
        {expected.map((id, index) => {
          const f = facts.find((item) => item.id === id)!;
          return (
            <tr key={id}>
              <td>{index + 1}</td>
              <td>{f.statement}</td>
              <td>
                {index + 1} &nbsp; {f.reason}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
