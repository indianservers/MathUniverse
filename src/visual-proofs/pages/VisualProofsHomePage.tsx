import { ArrowRight, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import CategoryCard from "../components/CategoryCard";
import ProofCard from "../components/ProofCard";
import { visualProofCategories } from "../data/visualProofCategories";
import { featuredVisualProofs, visualProofsIndex } from "../data/visualProofsIndex";
import type { VisualProofDifficulty, VisualProofStatus } from "../data/proofTypes";

export default function VisualProofsHomePage() {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState<VisualProofDifficulty | "all">("all");
  const [statusFilter, setStatusFilter] = useState<VisualProofStatus | "all">("all");
  const filteredProofs = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return visualProofsIndex.filter((proof) => {
      const categoryTitle = visualProofCategories.find((category) => category.slug === proof.categorySlug)?.title ?? proof.categorySlug;
      const searchText = [categoryTitle, proof.categorySlug, proof.difficulty, proof.status, proof.title, proof.shortDescription, proof.longDescription, ...proof.tags].join(" ").toLowerCase();
      return (
        (!normalized || searchText.includes(normalized)) &&
        (categoryFilter === "all" || proof.categorySlug === categoryFilter) &&
        (difficultyFilter === "all" || proof.difficulty === difficultyFilter) &&
        (statusFilter === "all" || proof.status === statusFilter)
      );
    });
  }, [categoryFilter, difficultyFilter, query, statusFilter]);

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-xl border border-cyan-200/30 bg-slate-950 text-white shadow-2xl shadow-cyan-950/20">
        <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:p-6">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-wide text-cyan-200">Visual Proofs</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-black sm:text-5xl">Mathematics You Can See</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-cyan-50/80">
              Interactive visual proofs for geometry, algebra, calculus, trigonometry, statistics, and engineering mathematics.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link to="/visual-proofs/geometry/area-of-circle-by-unrolling" className="action-primary rounded-xl">
                Start Learning <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link to="/visual-proofs/geometry" className="action-secondary rounded-xl">
                Geometry Proofs
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <HeroStat label="Categories" value={visualProofCategories.length} />
            <HeroStat label="Live" value={featuredVisualProofs.length} />
            <HeroStat label="Scale" value="100+" />
          </div>
        </div>
      </section>

      <section className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px]">
        <label className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white/88 px-4 text-sm font-semibold shadow-sm dark:border-white/10 dark:bg-white/[0.05]">
          <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search visual proofs by concept, formula, or tag"
            className="min-w-0 flex-1 bg-transparent outline-none"
          />
        </label>
        <button
          type="button"
          className="action-secondary rounded-xl"
          onClick={() => {
            setQuery("");
            setCategoryFilter("all");
            setDifficultyFilter("all");
            setStatusFilter("all");
          }}
          aria-label="Reset Visual Proofs filters"
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Reset filters
        </button>
      </section>
      <section className="grid gap-3 rounded-xl border border-slate-200 bg-white/88 p-3 dark:border-white/10 dark:bg-white/[0.05] md:grid-cols-3">
        <FilterSelect label="Category" value={categoryFilter} onChange={setCategoryFilter}>
          <option value="all">All categories</option>
          {visualProofCategories.map((category) => (
            <option key={category.slug} value={category.slug}>{category.title}</option>
          ))}
        </FilterSelect>
        <FilterSelect label="Difficulty" value={difficultyFilter} onChange={(value) => setDifficultyFilter(value as VisualProofDifficulty | "all")}>
          <option value="all">All difficulties</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </FilterSelect>
        <FilterSelect label="Status" value={statusFilter} onChange={(value) => setStatusFilter(value as VisualProofStatus | "all")}>
          <option value="all">All statuses</option>
          <option value="available">Available</option>
          <option value="coming-soon">Planned</option>
        </FilterSelect>
      </section>

      <section>
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black text-slate-950 dark:text-white">Proof Categories</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">Eighteen expandable lanes for school, college, and engineering mathematics.</p>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {visualProofCategories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3">
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">{query || categoryFilter !== "all" || difficultyFilter !== "all" || statusFilter !== "all" ? "Filtered Proofs" : "Featured Proofs"}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{filteredProofs.length} proof{filteredProofs.length === 1 ? "" : "s"} match the current browser-only filters.</p>
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          {(query || categoryFilter !== "all" || difficultyFilter !== "all" || statusFilter !== "all" ? filteredProofs : featuredVisualProofs).map((proof) => (
            <ProofCard key={proof.id} proof={proof} />
          ))}
        </div>
      </section>
    </div>
  );
}

function FilterSelect({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: ReactNode }) {
  return (
    <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 dark:border-white/10 dark:bg-slate-950 dark:text-slate-100">
        {children}
      </select>
    </label>
  );
}

function HeroStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/10 p-3">
      <p className="text-3xl font-black text-white">{value}</p>
      <p className="mt-1 text-[11px] font-black uppercase tracking-wide text-cyan-100/80">{label}</p>
    </div>
  );
}
