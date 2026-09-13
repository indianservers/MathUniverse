import { useStudioMode } from "../../hooks/useStudioMode";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  Binary,
  Braces,
  Check,
  Cpu,
  GitBranch,
  Hash,
  Network,
  Play,
  RotateCcw,
  Save,
  Sigma,
  Sparkles,
  Zap,
} from "lucide-react";
import { useProgress } from "../../hooks/useProgress";
import StudioBreadcrumb, { mathStudioCrumbs } from "../../components/ui/StudioBreadcrumb";
import SectionCard from "../../components/ui/SectionCard";
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
import {
  loadDiscreteSnapshot,
  saveDiscreteSnapshot,
} from "./shared-engines/discretePersistence";
import {
  arithmeticSumInduction,
  gcdTrace,
  linearRecurrence,
  modularTable,
  pigeonhole,
  sieve,
} from "./shared-engines/foundationsEngine";
import {
  complexityClasses,
  haltingDiagonalDemo,
} from "./shared-engines/complexityEngine";
import {
  bellmanFord,
  eulerPath,
  floydWarshall,
  stronglyConnectedComponents,
} from "./shared-engines/graphExtensionsEngine";
import DiscreteEnhancementWorkbench from "../../studios/discrete/DiscreteEnhancementWorkbench";
import MockupStudioApp from "../../studios/mockup/MockupStudioApp";
import "./DiscreteWorldStudio.css";

const ASSET = "/assets/discrete-studio";

const canonicalLabs = [
  {
    title: "Number Systems Lab",
    route: "/number-systems",
    icon: Hash,
    status: "Existing canonical module",
    coverage:
      "Natural, integer, rational, irrational, real-number, and number-line models.",
    subcategories: [{ title: "Number systems", route: "/number-systems" }],
  },
  {
    title: "Logic Lab",
    route: "/mathematical-logic",
    icon: Binary,
    status: "Existing canonical module",
    coverage:
      "Truth tables, connectives, CNF/DNF, predicate models, inference rules.",
    subcategories: [{ title: "Truth tables", route: "/truth-table" }],
  },
  {
    title: "Set Theory Lab",
    route: "/set-theory",
    icon: Braces,
    status: "Existing canonical module",
    coverage:
      "Sets, Venn regions, relations, functions, Cartesian products, equivalence classes, Hasse covers.",
    subcategories: [
      { title: "Set Builder", route: "/set-theory/set-builder" },
      { title: "Representations", route: "/set-theory/representations" },
      { title: "Relations", route: "/set-theory/relations" },
    ],
  },
  {
    title: "Combinatorics Lab",
    route: "/combinatorics",
    icon: Sigma,
    status: "Existing canonical module",
    coverage:
      "Permutations, combinations, counting trees, Pascal triangle, inclusion-exclusion.",
    subcategories: [{ title: "Formula visualizer", route: "/combinatorics/formula-visualizer" }],
  },
  {
    title: "Graph Theory Lab",
    route: "/graph-theory",
    icon: Network,
    status: "Existing canonical module",
    coverage:
      "Graph editor, BFS/DFS, Dijkstra, MSTs, Euler/Hamiltonian checks, coloring.",
    subcategories: [{ title: "Graph comparison", route: "/graph-comparison" }],
  },
];

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

type WorkbenchId =
  | "overview"
  | "automata"
  | "regex-pda"
  | "grammar"
  | "turing"
  | "foundations"
  | "graphs"
  | "advanced";

const workbenchIds = [
  "overview",
  "automata",
  "regex-pda",
  "grammar",
  "turing",
  "foundations",
  "graphs",
  "advanced",
] as const satisfies readonly WorkbenchId[];

const studioNav: Array<{
  id: string;
  label: string;
  caption: string;
  iconSrc: string;
  to?: string;
  workbench?: WorkbenchId;
}> = [
  { id: "overview", label: "Overview", caption: "", iconSrc: `${ASSET}/discrete-nav-overview.png`, workbench: "overview" },
  { id: "foundations", label: "Foundations", caption: "Sets, logic, proof methods", iconSrc: `${ASSET}/discrete-nav-foundations.png`, workbench: "foundations" },
  { id: "number-systems", label: "Number Systems", caption: "Positional systems, bases", iconSrc: `${ASSET}/discrete-nav-numbers.png`, to: "/number-systems" },
  { id: "number-theory", label: "Number Theory", caption: "Primes, divisibility, congruence", iconSrc: `${ASSET}/discrete-nav-theory.png`, workbench: "foundations" },
  { id: "logic", label: "Logic & Proofs", caption: "Propositional & predicate logic", iconSrc: `${ASSET}/discrete-nav-logic.png`, to: "/mathematical-logic" },
  { id: "sets", label: "Sets & Relations", caption: "Sets, relations, functions", iconSrc: `${ASSET}/discrete-nav-sets.png`, to: "/set-theory" },
  { id: "combinatorics", label: "Combinatorics", caption: "Counting, permutations", iconSrc: `${ASSET}/discrete-nav-combinatorics.png`, to: "/combinatorics" },
  { id: "graph-theory", label: "Graph Theory", caption: "Graphs, trees, traversal", iconSrc: `${ASSET}/discrete-nav-graphs.png`, to: "/graph-theory" },
  { id: "automata", label: "Automata", caption: "DFA, NFA, epsilon-NFA", iconSrc: `${ASSET}/discrete-nav-automata.png`, workbench: "automata" },
  { id: "languages", label: "Formal Languages", caption: "CFG, regular languages", iconSrc: `${ASSET}/discrete-nav-languages.png`, workbench: "grammar" },
  { id: "complexity", label: "Complexity", caption: "P, NP, reductions", iconSrc: `${ASSET}/discrete-nav-complexity.png`, workbench: "graphs" },
];

function navIdForWorkbench(workbench: WorkbenchId) {
  if (workbench === "grammar") return "languages";
  if (workbench === "graphs") return "complexity";
  if (workbench === "regex-pda" || workbench === "turing" || workbench === "advanced") return "";
  return workbench;
}

const workbenches: Array<{
  id: WorkbenchId;
  title: string;
  short: string;
  icon: typeof Binary;
  status: string;
}> = [
  {
    id: "automata",
    title: "Automata",
    short: "DFA, NFA, minimization",
    icon: Binary,
    status: "Live",
  },
  {
    id: "regex-pda",
    title: "Regex + PDA",
    short: "Thompson and stacks",
    icon: GitBranch,
    status: "Live",
  },
  {
    id: "grammar",
    title: "Grammar",
    short: "CFG, parse, CNF",
    icon: Braces,
    status: "Live",
  },
  {
    id: "turing",
    title: "Turing",
    short: "Tape and universal code",
    icon: Cpu,
    status: "Live",
  },
  {
    id: "foundations",
    title: "Foundations",
    short: "Induction, gcd, recurrence",
    icon: Sigma,
    status: "Live",
  },
  {
    id: "graphs",
    title: "Graphs + Complexity",
    short: "Paths, SCC, P/NP",
    icon: Network,
    status: "Live",
  },
  {
    id: "advanced",
    title: "Advanced Workbench",
    short: "25 connected discrete tools",
    icon: Cpu,
    status: "Live",
  },
];

export default function DiscreteWorldModule() {
  const [params] = useSearchParams();
  if (params.get("workbench")) return <DiscreteWorldLegacy />;
  return <MockupStudioApp studioId="discrete" />;
}

export function DiscreteWorldLegacy() {
  const { getTopicProgress, markTopicVisited } = useProgress();
  const [automataInput, setAutomataInput] = useState("abb");
  const [grammarTarget, setGrammarTarget] = useState("aabb");
  const [turingInput, setTuringInput] = useState("111");
  const [regexPattern, setRegexPattern] = useState("a(b|c)*");
  const [pdaInput, setPdaInput] = useState("(()())");
  const [recurrenceTerms, setRecurrenceTerms] = useState(10);
  const [modulus, setModulus] = useState(7);
  const [activeWorkbench, setActiveWorkbench] = useStudioMode<WorkbenchId>(
    "workbench",
    workbenchIds,
    "automata",
  );
  const progress = getTopicProgress("discrete-world");
  const activeNav = navIdForWorkbench(activeWorkbench);

  useEffect(() => {
    document.title = "Number & Discrete Mathematics Studio | Math Universe";
    markTopicVisited("discrete-world");
  }, [markTopicVisited]);

  useEffect(() => {
    const snapshot = loadDiscreteSnapshot();
    if (!snapshot) return;
    setAutomataInput(snapshot.automataInput);
    setGrammarTarget(snapshot.grammarTarget);
    setTuringInput(snapshot.turingInput);
  }, []);

  const saveSession = () =>
    saveDiscreteSnapshot({ automataInput, grammarTarget, turingInput });

  return (
    <div className="nd-studio">
      <aside className="nd-nav" aria-label="Number and Discrete Mathematics navigation">
        <Link className="nd-brand" to="/discrete-world">
          <img src={`${ASSET}/discrete-studio-mark.png`} alt="" />
          <strong>Number & Discrete Mathematics Studio</strong>
        </Link>
        <nav>
          {studioNav.map((item) => {
            const active = !item.to && (item.id === activeNav || item.workbench === activeWorkbench);
            const body = (
              <>
                <img src={item.iconSrc} alt="" />
                <span>
                  <b>{item.label}</b>
                  {item.caption ? <small>{item.caption}</small> : null}
                </span>
              </>
            );
            return item.to ? (
              <Link key={item.id} to={item.to}>{body}</Link>
            ) : (
              <button key={item.id} type="button" className={active ? "is-active" : ""} onClick={() => item.workbench && setActiveWorkbench(item.workbench)}>
                {body}
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="nd-main">
        <StudioBreadcrumb
          className="nd-crumbs"
          crumbs={mathStudioCrumbs(
            { label: "Number & Discrete Mathematics", to: "/discrete-world" },
            { label: activeWorkbench === "overview" ? "Overview" : (workbenches.find((item) => item.id === activeWorkbench)?.title ?? activeWorkbench), to: activeWorkbench === "overview" ? "/discrete-world" : `/discrete-world?workbench=${activeWorkbench}` },
          )}
        />
        <section className="nd-head">
          <div>
            <h1>Number & Discrete Mathematics Studio</h1>
            <p>Explore number systems, logic, sets, combinatorics, graphs, automata, formal languages, and complexity through interactive labs, simulations, and practice.</p>
            <div className="nd-stats">
              <div className="nd-stat"><img src={`${ASSET}/discrete-icon-labs.png`} alt="" /><span><b>10</b><small>Labs</small></span></div>
              <div className="nd-stat"><img src={`${ASSET}/discrete-icon-concepts.png`} alt="" /><span><b>120+</b><small>Key Concepts</small></span></div>
              <div className="nd-stat"><img src={`${ASSET}/discrete-icon-exercises.png`} alt="" /><span><b>500+</b><small>Interactive Exercises</small></span></div>
            </div>
          </div>
          <figure className="nd-hero-card nd-hero-art">
            <img src={`${ASSET}/discrete-studio-hero.png`} alt="Discrete mathematics collage: sets, Venn diagram, graph, truth table, and n factorial" />
          </figure>
        </section>
        <div className="nd-progress" aria-label={`Studio progress ${progress}%`}>
          <span>Studio Progress</span>
          <progress max={100} value={progress} />
          <b>{progress}%</b>
        </div>

        {activeWorkbench === "overview" && <OverviewLab onOpen={setActiveWorkbench} />}
        {activeWorkbench === "automata" && (
          <AutomataLab input={automataInput} onInput={setAutomataInput} onReset={() => setAutomataInput("abb")} />
        )}
        {activeWorkbench === "regex-pda" && (
          <RegexPdaLab regexPattern={regexPattern} onRegexPattern={setRegexPattern} pdaInput={pdaInput} onPdaInput={setPdaInput} />
        )}
        {activeWorkbench === "grammar" && (
          <GrammarLab target={grammarTarget} onTarget={setGrammarTarget} />
        )}
        {activeWorkbench === "turing" && (
          <TuringLab input={turingInput} onInput={setTuringInput} />
        )}
        {activeWorkbench === "foundations" && (
          <FoundationsLab recurrenceTerms={recurrenceTerms} onRecurrenceTerms={setRecurrenceTerms} modulus={modulus} onModulus={setModulus} />
        )}
        {activeWorkbench === "graphs" && <GraphAndComplexityLab />}
        {activeWorkbench === "advanced" && <DiscreteEnhancementWorkbench />}

        <section className="nd-suggest">
          <header>
            <div>
              <h2>Suggested Next Labs</h2>
              <p>Continue your learning journey with related labs.</p>
            </div>
            <button type="button" onClick={() => setActiveWorkbench("overview")}>View All Labs</button>
          </header>
          <div className="nd-suggest-grid">
            <button type="button" onClick={() => setActiveWorkbench("turing")}><b>Turing Machines</b><small>Tape, head, and halt traces</small></button>
            <button type="button" onClick={() => setActiveWorkbench("grammar")}><b>Context-Free Grammars</b><small>Derivations and parse trees</small></button>
            <Link to="/graph-theory"><b>Graph Algorithms</b><small>Traversal, shortest paths, MST</small></Link>
            <Link to="/combinatorics"><b>Combinatorics Lab</b><small>Counting, permutations, combinations</small></Link>
          </div>
        </section>
      </div>

      <aside className="nd-rail">
        <section className="nd-panel">
          <h2><Sparkles /> Studio Scope</h2>
          <ul>
            {["Number theory", "Logic and proof techniques", "Sets and relations", "Combinatorics", "Graphs and graph algorithms", "Automata and formal languages", "Complexity theory"].map((item) => (
              <li key={item}><Check /> {item}</li>
            ))}
          </ul>
        </section>
        <section className="nd-panel">
          <h2>Learning Modes</h2>
          <div className="nd-modes">
            <button type="button" className={activeWorkbench === "automata" ? "is-active" : ""} onClick={() => setActiveWorkbench("automata")}>Visual Simulation</button>
            <Link to="/lessons">Guided Practice</Link>
            <Link to="/quiz">Challenge Problems</Link>
          </div>
        </section>
        <section className="nd-panel">
          <h2>Key Concepts</h2>
          <div className="nd-chips">
            <button type="button" onClick={() => setActiveWorkbench("automata")}>DFA / NFA</button>
            <button type="button" onClick={() => setActiveWorkbench("regex-pda")}>Regular Languages</button>
            <button type="button" onClick={() => setActiveWorkbench("grammar")}>CFG</button>
            <button type="button" onClick={() => setActiveWorkbench("foundations")}>Number Theory</button>
            <Link to="/combinatorics">Combinatorics</Link>
            <Link to="/graph-theory">Graph Traversal</Link>
            <button type="button" onClick={() => setActiveWorkbench("foundations")}>Induction</button>
            <button type="button" onClick={() => setActiveWorkbench("graphs")}>P vs NP</button>
          </div>
        </section>
        <section className="nd-panel nd-actions">
          <h2><Zap /> Quick Actions</h2>
          <button type="button" onClick={() => setActiveWorkbench("automata")}>Open Automata Challenges <ArrowRight /></button>
          <Link to="/lessons">View Theory Notes <ArrowRight /></Link>
          <Link to="/quiz">Practice Problems <ArrowRight /></Link>
          <button type="button" onClick={saveSession}><Save /> Save session</button>
        </section>
        <blockquote className="nd-panel nd-quote">“Discrete mathematics turns finite ideas into infinite possibilities.”</blockquote>
      </aside>
    </div>
  );
}

function OverviewLab({ onOpen }: { onOpen: (id: WorkbenchId) => void }) {
  return (
    <section className="nd-lab">
      <header className="nd-lab-top">
        <div>
          <h2>Studio Overview</h2>
          <p>Open a connected discrete mathematics lab. Canonical modules live on their own routes.</p>
        </div>
      </header>
      <div className="nd-overview-grid">
        {workbenches.map((item) => (
          <button key={item.id} type="button" onClick={() => onOpen(item.id)}>
            <b>{item.title}</b>
            <small>{item.short}</small>
          </button>
        ))}
        {canonicalLabs.map((lab) => (
          <Link key={lab.route} to={lab.route}>
            <b>{lab.title}</b>
            <small>{lab.coverage}</small>
          </Link>
        ))}
      </div>
    </section>
  );
}

function AutomataLab({
  input,
  onInput,
  onReset,
}: {
  input: string;
  onInput: (value: string) => void;
  onReset: () => void;
}) {
  const machine: FiniteAutomaton = automataMachine;
  const result = useMemo(
    () => simulateAutomaton(machine, input),
    [input, machine],
  );
  const dfa = useMemo(() => determinizeNfa(machine), [machine]);
  const minimized = useMemo(() => minimizeDfa(dfa), [dfa]);
  const active = result.frames[result.frames.length - 1];
  const examples = ["abb", "ab", "a", "b", "aaabb"];

  return (
    <section className="nd-lab">
      <header className="nd-lab-top">
        <div>
          <h2>Automata Simulation Lab</h2>
          <p>Build and test DFA, NFA, and epsilon-NFA with instant execution and minimization insights.</p>
        </div>
        <div className="nd-lab-actions">
          <button type="button" onClick={() => onInput(examples[Math.floor(Math.random() * examples.length)])}>Examples</button>
          <button type="button" onClick={onReset}><RotateCcw /> Reset</button>
          <button type="button" className="nd-run" onClick={() => onInput(input)}><Play /> Run</button>
        </div>
      </header>
      <div className="nd-input-row">
        <label htmlFor="nd-automata-input">Input string</label>
        <input id="nd-automata-input" value={input} onChange={(event) => onInput(event.target.value.replace(/[^ab]/gi, "").toLowerCase())} />
        <small>Use a, b or ε (epsilon)</small>
      </div>
      <AutomataSvg machine={machine} activeStates={active.activeStates} />
      <p className="nd-legend">
        <span><i style={{ background: "#67e8f9" }} /> Transition</span>
        <span><i style={{ background: "#1e293b", boxShadow: "inset 0 0 0 2px #94a3b8" }} /> Regular state</span>
        <span><i style={{ background: "#22d3ee", boxShadow: "inset 0 0 0 3px #34d399" }} /> Accepting state</span>
      </p>
      <div className="nd-cards">
        <article className="nd-card">
          <h3>Transitions</h3>
          <pre>{serializeTransitions(machine.transitions).replaceAll("eps", "ε")}</pre>
        </article>
        <article className="nd-card">
          <h3>Equivalent DFA States</h3>
          <p>{dfa.states.join(" | ")}</p>
          <small>Minimized partitions: {minimized.stateCount}</small>
        </article>
        <article className="nd-card">
          <h3>Execution Trace (input: {input || "ε"})</h3>
          <ol>
            {result.frames.map((frame) => (
              <li key={frame.index}>{frame.index + 1}. {frame.note}</li>
            ))}
          </ol>
        </article>
        <article className="nd-card">
          <h3>Accepted String Insight</h3>
          <p className="nd-ok">{result.accepted ? `The string ${input || "ε"} is accepted by this automaton.` : `The string ${input || "ε"} is rejected.`}</p>
          <p>It reaches {result.finalStates.join(", ") || "no state"} after consuming all input symbols.</p>
        </article>
      </div>
    </section>
  );
}

function RegexPdaLab({
  regexPattern,
  onRegexPattern,
  pdaInput,
  onPdaInput,
}: {
  regexPattern: string;
  onRegexPattern: (value: string) => void;
  pdaInput: string;
  onPdaInput: (value: string) => void;
}) {
  const regexResult = useMemo(() => {
    try {
      return { machine: regexToNfa(regexPattern), error: "" };
    } catch (error) {
      return {
        machine: null,
        error:
          error instanceof Error ? error.message : "Invalid regular expression",
      };
    }
  }, [regexPattern]);
  const pda = useMemo(
    () => simulatePda(balancedParenthesesPda, pdaInput),
    [pdaInput],
  );
  return (
    <SectionCard
      title="Regex and Pushdown Automata"
      description="Thompson regex construction plus stack-based PDA recognition."
    >
      <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Regular expression
      </label>
      <input
        className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 font-mono dark:border-white/10 dark:bg-slate-950"
        aria-label="Regular expression"
        value={regexPattern}
        onChange={(event) => onRegexPattern(event.target.value)}
      />
      {regexResult.machine ? (
        <AutomataSvg
          machine={regexResult.machine}
          activeStates={[regexResult.machine.start]}
        />
      ) : (
        <p role="alert">{regexResult.error}</p>
      )}
      <div className="rounded-lg bg-slate-100 p-3 text-sm dark:bg-white/10">
        {regexResult.machine
          ? `Thompson NFA: ${regexResult.machine.states.length} states, ${regexResult.machine.transitions.length} transitions.`
          : "Correct the expression to build its automaton."}
      </div>
      <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        PDA input
      </label>
      <input
        className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 font-mono dark:border-white/10 dark:bg-slate-950"
        value={pdaInput}
        onChange={(event) =>
          onPdaInput(event.target.value.replace(/[^()]/g, ""))
        }
      />
      <span
        className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${pda.accepted ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200" : "bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-200"}`}
      >
        {pda.accepted ? "Balanced" : "Rejected"}
      </span>
      <FrameStrip frames={pda.trace} />
    </SectionCard>
  );
}

function GrammarLab({
  target,
  onTarget,
}: {
  target: string;
  onTarget: (value: string) => void;
}) {
  const derivation = useMemo(
    () => deriveString(sampleGrammar, target, 10),
    [target],
  );
  const classification = grammarClassification(sampleGrammar);
  const ambiguity = useMemo(
    () => ambiguityCheck(sampleGrammar, target),
    [target],
  );
  const tree = parseTreeLevels(derivation.steps);
  const cnf = cnfPreview(sampleGrammar);
  return (
    <SectionCard
      title="Regex and Grammar Lab"
      description="CFG derivation search with deterministic explanations and hierarchy classification."
    >
      <div className="flex flex-wrap items-center gap-2">
        <input
          className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white p-3 font-mono dark:border-white/10 dark:bg-slate-950"
          value={target}
          onChange={(event) => onTarget(event.target.value)}
        />
        <span className="rounded-full bg-cyan-100 px-3 py-1 text-sm font-semibold text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-200">
          {classification.type}
        </span>
        <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-700 dark:bg-violet-400/15 dark:text-violet-200">
          {ambiguity.note}
        </span>
      </div>
      <pre className="mt-3 rounded-lg bg-slate-950 p-3 text-sm text-white">
        {serializeGrammar(sampleGrammar)}
      </pre>
      <div className="mt-3 space-y-2">
        {(derivation.steps.length
          ? derivation.steps
          : [
              {
                sententialForm: [sampleGrammar.start],
                appliedRule: "No bounded derivation found.",
              },
            ]
        ).map((step, index) => (
          <div
            key={`${step.appliedRule}-${index}`}
            className="flex items-center gap-3 rounded-lg border border-slate-200 p-2 dark:border-white/10"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700 dark:bg-violet-400/15 dark:text-violet-200">
              {index}
            </span>
            <span className="font-mono text-sm">
              {step.sententialForm.join(" ")}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {step.appliedRule}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-lg border border-slate-200 p-3 dark:border-white/10">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Parse tree levels
        </p>
        <div className="mt-2 space-y-2">
          {tree.map((level) => (
            <div
              key={level.level}
              className="flex flex-wrap items-center gap-2"
            >
              <span className="w-8 text-xs font-bold text-slate-400">
                L{level.level}
              </span>
              {level.nodes.map((node) => (
                <span
                  key={node.id}
                  className="rounded bg-slate-100 px-2 py-1 font-mono text-sm dark:bg-white/10"
                >
                  {node.label}
                </span>
              ))}
              <span className="text-xs text-slate-500">{level.rule}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          CNF preview:{" "}
          {cnf.alreadyBinary
            ? "this grammar is already binary-shaped for the sample."
            : "normalization steps are needed."}
        </p>
      </div>
    </SectionCard>
  );
}

function FoundationsLab({
  recurrenceTerms,
  onRecurrenceTerms,
  modulus,
  onModulus,
}: {
  recurrenceTerms: number;
  onRecurrenceTerms: (value: number) => void;
  modulus: number;
  onModulus: (value: number) => void;
}) {
  const induction = arithmeticSumInduction(12);
  const holes = pigeonhole(23, 5);
  const recurrence = useMemo(
    () => linearRecurrence(0, 1, 1, 1, recurrenceTerms),
    [recurrenceTerms],
  );
  const gcd = gcdTrace(252, 198);
  const primes = sieve(80);
  const table = useMemo(() => modularTable(modulus), [modulus]);
  return (
    <SectionCard
      title="Foundations, Recurrences, and Number Theory"
      description="Induction, pigeonhole, recurrence relations, generating functions, modular arithmetic, gcd, and primes."
    >
      <div className="grid gap-3 md:grid-cols-2">
        <InfoBox title="Induction">
          {induction.baseCase}
          <br />
          {induction.inductiveStep}
          <br />
          {induction.sample}
        </InfoBox>
        <InfoBox title="Pigeonhole">
          {holes.explanation}
          <br />
          Loads: {holes.distribution.join(", ")}
        </InfoBox>
      </div>
      <div className="mt-3 rounded-lg border border-slate-200 p-3 dark:border-white/10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold">Fibonacci-style recurrence</span>
          <input
            type="range"
            min="4"
            max="18"
            value={recurrenceTerms}
            onChange={(event) => onRecurrenceTerms(Number(event.target.value))}
          />
          <span className="text-sm">{recurrenceTerms} terms</span>
        </div>
        <p className="mt-2 font-mono text-sm">
          {recurrence.sequence.join(", ")}
        </p>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {recurrence.generatingFunction}
        </p>
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <InfoBox title={`Euclidean algorithm gcd(252, 198) = ${gcd.gcd}`}>
          {gcd.steps.join(" | ")}
        </InfoBox>
        <InfoBox title="Primes up to 80">{primes.join(", ")}</InfoBox>
      </div>
      <div className="mt-3 rounded-lg border border-slate-200 p-3 dark:border-white/10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold">Multiplication modulo {modulus}</span>
          <input
            type="range"
            min="2"
            max="12"
            value={modulus}
            onChange={(event) => onModulus(Number(event.target.value))}
          />
        </div>
        <div className="mobile-safe-scroll mt-2">
          <table className="text-center text-xs">
            <tbody>
              {table.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td
                      key={`${i}-${j}`}
                      className="h-7 w-7 border border-slate-200 dark:border-white/10"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
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
    <SectionCard
      title="Advanced Graphs and Computability"
      description="Euler paths, Bellman-Ford, Floyd-Warshall, SCCs, complexity classes, and halting intuition."
    >
      <div className="grid gap-3 md:grid-cols-2">
        <InfoBox title={euler.kind}>
          Odd vertices: {euler.odd.join(", ") || "none"}
        </InfoBox>
        <InfoBox title="Bellman-Ford">
          Distances from A:{" "}
          {Object.entries(bellman.dist)
            .map(
              ([node, value]) =>
                `${node}:${Number.isFinite(value) ? value : "inf"}`,
            )
            .join("  ")}
        </InfoBox>
        <InfoBox title="Strongly connected components">
          {scc.map((part) => `{${part.join(",")}}`).join(" ")}
        </InfoBox>
        <InfoBox title="Halting diagonal">{diagonal.contradiction}</InfoBox>
      </div>
      <div className="mobile-safe-scroll mt-3">
        <table className="w-full min-w-[420px] text-center text-xs">
          <thead>
            <tr>
              <th className="p-2 text-left">Floyd-Warshall</th>
              {floyd.ids.map((id) => (
                <th key={id} className="p-2">
                  {id}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {floyd.dist.map((row, i) => (
              <tr key={floyd.ids[i]}>
                <th className="p-2 text-left">{floyd.ids[i]}</th>
                {row.map((cell, j) => (
                  <td key={`${i}-${j}`} className="p-2">
                    {Number.isFinite(cell) ? cell : "inf"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 grid gap-2">
        {complexityClasses.map((item) => (
          <InfoBox key={item.name} title={item.name}>
            {item.intuition} Examples: {item.examples.join(", ")}.
          </InfoBox>
        ))}
      </div>
    </SectionCard>
  );
}

function TuringLab({
  input,
  onInput,
}: {
  input: string;
  onInput: (value: string) => void;
}) {
  const machine: TuringMachine = turingMachine;
  const result = useMemo(
    () => simulateTuring(machine, input, 24),
    [input, machine],
  );
  const twoTape = useMemo(() => simulateTwoTapeCopy(input), [input]);
  const universal = useMemo(() => universalMachineEncoding(machine), [machine]);
  const frame = result.frames[result.frames.length - 1];
  const copyFrame = twoTape[twoTape.length - 1];
  return (
    <SectionCard
      title="Turing Machine Lab"
      description="Single-tape execution with visible tape, head position, and halt debugger."
    >
      <div className="flex flex-wrap items-center gap-2">
        <input
          className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white p-3 font-mono dark:border-white/10 dark:bg-slate-950"
          value={input}
          onChange={(event) =>
            onInput(event.target.value.replace(/[^1_]/g, ""))
          }
        />
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200">
          <Play className="h-4 w-4" />{" "}
          {result.halted ? "Halted" : "Running cap hit"}
        </span>
      </div>
      <div className="mt-4 flex overflow-x-auto pb-2">
        {visibleTape(frame, machine.blank, 10).map((cell) => (
          <div
            key={cell.position}
            className={`min-w-12 border-y border-r border-slate-200 p-2 text-center first:border-l dark:border-white/10 ${cell.active ? "bg-cyan-100 dark:bg-cyan-400/20" : "bg-white dark:bg-white/5"}`}
          >
            <div className="text-[10px] text-slate-500">{cell.position}</div>
            <div className="font-mono text-lg font-bold">{cell.symbol}</div>
          </div>
        ))}
      </div>
      <pre className="mt-3 rounded-lg bg-slate-950 p-3 text-xs text-white">
        {serializeTuringTransitions(machine.transitions)}
      </pre>
      <FrameStrip
        frames={result.frames.map(
          (item) => `${item.step}. ${item.state} @ ${item.head}: ${item.note}`,
        )}
      />
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <InfoBox title="Multi-tape mode">
          Tape 2 after copy:{" "}
          {Object.keys(copyFrame.target)
            .sort((a, b) => Number(a) - Number(b))
            .map((key) => copyFrame.target[Number(key)])
            .join("") || "_"}
        </InfoBox>
        <InfoBox title="Universal TM encoding">
          {universal.map((row) => row.encoded).join(" ; ")}
        </InfoBox>
      </div>
    </SectionCard>
  );
}

function ArchitecturePanel({ onSave }: { onSave: () => void }) {
  const items = [
    [
      "Engines",
      "Automata, parsing, graph extensions, number theory, recurrence, complexity.",
    ],
    [
      "Storage",
      "Local snapshot now; IndexedDB is the right next step for large projects.",
    ],
    [
      "Offline",
      "PWA build precaches the app; engines run fully in the browser.",
    ],
    [
      "Rendering",
      "SVG/tables for precision; Graph Theory keeps React Flow/D3/Cytoscape.",
    ],
  ];
  return (
    <section className="glass-card rounded-2xl border border-slate-200 bg-white/85 p-3 dark:border-white/10 dark:bg-slate-950/80">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-slate-400">
            System
          </p>
          <h2 className="text-sm font-black text-slate-950 dark:text-white">
            Architecture
          </h2>
        </div>
        <button
          className="rounded-xl bg-slate-950 px-3 py-2 text-xs font-black text-white dark:bg-white dark:text-slate-950"
          type="button"
          onClick={onSave}
        >
          Save
        </button>
      </div>
      <div className="mt-3 grid gap-2">
        {items.map(([title, detail]) => (
          <div
            key={title}
            className="rounded-lg bg-slate-100 p-2 dark:bg-white/10"
          >
            <h3 className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {title}
            </h3>
            <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">
              {detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function InfoBox({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg bg-slate-100 p-3 text-sm leading-5 dark:bg-white/10">
      <h3 className="mb-1 font-semibold text-slate-950 dark:text-white">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-300">{children}</p>
    </div>
  );
}

function AutomataSvg({
  machine,
  activeStates,
}: {
  machine: FiniteAutomaton;
  activeStates: string[];
}) {
  const positions = new Map(
    machine.states.map((state, index) => [
      state,
      {
        x: 140 + index * 230,
        y: 140,
      },
    ]),
  );
  const width = Math.max(760, 180 + machine.states.length * 230);
  return (
    <svg
      className="nd-machine"
      viewBox={`0 0 ${width} 280`}
      role="img"
      aria-label="Automata graph"
    >
      <defs>
        <marker
          id="arrow"
          markerHeight="8"
          markerWidth="8"
          orient="auto"
          refX="7"
          refY="3"
        >
          <path d="M0,0 L0,6 L7,3 z" fill="#67e8f9" />
        </marker>
      </defs>
      {(() => {
        const start = positions.get(machine.start);
        return start ? (
          <g>
            <line x1={start.x - 90} y1={start.y} x2={start.x - 38} y2={start.y} stroke="#67e8f9" strokeWidth="2" markerEnd="url(#arrow)" />
            <text x={start.x - 92} y={start.y - 10} fill="#94a3b8" fontSize="12">start</text>
          </g>
        ) : null;
      })()}
      {machine.transitions.map((transition, index) => {
        const from = positions.get(transition.from)!;
        const to = positions.get(transition.to)!;
        const loop = transition.from === transition.to;
        return loop ? (
          <g key={`${transition.from}-${transition.to}-${index}`}>
            <path
              d={`M${from.x - 20} ${from.y - 25} C ${from.x - 50} ${from.y - 80}, ${from.x + 50} ${from.y - 80}, ${from.x + 20} ${from.y - 25}`}
              fill="none"
              stroke="#67e8f9"
              strokeWidth="2"
              markerEnd="url(#arrow)"
            />
            <text
              x={from.x}
              y={from.y - 62}
              textAnchor="middle"
              fill="#e0f2fe"
              fontSize="12"
            >
              {transition.symbol || "ε"}
            </text>
          </g>
        ) : (
          <g key={`${transition.from}-${transition.to}-${index}`}>
            <line
              x1={from.x + 28}
              y1={from.y}
              x2={to.x - 28}
              y2={to.y}
              stroke="#67e8f9"
              strokeWidth="2"
              markerEnd="url(#arrow)"
            />
            <text
              x={(from.x + to.x) / 2}
              y={(from.y + to.y) / 2 - 8}
              textAnchor="middle"
              fill="#e0f2fe"
              fontSize="12"
            >
              {transition.symbol || "ε"}
            </text>
          </g>
        );
      })}
      {machine.states.map((state) => {
        const point = positions.get(state)!;
        const active = activeStates.includes(state);
        return (
          <g key={state}>
            <circle
              cx={point.x}
              cy={point.y}
              r="30"
              fill={active ? "#22d3ee" : "#0f172a"}
              stroke={machine.accepts.includes(state) ? "#34d399" : "#e2e8f0"}
              strokeWidth={machine.accepts.includes(state) ? 5 : 2}
            />
            <text
              x={point.x}
              y={point.y + 5}
              textAnchor="middle"
              fill={active ? "#082f49" : "#fff"}
              fontWeight="700"
            >
              {state}
            </text>
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
        <div
          key={`${frame}-${index}`}
          className="rounded-lg bg-slate-100 px-3 py-2 text-sm dark:bg-white/10"
        >
          {frame}
        </div>
      ))}
    </div>
  );
}
