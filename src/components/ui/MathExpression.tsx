import katex from "katex";
import { Fragment, useMemo } from "react";

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
      tabIndex={0}
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

export function InlineMathText({ value, className = "", mathClassName = "" }: { value: string; className?: string; mathClassName?: string }) {
  return (
    <span className={className}>
      {parseInlineMathText(value).map((part, index) => {
        const key = `${part.type}-${index}-${part.value}`;
        if (part.type === "math") return <MathExpression key={key} value={part.value} className={mathClassName} />;
        if (part.type === "bold") return <strong key={key}>{renderInlineMathChildren(part.value, mathClassName)}</strong>;
        return <Fragment key={key}>{part.value}</Fragment>;
      })}
    </span>
  );
}

export function isFormulaLike(value: string) {
  if (!/[A-Za-z0-9\\]/.test(value) || /^[=<>+\-*/^_.,;:!?]+$/.test(value)) return false;
  return /[=^_<>]|\\|sqrt\(|cbrt\(|\b(?:pi|theta|alpha|beta|gamma|delta|lambda|mu|sigma|phi)\b|\b(?:sin|cos|tan|sec|csc|cot|cosec|log|ln|lim)\b\s*[(^A-Za-z0-9]|[A-Za-z0-9)\]}]\s*[+*/]\s*[A-Za-z0-9([{]/i.test(value);
}

export function normalizeFormulaForKatex(value: string) {
  return value
    .replace(/!=/g, "\\ne")
    .replace(/<=/g, "\\le")
    .replace(/>=/g, "\\ge")
    .replace(/->|=>/g, "\\to ")
    .replace(/\bIntegral\b/g, "\\int")
    .replace(/\bintegral\b/g, "\\int")
    .replace(/\bsum\b/g, "\\sum")
    .replace(/\binf\b/g, "\\infty")
    .replace(/\bDelta\b/g, "\\Delta")
    .replace(/(?<!\\)\btheta\b/g, "\\theta")
    .replace(/(?<!\\)\balpha\b/g, "\\alpha")
    .replace(/(?<!\\)\bbeta\b/g, "\\beta")
    .replace(/(?<!\\)\bphi\b/g, "\\phi")
    .replace(/(?<!\\)\bmu\b/g, "\\mu")
    .replace(/(?<!\\)\bsigma\b/g, "\\sigma")
    .replace(/(?<!\\)\bpi\b/g, "\\pi")
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

type InlineMathPart = {
  type: "text" | "math" | "bold";
  value: string;
};

function renderInlineMathChildren(value: string, mathClassName: string) {
  return parseInlineFormulaFragments(value).map((part, index) => {
    const key = `${part.type}-${index}-${part.value}`;
    return part.type === "math" ? <MathExpression key={key} value={part.value} className={mathClassName} /> : <Fragment key={key}>{part.value}</Fragment>;
  });
}

function parseInlineMathText(value: string): InlineMathPart[] {
  const markdownParts: InlineMathPart[] = [];
  const boldPattern = /\*\*([^*]+)\*\*/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = boldPattern.exec(value))) {
    if (match.index > cursor) markdownParts.push(...parseInlineFormulaFragments(value.slice(cursor, match.index)));
    markdownParts.push({ type: "bold", value: match[1] });
    cursor = match.index + match[0].length;
  }

  if (cursor < value.length) markdownParts.push(...parseInlineFormulaFragments(value.slice(cursor)));
  return markdownParts;
}

function parseInlineFormulaFragments(value: string): InlineMathPart[] {
  const parts: InlineMathPart[] = [];
  const tokens = value.split(/(\s+)/);

  for (const token of tokens) {
    if (!token || /^\s+$/.test(token)) {
      appendTextPart(parts, token);
      continue;
    }

    const leading = token.match(/^[([{]+/)?.[0] ?? "";
    const withoutLeading = token.slice(leading.length);
    const trailingPunctuation = withoutLeading.match(/[.,;:!?]+$/)?.[0] ?? "";
    let candidate = withoutLeading.slice(0, withoutLeading.length - trailingPunctuation.length);
    let trailing = trailingPunctuation;

    while (candidate && hasMoreClosersThanOpeners(candidate)) {
      trailing = candidate[candidate.length - 1] + trailing;
      candidate = candidate.slice(0, -1);
    }

    if (candidate && isFormulaLike(candidate) && !looksLikePlainEnglish(candidate)) {
      appendTextPart(parts, leading);
      parts.push({ type: "math", value: candidate });
      appendTextPart(parts, trailing);
    } else {
      appendTextPart(parts, token);
    }
  }

  return parts.length ? parts : [{ type: "text", value }];
}

function appendTextPart(parts: InlineMathPart[], value: string) {
  if (!value) return;
  const previous = parts[parts.length - 1];
  if (previous?.type === "text") {
    previous.value += value;
  } else {
    parts.push({ type: "text", value });
  }
}

function looksLikePlainEnglish(value: string) {
  return /\s/.test(value) && !/[=^_<>]|\\|[+\-*/]\s*[A-Za-z0-9(]/.test(value);
}

function hasMoreClosersThanOpeners(value: string) {
  const pairs = [
    ["(", ")"],
    ["[", "]"],
    ["{", "}"],
  ] as const;

  return pairs.some(([open, close]) => countCharacter(value, close) > countCharacter(value, open));
}

function countCharacter(value: string, character: string) {
  return Array.from(value).filter((item) => item === character).length;
}
