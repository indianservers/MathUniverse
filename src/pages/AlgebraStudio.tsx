import {
  BarChart3,
  BookOpenCheck,
  Braces,
  Calculator,
  FlaskConical,
  FunctionSquare,
  GitFork,
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
import StudioHomeButtons from "../components/ui/StudioHomeButtons";
import "./AlgebraStudio.css";

type AlgebraPage = "home" | "expressions" | "equations" | "functions" | "polynomials" | "systems" | "exponents" | "sequences" | "structures" | "proof" | "cas" | "advanced";

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
  minutes: number;
  level: string;
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
  { id: "structures", label: "Algebraic Structures", route: "/algebraic-structures", icon: GitFork },
  { id: "proof", label: "Algebraic Proof", route: "/algebra/proof", icon: BookOpenCheck },
  { id: "cas", label: "Candidate checker", route: "/algebra/cas", icon: Calculator },
  { id: "advanced", label: "Advanced Workbench", route: "/algebra/advanced", icon: FlaskConical },
];

const topicStudios: TopicStudio[] = [
  { id: "expressions", label: "Expressions", route: "/algebra/expressions", description: "Build and simplify algebraic expressions.", iconSrc: "/assets/algebra-studio/algebra-icon-expressions.png", tabs: ["Simplify", "Expand", "Factor", "Combine Terms"], minutes: 8, level: "Start here" },
  { id: "equations", label: "Equations", route: "/algebra/equations", description: "Solve and balance equations visually.", iconSrc: "/assets/algebra-studio/algebra-icon-equations.png", tabs: ["Linear", "Quadratic", "Absolute Value", "Inequalities"], minutes: 10, level: "Core" },
  { id: "functions", label: "Functions", route: "/algebra/functions", description: "Explore functions and transformations.", iconSrc: "/assets/algebra-studio/algebra-icon-functions.png", tabs: ["Families", "Transformations", "Composition", "Inverse", "Piecewise"], minutes: 10, level: "Core" },
  { id: "polynomials", label: "Polynomials", route: "/algebra/polynomials", description: "Analyze polynomials and their roots.", iconSrc: "/assets/algebra-studio/algebra-icon-polynomials.png", tabs: ["Roots", "Factors", "Division", "End Behavior", "Multiplicity"], minutes: 10, level: "Core" },
  { id: "systems", label: "Systems", route: "/algebra/systems", description: "Solve systems graphically.", iconSrc: "/assets/algebra-studio/algebra-icon-systems.png", tabs: ["Graphing", "Substitution", "Elimination", "Matrices", "Inequalities"], minutes: 10, level: "Next" },
  { id: "exponents", label: "Exponents & Logs", route: "/algebra/exponents-logs", description: "Work with exponential and logarithmic functions.", iconSrc: "/assets/algebra-studio/algebra-icon-exponents.png", tabs: ["Exponent Laws", "Radicals", "Exponential & Logs", "Equations"], minutes: 10, level: "Next" },
  { id: "sequences", label: "Sequences", route: "/algebra/sequences", description: "Find patterns and general terms.", iconSrc: "/assets/algebra-studio/algebra-icon-sequences.png", tabs: ["Arithmetic", "Geometric", "Recursive", "Sigma", "Patterns"], minutes: 8, level: "Next" },
  { id: "proof", label: "Algebraic Proof", route: "/algebra/proof", description: "Construct and validate proofs.", iconSrc: "/assets/algebra-studio/algebra-icon-proof.png", tabs: ["Identities", "Equation Proof", "Induction", "Inequality", "Counterexample"], minutes: 12, level: "Apply" },
  { id: "cas", label: "Candidate checker", route: "/algebra/cas", description: "Check candidate roots and identities against the live graph — not a Wolfram language.", iconSrc: "/assets/algebra-studio/algebra-icon-cas.png", tabs: ["Solve", "Simplify", "Factor", "Expand", "Substitute", "Differentiate"], minutes: 8, level: "Extend" },
  { id: "advanced", label: "Advanced Workbench", route: "/algebra/advanced", description: "Twenty-five linked algebra tools in one workbench.", iconSrc: "/assets/algebra-studio/algebra-studio-mark.png", tabs: [], minutes: 12, level: "Extend" },
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
          <StudioHomeButtons studioTo="/algebra" />
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
                <Link key={item.id} to={item.route} className="alg-map-node">
                  <TopicPreview id={item.id} />
                  <b>{item.label}</b>
                </Link>
              ))}
            </div>
            <div className="alg-map-core"><AlgebraMark /><span>ALGEBRA</span></div>
            <div className="alg-map-group">
              {topicStudios.filter((item) => item.id !== "advanced").slice(4).map((item) => (
                <Link key={item.id} to={item.route} className="alg-map-node">
                  <TopicPreview id={item.id} />
                  <b>{item.label}</b>
                </Link>
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
                      <TopicPreview id={item.id} />
                      <p>{item.description}</p>
                      <em className="alg-topic-meta">{`${item.level} · ${item.minutes} min`}</em>
                      <span className="alg-topic-modes">{item.tabs.slice(0, 3).join(" · ")}</span>
                      <em className="alg-topic-open">Open {item.label}</em>
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
            <div className="alg-mini-parabola" aria-hidden="true" />
            <Link className="alg-gradient-button" to={resumeRoute}>Resume</Link>
          </section>
          <section className="alg-card alg-journey-card">
            <h2>Your learning journey</h2>
            <div className="alg-progress" style={{ ["--pct" as string]: String(progress) }} aria-label={`${progress} percent`}><strong>{progress}%</strong></div>
            <dl>
              <div><dt>Topics explored</dt><dd>{visited.length} / 9</dd></div>
              <div><dt>Skills in motion</dt><dd>{Math.min(68, visited.length * 8)} / 68</dd></div>
              <div><dt>Challenges</dt><dd>{progress > 0 ? "Started" : "0 / 32"}</dd></div>
            </dl>
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

function TopicPreview({ id }: { id: TopicStudio["id"] }) {
  if (id === "expressions") return <div className="alg-mini-tiles" aria-hidden="true"><i>x</i><i>x</i><i>+</i><i>3</i></div>;
  if (id === "equations") return <div className="alg-mini-balance" aria-hidden="true"><span>2x+3</span><b>=</b><span>7</span></div>;
  if (id === "functions") return <svg className="alg-mini-parabola" viewBox="0 0 160 62" aria-hidden="true"><path d="M8 50 Q 40 8 80 40 T 152 18" fill="none" stroke="#8b5cf6" strokeWidth="3" /><path d="M8 50 Q 50 20 90 48 T 152 30" fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="4 3" /></svg>;
  if (id === "polynomials") return <svg className="alg-mini-parabola" viewBox="0 0 160 62" aria-hidden="true"><path d="M6 40 C 30 8, 50 70, 80 28 S 130 8, 154 44" fill="none" stroke="#8b5cf6" strokeWidth="3" /></svg>;
  if (id === "systems") return <div className="alg-mini-system" aria-hidden="true"><i /><i /></div>;
  if (id === "exponents") return <div className="alg-mini-formula" aria-hidden="true">y = 2ˣ · log x</div>;
  if (id === "sequences") return <div className="alg-mini-sequence" aria-hidden="true">2 5 10 17 26</div>;
  if (id === "proof") return <div className="alg-mini-proof" aria-hidden="true"><span>Given</span><span>Show</span><span>∴</span></div>;
  if (id === "cas") return <div className="alg-mini-formula" aria-hidden="true">expand (x+2)³</div>;
  return null;
}
