import type { MathRecognizedToken, MathTokenCategory } from "./mathRecognitionTypes";

const categoryStyles: Record<MathTokenCategory, string> = {
  algebra: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-100",
  arithmetic: "border-slate-200 bg-slate-100 text-slate-800 dark:border-white/10 dark:bg-white/10 dark:text-slate-100",
  calculus: "border-purple-200 bg-purple-50 text-purple-900 dark:border-purple-400/20 dark:bg-purple-400/10 dark:text-purple-100",
  complex: "border-violet-200 bg-violet-50 text-violet-900 dark:border-violet-400/20 dark:bg-violet-400/10 dark:text-violet-100",
  constant: "border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-400/20 dark:bg-yellow-400/10 dark:text-yellow-100",
  "coordinate-geometry": "border-pink-200 bg-pink-50 text-pink-900 dark:border-pink-400/20 dark:bg-pink-400/10 dark:text-pink-100",
  discrete: "border-lime-200 bg-lime-50 text-lime-900 dark:border-lime-400/20 dark:bg-lime-400/10 dark:text-lime-100",
  engineering: "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-100",
  finance: "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-100",
  geometry: "border-pink-200 bg-pink-50 text-pink-900 dark:border-pink-400/20 dark:bg-pink-400/10 dark:text-pink-100",
  grouping: "border-slate-200 bg-white text-slate-700 dark:border-white/10 dark:bg-slate-950 dark:text-slate-100",
  "log-exp": "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-100",
  matrix: "border-indigo-200 bg-indigo-50 text-indigo-900 dark:border-indigo-400/20 dark:bg-indigo-400/10 dark:text-indigo-100",
  number: "border-zinc-200 bg-zinc-50 text-zinc-900 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-100",
  "power-root": "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-100",
  probability: "border-cyan-200 bg-cyan-50 text-cyan-900 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-100",
  relation: "border-red-200 bg-red-50 text-red-900 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-100",
  statistics: "border-teal-200 bg-teal-50 text-teal-900 dark:border-teal-400/20 dark:bg-teal-400/10 dark:text-teal-100",
  trigonometry: "border-orange-200 bg-orange-50 text-orange-900 dark:border-orange-400/20 dark:bg-orange-400/10 dark:text-orange-100",
  unit: "border-slate-300 bg-slate-50 text-slate-900 dark:border-white/10 dark:bg-slate-900 dark:text-slate-100",
  unknown: "border-slate-200 bg-slate-50 text-slate-500 dark:border-white/10 dark:bg-slate-900 dark:text-slate-400",
  variable: "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-100",
  "word-problem": "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-900 dark:border-fuchsia-400/20 dark:bg-fuchsia-400/10 dark:text-fuchsia-100",
};

export function MathTokenHighlighter({ tokens, compact = false }: { tokens: MathRecognizedToken[]; compact?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tokens.map((token) => (
        <span
          title={token.description}
          key={`${token.start}-${token.end}-${token.text}`}
          className={`rounded-xl border px-3 py-2 text-xs font-black shadow-sm ${categoryStyles[token.category]}`}
        >
          <span className="font-mono">{token.text}</span>
          {!compact ? (
            <>
              <span className="mx-1 opacity-60">|</span>
              <span>{token.label}</span>
              <span className="ml-2 rounded-full bg-white/65 px-2 py-0.5 uppercase dark:bg-black/15">{formatCategory(token.category)}</span>
            </>
          ) : null}
        </span>
      ))}
    </div>
  );
}

export function formatCategory(category: MathTokenCategory) {
  return category.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
