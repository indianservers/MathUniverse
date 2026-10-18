import { CheckCircle2, Info, Lightbulb, RotateCcw, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./TransitiveRelationsTargetLesson10115.css";


import {nodes,key,initial,positions as pos,findWitnesses,closureOf,edgePath,type Node,type Pair,type Witness} from "./transitiveRelationsModel";
export default function TransitiveRelationsTargetLesson10115({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [relation, setRelation] = useState(() => new Set<Pair>(initial));
  const [source, setSource] = useState<Node | null>(null);
  const [activeWitness,setActiveWitness] = useState<Witness|null>(null);
  const [checked, setChecked] = useState(false);
  const [instructions, setInstructions] = useState(false);
  const [actions, setActions] = useState(0);
  const witnesses = useMemo(() => findWitnesses(relation), [relation]);
  const transitive = witnesses.length === 0;
  const update = (next: Set<Pair>) => {
    setRelation(next);
    setActiveWitness(null);
    setChecked(false);
    setSource(null);
    setActions((n) => n + 1);
  };
  const toggle = (a: Node, b: Node) => {
    const next = new Set(relation),
      p = key(a, b);
    if (next.has(p)) next.delete(p);
    else next.add(p);
    update(next);
  };
  const choose = (node: Node) => {
    if (!source) {
      setSource(node);
      return;
    }
    toggle(source, node);
  };
  const addWitness = (w: Witness) => {
    const next = new Set(relation);
    next.add(w.missing);
    update(next);
  };
  return (
    <section
      className="trn10115-page"
      data-testid="school-mockup-0789"
      data-object-model="dedicated-transitive-closure-path-witness-engine"
      data-pairs={Array.from(relation).sort().join(";")}
      data-pair-count={relation.size}
      data-witnesses={witnesses.map((w) => w.missing).join(";")}
      data-transitive={String(transitive)}
      data-source={source ?? "none"}
      data-checked={String(checked)}
      data-actions={actions}
    >
      <div className="trn10115-hero">
        <small>CLASS 11 · RELATIONS AND FUNCTIONS</small>
        <h1>Transitive Relations</h1>
        <p>
          Build paths a → b and b → c. Your task: add the implied shortcut a →
          c.
          <br />
          Explore how two-step connections force a direct relation.
        </p>
        <nav>
          <span>18 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>interactive lab</span>
        </nav>

      </div>
      <main>
        <div className="trn10115-title">
          <h2>PATH-CLOSURE LAB</h2>
          <button
            onClick={() => {
              setRelation(new Set(initial));
              setSource(null);
              setChecked(false);
              setInstructions(false);
              setActiveWitness(null);
              setActions((n) => n + 1);
            }}
          >
            <RotateCcw /> Reset lab
          </button>
          <button aria-expanded={instructions} onClick={() => setInstructions((v) => !v)}>
            <Info /> Instructions
          </button>
        </div>
        {instructions && (
          <aside className="trn10115-instructions">
            Choose a source node and then a target node. Matrix cells do the
            same operation. Existing relation arrows can be removed from the
            list or matrix.
          </aside>
        )}
        <section className="trn10115-grid">
          <article className="trn10115-graph">
            <h3>GRAPH (DIRECTED)</h3>
            <p>Add arrows by clicking a source node, then a target node.</p>
            <p className="trn10115-selection" aria-live="polite">{source ? `Source ${source} selected. Choose target; same node toggles its self-loop.` : "Choose source then target, or use the matrix."}</p>
            <svg viewBox="0 0 460 220" aria-label="Transitive directed graph">
              <defs>
                <marker
                  id="trn-arrow"
                  markerWidth="8"
                  markerHeight="8"
                  refX="7"
                  refY="4"
                  orient="auto"
                >
                  <path d="M0 0L8 4L0 8Z" />
                </marker>
                <marker id="trn-implied-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z"/></marker>
              </defs>
              {Array.from(relation).map(item=>{const [a,b]=item.split(',') as [Node,Node]; const highlighted=activeWitness && (key(activeWitness.a,activeWitness.b)===item || key(activeWitness.b,activeWitness.c)===item);return <path key={item} data-edge={item} className={`edge ${highlighted?'trn10115-path-highlight':''}`} d={edgePath(a,b,relation)} markerEnd="url(#trn-arrow)" onClick={()=>toggle(a,b)}/>;})}
              {witnesses.map(w=><path key={w.missing} data-implied={w.missing} className="implied" d={edgePath(w.a,w.c,relation,true)} markerEnd="url(#trn-implied-arrow)"/>)}
              {nodes.map((n) => (
                <g
                  key={n}
                  role="button"
                  tabIndex={0}
                  aria-label={`Choose node ${n}`}
                  className={source === n ? "selected" : ""}
                  onClick={() => choose(n)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {e.preventDefault();choose(n);}
                  }}
                >
                  <circle cx={pos[n][0]} cy={pos[n][1]} r="23" />
                  <text x={pos[n][0]} y={pos[n][1] + 7}>
                    {n}
                  </text>
                </g>
              ))}
            </svg>
            <section>
              <h4>LEGEND</h4>
              <p>
                <b>→</b> Direct relation in R
              </p>
              <p>
                <i>---→</i> Implied by transitivity (add it)
              </p>
              <p>
                <span>--→</span> Two-step path (witness)
              </p>
            </section>
            <aside>
              <Lightbulb /> Tip: Click a node, then another node to add an
              arrow. Remove an arrow by clicking it.
            </aside>
          </article>
          <article className="trn10115-matrix">
            <h3>RELATION MATRIX (BOOLEAN)</h3>
            <p>Rows = source, Columns = target.</p>
            <div>
              <b>→</b>
              {nodes.map((n) => (
                <b key={`c${n}`}>{n}</b>
              ))}
              {nodes.flatMap((a) => [
                <b key={`r${a}`}>{a}</b>,
                ...nodes.map((b) => (
                  <button
                    key={key(a, b)}
                    aria-label={`Toggle relation ${a}, ${b}`}
                    aria-pressed={relation.has(key(a,b))}
                    className={
                      relation.has(key(a, b))
                        ? "one"
                        : witnesses.some((w) => w.missing === key(a, b))
                          ? "needed"
                          : ""
                    }
                    onClick={() => toggle(a, b)}
                  >
                    {relation.has(key(a, b)) ? 1 : 0}
                  </button>
                )),
              ])}
            </div>
            <footer>
              <span>1 = related</span>
              <span>0 = not related</span>
            </footer>
            <section>
              <h4>TRANSITIVITY RULE</h4>
              <strong>If (a,b),(b,c) ∈ R &nbsp; ⇒ &nbsp; (a,c) ∈ R</strong>
              <p>
                Whenever there is a path a → b and b → c, then a → c must also
                be in R.
              </p>
            </section>
          </article>
          <article className="trn10115-witness">
            <h3>TRANSITIVITY WITNESSES</h3>
            <p>Missing pairs that must be added (with witness paths).</p>
            {witnesses.length ? (
              witnesses.map((w, i) => (
                <section data-witness={w.missing} key={`${w.missing}-${w.b}`} onMouseEnter={()=>setActiveWitness(w)} onMouseLeave={()=>setActiveWitness(null)} onFocus={()=>setActiveWitness(w)} onBlur={()=>setActiveWitness(null)}>
                  <div className="trn10115-witness-heading">
                    <b>{i + 1}</b>
                    <p>
                      Missing pair: &nbsp; ({w.a}, {w.c})<br />
                      <span>
                        Witness path: &nbsp; {w.a} → {w.b} → {w.c}
                      </span>
                    </p>
                  </div>
                  <footer>
                    ⚠ &nbsp; Add the shortcut {w.a} → {w.c}
                    <button onClick={() => addWitness(w)}>
                      Add {w.a} → {w.c}
                    </button>
                  </footer>
                </section>
              ))
            ) : (
              <aside>
                <CheckCircle2 /> No missing shortcuts: the relation is transitive.
              </aside>
            )}
          </article>
        </section>
        <footer>
          <button onClick={() => update(closureOf(relation))}>
            <Zap /> <b>Compute transitive closure</b>
            <small>Adds all implied pairs and updates the matrix.</small>
          </button>
          <button
            onClick={() => {
              setChecked(true);
              setActions((n) => n + 1);
            }}
          >
            <CheckCircle2 />
            <b>Check</b>
            <small>Check if the relation is transitive.</small>
          </button>
          <section aria-live="polite">
            <b>Status</b>
            <strong
              className={checked ? (transitive ? "ok" : "bad") : "pending"}
            >
              {checked
                ? transitive
                  ? "● Transitive"
                  : "● Not transitive"
                : "● Not yet checked"}
            </strong>
          </section>
        </footer>
      </main>
      <aside className="trn10115-bottom">
        Compute the closure to see all implied relations. Then Check to verify
        transitivity.
        <span>⟳ &nbsp; All changes sync across the graph and matrix.</span>
      </aside>


    </section>
  );
}
