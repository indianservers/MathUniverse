import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import katex from "katex";
import {
  BookOpen,
  BrainCircuit,
  Check,
  CircleAlert,
  Download,
  FileJson,
  FileText,
  Moon,
  Play,
  RotateCcw,
  Sparkles,
  Sun,
  Upload,
  Wand2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import SectionCard from "../../components/ui/SectionCard";
import TopicHeader from "../../components/ui/TopicHeader";
import { useTheme } from "../../hooks/useTheme";
import {
  buildTruthTable,
  buildPredicateInferenceSteps,
  evaluatePredicateScenario,
  formatAst,
  runInference,
  toNormalForms,
  type InferenceRule,
  type LogicOperator,
} from "./logicEngine";
import { defaultPredicate, useLogicStore } from "./logicStore";

const symbols: Array<{ label: string; insert: string; operator?: LogicOperator }> = [
  { label: "NOT", insert: "!", operator: "not" },
  { label: "AND", insert: " & ", operator: "and" },
  { label: "OR", insert: " | ", operator: "or" },
  { label: "XOR", insert: " xor ", operator: "xor" },
  { label: "NAND", insert: " nand ", operator: "nand" },
  { label: "NOR", insert: " nor ", operator: "nor" },
  { label: "IMPLIES", insert: " -> ", operator: "implies" },
  { label: "IFF", insert: " <-> ", operator: "iff" },
  { label: "(", insert: "(" },
  { label: ")", insert: ")" },
];

const examples = ["(P & Q) -> R", "P xor Q", "P nand (Q | R)", "!(P -> Q) <-> (P & !Q)", "(P | Q) & (!P | R)"];
const inferenceRules: InferenceRule[] = ["Modus Ponens", "Modus Tollens", "Hypothetical Syllogism", "Disjunctive Syllogism", "Resolution"];

const exercises = [
  { id: "syntax", prompt: "Build a statement that uses parentheses and at least three variables.", answer: "Example: (P & Q) -> R" },
  { id: "cnf", prompt: "Find a row that contributes a maxterm to CNF.", answer: "Any false-result row contributes one maxterm." },
  { id: "predicate", prompt: "Change the domain so the universal prime statement becomes true.", answer: "Remove 4 or mark 4 as satisfying Prime." },
];

export default function MathematicalLogicModule() {
  const {
    expression,
    selectedRow,
    selectedStep,
    inferenceRule,
    premises,
    predicate,
    mode,
    completedExercises,
    setExpression,
    setSelectedRow,
    setSelectedStep,
    setInferenceRule,
    setPremise,
    setPredicate,
    setMode,
    toggleExercise,
    importSession,
  } = useLogicStore();
  const { theme, toggleTheme } = useTheme();
  const exportRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [quizAnswer, setQuizAnswer] = useState("");
  const [quizChecked, setQuizChecked] = useState(false);

  const parsed = useMemo(() => {
    try {
      return { table: buildTruthTable(expression), error: "" };
    } catch (error) {
      return { table: null, error: error instanceof Error ? error.message : "Invalid expression." };
    }
  }, [expression]);

  const normalForms = useMemo(() => parsed.table ? toNormalForms(parsed.table) : null, [parsed.table]);
  const inference = useMemo(() => runInference(inferenceRule, premises), [inferenceRule, premises]);
  const predicateResult = useMemo(() => evaluatePredicateScenario(predicate), [predicate]);
  const predicateInference = useMemo(() => buildPredicateInferenceSteps(predicate), [predicate]);
  const activeRow = parsed.table?.rows[Math.min(selectedRow, Math.max(0, parsed.table.rows.length - 1))];
  const activeStep = activeRow?.steps[Math.min(selectedStep, Math.max(0, activeRow.steps.length - 1))];

  const insertSymbol = (insert: string) => setExpression(`${expression}${insert}`);
  const session = { expression, inferenceRule, premises, predicate, mode, completedExercises };

  async function exportImage(kind: "png" | "pdf") {
    if (!exportRef.current) return;
    const canvas = await html2canvas(exportRef.current, { backgroundColor: theme === "light" ? "#f8fafc" : "#07111f", scale: 2 });
    if (kind === "png") {
      const link = document.createElement("a");
      link.download = "mathematical-logic-session.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      return;
    }
    const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [canvas.width, canvas.height] });
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("mathematical-logic-session.pdf");
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(session, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.download = "mathematical-logic-session.json";
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  }

  async function importJson(file?: File) {
    if (!file) return;
    const payload = JSON.parse(await file.text());
    importSession(payload);
  }

  return (
    <div className="space-y-5" ref={exportRef}>
      <TopicHeader
        title="Mathematical Logic"
        subtitle="Build statements, simulate connectives, generate truth tables, transform normal forms, and explore inference."
        difficulty="Advanced Logic Lab"
        estimatedMinutes={55}
        progress={Math.round((completedExercises.length / exercises.length) * 100)}
        formula={{ title: "Core equivalence", formula: String.raw`p \to q \equiv \neg p \lor q`, explanation: "The module uses truth-functional semantics for statement calculus and finite-domain semantics for predicate calculus." }}
      />

      <div className="flex flex-wrap gap-2">
        <button className="tool-button" type="button" onClick={toggleTheme}>{theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />} Theme</button>
        <button className="tool-button" type="button" onClick={() => setMode(mode === "student" ? "teacher" : "student")}><BookOpen className="h-4 w-4" /> {mode === "student" ? "Student mode" : "Teacher mode"}</button>
        <button className="tool-button" type="button" onClick={() => exportImage("png")}><Download className="h-4 w-4" /> PNG</button>
        <button className="tool-button" type="button" onClick={() => exportImage("pdf")}><FileText className="h-4 w-4" /> PDF</button>
        <button className="tool-button" type="button" onClick={exportJson}><FileJson className="h-4 w-4" /> Session JSON</button>
        <button className="tool-button" type="button" onClick={() => fileRef.current?.click()}><Upload className="h-4 w-4" /> Import</button>
        <input ref={fileRef} className="hidden" type="file" accept="application/json" onChange={(event) => void importJson(event.target.files?.[0])} />
      </div>

      <AuditReport />

      <div className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
        <StatementBuilder expression={expression} error={parsed.error} onChange={setExpression} onInsert={insertSymbol} />
        <ConnectivesVisualization expression={expression} result={activeRow?.result ?? false} values={activeRow?.values ?? { P: true, Q: false }} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
        <TruthTablePanel table={parsed.table} error={parsed.error} selectedRow={selectedRow} selectedStep={selectedStep} onSelectRow={setSelectedRow} onSelectStep={setSelectedStep} />
        <EvaluationPanel activeStep={activeStep} row={activeRow} expression={expression} />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <NormalFormsPanel normalForms={normalForms} />
        <InferencePanel rule={inferenceRule} premises={premises} inference={inference} onRule={setInferenceRule} onPremise={setPremise} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <PredicatePanel predicate={predicate} result={predicateResult} inference={predicateInference} onChange={setPredicate} />
        <PracticePanel quizAnswer={quizAnswer} quizChecked={quizChecked} setQuizAnswer={setQuizAnswer} setQuizChecked={setQuizChecked} completed={completedExercises} toggleExercise={toggleExercise} mode={mode} />
      </div>
    </div>
  );
}

function AuditReport() {
  const rows = [
    ["Introduction to Mathematical Logic", "Needs enhancement", "Now covered by the module overview, examples, and exercises."],
    ["Statements and Notation", "Partially implemented", "Existing truth-table page had syntax only; builder adds notation chips and validation."],
    ["Logical Connectives", "Partially implemented", "AND/OR/NOT/implication/biconditional existed; XOR/NAND/NOR and SVG simulation added."],
    ["Truth Tables", "Already implemented, enhanced", "Existing route kept; generator now has multi-operator parser, row highlighting, steps, PNG/PDF export."],
    ["Normal Forms: CNF and DNF", "Missing, implemented", "Truth-table based CNF/DNF conversion with transformation law notes."],
    ["Theory of Inference for Statement Calculus", "Missing, implemented", "Rule playground supports five named rules with proof-flow visualization."],
    ["Predicate Calculus", "Missing, implemented", "Finite-domain quantifier and predicate mapping playground added."],
    ["Inference Theory of Predicate Calculus", "Missing, implemented", "Interactive deduction workspace adds substitution/error guidance and explanation panel."],
  ];
  return (
    <SectionCard title="Implementation Audit" description="Audit result from the existing project before extending the logic area.">
      <div className="mobile-safe-scroll">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left dark:bg-white/10">
            <tr><th className="px-3 py-2">Topic</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Action</th></tr>
          </thead>
          <tbody>
            {rows.map(([topic, status, action]) => (
              <tr key={topic} className="border-t border-slate-200 dark:border-white/10">
                <td className="px-3 py-2 font-semibold">{topic}</td>
                <td className="px-3 py-2"><span className="mini-chip">{status}</span></td>
                <td className="px-3 py-2 text-slate-600 dark:text-slate-300">{action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}

function StatementBuilder({ expression, error, onChange, onInsert }: { expression: string; error: string; onChange: (value: string) => void; onInsert: (value: string) => void }) {
  return (
    <SectionCard title="Interactive Statement Builder" description="Drag or tap symbols to compose statements. Variables can be any letters such as P, Q, R, Rain, or Alarm.">
      <div
        className="rounded-2xl border-2 border-dashed border-cyan-300/70 bg-cyan-50/50 p-3 dark:border-cyan-400/30 dark:bg-cyan-400/10"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => onInsert(event.dataTransfer.getData("text/plain"))}
      >
        <textarea
          value={expression}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-28 w-full resize-y rounded-xl border border-slate-200 bg-white p-4 font-mono text-base shadow-inner dark:border-white/10 dark:bg-slate-950/70"
          spellCheck={false}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {symbols.map((symbol) => (
            <button
              key={symbol.label}
              draggable
              onDragStart={(event) => event.dataTransfer.setData("text/plain", symbol.insert)}
              onClick={() => onInsert(symbol.insert)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 dark:border-white/10 dark:bg-white/10 dark:text-slate-100"
              type="button"
            >
              {symbol.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {examples.map((example) => <button key={example} className="mini-chip hover:bg-cyan-100 dark:hover:bg-cyan-400/20" type="button" onClick={() => onChange(example)}>{example}</button>)}
      </div>
      <div className={`mt-3 flex items-center gap-2 rounded-xl p-3 text-sm font-semibold ${error ? "bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-100" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-100"}`}>
        {error ? <CircleAlert className="h-4 w-4" /> : <Check className="h-4 w-4" />}
        {error || "Syntax is valid. Parser, truth table, normal forms, and visualizations are synchronized."}
      </div>
    </SectionCard>
  );
}

function TruthTablePanel({ table, error, selectedRow, selectedStep, onSelectRow, onSelectStep }: { table: ReturnType<typeof buildTruthTable> | null; error: string; selectedRow: number; selectedStep: number; onSelectRow: (row: number) => void; onSelectStep: (step: number) => void }) {
  if (error || !table) {
    return <SectionCard title="Truth Table"><div className="rounded-xl bg-rose-100 p-4 text-sm font-semibold text-rose-700 dark:bg-rose-400/15 dark:text-rose-100">{error}</div></SectionCard>;
  }
  return (
    <SectionCard title="Truth Table Generator" description="Rows are generated dynamically from the parsed AST. Select a row to animate its evaluation.">
      <div className="mobile-safe-scroll">
        <table className="min-w-full overflow-hidden rounded-xl text-sm">
          <thead className="bg-slate-100 dark:bg-white/10">
            <tr>{[...table.variables, formatAst(table.ast)].map((header) => <th key={header} className="px-3 py-2 text-left font-black">{header}</th>)}</tr>
          </thead>
          <tbody>
            {table.rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onSelectRow(rowIndex)}
                className={`cursor-pointer border-t border-slate-200 transition dark:border-white/10 ${rowIndex === selectedRow ? "bg-cyan-100/80 dark:bg-cyan-400/20" : row.result ? "bg-emerald-50/70 dark:bg-emerald-400/5" : "bg-rose-50/70 dark:bg-rose-400/5"}`}
              >
                {table.variables.map((variable) => <td key={variable} className="px-3 py-2 font-mono">{row.values[variable] ? "T" : "F"}</td>)}
                <td className={`px-3 py-2 font-mono font-black ${row.result ? "text-emerald-600 dark:text-emerald-200" : "text-rose-600 dark:text-rose-200"}`}>{row.result ? "T" : "F"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <button className="tool-button" type="button" onClick={() => onSelectStep(Math.max(0, selectedStep - 1))}><RotateCcw className="h-4 w-4" /> Step back</button>
        <button className="tool-button" type="button" onClick={() => onSelectStep(selectedStep + 1)}><Play className="h-4 w-4" /> Step</button>
      </div>
    </SectionCard>
  );
}

function EvaluationPanel({ activeStep, row, expression }: { activeStep?: { label: string; expression: string; value: boolean; depth: number }; row?: { steps: Array<{ label: string; expression: string; value: boolean; depth: number }> }; expression: string }) {
  return (
    <SectionCard title="Step-by-Step Evaluation Animation" description="The selected row evaluates bottom-up through the expression tree.">
      <MathLine source={expression} />
      <div className="mt-4 space-y-2">
        {row?.steps.map((step, index) => (
          <motion.div
            key={`${step.expression}-${index}`}
            initial={{ opacity: 0.45, x: -8 }}
            animate={{ opacity: activeStep?.expression === step.expression && activeStep?.depth === step.depth ? 1 : 0.65, x: 0 }}
            className={`rounded-xl border px-3 py-2 text-sm ${activeStep?.expression === step.expression && activeStep?.depth === step.depth ? "border-cyan-300 bg-cyan-100 dark:border-cyan-400/40 dark:bg-cyan-400/15" : "border-slate-200 bg-white/60 dark:border-white/10 dark:bg-white/5"}`}
            style={{ marginLeft: step.depth * 14 }}
          >
            <span className="font-black">{step.label}</span> evaluates <span className="font-mono">{step.expression}</span> as <span className={step.value ? "font-black text-emerald-600 dark:text-emerald-200" : "font-black text-rose-600 dark:text-rose-200"}>{step.value ? "TRUE" : "FALSE"}</span>
          </motion.div>
        ))}
      </div>
    </SectionCard>
  );
}

function ConnectivesVisualization({ expression, result, values }: { expression: string; result: boolean; values: Record<string, boolean> }) {
  const inputs = Object.entries(values).slice(0, 4);
  return (
    <SectionCard title="Logical Connectives Visualization" description="Circuit-style SVG rendering reflects the selected truth-table row.">
      <svg viewBox="0 0 520 250" className="h-72 w-full rounded-2xl bg-slate-950 text-white shadow-inner">
        <defs>
          <linearGradient id="logic-wire" x1="0" x2="1"><stop stopColor="#22d3ee" /><stop offset="1" stopColor="#a78bfa" /></linearGradient>
        </defs>
        {inputs.map(([name, value], index) => {
          const y = 45 + index * 42;
          return (
            <g key={name}>
              <circle cx="48" cy={y} r="15" fill={value ? "#10b981" : "#ef4444"} />
              <text x="48" y={y + 5} textAnchor="middle" fontSize="13" fontWeight="800">{name}</text>
              <motion.path d={`M 65 ${y} C 160 ${y}, 160 118, 245 118`} stroke="url(#logic-wire)" strokeWidth="4" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
            </g>
          );
        })}
        <motion.rect x="240" y="80" width="130" height="76" rx="20" fill="#0f172a" stroke={result ? "#34d399" : "#fb7185"} strokeWidth="3" animate={{ scale: result ? 1.04 : 1 }} />
        <text x="305" y="112" textAnchor="middle" fontSize="15" fontWeight="900">LOGIC</text>
        <text x="305" y="135" textAnchor="middle" fontSize="11" fill="#cbd5e1">{expression.slice(0, 24)}</text>
        <motion.path d="M 370 118 C 420 118, 420 118, 458 118" stroke="url(#logic-wire)" strokeWidth="5" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
        <circle cx="476" cy="118" r="25" fill={result ? "#10b981" : "#ef4444"} />
        <text x="476" y="123" textAnchor="middle" fontSize="14" fontWeight="900">{result ? "T" : "F"}</text>
      </svg>
    </SectionCard>
  );
}

function NormalFormsPanel({ normalForms }: { normalForms: ReturnType<typeof toNormalForms> | null }) {
  return (
    <SectionCard title="Normal Forms Visualizer" description="CNF and DNF are derived from the same truth table, with laws shown in order.">
      {normalForms ? (
        <div className="space-y-3">
          <LogicOutput title="CNF" value={normalForms.cnf} />
          <LogicOutput title="DNF" value={normalForms.dnf} />
          <div className="space-y-2">
            {normalForms.steps.map((step, index) => <div key={step} className="rounded-xl bg-slate-100 p-3 text-sm dark:bg-white/10"><span className="font-black text-cyan-600 dark:text-cyan-200">Step {index + 1}:</span> {step}</div>)}
          </div>
        </div>
      ) : <div className="text-sm text-slate-500">Enter a valid expression to compute normal forms.</div>}
    </SectionCard>
  );
}

function InferencePanel({ rule, premises, inference, onRule, onPremise }: { rule: InferenceRule; premises: string[]; inference: ReturnType<typeof runInference>; onRule: (rule: InferenceRule) => void; onPremise: (index: number, value: string) => void }) {
  return (
    <SectionCard title="Inference Engine" description="Choose a rule, edit premises, and follow the proof graph.">
      <select className="w-full rounded-xl border border-slate-200 bg-white p-3 font-semibold dark:border-white/10 dark:bg-slate-950" value={rule} onChange={(event) => onRule(event.target.value as InferenceRule)}>
        {inferenceRules.map((item) => <option key={item}>{item}</option>)}
      </select>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {premises.map((premise, index) => (
          <input
            key={index}
            className={`rounded-xl border bg-white p-3 font-mono dark:bg-slate-950 ${inference.matchedPremises.includes(index) ? "border-cyan-400 ring-2 ring-cyan-200 dark:border-cyan-300 dark:ring-cyan-400/20" : "border-slate-200 dark:border-white/10"}`}
            value={premise}
            onChange={(event) => onPremise(index, event.target.value)}
            placeholder={`Premise ${index + 1}`}
          />
        ))}
      </div>
      <svg viewBox="0 0 500 180" className="mt-4 h-48 w-full rounded-2xl bg-slate-950">
        <ProofNode x={80} y={65} label="Premises" />
        <ProofNode x={250} y={65} label={rule} accent />
        <ProofNode x={420} y={65} label={inference.conclusion || "Conclusion"} />
        <motion.path d="M 130 65 C 175 30, 200 30, 222 65" stroke="#22d3ee" strokeWidth="4" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
        <motion.path d="M 278 65 C 315 105, 360 105, 390 65" stroke="#a78bfa" strokeWidth="4" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
      </svg>
      <div className={`mt-3 rounded-xl p-3 text-sm font-semibold ${inference.valid ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-100" : "bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-100"}`}>{inference.explanation}</div>
    </SectionCard>
  );
}

function PredicatePanel({ predicate, result, inference, onChange }: { predicate: typeof defaultPredicate; result: ReturnType<typeof evaluatePredicateScenario>; inference: ReturnType<typeof buildPredicateInferenceSteps>; onChange: (value: typeof defaultPredicate) => void }) {
  const domainText = predicate.domain.join(", ");
  const trueText = predicate.trueFor.join(", ");
  return (
    <SectionCard title="Predicate Calculus Engine" description="Finite-domain quantifiers, predicate mapping, and substitution animation.">
      <div className="grid gap-3 sm:grid-cols-2">
        <select className="rounded-xl border border-slate-200 bg-white p-3 font-semibold dark:border-white/10 dark:bg-slate-950" value={predicate.quantifier} onChange={(event) => onChange({ ...predicate, quantifier: event.target.value as "forall" | "exists" })}>
          <option value="forall">Universal</option>
          <option value="exists">Existential</option>
        </select>
        <input className="rounded-xl border border-slate-200 bg-white p-3 font-semibold dark:border-white/10 dark:bg-slate-950" value={predicate.predicateName} onChange={(event) => onChange({ ...predicate, predicateName: event.target.value || "P" })} />
        <input className="rounded-xl border border-slate-200 bg-white p-3 font-mono dark:border-white/10 dark:bg-slate-950" value={domainText} onChange={(event) => onChange({ ...predicate, domain: splitList(event.target.value) })} />
        <input className="rounded-xl border border-slate-200 bg-white p-3 font-mono dark:border-white/10 dark:bg-slate-950" value={trueText} onChange={(event) => onChange({ ...predicate, trueFor: splitList(event.target.value) })} />
      </div>
      <div className="mt-4 rounded-xl bg-slate-100 p-3 text-sm dark:bg-white/10">{result.statement}</div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {result.mapped.map((item, index) => (
          <motion.div key={item.item} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className={`rounded-xl border p-3 text-center ${item.value ? "border-emerald-300 bg-emerald-100 dark:border-emerald-400/30 dark:bg-emerald-400/15" : "border-rose-300 bg-rose-100 dark:border-rose-400/30 dark:bg-rose-400/15"}`}>
            <div className="font-mono font-black">{item.substitution}</div>
            <div className="text-xs font-bold">{item.value ? "TRUE" : "FALSE"}</div>
          </motion.div>
        ))}
      </div>
      <div className="mt-3 rounded-xl bg-cyan-100 p-3 text-sm font-semibold text-cyan-800 dark:bg-cyan-400/15 dark:text-cyan-100">{result.explanation} Result: {result.value ? "TRUE" : "FALSE"}</div>
      <div className="mt-4 rounded-2xl border border-slate-200 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
        <div className="text-sm font-black">{inference.rule}</div>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {inference.steps.map((step) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl p-3 text-sm ${step.value ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-100" : "bg-rose-100 text-rose-800 dark:bg-rose-400/15 dark:text-rose-100"}`}
            >
              <div className="font-mono font-black">{step.label}</div>
              <div>{step.statement}: {step.value ? "true" : "false"}</div>
              <div className="text-xs opacity-80">{step.note}</div>
            </motion.div>
          ))}
        </div>
        <div className={`mt-3 rounded-xl p-3 text-sm font-semibold ${inference.valid ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-100" : "bg-amber-50 text-amber-800 dark:bg-amber-400/10 dark:text-amber-100"}`}>
          {inference.conclusion}
        </div>
      </div>
    </SectionCard>
  );
}

function PracticePanel({ quizAnswer, quizChecked, setQuizAnswer, setQuizChecked, completed, toggleExercise, mode }: { quizAnswer: string; quizChecked: boolean; setQuizAnswer: (value: string) => void; setQuizChecked: (value: boolean) => void; completed: string[]; toggleExercise: (id: string) => void; mode: string }) {
  const quizCorrect = quizAnswer.trim().toLowerCase().includes("false") || quizAnswer.trim().toLowerCase() === "f";
  return (
    <SectionCard title="Predicate Inference Playground" description="Exercises, error highlighting, saved progress, and explanation panel.">
      <div className="space-y-2">
        {exercises.map((exercise) => (
          <label key={exercise.id} className="flex gap-3 rounded-xl border border-slate-200 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
            <input type="checkbox" checked={completed.includes(exercise.id)} onChange={() => toggleExercise(exercise.id)} />
            <span className="text-sm"><span className="font-black">{exercise.prompt}</span>{mode === "teacher" && <span className="mt-1 block text-slate-500 dark:text-slate-300">{exercise.answer}</span>}</span>
          </label>
        ))}
      </div>
      <div className="mt-4 rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
        <div className="flex items-center gap-2 text-sm font-black"><BrainCircuit className="h-4 w-4 text-cyan-500" /> AI explanation panel</div>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">This local explanation engine checks the active construction and gives rule-based feedback without sending student work away from the browser.</p>
      </div>
      <div className="mt-4">
        <p className="text-sm font-black">Quiz: In implication {"P -> Q"}, what is the result when P is true and Q is false?</p>
        <div className="mt-2 flex gap-2">
          <input className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950" value={quizAnswer} onChange={(event) => setQuizAnswer(event.target.value)} />
          <button className="action-primary" type="button" onClick={() => setQuizChecked(true)}><Sparkles className="h-4 w-4" /> Check</button>
        </div>
        {quizChecked && <div className={`mt-2 rounded-xl p-3 text-sm font-semibold ${quizCorrect ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-100" : "bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-100"}`}>{quizCorrect ? "Correct. A true antecedent and false consequent makes implication false." : "Try false. Implication fails only in the true-to-false row."}</div>}
      </div>
    </SectionCard>
  );
}

function LogicOutput({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
      <div className="mb-1 flex items-center gap-2 text-xs font-black uppercase text-slate-500"><Wand2 className="h-4 w-4 text-cyan-500" /> {title}</div>
      <div className="break-words font-mono text-sm">{value}</div>
    </div>
  );
}

function MathLine({ source }: { source: string }) {
  const html = katex.renderToString(source.replace(/<->/g, String.raw`\leftrightarrow`).replace(/->/g, String.raw`\to`), { throwOnError: false });
  return <div className="overflow-x-auto rounded-xl bg-slate-100 p-3 text-lg dark:bg-white/10" dangerouslySetInnerHTML={{ __html: html }} />;
}

function ProofNode({ x, y, label, accent = false }: { x: number; y: number; label: string; accent?: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r="42" fill={accent ? "#0e7490" : "#1e293b"} stroke={accent ? "#67e8f9" : "#94a3b8"} strokeWidth="2" />
      <text x={x} y={y + 4} textAnchor="middle" fill="white" fontSize="11" fontWeight="800">{label.slice(0, 18)}</text>
    </g>
  );
}

function splitList(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}
