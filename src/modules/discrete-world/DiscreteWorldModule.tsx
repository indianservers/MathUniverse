import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Binary, Braces, Cpu, GitBranch, Network, Play, Save, Sigma } from "lucide-react";
import SectionCard from "../../components/ui/SectionCard";
import TopicHeader from "../../components/ui/TopicHeader";
import {
  balancedParenthesesPda,
  determinizeNfa,
  minimizeDfa,
  regexToNfa,
  sampleNfa,
  serializeTransitions,
  simulateAutomaton,
  simulatePda,
  type FiniteAutomaton,
} from "./shared-engines/automataEngine";
import {
  ambiguityCheck,
  cnfPreview,
  deriveString,
  grammarClassification,
  parseTreeLevels,
  sampleGrammar,
  serializeGrammar,
} from "./shared-engines/grammarEngine";
import {
  serializeTuringTransitions,
  simulateTuring,
  simulateTwoTapeCopy,
  unaryIncrementMachine,
  universalMachineEncoding,
  visibleTape,
  type TuringMachine,
} from "./shared-engines/turingEngine";
import { loadDiscreteSnapshot, saveDiscreteSnapshot } from "./shared-engines/discretePersistence";
import { arithmeticSumInduction, gcdTrace, linearRecurrence, modularTable, pigeonhole, sieve } from "./shared-engines/foundationsEngine";
import { complexityClasses, haltingDiagonalDemo } from "./shared-engines/complexityEngine";
import { bellmanFord, eulerPath, floydWarshall, stronglyConnectedComponents } from "./shared-engines/graphExtensionsEngine";

const canonicalLabs = [
  {
    title: "Logic Lab",
    route: "/mathematical-logic",
    icon: Binary,
    status: "Existing canonical module",
    coverage: "Truth tables, connectives, CNF/DNF, predicate models, inference rules.",
  },
  {
    title: "Set Theory Lab",
    route: "/set-theory",
    icon: Braces,
    status: "Existing canonical module",
    coverage: "Sets, Venn regions, relations, functions, Cartesian products, equivalence classes, Hasse covers.",
  },
  {
    title: "Combinatorics Lab",
    route: "/combinatorics",
    icon: Sigma,
    status: "Existing canonical module",
    coverage: "Permutations, combinations, counting trees, Pascal triangle, inclusion-exclusion.",
  },
  {
    title: "Graph Theory Lab",
    route: "/graph-theory",
    icon: Network,
    status: "Existing canonical module",
    coverage: "Graph editor, BFS/DFS, Dijkstra, MSTs, Euler/Hamiltonian checks, coloring.",
  },
];

const automataAudit = [
  ["DFA", "Implemented", "Deterministic simulation, NFA conversion preview, and partition minimization are supported."],
  ["NFA", "Implemented now", "Multi-state execution and epsilon closure are visualized."],
  ["epsilon-NFA", "Implemented now", "Use eps transitions in the transition editor."],
  ["Regular Expressions", "Implemented now", "Browser-only regex parser uses Thompson construction to build an NFA."],
  ["Pushdown Automata", "Implemented now", "Balanced-parentheses PDA simulator shows stack actions."],
  ["Turing Machines", "Implemented now", "Single-tape deterministic simulator with halt debugger."],
  ["Grammars", "Implemented now", "CFG derivation search and Chomsky hierarchy classification preview."],
  ["Parse Trees", "Implemented now", "Derivation levels render as a compact parse-tree preview."],
] as const;

const automataMachine = sampleNfa;
const turingMachine = unaryIncrementMachine;
const discreteSampleGraph = {
  directed: false,
  nodes: [
    { id: "A", label: "A", x: 0, y: 0 },
    { id: "B", label: "B", x: 1, y: 0 },
    { id: "C", label: "C", x: 2, y: 0 },
    { id: "D", label: "D", x: 0, y: 1 },
    { id: "E", label: "E", x: 1, y: 1 },
  ],
  edges: [
    { id: "A-B", source: "A", target: "B", weight: 2 },
    { id: "B-C", source: "B", target: "C", weight: 3 },
    { id: "A-D", source: "A", target: "D", weight: 1 },
    { id: "B-D", source: "B", target: "D", weight: 4 },
    { id: "B-E", source: "B", target: "E", weight: 2 },
    { id: "C-E", source: "C", target: "E", weight: 1 },
    { id: "D-E", source: "D", target: "E", weight: 5 },
  ],
};

type WorkbenchId = "automata" | "regex-pda" | "grammar" | "turing" | "foundations" | "graphs";

const workbenches: Array<{ id: WorkbenchId; title: string; short: string; icon: typeof Binary; status: string }> = [
  { id: "automata", title: "Automata", short: "DFA, NFA, minimization", icon: Binary, status: "Live" },
  { id: "regex-pda", title: "Regex + PDA", short: "Thompson and stacks", icon: GitBranch, status: "Live" },
  { id: "grammar", title: "Grammar", short: "CFG, parse, CNF", icon: Braces, status: "Live" },
  { id: "turing", title: "Turing", short: "Tape and universal code", icon: Cpu, status: "Live" },
  { id: "foundations", title: "Foundations", short: "Induction, gcd, recurrence", icon: Sigma, status: "Live" },
  { id: "graphs", title: "Graphs + Complexity", short: "Paths, SCC, P/NP", icon: Network, status: "Live" },
];

export default function DiscreteWorldModule() {
  const [automataInput, setAutomataInput] = useState("abb");
  const [grammarTarget, setGrammarTarget] = useState("aabb");
  const [turingInput, setTuringInput] = useState("111");
  const [regexPattern, setRegexPattern] = useState("a(b|c)*");
  const [pdaInput, setPdaInput] = useState("(()())");
  const [recurrenceTerms, setRecurrenceTerms] = useState(10);
  const [modulus, setModulus] = useState(7);
  const [activeWorkbench, setActiveWorkbench] = useState<WorkbenchId>("automata");

  useEffect(() => {
    const snapshot = loadDiscreteSnapshot();
    if (!snapshot) return;
    setAutomataInput(snapshot.automataInput);
    setGrammarTarget(snapshot.grammarTarget);
    setTuringInput(snapshot.turingInput);
  }, []);

  const saveSession = () => saveDiscreteSnapshot({ automataInput, grammarTarget, turingInput });

  const activeTitle = workbenches.find((item) => item.id === activeWorkbench)?.title ?? "Automata";

  return (
    <div className="space-y-4">
      <TopicHeader
        title="Discrete Mathematics and Automata World"
        subtitle="A browser-only computational lab that connects existing discrete math modules with new automata, grammar, and Turing simulations."
        difficulty="Advanced"
        estimatedMinutes={95}
        formula={{ title: "Execution model", formula: String.raw`\delta(q, a) = q'`, explanation: "All parsing, simulation, rendering, and saving run in the browser." }}
      />

      <div className="grid min-h-[calc(100vh-220px)] gap-4 xl:grid-cols-[260px_minmax(0,1fr)_330px]">
        <aside className="glass-card overflow-hidden rounded-2xl border border-slate-200 bg-white/85 p-2 dark:border-white/10 dark:bg-slate-950/80">
          <div className="px-3 py-2">
            <p className="text-xs font-black uppercase tracking-wide text-slate-400">Workbenches</p>
            <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">Choose one lab, keep context visible.</p>
          </div>
          <div className="mt-2 space-y-1">
            {workbenches.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveWorkbench(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${activeWorkbench === item.id ? "bg-slate-950 text-white shadow-lg shadow-cyan-500/10 dark:bg-cyan-400 dark:text-slate-950" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"}`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold">{item.title}</span>
                  <span className={`block truncate text-xs ${activeWorkbench === item.id ? "text-white/70 dark:text-slate-900/70" : "text-slate-400"}`}>{item.short}</span>
                </span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${activeWorkbench === item.id ? "bg-white/15 dark:bg-slate-950/10" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200"}`}>{item.status}</span>
              </button>
            ))}
          </div>
          <div className="mt-3 border-t border-slate-200 px-3 py-3 dark:border-white/10">
            <p className="text-xs font-black uppercase tracking-wide text-slate-400">Canonical labs</p>
            <div className="mt-2 grid gap-1">
              {canonicalLabs.map((lab) => (
                <Link key={lab.title} to={lab.route} className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-cyan-700 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-cyan-200">
                  <span className="inline-flex min-w-0 items-center gap-2"><lab.icon className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{lab.title}</span></span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </aside>

        <main className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white/85 px-4 py-3 shadow-sm dark:border-white/10 dark:bg-slate-950/80">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-cyan-600 dark:text-cyan-300">Active workbench</p>
              <h2 className="text-lg font-black text-slate-950 dark:text-white">{activeTitle}</h2>
            </div>
            <button className="action-primary inline-flex items-center gap-2" type="button" onClick={saveSession}><Save className="h-4 w-4" /> Save</button>
          </div>

          {activeWorkbench === "automata" && <AutomataLab input={automataInput} onInput={setAutomataInput} />}
          {activeWorkbench === "regex-pda" && <RegexPdaLab regexPattern={regexPattern} onRegexPattern={setRegexPattern} pdaInput={pdaInput} onPdaInput={setPdaInput} />}
          {activeWorkbench === "grammar" && <GrammarLab target={grammarTarget} onTarget={setGrammarTarget} />}
          {activeWorkbench === "turing" && <TuringLab input={turingInput} onInput={setTuringInput} />}
          {activeWorkbench === "foundations" && <FoundationsLab recurrenceTerms={recurrenceTerms} onRecurrenceTerms={setRecurrenceTerms} modulus={modulus} onModulus={setModulus} />}
          {activeWorkbench === "graphs" && <GraphAndComplexityLab />}
        </main>

        <aside className="space-y-3">
          <AuditPanel />
          <ArchitecturePanel onSave={saveSession} />
        </aside>
      </div>
    </div>
  );
}

function AutomataLab({ input, onInput }: { input: string; onInput: (value: string) => void }) {
  const machine: FiniteAutomaton = automataMachine;
  const result = useMemo(() => simulateAutomaton(machine, input), [input, machine]);
  const dfa = useMemo(() => determinizeNfa(machine), [machine]);
  const minimized = useMemo(() => minimizeDfa(dfa), [dfa]);
  const active = result.frames[result.frames.length - 1];

  return (
    <SectionCard title="Automata Simulation Lab" description="NFA and epsilon-NFA execution with subset-construction preview.">
      <div className="flex flex-wrap items-center gap-2">
        <input className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white p-3 font-mono dark:border-white/10 dark:bg-slate-950" value={input} onChange={(event) => onInput(event.target.value)} />
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${result.accepted ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200" : "bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-200"}`}>
          {result.accepted ? "Accepted" : "Rejected"}
        </span>
      </div>
      <AutomataSvg machine={machine} activeStates={active.activeStates} />
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg bg-slate-100 p-3 dark:bg-white/10">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Transitions</p>
          <pre className="mt-2 whitespace-pre-wrap text-xs">{serializeTransitions(machine.transitions)}</pre>
        </div>
        <div className="rounded-lg bg-slate-100 p-3 dark:bg-white/10">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Equivalent DFA states</p>
          <p className="mt-2 text-sm">{dfa.states.join("  ")}</p>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Minimized partitions: {minimized.stateCount}</p>
        </div>
      </div>
      <FrameStrip frames={result.frames.map((frame) => `${frame.symbol}: ${frame.activeStates.join(", ") || "empty"}`)} />
    </SectionCard>
  );
}

function RegexPdaLab({ regexPattern, onRegexPattern, pdaInput, onPdaInput }: { regexPattern: string; onRegexPattern: (value: string) => void; pdaInput: string; onPdaInput: (value: string) => void }) {
  const regexNfa = useMemo(() => {
    try {
      return regexToNfa(regexPattern);
    } catch {
      return regexToNfa("a");
    }
  }, [regexPattern]);
  const pda = useMemo(() => simulatePda(balancedParenthesesPda, pdaInput), [pdaInput]);
  return (
    <SectionCard title="Regex and Pushdown Automata" description="Thompson regex construction plus stack-based PDA recognition.">
      <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Regular expression</label>
      <input className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 font-mono dark:border-white/10 dark:bg-slate-950" value={regexPattern} onChange={(event) => onRegexPattern(event.target.value)} />
      <AutomataSvg machine={regexNfa} activeStates={[regexNfa.start]} />
      <div className="rounded-lg bg-slate-100 p-3 text-sm dark:bg-white/10">
        Thompson NFA: {regexNfa.states.length} states, {regexNfa.transitions.length} transitions.
      </div>
      <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">PDA input</label>
      <input className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 font-mono dark:border-white/10 dark:bg-slate-950" value={pdaInput} onChange={(event) => onPdaInput(event.target.value.replace(/[^()]/g, ""))} />
      <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${pda.accepted ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200" : "bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-200"}`}>{pda.accepted ? "Balanced" : "Rejected"}</span>
      <FrameStrip frames={pda.trace} />
    </SectionCard>
  );
}

function GrammarLab({ target, onTarget }: { target: string; onTarget: (value: string) => void }) {
  const derivation = useMemo(() => deriveString(sampleGrammar, target, 10), [target]);
  const classification = grammarClassification(sampleGrammar);
  const ambiguity = useMemo(() => ambiguityCheck(sampleGrammar, target), [target]);
  const tree = parseTreeLevels(derivation.steps);
  const cnf = cnfPreview(sampleGrammar);
  return (
    <SectionCard title="Regex and Grammar Lab" description="CFG derivation search with deterministic explanations and hierarchy classification.">
      <div className="flex flex-wrap items-center gap-2">
        <input className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white p-3 font-mono dark:border-white/10 dark:bg-slate-950" value={target} onChange={(event) => onTarget(event.target.value)} />
        <span className="rounded-full bg-cyan-100 px-3 py-1 text-sm font-semibold text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-200">{classification.type}</span>
        <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-700 dark:bg-violet-400/15 dark:text-violet-200">{ambiguity.note}</span>
      </div>
      <pre className="mt-3 rounded-lg bg-slate-950 p-3 text-sm text-white">{serializeGrammar(sampleGrammar)}</pre>
      <div className="mt-3 space-y-2">
        {(derivation.steps.length ? derivation.steps : [{ sententialForm: [sampleGrammar.start], appliedRule: "No bounded derivation found." }]).map((step, index) => (
          <div key={`${step.appliedRule}-${index}`} className="flex items-center gap-3 rounded-lg border border-slate-200 p-2 dark:border-white/10">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700 dark:bg-violet-400/15 dark:text-violet-200">{index}</span>
            <span className="font-mono text-sm">{step.sententialForm.join(" ")}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{step.appliedRule}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-lg border border-slate-200 p-3 dark:border-white/10">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Parse tree levels</p>
        <div className="mt-2 space-y-2">
          {tree.map((level) => (
            <div key={level.level} className="flex flex-wrap items-center gap-2">
              <span className="w-8 text-xs font-bold text-slate-400">L{level.level}</span>
              {level.nodes.map((node) => <span key={node.id} className="rounded bg-slate-100 px-2 py-1 font-mono text-sm dark:bg-white/10">{node.label}</span>)}
              <span className="text-xs text-slate-500">{level.rule}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">CNF preview: {cnf.alreadyBinary ? "this grammar is already binary-shaped for the sample." : "normalization steps are needed."}</p>
      </div>
    </SectionCard>
  );
}

function AuditPanel() {
  const implemented = automataAudit.filter(([, status]) => status.toLowerCase().includes("implemented")).length;
  return (
    <section className="glass-card rounded-2xl border border-slate-200 bg-white/85 p-3 dark:border-white/10 dark:bg-slate-950/80">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-slate-400">Audit</p>
          <h2 className="text-sm font-black text-slate-950 dark:text-white">{implemented}/{automataAudit.length} automata areas live</h2>
        </div>
        <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-black text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200">Browser-only</span>
      </div>
      <div className="mt-3 space-y-1.5">
        {automataAudit.map(([topic, status]) => (
          <div key={topic} className="flex items-center justify-between gap-2 rounded-lg bg-slate-100 px-2 py-1.5 text-xs dark:bg-white/10">
            <span className="truncate font-semibold">{topic}</span>
            <span className="shrink-0 text-slate-500 dark:text-slate-400">{status.replace(" now", "")}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function FoundationsLab({ recurrenceTerms, onRecurrenceTerms, modulus, onModulus }: { recurrenceTerms: number; onRecurrenceTerms: (value: number) => void; modulus: number; onModulus: (value: number) => void }) {
  const induction = arithmeticSumInduction(12);
  const holes = pigeonhole(23, 5);
  const recurrence = useMemo(() => linearRecurrence(0, 1, 1, 1, recurrenceTerms), [recurrenceTerms]);
  const gcd = gcdTrace(252, 198);
  const primes = sieve(80);
  const table = useMemo(() => modularTable(modulus), [modulus]);
  return (
    <SectionCard title="Foundations, Recurrences, and Number Theory" description="Induction, pigeonhole, recurrence relations, generating functions, modular arithmetic, gcd, and primes.">
      <div className="grid gap-3 md:grid-cols-2">
        <InfoBox title="Induction">{induction.baseCase}<br />{induction.inductiveStep}<br />{induction.sample}</InfoBox>
        <InfoBox title="Pigeonhole">{holes.explanation}<br />Loads: {holes.distribution.join(", ")}</InfoBox>
      </div>
      <div className="mt-3 rounded-lg border border-slate-200 p-3 dark:border-white/10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold">Fibonacci-style recurrence</span>
          <input type="range" min="4" max="18" value={recurrenceTerms} onChange={(event) => onRecurrenceTerms(Number(event.target.value))} />
          <span className="text-sm">{recurrenceTerms} terms</span>
        </div>
        <p className="mt-2 font-mono text-sm">{recurrence.sequence.join(", ")}</p>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{recurrence.generatingFunction}</p>
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <InfoBox title={`Euclidean algorithm gcd(252, 198) = ${gcd.gcd}`}>{gcd.steps.join(" | ")}</InfoBox>
        <InfoBox title="Primes up to 80">{primes.join(", ")}</InfoBox>
      </div>
      <div className="mt-3 rounded-lg border border-slate-200 p-3 dark:border-white/10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold">Multiplication modulo {modulus}</span>
          <input type="range" min="2" max="12" value={modulus} onChange={(event) => onModulus(Number(event.target.value))} />
        </div>
        <div className="mobile-safe-scroll mt-2">
          <table className="text-center text-xs">
            <tbody>{table.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={`${i}-${j}`} className="h-7 w-7 border border-slate-200 dark:border-white/10">{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </div>
    </SectionCard>
  );
}

function GraphAndComplexityLab() {
  const directed = { ...discreteSampleGraph, directed: true };
  const euler = eulerPath(discreteSampleGraph);
  const bellman = bellmanFord(directed, "A");
  const floyd = floydWarshall(discreteSampleGraph);
  const scc = stronglyConnectedComponents(directed);
  const diagonal = haltingDiagonalDemo(true);
  return (
    <SectionCard title="Advanced Graphs and Computability" description="Euler paths, Bellman-Ford, Floyd-Warshall, SCCs, complexity classes, and halting intuition.">
      <div className="grid gap-3 md:grid-cols-2">
        <InfoBox title={euler.kind}>Odd vertices: {euler.odd.join(", ") || "none"}</InfoBox>
        <InfoBox title="Bellman-Ford">Distances from A: {Object.entries(bellman.dist).map(([node, value]) => `${node}:${Number.isFinite(value) ? value : "inf"}`).join("  ")}</InfoBox>
        <InfoBox title="Strongly connected components">{scc.map((part) => `{${part.join(",")}}`).join(" ")}</InfoBox>
        <InfoBox title="Halting diagonal">{diagonal.contradiction}</InfoBox>
      </div>
      <div className="mobile-safe-scroll mt-3">
        <table className="w-full min-w-[420px] text-center text-xs">
          <thead><tr><th className="p-2 text-left">Floyd-Warshall</th>{floyd.ids.map((id) => <th key={id} className="p-2">{id}</th>)}</tr></thead>
          <tbody>{floyd.dist.map((row, i) => <tr key={floyd.ids[i]}><th className="p-2 text-left">{floyd.ids[i]}</th>{row.map((cell, j) => <td key={`${i}-${j}`} className="p-2">{Number.isFinite(cell) ? cell : "inf"}</td>)}</tr>)}</tbody>
        </table>
      </div>
      <div className="mt-3 grid gap-2">
        {complexityClasses.map((item) => <InfoBox key={item.name} title={item.name}>{item.intuition} Examples: {item.examples.join(", ")}.</InfoBox>)}
      </div>
    </SectionCard>
  );
}

function TuringLab({ input, onInput }: { input: string; onInput: (value: string) => void }) {
  const machine: TuringMachine = turingMachine;
  const result = useMemo(() => simulateTuring(machine, input, 24), [input, machine]);
  const twoTape = useMemo(() => simulateTwoTapeCopy(input), [input]);
  const universal = useMemo(() => universalMachineEncoding(machine), [machine]);
  const frame = result.frames[result.frames.length - 1];
  const copyFrame = twoTape[twoTape.length - 1];
  return (
    <SectionCard title="Turing Machine Lab" description="Single-tape execution with visible tape, head position, and halt debugger.">
      <div className="flex flex-wrap items-center gap-2">
        <input className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white p-3 font-mono dark:border-white/10 dark:bg-slate-950" value={input} onChange={(event) => onInput(event.target.value.replace(/[^1_]/g, ""))} />
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200"><Play className="h-4 w-4" /> {result.halted ? "Halted" : "Running cap hit"}</span>
      </div>
      <div className="mt-4 flex overflow-x-auto pb-2">
        {visibleTape(frame, machine.blank, 10).map((cell) => (
          <div key={cell.position} className={`min-w-12 border-y border-r border-slate-200 p-2 text-center first:border-l dark:border-white/10 ${cell.active ? "bg-cyan-100 dark:bg-cyan-400/20" : "bg-white dark:bg-white/5"}`}>
            <div className="text-[10px] text-slate-500">{cell.position}</div>
            <div className="font-mono text-lg font-bold">{cell.symbol}</div>
          </div>
        ))}
      </div>
      <pre className="mt-3 rounded-lg bg-slate-950 p-3 text-xs text-white">{serializeTuringTransitions(machine.transitions)}</pre>
      <FrameStrip frames={result.frames.map((item) => `${item.step}. ${item.state} @ ${item.head}: ${item.note}`)} />
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <InfoBox title="Multi-tape mode">Tape 2 after copy: {Object.keys(copyFrame.target).sort((a, b) => Number(a) - Number(b)).map((key) => copyFrame.target[Number(key)]).join("") || "_"}</InfoBox>
        <InfoBox title="Universal TM encoding">{universal.map((row) => row.encoded).join(" ; ")}</InfoBox>
      </div>
    </SectionCard>
  );
}

function ArchitecturePanel({ onSave }: { onSave: () => void }) {
  const items = [
    ["Engines", "Automata, parsing, graph extensions, number theory, recurrence, complexity."],
    ["Storage", "Local snapshot now; IndexedDB is the right next step for large projects."],
    ["Offline", "PWA build precaches the app; engines run fully in the browser."],
    ["Rendering", "SVG/tables for precision; Graph Theory keeps React Flow/D3/Cytoscape."],
  ];
  return (
    <section className="glass-card rounded-2xl border border-slate-200 bg-white/85 p-3 dark:border-white/10 dark:bg-slate-950/80">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-slate-400">System</p>
          <h2 className="text-sm font-black text-slate-950 dark:text-white">Architecture</h2>
        </div>
        <button className="rounded-xl bg-slate-950 px-3 py-2 text-xs font-black text-white dark:bg-white dark:text-slate-950" type="button" onClick={onSave}>Save</button>
      </div>
      <div className="mt-3 grid gap-2">
        {items.map(([title, detail]) => (
          <div key={title} className="rounded-lg bg-slate-100 p-2 dark:bg-white/10">
            <h3 className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</h3>
            <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function InfoBox({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg bg-slate-100 p-3 text-sm leading-5 dark:bg-white/10">
      <h3 className="mb-1 font-semibold text-slate-950 dark:text-white">{title}</h3>
      <p className="text-slate-600 dark:text-slate-300">{children}</p>
    </div>
  );
}

function AutomataSvg({ machine, activeStates }: { machine: FiniteAutomaton; activeStates: string[] }) {
  const positions = new Map(machine.states.map((state, index) => [state, { x: 90 + index * 150, y: index % 2 ? 145 : 80 }]));
  const width = Math.max(520, 180 + machine.states.length * 150);
  return (
    <svg className="my-4 h-56 w-full rounded-lg bg-slate-950" viewBox={`0 0 ${width} 220`} role="img" aria-label="Automata graph">
      <defs>
        <marker id="arrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="3"><path d="M0,0 L0,6 L7,3 z" fill="#67e8f9" /></marker>
      </defs>
      {machine.transitions.map((transition, index) => {
        const from = positions.get(transition.from)!;
        const to = positions.get(transition.to)!;
        const loop = transition.from === transition.to;
        return loop ? (
          <g key={`${transition.from}-${transition.to}-${index}`}>
            <path d={`M${from.x - 20} ${from.y - 25} C ${from.x - 50} ${from.y - 80}, ${from.x + 50} ${from.y - 80}, ${from.x + 20} ${from.y - 25}`} fill="none" stroke="#67e8f9" strokeWidth="2" markerEnd="url(#arrow)" />
            <text x={from.x} y={from.y - 62} textAnchor="middle" fill="#e0f2fe" fontSize="12">{transition.symbol || "eps"}</text>
          </g>
        ) : (
          <g key={`${transition.from}-${transition.to}-${index}`}>
            <line x1={from.x + 28} y1={from.y} x2={to.x - 28} y2={to.y} stroke="#67e8f9" strokeWidth="2" markerEnd="url(#arrow)" />
            <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 8} textAnchor="middle" fill="#e0f2fe" fontSize="12">{transition.symbol || "eps"}</text>
          </g>
        );
      })}
      {machine.states.map((state) => {
        const point = positions.get(state)!;
        const active = activeStates.includes(state);
        return (
          <g key={state}>
            <circle cx={point.x} cy={point.y} r="30" fill={active ? "#22d3ee" : "#0f172a"} stroke={machine.accepts.includes(state) ? "#34d399" : "#e2e8f0"} strokeWidth={machine.accepts.includes(state) ? 5 : 2} />
            <text x={point.x} y={point.y + 5} textAnchor="middle" fill={active ? "#082f49" : "#fff"} fontWeight="700">{state}</text>
          </g>
        );
      })}
    </svg>
  );
}

function FrameStrip({ frames }: { frames: string[] }) {
  return (
    <div className="mt-3 max-h-44 space-y-2 overflow-y-auto pr-1">
      {frames.map((frame, index) => (
        <div key={`${frame}-${index}`} className="rounded-lg bg-slate-100 px-3 py-2 text-sm dark:bg-white/10">
          {frame}
        </div>
      ))}
    </div>
  );
}
