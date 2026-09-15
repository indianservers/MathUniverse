import { useState, type KeyboardEvent } from "react";
import type { StudioMockupPage } from "../../mockup/studioMockupCatalog";
import ArrangementsLab from "./ArrangementsLab";
import GeneratingTreeLab from "./GeneratingTreeLab";
import InclusionExclusionLab from "./InclusionExclusionLab";
import PigeonholeLab from "./PigeonholeLab";
import SelectionsLab from "./SelectionsLab";
import "./CombinatoricsLab.css";
import { COMBO_MODES, comboModeMeta, useComboLabMode, type ComboModeId } from "./combinatoricsMode";
import { LearningStrip } from "./combinatoricsUi";

function TabIcon({ id }: { id: ComboModeId }) {
  if (id === "arrangements") {
    return (
      <svg className="combo-mini" viewBox="0 0 46 46" aria-hidden="true">
        <rect x="6" y="14" width="10" height="18" rx="3" fill="#147df2" />
        <rect x="18" y="14" width="10" height="18" rx="3" fill="#8b45f4" />
        <rect x="30" y="14" width="10" height="18" rx="3" fill="#08b9dd" />
        <text x="11" y="27" fill="#fff" fontSize="8">1</text>
      </svg>
    );
  }
  if (id === "selections") {
    return (
      <svg className="combo-mini" viewBox="0 0 46 46" aria-hidden="true">
        <circle cx="14" cy="18" r="6" fill="#147df2" />
        <circle cx="32" cy="18" r="6" fill="#cbd5e1" />
        <circle cx="14" cy="32" r="6" fill="#cbd5e1" />
        <circle cx="32" cy="32" r="6" fill="#8b45f4" />
      </svg>
    );
  }
  if (id === "pigeonhole") {
    return (
      <svg className="combo-mini" viewBox="0 0 46 46" aria-hidden="true">
        <rect x="6" y="20" width="14" height="16" rx="3" fill="#e2e8f0" stroke="#94a3b8" />
        <rect x="26" y="20" width="14" height="16" rx="3" fill="#fff7ed" stroke="#f59e0b" />
        <circle cx="13" cy="14" r="4" fill="#147df2" />
        <circle cx="33" cy="12" r="4" fill="#147df2" />
        <circle cx="33" cy="28" r="4" fill="#147df2" />
      </svg>
    );
  }
  if (id === "inclusion-exclusion") {
    return (
      <svg className="combo-mini" viewBox="0 0 46 46" aria-hidden="true">
        <circle cx="18" cy="23" r="12" fill="#147df244" stroke="#147df2" />
        <circle cx="28" cy="23" r="12" fill="#8b45f433" stroke="#8b45f4" />
      </svg>
    );
  }
  return (
    <svg className="combo-mini" viewBox="0 0 46 46" aria-hidden="true">
      <circle cx="23" cy="8" r="4" fill="#8b45f4" />
      <line x1="23" y1="12" x2="12" y2="24" stroke="#94a3b8" />
      <line x1="23" y1="12" x2="34" y2="24" stroke="#94a3b8" />
      <circle cx="12" cy="26" r="4" fill="#147df2" />
      <circle cx="34" cy="26" r="4" fill="#08b9dd" />
      <line x1="12" y1="30" x2="8" y2="38" stroke="#94a3b8" />
      <line x1="12" y1="30" x2="16" y2="38" stroke="#94a3b8" />
      <circle cx="8" cy="40" r="3" fill="#10b981" />
      <circle cx="16" cy="40" r="3" fill="#10b981" />
    </svg>
  );
}

const STRIPS: Record<ComboModeId, Array<{ title: string; text: string; action: string }>> = {
  arrangements: [
    { title: "Observe", text: "Swap two objects.", action: "observe" },
    { title: "Understand", text: "Order changes the outcome.", action: "understand" },
    { title: "Why", text: "Each position has fewer remaining choices.", action: "why" },
    { title: "Try", text: "Allow repetition.", action: "try" },
    { title: "Challenge", text: "Build exactly 24 arrangements.", action: "challenge" },
  ],
  selections: [
    { title: "Observe", text: "Select three cards.", action: "observe" },
    { title: "Understand", text: "Different orders are the same subset.", action: "understand" },
    { title: "Why", text: "C(n,r) divides out the r! orders.", action: "why" },
    { title: "Try", text: "Open Pascal’s identity.", action: "try" },
    { title: "Challenge", text: "Choose 3 from 8.", action: "challenge" },
  ],
  pigeonhole: [
    { title: "Observe", text: "Watch box occupancy.", action: "observe" },
    { title: "Understand", text: "More objects than boxes forces repetition.", action: "understand" },
    { title: "Why", text: "Uniform distribution has a limit.", action: "why" },
    { title: "Try", text: "Increase objects.", action: "try" },
    { title: "Challenge", text: "Guarantee 4 in one box.", action: "challenge" },
  ],
  "inclusion-exclusion": [
    { title: "Observe", text: "Shade A, then B.", action: "observe" },
    { title: "Understand", text: "Overlap is counted twice.", action: "understand" },
    { title: "Why", text: "Subtract the intersection once.", action: "why" },
    { title: "Try", text: "Open the three-set survey.", action: "try" },
    { title: "Challenge", text: "Compute a union.", action: "challenge" },
  ],
  "generating-tree": [
    { title: "Observe", text: "Grow the tree one level.", action: "observe" },
    { title: "Understand", text: "Leaves are complete outcomes.", action: "understand" },
    { title: "Why", text: "Independent choices multiply.", action: "why" },
    { title: "Try", text: "Block consecutive 1s.", action: "try" },
    { title: "Challenge", text: "Count binary strings of length 5.", action: "challenge" },
  ],
};

export default function CombinatoricsLab({ page }: { page: StudioMockupPage }) {
  const { mode, kind, setMode, setKind } = useComboLabMode();
  const [pulse, setPulse] = useState("observe");
  const meta = comboModeMeta(mode);

  const onKey = (event: KeyboardEvent) => {
    const index = COMBO_MODES.findIndex((item) => item.id === mode);
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      setMode(COMBO_MODES[(index + 1) % COMBO_MODES.length]!.id);
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      setMode(COMBO_MODES[(index - 1 + COMBO_MODES.length) % COMBO_MODES.length]!.id);
    }
  };

  const strip = STRIPS[mode];
  const onStrip = (action: string) => {
    setPulse(action);
    if (mode === "arrangements" && action === "try") setKind("repetition");
    if (mode === "arrangements" && action === "challenge") setKind("all");
    if (mode === "selections" && action === "try") setKind("pascal");
    if (mode === "pigeonhole" && action === "try") setKind("generalized");
    if (mode === "pigeonhole" && action === "challenge") setKind("challenge");
    if (mode === "inclusion-exclusion" && action === "try") setKind("survey");
    if (mode === "generating-tree" && action === "try") setKind("restricted");
  };

  return (
    <div className="combo-lab" data-lab-mode={meta.label} data-mode-canvas={meta.label}>
      <div className="combo-tabs" role="tablist" aria-label="Combinatorics Lab topics" onKeyDown={onKey}>
        {COMBO_MODES.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={item.id === mode}
            tabIndex={item.id === mode ? 0 : -1}
            className="combo-tab"
            onClick={() => setMode(item.id)}
          >
            <TabIcon id={item.id} />
            <span>
              <b>{item.label}</b>
              <small>{item.subtitle}</small>
            </span>
          </button>
        ))}
      </div>
      {mode === "arrangements" ? <ArrangementsLab kindRaw={kind} setKind={setKind} pulse={pulse} /> : null}
      {mode === "selections" ? <SelectionsLab kindRaw={kind} setKind={setKind} pulse={pulse} /> : null}
      {mode === "pigeonhole" ? <PigeonholeLab kindRaw={kind} setKind={setKind} pulse={pulse} /> : null}
      {mode === "inclusion-exclusion" ? <InclusionExclusionLab kindRaw={kind} setKind={setKind} pulse={pulse} /> : null}
      {mode === "generating-tree" ? <GeneratingTreeLab kindRaw={kind} setKind={setKind} pulse={pulse} /> : null}
      <LearningStrip
        items={strip.map((item) => ({
          title: item.title,
          text: item.text,
          active: pulse === item.action,
          onClick: () => onStrip(item.action),
        }))}
      />
      <p className="combo-note">{page.title} · {meta.subtitle}. Pascal’s triangle lives under Selections.</p>
    </div>
  );
}
