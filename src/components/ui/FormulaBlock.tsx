import katex from "katex";
import { useMemo } from "react";
import SectionCard from "./SectionCard";

type FormulaBlockProps = {
  title: string;
  formula: string;
  explanation?: string;
};

export default function FormulaBlock({ title, formula, explanation }: FormulaBlockProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(formula, { throwOnError: false, displayMode: true });
    } catch {
      return null;
    }
  }, [formula]);

  return (
    <div data-formula-block data-formula-title={title}>
      <SectionCard title={title} description={explanation}>
        <div className="overflow-x-auto rounded-2xl border border-cyan-200/70 bg-gradient-to-br from-cyan-50 to-violet-50 px-4 py-6 text-center shadow-inner shadow-white/60 dark:border-cyan-400/20 dark:from-cyan-400/10 dark:to-violet-500/10 dark:shadow-black/10">
          {html ? (
            <div className="min-w-max text-lg md:text-2xl [&_.katex-display]:my-0" dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <p className="break-words font-mono text-lg font-semibold md:text-xl">{formula}</p>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
