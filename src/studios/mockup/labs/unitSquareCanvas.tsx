type Props = { mode: string; k?: number };

export function TransformUnitSquare({ mode, k = 1.4 }: Props) {
  const shear = (k - 1) * 28;
  const width = 40 + k * 18;
  return (
    <svg className="msk-graph" viewBox="0 0 420 280" role="img" aria-label={`${mode} unit square`} data-mode-canvas={mode}>
      <rect width="420" height="280" fill={mode.includes("3D") ? "#0b1220" : "#f8fbff"} />
      <line x1="40" y1="220" x2="400" y2="220" stroke="#94a3b8" />
      <line x1="80" y1="40" x2="80" y2="250" stroke="#94a3b8" />
      <rect x="80" y="160" width="60" height="60" fill="none" stroke="#94a3b8" strokeDasharray="4 3" />
      {mode === "R90" || mode === "Compose" ? (
        <polygon points="80,220 80,160 140,160 140,220" fill="rgba(139,69,244,.2)" stroke="#8b45f4" transform="rotate(-90 80 220)" />
      ) : null}
      {mode === "Shear" ? (
        <polygon points={`80,220 ${140 + shear},220 ${140 + shear},160 80,160`} fill="rgba(8,185,221,.25)" stroke="#08b9dd" />
      ) : null}
      {mode === "Scale X" || mode === "Identity" || mode === "2D Canvas" || mode === "2D" ? (
        <rect x="80" y="160" width={width} height="60" fill="rgba(20,125,242,.2)" stroke="#147df2" />
      ) : null}
      {mode.includes("3D") ? <path d="M80 220 L140 220 L170 190 L170 130 L110 130 L80 160 Z" fill="rgba(245,158,11,.2)" stroke="#f59e0b" /> : null}
      <text x="24" y="32" fill={mode.includes("3D") ? "#e2e8f0" : "#334155"} fontSize="14">{mode}: image of the unit square</text>
    </svg>
  );
}
