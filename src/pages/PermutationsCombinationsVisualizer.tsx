import { useEffect, useMemo, useState, type DragEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle2, Grip, MousePointer2, RotateCcw, Shuffle, UsersRound } from "lucide-react";
import SectionCard from "../components/ui/SectionCard";
import SliderControl from "../components/ui/SliderControl";
import TopicHeader from "../components/ui/TopicHeader";

type Mode = "permutations" | "combinations";

const labels = "ABCDEFGHIJ".split("");

export default function PermutationsCombinationsVisualizer() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [n, setN] = useState(() => clampNumber(Number(searchParams.get("v_available_objects_n")), 3, 10, 5));
  const [r, setR] = useState(() => clampNumber(Number(searchParams.get("v_chosen_positions_r")), 1, 10, 3));
  const [mode, setMode] = useState<Mode>("permutations");
  const effectiveR = Math.min(r, n);
  const items = labels.slice(0, n);
  const [selected, setSelected] = useState<string[]>([]);
  const activeExample = selected;

  const counts = useMemo(() => {
    const nPr = permutationCount(n, effectiveR);
    const nCr = combinationCount(n, effectiveR);
    return { nPr, nCr, repeatedOrders: factorial(effectiveR), ratio: nCr === 0 ? 0 : nPr / nCr };
  }, [effectiveR, n]);

  const permutationSamples = useMemo(() => samplePermutations(items, effectiveR, 18), [effectiveR, items]);
  const combinationSamples = useMemo(() => sampleCombinations(items, effectiveR, 18), [effectiveR, items]);

  useEffect(() => {
    setSelected((current) => current.filter((item) => items.includes(item)).slice(0, effectiveR));
  }, [effectiveR, items]);

  function updateN(value: number) {
    const nextN = clampNumber(value, 3, 10, 5);
    const nextR = Math.min(r, nextN);
    setN(nextN);
    setR((current) => Math.min(current, nextN));
    updateUrl(setSearchParams, nextN, nextR);
  }

  function updateR(value: number) {
    const nextR = clampNumber(value, 1, n, 3);
    setR(nextR);
    updateUrl(setSearchParams, n, nextR);
  }

  function chooseItem(item: string) {
    setSelected((current) => {
      if (current.includes(item)) return current.filter((value) => value !== item);
      const next = current.length >= effectiveR ? [...current.slice(1), item] : [...current, item];
      return mode === "combinations" ? sortByItemOrder(next, items) : next;
    });
  }

  function placeItem(item: string, slotIndex: number) {
    setSelected((current) => {
      const withoutItem = current.filter((value) => value !== item);
      const padded = Array.from({ length: effectiveR }, (_, index) => withoutItem[index]).filter(Boolean) as string[];
      padded.splice(slotIndex, 0, item);
      const next = padded.slice(0, effectiveR);
      return mode === "combinations" ? sortByItemOrder(next, items) : next;
    });
  }

  function changeMode(nextMode: Mode) {
    setMode(nextMode);
    setSelected((current) => nextMode === "combinations" ? sortByItemOrder(current, items) : current);
  }

  return (
    <div className="space-y-6">
      <TopicHeader
        title="Permutations and Combinations"
        subtitle="Build arrangements and selections side by side. See exactly when order matters, when it does not, and why nPr is r! times larger than nCr."
        difficulty="Class 11 / Discrete Mathematics"
        estimatedMinutes={18}
        progress={76}
        formula={{
          title: "Counting formulas",
          formula: "nPr = n! / (n-r)!    nCr = n! / (r!(n-r)!)",
          explanation: "Permutations count ordered arrangements. Combinations count unordered selections.",
        }}
      />

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <SectionCard title="Counting Controls" description="Choose how many objects are available and how many positions or choices are used.">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 dark:border-white/10 dark:bg-white/5">
              <button
                type="button"
                onClick={() => changeMode("permutations")}
                className={`rounded-xl px-3 py-3 text-sm font-black transition ${mode === "permutations" ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20" : "bg-white text-slate-700 hover:bg-cyan-50 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-white/10"}`}
              >
                <Shuffle className="mr-2 inline h-4 w-4" />
                Order matters
              </button>
              <button
                type="button"
                onClick={() => changeMode("combinations")}
                className={`rounded-xl px-3 py-3 text-sm font-black transition ${mode === "combinations" ? "bg-violet-500 text-white shadow-lg shadow-violet-500/20" : "bg-white text-slate-700 hover:bg-violet-50 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-white/10"}`}
              >
                <UsersRound className="mr-2 inline h-4 w-4" />
                Order ignored
              </button>
            </div>

            <SliderControl label="Available objects n" value={n} min={3} max={10} step={1} onChange={updateN} description="Objects labeled A, B, C... that can be chosen." />
            <SliderControl label="Chosen positions r" value={effectiveR} min={1} max={n} step={1} onChange={updateR} description="Slots filled for nPr or group size for nCr." />

            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/50">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">Objects</p>
                <button type="button" onClick={() => setSelected([])} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700 transition hover:bg-slate-200 dark:bg-white/10 dark:text-slate-200">
                  <RotateCcw className="h-3.5 w-3.5" />
                  clear
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {items.map((item, index) => (
                  <button
                    key={item}
                    type="button"
                    draggable
                    onClick={() => chooseItem(item)}
                    onDragStart={(event) => event.dataTransfer.setData("text/plain", item)}
                    className={`group grid h-11 w-11 place-items-center rounded-2xl border font-black shadow-sm transition hover:-translate-y-0.5 ${selected.includes(item) ? "border-emerald-300 bg-emerald-100 text-emerald-800 ring-2 ring-emerald-300 dark:border-emerald-300/40 dark:bg-emerald-400/15 dark:text-emerald-100" : "border-cyan-200 bg-cyan-50 text-cyan-800 hover:border-cyan-400 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-100"}`}
                    style={{ animationDelay: `${index * 60}ms` }}
                    aria-label={`Choose object ${item}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <p className="mt-3 flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                <MousePointer2 className="h-4 w-4" />
                Click an object or drag it into a position.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Metric label="nPr" value={formatNumber(counts.nPr)} tone="cyan" />
              <Metric label="nCr" value={formatNumber(counts.nCr)} tone="violet" />
              <Metric label="r!" value={formatNumber(counts.repeatedOrders)} tone="amber" />
              <Metric label="ratio" value={`${formatNumber(counts.ratio)} : 1`} tone="slate" />
            </div>
          </div>
        </SectionCard>

        <SectionCard title={mode === "permutations" ? "Permutation Builder" : "Combination Builder"} description={mode === "permutations" ? "Each slot has fewer choices than the previous slot because the same object cannot be reused." : "The same group appears only once because order is ignored."}>
          <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-5">
              <OutcomeBuilder items={items} selected={activeExample} selectedCount={selected.length} r={effectiveR} mode={mode} onPlaceItem={placeItem} onRemoveItem={(item) => setSelected((current) => current.filter((value) => value !== item))} />
              <ComparisonBars nPr={counts.nPr} nCr={counts.nCr} />
              {mode === "permutations" ? <PermutationTree items={items} r={effectiveR} /> : <CombinationGrid samples={combinationSamples} />}
            </div>

            <div className="space-y-4">
              <FormulaPanel n={n} r={effectiveR} counts={counts} />
              <GuidedActivity mode={mode} n={n} r={effectiveR} />
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Sample Outcomes" description="The preview is capped so the page stays fast, while the counts still use the exact formula.">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {(mode === "permutations" ? permutationSamples : combinationSamples).map((sample) => (
              <div key={sample.join("-")} className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">{mode === "permutations" ? "Arrangement" : "Selection"}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {sample.map((item, index) => (
                    <span key={`${item}-${index}`} className="grid h-8 min-w-8 place-items-center rounded-lg bg-slate-100 px-2 font-mono text-sm font-black dark:bg-slate-950">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Misconception Check" description="Use these checks while teaching so students do not memorize formulas without the model.">
          <div className="grid gap-3 md:grid-cols-2">
            <Insight title="If rank, seat, password, or order is named" text="Use permutation. ABC and BAC are different outcomes." />
            <Insight title="If team, committee, sample, or group is named" text="Use combination. ABC and BAC are the same group." />
            <Insight title="Why divide by r!" text="Every selected group can be internally rearranged r! ways, so combinations remove those repeats." />
            <Insight title="Why n-r appears" text="After filling r places, the unused tail has (n-r)! arrangements that should not affect the selected outcome." />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function OutcomeBuilder({
  items,
  selected,
  selectedCount,
  r,
  mode,
  onPlaceItem,
  onRemoveItem,
}: {
  items: string[];
  selected: string[];
  selectedCount: number;
  r: number;
  mode: Mode;
  onPlaceItem: (item: string, slotIndex: number) => void;
  onRemoveItem: (item: string) => void;
}) {
  const choices = Array.from({ length: r }, (_, index) => mode === "permutations" ? items.length - index : index === 0 ? items.length : "filter repeats");
  const arrangementText = selected.length === 0 ? "Click or drag objects here" : mode === "permutations" ? selected.join(" -> ") : `{ ${sortByItemOrder(selected, items).join(", ")} }`;
  const readiness = selectedCount === 0 ? "Showing a sample. Choose objects to build your own." : selectedCount < r ? `${r - selectedCount} more needed.` : "Complete outcome.";

  function handleDrop(event: DragEvent<HTMLDivElement>, slotIndex: number) {
    event.preventDefault();
    const item = event.dataTransfer.getData("text/plain");
    if (items.includes(item)) onPlaceItem(item, slotIndex);
  }

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 text-white shadow-2xl shadow-cyan-950/10 dark:border-white/10">
      <div className="bg-[radial-gradient(circle_at_20%_15%,rgba(34,211,238,0.24),transparent_34%),radial-gradient(circle_at_80%_0%,rgba(168,85,247,0.24),transparent_30%)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase text-cyan-200">{mode === "permutations" ? "ordered positions" : "unordered group"}</p>
            <h3 className="mt-1 text-2xl font-black">{mode === "permutations" ? "Build an arrangement" : "Build one selection"}</h3>
          </div>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black">{readiness}</span>
        </div>
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/10 p-3">
          <p className="text-xs font-black uppercase text-cyan-100">Current outcome</p>
          <p className="mt-1 break-words font-mono text-xl font-black text-white">{arrangementText}</p>
        </div>
      </div>

      <div className="grid gap-4 p-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(118px, 1fr))" }}>
        {Array.from({ length: r }, (_, index) => {
          const item = selected[index];
          return (
            <div
              key={index}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleDrop(event, index)}
              className={`min-h-36 rounded-3xl border p-3 transition ${item ? "border-cyan-300/60 bg-cyan-400/15" : "border-dashed border-white/25 bg-white/5"}`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-black uppercase text-cyan-100">{mode === "permutations" ? `position ${index + 1}` : `member ${index + 1}`}</p>
                <Grip className="h-4 w-4 text-cyan-100/70" />
              </div>
              <button
                type="button"
                onClick={() => item && onRemoveItem(item)}
                className={`mt-5 grid h-16 w-full place-items-center rounded-2xl text-3xl font-black transition ${item ? "bg-white text-slate-950 shadow-xl shadow-cyan-950/20 hover:bg-cyan-50" : "bg-white/10 text-white/35"}`}
                aria-label={item ? `Remove ${item}` : `Empty ${mode === "permutations" ? "position" : "member"} ${index + 1}`}
              >
                {item ?? "+"}
              </button>
              <p className="mt-4 text-xs font-bold text-slate-300">{typeof choices[index] === "number" ? `${choices[index]} choices` : choices[index]}</p>
            </div>
          );
        })}
      </div>

      <div className="border-t border-white/10 bg-white/[0.03] p-5">
        <div className="grid gap-3 md:grid-cols-3">
          <ReasonChip title="1. Pick" text={`${items.length} available objects`} tone="cyan" />
          <ReasonChip title="2. Place" text={`${r} ${mode === "permutations" ? "ordered slots" : "group members"}`} tone="violet" />
          <ReasonChip title="3. Count" text={mode === "permutations" ? "swaps make new outcomes" : "swaps collapse to one group"} tone="amber" />
        </div>
      </div>
    </div>
  );
}

function ReasonChip({ title, text, tone }: { title: string; text: string; tone: "cyan" | "violet" | "amber" }) {
  const tones = {
    cyan: "border-cyan-300/30 bg-cyan-400/10 text-cyan-100",
    violet: "border-violet-300/30 bg-violet-400/10 text-violet-100",
    amber: "border-amber-300/30 bg-amber-400/10 text-amber-100",
  };
  return (
    <div className={`rounded-2xl border p-3 ${tones[tone]}`}>
      <p className="text-xs font-black uppercase">{title}</p>
      <p className="mt-1 text-sm font-bold">{text}</p>
    </div>
  );
}

function PermutationTree({ items, r }: { items: string[]; r: number }) {
  const levels = Array.from({ length: r }, (_, level) => items.slice(0, Math.min(items.length, 5)).map((item) => `${item}${level + 1}`));
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
      <p className="text-sm font-black">Arrangement tree preview</p>
      <svg viewBox="0 0 760 260" className="mt-3 h-[260px] w-full rounded-2xl bg-slate-50 dark:bg-slate-950">
        <line x1="60" y1="130" x2="700" y2="130" stroke="#94a3b8" strokeDasharray="8 8" opacity="0.45" />
        {levels.map((levelItems, levelIndex) => {
          const x = 90 + levelIndex * (600 / Math.max(1, r - 1));
          return (
            <g key={levelIndex}>
              <text x={x - 26} y="28" fontSize="13" fontWeight="900" fill="#64748b">{`step ${levelIndex + 1}`}</text>
              {levelItems.map((item, itemIndex) => {
                const y = 58 + itemIndex * 38;
                return (
                  <g key={item}>
                    {levelIndex > 0 && <line x1={x - 72} y1={130} x2={x - 14} y2={y} stroke="#22d3ee" strokeWidth="2" opacity="0.35" />}
                    <circle cx={x} cy={y} r="15" fill={levelIndex % 2 ? "#8b5cf6" : "#06b6d4"} />
                    <text x={x} y={y + 5} textAnchor="middle" fontSize="12" fontWeight="900" fill="white">{item[0]}</text>
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function CombinationGrid({ samples }: { samples: string[][] }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
      <p className="text-sm font-black">Combination map</p>
      <div className="mt-3 grid max-h-[260px] gap-2 overflow-auto pr-1 sm:grid-cols-2 xl:grid-cols-3">
        {samples.map((sample) => (
          <div key={sample.join("")} className="rounded-xl bg-violet-50 p-3 dark:bg-violet-400/10">
            <p className="font-mono text-sm font-black">{`{ ${sample.join(", ")} }`}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComparisonBars({ nPr, nCr }: { nPr: number; nCr: number }) {
  const max = Math.max(nPr, nCr, 1);
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
      <p className="text-sm font-black">Ordered vs unordered count</p>
      <Bar label="nPr permutations" value={nPr} max={max} className="bg-cyan-400" />
      <Bar label="nCr combinations" value={nCr} max={max} className="bg-violet-400" />
    </div>
  );
}

function Bar({ label, value, max, className }: { label: string; value: number; max: number; className: string }) {
  return (
    <div className="mt-3">
      <div className="mb-1 flex justify-between gap-3 text-xs font-black uppercase text-slate-500 dark:text-slate-400">
        <span>{label}</span>
        <span>{formatNumber(value)}</span>
      </div>
      <div className="h-4 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-950">
        <div className={`h-full rounded-full ${className}`} style={{ width: `${Math.max(3, (value / max) * 100)}%` }} />
      </div>
    </div>
  );
}

function FormulaPanel({ n, r, counts }: { n: number; r: number; counts: { nPr: number; nCr: number; repeatedOrders: number; ratio: number } }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
      <p className="text-sm font-black">Live formula substitution</p>
      <div className="mt-3 space-y-3 font-mono text-sm font-bold">
        <p className="rounded-2xl bg-cyan-50 p-3 text-cyan-900 dark:bg-cyan-400/10 dark:text-cyan-100">{`${n}P${r} = ${n}! / (${n}-${r})! = ${formatNumber(counts.nPr)}`}</p>
        <p className="rounded-2xl bg-violet-50 p-3 text-violet-900 dark:bg-violet-400/10 dark:text-violet-100">{`${n}C${r} = ${n}! / (${r}!(${n}-${r})!) = ${formatNumber(counts.nCr)}`}</p>
        <p className="rounded-2xl bg-amber-50 p-3 text-amber-900 dark:bg-amber-400/10 dark:text-amber-100">{`Each group repeats ${formatNumber(counts.repeatedOrders)} ordered ways.`}</p>
      </div>
    </div>
  );
}

function GuidedActivity({ mode, n, r }: { mode: Mode; n: number; r: number }) {
  const answer = mode === "permutations" ? permutationCount(n, r) : combinationCount(n, r);
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/50">
      <p className="text-sm font-black">Guided activity</p>
      <div className="mt-3 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
        <p><strong className="text-slate-900 dark:text-white">Predict:</strong> Should order change the answer for this situation?</p>
        <p><strong className="text-slate-900 dark:text-white">Manipulate:</strong> Switch the mode and compare the two bars.</p>
        <p><strong className="text-slate-900 dark:text-white">Check:</strong> Current answer is <span className="font-mono font-black">{formatNumber(answer)}</span>.</p>
        <p><strong className="text-slate-900 dark:text-white">Reflect:</strong> Explain whether swapping two chosen objects creates a new outcome.</p>
      </div>
    </div>
  );
}

function Insight({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
        <div>
          <h3 className="font-black">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone: "cyan" | "violet" | "amber" | "slate" }) {
  const tones = {
    cyan: "bg-cyan-50 text-cyan-900 dark:bg-cyan-400/10 dark:text-cyan-100",
    violet: "bg-violet-50 text-violet-900 dark:bg-violet-400/10 dark:text-violet-100",
    amber: "bg-amber-50 text-amber-900 dark:bg-amber-400/10 dark:text-amber-100",
    slate: "bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-white",
  };
  return (
    <div className={`rounded-2xl p-4 ${tones[tone]}`}>
      <p className="text-xs font-black uppercase opacity-70">{label}</p>
      <p className="mt-1 break-words font-mono text-lg font-black">{value}</p>
    </div>
  );
}

function samplePermutations(items: string[], r: number, limit: number) {
  const results: string[][] = [];
  const visit = (path: string[], remaining: string[]) => {
    if (results.length >= limit) return;
    if (path.length === r) {
      results.push(path);
      return;
    }
    for (const item of remaining) {
      visit([...path, item], remaining.filter((next) => next !== item));
    }
  };
  visit([], items);
  return results;
}

function sampleCombinations(items: string[], r: number, limit: number) {
  const results: string[][] = [];
  const visit = (start: number, path: string[]) => {
    if (results.length >= limit) return;
    if (path.length === r) {
      results.push(path);
      return;
    }
    for (let index = start; index < items.length; index += 1) {
      visit(index + 1, [...path, items[index]]);
    }
  };
  visit(0, []);
  return results;
}

function permutationCount(n: number, r: number) {
  return factorial(n) / factorial(n - r);
}

function combinationCount(n: number, r: number) {
  return permutationCount(n, r) / factorial(r);
}

function factorial(value: number) {
  return Array.from({ length: Math.max(0, value) }, (_, index) => index + 1).reduce((product, next) => product * next, 1);
}

function formatNumber(value: number) {
  return Number.isInteger(value) ? value.toLocaleString("en-US") : value.toFixed(2);
}

function clampNumber(value: number, min: number, max: number, fallback: number) {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.round(value)));
}

function sortByItemOrder(items: string[], order: string[]) {
  return [...items].sort((left, right) => order.indexOf(left) - order.indexOf(right));
}

function updateUrl(setSearchParams: (nextInit: URLSearchParams) => void, n: number, r: number) {
  const params = new URLSearchParams();
  params.set("v_available_objects_n", String(n));
  params.set("v_chosen_positions_r", String(r));
  setSearchParams(params);
}
