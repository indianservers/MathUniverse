export type FormulaToken = {
  id: string;
  label: string;
  visualLabel: string;
};

export function FormulaHighlighter({
  tokens,
  activeToken,
  onActiveToken,
}: {
  tokens: FormulaToken[];
  activeToken: string | null;
  onActiveToken: (token: string | null) => void;
}) {
  if (!tokens.length) return null;
  return (
    <section className="rounded-xl border border-violet-200 bg-white/90 p-4 shadow-sm dark:border-violet-300/20 dark:bg-white/[0.05]" data-testid="visual-proof-formula-token-list">
      <h2 className="text-base font-black text-slate-950 dark:text-white">Formula links</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {tokens.map((token) => {
          const active = activeToken === token.id;
          return (
            <button
              key={token.id}
              type="button"
              onMouseEnter={() => onActiveToken(token.id)}
              onMouseLeave={() => onActiveToken(null)}
              onFocus={() => onActiveToken(token.id)}
              onBlur={() => onActiveToken(null)}
              onClick={() => onActiveToken(active ? null : token.id)}
              className={`rounded-lg border px-3 py-2 text-sm font-black underline-offset-4 transition ${active ? "border-violet-500 bg-violet-100 text-violet-950 underline decoration-4 dark:bg-violet-300 dark:text-slate-950" : "border-slate-200 bg-slate-100 text-slate-700 hover:border-violet-300 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-200"}`}
              aria-pressed={active}
            >
              {token.label}
              <span className="ml-2 text-xs font-bold opacity-75">{token.visualLabel}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
