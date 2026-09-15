import { useState, type PointerEvent, type ReactNode } from "react";
import { MockupLearningStrip } from "../MockupStudioChrome";
import type { StudioMockupPage } from "../studioMockupCatalog";
import { ChallengeBox, LiveRow, Panel, SliderRow, StepList, clamp, fmt, useLabMode } from "../studioLabKit";

const DEG = Math.PI / 180;

function Toggle({ checked, onChange, children }: { checked: boolean; onChange: (next: boolean) => void; children: ReactNode }) {
  return (
    <label className="msk-toggle trig-target-toggle">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {children}
    </label>
  );
}

function Compass({ bearing }: { bearing: number }) {
  const angle = (bearing - 90) * DEG;
  return (
    <g className="trig-target-compass">
      <rect x="18" y="18" width="96" height="108" rx="8" fill="rgba(255,255,255,.94)" stroke="#d8e3ed" />
      <circle cx="66" cy="66" r="28" fill="#eff6ff" stroke="#94a3b8" />
      <text x="62" y="32" fill="#ef4444" fontSize="10" fontWeight="700">N</text>
      <text x="92" y="70" fill="#334155" fontSize="9">E</text>
      <text x="63" y="102" fill="#334155" fontSize="9">S</text>
      <text x="30" y="70" fill="#334155" fontSize="9">W</text>
      <line x1="66" y1="66" x2={66 + 24 * Math.cos(angle)} y2={66 + 24 * Math.sin(angle)} stroke="#0ea5e9" strokeWidth="5" />
      <text x="28" y="118" fill="#0f766e" fontSize="9">{String(Math.round(bearing)).padStart(3, "0")}.{Math.round((bearing % 1) * 10)}° </text>
    </g>
  );
}

export function ApplicationsLab({ page }: { page: StudioMockupPage }) {
  const { tabs, mode, setMode } = useLabMode(page);
  const [distanceValue, setDistanceValue] = useState(80);
  const [eyeHeight, setEyeHeight] = useState(1.7);
  const [elevation, setElevation] = useState(36.5);
  const [baseElevation, setBaseElevation] = useState(0);
  const [bearing, setBearing] = useState(58.2);
  const [observerX, setObserverX] = useState(104);
  const [secondStation, setSecondStation] = useState(240);
  const [animateMeasurement, setAnimateMeasurement] = useState(true);
  const [dragging, setDragging] = useState<"observer" | "target" | "station" | null>(null);
  const buildingHeight = distanceValue * Math.tan(elevation * DEG) + eyeHeight + baseElevation;
  const lineOfSight = distanceValue / Math.cos(elevation * DEG);
  const tide = 2.4 + 1.1 * Math.sin((bearing + elevation) * DEG);
  const daylight = 12 + 2.4 * Math.sin((bearing + 40) * DEG);
  const targetX = 474;
  const groundY = 334;
  const topY = clamp(groundY - buildingHeight * 3.25, 38, 290);
  const windAngle = (bearing + 28) * DEG;

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
      setElevation(clamp(Math.atan2(groundY - y, targetX - observerX) / DEG, 3, 85));
    }
  };

  return (
    <>
      <nav className="msk-tabs trig-target-tabs app-target-tabs" aria-label="Applications modes">
        {tabs.map((item) => (
          <button key={item} type="button" className={item === mode ? "active" : ""} aria-pressed={item === mode} onClick={() => setMode(item)}>{item}</button>
        ))}
      </nav>
      <div className="msk-lab trig-target-lab app-target-lab" data-lab-mode={mode} data-mode-canvas={mode} data-app-mode={mode}>
        <Panel title="Measurement setup" className="trig-target-card trig-target-application-controls app-target-controls">
          <p className="msk-note">
            {mode === "Heights & Distances" ? "Elevation or depression from a known baseline gives the missing height."
              : mode === "Bearings" ? "A bearing is the clockwise angle from geographic north."
                : mode === "Navigation" ? "Course plus a wind vector shifts the ground track."
                  : mode === "Surveying" ? "Two stations on a measured baseline fix the target."
                    : "A sine models tides and daylight through the year."}
          </p>
          <SliderRow label={mode === "Bearings" || mode === "Navigation" ? "Bearing" : "Observer distance (horizontal)"} value={mode === "Bearings" || mode === "Navigation" ? bearing : distanceValue} min={mode === "Bearings" || mode === "Navigation" ? 0 : 10} max={mode === "Bearings" || mode === "Navigation" ? 360 : 500} step={0.1} onChange={mode === "Bearings" || mode === "Navigation" ? setBearing : setDistanceValue} unit={mode === "Bearings" || mode === "Navigation" ? "°" : "m"} />
          <SliderRow label="Observer eye height" value={eyeHeight} min={0.5} max={3} step={0.05} onChange={setEyeHeight} unit="m" />
          <SliderRow label={mode === "Periodic Models" ? "Phase angle" : mode === "Navigation" ? "Wind angle" : "Angle of elevation"} value={elevation} min={0} max={mode === "Navigation" ? 180 : 85} step={0.1} onChange={setElevation} unit="°" />
          <SliderRow label={mode === "Surveying" ? "Second station offset" : "Target base elevation"} value={mode === "Surveying" ? secondStation : baseElevation} min={mode === "Surveying" ? 120 : -10} max={mode === "Surveying" ? 400 : 10} step={0.1} onChange={mode === "Surveying" ? setSecondStation : setBaseElevation} unit={mode === "Surveying" ? "m" : "m"} />
          <label className="msk-field"><span>Units</span><select aria-label="Measurement units"><option>Metric (m)</option><option>Imperial (ft)</option></select></label>
          <label className="msk-field"><span>Instrument mode</span><select aria-label="Instrument mode"><option>Theodolite</option><option>Clinometer</option></select></label>
          <Toggle checked={animateMeasurement} onChange={setAnimateMeasurement}>Animate measurement</Toggle>
          <button type="button" className="msk-soft" onClick={() => { setDistanceValue(80); setEyeHeight(1.7); setElevation(36.5); setBaseElevation(0); setBearing(58.2); setObserverX(104); setSecondStation(240); }}>↻ Reset measurement</button>
        </Panel>

        <section className="msk-panel msk-canvas trig-target-application-scene app-target-canvas" data-trig-target-mode={mode} data-app-mode={mode}>
          <svg
            className="msk-graph is-interactive"
            viewBox="0 0 590 390"
            role="img"
            aria-label={`${mode} real-world trigonometry scene`}
            onPointerMove={sceneMove}
            onPointerUp={() => setDragging(null)}
            onPointerLeave={() => setDragging(null)}
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

            {mode === "Periodic Models" ? (
              <>
                <rect x="0" y="220" width="590" height="170" fill="#267ea5" opacity=".86" />
                <polyline points={Array.from({ length: 120 }, (_, index) => `${index * 5},${268 - 26 * Math.sin(index / 7 + elevation * DEG)}`).join(" ")} fill="none" stroke="#e0f2fe" strokeWidth="3" />
                <line x1="28" y1={300 - tide * 12} x2="560" y2={300 - tide * 12} stroke="#fbbf24" strokeDasharray="6 4" />
                <text x="28" y="48" fill="#fff" fontSize="16">Tide model h(t) = 2.4 + 1.1 sin(ωt + φ)</text>
                <text x="28" y="74" fill="#fde68a" fontSize="13">Daylight ≈ {fmt(daylight, 1)} h</text>
                <text x="28" y="210" fill="#fff" fontSize="13">predicted tide {fmt(tide, 2)} m</text>
              </>
            ) : mode === "Bearings" ? (
              <>
                <circle cx="300" cy="214" r="108" fill="rgba(255,255,255,.2)" stroke="#e0f2fe" strokeWidth="2" />
                <line x1="300" y1="214" x2="300" y2="96" stroke="#ef4444" strokeDasharray="4 3" />
                <line x1="300" y1="214" x2={300 + 108 * Math.sin(bearing * DEG)} y2={214 - 108 * Math.cos(bearing * DEG)} stroke="#fbbf24" strokeWidth="5" />
                <text x="318" y="200" fill="#fff" fontSize="16">{fmt(bearing, 1)}° clockwise from N</text>
                <Compass bearing={bearing} />
              </>
            ) : mode === "Navigation" ? (
              <>
                <path d={`M80 330 L${80 + 250 * Math.sin(bearing * DEG)} ${330 - 250 * Math.cos(bearing * DEG)}`} stroke="#fbbf24" strokeWidth="4" />
                <path d={`M${80 + 250 * Math.sin(bearing * DEG)} ${330 - 250 * Math.cos(bearing * DEG)} l${70 * Math.sin(windAngle)} ${-70 * Math.cos(windAngle)}`} stroke="#a78bfa" strokeWidth="3" />
                <path d={`M80 330 L${80 + 250 * Math.sin(bearing * DEG) + 70 * Math.sin(windAngle)} ${330 - 250 * Math.cos(bearing * DEG) - 70 * Math.cos(windAngle)}`} stroke="#22d3ee" strokeWidth="3" strokeDasharray="7 4" />
                <circle cx="80" cy="330" r="8" fill="#fbbf24" />
                <text x="24" y="40" fill="#fff" fontSize="15">Course + wind = ground track</text>
                <text x="24" y="64" fill="#fde68a" fontSize="12">gold course · purple wind · cyan track</text>
                <Compass bearing={bearing} />
              </>
            ) : mode === "Surveying" ? (
              <>
                <line x1={observerX} y1="330" x2={secondStation} y2="330" stroke="#22d3ee" strokeWidth="4" />
                <line x1={observerX} y1="330" x2="320" y2="92" stroke="#fbbf24" strokeWidth="2" />
                <line x1={secondStation} y1="330" x2="320" y2="92" stroke="#a78bfa" strokeWidth="2" />
                <circle cx="320" cy="92" r="8" fill="#f97316" />
                <circle cx={observerX} cy="330" r="8" fill="#fbbf24" onPointerDown={(event) => { event.preventDefault(); setDragging("observer"); }} />
                <circle cx={secondStation} cy="330" r="8" fill="#a78bfa" onPointerDown={(event) => { event.preventDefault(); setDragging("station"); }} />
                <text x={(observerX + secondStation) / 2} y="354" fill="#fff" fontSize="13" textAnchor="middle">baseline {fmt(Math.abs(secondStation - observerX) / 4.62, 1)} m</text>
                <text x="24" y="40" fill="#fff" fontSize="15">Two-station survey</text>
              </>
            ) : (
              <>
                <rect x="458" y={topY} width="76" height={groundY - topY} fill="url(#trig-app-glass)" stroke="#334155" />
                {Array.from({ length: 5 }, (_, column) => <line key={`c${column}`} x1={466 + column * 14} y1={topY + 8} x2={466 + column * 14} y2={groundY - 4} stroke="#b8d1df" opacity=".65" />)}
                {Array.from({ length: 9 }, (_, row) => <line key={`r${row}`} x1="460" y1={topY + 14 + row * ((groundY - topY - 18) / 9)} x2="532" y2={topY + 14 + row * ((groundY - topY - 18) / 9)} stroke="#b8d1df" opacity=".55" />)}
                <line x1={observerX} y1={groundY} x2={targetX} y2={groundY} stroke="#22d3ee" strokeWidth="3" />
                <line x1={observerX} y1={groundY - eyeHeight * 3.25} x2={targetX} y2={topY} stroke="#fff" strokeWidth="2" strokeDasharray="7 5" />
                <line x1={targetX} y1={groundY} x2={targetX} y2={topY} stroke="#c084fc" strokeWidth="4" />
                <path d={`M ${targetX - 12} ${groundY} v-12 h12`} fill="none" stroke="#fff" strokeWidth="2" />
                <path d={`M ${observerX + 42} ${groundY - eyeHeight * 3.25} A 42 42 0 0 0 ${observerX + 42 * Math.cos(elevation * DEG)} ${groundY - eyeHeight * 3.25 - 42 * Math.sin(elevation * DEG)}`} fill="none" stroke="#f59e0b" strokeWidth="2" />
                <circle cx={observerX} cy={groundY - 18} r="9" fill="#fbbf24" onPointerDown={(event) => { event.preventDefault(); setDragging("observer"); }} />
                <line x1={observerX} y1={groundY - 9} x2={observerX} y2={groundY} stroke="#334155" strokeWidth="5" />
                <circle cx={targetX} cy={topY} r="8" fill="#f97316" stroke="#fff" strokeWidth="2" onPointerDown={(event) => { event.preventDefault(); setDragging("target"); }} />
                <text x={(observerX + targetX) / 2} y={groundY - 9} fill="#e0f2fe" fontSize="13" textAnchor="middle">{fmt(distanceValue, 2)} m</text>
                <text x={observerX + 52} y={groundY - 22} fill="#fff" fontSize="13">{fmt(elevation, 1)}° {baseElevation < 0 ? "depression" : "elevation"}</text>
                <g className="trig-target-calculated-height">
                  <rect x="480" y={(topY + groundY) / 2 - 24} width="90" height="52" rx="7" fill="#7c3aed" opacity=".92" />
                  <text x="525" y={(topY + groundY) / 2 - 5} fill="#fff" fontSize="10" textAnchor="middle">Calculated height</text>
                  <text x="525" y={(topY + groundY) / 2 + 15} fill="#fff" fontSize="15" fontWeight="700" textAnchor="middle">{fmt(buildingHeight, 2)} m</text>
                </g>
                {animateMeasurement ? <Compass bearing={bearing} /> : null}
              </>
            )}
          </svg>
          <p className="msk-note trig-target-scene-hint">ⓘ Drag the observer, station, or target. Controls and overlays update in real time.</p>
        </section>

        <aside className="msk-panel msk-live trig-target-card trig-target-application-values app-target-rail">
          <h2>Live values</h2>
          <LiveRow color="#06b6d4" label={mode === "Bearings" || mode === "Navigation" ? "Bearing" : "Horizontal distance (d)"} value={mode === "Bearings" || mode === "Navigation" ? `${fmt(bearing, 1)}°` : `${fmt(distanceValue, 2)} m`} />
          <LiveRow color="#f59e0b" label={mode === "Periodic Models" ? "Phase" : mode === "Navigation" ? "Wind angle" : "Angle of elevation (θ)"} value={`${fmt(elevation, 1)}°`} />
          {mode === "Heights & Distances" ? (
            <>
              <LiveRow color="#7c3aed" label="Observer eye height" value={`${fmt(eyeHeight, 2)} m`} />
              <LiveRow color="#8b5cf6" label="Target base elevation" value={`${fmt(baseElevation, 2)} m`} />
              <LiveRow color="#a78bfa" label="Line of sight length" value={`${fmt(lineOfSight, 2)} m`} />
              <h2>Trigonometric relation</h2>
              <p className="msk-formula">tan(θ) = building height above eye / horizontal distance</p>
              <h2>Substituted formula</h2>
              <p className="msk-formula trig-target-substitution">tan({fmt(elevation, 1)}°) = H<sub>above eye</sub> / {fmt(distanceValue, 2)}</p>
              <div className="trig-target-result"><small>Total height (H)</small><strong>{fmt(buildingHeight, 2)} m</strong><small>(above ground at target base)</small></div>
              <LiveRow color="#f97316" label="Uncertainty estimate" value={`± ${fmt(buildingHeight * 0.008, 2)} m (0.8% relative)`} />
            </>
          ) : null}
          {mode === "Bearings" ? <p className="msk-formula">bearing = clockwise angle measured from north</p> : null}
          {mode === "Navigation" ? <LiveRow color="#7c3aed" label="Wind angle" value={`${fmt(elevation, 1)}°`} /> : null}
          {mode === "Surveying" ? <LiveRow color="#10b981" label="Baseline" value={`${fmt(Math.abs(secondStation - observerX) / 4.62, 2)} m`} /> : null}
          {mode === "Periodic Models" ? (
            <>
              <LiveRow color="#10b981" label="Predicted tide height" value={`${fmt(tide, 2)} m`} />
              <LiveRow color="#fbbf24" label="Daylight hours" value={`${fmt(daylight, 1)} h`} />
            </>
          ) : null}
          <h2>Step explanation</h2>
          <StepList items={
            mode === "Bearings" ? ["Face geographic north.", "Measure clockwise to the target.", "Combine bearing with distance to locate it."]
              : mode === "Navigation" ? ["Plot the intended course.", "Add the wind vector.", "The resultant is the ground track."]
                : mode === "Surveying" ? ["Measure a baseline.", "Sight the target from both ends.", "Solve the resulting oblique triangle."]
                  : mode === "Periodic Models" ? ["Choose a midline and amplitude.", "Set period from the repeating cycle.", "Shift phase to align a peak."]
                    : [`Measure horizontal distance d = ${fmt(distanceValue, 1)} m.`, `Measure angle of elevation θ = ${fmt(elevation, 1)}°.`, "Compute d tan(θ), then add eye and base elevations."]
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
