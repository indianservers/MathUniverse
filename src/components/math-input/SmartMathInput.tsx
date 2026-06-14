import { useMemo, type KeyboardEvent, type ReactNode } from "react";
import { commandRegistrySummary, resolveCommandSpec, workspaceCommandCatalog, type CommandGroup } from "../../workspace/commandRegistry";

export type SmartMathInputMode = "math" | "workspace";

type SmartTokenKind =
  | "command"
  | "keyword"
  | "number"
  | "operator"
  | "function"
  | "variable"
  | "constant"
  | "geometry"
  | "matrix"
  | "punctuation"
  | "space"
  | "text";

type SmartToken = { text: string; kind: SmartTokenKind };

type SmartInputInsight = {
  group: CommandGroup | "Math" | "Input";
  label: string;
  tone: "ok" | "warn" | "idle";
  hints: string[];
};

type SmartMathInputProps = {
  ariaLabel: string;
  className?: string;
  compact?: boolean;
  mode?: SmartMathInputMode;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  rows?: number;
  showInsights?: boolean;
  showLegend?: boolean;
  toolbar?: ReactNode;
  value: string;
};

const commandNames = new Set(workspaceCommandCatalog.flatMap((spec) => [spec.name, ...spec.aliases]).map((item) => item.toLowerCase()));
const groupByCommand = new Map(workspaceCommandCatalog.flatMap((spec) => [spec.name, ...spec.aliases].map((item) => [item.toLowerCase(), spec.group] as const)));

const mathKeywords = new Set([
  "add", "average", "averagea", "count", "counta", "countblank", "covariance", "divide", "divided", "distribution", "expand", "factor",
  "factorial", "forecast", "gcd", "hcf", "integrate", "intercept", "lcm", "limit", "max", "maximum", "mean", "median", "min", "minimum",
  "mod", "mode", "mul", "multiplication", "multiply", "percent", "percentage", "power", "product", "quartile", "quotient", "rank",
  "reciprocal", "regression", "remainder", "simplify", "slope", "solve", "stdev", "subtract", "sum", "times", "var", "variance",
]);

const mathFunctions = new Set([
  "abs", "acos", "acosh", "asin", "asinh", "atan", "atan2", "atanh", "avedev", "binom.dist", "ceiling", "ceiling.math",
  "ceiling.precise", "combin", "combina", "correl", "cos", "cosh", "cot", "coth", "covariance.p", "covariance.s", "csc", "csch",
  "degrees", "det", "devsq", "even", "exp", "expon.dist", "fact", "factdouble", "floor", "floor.math", "floor.precise",
  "forecast.linear", "geomean", "harmean", "int", "iso.ceiling", "kurt", "large", "ln", "log", "log10", "log2", "lognorm.dist",
  "maxa", "mina", "mode.mult", "mode.sngl", "mround", "multinomial", "norm.dist", "norm.s.dist", "odd", "pearson",
  "percentile", "percentile.exc", "percentile.inc", "percentrank.inc", "permut", "permutationa", "poisson.dist", "product",
  "quartile.exc", "quartile.inc", "radians", "rand", "randbetween", "rank.avg", "rank.eq", "round", "rounddown", "roundup",
  "rsq", "sec", "sech", "sign", "sin", "sinh", "skew", "small", "sqrt", "sqrtpi", "standardize", "stdev.p", "stdev.s",
  "stdeva", "stdevpa", "steyx", "sumproduct", "sumsq", "sumx2my2", "sumx2py2", "sumxmy2", "tan", "tanh", "trunc", "var.p",
  "var.s", "vara", "varpa", "weibull.dist",
]);

const workspaceKeywords = new Set([
  "and", "as", "at", "axis", "by", "center", "color", "domain", "end", "for", "from", "height", "hidden", "max",
  "min", "mode", "normal", "object", "off", "on", "opacity", "range", "radius", "radians", "root", "roots",
  "scale", "selected", "start", "step", "to", "trace", "visible", "where", "width", "with",
]);

const geometryWords = new Set(["angle", "arc", "circle", "conic", "cone", "coordinate", "cylinder", "distance", "ellipse", "line", "locus", "parallel", "perpendicular", "plane", "point", "polygon", "ray", "segment", "sphere", "surface", "tangent", "triangle", "vector"]);
const matrixWords = new Set(["column", "det", "determinant", "inverse", "matrix", "rank", "row", "transpose"]);
const constants = new Set(["e", "pi", "tau", "infinity", "inf", "true", "false"]);

export default function SmartMathInput({
  ariaLabel,
  className = "",
  compact = false,
  mode = "math",
  onChange,
  onSubmit,
  placeholder = "Type a math expression",
  rows = compact ? 1 : 4,
  showInsights = true,
  showLegend = true,
  toolbar,
  value,
}: SmartMathInputProps) {
  const tokens = useMemo(() => tokenizeSmartMathInput(value, mode), [mode, value]);
  const insight = useMemo(() => analyzeSmartMathInput(value, mode), [mode, value]);
  const minHeight = compact ? "min-h-12" : "min-h-[7rem]";
  const textSize = compact ? "text-sm leading-6" : "text-lg leading-7";
  const padding = compact ? "px-3 py-2.5" : "p-4";

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (onSubmit && event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  }

  return (
    <div className={className}>
      {toolbar}
      <div className={`relative ${minHeight} overflow-hidden rounded-2xl border border-slate-300 bg-slate-950 shadow-inner ring-1 ring-slate-900/5 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-300/40 dark:border-white/10`}>
        <pre aria-hidden="true" className={`pointer-events-none ${minHeight} whitespace-pre-wrap break-words ${padding} font-mono ${textSize} font-semibold text-slate-100`}>
          {tokens.length ? tokens.map((token, index) => <SmartTokenSpan key={`${token.text}-${index}`} token={token} />) : <span className="text-slate-500">{placeholder}</span>}
        </pre>
        <textarea
          aria-label={ariaLabel}
          className={`absolute inset-0 h-full w-full resize-none bg-transparent ${padding} font-mono ${textSize} font-semibold text-transparent caret-cyan-200 outline-none selection:bg-cyan-300/30`}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={rows}
          spellCheck={false}
          value={value}
        />
      </div>
      {showInsights && <SmartInputInsights insight={insight} />}
      {showLegend && <SmartInputLegend mode={mode} />}
    </div>
  );
}

export function tokenizeSmartMathInput(value: string, mode: SmartMathInputMode = "math"): SmartToken[] {
  const tokens: SmartToken[] = [];
  const matcher = /\s+|#[0-9a-f]{3,8}|[-+]?\d*\.?\d+(?:e[-+]?\d+)?|[a-zA-Z_][a-zA-Z0-9_.]*|->|<=|>=|!=|==|[+\-*/^%=<>:(),;[\]{}]|./gi;
  for (const match of value.matchAll(matcher)) {
    const text = match[0];
    const lower = text.toLowerCase();
    const group = groupByCommand.get(lower);
    if (/^\s+$/.test(text)) tokens.push({ text, kind: "space" });
    else if (/^#[0-9a-f]{3,8}$/i.test(text) || /^[-+]?\d*\.?\d+(?:e[-+]?\d+)?$/i.test(text)) tokens.push({ text, kind: "number" });
    else if (/^(->|<=|>=|!=|==|[+\-*/^%=<>:])$/.test(text)) tokens.push({ text, kind: "operator" });
    else if (/^[(),;[\]{}]$/.test(text)) tokens.push({ text, kind: "punctuation" });
    else if (mode === "workspace" && commandNames.has(lower)) tokens.push({ text, kind: group === "Geometry 2D" || group === "Geometry 3D" ? "geometry" : group === "Matrices" ? "matrix" : "command" });
    else if (mode === "workspace" && geometryWords.has(lower)) tokens.push({ text, kind: "geometry" });
    else if (mode === "workspace" && matrixWords.has(lower)) tokens.push({ text, kind: "matrix" });
    else if (mathFunctions.has(lower)) tokens.push({ text, kind: "function" });
    else if (constants.has(lower)) tokens.push({ text, kind: "constant" });
    else if (mathKeywords.has(lower) || (mode === "workspace" && workspaceKeywords.has(lower))) tokens.push({ text, kind: "keyword" });
    else if (/^[a-zA-Z]$/.test(text)) tokens.push({ text, kind: "variable" });
    else tokens.push({ text, kind: "text" });
  }
  return tokens;
}

export function analyzeSmartMathInput(value: string, mode: SmartMathInputMode = "math"): SmartInputInsight {
  const trimmed = value.trim();
  if (!trimmed) {
    return mode === "workspace"
      ? { group: "Input", label: "ready", tone: "idle", hints: ["Enter runs", `${commandRegistrySummary().implemented} commands ready`] }
      : { group: "Math", label: "ready", tone: "idle", hints: ["Type an expression", "Numbers, operators, functions"] };
  }

  const hints: string[] = [];
  const openRound = (trimmed.match(/\(/g) ?? []).length;
  const closeRound = (trimmed.match(/\)/g) ?? []).length;
  const openSquare = (trimmed.match(/\[/g) ?? []).length;
  const closeSquare = (trimmed.match(/\]/g) ?? []).length;
  if (/[a-z]\d|\d[a-z]/i.test(trimmed) && !/[a-z]\*\d|\d\*[a-z]/i.test(trimmed)) hints.push("Use * for clear multiplication");
  if (openRound !== closeRound || openSquare !== closeSquare) hints.push("Close brackets");

  if (mode === "workspace") {
    const firstWord = trimmed.match(/^([a-zA-Z_][a-zA-Z0-9_]*)/)?.[1] ?? "";
    const spec = firstWord ? resolveCommandSpec(firstWord) : undefined;
    if (spec) {
      hints.unshift(trimmed.slice(firstWord.length).trim() ? spec.description : spec.signature);
      return { group: spec.group, label: spec.name, tone: hints.includes("Close brackets") ? "warn" : "ok", hints: hints.slice(0, 3) };
    }
    if (/=/.test(trimmed)) return { group: "Algebra", label: "equation input", tone: "ok", hints: ["Try solve or plot both sides", ...hints].slice(0, 3) };
    if (/^[\d\s+\-*/^().,]+$/.test(trimmed)) return { group: "Input", label: "calculator", tone: "ok", hints: ["Numeric expression", ...hints].slice(0, 3) };
    return { group: "Input", label: "unrecognized command", tone: "warn", hints: ["Try plot, solve, derivative, point, circle, surface, matrix", ...hints].slice(0, 3) };
  }

  const firstFunction = trimmed.match(/^=?\s*([a-z][a-z0-9.]*)\s*\(/i)?.[1].toLowerCase();
  if (firstFunction && mathFunctions.has(firstFunction)) {
    return { group: "Math", label: firstFunction.toUpperCase(), tone: hints.includes("Close brackets") ? "warn" : "ok", hints: ["Recognized function", ...hints].slice(0, 3) };
  }
  if (/=/.test(trimmed)) return { group: "Math", label: "equation", tone: hints.includes("Close brackets") ? "warn" : "ok", hints: ["Equation input", ...hints].slice(0, 3) };
  return { group: "Math", label: "expression", tone: hints.includes("Close brackets") ? "warn" : "ok", hints: hints.length ? hints : ["Ready to evaluate"] };
}

function SmartTokenSpan({ token }: { token: SmartToken }) {
  const className: Record<SmartTokenKind, string> = {
    command: "text-cyan-300",
    keyword: "text-blue-200",
    number: "text-amber-300",
    operator: "text-rose-300",
    function: "text-violet-300",
    variable: "text-emerald-300",
    constant: "text-orange-300",
    geometry: "text-sky-300",
    matrix: "text-fuchsia-300",
    punctuation: "text-slate-300",
    space: "text-slate-100",
    text: "text-slate-100",
  };
  return <span className={className[token.kind]}>{token.text}</span>;
}

function SmartInputInsights({ insight }: { insight: SmartInputInsight }) {
  const toneClass = insight.tone === "ok"
    ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-100"
    : insight.tone === "warn"
      ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-100"
      : "border-slate-200 bg-slate-50 text-slate-600 dark:border-white/10 dark:bg-white/10 dark:text-slate-300";
  return (
    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-black">
      <span className={`rounded-full border px-2.5 py-1 ${toneClass}`}>{insight.group}: {insight.label}</span>
      {insight.hints.map((hint) => <span key={hint} className="mini-chip bg-white/70 text-slate-600 dark:bg-white/10 dark:text-slate-300">{hint}</span>)}
    </div>
  );
}

function SmartInputLegend({ mode }: { mode: SmartMathInputMode }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2 text-xs font-black">
      {mode === "workspace" && <LegendDot className="bg-cyan-300" label="Commands" />}
      <LegendDot className="bg-blue-300" label="Keywords" />
      <LegendDot className="bg-amber-300" label="Numbers" />
      <LegendDot className="bg-rose-300" label="Operators" />
      <LegendDot className="bg-violet-300" label="Functions" />
      <LegendDot className="bg-emerald-300" label="Variables" />
      {mode === "workspace" && <LegendDot className="bg-sky-300" label="Geometry" />}
      {mode === "workspace" && <LegendDot className="bg-fuchsia-300" label="Matrices" />}
    </div>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
      <span className={`h-2.5 w-2.5 rounded-full ${className}`} />
      {label}
    </span>
  );
}
