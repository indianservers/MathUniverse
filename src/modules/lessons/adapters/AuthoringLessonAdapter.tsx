import { useEffect, useState } from "react";
import SliderControl from "../../../components/ui/SliderControl";
import AdapterFrame from "../components/AdapterFrame";
import type { LessonAdapterProps } from "../types";

export default function AuthoringLessonAdapter({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const [value, setValue] = useState(40);
  const [enabled, setEnabled] = useState(true);
  const [label, setLabel] = useState(lesson.title);
  const [events, setEvents] = useState<string[]>([]);

  useEffect(() => { setValue(40); setEnabled(true); setLabel(lesson.title); setEvents([]); }, [lesson.title, resetToken]);
  const record = (event: string) => { setEvents((current) => [event, ...current].slice(0, 4)); onInteraction(); };

  return (
    <AdapterFrame title={`${lesson.title} authoring preview`} value={`${value}%`} footer="The control and preview are linked; lesson authors configure behavior without duplicating a page.">
      <div className="grid gap-3 lg:grid-cols-[300px_minmax(0,1fr)]">
        <div className="space-y-3 rounded-xl bg-slate-100 p-3 dark:bg-white/10">
          <label className="block text-xs font-black uppercase text-slate-500">Label<input value={label} onChange={(event) => { setLabel(event.target.value); record("label changed"); }} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-900" /></label>
          <SliderControl density="compact" label="Value" value={value} min={0} max={100} step={5} onChange={(next) => { setValue(next); record("value changed"); }} />
          <label className="flex min-h-11 items-center gap-3 rounded-xl bg-white px-3 py-2 text-sm font-bold dark:bg-slate-900"><input type="checkbox" checked={enabled} onChange={(event) => { setEnabled(event.target.checked); record("visibility toggled"); }} />Enabled</label>
          <button type="button" className="action-secondary w-full justify-center" onClick={() => record("button pressed")}>Run action</button>
        </div>
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-5 overflow-hidden rounded-xl bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.18),transparent_55%)] p-5">
          {enabled ? <><div className="rounded-3xl border-4 border-cyan-400 bg-white px-8 py-6 text-center shadow-xl dark:bg-slate-900"><p className="text-xs font-black uppercase text-cyan-600">Live component</p><p className="mt-2 text-xl font-black">{label || "Untitled"}</p><div className="mx-auto mt-4 h-3 w-56 max-w-full overflow-hidden rounded-full bg-slate-200"><div className="h-full bg-cyan-500 transition-all" style={{ width: `${value}%` }} /></div></div><p className="text-sm font-semibold text-slate-500">{events[0] ?? "Change a control to preview its linked effect."}</p></> : <p className="rounded-xl bg-amber-100 px-4 py-3 font-bold text-amber-900">Preview hidden by the checkbox</p>}
        </div>
      </div>
    </AdapterFrame>
  );
}
