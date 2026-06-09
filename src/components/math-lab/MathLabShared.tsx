import katex from "katex";
import { ArrowLeft, ChevronDown, ChevronLeft, ChevronRight, LucideIcon } from "lucide-react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SectionCard from "../ui/SectionCard";
import { BookmarkToolButton, CollapsibleTheorySection, FriendlyErrorBox, PracticeModeToggle, RelatedToolLinks, ShareSetupButton } from "../ui/UiFeedback";

const exploredToolsKey = "math-universe-explored-tools";
const defaultRelatedTools = [
  { label: "Graphing Calculator", route: "/math-lab/graphing-calculator" },
  { label: "Function Explorer", route: "/math-lab/function-explorer" },
  { label: "Matrix Operations", route: "/matrices" },
  { label: "Math Lab", route: "/math-lab" },
];
type LabPanel = "workspace" | "notes" | "related";

export function MathLabLayout({
  title,
  subtitle,
  children,
  notes,
  compactHeader = false,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  notes?: ReactNode;
  compactHeader?: boolean;
}) {
  const [notesOpen, setNotesOpen] = useState(true);
  const [activePanel, setActivePanel] = useState<LabPanel>("workspace");
  const location = useLocation();
  const relatedTools = defaultRelatedTools.filter((tool) => tool.route !== location.pathname);
  const panels: Array<{ id: LabPanel; label: string }> = [
    { id: "workspace", label: "Workspace" },
    ...(notes ? [{ id: "notes" as const, label: "Notes" }] : []),
    { id: "related", label: "Related" },
  ];
  useEffect(() => {
    document.title = `${title} | Math Universe`;
    try {
      const current = JSON.parse(localStorage.getItem(exploredToolsKey) ?? "[]");
      const list = Array.isArray(current) ? current.filter((item): item is string => typeof item === "string") : [];
      if (!list.includes(location.pathname)) {
        localStorage.setItem(exploredToolsKey, JSON.stringify([location.pathname, ...list]));
      }
    } catch {
      localStorage.setItem(exploredToolsKey, JSON.stringify([location.pathname]));
    }
  }, [location.pathname, title]);

  return (
    <div className="desktop-page-shell">
      {!compactHeader && (
      <section id="tool-overview" className="desktop-page-header rounded-xl border border-white/60 bg-white/85 p-3 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/75">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Link to="/" className="hover:text-cyan-600">Math Universe</Link>
          <span>/</span>
          <Link to="/math-lab" className="hover:text-cyan-600">Math Lab</Link>
          <span>/</span>
          <span className="text-cyan-700 dark:text-cyan-200">{title}</span>
        </div>
        <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-black uppercase text-cyan-700 dark:text-cyan-200">Interactive Math Tool</p>
            <h1 className="mt-1 truncate text-2xl font-black tracking-tight md:text-3xl">{title}</h1>
            <p className="mt-1 max-w-5xl text-sm leading-5 text-slate-600 dark:text-slate-300">{subtitle}</p>
          </div>
          <div className="compact-toolbar lg:justify-end">
            <Link to="/math-lab" className="action-secondary w-fit"><ArrowLeft className="h-4 w-4" />Back</Link>
            <ShareSetupButton label="Share" />
            <BookmarkToolButton id={location.pathname} title={title} label="Bookmark" />
            <PracticeModeToggle />
          </div>
        </div>
      </section>
      )}

      <div className="desktop-page-tabs mobile-safe-scroll thin-scrollbar">
        {compactHeader && (
          <div className="mr-2 flex shrink-0 items-center gap-2 px-2">
            <Link to="/math-lab" className="tool-button min-h-8 px-2" aria-label="Back to Math Lab"><ArrowLeft className="h-4 w-4" /></Link>
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-cyan-700 dark:text-cyan-200">{title}</p>
              <p className="hidden truncate text-xs text-slate-500 dark:text-slate-400 lg:block">{subtitle}</p>
            </div>
          </div>
        )}
        {panels.map((panel) => (
          <button
            key={panel.id}
            type="button"
            onClick={() => setActivePanel(panel.id)}
            className={`desktop-tab-button ${activePanel === panel.id ? "desktop-tab-button-active" : ""}`}
          >
            {panel.label}
          </button>
        ))}
      </div>

      <div className="desktop-tab-surface">
        {activePanel === "workspace" && (
          <div id="tool-workspace" className="desktop-page-scroll thin-scrollbar min-w-0 space-y-3">
            {children}
          </div>
        )}

        {activePanel === "notes" && notes && (
          <aside className="desktop-page-scroll thin-scrollbar desktop-sidebar-panel space-y-3">
            <button type="button" className="tool-button w-full justify-between" onClick={() => setNotesOpen((value) => !value)}>
              Educational notes
              <ChevronDown className={`h-4 w-4 transition ${notesOpen ? "rotate-180" : ""}`} />
            </button>
            {notesOpen && (
              <CollapsibleTheorySection title="Theory and guidance" defaultOpen>
                <div className="space-y-3">{notes}</div>
              </CollapsibleTheorySection>
            )}
          </aside>
        )}

        {activePanel === "related" && (
          <SectionCard id="related-tools" title="Related Tools" className="desktop-page-scroll thin-scrollbar h-full" compact>
            <RelatedToolLinks links={relatedTools} />
          </SectionCard>
        )}
      </div>

      <div className="hidden" aria-hidden>
        <div id="related-tools-anchor" />
        <div id="tool-workspace-anchor" />
      </div>
    </div>
  );
}

export function MathToolCard({
  icon: Icon,
  title,
  description,
  difficulty,
  useCases,
  route,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  difficulty: string;
  useCases: string[];
  route: string;
}) {
  return (
    <div className="group rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-xl hover:shadow-cyan-500/10 dark:border-white/10 dark:bg-white/5">
      <Link to={route} className="block">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700 transition group-hover:scale-105 dark:bg-cyan-400/15 dark:text-cyan-200">
            <Icon className="h-5 w-5" />
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 dark:bg-white/10 dark:text-slate-300">{difficulty}</span>
        </div>
        <h2 className="mt-3 text-lg font-black">{title}</h2>
        <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-slate-600 dark:text-slate-300">{description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {useCases.slice(0, 4).map((item) => <span key={item} className="mini-chip">{item}</span>)}
        </div>
        <span className="mt-4 inline-flex rounded-xl bg-slate-950 px-3 py-2 text-sm font-bold text-white transition group-hover:bg-cyan-600 dark:bg-white dark:text-slate-950">Open</span>
      </Link>
      <div className="mt-3 border-t border-slate-200 pt-3 dark:border-white/10">
        <BookmarkToolButton id={route} title={title} />
      </div>
    </div>
  );
}

export function MathToolRow({
  icon: Icon,
  title,
  description,
  difficulty,
  useCases,
  route,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  difficulty: string;
  useCases: string[];
  route: string;
}) {
  return (
    <Link to={route} className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 shadow-sm transition hover:border-cyan-300 hover:shadow-md dark:border-white/10 dark:bg-white/5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700 transition group-hover:scale-105 dark:bg-cyan-400/15 dark:text-cyan-200">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-black">{title}</span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-black text-slate-600 dark:bg-white/10 dark:text-slate-300">{difficulty}</span>
        </div>
        <p className="mt-0.5 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      <div className="hidden flex-wrap gap-1.5 md:flex">
        {useCases.slice(0, 3).map((item) => <span key={item} className="mini-chip text-[11px]">{item}</span>)}
      </div>
    </Link>
  );
}

export function FormulaBlock({ formula, title = "Formula" }: { formula: string; title?: string }) {
  const html = useMemo(() => katex.renderToString(formula, { displayMode: true, throwOnError: false }), [formula]);
  return (
    <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-3 dark:border-cyan-400/20 dark:bg-cyan-400/10">
      <p className="text-xs font-black uppercase text-cyan-700 dark:text-cyan-200">{title}</p>
      <div className="mt-2 overflow-x-auto [&_.katex-display]:my-0" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

export function StepPanel({ steps }: { steps: Array<{ title: string; explanation: string; formula?: string; result?: string }> }) {
  const [index, setIndex] = useState(0);
  const step = steps[Math.min(index, steps.length - 1)];
  if (!step) return null;
  return (
    <SectionCard title="Step Panel" compact>
      <div className="rounded-xl bg-slate-100 p-3 dark:bg-white/10">
        <p className="text-xs font-black uppercase text-cyan-700 dark:text-cyan-200">Step {index + 1} of {steps.length}</p>
        <h3 className="mt-1.5 text-lg font-black">{step.title}</h3>
        <p className="mt-1.5 text-sm leading-5 text-slate-600 dark:text-slate-300">{step.explanation}</p>
        {step.formula && <FormulaBlock title="Working" formula={step.formula} />}
        {step.result && <p className="mt-2 rounded-lg bg-emerald-50 p-2.5 font-mono font-bold text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-100">{step.result}</p>}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button className="tool-button" type="button" onClick={() => setIndex(Math.max(0, index - 1))}><ChevronLeft className="h-4 w-4" />Previous</button>
        <button className="tool-button" type="button" onClick={() => setIndex(Math.min(steps.length - 1, index + 1))}>Next<ChevronRight className="h-4 w-4" /></button>
      </div>
    </SectionCard>
  );
}

export function ResultCard({ title = "Result", result, verification, relatedTools = [] }: { title?: string; result: ReactNode; verification?: ReactNode; relatedTools?: Array<{ label: string; route: string }> }) {
  return (
    <SectionCard title={title} compact>
      <div className="result-pop rounded-xl bg-emerald-50 p-3 text-emerald-900 dark:bg-emerald-400/10 dark:text-emerald-100">{result}</div>
      {verification && <div className="mt-3 rounded-xl bg-slate-100 p-3 dark:bg-white/10">{verification}</div>}
      <div className="mt-3"><RelatedToolLinks links={relatedTools} /></div>
    </SectionCard>
  );
}

export function MathErrorBox({ error }: { error?: string }) {
  if (!error) return null;
  return <FriendlyErrorBox message={error} />;
}

export function ModuleShell({ title, purpose, planned }: { title: string; purpose: string; planned: string[] }) {
  return (
    <MathLabLayout title={title} subtitle={purpose} notes={<SectionCard title="Coming Next"><p className="text-sm leading-6 text-slate-600 dark:text-slate-300">This shell connects the route now without pretending finished features exist.</p></SectionCard>}>
      <SectionCard title="Purpose">
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{purpose}</p>
      </SectionCard>
      <SectionCard title="Planned Feature List">
        <div className="grid gap-3 md:grid-cols-2">
          {planned.map((item) => <div key={item} className="rounded-2xl bg-slate-100 p-4 text-sm font-semibold dark:bg-white/10">{item}</div>)}
        </div>
      </SectionCard>
    </MathLabLayout>
  );
}
