import TriangleReferenceHero from "./TriangleReferenceHero";
import { useStudioState, useStudioModel } from "../../phase1/StudioModelProvider";
import { useState } from "react";
import { Target, Info, Undo2, Redo2, RotateCcw } from "lucide-react";
import { GeometryLabShell } from "../geometryLabUx";
import type { StudioMockupPage } from "../../mockup/studioMockupCatalog";
import CongruenceLab from "./CongruenceLab";
import SimilarityLab from "./SimilarityLab";
import TriangleCentersLab from "./TriangleCentersLab";
import TriangleExplorerLab from "./TriangleExplorerLab";
import TriangleInequalitiesLab from "./TriangleInequalitiesLab";
import TriangleModeTabs from "./TriangleModeTabs";
import "./TrianglesLab.css";
import "./TrianglesReference.css";
import { LearningStrip } from "./triangleLabKit";
import { useTriangleLabMode, type TriangleModeId } from "./useTriangleLabMode";

const STRIPS: Record<TriangleModeId, Array<{ title: string; text: string; action: string }>> = {
  explorer: [
    { title: "Observe", text: "Drag C and watch sides and angles update.", action: "observe" },
    { title: "Understand", text: "∠A + ∠B + ∠C stays 180°.", action: "understand" },
    { title: "Why", text: "Area = ½bh for any chosen base.", action: "why" },
    { title: "Try", text: "Snap to an isosceles or right triangle.", action: "try" },
    { title: "Challenge", text: "Apex 40° isosceles.", action: "challenge" },
  ],
  congruence: [
    { title: "Observe", text: "Matching ticks mark corresponding sides.", action: "observe" },
    { title: "Understand", text: "SSS, SAS, ASA, AAS, and RHS determine a unique triangle.", action: "understand" },
    { title: "Why", text: "SSA can produce two different triangles.", action: "why" },
    { title: "Try", text: "Open SAS and rotate △DEF.", action: "try" },
    { title: "Challenge", text: "Build a SAS pair.", action: "challenge" },
  ],
  similarity: [
    { title: "Observe", text: "Two triangles share angles, not size.", action: "observe" },
    { title: "Understand", text: "All three side ratios equal k.", action: "understand" },
    { title: "Why", text: "Area scales by k².", action: "why" },
    { title: "Try", text: "Set k = 1.5.", action: "try" },
    { title: "Challenge", text: "Exact 1.5× copy.", action: "challenge" },
  ],
  centers: [
    { title: "Observe", text: "Medians meet at G, split 2:1.", action: "observe" },
    { title: "Understand", text: "O sits inside, on a side, or outside.", action: "understand" },
    { title: "Why", text: "Euler line through H, G, O.", action: "why" },
    { title: "Try", text: "Switch to circumcenter.", action: "try" },
    { title: "Challenge", text: "Put O outside.", action: "challenge" },
  ],
  inequalities: [
    { title: "Observe", text: "Hinge two sides toward the third.", action: "observe" },
    { title: "Understand", text: "a + b > c, and the cyclic pairs.", action: "understand" },
    { title: "Why", text: "The straight path is shortest.", action: "why" },
    { title: "Try", text: "Set 3, 4, 7 for a degenerate line.", action: "try" },
    { title: "Challenge", text: "Just-degenerate sides.", action: "challenge" },
  ],
};

const GOALS: Record<TriangleModeId, string> = {
  explorer: "Goal: drag ABC until you can name it by sides and by angles, then keep the angle sum at 180°.",
  congruence: "Goal: pick a congruence test and build a matching pair △ABC ≅ △DEF.",
  similarity: "Goal: keep equal angles while you change the scale factor k.",
  centers: "Goal: move the triangle until a chosen center sits inside, on a side, or outside.",
  inequalities: "Goal: see a + b > c fail as the three sides flatten to a line.",
};

export default function TrianglesLab({ page }: { page: StudioMockupPage }) {
  const { mode, setMode, modes } = useTriangleLabMode();
  const [pulse, setPulse] = useStudioState("TrianglesLab:TrianglesLab:pulse", "observe");
  const current = modes.find((item) => item.id === mode) ?? modes[0]!;
  const strip = STRIPS[mode];
  const [help, setHelp] = useState(false);
  const model = useStudioModel();
  const [search, setSearch] = useState("");

  return (
    <GeometryLabShell
      lab="triangles"
      modes={modes}
      mode={mode}
      onChange={(id) => setMode(id as typeof mode)}
      liveSummary={`${page.title}. ${current.label}: ${current.subtitle}. Drag a vertex, read live sides and angles, then check the challenge.`}
    >
      <div className="tri-header-search"><input aria-label="Search triangle topics" placeholder="Search topics, lessons..." value={search} onChange={event => setSearch(event.target.value)} />{search && <div>{modes.filter(item => `${item.label} ${item.subtitle}`.toLowerCase().includes(search.toLowerCase())).map(item => <button key={item.id} onClick={() => { setMode(item.id); setSearch(""); }}>{item.label}<small>{item.subtitle}</small></button>)}{!modes.some(item => `${item.label} ${item.subtitle}`.toLowerCase().includes(search.toLowerCase())) && <p>No matching triangle topics.</p>}</div>}</div>
      <TriangleReferenceHero />
      <TriangleModeTabs modes={modes} mode={mode} onChange={setMode} />
      <span className="tri-learn-ribbon" data-lab-pane="workspace">◇ &nbsp; Learn &nbsp; • &nbsp; Practice &nbsp; • &nbsp; Apply &nbsp; • &nbsp; Master</span>
      <div className="tri-goal-bar"><p className="tri-goal"><Target />{GOALS[mode]}</p><div className="tri-goal-actions"><button onClick={() => setHelp(!help)} aria-expanded={help}><Info />How to use</button><button aria-label="Undo triangle change" onClick={() => model?.ledger.undo()}><Undo2 /></button><button aria-label="Redo triangle change" onClick={() => model?.ledger.redo()}><Redo2 /></button><button onClick={() => window.dispatchEvent(new CustomEvent("triangles-reset", { detail: mode }))}><RotateCcw />Reset</button></div></div>
      {help && <div className="tri-help" role="status">Drag a labeled vertex to change the construction. Choose a triangle type or theorem on the left; measurements update on the right. Use Move to drag, Measure to select two points, or Angle to select three points with the angle vertex in the middle. Open advanced controls for exact inputs and the challenge for feedback.</div>}
      {mode === "explorer" ? <TriangleExplorerLab pulse={pulse} /> : null}
      {mode === "congruence" ? <CongruenceLab pulse={pulse} /> : null}
      {mode === "similarity" ? <SimilarityLab pulse={pulse} /> : null}
      {mode === "centers" ? <TriangleCentersLab pulse={pulse} /> : null}
      {mode === "inequalities" ? <TriangleInequalitiesLab pulse={pulse} /> : null}
      <LearningStrip
        items={strip.map((item) => ({
          title: item.title,
          text: item.text,
          active: pulse === item.action,
          onClick: () => {
            setPulse(item.action);
            if (item.action === "challenge" || item.action === "why") requestAnimationFrame(() => {
              const element = document.querySelector<HTMLDetailsElement>(item.action === "challenge" ? ".tri-more-challenge" : ".tri-more-formula");
              if (element) { element.open = true; element.scrollIntoView({ block: "nearest", behavior: "smooth" }); }
            });
          },
        }))}
      />
    </GeometryLabShell>
  );
}
