import type { ReactElement } from "react";
import type { MathWorkspaceId } from "../../workspace/mathWorkspaces";

type ArtProps = { className?: string };

function CasArt({ className }: ArtProps) {
  return (
    <svg className={className} viewBox="0 0 220 180" aria-hidden="true">
      <defs>
        <linearGradient id="mwc-cas-ink" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
      </defs>
      <text x="18" y="42" fill="#7c3aed" opacity="0.22" fontFamily="Georgia, serif" fontSize="22">
        f(x)
      </text>
      <text x="148" y="168" fill="#7c3aed" opacity="0.18" fontFamily="Georgia, serif" fontSize="26">
        ∫
      </text>
      <text
        x="86"
        y="118"
        fill="#6d28d9"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="92"
        fontWeight="700"
      >
        Σ
      </text>
      <text x="158" y="64" fill="#6d28d9" fontFamily="Georgia, serif" fontSize="22" opacity="0.85">
        f(x)
      </text>
    </svg>
  );
}

function Geometry2DArt({ className }: ArtProps) {
  return (
    <svg className={className} viewBox="0 0 220 180" aria-hidden="true">
      <circle cx="132" cy="92" r="46" fill="none" stroke="#67e8f9" strokeWidth="2" />
      <path d="M78 138 L132 46 L186 138 Z" fill="rgba(6,182,212,0.12)" stroke="#0891b2" strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M132 138 A18 18 0 0 1 116 124" fill="none" stroke="#0e7490" strokeWidth="2.2" />
      <text x="118" y="128" fill="#0f766e" fontSize="11" fontWeight="700">
        60°
      </text>
      <circle cx="78" cy="138" r="4.5" fill="#fff" stroke="#f59e0b" strokeWidth="2" />
      <circle cx="132" cy="46" r="4.5" fill="#fff" stroke="#f59e0b" strokeWidth="2" />
      <circle cx="186" cy="138" r="4.5" fill="#fff" stroke="#f59e0b" strokeWidth="2" />
      <path d="M58 42 l18 46 M58 42 l-16 22 M42 64 h32" fill="none" stroke="#155e75" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="58" cy="42" r="5" fill="none" stroke="#155e75" strokeWidth="2" />
    </svg>
  );
}

function Geometry3DArt({ className }: ArtProps) {
  return (
    <svg className={className} viewBox="0 0 220 180" aria-hidden="true">
      <path d="M40 150 L186 150" stroke="#93c5fd" strokeWidth="1.5" />
      <path d="M70 30 L70 150" stroke="#93c5fd" strokeWidth="1.5" />
      <path d="M70 150 L190 78" stroke="#bfdbfe" strokeWidth="1.4" />
      <path
        d="M92 108 L148 80 L176 108 L120 136 Z"
        fill="rgba(37,99,235,0.16)"
        stroke="#2563eb"
        strokeWidth="2.2"
      />
      <path d="M92 108 L92 62 L148 34 L148 80" fill="rgba(37,99,235,0.1)" stroke="#1d4ed8" strokeWidth="2.2" />
      <path d="M148 34 L176 62 L176 108 L148 80" fill="rgba(59,130,246,0.22)" stroke="#1e40af" strokeWidth="2.2" />
      <text x="188" y="76" fill="#1d4ed8" fontSize="12" fontWeight="800">
        y
      </text>
      <text x="58" y="36" fill="#1d4ed8" fontSize="12" fontWeight="800">
        z
      </text>
      <text x="192" y="156" fill="#1d4ed8" fontSize="12" fontWeight="800">
        x
      </text>
    </svg>
  );
}

function Graph2DArt({ className }: ArtProps) {
  return (
    <svg className={className} viewBox="0 0 220 180" aria-hidden="true">
      <g stroke="#bae6fd" strokeWidth="1">
        {Array.from({ length: 7 }, (_, i) => (
          <path key={`v${i}`} d={`M${40 + i * 22} 28 V152`} />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <path key={`h${i}`} d={`M32 ${40 + i * 20} H188`} />
        ))}
      </g>
      <path d="M36 150 H194 M40 24 V154" fill="none" stroke="#0284c7" strokeWidth="2" />
      <path
        d="M48 132 C 78 132, 92 42, 128 42 S 176 128, 196 86"
        fill="none"
        stroke="#0369a1"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <circle cx="92" cy="78" r="5" fill="#fff" stroke="#ea580c" strokeWidth="2.2" />
      <circle cx="128" cy="42" r="5" fill="#fff" stroke="#ea580c" strokeWidth="2.2" />
      <circle cx="168" cy="108" r="5" fill="#fff" stroke="#ea580c" strokeWidth="2.2" />
    </svg>
  );
}

function Graph3DArt({ className }: ArtProps) {
  return (
    <svg className={className} viewBox="0 0 220 180" aria-hidden="true">
      <path d="M36 128 L110 156 L198 104 L124 76 Z" fill="none" stroke="#c7d2fe" strokeWidth="1.4" />
      <path
        d="M48 118 C 78 96, 102 96, 132 118 S 176 142, 194 116"
        fill="none"
        stroke="#4f46e5"
        strokeWidth="2.4"
      />
      <path
        d="M56 108 C 86 86, 108 86, 138 108 S 176 128, 190 106"
        fill="none"
        stroke="#6366f1"
        strokeWidth="2"
      />
      <path
        d="M64 98 C 92 78, 112 78, 140 98 S 172 116, 186 96"
        fill="none"
        stroke="#818cf8"
        strokeWidth="1.8"
      />
      <path d="M70 150 L70 40 M70 150 L196 92 M70 150 L28 118" stroke="#4338ca" strokeWidth="1.8" />
      <circle cx="132" cy="90" r="3.5" fill="#4f46e5" />
    </svg>
  );
}

function ShapesArt({ className }: ArtProps) {
  return (
    <svg className={className} viewBox="0 0 220 180" aria-hidden="true">
      <rect x="36" y="96" width="44" height="44" rx="4" fill="rgba(16,185,129,0.14)" stroke="#059669" strokeWidth="2.4" />
      <circle cx="78" cy="58" r="26" fill="rgba(45,212,191,0.16)" stroke="#0d9488" strokeWidth="2.4" />
      <path d="M118 118 L148 62 L178 118 Z" fill="rgba(5,150,105,0.14)" stroke="#047857" strokeWidth="2.4" />
      <path d="M150 46 L176 32 L196 54 L170 68 Z" fill="rgba(16,185,129,0.2)" stroke="#047857" strokeWidth="2" />
      <path d="M176 32 L176 58 L196 80 L196 54" fill="rgba(13,148,136,0.28)" stroke="#065f46" strokeWidth="2" />
      <ellipse cx="198" cy="118" rx="16" ry="22" fill="rgba(20,184,166,0.18)" stroke="#0f766e" strokeWidth="2" />
    </svg>
  );
}

function CasIcon({ className }: ArtProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <rect width="48" height="48" rx="14" fill="rgba(124,58,237,0.12)" />
      <path d="M18 12c-6 0-9 4-9 9s4 8 9 8c3 0 5-1 7-2M18 36c6 0 9-4 9-9s-4-8-9-8c-3 0-5 1-7 2" fill="none" stroke="#6d28d9" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}

function Geometry2DIcon({ className }: ArtProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <rect width="48" height="48" rx="14" fill="rgba(6,182,212,0.12)" />
      <circle cx="24" cy="24" r="11" fill="none" stroke="#0891b2" strokeWidth="2" />
      <path d="M12 34 L24 12 L36 34 Z" fill="rgba(6,182,212,0.2)" stroke="#0e7490" strokeWidth="2" />
    </svg>
  );
}

function Geometry3DIcon({ className }: ArtProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <rect width="48" height="48" rx="14" fill="rgba(37,99,235,0.12)" />
      <path d="M12 28 L24 20 L36 28 L24 36 Z" fill="rgba(37,99,235,0.18)" stroke="#2563eb" strokeWidth="2" />
      <path d="M12 28 L12 18 L24 10 L24 20 M36 28 L36 18 L24 10" fill="none" stroke="#1d4ed8" strokeWidth="2" />
    </svg>
  );
}

function Graph2DIcon({ className }: ArtProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <rect width="48" height="48" rx="14" fill="rgba(2,132,199,0.12)" />
      <path d="M10 36 H38 M12 10 V38" fill="none" stroke="#0284c7" strokeWidth="2" />
      <path d="M14 32 C 20 32 22 14 28 14 S 36 30 40 22" fill="none" stroke="#0369a1" strokeWidth="2.4" />
    </svg>
  );
}

function Graph3DIcon({ className }: ArtProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <rect width="48" height="48" rx="14" fill="rgba(79,70,229,0.12)" />
      <path d="M10 32 C 18 24 24 24 30 32 S 40 38 44 28" fill="none" stroke="#4f46e5" strokeWidth="2.3" />
      <path d="M14 38 L14 12 M14 38 L40 26" stroke="#4338ca" strokeWidth="1.8" />
    </svg>
  );
}

function ShapesIcon({ className }: ArtProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <rect width="48" height="48" rx="14" fill="rgba(5,150,105,0.12)" />
      <circle cx="17" cy="18" r="7" fill="none" stroke="#0d9488" strokeWidth="2" />
      <rect x="26" y="26" width="12" height="12" rx="2" fill="none" stroke="#059669" strokeWidth="2" />
      <path d="M26 22 L34 10 L42 22 Z" fill="none" stroke="#047857" strokeWidth="2" />
    </svg>
  );
}

const illustrations: Record<MathWorkspaceId, (props: ArtProps) => ReactElement> = {
  cas: CasArt,
  geometry: Geometry2DArt,
  "geometry-3d": Geometry3DArt,
  graphs: Graph2DArt,
  "graphs-3d": Graph3DArt,
  shapes: ShapesArt,
};

const icons: Record<MathWorkspaceId, (props: ArtProps) => ReactElement> = {
  cas: CasIcon,
  geometry: Geometry2DIcon,
  "geometry-3d": Geometry3DIcon,
  graphs: Graph2DIcon,
  "graphs-3d": Graph3DIcon,
  shapes: ShapesIcon,
};

export function WorkspaceIllustration({
  id,
  className,
}: {
  id: MathWorkspaceId;
  className?: string;
}) {
  const Art = illustrations[id];
  return <Art className={className} />;
}

export function WorkspaceIcon({
  id,
  className,
}: {
  id: MathWorkspaceId;
  className?: string;
}) {
  const Icon = icons[id];
  return <Icon className={className} />;
}

export const mathWorkspaceCardTheme: Record<
  MathWorkspaceId,
  { accent: string; accentStrong: string; tint: string }
> = {
  cas: { accent: "#7c3aed", accentStrong: "#5b21b6", tint: "#f5f3ff" },
  geometry: { accent: "#06b6d4", accentStrong: "#0e7490", tint: "#ecfeff" },
  "geometry-3d": { accent: "#2563eb", accentStrong: "#1d4ed8", tint: "#eff6ff" },
  graphs: { accent: "#0284c7", accentStrong: "#0369a1", tint: "#f0f9ff" },
  "graphs-3d": { accent: "#4f46e5", accentStrong: "#4338ca", tint: "#eef2ff" },
  shapes: { accent: "#059669", accentStrong: "#047857", tint: "#ecfdf5" },
};
