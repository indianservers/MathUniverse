import {
  Check,
  Link2,
  Network,
  RotateCcw,
  ShieldCheck,
  Trash2,
  TriangleAlert,
  Unlink,
} from "lucide-react";
import { useState } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./InductionLogicTargetLesson10128.css";

const labels = ["P(1)", "P(2)", "P(3)", "…", "P(k)", "P(k+1)", "…"];
const substantive = [0, 1, 2, 4, 5];

export default function InductionLogicTargetLesson10128({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [pieces, setPieces] = useState([
    true,
    true,
    true,
    true,
    true,
    true,
    true,
  ]);
  const [links, setLinks] = useState([true, true, true, true, true, true]);
  const [formal, setFormal] = useState(false);
  const [actions, setActions] = useState(0);
  const base = pieces[0];
  const allStatements = substantive.every((index) => pieces[index]);
  const allLinks = links.every(Boolean);
  const conclusion = base && allStatements && allLinks;
  const act = () => setActions((count) => count + 1);
  const removePiece = (index: number) => {
    setPieces((current) =>
      current.map((value, i) => (i === index ? false : value)),
    );
    act();
  };
  const removeLink = (index: number) => {
    setLinks((current) =>
      current.map((value, i) => (i === index ? false : value)),
    );
    act();
  };
  const establishBase = () => {
    setPieces((current) =>
      current.map((value, index) => (index === 0 ? true : value)),
    );
    act();
  };
  const establishLinks = () => {
    setPieces((current) =>
      current.map((value, index) =>
        substantive.includes(index) ? true : value,
      ),
    );
    setLinks(links.map(() => true));
    act();
  };
  const reset = () => {
    setPieces(labels.map(() => true));
    setLinks(links.map(() => true));
    setFormal(false);
    act();
  };

  return (
    <section
      className="in10128-page"
      data-testid="school-mockup-0802"
      data-object-model="dedicated-induction-proof-chain-engine"
      data-base={String(base)}
      data-statements={String(allStatements)}
      data-links={String(allLinks)}
      data-conclusion={String(conclusion)}
      data-missing-pieces={pieces.filter((value) => !value).length}
      data-broken-links={links.filter((value) => !value).length}
      data-formal={String(formal)}
      data-actions={actions}
    >
      <header>
        <small>CLASS 11 · MATHEMATICAL INDUCTION</small>
        <h1>Logic of Mathematical Induction</h1>
        <p>
          Build a rigorous proof chain: establish the base case, assume P(k),
          prove P(k+1), and let every valid link carry truth forward.
        </p>
        <nav>
          <span>INDUCTION</span>
          <span>RIGOROUS</span>
          <span>PROOF</span>
          <span>LEARNING</span>
        </nav>
      </header>
      <main>
        <section className="in10128-builder">
          <header>
            <Network />
            <div>
              <h2>INDUCTION BUILDER</h2>
              <p>
                Build the domino chain. First establish the base case, then link
                each step using P(k) ⇒ P(k+1).
              </p>
            </div>
          </header>
          <div className="in10128-chain">
            {labels.map((label, index) => (
              <div className="in10128-unit" key={`${label}-${index}`}>
                {pieces[index] ? (
                  <article className={index === 0 ? "base" : ""}>
                    <button
                      aria-label={`Remove ${label}`}
                      onClick={() => removePiece(index)}
                      disabled={label === "…"}
                    >
                      <Trash2 />
                    </button>
                    <strong>{label}</strong>
                    <span>
                      {index === 0
                        ? "Base case (to prove true)"
                        : "(to prove true)"}
                    </span>
                    {index === 0 && <Check />}
                  </article>
                ) : (
                  <button
                    className="restore"
                    onClick={() => {
                      setPieces((current) =>
                        current.map((value, i) => (i === index ? true : value)),
                      );
                      act();
                    }}
                  >
                    Restore {label}
                  </button>
                )}
                {index < links.length && (
                  <button
                    aria-label={`Toggle link ${index + 1}`}
                    className={`chain-link ${links[index] ? "connected" : "broken"}`}
                    onClick={() =>
                      links[index]
                        ? removeLink(index)
                        : setLinks((current) =>
                            current.map((value, i) =>
                              i === index ? true : value,
                            ),
                          )
                    }
                  >
                    {links[index] ? <Link2 /> : <Unlink />}
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="in10128-link-status">
            <strong>
              <Link2 /> Links:
            </strong>
            {links.map((linked, index) => (
              <button
                aria-label={`Link status ${index + 1}`}
                className={linked ? "good" : "bad"}
                key={index}
                onClick={() =>
                  linked
                    ? removeLink(index)
                    : setLinks((current) =>
                        current.map((value, i) => (i === index ? true : value)),
                      )
                }
              >
                {linked ? <Check /> : <Unlink />}
              </button>
            ))}
          </div>
          <div className="in10128-actions">
            <button className={base ? "complete" : ""} onClick={establishBase}>
              <b>1</b>
              <span>
                <strong>Establish Base Case</strong>
                <small>Mark P(1) as true.</small>
              </span>
            </button>
            <button
              className={allLinks && allStatements ? "complete" : ""}
              onClick={establishLinks}
            >
              <b>2</b>
              <span>
                <strong>Link P(k) ⇒ P(k+1)</strong>
                <small>Connect the next step.</small>
              </span>
            </button>
            <button onClick={reset}>
              <RotateCcw /> Reset All
            </button>
          </div>
          <section className="in10128-experiment">
            <h2>TRY REMOVING A PIECE</h2>
            <button onClick={() => removePiece(0)}>
              <Trash2 />
              <span>
                <strong>Remove the first domino P(1)</strong>
                <small>Break the base case.</small>
              </span>
            </button>
            <button onClick={() => removeLink(3)}>
              <Unlink />
              <span>
                <strong>Remove a link</strong>
                <small>Break the inductive chain.</small>
              </span>
            </button>
            <p>
              If the base or any link is missing,
              <br />
              <strong>the chain no longer proves all statements.</strong>
            </p>
          </section>
          <footer>
            <div>
              <h2>THE INDUCTION PRINCIPLE</h2>
              <p>
                If P(1) is true and for every integer k ≥ 1, P(k) ⇒ P(k+1) is
                true, then P(n) is true for all n ≥ 1.
              </p>
            </div>
            <button onClick={() => setFormal((value) => !value)}>
              View formal statement
            </button>
            {formal && (
              <aside>
                <strong>Principle of Mathematical Induction</strong>
                <p>[P(1) ∧ ∀k≥1(P(k)⇒P(k+1))] ⇒ ∀n≥1 P(n)</p>
              </aside>
            )}
          </footer>
        </section>
        <aside className="in10128-status">
          <h2>
            <ShieldCheck /> PROOF STATUS
          </h2>
          <article className={base ? "pass" : "fail"}>
            <div>
              <strong>Base Case</strong>
              <p>P(1) is {base ? "established as true" : "missing"}.</p>
            </div>
            {base ? <Check /> : <Unlink />}
          </article>
          <article className={allStatements && allLinks ? "pass" : "fail"}>
            <div>
              <strong>Inductive Links</strong>
              <p>
                {allStatements && allLinks
                  ? "Every step is linked by P(k) ⇒ P(k+1)."
                  : "A statement or link is missing."}
              </p>
            </div>
            {allStatements && allLinks ? <Check /> : <Unlink />}
          </article>
          <article className={`conclusion ${conclusion ? "pass" : "fail"}`}>
            <div>
              <strong>Conclusion</strong>
              <p>
                {conclusion
                  ? "By Mathematical Induction, P(n) is true for all natural numbers n ≥ 1."
                  : "The proof chain is incomplete; no universal conclusion follows."}
              </p>
            </div>
            {conclusion ? <Check /> : <Unlink />}
          </article>
          <article className="warning">
            <TriangleAlert />
            <div>
              <strong>Important: Not a circular proof</strong>
              <p>
                When proving P(k+1), assume P(k) only as a hypothesis, not as
                the conclusion.
              </p>
            </div>
          </article>
          <article>
            <strong>Proof Idea</strong>
            <ol>
              <li>Prove the base case P(1).</li>
              <li>Assume P(k) is true.</li>
              <li>Use it to prove P(k+1).</li>
              <li>Conclude P(n) for all n ≥ 1.</li>
            </ol>
          </article>
        </aside>
      </main>
    </section>
  );
}
