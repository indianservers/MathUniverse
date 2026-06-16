import katex from "katex";
import { useMemo } from "react";

type MathExpressionProps = {
  value: string;
  display?: boolean;
  className?: string;
};

export default function MathExpression({ value, display = false, className = "" }: MathExpressionProps) {
  const formula = useMemo(() => normalizeFormulaForKatex(value), [value]);
  const html = useMemo(() => {
    try {
      return katex.renderToString(formula, { throwOnError: false, displayMode: display });
    } catch {
      return null;
    }
  }, [display, formula]);

  if (!html) return <span className={className}>{prettyFormulaFallback(value)}</span>;

  return (
    <span
      className={`math-expression inline-block max-w-full overflow-x-auto overflow-y-hidden align-middle [&_.katex-display]:my-0 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function normalizeFormulaForKatex(value: string) {
  return value
    .replace(/!=/g, "\\ne")
    .replace(/<=/g, "\\le")
    .replace(/>=/g, "\\ge")
    .replace(/->|=>/g, "\\to")
    .replace(/\binf\b/g, "\\infty")
    .replace(/\bDelta\b/g, "\\Delta")
    .replace(/\btheta\b/g, "\\theta")
    .replace(/\balpha\b/g, "\\alpha")
    .replace(/\bbeta\b/g, "\\beta")
    .replace(/\bphi\b/g, "\\phi")
    .replace(/\bpi\b/g, "\\pi")
    .replace(/(?<!\\)\bsin\b/g, "\\sin")
    .replace(/(?<!\\)\bcos\b/g, "\\cos")
    .replace(/(?<!\\)\btan\b/g, "\\tan")
    .replace(/(?<!\\)\bsec\b/g, "\\sec")
    .replace(/(?<!\\)\bcsc\b/g, "\\csc")
    .replace(/(?<!\\)\bcosec\b/g, "\\csc")
    .replace(/(?<!\\)\bcot\b/g, "\\cot")
    .replace(/\\theta\s*\/\s*2/g, "\\frac{\\theta}{2}")
    .replace(/\b1\s*\/\s*2\b/g, "\\frac{1}{2}")
    .replace(/\b2\s*pi\b/g, "2\\pi")
    .replace(/\bsqrt\(([^()]+)\)/g, "\\sqrt{$1}")
    .replace(/\bcbrt\(([^()]+)\)/g, "\\sqrt[3]{$1}")
    .replace(/\bsin\^-1\b/g, "\\sin^{-1}")
    .replace(/\bcos\^-1\b/g, "\\cos^{-1}")
    .replace(/\btan\^-1\b/g, "\\tan^{-1}")
    .replace(/\^\(([^()]+)\)/g, "^{$1}")
    .replace(/\*/g, "\\cdot ");
}

function prettyFormulaFallback(value: string) {
  return value
    .replace(/\btheta\b/g, "θ")
    .replace(/\bpi\b/g, "π")
    .replace(/\^2/g, "²")
    .replace(/\^3/g, "³")
    .replace(/\^-1/g, "⁻¹");
}
