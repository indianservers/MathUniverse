import katex from "katex";
import { useMemo } from "react";
import SectionCard from "./SectionCard";

type FormulaBlockProps = {
  title: string;
  formula: string;
  explanation?: string;
};

export default function FormulaBlock({ title, formula, explanation }: FormulaBlockProps) {
  const displayFormula = useMemo(() => formatFormulaForKatex(formula), [formula]);
  const html = useMemo(() => {
    try {
      return katex.renderToString(displayFormula, { throwOnError: false, displayMode: true });
    } catch {
      return null;
    }
  }, [displayFormula]);

  return (
    <div data-formula-block data-formula-title={title}>
      <SectionCard title={title} description={explanation} compact>
        <div className="formula-card rounded-xl border border-cyan-200/70 bg-gradient-to-br from-cyan-50 to-violet-50 px-3 py-4 text-center shadow-inner shadow-white/60 dark:border-cyan-400/20 dark:from-cyan-400/10 dark:to-violet-500/10 dark:shadow-black/10">
          {html ? (
            <div className="formula-katex text-base md:text-xl [&_.katex-display]:my-0" dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <p className="formula-plain font-mono text-base font-semibold md:text-lg">{formula}</p>
          )}
        </div>
      </SectionCard>
    </div>
  );
}

function formatFormulaForKatex(value: string) {
  const normalized = normalizeFormulaText(value);
  if (normalized.includes("\\begin") || normalized.length < 34) return normalized;
  const pieces = normalized.split(/,\s+|;\s+/).map((piece) => piece.trim()).filter(Boolean);
  if (pieces.length < 2 || pieces.some((piece) => piece.length < 6)) return normalized;
  return `\\begin{aligned}${pieces.join("\\\\")}\\end{aligned}`;
}

function normalizeFormulaText(value: string) {
  return value
    .replace(/â†’/g, "\\to")
    .replace(/â‰¤/g, "\\le")
    .replace(/â‰¥/g, "\\ge")
    .replace(/â‰ /g, "\\ne")
    .replace(/Â±|±/g, "\\pm")
    .replace(/Â²|²/g, "^2")
    .replace(/Â³|³/g, "^3")
    .replace(/Â¹|¹/g, "^1")
    .replace(/â»Â¹|â»¹|⁻¹/g, "^{-1}")
    .replace(/!=/g, "\\ne")
    .replace(/<=/g, "\\le")
    .replace(/>=/g, "\\ge")
    .replace(/->/g, "\\to")
    .replace(/\bDelta\b/g, "\\Delta")
    .replace(/\btheta\b/g, "\\theta")
    .replace(/\bpi\b/g, "\\pi")
    .replace(/\bsqrt\(([^()]+)\)/g, "\\sqrt{$1}")
    .replace(/\bcbrt\(([^()]+)\)/g, "\\sqrt[3]{$1}")
    .replace(/\^\(([^()]+)\)/g, "^{$1}")
    .replace(/\*/g, "\\cdot ")
    .replace(/([A-Za-z0-9!^{}()+-]+)\s*\/\s*([A-Za-z0-9!^{}()+-]+)/g, "\\frac{$1}{$2}");
}
