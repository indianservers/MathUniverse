import { Moon, Pause, Play, RotateCcw, Sun } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import FormulaBlock from "../../components/ui/FormulaBlock";
import SectionCard from "../../components/ui/SectionCard";
import SliderControl from "../../components/ui/SliderControl";
import VisualLearningPanel from "../../components/ui/VisualLearningPanel";
import { clamp, roundTo } from "../../utils/math";

type EclipseMode = "solar" | "lunar";

const sunAngle = 0.53;
const averageMoonAngle = 0.52;
const moonMinAngle = 0.49;
const moonMaxAngle = 0.56;

export default function EclipseTrigonometryVisualizer() {
  const [mode, setMode] = useState<EclipseMode>("solar");
  const [alignment, setAlignment] = useState(0.08);
  const [moonAngle, setMoonAngle] = useState(averageMoonAngle);
  const [lightSpread, setLightSpread] = useState(0.53);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setAlignment((value) => {
        const next = value + 0.018;
        return next > 1.2 ? -1.2 : next;
      });
    }, 45);
    return () => window.clearInterval(id);
  }, [playing]);

  const eclipse = useMemo(() => classifyEclipse(mode, Math.abs(alignment), moonAngle, lightSpread), [alignment, lightSpread, mode, moonAngle]);
  const offsetPixels = clamp(alignment * 115, -138, 138);
  const moonRadius = 54 * (moonAngle / averageMoonAngle);
  const solarCoverage = mode === "solar" ? diskOverlapPercent(56, moonRadius, Math.abs(offsetPixels)) : 0;
  const lunarCoverage = mode === "lunar" ? diskOverlapPercent(54, 72, Math.abs(offsetPixels) * 0.78) : 0;
  const shadowWidth = mode === "solar" ? Math.max(18, 82 - (lightSpread - 0.35) * 70) : 120 + (lightSpread - 0.35) * 68;
  const nearMiss = Math.abs(alignment) > eclipse.threshold;

  return (
    <SectionCard title="Solar and Lunar Eclipse Trigonometry" description="Explore how real apparent angles, alignment, and light rays decide total, partial, annular, and lunar eclipses.">
      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1 dark:bg-white/10">
            <button type="button" onClick={() => setMode("solar")} className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold transition ${mode === "solar" ? "bg-amber-400 text-slate-950 shadow" : "text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-white/10"}`}>
              <Sun className="h-4 w-4" />
              Solar
            </button>
            <button type="button" onClick={() => setMode("lunar")} className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold transition ${mode === "lunar" ? "bg-cyan-500 text-white shadow" : "text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-white/10"}`}>
              <Moon className="h-4 w-4" />
              Lunar
            </button>
          </div>

          <div className="rounded-2xl bg-slate-950 p-4 text-white">
            <p className="text-sm font-semibold text-cyan-200">Current eclipse type</p>
            <p className="mt-2 text-2xl font-black">{eclipse.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">{eclipse.reason}</p>
          </div>

          <SliderControl label="Alignment offset" value={alignment} min={-1.2} max={1.2} step={0.01} onChange={setAlignment} unit="deg" description="0 deg means the centers are perfectly lined up." />
          <SliderControl label="Moon apparent diameter" value={moonAngle} min={moonMinAngle} max={moonMaxAngle} step={0.01} onChange={setMoonAngle} unit="deg" description="The Moon changes apparent size because its orbit is elliptical." />
          <SliderControl label="Sun light cone angle" value={lightSpread} min={0.35} max={0.7} step={0.01} onChange={setLightSpread} unit="deg" description="Sun's angular width controls penumbra and umbra geometry." />

          <div className="grid grid-cols-2 gap-2">
            <Metric label="Sun angle" value={`${roundTo(sunAngle, 2)} deg`} />
            <Metric label="Moon angle" value={`${roundTo(moonAngle, 2)} deg`} />
            <Metric label="Offset" value={`${roundTo(Math.abs(alignment), 2)} deg`} />
            <Metric label={mode === "solar" ? "Sun covered" : "Moon in shadow"} value={`${roundTo(mode === "solar" ? solarCoverage : lunarCoverage, 0)}%`} />
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={() => setPlaying((value) => !value)} className="action-primary flex-1">
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {playing ? "Pause orbit" : "Animate orbit"}
            </button>
            <button type="button" onClick={() => { setAlignment(0); setMoonAngle(averageMoonAngle); setLightSpread(sunAngle); }} className="action-secondary" title="Reset eclipse geometry" aria-label="Reset eclipse geometry">
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          <FormulaBlock title="Angular Size" formula={"theta \\approx diameter / distance"} explanation="Eclipses happen when apparent angles overlap from the observer's point of view." />
        </div>

        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 p-3 dark:border-white/10">
            <svg viewBox="0 0 900 520" className="h-[520px] w-full">
              <defs>
                <radialGradient id="eclipse-sun" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fff7ad" />
                  <stop offset="62%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f97316" />
                </radialGradient>
                <radialGradient id="eclipse-earth" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#7dd3fc" />
                  <stop offset="60%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#0f172a" />
                </radialGradient>
                <radialGradient id="eclipse-moon" cx="35%" cy="35%" r="70%">
                  <stop offset="0%" stopColor="#f8fafc" />
                  <stop offset="70%" stopColor="#94a3b8" />
                  <stop offset="100%" stopColor="#334155" />
                </radialGradient>
                <filter id="soft-glow">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <rect width="900" height="520" fill="#020617" />
              {Array.from({ length: 42 }).map((_, index) => (
                <circle key={index} cx={(index * 71) % 890} cy={(index * 43) % 500} r={index % 4 === 0 ? 1.4 : 0.8} fill="#e2e8f0" opacity={index % 5 === 0 ? 0.7 : 0.35} />
              ))}

              {mode === "solar" ? (
                <SolarDiagram offsetPixels={offsetPixels} moonRadius={moonRadius} shadowWidth={shadowWidth} nearMiss={nearMiss} alignment={alignment} />
              ) : (
                <LunarDiagram offsetPixels={offsetPixels} shadowWidth={shadowWidth} nearMiss={nearMiss} alignment={alignment} />
              )}

              <AngleGauge x={730} y={82} sun={sunAngle} moon={moonAngle} offset={alignment} mode={mode} />
            </svg>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <InfoCard title="Real Angle" text={`Sun approx ${sunAngle} deg. Moon now ${roundTo(moonAngle, 2)} deg. Their tiny angular match is why eclipses are possible.`} />
            <InfoCard title="Light Rays" text="Outer rays form the penumbra. Inner crossing rays form the umbra where the light source is fully blocked." />
            <InfoCard title="Trigonometry" text="Use tan(theta/2)=radius/distance to connect physical size, distance, apparent angle, and shadow width." />
          </div>

          <VisualLearningPanel
            concept="An eclipse is an angular-overlap problem."
            formula="tan(theta/2) = radius / distance"
            changes="Move alignment to miss or hit the shadow. Change Moon angle to switch between total and annular solar eclipses."
            realWorldUse="Astronomers predict eclipses by modeling orbital inclination, apparent angular diameters, and shadow cones."
            warning="The drawing is not distance-scale accurate; it preserves the angle and shadow ideas so the geometry is readable."
            steps={[
              `Compare apparent sizes: Sun=${sunAngle} deg and Moon=${roundTo(moonAngle, 2)} deg.`,
              `Check center offset: ${roundTo(Math.abs(alignment), 2)} deg.`,
              mode === "solar" ? "If the Moon angle is larger than the Sun angle and centers align, totality is possible." : "If the Moon passes through Earth's umbra, the lunar surface darkens.",
              `Current result: ${eclipse.title}.`,
            ]}
            tasks={["Set alignment to 0 deg.", "Make Moon angle smaller than the Sun for an annular solar eclipse.", "Switch to Lunar and move the Moon through the umbra.", "Increase light cone angle and watch the penumbra widen."]}
          />
        </div>
      </div>
    </SectionCard>
  );
}

function SolarDiagram({ offsetPixels, moonRadius, shadowWidth, nearMiss, alignment }: { offsetPixels: number; moonRadius: number; shadowWidth: number; nearMiss: boolean; alignment: number }) {
  const sun = { x: 150, y: 260, r: 78 };
  const moon = { x: 440, y: 260 + offsetPixels, r: moonRadius };
  const earth = { x: 735, y: 260, r: 64 };
  return (
    <>
      <polygon points={`${sun.x},${sun.y - sun.r} ${earth.x},${earth.y - shadowWidth} ${earth.x},${earth.y + shadowWidth} ${sun.x},${sun.y + sun.r}`} fill="#facc15" opacity="0.13" />
      <polygon points={`${moon.x},${moon.y - moon.r} ${earth.x},${earth.y - shadowWidth * 0.28} ${earth.x},${earth.y + shadowWidth * 0.28} ${moon.x},${moon.y + moon.r}`} fill="#020617" opacity="0.78" />
      <line x1={sun.x} y1={sun.y - sun.r} x2={earth.x} y2={earth.y - shadowWidth} stroke="#fde68a" strokeWidth="2" opacity="0.68" />
      <line x1={sun.x} y1={sun.y + sun.r} x2={earth.x} y2={earth.y + shadowWidth} stroke="#fde68a" strokeWidth="2" opacity="0.68" />
      <line x1={sun.x} y1={sun.y} x2={earth.x} y2={earth.y} stroke="#fef3c7" strokeWidth="2" strokeDasharray="8 8" opacity="0.5" />
      <circle cx={sun.x} cy={sun.y} r={sun.r} fill="url(#eclipse-sun)" filter="url(#soft-glow)" />
      <circle cx={earth.x} cy={earth.y} r={earth.r} fill="url(#eclipse-earth)" />
      <circle cx={moon.x} cy={moon.y} r={moon.r} fill="url(#eclipse-moon)" stroke="#e2e8f0" strokeWidth="2" />
      <circle cx={earth.x} cy={earth.y + alignment * 72} r={nearMiss ? 10 : 16} fill={nearMiss ? "#f97316" : "#22d3ee"} opacity="0.9" />
      <text x={sun.x} y={sun.y + 118} fill="#fde68a" textAnchor="middle" className="text-sm font-bold">Sun</text>
      <text x={moon.x} y={moon.y + moon.r + 34} fill="#e2e8f0" textAnchor="middle" className="text-sm font-bold">Moon blocks light</text>
      <text x={earth.x} y={earth.y + 108} fill="#bfdbfe" textAnchor="middle" className="text-sm font-bold">Earth observer</text>
      <Label x={590} y={earth.y - shadowWidth * 0.35 - 20} text="umbra" color="#cbd5e1" />
      <Label x={575} y={earth.y - shadowWidth - 18} text="penumbra" color="#fde68a" />
    </>
  );
}

function LunarDiagram({ offsetPixels, shadowWidth, nearMiss }: { offsetPixels: number; shadowWidth: number; nearMiss: boolean; alignment: number }) {
  const sun = { x: 125, y: 260, r: 76 };
  const earth = { x: 385, y: 260, r: 64 };
  const moon = { x: 715, y: 260 + offsetPixels * 0.78, r: 48 };
  return (
    <>
      <polygon points={`${sun.x},${sun.y - sun.r} ${earth.x},${earth.y - earth.r} 850,${earth.y - shadowWidth} 850,${earth.y + shadowWidth} ${earth.x},${earth.y + earth.r} ${sun.x},${sun.y + sun.r}`} fill="#facc15" opacity="0.12" />
      <polygon points={`${earth.x},${earth.y - earth.r} 850,${earth.y - shadowWidth * 0.52} 850,${earth.y + shadowWidth * 0.52} ${earth.x},${earth.y + earth.r}`} fill="#020617" opacity="0.82" />
      <line x1={sun.x} y1={sun.y - sun.r} x2={850} y2={earth.y - shadowWidth} stroke="#fde68a" strokeWidth="2" opacity="0.65" />
      <line x1={sun.x} y1={sun.y + sun.r} x2={850} y2={earth.y + shadowWidth} stroke="#fde68a" strokeWidth="2" opacity="0.65" />
      <line x1={sun.x} y1={sun.y} x2={850} y2={earth.y} stroke="#fef3c7" strokeWidth="2" strokeDasharray="8 8" opacity="0.46" />
      <circle cx={sun.x} cy={sun.y} r={sun.r} fill="url(#eclipse-sun)" filter="url(#soft-glow)" />
      <circle cx={earth.x} cy={earth.y} r={earth.r} fill="url(#eclipse-earth)" />
      <circle cx={moon.x} cy={moon.y} r={moon.r} fill={nearMiss ? "url(#eclipse-moon)" : "#b45309"} stroke={nearMiss ? "#e2e8f0" : "#fed7aa"} strokeWidth="2" />
      <text x={sun.x} y={sun.y + 116} fill="#fde68a" textAnchor="middle" className="text-sm font-bold">Sun</text>
      <text x={earth.x} y={earth.y + 108} fill="#bfdbfe" textAnchor="middle" className="text-sm font-bold">Earth casts shadow</text>
      <text x={moon.x} y={moon.y + 86} fill="#e2e8f0" textAnchor="middle" className="text-sm font-bold">Moon</text>
      <Label x={585} y={earth.y - shadowWidth * 0.45 - 22} text="umbra" color="#cbd5e1" />
      <Label x={575} y={earth.y - shadowWidth - 18} text="penumbra" color="#fde68a" />
    </>
  );
}

function AngleGauge({ x, y, sun, moon, offset, mode }: { x: number; y: number; sun: number; moon: number; offset: number; mode: EclipseMode }) {
  return (
    <g>
      <rect x={x - 20} y={y - 34} width="148" height="140" rx="18" fill="#0f172a" opacity="0.92" stroke="#334155" />
      <text x={x} y={y - 8} fill="#e2e8f0" className="text-xs font-bold">{mode === "solar" ? "Observer angles" : "Shadow angles"}</text>
      <path d={`M ${x + 10} ${y + 58} A 46 46 0 0 1 ${x + 88} ${y + 32}`} fill="none" stroke="#facc15" strokeWidth="5" />
      <path d={`M ${x + 17} ${y + 62} A 36 36 0 0 1 ${x + 78} ${y + 44}`} fill="none" stroke="#38bdf8" strokeWidth="5" />
      <line x1={x + 10} y1={y + 72} x2={x + 98} y2={y + 72 + offset * 25} stroke="#f97316" strokeWidth="3" strokeDasharray="6 5" />
      <text x={x} y={y + 92} fill="#fde68a" className="text-[11px]">Sun {roundTo(sun, 2)} deg</text>
      <text x={x} y={y + 108} fill="#7dd3fc" className="text-[11px]">Moon {roundTo(moon, 2)} deg</text>
      <text x={x} y={y + 124} fill="#fdba74" className="text-[11px]">Offset {roundTo(Math.abs(offset), 2)} deg</text>
    </g>
  );
}

function classifyEclipse(mode: EclipseMode, offset: number, moonAngle: number, lightSpread: number) {
  if (mode === "solar") {
    const threshold = (sunAngle + moonAngle) / 2;
    if (offset > threshold) return { title: "No solar eclipse", reason: "The Moon misses the Sun's apparent disk from the observer's line of sight.", threshold };
    if (offset > Math.abs(moonAngle - sunAngle) / 2) return { title: "Partial solar eclipse", reason: "Only part of the Sun is covered because the angular centers are offset.", threshold };
    if (moonAngle >= sunAngle) return { title: "Total solar eclipse", reason: "The Moon's apparent angle is large enough to cover the full Sun.", threshold };
    return { title: "Annular solar eclipse", reason: "The Moon is centered but appears smaller, leaving a ring of sunlight.", threshold };
  }
  const umbra = Math.max(0.36, lightSpread * 0.82);
  const penumbra = Math.max(0.72, lightSpread * 1.55);
  if (offset <= umbra * 0.42) return { title: "Total lunar eclipse", reason: "The Moon is deep inside Earth's umbra, so direct sunlight is blocked.", threshold: penumbra };
  if (offset <= umbra) return { title: "Partial lunar eclipse", reason: "Part of the Moon crosses Earth's dark umbra.", threshold: penumbra };
  if (offset <= penumbra) return { title: "Penumbral lunar eclipse", reason: "The Moon passes through Earth's lighter penumbra.", threshold: penumbra };
  return { title: "No lunar eclipse", reason: "The Moon is outside Earth's shadow because the orbit is tilted away from alignment.", threshold: penumbra };
}

function diskOverlapPercent(r1: number, r2: number, d: number) {
  if (d >= r1 + r2) return 0;
  if (d <= Math.abs(r1 - r2)) return 100 * (Math.PI * Math.min(r1, r2) ** 2) / (Math.PI * r1 ** 2);
  const a = r1 ** 2 * Math.acos((d ** 2 + r1 ** 2 - r2 ** 2) / (2 * d * r1));
  const b = r2 ** 2 * Math.acos((d ** 2 + r2 ** 2 - r1 ** 2) / (2 * d * r2));
  const c = 0.5 * Math.sqrt((-d + r1 + r2) * (d + r1 - r2) * (d - r1 + r2) * (d + r1 + r2));
  return clamp(((a + b - c) / (Math.PI * r1 ** 2)) * 100, 0, 100);
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10"><p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</p><p className="mt-1 font-bold">{value}</p></div>;
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10"><p className="font-bold">{title}</p><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p></div>;
}

function Label({ x, y, text, color }: { x: number; y: number; text: string; color: string }) {
  return <text x={x} y={y} fill={color} textAnchor="middle" className="text-xs font-bold uppercase tracking-wide">{text}</text>;
}
