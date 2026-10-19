import { Link } from "react-router-dom";
import type { StudioMockupPage } from "../../mockup/studioMockupCatalog";
import { Panel, Segmented } from "../../mockup/studioLabKit";
import { FigureToolbar, Phase1LabChrome } from "../../phase1/Phase1LabChrome";
import { useStudioFigure } from "../../phase1/useStudioFigure";
import { cnfForm, dnfForm, dpllSat, evalGate, truthTable, type Gate } from "./logicMath";
import "./LogicLab.css";

const gates: Gate[] = ["AND", "OR", "XOR", "NAND", "NOR"];
type Fig = { p: boolean; q: boolean; gate: Gate; compare: Gate; terms: number[]; clauses: string[][] };
const initial: Fig = { p: true, q: false, gate: "AND", compare: "XOR", terms: [], clauses: [["P", "Q"], ["~P", "Q"]] };
const bit = (v: boolean) => v ? "1" : "0";
const term = (p: boolean, q: boolean) => `(${p ? "P" : "¬P"} ∧ ${q ? "Q" : "¬Q"})`;

export default function LogicLab({ page }: { page: StudioMockupPage }) {
  const fig = useStudioFigure(initial);
  const s = { ...initial, ...fig.state };
  const set = (patch: Partial<Fig>) => fig.commit({ ...s, ...patch });
  const rows = truthTable(s.gate);
  const out = evalGate(s.gate, s.p, s.q);
  const mismatches = rows.filter(r => r.out !== evalGate(s.compare, r.p, r.q));
  const solution = dpllSat(s.clauses);
  const clauseValues = s.clauses.map(c => c.some(l => l === "P" ? s.p : l === "~P" ? !s.p : l === "Q" ? s.q : !s.q));
  const gatePicker = (compare = false) => <Segmented label={compare ? "Compare with" : "Gate"} value={compare ? s.compare : s.gate} onChange={g => set(compare ? { compare: g as Gate } : { gate: g as Gate })} options={gates.map(id => ({ id, label: id }))} />;
  const assignments = <div className="logic-assignments">{rows.map((r, i) => <button type="button" key={i} aria-pressed={r.p === s.p && r.q === s.q} onClick={() => set({ p: r.p, q: r.q })}>P {bit(r.p)} · Q {bit(r.q)}</button>)}</div>;
  return <Phase1LabChrome page={page} toolbar={<FigureToolbar canUndo={fig.canUndo} canRedo={fig.canRedo} exact={fig.exact} onUndo={fig.undo} onRedo={fig.redo} onReset={fig.reset} onShare={() => void fig.share()} onExact={fig.setExact} />}>
    {mode => <>
      <Panel title="Experiment controls">
        {gatePicker()}
        <p className="msk-note">Choose an assignment, or press the input switches on the circuit.</p>
        {assignments}
        <button type="button" className="logic-action" onClick={() => { const i = rows.findIndex(r => r.p === s.p && r.q === s.q); const next = rows[(i + 1) % 4]; set({ p: next.p, q: next.q }); }}>Next assignment →</button>
        {mode === "Equivalence" && gatePicker(true)}
        {mode === "SAT" && <><button type="button" className="logic-action" onClick={() => set({ clauses: [["P"], ["~P"]] })}>Try a contradiction</button><button type="button" className="logic-action" onClick={() => set({ clauses: initial.clauses })}>Load satisfiable example</button></>}
      </Panel>
      <section className="msk-panel logic-workspace" data-mode-canvas={mode}>
        {mode === "Truth Table" ? <>
          <h3>Explore every possible input</h3><p>Choose a row to send its inputs through the gate.</p>
          <table className="msk-mini-table"><thead><tr><th>Assignment</th><th>P</th><th>Q</th><th>{s.gate}</th></tr></thead><tbody>{rows.map((r, i) => <tr key={i} className={r.p === s.p && r.q === s.q ? "is-hot" : ""}><td><button type="button" aria-label={`Use P ${bit(r.p)} Q ${bit(r.q)}`} onClick={() => set({ p: r.p, q: r.q })}>Explore {i + 1}</button></td><td>{bit(r.p)}</td><td>{bit(r.q)}</td><td>{bit(r.out)}</td></tr>)}</tbody></table>
        </> : mode === "CNF/DNF" ? <>
          <h3>Build the DNF from truth-table rows</h3><p>Select the terms that make {s.gate} true. Each term represents one assignment.</p>
          <div className="logic-terms">{rows.map((r, i) => <button type="button" key={i} aria-pressed={s.terms.includes(i)} onClick={() => set({ terms: s.terms.includes(i) ? s.terms.filter(t => t !== i) : [...s.terms, i] })}>{term(r.p, r.q)}</button>)}</div>
          <p className="msk-formula">Your DNF: {s.terms.length ? s.terms.map(i => term(rows[i].p, rows[i].q)).join(" ∨ ") : "⊥"}</p>
          <p role="status">{rows.every((r, i) => r.out === s.terms.includes(i)) ? "Correct — your expression matches all four assignments." : `${rows.filter((r, i) => r.out === s.terms.includes(i)).length}/4 assignments match. Keep building.`}</p>
          <details><summary>Reveal normal forms</summary><p>CNF: {cnfForm(s.gate)}</p><p>DNF: {dnfForm(s.gate)}</p></details>
        </> : mode === "SAT" ? <>
          <h3>Clause workshop · CNF</h3><p>Click a literal to cycle absent → positive → negated. Clauses are joined by AND; literals within a clause by OR.</p>
          {s.clauses.map((clause, i) => <div className="logic-clause" key={i}><b>Clause {i + 1}</b>{["P", "Q"].map(v => <button type="button" key={v} aria-label={`Cycle ${v} in clause ${i + 1}`} onClick={() => { const next = clause.filter(l => l !== v && l !== `~${v}`); if (!clause.includes(v) && !clause.includes(`~${v}`)) next.push(v); else if (clause.includes(v)) next.push(`~${v}`); set({ clauses: s.clauses.map((c, j) => i === j ? next : c) }); }}>{clause.includes(v) ? v : clause.includes(`~${v}`) ? `¬${v}` : `Add ${v}`}</button>)}<span className={clauseValues[i] ? "logic-true" : "logic-false"}>{clauseValues[i] ? "Satisfied" : "False"}</span><button type="button" aria-label={`Remove clause ${i + 1}`} onClick={() => set({ clauses: s.clauses.filter((_, j) => i !== j) })}>×</button></div>)}
          <button type="button" disabled={s.clauses.length >= 8} onClick={() => set({ clauses: [...s.clauses, []] })}>+ Add clause</button>
          <p className="msk-formula">{s.clauses.length ? s.clauses.map(c => c.length ? `(${c.map(l => l.replace("~", "¬")).join(" ∨ ")})` : "⊥").join(" ∧ ") : "⊤"}</p>
          <p role="status">Current assignment: {clauseValues.every(Boolean) ? "all clauses satisfied" : "some clauses are false"}. {solution.sat ? "SAT — a satisfying assignment exists." : "UNSAT — no assignment satisfies every clause."}</p>
          <button type="button" disabled={!solution.sat} onClick={() => set({ p: solution.assignment.P ?? false, q: solution.assignment.Q ?? false })}>Apply SAT witness</button>
        </> : <>
          <h3>{mode === "Equivalence" ? "Search for a counterexample" : "Send a signal through the circuit"}</h3><p>Press P or Q to switch its signal. Press the gate to cycle its operation.</p>
          <div className="logic-circuit">
            <div className="logic-inputs">{(["p", "q"] as const).map(v => <button type="button" key={v} aria-pressed={s[v]} onClick={() => set({ [v]: !s[v] })}>{v.toUpperCase()}<strong>{bit(s[v])}</strong></button>)}</div>
            <svg viewBox="0 0 100 160" aria-hidden="true"><path d="M0 30 H40 V80 H100" className={s.p ? "on" : ""}/><path d="M0 130 H60 V80 H100" className={s.q ? "on" : ""}/></svg>
            <button type="button" className="logic-gate" aria-label={`Gate ${s.gate}, click to change`} onClick={() => set({ gate: gates[(gates.indexOf(s.gate) + 1) % gates.length] })}>{s.gate}<small>Change gate ↻</small></button>
            <svg viewBox="0 0 100 160" aria-hidden="true"><path d="M0 80 H100" className={out ? "on" : ""}/></svg><output className={`logic-lamp ${out ? "on" : ""}`} aria-label="Circuit output">{bit(out)}</output>
          </div>
          {mode === "Equivalence" && <><p className="msk-formula">{s.gate}: {bit(out)} · {s.compare}: {bit(evalGate(s.compare, s.p, s.q))}</p><p role="status">{mismatches.length ? `${mismatches.length} counterexamples: these gates are not equivalent.` : "Equivalent for all four assignments."}</p><div className="logic-assignments">{mismatches.map((r, i) => <button type="button" key={i} onClick={() => set({ p: r.p, q: r.q })}>Test P {bit(r.p)}, Q {bit(r.q)}</button>)}</div></>}
        </>}
      </section>
      <aside className="msk-panel msk-live"><h3>Live evaluation</h3><div role="status" aria-live="polite"><p className="msk-formula">P = {bit(s.p)} · Q = {bit(s.q)}</p><p className="msk-formula">{s.gate} → {bit(out)}</p></div><p>{s.gate === "AND" ? "AND needs both inputs on." : s.gate === "OR" ? "OR needs at least one input on." : s.gate === "XOR" ? "XOR needs exactly one input on." : s.gate === "NAND" ? "NAND reverses AND." : "NOR reverses OR."}</p><h4>Try this</h4><p>{mode === "SAT" ? "Make one clause P and another ¬P. Can any assignment satisfy both?" : mode === "CNF/DNF" ? "Switch to XOR and build its expression using exactly two terms." : mode === "Equivalence" ? "Compare AND with OR, then test a counterexample." : "Find every assignment that lights the output. Then change the gate and predict what changes."}</p><Link to="/truth-table">Truth-table alias</Link></aside>
    </>}
  </Phase1LabChrome>;
}
