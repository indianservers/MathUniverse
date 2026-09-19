import {
  Bell,
  Binary,
  BookOpenCheck,
  Box,
  BrainCircuit,
  Calculator,
  CheckCircle2,
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
  Moon,
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
  Sun,
  Target,
  Triangle,
  Trophy,
  User,
  Waves,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import StudioBreadcrumb, { mathStudioCrumbs } from "../../components/ui/StudioBreadcrumb";
import StudioHomeButtons from "../../components/ui/StudioHomeButtons";
import { StudioCanvasToolbar } from "../../components/ui/StudioCanvasToolbar";
import { TopicIllustration } from "./labs/TopicIllustrations";
import { studioNavPages, studioSidebarPages, type StudioMockupDefinition, type StudioMockupPage } from "./studioMockupCatalog";
import { useLabMode } from "./studioLabKit";
import { ModellingLaunchArt, ModellingNavIcon, modellingDatasets, modellingJourney } from "./modellingStudioIcons";
import { IllustratedStudioHome, StudioLabCard } from "./studioHomeLayouts";
import GeometryStudioHome from "../geometry/GeometryStudioHome";
import { GEO_SHORTCUTS, geometrySearchHits } from "../geometry/geometryStudioCopy";
import { markGeoComplete, markGeoVisit, useGeoSession, writeGeoSession } from "../geometry/geometryStudioSession";
import { searchHits, trigModeLearning, trigPathId } from "./trigStudioCopy";
import { MODE_HEADING, MODE_HINTS, NUMBER_SENSE_MODES, numberSenseModeLearning, SHORTCUTS as NUMBER_SENSE_SHORTCUTS, type NumberSenseMode } from "../discrete/number-sense/numberSenseCopy";
import { useNumberSenseSession, writeNumberSenseSession } from "../discrete/number-sense/numberSenseSession";
import { patternsModeLearning } from "../discrete/patterns/patternsCopy";
import { primesModeLearning } from "../discrete/primes/primesCopy";
import { usePrimesSession, writePrimesSession } from "../discrete/primes/primesSession";
import "./MockupStudioChrome.css";
import "./TrigonometryTarget.css";
import "./LinearAlgebraTarget.css";
import "./ComplexNumbersTarget.css";
import "./ModellingTarget.css";
import "./DiscreteTarget.css";
import {
  TRIG_PATH,
  continueHref,
  dailyChallengeIndex,
  markTrigComplete,
  markTrigVisit,
  nextTrigLab,
  readTrigSession,
  useTrigSession,
  writeTrigSession,
} from "./trigStudioSession";
import {
  continueLinearHref,
  LINEAR_SEARCH_ALIASES,
  markLinearVisit,
  useLinearSession,
  writeLinearSession,
} from "../linear-algebra/linearAlgebraStudioSession";
import {
  continueComplexHref,
  markComplexComplete,
  markComplexVisit,
  useComplexSession,
  writeComplexSession,
  COMPLEX_SEARCH_ALIASES,
} from "../complex/complexStudioSession";

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

function ComplexHeaderPills({ page }: { page: StudioMockupPage }) {
  const { tabs, mode, setMode } = useLabMode(page);
  return (
    <nav className="cx-pills is-header" aria-label={`${page.title} modes`}>
      {tabs.map((item) => (
        <button key={item} type="button" className={item === mode ? "active" : ""} aria-pressed={item === mode} onClick={() => setMode(item)}>
          {item}
        </button>
      ))}
    </nav>
  );
}

export function MockupLearningStrip({ page, mode }: { page: StudioMockupPage; mode?: string }) {
  const copy = page.route.includes("/trigonometry") || page.route === "/trigonometry"
    ? trigModeLearning(page, mode)
    : page.id === "primes"
      ? primesModeLearning(page, mode)
      : page.id === "number-sense"
        ? numberSenseModeLearning(page, mode)
      : page.id === "number-patterns"
        ? patternsModeLearning(page, mode)
        : page.learning;
  const topic = mode ? `${page.label} · ${mode}` : page.label;
  const items = [
    { icon: <Eye />, title: "Observe", text: copy.observe },
    { icon: <Lightbulb />, title: "Understand", text: copy.understand },
    { icon: <HelpCircle />, title: "Why", text: copy.why },
    { icon: <Pencil />, title: "Try", text: copy.try },
    { icon: <Trophy />, title: "Challenge", text: copy.challenge },
  ];
  return (
    <section className="msk-strip msk-strip-cards" aria-label={`Learning loop for ${topic}`}>
      {items.map((item) => (
        <div key={item.title}>
          {item.icon}
          <span>
            <b>{item.title}</b>
            <small>{item.text}</small>
          </span>
        </div>
      ))}
    </section>
  );
}

function LinearAlgebraNavIcon({ id }: { id: string }) {
  const glyphs: Record<string, ReactNode> = {
    home: <path d="M4 11.2 12 4l8 7.2V20h-6v-6H10v6H4Z" />,
    vectors: <path d="M3.2 11.2 20.6 3.4 12.8 20.8l-2.2-6.6Z" />,
    matrices: <path d="M5 5h6v6H5Zm8 0h6v6h-6ZM5 13h6v6H5Zm8 0h6v6h-6Z" />,
    "row-reduction": <><path d="M4 6h16v12H4Z" fillOpacity=".18" /><path d="M4 10h16M4 14h16M9 6v12" fill="none" /></>,
    "linear-transforms": <><path d="M4 15h7v5H4Z" /><path d="M13 8h7v5h-7Z" fillOpacity=".55" /><path d="M11 16.5 14.5 11" fill="none" /></>,
    determinants: <path d="M12 4 20 19H4Z" />,
    "vector-spaces": <path d="M12 3 20 7.5v9L12 21 4 16.5v-9Z" />,
    eigenvectors: <path d="M8 20 12 4l4 16M9.2 13h5.6" fill="none" strokeWidth="2.2" />,
    orthogonality: <path d="M5 19V5h3v11h11v3Z" />,
    "least-squares": <><path d="M4 18 9 12l4 3 7-9" fill="none" strokeWidth="2" /><circle cx="9" cy="12" r="1.4" /><circle cx="13" cy="15" r="1.4" /><circle cx="20" cy="6" r="1.4" /></>,
    playground: <><path d="M7 8h10v10H7Z" fillOpacity=".2" /><path d="M7 8 12 4l5 4v10l-5 4-5-4Z" /></>,
  };
  const glyph = glyphs[id] ?? glyphs.playground;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><g fill="currentColor" fillOpacity=".92" stroke="currentColor" strokeWidth="1.15" strokeLinejoin="round">{glyph}</g></svg>;
}

function ComplexNavIcon({ id }: { id: string }) {
  const glyphs: Record<string, ReactNode> = {
    home: <path d="M4 11.2 12 4l8 7.2V20h-6v-6H10v6H4Z" />,
    "argand-plane": <><circle cx="12" cy="12" r="7.2" fill="none" /><path d="M12 5v14M5 12h14" fill="none" /></>,
    arithmetic: <path d="M7 7h4v4H7Zm6 0h4v4h-4ZM7 13h4v4H7Zm6 2h4M8 15h2" fill="none" />,
    "polar-forms": <><circle cx="12" cy="12" r="7" fill="none" /><path d="M12 12 17 8" fill="none" /></>,
    rotation: <><path d="M5 12a7 7 0 0 1 12-4" fill="none" /><path d="M16 5v4h4" fill="none" /></>,
    roots: <path d="M12 4 19 8.5v7L12 20 5 15.5v-7Z" />,
    euler: <path d="M6 8c4-4 8 8 12 0M6 16c4-4 8 8 12 0" fill="none" />,
    loci: <><circle cx="9" cy="12" r="5" fill="none" /><circle cx="15" cy="12" r="5" fill="none" /></>,
    fractals: <path d="M12 4v7l5 9H7l5-9" />,
    "waves-circuits": <path d="M3 12c2-6 4 6 6 0s4 6 6 0 4 6 6 0" fill="none" />,
  };
  const glyph = glyphs[id] ?? glyphs.home;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><g fill="currentColor" fillOpacity=".2" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">{glyph}</g></svg>;
}

function NavIcon({ id, studio }: { id: string; studio?: string }) {
  if (studio === "modelling") return <ModellingNavIcon id={id} />;
  if (studio === "linear-algebra") return <LinearAlgebraNavIcon id={id} />;
  if (studio === "complex-numbers") return <ComplexNavIcon id={id} />;
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
  const isTrig = studio.id === "trigonometry";
  const isModel = studio.id === "modelling";
  const isGeo = studio.id === "geometry";
  const isDiscrete = studio.id === "discrete";
  const isLinear = studio.id === "linear-algebra";
  const isComplex = studio.id === "complex-numbers";
  const isNumberSense = isDiscrete && page.id === "number-sense";
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(isTrig || isModel || isGeo || isDiscrete || isLinear || isComplex);
  const [helpOpen, setHelpOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const stripRef = useRef<HTMLElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const labs = studioSidebarPages(studio).filter((item) => item.id !== "home");
  const session = useTrigSession();
  const linearSession = useLinearSession();
  const geoSession = useGeoSession();
  const complexSession = useComplexSession();
  const primesSession = usePrimesSession();
  const numberSenseSession = useNumberSenseSession();
  const discreteTeacher = isNumberSense ? numberSenseSession.teacherMode : primesSession.teacherMode;
  const mode = params.get("mode");

  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    if (!isTrig || page.id === "home") return;
    markTrigVisit(page.id, page.route, page.label, mode);
  }, [isTrig, page.id, page.route, page.label, mode]);
  useEffect(() => {
    if (!isLinear || page.id === "home") return;
    markLinearVisit(page.id, page.route, page.label, mode);
  }, [isLinear, page.id, page.route, page.label, mode]);
  useEffect(() => {
    if (!isGeo || page.id === "home") return;
    markGeoVisit(page.id, page.route, page.label, mode);
  }, [isGeo, page.id, page.route, page.label, mode]);
  useEffect(() => {
    if (!isComplex || page.id === "home") return;
    markComplexVisit(page.id, page.route, page.label, mode);
  }, [isComplex, page.id, page.route, page.label, mode]);
  useEffect(() => {
    if (!isGeo && !isNumberSense) return;
    if (isGeo) document.title = `${page.id === "home" ? "Geometry Studio" : page.title} | Math Universe`;
    if (isNumberSense) document.title = `Number Sense · ${mode ?? "Integers"} | Number & Discrete`;
  }, [isGeo, isNumberSense, page.id, page.title, mode]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
        return;
      }
      if (isGeo && event.key === "?" && !typing) {
        event.preventDefault();
        setHelpOpen((value) => !value);
        return;
      }
      if (!isTrig || typing) return;
      if (event.key === "?") {
        event.preventDefault();
        setHelpOpen((value) => !value);
        return;
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        const step = session.units === "deg" ? 1 : 180 / Math.PI;
        writeTrigSession({ theta: session.theta + (event.key === "ArrowRight" ? step : -step) });
        return;
      }
      const snaps: Record<string, number> = { "0": 0, "1": 30, "2": 45, "3": 60, "4": 90 };
      if (snaps[event.key] !== undefined) {
        event.preventDefault();
        writeTrigSession({ theta: snaps[event.key]! });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isGeo, isTrig, session.theta, session.units]);

  const filtered = useMemo(() => {
    if (isGeo) return geometrySearchHits(labs, query);
    if (isComplex) {
      const needle = query.trim().toLowerCase();
      const alias = needle ? COMPLEX_SEARCH_ALIASES[needle] : undefined;
      const labsHits = !needle
        ? labs.map((lab) => ({ key: lab.id, label: lab.label, to: lab.route, detail: "Lab" }))
        : searchHits(labs, query);
      if (alias) {
        return [{ key: alias.id, label: alias.mode ? `${alias.id} · ${alias.mode}` : alias.id, to: `/complex-numbers/${alias.id}${alias.mode ? `?mode=${encodeURIComponent(alias.mode)}` : ""}`, detail: "Symbol" }, ...labsHits];
      }
      return labsHits;
    }
    if (!query.trim()) return labs.map((lab) => ({ key: lab.id, label: lab.label, to: lab.route, detail: "Lab" }));
    if (isLinear) {
      const alias = LINEAR_SEARCH_ALIASES[query.trim().toLowerCase()];
      const extra = alias
        ? [{
            key: `alias-${alias.id}`,
            label: alias.mode ? `${alias.id} · ${alias.mode}` : alias.id,
            to: `/linear-algebra/${alias.id}${alias.mode ? `?mode=${encodeURIComponent(alias.mode)}` : ""}`,
            detail: "Symbol match",
          }]
        : [];
      return [...extra, ...searchHits(labs, query)];
    }
    return searchHits(labs, query);
  }, [isComplex, isGeo, isLinear, labs, query]);
  const pathId = isTrig ? trigPathId(page.id, mode) : "";

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    el.scrollLeft = readTrigSession().stripScroll;
    el.querySelector(".active")?.scrollIntoView({ inline: "center", block: "nearest", behavior: "instant" as ScrollBehavior });
    const onScroll = () => writeTrigSession({ stripScroll: el.scrollLeft });
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [page.id]);

  return (
    <main className={`msk-shell msk-${studio.id}${open ? " is-open" : ""}${(isTrig && session.theme === "dark") || (isGeo && geoSession.theme === "dark") || (isComplex && complexSession.theme === "dark") ? " is-dark" : ""}${(isTrig && session.teacherMode) || (isGeo && geoSession.teacherMode) || (isDiscrete && discreteTeacher) || (isLinear && linearSession.teacherMode && page.id !== "home") || (isComplex && complexSession.teacherMode && page.id !== "home") ? " is-teacher" : ""}${(isTrig || isModel || isGeo || isDiscrete || isLinear || isComplex) && page.id !== "home" ? " is-lab" : ""}`} data-cx-page={isComplex ? page.id : undefined}>
      {open ? <button className="msk-backdrop" type="button" aria-label="Close menu" onClick={() => setOpen(false)} /> : null}
      <aside className="msk-sidebar">
        <Link className="msk-brand" to={studio.basePath}>
          <span className="msk-mark">{studio.mark}</span>
          <span>{studio.name.replace(" Studio", "")}<b>STUDIO</b></span>
        </Link>
        <Link className="msk-main" to="/">{isModel ? <ModellingNavIcon id="main" /> : <Home />}<span>{isTrig || isGeo || isDiscrete ? "Site home" : "Main"}</span></Link>
        <nav aria-label={`${studio.name} navigation`}>
          {studioSidebarPages(studio).map((item) => (
            <NavLink key={item.id} to={item.route} end={item.id === "home"} className={({ isActive }) => (isActive || (page.id === item.id && item.route.startsWith(studio.basePath)) ? "active" : "")} onClick={() => setOpen(false)}>
              <NavIcon id={item.id} studio={studio.id} /><span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <section className="msk-stage">
        <header className="msk-top">
          <button className="msk-menu" type="button" aria-label="Open studio menu" onClick={() => setOpen(true)}><Menu /></button>
          <div className="msk-title-block">
            {isLinear ? null : <StudioHomeButtons studioTo={studio.basePath} />}
            {(isModel || isGeo || isLinear) && page.id === "home" ? null : isLinear ? null : (
              <StudioBreadcrumb crumbs={mathStudioCrumbs(
                { label: studio.name.replace(" Studio", ""), to: studio.basePath },
                page.id === "home" ? undefined : { label: page.label, to: page.route },
              )} />
            )}
            <h1>{page.id === "home" ? studio.homeTitle : isNumberSense && mode && NUMBER_SENSE_MODES.includes(mode as NumberSenseMode) ? MODE_HEADING[mode as NumberSenseMode] : page.title}</h1>
            <p>{page.id === "home" ? studio.homeSubtitle : page.subtitle}</p>
            {isTrig ? (
              <nav className="msk-path-row" aria-label="Trigonometry path">
                {TRIG_PATH.map((item, index) => (
                  <span key={item.id} className={`msk-journey-node${pathId === item.id ? " is-on" : ""}`}>
                    <Link to={item.to} aria-current={pathId === item.id ? "page" : undefined}><i>{item.glyph}</i><b>{item.label}</b></Link>
                    {index < TRIG_PATH.length - 1 ? <span /> : null}
                  </span>
                ))}
              </nav>
            ) : null}
          </div>
          <div className="msk-tools">
            <div id="msk-lab-tools" className="msk-lab-tools" />
            {isTrig && page.id !== "home" ? (
              <button
                type="button"
                className={`msk-complete-icon${session.completed.includes(page.id) ? " is-complete" : ""}`}
                aria-label={session.completed.includes(page.id) ? `${page.label} complete` : `Mark ${page.label} complete`}
                title={session.completed.includes(page.id) ? `${page.label} complete` : `Mark ${page.label} complete`}
                onClick={() => markTrigComplete(page.id)}
              >
                <CheckCircle2 />
              </button>
            ) : null}
            {isComplex && page.id !== "home" ? (
              <button
                type="button"
                className={`msk-complete-icon${complexSession.completed.includes(page.id) ? " is-complete" : ""}`}
                aria-label={complexSession.completed.includes(page.id) ? `${page.label} complete` : `Mark ${page.label} complete`}
                title={complexSession.completed.includes(page.id) ? `${page.label} complete` : `Mark ${page.label} complete`}
                onClick={() => markComplexComplete(page.id)}
              >
                <CheckCircle2 />
              </button>
            ) : null}
            {isGeo && page.id !== "home" ? (
              <button
                type="button"
                className={`msk-complete-icon${geoSession.completed.includes(page.id) ? " is-complete" : ""}`}
                aria-label={geoSession.completed.includes(page.id) ? `${page.label} complete` : `Mark ${page.label} complete`}
                title={geoSession.completed.includes(page.id) ? `${page.label} complete` : `Mark ${page.label} complete`}
                onClick={() => markGeoComplete(page.id)}
              >
                <CheckCircle2 />
              </button>
            ) : null}
            {page.id !== "home" && !isLinear && !isComplex ? <StudioCanvasToolbar /> : null}
            {isTrig ? (
              <div className="msk-units" role="group" aria-label="Angle units">
                <button type="button" className={`msk-units-deg${session.units === "deg" ? " active" : ""}`} aria-pressed={session.units === "deg"} onClick={() => writeTrigSession({ units: "deg" })}>Deg</button>
                <button type="button" className={`msk-units-rad${session.units === "rad" ? " active" : ""}`} aria-pressed={session.units === "rad"} onClick={() => writeTrigSession({ units: "rad" })}>Rad</button>
              </div>
            ) : null}
            <label className={`msk-search${searchOpen || query || isTrig || isModel || isGeo || isDiscrete || isLinear || isComplex ? " is-open" : ""}`}>
              <button type="button" aria-label="Search" onClick={() => setSearchOpen((value) => !value)}><Search /></button>
              {searchOpen || query || isTrig || isModel || isGeo || isDiscrete || isLinear || isComplex ? (
                <input
                  autoFocus={!isTrig && !isModel && !isGeo && !isDiscrete && !isLinear && !isComplex}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => { if (event.key === "Enter" && filtered[0]) navigate(filtered[0].to); }}
                  onBlur={() => { if (!query && !isTrig && !isModel && !isGeo && !isDiscrete && !isLinear && !isComplex) setSearchOpen(false); }}
                  placeholder={isTrig ? "Search θ or waves" : studio.searchPlaceholder}
                  aria-label={`Search ${studio.name}`}
                />
              ) : null}
              {query ? <button type="button" aria-label="Clear search" onClick={() => setQuery("")}><X /></button> : null}
            </label>
            {query ? (
              <ul className="msk-search-hits">
                {filtered.map((item) => (
                  <li key={item.key}><Link to={item.to} onClick={() => setQuery("")}>{item.label}<small>{item.detail}</small></Link></li>
                ))}
              </ul>
            ) : null}
            {isLinear ? (
              <>
                <span className="la-stat-chip" aria-label="Streak 0"><Flame />0</span>
                <span className="la-stat-chip" aria-label="0 XP"><Star />0 XP</span>
                {page.id === "home"
                  ? <a className="la-stat-chip" href="#la-journey"><Compass />Journey</a>
                  : <Link className="la-stat-chip" to="/linear-algebra#la-journey"><Compass />Journey</Link>}
              </>
            ) : isComplex && page.id !== "home" ? (
              <>
                {page.id === "waves-circuits" ? <ComplexHeaderPills page={page} /> : null}
                {page.id === "polar-forms" ? <button type="button" className="cx-chip" onClick={() => setHelpOpen(true)}>Quick tour</button> : null}
                {page.id === "euler" ? (
                  <button type="button" className="cx-chip" onClick={() => window.dispatchEvent(new Event("cx-lab-reset"))}>Reset</button>
                ) : null}
                {page.id === "loci" ? (
                  <>
                    <button type="button" className="cx-chip" onClick={() => window.dispatchEvent(new Event("cx-lab-animate"))}>Animate</button>
                    <span className="cx-chip">1.0×</span>
                  </>
                ) : null}
                {page.id === "arithmetic" ? (
                  <>
                    <button type="button" className="cx-chip" onClick={() => void navigator.clipboard?.writeText(window.location.href)}>Share</button>
                    <span className="cx-chip is-saved"><CheckCircle2 />Saved</span>
                    <button type="button" className="cx-chip is-reset" onClick={() => window.location.reload()}>Reset</button>
                  </>
                ) : page.id === "euler" || page.id === "waves-circuits" ? null : (
                  <>
                    <span className="cx-chip" aria-label="Streak 0"><Flame />0</span>
                    <span className="cx-chip" aria-label={`${complexSession.xp} XP`}><Star />{complexSession.xp} XP</span>
                  </>
                )}
              </>
            ) : isNumberSense ? (
              <>
                <button type="button" aria-label="Streak"><Flame /></button>
                <span><Star />{numberSenseSession.xp} XP</span>
              </>
            ) : session.xp > 0 ? (
              <>
                <button type="button" aria-label="Streak"><Flame /></button>
                <span><Star />{session.xp} XP</span>
              </>
            ) : null}
            {isTrig || isGeo || isComplex ? (
              <button type="button" aria-label={(isComplex ? complexSession.theme : isGeo ? geoSession.theme : session.theme) === "dark" ? "Switch to light theme" : "Switch to dark theme"} onClick={() => (isComplex ? writeComplexSession({ theme: complexSession.theme === "dark" ? "light" : "dark" }) : isGeo ? writeGeoSession({ theme: geoSession.theme === "dark" ? "light" : "dark" }) : writeTrigSession({ theme: session.theme === "dark" ? "light" : "dark" }))}>
                {(isComplex ? complexSession.theme : isGeo ? geoSession.theme : session.theme) === "dark" ? <Sun /> : <Moon />}
              </button>
            ) : null}
            {isTrig ? (
              <button type="button" className={`msk-teacher${session.teacherMode ? " active" : ""}`} aria-pressed={session.teacherMode} onClick={() => writeTrigSession({ teacherMode: !session.teacherMode })}>
                Teacher mode
              </button>
            ) : isGeo ? (
              <button type="button" className={`msk-teacher${geoSession.teacherMode ? " active" : ""}`} aria-pressed={geoSession.teacherMode} onClick={() => writeGeoSession({ teacherMode: !geoSession.teacherMode })}>
                Teacher mode
              </button>
            ) : isLinear ? (
              page.id === "home" ? null : (
                <button type="button" className={`msk-teacher${linearSession.teacherMode ? " active" : ""}`} aria-pressed={linearSession.teacherMode} onClick={() => writeLinearSession({ teacherMode: !linearSession.teacherMode })}>
                  Teacher mode
                </button>
              )
            ) : isComplex ? (
              page.id === "home" || page.id === "arithmetic" || page.id === "polar-forms" || page.id === "euler" || page.id === "waves-circuits" ? null : (
                <button type="button" className={`msk-teacher${complexSession.teacherMode ? " active" : ""}`} aria-pressed={complexSession.teacherMode} onClick={() => writeComplexSession({ teacherMode: !complexSession.teacherMode })}>
                  Teacher mode
                </button>
              )
            ) : isNumberSense ? (
              <button type="button" className={`msk-teacher${numberSenseSession.teacherMode ? " active" : ""}`} aria-pressed={numberSenseSession.teacherMode} aria-label="Teacher mode" onClick={() => writeNumberSenseSession({ teacherMode: !numberSenseSession.teacherMode })}>
                Teacher mode
              </button>
            ) : isModel ? null : (
              <button type="button" className={`msk-teacher${primesSession.teacherMode ? " active" : ""}`} aria-pressed={primesSession.teacherMode} aria-label="Teacher mode" onClick={() => writePrimesSession({ teacherMode: !primesSession.teacherMode })}>
                Teacher mode
              </button>
            )}
            {isGeo && page.id !== "home" ? null : (
              <button type="button" aria-label="Keyboard shortcuts" onClick={() => setHelpOpen(true)}><HelpCircle /></button>
            )}
            {isModel ? (
              <button type="button" className="msk-bell" aria-label="3 notifications">
                <Bell />
                <span>3</span>
              </button>
            ) : null}
            {isModel || (isComplex && (page.id === "arithmetic" || page.id === "polar-forms" || page.id === "euler" || page.id === "waves-circuits" || page.id === "fractals")) ? null : (
              <button type="button" aria-label="Settings" onClick={() => setSettingsOpen(true)}><Settings /></button>
            )}
            {isModel ? <button type="button" className="msk-avatar" aria-label="Account"><User /></button> : null}
          </div>
        </header>
        {(isTrig || isGeo || isDiscrete) && page.id !== "home" ? (
          <nav className="msk-topic-strip" aria-label="Topics" ref={stripRef}>
            {labs.map((item) => (
              <NavLink key={item.id} to={item.route} className={({ isActive }) => isActive ? "active" : ""}>{item.label}</NavLink>
            ))}
          </nav>
        ) : null}
        {isTrig && !session.hintDismissed ? (
          <p className="msk-hint">← → nudge θ · 0–4 snap 0°/30°/45°/60°/90° · ? help
            <button type="button" onClick={() => writeTrigSession({ hintDismissed: true })}>Dismiss</button>
          </p>
        ) : null}
        {isGeo && !geoSession.hintDismissed && page.id === "home" ? (
          <p className="msk-hint">Ctrl/⌘ K search · 2D / 3D / Proof / AR filters · Start with Triangles
            <button type="button" onClick={() => writeGeoSession({ hintDismissed: true })}>Dismiss</button>
          </p>
        ) : null}
        {isNumberSense && !numberSenseSession.hintDismissed ? (
          <p className="msk-hint">{MODE_HINTS[(NUMBER_SENSE_MODES.includes(mode as NumberSenseMode) ? mode : "Integers") as NumberSenseMode]}
            <button type="button" onClick={() => writeNumberSenseSession({ hintDismissed: true })}>Dismiss</button>
          </p>
        ) : null}
        {(isTrig && session.teacherMode) || (isGeo && geoSession.teacherMode) || (isDiscrete && discreteTeacher) || (isLinear && page.id !== "home" && linearSession.teacherMode) ? <p className="msk-teacher-banner">Teacher view: exact values and answers stay visible. Students do not see this banner.</p> : null}
        {children}
        {helpOpen ? (
          <div className="msk-help" role="dialog" aria-label="Keyboard shortcuts">
            <button type="button" className="msk-backdrop" aria-label="Close shortcuts" onClick={() => setHelpOpen(false)} />
            <div className="msk-help-card">
              <h2>Shortcuts</h2>
              {isGeo ? (
                <ul>
                  {GEO_SHORTCUTS.map((item) => (
                    <li key={item.keys}><kbd>{item.keys}</kbd> {item.action}</li>
                  ))}
                </ul>
              ) : isNumberSense ? (
                <ul>
                  {NUMBER_SENSE_SHORTCUTS.map((item) => (
                    <li key={item.keys}><kbd>{item.keys}</kbd> {item.action}</li>
                  ))}
                </ul>
              ) : isTrig ? (
                <p>← → nudge θ · 0 / 1 / 2 / 3 / 4 snap to 0°, 30°, 45°, 60°, 90° · Ctrl/⌘ K search · ? this panel</p>
              ) : (
                <ul>
                  <li><kbd>1–9</kbd> Switch lab modes</li>
                  <li><kbd>?</kbd> This shortcuts panel</li>
                  <li><kbd>LMS</kbd> Restore a figure with ?mode= and ?fig=</li>
                  <li><kbd>Room</kbd> Start activity then share the URL</li>
                </ul>
              )}
              <button className="msk-cta" type="button" onClick={() => setHelpOpen(false)}>Close</button>
            </div>
          </div>
        ) : null}
        {settingsOpen ? (
          <div className="msk-help" role="dialog" aria-label="Studio settings">
            <button type="button" className="msk-backdrop" aria-label="Close settings" onClick={() => setSettingsOpen(false)} />
            <div className="msk-help-card">
              <h2>Settings</h2>
              <p>{isGeo ? "Theme, labels, and progress for Geometry Studio." : "Theme, units, and progress for Trigonometry Studio."}</p>
              <div className="msk-units" role="group" aria-label="Theme">
                <button type="button" className={(isGeo ? geoSession.theme : session.theme) === "dark" ? "active" : ""} onClick={() => (isGeo ? writeGeoSession({ theme: "dark" }) : writeTrigSession({ theme: "dark" }))}>Dark</button>
                <button type="button" className={(isGeo ? geoSession.theme : session.theme) === "light" ? "active" : ""} onClick={() => (isGeo ? writeGeoSession({ theme: "light" }) : writeTrigSession({ theme: "light" }))}>Light</button>
              </div>
              {isGeo ? (
                <>
                  <button className="msk-soft" type="button" aria-pressed={geoSession.largeLabels} onClick={() => writeGeoSession({ largeLabels: !geoSession.largeLabels })}>Large labels</button>
                  <button className="msk-soft" type="button" onClick={() => writeGeoSession({ completed: [], warmups: [], lastRoute: "/geometry/triangles", lastMode: null, lastLabel: "Triangles Lab", lastOpenedAt: 0 })}>Reset progress</button>
                </>
              ) : (
                <button className="msk-soft" type="button" onClick={() => writeTrigSession({ completed: [], xp: 0, lastRoute: "/trigonometry/unit-circle", lastMode: null, lastLabel: "Unit Circle" })}>Reset progress</button>
              )}
              <button className="msk-cta" type="button" onClick={() => setSettingsOpen(false)}>Done</button>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}

export function MockupStudioHome({ studio }: { studio: StudioMockupDefinition }) {
  const labs = studioNavPages(studio);
  const isTrig = studio.id === "trigonometry";
  const isModel = studio.id === "modelling";
  const session = useTrigSession();
  const linearSession = useLinearSession();
  const complexSession = useComplexSession();
  const pool = labs.filter((item) => item.challenge.prompt !== "0");
  const challengePage = isModel ? labs.find((item) => item.id === "networks") ?? pool[0] : pool[dailyChallengeIndex(pool.length)] ?? pool[0];
  const next = nextTrigLab(labs, session.completed);
const launchTitle = isModel ? "Explore modelling domains" : isTrig ? "Explore Key Topics" : studio.id === "geometry" || studio.id === "complex-numbers" || studio.id === "linear-algebra" || studio.id === "discrete" || studio.id === "statistics" ? "Explore by Topic" : "Launch a topic";
  const continueTo = isTrig
    ? continueHref(session)
    : studio.id === "linear-algebra"
      ? continueLinearHref(linearSession)
      : studio.id === "complex-numbers"
        ? continueComplexHref(complexSession)
        : studio.continueRoute;
  const continueLabel = isModel
    ? "Epidemic Spread in Campus"
    : isTrig
      ? session.lastLabel
      : studio.id === "linear-algebra"
        ? linearSession.lastLabel
        : studio.id === "complex-numbers"
          ? complexSession.lastLabel
          : studio.continueLabel;
  const progress = labs.length
    ? Math.round((((studio.id === "linear-algebra"
      ? linearSession.completed
      : studio.id === "complex-numbers"
        ? complexSession.completed
        : session.completed).filter((id) => labs.some((lab) => lab.id === id)).length) / labs.length) * 100)
    : 0;

  if (studio.id === "geometry") return <GeometryStudioHome studio={studio} />;

  if (isModel) {
    return (
      <>
        <div className="msk-home msk-model-home">
          <section>
            <header className="msk-launch-head">
              <h2>{launchTitle}</h2>
            </header>
            <div className="msk-launch msk-launch-modelling">
              {labs.map((item, index) => (
                <StudioLabCard
                  key={item.id}
                  item={item}
                  index={index}
                  studioId="modelling"
                  art={<ModellingLaunchArt id={item.id} />}
                  cta="Launch →"
                  numbered
                />
              ))}
            </div>
            <section className="msk-datasets">
              <header><h2>Popular scenarios & datasets</h2><Link to="/mathematical-modelling">View all datasets →</Link></header>
              <div>
                {modellingDatasets.map((item) => (
                  <Link key={item.title} to={item.route}>
                    <ModellingLaunchArt id={item.id} />
                    <b>{item.title}</b>
                    <small>{item.tag}</small>
                  </Link>
                ))}
              </div>
            </section>
          </section>
          <aside className="msk-aside">
            <section className="msk-panel msk-continue">
              <h2>Continue model</h2>
              <div className="msk-continue-art"><ModellingLaunchArt id="epidemics" /></div>
              <p><strong>{continueLabel}</strong><span>Last edited 2h ago</span></p>
              <Link className="msk-cta" to={continueTo}>Continue →</Link>
            </section>
            <section className="msk-panel">
              <h2>Recent journey</h2>
              <ol className="msk-journey-list">
                {modellingJourney.map((item) => (
                  <li key={item.id}>
                    <i className={item.done ? "done" : item.now ? "now" : ""} />
                    <Link to={`/mathematical-modelling/${item.id}`}>{item.label}<small>{item.note}</small></Link>
                  </li>
                ))}
              </ol>
              <Link className="msk-teach" to="/mathematical-modelling">View all journey →</Link>
            </section>
            <section className="msk-panel msk-challenge">
              <h2>Today's challenge</h2>
              <div className="msk-continue-art"><ModellingLaunchArt id="networks" /></div>
              <p>Optimize the Route</p>
              <small>Find the fastest path with traffic constraints and road closures.</small>
              <Link className="msk-cta" to="/mathematical-modelling/networks">Start Challenge →</Link>
            </section>
          </aside>
        </div>
        <MockupLearningStrip page={studio.pages[0]} />
      </>
    );
  }

  const homeProps = { studio, labs, continueTo, continueLabel, progress, challenge: challengePage };
  return (
    <>
      <IllustratedStudioHome {...homeProps} title={launchTitle} cta={studio.id === "linear-algebra" ? "Open lab" : undefined} />
      <MockupLearningStrip page={isTrig ? (labs.find((item) => item.id === next?.id) ?? studio.pages[0]) : studio.pages[0]} />
    </>
  );
}
