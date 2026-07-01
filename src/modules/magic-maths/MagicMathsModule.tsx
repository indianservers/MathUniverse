import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Atom, BookOpen, Calculator, Grid3X3, Leaf, Network, Sparkles, Waves } from "lucide-react";
import MathExpression from "../../components/ui/MathExpression";
import SectionCard from "../../components/ui/SectionCard";
import TopicHeader from "../../components/ui/TopicHeader";
import { magicConceptCatalog, type MagicConcept, type MagicConceptCategory } from "./magicConcepts";

type MagicCell = { row: number; col: number; value: number };

const featuredMagicConcepts = magicConceptCatalog.slice(0, 4);

const universeLinks = [
  ["Orbital resonance", "Ratios", "Moons and planets lock into simple frequency ratios."],
  ["Standing waves", "Eigenmodes", "Strings, atoms, and cavities prefer stable mathematical patterns."],
  ["Gravity wells", "Curvature", "Geometry describes how paths bend near mass."],
  ["Crystals", "Symmetry groups", "Repeating atomic lattices are classified by transformations."],
  ["Light spectra", "Fourier analysis", "Signals split into component frequencies."],
];

const naturePatterns = [
  { title: "Phyllotaxis", math: "Fibonacci and golden angle", note: "Leaves and seeds spread to reduce overlap and capture light." },
  { title: "Honeycombs", math: "Hexagonal tiling", note: "Hexagons pack equal cells with low boundary length." },
  { title: "River branches", math: "Fractals and networks", note: "Branching balances reach, flow, and energy cost." },
  { title: "Animal coats", math: "Reaction-diffusion", note: "Local activator/inhibitor rules create spots and stripes." },
  { title: "Shell spirals", math: "Logarithmic spirals", note: "Growth preserves shape while scale changes." },
];

export default function MagicMathsModule() {
  const { conceptSlug } = useParams();
  const activeConcept = conceptSlug ? magicConceptCatalog.find((concept) => concept.slug === conceptSlug) : null;
  const [activeMagicTab, setActiveMagicTab] = useState<"pages" | "lab" | "highlights" | "atlas">("pages");
  const [activeAtlasCategory, setActiveAtlasCategory] = useState<MagicConceptCategory | "All">("Number Magic");
  const [order, setOrder] = useState(3);
  const [selected, setSelected] = useState<MagicCell | null>(null);
  const [customGrid, setCustomGrid] = useState<number[]>(() => generateOddMagicSquare(3).flat());
  const square = useMemo(() => generateOddMagicSquare(order), [order]);
  const magicConstant = (order * (order * order + 1)) / 2;
  const diagnostics = useMemo(() => analyzeSquare(chunk(customGrid, order)), [customGrid, order]);

  if (conceptSlug) {
    return activeConcept ? <MagicConceptPage concept={activeConcept} /> : <MagicConceptNotFound slug={conceptSlug} />;
  }

  function setSquareOrder(value: number) {
    const next = value % 2 === 0 ? value + 1 : value;
    setOrder(next);
    setCustomGrid(generateOddMagicSquare(next).flat());
    setSelected(null);
  }

  function updateCell(index: number, value: number) {
    setCustomGrid((current) => current.map((cell, cellIndex) => (cellIndex === index ? value : cell)));
  }

  return (
    <div className="space-y-5">
      <TopicHeader
        title="Magic Maths"
        subtitle="Explore surprising number structures, magic squares, universe-scale patterns, and mathematics hidden in nature."
        difficulty="Curiosity Lab"
        estimatedMinutes={55}
        formula={{ title: "Magic square constant", formula: String.raw`M=\frac{n(n^2+1)}{2}`, explanation: "For a normal n by n magic square using 1 through n squared, every row, column, and diagonal sums to M." }}
      />

      <MagicMathsTabs active={activeMagicTab} onChange={setActiveMagicTab} />

      {activeMagicTab === "lab" ? (
        <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
          <MagicSquareLab order={order} square={square} magicConstant={magicConstant} selected={selected} onSelect={setSelected} onOrder={setSquareOrder} />
          <MagicSquareChecker order={order} grid={customGrid} diagnostics={diagnostics} onCell={updateCell} onReset={() => setCustomGrid(square.flat())} />
        </div>
      ) : null}

      {activeMagicTab === "highlights" ? (
        <div className="grid gap-5 xl:grid-cols-3">
          <ConceptPanel title="Magic Math Concepts" icon={<Sparkles className="h-5 w-5" />} items={featuredMagicConcepts.map((item) => [item.title, item.idea, item.example, item.slug])} />
          <ConceptPanel title="Coupling Universe and Maths" icon={<Atom className="h-5 w-5" />} items={universeLinks} />
          <NatureMathPanel />
        </div>
      ) : null}

      {activeMagicTab === "pages" ? (
        <SectionCard title="Math Magic Pages" description="Open one focused concept group at a time instead of scrolling through the whole atlas.">
          <MagicConceptCategoryTabs active={activeAtlasCategory} onChange={setActiveAtlasCategory} />
          <div className="mt-4">
            <MagicConceptGrid concepts={activeAtlasCategory === "All" ? magicConceptCatalog : magicConceptCatalog.filter((concept) => concept.category === activeAtlasCategory)} />
          </div>
        </SectionCard>
      ) : null}

      {activeMagicTab === "atlas" ? (
        <SectionCard title="Pattern Atlas" description="A starter map for puzzles, visual proofs, simulations, and classroom activities.">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <AtlasTile icon={<Grid3X3 className="h-5 w-5" />} title="Number Magic" text="Magic squares, digit roots, Kaprekar paths, palindromes, divisibility tricks." />
            <AtlasTile icon={<Waves className="h-5 w-5" />} title="Motion Magic" text="Resonance, pendulums, epicycles, Fourier drawing, phase locking." />
            <AtlasTile icon={<Network className="h-5 w-5" />} title="Network Magic" text="Social graphs, food webs, river basins, shortest paths, growth networks." />
            <AtlasTile icon={<Leaf className="h-5 w-5" />} title="Nature Magic" text="Spirals, tilings, symmetry, branching, scaling laws, camouflage patterns." />
          </div>
        </SectionCard>
      ) : null}
    </div>
  );
}

function MagicSquareLab({ order, square, magicConstant, selected, onSelect, onOrder }: { order: number; square: number[][]; magicConstant: number; selected: MagicCell | null; onSelect: (cell: MagicCell) => void; onOrder: (value: number) => void }) {
  const selectedValue = selected ? square[selected.row][selected.col] : square[0][0];
  return (
    <SectionCard title="Magic Square Builder" description="Generate odd-order normal magic squares with the Siamese method and inspect row, column, and diagonal balances.">
      <div className="flex flex-wrap items-center gap-3">
        <label className="min-w-56 flex-1 text-sm font-black text-slate-700 dark:text-slate-200">
          Odd order n
          <input type="range" min="3" max="9" step="2" value={order} onChange={(event) => onOrder(Number(event.target.value))} className="mt-2 w-full accent-cyan-500" />
        </label>
        <span className="mini-chip">n = {order}</span>
        <span className="mini-chip">M = {magicConstant}</span>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div className="rounded-2xl bg-slate-950 p-4">
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${order}, minmax(0, 1fr))` }}>
            {square.flatMap((row, rowIndex) =>
              row.map((value, colIndex) => {
                const active = selected?.row === rowIndex || selected?.col === colIndex || rowIndex === colIndex || rowIndex + colIndex === order - 1;
                return (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    type="button"
                    onClick={() => onSelect({ row: rowIndex, col: colIndex, value })}
                    className={`aspect-square rounded-lg border text-sm font-black transition sm:text-lg ${active ? "border-cyan-200 bg-cyan-300 text-slate-950" : "border-white/10 bg-white/10 text-white hover:bg-white/20"}`}
                    aria-label={`Magic square cell row ${rowIndex + 1} column ${colIndex + 1} value ${value}`}
                  >
                    {value}
                  </button>
                );
              }),
            )}
          </div>
        </div>
        <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
          <p className="text-xs font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">Selected balance</p>
          <p className="mt-2 text-4xl font-black">{selectedValue}</p>
          <p className="mt-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
            Click any number. The highlighted row, column, and diagonals all sum to {magicConstant}.
          </p>
          <div className="mt-4 space-y-2 text-sm font-bold">
            {square.map((row, index) => <p key={index}>Row {index + 1}: {row.reduce((sum, value) => sum + value, 0)}</p>)}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

function MagicSquareChecker({ order, grid, diagnostics, onCell, onReset }: { order: number; grid: number[]; diagnostics: ReturnType<typeof analyzeSquare>; onCell: (index: number, value: number) => void; onReset: () => void }) {
  return (
    <SectionCard title="Magic Square Checker" description="Edit the square and see whether rows, columns, and diagonals still agree.">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-3 py-1 text-sm font-black ${diagnostics.isMagic ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/20 dark:text-emerald-100" : "bg-amber-100 text-amber-800 dark:bg-amber-400/20 dark:text-amber-100"}`}>
          {diagnostics.isMagic ? "Magic" : "Not magic yet"}
        </span>
        <span className="mini-chip">Target {diagnostics.target}</span>
        <button type="button" className="action-secondary py-2" onClick={onReset}>Reset generated square</button>
      </div>
      <div className="mt-4 grid gap-2" style={{ gridTemplateColumns: `repeat(${order}, minmax(0, 1fr))` }}>
        {grid.map((value, index) => (
          <input
            key={index}
            aria-label={`Editable magic square cell ${index + 1}`}
            type="number"
            value={value}
            onChange={(event) => onCell(index, Number(event.target.value))}
            className="min-h-12 min-w-0 rounded-lg border border-slate-200 bg-white text-center text-sm font-black dark:border-white/10 dark:bg-slate-950"
          />
        ))}
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {diagnostics.lines.map((line) => (
          <div key={line.label} className={`rounded-xl p-3 text-sm font-bold ${line.ok ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-100" : "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200"}`}>
            {line.label}: {line.sum}
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function ConceptPanel({ title, icon, items }: { title: string; icon: JSX.Element; items: string[][] }) {
  return (
    <SectionCard title={title} description="Tap into the idea, then use it as a launchpad for deeper modules.">
      <div className="mb-3 inline-flex rounded-xl bg-cyan-100 p-3 text-cyan-800 dark:bg-cyan-400/15 dark:text-cyan-100">{icon}</div>
      <div className="space-y-3">
        {items.map(([name, idea, example, slug]) => (
          <div key={name} className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
            <h3 className="font-black text-slate-950 dark:text-white">{name}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{idea}</p>
            <p className="mt-2 rounded-lg bg-white px-3 py-2 font-mono text-xs font-bold dark:bg-slate-950">{example}</p>
            {slug ? (
              <Link to={`/magic-maths/${slug}`} className="mt-3 inline-flex text-sm font-black text-cyan-700 hover:text-cyan-900 dark:text-cyan-200">
                Open concept page
              </Link>
            ) : null}
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function MagicMathsTabs({ active, onChange }: { active: "pages" | "lab" | "highlights" | "atlas"; onChange: (tab: "pages" | "lab" | "highlights" | "atlas") => void }) {
  const tabs = [
    { id: "pages", label: "Concept Pages", count: magicConceptCatalog.length },
    { id: "lab", label: "Magic Square Lab", count: 2 },
    { id: "highlights", label: "Highlights", count: 3 },
    { id: "atlas", label: "Pattern Atlas", count: 4 },
  ] as const;

  return (
    <div className="mobile-safe-scroll thin-scrollbar flex gap-2 overflow-x-auto rounded-2xl border border-white/60 bg-white/75 p-2 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.04]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={active === tab.id ? "action-primary shrink-0" : "tool-button shrink-0"}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
          <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-[11px]">{tab.count}</span>
        </button>
      ))}
    </div>
  );
}

function NatureMathPanel() {
  return (
    <SectionCard title="Nature and Maths" description="Patterns in living systems often reveal optimization, symmetry, growth, and constraint.">
      <div className="mb-3 inline-flex rounded-xl bg-emerald-100 p-3 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-100"><Leaf className="h-5 w-5" /></div>
      <div className="space-y-3">
        {naturePatterns.map((item) => (
          <div key={item.title} className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-black text-slate-950 dark:text-white">{item.title}</h3>
              <span className="mini-chip">{item.math}</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.note}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function AtlasTile({ icon, title, text }: { icon: JSX.Element; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/75 p-4 dark:border-white/10 dark:bg-white/5">
      <div className="inline-flex rounded-xl bg-slate-950 p-3 text-cyan-200 dark:bg-white/10">{icon}</div>
      <h3 className="mt-3 font-black text-slate-950 dark:text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p>
    </div>
  );
}

function MagicConceptGrid({ concepts }: { concepts: MagicConcept[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {concepts.map((concept, index) => (
        <Link
          key={concept.slug}
          to={`/magic-maths/${concept.slug}`}
          className="group rounded-2xl border border-slate-200 bg-white/80 p-4 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-xl dark:border-white/10 dark:bg-white/5"
        >
          <div className="flex items-start justify-between gap-3">
            <span className={`rounded-full px-3 py-1 text-xs font-black ${categoryPillClass(concept.category)}`}>{concept.category}</span>
            <span className="text-xs font-black text-slate-400">{String(index + 1).padStart(2, "0")}</span>
          </div>
          <h3 className="mt-3 text-lg font-black text-slate-950 group-hover:text-cyan-800 dark:text-white dark:group-hover:text-cyan-100">{concept.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{concept.hook}</p>
          <div className="mt-3 flex items-center justify-between gap-3 text-xs font-black">
            <span className="text-slate-500 dark:text-slate-400">{concept.level}</span>
            <span className="text-cyan-700 dark:text-cyan-200">Open page</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

function MagicConceptCategoryTabs({ active, onChange }: { active: MagicConceptCategory | "All"; onChange: (category: MagicConceptCategory | "All") => void }) {
  const categories = ["Number Magic", "Pattern Magic", "Physics Magic", "Probability Magic", "Geometry Magic", "Nature Magic", "All"] as const;
  return (
    <div className="mobile-safe-scroll thin-scrollbar flex gap-2 overflow-x-auto pb-2">
      {categories.map((category) => {
        const count = category === "All" ? magicConceptCatalog.length : magicConceptCatalog.filter((concept) => concept.category === category).length;
        return (
          <button
            key={category}
            type="button"
            className={active === category ? "action-primary shrink-0" : "tool-button shrink-0"}
            onClick={() => onChange(category)}
          >
            {category}
            <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-[11px]">{count}</span>
          </button>
        );
      })}
    </div>
  );
}

function MagicConceptPage({ concept }: { concept: MagicConcept }) {
  const relatedConcepts = concept.related
    .map((slug) => magicConceptCatalog.find((item) => item.slug === slug))
    .filter(Boolean) as MagicConcept[];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Link to="/magic-maths" className="action-secondary inline-flex items-center gap-2 py-2">
          <ArrowLeft className="h-4 w-4" />
          Magic maths
        </Link>
        <span className={`rounded-full px-3 py-1 text-sm font-black ${categoryPillClass(concept.category)}`}>{concept.category}</span>
        <span className="mini-chip">{concept.level}</span>
      </div>

      <TopicHeader
        title={concept.title}
        subtitle={concept.hook}
        difficulty={concept.category}
        estimatedMinutes={20}
        formula={{ title: "Core pattern", formula: concept.formula, explanation: concept.idea }}
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <SectionCard title="Concept of Mathematics" description="What the trick is really teaching, stated before the surprise.">
          <div className="space-y-4">
            <InfoBlock icon={<BookOpen className="h-5 w-5" />} title="Main idea" text={concept.idea} />
            <InfoBlock icon={<Calculator className="h-5 w-5" />} title="Why it works" text={concept.why} />
            <div className="rounded-2xl border border-cyan-200 bg-cyan-50/80 p-4 dark:border-cyan-300/20 dark:bg-cyan-300/10">
              <p className="text-sm font-black uppercase tracking-wide text-cyan-800 dark:text-cyan-100">Formula</p>
              <div className="mt-3 rounded-xl bg-white p-4 text-lg font-black shadow-sm dark:bg-slate-950">
                <MathExpression value={concept.formula} display />
              </div>
            </div>
            <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
              <p className="text-sm font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Worked example</p>
              <p className="mt-2 text-base font-bold leading-7 text-slate-800 dark:text-slate-100">{concept.example}</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Visual Cue" description="A compact visual anchor for the page.">
          <MagicConceptVisual concept={concept} />
        </SectionCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-[.9fr_1.1fr]">
        <SectionCard title="Step Timeline" description="Use this as the classroom explanation path.">
          <ol className="space-y-3">
            {concept.steps.map((step, index) => (
              <li key={step} className="flex gap-3 rounded-2xl bg-white/75 p-4 shadow-sm dark:bg-white/5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-cyan-200 dark:bg-cyan-300 dark:text-slate-950">{index + 1}</span>
                <span className="text-sm font-bold leading-6 text-slate-700 dark:text-slate-200">{step}</span>
              </li>
            ))}
          </ol>
        </SectionCard>

        <SectionCard title="Try It" description="A quick prompt that turns the concept into an activity.">
          <div className="rounded-2xl bg-slate-950 p-5 text-white">
            <p className="text-lg font-black leading-8">{concept.tryThis}</p>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Related pages</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {relatedConcepts.map((item) => (
                <Link key={item.slug} to={`/magic-maths/${item.slug}`} className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm font-black text-cyan-900 hover:bg-cyan-100 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-100">
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function MagicConceptNotFound({ slug }: { slug: string }) {
  return (
    <SectionCard title="Magic maths page not found" description={`No concept page exists for "${slug}" yet.`}>
      <Link to="/magic-maths" className="action-primary inline-flex">Back to Magic Maths</Link>
    </SectionCard>
  );
}

function InfoBlock({ icon, title, text }: { icon: JSX.Element; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/75 p-4 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-start gap-3">
        <span className="rounded-xl bg-slate-950 p-3 text-cyan-200 dark:bg-white/10">{icon}</span>
        <div>
          <h3 className="font-black text-slate-950 dark:text-white">{title}</h3>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">{text}</p>
        </div>
      </div>
    </div>
  );
}

function MagicConceptVisual({ concept }: { concept: MagicConcept }) {
  if (concept.slug === "standing-waves") return <StandingWaveVisual />;
  if (concept.slug === "kaprekar-routine") return <KaprekarVisual />;
  if (concept.slug === "casting-out-nines") return <DigitRootVisual />;
  if (concept.category === "Probability Magic") return <ProbabilityVisual />;
  if (concept.category === "Geometry Magic") return <GeometryVisual />;
  if (concept.category === "Physics Magic") return <StandingWaveVisual />;
  if (concept.category === "Nature Magic") return <NatureVisual />;
  return <NumberPatternVisual concept={concept} />;
}

function StandingWaveVisual() {
  return (
    <div className="rounded-2xl bg-slate-950 p-5 text-white">
      <svg viewBox="0 0 360 190" className="h-56 w-full" role="img" aria-label="Standing wave modes">
        {[1, 2, 3].map((mode, row) => {
          const y = 45 + row * 50;
          const points = Array.from({ length: 90 }, (_, i) => {
            const x = 20 + i * 3.6;
            const waveY = y + Math.sin((i / 89) * Math.PI * mode) * 22;
            return `${x},${waveY}`;
          }).join(" ");
          return <polyline key={mode} points={points} fill="none" stroke={row === 0 ? "#67e8f9" : row === 1 ? "#a78bfa" : "#34d399"} strokeWidth="4" strokeLinecap="round" />;
        })}
        <line x1="20" x2="340" y1="170" y2="170" stroke="#94a3b8" strokeWidth="3" />
        <text x="20" y="24" fill="#e0f2fe" fontSize="14" fontWeight="800">Modes fit between fixed ends</text>
      </svg>
    </div>
  );
}

function KaprekarVisual() {
  const rows = ["3524", "5432 - 2345 = 3087", "8730 - 0378 = 8352", "8532 - 2358 = 6174"];
  return <StackedVisual title="Digits settle into 6174" rows={rows} />;
}

function DigitRootVisual() {
  const rows = ["573 -> 5 + 7 + 3 = 15 -> 6", "42 -> 4 + 2 = 6", "6 x 6 = 36 -> 9"];
  return <StackedVisual title="Digit roots preserve remainders" rows={rows} />;
}

function StackedVisual({ title, rows }: { title: string; rows: string[] }) {
  return (
    <div className="rounded-2xl bg-slate-950 p-5 text-white">
      <h3 className="font-black text-cyan-100">{title}</h3>
      <div className="mt-4 space-y-3">
        {rows.map((row, index) => (
          <div key={row} className="rounded-xl border border-white/10 bg-white/10 p-3 font-mono text-sm font-black">
            <span className="mr-3 text-cyan-200">{index + 1}</span>
            {row}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProbabilityVisual() {
  return (
    <div className="grid grid-cols-3 gap-3 rounded-2xl bg-slate-950 p-5">
      {["A", "B", "C", "D", "E", "F"].map((label, index) => (
        <div key={label} className={`aspect-square rounded-2xl border-2 ${index === 1 || index === 4 ? "border-cyan-200 bg-cyan-300 text-slate-950" : "border-white/10 bg-white/10 text-white"} flex items-center justify-center text-xl font-black`}>
          {label}
        </div>
      ))}
    </div>
  );
}

function GeometryVisual() {
  return (
    <div className="rounded-2xl bg-slate-950 p-5">
      <svg viewBox="0 0 260 210" className="h-56 w-full" role="img" aria-label="Geometry magic visual">
        <polygon points="45,165 115,45 215,165" fill="#22d3ee" opacity=".85" />
        <circle cx="115" cy="105" r="54" fill="none" stroke="#fbbf24" strokeWidth="6" />
        <path d="M45 165 C110 125 150 95 215 165" fill="none" stroke="#a78bfa" strokeWidth="6" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function NatureVisual() {
  return (
    <div className="grid grid-cols-5 gap-2 rounded-2xl bg-slate-950 p-5">
      {Array.from({ length: 25 }, (_, index) => (
        <span key={index} className="aspect-square rounded-full bg-emerald-300" style={{ opacity: 0.25 + (index % 5) * 0.15, transform: `scale(${0.65 + (index % 4) * 0.1})` }} />
      ))}
    </div>
  );
}

function NumberPatternVisual({ concept }: { concept: MagicConcept }) {
  return (
    <div className="rounded-2xl bg-slate-950 p-5 text-white">
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 16 }, (_, index) => (
          <div key={index} className={`aspect-square rounded-xl ${index % 3 === 0 ? "bg-cyan-300 text-slate-950" : index % 4 === 0 ? "bg-violet-400 text-white" : "bg-white/10 text-cyan-100"} flex items-center justify-center text-sm font-black`}>
            {index + 1}
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm font-bold leading-6 text-slate-300">{concept.title} turns a hidden rule into a visible pattern.</p>
    </div>
  );
}

function categoryPillClass(category: MagicConceptCategory) {
  switch (category) {
    case "Number Magic":
      return "bg-cyan-100 text-cyan-900 dark:bg-cyan-300/15 dark:text-cyan-100";
    case "Pattern Magic":
      return "bg-violet-100 text-violet-900 dark:bg-violet-300/15 dark:text-violet-100";
    case "Physics Magic":
      return "bg-indigo-100 text-indigo-900 dark:bg-indigo-300/15 dark:text-indigo-100";
    case "Probability Magic":
      return "bg-amber-100 text-amber-900 dark:bg-amber-300/15 dark:text-amber-100";
    case "Geometry Magic":
      return "bg-rose-100 text-rose-900 dark:bg-rose-300/15 dark:text-rose-100";
    case "Nature Magic":
      return "bg-emerald-100 text-emerald-900 dark:bg-emerald-300/15 dark:text-emerald-100";
    default:
      return "bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-white";
  }
}

function generateOddMagicSquare(order: number) {
  const n = order % 2 === 0 ? order + 1 : order;
  const square = Array.from({ length: n }, () => Array.from({ length: n }, () => 0));
  let row = 0;
  let col = Math.floor(n / 2);
  for (let value = 1; value <= n * n; value += 1) {
    square[row][col] = value;
    const nextRow = (row - 1 + n) % n;
    const nextCol = (col + 1) % n;
    if (square[nextRow][nextCol]) {
      row = (row + 1) % n;
    } else {
      row = nextRow;
      col = nextCol;
    }
  }
  return square;
}

function chunk(values: number[], size: number) {
  return Array.from({ length: size }, (_, index) => values.slice(index * size, index * size + size));
}

function analyzeSquare(square: number[][]) {
  const order = square.length;
  const target = (order * (order * order + 1)) / 2;
  const lines = [
    ...square.map((row, index) => ({ label: `Row ${index + 1}`, sum: row.reduce((sum, value) => sum + value, 0) })),
    ...Array.from({ length: order }, (_, col) => ({ label: `Column ${col + 1}`, sum: square.reduce((sum, row) => sum + (row[col] ?? 0), 0) })),
    { label: "Main diagonal", sum: square.reduce((sum, row, index) => sum + (row[index] ?? 0), 0) },
    { label: "Other diagonal", sum: square.reduce((sum, row, index) => sum + (row[order - 1 - index] ?? 0), 0) },
  ].map((line) => ({ ...line, ok: line.sum === target }));
  return { target, lines, isMagic: lines.every((line) => line.ok) };
}
