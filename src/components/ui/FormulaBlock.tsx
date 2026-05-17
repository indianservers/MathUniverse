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
    <SectionCard title={title} description={explanation}>
      <div className="overflow-x-auto rounded-2xl border border-cyan-200/70 bg-gradient-to-br from-cyan-50 to-violet-50 px-4 py-6 text-center dark:border-cyan-400/20 dark:from-cyan-400/10 dark:to-violet-500/10">
        {html ? (
          <div className="text-xl md:text-2xl" dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <p className="font-mono text-xl font-semibold">{formula}</p>
        )}
      </div>
    </SectionCard>
  );
}
