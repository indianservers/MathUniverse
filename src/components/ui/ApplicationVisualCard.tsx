import { ReactNode } from "react";

export type ApplicationVisualKind =
  | "neural-network"
  | "computer-graphics"
  | "robotics"
  | "data-compression"
  | "pca"
  | "image-processing"
  | "game-physics"
  | "transform-3d"
  | "gradient-descent"
  | "signal-processing"
  | "gps"
  | "cryptography"
  | "radar"
  | "medical-imaging"
  | "pricing-models"
  | "break-even"
  | "motion-model"
  | "linear-model"
  | "physics"
  | "optimization"
  | "economics"
  | "engineering"
  | "architecture"
  | "game-design"
  | "ar-vr"
  | "electrical"
  | "quantum"
  | "waves"
  | "frequency-analysis";

type ApplicationVisualCardProps = {
  title: string;
  description: string;
  visual: ApplicationVisualKind;
  meta?: string;
  compact?: boolean;
  children?: ReactNode;
};

const accentByKind: Record<ApplicationVisualKind, { from: string; mid: string; to: string }> = {
  "neural-network": { from: "#06b6d4", mid: "#8b5cf6", to: "#22c55e" },
  "computer-graphics": { from: "#38bdf8", mid: "#6366f1", to: "#f97316" },
  robotics: { from: "#14b8a6", mid: "#8b5cf6", to: "#f59e0b" },
  "data-compression": { from: "#06b6d4", mid: "#64748b", to: "#a855f7" },
  pca: { from: "#22d3ee", mid: "#f59e0b", to: "#7c3aed" },
  "image-processing": { from: "#0ea5e9", mid: "#22c55e", to: "#e879f9" },
  "game-physics": { from: "#f97316", mid: "#06b6d4", to: "#84cc16" },
  "transform-3d": { from: "#22d3ee", mid: "#a855f7", to: "#f43f5e" },
  "gradient-descent": { from: "#38bdf8", mid: "#f59e0b", to: "#22c55e" },
  "signal-processing": { from: "#06b6d4", mid: "#84cc16", to: "#8b5cf6" },
  gps: { from: "#22c55e", mid: "#06b6d4", to: "#f59e0b" },
  cryptography: { from: "#64748b", mid: "#8b5cf6", to: "#06b6d4" },
  radar: { from: "#22d3ee", mid: "#10b981", to: "#f97316" },
  "medical-imaging": { from: "#ec4899", mid: "#22d3ee", to: "#8b5cf6" },
  "pricing-models": { from: "#14b8a6", mid: "#06b6d4", to: "#f59e0b" },
  "break-even": { from: "#ef4444", mid: "#64748b", to: "#22c55e" },
  "motion-model": { from: "#38bdf8", mid: "#f97316", to: "#a855f7" },
  "linear-model": { from: "#06b6d4", mid: "#8b5cf6", to: "#22c55e" },
  physics: { from: "#38bdf8", mid: "#f59e0b", to: "#ef4444" },
  optimization: { from: "#22c55e", mid: "#f59e0b", to: "#8b5cf6" },
  economics: { from: "#14b8a6", mid: "#f59e0b", to: "#64748b" },
  engineering: { from: "#64748b", mid: "#06b6d4", to: "#f97316" },
  architecture: { from: "#64748b", mid: "#06b6d4", to: "#f59e0b" },
  "game-design": { from: "#f97316", mid: "#22c55e", to: "#8b5cf6" },
  "ar-vr": { from: "#22d3ee", mid: "#8b5cf6", to: "#ec4899" },
  electrical: { from: "#f59e0b", mid: "#06b6d4", to: "#8b5cf6" },
  quantum: { from: "#8b5cf6", mid: "#22d3ee", to: "#ec4899" },
  waves: { from: "#06b6d4", mid: "#22c55e", to: "#8b5cf6" },
  "frequency-analysis": { from: "#22d3ee", mid: "#f59e0b", to: "#ec4899" },
};

export default function ApplicationVisualCard({ title, description, visual, meta, compact = false, children }: ApplicationVisualCardProps) {
  const accent = accentByKind[visual];
  return (
    <article className="group rounded-xl border border-slate-200 bg-white/75 p-3 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-950/10 dark:border-white/10 dark:bg-white/5 dark:hover:border-cyan-300/30">
      <ApplicationArtwork kind={visual} title={title} accent={accent} compact={compact} />
      <div className={compact ? "mt-2" : "mt-3"}>
        {meta && <p className="text-[11px] font-black uppercase tracking-normal text-cyan-700 dark:text-cyan-200">{meta}</p>}
        <h3 className="mt-1 break-words text-sm font-black text-slate-950 dark:text-white">{title}</h3>
        <p className="mt-1.5 text-xs leading-5 text-slate-600 dark:text-slate-300">{description}</p>
        {children}
      </div>
    </article>
  );
}

function ApplicationArtwork({ kind, title, accent, compact }: { kind: ApplicationVisualKind; title: string; accent: { from: string; mid: string; to: string }; compact: boolean }) {
  const height = compact ? 82 : 104;
  const id = `app-art-${kind.replace(/[^a-z0-9]/g, "-")}`;
  return (
    <svg className="block w-full overflow-hidden rounded-lg border border-slate-200/80 bg-slate-950 shadow-inner dark:border-white/10" viewBox={`0 0 320 ${height}`} role="img" aria-label={`${title} application image`}>
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#020617" />
          <stop offset="52%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#111827" />
        </linearGradient>
        <linearGradient id={`${id}-accent`} x1="0" x2="1">
          <stop offset="0%" stopColor={accent.from} />
          <stop offset="52%" stopColor={accent.mid} />
          <stop offset="100%" stopColor={accent.to} />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor={accent.mid} stopOpacity="0.35" />
          <stop offset="100%" stopColor={accent.mid} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height={height} fill={`url(#${id}-bg)`} />
      <rect width="320" height={height} fill={`url(#${id}-glow)`} />
      <Grid height={height} />
      <ArtworkShape kind={kind} height={height} gradientId={`${id}-accent`} accent={accent} />
    </svg>
  );
}

function Grid({ height }: { height: number }) {
  return (
    <g opacity="0.18" stroke="#cbd5e1" strokeWidth="1">
      {[40, 80, 120, 160, 200, 240, 280].map((x) => <line key={`x-${x}`} x1={x} y1="0" x2={x - 28} y2={height} />)}
      {[24, 48, 72, 96].map((y) => <line key={`y-${y}`} x1="0" y1={y} x2="320" y2={y} />)}
    </g>
  );
}

function ArtworkShape({ kind, height, gradientId, accent }: { kind: ApplicationVisualKind; height: number; gradientId: string; accent: { from: string; mid: string; to: string } }) {
  if (["neural-network", "linear-model"].includes(kind)) {
    return (
      <g>
        {[48, 96, 144].map((y) => <circle key={`l-${y}`} cx="66" cy={height - y * 0.65} r="8" fill={accent.from} />)}
        {[42, 76, 110].map((y) => <circle key={`m-${y}`} cx="156" cy={height - y * 0.65} r="8" fill={accent.mid} />)}
        {[58, 100].map((y) => <circle key={`r-${y}`} cx="246" cy={height - y * 0.65} r="9" fill={accent.to} />)}
        {[36, 66, 96].map((a) => [42, 76, 110].map((b) => <line key={`${a}-${b}`} x1="74" y1={height - a * 0.65} x2="148" y2={height - b * 0.65} stroke={`url(#${gradientId})`} strokeWidth="2" opacity="0.55" />))}
        {[42, 76, 110].map((a) => [58, 100].map((b) => <line key={`${a}-${b}`} x1="164" y1={height - a * 0.65} x2="237" y2={height - b * 0.65} stroke={`url(#${gradientId})`} strokeWidth="2" opacity="0.55" />))}
      </g>
    );
  }
  if (["computer-graphics", "transform-3d", "game-design", "ar-vr"].includes(kind)) {
    return (
      <g fill="none" stroke={`url(#${gradientId})`} strokeWidth="4" strokeLinejoin="round">
        <path d="M74 72 L138 36 L214 58 L150 94 Z" fill={accent.from} opacity="0.22" />
        <path d="M138 36 L138 66 L150 94" />
        <path d="M214 58 L214 86 L150 94" />
        <path d="M74 72 L74 100 L150 128 L214 86" opacity="0.55" transform={`translate(0 ${height - 132})`} />
        <circle cx="246" cy={height - 34} r="12" fill={accent.to} stroke="none" />
      </g>
    );
  }
  if (["robotics", "engineering"].includes(kind)) {
    return (
      <g stroke={`url(#${gradientId})`} strokeWidth="9" strokeLinecap="round" fill="none">
        <path d={`M74 ${height - 24} L124 ${height - 58} L180 ${height - 38} L236 ${height - 72}`} />
        {[74, 124, 180, 236].map((x, index) => <circle key={x} cx={x} cy={[height - 24, height - 58, height - 38, height - 72][index]} r="11" fill="#020617" stroke={index % 2 ? accent.mid : accent.from} strokeWidth="4" />)}
        <path d={`M232 ${height - 75} l24 -12 M232 ${height - 70} l28 4`} stroke={accent.to} strokeWidth="5" />
      </g>
    );
  }
  if (["data-compression", "pca", "image-processing", "medical-imaging"].includes(kind)) {
    return (
      <g>
        {[0, 1, 2, 3, 4].map((row) => [0, 1, 2, 3, 4, 5].map((col) => <rect key={`${row}-${col}`} x={54 + col * 22} y={height - 86 + row * 15} width="16" height="10" rx="2" fill={col + row > 5 ? accent.mid : accent.from} opacity={0.35 + ((row + col) % 4) * 0.16} />))}
        <path d={`M204 ${height - 74} C230 ${height - 88}, 244 ${height - 40}, 274 ${height - 56}`} fill="none" stroke={accent.to} strokeWidth="5" strokeLinecap="round" />
        <line x1="202" y1={height - 48} x2="278" y2={height - 78} stroke={accent.mid} strokeWidth="3" strokeDasharray="6 5" />
      </g>
    );
  }
  if (["game-physics", "physics", "motion-model"].includes(kind)) {
    return (
      <g fill="none" strokeLinecap="round">
        <path d={`M38 ${height - 24} C92 ${height - 92}, 158 ${height - 6}, 242 ${height - 66}`} stroke={`url(#${gradientId})`} strokeWidth="5" />
        <circle cx="96" cy={height - 62} r="12" fill={accent.from} />
        <circle cx="218" cy={height - 52} r="10" fill={accent.to} />
        <path d={`M154 ${height - 40} l42 -22`} stroke={accent.mid} strokeWidth="4" markerEnd="" />
        <path d={`M194 ${height - 62} l-8 -1 l5 7`} stroke={accent.mid} strokeWidth="4" />
      </g>
    );
  }
  if (["gradient-descent", "optimization", "economics", "pricing-models", "break-even"].includes(kind)) {
    return (
      <g fill="none" strokeLinecap="round">
        <path d={`M38 ${height - 28} C82 ${height - 86}, 114 ${height - 12}, 152 ${height - 54} S234 ${height - 82}, 284 ${height - 32}`} stroke="#94a3b8" strokeWidth="2" opacity="0.45" />
        <polyline points={`54,${height - 30} 98,${height - 52} 140,${height - 42} 184,${height - 70} 238,${height - 60} 282,${height - 86}`} stroke={`url(#${gradientId})`} strokeWidth="5" />
        {[98, 184, 238].map((x, index) => <circle key={x} cx={x} cy={[height - 52, height - 70, height - 60][index]} r="7" fill={index === 1 ? accent.to : accent.from} />)}
      </g>
    );
  }
  if (["signal-processing", "radar", "waves", "electrical", "frequency-analysis", "quantum"].includes(kind)) {
    return (
      <g fill="none" strokeLinecap="round">
        <path d={`M34 ${height / 2} C54 18, 74 18, 94 ${height / 2} S134 ${height - 18}, 154 ${height / 2} S194 18, 214 ${height / 2} S254 ${height - 18}, 286 ${height / 2}`} stroke={`url(#${gradientId})`} strokeWidth="5" />
        {[72, 154, 236].map((x) => <circle key={x} cx={x} cy={height / 2} r="24" stroke={accent.mid} strokeWidth="2" opacity="0.4" />)}
        <line x1="38" y1={height - 20} x2="286" y2={height - 20} stroke="#94a3b8" strokeWidth="2" opacity="0.35" />
      </g>
    );
  }
  if (kind === "gps") {
    return (
      <g fill="none" strokeLinecap="round">
        <path d={`M52 ${height - 26} L160 ${height - 78} L272 ${height - 34}`} stroke="#94a3b8" strokeWidth="2" opacity="0.45" />
        {[52, 160, 272].map((x, index) => <circle key={x} cx={x} cy={[height - 26, height - 78, height - 34][index]} r={index === 1 ? 34 : 22} stroke={index === 1 ? accent.mid : accent.from} strokeWidth="3" opacity="0.75" />)}
        <circle cx="160" cy={height - 56} r="8" fill={accent.to} />
      </g>
    );
  }
  if (kind === "cryptography") {
    return (
      <g>
        <rect x="78" y={height - 74} width="164" height="48" rx="10" fill="none" stroke={`url(#${gradientId})`} strokeWidth="4" />
        <path d={`M112 ${height - 74} C112 ${height - 110}, 208 ${height - 110}, 208 ${height - 74}`} fill="none" stroke={accent.mid} strokeWidth="8" strokeLinecap="round" />
        {[116, 144, 172, 200].map((x) => <rect key={x} x={x} y={height - 54} width="12" height="12" rx="3" fill={accent.to} />)}
      </g>
    );
  }
  if (["architecture"].includes(kind)) {
    return (
      <g fill="none" stroke={`url(#${gradientId})`} strokeWidth="4" strokeLinejoin="round">
        <path d={`M56 ${height - 22} L116 ${height - 82} L176 ${height - 22} Z`} fill={accent.from} opacity="0.2" />
        <path d={`M128 ${height - 22} L202 ${height - 96} L276 ${height - 22} Z`} fill={accent.mid} opacity="0.18" />
        <line x1="34" y1={height - 22} x2="294" y2={height - 22} stroke="#cbd5e1" opacity="0.45" />
      </g>
    );
  }
  return (
    <g fill="none" stroke={`url(#${gradientId})`} strokeWidth="5" strokeLinecap="round">
      <circle cx="92" cy={height - 52} r="28" />
      <circle cx="160" cy={height - 52} r="28" />
      <circle cx="228" cy={height - 52} r="28" />
      <path d={`M68 ${height - 30} C112 ${height - 78}, 206 ${height - 78}, 252 ${height - 30}`} />
    </g>
  );
}
