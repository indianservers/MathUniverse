import { useMemo, useState } from "react";
import SectionCard from "../components/ui/SectionCard";
import SliderControl from "../components/ui/SliderControl";
import TopicHeader from "../components/ui/TopicHeader";
import { CopyResultButton, ExampleValuesButton, RelatedToolLinks, ResetValuesButton, TermTooltip } from "../components/ui/UiFeedback";

type Unit = { key: string; label: string; dimension: string; toBase: number; chain: string };

const units: Unit[] = [
  { key: "nm", label: "nanometers", dimension: "length", toBase: 1e-9, chain: "1 nm x 10^-9 m / 1 nm" },
  { key: "um", label: "micrometers", dimension: "length", toBase: 1e-6, chain: "1 um x 10^-6 m / 1 um" },
  { key: "mm", label: "millimeters", dimension: "length", toBase: 0.001, chain: "1 mm x 0.001 m / 1 mm" },
  { key: "cm", label: "centimeters", dimension: "length", toBase: 0.01, chain: "1 cm x 0.01 m / 1 cm" },
  { key: "m", label: "meters", dimension: "length", toBase: 1, chain: "1 m" },
  { key: "km", label: "kilometers", dimension: "length", toBase: 1000, chain: "1 km x 1000 m / 1 km" },
  { key: "in", label: "inches", dimension: "length", toBase: 0.0254, chain: "1 in x 0.0254 m / 1 in" },
  { key: "ft", label: "feet", dimension: "length", toBase: 0.3048, chain: "1 ft x 0.3048 m / 1 ft" },
  { key: "yd", label: "yards", dimension: "length", toBase: 0.9144, chain: "1 yd x 0.9144 m / 1 yd" },
  { key: "mi", label: "miles", dimension: "length", toBase: 1609.344, chain: "1 mi x 1609.344 m / 1 mi" },
  { key: "nmi", label: "nautical miles", dimension: "length", toBase: 1852, chain: "1 nmi x 1852 m / 1 nmi" },

  { key: "mg", label: "milligrams", dimension: "mass", toBase: 0.000001, chain: "1 mg x 10^-6 kg / 1 mg" },
  { key: "g", label: "grams", dimension: "mass", toBase: 0.001, chain: "1 g x 0.001 kg / 1 g" },
  { key: "kg", label: "kilograms", dimension: "mass", toBase: 1, chain: "1 kg" },
  { key: "tonne", label: "metric tonnes", dimension: "mass", toBase: 1000, chain: "1 t x 1000 kg / 1 t" },
  { key: "oz", label: "ounces", dimension: "mass", toBase: 0.028349523125, chain: "1 oz x 0.028349523125 kg / 1 oz" },
  { key: "lb", label: "pounds", dimension: "mass", toBase: 0.45359237, chain: "1 lb x 0.45359237 kg / 1 lb" },
  { key: "st", label: "stone", dimension: "mass", toBase: 6.35029318, chain: "1 st x 6.35029318 kg / 1 st" },

  { key: "ml", label: "milliliters", dimension: "volume", toBase: 0.000001, chain: "1 mL x 10^-6 m^3 / 1 mL" },
  { key: "l", label: "liters", dimension: "volume", toBase: 0.001, chain: "1 L x 0.001 m^3 / 1 L" },
  { key: "m3", label: "cubic meters", dimension: "volume", toBase: 1, chain: "1 m^3" },
  { key: "tsp", label: "US teaspoons", dimension: "volume", toBase: 0.00000492892159375, chain: "1 tsp x 4.92892159375 mL / 1 tsp x 10^-6 m^3 / 1 mL" },
  { key: "tbsp", label: "US tablespoons", dimension: "volume", toBase: 0.00001478676478125, chain: "1 tbsp x 14.78676478125 mL / 1 tbsp x 10^-6 m^3 / 1 mL" },
  { key: "floz", label: "US fluid ounces", dimension: "volume", toBase: 0.0000295735295625, chain: "1 fl oz x 29.5735295625 mL / 1 fl oz x 10^-6 m^3 / 1 mL" },
  { key: "cup", label: "US cups", dimension: "volume", toBase: 0.0002365882365, chain: "1 cup x 236.5882365 mL / 1 cup x 10^-6 m^3 / 1 mL" },
  { key: "pt", label: "US pints", dimension: "volume", toBase: 0.000473176473, chain: "1 pt x 0.473176473 L / 1 pt x 0.001 m^3 / 1 L" },
  { key: "qt", label: "US quarts", dimension: "volume", toBase: 0.000946352946, chain: "1 qt x 0.946352946 L / 1 qt x 0.001 m^3 / 1 L" },
  { key: "gal", label: "US gallons", dimension: "volume", toBase: 0.003785411784, chain: "1 gal x 3.785411784 L / 1 gal x 0.001 m^3 / 1 L" },

  { key: "mm2", label: "square millimeters", dimension: "area", toBase: 0.000001, chain: "1 mm^2 x 10^-6 m^2 / 1 mm^2" },
  { key: "cm2", label: "square centimeters", dimension: "area", toBase: 0.0001, chain: "1 cm^2 x 10^-4 m^2 / 1 cm^2" },
  { key: "m2", label: "square meters", dimension: "area", toBase: 1, chain: "1 m^2" },
  { key: "km2", label: "square kilometers", dimension: "area", toBase: 1000000, chain: "1 km^2 x 10^6 m^2 / 1 km^2" },
  { key: "in2", label: "square inches", dimension: "area", toBase: 0.00064516, chain: "1 in^2 x 0.00064516 m^2 / 1 in^2" },
  { key: "ft2", label: "square feet", dimension: "area", toBase: 0.09290304, chain: "1 ft^2 x 0.09290304 m^2 / 1 ft^2" },
  { key: "acre", label: "acres", dimension: "area", toBase: 4046.8564224, chain: "1 acre x 4046.8564224 m^2 / 1 acre" },
  { key: "hectare", label: "hectares", dimension: "area", toBase: 10000, chain: "1 ha x 10000 m^2 / 1 ha" },

  { key: "ms", label: "milliseconds", dimension: "time", toBase: 0.001, chain: "1 ms x 0.001 s / 1 ms" },
  { key: "sec", label: "seconds", dimension: "time", toBase: 1, chain: "1 s" },
  { key: "min", label: "minutes", dimension: "time", toBase: 60, chain: "1 min x 60 s / 1 min" },
  { key: "hr", label: "hours", dimension: "time", toBase: 3600, chain: "1 h x 3600 s / 1 h" },
  { key: "day", label: "days", dimension: "time", toBase: 86400, chain: "1 day x 86400 s / 1 day" },
  { key: "week", label: "weeks", dimension: "time", toBase: 604800, chain: "1 week x 604800 s / 1 week" },

  { key: "mps", label: "meters/second", dimension: "speed", toBase: 1, chain: "1 m / 1 s" },
  { key: "kmh", label: "kilometers/hour", dimension: "speed", toBase: 0.2777777777777778, chain: "1 km / 1 h x 1000 m / 1 km x 1 h / 3600 s" },
  { key: "mph", label: "miles/hour", dimension: "speed", toBase: 0.44704, chain: "1 mi / 1 h x 1609.344 m / 1 mi x 1 h / 3600 s" },
  { key: "fps", label: "feet/second", dimension: "speed", toBase: 0.3048, chain: "1 ft / 1 s x 0.3048 m / 1 ft" },
  { key: "knot", label: "knots", dimension: "speed", toBase: 0.5144444444444445, chain: "1 nmi / 1 h x 1852 m / 1 nmi x 1 h / 3600 s" },

  { key: "n", label: "newtons", dimension: "force", toBase: 1, chain: "1 N = 1 kg m / s^2" },
  { key: "kn", label: "kilonewtons", dimension: "force", toBase: 1000, chain: "1 kN x 1000 N / 1 kN" },
  { key: "lbf", label: "pound-force", dimension: "force", toBase: 4.4482216152605, chain: "1 lbf x 4.4482216152605 N / 1 lbf" },

  { key: "pa", label: "pascals", dimension: "pressure", toBase: 1, chain: "1 Pa = 1 N / m^2" },
  { key: "kpa", label: "kilopascals", dimension: "pressure", toBase: 1000, chain: "1 kPa x 1000 Pa / 1 kPa" },
  { key: "bar", label: "bar", dimension: "pressure", toBase: 100000, chain: "1 bar x 100000 Pa / 1 bar" },
  { key: "atm", label: "atmospheres", dimension: "pressure", toBase: 101325, chain: "1 atm x 101325 Pa / 1 atm" },
  { key: "psi", label: "psi", dimension: "pressure", toBase: 6894.757293168, chain: "1 psi x 6894.757293168 Pa / 1 psi" },

  { key: "j", label: "joules", dimension: "energy", toBase: 1, chain: "1 J = 1 N m" },
  { key: "kj", label: "kilojoules", dimension: "energy", toBase: 1000, chain: "1 kJ x 1000 J / 1 kJ" },
  { key: "cal", label: "calories", dimension: "energy", toBase: 4.184, chain: "1 cal x 4.184 J / 1 cal" },
  { key: "kcal", label: "kilocalories", dimension: "energy", toBase: 4184, chain: "1 kcal x 4184 J / 1 kcal" },
  { key: "wh", label: "watt-hours", dimension: "energy", toBase: 3600, chain: "1 Wh x 3600 J / 1 Wh" },
  { key: "kwh", label: "kilowatt-hours", dimension: "energy", toBase: 3600000, chain: "1 kWh x 3,600,000 J / 1 kWh" },

  { key: "w", label: "watts", dimension: "power", toBase: 1, chain: "1 W = 1 J / s" },
  { key: "kw", label: "kilowatts", dimension: "power", toBase: 1000, chain: "1 kW x 1000 W / 1 kW" },
  { key: "hp", label: "horsepower", dimension: "power", toBase: 745.6998715822702, chain: "1 hp x 745.6998715822702 W / 1 hp" },

  { key: "deg", label: "degrees", dimension: "angle", toBase: Math.PI / 180, chain: "1 deg x pi/180 rad / 1 deg" },
  { key: "rad", label: "radians", dimension: "angle", toBase: 1, chain: "1 rad" },
  { key: "grad", label: "gradians", dimension: "angle", toBase: Math.PI / 200, chain: "1 grad x pi/200 rad / 1 grad" },

  { key: "hz", label: "hertz", dimension: "frequency", toBase: 1, chain: "1 Hz = 1 / s" },
  { key: "khz", label: "kilohertz", dimension: "frequency", toBase: 1000, chain: "1 kHz x 1000 Hz / 1 kHz" },
  { key: "mhz", label: "megahertz", dimension: "frequency", toBase: 1000000, chain: "1 MHz x 10^6 Hz / 1 MHz" },
  { key: "ghz", label: "gigahertz", dimension: "frequency", toBase: 1000000000, chain: "1 GHz x 10^9 Hz / 1 GHz" },

  { key: "b", label: "bits", dimension: "data", toBase: 1, chain: "1 bit" },
  { key: "B", label: "bytes", dimension: "data", toBase: 8, chain: "1 byte x 8 bits / 1 byte" },
  { key: "KB", label: "kilobytes", dimension: "data", toBase: 8000, chain: "1 KB x 1000 bytes / 1 KB x 8 bits / 1 byte" },
  { key: "MB", label: "megabytes", dimension: "data", toBase: 8000000, chain: "1 MB x 10^6 bytes / 1 MB x 8 bits / 1 byte" },
  { key: "GB", label: "gigabytes", dimension: "data", toBase: 8000000000, chain: "1 GB x 10^9 bytes / 1 GB x 8 bits / 1 byte" },
  { key: "KiB", label: "kibibytes", dimension: "data", toBase: 8192, chain: "1 KiB x 1024 bytes / 1 KiB x 8 bits / 1 byte" },
  { key: "MiB", label: "mebibytes", dimension: "data", toBase: 8388608, chain: "1 MiB x 1024^2 bytes / 1 MiB x 8 bits / 1 byte" },
  { key: "GiB", label: "gibibytes", dimension: "data", toBase: 8589934592, chain: "1 GiB x 1024^3 bytes / 1 GiB x 8 bits / 1 byte" },
];
const dimensions = Array.from(new Set(units.map((unit) => unit.dimension)));

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
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_240px_240px]">
          <div className="grid gap-3">
            <label className="block rounded-2xl border border-slate-200 bg-white/75 p-4 dark:border-white/10 dark:bg-slate-950/40">
              <span className="text-sm font-semibold">Input value</span>
              <input
                className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 font-mono text-sm font-semibold dark:border-white/10 dark:bg-slate-900"
                type="number"
                value={value}
                onChange={(event) => setValue(Number(event.target.value))}
              />
            </label>
            <SliderControl label="Quick adjust" value={value} min={0} max={1000} step={0.1} onChange={setValue} />
          </div>
          <UnitSelect label="From" value={from} units={units} onChange={(next) => { setFrom(next); const nextUnit = units.find((unit) => unit.key === next)!; setTo(units.find((unit) => unit.dimension === nextUnit.dimension && unit.key !== next)?.key ?? next); }} />
          <UnitSelect label="To" value={target.key} units={targets} onChange={setTo} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {dimensions.map((dimension) => (
            <span key={dimension} className="mini-chip capitalize">{dimension}: {units.filter((unit) => unit.dimension === dimension).length}</span>
          ))}
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
  const groups = dimensions
    .map((dimension) => ({ dimension, units: units.filter((unit) => unit.dimension === dimension) }))
    .filter((group) => group.units.length > 0);
  return (
    <label className="block rounded-2xl border border-slate-200 bg-white/75 p-4 dark:border-white/10 dark:bg-slate-950/40">
      <span className="text-sm font-semibold">{label}</span>
      <select className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-slate-900" value={value} onChange={(event) => onChange(event.target.value)}>
        {groups.map((group) => (
          <optgroup key={group.dimension} label={group.dimension}>
            {group.units.map((unit) => <option key={unit.key} value={unit.key}>{unit.label}</option>)}
          </optgroup>
        ))}
      </select>
    </label>
  );
}

function round(value: number) {
  if (!Number.isFinite(value)) return "0";
  if (Math.abs(value) >= 1e9 || (Math.abs(value) > 0 && Math.abs(value) < 1e-6)) return value.toExponential(6);
  return Number(value.toFixed(6)).toString();
}
