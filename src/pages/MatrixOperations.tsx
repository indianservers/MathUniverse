import { Link } from "react-router-dom";
import SectionCard from "../components/ui/SectionCard";
import StudioPageShell from "../components/ui/StudioPageShell";
import { matrixOperations } from "../data/matrixOperations";
import { useEffect, useMemo, useState } from "react";

type MatrixTabId = "all" | "basic" | "intermediate" | "advanced";

export default function MatrixOperations() {
  const [activeTab, setActiveTab] = useState<MatrixTabId>(() => readMatrixTabFromUrl());
  const tabs = [
    { id: "all" as const, label: "All", summary: "Browse every matrix operation visualizer in one compact launcher." },
    { id: "basic" as const, label: "Basic", summary: "Start with rows, columns, addition, subtraction, scalar multiplication, transpose, and row operations." },
    { id: "intermediate" as const, label: "Intermediate", summary: "Move into multiplication, determinants, inverses, rank, systems, and transformations." },
    { id: "advanced" as const, label: "Advanced", summary: "Focus on cofactors, adjoints, eigenvalues, and eigenvectors." },
  ];
  const currentTab = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];
  const filteredOperations = useMemo(() => {
    if (activeTab === "all") return matrixOperations;
    return matrixOperations.filter((operation) => operation.difficulty.toLowerCase() === activeTab);
  }, [activeTab]);
  const counts = useMemo(() => ({
    Basic: matrixOperations.filter((operation) => operation.difficulty === "Basic").length,
    Intermediate: matrixOperations.filter((operation) => operation.difficulty === "Intermediate").length,
    Advanced: matrixOperations.filter((operation) => operation.difficulty === "Advanced").length,
  }), []);

  useEffect(() => {
    const onPopState = () => setActiveTab(readMatrixTabFromUrl());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const selectTab = (tabId: MatrixTabId) => {
    setActiveTab(tabId);
    const url = new URL(window.location.href);
    if (tabId === "all") url.searchParams.delete("tab");
    else url.searchParams.set("tab", tabId);
    window.history.pushState(null, "", `${url.pathname}${url.search}${url.hash}`);
  };

  return (
    <StudioPageShell
      className="matrix-studio"
      title="Matrix Operations Studio"
      subtitle="Learn matrix addition, subtraction, multiplication, transpose, determinant, inverse, rank, systems, eigenvectors, and transformations through interactive visual steps."
      breadcrumbs={["Home", "Matrices", "Operations"]}
      difficulty="Matrices and Linear Algebra"
      estimatedMinutes={75}
      progress={74}
      status={[
        { id: "operations", label: "Operations", value: matrixOperations.length, tone: "cyan" },
        { id: "level", label: "Current", value: currentTab.label, tone: "violet" },
      ]}
    >
      <div className="matrix-workspace">
        <section className="matrix-main-panel" aria-label="Matrix operations launcher">
          <div className="matrix-tabs" role="tablist" aria-label="Matrix operation filters">
            {tabs.map((tab) => (
              <button key={tab.id} type="button" role="tab" aria-selected={tab.id === currentTab.id} className={tab.id === currentTab.id ? "active" : ""} onClick={() => selectTab(tab.id)}>
                {tab.label}
              </button>
            ))}
          </div>
          <div className="matrix-context-strip">
            <div>
              <span>Current filter</span>
              <strong>{currentTab.label}</strong>
            </div>
            <p>{currentTab.summary}</p>
          </div>
          <div className="matrix-card-grid thin-scrollbar">
            {filteredOperations.map((operation) => {
              const Icon = operation.icon;
              return (
                <Link key={operation.id} to={operation.route} className="matrix-operation-card group">
                  <div className="flex items-start justify-between gap-3">
                    <span className="matrix-card-icon"><Icon className="h-5 w-5" /></span>
                    <span className="matrix-level-chip">{operation.difficulty}</span>
                  </div>
                  <h2>{operation.title}</h2>
                  <p>{operation.explanation}</p>
                  <small>{operation.classRelevance}</small>
                  {operation.topics && <em>{operation.topics.join(" / ")}</em>}
                  <b>Open Visualizer</b>
                </Link>
              );
            })}
          </div>
        </section>
        <aside className="matrix-inspector thin-scrollbar" aria-label="Matrix operations inspector">
          <div className="matrix-guide-card">
            <span>Studio guide</span>
            <h2>{currentTab.label} operations</h2>
            <p>{currentTab.summary}</p>
          </div>
          <div className="matrix-mini-grid">
            <Metric label="Basic" value={counts.Basic} />
            <Metric label="Intermediate" value={counts.Intermediate} />
            <Metric label="Advanced" value={counts.Advanced} />
            <Metric label="Showing" value={filteredOperations.length} />
          </div>
          <SectionCard title="Path" compact>
            <div className="grid gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
              <p>1. Start with Basics and arithmetic.</p>
              <p>2. Move to multiplication, determinant, inverse, and rank.</p>
              <p>3. Finish with systems, transforms, eigenvectors, and cofactors.</p>
            </div>
          </SectionCard>
        </aside>
      </div>
    </StudioPageShell>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div><span>{label}</span><strong>{value}</strong></div>;
}

function readMatrixTabFromUrl(): MatrixTabId {
  if (typeof window === "undefined") return "all";
  const tab = new URLSearchParams(window.location.search).get("tab");
  if (tab === "basic" || tab === "intermediate" || tab === "advanced") return tab;
  return "all";
}
