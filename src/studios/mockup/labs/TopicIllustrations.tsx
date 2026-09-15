import type { ReactNode } from "react";

function Frame({ children, bg = "#f8fbff" }: { children: ReactNode; bg?: string }) {
  return (
    <svg className="msk-art" viewBox="0 0 220 92" aria-hidden="true">
      <rect width="220" height="92" rx="12" fill={bg} />
      {children}
    </svg>
  );
}

export function TopicIllustration({ pageId }: { pageId: string }) {
  switch (pageId) {
    case "unit-circle":
      return <Frame bg="#0b1220"><circle cx="110" cy="46" r="28" fill="none" stroke="#22d3ee" strokeWidth="2.4" /><line x1="110" y1="46" x2="132" y2="28" stroke="#c4b5fd" strokeWidth="2" /><circle cx="132" cy="28" r="4" fill="#fbbf24" /><line x1="78" y1="46" x2="142" y2="46" stroke="#64748b" /><line x1="110" y1="18" x2="110" y2="74" stroke="#64748b" /></Frame>;
    case "right-triangle":
      return <Frame><polygon points="48,72 168,72 48,24" fill="none" stroke="#147df2" strokeWidth="2" /><rect x="48" y="60" width="10" height="10" fill="none" stroke="#1e293b" /></Frame>;
    case "graphs":
      return <Frame><path d="M20 46 C 50 12, 80 80, 110 46 S 170 12, 200 46" fill="none" stroke="#08b9dd" strokeWidth="2" /><path d="M20 46 C 50 80, 80 12, 110 46 S 170 80, 200 46" fill="none" stroke="#8b45f4" strokeWidth="2" /></Frame>;
    case "identities":
      return (
        <Frame bg="#0b1220">
          <circle cx="58" cy="46" r="26" fill="none" stroke="#22d3ee" strokeWidth="2.2" />
          <line x1="58" y1="46" x2="78" y2="28" stroke="#c4b5fd" strokeWidth="2" />
          <text x="128" y="42" textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="800">sin²θ+cos²θ</text>
          <text x="128" y="62" textAnchor="middle" fill="#67e8f9" fontSize="16" fontWeight="800">= 1</text>
        </Frame>
      );
    case "inverse":
      return <Frame bg="#0b1220"><path d="M30 70 C 70 70, 90 20, 190 20" fill="none" stroke="#c4b5fd" strokeWidth="2.4" /><circle cx="110" cy="46" r="4" fill="#fbbf24" /><text x="168" y="28" fill="#67e8f9" fontSize="11">arcsin</text></Frame>;
    case "waves":
      return <Frame bg="#0b1220"><path d="M16 46 C 36 16, 56 76, 76 46 S 116 16, 136 46 S 176 76, 204 46" fill="none" stroke="#22d3ee" strokeWidth="2.4" /><path d="M16 46 C 36 76, 56 16, 76 46 S 116 76, 136 46" fill="none" stroke="#fbbf24" strokeWidth="1.8" /></Frame>;
    case "ar":
      return <Frame bg="#0b1220"><rect x="80" y="22" width="36" height="52" rx="6" fill="none" stroke="#22d3ee" strokeWidth="2" /><polygon points="50,70 110,28 150,70" fill="none" stroke="#fbbf24" strokeWidth="2" /></Frame>;
    case "oblique":
      return <Frame><polygon points="40,70 170,70 120,22" fill="none" stroke="#147df2" strokeWidth="2" /><text x="96" y="82" fill="#64748b" fontSize="10">SAS / SSS</text></Frame>;
    case "applications":
      return <Frame><polygon points="40,70 150,70 150,28" fill="#e0f7ff" stroke="#147df2" /><circle cx="150" cy="28" r="3" fill="#f59e0b" /><text x="168" y="32" fontSize="10" fill="#334155">h</text></Frame>;
    case "construction":
      return <Frame><line x1="30" y1="70" x2="190" y2="24" stroke="#147df2" /><circle cx="110" cy="46" r="26" fill="none" stroke="#8b45f4" /><circle cx="70" cy="58" r="3" fill="#f59e0b" /></Frame>;
    case "triangles":
      return <Frame><polygon points="50,70 110,18 170,70" fill="none" stroke="#147df2" strokeWidth="2" /><circle cx="110" cy="52" r="3" fill="#8b45f4" /></Frame>;
    case "circles":
      return <Frame><circle cx="110" cy="46" r="28" fill="none" stroke="#08b9dd" strokeWidth="2" /><line x1="82" y1="46" x2="138" y2="46" stroke="#f59e0b" /><circle cx="110" cy="46" r="3" fill="#147df2" /></Frame>;
    case "polygons":
      return <Frame><polygon points="110,14 154,40 138,82 82,82 66,40" fill="none" stroke="#8b45f4" strokeWidth="2" /></Frame>;
    case "transformations":
      return <Frame><polygon points="40,64 80,30 110,70" fill="#d9f6ff" stroke="#147df2" /><polygon points="120,54 168,24 196,68" fill="#efe4ff" stroke="#8b45f4" /></Frame>;
    case "coordinate":
      return <Frame><line x1="24" y1="70" x2="196" y2="70" stroke="#94a3b8" /><line x1="40" y1="16" x2="40" y2="80" stroke="#94a3b8" /><circle cx="120" cy="34" r="4" fill="#08b9dd" /></Frame>;
    case "measurement":
      return <Frame><polygon points="50,70 170,70 170,34" fill="none" stroke="#147df2" /><text x="86" y="84" fontSize="10" fill="#64748b">5 cm</text></Frame>;
    case "proofs":
      return <Frame><polygon points="40,70 160,70 40,24" fill="none" stroke="#147df2" /><text x="70" y="44" fontSize="11" fill="#8b45f4">∠B = ∠C</text></Frame>;
    case "solids":
      return <Frame><path d="M80 28 L140 28 L160 48 L160 72 L100 72 L80 52 Z" fill="none" stroke="#147df2" /><path d="M80 28 L100 48 L160 48" stroke="#8b45f4" /></Frame>;
    case "vectors":
      return (
        <Frame bg="#eef7ff">
          <line x1="36" y1="78" x2="196" y2="78" stroke="#94a3b8" strokeWidth="1.2" />
          <line x1="36" y1="78" x2="36" y2="14" stroke="#94a3b8" strokeWidth="1.2" />
          <polygon points="36,78 118,22 118,78" fill="rgba(20,125,242,.12)" stroke="#147df2" strokeWidth="1.4" />
          <line x1="36" y1="78" x2="118" y2="22" stroke="#147df2" strokeWidth="2.4" markerEnd="url(#la-arr)" />
          <line x1="36" y1="78" x2="168" y2="58" stroke="#8b45f4" strokeWidth="2.4" />
          <text x="122" y="20" fill="#147df2" fontSize="11" fontWeight="800">u</text>
          <text x="174" y="56" fill="#8b45f4" fontSize="11" fontWeight="800">v</text>
        </Frame>
      );
    case "matrices":
      return (
        <Frame bg="#f6f0ff">
          <text x="52" y="28" fill="#8b45f4" fontSize="11" fontFamily="Georgia">⎡</text>
          <text x="64" y="26" fill="#334155" fontSize="11">a₁₁  a₁₂  ⋯  a₁ₙ</text>
          <text x="64" y="46" fill="#334155" fontSize="11">a₂₁  a₂₂  ⋯  a₂ₙ</text>
          <text x="76" y="64" fill="#94a3b8" fontSize="12">⋮     ⋮      ⋱   ⋮</text>
          <text x="64" y="82" fill="#334155" fontSize="11">aₘ₁  aₘ₂  ⋯  aₘₙ</text>
        </Frame>
      );
    case "row-reduction":
      return (
        <Frame bg="#e8fbff">
          <polygon points="30,70 190,58 160,18 50,28" fill="rgba(8,185,221,.22)" stroke="#08b9dd" />
          <polygon points="40,78 200,70 170,32 70,40" fill="rgba(139,69,244,.18)" stroke="#8b45f4" />
          <line x1="40" y1="74" x2="176" y2="36" stroke="#f59e0b" strokeWidth="2" />
          <text x="118" y="16" fill="#0e7490" fontSize="10" fontWeight="800">Ax = b</text>
        </Frame>
      );
    case "linear-transforms":
      return (
        <Frame bg="#f4f0ff">
          <rect x="28" y="34" width="48" height="40" fill="#d9f6ff" stroke="#147df2" />
          <polygon points="108,74 188,74 168,24 128,24" fill="#efe4ff" stroke="#8b45f4" />
          <path d="M80 54h24" stroke="#64748b" strokeWidth="1.6" markerEnd="url(#la-arr)" />
          <text x="92" y="48" fill="#8b45f4" fontSize="11" fontWeight="800">T</text>
        </Frame>
      );
    case "determinants":
      return (
        <Frame bg="#fff7ed">
          <path d="M70 70 L150 70 L178 28 L98 22 Z" fill="rgba(245,158,11,.2)" stroke="#f59e0b" />
          <path d="M70 70 L98 22 L98 52 Z" fill="none" stroke="#fb923c" />
          <text x="108" y="56" fill="#c2410c" fontSize="11" fontWeight="800">det(A)=2.50</text>
        </Frame>
      );
    case "vector-spaces":
      return (
        <Frame bg="#ecfdf5">
          <polygon points="36,74 196,74 156,22 70,30" fill="rgba(20,125,242,.16)" stroke="#147df2" />
          <polygon points="70,74 170,70 130,28" fill="rgba(16,185,129,.2)" stroke="#10b981" />
          <line x1="40" y1="74" x2="40" y2="18" stroke="#94a3b8" />
        </Frame>
      );
    case "eigenvectors":
      return (
        <Frame bg="#eef4ff">
          <ellipse cx="110" cy="48" rx="62" ry="28" fill="none" stroke="#94a3b8" />
          <line x1="48" y1="70" x2="172" y2="22" stroke="#8b45f4" strokeWidth="2.2" />
          <line x1="70" y1="22" x2="150" y2="74" stroke="#147df2" strokeWidth="2" />
          <text x="176" y="24" fill="#8b45f4" fontSize="11" fontWeight="800">λ₁</text>
          <text x="154" y="80" fill="#147df2" fontSize="11" fontWeight="800">λ₂</text>
        </Frame>
      );
    case "orthogonality":
      return (
        <Frame bg="#eefbff">
          <line x1="40" y1="74" x2="190" y2="74" stroke="#147df2" strokeWidth="2.2" />
          <line x1="110" y1="74" x2="110" y2="18" stroke="#8b45f4" strokeWidth="2.2" />
          <rect x="110" y="62" width="12" height="12" fill="none" stroke="#0f172a" />
        </Frame>
      );
    case "least-squares":
      return (
        <Frame bg="#ecfdf5">
          <circle cx="48" cy="64" r="3.2" fill="#147df2" /><circle cx="86" cy="48" r="3.2" fill="#147df2" />
          <circle cx="124" cy="42" r="3.2" fill="#147df2" /><circle cx="162" cy="28" r="3.2" fill="#147df2" />
          <circle cx="92" cy="62" r="3.2" fill="#10b981" />
          <line x1="30" y1="72" x2="196" y2="18" stroke="#8b45f4" strokeWidth="2" />
        </Frame>
      );
    case "playground":
      return (
        <Frame bg="#f5f0ff">
          <path d="M28 70 C 70 18, 120 82, 196 28" fill="none" stroke="#8b45f4" strokeWidth="2" />
          <path d="M40 78 C 80 40, 130 70, 190 36" fill="rgba(139,69,244,.18)" stroke="#08b9dd" />
        </Frame>
      );
    case "argand-plane":
      return <Frame><line x1="24" y1="70" x2="200" y2="70" stroke="#94a3b8" /><line x1="40" y1="16" x2="40" y2="80" stroke="#94a3b8" /><line x1="40" y1="70" x2="150" y2="28" stroke="#147df2" /><circle cx="150" cy="28" r="4" fill="#147df2" /></Frame>;
    case "arithmetic":
      return <Frame><text x="110" y="54" textAnchor="middle" fill="#147df2" fontSize="22">z₁ ⊕ z₂</text></Frame>;
    case "polar-forms":
      return <Frame><line x1="40" y1="70" x2="170" y2="24" stroke="#8b45f4" /><path d="M70 70 A 40 40 0 0 0 150 40" fill="none" stroke="#f59e0b" /></Frame>;
    case "rotation":
      return <Frame><circle cx="110" cy="46" r="26" fill="none" stroke="#94a3b8" /><path d="M110 46 L150 30" stroke="#147df2" /><path d="M110 46 L140 66" stroke="#8b45f4" /></Frame>;
    case "roots":
      return <Frame><circle cx="110" cy="46" r="28" fill="none" stroke="#94a3b8" /><circle cx="110" cy="18" r="3" fill="#147df2" /><circle cx="138" cy="58" r="3" fill="#8b45f4" /><circle cx="82" cy="58" r="3" fill="#f59e0b" /></Frame>;
    case "euler":
      return <Frame><text x="110" y="54" textAnchor="middle" fill="#147df2" fontSize="18">{`e^{iθ}`}</text></Frame>;
    case "loci":
      return <Frame><circle cx="70" cy="46" r="22" fill="none" stroke="#147df2" /><path d="M120 46 C 140 20, 170 20, 190 46" fill="none" stroke="#8b45f4" /></Frame>;
    case "fractals":
      return <Frame bg="#0b1220"><circle cx="110" cy="46" r="8" fill="#111827" stroke="#64748b" /><circle cx="90" cy="36" r="5" fill="#111827" /><circle cx="128" cy="54" r="6" fill="#111827" /></Frame>;
    case "waves-circuits":
      return <Frame><path d="M20 46 h40 l8-16 16 32 16-32 8 16 h40" fill="none" stroke="#08b9dd" /><rect x="150" y="34" width="40" height="24" fill="none" stroke="#8b45f4" /></Frame>;
    case "motion":
      return <Frame><path d="M20 70 Q 110 8 200 70" fill="none" stroke="#147df2" strokeWidth="2" /><circle cx="110" cy="24" r="4" fill="#f59e0b" /></Frame>;
    case "population":
      return <Frame><path d="M20 70 C 60 68, 90 20, 200 18" fill="none" stroke="#8b45f4" strokeWidth="2" /></Frame>;
    case "epidemics":
      return <Frame><path d="M20 70 C 70 70, 90 18, 130 28 S 200 70 200 70" fill="none" stroke="#ef4444" strokeWidth="2" /></Frame>;
    case "finance":
      return <Frame><polyline points="20,70 50,60 80,64 110,40 140,46 180,22" fill="none" stroke="#10b981" strokeWidth="2" /></Frame>;
    case "optimization":
      return <Frame><polygon points="40,70 160,70 150,28 70,22" fill="#eef6ff" stroke="#147df2" /><circle cx="120" cy="36" r="4" fill="#f59e0b" /></Frame>;
    case "networks":
      return <Frame><circle cx="50" cy="30" r="5" fill="#147df2" /><circle cx="160" cy="28" r="5" fill="#8b45f4" /><circle cx="90" cy="70" r="5" fill="#08b9dd" /><line x1="50" y1="30" x2="160" y2="28" stroke="#94a3b8" /><line x1="50" y1="30" x2="90" y2="70" stroke="#94a3b8" /><line x1="160" y1="28" x2="90" y2="70" stroke="#08b9dd" /></Frame>;
    case "regression":
      return <Frame><circle cx="50" cy="62" r="3" fill="#147df2" /><circle cx="90" cy="48" r="3" fill="#147df2" /><circle cx="140" cy="40" r="3" fill="#147df2" /><line x1="30" y1="70" x2="200" y2="24" stroke="#8b45f4" /></Frame>;
    case "periodic":
      return <Frame><path d="M16 46 C 40 16, 60 76, 84 46 S 128 16, 152 46 S 196 76, 210 46" fill="none" stroke="#08b9dd" strokeWidth="2" /></Frame>;
    case "numerical":
      return <Frame>{Array.from({ length: 18 }, (_, i) => <circle key={i} cx={20 + (i % 6) * 32} cy={22 + Math.floor(i / 6) * 22} r="4" fill={i % 3 ? "#147df2" : "#f59e0b"} />)}</Frame>;
    case "comparison":
      return <Frame><rect x="40" y="40" width="18" height="36" fill="#08b9dd" /><rect x="80" y="24" width="18" height="52" fill="#8b45f4" /><rect x="120" y="34" width="18" height="42" fill="#f59e0b" /></Frame>;
    case "number-sense":
      return <Frame><line x1="20" y1="46" x2="200" y2="46" stroke="#1e293b" /><circle cx="70" cy="46" r="4" fill="#147df2" /><circle cx="140" cy="46" r="4" fill="#8b45f4" /></Frame>;
    case "primes":
      return <Frame><text x="30" y="38" fill="#64748b" fontSize="11">2 3 5 7</text><text x="30" y="62" fill="#147df2" fontSize="11">11 13 17 19</text></Frame>;
    case "modular-arithmetic":
      return <Frame><circle cx="110" cy="46" r="28" fill="none" stroke="#8b45f4" /><text x="110" y="50" textAnchor="middle" fill="#147df2" fontSize="11">mod n</text></Frame>;
    case "number-patterns":
      return <Frame><circle cx="70" cy="60" r="4" fill="#147df2" /><circle cx="110" cy="40" r="4" fill="#147df2" /><circle cx="110" cy="60" r="4" fill="#8b45f4" /><circle cx="150" cy="24" r="4" fill="#147df2" /><circle cx="150" cy="40" r="4" fill="#8b45f4" /><circle cx="150" cy="60" r="4" fill="#f59e0b" /></Frame>;
    case "combinatorics":
      return <Frame><line x1="110" y1="16" x2="70" y2="46" stroke="#94a3b8" /><line x1="110" y1="16" x2="150" y2="46" stroke="#94a3b8" /><line x1="70" y1="46" x2="50" y2="76" stroke="#94a3b8" /><line x1="70" y1="46" x2="90" y2="76" stroke="#94a3b8" /><circle cx="110" cy="16" r="4" fill="#147df2" /></Frame>;
    case "logic":
      return <Frame><text x="40" y="40" fill="#334155" fontSize="12">P → Q</text><text x="40" y="64" fill="#147df2" fontSize="12">T T T</text></Frame>;
    case "sets":
      return <Frame><circle cx="90" cy="46" r="26" fill="rgba(8,185,221,.18)" stroke="#08b9dd" /><circle cx="130" cy="46" r="26" fill="rgba(139,69,244,.16)" stroke="#8b45f4" /></Frame>;
    case "algorithms":
      return <Frame><text x="36" y="40" fill="#334155" fontSize="11">for i = 1..n:</text><text x="36" y="62" fill="#147df2" fontSize="11">count++</text></Frame>;
    case "cryptography":
      return <Frame><rect x="80" y="24" width="36" height="28" rx="6" fill="none" stroke="#8b45f4" strokeWidth="2" /><rect x="88" y="48" width="20" height="22" rx="3" fill="#8b45f4" /></Frame>;
    case "data-explorer":
      return <Frame><circle cx="50" cy="60" r="3" fill="#147df2" /><circle cx="90" cy="36" r="3" fill="#147df2" /><circle cx="140" cy="50" r="3" fill="#8b45f4" /><circle cx="180" cy="28" r="3" fill="#08b9dd" /></Frame>;
    case "descriptive":
      return <Frame><rect x="40" y="50" width="18" height="26" fill="#08b9dd" /><rect x="70" y="30" width="18" height="46" fill="#147df2" /><rect x="100" y="40" width="18" height="36" fill="#8b45f4" /><rect x="130" y="22" width="18" height="54" fill="#f59e0b" /></Frame>;
    case "interactive-distributions":
      return <Frame><path d="M20 70 C 60 70, 80 16, 110 16 S 160 70 200 70" fill="none" stroke="#8b45f4" strokeWidth="2" /></Frame>;
    case "experiments":
      return <Frame><rect x="70" y="24" width="28" height="28" rx="4" fill="#147df2" /><circle cx="140" cy="50" r="16" fill="none" stroke="#8b45f4" strokeWidth="3" /></Frame>;
    case "counting":
      return <Frame><circle cx="70" cy="30" r="4" fill="#147df2" /><circle cx="110" cy="30" r="4" fill="#8b45f4" /><circle cx="150" cy="30" r="4" fill="#f59e0b" /><circle cx="90" cy="62" r="4" fill="#08b9dd" /><circle cx="130" cy="62" r="4" fill="#147df2" /></Frame>;
    case "clt":
      return <Frame><path d="M20 70 C 50 70, 80 20, 110 20 S 170 70 200 70" fill="none" stroke="#147df2" strokeWidth="2" /></Frame>;
    case "confidence-intervals":
      return <Frame><line x1="30" y1="46" x2="190" y2="46" stroke="#94a3b8" /><line x1="70" y1="36" x2="160" y2="36" stroke="#147df2" strokeWidth="3" /><circle cx="115" cy="36" r="4" fill="#f59e0b" /></Frame>;
    case "hypothesis":
      return <Frame><path d="M20 70 C 60 70, 90 18, 110 18 S 160 70 200 70" fill="none" stroke="#8b45f4" /><line x1="150" y1="16" x2="150" y2="76" stroke="#ef4444" strokeDasharray="4 3" /></Frame>;
    case "correlation":
      return <Frame><circle cx="50" cy="64" r="3" fill="#147df2" /><circle cx="90" cy="48" r="3" fill="#147df2" /><circle cx="140" cy="36" r="3" fill="#147df2" /><line x1="30" y1="72" x2="190" y2="24" stroke="#8b45f4" /></Frame>;
    case "anova":
      return <Frame><rect x="50" y="30" width="14" height="40" fill="#08b9dd" /><rect x="90" y="20" width="14" height="50" fill="#8b45f4" /><rect x="130" y="36" width="14" height="34" fill="#f59e0b" /></Frame>;
    default:
      return <Frame><path d="M16 60 C 50 20, 90 72, 130 36 S 190 20, 206 54" fill="none" stroke="#08b9dd" strokeWidth="2" /></Frame>;
  }
}
