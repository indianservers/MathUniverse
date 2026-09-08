import { shareStudio, copyStudioLink } from "../../utils/shareStudio";
import { useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import StudioPageShell from "../../components/ui/StudioPageShell";
import {
  adaptivePerformancePolicy, assessTeacherActivity, auditAccessibleControls, checkpoint, createHistory,
  createProjectDeepLink, createStudioProject, differentiatePolynomial, exportStudioProject, labelledResult,
  readProjectDeepLink, importStudioProject, redoCheckpoint, responsiveStudioLayout, transferStudioObject, undoCheckpoint, type ProjectHistory,
} from "./studioPlatformEngine";

function Capability({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return <article data-enhancement-id={id} className="min-h-48 rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm"><h2 className="text-sm font-black">{title}</h2>{children}</article>;
}

function Output({ children, label = "Computed result" }: { children: unknown; label?: string }) {
  return <output aria-label={label} className="mt-3 block max-h-44 overflow-auto break-words rounded-lg bg-cyan-50 p-2 font-mono text-[11px] leading-5">{JSON.stringify(children, null, 2)}</output>;
}

export default function StudioProjectCenter() {
  const [loaded, setLoaded] = useState(() => { try { return typeof window === "undefined" ? null : readProjectDeepLink(window.location.href); } catch { return null; } });
  const [title, setTitle] = useState(loaded?.title ?? "Cross-studio investigation");
  const [notice, setNotice] = useState("");
  const [viewport, setViewport] = useState(960);
  const [points, setPoints] = useState(80_000);
  const [answer, setAnswer] = useState(1);
  const [history, setHistory] = useState<ProjectHistory<{ title: string }>>(() => createHistory({ title: loaded?.title ?? "Cross-studio investigation" }));
  const project = useMemo(() => {
    if (loaded) return { ...loaded, title };
    const next = createStudioProject(title, "algebra");
    next.objects.push({ id: "curve-1", kind: "expression", name: "Parabola", value: "x^2-4", sourceStudio: "algebra" });
    return next;
  }, [title, loaded]);
  const deepLink = useMemo(() => createProjectDeepLink(typeof window === "undefined" ? "https://math-universe.local" : window.location.origin, "/studio-projects", project), [project]);
  const activity = { title: "Differentiate", prompt: "Derivative of x² at x=1", expected: 2, tolerance: 0.001, hint: "Use the power rule." };
  const saveProject = () => { try { localStorage.setItem("math-universe:shared-project", exportStudioProject(project)); setNotice("Project saved locally."); } catch { setNotice("Local storage is unavailable. Copy the project link to keep your work."); } };
  const restore = () => { try { const raw = localStorage.getItem("math-universe:shared-project"); if (!raw) { setNotice("No saved project found."); return; } const saved = importStudioProject(raw); setLoaded(saved); setTitle(saved.title); setHistory(createHistory({ title: saved.title })); setNotice("Saved project restored."); } catch { setNotice("The saved project could not be opened."); } };
  const changeHistory = (direction: "undo" | "redo") => { const next = direction === "undo" ? undoCheckpoint(history) : redoCheckpoint(history); setHistory(next); setTitle(next.present.state.title); };
  const copyProject = async () => setNotice(await copyStudioLink(deepLink));

  return <StudioPageShell onShare={async () => { setNotice(await shareStudio(project.title, deepLink)); }} title="Studio Project Center" subtitle="Move mathematical work between studios with reproducible projects, checkpoints, accessible controls, and adaptive computation." breadcrumbs={["Home", "Studio", "Project Center"]} difficulty="All levels" estimatedMinutes={20} status={[{ id: "platform", label: "Shared capabilities", value: 10, tone: "green" }]}>
    <div className="space-y-4"><p role="status">{notice}</p>
      <section className="grid gap-3 rounded-xl border bg-white/80 p-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Project center controls">
        <label className="grid gap-1 text-xs font-bold"><span>Project title</span><input className="h-10 rounded-lg border px-2" value={title} onChange={(event) => setTitle(event.target.value)} /></label>
        <label className="grid gap-1 text-xs font-bold"><span>Preview width</span><input className="h-10 rounded-lg border px-2" type="number" value={viewport} onChange={(event) => setViewport(Number(event.target.value))} /></label>
        <label className="grid gap-1 text-xs font-bold"><span>Computation points</span><input className="h-10 rounded-lg border px-2" type="number" value={points} onChange={(event) => setPoints(Number(event.target.value))} /></label>
        <label className="grid gap-1 text-xs font-bold"><span>Activity answer</span><input className="h-10 rounded-lg border px-2" type="number" value={answer} onChange={(event) => setAnswer(Number(event.target.value))} /></label>
      </section>
      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3" aria-label="Ten shared studio enhancements">
        <Capability id="PLATFORM-01" title="1. Shared project format"><p className="mt-2 text-xs text-slate-600">One versioned JSON project carries objects and parameters across every studio.</p><button type="button" onClick={saveProject} className="mt-3 rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white">Save project locally</button><button type="button" onClick={restore} className="m-2 rounded-lg border px-3 py-2 text-xs font-bold">Open saved project</button><Output>{project}</Output></Capability>
        <Capability id="PLATFORM-02" title="2. Shareable deep links"><p className="mt-2 text-xs text-slate-600">The complete project is encoded in the URL, not hidden server state.</p><button type="button" onClick={() => void copyProject()} className="mt-3 rounded-lg border px-3 py-2 text-xs font-bold">Copy project link</button><Output>{deepLink}</Output></Capability>
        <Capability id="PLATFORM-03" title="3. Cross-studio transfer"><p className="mt-2 text-xs text-slate-600">Send this algebraic curve to Calculus with its provenance intact.</p><Output>{transferStudioObject(project.objects[0], "calculus")}</Output></Capability>
        <Capability id="PLATFORM-04" title="4. Common symbolic engine"><p className="mt-2 text-xs text-slate-600">All studios use the same coefficient order and exact polynomial derivative.</p><Output>{labelledResult(differentiatePolynomial([1, 0, -4]), "exact")}</Output></Capability>
        <Capability id="PLATFORM-05" title="5. Named undo checkpoints"><div className="mt-3 flex flex-wrap gap-2"><button type="button" className="rounded-lg border px-3 py-2 text-xs font-bold" onClick={() => setHistory((current) => checkpoint(current, { title }, `Rename to ${title}`))}>Checkpoint</button><button type="button" className="rounded-lg border px-3 py-2 text-xs font-bold" disabled={!history.past.length} onClick={() => changeHistory("undo")}>Undo</button><button type="button" className="rounded-lg border px-3 py-2 text-xs font-bold" disabled={!history.future.length} onClick={() => changeHistory("redo")}>Redo</button></div><Output>{history}</Output></Capability>
        <Capability id="PLATFORM-06" title="6. Accessible interaction"><p className="mt-2 text-xs text-slate-600">Labels, keyboard operation, contrast, and reduced-motion readiness are audited together.</p><Output>{auditAccessibleControls([{ label: "Project title", keyboard: true, contrastRatio: 7.2, reducedMotion: true }, { label: "Save project", keyboard: true, contrastRatio: 8.1, reducedMotion: true }])}</Output></Capability>
        <Capability id="PLATFORM-07" title="7. Responsive studio layout"><p className="mt-2 text-xs text-slate-600">Layout policy changes from a drawer to an expanded three-column workspace.</p><Output>{responsiveStudioLayout(viewport)}</Output></Capability>
        <Capability id="PLATFORM-08" title="8. Result provenance labels"><div className="mt-3 flex flex-wrap gap-2 text-xs font-bold"><span className="rounded-full bg-emerald-100 px-2 py-1">Exact</span><span className="rounded-full bg-amber-100 px-2 py-1">Approximate</span><span className="rounded-full bg-violet-100 px-2 py-1">Simulated</span><span className="rounded-full bg-cyan-100 px-2 py-1">Inferred</span></div><Output>{[labelledResult("2x", "exact"), labelledResult(3.14159, "approximate", { tolerance: 1e-5 }), labelledResult(0.48, "simulated", { samples: 10_000 }), labelledResult(0.52, "inferred", { confidence: 0.95 })]}</Output></Capability>
        <Capability id="PLATFORM-09" title="9. Teacher activities and analytics"><p className="mt-2 text-xs text-slate-600">Prompt: {activity.prompt}</p><Output>{assessTeacherActivity(activity, answer, 2)}</Output><Link to="/workspace/teach" className="mt-3 inline-flex rounded-lg border px-3 py-2 text-xs font-bold">Open Teacher Studio</Link></Capability>
        <Capability id="PLATFORM-10" title="10. Adaptive performance"><p className="mt-2 text-xs text-slate-600">Large workloads select worker execution and progressively refined quality.</p><Output>{adaptivePerformancePolicy(points, typeof navigator === "undefined" ? 4 : navigator.hardwareConcurrency || 4, typeof Worker !== "undefined")}</Output></Capability>
      </section>
    </div>
  </StudioPageShell>;
}
