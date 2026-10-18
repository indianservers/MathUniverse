import { Check, Info, RotateCcw, X } from "lucide-react";
import { useMemo, useState } from "react";

import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./TypesRelationsTargetLesson10112.css";


import {A,key,DEFAULT,presets,relationFacts,type Element,type Pair} from "./typesRelationsModel";
import TypesRelationsGraph10112 from "./TypesRelationsGraph10112";
export default function TypesRelationsTargetLesson10112({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [relation, setRelation] = useState(() => new Set<Pair>(DEFAULT));
  const [rules,setRules]=useState(false);
  const [graphVersion,setGraphVersion]=useState(0);
  const [actions, setActions] = useState(0);
  const facts = useMemo(() => relationFacts(relation), [relation]);
  const ordered = A.flatMap((a) =>
    A.filter((b) => relation.has(key(a, b))).map((b) => `(${a}, ${b})`),
  );
  const change = (next: Set<Pair>) => {
    setRelation(next);
    setGraphVersion(n=>n+1);
    setActions((value) => value + 1);
  };
  const toggle = (a: Element, b: Element) => {
    const next = new Set(relation),
      pair = key(a, b);
    if (next.has(pair)) next.delete(pair);
    else next.add(pair);
    change(next);
  };
  const diagnostic = (
    label: string,
    formula: string,
    ok: boolean,
    note: string,
  ) => (
    <article data-property={label.toLowerCase()} data-holds={String(ok)} className={ok ? "ok" : "bad"}>
      <span>{ok ? <Check /> : <X />}</span>
      <div>
        <h3>{label}</h3>
        <em>{formula}</em>
        <p>{note}</p>
      </div>
      <strong>{ok ? "TRUE" : "FALSE"}</strong>
    </article>
  );
  return (
    <section
      className="rel10112-page"
      data-testid="school-mockup-0786"
      data-object-model="dedicated-directed-relation-matrix-property-engine"
      data-pairs={ordered.join(";")}
      data-pair-count={relation.size}
      data-reflexive={String(facts.reflexive)}
      data-symmetric={String(facts.symmetric)}
      data-antisymmetric={String(facts.antisymmetric)}
      data-transitive={String(facts.transitive)}
      data-actions={actions}
    >
      <div className="rel10112-hero">
        <small>CLASS 11 · RELATIONS AND FUNCTIONS</small>
        <h1>Types of Relations</h1>
        <p>
          Explore relations on set A = {"{"}1, 2, 3, 4{"}"}. Build a relation by
          drawing directed arrows.
          <br />
          The relation matrix and properties update instantly.
        </p>

      </div>
      <main>
        <section className="rel10112-graph">
          <h2>
            RELATION GRAPH{" "}
            <i>
              (A = {"{"}1, 2, 3, 4{"}"})
            </i>
            <span>
              Drag to draw arrows <Info />
            </span>
          </h2>
          <TypesRelationsGraph10112 key={graphVersion} relation={relation} toggle={toggle}/>
          <label>Ordered pairs in R:</label>
          <output>{`{${ordered.join(", ") || " "}}`}</output>
        </section>
        <section className="rel10112-matrix">
          <h2>
            RELATION MATRIX <i>Mᵣ</i>
          </h2>
          <p>Rows = first element, Columns = second element</p>
          <div className="matrix-grid">
            <b>A</b>
            {A.map((a) => (
              <b key={`c${a}`}>{a}</b>
            ))}
            {A.flatMap((a) => [
              <b key={`r${a}`}>{a}</b>,
              ...A.map((b) => (
                <button
                  key={key(a, b)}
                  aria-label={`Toggle pair ${a}, ${b}`}
                  aria-pressed={relation.has(key(a,b))}
                  className={relation.has(key(a, b)) ? "selected" : ""}
                  onClick={() => toggle(a, b)}
                >
                  {relation.has(key(a, b)) ? 1 : 0}
                </button>
              )),
            ])}
          </div>
          <footer>
            <span>1 = (i, j) ∈ R</span>
            <span>0 = (i, j) ∉ R</span>
          </footer>
        </section>
        <section className="rel10112-diagnostics">
          <h2>
            RELATION PROPERTY DIAGNOSTICS <Info /><button aria-expanded={rules} onClick={()=>setRules(v=>!v)}>Rules</button>
          </h2>
          {rules&&<div className="rel10112-rules">Each property is checked independently on all four elements. A self-loop is its own reverse. Antisymmetry permits self-loops but forbids two distinct elements related in both directions. The empty relation is symmetric, antisymmetric and transitive, but not reflexive on this nonempty set.</div>}
          {diagnostic(
            "Reflexive",
            "(a, a) ∈ R for all a ∈ A",
            facts.reflexive,
            facts.reflexiveNote,
          )}
          {diagnostic(
            "Symmetric",
            "(a, b) ∈ R ⇒ (b, a) ∈ R",
            facts.symmetric,
            facts.symmetricNote,
          )}
          {diagnostic(
            "Antisymmetric",
            "(a, b) ∈ R and (b, a) ∈ R ⇒ a = b",
            facts.antisymmetric,
            facts.antisymmetricNote,
          )}
          {diagnostic(
            "Transitive",
            "(a, b) ∈ R and (b, c) ∈ R ⇒ (a, c) ∈ R",
            facts.transitive,
            facts.transitiveNote,
          )}
        </section>
      </main>
      <footer className="rel10112-presets">
        <section>
          <h2>
            PRESET RELATIONS{" "}
            <i>
              (ON A = {"{"}1, 2, 3, 4{"}"})
            </i>
          </h2>
          <nav>
            {presets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => change(new Set(preset.pairs))}
              >
                <b>
                  {preset.name} &nbsp; {preset.symbol}
                </b>
                <span>
                  {preset.pairs.length
                    ? preset.name==="Universal" ? "All 16 ordered pairs" : preset.name==="Less-than" ? "{(i,j) | i < j}" : preset.name==="Less-than-or-equal" ? "{(i,j) | i ≤ j}" : `{${preset.pairs.map((pair) => `(${pair.replace(",", ", ")})`).join(", ")}}`
                    : "No ordered pairs"}
                </span>
              </button>
            ))}
          </nav>
          <p>Click a preset to load it. Then modify by drawing arrows.</p>
        </section>
        <aside>
          <h2>ACTIONS</h2>
          <button onClick={() => change(new Set())}>
            <RotateCcw /> Reset Relation
          </button>
          <p>Clears all arrows and resets to ∅.</p>
        </aside>
      </footer>


    </section>
  );
}
