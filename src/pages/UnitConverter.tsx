import { useMemo, useState } from "react";
import SectionCard from "../components/ui/SectionCard";
import SliderControl from "../components/ui/SliderControl";
import TopicHeader from "../components/ui/TopicHeader";
import { CopyResultButton, ExampleValuesButton, RelatedToolLinks, ResetValuesButton, TermTooltip } from "../components/ui/UiFeedback";

type Unit = { key: string; label: string; dimension: string; toBase: number; chain: string };

const units: Unit[] = [
  { key: "mph", label: "miles/hour", dimension: "speed", toBase: 0.44704, chain: "1 mi / 1 h x 1609.344 m / 1 mi x 1 h / 3600 s" },
  { key: "mps", label: "meters/second", dimension: "speed", toBase: 1, chain: "1 m / 1 s" },
  { key: "ft", label: "feet", dimension: "length", toBase: 0.3048, chain: "1 ft x 0.3048 m / 1 ft" },
  { key: "m", label: "meters", dimension: "length", toBase: 1, chain: "1 m" },
  { key: "lb", label: "pounds", dimension: "mass", toBase: 0.45359237, chain: "1 lb x 0.45359237 kg / 1 lb" },
  { key: "kg", label: "kilograms", dimension: "mass", toBase: 1, chain: "1 kg" },
  { key: "gal", label: "US gallons", dimension: "volume", toBase: 0.003785411784, chain: "1 gal x 3.785411784 L / 1 gal x 0.001 m^3 / 1 L" },
  { key: "l", label: "liters", dimension: "volume", toBase: 0.001, chain: "1 L x 0.001 m^3 / 1 L" },
];

export default function UnitConverter() {
  const [value, setValue] = useState(60);
  const [from, setFrom] = useState("mph");
  const [to, setTo] = useState("mps");
  const source = units.find((unit) => unit.key === from)!;
  const targets = units.filter((unit) => unit.dimension === source.dimension);
  const target = targets.find((unit) => unit.key === to) ?? targets[0];
  const result = useMemo(() => (value * source.toBase) / target.toBase, [source, target, value]);

  return (
    <div className="space-y-6">
      <TopicHeader title="Unit Converter with Dimensional Analysis" subtitle="Convert SI and imperial units while seeing the unit-cancellation chain." difficulty="Tool" estimatedMinutes={6} />
      <SectionCard title="Converter">
        <div className="sticky top-20 z-20 mb-4 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white/90 p-2 backdrop-blur dark:border-white/10 dark:bg-slate-950/90">
          <CopyResultButton value={`${value} ${source.key} = ${round(result)} ${target.key}`} />
          <ResetValuesButton onClick={() => { setValue(0); setFrom("mph"); setTo("mps"); }} />
          <ExampleValuesButton onClick={() => { setValue(60); setFrom("mph"); setTo("mps"); }} />
        </div>
        <div className="grid gap-5 lg:grid-cols-[1fr_240px_240px]">
          <SliderControl label="Input value" value={value} min={0} max={500} step={0.1} onChange={setValue} />
          <UnitSelect label="From" value={from} units={units} onChange={(next) => { setFrom(next); const nextUnit = units.find((unit) => unit.key === next)!; setTo(units.find((unit) => unit.dimension === nextUnit.dimension && unit.key !== next)?.key ?? next); }} />
          <UnitSelect label="To" value={target.key} units={targets} onChange={setTo} />
        </div>
      </SectionCard>
      <SectionCard title="Dimensional Chain">
        <div className="space-y-4">
          <p className="text-3xl font-black text-cyan-700 dark:text-cyan-200">{value} {source.key} = {round(result)} {target.key}</p>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
            <TermTooltip term="Dimensional analysis" tip="A method of converting units by multiplying ratios that cancel old units and leave the desired unit." /> checks that the units cancel correctly before trusting the number.
          </p>
          <div className="rounded-2xl bg-slate-100 p-4 font-mono text-sm leading-7 dark:bg-white/10">
            {value} x ({source.chain}) x base-unit bridge x 1 / ({target.chain}) = {round(result)} {target.label}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">Dimension check: {source.dimension} cancels to {target.dimension}, so the conversion is valid.</p>
          <RelatedToolLinks links={[{ label: "Calculator", route: "/calculator" }, { label: "Math Lab", route: "/math-lab" }]} />
        </div>
      </SectionCard>
    </div>
  );
}

function UnitSelect({ label, value, units, onChange }: { label: string; value: string; units: Unit[]; onChange: (value: string) => void }) {
  return (
    <label className="block rounded-2xl border border-slate-200 bg-white/75 p-4 dark:border-white/10 dark:bg-slate-950/40">
      <span className="text-sm font-semibold">{label}</span>
      <select className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-slate-900" value={value} onChange={(event) => onChange(event.target.value)}>
        {units.map((unit) => <option key={unit.key} value={unit.key}>{unit.label}</option>)}
      </select>
    </label>
  );
}

function round(value: number) {
  return Number(value.toFixed(6)).toString();
}
