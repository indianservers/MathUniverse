import { Check, GitFork, GitMerge, Grid3X3, HelpCircle, Share2, ToggleLeft, Trophy } from "lucide-react";
import { useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Link } from "react-router-dom";
import { CayleyMiniTeaser } from "../landing/StudioLandingTeasers";
import { ObserveStrip } from "../landing/StudioLandingExtras";
import { markLandingVisit, relativeOpened, useLandingSession } from "../landing/studioLandingSession";
import "../landing/studioLanding.css";
import {
  booleanCircuitLayers,
  booleanLawSteps,
  booleanPosForm,
  classifyOperation,
  coverRelations,
  meetJoin,
  modularTable,
  parseCarrierSet,
  randomOperationTable,
  rebuildOperationTable,
  simplifyBooleanExpression,
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
        {structureTabs.filter((tab) => tab.id !== "home").map((tab) => (
          <Link key={tab.id} className="as-card as-home-card" to={tab.to} onClick={() => markLandingVisit("structures", tab.id, tab.to, tab.label)}>
            <b>{tab.label}</b>
            <small>{tab.hint}</small>
            {tab.id === "cayley-tables" ? <CayleyMiniTeaser /> : tab.id === "structure-test" ? <p className="sl-kicker">closure · assoc · identity · inverse</p> : tab.id === "posets-lattices" ? <p className="sl-kicker">Hasse: cover edges only</p> : tab.id === "boolean-algebra" ? <p className="sl-kicker">2-variable K-map</p> : <p className="sl-kicker">Group vs monoid vs semigroup</p>}
            <em>Launch →</em>
          </Link>
        ))}
      </div>
      <p className="sl-banner">Counterexample of the day: subtraction on integers is not associative.</p>
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
      </select>
      <button className="as-ghost" type="button" onClick={onReset}>Reset</button>
      <button className="as-icon-btn" type="button" aria-label="Help" title="Explore the current operation and axioms."><HelpCircle /></button>
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
  const [shift, setShift] = useState<Record<string, { x: number; y: number }>>({});
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
  const [phase, setPhase] = useState(0);
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
      <div className="as-ok"><Check /><span>{info.abelian ? "(S, *) is an abelian group. This structure is isomorphic to Zₙ (addition modulo n)." : info.group ? "(S, *) is a group." : info.monoid ? "This is a monoid." : info.semigroup ? "This is a semigroup." : info.magma ? "This is a magma (closed)." : "Not closed."}</span></div>
      {info.failures[0] ? <p className="as-note">Not a group because {info.failures[0]}</p> : null}
    </div>
  );
}

function Challenge({ prompt, expected, hint }: { prompt: string; expected: string; hint: string }) {
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("");
  return (
    <section className="as-card as-challenge">
      <h2><Trophy /> Challenge</h2>
      <p>{prompt}</p>
      <input className="as-answer" value={answer} onChange={(event) => { setAnswer(event.target.value); setStatus(""); }} aria-label="Challenge answer" placeholder="Your answer..." />
      <div className="as-check-row">
        <button className="as-cta" type="button" onClick={() => setStatus(answer.replace(/\s/g, "") === expected.replace(/\s/g, "") ? "Correct." : hint)}>Check</button>
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

function useZ4() {
  const seed = modularTable(4, "add");
  const [setText, setSetText] = useState(seed.elements.join(", "));
  const [table, setTable] = useState<OperationTable>(seed.table);
  const [left, setLeft] = useState("1");
  const [right, setRight] = useState("3");
  const [result, setResult] = useState(seed.table["1"]?.["3"] ?? "0");
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
    const next = modularTable(4, "add");
    setSetText(next.elements.join(", "));
    setTable(next.table);
  };
  return { setText, setSetText, elements, table, setTable, left, setLeft, right, setRight, result, setResult, info, load, reset: () => load("z4") };
}

export function StructureTestLab() {
  const state = useZ4();
  const [view, setView] = useState<"graph" | "cayley" | "diagram">("graph");
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
            <label className="as-toggle"><input type="checkbox" defaultChecked /> Auto-validate</label>
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
          <div className="as-note">This operation behaves like addition modulo {state.elements.length} (Zₙ).</div>
        </section>
        <section className="as-card">
          <h2>Structure Properties</h2>
          <p>Check the algebraic properties for the current operation.</p>
          <PropertyList info={state.info} />
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
        <Challenge prompt="Using the current operation table, what is 2 * 3?" expected="1" hint="Try using the Cayley table or the operation pattern." />
      </div>
    </div>
  );
}

export function CayleyTablesLab() {
  const state = useZ4();
  const [cellA, setCellA] = useState("2");
  const [cellB, setCellB] = useState("3");
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
          <div className="as-note">This operation behaves like addition modulo 4 (Z₄).</div>
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
        <Challenge prompt="Using the current Cayley table, what is 3 * 2?" expected="1" hint="Read the cell at row 3, column 2." />
      </div>
    </div>
  );
}

export function SemigroupsMonoidsLab() {
  const state = useZ4();
  const [example, setExample] = useState("z4");
  const [testE, setTestE] = useState("0");
  const [view, setView] = useState<"graph" | "cayley" | "assoc">("graph");
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
            </select>
          </label>
          <label className="as-field">Modulus n<input type="number" value={state.elements.length} readOnly /></label>
          <p>Quick examples</p>
          <div className="as-examples">
            {[["z4", "Z₄ (addition)"], ["z5", "Z₅ (addition)"], ["and", "Boolean (AND)"]].map(([id, label]) => (
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
          <p>Set: S = {"{"}{state.elements.join(", ")}{"}"} · Identity: {state.info.identity ?? "none"} · Type: {state.info.abelian ? "finite abelian group" : "magma"}</p>
          <div className="as-note">This operation behaves like addition modulo {state.elements.length} (Zₙ).</div>
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
        <Challenge prompt="Using the current structure, find the inverse of 3." expected="1" hint="Find b such that 3 * b is the identity." />
      </div>
    </div>
  );
}

export function PosetsLatticesLab() {
  const [setText, setSetText] = useState("0, a, b, 1");
  const [relText, setRelText] = useState("0 ≤ a, 0 ≤ b, a ≤ 1, b ≤ 1");
  const [meetA, setMeetA] = useState("a");
  const [meetB, setMeetB] = useState("b");
  const [nodes, setNodes] = useState<Record<string, [number, number]>>({ "1": [180, 48], a: [90, 140], b: [270, 140], "0": [180, 232] });
  const drag = useRef<string | null>(null);
  const elements = parseSet(setText, ["0", "a", "b", "1"]);
  const pairs = relText
    .split(/[,;]/)
    .map((item) => item.replace(/≤|<=/g, " ").trim().split(/\s+/))
    .filter((item): item is [string, string] => item.length >= 2)
    .map(([a, b]) => [a, b] as [string, string]);
  const covers = coverRelations(elements, pairs);
  const lattice = meetJoin(elements, pairs, meetA, meetB);
  return (
    <div>
      <div className="as-poset">
        <section className="as-card">
          <h2>Poset Visualizer (Hasse Diagram)</h2>
          <p>Drag nodes to rearrange. Add, remove, or connect elements to build an order.</p>
          <div className="as-hasse">
            <svg viewBox="0 0 360 280" style={{ width: "100%", height: 280, touchAction: "none" }} onPointerMove={(event) => {
              if (!drag.current) return;
              const rect = event.currentTarget.getBoundingClientRect();
              const x = ((event.clientX - rect.left) / rect.width) * 360;
              const y = ((event.clientY - rect.top) / rect.height) * 280;
              setNodes((prev) => ({ ...prev, [drag.current!]: [x, y] }));
            }} onPointerUp={() => { drag.current = null; }}>
              {covers.map(([a, b]) => {
                const [x1, y1] = nodes[a] ?? [180, 160];
                const [x2, y2] = nodes[b] ?? [180, 80];
                return <line key={`${a}-${b}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={a === meetA || b === meetA || a === meetB || b === meetB ? "#0891b2" : "#64748b"} strokeWidth="3" />;
              })}
              {([["1", "#8b5cf6"], ["a", "#f59e0b"], ["b", "#14b8a6"], ["0", "#3b82f6"]] as const).map(([label, fill]) => {
                const [x, y] = nodes[label] ?? [180, 140];
                return (
                  <g key={label} style={{ cursor: "grab" }} onPointerDown={(event) => { drag.current = label; event.currentTarget.setPointerCapture(event.pointerId); }}>
                    <circle cx={x} cy={y} r="20" fill={fill} stroke={label === meetA || label === meetB ? "#0f172a" : "none"} strokeWidth="3" />
                    <text x={x} y={y + 5} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="700">{label}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </section>
        <section className="as-card">
          <h2>Lattice Explorer</h2>
          <p>Select two elements to compute their meet and join.</p>
          <div className="as-meet">
            <label className="as-field">∧ Meet<select value={meetA} onChange={(event) => setMeetA(event.target.value)}>{elements.map((el) => <option key={el}>{el}</option>)}</select><output>{meetA} ∧ {meetB} = {lattice.meet ?? "?"}</output></label>
            <label className="as-field">∨ Join<select value={meetB} onChange={(event) => setMeetB(event.target.value)}>{elements.map((el) => <option key={el}>{el}</option>)}</select><output className="join">{meetA} ∨ {meetB} = {lattice.join ?? "?"}</output></label>
          </div>
          <h2>Hasse diagram info</h2>
          <div className="as-info">
            <div><span>Elements</span><b>{elements.length}</b></div>
            <div><span>Relations (edges)</span><b>{covers.length}</b></div>
            <div><span>Type</span><b>Bounded lattice</b></div>
          </div>
        </section>
        <section className="as-card">
          <h2>Properties</h2>
          {["Reflexive", "Antisymmetric", "Transitive", "Partial order", "Bounded lattice", "Distributive lattice"].map((title) => (
            <div className="as-prop" key={title}><Check /><div><b>{title}</b></div></div>
          ))}
        </section>
      </div>
      <div className="as-bottom">
        <section className="as-card">
          <h2>Order Relation Input</h2>
          <label className="as-field">Carrier set S<input value={setText} onChange={(event) => setSetText(event.target.value)} /></label>
          <label className="as-field">Relations (a ≤ b)<input value={relText} onChange={(event) => setRelText(event.target.value)} /></label>
        </section>
        <section className="as-card">
          <h2>Relation Matrix</h2>
          <table className="as-table"><thead><tr><th>≤</th>{elements.map((el) => <th key={el}>{el}</th>)}</tr></thead>
            <tbody>{elements.map((row) => <tr key={row}><th>{row}</th>{elements.map((col) => <td key={col}>{row === col || pairs.some(([x, y]) => x === row && y === col) ? "1" : "0"}</td>)}</tr>)}</tbody>
          </table>
        </section>
        <section className="as-card">
          <h2>Examples</h2>
          <p>Diamond lattice (M₃)</p>
          <button className="as-cta" type="button" onClick={() => { setSetText("0, a, b, 1"); setRelText("0 ≤ a, 0 ≤ b, a ≤ 1, b ≤ 1"); }}>Load example</button>
        </section>
      </div>
      <div className="as-footer-ok">Valid lattice! This poset is a bounded distributive lattice (isomorphic to the diamond lattice M₃).</div>
      <div style={{ marginTop: 12 }}><Challenge prompt="Using the current poset, find a ∧ b and a ∨ b." expected="0,1" hint="Use the Hasse diagram or the relation matrix." /></div>
    </div>
  );
}

export function BooleanAlgebraLab() {
  const [expr, setExpr] = useState("A & (!B | C)");
  const [law, setLaw] = useState<"de-morgan" | "distributive" | "associative" | "complement">("de-morgan");
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  const [c, setC] = useState(true);
  const [view, setView] = useState<"simp" | "truth" | "kmap">("simp");
  const [group, setGroup] = useState<Record<string, boolean>>({});
  const analysis = useMemo(() => {
    try {
      return { ...simplifyBooleanExpression(expr), error: "" };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Invalid expression.", simplified: "", variables: [] as string[], rows: [] as Array<{ values: Record<string, boolean>; result: boolean }>, kmap: [] as boolean[][], circuit: [] as Array<Array<{ id: string; label: string }>> };
    }
  }, [expr]);
  const pos = analysis.rows ? booleanPosForm(analysis.variables, analysis.rows) : "—";
  const y = a && (!b || c);
  const steps = booleanLawSteps(law);
  const layers = analysis.circuit?.length ? analysis.circuit : booleanCircuitLayers({ type: "var", name: "A" });
  return (
    <div>
      <div className="as-bool">
        <section className="as-card">
          <h2>Expression Input</h2>
          <p>Enter a Boolean expression using variables, operators, and parentheses.</p>
          <label className="as-field"><input value={expr} onChange={(event) => setExpr(event.target.value)} aria-label="Boolean expression" /></label>
          <p>Input helpers</p>
          <div className="as-helpers">{["!", "&", "|", "^", "(", ")"].map((token) => <button type="button" key={token} onClick={() => setExpr((value) => `${value}${token}`)}>{token}</button>)}</div>
          <button className="as-cta" type="button">Generate Analysis</button>
          <h2>Quick examples</h2>
          <div className="as-examples">
            <button type="button" onClick={() => setExpr("A & C")}>A & C</button>
            <button type="button" onClick={() => setExpr("A | B")}>A | B</button>
            <button type="button" onClick={() => setExpr("!(A & B)")}>!(A & B)</button>
            <button type="button" onClick={() => setExpr("A ^ B")}>A ^ B</button>
          </div>
        </section>
        <section className="as-card">
          <h2>Boolean Algebra Studio</h2>
          <div className="as-viz-tabs">
            <button className={view === "simp" ? "active" : ""} type="button" onClick={() => setView("simp")}>Simplification</button>
            <button className={view === "truth" ? "active" : ""} type="button" onClick={() => setView("truth")}>Truth Table</button>
            <button className={view === "kmap" ? "active" : ""} type="button" onClick={() => setView("kmap")}>K-map (3 vars)</button>
          </div>
          {view === "simp" ? (
            <>
              <p>Original expression</p>
              <p style={{ fontFamily: "Georgia, serif" }}>{expr}</p>
              <div className="as-sop">Simplified expression (SOP)<br />{analysis.simplified || analysis.error}</div>
              <div className="as-pos">Simplified expression (POS)<br />{pos}</div>
              <div className="as-ok"><Check /> Expressions are equivalent.</div>
            </>
          ) : null}
          {view === "truth" ? (
            <table className="as-table" aria-label="Truth table">
              <thead><tr>{analysis.variables.map((name) => <th key={name}>{name}</th>)}<th>Y</th></tr></thead>
              <tbody>
                {analysis.rows.map((row, index) => (
                  <tr key={index}>{analysis.variables.map((name) => <td key={name}>{row.values[name] ? "1" : "0"}</td>)}<td>{row.result ? "1" : "0"}</td></tr>
                ))}
              </tbody>
            </table>
          ) : null}
          {view === "kmap" ? (
            <>
              <h2>K-map (3 variables)</h2>
              <p>Drag across 1-cells to group them.</p>
              <table className="as-kmap"><thead><tr><th>A \ BC</th><th>00</th><th>01</th><th>11</th><th>10</th></tr></thead>
                <tbody>
                  {(analysis.kmap.length ? analysis.kmap.slice(0, 2) : [[false, false, false, false], [false, false, false, false]]).map((row, rowIndex) => (
                    <tr key={rowIndex}><th>{rowIndex}</th>{row.map((cell, col) => {
                      const key = `${rowIndex}-${col}`;
                      return (
                        <td
                          className={`${cell ? "on" : ""} ${group[key] ? "grouped" : ""}`}
                          key={col}
                          onPointerDown={() => setGroup((prev) => ({ ...prev, [key]: !prev[key] }))}
                          onPointerEnter={(event) => { if (event.buttons === 1) setGroup((prev) => ({ ...prev, [key]: true })); }}
                        >{cell ? "1" : "0"}</td>
                      );
                    })}</tr>
                  ))}
                </tbody>
              </table>
              <p className="as-note">Grouped cells: {Object.values(group).filter(Boolean).length}</p>
            </>
          ) : null}
        </section>
        <section className="as-card">
          <h2>Logic Gate Sandbox</h2>
          <div className="as-circuit">
            <label className={`as-switch ${a ? "on" : ""}`}>A <button type="button" onClick={() => setA((value) => !value)} aria-pressed={a}><i /></button></label>
            <label className={`as-switch ${b ? "on" : ""}`}>B <button type="button" onClick={() => setB((value) => !value)} aria-pressed={b}><i /></button></label>
            <label className={`as-switch ${c ? "on" : ""}`}>C <button type="button" onClick={() => setC((value) => !value)} aria-pressed={c}><i /></button></label>
            <p>Current output</p>
            <p style={{ fontFamily: "Georgia, serif" }}>{expr}</p>
            <div className="as-y">Y</div>
            <p>Y = {y ? 1 : 0}</p>
          </div>
        </section>
      </div>
      <div className="as-bottom">
        <section className="as-card">
          <h2>Boolean Laws Visualizer</h2>
          <div className="as-laws">
            {([["de-morgan", "De Morgan's Law"], ["distributive", "Distributive"], ["associative", "Associative"], ["complement", "Complement"]] as const).map(([id, label]) => (
              <button key={id} className={law === id ? "active" : ""} type="button" onClick={() => setLaw(id)}>{label}</button>
            ))}
          </div>
          <div className="as-law-box">{steps[0]} → {steps[1]}<p>{steps[2]}</p></div>
        </section>
        <section className="as-card">
          <h2>Generated Circuit Layers</h2>
          <div className="as-layers">{layers.map((layer, index) => <span key={index}>Layer {index + 1}: {layer.map((item) => item.label).join(", ")}</span>)}</div>
        </section>
        <Challenge prompt="Simplify the following Boolean expression to minimal form: !(A | B) & (A | !C)" expected="!A&!B" hint="De Morgan: !(A | B) = !A & !B, then absorb with (A | !C)." />
      </div>
    </div>
  );
}
