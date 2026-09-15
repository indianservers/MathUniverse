import { Link } from "react-router-dom";
import type { StudioMockupPage } from "../../mockup/studioMockupCatalog";
import { ChallengeBox, LiveRow, Panel, Segmented, StatusOk, StepList } from "../../mockup/studioLabKit";
import { FigureToolbar, Phase1LabChrome } from "../../phase1/Phase1LabChrome";
import { useStudioFigure } from "../../phase1/useStudioFigure";
import { cnfForm, dnfForm, dpllSat, evalGate, satWitness, truthTable, xorFromAndOrNot, type Gate } from "./logicMath";

type Fig = { p: boolean; q: boolean; gate: Gate };
const initial: Fig = { p: true, q: false, gate: "AND" };

export default function LogicLab({ page }: { page: StudioMockupPage }) {
  const fig = useStudioFigure(initial);
  return (
    <Phase1LabChrome
      page={page}
      toolbar={
        <FigureToolbar
          canUndo={fig.canUndo}
          canRedo={fig.canRedo}
          exact={fig.exact}
          onUndo={fig.undo}
          onRedo={fig.redo}
          onReset={fig.reset}
          onShare={() => void fig.share()}
          onExact={fig.setExact}
        />
      }
    >
      {(mode) => {
        const out = evalGate(fig.state.gate, fig.state.p, fig.state.q);
        const rows = truthTable(fig.state.gate);
        return (
          <>
            <Panel title={mode}>
              <label className="msk-toggle"><input type="checkbox" checked={fig.state.p} onChange={(e) => fig.commit({ ...fig.state, p: e.target.checked })} /> P</label>
              <label className="msk-toggle"><input type="checkbox" checked={fig.state.q} onChange={(e) => fig.commit({ ...fig.state, q: e.target.checked })} /> Q</label>
              {mode !== "Truth Table" ? (
                <Segmented
                  label="Gate"
                  value={fig.state.gate}
                  onChange={(gate) => fig.commit({ ...fig.state, gate: gate as Gate })}
                  options={["AND", "OR", "XOR", "NAND", "NOR"].map((id) => ({ id, label: id }))}
                />
              ) : null}
            </Panel>
            <section className="msk-panel msk-canvas" data-mode-canvas={mode}>
              {mode === "CNF/DNF" || mode === "SAT" ? (
                <>
                  <p className="msk-formula">CNF: {cnfForm(fig.state.gate)}</p>
                  <p className="msk-formula">DNF: {dnfForm(fig.state.gate)}</p>
                  <p className="msk-note">SAT witness: {satWitness(fig.state.gate) ? `P=${satWitness(fig.state.gate)!.p ? "T" : "F"}, Q=${satWitness(fig.state.gate)!.q ? "T" : "F"}` : "unsatisfiable"}.</p>
                  <p className="msk-note">DPLL (3-var): {dpllSat([["P", "Q"], ["~P", "Q"]]).sat ? "SAT" : "UNSAT"} {JSON.stringify(dpllSat([["P", "Q"], ["~P", "Q"]]).assignment)}</p>
                  <p className="msk-note">Same engine as <Link to="/discrete-world/logic?mode=Truth+Table">Truth Table</Link> · aliases <Link to="/truth-table">/truth-table</Link> and <Link to="/mathematical-logic">/mathematical-logic</Link>.</p>
                </>
              ) : mode === "Circuit" || mode === "Equivalence" ? (
                <svg className="msk-graph" viewBox="0 0 420 180" role="img" aria-label="Logic circuit">
                  <rect width="420" height="180" fill="#f8fbff" />
                  <circle cx="70" cy="50" r="16" fill={fig.state.p ? "#22c55e" : "#94a3b8"} />
                  <circle cx="70" cy="130" r="16" fill={fig.state.q ? "#22c55e" : "#94a3b8"} />
                  <text x="62" y="55" fill="#fff" fontSize="12">P</text>
                  <text x="62" y="135" fill="#fff" fontSize="12">Q</text>
                  <rect x="170" y="70" width="80" height="44" rx="8" fill="#147df2" />
                  <text x="188" y="97" fill="#fff" fontSize="14">{mode === "Equivalence" ? "XOR" : fig.state.gate}</text>
                  <circle cx="330" cy="92" r="18" fill={out ? "#22c55e" : "#64748b"} />
                  <text x="322" y="97" fill="#fff" fontSize="12">Y</text>
                  <line x1="86" y1="50" x2="170" y2="82" stroke="#334155" />
                  <line x1="86" y1="130" x2="170" y2="102" stroke="#334155" />
                  <line x1="250" y1="92" x2="312" y2="92" stroke="#334155" />
                </svg>
              ) : (
                <table className="msk-mini-table">
                  <thead><tr><th>P</th><th>Q</th><th>{fig.state.gate}</th></tr></thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={`${row.p}-${row.q}`} className={row.p === fig.state.p && row.q === fig.state.q ? "is-hot" : undefined}>
                        <td>{row.p ? "T" : "F"}</td>
                        <td>{row.q ? "T" : "F"}</td>
                        <td>{row.out ? "T" : "F"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
            <aside className="msk-panel msk-live">
              <LiveRow color="#147df2" label="AND" value={fig.state.p && fig.state.q ? "1" : "0"} />
              <LiveRow color="#8b45f4" label="OR" value={fig.state.p || fig.state.q ? "1" : "0"} />
              <LiveRow color="#f59e0b" label="XOR" value={xorFromAndOrNot(fig.state.p, fig.state.q) ? "1" : "0"} />
              <StatusOk>Implication P→Q is false only when P is true and Q is false. XOR is (P∨Q) ∧ ¬(P∧Q).</StatusOk>
              <StepList items={["Flip P or Q.", "The live row of the table highlights.", "Build XOR from AND, OR, and NOT."]} />
              <p className="msk-note"><Link to="/truth-table">Truth-table alias</Link> opens this lab.</p>
              <ChallengeBox prompt="True AND False is 0. Enter 0." expected={0} hint="AND needs both true." />
            </aside>
          </>
        );
      }}
    </Phase1LabChrome>
  );
}
