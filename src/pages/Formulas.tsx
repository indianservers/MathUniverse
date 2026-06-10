import { lazy, Suspense, useEffect, useState } from "react";
import { Calculator, Database, Sigma } from "lucide-react";

const FormulasWorkspace = lazy(() => import("./FormulasWorkspace"));

type IdleWindow = Window & {
  cancelIdleCallback?: (handle: number) => void;
  requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
};

export default function Formulas() {
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    let active = true;
    const timer = window.setInterval(() => {
      setProgress((value) => {
        if (!active) return value;
        if (value < 62) return value + 6;
        if (value < 86) return value + 3;
        if (value < 94) return value + 1;
        return value;
      });
    }, 140);

    const warmFormulaWorkspace = () => {
      void import("./FormulasWorkspace");
    };

    const idleWindow = window as IdleWindow;
    if (idleWindow.requestIdleCallback && idleWindow.cancelIdleCallback) {
      const idleId = idleWindow.requestIdleCallback(warmFormulaWorkspace, { timeout: 1200 });
      return () => {
        active = false;
        window.clearInterval(timer);
        idleWindow.cancelIdleCallback?.(idleId);
      };
    }

    const warmupTimer = window.setTimeout(warmFormulaWorkspace, 250);
    return () => {
      active = false;
      window.clearInterval(timer);
      window.clearTimeout(warmupTimer);
    };
  }, []);

  return (
    <Suspense fallback={<FormulaLoadProgress progress={progress} />}>
      <FormulasWorkspace />
    </Suspense>
  );
}

function FormulaLoadProgress({ progress }: { progress: number }) {
  return (
    <main className="desktop-page-shell formula-page-shell">
      <section className="formula-loading-shell" aria-live="polite" aria-busy="true">
        <div className="formula-loading-card">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-100 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-100">
              <Sigma className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-300">Formula Command Center</p>
              <h1 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">Loading formulas</h1>
            </div>
          </div>
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <span>Preparing library, renderer, and saved progress</span>
              <span>{Math.min(99, Math.round(progress))}%</span>
            </div>
            <div className="formula-loading-track">
              <div className="formula-loading-bar" style={{ width: `${Math.min(99, progress)}%` }} />
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <FormulaLoadStep icon={Database} label="Cached formula data" />
            <FormulaLoadStep icon={Calculator} label="KaTeX renderer" />
            <FormulaLoadStep icon={Sigma} label="Study filters" />
          </div>
        </div>
      </section>
    </main>
  );
}

function FormulaLoadStep({ icon: Icon, label }: { icon: typeof Sigma; label: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-xs font-black text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
      <Icon className="mb-2 h-4 w-4 text-cyan-500" />
      {label}
    </div>
  );
}
