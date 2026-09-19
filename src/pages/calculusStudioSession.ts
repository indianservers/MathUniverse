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
  | "multivariable-vector"
  | "advanced";

export type StudioSettings = {
  theme: "light" | "dark";
  graphLight: boolean;
  reducedMotion: boolean;
  collapseControls: boolean;
  collapseResults: boolean;
};

export type LastExperiment = {
  route: string;
  title: string;
  note: string;
  kind: string;
  visitedAt: number;
};

export type SearchHit = {
  page: CalculusStudioPage;
  label: string;
  route: string;
  mode?: string;
  keywords: string;
  formula?: string;
};

export type ChallengeState = {
  day: string;
  streak: number;
  solved: boolean;
  guess: string;
};

const SETTINGS_KEY = "calculus-studio:settings";
const LAST_KEY = "calculus-studio:last-experiment";
const LAST_ROUTE_KEY = "calculus-studio:last-route";
const PROGRESS_KEY = "calculus-studio:progress";
const CHALLENGE_KEY = "calculus-studio:challenge";
const SAVED_KEY = "calculus-studio:saved-session";

export const studioRoutes: Record<CalculusStudioPage, string> = {
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
  advanced: "/calculus/advanced",
};

export const journeyTopics = [
  { id: "limits", label: "Limits", route: "/calculus/limits" },
  { id: "derivatives", label: "Derivatives", route: "/calculus/derivatives" },
  { id: "integration", label: "Integrals", route: "/calculus/integration" },
  { id: "differential-equations", label: "Differential Equations", route: "/calculus/differential-equations" },
  { id: "advanced", label: "Advanced Calculus", route: "/calculus/advanced" },
] as const;

export const progressTopics: Array<{ id: string; label: string; route: string; page: CalculusStudioPage }> = [
  { id: "limits:limits", label: "Limits", route: "/calculus/limits", page: "limits" },
  { id: "limits:continuity", label: "Continuity", route: "/calculus/limits?mode=continuity", page: "limits" },
  { id: "limits:discontinuities", label: "Discontinuities", route: "/calculus/limits?mode=discontinuities", page: "limits" },
  { id: "limits:asymptotes", label: "Asymptotes", route: "/calculus/limits?mode=asymptotes", page: "limits" },
  { id: "limits:lhopital", label: "L'Hôpital", route: "/calculus/limits?mode=lhopital", page: "limits" },
  { id: "derivatives:tangent", label: "Tangents", route: "/calculus/derivatives", page: "derivatives" },
  { id: "derivatives:rules", label: "Derivative rules", route: "/calculus/derivatives?mode=rules", page: "derivatives" },
  { id: "derivatives:chain", label: "Chain rule", route: "/calculus/derivatives?mode=chain", page: "derivatives" },
  { id: "derivatives:implicit", label: "Implicit", route: "/calculus/derivatives?mode=implicit", page: "derivatives" },
  { id: "derivatives:higher", label: "Higher derivatives", route: "/calculus/derivatives?mode=higher", page: "derivatives" },
  { id: "derivatives:linearization", label: "Linearization", route: "/calculus/derivatives?mode=linearization", page: "derivatives" },
  { id: "apps:motion", label: "Motion", route: "/calculus/derivative-applications?mode=motion", page: "derivative-applications" },
  { id: "apps:related", label: "Related rates", route: "/calculus/derivative-applications?mode=related", page: "derivative-applications" },
  { id: "apps:curve", label: "Curve analysis", route: "/calculus/derivative-applications?mode=curve", page: "derivative-applications" },
  { id: "apps:optimization", label: "Optimization", route: "/calculus/derivative-applications?mode=optimization", page: "derivative-applications" },
  { id: "apps:mvt", label: "Mean Value Theorem", route: "/calculus/derivative-applications?mode=mvt", page: "derivative-applications" },
  { id: "int:antiderivative", label: "Antiderivatives", route: "/calculus/integration?mode=antiderivative", page: "integration" },
  { id: "int:definite", label: "Definite integrals", route: "/calculus/integration?mode=definite", page: "integration" },
  { id: "int:ftc", label: "FTC", route: "/calculus/integration?mode=ftc", page: "integration" },
  { id: "int:riemann", label: "Riemann sums", route: "/calculus/integration?mode=riemann", page: "integration" },
  { id: "int:numerical", label: "Numerical integration", route: "/calculus/integration?mode=numerical", page: "integration" },
  { id: "tech:substitution", label: "Substitution", route: "/calculus/integration-techniques?mode=substitution", page: "integration-techniques" },
  { id: "tech:parts", label: "Integration by parts", route: "/calculus/integration-techniques?mode=parts", page: "integration-techniques" },
  { id: "tech:partial", label: "Partial fractions", route: "/calculus/integration-techniques?mode=partial", page: "integration-techniques" },
  { id: "tech:trig", label: "Trig integrals", route: "/calculus/integration-techniques?mode=trig", page: "integration-techniques" },
  { id: "tech:trig-sub", label: "Trig substitution", route: "/calculus/integration-techniques?mode=trig-sub", page: "integration-techniques" },
  { id: "tech:improper", label: "Improper integrals", route: "/calculus/integration-techniques?mode=improper", page: "integration-techniques" },
  { id: "apps-int:area", label: "Area between curves", route: "/calculus/integral-applications?mode=area", page: "integral-applications" },
  { id: "apps-int:volumes", label: "Volumes", route: "/calculus/integral-applications?mode=volumes", page: "integral-applications" },
  { id: "de:slope", label: "Slope fields", route: "/calculus/differential-equations", page: "differential-equations" },
  { id: "series:taylor", label: "Taylor series", route: "/calculus/series-parametric-polar?mode=taylor", page: "series-parametric-polar" },
  { id: "multi:partial", label: "Multivariable", route: "/calculus/multivariable-vector", page: "multivariable-vector" },
  { id: "advanced:workbench", label: "Advanced Calculus", route: "/calculus/advanced", page: "advanced" },
];

export const searchCatalog: SearchHit[] = [
  { page: "home", label: "Studio Home", route: "/calculus", keywords: "home start journey" },
  { page: "limits", label: "Limits", route: "/calculus/limits", mode: "limits", keywords: "limit one-sided epsilon delta", formula: "lim x→a f(x)" },
  { page: "limits", label: "Continuity", route: "/calculus/limits?mode=continuity", mode: "continuity", keywords: "continuous hole removable", formula: "lim f(x)=f(a)" },
  { page: "limits", label: "L'Hôpital", route: "/calculus/limits?mode=lhopital", mode: "lhopital", keywords: "indeterminate 0/0", formula: "lim f/g = lim f'/g'" },
  { page: "derivatives", label: "Derivatives", route: "/calculus/derivatives", mode: "tangent", keywords: "tangent secant slope", formula: "f'(a)" },
  { page: "derivatives", label: "Chain rule", route: "/calculus/derivatives?mode=chain", mode: "chain", keywords: "composition inner outer", formula: "(f∘g)'" },
  { page: "derivative-applications", label: "Optimization", route: "/calculus/derivative-applications?mode=optimization", mode: "optimization", keywords: "max min box volume", formula: "V(x)=x(W-2x)(L-2x)" },
  { page: "derivative-applications", label: "Related rates", route: "/calculus/derivative-applications?mode=related", mode: "related", keywords: "sphere volume radius", formula: "dV/dt=4πr² dr/dt" },
  { page: "integration", label: "Definite integral", route: "/calculus/integration?mode=definite", mode: "definite", keywords: "area accumulation riemann", formula: "∫_a^b f(x) dx" },
  { page: "integration", label: "Fundamental Theorem", route: "/calculus/integration?mode=ftc", mode: "ftc", keywords: "ftc accumulator", formula: "F'(x)=f(x)" },
  { page: "integration-techniques", label: "Substitution", route: "/calculus/integration-techniques?mode=substitution", mode: "substitution", keywords: "u-sub bounds", formula: "u=g(x)" },
  { page: "integral-applications", label: "Volumes", route: "/calculus/integral-applications?mode=volumes", mode: "volumes", keywords: "washer shell revolution", formula: "π∫[R²-r²]" },
  { page: "differential-equations", label: "Slope fields", route: "/calculus/differential-equations", mode: "slope", keywords: "ode euler rk4 ivp", formula: "dy/dx=f(x,y)" },
  { page: "series-parametric-polar", label: "Taylor polynomials", route: "/calculus/series-parametric-polar?mode=taylor", mode: "taylor", keywords: "series remainder remainder band", formula: "T_n(x)" },
  { page: "series-parametric-polar", label: "Polar curves", route: "/calculus/series-parametric-polar?mode=polar", mode: "polar", keywords: "r theta polar", formula: "r=1+cosθ" },
  { page: "multivariable-vector", label: "Gradients", route: "/calculus/multivariable-vector?mode=gradient", mode: "gradient", keywords: "partial surface vector field", formula: "∇f" },
  { page: "multivariable-vector", label: "Theorems", route: "/calculus/multivariable-vector?mode=theorems", mode: "theorems", keywords: "green stokes divergence flux", formula: "∬∇·F" },
  { page: "advanced", label: "Advanced Calculus", route: "/calculus/advanced", keywords: "workbench epsilon delta remainder flux", formula: "ε-δ" },
];

const defaultSettings = (): StudioSettings => ({
  theme: "light",
  graphLight: false,
  reducedMotion: false,
  collapseControls: false,
  collapseResults: false,
});

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("calculus-studio-settings"));
}

export function loadSettings(): StudioSettings {
  const stored = readJson<Partial<StudioSettings>>(SETTINGS_KEY, {});
  const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return { ...defaultSettings(), ...stored, reducedMotion: stored.reducedMotion ?? prefersReduced };
}

export function saveSettings(next: StudioSettings) {
  writeJson(SETTINGS_KEY, next);
}

export function loadProgress(): string[] {
  return readJson<string[]>(PROGRESS_KEY, []);
}

export function markTopicComplete(page: CalculusStudioPage, mode: string) {
  const id = progressTopics.find((topic) => topic.page === page && (topic.route.includes(`mode=${mode}`) || (!topic.route.includes("mode=") && (mode === "" || topic.route.endsWith(studioRoutes[page])))))?.id
    ?? `${page}:${mode || "default"}`;
  const current = loadProgress();
  if (current.includes(id)) return;
  const mapped = progressTopics.find((topic) => topic.page === page)?.id;
  const next = Array.from(new Set([...current, id, mapped].filter(Boolean) as string[]));
  writeJson(PROGRESS_KEY, next);
}

export function progressSummary() {
  const done = loadProgress();
  const completed = progressTopics.filter((topic) => done.includes(topic.id)).length;
  const percent = Math.round((completed / progressTopics.length) * 100);
  const rank = percent < 20 ? "Beginner" : percent < 45 ? "Advanced Beginner" : percent < 75 ? "Intermediate" : "Advanced";
  return { completed, total: progressTopics.length, percent, rank, done };
}

export function loadLastExperiment(): LastExperiment | null {
  return readJson<LastExperiment | null>(LAST_KEY, null);
}

export function recordVisit(page: CalculusStudioPage, mode: string, title: string, note: string, kind: string) {
  if (typeof window === "undefined" || page === "home") return;
  const route = `${studioRoutes[page]}${mode ? `${studioRoutes[page].includes("?") ? "&" : "?"}mode=${mode}` : ""}`.replace("?mode=&", "?").replace(/\?mode=$/, "");
  const cleanRoute = mode ? `${studioRoutes[page]}?mode=${mode}` : studioRoutes[page];
  const payload: LastExperiment = { route: cleanRoute, title, note, kind, visitedAt: Date.now() };
  writeJson(LAST_KEY, payload);
  window.localStorage.setItem(LAST_ROUTE_KEY, payload.route);
  markTopicComplete(page, mode || page);
}

export function searchStudio(query: string): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return searchCatalog.filter((item) =>
    `${item.label} ${item.keywords} ${item.formula ?? ""} ${item.page}`.toLowerCase().includes(q),
  );
}

export function todayKey(now = new Date()) {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export const dailyChallengeBank = [
  {
    prompt: "Predict the behavior of the limit.",
    formula: "lim_{x→2} (x² − 4) / (x − 2)",
    html: "lim x→2 (x² − 4) / (x − 2)",
    answer: 4,
    hint: "Factor the numerator: (x − 2)(x + 2) / (x − 2) → 4.",
  },
  {
    prompt: "What is the derivative of x² at x = 3?",
    formula: "d/dx x² |_{x=3}",
    html: "d/dx x² at x = 3",
    answer: 6,
    hint: "2x at 3 is 6.",
  },
  {
    prompt: "∫₀¹ 2x dx = ?",
    formula: "∫_0^1 2x dx",
    html: "∫ from 0 to 1 of 2x dx",
    answer: 1,
    hint: "Antiderivative x² from 0 to 1.",
  },
] as const;

export function getDailyChallenge(now = new Date()) {
  const start = Date.UTC(2026, 0, 1);
  const days = Math.floor((now.getTime() - start) / 86400000);
  return dailyChallengeBank[((days % dailyChallengeBank.length) + dailyChallengeBank.length) % dailyChallengeBank.length]!;
}

export const dailyChallenge = getDailyChallenge();

export function loadChallenge(): ChallengeState {
  const stored = readJson<ChallengeState>(CHALLENGE_KEY, { day: todayKey(), streak: 0, solved: false, guess: "" });
  if (stored.day !== todayKey()) {
    return { day: todayKey(), streak: stored.solved ? stored.streak : 0, solved: false, guess: "" };
  }
  return stored;
}

export function gradeChallenge(guess: string): ChallengeState {
  const current = loadChallenge();
  const numeric = Number(guess.trim());
  const solved = Number.isFinite(numeric) && Math.abs(numeric - getDailyChallenge().answer) < 1e-6;
  const next: ChallengeState = {
    day: todayKey(),
    guess,
    solved,
    streak: solved ? (current.solved ? current.streak : current.streak + 1) : current.streak,
  };
  writeJson(CHALLENGE_KEY, next);
  return next;
}

export function exportSession() {
  return JSON.stringify({
    settings: loadSettings(),
    progress: loadProgress(),
    last: loadLastExperiment(),
    challenge: loadChallenge(),
    savedAt: new Date().toISOString(),
  }, null, 2);
}

export function importSession(raw: string) {
  const parsed = JSON.parse(raw) as {
    settings?: StudioSettings;
    progress?: string[];
    last?: LastExperiment | null;
    challenge?: ChallengeState;
  };
  if (parsed.settings) saveSettings({ ...defaultSettings(), ...parsed.settings });
  if (parsed.progress) writeJson(PROGRESS_KEY, parsed.progress);
  if (parsed.last) writeJson(LAST_KEY, parsed.last);
  if (parsed.challenge) writeJson(CHALLENGE_KEY, parsed.challenge);
}

export function persistSavedSnapshot() {
  writeJson(SAVED_KEY, { blob: exportSession() });
}

export function helpFor(page: CalculusStudioPage, mode: string) {
  const key = `${page}:${mode || "home"}`;
  const copy: Record<string, string> = {
    "home:home": "Search topics, tap a numbered card, or press 1–9 to open a lab. Continue, journey stats, and Challenge of the day remember progress on this device.",
    "limits:limits": "Compare left and right approaches. Lock δ to keep both sides equal, and watch the ε–δ bands on the graph.",
    "limits:continuity": "A function is continuous at a only if it is defined, the two-sided limit exists, and those values agree.",
    "limits:discontinuities": "Holes, jumps, and vertical blow-ups are drawn differently so the classification matches the picture.",
    "limits:asymptotes": "Vertical dashed lines mark where |f(x)| grows without bound.",
    "limits:lhopital": "When both numerator and denominator approach 0, compare f'/g' on the overlay.",
    "derivatives:tangent": "Play h → 0 to watch the secant become the tangent. The difference quotient is shown next to f'(a).",
    "derivatives:chain": "Outer slope and inner derivative are highlighted separately.",
    "derivatives:implicit": "The circle x² + y² = 25 is the implicit model; y' = −x/y.",
    "derivatives:higher": "f, f', and f'' (or the selected order) overlay on the same axes.",
    "derivative-applications:optimization": "Drag the cut size; the box and V(x) graph update together. The checklist confirms a maximum.",
    "derivative-applications:related": "The sphere radius and dV/dt stay linked by 4πr² dr/dt.",
    "derivative-applications:mvt": "The secant on [a,b] is matched by the tangent at the MVT point.",
    "integration:definite": "Switch Riemann methods and compare error against a high-precision reference.",
    "integration:ftc": "The left pane is f; the right pane is the accumulator F(x).",
    "integration:numerical": "All five methods share the same n so you can compare accuracy.",
    "integration-techniques:substitution": "Click a step card to highlight the matching region in x-space and u-space.",
    "integral-applications:volumes": "Washers stack along the axis of rotation.",
    "integral-applications:area": "The region between f and g is the signed difference.",
    "differential-equations:slope": "Type f(x,y), then click the field to set the initial condition. Euler, RK4, and the exact curve overlay.",
    "series-parametric-polar:taylor": "The remainder band is |sin x − T_n(x)|. The term table highlights the newest term.",
    "series-parametric-polar:polar": "The polar trace uses r(θ) with a moving point.",
    "multivariable-vector:partial": "The 3D surface is sampled from the typed f(x,y).",
    "multivariable-vector:theorems": "Green/divergence is shown as circulation around a region and flux arrows.",
    "advanced:": "Pick one investigation to visualize; the other 24 stay as a compact index of live values.",
  };
  return copy[key] ?? copy[`${page}:${mode}`] ?? "Explore the controls, then confirm the live results against the graph.";
}

export function shortcutsFor(page: CalculusStudioPage) {
  const shared = ["Tab moves between controls", "Enter plots the current expression", "Escape closes menus and dialogs", "Ctrl/Cmd+K focuses search on Studio Home", "Ctrl/Cmd+L copies a link to this experiment"];
  if (page === "home") return [...shared, "Keys 1–6 open launch experiments"];
  return [...shared, "Space plays or pauses animation when the graph is focused"];
}

export function repairedLimitExpression(expression: string, a: number, limit: number) {
  const compact = expression.replace(/\s/g, "");
  if (compact === "sin(x)/x" && Math.abs(a) < 1e-9) return "sinc(x)";
  if (compact === "(x^2-1)/(x-1)" && Math.abs(a - 1) < 1e-9) return "x+1";
  if (Number.isFinite(limit)) return `{x<=${a - 1e-4}:${expression}, x>=${a + 1e-4}:${expression}}`;
  return expression;
}

export function prefersReducedMotion(settings: StudioSettings) {
  return settings.reducedMotion || (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
}
