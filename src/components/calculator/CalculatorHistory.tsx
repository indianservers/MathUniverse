export type HistoryItem = { expression: string; result: string };

type CalculatorHistoryProps = {
  history: HistoryItem[];
  onUse: (expression: string) => void;
  onClear: () => void;
};

export default function CalculatorHistory({ history, onUse, onClear }: CalculatorHistoryProps) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold">History</h2>
        <button type="button" className="action-secondary px-3 py-2" onClick={onClear}>Clear</button>
      </div>
      <div className="mt-4 max-h-[460px] space-y-2 overflow-y-auto">
        {history.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">No calculations yet.</p>}
        {history.map((item, index) => (
          <button key={`${item.expression}-${index}`} type="button" className="w-full rounded-2xl bg-slate-100 p-3 text-left transition hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15" onClick={() => onUse(item.expression)}>
            <p className="break-words font-mono text-xs text-slate-500 dark:text-slate-400">{item.expression}</p>
            <p className="mt-1 break-words font-mono font-bold">{item.result}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
