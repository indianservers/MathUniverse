import {
  BarChart3,
  BookOpenCheck,
  Braces,
  Calculator,
  FlaskConical,
  FunctionSquare,
  Home,
  Lightbulb,
  LineChart,
  MoveRight,
  Play,
  Search,
  Sparkles,
  SquareFunction,
  Target,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { ExpressionsLab, FunctionsLab, PolynomialsLab, SystemsLab, ExponentsLab, SequencesLab, ProofLab, CasGateway } from "../studios/algebra/AlgebraInteractiveLabs";
import EquationsLab from "../studios/algebra/EquationsLab";
import { useProgress } from "../hooks/useProgress";
import AlgebraEnhancementWorkbench from "../studios/algebra/AlgebraEnhancementWorkbench";
import { answersMatchChallenge } from "../studios/algebra/algebraStudioMath";
import StudioBreadcrumb, { mathStudioCrumbs } from "../components/ui/StudioBreadcrumb";
import "./AlgebraStudio.css";

type AlgebraPage = "home" | "expressions" | "equations" | "functions" | "polynomials" | "systems" | "exponents" | "sequences" | "proof" | "cas" | "advanced";

type StudioNavItem = {
  id: AlgebraPage;
  label: string;
  route: string;
  icon: LucideIcon;
};

type TopicStudio = {
  id: Exclude<AlgebraPage, "home">;
  label: string;
  route: string;
  description: string;
  iconSrc: string;
  tabs: string[];
};

const LAST_ROUTE_KEY = "algebra-studio:last-route";
const VISITED_KEY = "algebra-studio:visited-topics";

const studioNav: StudioNavItem[] = [
  { id: "home", label: "Studio Home", route: "/algebra", icon: Home },
  { id: "expressions", label: "Expressions", route: "/algebra/expressions", icon: FunctionSquare },
  { id: "equations", label: "Equations", route: "/algebra/equations", icon: MoveRight },
  { id: "functions", label: "Functions", route: "/algebra/functions", icon: LineChart },
  { id: "polynomials", label: "Polynomials", route: "/algebra/polynomials", icon: SquareFunction },
  { id: "systems", label: "Systems", route: "/algebra/systems", icon: Braces },
  { id: "exponents", label: "Exponents & Logs", route: "/algebra/exponents-logs", icon: Sparkles },
  { id: "sequences", label: "Sequences", route: "/algebra/sequences", icon: BarChart3 },
  { id: "proof", label: "Algebraic Proof", route: "/algebra/proof", icon: BookOpenCheck },
  { id: "cas", label: "CAS Explorer", route: "/algebra/cas", icon: Calculator },
  { id: "advanced", label: "Advanced Workbench", route: "/algebra/advanced", icon: FlaskConical },
];

const topicStudios: TopicStudio[] = [
  { id: "expressions", label: "Expressions", route: "/algebra/expressions", description: "Build and simplify algebraic expressions.", iconSrc: "/assets/algebra-studio/algebra-icon-expressions.png", tabs: ["Simplify", "Expand", "Factor", "Combine Terms"] },
  { id: "equations", label: "Equations", route: "/algebra/equations", description: "Solve and balance equations visually.", iconSrc: "/assets/algebra-studio/algebra-icon-equations.png", tabs: ["Linear", "Quadratic", "Absolute Value", "Inequalities"] },
  { id: "functions", label: "Functions", route: "/algebra/functions", description: "Explore functions and transformations.", iconSrc: "/assets/algebra-studio/algebra-icon-functions.png", tabs: ["Families", "Transformations", "Composition", "Inverse", "Piecewise"] },
  { id: "polynomials", label: "Polynomials", route: "/algebra/polynomials", description: "Analyze polynomials and their roots.", iconSrc: "/assets/algebra-studio/algebra-icon-polynomials.png", tabs: ["Roots", "Factors", "Division", "End Behavior", "Multiplicity"] },
  { id: "systems", label: "Systems", route: "/algebra/systems", description: "Solve systems graphically.", iconSrc: "/assets/algebra-studio/algebra-icon-systems.png", tabs: ["Graphing", "Substitution", "Elimination", "Matrices", "Inequalities"] },
  { id: "exponents", label: "Exponents & Logs", route: "/algebra/exponents-logs", description: "Work with exponential and logarithmic functions.", iconSrc: "/assets/algebra-studio/algebra-icon-exponents.png", tabs: ["Exponent Laws", "Radicals", "Exponential & Logs", "Equations"] },
  { id: "sequences", label: "Sequences", route: "/algebra/sequences", description: "Find patterns and general terms.", iconSrc: "/assets/algebra-studio/algebra-icon-sequences.png", tabs: ["Arithmetic", "Geometric", "Recursive", "Sigma", "Patterns"] },
  { id: "proof", label: "Algebraic Proof", route: "/algebra/proof", description: "Construct and validate proofs.", iconSrc: "/assets/algebra-studio/algebra-icon-proof.png", tabs: ["Identities", "Equation Proof", "Induction", "Inequality", "Counterexample"] },
  { id: "cas", label: "CAS Explorer", route: "/algebra/cas", description: "Opens the connected CAS workspace.", iconSrc: "/assets/algebra-studio/algebra-icon-cas.png", tabs: ["Solve", "Simplify", "Factor", "Expand", "Substitute", "Differentiate"] },
  { id: "advanced", label: "Advanced Workbench", route: "/algebra/advanced", description: "Twenty-five linked algebra tools in one workbench.", iconSrc: "/assets/algebra-studio/algebra-studio-mark.png", tabs: [] },
];

const routePage: Record<string, AlgebraPage> = Object.fromEntries(studioNav.map((item) => [item.route, item.id])) as Record<string, AlgebraPage>;

function readStringList(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export default function AlgebraStudio() {
  const location = useLocation();
  const page = routePage[location.pathname] ?? "home";

  useEffect(() => {
    if (page === "home") return;
    localStorage.setItem(LAST_ROUTE_KEY, location.pathname);
    const seen = new Set(readStringList(VISITED_KEY));
    seen.add(page);
    localStorage.setItem(VISITED_KEY, JSON.stringify([...seen]));
  }, [location.pathname, page]);

  return (
    <main className="alg-studio">
      <AlgebraSidebar page={page} />
      <section className="alg-stage" data-testid="algebra-scroll-pane">
        {page === "home" && <StudioHome />}
        {page === "expressions" && <ExpressionsLab />}
        {page === "equations" && <EquationsLab />}
        {page === "functions" && <FunctionsLab />}
        {page === "polynomials" && <PolynomialsLab />}
        {page === "systems" && <SystemsLab />}
        {page === "exponents" && <ExponentsLab />}
        {page === "sequences" && <SequencesLab />}
        {page === "proof" && <ProofLab />}
        {page === "cas" && <CasGateway />}
        {page === "advanced" && <AlgebraEnhancementWorkbench />}
      </section>
    </main>
  );
}

function AlgebraSidebar({ page }: { page: AlgebraPage }) {
  return (
    <aside className="alg-sidebar">
      <Link className="alg-brand" to="/algebra" aria-label="Algebra Studio home"><AlgebraMark /><span><b>ALGEBRA</b><b>STUDIO</b></span></Link>
      <Link className="alg-main-link" to="/"><Home /> <span>Main</span></Link>
      <nav aria-label="Algebra Studio navigation">
        {studioNav.map(({ id, label, route, icon: Icon }) => (
          <NavLink key={id} to={route} end={id === "home"} className={id === page ? "active" : ""}><Icon /><span>{label}</span></NavLink>
        ))}
      </nav>
    </aside>
  );
}

function AlgebraMark() {
  return <img className="alg-mark-img" src="/assets/algebra-studio/algebra-studio-mark.png" alt="" width={40} height={40} />;
}

function StudioHome() {
  const { getTopicProgress, markTopicVisited } = useProgress();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [visited, setVisited] = useState<string[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);
  const resumeRoute = typeof window === "undefined" ? "/algebra/functions" : (localStorage.getItem(LAST_ROUTE_KEY) || "/algebra/functions");
  const resumeLabel = studioNav.find((item) => item.route === resumeRoute)?.label ?? "Functions";
  const progress = getTopicProgress("algebra");
  const challengeExpression = "2*(x+3)-(x-1)";

  useEffect(() => {
    markTopicVisited("algebra");
    setVisited(readStringList(VISITED_KEY));
  }, [markTopicVisited]);

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
    const launchTopics = topicStudios.filter((item) => item.id !== "advanced");
    const needle = query.trim().toLowerCase();
    if (!needle) return launchTopics;
    return launchTopics.filter((item) => `${item.label} ${item.description} ${item.route} ${item.tabs.join(" ")}`.toLowerCase().includes(needle));
  }, [query]);

  return (
    <div className="alg-page">
      <header className="alg-header">
        <div>
          <StudioBreadcrumb crumbs={mathStudioCrumbs({ label: "Algebra", to: "/algebra" })} />
          <h1>Welcome to Algebra Studio</h1>
          <p>See the pattern. Shape the equation. Launch any lab from the map or the numbered cards.</p>
        </div>
        <label className="alg-landing-search">
          <Search />
          <input ref={searchRef} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search topics, examples, or concepts..." aria-label="Search Algebra Studio topics" />
          <kbd>Ctrl K</kbd>
        </label>
      </header>
      <div className="alg-home-grid">
        <div>
          <section className="alg-concept-map" aria-label="Algebra concept map">
            <div className="alg-map-group">
              {topicStudios.filter((item) => item.id !== "advanced").slice(0, 4).map((item) => (
                <Link key={item.id} to={item.route}>{item.label}</Link>
              ))}
            </div>
            <div className="alg-map-core"><AlgebraMark /><span>ALGEBRA</span></div>
            <div className="alg-map-group">
              {topicStudios.filter((item) => item.id !== "advanced").slice(4).map((item) => (
                <Link key={item.id} to={item.route}>{item.label}</Link>
              ))}
            </div>
          </section>
          <section className="alg-card alg-launch" id="algebra-topics">
            <h2>Launch a topic</h2>
            <p>Nine interactive labs. Open a studio or jump into a tab.</p>
            {filtered.length === 0 ? <p className="alg-empty">No topics match “{query}”.</p> : (
              <div className="alg-topic-grid">
                {filtered.map((item, index) => (
                  <article key={item.id} className="alg-topic-card">
                    <span className="alg-topic-number">{index + 1}</span>
                    <Link to={item.route}>
                      <header><img src={item.iconSrc} alt="" width={56} height={56} /><b>{item.label}</b></header>
                      <p>{item.description}</p>
                    </Link>
                    <nav className="alg-topic-tabs" aria-label={`${item.label} tabs`}>
                      {item.tabs.map((tab) => (
                        <Link key={tab} to={`${item.route}?mode=${encodeURIComponent(tab)}`}>{tab}</Link>
                      ))}
                    </nav>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
        <aside className="alg-home-aside">
          <section className="alg-card">
            <h2><Play /> Continue experiment</h2>
            <strong>{resumeLabel}</strong>
            <p>Resume {visited.length ? `${visited.length} topics started` : "your last lab"} · {progress}%</p>
            <Link className="alg-gradient-button" to={resumeRoute}>Resume</Link>
          </section>
          <section className="alg-card" id="algebra-challenge">
            <h2>Challenge of the day</h2>
            <p>Simplify 2(x + 3) − (x − 1)</p>
            <div className="alg-answer-grid">{["x + 7", "2x + 5", "3x + 7", "x + 5"].map((choice) => (
              <button type="button" key={choice} aria-pressed={answer === choice} onClick={() => { setAnswer(choice); setChecked(false); }}>{choice}</button>
            ))}</div>
            <button className="alg-gradient-button" type="button" onClick={() => setChecked(true)}>Check answer</button>
            {checked && <p role="status">{answersMatchChallenge(answer, challengeExpression) ? "Correct: the choice is equivalent to 2(x + 3) − (x − 1)." : "Distribute the minus sign, then combine like terms."}</p>}
          </section>
        </aside>
      </div>
      <section className="alg-learning-strip" aria-label="Learning loop">
        <div role="button" tabIndex={0} onClick={() => document.querySelector(".alg-concept-map")?.scrollIntoView({ behavior: "smooth" })} onKeyDown={(event) => { if (event.key === "Enter") document.querySelector(".alg-concept-map")?.scrollIntoView({ behavior: "smooth" }); }}><Lightbulb /><span><b>Observe</b><small>Visualize concepts with interactive diagrams.</small></span></div>
        <div role="button" tabIndex={0} onClick={() => document.getElementById("algebra-topics")?.scrollIntoView({ behavior: "smooth" })} onKeyDown={(event) => { if (event.key === "Enter") document.getElementById("algebra-topics")?.scrollIntoView({ behavior: "smooth" }); }}><Target /><span><b>Understand</b><small>Build intuition with clear explanations.</small></span></div>
        <div role="button" tabIndex={0} onClick={() => navigate("/algebra/proof")} onKeyDown={(event) => { if (event.key === "Enter") navigate("/algebra/proof"); }}><Sparkles /><span><b>Why</b><small>Discover the ideas and connections behind.</small></span></div>
        <div role="button" tabIndex={0} onClick={() => navigate("/algebra/expressions")} onKeyDown={(event) => { if (event.key === "Enter") navigate("/algebra/expressions"); }}><FlaskConical /><span><b>Try</b><small>Experiment, manipulate, and see results live.</small></span></div>
        <div role="button" tabIndex={0} onClick={() => document.getElementById("algebra-challenge")?.scrollIntoView({ behavior: "smooth" })} onKeyDown={(event) => { if (event.key === "Enter") document.getElementById("algebra-challenge")?.scrollIntoView({ behavior: "smooth" }); }}><Trophy /><span><b>Challenge</b><small>Solve problems and test your mastery.</small></span></div>
      </section>
    </div>
  );
}
