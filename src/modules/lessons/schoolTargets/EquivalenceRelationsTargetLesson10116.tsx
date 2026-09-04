import { Check, Info, RotateCcw, Star, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./EquivalenceRelationsTargetLesson10116.css";

type Node = "a" | "b" | "c" | "d" | "e" | "f";
type Pair = `${Node},${Node}`;
const nodes: Node[] = ["a", "b", "c", "d", "e", "f"];
const k = (a: Node, b: Node): Pair => `${a},${b}`;
const groups: Node[][] = [["a", "b", "c"], ["d", "e"], ["f"]];
const initial = groups.flatMap((group) =>
  group.flatMap((a) => group.map((b) => k(a, b))),
);
const pos: Record<Node, [number, number]> = {
  a: [65, 85],
  b: [175, 85],
  c: [285, 85],
  d: [120, 205],
  e: [230, 205],
  f: [340, 250],
};

function diagnose(relation: Set<Pair>) {
  const reflexive = nodes.find((a) => !relation.has(k(a, a)));
  const symmetric = nodes
    .flatMap((a) => nodes.map((b) => [a, b] as const))
    .find(([a, b]) => relation.has(k(a, b)) && !relation.has(k(b, a)));
  const transitive = nodes
    .flatMap((a) => nodes.flatMap((b) => nodes.map((c) => [a, b, c] as const)))
    .find(
      ([a, b, c]) =>
        relation.has(k(a, b)) &&
        relation.has(k(b, c)) &&
        !relation.has(k(a, c)),
    );
  return {
    reflexive,
    symmetric,
    transitive,
    valid: !reflexive && !symmetric && !transitive,
  };
}
function partition(relation: Set<Pair>) {
  const unseen = new Set(nodes),
    result: Node[][] = [];
  while (unseen.size) {
    const seed = unseen.values().next().value as Node;
    const group = nodes.filter((n) => relation.has(k(seed, n)));
    group.forEach((n) => unseen.delete(n));
    result.push(group);
  }
  return result;
}

export default function EquivalenceRelationsTargetLesson10116({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [relation, setRelation] = useState(() => new Set<Pair>(initial));
  const [source, setSource] = useState<Node | null>(null);
  const [actions, setActions] = useState(0);
  const facts = useMemo(() => diagnose(relation), [relation]);
  const classes = facts.valid ? partition(relation) : [];
  const update = (next: Set<Pair>) => {
    setRelation(next);
    setSource(null);
    setActions((n) => n + 1);
  };
  const toggle = (a: Node, b: Node) => {
    const next = new Set(relation),
      pair = k(a, b);
    if (next.has(pair)) next.delete(pair);
    else next.add(pair);
    update(next);
  };
  const choose = (node: Node) => {
    if (!source) {
      setSource(node);
      return;
    }
    toggle(source, node);
  };
  const gate = (name: string, pass: boolean, rule: string) => (
    <article className={pass ? "pass" : "fail"}>
      <span>{pass ? <Check /> : <X />}</span>
      <div>
        <b>{name}</b>
        <p>{rule}</p>
      </div>
      <strong>{pass ? "PASS" : "FAIL"}</strong>
    </article>
  );
  const witness = facts.reflexive
    ? `Missing self-pair (${facts.reflexive}, ${facts.reflexive}).`
    : facts.symmetric
      ? `(${facts.symmetric[0]}, ${facts.symmetric[1]}) is present but (${facts.symmetric[1]}, ${facts.symmetric[0]}) is missing.`
      : facts.transitive
        ? `(${facts.transitive[0]}, ${facts.transitive[1]}) and (${facts.transitive[1]}, ${facts.transitive[2]}) require (${facts.transitive[0]}, ${facts.transitive[2]}).`
        : "No counterexample: all three properties hold.";
  return (
    <section
      className="eqv10116-page"
      data-testid="school-mockup-0790"
      data-object-model="dedicated-equivalence-relation-partition-engine"
      data-pair-count={relation.size}
      data-reflexive={String(!facts.reflexive)}
      data-symmetric={String(!facts.symmetric)}
      data-transitive={String(!facts.transitive)}
      data-equivalence={String(facts.valid)}
      data-classes={classes.map((c) => c.join("")).join("|")}
      data-source={source ?? "none"}
      data-actions={actions}
    >
      <header>
        <section>
          <small>CLASS 11 · RELATIONS AND FUNCTIONS</small>
          <h1>Equivalence Relations</h1>
          <p>
            Build a relation on a set and test whether it is an equivalence
            relation.
          </p>
          <strong>
            Equivalence relation ={" "}
            <span>Reflexive + Symmetric + Transitive</span>
          </strong>
          <nav>
            <i>18 min</i>
            <i>ADVANCED</i>
            <i>CONCEPT</i>
            <i>interactive lab</i>
          </nav>
        </section>
        <aside>
          <Info />
          <p>
            Equivalence classes are disjoint and cover the set.
            <br />• Disjoint: No two classes share an element.
            <br />• Cover: Every element is in exactly one class.
          </p>
          <button
            onClick={() => {
              setRelation(new Set(initial));
              setSource(null);
              setActions((n) => n + 1);
            }}
          >
            <RotateCcw /> Reset lab
          </button>
        </aside>
      </header>
      <main>
        <article className="eqv10116-graph">
          <h2>
            <b>1</b> RELATION GRAPH <em>(edit)</em>
          </h2>
          <p>Click two nodes to toggle a pair (add/remove).</p>
          <div className="legend">
            <span>◯ Self-loop (a,a)</span>
            <span>⟶ Pair (a,b)</span>
          </div>
          <svg viewBox="0 0 405 315" aria-label="Equivalence relation graph">
            <defs>
              <marker
                id="eqv-arrow"
                markerWidth="7"
                markerHeight="7"
                refX="6"
                refY="3.5"
                orient="auto"
              >
                <path d="M0 0L7 3.5L0 7Z" />
              </marker>
            </defs>
            {nodes
              .flatMap((a, i) => nodes.slice(i + 1).map((b) => [a, b] as const))
              .filter(
                ([a, b]) => relation.has(k(a, b)) || relation.has(k(b, a)),
              )
              .map(([a, b]) => {
                const [x1, y1] = pos[a],
                  [x2, y2] = pos[b],
                  dx = x2 - x1,
                  dy = y2 - y1,
                  l = Math.hypot(dx, dy);
                return (
                  <line
                    key={`${a}${b}`}
                    x1={x1 + (dx / l) * 20}
                    y1={y1 + (dy / l) * 20}
                    x2={x2 - (dx / l) * 20}
                    y2={y2 - (dy / l) * 20}
                    className="edge"
                    markerEnd="url(#eqv-arrow)"
                  />
                );
              })}
            {nodes
              .filter((a) => relation.has(k(a, a)))
              .map((a) => {
                const [x, y] = pos[a];
                return (
                  <path
                    key={`l${a}`}
                    d={`M${x - 10} ${y - 18}C${x - 38} ${y - 47},${x + 38} ${y - 47},${x + 10} ${y - 18}`}
                    className="loop"
                  />
                );
              })}
            {nodes.map((a) => (
              <g
                key={a}
                role="button"
                tabIndex={0}
                aria-label={`Choose element ${a}`}
                className={`${groups.findIndex((g) => g.includes(a)) === 0 ? "g1" : groups.findIndex((g) => g.includes(a)) === 1 ? "g2" : "g3"} ${source === a ? "selected" : ""}`}
                onClick={() => choose(a)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") choose(a);
                }}
              >
                <circle cx={pos[a][0]} cy={pos[a][1]} r="20" />
                <text x={pos[a][0]} y={pos[a][1] + 6}>
                  {a}
                </text>
              </g>
            ))}
          </svg>
          <footer>
            <p>
              Set &nbsp; S = {"{"}
              {nodes.join(", ")}
              {"}"}
            </p>
            <button onClick={() => update(new Set())}>
              <Trash2 /> Clear all pairs
            </button>
          </footer>
        </article>
        <article className="eqv10116-matrix">
          <h2>
            <b>2</b> RELATION MATRIX <em>Mᵣ</em>
          </h2>
          <p>Rows → columns (1 means related)</p>
          <div>
            <b></b>
            {nodes.map((n) => (
              <b key={`c${n}`}>{n}</b>
            ))}
            {nodes.flatMap((a) => [
              <b key={`r${a}`}>{a}</b>,
              ...nodes.map((b) => (
                <button
                  key={k(a, b)}
                  aria-label={`Toggle pair ${a}, ${b}`}
                  className={relation.has(k(a, b)) ? "one" : ""}
                  onClick={() => toggle(a, b)}
                >
                  {relation.has(k(a, b)) ? 1 : 0}
                </button>
              )),
            ])}
          </div>
          <footer>
            |S| = 6 &nbsp;&nbsp;&nbsp; Total pairs = {relation.size}
            <p>
              <span>1</span> = related &nbsp;&nbsp; 0 = not related
            </p>
          </footer>
        </article>
        <article className="eqv10116-gates">
          <h2>
            <b>3</b> LIVE PROPERTY GATES
          </h2>
          <p>All gates must be green.</p>
          {gate(
            "Reflexive",
            !facts.reflexive,
            "(a,a) is in R for every a ∈ S.",
          )}
          {gate("Symmetric", !facts.symmetric, "If (a,b) ∈ R then (b,a) ∈ R.")}
          {gate(
            "Transitive",
            !facts.transitive,
            "If (a,b) and (b,c) are in R then (a,c) is in R.",
          )}
          <aside className={facts.valid ? "valid" : "invalid"}>
            <Star />
            <b>{facts.valid ? "All gates passed!" : "A gate failed"}</b>
            <span>
              {facts.valid ? "R is an equivalence relation." : witness}
            </span>
          </aside>
        </article>
        <article className="eqv10116-classes">
          <h2>
            <b>4</b> EQUIVALENCE CLASSES <em>(partition)</em>
          </h2>
          <p>Elements are grouped into equivalence classes.</p>
          {facts.valid ? (
            classes.map((group, i) => (
              <section key={group.join("")} className={`c${i}`}>
                <strong>
                  [{group[0]}] = {`{ ${group.join(", ")} }`}
                </strong>
                <footer>
                  Size: {group.length}
                  <span>Class {i + 1}</span>
                </footer>
              </section>
            ))
          ) : (
            <aside>
              Edit the relation until all three gates pass to reveal a valid
              partition.
            </aside>
          )}
          <div>
            <h3>PARTITION CHECK</h3>
            <p>✓ Classes are pairwise disjoint.</p>
            <p>✓ Classes cover the entire set S.</p>
            <strong>
              {facts.valid ? "✓ VALID PARTITION" : "× NOT A PARTITION"}
            </strong>
          </div>
        </article>
      </main>
      <footer className="eqv10116-help">
        <section>
          <h3>TRY IT</h3>
          <p>
            Edit the relation by clicking pairs in the graph.
            <br />• If any gate fails, see a counterexample (witness).
            <br />• When all gates pass, the partition is shown.
          </p>
        </section>
        <section>
          <b>Witness</b>
          <p>{witness}</p>
        </section>
        <section>
          <p>✓ PASS &nbsp; Property holds</p>
          <p>× FAIL &nbsp; Property fails</p>
        </section>
      </footer>
    </section>
  );
}
