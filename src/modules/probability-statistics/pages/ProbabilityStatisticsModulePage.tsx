import { BarChart3, BookOpen, GitBranch, Network, Sigma } from "lucide-react";
import { Link } from "react-router-dom";
import TopicHeader from "../../../components/ui/TopicHeader";
import { statisticsSyllabusStudios } from "./StatisticsSyllabusCompletionPage";

export default function ProbabilityStatisticsModulePage() {
  return (
    <div className="space-y-6">
      <TopicHeader
        title="Probability & Statistics Module"
        subtitle="A dedicated module for distributions, inference, regression, Bayesian reasoning, stochastic processes, and data modelling."
        difficulty="Module"
        estimatedMinutes={18}
      />

      <section>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xl shadow-cyan-100/40 dark:border-white/10 dark:bg-slate-950/70 dark:shadow-black/20">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-100">
              <Sigma className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black uppercase text-cyan-700 dark:text-cyan-200">Probability & Statistics</p>
              <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 dark:text-white">Concept Studios and Interactive Tools</h1>
            </div>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            Explore random variables, probability distributions, sampling behavior, inference, regression, Bayesian updating, stochastic processes, and information-theory models.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link className="action-primary" to="/probability-statistics/distributions">
              Open Distribution Atlas
            </Link>
            <Link className="action-secondary" to="/probability-statistics/inference">
              Open Inference Studio
            </Link>
            <Link className="action-secondary" to="/probability-statistics/bayesian">
              Open Bayesian Studio
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ModuleTile icon={<BarChart3 className="h-5 w-5" />} title="Distributions" route="/probability-statistics/distributions" text="PMF/PDF curves, parameters, supports, moments, and use cases." />
        <ModuleTile icon={<BookOpen className="h-5 w-5" />} title="Inference" route="/probability-statistics/inference" text="Intervals, tests, p-values, rejection regions, power, and decisions." />
        <ModuleTile icon={<BarChart3 className="h-5 w-5" />} title="Sampling" route="/probability-statistics/sampling" text="Standard error, CLT shape, repeated sample means, and interval width." />
        <ModuleTile icon={<BookOpen className="h-5 w-5" />} title="Regression" route="/probability-statistics/regression" text="Least squares, residuals, R squared, outliers, and model diagnostics." />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <ModuleTile icon={<GitBranch className="h-5 w-5" />} title="Bayesian" route="/probability-statistics/bayesian" text="Priors, likelihoods, posteriors, beta conjugacy, and base-rate updates." />
        <ModuleTile icon={<Network className="h-5 w-5" />} title="Stochastic" route="/probability-statistics/stochastic" text="Markov chains, queues, reliability decay, traffic intensity, and steady state." />
        <ModuleTile icon={<Sigma className="h-5 w-5" />} title="Advanced Models" route="/probability-statistics/advanced-models" text="Multivariate normal geometry, entropy, KL divergence, and mixture models." />
      </section>

      <section>
        <div className="mb-3">
          <h2 className="text-xl font-black text-slate-950 dark:text-white">Syllabus Completion Studios</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">Interactive UG, PG, professional, and school-polish statistics topics added from the syllabus gap report.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statisticsSyllabusStudios.map((studio) => (
            <ModuleTile key={studio.id} icon={<BookOpen className="h-5 w-5" />} title={studio.title} route={`/probability-statistics/${studio.id}`} text={studio.subtitle} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ModuleTile({ icon, title, text, route }: { icon: JSX.Element; title: string; text: string; route: string }) {
  return (
    <Link to={route} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-lg dark:border-white/10 dark:bg-slate-950/70 dark:hover:border-cyan-400/40">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-cyan-100">{icon}</span>
      <h2 className="mt-3 text-base font-black text-slate-950 dark:text-white">{title}</h2>
      <p className="mt-2 text-sm leading-5 text-slate-600 dark:text-slate-300">{text}</p>
    </Link>
  );
}
