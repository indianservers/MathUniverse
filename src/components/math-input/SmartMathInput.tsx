import { useMemo, type KeyboardEvent, type ReactNode } from "react";
import { commandRegistrySummary, resolveCommandSpec, workspaceCommandCatalog, type CommandGroup } from "../../workspace/commandRegistry";

export type SmartMathInputMode = "math" | "workspace";

type SmartTokenKind =
  | "command"
  | "keyword"
  | "number"
  | "operator"
  | "relation"
  | "set"
  | "power"
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
  showTokenPreview?: boolean;
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
const setWords = new Set(["set", "sets", "union", "intersection", "intersect", "empty", "emptyset", "complement", "subset", "subsets", "superset", "supersets", "proper", "element", "belongs", "in"]);
const relationWords = new Set(["subset", "superset", "subseteq", "superseteq", "notsubset", "notsuperset", "in", "notin"]);

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
  showTokenPreview = !compact,
  toolbar,
  value,
}: SmartMathInputProps) {
  const tokens = useMemo(() => tokenizeSmartMathInput(value, mode), [mode, value]);
  const insight = useMemo(() => analyzeSmartMathInput(value, mode), [mode, value]);
  const minHeight = compact ? "min-h-12" : "min-h-[7rem]";
  const textSize = compact ? "text-sm leading-6" : "text-xl leading-8";
  const padding = compact ? "px-3 py-2.5" : "p-4 sm:p-5";

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (onSubmit && event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  }

  return (
    <div className={className}>
      {toolbar}
      <div className={`relative rounded-3xl border border-cyan-100 bg-white shadow-[0_18px_45px_rgba(14,165,233,0.14)] ring-1 ring-cyan-200/70 transition focus-within:border-cyan-300 focus-within:shadow-[0_22px_55px_rgba(14,165,233,0.22)] focus-within:ring-4 focus-within:ring-cyan-200/70 dark:border-cyan-300/30 dark:bg-slate-50 dark:ring-cyan-300/30`}>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
        <textarea
          aria-label={ariaLabel}
          className={`block ${minHeight} w-full resize-y rounded-3xl bg-white ${padding} font-mono ${textSize} font-black text-slate-950 caret-cyan-700 outline-none placeholder:text-slate-400 selection:bg-cyan-200/70 dark:bg-slate-50 dark:text-slate-950`}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={rows}
          spellCheck={false}
          value={value}
        />
        {showTokenPreview ? (
          <div className="border-t border-cyan-100 bg-cyan-50/55 px-4 py-3 dark:border-cyan-300/20 dark:bg-cyan-100/50">
            <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-cyan-800">Readable math preview</p>
              <p className="text-[11px] font-bold text-slate-500">Typing stays plain; preview adds color.</p>
            </div>
            <pre aria-hidden="true" className="max-h-28 overflow-auto whitespace-pre-wrap break-words rounded-2xl bg-white px-3 py-2 font-mono text-base font-black leading-7 text-slate-900 shadow-inner thin-scrollbar">
              {tokens.length ? tokens.map((token, index) => <SmartTokenSpan key={`${token.text}-${index}`} token={token} />) : <span className="text-slate-400">{placeholder}</span>}
            </pre>
          </div>
        ) : null}
      </div>
      {showInsights && <SmartInputInsights insight={insight} />}
      {showLegend && <SmartInputLegend mode={mode} />}
    </div>
  );
}

export function tokenizeSmartMathInput(value: string, mode: SmartMathInputMode = "math"): SmartToken[] {
  const tokens: SmartToken[] = [];
  const matcher = /\s+|#[0-9a-f]{3,8}|(?:[a-zA-Z][a-zA-Z0-9_.]*|\d+(?:\.\d+)?|\([^)]{1,24}\))\^-?\d+|[-+]?\d*\.?\d+(?:e[-+]?\d+)?|[a-zA-Z_][a-zA-Z0-9_.]*|->|<=|>=|!=|==|⊆|⊇|⊂|⊃|∈|∉|∪|∩|∅|≤|≥|≠|×|÷|[+\-*/^%=<>:(),;[\]{}]|./gi;
  for (const match of value.matchAll(matcher)) {
    const text = match[0];
    const lower = text.toLowerCase();
    const group = groupByCommand.get(lower);
    if (/^\s+$/.test(text)) tokens.push({ text, kind: "space" });
    else if (/^(?:[a-zA-Z][a-zA-Z0-9_.]*|\d+(?:\.\d+)?|\([^)]{1,24}\))\^-?\d+$/.test(text)) tokens.push({ text, kind: "power" });
    else if (/^#[0-9a-f]{3,8}$/i.test(text) || /^[-+]?\d*\.?\d+(?:e[-+]?\d+)?$/i.test(text)) tokens.push({ text, kind: "number" });
    else if (/^(<=|>=|!=|==|<|>|=|⊆|⊇|⊂|⊃|∈|∉|≤|≥|≠)$/.test(text) || relationWords.has(lower)) tokens.push({ text, kind: "relation" });
    else if (/^(∪|∩|∅)$/.test(text) || setWords.has(lower)) tokens.push({ text, kind: "set" });
    else if (/^(->|[+\-*/^%:×÷])$/.test(text)) tokens.push({ text, kind: "operator" });
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
  if (/\b(subset|superset|subseteq|superseteq)\b|[⊂⊃⊆⊇]/i.test(trimmed)) hints.push("Set relation recognized");
  if (/\^[-+]?\d+/.test(trimmed)) hints.push("Power notation recognized");

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
    command: "rounded-md bg-cyan-50 px-0.5 text-cyan-700",
    keyword: "rounded-md bg-blue-50 px-0.5 text-blue-700",
    number: "rounded-md bg-amber-50 px-0.5 text-amber-700",
    operator: "rounded-md bg-rose-50 px-0.5 text-rose-700",
    relation: "rounded-md bg-pink-50 px-0.5 text-pink-700",
    set: "rounded-md bg-teal-50 px-0.5 text-teal-700",
    power: "rounded-md bg-emerald-50 px-0.5 text-emerald-700",
    function: "rounded-md bg-violet-50 px-0.5 text-violet-700",
    variable: "rounded-md bg-emerald-50 px-0.5 text-emerald-700",
    constant: "rounded-md bg-orange-50 px-0.5 text-orange-700",
    geometry: "rounded-md bg-sky-50 px-0.5 text-sky-700",
    matrix: "rounded-md bg-fuchsia-50 px-0.5 text-fuchsia-700",
    punctuation: "text-slate-500",
    space: "text-slate-900",
    text: "text-slate-900",
  };
  return <span className={className[token.kind]}>{formatTokenText(token)}</span>;
}

function formatTokenText(token: SmartToken) {
  if (token.kind === "relation") return relationDisplay(token.text);
  if (token.kind === "set") return setDisplay(token.text);
  if (token.kind === "operator") return operatorDisplay(token.text);
  if (token.kind !== "power") return token.text;
  const match = token.text.match(/^(.*)\^(-?\d+)$/);
  if (!match) return token.text;
  return (
    <>
      {match[1]}
      <sup>{toSuperscript(match[2])}</sup>
    </>
  );
}

function operatorDisplay(text: string) {
  if (text === "*") return "×";
  if (text === "/") return "÷";
  return text;
}

function relationDisplay(text: string) {
  const lower = text.toLowerCase();
  const map: Record<string, string> = {
    "<=": "≤",
    ">=": "≥",
    "!=": "≠",
    subset: "⊂",
    superset: "⊃",
    subseteq: "⊆",
    superseteq: "⊇",
    notsubset: "⊄",
    notsuperset: "⊅",
    in: "∈",
    notin: "∉",
  };
  return map[lower] ?? map[text] ?? text;
}

function setDisplay(text: string) {
  const lower = text.toLowerCase();
  const map: Record<string, string> = {
    union: "∪",
    intersection: "∩",
    intersect: "∩",
    empty: "∅",
    emptyset: "∅",
  };
  return map[lower] ?? text;
}

function toSuperscript(value: string) {
  const map: Record<string, string> = { "-": "⁻", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };
  return [...value].map((char) => map[char] ?? char).join("");
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
      <LegendDot className="bg-pink-300" label="Relations" />
      <LegendDot className="bg-violet-300" label="Functions" />
      <LegendDot className="bg-emerald-300" label="Variables" />
      <LegendDot className="bg-teal-300" label="Sets" />
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
