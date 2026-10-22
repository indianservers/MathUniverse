import type { ReactNode } from "react";

export type ModellingNavId =
  | "main"
  | "home"
  | "motion"
  | "population"
  | "epidemics"
  | "finance"
  | "optimization"
  | "networks"
  | "regression"
  | "periodic"
  | "numerical"
  | "comparison";

const stroke = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Svg({ children, label }: { children: ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <title>{label}</title>
      {children}
    </svg>
  );
}

export function ModellingNavIcon({ id }: { id: ModellingNavId | string }) {
  switch (id) {
    case "main":
      return <Svg label="Main"><path {...stroke} d="M4 11.4 12 4l8 7.4V20h-5.2v-6.2H9.2V20H4Z" /></Svg>;
    case "home":
      return (
        <Svg label="Studio Home">
          <rect x="4" y="4" width="7" height="7" rx="1.5" {...stroke} />
          <rect x="13" y="4" width="7" height="7" rx="1.5" {...stroke} />
          <rect x="4" y="13" width="7" height="7" rx="1.5" {...stroke} />
          <rect x="13" y="13" width="7" height="7" rx="1.5" {...stroke} />
        </Svg>
      );
    case "motion":
      return (
        <Svg label="Motion">
          <circle cx="9" cy="6.2" r="2.1" {...stroke} />
          <path {...stroke} d="M8 9.2 6.2 13.5M8 9.2l3.2 2.2 2.6 5.8M11.2 11.4 5.5 11.8M14.2 17.4l3.2-1.4" />
        </Svg>
      );
    case "population":
      return (
        <Svg label="Population">
          <circle cx="8" cy="8" r="2.2" {...stroke} />
          <circle cx="16" cy="8.4" r="2" {...stroke} />
          <path {...stroke} d="M4.5 19c.4-3.2 2.2-5 3.6-5s3.2 1.8 3.6 5M12.8 19c.3-2.6 1.6-4.2 3.2-4.2S19.3 16.4 19.6 19" />
        </Svg>
      );
    case "epidemics":
      return (
        <Svg label="Epidemics">
          <circle cx="12" cy="12" r="3.2" {...stroke} />
          <path {...stroke} d="M12 4.5v3.2M12 16.3v3.2M4.5 12h3.2M16.3 12h3.2M6.6 6.6l2.2 2.2M15.2 15.2l2.2 2.2M17.4 6.6l-2.2 2.2M8.8 15.2l-2.2 2.2" />
        </Svg>
      );
    case "finance":
      return (
        <Svg label="Finance">
          <circle cx="12" cy="12" r="8" {...stroke} />
          <path {...stroke} d="M12 7.2v10M9.2 9.2c.6-1.2 1.6-1.8 2.8-1.8 1.8 0 3 1 3 2.4s-1.4 2.2-3.6 2.6c-2 .4-3.4 1.2-3.4 2.7 0 1.5 1.5 2.5 3.4 2.5 1.4 0 2.6-.6 3.2-1.6" />
        </Svg>
      );
    case "optimization":
      return (
        <Svg label="Optimization">
          <circle cx="12" cy="12" r="7.4" {...stroke} />
          <circle cx="12" cy="12" r="3.4" {...stroke} />
          <circle cx="12" cy="12" r="1.1" fill="currentColor" />
        </Svg>
      );
    case "networks":
      return (
        <Svg label="Networks">
          <circle cx="6" cy="7" r="2.1" {...stroke} />
          <circle cx="18" cy="7" r="2.1" {...stroke} />
          <circle cx="7" cy="18" r="2.1" {...stroke} />
          <circle cx="17" cy="17" r="2.1" {...stroke} />
          <circle cx="12" cy="12" r="2.1" {...stroke} />
          <path {...stroke} d="M7.8 8.4 10.2 10.4M16.2 8.6 13.8 10.4M8.7 16.2 10.8 13.4M15.2 15.6 13.4 13.6" />
        </Svg>
      );
    case "regression":
      return (
        <Svg label="Regression">
          <path {...stroke} d="M4 18h16M6 16 10 10l4 3 4-8" />
          <circle cx="10" cy="10" r="1.2" fill="currentColor" />
          <circle cx="14" cy="13" r="1.2" fill="currentColor" />
          <circle cx="18" cy="5" r="1.2" fill="currentColor" />
        </Svg>
      );
    case "periodic":
      return (
        <Svg label="Periodic Models">
          <path {...stroke} d="M3 12c2.4-7 4.2 7 6.4 0S13.6 19 16 12s3.8-7 5-5" />
        </Svg>
      );
    case "numerical":
      return (
        <Svg label="Numerical Experiments">
          <path {...stroke} d="M9 3h6v5l4 9a5 5 0 0 1-14 0l4-9Z" />
          <path {...stroke} d="M9 11h6" />
        </Svg>
      );
    case "comparison":
      return (
        <Svg label="Model Comparison">
          <path {...stroke} d="M7 18V8M12 18V5M17 18v-7" />
          <path {...stroke} d="M4 18h16" />
        </Svg>
      );
    default:
      return <Svg label={id}><circle cx="12" cy="12" r="7" {...stroke} /></Svg>;
  }
}

export function ModellingLaunchArt({ id }: { id: string }) {
  const common = { fill: "none" as const, strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg className="msk-art msk-model-art" viewBox="0 0 220 92" aria-hidden="true">
      <rect width="220" height="92" rx="14" fill="#f7fbff" />
      {id === "motion" ? (
        <>
          <path d="M18 74 H 204 M 18 74 V 16" stroke="#94a3b8" />
          <path d="M18 74 Q 110 8 204 74" stroke="#147df2" {...common} />
          {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={40 + i * 28} cy={74 - Math.sin(i * 0.55) * 38} r="3.2" fill="#08b9dd" />)}
        </>
      ) : null}
      {id === "population" ? (
        <>
          <path d="M18 74 C 70 72, 90 28, 210 16" stroke="#8b45f4" {...common} />
          <path d="M18 74 C 70 70, 110 42, 210 38" stroke="#08b9dd" {...common} />
        </>
      ) : null}
      {id === "epidemics" ? (
        <>
          <path d="M16 70 C 70 70, 92 18, 132 28 S 206 72 206 72" stroke="#8b45f4" {...common} />
          <path d="M16 70 C 80 68, 110 40, 210 22" stroke="#10b981" {...common} />
          <text x="28" y="28" fill="#147df2" fontSize="11" fontWeight="800">S</text>
          <text x="118" y="22" fill="#8b45f4" fontSize="11" fontWeight="800">I</text>
          <text x="196" y="28" fill="#10b981" fontSize="11" fontWeight="800">R</text>
        </>
      ) : null}
      {id === "finance" ? (
        <>
          <polyline points="18,74 46,62 74,66 108,40 140,48 204,18" stroke="#10b981" {...common} />
          <polyline points="18,74 50,70 88,58 130,52 204,36" stroke="#94a3b8" strokeDasharray="4 3" {...common} />
        </>
      ) : null}
      {id === "optimization" ? (
        <>
          <ellipse cx="118" cy="46" rx="70" ry="28" fill="none" stroke="#c4b5fd" />
          <ellipse cx="118" cy="46" rx="42" ry="16" fill="none" stroke="#8b45f4" />
          <circle cx="142" cy="38" r="5" fill="#f59e0b" />
        </>
      ) : null}
      {id === "networks" ? (
        <>
          <line x1="40" y1="28" x2="110" y2="46" stroke="#94a3b8" />
          <line x1="110" y1="46" x2="180" y2="24" stroke="#94a3b8" />
          <line x1="110" y1="46" x2="70" y2="74" stroke="#08b9dd" />
          <line x1="110" y1="46" x2="170" y2="72" stroke="#8b45f4" />
          <circle cx="40" cy="28" r="6" fill="#147df2" />
          <circle cx="180" cy="24" r="6" fill="#8b45f4" />
          <circle cx="70" cy="74" r="6" fill="#08b9dd" />
          <circle cx="170" cy="72" r="6" fill="#f59e0b" />
          <circle cx="110" cy="46" r="7" fill="#10b981" />
        </>
      ) : null}
      {id === "regression" ? (
        <>
          {[[42, 70], [70, 58], [96, 62], [128, 40], [158, 46], [186, 24]].map(([x, y]) => <circle key={`${x}`} cx={x} cy={y} r="3.4" fill="#147df2" />)}
          <path d="M24 76 L 206 18" stroke="#8b45f4" {...common} />
        </>
      ) : null}
      {id === "periodic" ? (
        <path d="M12 46 C 40 12, 62 80, 88 46 S 140 12, 166 46 S 214 80, 220 46" stroke="#08b9dd" {...common} />
      ) : null}
      {id === "numerical" ? (
        <>
          <path d="M40 78 C 60 18, 90 18, 110 78 C 130 18, 170 18, 190 78" fill="url(#msk-num-fill)" stroke="#8b45f4" {...common} />
          <defs><linearGradient id="msk-num-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8b45f4" stopOpacity=".35" /><stop offset="1" stopColor="#8b45f4" stopOpacity="0" /></linearGradient></defs>
        </>
      ) : null}
      {id === "comparison" ? (
        <>
          <rect x="48" y="48" width="22" height="32" rx="4" fill="#08b9dd" />
          <rect x="88" y="28" width="22" height="52" rx="4" fill="#8b45f4" />
          <rect x="128" y="38" width="22" height="42" rx="4" fill="#f59e0b" />
          <rect x="168" y="34" width="22" height="46" rx="4" fill="#10b981" />
        </>
      ) : null}
    </svg>
  );
}

export const modellingCardCopy: Record<string, string> = {
  motion: "Kinematics, projectile motion, forces.",
  population: "Growth models, carrying capacity, dynamics.",
  epidemics: "SIR models, spread, interventions.",
  finance: "Compound interest, investment, risk.",
  optimization: "Minimize cost, maximize outcomes.",
  networks: "Shortest paths, flows, network design.",
  regression: "Fit models, correlation, prediction.",
  periodic: "Sinusoidal models, seasonality, cycles.",
  numerical: "Simulations, what-if exploration.",
  comparison: "Compare models, error & metrics.",
};

export const modellingDatasets = [
  { title: "COVID-19 Global Data", tag: "Epidemics", route: "/mathematical-modelling/epidemics", id: "epidemics" },
  { title: "Predator-Prey Dynamics", tag: "Population", route: "/mathematical-modelling/population", id: "population" },
  { title: "Stock Market (S&P 500)", tag: "Finance", route: "/mathematical-modelling/finance", id: "finance" },
  { title: "City Traffic Flow", tag: "Routing", route: "/mathematical-modelling/networks", id: "networks" },
  { title: "Energy Consumption (Time Series)", tag: "Periodic", route: "/mathematical-modelling/periodic", id: "periodic" },
  { title: "Student Scores & Study Hours", tag: "Regression", route: "/mathematical-modelling/regression", id: "regression" },
];

export const modellingJourney = [
  { id: "epidemics", label: "Epidemics", note: "SIR with vaccination", done: true },
  { id: "finance", label: "Finance", note: "Portfolio optimization", done: true },
  { id: "motion", label: "Motion", note: "Projectile with drag", now: true },
  { id: "regression", label: "Regression", note: "Housing price prediction" },
];
