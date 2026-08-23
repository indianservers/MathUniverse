import { useEffect, useState } from "react";
import AdapterFrame from "../components/AdapterFrame";
import type { LessonAdapterProps } from "../types";

type PlatformSpec = {
  title: string;
  purpose: string;
  value: string;
  main: string;
  focus: string;
  left: string[];
  right: string[];
  warning: string;
  practice: string;
  mode: "grid" | "dark" | "cards" | "access";
};

export default function PlatformLessonAdapter({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const spec = platformSpecFor(lesson.id, lesson.title);
  const [position, setPosition] = useState(62);
  const [zoom, setZoom] = useState(150);
  const [active, setActive] = useState(true);

  useEffect(() => { setPosition(62); setZoom(150); setActive(true); }, [lesson.id, resetToken]);
  const move = (next: number) => { setPosition(Math.max(12, Math.min(88, next))); onInteraction(); };
  const reset = () => { setPosition(62); setZoom(100); setActive(true); onInteraction(); };

  return (
    <AdapterFrame title={`${lesson.title} capability check`} value={spec.value} footer={`${spec.title}: ${spec.practice}`}>
      <section className={spec.mode === "dark" ? "grid gap-4 rounded-3xl bg-slate-950 p-4 text-white xl:grid-cols-[240px_minmax(0,1fr)_260px]" : "grid gap-4 rounded-3xl bg-slate-50 p-4 dark:bg-slate-900 xl:grid-cols-[240px_minmax(0,1fr)_260px]"} aria-label={`${spec.title} platform capability lab`}>
        <aside className="space-y-3">
          <div className="rounded-3xl bg-white p-4 text-slate-900 shadow-sm ring-1 ring-cyan-100 dark:bg-slate-950 dark:text-white dark:ring-white/10">
            <p className="text-[10px] font-black uppercase tracking-wide text-cyan-700">Common tools and accessibility</p>
            <h2 className="mt-1 text-xl font-black">{spec.title}</h2>
            <p className="mt-1 text-sm font-bold text-slate-600 dark:text-slate-300">{spec.purpose}</p>
          </div>
          {spec.left.map((item, index) => <p key={`${item}-${index}`} className="rounded-2xl bg-white p-3 text-sm font-black text-slate-800 ring-1 ring-slate-200 dark:bg-white/10 dark:text-white dark:ring-white/10">{item}</p>)}
        </aside>

        <main className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wide text-violet-700">Live capability preview</p>
              <h3 className="text-2xl font-black text-slate-950 dark:text-white">{spec.main}</h3>
              <p className="mt-1 font-mono text-lg font-black text-violet-800 dark:text-violet-200">{spec.focus}</p>
            </div>
            <span className="rounded-2xl bg-cyan-50 px-3 py-2 text-sm font-black text-cyan-900 ring-1 ring-cyan-100">{active ? "Direct manipulation ready" : "Paused"}</span>
          </div>
          <div className="mt-4">{renderPlatformVisual(spec, position, zoom)}</div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <label className="rounded-2xl bg-slate-50 p-3 text-xs font-black uppercase text-slate-500 ring-1 ring-slate-200">Position<input aria-label={`${spec.title} position`} type="range" min="12" max="88" value={position} onChange={(event) => move(Number(event.target.value))} className="mt-2 w-full accent-cyan-600" /></label>
            <label className="rounded-2xl bg-slate-50 p-3 text-xs font-black uppercase text-slate-500 ring-1 ring-slate-200">Zoom<input aria-label={`${spec.title} zoom`} type="range" min="75" max="220" value={zoom} onChange={(event) => { setZoom(Number(event.target.value)); onInteraction(); }} className="mt-2 w-full accent-violet-600" /></label>
            <div className="flex gap-2">
              <button type="button" className="action-secondary flex-1 justify-center" onClick={() => { setActive((value) => !value); onInteraction(); }}>{active ? "Pause" : "Resume"}</button>
              <button type="button" className="action-secondary flex-1 justify-center" onClick={reset}>Reset view</button>
            </div>
          </div>
        </main>

        <aside className="space-y-3">
          {spec.right.map((item, index) => <p key={`${item}-${index}`} className="rounded-2xl bg-emerald-50 p-3 text-sm font-black text-emerald-950 ring-1 ring-emerald-100">{item}</p>)}
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm font-black leading-6 text-amber-900">{spec.warning}</div>
        </aside>
      </section>
    </AdapterFrame>
  );
}

function platformSpecFor(lessonId: number, title: string): PlatformSpec {
  const specs: Record<number, PlatformSpec> = {
    657: spec("Drag and Manipulate", "Make mathematics directly interactive.", "A(3, 2)", "Point A", "A(3, 2)", ["Drag target: 44 px", "Keyboard arrows supported", "Pointer, touch, and keyboard"], ["State updates live", "Direct manipulation ready", "Screen reader label"], "Do not make dragging mouse-only; the same state needs keyboard and touch alternatives.", "Move point A and confirm coordinates, distance, and equation update live.", "grid"),
    658: spec("Zoom and Pan", "Navigate large constructions.", "Zoom: 150%", "Pan to point P", "View changes, object stays fixed", ["Mini-map", "Viewport", "Wheel, pinch, and keyboard"], ["Reset view", "Pan arrows", "Keyboard shortcuts"], "Zoom changes the view, not the mathematical object.", "Use the mini-map to pan back to the circle and tangent.", "grid"),
    659: spec("Reset View", "Recover standard framing.", "View restored", "Standard view: 100%", "All objects visible", ["Current view: 220%", "Reset view", "Undo reset"], ["Learner work preserved", "View settings restored", "Safety guarantees"], "Resetting the view must not delete learner objects.", "Restore triangle ABC after an off-center zoom.", "grid"),
    660: spec("Undo and Redo", "Encourage safe experimentation.", "History ready", "reversible action history", "Undo stack -> current -> redo stack", ["Before state", "Current state", "Action timeline"], ["Undo", "Redo", "Keyboard shortcuts", "History-limit warning"], "History needs sensible limits so undo remains predictable.", "Undo a point drag, then redo the construction step.", "cards"),
    661: spec("Animation Player", "Observe continuous change.", "Play/pause", "Motion playback lab", "Pause to learn", ["Frame thumbnails", "Play/pause", "Step", "Speed"], ["Loop", "Keyboard support", "Reduced motion"], "Learners need pause control; motion should not hide the mathematics.", "Step through a sine-wave frame and compare neighboring positions.", "dark"),
    662: spec("Snap Controls", "Improve construction precision.", "Snap active", "Precision snapping lab", "Coordinate preview", ["Grid snap", "Angle snap", "Object snap", "Snap size"], ["Active target", "Keyboard nudge", "Snap strength"], "Hidden snap causes confusion; show what target is active.", "Snap a point to the grid, then nudge it one step.", "grid"),
    663: spec("Trace and Locus", "Observe motion and dependency.", "Trace on", "Locus recorder lab", "Trace is not the object", ["Moving point", "Driver arm", "Fading trace", "Sample count"], ["Trace controls", "Coordinates", "Path recorded"], "A trace records a path; it is not the movable object itself.", "Record a locus, clear it, and trace again.", "dark"),
    664: spec("Exact and Decimal Output", "Connect representations.", "Exact and decimal", "Exact/decimal comparison lab", "Rounded is not exact", ["Exact forms", "Decimal approximations", "Precision controls"], ["Copy exact", "Copy decimal", "Format preserved"], "Rounded decimals are approximations, not exact values.", "Compare sqrt(2), 1.4142, and a copied exact format.", "cards"),
    665: spec("Linked Views", "Synchronise representations.", "Sync locked", "Graph/table/symbolic dashboard", "One shared state", ["Selected point", "Graph", "Table", "Symbolic"], ["Sync lock", "Consistency checks", "Mismatch warning"], "Views should not disagree; every view must read the same state.", "Change one value and verify graph, table, and equation agree.", "dark"),
    666: spec("Save, Duplicate and Share", "Support continuity and collaboration.", "Version saved", "Project state and sharing lab", "Duplicate before editing", ["Save", "Duplicate", "Share link", "Permissions"], ["Collaborators", "Version timeline", "Portable state"], "Duplicate before changing originals when sharing with a class.", "Save a version, duplicate it, then set view-only sharing.", "cards"),
    667: spec("Export", "Reuse outputs elsewhere.", "Export ready", "Export center", "Preview check", ["Workspace preview", "PNG", "SVG", "PDF", "CSV"], ["Preservation badges", "Export settings", "Data retained"], "A picture may not preserve the underlying mathematical data.", "Export an image and a data-preserving format.", "grid"),
    668: spec("Teacher Presentation Mode", "Support classroom display.", "Audience view", "Classroom presentation console", "Student-safe view", ["Hidden answer", "Reveal controls", "Focus spotlight", "Timer"], ["Laser pointer", "Poll", "Freeze view", "Teacher notes"], "Reveal answers only when the class is ready.", "Freeze the student view, then reveal a single hint.", "dark"),
    669: spec("Learner Practice Mode", "Focus on solving.", "Attempt 2/4", "Practice cockpit", "Worked solution locked", ["Step-by-step algebra workspace", "Hint ladder", "Attempt history"], ["Feedback", "Mastery progress", "Reflection prompt"], "Practice needs useful feedback before showing the full worked solution.", "Solve one step, request a hint, then submit again.", "dark"),
    670: spec("Exam Mode", "Provide restricted calculator access.", "18:42", "Restricted assessment workspace", "Integrity checks passed", ["Timer", "Graph", "Table", "Keypad"], ["CAS disabled", "Hints disabled", "Share disabled", "Autosave"], "Assessment conditions must be fair and clearly restricted.", "Use allowed graph tools and complete the submission checklist.", "dark"),
    671: spec("Keyboard Navigation", "Ensure non-pointer access.", "Focus order", "Keyboard-only graphing workspace", "Visible focus rings", ["Numbered tab order", "Focus path map", "Roving tabindex"], ["Current focus inspector", "Shortcut command bar", "No pointer needed"], "Focus must be visible and movement must be predictable.", "Tab through graph controls and use shortcuts to move the point.", "dark"),
    672: spec("Screen Reader Support", "Improve accessibility.", "ARIA checked", "Accessibility lab", "Spoken math preview", ["Graph semantic labels", "MathML formula tree", "ARIA landmarks"], ["Live region transcript", "Speech mode controls", "Validation checklist"], "Important graph feedback needs an accessible text equivalent.", "Read the parabola summary through the live transcript.", "access"),
    673: spec("High Contrast and Large Text", "Support visual accessibility.", "150% text", "Visual accessibility lab", "WCAG AA passed", ["High-contrast graph", "Pattern-coded lines", "Large controls"], ["Contrast checks", "Standard preview", "High-contrast preview"], "Do not use colour alone; pair colour with labels and patterns.", "Switch to high contrast and verify both lines remain identifiable.", "access"),
    674: spec("Multi-Language Terminology", "Support broad curricula.", "Terminology valid", "Multilingual terminology lab", "Term equivalence map", ["Proof localization", "Triangle diagrams", "Glossary", "RTL preview"], ["Curriculum variants", "Pronunciation", "Terminology validation"], "Keep mathematical meaning stable across translated terms.", "Compare English, Hindi, Telugu, and Arabic proof labels.", "access"),
  };
  return specs[lessonId] ?? spec(title, "Keep controls predictable and accessible.", "Ready", title, "Accessible state", ["Pointer", "Touch", "Keyboard"], ["Readable labels", "Live feedback"], "Check view, state, and feedback.", "Test the capability with more than one input method.", "grid");
}

function spec(title: string, purpose: string, value: string, main: string, focus: string, left: string[], right: string[], warning: string, practice: string, mode: PlatformSpec["mode"]): PlatformSpec {
  return { title, purpose, value, main, focus, left, right, warning, practice, mode };
}

function renderPlatformVisual(spec: PlatformSpec, position: number, zoom: number) {
  if (spec.mode === "cards" || spec.mode === "access") {
    return (
      <div className="grid gap-3 rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200 md:grid-cols-2">
        {[spec.main, spec.focus, ...spec.left.slice(0, 2), ...spec.right.slice(0, 2)].map((item, index) => <div key={`${item}-${index}`} className="rounded-2xl bg-white p-4 font-black text-slate-900 ring-1 ring-slate-200"><span className="text-xs uppercase text-slate-500">State {index + 1}</span><p className="mt-1">{item}</p></div>)}
      </div>
    );
  }

  const dark = spec.mode === "dark";
  return (
    <svg viewBox="0 0 560 330" className={dark ? "w-full rounded-3xl bg-slate-900 ring-1 ring-white/10" : "w-full rounded-3xl bg-white ring-1 ring-slate-200"} role="img" aria-label={`${spec.title} mathematical workspace preview`}>
      <defs>
        <pattern id={`platform-grid-${spec.title.replace(/\W/g, "")}`} width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke={dark ? "#1e293b" : "#e2e8f0"} /></pattern>
      </defs>
      <rect width="560" height="330" fill={`url(#platform-grid-${spec.title.replace(/\W/g, "")})`} />
      <line x1="42" y1="260" x2="520" y2="260" stroke={dark ? "#94a3b8" : "#334155"} strokeWidth="2" />
      <line x1="110" y1="30" x2="110" y2="300" stroke={dark ? "#94a3b8" : "#334155"} strokeWidth="2" />
      <circle cx="210" cy="190" r="58" fill="none" stroke="#14b8a6" strokeWidth="5" />
      <line x1="178" y1="230" x2="430" y2="82" stroke="#7c3aed" strokeWidth="5" />
      <circle cx={80 + position * 4.2} cy={250 - (position % 35) * 4} r="17" fill="#f59e0b" />
      <path d="M170 225 C230 180 290 150 350 115" fill="none" stroke="#a78bfa" strokeWidth="4" strokeDasharray="7 6" />
      <rect x="410" y="24" width="112" height="78" rx="14" fill={dark ? "#0f172a" : "#eff6ff"} stroke="#38bdf8" strokeWidth="3" />
      <text x="426" y="54" fill={dark ? "#bae6fd" : "#075985"} fontWeight="900">Mini-map</text>
      <text x="426" y="80" fill={dark ? "#bae6fd" : "#075985"} fontWeight="900">Zoom: {zoom}%</text>
      <text x="370" y="300" fill={dark ? "#f8fafc" : "#0f172a"} fontWeight="900">{spec.focus}</text>
    </svg>
  );
}
