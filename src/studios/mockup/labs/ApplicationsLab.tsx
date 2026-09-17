import { useMemo, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { MockupLearningStrip } from "../MockupStudioChrome";
import type { StudioMockupPage } from "../studioMockupCatalog";
import { ChallengeBox, Field, LiveRow, Panel, Segmented, SliderRow, StepList, clamp, fmt, useLabMode } from "../studioLabKit";

const DEG = Math.PI / 180;
const METERS_TO_FEET = 3.28084;

const PRESETS = [
  { id: "tower", label: "Tower", distance: 90, eye: 1.7, elevation: 45, base: 0 },
  { id: "cliff", label: "Cliff", distance: 42, eye: 1.6, elevation: 62, base: 0 },
  { id: "tree", label: "Tree", distance: 24, eye: 1.5, elevation: 28, base: 0 },
  { id: "lighthouse", label: "Lighthouse", distance: 120, eye: 2, elevation: 18, base: 4 },
] as const;

const SPECIAL_ANGLES = [15, 30, 45, 60];
const COMPASS_POINTS = [
  { id: "N", deg: 0 },
  { id: "NE", deg: 45 },
  { id: "E", deg: 90 },
  { id: "SE", deg: 135 },
  { id: "S", deg: 180 },
  { id: "SW", deg: 225 },
  { id: "W", deg: 270 },
  { id: "NW", deg: 315 },
] as const;

function Toggle({ checked, onChange, children }: { checked: boolean; onChange: (next: boolean) => void; children: ReactNode }) {
  return (
    <label className="msk-toggle trig-target-toggle">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {children}
    </label>
  );
}

function formatBearing(deg: number) {
  const wrapped = ((deg % 360) + 360) % 360;
  return `${String(Math.round(wrapped)).padStart(3, "0")}°`;
}

function LengthSlider({
  label,
  meters,
  minMeters,
  maxMeters,
  stepMeters,
  unitScale,
  unitLabel,
  onMeters,
}: {
  label: string;
  meters: number;
  minMeters: number;
  maxMeters: number;
  stepMeters: number;
  unitScale: number;
  unitLabel: string;
  onMeters: (meters: number) => void;
}) {
  return (
    <SliderRow
      label={label}
      value={meters * unitScale}
      min={minMeters * unitScale}
      max={maxMeters * unitScale}
      step={stepMeters * unitScale}
      onChange={(display) => onMeters(display / unitScale)}
      unit={unitLabel}
    />
  );
}

function Compass({ bearing }: { bearing: number }) {
  const angle = (bearing - 90) * DEG;
  return (
    <g className="trig-target-compass" aria-label={`Compass ${formatBearing(bearing)}`}>
      <rect x="18" y="18" width="108" height="122" rx="10" fill="rgba(255,255,255,.96)" stroke="#d8e3ed" />
      <circle cx="72" cy="70" r="34" fill="#eff6ff" stroke="#94a3b8" />
      {Array.from({ length: 12 }, (_, index) => {
        const tick = index * 30 * DEG - Math.PI / 2;
        const inner = index % 3 === 0 ? 22 : 28;
        return <line key={index} x1={72 + inner * Math.cos(tick)} y1={70 + inner * Math.sin(tick)} x2={72 + 34 * Math.cos(tick)} y2={70 + 34 * Math.sin(tick)} stroke={index % 3 === 0 ? "#0f172a" : "#94a3b8"} strokeWidth={index % 3 === 0 ? 2 : 1} />;
      })}
      <text x="68" y="28" fill="#ef4444" fontSize="11" fontWeight="800">N</text>
      <text x="100" y="74" fill="#334155" fontSize="10">E</text>
      <text x="68" y="112" fill="#334155" fontSize="10">S</text>
      <text x="30" y="74" fill="#334155" fontSize="10">W</text>
      <line x1="72" y1="70" x2={72 + 26 * Math.cos(angle)} y2={70 + 26 * Math.sin(angle)} stroke="#0ea5e9" strokeWidth="5" strokeLinecap="round" />
      <circle cx="72" cy="70" r="4" fill="#0f172a" />
      <text x="72" y="130" fill="#0f766e" fontSize="12" fontWeight="800" textAnchor="middle">{formatBearing(bearing)}</text>
    </g>
  );
}

export function ApplicationsLab({ page }: { page: StudioMockupPage }) {
  const { tabs, mode, setMode } = useLabMode(page);
  const [distanceValue, setDistanceValue] = useState(90);
  const [eyeHeight, setEyeHeight] = useState(1.7);
  const [elevation, setElevation] = useState(45);
  const [baseElevation, setBaseElevation] = useState(0);
  const [bearing, setBearing] = useState(58.2);
  const [observerX, setObserverX] = useState(104);
  const [secondStation, setSecondStation] = useState(240);
  const [animateMeasurement, setAnimateMeasurement] = useState(true);
  const [dragging, setDragging] = useState<"observer" | "target" | "station" | null>(null);
  const [units, setUnits] = useState<"m" | "ft">("m");
  const [instrument, setInstrument] = useState<"Theodolite" | "Clinometer">("Theodolite");
  const [sightKind, setSightKind] = useState<"elevation" | "depression">("elevation");
  const [presetId, setPresetId] = useState("tower");
  const [copied, setCopied] = useState(false);

  const unitScale = units === "ft" ? METERS_TO_FEET : 1;
  const unitLabel = units === "ft" ? "ft" : "m";
  const length = (meters: number, digits = 2) => `${fmt(meters * unitScale, digits)} ${unitLabel}`;
  const signedElevation = sightKind === "depression" ? -Math.abs(elevation) : Math.abs(elevation);
  const buildingAboveEye = distanceValue * Math.tan(signedElevation * DEG);
  const buildingHeight = buildingAboveEye + eyeHeight + baseElevation;
  const lineOfSight = distanceValue / Math.max(0.08, Math.cos(Math.abs(signedElevation) * DEG));
  const instrumentError = instrument === "Theodolite" ? 0.05 : 0.15;
  const heightUncertainty = Math.abs(distanceValue * (Math.tan((Math.abs(signedElevation) + instrumentError) * DEG) - Math.tan(Math.abs(signedElevation) * DEG)));
  const tide = 2.4 + 1.1 * Math.sin((bearing + elevation) * DEG);
  const daylight = 12 + 2.4 * Math.sin((bearing + 40) * DEG);
  const targetX = 474;
  const groundY = 334;
  const eyeY = groundY - eyeHeight * 18;
  const topY = clamp(eyeY - buildingAboveEye * 3.25, 28, groundY - 16);
  const windAngle = (bearing + 28) * DEG;
  const surveyLeft = Math.atan2(330 - 92, 320 - observerX) / DEG;
  const surveyRight = Math.atan2(330 - 92, secondStation - 320) / DEG;
  const isHeights = mode === "Heights & Distances";
  const isBearings = mode === "Bearings";
  const isNav = mode === "Navigation";
  const isSurvey = mode === "Surveying";
  const isPeriodic = mode === "Periodic Models";

  const summary = useMemo(() => {
    const measure = (meters: number, digits = 2) => `${fmt(meters * unitScale, digits)} ${unitLabel}`;
    if (isBearings) return `Bearing A→B ${formatBearing(bearing)} · reverse ${formatBearing(bearing + 180)}`;
    if (isNav) return `Course ${formatBearing(bearing)} · wind ${fmt(elevation, 1)}°`;
    if (isSurvey) return `Baseline ${measure(Math.abs(secondStation - observerX) / 4.62)}`;
    if (isPeriodic) return `Tide ${fmt(tide, 2)} m · daylight ${fmt(daylight, 1)} h`;
    return `${sightKind === "depression" ? "Depression" : "Elevation"} θ=${fmt(Math.abs(signedElevation), 1)}° · d=${measure(distanceValue)} · H=${measure(buildingHeight)}`;
  }, [bearing, buildingHeight, daylight, distanceValue, elevation, isBearings, isNav, isPeriodic, isSurvey, observerX, secondStation, sightKind, signedElevation, tide, unitLabel, unitScale]);

  const applyPreset = (id: string) => {
    const preset = PRESETS.find((item) => item.id === id);
    if (!preset) return;
    setPresetId(id);
    setDistanceValue(preset.distance);
    setEyeHeight(preset.eye);
    setElevation(preset.elevation);
    setBaseElevation(preset.base);
    setObserverX(104);
    setSightKind("elevation");
  };

  const reset = () => {
    applyPreset("tower");
    setBearing(64);
    setSecondStation(240);
    setUnits("m");
    setInstrument("Theodolite");
    setAnimateMeasurement(true);
    setCopied(false);
  };

  const copySummary = async () => {
    try {
      await navigator.clipboard?.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const sceneMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = clamp(((event.clientX - box.left) / box.width) * 590, 55, 470);
    if (dragging === "observer") {
      setObserverX(Math.min(x, targetX - 70));
      setDistanceValue(clamp((targetX - x) / 4.62, 10, 120));
    } else if (dragging === "station") {
      setSecondStation(clamp(x, observerX + 40, targetX - 40));
    } else {
      const y = clamp(((event.clientY - box.top) / box.height) * 390, 34, groundY - 12);
      const next = clamp(Math.atan2(Math.abs(eyeY - y), targetX - observerX) / DEG, 3, 85);
      setElevation(next);
      setSightKind(y > eyeY ? "depression" : "elevation");
    }
  };

  const onSceneKey = (event: KeyboardEvent<SVGSVGElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      const next = clamp(observerX - 8, 55, targetX - 70);
      setObserverX(next);
      setDistanceValue(clamp((targetX - next) / 4.62, 10, 120));
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      const next = clamp(observerX + 8, 55, targetX - 70);
      setObserverX(next);
      setDistanceValue(clamp((targetX - next) / 4.62, 10, 120));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setElevation((value) => clamp(value + 1, 0, 85));
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setElevation((value) => clamp(value - 1, 0, 85));
    }
  };

  return (
    <>
      <nav className="msk-tabs trig-target-tabs app-target-tabs" aria-label="Applications modes">
        {tabs.map((item) => (
          <button key={item} type="button" className={item === mode ? "active" : ""} aria-pressed={item === mode} onClick={() => { setCopied(false); setMode(item); }}>{item}</button>
        ))}
      </nav>
      <div className="msk-lab trig-target-lab app-target-lab" data-lab-mode={mode} data-mode-canvas={mode} data-app-mode={mode} data-app-units={units} data-app-instrument={instrument} data-app-sight={isHeights ? sightKind : undefined}>
        <Panel title="Measurement setup" className="trig-target-card trig-target-application-controls app-target-controls">
          <p className="msk-note">
            {isHeights ? "Elevation or depression from a known baseline gives the missing height."
              : isBearings ? "A bearing is the clockwise angle from geographic north."
                : isNav ? "Course plus a wind vector shifts the ground track."
                  : isSurvey ? "Two stations on a measured baseline fix the target."
                    : "A sine models tides and daylight through the year."}
          </p>
          {isHeights ? (
            <>
              <div className="msk-field">
                <span>Scene preset</span>
                <Segmented label="Scene preset" value={presetId} onChange={applyPreset} options={PRESETS.map((item) => ({ id: item.id, label: item.label }))} />
              </div>
              <div className="msk-field">
                <span>Sight</span>
                <Segmented
                  label="Sight"
                  value={sightKind}
                  onChange={(value) => setSightKind(value as "elevation" | "depression")}
                  options={[{ id: "elevation", label: "Elevation" }, { id: "depression", label: "Depression" }]}
                />
              </div>
            </>
          ) : null}
          {isBearings ? (
            <div className="app-compass-chips" role="group" aria-label="Compass points">
              {COMPASS_POINTS.map((point) => (
                <button key={point.id} type="button" className={Math.round(bearing) === point.deg ? "active" : ""} onClick={() => setBearing(point.deg)}>
                  {point.id}
                </button>
              ))}
            </div>
          ) : null}
          {isBearings || isNav || isPeriodic ? (
            <SliderRow
              label={isPeriodic ? "Cycle offset" : "Bearing"}
              value={bearing}
              min={0}
              max={360}
              step={0.1}
              onChange={setBearing}
              unit="°"
            />
          ) : null}
          {isHeights ? (
            <LengthSlider
              label="Observer distance (horizontal)"
              meters={distanceValue}
              minMeters={10}
              maxMeters={500}
              stepMeters={0.1}
              unitScale={unitScale}
              unitLabel={unitLabel}
              onMeters={(next) => {
                setDistanceValue(next);
                setObserverX(clamp(targetX - next * 4.62, 55, targetX - 70));
              }}
            />
          ) : null}
          {isHeights ? (
            <LengthSlider
              label="Observer eye height"
              meters={eyeHeight}
              minMeters={0.5}
              maxMeters={3}
              stepMeters={0.05}
              unitScale={unitScale}
              unitLabel={unitLabel}
              onMeters={setEyeHeight}
            />
          ) : null}
          {isHeights || isNav || isPeriodic ? (
            <SliderRow
              label={isPeriodic ? "Phase angle" : isNav ? "Wind angle" : `Angle of ${sightKind}`}
              value={elevation}
              min={0}
              max={isNav ? 180 : 85}
              step={0.1}
              onChange={setElevation}
              unit="°"
            />
          ) : null}
          {isHeights ? (
            <div className="app-angle-chips" role="group" aria-label="Special elevation angles">
              {SPECIAL_ANGLES.map((angle) => (
                <button key={angle} type="button" className={Math.round(elevation) === angle ? "active" : ""} aria-pressed={Math.round(elevation) === angle} onClick={() => setElevation(angle)}>
                  {`${angle}°`}
                </button>
              ))}
            </div>
          ) : null}
          {isHeights ? (
            <LengthSlider
              label="Target base elevation"
              meters={baseElevation}
              minMeters={-10}
              maxMeters={10}
              stepMeters={0.1}
              unitScale={unitScale}
              unitLabel={unitLabel}
              onMeters={setBaseElevation}
            />
          ) : null}
          {isSurvey ? (
            <LengthSlider
              label="Baseline length"
              meters={Math.abs(secondStation - observerX) / 4.62}
              minMeters={8}
              maxMeters={80}
              stepMeters={0.5}
              unitScale={unitScale}
              unitLabel={unitLabel}
              onMeters={(next) => setSecondStation(clamp(observerX + next * 4.62, observerX + 40, targetX - 40))}
            />
          ) : null}
          {isHeights || isSurvey ? (
            <Field label="Units">
              <select aria-label="Measurement units" value={units} onChange={(event) => setUnits(event.target.value as "m" | "ft")}>
                <option value="m">Metric (m)</option>
                <option value="ft">Imperial (ft)</option>
              </select>
            </Field>
          ) : null}
          {isHeights ? (
            <Field label="Instrument mode" hint={`±${instrumentError}°`}>
              <select aria-label="Instrument mode" value={instrument} onChange={(event) => setInstrument(event.target.value as "Theodolite" | "Clinometer")}>
                <option>Theodolite</option>
                <option>Clinometer</option>
              </select>
            </Field>
          ) : null}
          <Toggle checked={animateMeasurement} onChange={setAnimateMeasurement}>Animate measurement</Toggle>
          <div className="msk-btn-row app-setup-actions">
            <button type="button" className="msk-soft" onClick={reset}>↻ Reset measurement</button>
            <button type="button" className="msk-soft" onClick={() => void copySummary()}>{copied ? "Copied" : "Copy reading"}</button>
          </div>
        </Panel>

        <section className="msk-panel msk-canvas trig-target-application-scene app-target-canvas" data-trig-target-mode={mode} data-app-mode={mode}>
          <svg
            className="msk-graph is-interactive"
            viewBox="0 0 590 390"
            role="img"
            tabIndex={0}
            aria-label={`${mode} real-world trigonometry scene. Arrow keys move the observer or change the angle.`}
            onPointerMove={sceneMove}
            onPointerUp={() => setDragging(null)}
            onPointerLeave={() => setDragging(null)}
            onKeyDown={onSceneKey}
          >
            <defs>
              <linearGradient id="trig-app-sky" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#5598d0" /><stop offset="1" stopColor="#d9efff" /></linearGradient>
              <linearGradient id="trig-app-glass" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#233b56" /><stop offset=".5" stopColor="#7aa2bd" /><stop offset="1" stopColor="#1e334b" /></linearGradient>
            </defs>
            <rect width="590" height="390" fill="url(#trig-app-sky)" />
            <circle cx="126" cy="86" r="26" fill="#fff" opacity=".5" /><circle cx="155" cy="88" r="35" fill="#fff" opacity=".46" /><circle cx="190" cy="91" r="23" fill="#fff" opacity=".42" />
            <path d="M0 274 Q70 234 145 267 T300 259 T460 251 T590 266 V390 H0Z" fill="#4f7d35" />
            <path d="M0 302 Q90 270 175 300 T340 286 T500 295 T590 284 V390 H0Z" fill="#739546" />
            <rect x="0" y={groundY} width="590" height={390 - groundY} fill="#527c2e" />

            {isPeriodic ? (
              <>
                <rect x="0" y="220" width="590" height="170" fill="#0b4f6c" opacity=".92" />
                <line x1="28" y1="268" x2="560" y2="268" stroke="#94a3b8" />
                <text x="28" y="262" fill="#e2e8f0" fontSize="11">midline 2.4 m</text>
                <polyline points={Array.from({ length: 120 }, (_, index) => `${index * 5},${268 - 26 * Math.sin(index / 7 + elevation * DEG)}`).join(" ")} fill="none" stroke="#7dd3fc" strokeWidth="3" />
                <line x1="28" y1={268 - 26} x2="560" y2={268 - 26} stroke="#fde68a" strokeDasharray="5 4" />
                <line x1="28" y1={268 + 26} x2="560" y2={268 + 26} stroke="#fde68a" strokeDasharray="5 4" />
                <text x="28" y="36" fill="#0f172a" fontSize="15" fontWeight="800">Tide model h(t) = 2.4 + 1.1 sin(ωt + φ)</text>
                <text x="28" y="58" fill="#0f172a" fontSize="13">Daylight ≈ {fmt(daylight, 1)} h · amplitude 1.1 m · period one tide cycle</text>
                <rect x="24" y="188" width="210" height="28" rx="8" fill="#fff" />
                <text x="36" y="207" fill="#0f172a" fontSize="13" fontWeight="800">predicted tide {fmt(tide, 2)} m</text>
              </>
            ) : isBearings ? (
              <>
                <rect width="590" height="390" fill="#f8fbff" />
                <line x1="40" y1="200" x2="550" y2="200" stroke="#94a3b8" />
                <line x1="220" y1="28" x2="220" y2="360" stroke="#94a3b8" />
                {Array.from({ length: 12 }, (_, index) => {
                  const tick = index * 30 * DEG;
                  return <line key={index} x1={220 + 18 * Math.sin(tick)} y1={200 - 18 * Math.cos(tick)} x2={220 + 186 * Math.sin(tick)} y2={200 - 186 * Math.cos(tick)} stroke="#e2e8f0" />;
                })}
                <text x="214" y="24" fill="#ef4444" fontSize="14" fontWeight="700">N</text>
                <text x="556" y="206" fill="#334155" fontSize="13">E</text>
                <text x="214" y="378" fill="#334155" fontSize="13">S</text>
                <text x="18" y="206" fill="#334155" fontSize="13">W</text>
                <line x1="220" y1="200" x2={220 + 210 * Math.sin(bearing * DEG)} y2={200 - 210 * Math.cos(bearing * DEG)} stroke="#0ea5e9" strokeWidth="3" />
                <circle cx="220" cy="200" r="7" fill="#0ea5e9" />
                <circle cx={220 + 210 * Math.sin(bearing * DEG)} cy={200 - 210 * Math.cos(bearing * DEG)} r="7" fill="#0ea5e9" />
                <text x="206" y="222" fill="#0f172a" fontSize="13" fontWeight="700">A</text>
                <text x={220 + 210 * Math.sin(bearing * DEG) + 10} y={200 - 210 * Math.cos(bearing * DEG) - 8} fill="#0f172a" fontSize="13" fontWeight="700">B</text>
                <text x="248" y="188" fill="#0ea5e9" fontSize="16" fontWeight="700">{formatBearing(bearing)}</text>
                <text x="400" y="48" fill="#0f172a" fontSize="14">A → B bearing</text>
                <text x="400" y="72" fill="#0ea5e9" fontSize="22" fontWeight="800">{formatBearing(bearing)}</text>
                <text x="400" y="108" fill="#0f172a" fontSize="14">Reverse B → A</text>
                <text x="400" y="132" fill="#64748b" fontSize="22" fontWeight="800">{formatBearing(bearing + 180)}</text>
                <Compass bearing={bearing} />
              </>
            ) : isNav ? (
              <>
                <path d={`M80 330 L${80 + 250 * Math.sin(bearing * DEG)} ${330 - 250 * Math.cos(bearing * DEG)}`} stroke="#fbbf24" strokeWidth="4" />
                <path d={`M${80 + 250 * Math.sin(bearing * DEG)} ${330 - 250 * Math.cos(bearing * DEG)} l${70 * Math.sin(windAngle)} ${-70 * Math.cos(windAngle)}`} stroke="#a78bfa" strokeWidth="3" />
                <path d={`M80 330 L${80 + 250 * Math.sin(bearing * DEG) + 70 * Math.sin(windAngle)} ${330 - 250 * Math.cos(bearing * DEG) - 70 * Math.cos(windAngle)}`} stroke="#22d3ee" strokeWidth="3" strokeDasharray="7 4" />
                <circle cx="80" cy="330" r="8" fill="#fbbf24" />
                <rect x="16" y="18" width="268" height="64" rx="10" fill="#fff" />
                <text x="28" y="40" fill="#0f172a" fontSize="15" fontWeight="800">Course + wind = ground track</text>
                <text x="28" y="62" fill="#92400e" fontSize="12">gold course · purple wind · cyan track</text>
                <g className="app-nav-legend" transform="translate(360 24)">
                  <rect width="210" height="78" rx="10" fill="#fff" />
                  <circle cx="16" cy="20" r="5" fill="#fbbf24" /><text x="28" y="24" fill="#0f172a" fontSize="12">Course {formatBearing(bearing)}</text>
                  <circle cx="16" cy="42" r="5" fill="#a78bfa" /><text x="28" y="46" fill="#0f172a" fontSize="12">Wind {fmt(elevation, 1)}°</text>
                  <circle cx="16" cy="64" r="5" fill="#22d3ee" /><text x="28" y="68" fill="#0f172a" fontSize="12">Ground track</text>
                </g>
                <g transform="translate(8 248)">
                  <Compass bearing={bearing} />
                </g>
              </>
            ) : isSurvey ? (
              <>
                <line x1={observerX} y1="330" x2={secondStation} y2="330" stroke="#22d3ee" strokeWidth="4" />
                <line x1={observerX} y1="330" x2="320" y2="92" stroke="#fbbf24" strokeWidth="2" />
                <line x1={secondStation} y1="330" x2="320" y2="92" stroke="#a78bfa" strokeWidth="2" />
                <circle cx="320" cy="92" r="8" fill="#f97316" />
                <circle cx={observerX} cy="330" r="10" fill="#fbbf24" stroke="#fff" strokeWidth="2" onPointerDown={(event) => { event.preventDefault(); setDragging("observer"); }} />
                <circle cx={secondStation} cy="330" r="10" fill="#a78bfa" stroke="#fff" strokeWidth="2" onPointerDown={(event) => { event.preventDefault(); setDragging("station"); }} />
                <text x={(observerX + secondStation) / 2} y="354" fill="#0f172a" fontSize="13" fontWeight="800" textAnchor="middle">baseline {length(Math.abs(secondStation - observerX) / 4.62, 1)}</text>
                <rect x="16" y="16" width="220" height="58" rx="10" fill="#fff" />
                <text x="28" y="38" fill="#0f172a" fontSize="15" fontWeight="800">Two-station survey</text>
                <text x="28" y="58" fill="#334155" fontSize="12">A {fmt(surveyLeft, 0)}° · B {fmt(surveyRight, 0)}°</text>
                <text x={observerX - 6} y="318" fill="#92400e" fontSize="12">A</text>
                <text x={secondStation + 8} y="318" fill="#6d28d9" fontSize="12">B</text>
                <text x="328" y="88" fill="#c2410c" fontSize="12">T</text>
              </>
            ) : (
              <>
                <rect width="590" height="390" fill="#f8fbff" />
                <line x1="36" y1={groundY} x2="560" y2={groundY} stroke="#64748b" strokeWidth="2" />
                {Array.from({ length: 9 }, (_, index) => (
                  <g key={`scale-${index}`}>
                    <line x1={observerX + index * 40} y1={groundY} x2={observerX + index * 40} y2={groundY + 8} stroke="#475569" />
                    {index % 2 === 0 ? <text x={observerX + index * 40} y={groundY + 22} fill="#475569" fontSize="9" textAnchor="middle">{fmt(index * (10 * unitScale), 0)}</text> : null}
                  </g>
                ))}
                <text x={observerX + 168} y={groundY + 36} fill="#64748b" fontSize="10">scale ({unitLabel})</text>
                <line x1={observerX} y1={eyeY} x2={targetX + 20} y2={eyeY} stroke="#94a3b8" strokeDasharray="6 4" />
                <rect x="458" y={Math.min(topY, groundY)} width="86" height={Math.abs(groundY - topY)} fill="#e2e8f0" stroke="#334155" />
                {Array.from({ length: 4 }, (_, column) => <line key={`c${column}`} x1={470 + column * 16} y1={Math.min(topY, groundY) + 10} x2={470 + column * 16} y2={groundY - 4} stroke="#94a3b8" opacity=".7" />)}
                <line x1={observerX} y1={groundY} x2={targetX} y2={groundY} stroke="#0ea5e9" strokeWidth="3" />
                <line
                  className={animateMeasurement ? "app-sight-line" : undefined}
                  x1={observerX}
                  y1={eyeY}
                  x2={targetX}
                  y2={topY}
                  stroke="#0ea5e9"
                  strokeWidth="2.4"
                />
                <line x1={targetX} y1={groundY} x2={targetX} y2={topY} stroke="#ef4444" strokeWidth="3" />
                <rect x={targetX - 10} y={groundY - 10} width="10" height="10" fill="none" stroke="#0f172a" strokeWidth="1.6" />
                <path d={`M ${observerX + 46} ${eyeY} A 46 46 0 0 ${sightKind === "depression" ? 1 : 0} ${observerX + 46 * Math.cos(Math.abs(signedElevation) * DEG)} ${eyeY + (sightKind === "depression" ? 1 : -1) * 46 * Math.sin(Math.abs(signedElevation) * DEG)}`} fill="none" stroke="#0ea5e9" strokeWidth="2" />
                <circle cx={observerX} cy={groundY - 28} r="10" fill="#0f172a" stroke="#fff" strokeWidth="2" onPointerDown={(event) => { event.preventDefault(); setDragging("observer"); }} />
                {instrument === "Theodolite" ? (
                  <g transform={`translate(${observerX - 12} ${eyeY - 18})`} aria-label="Theodolite">
                    <rect width="24" height="12" rx="2" fill="#1e293b" />
                    <line x1="12" y1="12" x2="12" y2="22" stroke="#1e293b" strokeWidth="3" />
                  </g>
                ) : (
                  <g transform={`translate(${observerX + 8} ${eyeY - 10})`} aria-label="Clinometer">
                    <circle r="10" fill="#fff" stroke="#0ea5e9" strokeWidth="2" />
                    <line x1="0" y1="0" x2="8" y2="-6" stroke="#f59e0b" strokeWidth="2" />
                  </g>
                )}
                <line x1={observerX} y1={groundY - 20} x2={observerX} y2={groundY} stroke="#0f172a" strokeWidth="4" />
                <line x1={observerX} y1={groundY} x2={observerX - 10} y2={groundY} stroke="#0f172a" strokeWidth="4" />
                <line x1={observerX} y1={groundY} x2={observerX + 10} y2={groundY} stroke="#0f172a" strokeWidth="4" />
                <circle cx={targetX} cy={topY} r="11" fill="#fff" stroke="#0ea5e9" strokeWidth="3" onPointerDown={(event) => { event.preventDefault(); setDragging("target"); }} />
                <text x={(observerX + targetX) / 2} y={groundY - 8} fill="#0ea5e9" fontSize="12" fontWeight="800" textAnchor="middle">adjacent d = {length(distanceValue)}</text>
                <text x={targetX - 8} y={(topY + groundY) / 2} fill="#ef4444" fontSize="12" fontWeight="800" textAnchor="end">opposite H = {length(buildingHeight)}</text>
                <text x={(observerX + targetX) / 2 + 12} y={(eyeY + topY) / 2 - 8} fill="#7c3aed" fontSize="12" fontWeight="800">hypotenuse {length(lineOfSight)}</text>
                <text x={observerX + 56} y={eyeY + (sightKind === "depression" ? 22 : -10)} fill="#0ea5e9" fontSize="14" fontWeight="800">{fmt(Math.abs(signedElevation), 1)}°</text>
                <text x="24" y="22" fill="#475569" fontSize="12">Line of sight · {sightKind}</text>
                <g className="trig-target-calculated-height">
                  <rect x="24" y="32" width="188" height="70" rx="10" fill="#fff" stroke="#dbeafe" />
                  <text x="118" y="52" fill="#334155" fontSize="11" textAnchor="middle">Calculated height</text>
                  <text x="118" y="74" fill="#0f172a" fontSize="18" fontWeight="800" textAnchor="middle">{length(buildingHeight)}</text>
                  <text x="118" y="92" fill="#64748b" fontSize="10" textAnchor="middle">± {length(heightUncertainty)} · {instrument}</text>
                </g>
                <g className="app-sohcahtoa" transform="translate(24 112)">
                  <rect width="188" height="28" rx="8" fill="#eef2ff" />
                  <text x="10" y="19" fill="#312e81" fontSize="11" fontWeight="800">SOH CAH TOA · tan θ = opp / adj</text>
                </g>
              </>
            )}
          </svg>
          {isHeights ? (
            <div className="app-scene-hud" aria-label="Live measurement HUD">
              <span>θ {fmt(Math.abs(signedElevation), 1)}°</span>
              <span>d {length(distanceValue, 1)}</span>
              <span>H {length(buildingHeight, 1)}</span>
              <span>{sightKind}</span>
            </div>
          ) : null}
          <p className="msk-note trig-target-scene-hint">ⓘ Drag the observer, station, or target. Arrow keys nudge the figure. Controls and overlays update in real time.</p>
        </section>

        <aside className="msk-panel msk-live trig-target-card trig-target-application-values app-target-rail">
          <h2>Live values</h2>
          {isHeights ? (
            <>
              <LiveRow color="#06b6d4" label="Horizontal distance (d)" value={length(distanceValue)} />
              <LiveRow color="#f59e0b" label={`Angle of ${sightKind} (θ)`} value={`${fmt(elevation, 1)}°`} />
              <LiveRow color="#7c3aed" label="Observer eye height" value={length(eyeHeight)} />
              <LiveRow color="#8b5cf6" label="Target base elevation" value={length(baseElevation)} />
              <LiveRow color="#a78bfa" label="Line of sight length" value={length(lineOfSight)} />
              <h2>Trigonometric relation</h2>
              <p className="msk-formula app-live-formula">
                <b style={{ color: "#ef4444" }}>tan(θ)</b>
                {" = "}
                <b style={{ color: "#ef4444" }}>opp</b>
                {" / "}
                <b style={{ color: "#0ea5e9" }}>adj</b>
              </p>
              <h2>Substituted formula</h2>
              <p className="msk-formula trig-target-substitution">tan({fmt(Math.abs(signedElevation), 1)}°) = {length(Math.abs(buildingAboveEye), 2)} / {length(distanceValue)}</p>
              <div className="trig-target-result"><small>Total height (H)</small><strong>{length(buildingHeight)}</strong><small>(above ground at target base)</small></div>
              <LiveRow color="#f97316" label={`${instrument} uncertainty`} value={`± ${length(heightUncertainty)} (${instrumentError}°)`} />
            </>
          ) : null}
          {isBearings || isNav ? (
            <>
              <LiveRow color="#06b6d4" label="Bearing" value={formatBearing(bearing)} />
              <LiveRow color="#f59e0b" label={isBearings ? "From north" : "Wind angle"} value={isBearings ? formatBearing(bearing) : `${fmt(elevation, 1)}°`} />
            </>
          ) : null}
          {isBearings ? <p className="msk-formula">bearing = clockwise angle measured from north</p> : null}
          {isSurvey ? (
            <>
              <LiveRow color="#10b981" label="Baseline" value={length(Math.abs(secondStation - observerX) / 4.62)} />
              <LiveRow color="#f59e0b" label="Angle at A" value={`${fmt(surveyLeft, 1)}°`} />
              <LiveRow color="#a78bfa" label="Angle at B" value={`${fmt(surveyRight, 1)}°`} />
            </>
          ) : null}
          {isPeriodic ? (
            <>
              <LiveRow color="#06b6d4" label="Cycle offset" value={`${fmt(bearing, 1)}°`} />
              <LiveRow color="#f59e0b" label="Phase" value={`${fmt(elevation, 1)}°`} />
              <LiveRow color="#10b981" label="Predicted tide height" value={`${fmt(tide, 2)} m`} />
              <LiveRow color="#fbbf24" label="Daylight hours" value={`${fmt(daylight, 1)} h`} />
              <LiveRow color="#0ea5e9" label="Midline" value="2.4 m" />
              <LiveRow color="#8b5cf6" label="Amplitude" value="1.1 m" />
            </>
          ) : null}
          <h2>Step explanation</h2>
          <StepList items={
            isBearings ? ["Face geographic north.", "Measure clockwise to the target.", "Combine bearing with distance to locate it."]
              : isNav ? ["Plot the intended course.", "Add the wind vector.", "The resultant is the ground track."]
                : isSurvey ? ["Measure a baseline.", "Sight the target from both ends.", "Solve the resulting oblique triangle."]
                  : isPeriodic ? ["Choose a midline and amplitude.", "Set period from the repeating cycle.", "Shift phase to align a peak."]
                    : [`Measure horizontal distance d = ${length(distanceValue, 1)}.`, `Measure angle of ${sightKind} θ = ${fmt(Math.abs(signedElevation), 1)}°.`, "Compute d tan(θ), then add eye and base elevations."]
          } />
          <ChallengeBox page={page} mode={mode} />
        </aside>
      </div>
      <div className="trig-target-footer app-target-footer">
        <MockupLearningStrip page={page} mode={mode} />
      </div>
    </>
  );
}

export default ApplicationsLab;
