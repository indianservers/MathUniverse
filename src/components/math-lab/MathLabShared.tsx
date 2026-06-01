import katex from "katex";
import { ArrowLeft, ChevronDown, ChevronLeft, ChevronRight, LucideIcon } from "lucide-react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SectionCard from "../ui/SectionCard";
import { BookmarkToolButton, CollapsibleTheorySection, FriendlyErrorBox, MiniTableOfContents, PracticeModeToggle, RelatedToolLinks, ShareSetupButton } from "../ui/UiFeedback";

const exploredToolsKey = "math-universe-explored-tools";
const defaultRelatedTools = [
  { label: "Graphing Calculator", route: "/math-lab/graphing-calculator" },
  { label: "Function Explorer", route: "/math-lab/function-explorer" },
  { label: "Matrix Operations", route: "/matrices" },
  { label: "Math Lab", route: "/math-lab" },
];

export function MathLabLayout({
  title,
  subtitle,
  children,
  notes,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  notes?: ReactNode;
}) {
  const [notesOpen, setNotesOpen] = useState(true);
  const location = useLocation();
  const tocItems = [
    { label: "Overview", id: "tool-overview" },
    { label: "Workspace", id: "tool-workspace" },
    { label: "Related tools", id: "related-tools" },
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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
        <Link to="/" className="hover:text-cyan-600">Math Universe</Link>
        <span>/</span>
        <Link to="/math-lab" className="hover:text-cyan-600">Math Lab</Link>
        <span>/</span>
        <span className="text-cyan-700 dark:text-cyan-200">{title}</span>
      </div>
      <div className="sticky top-20 z-20 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white/90 p-2 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-950/85">
        <Link to="/math-lab" className="action-secondary w-fit"><ArrowLeft className="h-4 w-4" />Back to Math Lab</Link>
        <ShareSetupButton />
        <BookmarkToolButton id={location.pathname} title={title} />
        <PracticeModeToggle />
      </div>
      <SectionCard id="tool-overview" className="overflow-hidden !p-4 md:!p-5">
        <div className="rounded-2xl bg-gradient-to-br from-slate-950 via-cyan-700 to-violet-700 p-6 text-white md:p-8">
          <p className="text-sm font-black uppercase text-cyan-100/80">Advanced Interactive Math Tools</p>
          <h1 className="mt-3 text-3xl font-black md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-4xl text-sm leading-6 text-white/90 md:text-base">{subtitle}</p>
        </div>
      </SectionCard>
      <div className={notes ? "grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]" : ""}>
        <div id="tool-workspace" className="min-w-0 space-y-6">
          {children}
          <SectionCard id="related-tools" title="Related Tools">
            <RelatedToolLinks links={defaultRelatedTools.filter((tool) => tool.route !== location.pathname)} />
          </SectionCard>
        </div>
        {notes && (
          <aside className="space-y-4 xl:sticky xl:top-36 xl:self-start">
            <MiniTableOfContents items={tocItems} />
            <button type="button" className="tool-button w-full justify-between" onClick={() => setNotesOpen((value) => !value)}>
              Educational notes
              <ChevronDown className={`h-4 w-4 transition ${notesOpen ? "rotate-180" : ""}`} />
            </button>
            {notesOpen && (
              <CollapsibleTheorySection title="Theory and guidance" defaultOpen>
                <div className="space-y-6">{notes}</div>
              </CollapsibleTheorySection>
            )}
          </aside>
        )}
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
    <div className="group rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm transition hover:-translate-y-1 hover:border-cyan-300 hover:shadow-xl hover:shadow-cyan-500/10 dark:border-white/10 dark:bg-white/5">
      <Link to={route} className="block">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700 transition group-hover:scale-105 dark:bg-cyan-400/15 dark:text-cyan-200">
            <Icon className="h-6 w-6" />
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 dark:bg-white/10 dark:text-slate-300">{difficulty}</span>
        </div>
        <h2 className="mt-4 text-xl font-black">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {useCases.slice(0, 4).map((item) => <span key={item} className="mini-chip">{item}</span>)}
        </div>
        <span className="mt-5 inline-flex rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition group-hover:bg-cyan-600 dark:bg-white dark:text-slate-950">Open</span>
      </Link>
      <div className="mt-4 border-t border-slate-200 pt-4 dark:border-white/10">
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
    <Link to={route} className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm transition hover:border-cyan-300 hover:shadow-md dark:border-white/10 dark:bg-white/5">
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
    <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-400/20 dark:bg-cyan-400/10">
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
    <SectionCard title="Step Panel">
      <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
        <p className="text-xs font-black uppercase text-cyan-700 dark:text-cyan-200">Step {index + 1} of {steps.length}</p>
        <h3 className="mt-2 text-xl font-black">{step.title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{step.explanation}</p>
        {step.formula && <FormulaBlock title="Working" formula={step.formula} />}
        {step.result && <p className="mt-3 rounded-xl bg-emerald-50 p-3 font-mono font-bold text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-100">{step.result}</p>}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="tool-button" type="button" onClick={() => setIndex(Math.max(0, index - 1))}><ChevronLeft className="h-4 w-4" />Previous</button>
        <button className="tool-button" type="button" onClick={() => setIndex(Math.min(steps.length - 1, index + 1))}>Next<ChevronRight className="h-4 w-4" /></button>
      </div>
    </SectionCard>
  );
}

export function ResultCard({ title = "Result", result, verification, relatedTools = [] }: { title?: string; result: ReactNode; verification?: ReactNode; relatedTools?: Array<{ label: string; route: string }> }) {
  return (
    <SectionCard title={title}>
      <div className="result-pop rounded-2xl bg-emerald-50 p-4 text-emerald-900 dark:bg-emerald-400/10 dark:text-emerald-100">{result}</div>
      {verification && <div className="mt-4 rounded-2xl bg-slate-100 p-4 dark:bg-white/10">{verification}</div>}
      <div className="mt-4"><RelatedToolLinks links={relatedTools} /></div>
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
