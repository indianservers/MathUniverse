import { Check, RotateCcw, Sparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./SymmetricRelationsTargetLesson10114.css";

type N = 1 | 2 | 3 | 4;
type Pair = `${N},${N}`;
const A: N[] = [1, 2, 3, 4];
const p = (a: N, b: N): Pair => `${a},${b}`;
const initial = A.flatMap((a) => A.map((b) => p(a, b))).filter(
  (item) => item !== "3,1",
);
const pos: Record<N, [number, number]> = {
  1: [90, 65],
  2: [310, 65],
  3: [310, 245],
  4: [90, 245],
};

export default function SymmetricRelationsTargetLesson10114({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [relation, setRelation] = useState(() => new Set<Pair>(initial));
  const [actions, setActions] = useState(0);
  const unmatched = useMemo(
    () =>
      A.flatMap((a) => A.map((b) => [a, b] as const)).filter(
        ([a, b]) => relation.has(p(a, b)) && !relation.has(p(b, a)),
      ),
    [relation],
  );
  const symmetric = unmatched.length === 0;
  const update = (next: Set<Pair>) => {
    setRelation(next);
    setActions((n) => n + 1);
  };
  const toggle = (a: N, b: N) => {
    const next = new Set(relation),
      key = p(a, b);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    update(next);
  };
  const completeOne = () => {
    if (!unmatched[0]) return;
    const [a, b] = unmatched[0],
      next = new Set(relation);
    next.add(p(b, a));
    update(next);
  };
  const completeAll = () => {
    const next = new Set(relation);
    unmatched.forEach(([a, b]) => next.add(p(b, a)));
    update(next);
  };
  const witness = unmatched[0];
  return (
    <section
      className="sym10114-page"
      data-testid="school-mockup-0788"
      data-object-model="dedicated-symmetric-relation-mirror-witness-engine"
      data-pair-count={relation.size}
      data-unmatched={unmatched.map(([a, b]) => p(a, b)).join(";")}
      data-symmetric={String(symmetric)}
      data-actions={actions}
    >
      <header>
        <small>CLASS 11 · RELATIONS AND FUNCTIONS</small>
        <h1>Symmetric Relations</h1>
        <p>
          <b>Definition:</b> A relation R on a set A is symmetric if for all a,b
          ∈ A, &nbsp; <em>aRb ⇒ bRa.</em>
        </p>
        <nav>
          <span>18 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>graph</span>
          <span>matrix</span>
        </nav>
        <button>← &nbsp; School lessons</button>
      </header>
      <main>
        <div className="sym10114-title">
          <h2>☷ INTERACTIVE LAB &nbsp;·&nbsp; SYMMETRIC RELATIONS</h2>
          <p>
            Universe A = {"{"}1, 2, 3, 4{"}"}
          </p>
          <button
            onClick={() => {
              setRelation(new Set(initial));
              setActions((n) => n + 1);
            }}
          >
            <RotateCcw /> Reset lab
          </button>
        </div>
        <section className="sym10114-lab">
          <article className="sym10114-graph">
            <h3>Directed Relation Graph</h3>
            <svg
              viewBox="0 0 400 310"
              aria-label="Symmetric directed relation graph"
            >
              <defs>
                <marker
                  id="sym-arrow"
                  markerWidth="8"
                  markerHeight="8"
                  refX="7"
                  refY="4"
                  orient="auto"
                >
                  <path d="M0 0L8 4L0 8Z" />
                </marker>
              </defs>
              {A.flatMap((a, i) =>
                A.slice(i + 1).map((b) => [a, b] as const),
              ).map(([a, b]) => {
                const ab = relation.has(p(a, b)),
                  ba = relation.has(p(b, a)),
                  [x1, y1] = pos[a],
                  [x2, y2] = pos[b],
                  dx = x2 - x1,
                  dy = y2 - y1,
                  l = Math.hypot(dx, dy),
                  px = (-dy / l) * 5,
                  py = (dx / l) * 5,
                  one = ab !== ba;
                return (
                  <g
                    key={`${a}-${b}`}
                    role="button"
                    tabIndex={0}
                    aria-label={`Toggle edge ${a}, ${b}`}
                    onClick={() => toggle(a, b)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") toggle(a, b);
                    }}
                  >
                    {ab && (
                      <line
                        x1={x1 + (dx / l) * 26 + px}
                        y1={y1 + (dy / l) * 26 + py}
                        x2={x2 - (dx / l) * 26 + px}
                        y2={y2 - (dy / l) * 26 + py}
                        className={one ? "warn" : "edge"}
                        markerEnd="url(#sym-arrow)"
                      />
                    )}
                    {ba && (
                      <line
                        x1={x2 - (dx / l) * 26 - px}
                        y1={y2 - (dy / l) * 26 - py}
                        x2={x1 + (dx / l) * 26 - px}
                        y2={y1 + (dy / l) * 26 - py}
                        className={one ? "warn" : "edge"}
                        markerEnd="url(#sym-arrow)"
                      />
                    )}
                  </g>
                );
              })}
              {A.map((a) => (
                <g key={a}>
                  <circle cx={pos[a][0]} cy={pos[a][1]} r="25" />
                  <text x={pos[a][0]} y={pos[a][1] + 6}>
                    {a}
                  </text>
                </g>
              ))}
            </svg>
            <footer>
              <span className="cyan">—</span> Symmetric pair present{" "}
              <span className="amber">—</span> Unmatched pair
            </footer>
          </article>
          <article className="sym10114-matrix">
            <h3>Adjacency Matrix (1 = relation)</h3>
            <div>
              <b></b>
              {A.map((a) => (
                <b key={`c${a}`}>{a}</b>
              ))}
              {A.flatMap((a) => [
                <b key={`r${a}`}>{a}</b>,
                ...A.map((b) => (
                  <button
                    key={p(a, b)}
                    aria-label={`Toggle pair ${a}, ${b}`}
                    className={
                      !relation.has(p(a, b)) && relation.has(p(b, a))
                        ? "missing"
                        : relation.has(p(a, b))
                          ? "one"
                          : ""
                    }
                    onClick={() => toggle(a, b)}
                  >
                    {relation.has(p(a, b)) ? 1 : 0}
                  </button>
                )),
              ])}
            </div>
            <p>
              Matrix is mirrored across the main diagonal
              <br />
              for a relation to be symmetric.
            </p>
          </article>
          <aside className="sym10114-controls">
            <h3>Controls & Analysis</h3>
            <p>Toggle relation (a,b): click a cell or edge.</p>
            <section>
              <div>
                <b>{witness ? `(${witness[0]}, ${witness[1]})` : "(a, b)"}</b>
                <strong>{witness ? 1 : "✓"}</strong>
              </div>
              <em>⇄</em>
              <div>
                <b>{witness ? `(${witness[1]}, ${witness[0]})` : "(b, a)"}</b>
                <strong className={symmetric ? "good" : "bad"}>
                  {witness ? 0 : "✓"}
                </strong>
              </div>
              <article>
                <b>Symmetric?</b>
                <strong className={symmetric ? "good" : "bad"}>
                  {symmetric ? (
                    <>
                      <Check /> Yes
                    </>
                  ) : (
                    <>
                      <X /> No
                    </>
                  )}
                </strong>
                <small>
                  {unmatched.length} unmatched pair
                  {unmatched.length === 1 ? "" : "s"}
                </small>
              </article>
            </section>
            <button onClick={completeOne} disabled={symmetric}>
              <Check /> Complete symmetric pair{" "}
              {witness && `(${witness[1]},${witness[0]})`}
            </button>
            <button onClick={completeAll} disabled={symmetric}>
              <Sparkles /> Complete all symmetric pairs
            </button>
            <hr />
            <h4>{symmetric ? "Verification" : "Counterexample (witness)"}</h4>
            <output>
              {symmetric
                ? "Every relation has its reverse. Hence, R is symmetric."
                : `${witness?.[0]} R ${witness?.[1]} is true, but ${witness?.[1]} R ${witness?.[0]} is false. Hence, R is not symmetric.`}
            </output>
          </aside>
        </section>
        <section className="sym10114-theory">
          <article>
            <h3>Symmetry vs Reflexivity</h3>
            <div>
              <p>
                <b>Symmetric</b> (may or may not be reflexive)
                <br />R = {"{"}(1,2), (2,1){"}"}
                <br />
                <span>
                  ✓ Symmetric &nbsp; <i>× Not reflexive</i>
                </span>
              </p>
              <p>
                <b>Reflexive</b> (may or may not be symmetric)
                <br />R = {"{"}(1,1), (2,2){"}"}
                <br />
                <span>
                  ✓ Reflexive &nbsp; <i>× Not symmetric</i>
                </span>
              </p>
            </div>
          </article>
          <article>
            <h3>Exact Definition</h3>
            <p>A relation R on a set A is symmetric if</p>
            <strong>
              aRb &nbsp; ⇒ &nbsp; bRa &nbsp;&nbsp; for all a,b ∈ A
            </strong>
            <p>Equivalently: &nbsp; (a,b) ∈ R ⇒ (b,a) ∈ R</p>
          </article>
          <article>
            <h3>Quick Check</h3>
            <p>✓ &nbsp; Every arrow has a reverse arrow.</p>
            <p>✓ &nbsp; Matrix is mirrored across the main diagonal.</p>
            <p>✓ &nbsp; No unmatched amber entries remain.</p>
            <strong>All true &nbsp; ⇒ &nbsp; Symmetric</strong>
          </article>
        </section>
      </main>
    </section>
  );
}
