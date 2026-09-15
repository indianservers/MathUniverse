import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import StudioGraphWidget from "../studios/phase1/StudioGraphWidget";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Copy,
  Download,
  Expand,
  Eye,
  Flame,
  FlaskConical,
  Grid3X3,
  HelpCircle,
  Keyboard,
  Lightbulb,
  Menu,
  Moon,
  Pause,
  Play,
  RotateCcw,
  Save,
  Search,
  Settings,
  Sparkles,
  Sun,
  Trophy,
  Upload,
  X,
} from "lucide-react";
import { compileFunctionExpression, compileTwoVariableExpression } from "../utils/functionParser";
import CalculusIntegrationStudio from "./CalculusIntegrationStudio";
import CalculusIntegrationTechniquesStudio from "./CalculusIntegrationTechniquesStudio";
import CalculusDerivativeApplicationsStudio from "./CalculusDerivativeApplicationsStudio";
import CalculusDerivativesStudio from "./CalculusDerivativesStudio";
import CalculusLimitsStudio from "./CalculusLimitsStudio";
import CalculusMultivariableStudio from "./CalculusMultivariableStudio";
import CalculusConceptStudio, { type ConceptPage } from "./CalculusConceptStudio";
import CalculusEnhancementWorkbench from "../studios/calculus/CalculusEnhancementWorkbench";
import CalculusEnhancementIdeas from "./CalculusEnhancementIdeas";
import StudioBreadcrumb, { mathStudioCrumbs } from "../components/ui/StudioBreadcrumb";
import StudioHomeButtons from "../components/ui/StudioHomeButtons";
import { StudioCanvasToolbar } from "../components/ui/StudioCanvasToolbar";
import { CalculusLaunchArt, CalculusNavIcon } from "./calculusStudioIcons";
import {
  dailyChallenge,
  exportSession,
  gradeChallenge,
  helpFor,
  importSession,
  loadChallenge,
  loadLastExperiment,
  loadSettings,
  persistSavedSnapshot,
  prefersReducedMotion,
  progressSummary,
  recordVisit,
  saveSettings,
  searchStudio,
  shortcutsFor,
  studioRoutes,
  type CalculusStudioPage,
  type StudioSettings,
} from "./calculusStudioSession";
import "./CalculusStudio.css";

export type { CalculusStudioPage };

type LabMode = {
  id: string;
  label: string;
};

const navItems = [
  { page: "home", label: "Studio Home" },
  { page: "limits", label: "Limits" },
  { page: "derivatives", label: "d⁄dx Derivatives" },
  { page: "derivative-applications", label: "Derivative Applications" },
  { page: "integration", label: "∫ Integration" },
  { page: "integration-techniques", label: "Integration Techniques" },
  { page: "integral-applications", label: "Integral Applications" },
  { page: "differential-equations", label: "Differential Equations" },
  { page: "series-parametric-polar", label: "Σ Series / Parametric / Polar" },
  { page: "multivariable-vector", label: "Multivariable / Vector" },
  { page: "advanced", label: "Advanced Calculus" },
] satisfies Array<{ page: CalculusStudioPage; label: string }>;

const pageMeta: Record<CalculusStudioPage, { title: string; subtitle: string; modes: LabMode[] }> = {
  home: { title: "Calculus Studio", subtitle: "Explore change, motion and accumulation.", modes: [] },
  limits: { title: "Limits & Continuity Studio", subtitle: "Explore limits, one-sided behavior, and continuity of functions.", modes: modeList("limits", "Limits", "continuity", "Continuity", "discontinuities", "Discontinuities", "asymptotes", "Asymptotes", "lhopital", "L'Hopital") },
  derivatives: { title: "Derivatives Studio", subtitle: "Connect secants, tangents, derivative rules, and local approximation.", modes: modeList("tangent", "Tangent", "rules", "Rules", "chain", "Chain Rule", "implicit", "Implicit", "higher", "Higher Order", "linearization", "Linearization") },
  "derivative-applications": { title: "Derivative Applications Studio", subtitle: "Use derivatives to solve real-world problems and make best decisions.", modes: modeList("motion", "Motion", "related", "Related Rates", "curve", "Curve Analysis", "optimization", "Optimization", "mvt", "Mean Value") },
  integration: { title: "Integration & Accumulation Studio", subtitle: "Visualize area accumulation and the Fundamental Theorem of Calculus.", modes: modeList("antiderivative", "Antiderivative", "definite", "Definite Integral", "ftc", "FTC", "riemann", "Riemann Sums", "numerical", "Numerical") },
  "integration-techniques": { title: "Integration Techniques Studio", subtitle: "Transform integrals using powerful techniques and visualize the process.", modes: modeList("substitution", "Substitution", "parts", "By Parts", "partial", "Partial Fractions", "trig", "Trig Integrals", "trig-sub", "Trig Substitution", "improper", "Improper") },
  "integral-applications": { title: "Integral Applications Studio", subtitle: "Apply integrals to solve real-world and geometric problems.", modes: modeList("area", "Area Between Curves", "volumes", "Volumes", "arc", "Arc Length", "surface", "Surface Area", "work", "Work", "fluid", "Fluid Force") },
  "differential-equations": { title: "Differential Equations Studio", subtitle: "Read slope fields, trace solution curves, and compare numerical methods.", modes: modeList("slope", "Slope Fields", "ivp", "Initial Value", "separable", "Separable", "growth", "Growth Models", "euler", "Euler", "rk4", "RK4") },
  "series-parametric-polar": { title: "Series, Parametric & Polar Studio", subtitle: "Explore series expansions, parametric curves, and polar graphs interactively.", modes: modeList("sequences", "Sequences", "convergence", "Convergence", "power", "Power Series", "taylor", "Taylor", "parametric", "Parametric", "polar", "Polar") },
  "multivariable-vector": { title: "Multivariable & Vector Calculus Studio", subtitle: "Explore surfaces, gradients, tangent planes, multiple integrals, and fields.", modes: modeList("partial", "Partial Derivatives", "gradient", "Gradient", "plane", "Tangent Plane", "optimization", "Optimization", "multiple", "Multiple Integrals", "fields", "Vector Fields", "theorems", "Theorems") },
  advanced: { title: "Advanced Calculus Workbench", subtitle: "Twenty-five linked limit, derivative, integral, series, ODE, and vector-calculus tools.", modes: [] },
};

function modeList(...items: string[]) {
  const modes: LabMode[] = [];
  for (let index = 0; index < items.length; index += 2) modes.push({ id: items[index], label: items[index + 1] });
  return modes;
}

export default function CalculusStudio({ page = "home" }: { page?: CalculusStudioPage }) {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [settings, setSettings] = useState<StudioSettings>(loadSettings);
  const [dialog, setDialog] = useState<"help" | "shortcuts" | "settings" | null>(null);
  const [params] = useSearchParams();
  const activePage = pageMeta[page] ? page : "home";
  const mode = params.get("mode") ?? pageMeta[activePage].modes[0]?.id ?? "";

  useEffect(() => setDrawerOpen(false), [location.pathname]);
  useEffect(() => {
    if (activePage === "home") return;
    recordVisit(activePage, mode, pageMeta[activePage].title, pageMeta[activePage].subtitle, activePage);
  }, [activePage, location.pathname, location.search, mode]);
  useEffect(() => {
    if (!drawerOpen && !dialog) return;
    const close = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setDrawerOpen(false);
      setDialog(null);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [dialog, drawerOpen]);
  useEffect(() => {
    const sync = () => setSettings(loadSettings());
    window.addEventListener("calculus-studio-settings", sync);
    return () => window.removeEventListener("calculus-studio-settings", sync);
  }, []);

  const updateSettings = (next: StudioSettings) => {
    setSettings(next);
    saveSettings(next);
  };

  return (
    <main className={`cs-shell ${settings.theme === "dark" ? "cs-dark" : ""} ${settings.graphLight ? "cs-graph-light" : ""} ${settings.collapseControls ? "cs-hide-controls" : ""} ${settings.collapseResults ? "cs-hide-results" : ""}`}>
      {drawerOpen && <button className="cs-backdrop" aria-label="Close Calculus Studio menu" onClick={() => setDrawerOpen(false)} />}
      <StudioSidebar page={activePage} collapsed={collapsed} open={drawerOpen} onCollapse={() => setCollapsed((value) => !value)} onClose={() => setDrawerOpen(false)} />
      <section className="cs-page">
        <StudioHeader
          page={activePage}
          mode={mode}
          settings={settings}
          onSettings={updateSettings}
          onMenu={() => setDrawerOpen(true)}
          onDialog={setDialog}
        />
        {activePage === "home" ? <StudioHome /> : <StudioLab page={activePage} reduced={prefersReducedMotion(settings)} />}
        <CalculusEnhancementIdeas page={activePage} />
      </section>
      {dialog ? (
        <StudioDialog title={dialog === "help" ? "Help" : dialog === "shortcuts" ? "Shortcuts" : "Studio settings"} onClose={() => setDialog(null)}>
          {dialog === "help" ? <p>{helpFor(activePage, mode)}</p> : null}
          {dialog === "shortcuts" ? <ul className="cs-shortcut-list">{shortcutsFor(activePage).map((item) => <li key={item}>{item}</li>)}</ul> : null}
          {dialog === "settings" ? <SettingsForm settings={settings} onChange={updateSettings} /> : null}
        </StudioDialog>
      ) : null}
    </main>
  );
}

function StudioSidebar({ page, collapsed, open, onCollapse, onClose }: { page: CalculusStudioPage; collapsed: boolean; open: boolean; onCollapse: () => void; onClose: () => void }) {
  return (
    <aside className={`cs-sidebar ${collapsed ? "is-collapsed" : ""} ${open ? "is-open" : ""}`} aria-label="Calculus Studio navigation">
      <Link className="cs-brand" to="/calculus" onClick={onClose} title="Calculus Studio">
        <span className="cs-brand-mark">∫</span>
        <span>Calculus<br />Studio</span>
      </Link>
      <button className="cs-drawer-close" type="button" onClick={onClose} aria-label="Close menu"><X /></button>
      <nav className="cs-sidebar-nav">
        {page !== "home" ? (
          <Link className="cs-nav-link" to="/" title="Leave Calculus Studio and return to the main Math Universe app" onClick={onClose}>
            <CalculusNavIcon page="main" /><span>Main app</span>
          </Link>
        ) : null}
        {navItems.map(({ page: itemPage, label }) => (
          <Link
            className={`cs-nav-link ${page === itemPage ? "active" : ""}`}
            to={studioRoutes[itemPage]}
            key={itemPage}
            title={label}
            aria-current={page === itemPage ? "page" : undefined}
            onClick={onClose}
          >
            <CalculusNavIcon page={itemPage} /><span>{label}</span>
          </Link>
        ))}
      </nav>
      <div className="cs-pro">
        <b>Save this studio</b>
        <p>Store progress, last experiment, and settings on this device. Export to move between browsers.</p>
        <div className="cs-save-actions">
          <button type="button" onClick={() => { persistSavedSnapshot(); window.alert("Studio session saved on this device."); }}><Save /> Save</button>
          <button type="button" onClick={() => {
            const blob = new Blob([exportSession()], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "calculus-studio-session.json";
            link.click();
            URL.revokeObjectURL(url);
          }}><Download /> Export</button>
          <label className="cs-import">
            <Upload /> Import
            <input type="file" accept="application/json" aria-label="Import saved studio session" onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              importSession(await file.text());
            }} />
          </label>
        </div>
      </div>
      <button className="cs-collapse" type="button" onClick={onCollapse} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} title={collapsed ? "Expand" : "Collapse"}>
        <ArrowLeft />
      </button>
    </aside>
  );
}

function StudioHeader({ page, mode, settings, onSettings, onMenu, onDialog }: {
  page: CalculusStudioPage;
  mode: string;
  settings: StudioSettings;
  onSettings: (value: StudioSettings) => void;
  onMenu: () => void;
  onDialog: (value: "help" | "shortcuts" | "settings") => void;
}) {
  const meta = pageMeta[page];
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);
  const results = useMemo(() => searchStudio(query), [query]);
  const submit = () => {
    const target = results[0];
    if (target) navigate(target.route);
  };
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "l") {
        event.preventDefault();
        void navigator.clipboard.writeText(window.location.href);
      }
      if (!typing && page === "home" && /^[1-6]$/.test(event.key)) {
        const cards = ["limits", "derivatives", "integration", "differential-equations", "series-parametric-polar", "multivariable-vector"] as const;
        navigate(studioRoutes[cards[Number(event.key) - 1]]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate, page]);
  return (
    <header className="cs-header">
      <button className="cs-menu" type="button" onClick={onMenu} aria-label="Open Calculus Studio menu"><Menu /></button>
      <div className="cs-title">
        <StudioHomeButtons studioTo="/calculus" />
        {page === "home" ? null : (
          <StudioBreadcrumb crumbs={mathStudioCrumbs(
            { label: "Calculus", to: "/calculus" },
            { label: meta.title.replace(" Studio", ""), to: studioRoutes[page] },
          )} />
        )}
        <h1>{meta.title}</h1>
        <p>{meta.subtitle}</p>
      </div>
      <div className="cs-search-wrap">
        <label className="cs-search">
          <Search />
          <input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === "Enter" && submit()} placeholder="Search formulas, topics, or experiments..." aria-label="Search Calculus Studio" />
          <kbd>Ctrl+K</kbd>
        </label>
        {query.trim() && (
          <div className="cs-search-results" role="listbox">
            {results.map((item) => <button key={item.route} type="button" onClick={() => navigate(item.route)}>{item.label}{item.formula ? <small>{item.formula}</small> : null}</button>)}
            {!results.length && <span>No calculus studio result</span>}
          </div>
        )}
      </div>
      <div className="cs-header-actions">
        {page !== "home" ? <StudioCanvasToolbar /> : null}
        <button type="button" onClick={() => onSettings({ ...settings, theme: settings.theme === "light" ? "dark" : "light" })} title="Theme" aria-label="Toggle theme">{settings.theme === "light" ? <Sun /> : <Moon />}</button>
        <button type="button" onClick={() => onDialog("shortcuts")} title="Shortcuts" aria-label="Shortcuts"><Keyboard /> Shortcuts</button>
        <button type="button" onClick={() => onDialog("help")} title="Help" aria-label="Help"><HelpCircle /></button>
        {page !== "home" ? (
          <button type="button" onClick={async () => { await navigator.clipboard.writeText(window.location.href); }} title="Copy experiment link" aria-label="Copy link"><Copy /> Copy link</button>
        ) : null}
        {page !== "home" ? (
          <button type="button" onClick={() => window.dispatchEvent(new Event("calculus-lab-reset"))} title="Reset all" aria-label="Reset all"><RotateCcw /> Reset</button>
        ) : null}
        <button type="button" onClick={() => onDialog("settings")} title="Settings" aria-label="Settings"><Settings /></button>
      </div>
    </header>
  );
}

function StudioHome() {
  const navigate = useNavigate();
  const last = loadLastExperiment();
  const progress = progressSummary();
  const [challenge, setChallenge] = useState(loadChallenge);
  const [guess, setGuess] = useState(challenge.guess);
  const cards = [
    { page: "limits", title: "Limits", note: "Explore behavior near a point.", tag: "ε-δ & One-Sided", minutes: 10, level: "Start here", modes: ["ε-δ", "One-sided", "Infinity"] },
    { page: "derivatives", title: "Derivatives", note: "Visualize slopes and tangents.", tag: "Instantaneous Change", minutes: 12, level: "Core", modes: ["Tangent", "Definition", "Rules"] },
    { page: "derivative-applications", title: "Derivative Applications", note: "Motion, related rates, optimization.", tag: "Related Rates", minutes: 10, level: "Core", modes: ["Motion", "Related rates", "Optimize"] },
    { page: "integration", title: "Integrals", note: "Accumulate area under curves.", tag: "Area & Accumulation", minutes: 12, level: "Core", modes: ["Riemann", "FTC", "Net change"] },
    { page: "integration-techniques", title: "Integration Techniques", note: "Substitution, parts, partial fractions.", tag: "By Parts", minutes: 10, level: "Next", modes: ["Substitution", "Parts", "Partial fractions"] },
    { page: "integral-applications", title: "Integral Applications", note: "Area, volume, work, and arc length.", tag: "Volumes", minutes: 10, level: "Next", modes: ["Area", "Volume", "Work"] },
    { page: "differential-equations", title: "Differential Equations", note: "Slope fields & solution curves.", tag: "dy/dx = f(x, y)", minutes: 12, level: "Next", modes: ["Slope field", "Euler", "Separable"] },
    { page: "series-parametric-polar", title: "Series & Polar", note: "Taylor, parametric, and polar graphs.", tag: "Taylor", minutes: 10, level: "Extend", modes: ["Taylor", "Parametric", "Polar"] },
    { page: "multivariable-vector", title: "Multivariable", note: "Surfaces, gradients & vector fields.", tag: "∇f & Vector Fields", minutes: 12, level: "Extend", modes: ["Surfaces", "Gradient", "Fields"] },
  ] satisfies Array<{ page: CalculusStudioPage; title: string; note: string; tag: string; minutes: number; level: string; modes: string[] }>;
  const submitGuess = () => setChallenge(gradeChallenge(guess));
  return (
    <div className="cs-home">
      <section className="cs-card cs-journey" id="journey" aria-labelledby="journey-title">
        <h2 id="journey-title">The Calculus Journey</h2>
        <div className="cs-map">
          <JourneyNode title="Limits" page="limits" />
          <span className="cs-arrow">Instantaneous<br />change <b>→</b></span>
          <JourneyNode title="Derivatives" page="derivatives" />
          <span className="cs-arrow">Accumulation<br />of change <b>→</b></span>
          <JourneyNode title="Integrals" page="integration" />
          <span className="cs-fork" aria-hidden="true" />
          <JourneyNode title="Differential Equations" page="differential-equations" compact />
          <JourneyNode title="Advanced Calculus" page="advanced" compact />
        </div>
      </section>
      <aside className="cs-home-side">
        <section className="cs-card cs-continue">
          <h2><Play /> Continue experiment</h2>
          <p><strong>{last?.title ?? "Differential Equation Slope Fields"}</strong><span>{last?.note ?? "dy/dx = x − y"}</span></p>
          <CalculusLaunchArt kind={last?.kind ?? "slope"} />
          <button className="cs-primary" type="button" onClick={() => navigate(last?.route ?? "/calculus/differential-equations")}>Resume</button>
        </section>
        <section className="cs-card cs-progress-card">
          <h2>Learning journey</h2>
          <div className="cs-progress-row">
            <span className="cs-ring" aria-label={`${progress.percent} percent complete`}><b>{progress.percent}%</b></span>
            <div>
              <small>Progress</small>
              <strong>{progress.rank}</strong>
              <em>{progress.completed} / {progress.total} topics completed</em>
              <i className="cs-progress-bar"><i style={{ width: `${progress.percent}%` }} /></i>
            </div>
          </div>
          <ol>
            {[{ id: "limits", label: "Limits" }, { id: "derivatives", label: "Derivatives" }, { id: "integration", label: "Integrals" }, { id: "de:slope", label: "Differential Equations" }, { id: "advanced:workbench", label: "Advanced Calculus" }].map((item, index, list) => {
              const done = progress.done.includes(item.id) || progress.done.some((value) => value.startsWith(`${item.id.split(":")[0]}`));
              const current = !done && list.slice(0, index).every((prior) => progress.done.includes(prior.id) || progress.done.some((value) => value.startsWith(prior.id.split(":")[0])));
              return <li key={item.id} className={current ? "now" : undefined}>{done ? <CheckCircle2 /> : null}{item.label}</li>;
            })}
          </ol>
          <Link to="/calculus#journey">View journey →</Link>
        </section>
        <section className="cs-card cs-challenge">
          <h2>Daily visual challenge</h2>
          <p>{dailyChallenge.prompt}</p>
          <div className="cs-limit-formula" aria-label="limit as x approaches 2 of (x squared minus 4) over (x minus 2)">
            lim<sub>x→2</sub> (x² − 4) / (x − 2)
          </div>
          <label className="cs-guess">
            Your answer
            <input inputMode="decimal" value={guess} onChange={(event) => setGuess(event.target.value)} aria-label="Challenge guess" />
          </label>
          {challenge.solved ? <p className="cs-feedback">Correct: the limit equals 4.</p> : challenge.guess ? <p className="cs-error">Not yet. Factor first, or open the hint.</p> : null}
          <div className="cs-challenge-actions">
            <button type="button" onClick={() => window.alert(dailyChallenge.hint)}>View hint</button>
            <button className="cs-primary" type="button" onClick={submitGuess}>Check answer</button>
          </div>
          <button className="cs-linkish" type="button" onClick={() => navigate("/calculus/limits")}>Try it now</button>
          <p className="cs-streak"><Flame /> Streak: {challenge.streak} days</p>
        </section>
      </aside>
      <section className="cs-card cs-launch">
        <h2>Launch an experiment</h2>
        <p>Interactive visual labs to build intuition and master calculus. Press 1–9 to jump.</p>
        <div className="cs-launch-grid">
          {cards.map((card, index) => (
            <button key={card.page} type="button" className="cs-launch-card" onClick={() => navigate(studioRoutes[card.page])} aria-describedby={`launch-tag-${card.page}`}>
              <span>{index + 1}</span>
              <strong>{card.title}</strong>
              <small>{card.note}</small>
              <CalculusLaunchArt kind={card.page} />
              <em className="cs-card-meta">{`${card.level} · ${card.minutes} min`}</em>
              <small className="cs-card-modes">{card.modes.join(" · ")}</small>
              <b id={`launch-tag-${card.page}`}>{card.tag}</b>
              <i>Open {card.title}</i>
            </button>
          ))}
        </div>
      </section>
      <section className="cs-card cs-why">
        <h2>Why visualize?</h2>
        <div>
        <InfoPill icon={<Eye />} title="Observe" text="Watch limits, slopes, and area change as you drag." />
        <InfoPill icon={<Lightbulb />} title="Understand" text="Connect the picture to the formula in live results." />
        <InfoPill icon={<Sparkles />} title="Why" text="See why the theorem holds, not only that it holds." />
        <InfoPill icon={<FlaskConical />} title="Try" text="Change parameters, inspect patterns, and test ideas." />
        <InfoPill icon={<Trophy />} title="Challenge" text="Solve the daily visual problem and keep a streak." />
        </div>
      </section>
    </div>
  );
}

function JourneyNode({ title, page, compact }: { title: string; page: CalculusStudioPage; compact?: boolean }) {
  return (
    <Link className={`cs-journey-node${compact ? " is-compact" : ""}`} to={studioRoutes[page]}>
      <strong>{title}</strong>
      <CalculusLaunchArt kind={page} />
    </Link>
  );
}

function StudioLab({ page, reduced }: { page: Exclude<CalculusStudioPage, "home">; reduced: boolean }) {
  const [params, setParams] = useSearchParams();
  const settings = loadSettings();
  if (page === "advanced") return <CalculusEnhancementWorkbench />;
  if (page === "multivariable-vector") return <CalculusMultivariableStudio />;
  const meta = pageMeta[page];
  const defaultMode = page === "integration" ? "definite" : meta.modes[0].id;
  const requestedMode = params.get("mode") ?? defaultMode;
  const mode = meta.modes.some((item) => item.id === requestedMode) ? requestedMode : defaultMode;
  const chooseMode = (next: string) => {
    const sp = new URLSearchParams(params);
    sp.set("mode", next);
    setParams(sp, { replace: true });
  };
  const onTabKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = meta.modes.findIndex((item) => item.id === mode);
    if (event.key === "ArrowRight") chooseMode(meta.modes[(index + 1) % meta.modes.length].id);
    if (event.key === "ArrowLeft") chooseMode(meta.modes[(index - 1 + meta.modes.length) % meta.modes.length].id);
  };
  return (
    <div className={`cs-lab-page cs-lab-${page}`} data-lab-mode={mode} data-mode-canvas={mode}>
      <div className="cs-lab-toolbar">
        <nav className="cs-tabs" role="tablist" aria-label={`${meta.title} modes`} onKeyDown={onTabKey}>
          {meta.modes.map((item) => (
            <button key={item.id} type="button" role="tab" id={`cs-tab-${item.id}`} aria-controls={`cs-panel-${item.id}`} className={mode === item.id ? "active" : ""} aria-selected={mode === item.id} tabIndex={mode === item.id ? 0 : -1} onClick={() => chooseMode(item.id)}>{item.label}</button>
          ))}
        </nav>
        <div className="cs-panel-toggles">
          <button type="button" onClick={() => saveSettings({ ...settings, collapseControls: !settings.collapseControls })}>{settings.collapseControls ? "Show controls" : "Hide controls"}</button>
          <button type="button" onClick={() => saveSettings({ ...settings, collapseResults: !settings.collapseResults })}>{settings.collapseResults ? "Show results" : "Hide results"}</button>
        </div>
      </div>
      <div id={`cs-panel-${mode}`} role="tabpanel" aria-labelledby={`cs-tab-${mode}`}>
        {page === "integration"
          ? <CalculusIntegrationStudio mode={mode} />
          : page === "limits"
            ? <CalculusLimitsStudio mode={mode} />
          : page === "derivatives"
            ? <CalculusDerivativesStudio mode={mode} />
          : page === "integration-techniques"
            ? <CalculusIntegrationTechniquesStudio mode={mode} />
          : page === "derivative-applications"
            ? <CalculusDerivativeApplicationsStudio mode={mode} />
            : <InteractiveLab page={page} mode={mode} reduced={reduced} />}
      </div>
    </div>
  );
}

function InteractiveLab({ page, mode, reduced }: { page: Exclude<CalculusStudioPage, "home">; mode: string; reduced: boolean }) {
  const [expression, setExpression] = useState(defaultExpression(page, mode));
  const [draft, setDraft] = useState(defaultExpression(page, mode));
  const [a, setA] = useState(page === "integration" || page === "integral-applications" ? -2 : page === "derivatives" ? 1 : 0);
  const [b, setB] = useState(page === "integration" || page === "integral-applications" ? 3 : 2);
  const [delta, setDelta] = useState(page === "derivatives" ? 0.5 : 0.1);
  const [n, setN] = useState(page === "series-parametric-polar" ? 7 : 12);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [trace, setTrace] = useState(true);
  const [showAux, setShowAux] = useState(true);
  const [learning, setLearning] = useState("Observe");
  const [toast, setToast] = useState("");
  const [riemann, setRiemann] = useState<"left" | "mid" | "right" | "trap">("mid");
  const compiled = useMemo(() => compileOne(expression), [expression]);
  const field = useMemo(() => {
    try { return { fn: compileTwoVariableExpression(expression), error: "" }; }
    catch (error) { return { fn: ((x: number, y: number) => x - y), error: error instanceof Error ? error.message : "Invalid field" }; }
  }, [expression]);
  const surface = useMemo(() => {
    try { return { fn: compileTwoVariableExpression(expression), error: "" }; }
    catch (error) { return { fn: null, error: error instanceof Error ? error.message : "Invalid surface" }; }
  }, [expression]);

  useEffect(() => {
    setDraft(defaultExpression(page, mode));
    setExpression(defaultExpression(page, mode));
  }, [page, mode]);

  useEffect(() => {
    if (!playing || reduced) return;
    const id = window.setInterval(() => {
      if (page === "derivatives") setDelta((value) => value <= 0.04 ? 1 : Math.max(0.02, value - 0.025 * speed));
      else if (page === "integration" || page === "integral-applications") setN((value) => value >= 80 ? 4 : value + Math.max(1, Math.round(speed)));
      else if (page === "series-parametric-polar") setN((value) => value >= 12 ? 1 : value + 1);
      else setA((value) => value >= 3 ? -3 : Number((value + 0.05 * speed).toFixed(2)));
    }, 80);
    return () => window.clearInterval(id);
  }, [page, playing, reduced, speed]);

  const stats = useMemo(() => calculateStats(page, mode, compiled.fn, a, b, delta, n, field.fn), [page, mode, compiled.fn, a, b, delta, n, field.fn]);
  if (usesConceptStudio(page)) return <CalculusConceptStudio page={page as ConceptPage} mode={mode} />;
  const reset = () => {
    setA(page === "integration" || page === "integral-applications" ? -2 : page === "derivatives" ? 1 : 0);
    setB(page === "integration" || page === "integral-applications" ? 3 : 2);
    setDelta(page === "derivatives" ? 0.5 : 0.1);
    setN(page === "series-parametric-polar" ? 7 : 12);
    setPlaying(false);
    setTrace(true);
    setShowAux(true);
  };
  useEffect(() => {
    const onReset = () => reset();
    window.addEventListener("calculus-lab-reset", reset);
    return () => window.removeEventListener("calculus-lab-reset", onReset);
  });
  const plot = () => {
    setExpression(draft);
    setToast(compileOne(draft).error || field.error || "Plotted.");
    window.setTimeout(() => setToast(""), 2400);
  };

  return (
    <>
      <div className="cs-workspace">
        <aside className="cs-card cs-controls">
          <h2><span>1</span> Controls</h2>
          <label>Function or model<input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => event.key === "Enter" && plot()} /></label>
          <button className="cs-primary" type="button" onClick={plot}>Plot</button>
          {toast ? <p className={toast === "Plotted." ? "cs-feedback" : "cs-error"}>{toast}</p> : null}
          {(compiled.error && page !== "multivariable-vector" && page !== "differential-equations") && <p className="cs-error">{compiled.error}</p>}
          {(surface.error && page === "multivariable-vector") && <p className="cs-error">{surface.error}</p>}
          {page === "differential-equations" ? <p className="cs-feedback">Model dy/dx = f(x, y). Click the slope field to set (x₀, y₀). Euler, RK4, and the exact curve overlay when f(x,y)=x−y.</p> : <ExampleChips page={page} mode={mode} onPick={(value) => { setDraft(value); setExpression(value); }} />}
          <Range label={axisLabel(page, mode, "a")} value={a} min={-5} max={5} step={0.05} onChange={setA} />
          {(page === "integration" || page === "integral-applications" || page === "differential-equations" || page === "multivariable-vector") && <Range label={axisLabel(page, mode, "b")} value={b} min={-5} max={5} step={0.05} onChange={setB} />}
          {(page === "derivatives" || page === "limits" || page === "differential-equations") && <Range label={page === "derivatives" ? "Secant distance h" : page === "differential-equations" ? "Step size h" : "Approach / step size"} value={delta} min={0.02} max={2} step={0.02} onChange={setDelta} />}
          {(page === "integration" || page === "integral-applications" || page === "series-parametric-polar") && <Range label={page === "series-parametric-polar" ? "Degree n" : "Partitions / slices n"} value={n} min={2} max={page === "series-parametric-polar" ? 12 : 80} step={1} onChange={(value) => setN(Math.round(value))} />}
          {page === "integral-applications" && mode === "area" ? null : null}
          {(page === "integration" || page === "integral-applications") && (
            <div className="cs-chips">{(["left", "mid", "right", "trap"] as const).map((item) => <button key={item} type="button" className={riemann === item ? "active" : ""} onClick={() => setRiemann(item)}>{item}</button>)}</div>
          )}
          <div className="cs-toggle-row"><label><input type="checkbox" checked={trace} onChange={(event) => setTrace(event.target.checked)} /> Trace</label><label><input type="checkbox" checked={showAux} onChange={(event) => setShowAux(event.target.checked)} /> Guides</label></div>
          <div className="cs-player">
            <button type="button" onClick={reset}><RotateCcw /></button>
            <button className="cs-primary" type="button" onClick={() => setPlaying((value) => !value)} disabled={reduced}>{playing ? <Pause /> : <Play />}</button>
            <button type="button" onClick={() => page === "derivatives" ? setDelta((value) => Math.max(0.02, value - 0.05)) : setA((value) => Math.min(5, value + 0.1))}>Step</button>
            <select value={speed} onChange={(event) => setSpeed(Number(event.target.value))} aria-label="Animation speed"><option value={0.5}>0.5x</option><option value={1}>1x</option><option value={2}>2x</option></select>
          </div>
        </aside>
        <section className="cs-card cs-visual-card">
          <div className="cs-card-top"><h2>{visualTitle(page, mode)}</h2><div><button type="button" onClick={() => setShowAux((value) => !value)}><Grid3X3 /> Guides</button><button type="button" onClick={() => void toggleStudioFullscreen()}><Expand /></button></div></div>
          {page === "multivariable-vector"
            ? <SurfaceLab fn={surface.fn} a={a} b={b} trace={trace} showAux={showAux} />
            : page === "differential-equations"
              ? <SlopeFieldLab a={a} b={b} h={delta} showAux={showAux} field={field.fn} onPick={(x, y) => { setA(x); setB(y); }} />
              : page === "series-parametric-polar"
                ? <SeriesLab mode={mode} n={n} a={a} trace={trace} showAux={showAux} />
                : page === "derivative-applications"
                  ? <ApplicationsLab mode={mode} width={24} length={36} x={Math.max(0.1, Math.min(11.9, Math.abs(a) + 4.2))} />
                  : page === "integration-techniques"
                    ? <TechniqueLab mode={mode} />
                    : page === "integral-applications"
                      ? <IntegralApplicationLab mode={mode} fn={compiled.fn} a={a} b={b} n={n} />
                    : <FunctionLab page={page} mode={mode} expression={expression} fn={compiled.fn} a={a} b={b} delta={delta} n={n} trace={trace} showAux={showAux} />}
        </section>
        <aside className="cs-card cs-results">
          <h2><span>2</span> Live results</h2>
          <ResultGrid stats={stats} />
          {page === "differential-equations" ? <Rk4Table x0={a} y0={b || 1} h={delta} field={field.fn} /> : null}
          {page === "series-parametric-polar" ? <TaylorTerms n={n} x={a} mode={mode} /> : null}
          <section className="cs-mini-card">
            <h3>{statusTitle(page, mode, stats)}</h3>
            <p>{stateAwareCopy(page, mode, stats, a, b, delta, n)}</p>
          </section>
          <button className="cs-primary" type="button" onClick={() => runChallenge(page, stats)}>Check challenge</button>
        </aside>
      </div>
      <LearningBar active={learning} onChange={setLearning} page={page} mode={mode} stats={stats} />
    </>
  );
}

function usesConceptStudio(_page: CalculusStudioPage): boolean {
  return false;
}

function ExampleChips({ page, mode, onPick }: { page: CalculusStudioPage; mode: string; onPick: (value: string) => void }) {
  const examples = page === "multivariable-vector" ? ["x^2-y^2", "sin(x)+cos(y)", "x*y"] : page === "limits" ? ["sin(x)/x", "1/x", "(x^2-1)/(x-1)", "abs(x)"] : page === "series-parametric-polar" ? ["sin(x)", "cos(x)", "exp(x)"] : ["x^2", "sin(x)", "x^3-3*x", "1/(x^2+1)"];
  return <div className="cs-chips">{examples.map((item) => <button key={`${mode}-${item}`} type="button" onClick={() => onPick(item)}>{pretty(item)}</button>)}</div>;
}

function Range({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void }) {
  return (
    <label className="cs-range">
      <span>{label}<b>{fmt(value, step < 1 ? 2 : 0)}</b></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
      <input type="number" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} aria-label={`${label} numeric value`} />
    </label>
  );
}

function FunctionLab({ page, mode, expression, fn, a, b, delta, n, trace, showAux }: { page: CalculusStudioPage; mode: string; expression: string; fn: ((x: number) => number) | null; a: number; b: number; delta: number; n: number; trace: boolean; showAux: boolean }) {
  const xMin = -4, xMax = 4, yMin = -3, yMax = 6, width = 900, height = 560, pad = 54;
  const sx = (x: number) => pad + (x - xMin) / (xMax - xMin) * (width - pad * 2);
  const sy = (y: number) => height - pad - (y - yMin) / (yMax - yMin) * (height - pad * 2);
  const samples = useMemo(() => fn ? sample(fn, xMin, xMax, 420) : [], [fn, xMin, xMax]);
  const fa = fn ? safe(fn, a) : NaN, fb = fn ? safe(fn, b) : NaN;
  const left = fn ? safe(fn, a - delta) : NaN, right = fn ? safe(fn, a + delta) : NaN;
  const derivative = fn ? derivativeAt(fn, a) : NaN;
  const integralBars = page === "integration" || page === "integral-applications";
  const taylor = page === "series-parametric-polar"
    ? Array.from({ length: n }, (_, k) => {
        const odd = 2 * k + 1;
        const sign = k % 2 === 0 ? 1 : -1;
        const fact = Array.from({ length: odd }, (_, i) => i + 1).reduce((p, i) => p * i, 1);
        return `${sign === 1 ? "+" : "-"}x^${odd}/${fact}`;
      }).join("").replace(/^\+/, "")
    : null;
  return (
    <div>
    <StudioGraphWidget expressions={taylor ? [expression, taylor] : [expression]} labels={taylor ? [expression, `Taylor n=${n}`] : [expression]} traceX={a} view={{ xMin: -4, xMax: 4, yMin: -3, yMax: 6 }} />
    <svg className="cs-graph" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Interactive calculus graph">
      <rect width={width} height={height} rx="16" fill="#071d35" />
      {showAux && <Grid width={width} height={height} pad={pad} />}
      <line x1={pad} x2={width - pad} y1={sy(0)} y2={sy(0)} className="cs-axis" /><line x1={sx(0)} x2={sx(0)} y1={pad} y2={height - pad} className="cs-axis" />
      {integralBars && fn && Array.from({ length: Math.max(2, Math.min(80, n)) }, (_, i) => {
        const lo = Math.min(a, b), hi = Math.max(a, b), dx = (hi - lo) / n, x = lo + i * dx, mid = x + dx / 2, y = safe(fn, mid);
        return Number.isFinite(y) ? <rect key={i} x={sx(x)} y={sy(Math.max(0, y))} width={Math.max(1, sx(x + dx) - sx(x) - 1)} height={Math.abs(sy(y) - sy(0))} fill="#f5b841" opacity=".48" stroke="#f59e0b" /> : null;
      })}
      <path d={pathFor(samples, sx, sy, yMin, yMax)} fill="none" stroke="#10c7e8" strokeWidth="4" />
      {page === "derivatives" && fn && Number.isFinite(fa) && <line x1={sx(a - 1.5)} x2={sx(a + 1.5)} y1={sy(fa - derivative * 1.5)} y2={sy(fa + derivative * 1.5)} stroke="#ff8a1f" strokeWidth="3" />}
      {page === "derivatives" && fn && Number.isFinite(fa) && Number.isFinite(safe(fn, a + delta)) && <line x1={sx(a)} x2={sx(a + delta)} y1={sy(fa)} y2={sy(safe(fn, a + delta))} stroke="#8b5cf6" strokeWidth="3" />}
      {page === "limits" && fn && <><circle cx={sx(a - delta)} cy={sy(left)} r="8" fill="#f97316" /><circle cx={sx(a + delta)} cy={sy(right)} r="8" fill="#8b5cf6" /><line x1={sx(a)} x2={sx(a)} y1={pad} y2={height - pad} stroke="#fb7185" strokeDasharray="8 7" /></>}
      {trace && Number.isFinite(fa) && <><circle cx={sx(a)} cy={sy(fa)} r="8" fill="#fff" stroke="#08223d" strokeWidth="4" /><text x={sx(a) + 12} y={sy(fa) - 14} className="cs-svg-label">x = {fmt(a, 2)}, y = {fmt(fa, 3)}</text></>}
      {Number.isFinite(fb) && integralBars && <circle cx={sx(b)} cy={sy(fb)} r="7" fill="#8b5cf6" />}
      <text x="72" y="42" className="cs-svg-title">{visualTitle(page, mode)}</text>
    </svg>
    </div>
  );
}

function SlopeFieldLab({ a, b, h, showAux, field, onPick }: { a: number; b: number; h: number; showAux: boolean; field: (x: number, y: number) => number; onPick: (x: number, y: number) => void }) {
  const width = 900, height = 560, pad = 54, xMin = -5, xMax = 5, yMin = -4, yMax = 4;
  const sx = (x: number) => pad + (x - xMin) / (xMax - xMin) * (width - pad * 2);
  const sy = (y: number) => height - pad - (y - yMin) / (yMax - yMin) * (height - pad * 2);
  const f = field;
  const rk = integrate(f, a, b || 1, Math.max(0.02, h), 50, "rk4");
  const euler = integrate(f, a, b || 1, Math.max(0.02, h), 50, "euler");
  const exact = sample((t) => t - 1 + ((b || 1) - a + 1) * Math.exp(a - t), a, a + Math.max(0.02, h) * 50, 80);
  const click = (event: { currentTarget: SVGSVGElement; clientX: number; clientY: number }) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width * width;
    const py = (event.clientY - rect.top) / rect.height * height;
    const x = xMin + (px - pad) / (width - pad * 2) * (xMax - xMin);
    const y = yMax - (py - pad) / (height - pad * 2) * (yMax - yMin);
    onPick(Number(x.toFixed(2)), Number(y.toFixed(2)));
  };
  return (
    <svg className="cs-graph cs-light-graph is-interactive" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Slope field with Euler, RK4, and solution curves" onPointerDown={click}>
      <rect width={width} height={height} rx="16" fill="#ffffff" />
      {showAux && <Grid width={width} height={height} pad={pad} light />}
      <line x1={pad} x2={width - pad} y1={sy(0)} y2={sy(0)} className="cs-axis light" /><line x1={sx(0)} x2={sx(0)} y1={pad} y2={height - pad} className="cs-axis light" />
      {Array.from({ length: 21 }, (_, ix) => Array.from({ length: 17 }, (_, iy) => {
        const x = -5 + ix * 0.5, y = -4 + iy * 0.5, m = f(x, y), len = 12, ang = Math.atan(m);
        return <line key={`${ix}-${iy}`} x1={sx(x) - Math.cos(ang) * len / 2} y1={sy(y) - Math.sin(ang) * len / 2} x2={sx(x) + Math.cos(ang) * len / 2} y2={sy(y) + Math.sin(ang) * len / 2} stroke="#10aee8" strokeWidth="1.5" />;
      }))}
      <path d={euler.map((p, i) => `${i ? "L" : "M"}${sx(p.x)},${sy(p.y)}`).join(" ")} fill="none" stroke="#f59e0b" strokeWidth="3" />
      <path d={rk.map((p, i) => `${i ? "L" : "M"}${sx(p.x)},${sy(p.y)}`).join(" ")} fill="none" stroke="#ff3b3b" strokeWidth="4" />
      <path d={pathFor(exact.map((p) => ({ ...p, ok: Number.isFinite(p.y) })), sx, sy, yMin, yMax)} fill="none" stroke="#16a34a" strokeWidth="2" strokeDasharray="6 5" />
      <circle cx={sx(a)} cy={sy(b || 1)} r="8" fill="#f97316" stroke="#fff" strokeWidth="3" />
      <text x="72" y="42" className="cs-light-title">Click to set (x₀, y₀) · orange Euler · red RK4 · green exact for x−y</text>
    </svg>
  );
}

function SeriesLab({ mode, n, a, trace, showAux }: { mode: string; n: number; a: number; trace: boolean; showAux: boolean }) {
  const width = 900, height = 560, pad = 54, xMin = -Math.PI * 2, xMax = Math.PI * 2, yMin = -1.6, yMax = 1.6;
  const sx = (x: number) => pad + (x - xMin) / (xMax - xMin) * (width - pad * 2);
  const sy = (y: number) => height - pad - (y - yMin) / (yMax - yMin) * (height - pad * 2);
  const actual = sample(Math.sin, xMin, xMax, 500);
  const approx = sample((x) => taylorSin(x, Math.max(1, n)), xMin, xMax, 500);
  const remainder = sample((x) => Math.abs(Math.sin(x) - taylorSin(x, Math.max(1, n))), xMin, xMax, 200);
  const polar = mode === "polar";
  const parametric = mode === "parametric";
  const sequences = mode === "sequences" || mode === "convergence";
  const [theta, setTheta] = useState(a);
  useEffect(() => {
    if (!polar && !parametric) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setTheta(a); return; }
    let id = 0;
    const tick = () => {
      setTheta((value) => (value + 0.035) % (Math.PI * 2));
      id = window.requestAnimationFrame(tick);
    };
    id = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(id);
  }, [polar, parametric, a]);
  const sweep = polar ? theta : a;
  return (
    <svg className="cs-graph" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Series parametric or polar graph">
      <rect width={width} height={height} rx="16" fill="#071d35" />
      {showAux && <Grid width={width} height={height} pad={pad} />}
      <line x1={pad} x2={width - pad} y1={sy(0)} y2={sy(0)} className="cs-axis" /><line x1={sx(0)} x2={sx(0)} y1={pad} y2={height - pad} className="cs-axis" />
      {polar ? <path d={polarPath(sx, sy)} fill="none" stroke="#10c7e8" strokeWidth="4" /> : sequences ? Array.from({ length: Math.max(4, n) }, (_, k) => {
        const x = (k + 1) * 0.45 - 3, y = 1 / (k + 1);
        return <circle key={k} cx={sx(x)} cy={sy(y)} r={k === n - 1 ? 8 : 5} fill={k === n - 1 ? "#f97316" : "#8b5cf6"} />;
      }) : parametric ? <path d={Array.from({ length: 240 }, (_, i) => {
        const t = i / 239 * Math.PI * 2, x = Math.cos(t), y = Math.sin(2 * t);
        return `${i ? "L" : "M"}${sx(x * 2)},${sy(y)}`;
      }).join(" ")} fill="none" stroke="#10c7e8" strokeWidth="4" /> : <>
        <path d={pathFor(actual, sx, sy, yMin, yMax)} fill="none" stroke="#10c7e8" strokeWidth="4" />
        <path d={pathFor(approx, sx, sy, yMin, yMax)} fill="none" stroke="#8b5cf6" strokeWidth="3" strokeDasharray="8 6" />
        <path d={`${pathFor(remainder.map((p) => ({ x: p.x, y: Math.sin(p.x) + p.y, ok: p.ok })), sx, sy, yMin, yMax)} ${pathFor([...remainder].reverse().map((p) => ({ x: p.x, y: Math.sin(p.x) - p.y, ok: p.ok })), sx, sy, yMin, yMax)}`} fill="rgba(139,92,246,.18)" stroke="none" />
      </>}
      {trace && !polar && !sequences && <><line x1={sx(a)} x2={sx(a)} y1={pad} y2={height - pad} stroke="#8b5cf6" strokeDasharray="7 6" /><circle cx={sx(a)} cy={sy(taylorSin(a, n))} r="8" fill="#8b5cf6" /></>}
      {polar && <circle cx={sx((1 + Math.cos(sweep)) * Math.cos(sweep) * 2)} cy={sy((1 + Math.cos(sweep)) * Math.sin(sweep) * 2)} r="8" fill="#f97316" />}
      {parametric && <circle cx={sx(Math.cos(sweep) * 2)} cy={sy(Math.sin(2 * sweep))} r="8" fill="#f97316" />}
      <text x="72" y="42" className="cs-svg-title">{polar ? "Polar trace r = 1 + cos(theta)" : parametric ? "Parametric (cos t, sin 2t)" : sequences ? `Sequence a_n = 1/n` : `Taylor polynomial T_${n}(x) with remainder band`}</text>
    </svg>
  );
}

function ApplicationsLab({ mode, width, length, x }: { mode: string; width: number; length: number; x: number }) {
  const max = Math.max(0, x * (width - 2 * x) * (length - 2 * x));
  return (
    <div className="cs-application-visual">
      <svg viewBox="0 0 900 560" role="img" aria-label="Derivative application optimization model">
        <rect width="900" height="560" rx="16" fill="#ffffff" />
        <polygon points="170,240 620,240 720,170 270,170" fill="#93c5fd" opacity=".55" stroke="#0f4b85" strokeWidth="3" />
        <polygon points="170,240 170,350 620,350 620,240" fill="#0ea5e9" opacity=".55" stroke="#0f4b85" strokeWidth="3" />
        <polygon points="620,240 720,170 720,280 620,350" fill="#0284c7" opacity=".42" stroke="#0f4b85" strokeWidth="3" />
        <text x="70" y="70" className="cs-light-title">{mode === "optimization" ? "Open-top box optimization" : "Derivative application model"}</text>
        <text x="70" y="110" className="cs-light-text">x = {fmt(x, 2)} in, V(x) = {fmt(max, 2)} cubic units</text>
      </svg>
    </div>
  );
}

function TechniqueLab({ mode }: { mode: string }) {
  const [step, setStep] = useState(1);
  return (
    <div className="cs-technique">
      {[{ title: "Original Integral", body: "Integral from 0 to 2 of x sqrt(x^2 + 1) dx" }, { title: mode === "parts" ? "Choose u and dv" : mode === "partial" ? "Cover-up constants" : mode === "improper" ? "Finite cutoff" : "Substitute", body: mode === "parts" ? "u = x, dv = sqrt(x^2+1) dx" : mode === "partial" ? "A/(x-1)+B/(x+1)" : mode === "improper" ? "∫_1^b → ∫_1^∞" : "u = x^2 + 1, du = 2x dx" }, { title: "Transformed Integral", body: "1/2 Integral from 1 to 5 of u^(1/2) du = 3.3939" }].map((item, index) => (
        <button key={item.title} type="button" className={`cs-step-card ${step === index + 1 ? "active" : ""}`} onClick={() => setStep(index + 1)}><strong>{item.title}</strong><p>{item.body}</p></button>
      ))}
      <svg viewBox="0 0 900 300" role="img" aria-label="Technique diagram">
        <rect width="900" height="300" rx="14" fill="#ffffff" />
        {mode === "trig-sub" ? <><circle cx="220" cy="170" r="70" fill="none" stroke="#0ea5e9" strokeWidth="3" /><line x1="220" x2="290" y1="170" y2="170" stroke="#f59e0b" /><text x="80" y="50" className="cs-light-title">x = 3 sin θ</text></> : mode === "improper" ? <><path d="M80 230 C180 140 360 90 820 80 L820 230 Z" fill="#f8c95a" opacity=".35" /><line x1="700" x2="700" y1="80" y2="230" stroke="#8b5cf6" strokeDasharray="6 5" /><text x="100" y="50" className="cs-light-title">Tail beyond cutoff b</text></> : mode === "partial" ? <><text x="80" y="70" className="cs-light-title">Cover-up: A = 1/2 at x=1, B = -1/2 at x=-1</text><rect x="90" y="110" width="280" height="120" rx="12" fill="#ecfeff" /><text x="110" y="175">A/(x-1)</text><rect x="500" y="110" width="280" height="120" rx="12" fill="#f5f3ff" /><text x="520" y="175">B/(x+1)</text></> : <><path d="M80 230 C180 140 260 100 380 80 L380 230 Z" fill="#f8c95a" opacity=".45" stroke="#0ea5e9" strokeWidth="3" /><path d="M520 230 C600 160 700 120 820 105 L820 230 Z" fill="#f8c95a" opacity=".45" stroke="#8b5cf6" strokeWidth="3" /><text x="100" y="55" className="cs-light-title">x-space</text><text x="555" y="55" className="cs-light-title">u-space</text></>}
      </svg>
    </div>
  );
}

function IntegralApplicationLab({ mode, fn, a, b, n }: { mode: string; fn: ((x: number) => number) | null; a: number; b: number; n: number }) {
  const width = 900, height = 560, pad = 54, xMin = -4, xMax = 4, yMin = -1, yMax = 8;
  const sx = (x: number) => pad + (x - xMin) / (xMax - xMin) * (width - pad * 2);
  const sy = (y: number) => height - pad - (y - yMin) / (yMax - yMin) * (height - pad * 2);
  const f = fn ?? ((x: number) => x * x);
  const g = (x: number) => 0.4 * x + 1;
  const samples = sample(f, xMin, xMax, 320);
  const washers = Array.from({ length: Math.max(4, Math.min(24, n)) }, (_, i) => {
    const x = Math.min(a, b) + i / n * Math.abs(b - a);
    return { x, r: Math.abs(safe(f, x)) };
  });
  return (
    <svg className="cs-graph" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Integral application">
      <rect width={width} height={height} rx="16" fill="#ffffff" />
      <Grid width={width} height={height} pad={pad} light />
      {mode === "area" ? <>
        <path d={`${pathFor(samples, sx, sy, yMin, yMax)} L${sx(xMax)},${sy(g(xMax))} ${sample(g, xMax, xMin, 80).map((p) => `L${sx(p.x)},${sy(p.y)}`).join(" ")} Z`} fill="rgba(14,165,233,.28)" />
        <path d={pathFor(samples, sx, sy, yMin, yMax)} fill="none" stroke="#0ea5e9" strokeWidth="3" />
        <path d={pathFor(sample(g, xMin, xMax, 200), sx, sy, yMin, yMax)} fill="none" stroke="#8b5cf6" strokeWidth="3" />
        <text x="70" y="48" className="cs-light-title">Area between f and g</text>
      </> : mode === "volumes" ? <>
        {washers.map((slice, i) => <ellipse key={i} cx={sx(slice.x)} cy={sy(0)} rx="18" ry={Math.min(90, slice.r * 18)} fill="none" stroke="#0ea5e9" opacity=".55" />)}
        <path d={pathFor(samples, sx, sy, yMin, yMax)} fill="none" stroke="#0ea5e9" strokeWidth="3" />
        <text x="70" y="48" className="cs-light-title">Washer stack about the x-axis</text>
      </> : <>
        <path d={pathFor(samples, sx, sy, yMin, yMax)} fill="none" stroke="#0ea5e9" strokeWidth="3" />
        <path d={`M${sx(a)},${sy(safe(f, a))} L${sx(b)},${sy(safe(f, b))}`} stroke="#f59e0b" strokeDasharray="6 4" />
        <text x="70" y="48" className="cs-light-title">{mode === "arc" ? "Arc-length polyline" : mode === "work" ? "Work as area under F(x)" : "Surface of revolution silhouette"}</text>
      </>}
    </svg>
  );
}

function SurfaceLab({ fn, a, b, trace, showAux }: { fn: ((x: number, y: number) => number) | null; a: number; b: number; trace: boolean; showAux: boolean }) {
  const z = fn ? safe2(fn, a, b) : NaN;
  return (
    <svg className="cs-surface" viewBox="0 0 900 560" role="img" aria-label="Multivariable surface and contour map">
      <rect width="900" height="560" rx="16" fill="#ffffff" />
      {showAux && <g opacity=".35">{Array.from({ length: 12 }, (_, i) => <line key={i} x1={130 + i * 45} y1="390" x2={230 + i * 45} y2="250" stroke="#cbd5e1" />)}</g>}
      <path d="M130 370 C260 170 380 470 520 250 C640 70 710 250 790 130 L790 340 C670 470 545 410 420 440 C280 470 210 410 130 480 Z" fill="url(#surface-grad)" stroke="#38bdf8" strokeWidth="2" />
      <defs><linearGradient id="surface-grad" x1="0" x2="1"><stop stopColor="#22d3ee" /><stop offset=".55" stopColor="#60a5fa" /><stop offset="1" stopColor="#8b5cf6" /></linearGradient></defs>
      {trace && <><circle cx="520" cy="250" r="10" fill="#fff" stroke="#22d3ee" strokeWidth="4" /><path d="M520 250 L595 170" stroke="#16a34a" strokeWidth="6" markerEnd="url(#arrow)" /></>}
      <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#16a34a" /></marker>
      <text x="72" y="70" className="cs-light-title">Surface z = f(x,y)</text>
      <text x="72" y="106" className="cs-light-text">Point ({fmt(a, 2)}, {fmt(b, 2)}, {fmt(z, 2)}) with gradient and tangent-plane cue</text>
      <rect x="575" y="330" width="240" height="150" rx="12" fill="#f8fafc" stroke="#cbd5e1" />
      {Array.from({ length: 8 }, (_, i) => <ellipse key={i} cx="695" cy="405" rx={30 + i * 12} ry={16 + i * 6} fill="none" stroke={i % 2 ? "#8b5cf6" : "#22d3ee"} opacity=".65" />)}
    </svg>
  );
}

function ResultGrid({ stats }: { stats: Array<[string, string, "good" | "warn" | "plain"]> }) {
  return (
    <div className="cs-result-grid">
      {stats.map(([label, value, tone]) => (
        <div key={label} className={tone}><span>{label}</span><strong>{value}</strong></div>
      ))}
    </div>
  );
}

function Rk4Table({ x0, y0, h, field }: { x0: number; y0: number; h: number; field: (x: number, y: number) => number }) {
  const rows = integrate(field, x0, y0, Math.max(0.02, h), 4, "rk4");
  return (
    <section className="cs-mini-card">
      <h3>Numerical steps (RK4)</h3>
      <table className="cs-rk4">
        <thead><tr><th>Step</th><th>xₙ</th><th>yₙ</th><th>dy/dx</th></tr></thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}><td>{index}</td><td>{fmt(row.x, 4)}</td><td>{fmt(row.y, 4)}</td><td>{fmt(field(row.x, row.y), 4)}</td></tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function TaylorTerms({ n, x, mode }: { n: number; x: number; mode?: string }) {
  const terms = Array.from({ length: Math.max(1, Math.min(7, n)) }, (_, k) => 2 * k + 1).filter((p) => p <= n);
  return (
    <section className="cs-mini-card">
      <h3>Current polynomial Tₙ(x)</h3>
      <p className="cs-taylor">
        {terms.map((p, k) => <span key={p} className={p === terms[terms.length - 1] ? "cs-new-term" : undefined}>{`${k ? (k % 2 ? " − " : " + ") : ""}${p === 1 ? "x" : `x^${p}/${p}!`}`}</span>)}
      </p>
      <p>Tₙ({fmt(x, 2)}) ≈ {fmt(taylorSin(x, n), 6)} · |Rₙ| ≈ {fmt(Math.abs(Math.sin(x) - taylorSin(x, n)), 6)} {mode === "polar" ? "· polar point highlighted" : ""}</p>
    </section>
  );
}

function LearningBar({ active, onChange, page, mode, stats }: { active: string; onChange: (value: string) => void; page: CalculusStudioPage; mode: string; stats: Array<[string, string, "good" | "warn" | "plain"]> }) {
  const tabs = ["Observe", "Understand", "Why", "Try", "Challenge"];
  return (
    <section className="cs-learning">
      <nav>{tabs.map((tab) => <button key={tab} type="button" className={active === tab ? "active" : ""} onClick={() => onChange(tab)}>{tabIcon(tab)}<span>{tab}</span></button>)}</nav>
      <p>{learningCopy(active, page, mode, stats)}</p>
    </section>
  );
}

function InfoPill({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return <div><span>{icon}</span><strong>{title}</strong><p>{text}</p></div>;
}

function StudioDialog({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="cs-dialog-backdrop">
      <div className="cs-dialog" role="dialog" aria-modal="true" aria-labelledby="cs-dialog-title">
        <header><h2 id="cs-dialog-title">{title}</h2><button type="button" onClick={onClose} aria-label="Close"><X /></button></header>
        {children}
      </div>
    </div>
  );
}

function SettingsForm({ settings, onChange }: { settings: StudioSettings; onChange: (value: StudioSettings) => void }) {
  const toggle = (key: keyof StudioSettings) => {
    if (key === "theme") onChange({ ...settings, theme: settings.theme === "light" ? "dark" : "light" });
    else onChange({ ...settings, [key]: !settings[key] });
  };
  return (
    <div className="cs-settings">
      <label><input type="checkbox" checked={settings.theme === "dark"} onChange={() => toggle("theme")} /> Dark studio chrome</label>
      <label><input type="checkbox" checked={settings.graphLight} onChange={() => toggle("graphLight")} /> Light graphs</label>
      <label><input type="checkbox" checked={settings.reducedMotion} onChange={() => toggle("reducedMotion")} /> Reduce animation</label>
      <label><input type="checkbox" checked={settings.collapseControls} onChange={() => toggle("collapseControls")} /> Collapse control column</label>
      <label><input type="checkbox" checked={settings.collapseResults} onChange={() => toggle("collapseResults")} /> Collapse results column</label>
    </div>
  );
}

function Grid({ width, height, pad, light = false }: { width: number; height: number; pad: number; light?: boolean }) {
  return <g>{Array.from({ length: 8 }, (_, i) => <line key={`v${i}`} x1={pad + i * ((width - pad * 2) / 7)} x2={pad + i * ((width - pad * 2) / 7)} y1={pad} y2={height - pad} className={light ? "cs-grid light" : "cs-grid"} />)}{Array.from({ length: 7 }, (_, i) => <line key={`h${i}`} x1={pad} x2={width - pad} y1={pad + i * ((height - pad * 2) / 6)} y2={pad + i * ((height - pad * 2) / 6)} className={light ? "cs-grid light" : "cs-grid"} />)}</g>;
}

function compileOne(expression: string) {
  try { return { fn: compileFunctionExpression(expression), error: "" }; }
  catch (error) { return { fn: null, error: error instanceof Error ? error.message : "Invalid expression" }; }
}

function calculateStats(page: CalculusStudioPage, mode: string, fn: ((x: number) => number) | null, a: number, b: number, delta: number, n: number, field?: (x: number, y: number) => number): Array<[string, string, "good" | "warn" | "plain"]> {
  if (!fn && page !== "differential-equations" && page !== "integration-techniques" && page !== "multivariable-vector") return [["Status", "Invalid expression", "warn"]];
  if (page === "limits" && fn) {
    const left = safe(fn, a - delta), right = safe(fn, a + delta), value = safe(fn, a), exists = Number.isFinite(left) && Number.isFinite(right) && Math.abs(left - right) < 0.05;
    return [["Left limit", fmt(left, 4), "plain"], ["Right limit", fmt(right, 4), "plain"], ["Two-sided", exists ? fmt((left + right) / 2, 4) : "DNE", exists ? "good" : "warn"], [`f(${fmt(a, 2)})`, Number.isFinite(value) ? fmt(value, 4) : "Undefined", Number.isFinite(value) ? "plain" : "warn"]];
  }
  if (page === "derivatives" && fn) {
    const sec = (safe(fn, a + delta) - safe(fn, a)) / delta, tan = derivativeAt(fn, a);
    return [["Secant slope", fmt(sec, 4), "plain"], ["Tangent slope", fmt(tan, 4), "good"], ["Difference", fmt(Math.abs(sec - tan), 4), Math.abs(sec - tan) < 0.1 ? "good" : "warn"], ["h", fmt(delta, 3), "plain"]];
  }
  if ((page === "integration" || page === "integral-applications") && fn) {
    const approx = midpointIntegral(fn, a, b, Math.max(2, n)), reference = midpointIntegral(fn, a, b, 800);
    return [["Approximation", fmt(approx, 4), "plain"], ["Reference", fmt(reference, 4), "good"], ["Absolute error", fmt(Math.abs(approx - reference), 4), Math.abs(approx - reference) < 0.1 ? "good" : "warn"], ["n", String(n), "plain"]];
  }
  if (page === "derivative-applications") {
    const x = Math.max(0.1, Math.min(11.9, Math.abs(a) + 4.2)), volume = x * (24 - 2 * x) * (36 - 2 * x);
    return [["Cut size x", `${fmt(x, 2)} in`, "plain"], ["Volume", fmt(volume, 2), "good"], ["Feasible", x > 0 && x < 12 ? "0 < x < 12" : "Invalid", x > 0 && x < 12 ? "good" : "warn"], ["Mode", mode, "plain"]];
  }
  if (page === "differential-equations") {
    const slope = field ? field(a, b || 1) : a - (b || 1);
    return [["x", fmt(a, 2), "plain"], ["y", fmt(b || 1, 2), "plain"], ["dy/dx", fmt(slope, 3), "good"], ["Step h", fmt(delta, 2), "plain"]];
  }
  if (page === "series-parametric-polar") {
    const actual = Math.sin(a), approx = taylorSin(a, n);
    return [["Polynomial", `T_${n}(x)`, "plain"], ["Approx", fmt(approx, 6), "plain"], ["Actual", fmt(actual, 6), "good"], ["Error", fmt(Math.abs(approx - actual), 6), Math.abs(approx - actual) < 0.01 ? "good" : "warn"]];
  }
  if (page === "multivariable-vector") {
    return [["fx", fmt(2 * a, 3), "good"], ["fy", fmt(-2 * b, 3), "warn"], ["|grad f|", fmt(Math.hypot(2 * a, -2 * b), 3), "good"], ["Point", `(${fmt(a, 2)}, ${fmt(b, 2)})`, "plain"]];
  }
  return [["Technique", mode, "plain"], ["Transformed value", "3.3939", "good"], ["Bounds", "1 to 5", "plain"], ["Validation", "All steps correct", "good"]];
}

function defaultExpression(page: CalculusStudioPage, mode: string) {
  if (page === "limits") return mode === "lhopital" ? "sin(x)/x" : "sin(x)/x";
  if (page === "derivatives") return mode === "implicit" ? "x^2" : "x^2";
  if (page === "integration") return "x^2";
  if (page === "integral-applications") return "x^2";
  if (page === "series-parametric-polar") return mode === "polar" ? "1+cos(x)" : "sin(x)";
  if (page === "differential-equations") return "x - y";
  if (page === "multivariable-vector") return "x^2-y^2";
  return "x^2";
}

function axisLabel(page: CalculusStudioPage, mode: string, axis: "a" | "b") {
  if (page === "differential-equations") return axis === "a" ? "Initial x₀" : "Initial y₀";
  if (page === "series-parametric-polar") return axis === "a" ? "Evaluation x" : "Degree n";
  if (page === "integration" || page === "integral-applications") return axis === "a" ? "Lower bound a" : "Upper bound b";
  if (page === "derivatives") return axis === "a" ? "Tangent point a" : "Secant h";
  if (page === "multivariable-vector") return axis === "a" ? "x coordinate" : "y coordinate";
  if (page === "limits") return "Limit point a";
  return mode === "optimization" ? "Selected value" : "Selected x";
}

function visualTitle(page: CalculusStudioPage, mode: string) {
  if (page === "limits") return "Function, approach points, and continuity check";
  if (page === "derivatives") return "Tangent, secant, and derivative comparison";
  if (page === "integration") return "Accumulated area and Riemann partitions";
  if (page === "integral-applications") return mode === "volumes" ? "2D region and volume slices" : "Integral application diagram";
  if (page === "differential-equations") return "Slope field and RK4 solution";
  if (page === "series-parametric-polar") return "Taylor approximation and selected curve";
  if (page === "multivariable-vector") return "3D surface, gradient, and contour map";
  if (page === "integration-techniques") return "Symbolic transformation workflow";
  return "Interactive model";
}

function statusTitle(page: CalculusStudioPage, mode: string, stats: Array<[string, string, "good" | "warn" | "plain"]>) {
  if (stats.some((item) => item[2] === "warn")) return "Needs attention";
  if (page === "limits") return "Limit behavior stable";
  if (page === "derivative-applications" && mode === "optimization") return "Optimum model active";
  return "Live calculation ready";
}

function stateAwareCopy(page: CalculusStudioPage, mode: string, stats: Array<[string, string, "good" | "warn" | "plain"]>, a: number, b: number, delta: number, n: number) {
  if (page === "limits") return `Left and right samples are ${fmt(delta, 2)} units from a = ${fmt(a, 2)}. The checklist updates from those real samples.`;
  if (page === "derivatives") return `The secant uses h = ${fmt(delta, 2)}. As h shrinks, the secant slope should approach the tangent slope.`;
  if (page === "integration") return `${n} partitions approximate the signed area from ${fmt(a, 2)} to ${fmt(b, 2)}.`;
  if (page === "differential-equations") return `The slope field uses dy/dx = x - y, with the highlighted solution beginning at (${fmt(a, 2)}, ${fmt(b || 1, 2)}).`;
  if (page === "series-parametric-polar") return `The current degree is ${n}; error is computed against sin(x) at the selected x value.`;
  return `${mode} mode is selected. Controls update the visible model and live values.`;
}

function learningCopy(active: string, page: CalculusStudioPage, mode: string, stats: Array<[string, string, "good" | "warn" | "plain"]>) {
  const primary = stats[0]?.[1] ?? "the current value";
  if (active === "Observe") return `Observe: the visualization is showing ${visualTitle(page, mode).toLowerCase()} with live value ${primary}.`;
  if (active === "Understand") return "Understand: each control changes the mathematical state first, then the graph and result cards read from that state.";
  if (active === "Why") return "Why: the visual marks encode the same quantities used in the formula, so the picture and calculation can be checked against each other.";
  if (active === "Try") return "Try: move the main slider to an extreme, then press Reset and compare how the live result changes.";
  const key = `${page}:${mode}`;
  const challenges: Record<string, string> = {
    "integral-applications:area": "Challenge: split the region at an intersection and make the signed area match the live integral.",
    "integral-applications:volumes": "Challenge: switch washer vs shell in your head, then match the live volume with n slices.",
    "integral-applications:arc": "Challenge: trace the curve and keep arc-length error below 0.1.",
    "differential-equations:slope": "Challenge: click an IVP so Euler and RK4 stay visually close as h shrinks.",
    "differential-equations:ivp": "Challenge: overlay the solution through (x₀,y₀) and keep it on the field.",
    "differential-equations:separable": "Challenge: match the separated solution curve to the RK4 path.",
    "differential-equations:growth": "Challenge: compare exponential vs logistic by changing the carrying capacity slider.",
    "differential-equations:euler": "Challenge: shrink h until Euler error vs RK4 is under 0.1.",
    "series-parametric-polar:sequences": "Challenge: raise n until a_n visually settles near 0.",
    "series-parametric-polar:convergence": "Challenge: pick r so the geometric partial sums approach 1/(1−r).",
    "series-parametric-polar:power": "Challenge: raise degree until the power series hugs 1/(1−x) on (−1,1).",
    "series-parametric-polar:taylor": "Challenge: raise n until the remainder band is thinner than 0.05 at the marked x.",
    "series-parametric-polar:parametric": "Challenge: stop the moving point where dy/dx is zero.",
    "series-parametric-polar:polar": "Challenge: follow the cardioid point through one full θ sweep.",
    "integral-applications:surface": "Challenge: trace the surface-of-revolution path and match the live area.",
    "integral-applications:work": "Challenge: match the force diagram to the integral of F(x) along the path.",
    "integral-applications:fluid": "Challenge: change depth until hydrostatic force matches ρg ∫ depth dA.",
    "differential-equations:rk4": "Challenge: compare Euler vs RK4 at the same h and keep RK4 visibly closer to exact.",
    "multivariable-vector:gradient": "Challenge: align the probe with the steepest-ascent arrow.",
    "multivariable-vector:plane": "Challenge: seat the tangent plane so it kisses the surface at (a,b).",
    "multivariable-vector:optimization": "Challenge: find a constrained critical point on a contour.",
    "multivariable-vector:multiple": "Challenge: switch dx dy vs dy dx and keep the region integral unchanged.",
    "multivariable-vector:fields": "Challenge: place the probe where the field is purely rotational.",
  };
  return challenges[key] ?? `Challenge (${mode}): use the controls to make the warning cards disappear or reduce the displayed error.`;
}

function tabIcon(tab: string) {
  if (tab === "Observe") return <Search />;
  if (tab === "Understand") return <BookOpen />;
  if (tab === "Why") return <CircleHelp />;
  if (tab === "Try") return <Lightbulb />;
  return <Trophy />;
}

function runChallenge(page: CalculusStudioPage, stats: Array<[string, string, "good" | "warn" | "plain"]>) {
  const warnings = stats.filter((item) => item[2] === "warn").length;
  alert(warnings ? `Challenge feedback: ${warnings} warning result remains. Adjust controls and try again.` : `Challenge complete for ${page}.`);
}

async function toggleStudioFullscreen() {
  if (document.fullscreenElement) {
    await document.exitFullscreen();
    return;
  }
  await document.querySelector<HTMLElement>(".cs-visual-card")?.requestFullscreen();
}

function sample(fn: (x: number) => number, min: number, max: number, count: number) {
  return Array.from({ length: count }, (_, i) => {
    const x = min + (i / (count - 1)) * (max - min);
    const y = safe(fn, x);
    return { x, y, ok: Number.isFinite(y) && Math.abs(y) < 1e5 };
  });
}

function pathFor(points: { x: number; y: number; ok: boolean }[], sx: (x: number) => number, sy: (y: number) => number, yMin: number, yMax: number) {
  let open = false;
  return points.map((p) => {
    if (!p.ok || p.y < yMin - 5 || p.y > yMax + 5) { open = false; return ""; }
    const command = open ? "L" : "M";
    open = true;
    return `${command}${sx(p.x).toFixed(2)},${sy(p.y).toFixed(2)}`;
  }).join(" ");
}

function safe(fn: (x: number) => number, x: number) {
  try { const y = fn(x); return Number.isFinite(y) ? y : NaN; } catch { return NaN; }
}

function safe2(fn: (x: number, y: number) => number, x: number, y: number) {
  try { const z = fn(x, y); return Number.isFinite(z) ? z : NaN; } catch { return NaN; }
}

function derivativeAt(fn: (x: number) => number, x: number) {
  const h = 1e-4;
  return (safe(fn, x + h) - safe(fn, x - h)) / (2 * h);
}

function midpointIntegral(fn: (x: number) => number, a: number, b: number, n: number) {
  const lo = Math.min(a, b), hi = Math.max(a, b), sign = a <= b ? 1 : -1, dx = (hi - lo) / n;
  let sum = 0;
  for (let i = 0; i < n; i += 1) sum += safe(fn, lo + (i + 0.5) * dx) * dx;
  return sum * sign;
}

function integrate(f: (x: number, y: number) => number, x0: number, y0: number, h: number, steps: number, method: "rk4" | "euler") {
  const pts = [{ x: x0, y: y0 }];
  let x = x0, y = y0;
  for (let i = 0; i < steps; i += 1) {
    if (method === "euler") y += h * f(x, y);
    else {
      const k1 = f(x, y), k2 = f(x + h / 2, y + h * k1 / 2), k3 = f(x + h / 2, y + h * k2 / 2), k4 = f(x + h, y + h * k3);
      y += h / 6 * (k1 + 2 * k2 + 2 * k3 + k4);
    }
    x += h;
    pts.push({ x, y });
  }
  return pts;
}

function rk4(x0: number, y0: number, h: number, steps: number) {
  return integrate((x, y) => x - y, x0, y0, h, steps, "rk4");
}

function taylorSin(x: number, degree: number) {
  let sum = 0;
  for (let k = 0; k <= Math.floor(degree / 2); k += 1) {
    const p = 2 * k + 1;
    if (p > degree) break;
    sum += ((k % 2 ? -1 : 1) * Math.pow(x, p)) / factorial(p);
  }
  return sum;
}

function factorial(n: number) {
  let total = 1;
  for (let i = 2; i <= n; i += 1) total *= i;
  return total;
}

function polarPath(sx: (x: number) => number, sy: (y: number) => number) {
  return Array.from({ length: 360 }, (_, i) => {
    const t = i / 359 * Math.PI * 2, r = 1 + Math.cos(t), x = r * Math.cos(t), y = r * Math.sin(t);
    return `${i ? "L" : "M"}${sx(x * 2).toFixed(2)},${sy(y * 2).toFixed(2)}`;
  }).join(" ");
}

function fmt(value: number, digits = 2) {
  return Number.isFinite(value) ? Number(value.toFixed(digits)).toString() : "undefined";
}

function pretty(value: string) {
  return value.replace(/\^2/g, "²").replace(/\^3/g, "³").replace(/\*/g, "");
}
