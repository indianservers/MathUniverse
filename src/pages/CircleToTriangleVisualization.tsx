import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const pointCount = 360;
const centerX = 300;
const centerY = 166;
const maxRadius = 74;
const circumference = 2 * Math.PI * maxRadius;
const halfCircumference = circumference / 2;
const cutY = centerY - maxRadius;
const finalLeftX = centerX - halfCircumference;
const finalRightX = centerX + halfCircumference;
const triangleTipY = centerY;

export default function CircleToTriangleVisualization() {
  const [isLine, setIsLine] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lineCount, setLineCount] = useState(240);
  const progressRef = useRef(0);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    if (isPaused) return undefined;

    const start = performance.now();
    const from = progressRef.current;
    const to = isLine ? 1 : 0;
    const duration = 2600 * Math.abs(to - from);
    let frame = 0;

    if (duration === 0) return undefined;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      setProgress(from + (to - from) * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isLine, isPaused]);

  const { rings, metrics } = useMemo(() => circleToLinePoints(progress, lineCount), [progress, lineCount]);
  const completedLineOpacity = progress >= 0.995 ? 1 : 0;
  const isMoving = progress > 0.001 && progress < 0.999;
  const seekValue = Math.round(progress * 1000);

  return (
    <section aria-label="Circle to triangle stage" className="h-[clamp(430px,calc(100vh-12rem),640px)] overflow-hidden rounded-xl border border-cyan-200/50 bg-slate-950 shadow-2xl shadow-cyan-950/30">
      <h1 className="sr-only">Circle to Triangle Visual Proof</h1>
      <div className="relative flex h-full items-center justify-center">
        <svg viewBox="0 0 600 360" className="h-full w-full" role="img" aria-label="360 degree circular line animation">
          <defs>
            <radialGradient id="stageGlow" cx="50%" cy="42%" r="62%">
              <stop offset="0%" stopColor="#164e63" stopOpacity="0.9" />
              <stop offset="48%" stopColor="#020617" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#020617" />
            </radialGradient>
            <linearGradient id="circleLineStroke" x1="68" y1="156" x2="532" y2="156" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="38%" stopColor="#f8fafc" />
              <stop offset="72%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#fb7185" />
            </linearGradient>
            <filter id="lineGlow" x="-30%" y="-70%" width="160%" height="240%">
              <feGaussianBlur stdDeviation="7" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="microPointGlow" x="-260%" y="-260%" width="620%" height="620%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect width="600" height="420" fill="url(#stageGlow)" />
          <circle cx="300" cy={centerY} r="128" fill="none" stroke="#67e8f9" strokeDasharray="2 14" strokeLinecap="round" strokeOpacity="0.16" />
          <circle cx="300" cy={centerY} r="184" fill="none" stroke="#c4b5fd" strokeDasharray="1 18" strokeLinecap="round" strokeOpacity="0.1" />

          {rings.map((ring) => (
            <g key={`ring-shadow-${ring.radius}`}>
              <polyline points={ring.leftPoints} fill="none" stroke={ring.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="9" opacity="0.16" />
              <polyline points={ring.rightPoints} fill="none" stroke={ring.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="9" opacity="0.16" />
            </g>
          ))}
          {rings.map((ring) => (
            <g key={`ring-${ring.radius}`}>
              <polyline points={ring.leftPoints} fill="none" filter="url(#lineGlow)" stroke={ring.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" />
              <polyline points={ring.rightPoints} fill="none" filter="url(#lineGlow)" stroke={ring.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" />
            </g>
          ))}
          {rings.map((ring) => (
            <line
              key={`final-ring-glow-${ring.radius}`}
              x1={ring.finalLeftX}
              y1={ring.finalY}
              x2={ring.finalRightX}
              y2={ring.finalY}
              filter="url(#lineGlow)"
              stroke={ring.color}
              strokeLinecap="round"
              strokeWidth="9"
              opacity={completedLineOpacity}
            />
          ))}
          {rings.map((ring) => (
            <line
              key={`final-ring-${ring.radius}`}
              x1={ring.finalLeftX}
              y1={ring.finalY}
              x2={ring.finalRightX}
              y2={ring.finalY}
              stroke={ring.color}
              strokeLinecap="round"
              strokeWidth="5"
              opacity={completedLineOpacity}
            />
          ))}
          <circle cx={metrics.leftEnd.x} cy={metrics.leftEnd.y} r="7" fill="#22d3ee" filter="url(#lineGlow)" />
          <circle cx={metrics.topCut.x} cy={metrics.topCut.y} r="6" fill="#f8fafc" filter="url(#lineGlow)" />
          <circle cx={metrics.rightEnd.x} cy={metrics.rightEnd.y} r="7" fill="#fb7185" filter="url(#lineGlow)" />
          <g aria-label="Tiny glowing reference points">
            <GlowDot x={centerX} y={centerY} color="#facc15" />
            <GlowDot x={metrics.topCut.x} y={metrics.topCut.y} color="#ffffff" />
            <GlowDot x={metrics.leftEnd.x} y={metrics.leftEnd.y} color="#67e8f9" />
            <GlowDot x={metrics.rightEnd.x} y={metrics.rightEnd.y} color="#fb7185" />
          </g>

          <g className="pointer-events-none select-none font-mono text-[10px] font-bold">
            <line x1={centerX + 16} y1={cutY} x2={centerX + 16} y2={triangleTipY} stroke="#f8fafc" strokeDasharray="3 5" strokeLinecap="round" strokeOpacity="0.72" />
            <text x={centerX + 22} y={(cutY + triangleTipY) / 2 + 4} fill="#f8fafc">h = r = {formatNumber(maxRadius)}</text>

            <line x1={finalLeftX} y1={cutY - 13} x2={finalRightX} y2={cutY - 13} stroke="#f8fafc" strokeDasharray="4 7" strokeLinecap="round" strokeOpacity={0.3 + completedLineOpacity * 0.6} />
            <text x={centerX} y={cutY - 20} textAnchor="middle" fill="#e0f2fe">base = 2πr = {formatNumber(circumference)}</text>

            <text x={centerX - 192} y={centerY + 8} fill="#67e8f9">A circle = πr²</text>
            <text x={centerX + 86} y={centerY + 8} fill="#fda4af">A triangle = 1/2 × base × height</text>
            <text x={centerX} y={centerY + 30} textAnchor="middle" fill="#ffffff">πr² = 1/2 × (2πr) × r</text>
          </g>
        </svg>

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setIsPaused(false);
              setIsLine((value) => !value);
            }}
            className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/15 bg-white px-5 text-sm font-black text-slate-950 shadow-2xl shadow-cyan-500/25 transition hover:scale-105 active:scale-100"
            aria-label={isLine ? "Return to circular line" : "Animate circular line into straight line"}
          >
            {isLine ? <RotateCcw className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isLine ? "Reset" : "Animate"}
          </button>
          <button
            type="button"
            onClick={() => setIsPaused((value) => !value)}
            disabled={!isMoving}
            className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/90 px-5 text-sm font-black text-slate-950 shadow-2xl shadow-cyan-500/20 transition hover:scale-105 active:scale-100 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:scale-100"
            aria-label={isPaused ? "Resume animation" : "Pause animation"}
          >
            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            {isPaused ? "Resume" : "Pause"}
          </button>
          <label className="flex h-14 min-w-[220px] items-center gap-3 rounded-full border border-white/15 bg-slate-950/72 px-4 text-xs font-black text-cyan-50 shadow-2xl shadow-cyan-500/10 backdrop-blur">
            <span className="shrink-0">Seek</span>
            <input
              type="range"
              min="0"
              max="1000"
              value={seekValue}
              onChange={(event) => {
                const nextProgress = Number(event.currentTarget.value) / 1000;
                setIsPaused(true);
                setProgress(nextProgress);
                setIsLine(nextProgress >= 0.999);
              }}
              className="w-full"
              aria-label="Seek animation progress"
            />
            <span className="w-9 text-right font-mono">{Math.round(progress * 100)}%</span>
          </label>
          <label className="flex h-14 min-w-[250px] items-center gap-3 rounded-full border border-white/15 bg-slate-950/72 px-4 text-xs font-black text-cyan-50 shadow-2xl shadow-cyan-500/10 backdrop-blur">
            <span className="shrink-0">Lines</span>
            <input
              type="range"
              min="18"
              max="500"
              value={lineCount}
              onChange={(event) => setLineCount(Number(event.currentTarget.value))}
              className="w-full"
              aria-label="Line density"
            />
            <span className="w-10 text-right font-mono">{lineCount}</span>
          </label>
        </div>

        <div className="absolute left-5 top-5 grid min-w-[220px] gap-1.5 rounded-xl border border-white/10 bg-slate-950/72 p-3 text-xs font-bold text-cyan-50 shadow-2xl shadow-black/30 backdrop-blur">
          <ValueRow label="Top cut" value={`x ${formatNumber(metrics.topCut.x)}, y ${formatNumber(metrics.topCut.y)}`} />
          <ValueRow label="Left end" value={`x ${formatNumber(metrics.leftEnd.x)}, y ${formatNumber(metrics.leftEnd.y)}`} />
          <ValueRow label="Right end" value={`x ${formatNumber(metrics.rightEnd.x)}, y ${formatNumber(metrics.rightEnd.y)}`} />
          <ValueRow label="Current span" value={formatNumber(metrics.totalLineLength)} />
          <ValueRow label="Full length" value={formatNumber(circumference)} />
          <ValueRow label="Lines" value={`${lineCount}`} />
        </div>
      </div>
    </section>
  );
}

function ValueRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-cyan-200/70">{label}</span>
      <span className="font-mono text-white">{value}</span>
    </div>
  );
}

function GlowDot({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r="7" fill={color} opacity="0.22" filter="url(#microPointGlow)" />
      <circle cx={x} cy={y} r="2.8" fill={color} stroke="#020617" strokeWidth="0.9" filter="url(#microPointGlow)" />
      <circle cx={x} cy={y} r="1.1" fill="#ffffff" opacity="0.95" />
    </g>
  );
}

function formatNumber(value: number) {
  return value.toFixed(2);
}

function circleToLinePoints(progress: number, lineCount: number) {
  const clamped = Math.max(0, Math.min(1, progress));
  const halfCount = pointCount / 2;
  const nestedCircles = createNestedCircles(lineCount);
  let topCut = { x: centerX, y: cutY };
  let leftEnd = { x: finalLeftX, y: cutY };
  let rightEnd = { x: finalRightX, y: cutY };

  const rings = nestedCircles.map((circle) => {
    const halfLength = Math.PI * circle.radius;
    const theta = Math.PI * (1 - clamped);
    const arcRadius = theta < 0.0001 ? Number.POSITIVE_INFINITY : halfLength / theta;
    const fixedMidY = centerY - circle.radius;
    const leftPoints: string[] = [];
    const rightPoints: string[] = [];
    let ringLeftEnd = { x: centerX, y: centerY + circle.radius };
    let ringRightEnd = { x: centerX, y: centerY + circle.radius };

    for (let index = 0; index <= halfCount; index += 1) {
      const amount = index / halfCount;
      const angle = theta * amount;
      const rightX = theta < 0.0001 ? centerX + halfLength * amount : centerX + arcRadius * Math.sin(angle);
      const leftX = theta < 0.0001 ? centerX - halfLength * amount : centerX - arcRadius * Math.sin(angle);
      const y = theta < 0.0001 ? fixedMidY : fixedMidY + arcRadius * (1 - Math.cos(angle));

      if (index === halfCount) {
        ringLeftEnd = { x: leftX, y };
        ringRightEnd = { x: rightX, y };
      }

      leftPoints.unshift(`${leftX.toFixed(6)},${y.toFixed(6)}`);
      rightPoints.push(`${rightX.toFixed(6)},${y.toFixed(6)}`);
    }

    const ring = {
      radius: circle.radius,
      color: circle.color,
      leftPoints: leftPoints.join(" "),
      rightPoints: rightPoints.join(" "),
      leftEnd: ringLeftEnd,
      rightEnd: ringRightEnd,
      finalLeftX: centerX - halfLength,
      finalRightX: centerX + halfLength,
      finalY: fixedMidY,
      length: 2 * Math.PI * circle.radius,
    };

    if (circle.radius === maxRadius) {
      topCut = { x: centerX, y: fixedMidY };
      leftEnd = ringLeftEnd;
      rightEnd = ringRightEnd;
    }

    return ring;
  });

  return {
    rings,
    metrics: {
      leftEnd,
      topCut,
      rightEnd,
      totalLineLength: circumference,
    },
  };
}

function createNestedCircles(lineCount: number) {
  const safeCount = Math.max(18, Math.min(500, Math.round(lineCount)));
  return Array.from({ length: safeCount }, (_, index) => {
    const amount = safeCount === 1 ? 1 : index / (safeCount - 1);
    const radius = maxRadius * amount;
    return {
      radius,
      color: blendColor("#22d3ee", "#fb7185", amount),
    };
  });
}

function blendColor(from: string, to: string, amount: number) {
  const first = hexToRgb(from);
  const second = hexToRgb(to);
  const mixed = first.map((channel, index) => Math.round(channel + (second[index] - channel) * amount));
  return `#${mixed.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

function hexToRgb(value: string) {
  return [1, 3, 5].map((start) => parseInt(value.slice(start, start + 2), 16));
}
