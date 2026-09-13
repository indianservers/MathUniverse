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
      return <Frame><circle cx="110" cy="46" r="28" fill="none" stroke="#08b9dd" strokeWidth="2" /><line x1="110" y1="46" x2="132" y2="28" stroke="#8b45f4" /><circle cx="132" cy="28" r="3.5" fill="#f59e0b" /><line x1="78" y1="46" x2="142" y2="46" stroke="#94a3b8" /><line x1="110" y1="18" x2="110" y2="74" stroke="#94a3b8" /></Frame>;
    case "right-triangle":
      return <Frame><polygon points="48,72 168,72 48,24" fill="none" stroke="#147df2" strokeWidth="2" /><rect x="48" y="60" width="10" height="10" fill="none" stroke="#1e293b" /></Frame>;
    case "graphs":
      return <Frame><path d="M20 46 C 50 12, 80 80, 110 46 S 170 12, 200 46" fill="none" stroke="#08b9dd" strokeWidth="2" /><path d="M20 46 C 50 80, 80 12, 110 46 S 170 80, 200 46" fill="none" stroke="#8b45f4" strokeWidth="2" /></Frame>;
    case "identities":
      return <Frame><text x="110" y="52" textAnchor="middle" fill="#147df2" fontSize="18" fontWeight="800">sin²θ+cos²θ=1</text></Frame>;
    case "inverse":
      return <Frame><path d="M30 70 C 70 70, 90 20, 190 20" fill="none" stroke="#8b45f4" strokeWidth="2.2" /><circle cx="110" cy="46" r="3" fill="#f59e0b" /></Frame>;
    case "oblique":
      return <Frame><polygon points="40,70 170,70 120,22" fill="none" stroke="#147df2" strokeWidth="2" /><text x="96" y="82" fill="#64748b" fontSize="10">SAS / SSS</text></Frame>;
    case "waves":
      return <Frame><path d="M16 46 C 36 16, 56 76, 76 46 S 116 16, 136 46 S 176 76, 204 46" fill="none" stroke="#8b45f4" strokeWidth="2" /></Frame>;
    case "applications":
      return <Frame><polygon points="40,70 150,70 150,28" fill="#e0f7ff" stroke="#147df2" /><circle cx="150" cy="28" r="3" fill="#f59e0b" /><text x="168" y="32" fontSize="10" fill="#334155">h</text></Frame>;
    case "ar":
      return <Frame><rect x="80" y="22" width="36" height="52" rx="6" fill="none" stroke="#8b45f4" /><polygon points="50,70 110,28 150,70" fill="none" stroke="#08b9dd" /></Frame>;
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
      return <Frame><line x1="40" y1="70" x2="150" y2="24" stroke="#147df2" strokeWidth="2.4" /><line x1="40" y1="70" x2="170" y2="70" stroke="#8b45f4" strokeWidth="2.4" /></Frame>;
    case "matrices":
      return <Frame><text x="110" y="54" textAnchor="middle" fill="#147df2" fontSize="22" fontFamily="Georgia">[ a b ; c d ]</text></Frame>;
    case "row-reduction":
      return <Frame><line x1="30" y1="30" x2="190" y2="70" stroke="#147df2" /><line x1="30" y1="70" x2="190" y2="28" stroke="#8b45f4" /><circle cx="110" cy="48" r="4" fill="#f59e0b" /></Frame>;
    case "linear-transforms":
      return <Frame><rect x="40" y="30" width="50" height="40" fill="#d9f6ff" stroke="#147df2" /><polygon points="110,70 190,70 170,24 130,24" fill="#efe4ff" stroke="#8b45f4" /></Frame>;
    case "determinants":
      return <Frame><polygon points="70,70 150,70 180,24 40,40" fill="rgba(245,158,11,.18)" stroke="#f59e0b" /><text x="96" y="54" fontSize="11" fill="#b45309">det</text></Frame>;
    case "vector-spaces":
      return <Frame><polygon points="40,70 190,70 150,22 70,30" fill="#eef6ff" stroke="#147df2" /><line x1="70" y1="70" x2="130" y2="28" stroke="#8b45f4" /></Frame>;
    case "eigenvectors":
      return <Frame><ellipse cx="110" cy="46" rx="60" ry="28" fill="none" stroke="#94a3b8" /><line x1="50" y1="70" x2="170" y2="22" stroke="#8b45f4" strokeWidth="2" /></Frame>;
    case "orthogonality":
      return <Frame><line x1="40" y1="70" x2="180" y2="70" stroke="#147df2" /><line x1="110" y1="70" x2="110" y2="20" stroke="#8b45f4" /></Frame>;
    case "least-squares":
      return <Frame><circle cx="50" cy="60" r="3" fill="#147df2" /><circle cx="90" cy="40" r="3" fill="#147df2" /><circle cx="140" cy="52" r="3" fill="#147df2" /><circle cx="180" cy="28" r="3" fill="#147df2" /><line x1="30" y1="70" x2="200" y2="22" stroke="#8b45f4" /></Frame>;
    case "playground":
      return <Frame><path d="M30 70 C 70 20, 120 80, 190 30" fill="none" stroke="#08b9dd" strokeWidth="2" /></Frame>;
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
      return <Frame><text x="110" y="54" textAnchor="middle" fill="#147df2" fontSize="18">e^{iθ}</text></Frame>;
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
