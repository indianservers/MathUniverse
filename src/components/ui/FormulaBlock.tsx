import katex from "katex";
import { useMemo } from "react";
import { FormulaImageStrip } from "../syllabus/ConceptVisualMedia";
import MathExpression, { normalizeFormulaForKatex } from "./MathExpression";
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
        <FormulaImageStrip title={title} formula={`${formula} ${explanation ?? ""}`} />
        <div className="formula-card min-w-0 overflow-hidden rounded-xl border border-cyan-200/70 bg-gradient-to-br from-cyan-50 to-violet-50 px-3 py-4 text-center shadow-inner shadow-white/60 dark:border-cyan-400/20 dark:from-cyan-400/10 dark:to-violet-500/10 dark:shadow-black/10">
          {html ? (
            <div className="formula-katex min-w-0 overflow-x-auto overflow-y-hidden text-base md:text-lg [&_.katex-display]:my-0 [&_.katex-display]:w-max [&_.katex-display]:min-w-full [&_.katex-display]:px-1" dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <MathExpression value={formula} display className="formula-plain text-base font-semibold md:text-lg" />
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
  return normalizeFormulaForKatex(value).replace(/([A-Za-z0-9!^{}()+-]+)\s*\/\s*([A-Za-z0-9!^{}()+-]+)/g, "\\frac{$1}{$2}");
}
