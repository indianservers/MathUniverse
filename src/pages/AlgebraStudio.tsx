import {
  BadgeHelp,
  BarChart3,
  BookOpenCheck,
  Braces,
  Calculator,
  CircleHelp,
  FlaskConical,
  FunctionSquare,
  Home,
  Lightbulb,
  LineChart,
  Moon,
  MoveRight,
  Settings,
  Sparkles,
  SquareFunction,
  Target,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ExpressionsLab, EquationsLab, FunctionsLab, PolynomialsLab, SystemsLab, ExponentsLab, SequencesLab, ProofLab, CasGateway } from "../studios/algebra/AlgebraInteractiveLabs";
import { useTheme } from "../hooks/useTheme";
import AlgebraEnhancementWorkbench from "../studios/algebra/AlgebraEnhancementWorkbench";
import "./AlgebraStudio.css";

type AlgebraPage = "home" | "expressions" | "equations" | "functions" | "polynomials" | "systems" | "exponents" | "sequences" | "proof" | "cas" | "advanced";

type StudioNavItem = {
  id: AlgebraPage;
  label: string;
  route: string;
  icon: LucideIcon;
};

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

const routePage: Record<string, AlgebraPage> = Object.fromEntries(studioNav.map((item) => [item.route, item.id])) as Record<string, AlgebraPage>;

export default function AlgebraStudio() {
  const location = useLocation();
  const page = routePage[location.pathname] ?? "home";
  return (
    <main className="alg-studio">
      <AlgebraSidebar page={page} />
      <section className="alg-stage">
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
  return <span className="alg-mark" aria-hidden="true"><i /><i /><i /></span>;
}

function StudioHeader({ title, subtitle, tabs, activeTab, onTab }: { title: string; subtitle: string; tabs?: string[]; activeTab?: string; onTab?: (tab: string) => void }) {
  const [panel, setPanel] = useState<"help" | "settings" | null>(null);
  const { toggleTheme, fontScale, setFontScale, reducedMotion, setReducedMotion } = useTheme();
  return (
    <>
      <header className="alg-header">
        <div><h1>{title}</h1><p>{subtitle}</p></div>
        <div className="alg-header-actions"><button type="button" aria-label="Help" aria-expanded={panel === "help"} onClick={() => setPanel(panel === "help" ? null : "help")}><CircleHelp /></button><button type="button" aria-label="Settings" aria-expanded={panel === "settings"} onClick={() => setPanel(panel === "settings" ? null : "settings")}><Settings /></button><button type="button" aria-label="Theme" onClick={toggleTheme}><Moon /></button></div>
      </header>
      {panel === "help" && <section className="alg-card"><h2>Using Algebra Studio</h2><p>Choose a topic, then a mode. Edit the labelled parameters to update the mathematical model. Challenges check your answer against the current values; CAS computes the expression you enter.</p></section>}
      {panel === "settings" && <section className="alg-card"><h2>Display settings</h2><label>Text size<select value={fontScale} onChange={(e) => setFontScale(e.target.value as typeof fontScale)}><option value="base">Standard</option><option value="large">Large</option><option value="xlarge">Extra large</option></select></label><label><input type="checkbox" checked={reducedMotion} onChange={(e) => setReducedMotion(e.target.checked)} />Reduce motion</label></section>}
      {tabs && <nav className="alg-top-tabs" aria-label={`${title} modes`}>{tabs.map((tab) => <button type="button" key={tab} className={tab === activeTab ? "active" : ""} onClick={() => onTab?.(tab)}>{tab}</button>)}</nav>}
    </>
  );
}

function StudioHome() {
  const topics = studioNav.slice(1);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  return (
    <div className="alg-page alg-home">
      <StudioHeader title="Welcome to Algebra Studio" subtitle="Explore, connect, and master algebra through interactive visual models." />
      <section className="alg-concept-map" aria-label="Algebra concept map">
        <div className="alg-map-group left">{topics.slice(0, 5).map((item) => <Link key={item.id} to={item.route}><item.icon />{item.label}</Link>)}</div>
        <div className="alg-map-core"><AlgebraMark /><b>ALGEBRA</b></div>
        <div className="alg-map-group right">{topics.slice(5).map((item) => <Link key={item.id} to={item.route}><item.icon />{item.label}</Link>)}</div>
      </section>
      <div className="alg-home-grid">
        <section className="alg-panel alg-launch"><PanelHeading title="Launch a topic" subtitle="Choose a topic to explore with interactive visual models." />
          <div className="alg-topic-grid">{topics.map((item, index) => <TopicCard key={item.id} item={item} index={index + 1} />)}</div>
        </section>
        <aside className="alg-home-aside">
          <Card title="Continue experiment" icon={<FlaskConical />}><MiniParabola /><b>Quadratic Functions</b><small>Explore transformations</small><Link className="alg-gradient-button" to="/algebra/functions">Continue</Link></Card>
          <Card title="Your learning journey" icon={<Target />}><p>Explore a topic, change its parameters, then check a prediction. Each lab links its model to the calculated result.</p></Card>
          <Card title="Visual challenge" icon={<BadgeHelp />}><p>Which expressions are equivalent to 2(x + 3) − (x − 1)?</p><div className="alg-answer-grid">{["x + 7", "2x + 5", "3x + 7", "x + 5", "2x + 6", "x + 6"].map((choice) => <button type="button" key={choice} aria-pressed={answer === choice} onClick={() => { setAnswer(choice); setChecked(false); }}>{choice}</button>)}</div><button className="alg-gradient-button" type="button" onClick={() => setChecked(true)}>Check answer</button>{checked && <p role="status">{answer === "x + 7" ? "Correct: 2x+6−x+1 = x+7." : "Not yet. Distribute the minus sign over (x−1)."}</p>}</Card>
        </aside>
      </div>
      <LearningStrip />
    </div>
  );
}

function TopicCard({ item, index }: { item: StudioNavItem; index: number }) {
  const Icon = item.icon;
  return <Link className="alg-topic-card" to={item.route}><span className="alg-topic-number">{index}</span><header><Icon /><b>{item.label}</b></header><MiniTopicVisual id={item.id} /><p>{topicDescription(item.id)}</p></Link>;
}

function MiniTopicVisual({ id }: { id: AlgebraPage }) {
  if (id === "expressions") return <div className="alg-mini-tiles"><i>x</i><i>x</i><i>+</i><i>3</i></div>;
  if (id === "equations") return <div className="alg-mini-balance"><span>2x + 3</span><b>⚖</b><span>7</span></div>;
  if (id === "functions" || id === "polynomials") return <MiniParabola />;
  if (id === "systems") return <div className="alg-mini-system"><i /><i /></div>;
  if (id === "exponents") return <div className="alg-mini-formula">y = 2ˣ | y = log₂x</div>;
  if (id === "sequences") return <div className="alg-mini-sequence">● | ●● | ●●● | …</div>;
  if (id === "proof") return <div className="alg-mini-proof"><span>Given</span><b>→</b><span>Show</span><b>→</b><span>Therefore</span></div>;
  return <div className="alg-mini-formula">expand((x + 2)³)</div>;
}

function Card({ title, icon, children, className = "" }: { title: string; icon?: ReactNode; children: ReactNode; className?: string }) { return <section className={`alg-card ${className}`}><h2>{icon}{title}</h2>{children}</section>; }
function PanelHeading({ title, subtitle }: { title: string; subtitle: string }) { return <header className="alg-panel-heading"><h2>{title}</h2><p>{subtitle}</p></header>; }
function LearningStrip() { const items: Array<[LucideIcon,string,string]> = [[Target,"Observe","Look closely at patterns and relationships."],[Lightbulb,"Understand","Connect ideas and build meaning."],[CircleHelp,"Why","Ask questions and discover why."],[FlaskConical,"Try","Practice with interactive tools."],[Trophy,"Challenge","Solve problems and level up."]]; return <footer className="alg-learning-strip">{items.map(([Icon,title,text]) => <div key={title}><Icon /><span><b>{title}</b><small>{text}</small></span></div>)}</footer>; }
function topicDescription(id: AlgebraPage) { return ({ expressions:"Build and simplify algebraic expressions.", equations:"Solve and balance equations visually.", functions:"Explore functions and transformations.", polynomials:"Analyze polynomials and their roots.", systems:"Solve systems graphically.", exponents:"Work with exponential and logarithmic functions.", sequences:"Find patterns and general terms.", proof:"Construct and validate algebraic proofs.", cas:"Open the connected CAS workspace.", advanced:"Use 25 connected algebra analysis tools.", home:"" } as Record<AlgebraPage,string>)[id]; }
function MiniParabola() { return <svg className="alg-mini-parabola" viewBox="0 0 180 70"><path d="M10 12 Q55 105 90 42 Q125 -18 170 55" fill="none" stroke="url(#mini-grad)" strokeWidth="3"/><defs><linearGradient id="mini-grad"><stop stopColor="#08b9da"/><stop offset="1" stopColor="#8c42f5"/></linearGradient></defs><line x1="6" x2="174" y1="55" y2="55" stroke="#9aa7bd"/><line x1="90" x2="90" y1="5" y2="65" stroke="#9aa7bd"/></svg>; }
