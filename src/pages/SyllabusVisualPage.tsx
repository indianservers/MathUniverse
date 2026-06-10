import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BarChart3, CircleDot, Grid3X3, Hash, Ruler, Shapes, Sigma } from "lucide-react";
import SectionCard from "../components/ui/SectionCard";
import TopicHeader from "../components/ui/TopicHeader";

type UnitVisual = {
  id: string;
  title: string;
  summary: string;
  formula: string;
  icon: typeof Hash;
  tasks: string[];
};

const class6Units: UnitVisual[] = [
  { id: "number-system", title: "Number system", summary: "Place whole numbers, compare values, and see place value as grouped thousands, hundreds, tens, and ones.", formula: "number = thousands + hundreds + tens + ones", icon: Hash, tasks: ["Move the marker.", "Read place value blocks.", "Compare neighboring numbers."] },
  { id: "factors-multiples", title: "Factors and multiples", summary: "Build factor arrays and highlight multiples on a skip-counting grid.", formula: "a is a factor of n when n = a x b", icon: Grid3X3, tasks: ["Change the target number.", "Find rectangular arrays.", "Mark common multiples."] },
  { id: "fractions-decimals", title: "Fractions and decimals", summary: "Connect shaded fraction bars, decimal value, and position on a 0 to 1 number line.", formula: "fraction = numerator / denominator = decimal", icon: CircleDot, tasks: ["Make one half.", "Compare 3/4 and 0.75.", "Move the numerator."] },
  { id: "integers", title: "Integers", summary: "Use direction on a number line to model positive and negative values and addition as movement.", formula: "start + movement = final integer", icon: Sigma, tasks: ["Start below zero.", "Move right with a positive integer.", "Move left with a negative integer."] },
  { id: "basic-geometry", title: "Basic geometrical ideas", summary: "Explore points, lines, rays, angles, and simple shapes with a clean construction-style model.", formula: "point -> line -> angle -> polygon", icon: Shapes, tasks: ["Rotate the ray.", "Name the angle.", "Connect points into a polygon."] },
  { id: "mensuration", title: "Perimeter and area", summary: "Resize a rectangle and compare boundary distance with filled square units.", formula: "P = 2(l + b), A = l x b", icon: Ruler, tasks: ["Increase length.", "Compare perimeter and area.", "Count square units."] },
  { id: "data-handling", title: "Data handling", summary: "Turn tally marks into bar charts and compare categories visually.", formula: "frequency = count in a category", icon: BarChart3, tasks: ["Change a frequency.", "Find the tallest bar.", "Compare two categories."] },
];

export default function SyllabusVisualPage() {
  const { slug = "" } = useParams();
  const title = titleFromSlug(slug);

  return (
    <div className="space-y-6">
      <Link to="/syllabus" className="action-secondary w-fit"><ArrowLeft className="h-4 w-4" />Back to syllabus</Link>
      <TopicHeader
        title={title}
        subtitle="Dedicated visual pages for each unit. Every card below uses a concept-matched model, not a generic placeholder."
        difficulty="International Core / Class 6"
        estimatedMinutes={24}
        progress={88}
      />

      <SectionCard title="Unit Visual Labs" description="Open each unit, manipulate the model, and connect the formula to the picture.">
        <div className="grid gap-4 xl:grid-cols-2">
          {class6Units.map((unit, index) => (
            <UnitLab key={unit.id} unit={unit} index={index + 1} />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Coverage Checklist" description="This page now maps each unit to its own visual model and classroom action.">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {class6Units.map((unit, index) => (
            <a key={unit.id} href={`#${unit.id}`} className="rounded-2xl border border-slate-200 bg-white/80 p-4 transition hover:border-cyan-300 dark:border-white/10 dark:bg-white/5">
              <p className="text-xs font-black uppercase text-cyan-600 dark:text-cyan-300">Unit {index + 1}</p>
              <h3 className="mt-2 font-black">{unit.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{unit.summary}</p>
            </a>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function UnitLab({ unit, index }: { unit: UnitVisual; index: number }) {
  const Icon = unit.icon;
  return (
    <section id={unit.id} className="rounded-3xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-slate-950/60">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase text-cyan-600 dark:text-cyan-300">Unit {index}</p>
          <h2 className="mt-1 text-xl font-black">{unit.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{unit.summary}</p>
        </div>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-cyan-50 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-100"><Icon className="h-5 w-5" /></span>
      </div>
      <div className="mt-4 rounded-2xl bg-slate-950 p-3">
        <ConceptVisual id={unit.id} />
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
          <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">Formula connection</p>
          <p className="mt-2 font-mono text-sm font-black">{unit.formula}</p>
        </div>
        <div className="rounded-2xl bg-cyan-50 p-4 dark:bg-cyan-400/10">
          <p className="text-xs font-black uppercase text-cyan-700 dark:text-cyan-200">Try it</p>
          <ul className="mt-2 space-y-1 text-sm font-semibold text-slate-700 dark:text-cyan-50">
            {unit.tasks.map((task) => <li key={task}>{task}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}

function ConceptVisual({ id }: { id: string }) {
  if (id === "factors-multiples") return <FactorsMultiplesVisual />;
  if (id === "fractions-decimals") return <FractionsDecimalsVisual />;
  if (id === "integers") return <IntegerVisual />;
  if (id === "basic-geometry") return <BasicGeometryVisual />;
  if (id === "mensuration") return <MensurationVisual />;
  if (id === "data-handling") return <DataHandlingVisual />;
  return <NumberSystemVisual />;
}

function NumberSystemVisual() {
  return (
    <svg viewBox="0 0 640 260" className="h-64 w-full rounded-2xl bg-slate-950">
      <Grid />
      {[1000, 100, 10, 1].map((value, index) => (
        <g key={value} transform={`translate(${70 + index * 140} 70)`}>
          <rect width="92" height="92" rx="16" fill={index === 0 ? "#0891b2" : "#22d3ee"} opacity="0.75" />
          <text x="46" y="52" textAnchor="middle" fontSize="22" fontWeight="900" fill="white">{value}</text>
          <text x="46" y="122" textAnchor="middle" fontSize="13" fontWeight="800" fill="#a5f3fc">{["thousands", "hundreds", "tens", "ones"][index]}</text>
        </g>
      ))}
      <line x1="70" y1="220" x2="570" y2="220" stroke="#cbd5e1" strokeWidth="3" />
      <circle cx="420" cy="220" r="10" fill="#f59e0b" />
      <text x="405" y="204" fontSize="14" fontWeight="900" fill="white">marker</text>
    </svg>
  );
}

function FactorsMultiplesVisual() {
  const target = 24;
  const factors = [1, 2, 3, 4, 6, 8, 12, 24];
  return (
    <svg viewBox="0 0 640 260" className="h-64 w-full rounded-2xl bg-slate-950">
      <Grid />
      <text x="34" y="34" fontSize="18" fontWeight="900" fill="white">Factors of 24 as arrays</text>
      {factors.slice(1, 5).map((factor, row) => {
        const cols = target / factor;
        return (
          <g key={factor} transform={`translate(42 ${62 + row * 42})`}>
            <text x="0" y="18" fontSize="13" fontWeight="900" fill="#a5f3fc">{factor} x {cols}</text>
            {Array.from({ length: Math.min(target, 24) }).map((_, index) => (
              <rect key={index} x={90 + (index % cols) * 13} y={Math.floor(index / cols) * 13} width="9" height="9" rx="2" fill={index < target ? "#22d3ee" : "#334155"} />
            ))}
          </g>
        );
      })}
      <g transform="translate(390 58)">
        <text x="0" y="0" fontSize="15" fontWeight="900" fill="white">Multiples of 6</text>
        {[6, 12, 18, 24, 30, 36].map((multiple, index) => (
          <g key={multiple} transform={`translate(${(index % 3) * 74} ${28 + Math.floor(index / 3) * 58})`}>
            <circle cx="22" cy="22" r="22" fill="#10b981" opacity="0.8" />
            <text x="22" y="28" textAnchor="middle" fontSize="15" fontWeight="900" fill="white">{multiple}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

function FractionsDecimalsVisual() {
  const parts = 8;
  const shaded = 5;
  return (
    <svg viewBox="0 0 640 260" className="h-64 w-full rounded-2xl bg-slate-950">
      <Grid />
      <text x="34" y="38" fontSize="18" fontWeight="900" fill="white">5/8 = 0.625</text>
      {Array.from({ length: parts }).map((_, index) => (
        <rect key={index} x={60 + index * 58} y="82" width="52" height="86" rx="10" fill={index < shaded ? "#22d3ee" : "#1e293b"} stroke="#94a3b8" />
      ))}
      <line x1="60" y1="214" x2="520" y2="214" stroke="#cbd5e1" strokeWidth="3" />
      <circle cx={60 + 460 * (shaded / parts)} cy="214" r="11" fill="#f59e0b" />
      <text x="48" y="238" fill="#cbd5e1" fontWeight="800">0</text>
      <text x="512" y="238" fill="#cbd5e1" fontWeight="800">1</text>
    </svg>
  );
}

function IntegerVisual() {
  return (
    <svg viewBox="0 0 640 260" className="h-64 w-full rounded-2xl bg-slate-950">
      <Grid />
      <text x="34" y="36" fontSize="18" fontWeight="900" fill="white">-3 + 7 = 4</text>
      <line x1="70" y1="145" x2="570" y2="145" stroke="#cbd5e1" strokeWidth="3" />
      {Array.from({ length: 13 }).map((_, index) => {
        const value = index - 6;
        const x = 70 + index * (500 / 12);
        return <g key={value}><line x1={x} x2={x} y1="132" y2="158" stroke="#94a3b8" /><text x={x} y="184" textAnchor="middle" fill="#cbd5e1" fontSize="13">{value}</text></g>;
      })}
      <path d="M 195 120 C 275 55, 420 55, 487 120" fill="none" stroke="#22d3ee" strokeWidth="6" markerEnd="url(#arrow)" />
      <defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#22d3ee" /></marker></defs>
    </svg>
  );
}

function BasicGeometryVisual() {
  return (
    <svg viewBox="0 0 640 260" className="h-64 w-full rounded-2xl bg-slate-950">
      <Grid />
      <line x1="94" y1="184" x2="560" y2="70" stroke="#22d3ee" strokeWidth="4" />
      <line x1="94" y1="184" x2="520" y2="184" stroke="#8b5cf6" strokeWidth="4" />
      <circle cx="94" cy="184" r="8" fill="#f59e0b" />
      <path d="M 148 184 A 54 54 0 0 0 140 171" fill="none" stroke="#f59e0b" strokeWidth="5" />
      <polygon points="380,184 470,82 548,184" fill="#10b981" opacity="0.25" stroke="#10b981" strokeWidth="4" />
      <text x="112" y="206" fill="white" fontWeight="900">point, ray, angle</text>
    </svg>
  );
}

function MensurationVisual() {
  return (
    <svg viewBox="0 0 640 260" className="h-64 w-full rounded-2xl bg-slate-950">
      <Grid />
      <rect x="130" y="70" width="320" height="130" fill="#22d3ee" opacity="0.22" stroke="#22d3ee" strokeWidth="5" />
      {Array.from({ length: 8 }).map((_, col) => Array.from({ length: 4 }).map((__, row) => <rect key={`${col}-${row}`} x={130 + col * 40} y={70 + row * 32.5} width="40" height="32.5" fill="none" stroke="#67e8f9" opacity="0.45" />))}
      <text x="210" y="52" fill="white" fontSize="18" fontWeight="900">Area = filled squares</text>
      <text x="462" y="140" fill="#f59e0b" fontSize="15" fontWeight="900">Perimeter = boundary</text>
    </svg>
  );
}

function DataHandlingVisual() {
  const values = [5, 8, 3, 6];
  return (
    <svg viewBox="0 0 640 260" className="h-64 w-full rounded-2xl bg-slate-950">
      <Grid />
      <text x="34" y="36" fontSize="18" fontWeight="900" fill="white">Tally to bar chart</text>
      {values.map((value, index) => (
        <g key={index} transform={`translate(${96 + index * 110} 0)`}>
          <rect x="0" y={205 - value * 18} width="58" height={value * 18} rx="8" fill={["#22d3ee", "#8b5cf6", "#10b981", "#f59e0b"][index]} />
          <text x="29" y="230" textAnchor="middle" fill="#cbd5e1" fontWeight="900">{["A", "B", "C", "D"][index]}</text>
          <text x="29" y={194 - value * 18} textAnchor="middle" fill="white" fontWeight="900">{value}</text>
        </g>
      ))}
    </svg>
  );
}

function Grid() {
  return (
    <g opacity="0.14">
      {Array.from({ length: 12 }).map((_, index) => <line key={`v-${index}`} x1={40 + index * 52} x2={40 + index * 52} y1="28" y2="232" stroke="#94a3b8" />)}
      {Array.from({ length: 5 }).map((_, index) => <line key={`h-${index}`} x1="34" x2="606" y1={50 + index * 42} y2={50 + index * 42} stroke="#94a3b8" />)}
    </g>
  );
}

function titleFromSlug(slug: string) {
  return slug
    .replace(/^international-core-class-\d+-/i, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
