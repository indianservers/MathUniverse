import { useMemo, useState } from "react";
import { Atom, Grid3X3, Leaf, Network, Sparkles, Waves } from "lucide-react";
import SectionCard from "../../components/ui/SectionCard";
import TopicHeader from "../../components/ui/TopicHeader";

type MagicCell = { row: number; col: number; value: number };

const magicConcepts = [
  {
    title: "Casting out nines",
    idea: "Digit sums preserve remainders mod 9, turning arithmetic checks into quick mental tests.",
    example: "573 x 42 has digit-root check 6 x 6 = 36 -> 9.",
  },
  {
    title: "Kaprekar routine",
    idea: "Reordering digits and subtracting exposes an attractor pattern in base-10 arithmetic.",
    example: "6174 appears for most four-digit starts with at least two distinct digits.",
  },
  {
    title: "Calendar arithmetic",
    idea: "Modular cycles make weekdays, repeating dates, and clock puzzles feel like magic.",
    example: "Adding 7 days leaves the weekday unchanged.",
  },
  {
    title: "Binary mind reading",
    idea: "Number cards use place values 1, 2, 4, 8, ... so a hidden number is reconstructed by sums.",
    example: "Cards containing 13 start at 1, 4, and 8.",
  },
];

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
  const [order, setOrder] = useState(3);
  const [selected, setSelected] = useState<MagicCell | null>(null);
  const [customGrid, setCustomGrid] = useState<number[]>(() => generateOddMagicSquare(3).flat());
  const square = useMemo(() => generateOddMagicSquare(order), [order]);
  const magicConstant = (order * (order * order + 1)) / 2;
  const diagnostics = useMemo(() => analyzeSquare(chunk(customGrid, order)), [customGrid, order]);

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

      <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <MagicSquareLab order={order} square={square} magicConstant={magicConstant} selected={selected} onSelect={setSelected} onOrder={setSquareOrder} />
        <MagicSquareChecker order={order} grid={customGrid} diagnostics={diagnostics} onCell={updateCell} onReset={() => setCustomGrid(square.flat())} />
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <ConceptPanel title="Magic Math Concepts" icon={<Sparkles className="h-5 w-5" />} items={magicConcepts.map((item) => [item.title, item.idea, item.example])} />
        <ConceptPanel title="Coupling Universe and Maths" icon={<Atom className="h-5 w-5" />} items={universeLinks} />
        <NatureMathPanel />
      </div>

      <SectionCard title="Pattern Atlas" description="A starter map for expanding this module into puzzles, visual proofs, simulations, and classroom activities.">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <AtlasTile icon={<Grid3X3 className="h-5 w-5" />} title="Number Magic" text="Magic squares, digit roots, Kaprekar paths, palindromes, divisibility tricks." />
          <AtlasTile icon={<Waves className="h-5 w-5" />} title="Motion Magic" text="Resonance, pendulums, epicycles, Fourier drawing, phase locking." />
          <AtlasTile icon={<Network className="h-5 w-5" />} title="Network Magic" text="Social graphs, food webs, river basins, shortest paths, growth networks." />
          <AtlasTile icon={<Leaf className="h-5 w-5" />} title="Nature Magic" text="Spirals, tilings, symmetry, branching, scaling laws, camouflage patterns." />
        </div>
      </SectionCard>
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
        {items.map(([name, idea, example]) => (
          <div key={name} className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
            <h3 className="font-black text-slate-950 dark:text-white">{name}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{idea}</p>
            <p className="mt-2 rounded-lg bg-white px-3 py-2 font-mono text-xs font-bold dark:bg-slate-950">{example}</p>
          </div>
        ))}
      </div>
    </SectionCard>
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
