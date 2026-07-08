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

  if (!html) return <span className={className}>{value}</span>;

  return (
    <span
      className={`math-expression inline-block max-w-full overflow-x-auto overflow-y-hidden align-middle [&_.katex-display]:my-0 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function MathText({ value, className = "", mathClassName = "" }: { value: string; className?: string; mathClassName?: string }) {
  const colonIndex = value.lastIndexOf(":");
  if (colonIndex > -1) {
    const label = value.slice(0, colonIndex + 1);
    const formula = value.slice(colonIndex + 1).trim();
    if (isFormulaLike(formula)) {
      return (
        <span className={className}>
          {label} <MathExpression value={formula} className={mathClassName} />
        </span>
      );
    }
  }

  if (isFormulaLike(value) && !looksLikeSentence(value)) {
    return <MathExpression value={value} className={`${className} ${mathClassName}`.trim()} />;
  }

  return <span className={className}>{value}</span>;
}

export function isFormulaLike(value: string) {
  return /[=^_]|\\|sqrt|cbrt|pi|theta|alpha|beta|\b(sin|cos|tan|sec|csc|cot|log|ln|lim|sum|integral)\b|[A-Za-z]\s*[+\-*/]\s*[A-Za-z0-9(]/i.test(value);
}

export function normalizeFormulaForKatex(value: string) {
  return value
    .replace(/!=/g, "\\ne")
    .replace(/<=/g, "\\le")
    .replace(/>=/g, "\\ge")
    .replace(/->|=>/g, "\\to")
    .replace(/\bIntegral\b/g, "\\int")
    .replace(/\bintegral\b/g, "\\int")
    .replace(/\bsum\b/g, "\\sum")
    .replace(/\binf\b/g, "\\infty")
    .replace(/\bDelta\b/g, "\\Delta")
    .replace(/\btheta\b/g, "\\theta")
    .replace(/\balpha\b/g, "\\alpha")
    .replace(/\bbeta\b/g, "\\beta")
    .replace(/\bphi\b/g, "\\phi")
    .replace(/\bmu\b/g, "\\mu")
    .replace(/\bsigma\b/g, "\\sigma")
    .replace(/\bpi\b/g, "\\pi")
    .replace(/(?<!\\)\bsin\b/g, "\\sin")
    .replace(/(?<!\\)\bcos\b/g, "\\cos")
    .replace(/(?<!\\)\btan\b/g, "\\tan")
    .replace(/(?<!\\)\bsec\b/g, "\\sec")
    .replace(/(?<!\\)\bcsc\b/g, "\\csc")
    .replace(/(?<!\\)\bcosec\b/g, "\\csc")
    .replace(/(?<!\\)\bcot\b/g, "\\cot")
    .replace(/(?<!\\)\blog\b/g, "\\log")
    .replace(/(?<!\\)\bln\b/g, "\\ln")
    .replace(/([A-Za-z0-9]+)\s*\/\s*(\\(?:sin|cos|tan|sec|csc|cot)\s*[A-Za-z])/g, "\\frac{$1}{$2}")
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

function looksLikeSentence(value: string) {
  const words = value.trim().split(/\s+/);
  return words.length > 5 && !/[=^_]/.test(value);
}
