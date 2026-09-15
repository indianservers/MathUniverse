import type { EuclidRow, PrimePower, VennFactors, VennThree } from "./primesMath";

const PRIME_FILL: Record<number, string> = {
  2: "#147df2",
  3: "#10b981",
  5: "#8b45f4",
  7: "#f59e0b",
  11: "#08b9dd",
};

function primeFill(p: number) {
  return PRIME_FILL[p] ?? "#334155";
}

function Chip({ x, y, p }: { x: number; y: number; p: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={16} fill={primeFill(p)} />
      <text x={x} y={y + 5} textAnchor="middle" fill="#fff" fontSize="13" fontWeight={800}>{p}</text>
    </g>
  );
}

function placeChips(primes: number[], x: number, y: number, cols = 2) {
  return primes.map((p, i) => (
    <Chip key={`${x}-${y}-${i}-${p}`} x={x + (i % cols) * 36} y={y + Math.floor(i / cols) * 38} p={p} />
  ));
}

export function TwoCircleVenn({
  a,
  b,
  venn,
  focus,
  finished,
  gcdValue,
  lcmValue,
}: {
  a: number;
  b: number;
  venn: VennFactors;
  focus: "gcd" | "lcm";
  finished: boolean;
  gcdValue: number;
  lcmValue: number;
}) {
  const gcdDim = focus === "gcd" ? 0.28 : 1;
  return (
    <svg className="primes-gcd-graph" viewBox="0 0 640 360" role="img" aria-label={`Prime factor Venn for ${a} and ${b}`}>
      <rect width="640" height="360" fill="#f8fbff" rx="12" />
      <text x="320" y="28" textAnchor="middle" fill="#071641" fontSize="16" fontWeight={800}>
        {a} and {b} — shared primes sit in the overlap
      </text>
      <circle cx="230" cy="190" r="118" fill="rgba(20,125,242,.22)" stroke="#147df2" strokeWidth="3" />
      <circle cx="410" cy="190" r="118" fill="rgba(139,69,244,.22)" stroke="#8b45f4" strokeWidth="3" />
      <text x="140" y="88" fill="#147df2" fontSize="15" fontWeight={800}>{a} only</text>
      <text x="460" y="88" fill="#8b45f4" fontSize="15" fontWeight={800}>{b} only</text>
      <text x="320" y="118" textAnchor="middle" fill="#0f766e" fontSize="13" fontWeight={800}>COMMON</text>
      <g opacity={gcdDim}>{placeChips(venn.left, 142, 168)}</g>
      <g>{placeChips(venn.common, 302, 168)}</g>
      <g opacity={gcdDim}>{placeChips(venn.right, 462, 168)}</g>
      <text x="320" y="330" textAnchor="middle" fill="#334155" fontSize="14" fontWeight={700}>
        {finished
          ? (focus === "gcd" ? `GCD is the overlap = ${gcdValue}` : `LCM is every chip in the diagram = ${lcmValue}`)
          : (focus === "gcd" ? "GCD uses only the COMMON chips" : "LCM uses every chip in both circles")}
      </text>
    </svg>
  );
}

export function ThreeCircleVenn({ a, b, c, three }: { a: number; b: number; c: number; three: VennThree }) {
  return (
    <svg className="primes-gcd-graph" viewBox="0 0 640 380" role="img" aria-label={`Prime factor Venn for ${a}, ${b}, ${c}`}>
      <rect width="640" height="380" fill="#f8fbff" rx="12" />
      <text x="320" y="26" textAnchor="middle" fill="#071641" fontSize="15" fontWeight={800}>{a}, {b}, {c} — triple overlap is gcd primes</text>
      <circle cx="250" cy="170" r="100" fill="rgba(20,125,242,.18)" stroke="#147df2" strokeWidth="2" />
      <circle cx="390" cy="170" r="100" fill="rgba(139,69,244,.18)" stroke="#8b45f4" strokeWidth="2" />
      <circle cx="320" cy="260" r="100" fill="rgba(245,158,11,.16)" stroke="#f59e0b" strokeWidth="2" />
      {placeChips(three.onlyA, 168, 130, 1)}
      {placeChips(three.onlyB, 448, 130, 1)}
      {placeChips(three.onlyC, 304, 318, 2)}
      {placeChips(three.ab, 304, 130, 2)}
      {placeChips(three.ac, 214, 230, 1)}
      {placeChips(three.bc, 394, 230, 1)}
      {placeChips(three.abc, 304, 210, 2)}
    </svg>
  );
}

export function EuclidRectGraph({ row, gcdValue, finished }: { row: EuclidRow; gcdValue: number; finished: boolean }) {
  const { a, b, q, r } = row;
  const maxW = 560;
  const maxH = 220;
  const scale = Math.min(maxW / Math.max(a, 1), maxH / Math.max(b, 1));
  const w = a * scale;
  const h = b * scale;
  const sq = b * scale;
  const rem = r * scale;
  const x0 = 40;
  const y0 = 56;
  const many = q > 10;
  return (
    <svg className="primes-gcd-graph" viewBox="0 0 640 320" role="img" aria-label={`${a} = ${b} × ${q} + ${r}`}>
      <rect width="640" height="320" fill="#f8fbff" rx="12" />
      <text x="320" y="28" textAnchor="middle" fill="#071641" fontSize="16" fontWeight={800}>
        {a} = {b} × {q} + {r}
      </text>
      <rect x={x0} y={y0} width={w} height={h} fill="none" stroke="#1d2d50" strokeWidth="2" />
      {many ? (
        <g>
          <rect x={x0} y={y0} width={Math.max(0, w - rem)} height={h} fill="rgba(20,125,242,.32)" stroke="#147df2" />
          <text x={x0 + Math.max(24, (w - rem) / 2)} y={y0 + h / 2 + 5} textAnchor="middle" fill="#0f172a" fontSize="14" fontWeight={800}>
            {q} × {b}
          </text>
        </g>
      ) : (
        Array.from({ length: q }, (_, i) => (
          <rect key={i} x={x0 + i * sq} y={y0} width={sq} height={h} fill="rgba(20,125,242,.28)" stroke="#147df2" />
        ))
      )}
      {r > 0 ? (
        <rect x={x0 + q * (many ? 0 : sq) + (many ? w - rem : 0)} y={y0} width={Math.max(rem, 8)} height={h} fill="rgba(245,158,11,.45)" stroke="#f59e0b" />
      ) : null}
      <text x="320" y="300" textAnchor="middle" fill="#334155" fontSize="14" fontWeight={700}>
        {finished ? `Last non-zero remainder is gcd = ${gcdValue}` : "Blue squares fit the smaller length; orange is the remainder."}
      </text>
    </svg>
  );
}

export function MultiplesGraph({
  a,
  b,
  lcmValue,
  step,
  finished,
}: {
  a: number;
  b: number;
  lcmValue: number;
  step: number;
  finished: boolean;
}) {
  const cap = Math.min(lcmValue, Math.max(a * 8, b * 8, 120));
  const shown = Math.min(cap, Math.max(a * (step + 2), b * (step + 2), a, b));
  const ticks: Array<{ n: number; kind: "a" | "b" | "both" }> = [];
  for (let n = Math.min(a, b); n <= shown; n += 1) {
    const ha = n % a === 0;
    const hb = n % b === 0;
    if (!ha && !hb) continue;
    ticks.push({ n, kind: ha && hb ? "both" : ha ? "a" : "b" });
  }
  const xOf = (n: number) => 36 + (n / shown) * 568;
  return (
    <svg className="primes-gcd-graph" viewBox="0 0 640 220" role="img" aria-label={`Multiples of ${a} and ${b}`}>
      <rect width="640" height="220" fill="#f8fbff" rx="12" />
      <text x="320" y="26" textAnchor="middle" fill="#071641" fontSize="15" fontWeight={800}>
        Common multiples light up in green
      </text>
      <line x1="36" y1="120" x2="604" y2="120" stroke="#94a3b8" strokeWidth="2" />
      {ticks.map((t) => (
        <g key={t.n}>
          <line
            x1={xOf(t.n)}
            y1={t.kind === "both" ? 70 : 92}
            x2={xOf(t.n)}
            y2={148}
            stroke={t.kind === "both" ? "#10b981" : t.kind === "a" ? "#147df2" : "#8b45f4"}
            strokeWidth={t.kind === "both" ? 4 : 2}
          />
          <circle
            cx={xOf(t.n)}
            cy={120}
            r={t.kind === "both" ? 8 : 5}
            fill={t.kind === "both" ? "#10b981" : t.kind === "a" ? "#147df2" : "#8b45f4"}
          />
          {t.kind === "both" || t.n === a || t.n === b ? (
            <text x={xOf(t.n)} y={172} textAnchor="middle" fontSize="11" fill="#334155" fontWeight={700}>{t.n}</text>
          ) : null}
        </g>
      ))}
      <text x="36" y="204" fill="#334155" fontSize="13" fontWeight={700}>
        {finished ? `First common multiple = LCM = ${lcmValue}` : `Listing multiples up to ${shown}…`}
      </text>
    </svg>
  );
}

export function ExponentBars({
  a,
  b,
  aPowers,
  bPowers,
  focus,
  finished,
}: {
  a: number;
  b: number;
  aPowers: PrimePower[];
  bPowers: PrimePower[];
  focus: "gcd" | "lcm";
  finished: boolean;
}) {
  const primes = [...new Set([...aPowers.map((p) => p.prime), ...bPowers.map((p) => p.prime)])].sort((x, y) => x - y);
  if (!primes.length) return null;
  const ea = (p: number) => aPowers.find((x) => x.prime === p)?.exp ?? 0;
  const eb = (p: number) => bPowers.find((x) => x.prime === p)?.exp ?? 0;
  const maxE = Math.max(1, ...primes.map((p) => Math.max(ea(p), eb(p))));
  const rowH = 48;
  const h = 56 + primes.length * rowH;
  return (
    <svg className="primes-gcd-graph" viewBox={`0 0 640 ${h}`} role="img" aria-label="Min and max prime exponents">
      <rect width="640" height={h} fill="#f8fbff" rx="12" />
      <text x="320" y="24" textAnchor="middle" fill="#071641" fontSize="14" fontWeight={800}>
        {finished
          ? (focus === "gcd" ? "GCD keeps the shorter bar for each prime" : "LCM keeps the taller bar for each prime")
          : `Exponents in ${a} (blue) vs ${b} (purple)`}
      </text>
      {primes.map((p, i) => {
        const y = 44 + i * rowH;
        const unit = 70;
        return (
          <g key={p}>
            <text x="28" y={y + 18} fill={primeFill(p)} fontSize="16" fontWeight={800}>{p}</text>
            <rect x="70" y={y} width={ea(p) * unit} height="16" fill="#147df2" rx="4" />
            <rect x="70" y={y + 20} width={eb(p) * unit} height="16" fill="#8b45f4" rx="4" />
            {Array.from({ length: maxE }, (_, k) => (
              <line key={k} x1={70 + (k + 1) * unit} y1={y - 2} x2={70 + (k + 1) * unit} y2={y + 38} stroke="#e2e8f0" />
            ))}
            <text x={80 + Math.max(ea(p), eb(p)) * unit} y={y + 18} fill="#64748b" fontSize="12">
              min {Math.min(ea(p), eb(p))} · max {Math.max(ea(p), eb(p))}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
