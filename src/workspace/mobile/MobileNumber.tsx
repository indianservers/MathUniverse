import { useEffect, useState } from "react";
export default function MobileNumber({ label, value, onChange, min, max, step = .1 }: { label: string; value: number; onChange: (value: number) => void; min?: number; max?: number; step?: number }) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);
  const commit = () => { const n = Number(draft); if (draft.trim() && Number.isFinite(n)) onChange(Math.max(min ?? -Infinity, Math.min(max ?? Infinity, n))); else setDraft(String(value)); };
  return <label className="mws-number">{label}<input type="number" inputMode="decimal" aria-label={label} value={draft} min={min} max={max} step={step} onChange={e => setDraft(e.target.value)} onBlur={commit} onKeyDown={e => { if (e.key === "Enter") { commit(); e.currentTarget.blur(); } }} /></label>;
}
