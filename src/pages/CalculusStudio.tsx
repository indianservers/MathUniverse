import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  BarChart3,
  BookOpen,
  Box,
  ChevronRight,
  CircleHelp,
  Cuboid,
  Expand,
  FunctionSquare,
  Grid3X3,
  HelpCircle,
  Home,
  Lightbulb,
  Menu,
  Moon,
  Pause,
  Play,
  RotateCcw,
  Search,
  Settings,
  Sigma,
  Sun,
  Target,
  Trophy,
  Waves,
  X,
} from "lucide-react";
import { compileFunctionExpression, compileTwoVariableExpression } from "../utils/functionParser";
import "./CalculusStudio.css";

export type CalculusStudioPage =
  | "home"
  | "limits"
  | "derivatives"
  | "derivative-applications"
  | "integration"
  | "integration-techniques"
  | "integral-applications"
  | "differential-equations"
  | "series-parametric-polar"
  | "multivariable-vector";

type LabMode = {
  id: string;
  label: string;
};

const studioRoutes: Record<CalculusStudioPage, string> = {
  home: "/calculus",
  limits: "/calculus/limits",
  derivatives: "/calculus/derivatives",
  "derivative-applications": "/calculus/derivative-applications",
  integration: "/calculus/integration",
  "integration-techniques": "/calculus/integration-techniques",
  "integral-applications": "/calculus/integral-applications",
  "differential-equations": "/calculus/differential-equations",
  "series-parametric-polar": "/calculus/series-parametric-polar",
  "multivariable-vector": "/calculus/multivariable-vector",
};

const navItems = [
  { page: "home", label: "Studio Home", icon: Home },
  { page: "limits", label: "Limits", icon: Sigma },
  { page: "derivatives", label: "Derivatives", icon: FunctionSquare },
  { page: "derivative-applications", label: "Derivative Applications", icon: BarChart3 },
  { page: "integration", label: "Integration", icon: Waves },
  { page: "integration-techniques", label: "Integration Techniques", icon: RotateCcw },
  { page: "integral-applications", label: "Integral Applications", icon: Cuboid },
  { page: "differential-equations", label: "Differential Equations", icon: Activity },
  { page: "series-parametric-polar", label: "Series / Parametric / Polar", icon: Target },
  { page: "multivariable-vector", label: "Multivariable / Vector", icon: Box },
] satisfies Array<{ page: CalculusStudioPage; label: string; icon: typeof Home }>;

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
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const activePage = pageMeta[page] ? page : "home";

  useEffect(() => setDrawerOpen(false), [location.pathname]);
  useEffect(() => {
    if (activePage !== "home") localStorage.setItem("calculus-studio:last-route", location.pathname + location.search);
  }, [activePage, location.pathname, location.search]);
  useEffect(() => {
    if (!drawerOpen) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [drawerOpen]);

  return (
    <main className={`cs-shell ${theme === "dark" ? "cs-dark" : ""}`}>
      {drawerOpen && <button className="cs-backdrop" aria-label="Close Calculus Studio menu" onClick={() => setDrawerOpen(false)} />}
      <StudioSidebar page={activePage} collapsed={collapsed} open={drawerOpen} onCollapse={() => setCollapsed((value) => !value)} onClose={() => setDrawerOpen(false)} />
      <section className="cs-page">
        <StudioHeader page={activePage} theme={theme} onTheme={() => setTheme((value) => value === "light" ? "dark" : "light")} onMenu={() => setDrawerOpen(true)} />
        {activePage === "home" ? <StudioHome /> : <StudioLab page={activePage} />}
      </section>
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
      <nav>
        <Link className="cs-nav-link" to="/" title="Main application" onClick={onClose}>
          <Home /><span>Main</span>
        </Link>
        {navItems.map(({ page: itemPage, label, icon: Icon }) => (
          <Link
            className={`cs-nav-link ${page === itemPage ? "active" : ""}`}
            to={studioRoutes[itemPage]}
            key={itemPage}
            title={label}
            aria-current={page === itemPage ? "page" : undefined}
            onClick={onClose}
          >
            <Icon /><span>{label}</span>
          </Link>
        ))}
      </nav>
      <button className="cs-collapse" type="button" onClick={onCollapse} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} title={collapsed ? "Expand" : "Collapse"}>
        <ArrowLeft />
      </button>
    </aside>
  );
}

function StudioHeader({ page, theme, onTheme, onMenu }: { page: CalculusStudioPage; theme: "light" | "dark"; onTheme: () => void; onMenu: () => void }) {
  const meta = pageMeta[page];
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const results = useMemo(() => navItems.filter((item) => item.label.toLowerCase().includes(query.trim().toLowerCase())), [query]);
  const submit = () => {
    const target = results[0];
    if (target) navigate(studioRoutes[target.page]);
  };
  return (
    <header className="cs-header">
      <button className="cs-menu" type="button" onClick={onMenu} aria-label="Open Calculus Studio menu"><Menu /></button>
      <div className="cs-title">
        <nav aria-label="Breadcrumb"><Link to="/">Main</Link><ChevronRight /><Link to="/calculus">Calculus Studio</Link>{page !== "home" && <><ChevronRight /><span>{meta.title.replace(" Studio", "")}</span></>}</nav>
        <h1>{meta.title}</h1>
        <p>{meta.subtitle}</p>
      </div>
      <div className="cs-search-wrap">
        <label className="cs-search">
          <Search />
          <input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === "Enter" && submit()} placeholder="Search formulas, topics, or experiments..." />
          <kbd>Ctrl+K</kbd>
        </label>
        {query.trim() && (
          <div className="cs-search-results">
            {results.map((item) => <button key={item.page} type="button" onClick={() => navigate(studioRoutes[item.page])}>{item.label}</button>)}
            {!results.length && <span>No calculus studio result</span>}
          </div>
        )}
      </div>
      <div className="cs-header-actions">
        <button type="button" onClick={onTheme} title="Toggle theme" aria-label="Toggle theme">{theme === "light" ? <Sun /> : <Moon />}</button>
        <button type="button" onClick={() => alert("Shortcuts: use Tab to move, Enter to activate, Escape to close the mobile menu.")} title="Help" aria-label="Help"><HelpCircle /></button>
        <button type="button" onClick={() => alert("Settings are scoped to this studio theme and layout.")} title="Settings" aria-label="Settings"><Settings /></button>
      </div>
    </header>
  );
}

function StudioHome() {
  const navigate = useNavigate();
  const [challengeAnswer, setChallengeAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const last = typeof window !== "undefined" ? localStorage.getItem("calculus-studio:last-route") : null;
  const cards = [
    { page: "limits", title: "Limits", note: "Explore behavior near a point.", tag: "epsilon and one-sided" },
    { page: "derivatives", title: "Derivatives", note: "Visualize slopes and tangents.", tag: "instantaneous change" },
    { page: "integration", title: "Integrals", note: "Accumulate area under curves.", tag: "area and accumulation" },
    { page: "differential-equations", title: "Differential Equations", note: "Slope fields and solution curves.", tag: "dy/dx=f(x,y)" },
    { page: "series-parametric-polar", title: "Approximations", note: "Taylor, sequences, polar and parametric motion.", tag: "series and curves" },
    { page: "multivariable-vector", title: "Multivariable", note: "Surfaces, gradients and vector fields.", tag: "gradients and fields" },
  ] satisfies Array<{ page: CalculusStudioPage; title: string; note: string; tag: string }>;
  return (
    <div className="cs-home">
      <section className="cs-card cs-journey" aria-labelledby="journey-title">
        <h2 id="journey-title">The Calculus Journey</h2>
        <div className="cs-map">
          <JourneyNode title="Limits" page="limits" />
          <span className="cs-arrow">Instantaneous change</span>
          <JourneyNode title="Derivatives" page="derivatives" />
          <span className="cs-arrow">Accumulation of change</span>
          <JourneyNode title="Integrals" page="integration" />
          <JourneyNode title="Differential Equations" page="differential-equations" />
          <JourneyNode title="Advanced Calculus" page="multivariable-vector" />
        </div>
      </section>
      <aside className="cs-home-side">
        <section className="cs-card">
          <h2>Continue experiment</h2>
          <MiniPreview kind="slope" />
          <button className="cs-primary" type="button" onClick={() => navigate(last ?? "/calculus/limits")}>Resume</button>
        </section>
        <section className="cs-card">
          <h2>Daily visual challenge</h2>
          <p>Predict the limit of (x^2 - 4) / (x - 2) as x approaches 2.</p>
          <input value={challengeAnswer} onChange={(event) => setChallengeAnswer(event.target.value)} placeholder="Enter the limit" />
          <button type="button" onClick={() => setFeedback(Math.abs(Number(challengeAnswer) - 4) < 0.001 ? "Correct. Factor and cancel to get x + 2." : "Try factoring x^2 - 4 first.")}>Check</button>
          {feedback && <strong className="cs-feedback">{feedback}</strong>}
        </section>
      </aside>
      <section className="cs-card cs-launch">
        <h2>Launch an experiment</h2>
        <p>Interactive visual labs to build intuition and master calculus.</p>
        <div className="cs-launch-grid">
          {cards.map((card, index) => (
            <button key={card.page} type="button" className="cs-launch-card" onClick={() => navigate(studioRoutes[card.page])}>
              <span>{index + 1}</span>
              <strong>{card.title}</strong>
              <small>{card.note}</small>
              <MiniPreview kind={card.page} />
              <b>{card.tag}</b>
            </button>
          ))}
        </div>
      </section>
      <section className="cs-card cs-why">
        <InfoPill icon={<Search />} title="See the math" text="Live visualizations update with the selected parameters." />
        <InfoPill icon={<Settings />} title="Explore freely" text="Adjust variables, inspect patterns, and test ideas." />
        <InfoPill icon={<Trophy />} title="Master concepts" text="Connect visual changes with symbolic statements." />
      </section>
    </div>
  );
}

function JourneyNode({ title, page }: { title: string; page: CalculusStudioPage }) {
  return <Link className="cs-journey-node" to={studioRoutes[page]}><strong>{title}</strong><MiniPreview kind={page} /></Link>;
}

function StudioLab({ page }: { page: Exclude<CalculusStudioPage, "home"> }) {
  const meta = pageMeta[page];
  const [params, setParams] = useSearchParams();
  const initialMode = params.get("mode") ?? meta.modes[0]?.id;
  const [mode, setMode] = useState(meta.modes.some((item) => item.id === initialMode) ? initialMode : meta.modes[0].id);
  const chooseMode = (next: string) => {
    setMode(next);
    const sp = new URLSearchParams(params);
    sp.set("mode", next);
    setParams(sp, { replace: true });
  };
  return (
    <div className="cs-lab-page">
      <nav className="cs-tabs" aria-label={`${meta.title} modes`}>
        {meta.modes.map((item) => <button key={item.id} type="button" className={mode === item.id ? "active" : ""} aria-selected={mode === item.id} onClick={() => chooseMode(item.id)}>{item.label}</button>)}
      </nav>
      <InteractiveLab page={page} mode={mode} />
    </div>
  );
}

function InteractiveLab({ page, mode }: { page: Exclude<CalculusStudioPage, "home">; mode: string }) {
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
  const compiled = useMemo(() => compileOne(expression), [expression]);
  const surface = useMemo(() => {
    try { return { fn: compileTwoVariableExpression(expression), error: "" }; }
    catch (error) { return { fn: null, error: error instanceof Error ? error.message : "Invalid surface" }; }
  }, [expression]);

  useEffect(() => {
    setDraft(defaultExpression(page, mode));
    setExpression(defaultExpression(page, mode));
  }, [page, mode]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      if (page === "derivatives") setDelta((value) => value <= 0.04 ? 1 : Math.max(0.02, value - 0.025 * speed));
      else if (page === "integration" || page === "integral-applications") setN((value) => value >= 80 ? 4 : value + Math.max(1, Math.round(speed)));
      else if (page === "series-parametric-polar") setN((value) => value >= 12 ? 1 : value + 1);
      else setA((value) => value >= 3 ? -3 : Number((value + 0.05 * speed).toFixed(2)));
    }, 80);
    return () => window.clearInterval(id);
  }, [page, playing, speed]);

  const stats = useMemo(() => calculateStats(page, mode, compiled.fn, a, b, delta, n), [page, mode, compiled.fn, a, b, delta, n]);
  const reset = () => {
    setA(page === "integration" || page === "integral-applications" ? -2 : page === "derivatives" ? 1 : 0);
    setB(page === "integration" || page === "integral-applications" ? 3 : 2);
    setDelta(page === "derivatives" ? 0.5 : 0.1);
    setN(page === "series-parametric-polar" ? 7 : 12);
    setPlaying(false);
    setTrace(true);
    setShowAux(true);
  };

  return (
    <>
      <div className="cs-workspace">
        <aside className="cs-card cs-controls">
          <h2><span>1</span> Controls</h2>
          <label>Function or model<input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => event.key === "Enter" && setExpression(draft)} /></label>
          <button className="cs-primary" type="button" onClick={() => setExpression(draft)}>Plot</button>
          {(compiled.error && page !== "multivariable-vector") && <p className="cs-error">{compiled.error}</p>}
          {(surface.error && page === "multivariable-vector") && <p className="cs-error">{surface.error}</p>}
          <ExampleChips page={page} mode={mode} onPick={(value) => { setDraft(value); setExpression(value); }} />
          <Range label={axisLabel(page, mode, "a")} value={a} min={-5} max={5} step={0.05} onChange={setA} />
          {(page === "integration" || page === "integral-applications") && <Range label={axisLabel(page, mode, "b")} value={b} min={-5} max={5} step={0.05} onChange={setB} />}
          {(page === "derivatives" || page === "limits" || page === "differential-equations") && <Range label={page === "derivatives" ? "Secant distance h" : "Approach / step size"} value={delta} min={0.02} max={2} step={0.02} onChange={setDelta} />}
          {(page === "integration" || page === "integral-applications" || page === "series-parametric-polar") && <Range label={page === "series-parametric-polar" ? "Degree n" : "Partitions / slices n"} value={n} min={2} max={page === "series-parametric-polar" ? 12 : 80} step={1} onChange={(value) => setN(Math.round(value))} />}
          <div className="cs-toggle-row"><label><input type="checkbox" checked={trace} onChange={(event) => setTrace(event.target.checked)} /> Trace</label><label><input type="checkbox" checked={showAux} onChange={(event) => setShowAux(event.target.checked)} /> Guides</label></div>
          <div className="cs-player">
            <button type="button" onClick={reset}><RotateCcw /></button>
            <button className="cs-primary" type="button" onClick={() => setPlaying((value) => !value)}>{playing ? <Pause /> : <Play />}</button>
            <button type="button" onClick={() => page === "derivatives" ? setDelta((value) => Math.max(0.02, value - 0.05)) : setA((value) => Math.min(5, value + 0.1))}>Step</button>
            <select value={speed} onChange={(event) => setSpeed(Number(event.target.value))} aria-label="Animation speed"><option value={0.5}>0.5x</option><option value={1}>1x</option><option value={2}>2x</option></select>
          </div>
        </aside>
        <section className="cs-card cs-visual-card">
          <div className="cs-card-top"><h2>{visualTitle(page, mode)}</h2><div><button type="button" onClick={() => setShowAux((value) => !value)}><Grid3X3 /> Guides</button><button type="button" onClick={() => void toggleStudioFullscreen()}><Expand /></button></div></div>
          {page === "multivariable-vector"
            ? <SurfaceLab fn={surface.fn} a={a} b={b} trace={trace} showAux={showAux} />
            : page === "differential-equations"
              ? <SlopeFieldLab a={a} b={b} h={delta} showAux={showAux} />
              : page === "series-parametric-polar"
                ? <SeriesLab mode={mode} n={n} a={a} trace={trace} showAux={showAux} />
                : page === "derivative-applications"
                  ? <ApplicationsLab mode={mode} width={24} length={36} x={Math.max(0.1, Math.min(11.9, Math.abs(a) + 4.2))} />
                  : page === "integration-techniques"
                    ? <TechniqueLab mode={mode} />
                    : <FunctionLab page={page} mode={mode} fn={compiled.fn} a={a} b={b} delta={delta} n={n} trace={trace} showAux={showAux} />}
        </section>
        <aside className="cs-card cs-results">
          <h2><span>2</span> Live results</h2>
          <ResultGrid stats={stats} />
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

function FunctionLab({ page, mode, fn, a, b, delta, n, trace, showAux }: { page: CalculusStudioPage; mode: string; fn: ((x: number) => number) | null; a: number; b: number; delta: number; n: number; trace: boolean; showAux: boolean }) {
  const xMin = -4, xMax = 4, yMin = -3, yMax = 6, width = 900, height = 560, pad = 54;
  const sx = (x: number) => pad + (x - xMin) / (xMax - xMin) * (width - pad * 2);
  const sy = (y: number) => height - pad - (y - yMin) / (yMax - yMin) * (height - pad * 2);
  const samples = useMemo(() => fn ? sample(fn, xMin, xMax, 420) : [], [fn, xMin, xMax]);
  const fa = fn ? safe(fn, a) : NaN, fb = fn ? safe(fn, b) : NaN;
  const left = fn ? safe(fn, a - delta) : NaN, right = fn ? safe(fn, a + delta) : NaN;
  const derivative = fn ? derivativeAt(fn, a) : NaN;
  const integralBars = page === "integration" || page === "integral-applications";
  return (
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
  );
}

function SlopeFieldLab({ a, b, h, showAux }: { a: number; b: number; h: number; showAux: boolean }) {
  const width = 900, height = 560, pad = 54, xMin = -5, xMax = 5, yMin = -4, yMax = 4;
  const sx = (x: number) => pad + (x - xMin) / (xMax - xMin) * (width - pad * 2);
  const sy = (y: number) => height - pad - (y - yMin) / (yMax - yMin) * (height - pad * 2);
  const points = rk4(a, b || 1, Math.max(0.02, h), 50);
  return (
    <svg className="cs-graph cs-light-graph" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Slope field with solution curve">
      <rect width={width} height={height} rx="16" fill="#ffffff" />
      {showAux && <Grid width={width} height={height} pad={pad} light />}
      <line x1={pad} x2={width - pad} y1={sy(0)} y2={sy(0)} className="cs-axis light" /><line x1={sx(0)} x2={sx(0)} y1={pad} y2={height - pad} className="cs-axis light" />
      {Array.from({ length: 21 }, (_, ix) => Array.from({ length: 17 }, (_, iy) => {
        const x = -5 + ix * 0.5, y = -4 + iy * 0.5, m = x - y, len = 12, ang = Math.atan(m);
        return <line key={`${ix}-${iy}`} x1={sx(x) - Math.cos(ang) * len / 2} y1={sy(y) - Math.sin(ang) * len / 2} x2={sx(x) + Math.cos(ang) * len / 2} y2={sy(y) + Math.sin(ang) * len / 2} stroke="#10aee8" strokeWidth="1.5" />;
      }))}
      <path d={points.map((p, i) => `${i ? "L" : "M"}${sx(p.x)},${sy(p.y)}`).join(" ")} fill="none" stroke="#ff3b3b" strokeWidth="4" />
      <circle cx={sx(a)} cy={sy(b || 1)} r="8" fill="#f97316" stroke="#fff" strokeWidth="3" />
    </svg>
  );
}

function SeriesLab({ mode, n, a, trace, showAux }: { mode: string; n: number; a: number; trace: boolean; showAux: boolean }) {
  const width = 900, height = 560, pad = 54, xMin = -Math.PI * 2, xMax = Math.PI * 2, yMin = -1.6, yMax = 1.6;
  const sx = (x: number) => pad + (x - xMin) / (xMax - xMin) * (width - pad * 2);
  const sy = (y: number) => height - pad - (y - yMin) / (yMax - yMin) * (height - pad * 2);
  const actual = sample(Math.sin, xMin, xMax, 500);
  const approx = sample((x) => taylorSin(x, Math.max(1, n)), xMin, xMax, 500);
  const polar = mode === "polar";
  return (
    <svg className="cs-graph" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Series parametric or polar graph">
      <rect width={width} height={height} rx="16" fill="#071d35" />
      {showAux && <Grid width={width} height={height} pad={pad} />}
      <line x1={pad} x2={width - pad} y1={sy(0)} y2={sy(0)} className="cs-axis" /><line x1={sx(0)} x2={sx(0)} y1={pad} y2={height - pad} className="cs-axis" />
      {polar ? <path d={polarPath(sx, sy)} fill="none" stroke="#10c7e8" strokeWidth="4" /> : <><path d={pathFor(actual, sx, sy, yMin, yMax)} fill="none" stroke="#10c7e8" strokeWidth="4" /><path d={pathFor(approx, sx, sy, yMin, yMax)} fill="none" stroke="#8b5cf6" strokeWidth="3" strokeDasharray="8 6" /></>}
      {trace && <><line x1={sx(a)} x2={sx(a)} y1={pad} y2={height - pad} stroke="#8b5cf6" strokeDasharray="7 6" /><circle cx={sx(a)} cy={sy(taylorSin(a, n))} r="8" fill="#8b5cf6" /></>}
      <text x="72" y="42" className="cs-svg-title">{polar ? "Polar trace r = 1 + cos(theta)" : `Taylor polynomial T_${n}(x)`}</text>
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
  return (
    <div className="cs-technique">
      <div className="cs-step-card"><strong>Original Integral</strong><p>Integral from 0 to 2 of x sqrt(x^2 + 1) dx</p></div>
      <ChevronRight />
      <div className="cs-step-card"><strong>{mode === "parts" ? "Choose u and dv" : "Substitute"}</strong><p>{mode === "parts" ? "u = x, dv = sqrt(x^2+1) dx" : "u = x^2 + 1, du = 2x dx"}</p></div>
      <ChevronRight />
      <div className="cs-step-card active"><strong>Transformed Integral</strong><p>1/2 Integral from 1 to 5 of u^(1/2) du = 3.3939</p></div>
      <svg viewBox="0 0 900 300" role="img" aria-label="Substitution preserves area">
        <rect width="900" height="300" rx="14" fill="#ffffff" />
        <path d="M80 230 C180 140 260 100 380 80 L380 230 Z" fill="#f8c95a" opacity=".45" stroke="#0ea5e9" strokeWidth="3" />
        <path d="M520 230 C600 160 700 120 820 105 L820 230 Z" fill="#f8c95a" opacity=".45" stroke="#8b5cf6" strokeWidth="3" />
        <text x="100" y="55" className="cs-light-title">x-space</text>
        <text x="555" y="55" className="cs-light-title">u-space</text>
      </svg>
    </div>
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
  return <div className="cs-result-grid">{stats.map(([label, value, tone]) => <div key={label} className={tone}><span>{label}</span><strong>{value}</strong></div>)}</div>;
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

function MiniPreview({ kind }: { kind: string }) {
  return (
    <svg className="cs-mini-preview" viewBox="0 0 180 105" aria-hidden="true">
      <rect width="180" height="105" rx="10" fill="#f8fbff" />
      <line x1="20" x2="160" y1="78" y2="78" stroke="#94a3b8" />
      <line x1="35" x2="35" y1="18" y2="88" stroke="#94a3b8" />
      {kind.includes("differential") || kind === "slope" ? Array.from({ length: 32 }, (_, i) => <line key={i} x1={25 + (i % 8) * 18} y1={24 + Math.floor(i / 8) * 16} x2={33 + (i % 8) * 18} y2={32 + Math.floor(i / 8) * 16} stroke="#10b8e8" />)
        : kind.includes("multivariable") ? <path d="M20 75 C45 20 80 100 115 35 C135 8 155 50 170 25" fill="none" stroke="#8b5cf6" strokeWidth="5" />
          : <path d="M20 72 C45 22 73 58 92 50 C125 35 133 8 165 30" fill="none" stroke="#10b8e8" strokeWidth="3" />}
      {(kind.includes("integration") || kind.includes("integral")) && <path d="M45 78 L45 55 L65 47 L65 78 Z M70 78 L70 48 L90 45 L90 78 Z M95 78 L95 42 L115 32 L115 78 Z" fill="#f6c453" opacity=".55" />}
      {kind.includes("derivatives") && <line x1="60" x2="140" y1="80" y2="25" stroke="#f97316" strokeWidth="2" />}
      {kind.includes("limits") && <circle cx="92" cy="50" r="6" fill="#fff" stroke="#0f172a" strokeWidth="2" />}
    </svg>
  );
}

function Grid({ width, height, pad, light = false }: { width: number; height: number; pad: number; light?: boolean }) {
  return <g>{Array.from({ length: 8 }, (_, i) => <line key={`v${i}`} x1={pad + i * ((width - pad * 2) / 7)} x2={pad + i * ((width - pad * 2) / 7)} y1={pad} y2={height - pad} className={light ? "cs-grid light" : "cs-grid"} />)}{Array.from({ length: 7 }, (_, i) => <line key={`h${i}`} x1={pad} x2={width - pad} y1={pad + i * ((height - pad * 2) / 6)} y2={pad + i * ((height - pad * 2) / 6)} className={light ? "cs-grid light" : "cs-grid"} />)}</g>;
}

function compileOne(expression: string) {
  try { return { fn: compileFunctionExpression(expression), error: "" }; }
  catch (error) { return { fn: null, error: error instanceof Error ? error.message : "Invalid expression" }; }
}

function calculateStats(page: CalculusStudioPage, mode: string, fn: ((x: number) => number) | null, a: number, b: number, delta: number, n: number): Array<[string, string, "good" | "warn" | "plain"]> {
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
    const slope = a - (b || 1);
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
  if (page === "multivariable-vector") return "x^2-y^2";
  return "x^2";
}

function axisLabel(page: CalculusStudioPage, mode: string, axis: "a" | "b") {
  if (page === "limits") return "Limit point a";
  if (page === "derivatives") return "Tangent point a";
  if (page === "integration" || page === "integral-applications") return axis === "a" ? "Lower bound a" : "Upper bound b";
  if (page === "differential-equations") return axis === "a" ? "Initial x0" : "Initial y0";
  if (page === "multivariable-vector") return axis === "a" ? "x coordinate" : "y coordinate";
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
  return "Challenge: use the controls to make the warning cards disappear or reduce the displayed error.";
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

function rk4(x0: number, y0: number, h: number, steps: number) {
  const pts = [{ x: x0, y: y0 }];
  let x = x0, y = y0;
  const f = (xx: number, yy: number) => xx - yy;
  for (let i = 0; i < steps; i += 1) {
    const k1 = f(x, y), k2 = f(x + h / 2, y + h * k1 / 2), k3 = f(x + h / 2, y + h * k2 / 2), k4 = f(x + h, y + h * k3);
    y += h / 6 * (k1 + 2 * k2 + 2 * k3 + k4);
    x += h;
    pts.push({ x, y });
  }
  return pts;
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
