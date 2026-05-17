type CalculatorDisplayProps = {
  expression: string;
  result: string;
  error: string;
  angleMode: string;
  memory: number;
};

export default function CalculatorDisplay({ expression, result, error, angleMode, memory }: CalculatorDisplayProps) {
  return (
    <div className="rounded-2xl bg-slate-950 p-5 text-right text-white shadow-inner">
      <div className="mb-3 flex justify-between text-xs font-bold text-cyan-200"><span>{angleMode}</span><span>{memory !== 0 ? `M: ${memory}` : "M empty"}</span></div>
      <div className="min-h-8 break-words font-mono text-sm text-slate-300">{expression || "0"}</div>
      <div className={`mt-2 min-h-12 break-words font-mono text-3xl font-bold ${error ? "text-rose-300" : "text-white"}`}>{error || result || "0"}</div>
    </div>
  );
}
