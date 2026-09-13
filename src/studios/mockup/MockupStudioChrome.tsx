import {
  Binary,
  BookOpenCheck,
  Box,
  BrainCircuit,
  Calculator,
  Circle as CircleIcon,
  Compass,
  Cuboid,
  Eye,
  Flame,
  FlaskConical,
  FunctionSquare,
  GitBranch,
  Grid3X3,
  Hash,
  HelpCircle,
  Hexagon,
  Home,
  KeyRound,
  Layers3,
  Lightbulb,
  LineChart,
  Menu,
  Move,
  Network,
  Pencil,
  Play,
  Ruler,
  Scan,
  Search,
  Settings,
  Shapes,
  Sigma,
  Sparkles,
  Star,
  Target,
  Triangle,
  Trophy,
  Waves,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import StudioBreadcrumb, { mathStudioCrumbs } from "../../components/ui/StudioBreadcrumb";
import { TopicIllustration } from "./labs/TopicIllustrations";
import { studioPagesWithoutHome, type StudioMockupDefinition, type StudioMockupPage } from "./studioMockupCatalog";
import "./MockupStudioChrome.css";

const pageIcons: Record<string, LucideIcon> = {
  home: Home,
  construction: Compass,
  triangles: Triangle,
  circles: CircleIcon,
  polygons: Hexagon,
  transformations: Move,
  coordinate: Grid3X3,
  measurement: Ruler,
  proofs: BookOpenCheck,
  solids: Cuboid,
  ar: Scan,
  "unit-circle": CircleIcon,
  "right-triangle": Triangle,
  graphs: Waves,
  identities: Sigma,
  inverse: FunctionSquare,
  oblique: Triangle,
  waves: Waves,
  applications: Target,
  vectors: Move,
  matrices: Grid3X3,
  "row-reduction": Layers3,
  "linear-transforms": Sparkles,
  determinants: Box,
  "vector-spaces": Shapes,
  eigenvectors: LineChart,
  orthogonality: GitBranch,
  "least-squares": LineChart,
  playground: Sparkles,
  "argand-plane": CircleIcon,
  arithmetic: Calculator,
  "polar-forms": Compass,
  rotation: Move,
  roots: Hexagon,
  euler: FunctionSquare,
  loci: CircleIcon,
  fractals: Sparkles,
  "waves-circuits": Waves,
  motion: Target,
  population: LineChart,
  epidemics: LineChart,
  finance: LineChart,
  optimization: Target,
  networks: Network,
  regression: LineChart,
  periodic: Waves,
  numerical: FlaskConical,
  comparison: Grid3X3,
  "number-sense": Hash,
  primes: Hash,
  "modular-arithmetic": CircleIcon,
  "number-patterns": Sparkles,
  combinatorics: GitBranch,
  logic: Binary,
  sets: CircleIcon,
  algorithms: BrainCircuit,
  cryptography: KeyRound,
  "data-explorer": LineChart,
  descriptive: LineChart,
  "interactive-distributions": Waves,
  experiments: FlaskConical,
  counting: Hash,
  clt: Sigma,
  "confidence-intervals": Ruler,
  hypothesis: Target,
  correlation: LineChart,
  anova: Grid3X3,
};

export function MockupTopicArt({ pageId }: { pageId: string }) {
  return <TopicIllustration pageId={pageId} />;
}

export function MockupLearningStrip({ page }: { page: StudioMockupPage }) {
  const items = [
    { icon: <Eye />, title: "Observe", text: page.learning.observe },
    { icon: <Lightbulb />, title: "Understand", text: page.learning.understand },
    { icon: <HelpCircle />, title: "Why", text: page.learning.why },
    { icon: <Pencil />, title: "Try", text: page.learning.try },
    { icon: <Trophy />, title: "Challenge", text: page.learning.challenge },
  ];
  return (
    <section className="msk-strip" aria-label="Learning loop">
      {items.map((item) => (
        <div key={item.title}>
          {item.icon}
          <b>{item.title}</b>
          <small>{item.text}</small>
        </div>
      ))}
    </section>
  );
}

function NavIcon({ id }: { id: string }) {
  const Icon = pageIcons[id] ?? Sparkles;
  return <Icon />;
}

export function MockupStudioChrome({
  studio,
  page,
  children,
}: {
  studio: StudioMockupDefinition;
  page: StudioMockupPage;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const labs = studioPagesWithoutHome(studio);

  useEffect(() => setOpen(false), [location.pathname]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return labs;
    return labs.filter((item) => `${item.label} ${item.title} ${item.modes.join(" ")}`.toLowerCase().includes(needle));
  }, [labs, query]);

  return (
    <main className={`msk-shell msk-${studio.id}${open ? " is-open" : ""}`}>
      {open ? <button className="msk-backdrop" type="button" aria-label="Close menu" onClick={() => setOpen(false)} /> : null}
      <aside className="msk-sidebar">
        <Link className="msk-brand" to={studio.basePath}>
          <span className="msk-mark">{studio.mark}</span>
          <span>{studio.name.replace(" Studio", "")}<b>STUDIO</b></span>
        </Link>
        <Link className="msk-main" to="/"><Home /><span>Main</span></Link>
        <nav aria-label={`${studio.name} navigation`}>
          {studio.pages.map((item) => (
            <NavLink key={item.id} to={item.route} end={item.id === "home"} className={({ isActive }) => (isActive || page.id === item.id ? "active" : "")} onClick={() => setOpen(false)}>
              <NavIcon id={item.id} /><span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <section className="msk-stage">
        <header className="msk-top">
          <button className="msk-menu" type="button" aria-label="Open studio menu" onClick={() => setOpen(true)}><Menu /></button>
          <div>
            <StudioBreadcrumb crumbs={mathStudioCrumbs(
              { label: studio.name.replace(" Studio", ""), to: studio.basePath },
              page.id === "home" ? undefined : { label: page.label, to: page.route },
            )} />
            <h1>{page.id === "home" ? studio.homeTitle : page.title}</h1>
            <p>{page.id === "home" ? studio.homeSubtitle : page.subtitle}</p>
          </div>
          <div className="msk-tools">
            <label className="msk-search">
              <Search />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => { if (event.key === "Enter" && filtered[0]) navigate(filtered[0].route); }}
                placeholder={studio.searchPlaceholder}
                aria-label={`Search ${studio.name}`}
              />
              {query ? <button type="button" aria-label="Clear search" onClick={() => setQuery("")}><X /></button> : <kbd>Ctrl+K</kbd>}
            </label>
            <button type="button" aria-label="Streak"><Flame /></button>
            <span><Star />0 XP</span>
            <button type="button" className="msk-teacher" aria-label="Teacher mode">Teacher mode</button>
            <button type="button" aria-label="Help"><HelpCircle /></button>
            <button type="button" aria-label="Settings"><Settings /></button>
          </div>
        </header>
        {children}
      </section>
    </main>
  );
}

export function MockupStudioHome({ studio }: { studio: StudioMockupDefinition }) {
  const labs = studioPagesWithoutHome(studio);
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("");
  const challenge = labs.find((item) => item.challenge.prompt !== "0")?.challenge ?? labs[0]?.challenge;
  const journey = labs.slice(0, 6);
  const launchTitle = studio.id === "trigonometry" ? "Explore Key Topics" : studio.id === "geometry" || studio.id === "complex-numbers" ? "Explore by Topic" : "Launch a topic";

  return (
    <>
      {studio.id === "trigonometry" ? (
        <section className="msk-journey-row" aria-label="Trigonometry path">
          {[{ t: "Angles", d: "θ" }, { t: "Unit Circle", d: "○" }, { t: "Functions", d: "∿" }, { t: "Waves", d: "≈" }].map((item, index) => (
            <div key={item.t} className="msk-journey-node">
              <i>{item.d}</i>
              <b>{item.t}</b>
              {index < 3 ? <span /> : null}
            </div>
          ))}
        </section>
      ) : null}
      {studio.id === "geometry" ? (
        <section className="msk-concept-orbit" aria-label="Geometry concept map">
          <div className="msk-orbit-core"><span className="msk-mark">G</span><b>GEOMETRY</b></div>
          {labs.slice(0, 8).map((item) => (
            <Link key={item.id} to={item.route}>{item.label}</Link>
          ))}
        </section>
      ) : null}
      <div className="msk-home">
        <section>
          <header className="msk-launch-head">
            <h2>{launchTitle}</h2>
            <p>Choose a topic to explore with interactive visual models.</p>
          </header>
          <div className={`msk-launch msk-launch-${studio.id}`}>
            {labs.map((item, index) => (
              <Link key={item.id} className="msk-card" to={item.route}>
                <span className="msk-num">{index + 1}</span>
                <TopicIllustration pageId={item.id} />
                <b>{item.label}</b>
                <small>{item.description}</small>
                <em>Open {item.label}</em>
              </Link>
            ))}
          </div>
        </section>
        <aside className="msk-aside">
          <section className="msk-panel">
            <h2><Play /> Continue experiment</h2>
            <div className="msk-continue-art"><TopicIllustration pageId={labs[0]?.id ?? "home"} /></div>
            <p>{studio.continueLabel}</p>
            <Link className="msk-cta" to={studio.continueRoute}>Continue experiment</Link>
          </section>
          <section className="msk-panel">
            <h2>Your learning journey</h2>
            <ol className="msk-journey-list">
              {journey.map((item, index) => (
                <li key={item.id}>
                  <i className={index < 2 ? "done" : index === 2 ? "now" : ""} />
                  <Link to={item.route}>{item.label}</Link>
                </li>
              ))}
            </ol>
            <div className="msk-progress"><i style={{ width: "42%" }} /></div>
            <small>Overall progress 42%</small>
          </section>
          {challenge && challenge.prompt !== "0" ? (
            <section className="msk-panel msk-challenge">
              <h2>Daily visual challenge</h2>
              <p>{challenge.prompt}</p>
              <input value={answer} onChange={(event) => { setAnswer(event.target.value); setStatus(""); }} aria-label="Challenge answer" />
              <button className="msk-cta" type="button" onClick={() => setStatus(Math.abs(Number(answer) - challenge.expected) < 0.02 ? "Correct." : challenge.hint)}>Check</button>
              {status ? <p role="status">{status}</p> : null}
            </section>
          ) : null}
        </aside>
      </div>
      <MockupLearningStrip page={studio.pages[0]} />
    </>
  );
}
