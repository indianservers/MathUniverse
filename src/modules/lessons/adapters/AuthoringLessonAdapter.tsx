import { useEffect, useState } from "react";
import SliderControl from "../../../components/ui/SliderControl";
import AdapterFrame from "../components/AdapterFrame";
import type { LessonAdapterProps } from "../types";

function authoringGuidanceFor(title: string) {
  const name = title.toLowerCase();
  if (name.includes("slider")) return ["Slider Component", "Set minimum, maximum, step size, and label.", "A slider needs a meaningful range."];
  if (name === "checkbox") return ["Checkbox", "Use it for one true-or-false choice.", "Do not use one checkbox for many states."];
  if (name === "button") return ["Button", "Connect the button to one clear action.", "The label should name the action."];
  if (name.includes("input box")) return ["Input Box", "Choose the accepted input format.", "Typed answers need validation."];
  if (name.includes("drop-down")) return ["Drop-Down List", "Offer short prepared choices.", "Choices should be related and easy to compare."];
  if (name.includes("dynamic text")) return ["Dynamic Text", "Link text to changing values.", "Do not type live values by hand."];
  if (name.includes("formula display")) return ["Formula Display", "Show readable notation and define symbols.", "A formula needs variable meanings."];
  if (name.includes("image object")) return ["Image Object", "Set size, position, and alt text.", "Important images need text description."];
  if (name.includes("audio") || name.includes("video")) return ["Audio and Video", "Add controls, captions, or transcript.", "Spoken media needs accessible text."];
  if (name.includes("pen") || name.includes("highlighter")) return ["Pen and Highlighter", "Use marks to show a step or error.", "Highlighting should have a learning target."];
  if (name === "tables") return ["Tables", "Use headings, units, and editable cells.", "Numbers need row and column labels."];
  if (name.includes("multiple pages")) return ["Multiple Pages", "Give each page one clear purpose.", "Split crowded lessons into focused pages."];
  if (name.includes("reset construction")) return ["Reset Construction", "Restore every linked starting value.", "Partial reset can leave hidden errors."];
  if (name.includes("undo") || name.includes("redo")) return ["Undo and Redo", "Store actions in order.", "Undo needs an action history."];
  if (name.includes("object locking")) return ["Object Locking", "Lock fixed support objects.", "Leave learner objects editable."];
  if (name.includes("conditional feedback")) return ["Conditional Feedback", "Write rules for each answer state.", "Feedback should say what to fix."];
  if (name.includes("custom tool")) return ["Custom Tool Builder", "Name inputs, outputs, and construction steps.", "A tool needs clear inputs."];
  if (name.includes("command library")) return ["Command Library", "Read command syntax before use.", "Input order matters."];
  if (name.includes("object scripting")) return ["Object Scripting", "Attach code to the correct event.", "The event must match the learner action."];
  if (name.includes("randomisation")) return ["Randomisation", "Set ranges and constraints.", "Generated tasks must stay valid."];
  if (name.includes("automatic checking")) return ["Automatic Checking", "Define answer rules and tolerance.", "Equivalent answers may need acceptance."];
  if (name.includes("import") || name.includes("export")) return ["Import and Export", "Check file type and fields.", "Formats must be compatible."];
  if (name.includes("concept introduction")) return ["Concept Introduction", "Start with the main idea and one model.", "Do not begin with too many rules."];
  if (name.includes("visualise")) return ["Visualise", "Choose a visual that shows the relationship.", "Pretty alone is not enough."];
  if (name.includes("manipulative laboratory")) return ["Manipulative Laboratory", "Give controls and a focused question.", "Exploration needs a goal."];
  if (name.includes("guided exploration")) return ["Guided Exploration", "Use predict, test, observe, and explain.", "Questions need a clear sequence."];
  if (name.includes("predict")) return ["Predict-Test-Explain", "Record prediction before testing.", "Prediction comes first."];
  if (name.includes("worked example")) return ["Worked Example", "Show steps, reasons, and answer.", "Steps need reasons."];
  if (name.includes("step-by-step")) return ["Step-by-Step Practice", "Check one useful step at a time.", "Middle steps matter."];
  if (name.includes("construction challenge")) return ["Construction Challenge", "State goal, tools, and success checks.", "Conditions must be exact."];
  if (name.includes("graph matching")) return ["Graph Matching", "Compare key graph features.", "Do not match only by rough appearance."];
  if (name.includes("error diagnosis")) return ["Error Diagnosis", "Find the first wrong step.", "Do not check only the final answer."];
  if (name.includes("multiple representations")) return ["Multiple Representations", "Link forms to the same idea.", "Views should stay in sync."];
  if (name.includes("real-world application")) return ["Real-World Application", "Define context, variables, and units.", "The story must affect the math."];
  if (name.includes("open investigation")) return ["Open Investigation", "Give a clear question and criteria.", "Learners need evidence rules."];
  if (name.includes("dynamic question")) return ["Dynamic Question Generator", "Set allowed values and answer rules.", "Generated questions must stay valid."];
  if (name.includes("mastery challenge")) return ["Mastery Challenge", "Require steps, answer, and explanation.", "Mastery should show independence."];
  if (name.includes("exit ticket")) return ["Exit Ticket", "Ask one focused final check.", "It should not become a full test."];
  if (name.includes("revision summary")) return ["Revision Summary", "Keep key ideas, rules, and warnings.", "Do not copy the whole lesson."];
  return ["Authoring", "Match the tool to one learning job.", "Test the learner-facing feedback."];
}

export default function AuthoringLessonAdapter({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const [value, setValue] = useState(40);
  const [enabled, setEnabled] = useState(true);
  const [label, setLabel] = useState(lesson.title);
  const [events, setEvents] = useState<string[]>([]);

  useEffect(() => { setValue(40); setEnabled(true); setLabel(lesson.title); setEvents([]); }, [lesson.title, resetToken]);
  const record = (event: string) => { setEvents((current) => [event, ...current].slice(0, 4)); onInteraction(); };
  const guidance = authoringGuidanceFor(lesson.title);

  return (
    <AdapterFrame title={`${lesson.title} authoring preview`} value={`${value}%`} footer="The control and preview are linked; lesson authors configure behavior without duplicating a page.">
      <div className="grid gap-3 lg:grid-cols-[300px_minmax(0,1fr)]">
        <div className="space-y-3 rounded-xl bg-slate-100 p-3 dark:bg-white/10">
          <div className="rounded-xl bg-white p-3 text-sm font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-100">
            <p>{guidance[0]}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{guidance[1]}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{guidance[2]}</p>
          </div>
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
