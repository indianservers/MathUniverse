import { lazy, Suspense } from "react";
import { Sigma } from "lucide-react";

const FormulaLibraryPage = lazy(() => import("./FormulaLibraryPage"));

export default function Formulas() {
  return (
    <Suspense fallback={<FormulaSheetFallback />}>
      <FormulaLibraryPage />
    </Suspense>
  );
}

function FormulaSheetFallback() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-4 text-slate-950 dark:bg-slate-950 dark:text-white">
      <section className="mx-auto max-w-[1500px] rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-cyan-100 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-100">
            <Sigma className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-300">Formula Library</p>
            <h1 className="text-xl font-black">Loading compact formulas</h1>
          </div>
        </div>
      </section>
    </main>
  );
}
