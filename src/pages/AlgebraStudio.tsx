import {
  Eye,
  HelpCircle,
  Lightbulb,
  Pencil,
  Search,
  Settings,
  Trophy,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ExpressionsLab, FunctionsLab, PolynomialsLab, SystemsLab, ExponentsLab, SequencesLab, ProofLab, CasGateway } from "../studios/algebra/AlgebraInteractiveLabs";
import EquationsLab from "../studios/algebra/EquationsLab";
import { useProgress } from "../hooks/useProgress";
import AlgebraEnhancementWorkbench from "../studios/algebra/AlgebraEnhancementWorkbench";
import { answersMatchChallenge } from "../studios/algebra/algebraStudioMath";
import { AlgebraStudioNav, routePage, type AlgebraPage } from "../studios/algebra/AlgebraStudioNav";
import { dailyChallenges } from "../studios/algebra/algebraStudioCatalog";
import { namedExperiments, readLabProgress } from "../studios/algebra/algebraStudioProgress";
import { BalanceScaleTeaser, CasExpandTeaser, FactorTilesTeaser } from "../studios/landing/StudioLandingTeasers";
import { relativeOpened } from "../studios/landing/studioLandingSession";
import "../studios/landing/studioLanding.css";
import "./AlgebraStudio.css";
import "./AlgebraTarget.css";

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

const topicStudios: TopicStudio[] = [
  { id: "expressions", label: "Expressions", route: "/algebra/expressions", description: "Build and simplify algebraic expressions.", iconSrc: "/assets/algebra-studio/algebra-icon-expressions.png", tabs: ["Simplify", "Expand", "Factor", "Combine Terms"], minutes: 8, level: "Start here" },
  { id: "equations", label: "Equations", route: "/algebra/equations", description: "Solve and balance equations visually.", iconSrc: "/assets/algebra-studio/algebra-icon-equations.png", tabs: ["Linear", "Quadratic", "Absolute Value", "Inequalities"], minutes: 10, level: "Core" },
  { id: "functions", label: "Functions", route: "/algebra/functions", description: "Explore functions and transformations.", iconSrc: "/assets/algebra-studio/algebra-icon-functions.png", tabs: ["Families", "Transformations", "Composition", "Inverse", "Piecewise"], minutes: 10, level: "Core" },
  { id: "polynomials", label: "Polynomials", route: "/algebra/polynomials", description: "Analyze polynomials and their roots.", iconSrc: "/assets/algebra-studio/algebra-icon-polynomials.png", tabs: ["Roots", "Factors", "Division", "End Behavior", "Multiplicity"], minutes: 10, level: "Core" },
  { id: "systems", label: "Systems", route: "/algebra/systems", description: "Solve systems of equations graphically.", iconSrc: "/assets/algebra-studio/algebra-icon-systems.png", tabs: ["Graphing", "Substitution", "Elimination", "Matrices", "Inequalities"], minutes: 10, level: "Next" },
  { id: "exponents", label: "Exponents & Logs", route: "/algebra/exponents-logs", description: "Work with exponential and logarithmic functions.", iconSrc: "/assets/algebra-studio/algebra-icon-exponents.png", tabs: ["Exponent Laws", "Radicals", "Exponential & Logs", "Equations"], minutes: 10, level: "Next" },
  { id: "sequences", label: "Sequences", route: "/algebra/sequences", description: "Find patterns and general terms of sequences.", iconSrc: "/assets/algebra-studio/algebra-icon-sequences.png", tabs: ["Arithmetic", "Geometric", "Recursive", "Sigma", "Patterns"], minutes: 8, level: "Next" },
  { id: "proof", label: "Algebraic Proof", route: "/algebra/proof", description: "Construct and validate algebraic proofs.", iconSrc: "/assets/algebra-studio/algebra-icon-proof.png", tabs: ["Identities", "Equation Proof", "Induction", "Inequality", "Counterexample"], minutes: 12, level: "Apply" },
  { id: "cas", label: "CAS Explorer", route: "/algebra/cas", description: "Use CAS to compute, expand, factor, and more.", iconSrc: "/assets/algebra-studio/algebra-icon-cas.png", tabs: ["Solve", "Simplify", "Factor", "Expand", "Substitute", "Differentiate"], minutes: 8, level: "Extend" },
];

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
    localStorage.setItem("algebra-studio:last-at", String(Date.now()));
    const seen = new Set(readStringList(VISITED_KEY));
    seen.add(page);
    localStorage.setItem(VISITED_KEY, JSON.stringify([...seen]));
  }, [location.pathname, page]);

  return (
    <main className="alg-studio alg-studio-target">
      <AlgebraStudioNav page={page} pathname={location.pathname} />
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

function StudioHome() {
  const { markTopicVisited } = useProgress();
  const navigate = useNavigate();
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [query, setQuery] = useState("");
  const featured = dailyChallenges[0]!;
  const saved = namedExperiments();
  const lastRoute = typeof window === "undefined" ? "/algebra/functions" : (localStorage.getItem(LAST_ROUTE_KEY) || "/algebra/functions");
  const lastAt = typeof window === "undefined" ? 0 : Number(localStorage.getItem("algebra-studio:last-at") || 0);
  const lastTopic = topicStudios.find((item) => item.route === lastRoute) ?? topicStudios.find((item) => item.id === "functions")!;
  const progress = readLabProgress();
  const visited = new Set([...progress.visited, ...readStringList(VISITED_KEY)]);
  const percent = Math.round((visited.size / topicStudios.length) * 100);
  const filtered = topicStudios.filter((item) => `${item.label} ${item.description} ${item.tabs.join(" ")}`.toLowerCase().includes(query.trim().toLowerCase()));

  useEffect(() => {
    markTopicVisited("algebra");
  }, [markTopicVisited]);

  return (
    <div className="alg-page alg-home-target">
      <header className="alg-home-hero">
        <div>
          <h1>Welcome to Algebra Studio</h1>
          <p>Explore, connect, and master algebra through interactive visual models.</p>
        </div>
        <div className="alg-home-hero-tools">
          <label>
            <Search size={16} />
            <input className="alg-search-live" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search labs" aria-label="Search algebra labs" />
          </label>
          <button type="button" className="alg-icon-btn" aria-label="Help">
            <HelpCircle size={16} />
          </button>
          <button type="button" className="alg-icon-btn" aria-label="Settings">
            <Settings size={16} />
          </button>
        </div>
      </header>

      <section className="alg-concept-map alg-concept-map-target" aria-label="Algebra concept map">
        <svg className="alg-map-lines" viewBox="0 0 1100 200" preserveAspectRatio="none" aria-hidden="true">
          <path d="M70 70 C 180 30, 260 30, 360 80" fill="none" stroke="#38bdf8" strokeWidth="2" />
          <path d="M70 100 C 170 100, 260 100, 360 100" fill="none" stroke="#60a5fa" strokeWidth="2" />
          <path d="M70 130 C 180 170, 260 170, 360 120" fill="none" stroke="#818cf8" strokeWidth="2" />
          <path d="M430 80 C 500 60, 530 70, 550 100" fill="none" stroke="#a78bfa" strokeWidth="2" />
          <path d="M430 120 C 500 140, 530 130, 550 100" fill="none" stroke="#c4b5fd" strokeWidth="2" />
          <path d="M750 80 C 830 30, 920 30, 1030 70" fill="none" stroke="#34d399" strokeWidth="2" />
          <path d="M750 120 C 830 170, 920 170, 1030 130" fill="none" stroke="#22d3ee" strokeWidth="2" />
        </svg>
        <div className="alg-map-col left">
          <Link className="alg-map-chip cyan" to="/algebra/expressions">x² Expressions</Link>
          <Link className="alg-map-chip mint" to="/algebra/equations">= Equations</Link>
          <Link className="alg-map-chip sky" to="/algebra/functions">f Functions</Link>
        </div>
        <div className="alg-map-col mid-left">
          <Link className="alg-map-node" to="/algebra/polynomials">P Polynomials</Link>
          <Link className="alg-map-node" to="/algebra/systems">{"{ }"} Systems</Link>
        </div>
        <div className="alg-map-core">
          <img className="alg-mark-img" src="/assets/algebra-studio/algebra-studio-mark.png" alt="" width={56} height={56} />
          <small>ALGEBRA</small>
        </div>
        <div className="alg-map-col mid-right">
          <Link className="alg-map-chip lilac" to="/algebra/exponents-logs">xʸ Exponents & Logs</Link>
          <Link className="alg-map-chip sky" to="/algebra/sequences">⋯ Sequences</Link>
        </div>
        <div className="alg-map-col right">
          <Link className="alg-map-chip mint" to="/algebra/proof">√ Algebraic Proof</Link>
          <Link className="alg-map-chip cyan" to="/algebra/cas">fx CAS Explorer</Link>
        </div>
      </section>

      <div className="alg-launch-wrap">
        <section className="alg-launch-main" id="algebra-topics">
          <h2>Launch a topic</h2>
          <p>Choose a topic to explore with interactive visual models.</p>
          <div className="alg-launch-grid">
            {filtered.map((item, index) => (
              <article key={item.id} className="alg-launch-card">
                <Link to={item.route} className="alg-launch-n">{`${index + 1} ${item.label}`}</Link>
                {item.id === "equations" ? <BalanceScaleTeaser /> : item.id === "expressions" ? <FactorTilesTeaser /> : item.id === "cas" ? <CasExpandTeaser /> : <TopicPreview id={item.id} />}
                <p>{item.description}</p>
                {item.id === "systems" ? <p className="sl-kicker">Move a line in the lab to see the intersection.</p> : null}
                {item.id === "exponents" ? <p className="sl-kicker">Log vs exponential overlay in the lab.</p> : null}
                {item.id === "sequences" ? <p className="sl-kicker">Next term: 2, 5, 10, 17, ?</p> : null}
                {item.id === "proof" ? <p className="sl-kicker">Given → Show → Therefore</p> : null}
              </article>
            ))}
          </div>
        </section>
        <aside className="alg-home-rail">
          <section className="alg-home-card">
            <h3>Continue experiment</h3>
            <strong>{lastTopic.label}</strong>
            <p className="alg-mono">{lastTopic.description}</p>
            <svg className="alg-mini-parabola" viewBox="0 0 160 62" aria-hidden="true">
              <path d="M8 50 Q 70 4 152 42" fill="none" stroke="#2563eb" strokeWidth="3" />
            </svg>
            <p className="alg-muted">{relativeOpened(lastAt)}</p>
            <button type="button" className="alg-continue" onClick={() => navigate(lastTopic.route)}>
              Continue
            </button>
          </section>
          <section className="alg-home-card alg-journey-card">
            <h3>Your learning journey</h3>
            <div className="alg-donut" aria-label={`${percent} percent`}>
              <strong>{percent}%</strong>
            </div>
            <dl>
              <div><dt>Topics explored</dt><dd>{visited.size} / {topicStudios.length}</dd></div>
              <div><dt>Skills mastered</dt><dd>{Object.values(progress.modes).reduce((sum, modes) => sum + modes.length, 0)}</dd></div>
              <div><dt>Challenges solved</dt><dd>{progress.challengesPassed}</dd></div>
            </dl>
            <Link className="alg-soft" to="/algebra/expressions">View full progress</Link>
          </section>
          <section className="alg-home-card" id="algebra-challenge">
            <h3>Visual challenge</h3>
            <p>{featured.prompt}</p>
            <div className="alg-answer-grid alg-answer-grid-6">
              {featured.choices.map((choice) => (
                <button type="button" key={choice} aria-pressed={answer === choice} onClick={() => { setAnswer(choice); setChecked(false); }}>{choice}</button>
              ))}
            </div>
            <button className="alg-gradient-button" type="button" onClick={() => setChecked(true)}>Check answer</button>
            {checked && <p role="status">{answersMatchChallenge(answer, featured.expected) ? "Correct: x + 7 is equivalent." : "Distribute, then combine like terms."}</p>}
            {saved.length ? <ul>{saved.map((item) => <li key={item.at}><Link to={item.route}>{item.name}</Link></li>)}</ul> : null}
          </section>
        </aside>
      </div>

      <section className="alg-learning-strip alg-learn-row" aria-label="Learning loop">
        <div role="button" tabIndex={0} onClick={() => document.querySelector(".alg-concept-map")?.scrollIntoView({ behavior: "smooth" })} onKeyDown={(event) => { if (event.key === "Enter") document.querySelector(".alg-concept-map")?.scrollIntoView({ behavior: "smooth" }); }}>
          <Eye /><span><b>OBSERVE</b><small>Look closely at patterns and relationships.</small></span>
        </div>
        <div role="button" tabIndex={0} onClick={() => document.getElementById("algebra-topics")?.scrollIntoView({ behavior: "smooth" })} onKeyDown={(event) => { if (event.key === "Enter") document.getElementById("algebra-topics")?.scrollIntoView({ behavior: "smooth" }); }}>
          <Lightbulb /><span><b>UNDERSTAND</b><small>Connect ideas and build meaning.</small></span>
        </div>
        <div role="button" tabIndex={0} onClick={() => navigate("/algebra/proof")} onKeyDown={(event) => { if (event.key === "Enter") navigate("/algebra/proof"); }}>
          <span className="alg-why-badge">?</span><span><b>WHY</b><small>Ask questions and discover the why.</small></span>
        </div>
        <div role="button" tabIndex={0} onClick={() => navigate("/algebra/expressions")} onKeyDown={(event) => { if (event.key === "Enter") navigate("/algebra/expressions"); }}>
          <Pencil /><span><b>TRY</b><small>Practice and explore with interactive tools.</small></span>
        </div>
        <div role="button" tabIndex={0} onClick={() => document.getElementById("algebra-challenge")?.scrollIntoView({ behavior: "smooth" })} onKeyDown={(event) => { if (event.key === "Enter") document.getElementById("algebra-challenge")?.scrollIntoView({ behavior: "smooth" }); }}>
          <Trophy /><span><b>CHALLENGE</b><small>Solve problems and level up your skills.</small></span>
        </div>
      </section>
    </div>
  );
}

function TopicPreview({ id }: { id: TopicStudio["id"] }) {
  if (id === "expressions") return <div className="alg-mini-tiles" aria-hidden="true"><i>x</i><i>x</i><i>+</i><i>3</i></div>;
  if (id === "equations") {
    return (
      <svg className="alg-mini-parabola" viewBox="0 0 140 72" aria-hidden="true">
        <line x1="70" y1="18" x2="70" y2="28" stroke="#64748b" strokeWidth="2" />
        <path d="M28 28h84" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
        <path d="M32 28 L48 52 H16 Z" fill="#dbeafe" stroke="#2563eb" />
        <path d="M92 28 L108 52 H76 Z" fill="#ede9fe" stroke="#7c3aed" />
        <text x="28" y="46" fontSize="8" fill="#1d4ed8">2x+3</text>
        <text x="94" y="46" fontSize="8" fill="#6d28d9">7</text>
      </svg>
    );
  }
  if (id === "functions") return <svg className="alg-mini-parabola" viewBox="0 0 160 62" aria-hidden="true"><path d="M8 50 Q 40 8 80 40 T 152 18" fill="none" stroke="#8b5cf6" strokeWidth="3" /><path d="M8 50 Q 50 20 90 48 T 152 30" fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="4 3" /></svg>;
  if (id === "polynomials") return <svg className="alg-mini-parabola" viewBox="0 0 160 62" aria-hidden="true"><path d="M6 40 C 30 8, 50 70, 80 28 S 130 8, 154 44" fill="none" stroke="#8b5cf6" strokeWidth="3" /></svg>;
  if (id === "systems") return <div className="alg-mini-system" aria-hidden="true"><i /><i /></div>;
  if (id === "exponents") {
    return (
      <svg className="alg-mini-parabola" viewBox="0 0 160 62" aria-hidden="true">
        <path d="M10 54 C 40 52 50 18 80 16 C 110 14 140 8 152 8" fill="none" stroke="#2563eb" strokeWidth="2" />
        <path d="M10 56 C 50 52 90 36 152 24" fill="none" stroke="#c026d3" strokeWidth="2" />
      </svg>
    );
  }
  if (id === "sequences") return <div className="alg-mini-sequence" aria-hidden="true">2 5 10 17 26</div>;
  if (id === "proof") return <div className="alg-mini-proof" aria-hidden="true"><span>Given</span><span>Show</span><span>Therefore</span></div>;
  if (id === "cas") return <div className="alg-mini-formula" aria-hidden="true">expand((x+2)³)</div>;
  return null;
}
