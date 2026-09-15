type Props = { pageId: string; mode: string; a?: number; b?: number; n?: number };

export function ModeCanvas({ pageId, mode, a = 2, b = 1, n = 6 }: Props) {
  const label = `${pageId} · ${mode}`;
  const rad = (mode.includes("90") ? 90 : a * 20) * Math.PI / 180;
  if (pageId === "transformations") {
    const pts = [[90, 180], [150, 90], [210, 180]] as const;
    const map = (x: number, y: number) => {
      const cx = 150, cy = 150;
      if (mode === "Translate") return `${x + a * 18},${y - b * 8}`;
      if (mode === "Rotate") {
        const xr = (x - cx) * Math.cos(rad) - (y - cy) * Math.sin(rad);
        const yr = (x - cx) * Math.sin(rad) + (y - cy) * Math.cos(rad);
        return `${cx + xr},${cy + yr}`;
      }
      if (mode === "Reflect") return `${300 - x},${y}`;
      if (mode === "Dilate") return `${cx + (x - cx) * (0.6 + a * 0.2)},${cy + (y - cy) * (0.6 + a * 0.2)}`;
      return `${x + 80},${y - 20}`;
    };
    return (
      <svg className="msk-graph" viewBox="0 0 420 280" role="img" aria-label={label} data-mode-canvas={mode}>
        <rect width="420" height="280" fill="#f8fbff" />
        <line x1="210" y1="20" x2="210" y2="260" stroke="#cbd5e1" />
        <polygon points={pts.map((p) => p.join(",")).join(" ")} fill="#d9f6ff" stroke="#147df2" />
        <polygon points={pts.map(([x, y]) => map(x, y)).join(" ")} fill="#efe4ff" stroke="#8b45f4" />
        <text x="24" y="28" fill="#334155" fontSize="13">{mode}: pre-image ABC → A′B′C′</text>
      </svg>
    );
  }
  if (pageId === "proofs") {
    return (
      <svg className="msk-graph" viewBox="0 0 420 280" role="img" aria-label={label} data-mode-canvas={mode}>
        <rect width="420" height="280" fill="#f8fbff" />
        {mode === "Angle Sum" ? (
          <>
            <polygon points="80,220 340,220 210,60" fill="#e0f2fe" stroke="#147df2" />
            <text x="24" y="32" fontSize="14">∠A+∠B+∠C = 180°</text>
          </>
        ) : mode === "Circle Theorems" ? (
          <>
            <circle cx="210" cy="140" r="90" fill="none" stroke="#08b9dd" strokeWidth="2" />
            <polygon points="210,50 120,190 300,190" fill="none" stroke="#8b45f4" />
            <text x="24" y="32" fontSize="14">Angle in a semicircle is 90°</text>
          </>
        ) : mode === "Similarity" ? (
          <>
            <polygon points="40,220 160,220 40,80" fill="#d9f6ff" stroke="#147df2" />
            <polygon points="220,220 400,220 220,40" fill="#efe4ff" stroke="#8b45f4" />
            <text x="24" y="32" fontSize="14">AA similarity · matching angles</text>
          </>
        ) : mode === "Area Proofs" ? (
          <>
            <rect x="40" y="80" width="140" height="140" fill="#ccfbf1" stroke="#14b8a6" />
            <rect x="200" y="40" width="180" height="180" fill="#ede9fe" stroke="#8b45f4" />
            <text x="24" y="32" fontSize="14">Dissection conserves area</text>
          </>
        ) : (
          <>
            <rect x="50" y="150" width={a * 22} height={a * 22} fill="#ccf6fb" stroke="#08b9dd" />
            <rect x={50 + a * 22} y={150 - b * 22} width={b * 22} height={b * 22} fill="#efe4ff" stroke="#8b45f4" />
            <polygon points={`50,150 ${50 + a * 22},150 ${50 + a * 22},${150 - b * 22}`} fill="rgba(20,125,242,.18)" stroke="#147df2" />
            <text x="24" y="32" fontSize="14">a² + b² = c²</text>
          </>
        )}
      </svg>
    );
  }
  if (pageId === "linear-transforms" || pageId === "playground") {
    const k = 40 + a * 18;
    const shear = b * 28;
    return (
      <svg className="msk-graph" viewBox="0 0 420 280" role="img" aria-label={label} data-mode-canvas={mode}>
        <rect width="420" height="280" fill={mode.includes("3D") ? "#0b1220" : "#f8fbff"} />
        <line x1="40" y1="220" x2="400" y2="220" stroke="#94a3b8" /><line x1="80" y1="40" x2="80" y2="250" stroke="#94a3b8" />
        <rect x="80" y="160" width="60" height="60" fill="none" stroke="#94a3b8" strokeDasharray="4 3" />
        {mode === "R90" || mode === "Compose" ? <polygon points="80,220 80,160 140,160 140,220" fill="rgba(139,69,244,.2)" stroke="#8b45f4" transform="rotate(-90 80 220)" /> : null}
        {mode === "Shear" ? <polygon points={`80,220 ${140 + shear},220 ${140 + shear},160 80,160`} fill="rgba(8,185,221,.25)" stroke="#08b9dd" /> : null}
        {mode === "Scale X" || mode === "Identity" || mode === "2D Canvas" ? <rect x="80" y="160" width={k} height="60" fill="rgba(20,125,242,.2)" stroke="#147df2" /> : null}
        {mode.includes("3D") ? <path d="M80 220 L140 220 L170 190 L170 130 L110 130 L80 160 Z" fill="rgba(245,158,11,.2)" stroke="#f59e0b" /> : null}
        <text x="24" y="32" fill={mode.includes("3D") ? "#e2e8f0" : "#334155"} fontSize="14">{mode}: image of the unit square</text>
      </svg>
    );
  }
  if (pageId === "number-sense") {
    const ticks = mode === "Fractions" ? [0, 0.5, 1, 1.5, 2] : mode === "Powers" ? [1, 2, 4, 8] : mode === "Decimals" ? [0, 0.1, 0.7, 1.5] : mode === "Ratios" ? [0, 2, 4, 6] : mode === "Scales" ? [0, 1, 7] : [-3, -1, 0, 2, 7];
    const min = Math.min(...ticks);
    const max = Math.max(...ticks);
    const xAt = (v: number) => 48 + ((v - min) / (max - min || 1)) * 424;
    return (
      <svg className="msk-graph" viewBox="0 0 520 160" role="img" aria-label={label} data-mode-canvas={mode}>
        <rect width="520" height="160" fill="#f8fbff" />
        <line x1="24" y1="90" x2="496" y2="90" stroke="#0f172a" />
        {ticks.map((v) => (
          <g key={v}>
            <circle cx={xAt(v)} cy="90" r="7" fill="#147df2" />
            <text x={xAt(v)} y="70" textAnchor="middle" fontSize="12">{mode === "Fractions" && v === 0.5 ? "1/2" : v}</text>
          </g>
        ))}
        <text x="24" y="28" fontSize="14">{`${mode} on a value-scaled line`}</text>
      </svg>
    );
  }
  if (pageId === "row-reduction" || pageId === "matrices") {
    return (
      <svg className="msk-graph" viewBox="0 0 420 220" role="img" aria-label={label} data-mode-canvas={mode}>
        <rect width="420" height="220" fill={mode.includes("3D") ? "#0b1220" : "#f8fbff"} />
        <line x1="20" y1="110" x2="400" y2="40" stroke="#38bdf8" />
        <line x1="20" y1="160" x2="400" y2="80" stroke="#c4b5fd" />
        {mode !== "2D View" && mode !== "Add" ? <ellipse cx="210" cy="110" rx="120" ry="40" fill="none" stroke="#fbbf24" /> : null}
        <text x="24" y="28" fill={mode.includes("3D") ? "#e2e8f0" : "#334155"} fontSize="14">{mode}: {pageId === "matrices" ? "map of columns" : "pivot geometry"}</text>
      </svg>
    );
  }
  if (pageId === "determinants") {
    return (
      <svg className="msk-graph" viewBox="0 0 420 240" role="img" aria-label={label} data-mode-canvas={mode}>
        <rect width="420" height="240" fill="#f8fbff" />
        {mode === "3D Volume" ? <path d="M90 200 L210 200 L250 140 L250 70 L130 70 L90 130 Z" fill="rgba(245,158,11,.2)" stroke="#f59e0b" /> : (
          <polygon points={`80,200 ${80 + a * 40},200 ${80 + a * 40 + b * 30},${200 - 80} ${80 + b * 30},${200 - 80}`} fill="rgba(245,158,11,.25)" stroke="#f59e0b" />
        )}
        <text x="24" y="28" fontSize="14">{mode}: signed {mode.includes("3D") ? "volume" : "area"} = {a.toFixed(1)}</text>
      </svg>
    );
  }
  if (pageId === "vector-spaces" || pageId === "orthogonality" || pageId === "eigenvectors" || pageId === "vectors") {
    return (
      <svg className="msk-graph" viewBox="0 0 420 240" role="img" aria-label={label} data-mode-canvas={mode}>
        <rect width="420" height="240" fill="#f8fbff" />
        <polygon points="60,200 380,200 300,50 120,80" fill="#eef6ff" stroke="#147df2" />
        <line x1="120" y1="200" x2="220" y2="90" stroke="#8b45f4" strokeWidth="3" />
        {mode === "Cross" || mode === "Independence" ? <line x1="120" y1="200" x2="300" y2="160" stroke="#f59e0b" strokeWidth="3" /> : null}
        <text x="24" y="28" fontSize="14">{mode}</text>
      </svg>
    );
  }
  if (pageId === "least-squares" || pageId === "regression" || pageId === "correlation") {
    return (
      <svg className="msk-graph" viewBox="0 0 420 240" role="img" aria-label={label} data-mode-canvas={mode}>
        <rect width="420" height="240" fill="#f8fbff" />
        <line x1="40" y1="200" x2="400" y2={200 - a * 40} stroke="#8b45f4" />
        {[[70, 170], [140, 140], [220, 130], [310, 80]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5" fill="#147df2" />)}
        {mode === "Residuals" ? [[70, 170], [140, 140], [220, 130], [310, 80]].map(([x, y], i) => <line key={`r${i}`} x1={x} y1={y} x2={x} y2={200 - a * (x / 80)} stroke="#ef4444" />) : null}
        <text x="24" y="28" fontSize="14">{mode}</text>
      </svg>
    );
  }
  if (pageId === "primes") {
    return (
      <svg className="msk-graph" viewBox="0 0 420 200" role="img" aria-label={label} data-mode-canvas={mode}>
        <rect width="420" height="200" fill="#f8fbff" />
        {Array.from({ length: 24 }, (_, i) => (
          <rect key={i} x={20 + (i % 8) * 48} y={50 + Math.floor(i / 8) * 44} width="40" height="36" rx="6" fill={i === 1 || i === 2 || i === 4 || i === 6 ? "#dbeafe" : "#f1f5f9"} />
        ))}
        <text x="24" y="28" fontSize="14">{mode}</text>
      </svg>
    );
  }
  if (pageId === "number-patterns" || pageId === "counting" || pageId === "combinatorics") {
    return (
      <svg className="msk-graph" viewBox="0 0 360 180" role="img" aria-label={label} data-mode-canvas={mode}>
        <rect width="360" height="180" fill="#f8fbff" />
        {Array.from({ length: n }, (_, row) => Array.from({ length: row + 1 }, (_, col) => (
          <circle key={`${row}-${col}`} cx={40 + col * 22 + (n - row) * 10} cy={36 + row * 20} r="6" fill="#147df2" />
        )))}
        <text x="16" y="22" fontSize="13">{mode}</text>
      </svg>
    );
  }
  if (pageId === "data-explorer" || pageId === "descriptive" || pageId === "experiments" || pageId === "anova") {
    const bars = mode === "Pairwise" || mode === "Spread" ? [20, 80, 40, 90, 30, 70, 50] : [40, 70, 55, 90, 110, 80, 60];
    return (
      <svg className="msk-graph" viewBox="0 0 420 220" role="img" aria-label={label} data-mode-canvas={mode}>
        <rect width="420" height="220" fill="#f8fbff" />
        {bars.map((h, i) => <rect key={i} x={40 + i * 50} y={180 - h} width="32" height={h} fill={i === 3 ? "#f59e0b" : "#08b9dd"} opacity={0.8} />)}
        <text x="24" y="28" fontSize="14">{mode}</text>
      </svg>
    );
  }
  if (pageId === "clt" || pageId === "confidence-intervals" || pageId === "hypothesis" || pageId === "interactive-distributions") {
    return (
      <svg className="msk-graph" viewBox="0 0 420 220" role="img" aria-label={label} data-mode-canvas={mode}>
        <rect width="420" height="220" fill="#f8fbff" />
        <path d="M30 180 C 80 180, 120 40, 210 40 S 340 180, 390 180" fill="none" stroke="#8b45f4" strokeWidth="3" />
        <rect x="150" y="40" width="120" height="140" fill="rgba(8,185,221,.15)" />
        <text x="24" y="28" fontSize="14">{mode}</text>
      </svg>
    );
  }
  if (pageId === "polar-forms" || pageId === "rotation" || pageId === "roots" || pageId === "euler" || pageId === "loci" || pageId === "argand-plane" || pageId === "arithmetic") {
    const k = Math.max(3, Math.round(n / 2 + 2));
    const pts = Array.from({ length: k }, (_, i) => {
      const ang = (i / k) * Math.PI * 2 - Math.PI / 2;
      return `${210 + Math.cos(ang) * 70},${140 + Math.sin(ang) * 70}`;
    }).join(" ");
    return (
      <svg className="msk-graph" viewBox="0 0 420 260" role="img" aria-label={label} data-mode-canvas={mode}>
        <rect width="420" height="260" fill="#0b1220" />
        <circle cx="210" cy="140" r="70" fill="none" stroke="#22d3ee" />
        {pageId === "roots" || mode.includes("Root") ? <polygon points={pts} fill="none" stroke="#fbbf24" /> : <line x1="210" y1="140" x2={210 + 70 * Math.cos(a * 0.3)} y2={140 - 70 * Math.sin(a * 0.3)} stroke="#c4b5fd" strokeWidth="3" />}
        <text x="24" y="32" fill="#e2e8f0" fontSize="14">{mode}</text>
      </svg>
    );
  }
  if (pageId === "fractals") {
    return (
      <svg className="msk-graph" viewBox="0 0 420 220" role="img" aria-label={label} data-mode-canvas={mode}>
        <rect width="420" height="220" fill="#020617" />
        {Array.from({ length: 80 }, (_, i) => (
          <rect key={i} x={20 + (i % 16) * 24} y={40 + Math.floor(i / 16) * 32} width="22" height="28" fill={i % 5 === 0 ? "#312e81" : "#0f172a"} />
        ))}
        <text x="24" y="28" fill="#e2e8f0" fontSize="14">{mode}</text>
      </svg>
    );
  }
  if (pageId === "waves-circuits" || pageId === "waves" || pageId === "graphs" || pageId === "identities" || pageId === "inverse" || pageId === "applications") {
    const pts = Array.from({ length: 40 }, (_, i) => `${20 + i * 10},${120 - Math.sin(i / 4 + (mode.length % 5)) * (mode.includes("Tangent") ? 70 : 40)}`).join(" ");
    return (
      <svg className="msk-graph" viewBox="0 0 420 220" role="img" aria-label={label} data-mode-canvas={mode}>
        <rect width="420" height="220" fill={mode.includes("Wave") || pageId === "waves" ? "#061428" : "#f8fbff"} />
        <polyline points={pts} fill="none" stroke={mode.includes("Wave") ? "#22d3ee" : "#8b45f4"} strokeWidth="2.4" />
        <text x="24" y="28" fill={mode.includes("Wave") || pageId === "waves" ? "#e2e8f0" : "#334155"} fontSize="14">{mode}</text>
      </svg>
    );
  }
  if (pageId === "motion" || pageId === "population" || pageId === "epidemics" || pageId === "finance" || pageId === "periodic" || pageId === "numerical" || pageId === "comparison") {
    const pts = Array.from({ length: 30 }, (_, i) => `${16 + i * 13},${170 - (mode === "Exponential" ? i * i * 0.18 : Math.min(140, i * 4 + Math.sin(i) * 8))}`).join(" ");
    return (
      <svg className="msk-graph" viewBox="0 0 420 200" role="img" aria-label={label} data-mode-canvas={mode}>
        <rect width="420" height="200" fill="#eef8e8" />
        <polyline points={pts} fill="none" stroke="#147df2" strokeWidth="2.2" />
        <text x="20" y="28" fontSize="14">{mode}</text>
      </svg>
    );
  }
  if (pageId === "optimization") {
    return (
      <svg className="msk-graph" viewBox="0 0 420 220" role="img" aria-label={label} data-mode-canvas={mode}>
        <rect width="420" height="220" fill="#f8fbff" />
        <polygon points="50,190 280,190 240,50 90,70" fill="#eef6ff" stroke="#147df2" />
        <circle cx="160" cy="110" r="6" fill="#f59e0b" />
        <text x="20" y="28" fontSize="14">{mode}: feasible region</text>
      </svg>
    );
  }
  if (pageId === "networks" || pageId === "discrete-graphs" || pageId === "graphs") {
    return (
      <svg className="msk-graph" viewBox="0 0 420 220" role="img" aria-label={label} data-mode-canvas={mode}>
        <rect width="420" height="220" fill="#f8fbff" />
        <line x1="70" y1="60" x2="300" y2="50" stroke={mode === "Dijkstra" || mode === "Paths" ? "#147df2" : "#94a3b8"} strokeWidth="3" />
        <line x1="70" y1="60" x2="180" y2="170" stroke="#08b9dd" strokeWidth="3" />
        <line x1="300" y1="50" x2="180" y2="170" stroke="#cbd5e1" />
        <circle cx="70" cy="60" r="10" fill="#147df2" /><circle cx="300" cy="50" r="10" fill="#8b45f4" /><circle cx="180" cy="170" r="10" fill="#08b9dd" />
        <text x="20" y="28" fontSize="14">{mode}</text>
      </svg>
    );
  }
  if (pageId === "logic" || pageId === "sets" || pageId === "cryptography" || pageId === "algorithms" || pageId === "modular-arithmetic") {
    return (
      <svg className="msk-graph" viewBox="0 0 420 200" role="img" aria-label={label} data-mode-canvas={mode}>
        <rect width="420" height="200" fill="#f8fbff" />
        {pageId === "sets" ? (
          <>
            <circle cx="160" cy="110" r="55" fill="rgba(8,185,221,.25)" stroke="#08b9dd" />
            <circle cx="230" cy="110" r="55" fill="rgba(139,69,244,.2)" stroke="#8b45f4" />
          </>
        ) : (
          <>
            <circle cx="210" cy="110" r="70" fill="none" stroke="#147df2" />
            {Array.from({ length: 8 }, (_, i) => {
              const ang = (i / 8) * Math.PI * 2 - Math.PI / 2;
              return <circle key={i} cx={210 + Math.cos(ang) * 70} cy={110 + Math.sin(ang) * 70} r="5" fill={i === 2 ? "#f59e0b" : "#8b45f4"} />;
            })}
          </>
        )}
        <text x="20" y="28" fontSize="14">{mode}</text>
      </svg>
    );
  }
  return (
    <svg className="msk-graph" viewBox="0 0 420 240" role="img" aria-label={label} data-mode-canvas={mode}>
      <rect width="420" height="240" fill="#f8fbff" />
      <text x="24" y="32" fontSize="14">{label}</text>
      <circle cx={140 + a * 20} cy={140 - b * 16} r="8" fill="#08b9dd" />
    </svg>
  );
}
