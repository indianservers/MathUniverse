import { formatMathEducationLevel } from "./mathEducationLevel";
import type { MathRecognitionResult } from "./mathRecognitionTypes";
import { formatCategory, MathTokenHighlighter } from "./MathTokenHighlighter";

export function MathRecognitionPanel({ result }: { result: MathRecognitionResult }) {
  if (result.tokens.length === 0) {
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
        <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-600 shadow-sm dark:bg-white/10 dark:text-slate-200">{result.audit.totalTokens} tokens</span>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <SummaryTile label="Detected categories" value={result.categories.map(formatCategory).join(", ") || "None"} />
        <SummaryTile label="Possible type" value={result.possibleProblemType} />
        <SummaryTile label="Level detected" value={formatMathEducationLevel(result.level)} />
        <SummaryTile label="Recognition rate" value={`${Math.round(result.audit.recognitionRate * 100)}%`} />
      </div>

      {result.operationInsight ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-400/20 dark:bg-emerald-400/10">
          <p className="text-xs font-black uppercase text-emerald-800 dark:text-emerald-100">Detected Operation</p>
          <div className="mt-2 grid gap-2 md:grid-cols-3">
            <SummaryTile label="Operation" value={result.operationInsight.name} />
            <SummaryTile label="Confidence" value={result.operationInsight.confidence} />
            <SummaryTile label="Normalized" value={result.operationInsight.normalizedExpression ?? "Direct solver input"} />
          </div>
          <p className="mt-2 text-sm font-semibold text-emerald-950 dark:text-emerald-100">{result.operationInsight.explanation}</p>
        </div>
      ) : null}

      <div>
        <p className="mb-2 text-xs font-black uppercase text-slate-500 dark:text-slate-400">Token Badges</p>
        <MathTokenHighlighter tokens={result.tokens} />
      </div>

      <div>
        <p className="mb-2 text-xs font-black uppercase text-slate-500 dark:text-slate-400">Recognized Math Structure</p>
        <div className="rounded-xl bg-white p-3 dark:bg-slate-950/70">
          <MathTokenHighlighter tokens={result.tokens} compact />
        </div>
      </div>

      {result.suggestions.length > 0 ? (
        <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-3 dark:border-cyan-400/20 dark:bg-cyan-400/10">
          <p className="text-xs font-black uppercase text-cyan-800 dark:text-cyan-100">Smart Suggestions</p>
          <div className="mt-2 space-y-2">
            {result.suggestions.map((message) => <p key={message} className="text-sm font-semibold text-cyan-950 dark:text-cyan-100">{message}</p>)}
          </div>
        </div>
      ) : null}

      {result.warnings.length > 0 ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-900 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-100">
          {result.warnings.map((warning) => <p key={warning}>{warning}</p>)}
        </div>
      ) : null}

      <details className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/5">
        <summary className="cursor-pointer text-xs font-black uppercase text-slate-600 dark:text-slate-300">Recognition Audit</summary>
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <SummaryTile label="Recognized" value={`${result.audit.recognizedTokens}/${result.audit.totalTokens}`} />
          <SummaryTile label="Unknown" value={String(result.audit.unknownTokens)} />
          <SummaryTile label="Suggestions" value={String(result.audit.suggestionsGenerated)} />
        </div>
        <pre className="mt-3 max-h-60 overflow-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-100">{JSON.stringify(result.audit, null, 2)}</pre>
      </details>
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
