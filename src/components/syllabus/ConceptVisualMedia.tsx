import {
  Binary,
  Calculator,
  ChartBar,
  Compass,
  Grid3X3,
  Hash,
  Network,
  RadioTower,
  Sigma,
  type LucideIcon,
} from "lucide-react";

type ConceptFamily =
  | "numbers"
  | "algebra-calculus"
  | "geometry"
  | "data-probability"
  | "linear-vector"
  | "signals-pde"
  | "networks-optimization"
  | "complex-discrete";

type ConceptArt = {
  image: string;
  label: string;
  accent: string;
};

const conceptArtByFamily: Record<ConceptFamily, ConceptArt> = {
  numbers: {
    image: "/concept-art/numbers.png",
    label: "Number sense",
    accent: "from-emerald-400 to-cyan-300",
  },
  "algebra-calculus": {
    image: "/concept-art/algebra-calculus.png",
    label: "Algebra and calculus",
    accent: "from-cyan-300 to-violet-300",
  },
  geometry: {
    image: "/concept-art/geometry.png",
    label: "Geometry",
    accent: "from-amber-300 to-rose-300",
  },
  "data-probability": {
    image: "/concept-art/data-probability.png",
    label: "Data and probability",
    accent: "from-sky-300 to-emerald-300",
  },
  "linear-vector": {
    image: "/concept-art/linear-vector.png",
    label: "Linear algebra",
    accent: "from-indigo-300 to-cyan-300",
  },
  "signals-pde": {
    image: "/concept-art/signals-pde.png",
    label: "Engineering transforms",
    accent: "from-fuchsia-300 to-orange-300",
  },
  "networks-optimization": {
    image: "/concept-art/networks-optimization.png",
    label: "Networks and optimization",
    accent: "from-lime-300 to-sky-300",
  },
  "complex-discrete": {
    image: "/concept-art/complex-discrete.png",
    label: "Discrete and complex",
    accent: "from-violet-300 to-rose-300",
  },
};

const iconByFamily: Record<ConceptFamily, LucideIcon> = {
  numbers: Hash,
  "algebra-calculus": Sigma,
  geometry: Compass,
  "data-probability": ChartBar,
  "linear-vector": Grid3X3,
  "signals-pde": RadioTower,
  "networks-optimization": Network,
  "complex-discrete": Binary,
};

export function conceptFamilyForText(value: string): ConceptFamily {
  const lower = value.toLowerCase();
  if (/(fourier|laplace|z-transform|signal|wave|heat|pde|ode|control|differential equation|engineering)/.test(lower)) return "signals-pde";
  if (/(graph theory|network|shortest path|optimization|linear programming|operations|queue|game theory|transport|assignment|pert|cpm)/.test(lower)) return "networks-optimization";
  if (/(matrix|matrices|vector|eigen|determinant|rank|span|basis|linear transformation|inner product)/.test(lower)) return "linear-vector";
  if (/(statistics|probability|data|histogram|regression|random|distribution|mean|median|variance|sampling|bayes)/.test(lower)) return "data-probability";
  if (/(geometry|triangle|circle|angle|line segment|polygon|solid|mensuration|area|volume|surface|conic|coordinate|euclid|locus)/.test(lower)) return "geometry";
  if (/(complex|discrete|logic|set|union|intersection|subset|relation|function|combinatorics|permutation|combination|number theory|modular|cryptography|boolean)/.test(lower)) return "complex-discrete";
  if (/(number|integer|fraction|decimal|rational|real|root|percent|ratio|proportion|exponent|logarithm|arithmetic)/.test(lower)) return "numbers";
  return "algebra-calculus";
}

export function conceptArtForText(value: string) {
  return conceptArtByFamily[conceptFamilyForText(value)];
}

export function conceptIconForText(value: string) {
  return iconByFamily[conceptFamilyForText(value)] ?? Calculator;
}

export function ConceptIconBadge({ text, className = "" }: { text: string; className?: string }) {
  const Icon = conceptIconForText(text);
  const art = conceptArtForText(text);
  return (
    <span className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${art.accent} text-slate-950 shadow-sm ${className}`}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
    </span>
  );
}

export function ConceptImagePanel({ title, text, compact = false }: { title: string; text: string; compact?: boolean }) {
  const art = conceptArtForText(`${title} ${text}`);
  const Icon = conceptIconForText(`${title} ${text}`);
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/20 bg-slate-950 shadow-sm ${compact ? "min-h-[138px]" : "min-h-[210px]"}`}>
      <img src={art.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/88 via-slate-950/44 to-slate-950/12" />
      <div className="relative flex min-h-[inherit] flex-col justify-between p-4 text-white">
        <div className="flex items-center justify-between gap-3">
          <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${art.accent} text-slate-950 shadow-lg`}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">{art.label}</span>
        </div>
        <div className="mt-7 max-w-[26rem]">
          <p className="text-lg font-black leading-tight md:text-xl">{title}</p>
          {!compact && <p className="mt-2 text-sm leading-6 text-white/82">{text}</p>}
        </div>
      </div>
    </div>
  );
}

export function FormulaImageStrip({ title, formula }: { title: string; formula: string }) {
  const art = conceptArtForText(`${title} ${formula}`);
  const Icon = conceptIconForText(`${title} ${formula}`);
  return (
    <div className="relative mb-3 overflow-hidden rounded-xl border border-white/30 bg-slate-950 text-white">
      <img src={art.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-72" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/48 to-slate-950/15" />
      <div className="relative flex min-h-24 items-center gap-3 p-3">
        <span className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${art.accent} text-slate-950 shadow-lg`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-bold text-white/72">{art.label}</p>
          <p className="mt-1 truncate text-base font-black">{title}</p>
        </div>
      </div>
    </div>
  );
}
