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

function NavIcon({ id, studio }: { id: string; studio?: string }) {
  const glyphId = studio === "discrete" && id === "graphs" ? "network-graph" : id;
  const filled: Record<string, ReactNode> = {
    home: <path d="M4 11.2 12 4l8 7.2V20h-6v-6H10v6H4Z" />,
    construction: <><circle cx="12" cy="12" r="7" /><circle cx="12" cy="12" r="2" /><path d="M12 5v3M12 16v3M5 12h3M16 12h3" /></>,
    triangles: <path d="M12 4 21 19H3Z" />,
    circles: <circle cx="12" cy="12" r="8" />,
    polygons: <path d="M12 3 20 8v8l-8 5-8-5V8Z" />,
    "unit-circle": <><circle cx="12" cy="12" r="8" /><path d="M12 12 18 9" /></>,
    "right-triangle": <path d="M4 20V5l15 15Z" />,
    graphs: <path d="M3 16c3-8 6 2 9-4s5 1 9-6" />,
    matrices: <path d="M5 5h6v6H5Zm8 0h6v6h-6ZM5 13h6v6H5Zm8 0h6v6h-6Z" />,
    vectors: <path d="M5 19 19 5M19 5h-6M19 5v6" />,
    "argand-plane": <><circle cx="12" cy="12" r="8" /><path d="M12 4v16M4 12h16" /></>,
    identities: <path d="M7 4h10v4H7Zm0 6h10v4H7Zm0 6h10v4H7Z" />,
    inverse: <path d="M5 16c2-8 12-8 14 0M12 6v8" />,
    oblique: <path d="M4 19 10 5l10 14Z" />,
    waves: <path d="M3 12c2-6 4 6 6 0s4 6 6 0 4 6 6 0" />,
    applications: <path d="M12 3 14 9h6l-5 4 2 8-7-5-7 5 2-8-5-4h6Z" />,
    transformations: <path d="M5 19V7l8-3v12Zm8-3 6-2v10l-6 2Z" />,
    coordinate: <path d="M4 4h7v7H4Zm9 0h7v7h-7ZM4 13h7v7H4Zm9 0h7v7h-7Z" />,
    measurement: <path d="M4 10h16v4H4Zm3-2v8M12 8v8M17 8v8" />,
    proofs: <path d="M6 4h12v16H6Zm3 4h6M9 12h6M9 16h4" />,
    solids: <path d="M12 3 21 8v8l-9 5-9-5V8Z" />,
    ar: <path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4" />,
    "row-reduction": <path d="M4 6h16M4 12h10M4 18h7" />,
    determinants: <path d="M7 4v16M17 4v16M9 8h6M9 16h6" />,
    eigenvectors: <path d="M5 19 19 5M12 19V5M5 12h14" />,
    "number-sense": <path d="M7 4h3v16H7Zm7 0h3v16h-3Z" />,
    primes: <path d="M12 3 20 8v8l-8 5-8-5V8Z" />,
    "modular-arithmetic": <><circle cx="12" cy="12" r="8" /><path d="M12 6v6l4 2" /></>,
    "network-graph": <><circle cx="6" cy="7" r="2.2" /><circle cx="18" cy="7" r="2.2" /><circle cx="7" cy="18" r="2.2" /><circle cx="17" cy="17" r="2.2" /><circle cx="12" cy="11" r="2.2" /><path d="M7.8 8.2 10.2 10M16.2 8.4 13.8 10.2M8.6 16.4 10.8 12.4M15.4 15.6 13.4 12.6" /></>,
    algorithms: <path d="M6 4h12v5H6Zm0 7h12v9H6Z" />,
    cryptography: <path d="M8 11V8a4 4 0 0 1 8 0v3H8Zm-2 0h12v9H6Z" />,
    "data-explorer": <path d="M5 18V9h3v9Zm6 0V5h3v13Zm6 0v-7h3v7Z" />,
    descriptive: <path d="M4 16h16M8 16V8m4 8V5m4 11v-6" />,
    "interactive-distributions": <path d="M3 17c3-10 6 2 9-6s6 4 9-2" />,
  };
  if (filled[glyphId]) {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><g fill="currentColor" fillOpacity=".92" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round">{filled[glyphId]}</g></svg>;
  }
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
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const labs = studioPagesWithoutHome(studio);

  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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
            <NavLink key={item.id} to={item.route} end={item.id === "home"} className={({ isActive }) => (isActive || (page.id === item.id && item.route.startsWith(studio.basePath)) ? "active" : "")} onClick={() => setOpen(false)}>
              <NavIcon id={item.id} studio={studio.id} /><span>{item.label}</span>
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
            <div id="msk-lab-tools" className="msk-lab-tools" />
            <label className={`msk-search${searchOpen || query ? " is-open" : ""}`}>
              <button type="button" aria-label="Search" onClick={() => setSearchOpen((value) => !value)}><Search /></button>
              {searchOpen || query ? (
                <input
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => { if (event.key === "Enter" && filtered[0]) navigate(filtered[0].route); }}
                  onBlur={() => { if (!query) setSearchOpen(false); }}
                  placeholder={studio.searchPlaceholder}
                  aria-label={`Search ${studio.name}`}
                />
              ) : null}
              {query ? <button type="button" aria-label="Clear search" onClick={() => setQuery("")}><X /></button> : null}
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
