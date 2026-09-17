import { Hash, Home, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import StudioBreadcrumb, { mathStudioCrumbs } from "../components/ui/StudioBreadcrumb";
import StudioHomeButtons from "../components/ui/StudioHomeButtons";
import { StudioCanvasToolbar } from "../components/ui/StudioCanvasToolbar";
import { StudioLessonLinks } from "../components/lessons/StudioLessonLinks";
import { shareStudio } from "../utils/shareStudio";
import {
  ConceptsLab,
  HierarchyLab,
  IrrationalLab,
  NUMBER_LABS,
  NestedSetsHero,
  PracticeLab,
  RationalLab,
  RealLineLab,
} from "../studios/number-systems/NumberSystemsLabs";
import {
  NUMBER_SYSTEMS_ROUTES,
  NUMBER_TAB_REDIRECTS,
  coachDismissed,
  completedLabs,
  lastNumberSystemsRoute,
  pageFromPath,
  readClassBand,
  rememberLastRoute,
  saveClassBand,
  studioProgressPercent,
  type NumberClassBand,
  type NumberSystemsPage,
} from "./numberSystemsStudioSession";
import "./NumberSystemsStudio.css";

const nav: Array<{ id: NumberSystemsPage; label: string; route: string }> = [
  { id: "home", label: "Studio Home", route: NUMBER_SYSTEMS_ROUTES.home },
  { id: "rational", label: "Rational", route: NUMBER_SYSTEMS_ROUTES.rational },
  { id: "irrational", label: "Irrational", route: NUMBER_SYSTEMS_ROUTES.irrational },
  { id: "real-line", label: "Real line", route: NUMBER_SYSTEMS_ROUTES["real-line"] },
  { id: "hierarchy", label: "Hierarchy", route: NUMBER_SYSTEMS_ROUTES.hierarchy },
  { id: "concepts", label: "Concepts", route: NUMBER_SYSTEMS_ROUTES.concepts },
  { id: "practice", label: "Practice", route: NUMBER_SYSTEMS_ROUTES.practice },
];

export default function NumberSystems() {
  const location = useLocation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const page = pageFromPath(location.pathname);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const tab = params.get("tab");
    if (page === "home" && tab && NUMBER_TAB_REDIRECTS[tab]) {
      navigate(NUMBER_SYSTEMS_ROUTES[NUMBER_TAB_REDIRECTS[tab]], { replace: true });
    }
  }, [navigate, page, params]);

  useEffect(() => {
    document.title = `${page === "home" ? "Number Systems Studio" : nav.find((item) => item.id === page)?.label ?? "Number Systems"} | Math Universe`;
    if (page !== "home") rememberLastRoute(location.pathname);
    setProgress(studioProgressPercent());
  }, [location.pathname, page]);

  const refresh = () => setProgress(studioProgressPercent());

  return (
    <main className="ns-studio">
      <aside className="ns-sidebar">
        <Link className="ns-brand" to="/number-systems" aria-label="Number Systems Studio home">
          <Hash />
          <span><b>NUMBER</b><b>SYSTEMS</b></span>
        </Link>
        <Link className="ns-main-link" to="/"><Home /><span>Main</span></Link>
        <nav aria-label="Number Systems Studio navigation">
          {nav.map((item) => (
            <NavLink key={item.id} to={item.route} end={item.id === "home"} className={page === item.id ? "active" : ""}>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <Link className="ns-side-extra" to="/number-systems/formula-visualizer">Formulas</Link>
      </aside>
      <section className="ns-stage" data-testid="number-systems-scroll-pane">
        {page !== "home" ? <StudioCanvasToolbar /> : null}
        {page === "home" ? <StudioHome progress={progress} /> : null}
        {page === "rational" ? <RationalLab onComplete={refresh} /> : null}
        {page === "irrational" ? <IrrationalLab onComplete={refresh} /> : null}
        {page === "real-line" ? <RealLineLab onComplete={refresh} /> : null}
        {page === "hierarchy" ? <HierarchyLab onComplete={refresh} /> : null}
        {page === "concepts" ? <ConceptsLab onComplete={refresh} /> : null}
        {page === "practice" ? <PracticeLab onComplete={refresh} /> : null}
        {page !== "home" ? <StudioLessonLinks pathname="/number-systems" /> : null}
      </section>
    </main>
  );
}

function StudioHome({ progress }: { progress: number }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [band, setBand] = useState<NumberClassBand>(readClassBand);
  const [shareStatus, setShareStatus] = useState("");
  const [coachStep, setCoachStep] = useState(0);
  const done = completedLabs();
  const resume = lastNumberSystemsRoute();
  const resumeLabel = nav.find((item) => item.route === resume)?.label ?? "Rational";
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return NUMBER_LABS.filter((item) => {
      if (band !== "all" && !item.grade.includes(band)) return false;
      if (!needle) return true;
      return `${item.label} ${item.description} ${item.modes.join(" ")}`.toLowerCase().includes(needle);
    });
  }, [band, query]);

  return (
    <div className="ns-page">
      <header className="ns-header">
        <div>
          <StudioHomeButtons studioTo="/number-systems" />
          <StudioBreadcrumb crumbs={mathStudioCrumbs({ label: "Number Systems", to: "/number-systems" })} />
          <h1>Welcome to Number Systems Studio</h1>
          <p>See fractions, surds, and nested number sets. Progress counts only completed checks, not clicks.</p>
        </div>
        <label className="ns-search">
          <Search />
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search labs…" aria-label="Search Number Systems labs" />
        </label>
      </header>
      <NestedSetsHero progress={progress} onSelect={(id) => {
        if (id === "rational") { setQuery("rational"); navigate("/number-systems/rational"); }
        if (id === "irrational") navigate("/number-systems/irrational");
        if (id === "hierarchy") navigate("/number-systems/hierarchy");
      }} />
      <div className="ns-home-grid">
        <section>
          {!coachDismissed() ? (
            <p className="ns-coach">
              {coachStep === 0 ? "Start with Rational numbers. Use a preset, then answer the yes/no check to earn progress." : coachStep === 1 ? "Next: place a fraction and a surd on the real line." : "Then open Hierarchy to see ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ."}
              <button type="button" onClick={() => setCoachStep((step) => Math.min(2, step + 1))}>Next tip</button>
            </p>
          ) : null}
          <p className="sl-kicker">{band === "jee" ? "JEE example: prove √2 is irrational." : band === "6-7" ? "Class 6–7 example: write 3/4 as a decimal." : "Class 8–10 example: locate √9 and √2."}</p>
          <div className="ns-bands" role="group" aria-label="Who this is for">
            {([["all", "All classes"], ["6-7", "Classes 6–7"], ["8-10", "Classes 8–10"], ["jee", "JEE / degree"]] as const).map(([id, label]) => (
              <button key={id} type="button" className={band === id ? "active" : ""} onClick={() => { setBand(id); saveClassBand(id); }}>{label}</button>
            ))}
          </div>
          <div className="ns-topic-grid">
            {filtered.map((item, index) => (
              <article key={item.id} className={`ns-topic ${done.includes(item.id) ? "is-done" : ""}`}>
                <span>{done.includes(item.id) ? "✓" : index + 1}</span>
                <Link to={NUMBER_SYSTEMS_ROUTES[item.id]}>
                  <b>{item.label}</b>
                  <p>{item.description}</p>
                  <em>{item.level} · {item.minutes} min</em>
            {item.id === "rational" ? <small>Decimal vs fraction in the lab. Insert another rational between a and b on the line.</small> : null}
            {item.id === "irrational" ? <small>Surd simplify chips live in the lab.</small> : null}
            {item.id === "real-line" ? <small>Completeness hole: zoom between rationals.</small> : null}
                </Link>
              </article>
            ))}
            <article className="ns-topic">
              <span>ƒ</span>
              <Link to="/number-systems/formula-visualizer">
                <b>Formula visualizer</b>
                <p>See the nested-set formulas in motion.</p>
                <em>Extend · 6 min</em>
                <small>Identities · nested sets</small>
              </Link>
            </article>
          </div>
        </section>
        <aside className="ns-home-aside">
          <section className="ns-panel">
            <h2>Continue</h2>
            <strong>{resumeLabel}</strong>
            <p>{done.length} labs completed · {progress}%</p>
            <Link className="ns-cta" to={resume}>Resume</Link>
            <button type="button" onClick={async () => {
              const url = new URL(window.location.href);
              url.searchParams.set("band", band);
              url.searchParams.set("lab", resume);
              setShareStatus(await shareStudio("Number Systems Studio", url.toString()));
            }}>Share setup</button>
            {shareStatus ? <p role="status">{shareStatus}</p> : null}
          </section>
          <section className="ns-panel">
            <h2>Pinned lessons</h2>
            <Link to="/lessons/numbers-and-arithmetic/60-rational-numbers">Lesson 60 · Rational numbers</Link>
            <Link to="/lessons/numbers-and-arithmetic/61-irrational-numbers">Lesson 61 · Irrational numbers</Link>
            <Link to="/lessons/numbers-and-arithmetic/62-real-numbers">Lesson 62 · Real numbers</Link>
          </section>
          <section className="ns-panel">
            <h2>Connected labs</h2>
            <Link to="/ncert/class-7-rational-numbers">Class 7 rational</Link>
            <Link to="/ncert/class-9-number-systems">Class 9 number systems</Link>
            <Link to="/ncert/class-10-real-numbers">Class 10 real numbers</Link>
            <Link to="/number-systems/formula-visualizer">Formula visualizer</Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
