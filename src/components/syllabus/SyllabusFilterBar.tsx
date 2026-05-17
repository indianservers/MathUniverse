import { syllabusLevelOptions, syllabusStatusOptions, syllabusUnits } from "../../data/syllabus";

type SyllabusFilterBarProps = {
  search: string;
  level: string;
  unit: string;
  status: string;
  onSearch: (value: string) => void;
  onLevel: (value: string) => void;
  onUnit: (value: string) => void;
  onStatus: (value: string) => void;
  onReset: () => void;
};

export default function SyllabusFilterBar({ search, level, unit, status, onSearch, onLevel, onUnit, onStatus, onReset }: SyllabusFilterBarProps) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr_1fr_1fr_auto]">
        <label className="block">
          <span className="text-sm font-semibold">Search</span>
          <input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search topics, formulas, units..." className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-900" />
        </label>
        <Select label="Level" value={level} onChange={onLevel} options={syllabusLevelOptions} />
        <Select label="Unit" value={unit} onChange={onUnit} options={[{ value: "All", label: "All" }, ...syllabusUnits.map((item) => ({ value: item, label: item }))]} />
        <Select label="Status" value={status} onChange={onStatus} options={syllabusStatusOptions} />
        <div className="flex items-end">
          <button type="button" className="action-secondary w-full lg:w-auto" onClick={onReset}>Reset</button>
        </div>
      </div>
    </div>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: Array<{ value: string; label: string }>; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-900">
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}
