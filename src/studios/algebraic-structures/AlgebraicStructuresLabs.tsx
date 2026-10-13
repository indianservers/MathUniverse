import BooleanAlgebraDashboard from "./BooleanAlgebraDashboard";
import PosetsLatticesDashboard from "./PosetsLatticesDashboard";
import { useStudioState } from "../phase1/StudioModelProvider";
import { Check, GitFork, GitMerge, Grid3X3, HelpCircle, Share2, ToggleLeft, Trophy } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import StructureTopicArt from "./StructureTopicArt";
import { ObserveStrip } from "../landing/StudioLandingExtras";
import { markLandingVisit, relativeOpened, useLandingSession } from "../landing/studioLandingSession";
import "../landing/studioLanding.css";
import {
  classifyOperation,
  modularTable,
  parseCarrierSet,
  randomOperationTable,
  rebuildOperationTable,
  type OperationTable,
  type StructureClassification,
} from "../../modules/algebraic-structures/algebraicStructuresEngine";

export const structureTabs = [
  { id: "home", label: "Studio Home", hint: "Pick a lab", to: "/algebraic-structures" },
  { id: "structure-test", label: "Structure Test", hint: "Check axioms", to: "/algebraic-structures/structure-test" },
  { id: "cayley-tables", label: "Cayley Tables", hint: "Build and explore", to: "/algebraic-structures/cayley-tables" },
  { id: "semigroups-monoids", label: "Semigroups & Monoids", hint: "Explore closure & identity", to: "/algebraic-structures/semigroups-monoids" },
  { id: "posets-lattices", label: "Posets & Lattices", hint: "Visualize order structures", to: "/algebraic-structures/posets-lattices" },
  { id: "boolean-algebra", label: "Boolean Algebra", hint: "Logic and sets", to: "/algebraic-structures/boolean-algebra" },
  { id: "groups-rings-fields", label: "Groups, Rings & Fields", hint: "Cosets, units and quotients", to: "/algebraic-structures/groups-rings-fields" },
] as const;

export type AlgebraicStructuresPage = (typeof structureTabs)[number]["id"];

const nodeColors = ["#3b82f6", "#8b5cf6", "#14b8a6", "#f59e0b", "#ef4444", "#0ea5e9"];

export function StructureTabs({ page }: { page: AlgebraicStructuresPage }) {
  return (
    <nav className="as-tabs" aria-label="Algebraic Structures labs">
      {structureTabs.map((tab) => (
        <Link key={tab.id} to={tab.to} className={`as-tab ${tab.id === page ? "active" : ""}`}>
          {tab.id === "structure-test" ? <GitMerge /> : tab.id === "cayley-tables" ? <Grid3X3 /> : tab.id === "boolean-algebra" ? <ToggleLeft /> : tab.id === "home" ? <GitFork /> : <GitFork />}
          <span><b>{tab.label.toUpperCase()}</b><small>{tab.hint}</small></span>
        </Link>
      ))}
    </nav>
  );
}

export function StructuresHome() {
  const session = useLandingSession("structures");
  return (
    <div className="as-home" data-testid="algebraic-structures-home">
      <p className="msk-note">Eight-minute win: test whether a table is a group, then open Cayley tables.</p>
      <ObserveStrip items={[
        { title: "Observe", text: "Watch identity cells light up." },
        { title: "Understand", text: "Axioms are checks on a table." },
        { title: "Why", text: "Groups need inverses; monoids do not." },
        { title: "Try", text: "Load Z₄ and classify it." },
        { title: "Challenge", text: "Find a magma that is not associative." },
      ]} />
      <div className="sl-chips">
        <Link className="sl-mini-link" to="/algebraic-structures/structure-test?op=z4">Add mod n</Link>
        <Link className="sl-mini-link" to="/algebraic-structures/boolean-algebra">AND</Link>
        <Link className="sl-mini-link" to="/algebraic-structures/cayley-tables">Composition</Link>
        <Link className="sl-mini-link" to="/discrete-world/logic">Nearby: Logic</Link>
        <Link className="sl-mini-link" to="/set-theory">Nearby: Set Theory</Link>
      </div>
      <p className="sl-kicker">Continue {session.lastLabel} · {relativeOpened(session.lastOpenedAt)}</p>
      <div className="as-home-grid">
        {structureTabs.filter((tab) => tab.id !== "home").map((tab, index) => (
          <Link key={tab.id} className="as-card as-home-card" to={tab.to} onClick={() => markLandingVisit("structures", tab.id, tab.to, tab.label)}>
            <b>{tab.label}</b>
            <small>{tab.hint}</small>
            <StructureTopicArt topic={tab.id} index={index} />
            <em><span>Launch</span><span aria-hidden="true">→</span></em>
          </Link>
        ))}
      </div>
      <p className="sl-banner">Counterexample of the day: subtraction on integers is not associative. <Link to="/algebraic-structures/structure-test?op=random">Load a random table</Link> and hunt for a failed (ab)c vs a(bc).</p>
    </div>
  );
}

export function LabToolbar({
  onLoad,
  onReset,
  onShare,
}: {
  onLoad: (kind: string) => void;
  onReset: () => void;
  onShare: () => void;
}) {
  return (
    <div className="as-actions">
      <select aria-label="Load example" defaultValue="" onChange={(event) => { if (event.target.value) onLoad(event.target.value); event.target.value = ""; }}>
        <option value="">Load example</option>
        <option value="z4">Cyclic group Z₄</option>
        <option value="z5">Cyclic group Z₅</option>
        <option value="and">Boolean AND</option>
        <option value="max">Max on {"{0,1,2,3}"}</option>
        <option value="random">Random magma</option>
      </select>
      <button className="as-ghost" type="button" onClick={onReset}>Reset</button>
      <button className="as-icon-btn" type="button" aria-label="Help" title="Explore the current operation and axioms." onClick={() => window.dispatchEvent(new Event("as-lab-help"))}><HelpCircle /></button>
      <button className="as-icon-btn" type="button" aria-label="Share" onClick={onShare}><Share2 /></button>
    </div>
  );
}

function parseSet(text: string, fallback: string[]) {
  const next = parseCarrierSet(text);
  return next.length ? next : fallback;
}

function CycleGraph({ elements, table, identity }: { elements: string[]; table: OperationTable; identity: string | null }) {
  const n = Math.max(elements.length, 1);
  const cx = 160;
  const cy = 120;
  const r = 78;
  const [shift, setShift] = useStudioState<Record<string, { x: number; y: number }>>("AlgebraicStructuresLabs:CycleGraph:shift", {});
  const drag = useRef<string | null>(null);
  const layout = elements.map((el, index) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / n;
    const extra = shift[el] ?? { x: 0, y: 0 };
    return { el, x: cx + r * Math.cos(angle) + extra.x, y: cy + r * Math.sin(angle) + extra.y };
  });
  const byEl = Object.fromEntries(layout.map((point) => [point.el, point]));
  const generator = elements.find((el) => el !== identity) ?? elements[0];
  const onMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!drag.current) return;
    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 320 - cx;
    const y = ((event.clientY - rect.top) / rect.height) * 240 - cy;
    const index = elements.indexOf(drag.current);
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / n;
    const baseX = r * Math.cos(angle);
    const baseY = r * Math.sin(angle);
    setShift((prev) => ({ ...prev, [drag.current!]: { x: x - baseX, y: y - baseY } }));
  };
  return (
    <svg viewBox="0 0 320 240" role="img" aria-label="Operation graph you can drag" onPointerMove={onMove} onPointerUp={() => { drag.current = null; }} onPointerLeave={() => { drag.current = null; }}>
      <defs><marker id="as-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L8 3 L0 6 z" fill="#94a3b8" /></marker></defs>
      {elements.map((from) => {
        const dest = generator ? table[from]?.[generator] : undefined;
        const start = byEl[from];
        const end = dest ? byEl[dest] : undefined;
        if (!start || !end || dest === from) return null;
        return (
          <g key={`${from}-${dest}`}>
            <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="#94a3b8" strokeWidth="2" markerEnd="url(#as-arrow)" />
            <text x={(start.x + end.x) / 2} y={(start.y + end.y) / 2 - 6} fontSize="11" fill="#64748b">*{generator}</text>
          </g>
        );
      })}
      {layout.map((point, index) => (
        <g key={point.el} style={{ cursor: "grab" }} onPointerDown={(event) => { drag.current = point.el; event.currentTarget.setPointerCapture(event.pointerId); }}>
          <circle cx={point.x} cy={point.y} r="18" fill={nodeColors[index % nodeColors.length]} />
          <text x={point.x} y={point.y + 4} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700">{point.el}</text>
        </g>
      ))}
    </svg>
  );
}

function AssocPlay({ elements, table }: { elements: string[]; table: OperationTable }) {
  const a = elements[0] ?? "0";
  const b = elements[1] ?? elements[0] ?? "0";
  const c = elements[2] ?? elements[0] ?? "0";
  const ab = table[a]?.[b] ?? "?";
  const bc = table[b]?.[c] ?? "?";
  const left = table[ab]?.[c] ?? "?";
  const right = table[a]?.[bc] ?? "?";
  const [phase, setPhase] = useStudioState("AlgebraicStructuresLabs:AssocPlay:phase", 0);
  return (
    <div className="as-assoc" data-phase={phase}>
      <p>Associativity animation: (ab)c vs a(bc)</p>
      <div className="as-assoc-row">
        <button type="button" className={phase === 0 ? "active" : ""} onClick={() => setPhase(0)}>({a}{b}){c} = {ab}*{c} = {left}</button>
        <button type="button" className={phase === 1 ? "active" : ""} onClick={() => setPhase(1)}>{a}({b}{c}) = {a}*{bc} = {right}</button>
      </div>
      <p className={left === right ? "as-ok" : "as-note"}>{left === right ? `(ab)c = a(bc) = ${left}` : `Counterexample: (${a}${b})${c} = ${left} but ${a}(${b}${c}) = ${right}`}</p>
    </div>
  );
}

function PropertyList({ info }: { info: StructureClassification }) {
  const items = [
    { on: info.closed, title: "Closure", detail: "All results are in S." },
    { on: info.associative, title: "Associative", detail: "(a * b) * c = a * (b * c) for all a, b, c ∈ S." },
    { on: Boolean(info.identity), title: "Identity element", detail: info.identity ? `${info.identity} is an identity.` : "No identity." },
    { on: info.inverses, title: "Inverses", detail: "Every element has an inverse." },
    { on: info.commutative, title: "Commutative", detail: "a * b = b * a for all a, b ∈ S." },
    { on: info.latinSquare, title: "Latin square", detail: "Each row and column contains each element exactly once." },
  ];
  return (
    <div className="as-props">
      {items.map((item) => (
        <div className={`as-prop ${item.on ? "" : "is-off"}`} key={item.title}>
          <Check />
          <div><b>{item.title}</b><small>{item.detail}</small></div>
        </div>
      ))}
      <div className="as-ok"><Check /><span>{info.abelian ? "(S, *) is an abelian group. It is cyclic only if one element generates the whole group." : info.group ? "(S, *) is a group." : info.monoid ? "This is a monoid." : info.semigroup ? "This is a semigroup." : info.magma ? "This is a magma (closed)." : "Not closed."}</span></div>
      {info.failures[0] ? <p className="as-note">Not a group because {info.failures[0]}</p> : null}
    </div>
  );
}

function Challenge({ prompt, expected, hint, kind = "live" }: { prompt: string; expected: string; hint: string; kind?: "concept" | "live" }) {
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("");
  useEffect(() => { setAnswer(""); setStatus(""); }, [prompt, expected]);
  return (
    <section className="as-card as-challenge">
      <h2><Trophy /> Challenge</h2>
      <p>{prompt}</p>
      <input className="as-answer" value={answer} onChange={(event) => { setAnswer(event.target.value); setStatus(""); }} aria-label="Challenge answer" placeholder="Your answer..." />
      <div className="as-check-row">
        <button className="as-cta" type="button" onClick={() => {
          const normalize = (value: string) => value.replace(/\s/g, "").replace(/∧/g, ",").toLowerCase();
          setStatus(answer.trim() && normalize(answer) === normalize(expected) ? kind === "live" ? "Correct — that matches the current model." : "Correct — this concept check is solved." : hint);
        }}>Check</button>
        <button className="as-ghost" type="button" onClick={() => setStatus(hint)}>Hint</button>
      </div>
      {status ? <p role="status">{status}</p> : null}
    </section>
  );
}

function CayleyGrid({
  elements,
  table,
  onChange,
  hot,
}: {
  elements: string[];
  table: OperationTable;
  onChange: (table: OperationTable) => void;
  hot?: [string, string];
}) {
  return (
    <table className="as-table" aria-label="Cayley table">
      <thead><tr><th>*</th>{elements.map((el) => <th key={el}>{el}</th>)}</tr></thead>
      <tbody>
        {elements.map((row) => (
          <tr key={row}>
            <th>{row}</th>
            {elements.map((col) => {
              const rowValues = elements.map((item) => table[row]?.[item] ?? "");
              const latin = new Set(rowValues).size === elements.length;
              return (
              <td key={col} className={`${hot && hot[0] === row && hot[1] === col ? "is-hot" : hot && (hot[0] === row || hot[1] === col) ? "is-soft" : ""} ${latin ? "is-latin" : ""}`}>
                <input
                  value={table[row]?.[col] ?? ""}
                  aria-label={`${row} * ${col}`}
                  onChange={(event) => onChange({ ...table, [row]: { ...table[row], [col]: event.target.value } })}
                  onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
                    const rowIndex = elements.indexOf(row);
                    const colIndex = elements.indexOf(col);
                    const move = (nextRow: number, nextCol: number) => {
                      const target = event.currentTarget.closest("table")?.querySelector<HTMLInputElement>(`input[aria-label="${elements[nextRow]} * ${elements[nextCol]}"]`);
                      target?.focus();
                    };
                    if (event.key === "ArrowRight" && colIndex < elements.length - 1) { event.preventDefault(); move(rowIndex, colIndex + 1); }
                    if (event.key === "ArrowLeft" && colIndex > 0) { event.preventDefault(); move(rowIndex, colIndex - 1); }
                    if (event.key === "ArrowDown" && rowIndex < elements.length - 1) { event.preventDefault(); move(rowIndex + 1, colIndex); }
                    if (event.key === "ArrowUp" && rowIndex > 0) { event.preventDefault(); move(rowIndex - 1, colIndex); }
                  }}
                />
              </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function maxTable(size: number) {
  const elements = Array.from({ length: size }, (_, index) => String(index));
  const table: OperationTable = {};
  for (const a of elements) {
    table[a] = {};
    for (const b of elements) table[a][b] = String(Math.max(Number(a), Number(b)));
  }
  return { elements, table };
}

function useZ4() {
  const seed = modularTable(4, "add");
  const [params] = useSearchParams();
  const [setText, setSetText] = useStudioState("AlgebraicStructuresLabs:useZ4:setText", seed.elements.join(", "));
  const [table, setTable] = useState<OperationTable>(seed.table);
  const [left, setLeft] = useStudioState("AlgebraicStructuresLabs:useZ4:left", "1");
  const [right, setRight] = useStudioState("AlgebraicStructuresLabs:useZ4:right", "3");
  const [result, setResult] = useStudioState("AlgebraicStructuresLabs:useZ4:result", seed.table["1"]?.["3"] ?? "0");
  const [help, setHelp] = useStudioState("AlgebraicStructuresLabs:useZ4:help", "");
  const elements = parseSet(setText, seed.elements);
  const info = useMemo(() => classifyOperation(elements, rebuildOperationTable(elements, table)), [elements, table]);
  const load = (kind: string) => {
    if (kind === "z5") {
      const next = modularTable(5, "add");
      setSetText(next.elements.join(", "));
      setTable(next.table);
      return;
    }
    if (kind === "and") {
      setSetText("0, 1");
      setTable({ "0": { "0": "0", "1": "0" }, "1": { "0": "0", "1": "1" } });
      return;
    }
    if (kind === "max") {
      const next = maxTable(4);
      setSetText(next.elements.join(", "));
      setTable(next.table);
      return;
    }
    if (kind === "random") {
      setTable(randomOperationTable(seed.elements));
      return;
    }
    const next = modularTable(4, "add");
    setSetText(next.elements.join(", "));
    setTable(next.table);
  };
  useEffect(() => {
    const op = params.get("op");
    if (op) load(op);
  }, [params]);
  useEffect(() => {
    const onLoad = (event: Event) => load(String((event as CustomEvent).detail ?? "z4"));
    const onReset = () => load("z4");
    const onHelp = () => setHelp("Edit the Cayley table, then read closure, associativity, identity, and inverses. Random tables often fail associativity.");
    window.addEventListener("as-lab-load", onLoad);
    window.addEventListener("as-lab-reset", onReset);
    window.addEventListener("as-lab-help", onHelp);
    return () => {
      window.removeEventListener("as-lab-load", onLoad);
      window.removeEventListener("as-lab-reset", onReset);
      window.removeEventListener("as-lab-help", onHelp);
    };
  });
  return { setText, setSetText, elements, table, setTable, left, setLeft, right, setRight, result, setResult, info, load, reset: () => load("z4"), help, likeZn: elements.length>0 && elements.every((a,i)=>a===String(i)&&elements.every((b,j)=>table[a]?.[b]===String((i+j)%elements.length))) };
}

export function StructureTestLab() {
  const state = useZ4();
  const [view, setView] = useStudioState<"graph" | "cayley" | "diagram">("AlgebraicStructuresLabs:StructureTestLab:view", "graph");
  const [auto, setAuto] = useStudioState("AlgebraicStructuresLabs:StructureTestLab:auto", true);
  const challengeA = state.elements.includes("2") ? "2" : state.elements[0] ?? state.left;
  const challengeB = state.elements.includes("3") ? "3" : state.elements[1] ?? challengeA;
  const product = state.table[challengeA]?.[challengeB] ?? "";
  return (
    <div>
      <div className="as-grid-3">
        <section className="as-card">
          <h2>Define a custom operation</h2>
          <p>Set a finite carrier set and define its binary operation.</p>
          <label className="as-field">Carrier set S<input value={state.setText} onChange={(event) => state.setSetText(event.target.value)} /></label>
          <small>Enter elements separated by commas (e.g. 0, 1, 2, 3).</small>
          <label className="as-field">Operation <span className="as-req">*</span><select defaultValue="custom"><option>Custom table</option></select></label>
          <CayleyGrid elements={state.elements} table={state.table} onChange={state.setTable} hot={[state.left, state.right]} />
          <div className="as-row">
            <button type="button" onClick={() => state.setTable(randomOperationTable(state.elements))}>Random</button>
            <button type="button" onClick={() => state.reset()}>Clear</button>
            <label className="as-toggle"><input type="checkbox" checked={auto} onChange={(event) => setAuto(event.target.checked)} /> Auto-validate</label>
          </div>
        </section>
        <section className="as-card">
          <h2>Visualization</h2>
          <p>See your structure from multiple perspectives.</p>
          <div className="as-viz-tabs">
            <button className={view === "graph" ? "active" : ""} type="button" onClick={() => setView("graph")}>Operation graph</button>
            <button className={view === "cayley" ? "active" : ""} type="button" onClick={() => setView("cayley")}>Cayley table view</button>
            <button className={view === "diagram" ? "active" : ""} type="button" onClick={() => setView("diagram")}>Structure diagram</button>
          </div>
          {view === "graph" ? <CycleGraph elements={state.elements} table={state.table} identity={state.info.identity} /> : null}
          {view === "cayley" ? <CayleyGrid elements={state.elements} table={state.table} onChange={state.setTable} hot={[state.left, state.right]} /> : null}
          {view === "diagram" ? (
            <ol className="as-ladder" aria-label="Magma to group">
              <li className={state.info.magma ? "is-on" : ""}>Magma (closed)</li>
              <li className={state.info.semigroup ? "is-on" : ""}>Semigroup (associative)</li>
              <li className={state.info.monoid ? "is-on" : ""}>Monoid (identity)</li>
              <li className={state.info.group ? "is-on" : ""}>Group (inverses)</li>
            </ol>
          ) : null}
          {state.info.failures.length ? <p className="as-note">Counterexample: {state.info.failures[0]}</p> : null}
          <div className="as-note">{state.likeZn ? `This abelian group matches addition modulo ${state.elements.length} (Zₙ).` : "This table is not forced to be Zₙ addition — read the live axioms."}</div>
          {state.help ? <p className="as-note">{state.help}</p> : null}
        </section>
        <section className="as-card">
          <h2>Structure Properties</h2>
          <p>Check the algebraic properties for the current operation.</p>
          {auto ? <PropertyList info={state.info} /> : <p className="as-note">Auto-validate is off. Turn it on to classify the table.</p>}
        </section>
      </div>
      <div className="as-bottom">
        <section className="as-card">
          <h2>Operation explorer</h2>
          <p>Compute results using the current operation table.</p>
          <div className="as-compute">
            <label className="as-field">a<select value={state.left} onChange={(event) => state.setLeft(event.target.value)}>{state.elements.map((el) => <option key={el}>{el}</option>)}</select></label>
            <label className="as-field">b<select value={state.right} onChange={(event) => state.setRight(event.target.value)}>{state.elements.map((el) => <option key={el}>{el}</option>)}</select></label>
            <button className="as-cta" type="button" onClick={() => state.setResult(state.table[state.left]?.[state.right] ?? "")}>Compute</button>
            <output className="as-result">{state.result}</output>
          </div>
        </section>
        <section className="as-card">
          <h2>Elements & inverse pairs</h2>
          <table className="as-table"><thead><tr><th>Element a</th><th>Inverse of a</th><th>Check (a * a⁻¹)</th></tr></thead>
            <tbody>{state.elements.map((el) => <tr key={el}><td>{el}</td><td>{state.info.inverseOf[el] ?? "—"}</td><td>{state.info.identity ? `${el} * ${state.info.inverseOf[el] ?? "?"} = ${state.info.identity}` : "—"}</td></tr>)}</tbody>
          </table>
        </section>
        <Challenge prompt={`Using the current operation table, what is ${challengeA} * ${challengeB}?`} expected={product} hint={`Read the Cayley cell at row ${challengeA}, column ${challengeB}.`} />
      </div>
    </div>
  );
}

export function CayleyTablesLab() {
  const state = useZ4();
  const [cellA, setCellA] = useStudioState("AlgebraicStructuresLabs:CayleyTablesLab:cellA", "2");
  const [cellB, setCellB] = useStudioState("AlgebraicStructuresLabs:CayleyTablesLab:cellB", "3");
  const entry = state.table[cellA]?.[cellB] ?? "";
  return (
    <div>
      <div className="as-grid-3">
        <section className="as-card">
          <h2>Define the Cayley table</h2>
          <label className="as-field">Carrier set S<input value={state.setText} onChange={(event) => state.setSetText(event.target.value)} /></label>
          <label className="as-field">Operation <span className="as-req">*</span><select defaultValue="custom"><option>Custom table (edit below)</option></select></label>
          <h3 style={{ fontSize: 13 }}>Selected cell interpretation</h3>
          <p>Entry ({cellA}, {cellB}) = {entry}</p>
          <p>This means {cellA} * {cellB} = {entry} in the defined operation.</p>
          <h2>Row and column behavior</h2>
          <table className="as-table"><thead><tr><th>Row for element {cellA}</th>{state.elements.map((el) => <th key={el}>{el}</th>)}</tr></thead>
            <tbody><tr><th>{cellA}</th>{state.elements.map((el) => <td key={el}>{state.table[cellA]?.[el]}</td>)}</tr></tbody>
          </table>
        </section>
        <section className="as-card">
          <h2>Cayley table workspace</h2>
          <div className="as-row">
            <button type="button" onClick={() => state.setTable(randomOperationTable(state.elements))}>Random</button>
            <label className="as-toggle"><input type="checkbox" defaultChecked /> Auto-validate</label>
          </div>
          <CayleyGrid elements={state.elements} table={state.table} onChange={state.setTable} hot={[cellA, cellB]} />
          <h2>Structure visualization</h2>
          <CycleGraph elements={state.elements} table={state.table} identity={state.info.identity} />
          <div className="as-note">{state.likeZn ? `This table matches addition modulo ${state.elements.length}.` : "Custom table — homomorphism to Z₂ only holds for mod-4 addition."}</div>
        </section>
        <div>
          <section className="as-card">
            <h2>Structure properties</h2>
            <PropertyList info={state.info} />
          </section>
          <section className="as-card" style={{ marginTop: 12 }}>
            <h2>Example structures</h2>
            <p>Carrier set: {state.elements.join(", ")}</p>
            <p>Operation: a + b ≡ (a + b) mod {state.elements.length}</p>
            <button className="as-cta" type="button" onClick={() => state.load("z4")}>Load</button>
          </section>
        </div>
      </div>
      <div className="as-bottom">
        <section className="as-card">
          <h2>Homomorphism Z₄ → Z₂</h2>
          <p>φ(n) = n mod 2. Check φ(a * b) = φ(a) * φ(b) on the live table.</p>
          <div className="as-dual-figures">
            <CycleGraph elements={state.elements} table={state.table} identity={state.info.identity} />
            <CycleGraph elements={["0", "1"]} table={{ "0": { "0": "0", "1": "1" }, "1": { "0": "1", "1": "0" } }} identity="0" />
          </div>
          <p>{state.elements.every((a) => state.elements.every((b) => {
            const left = Number(state.table[a]?.[b] ?? 0) % 2;
            const right = (Number(a) % 2 + Number(b) % 2) % 2;
            return left === right;
          })) ? "φ preserves + mod 4 → + mod 2." : "This table is not the mod-4 homomorphism."}</p>
        </section>
        <section className="as-card">
          <h2>Cell picker</h2>
          <div className="as-compute">
            <label className="as-field">Row<select value={cellA} onChange={(event) => setCellA(event.target.value)}>{state.elements.map((el) => <option key={el}>{el}</option>)}</select></label>
            <label className="as-field">Column<select value={cellB} onChange={(event) => setCellB(event.target.value)}>{state.elements.map((el) => <option key={el}>{el}</option>)}</select></label>
          </div>
        </section>
        <Challenge prompt={`Using the current Cayley table, what is ${state.elements.includes("3") ? "3" : (state.elements[0] ?? "")} * ${state.elements.includes("2") ? "2" : (state.elements[1] ?? "")}?`} expected={state.table[state.elements.includes("3") ? "3" : (state.elements[0] ?? "")]?.[state.elements.includes("2") ? "2" : (state.elements[1] ?? "")] ?? entry} hint="Read the cell for the two stated elements." />
      </div>
    </div>
  );
}

export function SemigroupsMonoidsLab() {
  const state = useZ4();
  const [example, setExample] = useStudioState("AlgebraicStructuresLabs:SemigroupsMonoidsLab:example", "z4");
  const [testE, setTestE] = useStudioState("AlgebraicStructuresLabs:SemigroupsMonoidsLab:testE", "0");
  const [view, setView] = useStudioState<"graph" | "cayley" | "assoc">("AlgebraicStructuresLabs:SemigroupsMonoidsLab:view", "graph");
  const identityHolds = state.elements.every((x) => state.table[testE]?.[x] === x && state.table[x]?.[testE] === x);
  return (
    <div>
      <div className="as-grid-3">
        <section className="as-card">
          <h2>Setup: Define a structure</h2>
          <p>Choose a set and binary operation, or select a preset example.</p>
          <label className="as-field">Carrier set S<input value={state.setText} onChange={(event) => state.setSetText(event.target.value)} /></label>
          <label className="as-field">Operation <span className="as-req">*</span>
            <select value={example} onChange={(event) => { setExample(event.target.value); state.load(event.target.value); }}>
              <option value="z4">Addition modulo n (a + b mod n)</option>
              <option value="and">Boolean (AND)</option>
              <option value="max">Max (join on a chain)</option>
            </select>
          </label>
          <label className="as-field">Modulus n<input type="number" value={state.elements.length} readOnly /></label>
          <p>Quick examples</p>
          <div className="as-examples">
            {[["z4", "Z₄ (addition)"], ["z5", "Z₅ (addition)"], ["and", "Boolean (AND)"], ["max", "Max"]].map(([id, label]) => (
              <button key={id} type="button" className={example === id ? "active" : ""} onClick={() => { setExample(id); state.load(id); }}>{label}</button>
            ))}
          </div>
        </section>
        <section className="as-card">
          <h2>Structure visualizer</h2>
          <div className="as-viz-tabs">
            <button className={view === "graph" ? "active" : ""} type="button" onClick={() => setView("graph")}>Operation graph</button>
            <button className={view === "cayley" ? "active" : ""} type="button" onClick={() => setView("cayley")}>Cayley table</button>
            <button className={view === "assoc" ? "active" : ""} type="button" onClick={() => setView("assoc")}>Composition view</button>
          </div>
          {view === "graph" ? <CycleGraph elements={state.elements} table={state.table} identity={state.info.identity} /> : null}
          {view === "cayley" ? <CayleyGrid elements={state.elements} table={state.table} onChange={state.setTable} hot={[state.left, state.right]} /> : null}
          {view === "assoc" ? <AssocPlay elements={state.elements} table={state.table} /> : null}
          {state.info.failures.length ? <p className="as-note">Counterexample: {state.info.failures[0]}</p> : null}
          <p>Set: S = {"{"}{state.elements.join(", ")}{"}"} · Identity: {state.info.identity ?? "none"} · Type: {state.info.abelian ? "finite abelian group" : state.info.group ? "group" : state.info.monoid ? "monoid" : state.info.semigroup ? "semigroup" : state.info.magma ? "magma" : "not closed"}</p>
          <div className="as-note">{state.likeZn ? `This operation behaves like addition modulo ${state.elements.length} (Zₙ).` : "Not Zₙ addition — use the ladder for the live type."}</div>
        </section>
        <section className="as-card">
          <h2>Structure properties</h2>
          <PropertyList info={state.info} />
        </section>
      </div>
      <div className="as-bottom">
        <section className="as-card">
          <h2>Operation explorer</h2>
          <div className="as-compute">
            <label className="as-field">a<select value={state.left} onChange={(event) => state.setLeft(event.target.value)}>{state.elements.map((el) => <option key={el}>{el}</option>)}</select></label>
            <label className="as-field">b<select value={state.right} onChange={(event) => state.setRight(event.target.value)}>{state.elements.map((el) => <option key={el}>{el}</option>)}</select></label>
            <button className="as-cta" type="button" onClick={() => state.setResult(state.table[state.left]?.[state.right] ?? "")}>Compute</button>
            <output className="as-result">{state.result}</output>
          </div>
        </section>
        <section className="as-card">
          <h2>Identity test</h2>
          <label className="as-field">Test element e<select value={testE} onChange={(event) => setTestE(event.target.value)}>{state.elements.map((el) => <option key={el}>{el}</option>)}</select></label>
          <div className="as-id-ok">{identityHolds ? `${testE} is an identity element.` : `${testE} is not an identity.`}</div>
        </section>
        <section className="as-card">
          <h2>Inverse pairs</h2>
          <table className="as-table"><thead><tr><th>a</th><th>Inverse of a</th></tr></thead>
            <tbody>{state.elements.map((el) => <tr key={el}><td>{el}</td><td>{state.info.inverseOf[el] ?? "—"}</td></tr>)}</tbody>
          </table>
          <h2>Classification ladder</h2>
          <div className="as-ladder">
            <span className={state.info.magma ? "is-on" : ""}><Check /> Magma (closed)</span>
            <span className={state.info.semigroup ? "is-on" : ""}><Check /> Semigroup (associative)</span>
            <span className={state.info.monoid ? "is-on" : ""}><Check /> Monoid (identity)</span>
            <span className={state.info.group ? "is-on" : ""}><Check /> Group (inverses)</span>
          </div>
        </section>
      </div>
      <div style={{ marginTop: 12 }}>
        <Challenge prompt={`Using the current structure, find the inverse of ${state.elements.includes("3") ? "3" : (state.elements[0] ?? "")}.`} expected={state.info.inverseOf[state.elements.includes("3") ? "3" : (state.elements[0] ?? "")] ?? "none"} hint="Find an element whose product with the stated element is the identity, or write none." />
      </div>
    </div>
  );
}

export function PosetsLatticesLab() { return <PosetsLatticesDashboard />; }

export function BooleanAlgebraLab() { return <BooleanAlgebraDashboard />; }
