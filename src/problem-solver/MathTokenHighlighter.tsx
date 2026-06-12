import type { MathRecognizedToken, MathTokenCategory } from "./mathKeywordRecognizer";
import type { MathEducationLevel, MathSuggestion } from "./mathSuggestions";
import type { ProblemClassification, ProblemIntentKind } from "./problemTypes";

interface MathTokenHighlighterProps {
  tokens: MathRecognizedToken[];
  classification: ProblemClassification;
  suggestions: MathSuggestion[];
  educationLevel: MathEducationLevel;
}

const categoryStyles: Record<MathTokenCategory, string> = {
  arithmetic: "border-slate-200 bg-slate-100 text-slate-800 dark:border-white/10 dark:bg-white/10 dark:text-slate-100",
  number: "border-zinc-200 bg-zinc-50 text-zinc-900 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-100",
  grouping: "border-slate-200 bg-white text-slate-700 dark:border-white/10 dark:bg-slate-950 dark:text-slate-100",
  algebra: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-100",
  "power-root": "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-100",
  trigonometry: "border-orange-200 bg-orange-50 text-orange-900 dark:border-orange-400/20 dark:bg-orange-400/10 dark:text-orange-100",
  "log-exp": "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-100",
  calculus: "border-purple-200 bg-purple-50 text-purple-900 dark:border-purple-400/20 dark:bg-purple-400/10 dark:text-purple-100",
  "coordinate-geometry": "border-pink-200 bg-pink-50 text-pink-900 dark:border-pink-400/20 dark:bg-pink-400/10 dark:text-pink-100",
  geometry: "border-pink-200 bg-pink-50 text-pink-900 dark:border-pink-400/20 dark:bg-pink-400/10 dark:text-pink-100",
  statistics: "border-teal-200 bg-teal-50 text-teal-900 dark:border-teal-400/20 dark:bg-teal-400/10 dark:text-teal-100",
  probability: "border-cyan-200 bg-cyan-50 text-cyan-900 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-100",
  matrix: "border-indigo-200 bg-indigo-50 text-indigo-900 dark:border-indigo-400/20 dark:bg-indigo-400/10 dark:text-indigo-100",
  complex: "border-violet-200 bg-violet-50 text-violet-900 dark:border-violet-400/20 dark:bg-violet-400/10 dark:text-violet-100",
  discrete: "border-lime-200 bg-lime-50 text-lime-900 dark:border-lime-400/20 dark:bg-lime-400/10 dark:text-lime-100",
  engineering: "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-100",
  unit: "border-slate-300 bg-slate-50 text-slate-900 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100",
  finance: "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-100",
  "word-problem": "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-900 dark:border-fuchsia-400/20 dark:bg-fuchsia-400/10 dark:text-fuchsia-100",
  constant: "border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-400/20 dark:bg-yellow-400/10 dark:text-yellow-100",
  relation: "border-red-200 bg-red-50 text-red-900 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-100",
  variable: "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-100",
  unknown: "border-slate-200 bg-slate-50 text-slate-500 dark:border-white/10 dark:bg-slate-900 dark:text-slate-400",
};

export function MathTokenHighlighter({ tokens, classification, suggestions, educationLevel }: MathTokenHighlighterProps) {
  const categories = unique(tokens.map((token) => token.category));
  const tokenSuggestions = tokens.map((token) => token.suggestion).filter(Boolean) as string[];
  const unknownTokens = tokens.filter((token) => token.category === "unknown");
  const warnings = unique([
    ...classification.warnings,
    ...(unknownTokens.length ? [`${unknownTokens.length} token${unknownTokens.length === 1 ? "" : "s"} need manual interpretation.`] : []),
  ]);

  if (tokens.length === 0) {
    return (
      <section className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/40">
        <p className="text-xs font-black uppercase text-cyan-700 dark:text-cyan-200">AI Math Recognition</p>
        <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">Start typing to identify functions, variables, constants, and operators.</p>
      </section>
    );
  }

  return (
    <section className="mt-4 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/40">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase text-cyan-700 dark:text-cyan-200">AI Math Recognition</p>
          <h3 className="text-lg font-black text-slate-950 dark:text-white">Recognized Math Structure</h3>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-600 shadow-sm dark:bg-white/10 dark:text-slate-200">{tokens.length} tokens</span>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <SummaryTile label="Detected categories" value={categories.map(formatCategory).join(", ") || "None"} />
        <SummaryTile label="Possible type" value={labelForKind(classification.kind)} />
        <SummaryTile label="Level detected" value={educationLevel === "Engineering" ? "Engineering Mathematics" : educationLevel} />
        <SummaryTile label="Confidence" value={classification.confidence} />
      </div>

      <div>
        <p className="mb-2 text-xs font-black uppercase text-slate-500 dark:text-slate-400">Token Badges</p>
        <div className="flex flex-wrap gap-2">
          {tokens.map((token) => (
            <span title={token.description} key={`${token.start}-${token.end}-${token.text}`} className={`rounded-xl border px-3 py-2 text-xs font-black shadow-sm ${categoryStyles[token.category]}`}>
              <span className="font-mono">{token.text}</span>
              <span className="mx-1 opacity-60">|</span>
              <span>{token.label}</span>
              <span className="ml-2 rounded-full bg-white/65 px-2 py-0.5 uppercase dark:bg-black/15">{formatCategory(token.category)}</span>
            </span>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-black uppercase text-slate-500 dark:text-slate-400">Recognized Math Structure</p>
        <div className="flex flex-wrap gap-1.5 rounded-xl bg-white p-3 dark:bg-slate-950/70">
          {tokens.map((token) => (
            <span key={`preview-${token.start}-${token.end}-${token.text}`} className={`rounded-lg border px-2 py-1 font-mono text-xs font-black ${categoryStyles[token.category]}`}>
              {token.text}
            </span>
          ))}
        </div>
      </div>

      {suggestions.length > 0 || tokenSuggestions.length > 0 ? (
        <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-3 dark:border-cyan-400/20 dark:bg-cyan-400/10">
          <p className="text-xs font-black uppercase text-cyan-800 dark:text-cyan-100">Smart Suggestions</p>
          <div className="mt-2 space-y-2">
            {[...suggestions.map((suggestion) => suggestion.message), ...tokenSuggestions].map((message) => (
              <p key={message} className="text-sm font-semibold text-cyan-950 dark:text-cyan-100">{message}</p>
            ))}
          </div>
        </div>
      ) : null}

      {warnings.length > 0 ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-900 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-100">
          {warnings.map((warning) => <p key={warning}>{warning}</p>)}
        </div>
      ) : null}
    </section>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white p-3 shadow-sm dark:bg-white/10">
      <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-black text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

function unique<T>(items: T[]) {
  return [...new Set(items)];
}

function formatCategory(category: MathTokenCategory) {
  return category.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function labelForKind(kind: ProblemIntentKind) {
  const labels: Record<ProblemIntentKind, string> = {
    "linear-equation": "Linear Equation",
    "quadratic-equation": "Quadratic Equation",
    "polynomial-equation": "Polynomial Equation",
    simplify: "Simplification",
    factor: "Factoring",
    expand: "Expansion",
    evaluate: "Expression Evaluation",
    derivative: "Derivative",
    integral: "Integral",
    limit: "Limit",
    system: "System of Equations",
    statistics: "Statistics",
    matrix: "Matrix",
    unsupported: "Unsupported or Unknown",
  };
  return labels[kind];
}
