import {
  Compass,
  FlaskConical,
  Flower2,
  GitBranch,
  Home,
  Infinity,
  Lightbulb,
  Play,
  Plus,
  RotateCw,
  Search,
  Sparkles,
  Target,
  Trophy,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import StudioBreadcrumb, { mathStudioCrumbs } from "../components/ui/StudioBreadcrumb";
import StudioHomeButtons from "../components/ui/StudioHomeButtons";
import {
  COMPLEX_SEARCH_ALIASES,
  complexProgressPercent,
  continueComplexHref,
  markComplexVisit,
  useComplexSession,
} from "../studios/complex/complexStudioSession";
import ComplexNumbersStudioLabs from "../studios/complex/ComplexNumbersStudioLabs";
import { studioMockups } from "../studios/mockup/studioMockupCatalog";
import { studioLabMeta } from "../studios/mockup/studioLabMeta";
import "./ComplexNumbersStudio.css";

const catalog = studioMockups["complex-numbers"];

type ComplexPage =
  | "home"
  | "argand-plane"
  | "arithmetic"
  | "polar-forms"
  | "rotation"
  | "roots"
  | "euler"
  | "loci"
  | "fractals"
  | "waves-circuits";

type StudioNavItem = {
  id: ComplexPage;
  label: string;
  route: string;
  icon: LucideIcon;
};

const studioNav: StudioNavItem[] = [
  { id: "home", label: "Studio Home", route: "/complex-numbers", icon: Home },
  { id: "argand-plane", label: "Argand Plane", route: "/complex-numbers/argand-plane", icon: Compass },
  { id: "arithmetic", label: "Arithmetic", route: "/complex-numbers/arithmetic", icon: Plus },
  { id: "polar-forms", label: "Polar Forms", route: "/complex-numbers/polar-forms", icon: Target },
  { id: "rotation", label: "Rotation", route: "/complex-numbers/rotation", icon: RotateCw },
  { id: "roots", label: "Roots", route: "/complex-numbers/roots", icon: Flower2 },
  { id: "euler", label: "Euler Formula", route: "/complex-numbers/euler", icon: Infinity },
  { id: "loci", label: "Loci & Transforms", route: "/complex-numbers/loci", icon: GitBranch },
  { id: "fractals", label: "Fractals", route: "/complex-numbers/fractals", icon: Sparkles },
  { id: "waves-circuits", label: "Waves & Circuits", route: "/complex-numbers/waves-circuits", icon: Waves },
];

const routePage: Record<string, ComplexPage> = Object.fromEntries(studioNav.map((item) => [item.route, item.id])) as Record<string, ComplexPage>;

const labs = catalog.pages.filter((page) => page.id !== "home");
const FLOW = [
  { label: "Argand", to: "/complex-numbers/argand-plane" },
  { label: "Arithmetic", to: "/complex-numbers/arithmetic" },
  { label: "Polar", to: "/complex-numbers/polar-forms" },
  { label: "Roots", to: "/complex-numbers/roots" },
  { label: "Euler", to: "/complex-numbers/euler" },
];

export default function ComplexNumbersStudio() {
  const location = useLocation();
  const pathname = location.pathname.replace(/\/$/, "") || "/complex-numbers";
  const page = routePage[pathname] ?? "home";

  useEffect(() => {
    if (page === "home") return;
    const meta = catalog.pages.find((item) => item.id === page);
    const mode = new URLSearchParams(location.search).get("mode");
    markComplexVisit(page, pathname, meta?.label ?? page, mode);
  }, [location.pathname, location.search, page, pathname]);

  return (
    <main className="cxs-studio" data-complex-studio="dedicated">
      <ComplexSidebar page={page} />
      <section className="cxs-stage" data-testid="complex-scroll-pane">
        {page === "home" ? <StudioHome /> : <ComplexNumbersStudioLabs pageId={page} />}
      </section>
    </main>
  );
}

function ComplexSidebar({ page }: { page: ComplexPage }) {
  return (
    <aside className="cxs-sidebar">
      <Link className="cxs-brand" to="/complex-numbers" aria-label="Complex Numbers Studio home">
        <span className="cxs-mark" aria-hidden="true">i</span>
        <span>
          <b>COMPLEX</b>
          <b>STUDIO</b>
        </span>
      </Link>
      <Link className="cxs-main-link" to="/">
        <Home /> <span>Main</span>
      </Link>
      <nav aria-label="Complex Numbers Studio navigation">
        {studioNav.map(({ id, label, route, icon: Icon }) => (
          <NavLink key={id} to={route} end={id === "home"} className={id === page ? "active" : ""}>
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

function StudioHome() {
  const session = useComplexSession();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const progress = complexProgressPercent(labs.length, session.completed);
  const continueTo = continueComplexHref(session);
  const challenge = catalog.pages.find((item) => item.id === "argand-plane");
  const needle = query.trim().toLowerCase();
  const alias = Object.entries(COMPLEX_SEARCH_ALIASES).find(([key]) => needle && key.includes(needle));

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered = useMemo(() => {
    if (!needle) return labs;
    return labs.filter((item) => `${item.label} ${item.title} ${item.description} ${item.modes.join(" ")}`.toLowerCase().includes(needle));
  }, [needle]);

  const [left, right] = [labs.slice(0, 4), labs.slice(4)];

  return (
    <div className="cxs-page cxs-home" data-studio-home="complex-numbers" data-home-layout="target-01">
      <header className="cxs-header">
        <div>
          <StudioHomeButtons studioTo="/complex-numbers" />
          <StudioBreadcrumb crumbs={mathStudioCrumbs({ label: "Complex Numbers", to: "/complex-numbers" })} />
          <h1>Welcome to Complex Numbers Studio</h1>
          <p>{catalog.homeSubtitle}</p>
        </div>
        <label className="cxs-landing-search">
          <Search />
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={catalog.searchPlaceholder}
            aria-label="Search complex labs"
          />
          <kbd>Ctrl K</kbd>
        </label>
      </header>
      <div className="cxs-home-grid">
        <div>
          <section className="cxs-concept-map" aria-label="Complex numbers concept map">
            <div className="cxs-map-group">
              {left.map((item) => (
                <Link key={item.id} to={item.route} className="cxs-map-node">
                  <TopicPreview id={item.id} />
                  <b>{item.label}</b>
                </Link>
              ))}
            </div>
            <div className="cxs-map-core">
              <span className="cxs-mark">i</span>
              <span>COMPLEX</span>
            </div>
            <div className="cxs-map-group">
              {right.map((item) => (
                <Link key={item.id} to={item.route} className="cxs-map-node">
                  <TopicPreview id={item.id} />
                  <b>{item.label}</b>
                </Link>
              ))}
            </div>
          </section>
          <ol className="cxs-flow" aria-label="Studio journey">
            {FLOW.map((step, index) => (
              <li key={step.to}>
                <Link to={step.to}>
                  <span>{index + 1}</span>
                  <b>{step.label}</b>
                </Link>
                {index < 4 ? <i aria-hidden="true">→</i> : null}
              </li>
            ))}
          </ol>
          <section className="cxs-card cxs-launch" id="complex-topics">
            <header className="cxs-launch-head">
              <h2>Launch a topic</h2>
              <Link to="/complex-numbers/argand-plane" data-topics-link="all">View all topics →</Link>
            </header>
            <p>Nine interactive Argand labs. Open a studio or jump into a tab.</p>
            {filtered.length === 0 ? <p className="cxs-empty">No topics match “{query}”.</p> : (
              <div className="cxs-topic-grid" data-lab-grid="complex-numbers">
                {filtered.map((item, index) => {
                  const meta = studioLabMeta("complex-numbers", item.id);
                  return (
                    <article key={item.id} className="cxs-topic-card">
                      <span className="cxs-topic-number">{index + 1}</span>
                      <Link to={item.route}>
                        <header><TopicPreview id={item.id} /><b>{item.label}</b></header>
                        <p>{item.description}</p>
                        <em className="cxs-topic-meta">{`${meta?.level ?? "Core"} · ${meta?.minutes ?? 10} min`}</em>
                        <span className="cxs-topic-modes">{item.modes.slice(0, 3).join(" · ")}</span>
                        <em className="cxs-topic-open">Open {item.label}</em>
                      </Link>
                      <nav className="cxs-topic-tabs" aria-label={`${item.label} tabs`}>
                        {item.modes.map((tab) => (
                          <Link key={tab} to={`${item.route}?mode=${encodeURIComponent(tab)}`}>{tab}</Link>
                        ))}
                      </nav>
                    </article>
                  );
                })}
              </div>
            )}
            {alias ? <p><Link to={`/complex-numbers/${alias[1].id}${alias[1].mode ? `?mode=${encodeURIComponent(alias[1].mode)}` : ""}`}>Open {alias[1].id}{alias[1].mode ? ` · ${alias[1].mode}` : ""}</Link></p> : null}
          </section>
        </div>
        <aside className="cxs-home-aside" data-home-rail="complex-numbers">
          <section className="cxs-card" data-rail-card="continue">
            <h2><Play /> Continue Experiment</h2>
            <strong>{session.lastLabel}</strong>
            <p>Resume {session.completed.length ? `${session.completed.length} labs completed` : "Argand Plane"} · {progress}%</p>
            <svg className="cxs-mini-argand" viewBox="0 0 160 62" aria-hidden="true">
              <line x1="8" y1="31" x2="152" y2="31" stroke="#182845" />
              <line x1="80" y1="6" x2="80" y2="56" stroke="#182845" />
              <circle cx="116" cy="18" r="6" fill="#08a8cf" />
              <line x1="80" y1="31" x2="116" y2="18" stroke="#08b9dd" />
            </svg>
            <Link className="cxs-gradient-button" to={continueTo}>Continue Experiment →</Link>
          </section>
          <section className="cxs-card" data-rail-card="journey">
            <h2>Your Learning Journey</h2>
            <div className="cxs-progress" aria-label={`${progress}% completed`}><strong>{progress}%</strong></div>
            <ol className="cxs-journey-list">
              {labs.slice(0, 6).map((item, index) => {
                const complete = session.completed.includes(item.id);
                return (
                  <li key={item.id} data-journey-status={complete ? "completed" : index === 0 ? "in-progress" : "locked"}>
                    <Link to={item.route}>{item.label}</Link>
                  </li>
                );
              })}
            </ol>
            <dl>
              <div><dt>Labs completed</dt><dd>{session.completed.length} / {labs.length}</dd></div>
              <div><dt>Overall Progress</dt><dd>{progress}%</dd></div>
            </dl>
          </section>
          {challenge ? (
            <section className="cxs-card cxs-challenge" data-rail-card="challenge" id="complex-challenge">
              <h2>Daily Visual Challenge</h2>
              <p>{challenge.challenge.prompt}</p>
              <input value={answer} onChange={(event) => { setAnswer(event.target.value); setStatus(""); }} aria-label="Challenge answer" />
              <button className="cxs-gradient-button" type="button" onClick={() => setStatus(Math.abs(Number(answer) - challenge.challenge.expected) < 0.02 ? "Correct." : challenge.challenge.hint)}>Try Challenge →</button>
              {status ? <p role="status">{status}</p> : null}
              <Link className="cxs-soft" to={challenge.route}>Open {challenge.label}</Link>
            </section>
          ) : null}
        </aside>
      </div>
      <section className="cxs-learning-strip" aria-label="Learning loop">
        <div role="button" tabIndex={0} onClick={() => document.querySelector(".cxs-concept-map")?.scrollIntoView({ behavior: "smooth" })} onKeyDown={(event) => { if (event.key === "Enter") document.querySelector(".cxs-concept-map")?.scrollIntoView({ behavior: "smooth" }); }}><Lightbulb /><span><b>Observe</b><small>Watch z move on the Argand plane.</small></span></div>
        <div role="button" tabIndex={0} onClick={() => document.getElementById("complex-topics")?.scrollIntoView({ behavior: "smooth" })} onKeyDown={(event) => { if (event.key === "Enter") document.getElementById("complex-topics")?.scrollIntoView({ behavior: "smooth" }); }}><Target /><span><b>Understand</b><small>Read modulus and argument together.</small></span></div>
        <div role="button" tabIndex={0} onClick={() => navigate("/complex-numbers/euler")} onKeyDown={(event) => { if (event.key === "Enter") navigate("/complex-numbers/euler"); }}><Sparkles /><span><b>Why</b><small>Geometry is algebra on the plane.</small></span></div>
        <div role="button" tabIndex={0} onClick={() => navigate("/complex-numbers/argand-plane")} onKeyDown={(event) => { if (event.key === "Enter") navigate("/complex-numbers/argand-plane"); }}><FlaskConical /><span><b>Try</b><small>Rotate by i and plot conjugates.</small></span></div>
        <div role="button" tabIndex={0} onClick={() => document.getElementById("complex-challenge")?.scrollIntoView({ behavior: "smooth" })} onKeyDown={(event) => { if (event.key === "Enter") document.getElementById("complex-challenge")?.scrollIntoView({ behavior: "smooth" }); }}><Trophy /><span><b>Challenge</b><small>{challenge?.challenge.prompt}</small></span></div>
      </section>
    </div>
  );
}

function TopicPreview({ id }: { id: string }) {
  if (id === "argand-plane") return <svg className="cxs-mini-argand" viewBox="0 0 72 40" aria-hidden="true"><line x1="4" y1="20" x2="68" y2="20" stroke="#08a8cf" /><line x1="36" y1="4" x2="36" y2="36" stroke="#08a8cf" /><circle cx="52" cy="12" r="4" fill="#147df2" /></svg>;
  if (id === "arithmetic") return <div className="cxs-mini-formula" aria-hidden="true">z₁ + z₂</div>;
  if (id === "polar-forms") return <div className="cxs-mini-formula" aria-hidden="true">r cis θ</div>;
  if (id === "rotation") return <div className="cxs-mini-formula" aria-hidden="true">× i = +90°</div>;
  if (id === "roots") return <div className="cxs-mini-formula" aria-hidden="true">ⁿ√z</div>;
  if (id === "euler") return <div className="cxs-mini-formula" aria-hidden="true">{"e^{iθ}"}</div>;
  if (id === "loci") return <div className="cxs-mini-formula" aria-hidden="true">|z − c| = r</div>;
  if (id === "fractals") return <div className="cxs-mini-formula" aria-hidden="true">z² + c</div>;
  if (id === "waves-circuits") return <div className="cxs-mini-formula" aria-hidden="true">Z = R + jX</div>;
  return null;
}
