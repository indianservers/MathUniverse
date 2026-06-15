import type { VisualProof } from "../data/proofTypes";

export type SymbolMeaning = {
  symbol: string;
  meaning: string;
  value?: string | number;
  unit?: string;
};

type SymbolParameter = {
  key: string;
  label: string;
  value?: string | number;
  unit?: string;
};

type BuildSymbolMeaningOptions = {
  proof: VisualProof;
  formulas: string[];
  parameters?: SymbolParameter[];
  extra?: SymbolMeaning[];
};

const excludedFormulaWords = new Set([
  "Area",
  "Circumference",
  "Diameter",
  "Rectangle",
  "Triangle",
  "Parallelogram",
  "Sector",
  "Volume",
  "Line",
  "Proof",
  "Formula",
  "Same",
  "Sum",
  "Use",
  "For",
  "If",
  "Then",
  "and",
  "or",
  "sin",
  "cos",
  "tan",
  "sec",
  "csc",
  "cot",
  "log",
  "lim",
  "min",
  "max",
  "pi",
]);

const commonMeanings: Record<string, string> = {
  A: "area, angle, or named point A depending on the diagram",
  B: "angle or named point B depending on the diagram",
  C: "circumference, angle, or named point C depending on the diagram",
  D: "named point D or a fourth measured quantity",
  a: "first named length, side, term, or value",
  b: "base or second named length, side, term, or value",
  c: "third named length, side, or constant",
  d: "fourth named length, distance, or constant",
  h: "height or vertical distance",
  r: "radius",
  R: "larger radius or region label",
  n: "number of terms, sides, sectors, or objects",
  k: "index, scale factor, or selected position",
  m: "slope, ratio part, or multiplier",
  x: "input variable or horizontal coordinate",
  y: "output variable or vertical coordinate",
  x1: "x-coordinate of the first point",
  y1: "y-coordinate of the first point",
  x2: "x-coordinate of the second point",
  y2: "y-coordinate of the second point",
  x3: "x-coordinate of the third point",
  y3: "y-coordinate of the third point",
  dx: "horizontal change or translation",
  dy: "vertical change or translation",
  f: "function being graphed or transformed",
  u: "inside function or first changing factor",
  v: "second changing factor",
  du: "small change in u",
  dv: "small change in v",
  θ: "angle theta",
  theta: "angle theta",
  α: "angle alpha",
  alpha: "angle alpha",
  β: "angle beta",
  beta: "angle beta",
  π: "pi, the circle constant",
  pi: "pi, the circle constant",
  S: "sum",
  T: "triangular number or total",
};

export function buildSymbolMeanings({ proof, formulas, parameters = [], extra = [] }: BuildSymbolMeaningOptions): SymbolMeaning[] {
  const meanings = new Map<string, SymbolMeaning>();

  function add(item: SymbolMeaning) {
    const symbol = normalizeSymbol(item.symbol);
    if (!symbol || symbol.length > 4 || meanings.has(symbol)) return;
    meanings.set(symbol, { ...item, symbol });
  }

  for (const parameter of parameters) {
    const value = parameter.value ?? undefined;
    add({ symbol: parameter.key, meaning: parameter.label, value, unit: parameter.unit });
    for (const symbol of symbolsFromLabel(parameter.label)) {
      add({ symbol, meaning: parameter.label, value, unit: parameter.unit });
    }
  }

  for (const formula of formulas) {
    for (const symbol of symbolsFromFormula(formula)) {
      add({
        symbol,
        meaning: commonMeanings[normalizeSymbol(symbol)] ?? contextMeaning(symbol, proof),
      });
    }
  }

  for (const item of extra) add(item);

  return Array.from(meanings.values()).slice(0, 14);
}

export default function SymbolLegendPanel({ meanings }: { meanings: SymbolMeaning[] }) {
  if (!meanings.length) return null;

  return (
    <section className="rounded-xl border border-amber-200/80 bg-amber-50/85 p-4 shadow-sm dark:border-amber-300/20 dark:bg-amber-300/10" aria-label="Symbol meanings">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-base font-black text-slate-950 dark:text-white">What the symbols mean</h2>
          <p className="mt-1 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">Use this key while reading the diagram and formula.</p>
        </div>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {meanings.map((item) => (
          <div key={`${item.symbol}-${item.meaning}`} className="rounded-lg border border-white/80 bg-white/85 px-3 py-2 shadow-sm dark:border-white/10 dark:bg-slate-950/40">
            <div className="flex items-start gap-2">
              <span className="min-w-9 rounded-lg bg-slate-950 px-2 py-1 text-center font-mono text-sm font-black text-amber-100 dark:bg-black/60">
                {item.symbol}
              </span>
              <span className="text-sm font-bold leading-5 text-slate-700 dark:text-slate-200">
                {humanizeMeaning(item.meaning)}
                {item.value !== undefined && (
                  <span className="ml-1 text-cyan-700 dark:text-cyan-200">
                    = {item.value}{item.unit ? ` ${item.unit}` : ""}
                  </span>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function symbolsFromLabel(label: string) {
  const matches = label.match(/\b(?:x|y|x1|y1|x2|y2|x3|y3|dx|dy|du|dv|theta|alpha|beta|[a-zA-Z])\b/g) ?? [];
  return matches.map(normalizeSymbol);
}

function symbolsFromFormula(formula: string) {
  const normalized = formula
    .replace(/\\theta/g, "theta")
    .replace(/theta/g, "θ")
    .replace(/alpha/g, "α")
    .replace(/beta/g, "β")
    .replace(/pi/g, "π");
  const matches = normalized.match(/\b(?:x[123]?|y[123]?|dx|dy|du|dv|[A-Za-z])\b|[θβαπ]/g) ?? [];
  return matches
    .filter((symbol) => !excludedFormulaWords.has(symbol))
    .map(normalizeSymbol);
}

function normalizeSymbol(symbol: string) {
  const trimmed = symbol.trim();
  if (trimmed === "theta") return "θ";
  if (trimmed === "alpha") return "α";
  if (trimmed === "beta") return "β";
  if (trimmed === "pi") return "π";
  return trimmed;
}

function contextMeaning(symbol: string, proof: VisualProof) {
  const lower = `${proof.title} ${proof.shortDescription} ${proof.longDescription}`.toLowerCase();
  if (symbol === "A" && lower.includes("area")) return "area";
  if (symbol === "C" && lower.includes("circumference")) return "circumference";
  if (symbol === "n" && (lower.includes("series") || lower.includes("sequence"))) return "number of terms";
  return commonMeanings[symbol] ?? "named quantity in this proof";
}

function humanizeMeaning(value: string) {
  return value
    .replace(/\bdeg\b/gi, "degrees")
    .replace(/\br\b/g, "radius r")
    .replace(/\bn\b/g, "count n")
    .replace(/\s+/g, " ")
    .trim();
}
