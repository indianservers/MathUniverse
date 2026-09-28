import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Activity, BookOpen, ChevronRight, CircleHelp, CircuitBoard, Compass,
  FlaskConical, FunctionSquare, GitBranch, Home, LineChart, Menu,
  Network, Search, Settings2, Sigma, Sparkles, Waves, X,
  type LucideIcon,
} from "lucide-react";
import { matchStudioPage, studioMockups, type StudioMockupPage } from "../studios/mockup/studioMockupCatalog";
import DifferentialEquationsHome from "../studios/differential-equations/DifferentialEquationsHome";
import DifferentialEquationsLab from "../studios/differential-equations/DifferentialEquationsLabs";
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

function pageById(id: string) {
  return studio.pages.find((item) => item.id === id);
}

export default function DifferentialEquations() {
  const location = useLocation();
  const navigate = useNavigate();
  const page = matchStudioPage(studio, location.pathname);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
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
    navigate(item.route);
  };

  return (
    <main className={`de-studio${compact ? " de-compact" : ""}`}>
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
                const Icon = icons[id];
                if (!item) return null;
                return <NavLink key={id} to={item.route} end={id === "home"} className={({ isActive }) => `de-nav-link${isActive ? " active" : ""}`}>
                  <Icon aria-hidden="true" size={17} strokeWidth={2} /><span>{item.label}</span>
                </NavLink>;
              })}
            </div>
          ))}
        </nav>
        <Link className="de-site-link" to="/"><Home size={16} /> Main site <ChevronRight size={15} /></Link>
        <div className="de-sidebar-quote">“Small changes lead to big insights.”</div>
      </aside>

      <div className="de-stage">
        <header className="de-topbar">
          <button className="de-menu-button" aria-label="Open navigation" onClick={() => setMenuOpen(true)}><Menu size={21} /></button>
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
                <div><p className="de-eyebrow"><Link to={studio.basePath}>Studio Home</Link><ChevronRight size={14} />{page.label}</p><h1>{page.title}</h1><p>{page.description}</p></div>
                <span className="de-heading-mark"><HeadingIcon size={36} /></span>
              </div>
              {teacherMode && <section className="de-teacher-note" aria-label="Teaching notes"><strong>Teaching notes</strong><p>{page.learning.observe} {page.learning.why}</p></section>}
              <div className="de-lab-body"><DifferentialEquationsLab key={page.id} page={page} /></div>
              <nav className="de-lab-next" aria-label="Adjacent labs">
                {index > 0 && <Link to={pages[index - 1].route}>← {pages[index - 1].label}</Link>}
                {index >= 0 && index < pages.length - 1 && <Link to={pages[index + 1].route}>{pages[index + 1].label} →</Link>}
              </nav>
            </>
          )}
        </div>
      </div>

      {dialog && <div className="de-dialog-layer" role="presentation" onMouseDown={() => setDialog(null)}>
        <section className="de-dialog" role="dialog" aria-modal="true" aria-label={dialog === "help" ? "Studio help" : "Display settings"} onMouseDown={(event) => event.stopPropagation()}>
          <button className="de-dialog-close" aria-label="Close" onClick={() => setDialog(null)}><X size={18} /></button>
          {dialog === "help" ? <><h2>Explore the studio</h2><p>Choose a lab from the sidebar, change its controls, and watch the mathematics respond. Press <kbd>/</kbd> to search for a topic.</p><p>Start with Equation Explorer to classify an equation, then use Method Selector to choose a solution approach.</p><Link to="/differential-equations/explorer" onClick={() => setDialog(null)}>Open Equation Explorer <ChevronRight size={16} /></Link></> : <><h2>Display settings</h2><label className="de-setting-row"><span><strong>Compact layout</strong><small>Show more of the studio at once.</small></span><input type="checkbox" checked={compact} onChange={(event) => setCompact(event.target.checked)} /></label></>}
        </section>
      </div>}
    </main>
  );
}
