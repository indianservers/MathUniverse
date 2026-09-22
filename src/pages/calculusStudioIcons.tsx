import { useId, type ReactNode } from "react";
import type { CalculusStudioPage } from "./calculusStudioSession";

type IconPage = CalculusStudioPage | "main";

function Svg({ children, label }: { children: ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="cs-nav-icon">
      <title>{label}</title>
      {children}
    </svg>
  );
}

const stroke = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function CalculusNavIcon({ page }: { page: IconPage }) {
  switch (page) {
    case "main":
      return <Svg label="Main"><path {...stroke} d="M4 11.4 12 4l8 7.4V20h-5.2v-6.2H9.2V20H4Z" /></Svg>;
    case "home":
      return <Svg label="Studio Home"><path {...stroke} d="M4 11.4 12 4l8 7.4V20h-5.2v-6.2H9.2V20H4Z" /></Svg>;
    case "limits":
      return (
        <Svg label="Limits">
          <path {...stroke} d="M3 13c2.2-6 3.6 5 6.2 0S13 18 16 12s3.8-7 5-5" />
        </Svg>
      );
    case "derivatives":
      return (
        <Svg label="Derivatives">
          <text x="12" y="16.5" textAnchor="middle" fill="currentColor" fontSize="9" fontWeight="800" fontFamily="Georgia,serif">d⁄dx</text>
        </Svg>
      );
    case "derivative-applications":
      return (
        <Svg label="Derivative Applications">
          <path {...stroke} d="M4 18V6M4 18h16" />
          <path {...stroke} d="M6 15c3-8 5 1 8-5 2.2 3 3.4 2 6-2" />
        </Svg>
      );
    case "integration":
      return (
        <Svg label="Integration">
          <text x="12" y="18" textAnchor="middle" fill="currentColor" fontSize="18" fontFamily="Georgia,serif">∫</text>
        </Svg>
      );
    case "integration-techniques":
      return (
        <Svg label="Integration Techniques">
          <path {...stroke} d="M7 6v12M17 6v12" />
          <path {...stroke} d="M7 9h4l2 6 4-10" />
        </Svg>
      );
    case "integral-applications":
      return (
        <Svg label="Integral Applications">
          <path {...stroke} d="M5 18V9h3v9M11 18V6h3v12M17 18v-7h3v7" />
        </Svg>
      );
    case "differential-equations":
      return (
        <Svg label="Differential Equations">
          <path {...stroke} d="M4 14c2-7 3.4 5 6 0s3.6 6 6 0 3 4 4 2" />
        </Svg>
      );
    case "series-parametric-polar":
      return (
        <Svg label="Series Parametric Polar">
          <text x="12" y="17" textAnchor="middle" fill="currentColor" fontSize="16" fontFamily="Georgia,serif">Σ</text>
        </Svg>
      );
    case "multivariable-vector":
      return (
        <Svg label="Multivariable">
          <path {...stroke} d="M12 3.4 20.2 8v8L12 20.6 3.8 16V8Z" />
          <path {...stroke} d="M12 3.4v9.2L3.8 8M12 12.6 20.2 8M12 12.6V20.6" />
        </Svg>
      );
    case "advanced":
      return (
        <Svg label="Advanced">
          <path {...stroke} d="M4 16c2.4-7 5.2 2 8-6 2.4 6 4.4-1 8 5" />
          <path {...stroke} d="M5 18h14" />
          <path {...stroke} d="M12 5v4" />
        </Svg>
      );
    case "jacobians":
      return (
        <Svg label="Jacobians">
          <path {...stroke} d="M4 16 12 4l8 12H4Z" />
          <path {...stroke} d="M8 16h8" />
        </Svg>
      );
    case "beta-gamma":
      return (
        <Svg label="Beta and Gamma">
          <path {...stroke} d="M5 18c2-8 4-8 6 0s4 8 8 0" />
        </Svg>
      );
    case "series-tests":
    case "curve-tracing":
    case "taylor-two-variables":
    case "lagrange-multipliers":
    case "change-order":
    case "centroid":
    case "moments-of-inertia":
    case "integral-engineering":
      return <Svg label="Calculus lab"><path {...stroke} d="M4 16c3-8 6 4 8-2s4 6 8 0" /><path {...stroke} d="M5 19h14" /></Svg>;
    default:
      return <Svg label="Studio"><circle cx="12" cy="12" r="7" {...stroke} /></Svg>;
  }
}

function Mini({ children, label }: { children: ReactNode; label: string }) {
  return (
    <svg className="cs-mini-preview" viewBox="0 0 180 78" role="img" aria-label={label}>
      {children}
    </svg>
  );
}

export function CalculusLaunchArt({ kind }: { kind: string }) {
  const uid = useId();
  if (kind === "limits" || kind === "Limits") {
    return (
      <Mini label="Limit approaching a point">
        <path d="M12 48 C 40 18, 70 72, 96 40 S 150 12, 172 42" fill="none" stroke="#22c5ea" strokeWidth="2.4" />
        <circle cx="96" cy="40" r="5" fill="#fff" stroke="#0f172a" strokeWidth="2" />
      </Mini>
    );
  }
  if (kind === "derivatives" || kind === "Derivatives") {
    return (
      <Mini label="Derivative tangent on a curve">
        <path d="M18 62 Q 90 8 168 62" fill="none" stroke="#22c5ea" strokeWidth="2.4" />
        <line x1="40" y1="70" x2="150" y2="18" stroke="#f97316" strokeWidth="2" />
        <circle cx="96" cy="36" r="4" fill="#147df2" />
      </Mini>
    );
  }
  if (kind === "derivative-applications" || kind === "Applications") {
    return (
      <Mini label="Motion, related rates, and optimization">
        <path d="M18 58 Q 70 10 120 42 T 168 28" fill="none" stroke="#22c5ea" strokeWidth="2.2" />
        <rect x="118" y="28" width="36" height="32" fill="#ede9fe" stroke="#7c3aed" />
        <circle cx="70" cy="28" r="5" fill="#f97316" />
      </Mini>
    );
  }
  if (kind === "integration" || kind === "Integrals") {
    return (
      <Mini label="Integral area under a curve">
        <path d="M24 62 C 70 12, 118 18, 156 62" fill="#bae6fd" stroke="#22c5ea" strokeWidth="2.2" />
        <line x1="58" y1="62" x2="58" y2="34" stroke="#f59e0b" />
        <line x1="132" y1="62" x2="132" y2="28" stroke="#8b45f4" />
      </Mini>
    );
  }
  if (kind === "integration-techniques" || kind === "Techniques") {
    return (
      <Mini label="Substitution and parts transform">
        <text x="28" y="48" fontSize="28" fill="#22c5ea" fontFamily="Georgia,serif">∫</text>
        <path d="M52 40 L92 40 L84 32 M92 40 L84 48" fill="none" stroke="#7c3aed" strokeWidth="2.4" />
        <text x="104" y="48" fontSize="22" fill="#0f766e" fontFamily="Georgia,serif">u</text>
      </Mini>
    );
  }
  if (kind === "integral-applications" || kind === "Volumes") {
    return (
      <Mini label="Solid of revolution">
        <ellipse cx="96" cy="40" rx="58" ry="22" fill="#bae6fd" stroke="#22c5ea" />
        <ellipse cx="96" cy="40" rx="18" ry="8" fill="#fff" stroke="#8b45f4" />
        <line x1="38" y1="40" x2="154" y2="40" stroke="#0f172a" strokeWidth="1.2" />
      </Mini>
    );
  }
  if (kind === "differential-equations" || kind === "slope") {
    return (
      <Mini label="Slope field and solution curve">
        {Array.from({ length: 7 }, (_, x) => Array.from({ length: 4 }, (_, y) => {
          const px = 18 + x * 22, py = 16 + y * 14, m = (x - 3) - (y - 1.5), a = Math.atan(m / 3);
          return <line key={`${x}-${y}`} x1={px - Math.cos(a) * 7} y1={py - Math.sin(a) * 7} x2={px + Math.cos(a) * 7} y2={py + Math.sin(a) * 7} stroke="#38bdf8" strokeWidth="1.4" />;
        }))}
        <path d="M22 18 C 70 70, 120 70, 168 28" fill="none" stroke="#ef4444" strokeWidth="2.2" />
      </Mini>
    );
  }
  if (kind === "series-parametric-polar" || kind === "Approximations") {
    return (
      <Mini label="Taylor approximation overlay">
        <path d="M10 40 C 40 8, 70 72, 100 40 S 150 8, 172 40" fill="none" stroke="#22c5ea" strokeWidth="2.2" />
        <path d="M10 40 C 40 18, 70 62, 100 40 S 150 18, 172 40" fill="none" stroke="#8b45f4" strokeWidth="1.8" strokeDasharray="4 3" />
      </Mini>
    );
  }
  if (kind === "advanced" || kind === "Advanced Calculus") {
    return (
      <Mini label="Advanced Calculus surface">
        <defs>
          <linearGradient id={`cs-advanced-heat-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22c5ea" />
            <stop offset="38%" stopColor="#8b45f4" />
            <stop offset="72%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
        <path d="M22 58 C 48 18, 78 66, 104 28 S 148 8, 164 36 L 164 66 C 128 78, 78 52, 22 70 Z" fill={`url(#cs-advanced-heat-${uid})`} />
        <path d="M34 52 C 58 28, 84 58, 108 34 S 146 20, 158 42" fill="none" stroke="#fff" strokeWidth="1.1" opacity=".55" />
        <path d="M40 60 C 70 42, 96 62, 126 46" fill="none" stroke="#fff" strokeWidth=".9" opacity=".35" />
      </Mini>
    );
  }
  return (
    <Mini label="Multivariable surface and vector field">
      <defs>
        <linearGradient id={`cs-multi-surface-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22c5ea" />
          <stop offset="45%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
        <marker id={`cs-multi-arrow-${uid}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0 0 L6 3 L0 6 Z" fill="#0f172a" />
        </marker>
      </defs>
      <path d="M18 62 C 52 16, 86 70, 118 24 S 150 12, 168 30 L 164 64 C 128 82, 78 48, 22 72 Z" fill={`url(#cs-multi-surface-${uid})`} />
      <path d="M36 54 L48 38" stroke="#0f172a" strokeWidth="1.5" markerEnd={`url(#cs-multi-arrow-${uid})`} />
      <path d="M78 50 L92 32" stroke="#0f172a" strokeWidth="1.5" markerEnd={`url(#cs-multi-arrow-${uid})`} />
      <path d="M118 42 L132 24" stroke="#0f172a" strokeWidth="1.5" markerEnd={`url(#cs-multi-arrow-${uid})`} />
      <path d="M54 64 L62 50" stroke="#0f172a" strokeWidth="1.5" markerEnd={`url(#cs-multi-arrow-${uid})`} />
    </Mini>
  );
}
