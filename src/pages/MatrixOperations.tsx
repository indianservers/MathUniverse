import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Eye,
  GraduationCap,
  Grid3X3,
  Hand,
  LayoutList,
  Lightbulb,
  List,
  Search,
  Target,
  Wrench,
} from "lucide-react";
import {
  CommandPalette,
  HeaderStats,
} from "../components/layout/GlobalUx";
import { TeacherModeToggle } from "../components/ui/UiFeedback";
import ThemeToggle from "../components/ui/ThemeToggle";
import { matrixOperations, type MatrixOperationId, type MatrixOperationMeta } from "../data/matrixOperations";
import { MatrixHeroArt, MatrixMark, MatrixTopicArt } from "./MatrixOperationsArt";
import "./MatrixOperations.css";

const cardTone: Record<MatrixOperationId, string> = {
  basics: "tone-blue",
  addition: "tone-mint",
  subtraction: "tone-peach",
  "scalar-multiplication": "tone-lilac",
  multiplication: "tone-green",
  transpose: "tone-mint",
  determinant: "tone-yellow",
  inverse: "tone-blue",
  "adjoint-cofactor": "tone-pink",
  rank: "tone-mint",
  "row-operations": "tone-cream",
  "linear-equations": "tone-blue",
  "eigenvalues-eigenvectors": "tone-lavender",
  transformations: "tone-yellow",
};

const blurbs: Record<MatrixOperationId, string> = {
  basics: "Understand rows, columns, notation, and matrix types.",
  addition: "Add matrices of the same order with step-by-step visualization.",
  subtraction: "Subtract matrices of the same order with clear visual steps.",
  "scalar-multiplication": "Multiply every element by a scalar with dynamic control.",
  multiplication: "Use row-column dot products to build a product matrix.",
  transpose: "Turn rows into columns and visualize the transformation.",
  determinant: "Measure area or volume scaling for square matrices.",
  inverse: "Find the matrix that reverses a transformation (if it exists).",
  "adjoint-cofactor": "Build minors, cofactors, and adjoint using interactive steps.",
  rank: "Use row echelon form to count independent rows or columns.",
  "row-operations": "Practice swaps, scaling, and row replacement interactively.",
  "linear-equations": "Solve using augmented matrices and connect to line intersections.",
  "eigenvalues-eigenvectors": "Find directions that keep their line after a matrix transformation.",
  transformations: "Visualize scaling, rotation, reflection, and shear on a grid.",
};

type MatrixTabId = "all" | "basic" | "intermediate" | "advanced";
type SortId = "recommended" | "title" | "difficulty";
type LevelId = "all" | "class-11" | "class-12" | "engineering" | "degree";

export default function MatrixOperations() {
  const [activeTab, setActiveTab] = useState<MatrixTabId>(() => readMatrixTabFromUrl());
  const [level, setLevel] = useState<LevelId>("all");
  const [sort, setSort] = useState<SortId>("recommended");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => ({
    all: matrixOperations.length,
    basic: matrixOperations.filter((item) => item.difficulty === "Basic").length,
    intermediate: matrixOperations.filter((item) => item.difficulty === "Intermediate").length,
    advanced: matrixOperations.filter((item) => item.difficulty === "Advanced").length,
  }), []);

  const filteredOperations = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const difficulty = activeTab === "all" ? matrixOperations : matrixOperations.filter((item) => item.difficulty.toLowerCase() === activeTab);
    const byLevel = difficulty.filter((item) => matchesLevel(item, level));
    const searched = needle
      ? byLevel.filter((item) => `${item.title} ${blurbs[item.id]} ${item.explanation}`.toLowerCase().includes(needle))
      : byLevel;
    const ordered = [...searched];
    if (sort === "title") ordered.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "difficulty") ordered.sort((a, b) => difficultyRank(a.difficulty) - difficultyRank(b.difficulty));
    return ordered;
  }, [activeTab, level, query, sort]);

  useEffect(() => {
    document.title = "Matrix Operations Studio | Math Universe";
  }, []);

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
    <div className="mx-shell">
      <header className="mx-topbar">
        <Link to="/" className="mx-brand-lockup">
          <span className="mx-pi" aria-hidden="true">π</span>
          <span>
            <strong>Interactive Math Lab</strong>
            <small>Visualize • Explore • Learn • Master</small>
          </span>
        </Link>
        <label className="mx-search">
          <Search size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search topics, e.g. determinant, inverse, eigenvalues..."
            aria-label="Search matrix topics"
          />
        </label>
        <div className="mx-top-actions">
          <CommandPalette />
          <ThemeToggle />
          <HeaderStats />
          <TeacherModeToggle />
        </div>
      </header>

      <div className="mx-studio">
        <nav className="mx-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">&gt;</span>
          <Link to="/learn">Mathematics</Link>
          <span aria-hidden="true">&gt;</span>
          <Link to="/matrices">Matrices</Link>
          <span aria-hidden="true">&gt;</span>
          <Link to="/matrices" aria-current="page">Operations</Link>
        </nav>

        <section className="mx-hero">
          <div className="mx-hero-copy">
            <div className="mx-brand">
              <MatrixMark />
              <div>
                <h1>Matrix Operations Studio</h1>
                <p>Explore matrix addition, subtraction, multiplication, transpose, determinant, inverse, rank, eigenvalues, and transformations through interactive visual tools and real-world examples.</p>
              </div>
            </div>
          </div>
          <div className="mx-pills">
            <Link to="#matrix-topics"><i className="cyan"><Eye size={14} /></i><span><b>Interactive Visualizers</b><small>Learn by doing</small></span></Link>
            <Link to="/visual-proofs/matrices-linear-algebra"><i className="blue"><GraduationCap size={14} /></i><span><b>Step-by-step Solutions</b><small>Build conceptual clarity</small></span></Link>
            <Link to="/linear-algebra"><i className="violet"><Wrench size={14} /></i><span><b>Real-world Applications</b><small>See math in action</small></span></Link>
            <Link to="/quiz"><i className="pink"><Target size={14} /></i><span><b>Practice & Assessments</b><small>Strengthen your skills</small></span></Link>
          </div>
          <MatrixHeroArt />
          <div className="mx-steps">
            <span><Eye size={16} /> Visualize</span>
            <span><Hand size={16} /> Manipulate</span>
            <span><Lightbulb size={16} /> Understand</span>
            <span><Target size={16} /> Apply</span>
          </div>
        </section>

        <div className="mx-toolbar">
          <div className="mx-tabs" role="tablist" aria-label="Matrix operation filters">
            <button type="button" role="tab" aria-selected={activeTab === "all"} className={activeTab === "all" ? "active" : ""} onClick={() => selectTab("all")}><BarChart3 size={14} /> All Topics ({counts.all})</button>
            <button type="button" role="tab" aria-selected={activeTab === "basic"} className={activeTab === "basic" ? "active" : ""} onClick={() => selectTab("basic")}>Basic ({counts.basic})</button>
            <button type="button" role="tab" aria-selected={activeTab === "intermediate"} className={activeTab === "intermediate" ? "active" : ""} onClick={() => selectTab("intermediate")}>Intermediate ({counts.intermediate})</button>
            <button type="button" role="tab" aria-selected={activeTab === "advanced"} className={activeTab === "advanced" ? "active" : ""} onClick={() => selectTab("advanced")}>Advanced ({counts.advanced})</button>
          </div>
          <div className="mx-filters">
            <label>Class / Level
              <select aria-label="Class or level" value={level} onChange={(event) => setLevel(event.target.value as LevelId)}>
                <option value="all">All</option>
                <option value="class-11">Class 11</option>
                <option value="class-12">Class 12</option>
                <option value="engineering">Engineering</option>
                <option value="degree">Degree</option>
              </select>
            </label>
            <label>Sort by
              <select aria-label="Sort topics" value={sort} onChange={(event) => setSort(event.target.value as SortId)}>
                <option value="recommended">Recommended</option>
                <option value="title">Title</option>
                <option value="difficulty">Difficulty</option>
              </select>
            </label>
            <div className="mx-view">
              <button type="button" className={view === "grid" ? "active" : ""} onClick={() => setView("grid")}><Grid3X3 size={14} /> Grid</button>
              <button type="button" className={view === "list" ? "active" : ""} onClick={() => setView("list")}><LayoutList size={14} /> List</button>
            </div>
          </div>
        </div>

        <section id="matrix-topics" aria-label="Matrix visualizers">
          {filteredOperations.length === 0 ? <p className="mx-empty">No topics match this filter.</p> : (
            <div className={`mx-grid${view === "list" ? " is-list" : ""}`}>
              {filteredOperations.map((operation) => (
                <Link key={operation.id} to={operation.route} className={`mx-card ${cardTone[operation.id]}`}>
                  <header>
                    <MatrixTopicArt id={operation.id} />
                    <em>{operation.difficulty}</em>
                  </header>
                  <h2>{operation.title}</h2>
                  <p>{blurbs[operation.id]}</p>
                  <b>Open Visualizer <ArrowRight size={14} /></b>
                </Link>
              ))}
            </div>
          )}
        </section>

        <footer className="mx-foot">
          <p><BarChart3 size={18} /><b>14 Interactive Visualizers</b>Complete matrix operations toolkit</p>
          <p><List size={18} /><b>Multiple Difficulty Levels</b>From basic concepts to advanced applications</p>
          <p><Target size={18} /><b>Practice & Master</b>Build confidence with interactive exercises</p>
          <p><Wrench size={18} /><b>Real-World Connections</b>See how matrices power AI, computer graphics and more</p>
          <p className="mx-quote-foot">“More than numbers — matrices shape the world around us.”</p>
        </footer>
      </div>
    </div>
  );
}

function matchesLevel(operation: MatrixOperationMeta, level: LevelId) {
  if (level === "all") return true;
  const text = operation.classRelevance.toLowerCase();
  if (level === "class-11") return text.includes("class 11");
  if (level === "class-12") return text.includes("class 12");
  if (level === "engineering") return text.includes("engineering");
  return text.includes("degree");
}

function difficultyRank(value: MatrixOperationMeta["difficulty"]) {
  return value === "Basic" ? 0 : value === "Intermediate" ? 1 : 2;
}

function readMatrixTabFromUrl(): MatrixTabId {
  if (typeof window === "undefined") return "all";
  const tab = new URLSearchParams(window.location.search).get("tab");
  if (tab === "basic" || tab === "intermediate" || tab === "advanced") return tab;
  return "all";
}
