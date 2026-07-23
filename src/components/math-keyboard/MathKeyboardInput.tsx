import { ArrowLeft, ArrowRight, Calculator, ChevronDown, ChevronUp, CornerDownLeft, Delete, Eraser, FunctionSquare, Keyboard, Pi, Sigma, Sparkles, Superscript } from "lucide-react";
import { ReactNode, useId, useMemo, useRef, useState } from "react";

type KeyboardMode = "calculate" | "command" | "formula";
type KeyGroup = "numbers" | "functions" | "algebra" | "calculus" | "symbols" | "commands";
type MathKey = {
  label: string;
  insert: string;
  title?: string;
  caretOffset?: number;
  accent?: "operator" | "function" | "structure" | "constant" | "command";
};

type MathKeyboardInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  onClear?: () => void;
  onBackspace?: () => void;
  label?: string;
  placeholder?: string;
  mode?: KeyboardMode;
  rows?: number;
  examples?: string[];
  onExample?: (value: string) => void;
  extraActions?: ReactNode;
  defaultCompact?: boolean;
};

const groupLabels: Record<KeyGroup, string> = {
  numbers: "123",
  functions: "Functions",
  algebra: "Algebra",
  calculus: "Calculus",
  symbols: "Symbols",
  commands: "Commands",
};

const keys: Record<KeyGroup, MathKey[]> = {
  numbers: [
    ...["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "%", "+"].map((item) => ({ label: item === "*" ? "x" : item, insert: item, accent: ["+", "-", "*", "/"].includes(item) ? "operator" as const : undefined })),
    { label: "=", insert: "=", accent: "operator" },
    { label: ",", insert: "," },
    { label: "(", insert: "(", accent: "structure" },
    { label: ")", insert: ")", accent: "structure" },
  ],
  functions: [
    { label: "sin", insert: "sin()", caretOffset: -1, accent: "function" },
    { label: "cos", insert: "cos()", caretOffset: -1, accent: "function" },
    { label: "tan", insert: "tan()", caretOffset: -1, accent: "function" },
    { label: "asin", insert: "asin()", caretOffset: -1, accent: "function" },
    { label: "acos", insert: "acos()", caretOffset: -1, accent: "function" },
    { label: "atan", insert: "atan()", caretOffset: -1, accent: "function" },
    { label: "ln", insert: "ln()", caretOffset: -1, accent: "function" },
    { label: "log", insert: "log()", caretOffset: -1, accent: "function" },
    { label: "sqrt", insert: "sqrt()", caretOffset: -1, accent: "function" },
    { label: "cbrt", insert: "cbrt()", caretOffset: -1, accent: "function" },
    { label: "|x|", insert: "abs()", caretOffset: -1, accent: "function" },
    { label: "n!", insert: "factorial()", caretOffset: -1, accent: "function" },
    { label: "pi", insert: "pi", accent: "constant" },
    { label: "e", insert: "e", accent: "constant" },
    { label: "exp", insert: "exp()", caretOffset: -1, accent: "function" },
    { label: "10^x", insert: "10^()", caretOffset: -1, accent: "function" },
  ],
  algebra: [
    { label: "x", insert: "x", accent: "constant" },
    { label: "y", insert: "y", accent: "constant" },
    { label: "a", insert: "a" },
    { label: "b", insert: "b" },
    { label: "c", insert: "c" },
    { label: "x^2", insert: "^2", accent: "operator" },
    { label: "x^3", insert: "^3", accent: "operator" },
    { label: "x^y", insert: "^()", caretOffset: -1, accent: "operator" },
    { label: "1/x", insert: "1/()", caretOffset: -1, accent: "structure" },
    { label: "a/b", insert: "()/()", caretOffset: -4, accent: "structure" },
    { label: "solve", insert: "solve ", accent: "command" },
    { label: "factor", insert: "factor ", accent: "command" },
    { label: "expand", insert: "expand ", accent: "command" },
    { label: "simplify", insert: "simplify ", accent: "command" },
    { label: "roots", insert: "roots ", accent: "command" },
    { label: "intersect", insert: "intersect  and ", caretOffset: -5, accent: "command" },
  ],
  calculus: [
    { label: "d/dx", insert: "derivative ", accent: "command" },
    { label: "integral", insert: "integral ", accent: "command" },
    { label: "limit", insert: "limit ", accent: "command" },
    { label: "table", insert: "table ", accent: "command" },
    { label: "plot", insert: "plot ", accent: "command" },
    { label: "extrema", insert: "extrema ", accent: "command" },
    { label: "sum", insert: "sum()", caretOffset: -1, accent: "function" },
    { label: "prod", insert: "product()", caretOffset: -1, accent: "function" },
    { label: "f(x)", insert: "f(x)", accent: "structure" },
    { label: "->", insert: "->", accent: "operator" },
    { label: "dx", insert: " dx" },
    { label: "dy/dx", insert: "dy/dx" },
  ],
  symbols: [
    { label: "theta", insert: "theta", accent: "constant" },
    { label: "alpha", insert: "alpha", accent: "constant" },
    { label: "beta", insert: "beta", accent: "constant" },
    { label: "Delta", insert: "Delta", accent: "constant" },
    { label: "<", insert: "<", accent: "operator" },
    { label: ">", insert: ">", accent: "operator" },
    { label: "<=", insert: "<=", accent: "operator" },
    { label: ">=", insert: ">=", accent: "operator" },
    { label: "!=", insert: "!=", accent: "operator" },
    { label: "[ ]", insert: "[]", caretOffset: -1, accent: "structure" },
    { label: "{ }", insert: "{}", caretOffset: -1, accent: "structure" },
    { label: "matrix", insert: "matrix([[,],[,]])", caretOffset: -8, accent: "structure" },
  ],
  commands: [
    { label: "plot y", insert: "plot ", accent: "command" },
    { label: "solve =0", insert: "solve =0", caretOffset: -2, accent: "command" },
    { label: "table", insert: "table ", accent: "command" },
    { label: "roots", insert: "roots ", accent: "command" },
    { label: "derivative", insert: "derivative ", accent: "command" },
    { label: "integral", insert: "integral ", accent: "command" },
    { label: "area circle", insert: "area circle radius ", accent: "command" },
    { label: "intersect", insert: "intersect  and ", caretOffset: -5, accent: "command" },
  ],
};

const modeGroups: Record<KeyboardMode, KeyGroup[]> = {
  calculate: ["numbers", "functions", "algebra", "calculus", "symbols"],
  command: ["commands", "numbers", "functions", "algebra", "calculus", "symbols"],
  formula: ["symbols", "algebra", "functions", "calculus", "numbers"],
};

export default function MathKeyboardInput({
  value,
  onChange,
  onSubmit,
  onClear,
  onBackspace,
  label = "Math input",
  placeholder = "Type or build an expression...",
  mode = "calculate",
  rows = 2,
  examples = [],
  onExample,
  extraActions,
  defaultCompact = false,
}: MathKeyboardInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputId = useId();
  const groups = useMemo(() => modeGroups[mode], [mode]);
  const [activeGroup, setActiveGroup] = useState<KeyGroup>(groups[0]);
  const [compact, setCompact] = useState(defaultCompact);

  const setCaret = (position: number) => {
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(position, position);
    });
  };

  const insertToken = (key: MathKey) => {
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart ?? value.length;
    const end = textarea?.selectionEnd ?? value.length;
    const next = `${value.slice(0, start)}${key.insert}${value.slice(end)}`;
    onChange(next);
    setCaret(start + key.insert.length + (key.caretOffset ?? 0));
  };

  const moveCaret = (direction: -1 | 1) => {
    const textarea = textareaRef.current;
    const position = textarea?.selectionStart ?? value.length;
    setCaret(Math.max(0, Math.min(value.length, position + direction)));
  };

  const deleteLeft = () => {
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart ?? value.length;
    const end = textarea?.selectionEnd ?? value.length;
    if (start !== end) {
      onChange(`${value.slice(0, start)}${value.slice(end)}`);
      setCaret(start);
      return;
    }
    if (start <= 0) return;
    onChange(`${value.slice(0, start - 1)}${value.slice(start)}`);
    setCaret(start - 1);
  };

  const clearValue = () => {
    onChange("");
    onClear?.();
    setCaret(0);
  };

  return (
    <div className="sticky bottom-20 z-30 max-h-[78vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-950/95 md:static md:max-h-none md:overflow-hidden md:dark:bg-slate-950/70">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-3 dark:border-white/10 md:flex-row md:items-center md:justify-between">
        <label htmlFor={inputId} className="flex min-w-0 flex-1 items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
          <Keyboard className="h-4 w-4 text-cyan-500" />
          {label}
        </label>
        <div className="mobile-safe-scroll flex gap-2 pb-1 md:flex-wrap md:overflow-visible md:pb-0">
          {extraActions}
          <button type="button" onClick={() => setCompact((value) => !value)} className="math-tool-button tooltip-icon" title={compact ? "Expand keyboard" : "Compact keyboard"} aria-label={compact ? "Expand keyboard" : "Compact keyboard"} data-tooltip={compact ? "Expand keyboard" : "Compact keyboard"}>
            {compact ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          <button type="button" onClick={() => moveCaret(-1)} className="math-tool-button tooltip-icon" title="Move cursor left" aria-label="Move cursor left" data-tooltip="Move cursor left"><ArrowLeft className="h-4 w-4" /></button>
          <button type="button" onClick={() => moveCaret(1)} className="math-tool-button tooltip-icon" title="Move cursor right" aria-label="Move cursor right" data-tooltip="Move cursor right"><ArrowRight className="h-4 w-4" /></button>
          <button type="button" onClick={onBackspace ?? deleteLeft} className="math-tool-button tooltip-icon" title="Backspace" aria-label="Backspace" data-tooltip="Backspace"><Delete className="h-4 w-4" /></button>
          <button type="button" onClick={clearValue} className="math-tool-button-danger tooltip-icon" title="Clear" aria-label="Clear" data-tooltip="Clear input"><Eraser className="h-4 w-4" /></button>
          {onSubmit && <button type="button" onClick={onSubmit} className="action-primary py-2" title="Run calculation (Ctrl/Cmd+Enter)"><CornerDownLeft className="h-4 w-4" />Run</button>}
        </div>
      </div>

      <div className="p-3">
        <textarea
          id={inputId}
          aria-label={label}
          ref={textareaRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
              event.preventDefault();
              onSubmit?.();
            }
          }}
          rows={rows}
          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-base leading-7 text-slate-950 dark:border-white/10 dark:bg-slate-900 dark:text-white"
          placeholder={placeholder}
          spellCheck={false}
        />

        {!compact && (
          <>
            <div className="mobile-safe-scroll mt-3 flex gap-2 pb-1">
              {groups.map((group) => (
                <button key={group} type="button" onClick={() => setActiveGroup(group)} className={`shrink-0 rounded-full px-3 py-2 text-xs font-bold transition ${activeGroup === group ? "bg-cyan-500 text-white shadow" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/15"}`}>
                  {groupIcon(group)}
                  <span className="ml-1.5">{groupLabels[group]}</span>
                </button>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
              {keys[activeGroup].map((key) => (
                <button
                  key={`${activeGroup}-${key.label}-${key.insert}`}
                  type="button"
                  title={key.title ?? key.insert}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => insertToken(key)}
                  className={`min-h-12 rounded-xl px-2 text-sm font-bold shadow-sm transition hover:-translate-y-0.5 active:translate-y-0 ${keyClass(key.accent)}`}
                >
                  {key.label}
                </button>
              ))}
            </div>
          </>
        )}

        {examples.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {examples.map((example) => (
              <button key={example} type="button" onClick={() => (onExample ?? onChange)(example)} className="mini-chip transition hover:bg-cyan-100 dark:hover:bg-cyan-300/15">
                {example}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function groupIcon(group: KeyGroup) {
  const className = "inline h-3.5 w-3.5";
  if (group === "numbers") return <Calculator className={className} />;
  if (group === "functions") return <FunctionSquare className={className} />;
  if (group === "algebra") return <Superscript className={className} />;
  if (group === "calculus") return <Sigma className={className} />;
  if (group === "symbols") return <Pi className={className} />;
  return <Sparkles className={className} />;
}

function keyClass(accent: MathKey["accent"]) {
  if (accent === "operator") return "bg-slate-950 text-white hover:bg-cyan-600 dark:bg-white dark:text-slate-950 dark:hover:bg-cyan-200";
  if (accent === "function") return "bg-indigo-50 text-indigo-800 hover:bg-indigo-100 dark:bg-indigo-400/15 dark:text-indigo-100 dark:hover:bg-indigo-400/25";
  if (accent === "structure") return "bg-amber-50 text-amber-800 hover:bg-amber-100 dark:bg-amber-400/15 dark:text-amber-100 dark:hover:bg-amber-400/25";
  if (accent === "constant") return "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-400/15 dark:text-emerald-100 dark:hover:bg-emerald-400/25";
  if (accent === "command") return "bg-cyan-50 text-cyan-800 hover:bg-cyan-100 dark:bg-cyan-400/15 dark:text-cyan-100 dark:hover:bg-cyan-400/25";
  return "bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/15";
}
