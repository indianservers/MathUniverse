import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Activity, BookOpen, ChevronRight, CircleHelp, CircuitBoard, Compass,
  FlaskConical, FunctionSquare, GitBranch, Home, LineChart, Menu,
  Network, Search, Settings2, Sigma, Sparkles, Waves, X,
  Binary, ChartSpline, CircleDot, Cpu, Divide, Gauge, Layers3,
  ListChecks, Magnet, MoveUpRight, Orbit, Route, ScanSearch, Split,
  Thermometer, TrendingUp, Waypoints, Zap,
  type LucideIcon,
} from "lucide-react";
import { matchStudioPage, studioMockups, type StudioMockupPage } from "../studios/mockup/studioMockupCatalog";
import DifferentialEquationsHome from "../studios/differential-equations/DifferentialEquationsHome";
import DifferentialEquationsLab from "../studios/differential-equations/DifferentialEquationsLabs";
import { differentialEquationRouteAliases, differentialEquationRouteFor } from "../studios/differential-equations/routes";
import "../studios/differential-equations/differentialEquations.css";

const studio = studioMockups["differential-equations"];
const pages = studio.pages.filter((item) => item.id !== "home");

const groups: Array<{ label: string; ids: string[] }> = [
  { label: "Start here", ids: ["home", "explorer", "slope-fields", "initial-value", "method-selector"] },
  { label: "First-order equations", ids: ["separable", "homogeneous-first-order", "exact", "linear-first-order", "bernoulli", "growth-models"] },
  { label: "Numerical methods", ids: ["euler", "heun", "rk4"] },
  { label: "Higher-order equations", ids: ["higher-order-linear", "undetermined-coefficients", "variation-of-parameters", "cauchy-euler"] },
  { label: "Systems & trajectories", ids: ["systems", "phase-plane"] },
  { label: "Engineering models", ids: ["mechanical-oscillations", "lcr-circuit", "newton-cooling"] },
];

const icons: Record<string, LucideIcon> = {
  home: Home, explorer: Search, "slope-fields": Sparkles,
  "initial-value": Compass, "method-selector": GitBranch,
  separable: FunctionSquare, "homogeneous-first-order": Waves,
  exact: Sigma, "linear-first-order": LineChart, bernoulli: Activity,
  "growth-models": LineChart, euler: LineChart, heun: LineChart,
  rk4: LineChart, "higher-order-linear": Sigma,
  "undetermined-coefficients": FlaskConical,
  "variation-of-parameters": Settings2, "cauchy-euler": FunctionSquare,
  systems: Network, "phase-plane": Compass,
  "mechanical-oscillations": Waves, "lcr-circuit": CircuitBoard,
  "newton-cooling": Activity,
};

const phase1Icons: Record<string, LucideIcon> = {
  home: Home, explorer: ScanSearch, "method-selector": Route,
  "slope-fields": MoveUpRight, "initial-value": CircleDot,
  separable: Split, "homogeneous-first-order": Layers3,
  exact: ListChecks, "linear-first-order": ChartSpline,
  bernoulli: Sigma, "growth-models": TrendingUp,
  euler: Waypoints, heun: Gauge, rk4: Cpu,
  "higher-order-linear": Binary, "undetermined-coefficients": Magnet,
  "variation-of-parameters": Divide, "cauchy-euler": FunctionSquare,
  systems: Network, "phase-plane": Orbit,
  "mechanical-oscillations": Waves, "lcr-circuit": Zap,
  "newton-cooling": Thermometer,
};
const phase1Headings: Record<string, { title: string; description: string }> = {
  explorer: { title: "Equation Explorer", description: "Enter a differential equation, explore its solutions, and see how changing parameters affects its behavior." },
  "method-selector": { title: "Method Selector", description: "Analyze your equation and get personalized solution-method recommendations." },
  "slope-fields": { title: "Direction Fields", description: "Visualize slope fields and solution curves for first-order differential equations." },
  "initial-value": { title: "Initial Value", description: "See how a unique solution curve emerges from a differential equation and an initial condition." },
  separable: { title: "Separable", description: "Solve separable differential equations step by step with interactive guidance." },
  "homogeneous-first-order": { title: "Homogeneous", description: "Solve homogeneous differential equations using substitution, simplification, and insight." },
  exact: { title: "Exact", description: "Test for exactness, find potential functions, and solve exact differential equations." },
  "linear-first-order": { title: "Linear First-Order", description: "Explore, solve, and understand first-order linear differential equations." },
  bernoulli: { title: "Bernoulli", description: "Transform Bernoulli equations into linear equations and compare their solutions." },
  "growth-models": { title: "Growth", description: "Model exponential growth, decay, and logistic growth interactively." },
  euler: { title: "Euler", description: "Approximate solutions step by step using Euler’s method." },
  heun: { title: "Heun", description: "Improve Euler’s method with predictor–corrector averaging." },
  rk4: { title: "RK4", description: "Use the classical fourth-order Runge–Kutta method for accurate numerical solutions." },
  "higher-order-linear": { title: "Higher-Order Linear", description: "Solve and understand second-order linear differential equations." },
  "undetermined-coefficients": { title: "Undetermined Coefficients", description: "Find particular solutions by choosing and testing a trial form." },
  "variation-of-parameters": { title: "Variation of Parameters", description: "Build particular solutions using fundamental solutions and parameter functions." },
  "cauchy-euler": { title: "Cauchy–Euler", description: "Solve equidimensional equations with the power-form substitution y = xᵐ." },
  systems: { title: "Systems", description: "Explore coupled differential equations, matrix form, and multivariable dynamics." },
  "phase-plane": { title: "Phase Plane", description: "Analyze trajectories, nullclines, equilibria, and stability in two dimensions." },
  "mechanical-oscillations": { title: "Oscillations", description: "Explore harmonic motion, damping, forcing, and energy interactively." },
  "lcr-circuit": { title: "LCR Circuit", description: "Model electrical oscillations, damping, and resonance in a series circuit." },
  "newton-cooling": { title: "Newton Cooling", description: "Explore how temperature approaches the ambient environment over time." },
};
const phase2Ids = new Set(["euler", "heun", "rk4", "higher-order-linear", "undetermined-coefficients", "variation-of-parameters", "cauchy-euler", "systems", "phase-plane", "mechanical-oscillations", "lcr-circuit", "newton-cooling"]);
const phase2Quotes: Record<string, string> = {
  euler: "Sometimes an approximate solution is the first step to a deeper understanding.",
  heun: "A simple idea: average the slopes for a better estimate.",
  rk4: "Numerical methods turn equations into answers.",
  "higher-order-linear": "Higher-order equations model richer phenomena, from vibrations to electrical circuits.",
  "undetermined-coefficients": "A smart guess, backed by theory, can solve a complicated equation.",
  "variation-of-parameters": "When the usual methods do not fit, let the parameters vary.",
  "cauchy-euler": "Scale invariance turns differential equations into algebra.",
  systems: "Simple rules can create complex behavior.",
  "phase-plane": "A picture in the plane can reveal the long-term story of a system.",
  "mechanical-oscillations": "Oscillations are everywhere, from atoms to skyscrapers.",
  "lcr-circuit": "Math helps us tune the unseen rhythms of the world.",
  "newton-cooling": "Simple models can reveal profound insights about the natural world.",
};

function pageById(id: string) {
  return studio.pages.find((item) => item.id === id);
}

export default function DifferentialEquations() {
  const location = useLocation();
  const navigate = useNavigate();
  const slug = location.pathname.slice(studio.basePath.length).replace(/^\//, "");
  const aliasedId = differentialEquationRouteAliases[slug];
  const page = (aliasedId && studio.pages.find((item) => item.id === aliasedId)) || matchStudioPage(studio, location.pathname);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [navExpanded, setNavExpanded] = useState(false);
  const [teacherMode, setTeacherMode] = useState(false);
  const [dialog, setDialog] = useState<"help" | "settings" | null>(null);
  const [compact, setCompact] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    return term ? pages.filter((item) => `${item.label} ${item.title} ${item.description} ${item.subtitle}`.toLowerCase().includes(term)).slice(0, 7) : [];
  }, [query]);
  const index = pages.findIndex((item) => item.id === page.id);
  const HeadingIcon = icons[page.id] ?? FlaskConical;
  const phase1 = page.id !== "home";

  useEffect(() => {
    setMenuOpen(false);
    setQuery("");
  }, [location.pathname]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setDialog(null); setQuery(""); setMenuOpen(false); }
      if (event.key === "/" && !(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLTextAreaElement)) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openResult = (item: StudioMockupPage) => {
    setQuery("");
    navigate(differentialEquationRouteFor(item.id));
  };

  return (
    <main className={`de-studio${compact ? " de-compact" : ""}${phase1 ? ` de-phase1-shell${phase2Ids.has(page.id) ? " de-phase2-shell" : ""}${navExpanded ? " de-phase1-expanded" : ""}` : ""}`}>
      {menuOpen && <button className="de-scrim" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
      <aside className={`de-sidebar${menuOpen ? " is-open" : ""}`}>
        <Link className="de-brand" to={studio.basePath} aria-label="Differential Equations Studio home">
          <span className="de-logo"><Activity size={25} strokeWidth={2.2} /></span>
          <span>DIFFERENTIAL EQUATIONS<strong>STUDIO</strong></span>
        </Link>
        <nav className="de-nav" aria-label="Differential Equations Studio pages">
          {groups.map((group) => (
            <div className="de-nav-group" key={group.label}>
              <span className="de-nav-heading">{group.label}</span>
              {group.ids.map((id) => {
                const item = pageById(id);
                const Icon = phase1 ? phase1Icons[id] : icons[id];
                if (!item) return null;
                return <NavLink key={id} to={differentialEquationRouteFor(id)} end={id === "home"} title={phase1 ? (id === "home" ? "Differential Equations Home" : item.label) : undefined} aria-label={phase1 ? (id === "home" ? "Differential Equations Home" : item.label) : undefined} className={({ isActive }) => `de-nav-link${isActive || page.id === id ? " active" : ""}`}>
                  <Icon aria-hidden="true" size={17} strokeWidth={2} /><span>{phase1 && id === "home" ? "Differential Equations Home" : item.label}</span>
                </NavLink>;
              })}
            </div>
          ))}
        </nav>
        <Link className="de-site-link" to="/"><Home size={16} /> <span>{phase1 ? "← App Home" : "Main site"}</span> <ChevronRight size={15} /></Link>
        <div className="de-sidebar-quote">“Small changes lead to big insights.”</div>
      </aside>

      <div className="de-stage">
        <header className="de-topbar">
          <button className="de-menu-button" aria-label={phase1 && navExpanded ? "Collapse studio navigation" : "Open navigation"} onClick={() => { if (phase1 && window.innerWidth > 950) setNavExpanded((value) => !value); else setMenuOpen(true); }}><Menu size={21} /></button>
          {phase1 && <div className="de-phase1-quicklinks"><Link to="/" title="App Home"><Home size={15} /> App Home</Link><Link to="/differential-equations" title="Differential Equations Home"><Activity size={15} /> DE Home</Link></div>}
          <div className="de-search-wrap">
            <Search size={18} aria-hidden="true" />
            <input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && results[0]) openResult(results[0]); }} placeholder="Search topics, equations, methods..." aria-label="Search Differential Equations Studio" />
            {query && <button aria-label="Clear search" onClick={() => setQuery("")}><X size={16} /></button>}
            {query && <div className="de-search-results" role="listbox" aria-label="Search results">
              {results.length ? results.map((item) => <button key={item.id} type="button" onClick={() => openResult(item)} role="option" aria-selected="false"><span>{item.label}</span><small>{item.description}</small></button>) : <p>No matching labs. Try “Euler” or “field”.</p>}
            </div>}
          </div>
          <div className="de-top-actions">
            <button className={`de-teacher-button${teacherMode ? " active" : ""}`} type="button" aria-pressed={teacherMode} onClick={() => setTeacherMode((value) => !value)}><BookOpen size={16} /> Teacher mode</button>
            <button className="de-icon-button" type="button" aria-label="Studio help" onClick={() => setDialog("help")}><CircleHelp size={18} /></button>
            <button className="de-icon-button" type="button" aria-label="Display settings" onClick={() => setDialog("settings")}><Settings2 size={18} /></button>
          </div>
        </header>

        <div className="de-main-content">
          {page.id === "home" ? <DifferentialEquationsHome studio={studio} /> : (
            <>
              <div className="de-lab-heading">
                <div><p className="de-eyebrow"><Link to={studio.basePath}>Studio Home</Link><ChevronRight size={14} />{phase1 ? phase1Headings[page.id].title : page.label}</p><h1>{phase1 ? phase1Headings[page.id].title : page.title}</h1><p>{phase1 ? phase1Headings[page.id].description : page.description}</p></div>
                {phase2Ids.has(page.id) && <blockquote className="de2-heading-quote">“{phase2Quotes[page.id]}”</blockquote>}
                <span className="de-heading-mark"><HeadingIcon size={36} /></span>
              </div>
              {teacherMode && <section className="de-teacher-note" aria-label="Teaching notes"><strong>Teaching notes</strong><p>{page.learning.observe} {page.learning.why}</p></section>}
              <div className="de-lab-body"><DifferentialEquationsLab key={page.id} page={page} /></div>
              <nav className="de-lab-next" aria-label="Adjacent labs">
                {index > 0 && <Link to={differentialEquationRouteFor(pages[index - 1].id)}>← {pages[index - 1].label}</Link>}
                {index >= 0 && index < pages.length - 1 && <Link to={differentialEquationRouteFor(pages[index + 1].id)}>{pages[index + 1].label} →</Link>}
              </nav>
            </>
          )}
        </div>
      </div>

      {dialog && <div className="de-dialog-layer" role="presentation" onMouseDown={() => setDialog(null)}>
        <section className="de-dialog" role="dialog" aria-modal="true" aria-label={dialog === "help" ? "Studio help" : "Display settings"} onMouseDown={(event) => event.stopPropagation()}>
          <button className="de-dialog-close" aria-label="Close" onClick={() => setDialog(null)}><X size={18} /></button>
          {dialog === "help" ? <><h2>Explore the studio</h2><p>Choose a lab from the sidebar, change its controls, and watch the mathematics respond. Press <kbd>/</kbd> to search for a topic.</p><p>Start with Equation Explorer to classify an equation, then use Method Selector to choose a solution approach.</p><Link to={differentialEquationRouteFor("explorer")} onClick={() => setDialog(null)}>Open Equation Explorer <ChevronRight size={16} /></Link></> : <><h2>Display settings</h2><label className="de-setting-row"><span><strong>Compact layout</strong><small>Show more of the studio at once.</small></span><input type="checkbox" checked={compact} onChange={(event) => setCompact(event.target.checked)} /></label></>}
        </section>
      </div>}
    </main>
  );
}
