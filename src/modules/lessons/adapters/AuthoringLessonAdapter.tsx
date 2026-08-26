import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import SliderControl from "../../../components/ui/SliderControl";
import AdapterFrame from "../components/AdapterFrame";
import type { LessonAdapterProps } from "../types";
import SliderComponentTargetLesson618 from "./SliderComponentTargetLesson618";

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
  if (lesson.id === 618) {
    return <SliderComponentTargetLesson618 lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }
  if (isRedesignedAuthoringLesson(lesson.id)) {
    return <RedesignedAuthoringLesson lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }

  return <LegacyAuthoringLesson lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
}

function isRedesignedAuthoringLesson(lessonId: number) {
  return (lessonId >= 618 && lessonId <= 648) || lessonId === 650 || lessonId === 651 || lessonId === 653 || lessonId === 654;
}

function LegacyAuthoringLesson({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
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

type AuthoringSpec = {
  title: string;
  purpose: string;
  badge: string;
  value: string;
  settings: Array<[string, string]>;
  checklist: string[];
  rule: string;
  trap: string;
  practice: string;
  logSeed: string;
};

function RedesignedAuthoringLesson({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const spec = authoringSpecFor(lesson.id);
  const [value, setValue] = useState(lesson.id === 618 ? 1.2 : 40);
  const [enabled, setEnabled] = useState(true);
  const [eventLog, setEventLog] = useState<string[]>([spec.logSeed]);

  useEffect(() => {
    setValue(lesson.id === 618 ? 1.2 : 40);
    setEnabled(true);
    setEventLog([spec.logSeed]);
  }, [lesson.id, resetToken, spec.logSeed]);

  const record = (message: string) => {
    setEventLog((current) => [message, ...current].slice(0, 4));
    onInteraction();
  };

  const reset = () => {
    setValue(lesson.id === 618 ? 1.2 : 40);
    setEnabled(true);
    record("Reset restored the starting state.");
  };

  return (
    <AdapterFrame title={`${lesson.title} authoring preview`} value={spec.value} footer="This redesigned authoring preview links component settings, learner action, mathematical result, and validation feedback in one lesson-specific workspace.">
      <section className="grid gap-4 xl:grid-cols-[290px_minmax(0,1fr)_285px]" aria-label={`${lesson.title} redesigned authoring workspace`}>
        <aside className="space-y-3 rounded-3xl border border-cyan-100 bg-cyan-50/70 p-4 dark:border-cyan-300/20 dark:bg-cyan-300/10">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wide text-cyan-700">Component settings</p>
            <h3 className="mt-1 text-xl font-black text-slate-950 dark:text-white">{spec.title}</h3>
            <p className="mt-1 text-sm font-bold leading-6 text-slate-600 dark:text-slate-300">{spec.purpose}</p>
          </div>
          {spec.settings.map(([label, detail], index) => (
            <div key={`${label}-${detail}-${index}`} className="rounded-2xl bg-white p-3 text-sm ring-1 ring-cyan-100 dark:bg-slate-950/60 dark:ring-white/10">
              <p className="text-[10px] font-black uppercase text-slate-500">{label}</p>
              <p className="mt-1 font-mono font-black text-cyan-900 dark:text-cyan-100">{detail}</p>
            </div>
          ))}
          <SliderControl density="compact" label={lesson.id === 618 ? "Parameter slider a" : "Preview strength"} value={value} min={lesson.id === 618 ? 0 : 0} max={lesson.id === 618 ? 2 : 100} step={lesson.id === 618 ? 0.1 : 5} onChange={(next) => { setValue(next); record(`${lesson.title} control changed; live preview updated.`); }} />
          <label className="flex min-h-11 items-center gap-3 rounded-2xl bg-white px-3 py-2 text-sm font-black ring-1 ring-cyan-100 dark:bg-slate-950/60 dark:ring-white/10">
            <input type="checkbox" checked={enabled} onChange={(event) => { setEnabled(event.target.checked); record(event.target.checked ? "Preview enabled." : "Preview hidden."); }} />
            Live preview enabled
          </label>
        </aside>

        <main className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-violet-50/70 p-4 shadow-sm dark:border-white/10 dark:from-slate-950 dark:via-slate-900 dark:to-violet-300/10">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wide text-violet-700">Interactive authoring</p>
              <h2 className="text-2xl font-black text-slate-950 dark:text-white">{spec.title}</h2>
              <p className="mt-1 text-sm font-bold text-slate-600 dark:text-slate-300">{spec.purpose}</p>
            </div>
            <span className="rounded-2xl bg-white px-3 py-2 text-sm font-black text-violet-800 shadow-sm ring-1 ring-violet-100">{spec.badge}</span>
          </div>
          <div className="mt-4">{enabled ? renderAuthoringVisual(lesson.id, value) : <div className="rounded-3xl bg-amber-50 p-8 text-center font-black text-amber-900 ring-1 ring-amber-200">Live preview hidden by the checkbox.</div>}</div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="action-secondary" onClick={() => record("Action fired - the math object responded.")}>Trigger action</button>
            <button type="button" className="action-secondary" onClick={() => record("Undo reversed the latest authoring action.")}>Undo</button>
            <button type="button" className="action-secondary" onClick={reset}>Reset</button>
          </div>
        </main>

        <aside className="space-y-3">
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
            <p className="font-black">{spec.rule}</p>
            <ul className="mt-3 space-y-2">
              {spec.checklist.map((item) => <li key={item} className="rounded-2xl bg-white/80 px-3 py-2 font-black ring-1 ring-emerald-100">{item}</li>)}
            </ul>
          </div>
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm font-black leading-6 text-amber-900">{spec.trap}</div>
          <div className="rounded-3xl border border-violet-200 bg-violet-50 p-4 text-sm font-black leading-6 text-violet-950">{spec.practice}</div>
          <div className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/60">
            <p className="text-[10px] font-black uppercase text-slate-500">Event log</p>
            {eventLog.map((event) => <p key={event} className="mt-2 rounded-xl bg-slate-50 p-2 text-xs font-black text-slate-700 dark:bg-white/10 dark:text-slate-200">{event}</p>)}
          </div>
        </aside>
      </section>
    </AdapterFrame>
  );
}

function authoringSpecFor(lessonId: number): AuthoringSpec {
  const specs: Record<number, AuthoringSpec> = {
    618: { title: "Slider Component", purpose: "Expose adjustable parameters.", badge: "a = 1.2", value: "y = a x²", settings: [["Parameter slider", "a = 1.2"], ["Range", "Min 0, Max 2"], ["Step", "Step 0.1"], ["Default", "Default 1.2"]], checklist: ["Keyboard supported", "Meaningful range required", "Move slider -> equation updates -> graph changes"], rule: "A slider should expose one bounded numeric parameter.", trap: "Do not make the slider decorative; it must visibly control parabola steepness.", practice: "Try next: use a slider for radius r and update A = πr².", logSeed: "Slider preview ready at a = 1.2." },
    619: { title: "Checkbox", purpose: "Control visibility and states.", badge: "Independent layer controls", value: "Checked = visible", settings: [["Label", "Show grid"], ["Checked state", "visible"], ["Unchecked state", "hidden"], ["Accessible description", "Toggle one graph layer"]], checklist: ["Show grid", "Show tangent", "Show area", "Keyboard supported"], rule: "Use one checkbox for one true-or-false choice.", trap: "Do not use one checkbox for many states; each overlay gets its own on/off control.", practice: "Try next: add a checkbox that shows a slope triangle.", logSeed: "Checkbox layers match the graph state." },
    620: { title: "Button", purpose: "Trigger actions.", badge: "Feedback: point plotted", value: "Next point: (3, 7)", settings: [["Label", "Plot next point"], ["Action", "Action: add point"], ["Enabled", "true"], ["Confirmation", "point plotted"]], checklist: ["Plot next point", "Click -> add point -> update table", "One button, one clear action"], rule: "A button runs one clear command when activated.", trap: "Avoid vague labels; the button label should name the mathematical action.", practice: "Try next: make a Check answer button that validates a point.", logSeed: "Button action preview is ready." },
    621: { title: "Input Box", purpose: "Accept learner responses.", badge: "Typed answer: 2", value: "Correct", settings: [["Prompt", "What is the slope?"], ["Accepted format", "number"], ["Tolerance", "±0.01"], ["Placeholder", "type slope"]], checklist: ["Validate before saving", "Correct answer: 2", "Common invalid examples"], rule: "Typed answers need a format and validation rule.", trap: "Do not accept any text as correct; validate before saving.", practice: "Try next: accept slope 1.5 with tolerance ±0.01.", logSeed: "Input validation returned Correct." },
    622: { title: "Drop-Down List", purpose: "Select cases or datasets.", badge: "Default: Graph", value: "Representation: Graph", settings: [["Label", "Representation"], ["Choices", "Mapping, Table, Graph"], ["Default choice", "Graph"], ["Placeholder", "Choose view"]], checklist: ["Prepared choices", "Use for mutually exclusive options", "f(x) = x² - 1"], rule: "Dropdown choices should be short, related, and mutually exclusive.", trap: "Do not hide unrelated decisions in one long list.", practice: "Try next: switch between linear, quadratic, and exponential datasets.", logSeed: "Dropdown preview selected Graph." },
    623: { title: "Dynamic Text", purpose: "Create live explanations.", badge: "Live value", value: "x = 2, y = 4", settings: [["Template", "When x = {x}, f(x) = {y}."], ["Token", "{x}"], ["Token", "{y}"], ["Token", "{slope}"]], checklist: ["When x = 2, f(x) = 4.", "Moving P updates the explanation automatically.", "slope = 4"], rule: "Dynamic text binds sentence tokens to changing mathematical values.", trap: "Do not type live values by hand; link them to the graph.", practice: "Try next: show live area text as radius changes.", logSeed: "Dynamic text is bound to point P." },
    624: { title: "Formula Display", purpose: "Present mathematical notation.", badge: "Roots: x = 2, x = 3", value: "D = 1", settings: [["Formula", "Quadratic formula"], ["a", "1"], ["b", "-5"], ["c", "6"]], checklist: ["Define every symbol", "Large notation", "Accessible text alternative"], rule: "A formula display must pair readable notation with symbol meanings.", trap: "Do not show symbols without definitions.", practice: "Try next: display the slope formula with x1, y1, x2, y2 defined.", logSeed: "Formula display passed readability checks." },
    625: { title: "Image Object", purpose: "Add contextual visuals.", badge: "Alt text required", value: "3-4-5 triangle", settings: [["Source", "Right-triangle reference image"], ["Position", "A(0,0)"], ["Width/height", "4 by 3"], ["Opacity", "80%"]], checklist: ["A(0,0)", "B(4,0)", "C(4,3)", "hypotenuse = 5"], rule: "Images should support the mathematics and remain measurable.", trap: "Do not add an image without alt text or mathematical anchors.", practice: "Try next: place a map image and measure scale distance.", logSeed: "Image object aligned to coordinate anchors." },
    626: { title: "Audio and Video", purpose: "Support multimedia learning.", badge: "00:18 / 01:20", value: "Captions on", settings: [["Media", "Slope explanation"], ["Captions", "Captions on"], ["Transcript", "Transcript attached"], ["Speed", "1×"]], checklist: ["show rise", "show run", "state slope", "Keyboard controls"], rule: "Media should sync controls, captions, transcript, and math cues.", trap: "Do not use video as decoration; tie it to the slope explanation.", practice: "Try next: add cue markers for intercept and slope.", logSeed: "Media cue is paused at the slope statement." },
    627: { title: "Pen and Highlighter", purpose: "Annotate work.", badge: "Triangle proof markup", value: "AB = AC", settings: [["Tool", "Highlighter"], ["Stroke", "4 px"], ["Color", "teal"], ["Undo", "enabled"]], checklist: ["Highlight givens", "Mark conclusion", "Write one reason", "Eraser"], rule: "Annotations should highlight givens, conclusions, and reasons.", trap: "Do not highlight without a learning target.", practice: "Try next: circle the first wrong algebra step.", logSeed: "Proof annotations mark equal sides and base angles." },
    628: { title: "Tables", purpose: "Present organised values.", badge: "Headers required", value: "Rule: y = 3x - 2", settings: [["Columns", "x, y"], ["Rows", "0..3"], ["Formula", "y = 3x - 2"], ["Action", "Add row"]], checklist: ["0, -2", "1, 1", "2, 4", "3, 7"], rule: "Tables need headings, units, formulas, and accessible headers.", trap: "Do not show values without row and column labels.", practice: "Try next: add x = 4 and compute y = 10.", logSeed: "Table row x = 3 was checked." },
    629: { title: "Multiple Pages", purpose: "Build lesson sequences.", badge: "Page 2 of 5", value: "Explore balance", settings: [["Lesson", "Solving linear equations"], ["Selected page", "Explore balance"], ["Pages", "Predict, Explore, Worked, Practice, Checkpoint"], ["Progress", "2 of 5"]], checklist: ["Predict", "Explore balance", "Worked example", "Practice", "Checkpoint"], rule: "Each page needs one clear purpose.", trap: "Do not put every task on one crowded page.", practice: "Try next: duplicate the Practice page and change the equation.", logSeed: "Page 2 preview is selected." },
    630: { title: "Reset Construction", purpose: "Restore initial state.", badge: "Reset construction", value: "A(0,0), B(5,0), C(2,3)", settings: [["Reset scope", "points"], ["Reset scope", "measurements"], ["Reset scope", "checkboxes"], ["Reset scope", "sliders"]], checklist: ["Initial state", "Changed state", "Drag C -> angle changed -> Reset -> restored"], rule: "Reset every linked starting value.", trap: "Partial reset can leave hidden errors.", practice: "Try next: reset a graph slider and a learner answer together.", logSeed: "Construction shows changed and initial states." },
    631: { title: "Undo and Redo", purpose: "Support experimentation.", badge: "Redo available", value: "P(2,4)", settings: [["Action history", "Add point P"], ["Step 2", "Drag P to x = 2"], ["Step 3", "Draw tangent"], ["Current", "Undo tangent"]], checklist: ["Undo reverses the latest action", "Redo available", "y = x²"], rule: "Undo reverses the latest action only; redo reapplies the undone action.", trap: "Do not offer undo without storing action history.", practice: "Try next: undo a dragged point, then redo it.", logSeed: "Action pointer sits after tangent undo." },
    632: { title: "Object Locking", purpose: "Protect instructional elements.", badge: "Unlocked: point P", value: "Locked: axes, grid, y = x", settings: [["Axes", "locked"], ["Grid", "locked"], ["Reference line", "locked"], ["Point P", "unlocked"]], checklist: ["Drag P onto the line", "Lock support objects", "Leave learner objects editable"], rule: "Lock supports that should not move; leave learner objects editable.", trap: "Do not lock everything; learners still need movable objects.", practice: "Try next: lock a target region but leave the answer point free.", logSeed: "Locked support stays still; learner object still moves." },
    633: { title: "Conditional Feedback", purpose: "Respond to learner input.", badge: "Test cases passed", value: "Correct", settings: [["Problem", "Solve: 2x + 4 = 10"], ["Learner answer", "x = 3"], ["If answer = 7", "Forgot to divide by 2"], ["If answer = -3", "Check the sign"]], checklist: ["Correct", "Feedback should say what to fix", "Test cases passed"], rule: "Conditional feedback maps learner answers to specific messages.", trap: "Avoid only right/wrong messages; say what to fix.", practice: "Try next: add a branch for x = 5.", logSeed: "Feedback branch selected Correct." },
    634: { title: "Custom Tool Builder", purpose: "Reuse construction procedures.", badge: "Test case passed", value: "Midpoint Tool", settings: [["Tool name", "Midpoint Tool"], ["Inputs", "Point A, Point B"], ["Output", "midpoint M"], ["Action", "Save tool"]], checklist: ["A(1,2)", "B(5,6)", "M(3,4)", "Save tool"], rule: "A custom tool packages inputs, construction steps, and outputs.", trap: "Do not hide inputs; name all needed inputs and outputs.", practice: "Try next: reuse the tool with A(0,0) and B(6,2).", logSeed: "Midpoint Tool test case passed." },
    635: { title: "Command Library", purpose: "Expose advanced functionality.", badge: "Circle command", value: "Circle(A, 3)", settings: [["Search", "Circle"], ["Syntax", "Circle(center, radius)"], ["Example", "Circle(A, 3)"], ["Inputs", "A(1,2), radius = 3"]], checklist: ["A(1,2)", "radius = 3", "Command tested"], rule: "Read command syntax before use.", trap: "Input order matters. Wrong order: Circle(3, A).", practice: "Try next: test Circle(center, radius) before adding it to a worksheet.", logSeed: "Command tested: Circle(A, 3)." },
    636: { title: "Object Scripting", purpose: "Run code when objects are used.", badge: "On drag end", value: "Inside target", settings: [["Event", "On drag end"], ["Condition", "Distance(P, C) < 1"], ["Action", "SetColor(P, green)"], ["Feedback", "Inside target"]], checklist: ["On click", "On drag", "On update", "Script ran successfully"], rule: "Attach code to the event that matches the learner action.", trap: "Event must match learner action.", practice: "Try next: drag point P into the target circle centered C(3,2), radius 1.", logSeed: "Script ran successfully after drag end." },
    637: { title: "Randomisation", purpose: "Generate valid variants.", badge: "Seed 1842", value: "4x + 6 = 18", settings: [["a", "2..6"], ["x", "-5..5"], ["b", "-10..10"], ["Seed", "1842"]], checklist: ["integer solution", "no division by zero", "variants"], rule: "Set ranges and constraints so generated tasks stay valid.", trap: "Do not randomise values that can make an impossible question.", practice: "Try next: regenerate a linear equation and keep the solution integer.", logSeed: "Generated 4x + 6 = 18 with x = 3." },
    638: { title: "Automatic Checking", purpose: "Accept equivalent answers.", badge: "Equivalent accepted", value: "2(x + 3)", settings: [["Student answer", "2(x + 3)"], ["Accepted", "2x + 6"], ["Accepted", "6 + 2x"], ["Tolerance", "exact algebra"]], checklist: ["Parse", "Simplify", "Compare", "Feedback"], rule: "Automatic checking should parse, simplify, compare, and return feedback.", trap: "Do not reject an equivalent expression such as 2(x + 3).", practice: "Try next: check whether 2(x + 3) and 2x + 6 are equivalent.", logSeed: "Rule passes: equivalent answer accepted." },
    639: { title: "Import and Export", purpose: "Share complete lesson packages.", badge: "Ready to share", value: "linear-equations-lab.mujson", settings: [["Package", "linear-equations-lab.mujson"], ["Import", "drag/drop import zone"], ["Export", "selector"], ["Compatibility", "Compatible"]], checklist: ["Assets", "Variables", "Answer rules", "Metadata"], rule: "Import and export should preserve assets, variables, answer rules, and metadata.", trap: "Check compatibility before sharing a package.", practice: "Try next: preview a package, read the import log, then export it.", logSeed: "Package preview is compatible and ready to share." },
    640: { title: "Concept Introduction", purpose: "Introduce definitions and notation.", badge: "Direct variation", value: "y = 3x", settings: [["Definition", "Direct variation"], ["Rule", "y = 3x"], ["Start value", "x = 2, y = 6"], ["Test value", "x = 4, y = 12"]], checklist: ["Predict", "Test", "Explain"], rule: "When x doubles, y doubles.", trap: "Do not begin with disconnected rules; link notation to a model.", practice: "Try next: predict what happens when x changes from 2 to 4.", logSeed: "Direct variation introduction is ready." },
    641: { title: "Visualise", purpose: "Choose a visual that shows the relationship.", badge: "All views linked", value: "y = 2x + 1", settings: [["Pattern", "tiles"], ["Machine", "input-output"], ["Table", "x and y"], ["Graph", "y = 2x + 1"]], checklist: ["x = 3", "y = 7", "All views update together"], rule: "Visualise relationships by linking representations.", trap: "Pretty alone is not enough; the visual must reveal the relationship.", practice: "Try next: move the slider to x = 3 and confirm y = 7 everywhere.", logSeed: "Representation link confirmed." },
    642: { title: "Manipulative Laboratory", purpose: "Give controls and a focused question.", badge: "Balance preserved", value: "x = 4", settings: [["Equation", "2x + 3 = 11"], ["Action", "Drag tiles"], ["Step", "remove 3 both sides"], ["Step", "divide by 2"]], checklist: ["2x = 8", "x = 4", "Balance preserved"], rule: "Manipulatives should show why each operation preserves equality.", trap: "Exploration needs a goal, not just movable tiles.", practice: "Try next: remove 3 from both sides, then divide the remaining tiles by 2.", logSeed: "Balance preserved after solving x = 4." },
    643: { title: "Guided Exploration", purpose: "Use a clear question sequence.", badge: "m = 1.5", value: "y = 1.5x + 1", settings: [["Variable", "slope m"], ["Line", "y = mx + 1"], ["Ghosts", "m = -1, 0.5, 2"], ["Prompt", "Steeper lines have larger |m|"]], checklist: ["Notice", "Change", "Compare", "Conclude"], rule: "Guided exploration should move from noticing to testing and explaining.", trap: "Questions need a clear sequence.", practice: "Try next: drag the slope and compare ghost lines.", logSeed: "Exploration conclusion recorded." },
    644: { title: "Predict-Test-Explain", purpose: "Record prediction before testing.", badge: "a = 2", value: "y = ax²", settings: [["Prediction", "curve gets narrower"], ["Test", "a = 2"], ["Vertex", "(0,0)"], ["Evidence", "At x = 2, y = 8"]], checklist: ["Prediction: curve gets narrower", "Test: a = 2", "Evidence", "Explain"], rule: "Prediction comes before testing.", trap: "Do not change the claim after seeing the graph.", practice: "My explanation: increasing a makes y-values farther from zero for the same x.", logSeed: "Predict-Test-Explain cycle captured." },
    645: { title: "Worked Example", purpose: "Show steps, reasons, and answer.", badge: "Roots confirmed", value: "x = 2 or x = 3", settings: [["Problem", "x² - 5x + 6 = 0"], ["Factor", "(x - 2)(x - 3) = 0"], ["Product", "6"], ["Sum", "-5"]], checklist: ["x = 2", "x = 3", "Both roots confirmed"], rule: "Worked examples should connect symbolic steps to reasons.", trap: "Steps need reasons, not just answers.", practice: "Try next: check both roots on the graph intercepts.", logSeed: "Worked example roots confirmed." },
    646: { title: "Step-by-Step Practice", purpose: "Check one useful step at a time.", badge: "Correct step", value: "x = 5", settings: [["Problem", "3x - 4 = 11"], ["Step 1", "Add 4"], ["Step 2", "3x = 15"], ["Step 3", "Divide by 3"]], checklist: ["x = 5", "3(5)-4=11", "hints"], rule: "Middle steps matter.", trap: "Do not skip straight to the final answer.", practice: "Try next: use the balance mini model to justify Add 4.", logSeed: "Correct step accepted." },
    647: { title: "Construction Challenge", purpose: "State goal, tools, and success checks.", badge: "Construction valid", value: "PQ ⟂ AB", settings: [["Goal", "Construct the perpendicular bisector of AB"], ["Tool", "compass arcs"], ["Line", "PQ"], ["Point", "midpoint M"]], checklist: ["AM = MB", "PQ ⟂ AB", "Construction valid"], rule: "Conditions must be exact.", trap: "Do not accept a visual guess; verify equal distances and right angle.", practice: "Try next: draw arcs from A and B, connect P and Q, then mark M.", logSeed: "Construction valid: AM = MB and PQ ⟂ AB." },
    648: { title: "Graph Matching", purpose: "Compare key graph features.", badge: "1 of 3 matched", value: "y = 2x + 1", settings: [["Equation", "y = 2x + 1"], ["Equation", "y = -x + 4"], ["Equation", "y = x² - 1"], ["Action", "drag to match"]], checklist: ["correct match", "use slope and intercept", "1 of 3 matched"], rule: "Graph matching should use features, equations, and tables.", trap: "Do not match only by rough appearance.", practice: "Try next: match y = 2x + 1 using slope and intercept.", logSeed: "Graph match accepted for y = 2x + 1." },
    650: { title: "Multiple Representations", purpose: "Link forms to the same idea.", badge: "All forms agree", value: "y = x + 2", settings: [["Equation", "y = x + 2"], ["Table", "x = 3, y = 5"], ["Mapping", "3 -> 5"], ["Verbal", "add 2"]], checklist: ["Equation", "Table", "Mapping", "Graph", "Verbal rule"], rule: "Views should stay in sync.", trap: "Do not let representations show different values.", practice: "Try next: select x = 3 and verify y = 5 in every form.", logSeed: "All forms agree at x = 3, y = 5." },
    651: { title: "Real-World Application", purpose: "Define context, variables, and units.", badge: "Choose Plan A", value: "8 GB", settings: [["Plan A", "C = 199 + 20g"], ["Plan B", "C = 99 + 35g"], ["Usage", "8 GB"], ["Break-even", "6.67 GB"]], checklist: ["compare total cost", "recommend", "Choose Plan A"], rule: "The story must affect the math.", trap: "Include units so the recommendation is meaningful.", practice: "Try next: compare both mobile plans at 8 GB.", logSeed: "Recommendation: Choose Plan A." },
    653: { title: "Dynamic Question Generator", purpose: "Set allowed values and answer rules.", badge: "4 valid questions", value: "17/12", settings: [["Template", "a/b + c/d"], ["Generated", "2/3 + 3/4"], ["Common denominator", "12"], ["Answer", "17/12 = 1 5/12"]], checklist: ["simplified", "generate new", "4 valid questions"], rule: "Generated questions must stay valid.", trap: "Do not generate fractions without a simplification rule.", practice: "Try next: generate a new fraction addition question.", logSeed: "Generated question simplified to 17/12." },
    654: { title: "Mastery Challenge", purpose: "Require steps, answer, and explanation.", badge: "3/4", value: "Almost there", settings: [["Topic", "linear functions checkpoint"], ["Questions", "4 questions"], ["Current", "Question 4"], ["Task", "Explain y-intercept"]], checklist: ["score 3/4", "confidence slider", "review mistake"], rule: "Mastery should show independence.", trap: "Do not count a score without explanation and review.", practice: "Try next: explain the y-intercept, then review the mistake.", logSeed: "Mastery almost there: 3/4." },
  };
  return specs[lessonId] ?? specs[618];
}

function renderAuthoringVisual(lessonId: number, value: number): ReactNode {
  if (lessonId === 618) return <SliderAuthoringVisual a={value} />;
  if (lessonId === 619) return <CheckboxAuthoringVisual />;
  if (lessonId === 620) return <ButtonAuthoringVisual />;
  if (lessonId === 621) return <InputBoxAuthoringVisual />;
  if (lessonId === 622) return <DropdownAuthoringVisual />;
  if (lessonId === 623) return <DynamicTextAuthoringVisual />;
  if (lessonId === 624) return <FormulaDisplayAuthoringVisual />;
  if (lessonId === 625) return <ImageObjectAuthoringVisual />;
  if (lessonId === 626) return <AudioVideoAuthoringVisual />;
  if (lessonId === 627) return <PenHighlighterAuthoringVisual />;
  if (lessonId === 628) return <TablesAuthoringVisual />;
  if (lessonId === 629) return <MultiplePagesAuthoringVisual />;
  if (lessonId === 630) return <ResetConstructionAuthoringVisual />;
  if (lessonId === 631) return <UndoRedoAuthoringVisual />;
  if (lessonId === 632) return <ObjectLockingAuthoringVisual />;
  if (lessonId === 633) return <ConditionalFeedbackAuthoringVisual />;
  if (lessonId >= 635) return <AdvancedAuthoringVisual lessonId={lessonId} />;
  return <CustomToolAuthoringVisual />;
}

function AuthoringCanvas({ children }: { children: ReactNode }) {
  return <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/70">{children}</div>;
}

function MiniGraph({ children, label }: { children: ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 360 260" className="w-full rounded-3xl bg-white ring-1 ring-slate-200" role="img" aria-label={label}>
      <defs>
        <pattern id="authoringGrid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke="#e2e8f0" /></pattern>
      </defs>
      <rect width="360" height="260" fill="url(#authoringGrid)" />
      <line x1="30" y1="220" x2="330" y2="220" stroke="#334155" strokeWidth="2" />
      <line x1="180" y1="30" x2="180" y2="235" stroke="#334155" strokeWidth="2" />
      {children}
    </svg>
  );
}

function SliderAuthoringVisual({ a }: { a: number }) {
  const curve = (factor: number) => Array.from({ length: 21 }, (_, index) => {
    const x = -3 + index * 0.3;
    const y = factor * x * x;
    return `${180 + x * 42},${220 - y * 18}`;
  }).join(" ");
  return (
    <AuthoringCanvas>
      <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
        <div>
          <MiniGraph label="Parabola y equals a x squared controlled by parameter slider">
            <polyline points={curve(0.5)} fill="none" stroke="#67e8f9" strokeWidth="3" />
            <polyline points={curve(1)} fill="none" stroke="#a78bfa" strokeWidth="3" />
            <polyline points={curve(1.5)} fill="none" stroke="#c084fc" strokeWidth="3" />
            <polyline points={curve(a)} fill="none" stroke="#0f766e" strokeWidth="6" />
            <text x="232" y="62" fill="#0f766e" fontWeight="900">a = {a.toFixed(1)}</text>
          </MiniGraph>
          <p className="mt-3 rounded-2xl bg-violet-50 p-3 text-center font-mono text-xl font-black text-violet-900">y = a x². Move slider -&gt; equation updates -&gt; graph changes.</p>
        </div>
        <div className="space-y-3">
          {["Min 0", "Max 2", "Step 0.1", "Default 1.2", "Keyboard supported", "Meaningful range required"].map((chip) => <span key={chip} className="block rounded-2xl bg-amber-50 p-3 font-black text-amber-900 ring-1 ring-amber-200">{chip}</span>)}
        </div>
      </div>
    </AuthoringCanvas>
  );
}

function CheckboxAuthoringVisual() {
  return (
    <AuthoringCanvas>
      <div className="grid gap-4 lg:grid-cols-[230px_1fr]">
        <div className="space-y-2">
          {["Show grid", "Show tangent", "Show area"].map((label, index) => <label key={label} className="flex items-center justify-between rounded-2xl bg-cyan-50 p-3 font-black text-cyan-950 ring-1 ring-cyan-100"><span>{label}</span><input type="checkbox" checked={index < 2} readOnly /></label>)}
          <p className="rounded-2xl bg-amber-50 p-3 font-black text-amber-900">Checked = visible. Unchecked = hidden.</p>
        </div>
        <MiniGraph label="Checkbox layer preview for y equals x squared">
          <polyline points="80,210 115,175 145,140 180,125 215,140 245,175 280,210" fill="none" stroke="#7c3aed" strokeWidth="5" />
          <line x1="118" y1="162" x2="276" y2="70" stroke="#f59e0b" strokeWidth="4" />
          <text x="222" y="83" fill="#92400e" fontWeight="900">tangent visible</text>
          <text x="214" y="190" fill="#64748b" fontWeight="900">area hidden</text>
        </MiniGraph>
      </div>
      <p className="mt-3 rounded-2xl bg-green-50 p-3 text-center font-black text-green-900">Use one checkbox for one true-or-false choice. Independent layer controls.</p>
    </AuthoringCanvas>
  );
}

function ButtonAuthoringVisual() {
  const points = [[0, 1], [1, 3], [2, 5], [3, 7]];
  return (
    <AuthoringCanvas>
      <div className="grid gap-4 lg:grid-cols-[1fr_230px]">
        <MiniGraph label="Button plots next point on y equals two x plus one">
          <line x1="80" y1="190" x2="260" y2="70" stroke="#7c3aed" strokeWidth="5" />
          {points.map(([x, y], index) => <g key={x}><circle cx={85 + x * 55} cy={205 - y * 18} r={index === 3 ? 12 : 8} fill={index === 3 ? "#f59e0b" : "#14b8a6"} /><text x={94 + x * 55} y={200 - y * 18} fontWeight="900">({x},{y})</text></g>)}
        </MiniGraph>
        <div className="space-y-3">
          <button type="button" className="w-full rounded-2xl bg-teal-600 px-4 py-3 font-black text-white">Plot next point</button>
          <p className="rounded-2xl bg-violet-50 p-3 font-mono font-black text-violet-900">y = 2x + 1</p>
          <p className="rounded-2xl bg-amber-50 p-3 font-black text-amber-900">Next point: (3, 7)</p>
          <p className="rounded-2xl bg-green-50 p-3 font-black text-green-900">Click -&gt; add point -&gt; update table. Feedback: point plotted.</p>
        </div>
      </div>
    </AuthoringCanvas>
  );
}

function InputBoxAuthoringVisual() {
  return (
    <AuthoringCanvas>
      <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
        <MiniGraph label="Line through points zero one and two five with rise run slope two">
          <line x1="80" y1="190" x2="250" y2="80" stroke="#7c3aed" strokeWidth="5" />
          <polyline points="110,172 220,172 220,100" fill="none" stroke="#f59e0b" strokeWidth="4" />
          <circle cx="110" cy="172" r="8" fill="#14b8a6" /><circle cx="220" cy="100" r="8" fill="#14b8a6" />
          <text x="82" y="166" fontWeight="900">(0,1)</text><text x="230" y="96" fontWeight="900">(2,5)</text>
        </MiniGraph>
        <div className="space-y-3">
          <p className="font-black">What is the slope?</p>
          <label className="block rounded-2xl bg-white p-3 ring-1 ring-slate-200">Typed answer: 2<input className="mt-2 w-full rounded-xl border border-emerald-300 px-3 py-2 font-mono font-black" value="2" readOnly /></label>
          <p className="rounded-2xl bg-green-50 p-3 font-black text-green-900">Correct</p>
          <p className="rounded-2xl bg-slate-950 p-3 font-mono font-black text-white">Δy/Δx = (5 - 1)/(2 - 0) = 2</p>
          <p className="rounded-2xl bg-amber-50 p-3 font-black text-amber-900">Accepted format: number. Tolerance: ±0.01. Placeholder: type slope.</p>
        </div>
      </div>
    </AuthoringCanvas>
  );
}

function DropdownAuthoringVisual() {
  return (
    <AuthoringCanvas>
      <div className="grid gap-4 lg:grid-cols-[230px_1fr_220px]">
        <div className="space-y-3">
          <label className="block font-black">Representation<select className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 font-black" value="Graph" onChange={() => undefined}><option>Graph</option></select></label>
          <p className="rounded-2xl bg-cyan-50 p-3 font-black text-cyan-900">Default: Graph</p>
          <p className="rounded-2xl bg-amber-50 p-3 font-black text-amber-900">Prepared choices</p>
        </div>
        <MiniGraph label="Graph of f of x equals x squared minus one">
          <polyline points="70,55 100,115 135,165 180,190 225,165 260,115 290,55" fill="none" stroke="#7c3aed" strokeWidth="5" />
          <text x="210" y="72" fill="#7c3aed" fontWeight="900">f(x) = x² - 1</text>
        </MiniGraph>
        <div className="grid gap-2 text-sm font-mono font-black">
          {["Mapping", "Table", "Graph"].map((item) => <span key={item} className={item === "Graph" ? "rounded-2xl bg-teal-600 p-3 text-center text-white" : "rounded-2xl bg-slate-50 p-3 text-center ring-1 ring-slate-200"}>{item}</span>)}
          <p className="rounded-2xl bg-green-50 p-3 font-sans font-black text-green-900">Use for mutually exclusive options.</p>
        </div>
      </div>
    </AuthoringCanvas>
  );
}

function DynamicTextAuthoringVisual() {
  return (
    <AuthoringCanvas>
      <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
        <MiniGraph label="Point P at two four on y equals x squared with tangent slope four">
          <polyline points="80,210 115,175 145,140 180,125 215,140 245,175 280,210" fill="none" stroke="#7c3aed" strokeWidth="5" />
          <line x1="186" y1="150" x2="290" y2="55" stroke="#f59e0b" strokeWidth="4" />
          <circle cx="230" cy="92" r="10" fill="#14b8a6" /><text x="238" y="90" fontWeight="900">P(2,4)</text>
        </MiniGraph>
        <div className="space-y-3">
          <p className="rounded-2xl bg-slate-950 p-4 text-center font-black text-white">When x = 2, f(x) = 4.</p>
          <p className="rounded-2xl bg-cyan-50 p-3 font-black text-cyan-900">Moving P updates the explanation automatically.</p>
          <p className="rounded-2xl bg-white p-3 font-mono font-black ring-1 ring-slate-200">Template: When x = {"{x}"}, f(x) = {"{y}"}.</p>
          <p className="rounded-2xl bg-amber-50 p-3 font-black text-amber-900">x = 2; y = 4; slope = 4</p>
        </div>
      </div>
    </AuthoringCanvas>
  );
}

function FormulaDisplayAuthoringVisual() {
  return (
    <AuthoringCanvas>
      <div className="grid gap-4 lg:grid-cols-[1fr_250px]">
        <div className="rounded-3xl bg-violet-50 p-6 text-center ring-1 ring-violet-200">
          <p className="font-black text-violet-900">Quadratic formula</p>
          <p className="mt-4 font-mono text-3xl font-black text-violet-950">x = (-b ± √(b² - 4ac)) / 2a</p>
          <p className="mt-4 rounded-2xl bg-white p-3 font-mono font-black">For x² - 5x + 6 = 0</p>
          <div className="mt-3 grid gap-2 md:grid-cols-4">{["a = 1", "b = -5", "c = 6", "D = 1"].map((item) => <span key={item} className="rounded-2xl bg-amber-100 p-3 font-mono font-black text-amber-900">{item}</span>)}</div>
        </div>
        <div className="space-y-3">
          <p className="rounded-2xl bg-green-50 p-4 font-black text-green-900">Roots: x = 2, x = 3</p>
          <p className="rounded-2xl bg-cyan-50 p-3 font-black text-cyan-900">Define every symbol.</p>
          <p className="rounded-2xl bg-white p-3 font-black ring-1 ring-slate-200">Readable notation and accessible text alternative.</p>
        </div>
      </div>
    </AuthoringCanvas>
  );
}

function ImageObjectAuthoringVisual() {
  return (
    <AuthoringCanvas>
      <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
        <MiniGraph label="Right triangle reference image with anchors A B C">
          <polygon points="95,200 255,200 255,80" fill="#e0f2fe" stroke="#7c3aed" strokeWidth="4" strokeDasharray="8 4" />
          <polyline points="95,200 255,200 255,80 95,200" fill="none" stroke="#14b8a6" strokeWidth="6" />
          <text x="78" y="218" fontWeight="900">A(0,0)</text><text x="242" y="222" fontWeight="900">B(4,0)</text><text x="260" y="78" fontWeight="900">C(4,3)</text>
          <text x="155" y="192" fill="#92400e" fontWeight="900">base = 4</text><text x="260" y="145" fill="#92400e" fontWeight="900">height = 3</text><text x="135" y="125" fill="#92400e" fontWeight="900">hypotenuse = 5</text>
        </MiniGraph>
        <div className="space-y-3">
          <p className="rounded-2xl bg-cyan-50 p-3 font-black text-cyan-900">Right-triangle reference image</p>
          <p className="rounded-2xl bg-amber-50 p-3 font-black text-amber-900">Alt text required</p>
          <p className="rounded-2xl bg-green-50 p-3 font-black text-green-900">Images should support the mathematics.</p>
        </div>
      </div>
    </AuthoringCanvas>
  );
}

function AudioVideoAuthoringVisual() {
  return (
    <AuthoringCanvas>
      <div className="grid gap-4 lg:grid-cols-[1fr_250px]">
        <div className="rounded-3xl bg-slate-950 p-4 text-white">
          <p className="font-black">Slope explanation</p>
          <MiniGraph label="Video frame showing slope line y equals two x plus one">
            <line x1="85" y1="200" x2="270" y2="72" stroke="#7c3aed" strokeWidth="5" />
            <polyline points="120,176 230,176 230,100" fill="none" stroke="#f59e0b" strokeWidth="4" />
            <text x="132" y="168" fill="#92400e" fontWeight="900">run = 2</text><text x="236" y="138" fill="#92400e" fontWeight="900">rise = 4</text>
          </MiniGraph>
          <div className="mt-3 h-3 rounded-full bg-slate-700"><div className="h-full w-[23%] rounded-full bg-cyan-400" /></div>
          <p className="mt-2 font-mono font-black">00:18 / 01:20</p>
        </div>
        <div className="space-y-3">
          {["show rise", "show run", "state slope"].map((cue) => <span key={cue} className="block rounded-2xl bg-amber-50 p-3 font-black text-amber-900 ring-1 ring-amber-200">{cue}</span>)}
          <p className="rounded-2xl bg-cyan-50 p-3 font-black text-cyan-900">The slope is rise over run, so 4 divided by 2 equals 2.</p>
          <p className="rounded-2xl bg-green-50 p-3 font-black text-green-900">Captions on. Transcript attached. Keyboard controls.</p>
        </div>
      </div>
    </AuthoringCanvas>
  );
}

function PenHighlighterAuthoringVisual() {
  return (
    <AuthoringCanvas>
      <div className="grid gap-4 lg:grid-cols-[1fr_230px]">
        <svg viewBox="0 0 360 260" className="w-full rounded-3xl bg-white ring-1 ring-slate-200" role="img" aria-label="Triangle proof markup">
          <polygon points="180,35 70,215 290,215" fill="#ecfeff" stroke="#0f766e" strokeWidth="4" />
          <path d="M118 136 L132 144 M228 136 L214 144" stroke="#f59e0b" strokeWidth="5" />
          <path d="M70 215 Q95 188 122 206" fill="none" stroke="#22c55e" strokeWidth="10" opacity=".45" />
          <path d="M290 215 Q265 188 238 206" fill="none" stroke="#22c55e" strokeWidth="10" opacity=".45" />
          <text x="174" y="28" fontWeight="900">A</text><text x="55" y="235" fontWeight="900">B</text><text x="298" y="235" fontWeight="900">C</text>
          <text x="120" y="235" fill="#7c3aed" fontWeight="900">∠B = ∠C</text>
          <text x="95" y="86" fill="#7c3aed" fontWeight="900">AB = AC</text>
          <text x="88" y="128" fill="#7c3aed" fontWeight="900">Equal sides -&gt; equal base angles.</text>
        </svg>
        <div className="space-y-3">
          {["Pen", "Highlighter", "Eraser", "Undo"].map((tool) => <span key={tool} className="block rounded-2xl bg-violet-50 p-3 font-black text-violet-900 ring-1 ring-violet-200">{tool}</span>)}
          <p className="rounded-2xl bg-amber-50 p-3 font-black text-amber-900">Highlight givens. Mark conclusion. Write one reason.</p>
        </div>
      </div>
    </AuthoringCanvas>
  );
}

function TablesAuthoringVisual() {
  const rows = [["0", "-2"], ["1", "1"], ["2", "4"], ["3", "7"]];
  return (
    <AuthoringCanvas>
      <div className="grid gap-4 lg:grid-cols-[260px_1fr_230px]">
        <div className="overflow-hidden rounded-3xl ring-1 ring-slate-200">
          <div className="grid grid-cols-2 bg-teal-600 p-3 text-center font-black text-white"><span>x</span><span>y</span></div>
          {rows.map(([x, y]) => <div key={x} className={x === "3" ? "grid grid-cols-2 bg-amber-50 p-3 text-center font-mono font-black text-amber-900" : "grid grid-cols-2 border-t p-3 text-center font-mono font-black"}><span>{x}</span><span>{y}</span></div>)}
        </div>
        <MiniGraph label="Graph points from table y equals three x minus two">
          <line x1="80" y1="205" x2="260" y2="70" stroke="#7c3aed" strokeWidth="5" />
          {rows.map(([x, y]) => <circle key={x} cx={95 + Number(x) * 50} cy={180 - Number(y) * 18} r={x === "3" ? 11 : 8} fill={x === "3" ? "#f59e0b" : "#14b8a6"} />)}
        </MiniGraph>
        <div className="space-y-3">
          <p className="rounded-2xl bg-slate-950 p-3 font-mono font-black text-white">Rule: y = 3x - 2</p>
          <p className="rounded-2xl bg-green-50 p-3 font-black text-green-900">Row check: y = 3(3) - 2 = 7</p>
          <button type="button" className="w-full rounded-2xl bg-teal-600 px-3 py-2 font-black text-white">Add row</button>
          <p className="rounded-2xl bg-amber-50 p-3 font-black text-amber-900">Headers required</p>
        </div>
      </div>
    </AuthoringCanvas>
  );
}

function MultiplePagesAuthoringVisual() {
  return (
    <AuthoringCanvas>
      <div className="grid gap-4 lg:grid-cols-[210px_1fr_220px]">
        <div className="space-y-2">{["Predict", "Explore balance", "Worked example", "Practice", "Checkpoint"].map((page, index) => <span key={page} className={index === 1 ? "block rounded-2xl bg-teal-600 p-3 font-black text-white" : "block rounded-2xl bg-slate-50 p-3 font-black ring-1 ring-slate-200"}>{index + 1}. {page}</span>)}</div>
        <div className="rounded-3xl bg-violet-50 p-5 ring-1 ring-violet-200">
          <p className="font-black text-violet-900">Solving linear equations</p>
          <p className="mt-2 font-mono text-2xl font-black">2x + 4 = 10</p>
          <div className="mt-4 flex items-center justify-center gap-2 text-center font-black"><span className="rounded-2xl bg-cyan-100 px-5 py-4">2x + 4</span><span>=</span><span className="rounded-2xl bg-amber-100 px-5 py-4">10</span></div>
          <button type="button" className="mt-4 rounded-2xl bg-violet-700 px-4 py-2 font-black text-white">Next page</button>
        </div>
        <div className="space-y-3"><p className="rounded-2xl bg-cyan-50 p-3 font-black text-cyan-900">Page 2 of 5</p><p className="rounded-2xl bg-green-50 p-3 font-black text-green-900">Each page needs one clear purpose.</p><p className="rounded-2xl bg-amber-50 p-3 font-black text-amber-900">Progress dots: 2 of 5</p></div>
      </div>
    </AuthoringCanvas>
  );
}

function ResetConstructionAuthoringVisual() {
  return (
    <AuthoringCanvas>
      <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
        <svg viewBox="0 0 420 260" className="w-full rounded-3xl bg-white ring-1 ring-slate-200" role="img" aria-label="Initial and changed triangle states">
          <polygon points="65,205 185,205 112,88" fill="#ccfbf1" stroke="#14b8a6" strokeWidth="4" opacity=".55" />
          <polygon points="225,205 380,218 330,55" fill="#ffedd5" stroke="#f97316" strokeWidth="5" />
          <path d="M195 128 C220 112 224 112 246 128" fill="none" stroke="#7c3aed" strokeWidth="5" />
          <text x="70" y="38" fontWeight="900">Initial state</text><text x="252" y="38" fontWeight="900">Changed state</text>
          <text x="48" y="226" fontWeight="900">A(0,0)</text><text x="158" y="226" fontWeight="900">B(5,0)</text><text x="95" y="80" fontWeight="900">C(2,3)</text>
        </svg>
        <div className="space-y-3">
          <button type="button" className="w-full rounded-2xl bg-violet-700 px-4 py-3 font-black text-white">Reset construction</button>
          <p className="rounded-2xl bg-cyan-50 p-3 font-black text-cyan-900">Drag C -&gt; angle changed -&gt; Reset -&gt; restored</p>
          <p className="rounded-2xl bg-amber-50 p-3 font-black text-amber-900">Partial reset can leave hidden errors.</p>
        </div>
      </div>
    </AuthoringCanvas>
  );
}

function UndoRedoAuthoringVisual() {
  return (
    <AuthoringCanvas>
      <div className="grid gap-4 lg:grid-cols-[220px_1fr_210px]">
        <div className="space-y-2"><p className="font-black text-slate-900">Action history</p>{["Add point P", "Drag P to x = 2", "Draw tangent", "Undo tangent"].map((step, index) => <span key={step} className={index === 3 ? "block rounded-2xl bg-amber-50 p-3 font-black text-amber-900 ring-1 ring-amber-200" : "block rounded-2xl bg-violet-50 p-3 font-black text-violet-900 ring-1 ring-violet-200"}>{step}</span>)}</div>
        <MiniGraph label="Undo redo graph with point P on y equals x squared">
          <polyline points="80,210 115,175 145,140 180,125 215,140 245,175 280,210" fill="none" stroke="#7c3aed" strokeWidth="5" />
          <line x1="178" y1="150" x2="285" y2="60" stroke="#f59e0b" strokeWidth="4" strokeDasharray="8 5" opacity=".55" />
          <circle cx="230" cy="92" r="10" fill="#14b8a6" /><text x="238" y="90" fontWeight="900">P(2,4)</text><text x="232" y="55" fill="#7c3aed" fontWeight="900">y = x²</text>
        </MiniGraph>
        <div className="space-y-3"><button type="button" className="w-full rounded-2xl bg-cyan-600 p-3 font-black text-white">Undo</button><button type="button" className="w-full rounded-2xl bg-violet-700 p-3 font-black text-white">Redo</button><p className="rounded-2xl bg-green-50 p-3 font-black text-green-900">Redo available. Undo reverses the latest action.</p></div>
      </div>
    </AuthoringCanvas>
  );
}

function ObjectLockingAuthoringVisual() {
  return (
    <AuthoringCanvas>
      <div className="grid gap-4 lg:grid-cols-[220px_1fr_220px]">
        <div className="space-y-2">{["axes locked", "grid locked", "y = x locked", "point P unlocked"].map((item, index) => <span key={item} className={index === 3 ? "block rounded-2xl bg-teal-50 p-3 font-black text-teal-900 ring-1 ring-teal-200" : "block rounded-2xl bg-amber-50 p-3 font-black text-amber-900 ring-1 ring-amber-200"}>{item}</span>)}</div>
        <MiniGraph label="Object locking graph with locked reference line and unlocked point P">
          <line x1="70" y1="220" x2="290" y2="50" stroke="#7c3aed" strokeWidth="5" />
          <text x="214" y="64" fill="#7c3aed" fontWeight="900">Reference line y = x</text>
          <circle cx="230" cy="120" r="13" fill="#14b8a6" /><text x="238" y="118" fontWeight="900">P</text>
          <text x="92" y="70" fill="#92400e" fontWeight="900">Locked: axes, grid, y = x</text>
        </MiniGraph>
        <div className="space-y-3"><p className="rounded-2xl bg-cyan-50 p-3 font-black text-cyan-900">Unlocked: point P. Drag P onto the line.</p><p className="rounded-2xl bg-green-50 p-3 font-black text-green-900">Lock support objects. Leave learner objects editable.</p><p className="rounded-2xl bg-amber-50 p-3 font-black text-amber-900">Prevent accidental edits.</p></div>
      </div>
    </AuthoringCanvas>
  );
}

function ConditionalFeedbackAuthoringVisual() {
  return (
    <AuthoringCanvas>
      <div className="grid gap-4 lg:grid-cols-[230px_1fr_230px]">
        <div className="space-y-2">{["If answer = 3: Correct", "If answer = 7: Forgot to divide by 2", "If answer = -3: Check the sign"].map((rule) => <span key={rule} className="block rounded-2xl bg-white p-3 text-sm font-black ring-1 ring-slate-200">{rule}</span>)}</div>
        <div className="rounded-3xl bg-violet-50 p-5 text-center ring-1 ring-violet-200">
          <p className="font-mono text-2xl font-black text-violet-950">Solve: 2x + 4 = 10</p>
          <p className="mt-3 rounded-2xl bg-white p-3 font-black ring-1 ring-slate-200">Learner answer: x = 3</p>
          <div className="mt-4 grid gap-2 font-black"><span>response</span><span>↓</span><span className="rounded-2xl bg-cyan-100 p-3">condition</span><span>↓</span><span className="rounded-2xl bg-green-100 p-3 text-green-900">Correct</span></div>
        </div>
        <div className="space-y-3"><p className="rounded-2xl bg-green-50 p-3 font-black text-green-900">Correct: x = 3 because 2(3)+4=10.</p><p className="rounded-2xl bg-amber-50 p-3 font-black text-amber-900">Feedback should say what to fix.</p><p className="rounded-2xl bg-cyan-50 p-3 font-black text-cyan-900">Test cases passed.</p></div>
      </div>
    </AuthoringCanvas>
  );
}

type AdvancedVisualSpec = {
  heading: string;
  subtitle: string;
  primary: string;
  secondary: string;
  left: string[];
  right: string[];
  footer: string;
  graph?: "circle" | "line" | "parabola" | "balance" | "construction" | "cards";
};

function advancedVisualSpecFor(lessonId: number): AdvancedVisualSpec {
  const specs: Record<number, AdvancedVisualSpec> = {
    635: { heading: "Command Library", subtitle: "Expose advanced functionality.", primary: "Circle(center, radius)", secondary: "Circle(A, 3)", left: ["Search: Circle", "A(1,2)", "radius = 3", "Wrong order: Circle(3, A)"], right: ["Input order matters", "Read command syntax before use", "Command tested"], footer: "Syntax panel, live coordinate circle, and test log stay together.", graph: "circle" },
    636: { heading: "Object Scripting", subtitle: "Event-driven learner feedback.", primary: "Distance(P, C) < 1", secondary: "SetColor(P, green)", left: ["On click", "On drag", "On update", "On drag end"], right: ["Inside target", "C(3,2), radius 1", "Script ran successfully", "Event must match learner action"], footer: "Dragging point P into the target circle runs the chosen script.", graph: "circle" },
    637: { heading: "Randomisation", subtitle: "Generated linear equation with integer solution.", primary: "4x + 6 = 18", secondary: "solution x=3", left: ["a 2..6", "x -5..5", "b -10..10", "seed 1842"], right: ["regenerate", "integer solution", "no division by zero", "variants"], footer: "The generator locks constraints before producing a new question.", graph: "cards" },
    638: { heading: "Automatic Checking", subtitle: "Equivalent expression accepted.", primary: "2(x + 3)", secondary: "2x + 6 = 6 + 2x", left: ["Student answer", "Accepted: 2x + 6", "Accepted: 6 + 2x", "exact algebra tolerance"], right: ["Parse", "Simplify", "Compare", "Feedback", "rule passes"], footer: "The rule pipeline accepts equivalent algebra instead of matching text.", graph: "cards" },
    639: { heading: "Import and Export", subtitle: "Package a lesson safely.", primary: "linear-equations-lab.mujson", secondary: "Compatible", left: ["drag/drop import zone", "export selector", "package preview", "import log"], right: ["Assets", "Variables", "Answer rules", "Metadata", "Ready to share"], footer: "Compatibility checks run before the package is shared.", graph: "cards" },
    640: { heading: "Concept Introduction", subtitle: "Introduce definitions and notation.", primary: "Direct variation", secondary: "y = 3x", left: ["x = 2", "y = 6", "x = 4", "y = 12"], right: ["When x doubles, y doubles", "Predict", "Test", "Explain"], footer: "A table and graph introduce the idea before formal practice.", graph: "line" },
    641: { heading: "Visualise", subtitle: "Linked representations for y = 2x + 1.", primary: "x = 3", secondary: "y = 7", left: ["pattern tiles", "input-output machine", "table", "graph"], right: ["All views update together", "Representation link confirmed"], footer: "Moving the selected value highlights every representation at once.", graph: "line" },
    642: { heading: "Manipulative Laboratory", subtitle: "Solve with balance tiles.", primary: "2x + 3 = 11", secondary: "x = 4", left: ["blue x tiles", "yellow unit tiles", "Drag tiles"], right: ["remove 3 both sides", "2x = 8", "divide by 2", "Balance preserved"], footer: "Each physical action is mirrored as an algebraic operation.", graph: "balance" },
    643: { heading: "Guided Exploration", subtitle: "Explore slope m in y = mx + 1.", primary: "y = 1.5x + 1", secondary: "Steeper lines have larger |m|", left: ["m = -1", "m = 0.5", "m = 2", "drag slope"], right: ["Notice", "Change", "Compare", "Conclude"], footer: "Ghost lines help learners compare before writing a conclusion.", graph: "line" },
    644: { heading: "Predict-Test-Explain", subtitle: "Coefficient a affects y = ax².", primary: "Prediction: curve gets narrower", secondary: "Test: a = 2", left: ["vertex remains (0,0)", "At x = 2, y = 8", "Evidence"], right: ["Explain", "My explanation", "a = 1 ghost", "a = 2 test"], footer: "The prediction stays visible next to the tested parabola.", graph: "parabola" },
    645: { heading: "Worked Example", subtitle: "Factor a quadratic step by step.", primary: "x² - 5x + 6 = 0", secondary: "(x - 2)(x - 3) = 0", left: ["Product:6", "Sum:-5", "factor tiles"], right: ["roots x=2 or x=3", "graph check", "intercepts", "Both roots confirmed"], footer: "Symbolic factoring, tile grouping, and graph intercepts verify each other.", graph: "parabola" },
    646: { heading: "Step-by-Step Practice", subtitle: "Solve one move at a time.", primary: "3x - 4 = 11", secondary: "x=5", left: ["Add 4", "3x=15", "Divide by 3"], right: ["correct step", "3(5)-4=11", "balance mini", "hints"], footer: "The checker validates the current step before unlocking the next.", graph: "balance" },
    647: { heading: "Construction Challenge", subtitle: "Construct the perpendicular bisector of AB.", primary: "AM = MB", secondary: "PQ ⟂ AB", left: ["segment AB", "compass arcs", "intersection P/Q", "midpoint M"], right: ["right angle", "Construction valid"], footer: "Compass arcs create points P and Q, then line PQ bisects AB.", graph: "construction" },
    648: { heading: "Graph Matching", subtitle: "Match equations to graphs and tables.", primary: "y=2x+1", secondary: "1 of 3 matched", left: ["y=-x+4", "y=x²-1", "drag to match"], right: ["correct match", "use slope and intercept"], footer: "Learners match by slope, intercept, and table values.", graph: "line" },
    650: { heading: "Multiple Representations", subtitle: "Five views of y=x+2.", primary: "x=3", secondary: "y=5", left: ["Equation", "Table", "Mapping", "Graph", "Verbal rule"], right: ["selected x=3, y=5", "connected", "All forms agree"], footer: "Changing the selected x keeps every representation synchronized.", graph: "line" },
    651: { heading: "Real-World Application", subtitle: "Compare mobile plans.", primary: "Plan A: C = 199 + 20g", secondary: "Plan B: C = 99 + 35g", left: ["usage 8 GB", "break-even 6.67 GB"], right: ["recommend Choose Plan A", "compare total cost"], footer: "The recommendation depends on usage and the break-even point.", graph: "line" },
    653: { heading: "Dynamic Question Generator", subtitle: "Fraction addition template.", primary: "a/b + c/d", secondary: "2/3 + 3/4", left: ["common denominator 12", "answer 17/12 = 1 5/12", "simplified"], right: ["generate new", "4 valid questions"], footer: "Generated values are checked before the new question is released.", graph: "cards" },
    654: { heading: "Mastery Challenge", subtitle: "Linear functions checkpoint.", primary: "Question 4", secondary: "Explain y-intercept", left: ["4 questions", "score 3/4", "confidence slider"], right: ["review mistake", "mastery almost there"], footer: "The checkpoint combines score, explanation, confidence, and review.", graph: "cards" },
  };
  return specs[lessonId] ?? specs[635];
}

function AdvancedAuthoringVisual({ lessonId }: { lessonId: number }) {
  const spec = advancedVisualSpecFor(lessonId);
  return (
    <AuthoringCanvas>
      <div className="grid gap-4 lg:grid-cols-[230px_minmax(0,1fr)_230px]">
        <div className="space-y-2">
          <p className="rounded-2xl bg-cyan-50 p-3 text-xs font-black uppercase tracking-wide text-cyan-900 ring-1 ring-cyan-100">{spec.heading}</p>
          {spec.left.map((item, index) => <span key={`${item}-${index}`} className="block rounded-2xl bg-white p-3 text-sm font-black text-slate-800 ring-1 ring-slate-200 dark:bg-slate-950 dark:text-slate-100">{item}</span>)}
        </div>
        <div className="space-y-3">
          <div className="rounded-3xl bg-slate-950 p-4 text-white shadow-sm">
            <p className="text-xs font-black uppercase tracking-wide text-cyan-200">{spec.subtitle}</p>
            <p className="mt-2 font-mono text-2xl font-black">{spec.primary}</p>
            <p className="mt-2 rounded-2xl bg-white/10 p-3 font-mono text-xl font-black">{spec.secondary}</p>
          </div>
          {renderAdvancedMiniature(spec)}
          <p className="rounded-2xl bg-violet-50 p-3 text-center text-sm font-black text-violet-950 ring-1 ring-violet-100">{spec.footer}</p>
        </div>
        <div className="space-y-2">
          {spec.right.map((item, index) => <span key={`${item}-${index}`} className="block rounded-2xl bg-emerald-50 p-3 text-sm font-black text-emerald-950 ring-1 ring-emerald-100">{item}</span>)}
        </div>
      </div>
    </AuthoringCanvas>
  );
}

function renderAdvancedMiniature(spec: AdvancedVisualSpec) {
  if (spec.graph === "circle") {
    return (
      <svg viewBox="0 0 420 240" className="w-full rounded-3xl bg-white ring-1 ring-slate-200" role="img" aria-label={`${spec.heading} circle preview`}>
        <rect width="420" height="240" fill="#f8fafc" />
        <line x1="30" y1="180" x2="390" y2="180" stroke="#94a3b8" strokeWidth="2" />
        <line x1="130" y1="30" x2="130" y2="215" stroke="#94a3b8" strokeWidth="2" />
        <circle cx="250" cy="100" r="70" fill="#cffafe" stroke="#0e7490" strokeWidth="5" />
        <circle cx="250" cy="100" r="11" fill="#f59e0b" />
        <text x="260" y="96" fontWeight="900">A(1,2)</text>
        <text x="278" y="142" fill="#0e7490" fontWeight="900">radius = 3</text>
      </svg>
    );
  }
  if (spec.graph === "parabola") {
    return (
      <MiniGraph label={`${spec.heading} parabola preview`}>
        <polyline points="78,68 112,126 146,168 180,184 214,168 248,126 282,68" fill="none" stroke="#a78bfa" strokeWidth="4" />
        <polyline points="95,32 126,112 156,164 180,184 204,164 234,112 265,32" fill="none" stroke="#0f766e" strokeWidth="6" />
        <text x="210" y="55" fill="#0f766e" fontWeight="900">{spec.secondary}</text>
      </MiniGraph>
    );
  }
  if (spec.graph === "balance") {
    return (
      <svg viewBox="0 0 420 220" className="w-full rounded-3xl bg-white ring-1 ring-slate-200" role="img" aria-label={`${spec.heading} balance preview`}>
        <line x1="210" y1="35" x2="210" y2="185" stroke="#334155" strokeWidth="5" />
        <line x1="90" y1="85" x2="330" y2="85" stroke="#334155" strokeWidth="5" />
        <path d="M75 95 h110 l-22 70 h-66zM235 95 h110 l-22 70 h-66z" fill="#e0f2fe" stroke="#0e7490" strokeWidth="4" />
        <text x="105" y="135" fontWeight="900">2x + 3</text>
        <text x="275" y="135" fontWeight="900">11</text>
        <text x="166" y="205" fill="#166534" fontWeight="900">{spec.secondary}</text>
      </svg>
    );
  }
  if (spec.graph === "construction") {
    return (
      <svg viewBox="0 0 420 240" className="w-full rounded-3xl bg-white ring-1 ring-slate-200" role="img" aria-label="Perpendicular bisector construction preview">
        <line x1="90" y1="145" x2="330" y2="145" stroke="#0f766e" strokeWidth="6" />
        <path d="M90 145 A92 92 0 0 1 210 58 M90 145 A92 92 0 0 0 210 232 M330 145 A92 92 0 0 0 210 58 M330 145 A92 92 0 0 1 210 232" fill="none" stroke="#7c3aed" strokeWidth="4" strokeDasharray="7 5" />
        <line x1="210" y1="45" x2="210" y2="232" stroke="#f59e0b" strokeWidth="5" />
        <text x="78" y="168" fontWeight="900">A</text><text x="332" y="168" fontWeight="900">B</text><text x="218" y="64" fontWeight="900">P</text><text x="218" y="226" fontWeight="900">Q</text><text x="178" y="138" fontWeight="900">M</text>
      </svg>
    );
  }
  if (spec.graph === "line") {
    return (
      <MiniGraph label={`${spec.heading} line preview`}>
        <line x1="80" y1="198" x2="282" y2="64" stroke="#7c3aed" strokeWidth="5" />
        <line x1="80" y1="92" x2="282" y2="198" stroke="#94a3b8" strokeWidth="3" strokeDasharray="8 6" />
        <circle cx="230" cy="98" r="12" fill="#f59e0b" />
        <text x="238" y="96" fontWeight="900">{spec.secondary}</text>
      </MiniGraph>
    );
  }
  return (
    <div className="grid gap-3 rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200 md:grid-cols-3">
      {[spec.primary, spec.secondary, spec.footer].map((item, index) => <div key={`${item}-${index}`} className="rounded-2xl bg-white p-4 text-center font-mono font-black text-slate-900 ring-1 ring-slate-200">{item}</div>)}
    </div>
  );
}

function CustomToolAuthoringVisual() {
  return (
    <AuthoringCanvas>
      <div className="grid gap-4 lg:grid-cols-[220px_1fr_230px]">
        <div className="space-y-2">{["Midpoint Tool", "Inputs: Point A, Point B", "Output: midpoint M"].map((item) => <span key={item} className="block rounded-2xl bg-cyan-50 p-3 font-black text-cyan-900 ring-1 ring-cyan-200">{item}</span>)}</div>
        <div>
          <MiniGraph label="Midpoint tool construction from A one two and B five six">
            <line x1="105" y1="170" x2="255" y2="70" stroke="#14b8a6" strokeWidth="4" />
            <circle cx="105" cy="170" r="10" fill="#14b8a6" /><text x="78" y="192" fontWeight="900">A(1,2)</text>
            <circle cx="255" cy="70" r="10" fill="#14b8a6" /><text x="262" y="70" fontWeight="900">B(5,6)</text>
            <circle cx="180" cy="120" r="12" fill="#7c3aed" /><text x="188" y="118" fill="#7c3aed" fontWeight="900">M(3,4)</text>
          </MiniGraph>
          <p className="mt-3 rounded-2xl bg-slate-950 p-3 text-center font-mono font-black text-white">M = ((x₁+x₂)/2, (y₁+y₂)/2)</p>
        </div>
        <div className="space-y-3"><p className="rounded-2xl bg-green-50 p-3 font-black text-green-900">Test case passed</p><button type="button" className="w-full rounded-2xl bg-violet-700 p-3 font-black text-white">Save tool</button><p className="rounded-2xl bg-amber-50 p-3 font-black text-amber-900">Choose any two points -&gt; midpoint appears.</p></div>
      </div>
    </AuthoringCanvas>
  );
}
