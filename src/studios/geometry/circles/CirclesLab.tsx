import type { KeyboardEvent } from "react";
import { useEffect } from "react";
import { Download, Link2, RotateCcw } from "lucide-react";
import { MockupLearningStrip } from "../../mockup/MockupStudioChrome";
import type { StudioMockupPage } from "../../mockup/studioMockupCatalog";
import ArcsSectorsLab from "./ArcsSectorsLab";
import AnglesLab from "./AnglesLab";
import ChordsLab from "./ChordsLab";
import PowerOfPointLab from "./PowerOfPointLab";
import TangentsLab from "./TangentsLab";
import { CircleSessionProvider, useCircleSession } from "./CircleSession";
import { CIRCLE_MODES, circleModeMeta, type CircleModeId } from "./circleMode";
import "./CirclesLab.css";

function TabIcon({ id }: { id: CircleModeId }) {
  if (id === "chords") {
    return <svg className="clab-mini" viewBox="0 0 46 46" aria-hidden="true"><circle cx="23" cy="23" r="14" fill="none" stroke="#08b9dd" /><line x1="10" y1="18" x2="36" y2="28" stroke="#147df2" strokeWidth="2" /><circle cx="10" cy="18" r="2.5" fill="#147df2" /><circle cx="36" cy="28" r="2.5" fill="#f59e0b" /></svg>;
  }
  if (id === "tangents") {
    return <svg className="clab-mini" viewBox="0 0 46 46" aria-hidden="true"><circle cx="20" cy="24" r="12" fill="none" stroke="#08b9dd" /><line x1="8" y1="8" x2="40" y2="34" stroke="#f59e0b" strokeWidth="2" /><line x1="20" y1="24" x2="30" y2="16" stroke="#147df2" /></svg>;
  }
  if (id === "angles") {
    return <svg className="clab-mini" viewBox="0 0 46 46" aria-hidden="true"><circle cx="23" cy="23" r="14" fill="none" stroke="#08b9dd" /><path d="M23 23 L37 23 A14 14 0 0 0 31 11 Z" fill="#8b45f433" stroke="#8b45f4" /></svg>;
  }
  if (id === "power") {
    return <svg className="clab-mini" viewBox="0 0 46 46" aria-hidden="true"><circle cx="23" cy="23" r="13" fill="none" stroke="#08b9dd" /><line x1="8" y1="16" x2="38" y2="30" stroke="#147df2" /><line x1="12" y1="34" x2="36" y2="10" stroke="#8b45f4" /><circle cx="23" cy="23" r="2.4" fill="#f59e0b" /></svg>;
  }
  return <svg className="clab-mini" viewBox="0 0 46 46" aria-hidden="true"><circle cx="23" cy="23" r="14" fill="none" stroke="#08b9dd" /><path d="M23 23 L37 23 A14 14 0 0 0 23 9 Z" fill="#08b9dd33" stroke="#147df2" /></svg>;
}

function CirclesTabNavigation({ mode, onSelect }: { mode: CircleModeId; onSelect: (id: CircleModeId) => void }) {
  const onKey = (event: KeyboardEvent) => {
    const index = CIRCLE_MODES.findIndex((item) => item.id === mode);
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      onSelect(CIRCLE_MODES[(index + 1) % CIRCLE_MODES.length].id);
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      onSelect(CIRCLE_MODES[(index - 1 + CIRCLE_MODES.length) % CIRCLE_MODES.length].id);
    }
  };
  return (
    <div className="clab-tabs" role="tablist" aria-label="Circles Lab topics" onKeyDown={onKey}>
      {CIRCLE_MODES.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={item.id === mode}
          tabIndex={item.id === mode ? 0 : -1}
          className="clab-tab"
          onClick={() => onSelect(item.id)}
        >
          <TabIcon id={item.id} />
          <span>
            <b>{item.label}</b>
            <small>{item.description}</small>
          </span>
        </button>
      ))}
    </div>
  );
}

function CirclesToolbar() {
  const { snap, setSnap, teacher, setTeacher, units, setUnits, undo, share, exportSvg, announce } = useCircleSession();
  return (
    <div className="clab-toolbar">
      <label className="clab-toggle"><input type="checkbox" checked={snap} onChange={(e) => setSnap(e.currentTarget.checked)} /> Snap to 30° / 0.5</label>
      <label className="clab-toggle"><input type="checkbox" checked={teacher} onChange={(e) => setTeacher(e.currentTarget.checked)} /> Teacher mode</label>
      <div className="clab-seg" role="group" aria-label="Units">
        <button type="button" className={units === "units" ? "is-on" : ""} onClick={() => setUnits("units")}>Units</button>
        <button type="button" className={units === "cm" ? "is-on" : ""} onClick={() => setUnits("cm")}>Centimetres</button>
      </div>
      <div className="clab-figure-tools" role="group" aria-label="Figure actions">
        <button type="button" className="clab-icon" onClick={undo} aria-label="Undo" title="Undo"><RotateCcw size={15} /></button>
        <button type="button" className="clab-icon" onClick={() => void share()} aria-label="Copy share URL" title="Copy share URL"><Link2 size={15} /></button>
        <button type="button" className="clab-icon" onClick={exportSvg} aria-label="Download SVG" title="Download SVG"><Download size={15} /></button>
      </div>
      <p className="clab-live-region" role="status" aria-live="polite">{announce}</p>
    </div>
  );
}

function CirclesLabBody({ page }: { page: StudioMockupPage }) {
  const { mode, setMode, kind } = useCircleSession();
  const meta = circleModeMeta(mode);
  useEffect(() => {
    const tabs = document.querySelector(".clab-tab[aria-selected='true']") as HTMLButtonElement | null;
    tabs?.focus();
  }, [mode]);

  return (
    <div className="clab">
      <CirclesTabNavigation mode={mode} onSelect={setMode} />
      <CirclesToolbar />
      {mode === "chords" ? <ChordsLab /> : null}
      {mode === "tangents" ? <TangentsLab /> : null}
      {mode === "angles" ? <AnglesLab active /> : null}
      {mode === "power" ? <PowerOfPointLab /> : null}
      {mode === "arcs" ? <ArcsSectorsLab active /> : null}
      <MockupLearningStrip page={{ ...page, learning: {
        observe: `Watch the ${meta.label.toLowerCase()} construction respond as you drag.`,
        understand: kind ? `${meta.description} · ${kind}` : meta.description,
        why: "Each theorem is a consequence of radii, similar triangles, or intercepted arcs.",
        try: "Snap, presets, ghost targets, and arrow keys all edit the same live figure.",
        challenge: "Complete the tab challenge using the actual geometry, not a guess.",
      } }} />
    </div>
  );
}

export default function CirclesLab({ page }: { page: StudioMockupPage }) {
  return (
    <CircleSessionProvider>
      <CirclesLabBody page={page} />
    </CircleSessionProvider>
  );
}
