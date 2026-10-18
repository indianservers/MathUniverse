import { Check, Info, Pencil, Play, Plus, X } from "lucide-react";
import { useState } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./ReflexiveRelationsTargetLesson10113.css";


import {pair,initial,positions as pos,reflexiveFacts,resizeRelation,addSelfPairs,reflexiveEdge,type N,type Pair} from "./reflexiveRelationsModel";
export default function ReflexiveRelationsTargetLesson10113({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [relation, setRelation] = useState(() => new Set<Pair>(initial));
  const [view, setView] = useState<"graph" | "matrix">("graph");
  const [tested, setTested] = useState(false);
  const [setSize, setSetSize] = useState<2 | 3 | 4>(4);
  const [editing,setEditing]=useState(false);
  const [draftSize,setDraftSize]=useState<2|3|4>(4);
  const [actions, setActions] = useState(0);
  const {active,missing,reflexive}=reflexiveFacts(relation,setSize);
  const update = (next: Set<Pair>) => {
    setRelation(next);
    setTested(false);
    setActions((n) => n + 1);
  };
  const toggle = (a: N, b: N) => {
    const next = new Set(relation),
      p = pair(a, b);
    if (next.has(p)) next.delete(p);
    else next.add(p);
    update(next);
  };
  const addAll=()=>update(addSelfPairs(relation,setSize));
  const applySet=()=>{setSetSize(draftSize);update(resizeRelation(relation,draftSize));setEditing(false);};
  return (
    <section
      className="rfx10113-page"
      data-testid="school-mockup-0787"
      data-object-model="dedicated-reflexive-directed-graph-matrix-witness-engine"
      data-pairs={[...relation].sort().join(";")}
      data-set-size={setSize}
      data-pair-count={relation.size}
      data-missing={missing.join(",")}
      data-reflexive={String(reflexive)}
      data-view={view}
      data-tested={String(tested)}
      data-actions={actions}
    >
      <div className="rfx10113-hero">
        <section>
          <small>CLASS 11 · RELATIONS AND FUNCTIONS</small>
          <h1>Reflexive Relations</h1>
          <p>
            A relation R on a set A is reflexive if every element is related to
            itself.
          </p>
          <nav>
            <span>18 min</span>
            <span>ADVANCED</span>
            <span>CONCEPT</span>
            <span>graph</span>
            <span>matrix</span>
          </nav>
        </section>

      <aside>
          <b>Definition</b>
          <p>R is reflexive on A if and only if</p>
          <strong>∀ a ∈ A, &nbsp; (a,a) ∈ R</strong>
        </aside>
      </div>
      <main>
        <section className="rfx10113-editor">
          <h2>RELATION EDITOR</h2>
          <div className="setline">
            <span>Set A = {`{${active.join(", ")}}`}</span>
            <button aria-expanded={editing} onClick={()=>{setDraftSize(setSize);setEditing(v=>!v);}}>
              <Pencil /> Edit set
            </button>
          </div>
          {editing&&<div className="rfx10113-set-editor"><label>Set size <select aria-label="Set size" value={draftSize} onChange={e=>setDraftSize(Number(e.target.value) as 2|3|4)}>{[2,3,4].map(n=><option key={n} value={n}>{n} elements</option>)}</select></label><button onClick={applySet}>Apply set</button><button onClick={()=>{setSetSize(4);setDraftSize(4);update(new Set(initial));setView('graph');setEditing(false);}}>Reset lab</button><small>Removing an element removes its ordered pairs. New elements start without a self-pair.</small></div>}
          <p>Toggle an ordered pair (a,b) to include or remove it from R.</p>
          <nav>
            <button
              aria-pressed={view === "graph"}
              className={view === "graph" ? "active" : ""}
              onClick={() => setView("graph")}
            >
              Graph
            </button>
            <button
              aria-pressed={view === "matrix"}
              className={view === "matrix" ? "active" : ""}
              onClick={() => setView("matrix")}
            >
              Matrix
            </button>
          </nav>
          <div className="rfx10113-work">
            <article className={view === "graph" ? "shown" : ""}>
              <h2>DIRECTED GRAPH OF R</h2>
              <svg viewBox="0 0 400 300" aria-label="Reflexive relation graph">
                <defs>
                  <marker
                    id="rfx-arrow"
                    markerWidth="8"
                    markerHeight="8"
                    refX="7"
                    refY="4"
                    orient="auto"
                  >
                    <path d="M0 0L8 4L0 8Z" />
                  </marker>
                  <marker id="rfx-off-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z"/></marker>
                </defs>
                {active.flatMap(a=>active.map(b=>{const on=relation.has(pair(a,b));return <g key={pair(a,b)} role="button" tabIndex={0} aria-label={`Toggle graph pair ${a}, ${b}`} aria-pressed={on} onClick={()=>toggle(a,b)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle(a,b);}}}><path className="rfx10113-edge-hit" d={reflexiveEdge(a,b)}/><path data-graph-pair={pair(a,b)} data-included={String(on)} className={on?'on':'off'} d={reflexiveEdge(a,b)} markerEnd={on?'url(#rfx-arrow)':'url(#rfx-off-arrow)'}/></g>;}))}
                {active.map((a) => (
                  <g
                    key={a}
                    role="button"
                    tabIndex={0}
                    aria-label={`Toggle self-pair ${a}`}
                    aria-pressed={relation.has(pair(a,a))}
                    className={missing[0]===a?"rfx10113-first-missing":""}
                    onClick={() => toggle(a, a)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {e.preventDefault();toggle(a, a);}
                    }}
                  >
                    <circle cx={pos[a][0]} cy={pos[a][1]} r="24" />
                    <text x={pos[a][0]} y={pos[a][1] + 6}>
                      {a}
                    </text>
                  </g>
                ))}
              </svg>
              <footer>
                <span>→ &nbsp; In R (included)</span>
                <span>--- &nbsp; Not in R (excluded)</span>
              </footer>
            </article>
            <article className={view === "matrix" ? "shown" : ""}>
              <h2>ADJACENCY MATRIX &nbsp; Mᵣ</h2>
              <p>Mᵣ[i,j] = 1 if (i,j) ∈ R, else 0.</p>
              <div className="rfx10113-matrix" style={{gridTemplateColumns:`repeat(${setSize+1},minmax(0,1fr))`}}>
                <b>−</b>
                {active.map((a) => (
                  <b key={`c${a}`}>{a}</b>
                ))}
                {active.flatMap((a) => [
                  <b key={`r${a}`}>{a}</b>,
                  ...active.map((b) => (
                    <button
                      key={pair(a, b)}
                      aria-label={`Toggle relation ${a}, ${b}`}
                      aria-pressed={relation.has(pair(a,b))}
                      className={relation.has(pair(a, b)) ? "one" : a===b&&missing[0]===a ? "rfx10113-missing-cell" : ""}
                      onClick={() => toggle(a, b)}
                    >
                      {relation.has(pair(a, b)) ? 1 : 0}
                    </button>
                  )),
                ])}
              </div>
              <p>Click a cell to toggle (i,j).</p>
              <small>
                <Info /> Diagonal cells (i,i) represent self-pairs.
              </small>
            </article>
          </div>
          <footer>
            <button onClick={addAll}>
              <Plus />{" "}
              <span>
                <b>Add all self-pairs</b>
                <small>Add (a,a) for all a ∈ A</small>
              </span>
            </button>
            <button
              onClick={() => {
                setTested(true);
                setActions((n) => n + 1);
              }}
            >
              <Play />
              <span>
                <b>Test Reflexive</b>
                <small>Check if R is reflexive on A</small>
              </span>
            </button>
          </footer>
        </section>
        <aside className="rfx10113-checker">
          <h2>REFLEXIVE CHECKER</h2>
          <div aria-live="polite" className={`rfx10113-result ${reflexive ? "yes" : "no"}`}>
            {reflexive ? <Check /> : <X />}
            <div>
              <strong>{reflexive ? "Reflexive" : "Not Reflexive"}</strong>
              <p>
                {reflexive
                  ? "Every required self-pair is present."
                  : `Missing self-pair: (${missing[0]}, ${missing[0]})`}
              </p>
            </div>
          </div>
          <p>The following self-pairs must be in R.</p>
          <table>
            <thead>
              <tr>
                <th>a</th>
                <th>Self-pair (a,a)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {active.map((a) => {
                const ok = relation.has(pair(a, a));
                return (
                  <tr key={a} data-self-row={a} data-present={String(ok)} className={missing[0]===a?"rfx10113-first-row":""}>
                    <td>{a}</td>
                    <td>
                      ({a}, {a})
                    </td>
                    <td>
                      <span className={ok ? "present" : "missing"}>
                        {ok ? "✓ Present" : "× Missing"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <article>
            <b>How it works</b>
            <p>
              R is reflexive on A if every a ∈ A has a self-loop in the graph
              (diagonal cell = 1 in the matrix). The checker highlights the
              first missing witness.
            </p>
            {tested && (
              <strong className="tested">
                Test complete:{" "}
                {reflexive
                  ? "R is reflexive."
                  : `${missing.length} self-pair${missing.length === 1 ? "" : "s"} missing.`}
              </strong>
            )}
          </article>
        </aside>
      </main>
      <footer className="rfx10113-notes">
        <section>
          <b>Best classroom move</b>
          <p>
            Predict the result before changing the model. Try removing a
            diagonal entry and see which witness fails first.
          </p>
        </section>
        <section>
          <b>Related concept</b>
          <p>Non-reflexive relation: at least one self-pair is missing.</p>
        </section>
      </footer>


    </section>
  );
}

