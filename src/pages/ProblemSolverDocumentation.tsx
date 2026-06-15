import { ArrowRight, BookOpen, CheckCircle2, Code2, ExternalLink, Palette, Sigma } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";
import { mathKeywordDefinitions, symbolDefinitions } from "../problem-solver/intelligence/mathKeywordDictionary";
import type { MathKeywordDefinition, MathRecognitionLevel, MathTokenCategory } from "../problem-solver/intelligence/mathRecognitionTypes";

type ExampleGroup = {
  title: string;
  level: MathRecognitionLevel;
  summary: string;
  examples: Array<{ input: string; result: string; notes: string }>;
};

const solverUrl = "http://localhost:3526/problem-solver";

const exampleGroups: ExampleGroup[] = [
  {
    title: "Basic Arithmetic",
    level: "school",
    summary: "Direct calculations, word-style arithmetic, powers, roots, and common numeric functions.",
    examples: [
      { input: "15 plus 98", result: "113", notes: "Natural addition words are normalized to arithmetic." },
      { input: "sum(15+98)", result: "113", notes: "Function-style sum works for an expression." },
      { input: "sum(15, 98)", result: "113", notes: "Comma-separated values are added." },
      { input: "product of 3 and 4", result: "12", notes: "Product commands become multiplication." },
      { input: "subtract 4 from 10", result: "6", notes: "Reads as 10 - 4." },
      { input: "divide 10 by 2", result: "5", notes: "Reads as 10 / 2." },
      { input: "2 + 3 * 4", result: "14", notes: "Uses standard order of operations." },
      { input: "sqrt(34)", result: "Exact root plus decimal approximation", notes: "Irrational roots keep exact and approximate forms." },
    ],
  },
  {
    title: "Algebra",
    level: "school",
    summary: "One-variable equations, simplifying, expanding, factoring, and rational-expression restrictions.",
    examples: [
      { input: "2x + 5 = 15", result: "x = 5", notes: "Implicit multiplication is accepted." },
      { input: "x^2 - 5x + 6 = 0", result: "x = 2, 3", notes: "Quadratics get equation steps and verification." },
      { input: "simplify 2x + 3x - 5", result: "5x - 5", notes: "Combines like terms." },
      { input: "simplify (x^2 - 1)/(x - 1)", result: "x + 1, x != 1", notes: "Cancels factors but preserves domain restrictions." },
      { input: "factor x^2 - 5x + 6", result: "(x - 2)(x - 3)", notes: "Integer factorization is supported." },
      { input: "expand (x+1)^2", result: "x^2 + 2x + 1", notes: "Distributes products and powers." },
    ],
  },
  {
    title: "Functions and Trigonometry",
    level: "intermediate",
    summary: "Numeric roots, logarithms, exponentials, absolute value, and degree-mode trig evaluation.",
    examples: [
      { input: "sin(30)", result: "0.5", notes: "Numeric trig angles are interpreted in degrees." },
      { input: "cos(60)", result: "0.5", notes: "Degree-mode trig assumption is shown in result cards." },
      { input: "log(100)", result: "2", notes: "log is treated as base 10." },
      { input: "log2(8)", result: "3", notes: "Base-2 logarithm is supported." },
      { input: "ln(e)", result: "1", notes: "Natural logarithm uses e." },
      { input: "abs(-5)", result: "5", notes: "Absolute value evaluates numerically." },
    ],
  },
  {
    title: "Calculus",
    level: "intermediate",
    summary: "Derivative, integral, and limit commands route to deterministic rules first, then symbolic fallback.",
    examples: [
      { input: "derivative of x^2", result: "2x", notes: "Uses x unless the input states another variable." },
      { input: "differentiate x^3 + 2x", result: "3x^2 + 2", notes: "The differentiate alias is accepted." },
      { input: "integrate 2x", result: "x^2 + C", notes: "Adds the integration constant." },
      { input: "integrate x from 0 to 2", result: "2", notes: "Definite integral form is supported for simple expressions." },
      { input: "limit x->0 sin(x)/x", result: "1", notes: "Limit arrow notation uses ->." },
    ],
  },
  {
    title: "Systems, Statistics, and Matrices",
    level: "intermediate",
    summary: "Use semicolons or 'and' for systems, statistics commands for lists, and double brackets for matrices.",
    examples: [
      { input: "solve 2x + y = 7 and x - y = 2", result: "x = 3, y = 1", notes: "Solves linear systems together." },
      { input: "mean of 4, 6, 8, 10", result: "7", notes: "Statistics commands accept comma-separated lists." },
      { input: "median of 4, 6, 8, 10", result: "7", notes: "Sorted center values are averaged when needed." },
      { input: "variance of 4, 6, 8, 10", result: "5", notes: "Population variance is the default." },
      { input: "determinant [[1,2],[3,4]]", result: "-2", notes: "Matrix notation uses nested brackets." },
      { input: "[[1,2],[3,4]] + [[5,6],[7,8]]", result: "[[6,8],[10,12]]", notes: "Matrix arithmetic is available for supported sizes." },
    ],
  },
  {
    title: "Advanced Recognition",
    level: "engineering",
    summary: "Engineering keywords are recognized for highlighting, suggestions, and future expansion even when no full solver exists yet.",
    examples: [
      { input: "Laplace transform of sin(t)", result: "Recognized topic", notes: "Recognition panel identifies engineering math intent." },
      { input: "Fourier series of x", result: "Recognized topic", notes: "Useful for routing and future solver expansion." },
      { input: "Newton Raphson method", result: "Recognized method", notes: "Currently recognized before full numeric-method solving." },
    ],
  },
];

const syntaxRules = [
  { syntax: "2x, 3(x+1), (x+1)(x-1)", meaning: "Implicit multiplication is normalized to explicit multiplication." },
  { syntax: "^", meaning: "Power operator, for example x^2 or 2^3." },
  { syntax: "sqrt(16), log(100), ln(e)", meaning: "Function calls use parentheses." },
  { syntax: "sin(30), cos(60), tan(45)", meaning: "Numeric trig input uses degrees by default." },
  { syntax: "x + y = 2; x - y = 1", meaning: "Semicolon separates equations in a system." },
  { syntax: "[[1,2],[3,4]]", meaning: "Nested brackets create a matrix." },
  { syntax: "x->0", meaning: "Limit target notation, as in limit x->0 sin(x)/x." },
  { syntax: "plus, minus, times, divided by", meaning: "Common arithmetic words are normalized for beginner inputs." },
];

const supportedOperations = [
  "Numeric evaluation",
  "Arithmetic word commands",
  "One-variable linear equations",
  "Quadratic equations",
  "Polynomial equation fallback",
  "Simplify expressions",
  "Factor quadratics",
  "Expand products",
  "Domain restrictions",
  "Derivative commands",
  "Integral commands",
  "Limit commands",
  "Linear systems",
  "Statistics summaries",
  "Matrix determinant",
  "Matrix inverse",
  "Matrix transpose",
  "Matrix addition",
  "Matrix multiplication",
  "IDE-style token highlighting",
  "Recognition suggestions",
  "Visual result cards",
];

const colorLegend = [
  { label: "Numbers and constants", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-100", example: "15, 98, pi, e" },
  { label: "Variables", className: "bg-sky-100 text-sky-800 dark:bg-sky-400/15 dark:text-sky-100", example: "x, y, z" },
  { label: "Symbols and operators", className: "bg-rose-100 text-rose-800 dark:bg-rose-400/15 dark:text-rose-100", example: "+, -, *, /, =, (, )" },
  { label: "Math keywords and functions", className: "bg-violet-100 text-violet-800 dark:bg-violet-400/15 dark:text-violet-100", example: "sin, derivative, matrix" },
  { label: "Unknown text", className: "bg-slate-100 text-slate-700 underline decoration-dotted dark:bg-white/10 dark:text-slate-200", example: "unclear words" },
];

const categoryLabels: Record<MathTokenCategory, string> = {
  algebra: "Algebra",
  arithmetic: "Arithmetic",
  calculus: "Calculus",
  complex: "Complex Numbers",
  constant: "Constants",
  "coordinate-geometry": "Coordinate Geometry",
  discrete: "Discrete Math",
  engineering: "Engineering Math",
  finance: "Finance",
  geometry: "Geometry",
  grouping: "Grouping",
  "log-exp": "Logarithms and Exponentials",
  matrix: "Matrices",
  number: "Numbers",
  probability: "Probability",
  "power-root": "Powers and Roots",
  relation: "Relations",
  statistics: "Statistics",
  trigonometry: "Trigonometry",
  unit: "Units",
  unknown: "Unknown",
  variable: "Variables",
  "word-problem": "Word Problems",
};

const levelLabels: Record<MathRecognitionLevel, string> = {
  school: "Basic",
  intermediate: "Intermediate",
  engineering: "Advanced",
};

const recognizedDefinitions = [...mathKeywordDefinitions, ...symbolDefinitions];
const keywordGroups = groupKeywords(recognizedDefinitions);

export default function ProblemSolverDocumentation() {
  const keywordCount = recognizedDefinitions.reduce((total, definition) => total + 1 + (definition.aliases?.length ?? 0), 0);
  const exampleCount = exampleGroups.reduce((total, group) => total + group.examples.length, 0);

  return (
    <div className="space-y-6">
      <TopicHeader
        title="Problem Solver Documentation"
        subtitle="Complete guide for the step-by-step solver at http://localhost:3526/problem-solver."
        difficulty="Reference"
        estimatedMinutes={12}
      />

      <SectionCard title="Quick Start" description="Use the solver as a live mathematical workspace: type, inspect recognition, read result cards, and verify visually when graphs or tables are available.">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="grid gap-3 md:grid-cols-3">
            {[
              ["1", "Open the solver", solverUrl],
              ["2", "Type a problem", "Examples: sum(15+98), 2x + 5 = 15, derivative of x^2."],
              ["3", "Read the cards", "Final answer, steps, verification, graph/table, assumptions, and warnings."],
            ].map(([step, title, text]) => (
              <div key={step} className="rounded-xl border border-slate-200 bg-white/75 p-4 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs font-black uppercase text-cyan-700 dark:text-cyan-200">Step {step}</p>
                <h3 className="mt-2 font-black text-slate-950 dark:text-white">{title}</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">{text}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-slate-950 p-4 text-white">
            <p className="flex items-center gap-2 text-xs font-black uppercase text-cyan-200"><ExternalLink className="h-4 w-4" /> Local route</p>
            <code className="mt-3 block break-words rounded-lg bg-white/10 p-3 text-sm font-bold text-cyan-50">{solverUrl}</code>
            <Link className="action-primary mt-4 w-full justify-center" to="/problem-solver">
              Open Solver <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </SectionCard>

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard icon={<Sigma className="h-5 w-5" />} value={supportedOperations.length} label="supported capabilities" />
        <MetricCard icon={<Code2 className="h-5 w-5" />} value={exampleCount} label="documented examples" />
        <MetricCard icon={<BookOpen className="h-5 w-5" />} value={keywordCount} label="recognized keywords and aliases" />
      </section>

      <SectionCard title="What It Supports" description="These are the user-facing capabilities currently documented for the step-by-step problem solver.">
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {supportedOperations.map((item) => (
            <div key={item} className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 dark:bg-white/10 dark:text-slate-100">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Syntax Rules" description="Use these forms when writing inputs. The solver normalizes several friendly forms into strict math notation.">
        <div className="grid gap-3 lg:grid-cols-2">
          {syntaxRules.map((rule) => (
            <div key={rule.syntax} className="rounded-xl border border-slate-200 bg-white/75 p-4 dark:border-white/10 dark:bg-white/5">
              <code className="block break-words rounded-lg bg-slate-950 p-3 text-sm font-bold text-cyan-50">{rule.syntax}</code>
              <p className="mt-3 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">{rule.meaning}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="IDE Colors" description="The input editor highlights recognized math tokens while you type.">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {colorLegend.map((item) => (
            <div key={item.label} className="rounded-xl border border-slate-200 bg-white/75 p-4 dark:border-white/10 dark:bg-white/5">
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${item.className}`}>{item.label}</span>
              <code className="mt-3 block break-words rounded-lg bg-slate-950 p-2 text-xs font-bold text-cyan-50">{item.example}</code>
            </div>
          ))}
        </div>
      </SectionCard>

      {exampleGroups.map((group) => (
        <SectionCard key={group.title} title={group.title} description={`${levelLabels[group.level]} examples. ${group.summary}`}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-separate border-spacing-y-2 text-left">
              <thead>
                <tr className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">
                  <th className="px-3 py-2">Input</th>
                  <th className="px-3 py-2">Expected Output</th>
                  <th className="px-3 py-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                {group.examples.map((example) => (
                  <tr key={example.input} className="bg-white/75 text-sm font-semibold text-slate-700 shadow-sm dark:bg-white/5 dark:text-slate-200">
                    <td className="rounded-l-xl px-3 py-3"><code className="font-bold text-cyan-800 dark:text-cyan-100">{example.input}</code></td>
                    <td className="px-3 py-3">{example.result}</td>
                    <td className="rounded-r-xl px-3 py-3">{example.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      ))}

      <SectionCard title="All Recognized Keywords" description="This vocabulary powers highlighting, recognition, suggestions, and problem-type detection. Aliases are included beside their primary keyword.">
        <div className="grid gap-4">
          {Object.entries(keywordGroups).map(([category, definitions]) => (
            <details key={category} className="rounded-xl border border-slate-200 bg-white/75 p-4 dark:border-white/10 dark:bg-white/5" open={["arithmetic", "algebra", "calculus", "matrix", "statistics"].includes(category)}>
              <summary className="cursor-pointer text-sm font-black text-slate-950 dark:text-white">
                {categoryLabels[category as MathTokenCategory] ?? category} ({definitions.length})
              </summary>
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {definitions.map((definition) => (
                  <KeywordCard key={`${definition.category}-${definition.keyword}`} definition={definition} />
                ))}
              </div>
            </details>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Limits and Warnings" description="The solver is intentionally safe: it solves supported forms, reports assumptions, and avoids pretending when an input is outside the current deterministic surface.">
        <div className="grid gap-3 md:grid-cols-2">
          {[
            "Word problems are recognized, but long natural-language extraction is not fully automatic yet.",
            "Engineering topics such as Laplace transforms and Fourier series are recognized before full solving is implemented.",
            "Matrix operations depend on supported sizes and valid nested-bracket syntax.",
            "Trigonometric numeric evaluation uses degrees by default.",
            "Domain restrictions are shown for roots, logarithms, and rational expressions when detected.",
            "Unsupported text appears in the recognition panel with suggestions instead of being solved incorrectly.",
          ].map((item) => (
            <div key={item} className="rounded-xl bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-900 dark:bg-amber-400/10 dark:text-amber-100">{item}</div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Recommended Workflow" description="A practical loop for using the solver from basic arithmetic through advanced math.">
        <div className="grid gap-3 md:grid-cols-4">
          {[
            ["Start basic", "Check arithmetic and syntax first."],
            ["Add structure", "Move to equations, systems, matrices, or statistics."],
            ["Inspect recognition", "Open the recognition panel when keywords are unclear."],
            ["Use warnings", "Read assumptions and restrictions before copying the result."],
          ].map(([title, text]) => (
            <div key={title} className="rounded-xl border border-slate-200 bg-white/75 p-4 dark:border-white/10 dark:bg-white/5">
              <Palette className="h-5 w-5 text-violet-500" />
              <h3 className="mt-3 font-black text-slate-950 dark:text-white">{title}</h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">{text}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function MetricCard({ icon, value, label }: { icon: ReactNode; value: number; label: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center justify-between gap-3">
        <div className="rounded-lg bg-cyan-100 p-2 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-100">{icon}</div>
        <p className="text-2xl font-black text-slate-950 dark:text-white">{value}</p>
      </div>
      <p className="mt-3 text-sm font-bold text-slate-600 dark:text-slate-300">{label}</p>
    </div>
  );
}

function KeywordCard({ definition }: { definition: MathKeywordDefinition }) {
  const aliases = definition.aliases ?? [];
  return (
    <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-950/50">
      <div className="flex flex-wrap items-center gap-2">
        <code className="rounded-lg bg-slate-950 px-2 py-1 text-xs font-bold text-cyan-50">{definition.keyword}</code>
        <span className="rounded-full bg-white px-2 py-1 text-[11px] font-black uppercase text-slate-600 dark:bg-white/10 dark:text-slate-200">{levelLabels[definition.level]}</span>
      </div>
      <p className="mt-2 text-sm font-black text-slate-950 dark:text-white">{definition.label}</p>
      <p className="mt-1 text-xs font-semibold leading-5 text-slate-600 dark:text-slate-300">{definition.description}</p>
      {aliases.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {aliases.map((alias) => (
            <span key={alias} className="rounded-full bg-cyan-100 px-2 py-1 text-[11px] font-bold text-cyan-800 dark:bg-cyan-400/10 dark:text-cyan-100">{alias}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function groupKeywords(definitions: MathKeywordDefinition[]) {
  return definitions.reduce<Record<string, MathKeywordDefinition[]>>((groups, definition) => {
    const group = groups[definition.category] ?? [];
    group.push(definition);
    groups[definition.category] = group;
    return groups;
  }, {});
}
