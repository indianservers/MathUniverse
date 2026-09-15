import { Link } from "react-router-dom";
import type { StudioMockupPage } from "../mockup/studioMockupCatalog";
import { LiveRow, Panel, StatusOk, StepList } from "../mockup/studioLabKit";
import { Phase1LabChrome } from "../phase1/Phase1LabChrome";

export function DiscreteSetsLinkLab({ page }: { page: StudioMockupPage }) {
  return (
    <Phase1LabChrome page={page}>
      {(mode) => (
        <>
          <Panel title={mode}>
            <p className="msk-note">The Discrete Sets tab is a window into Set Theory Studio so Venn, relations, and Hasse stay one engine.</p>
            <Link className="msk-cta" to={mode.includes("Relation") || mode === "Functions" || mode === "Equivalence" ? "/set-theory/relations" : mode === "Cartesian Products" ? "/set-theory/representations" : "/set-theory/venn-diagram-engine"}>
              Open Set Theory · {mode}
            </Link>
          </Panel>
          <section className="msk-panel msk-canvas" data-mode-canvas={mode}>
            <svg className="msk-graph" viewBox="0 0 320 200" role="img" aria-label="Venn preview">
              <rect width="320" height="200" fill="#f8fbff" />
              <circle cx="130" cy="100" r="60" fill="rgba(8,185,221,.25)" stroke="#08b9dd" />
              <circle cx="190" cy="100" r="60" fill="rgba(139,69,244,.2)" stroke="#8b45f4" />
              <text x="70" y="24" fill="#334155" fontSize="12">{mode} · full drag engine in Set Theory</text>
            </svg>
          </section>
          <aside className="msk-panel msk-live">
            <LiveRow color="#08b9dd" label="Engine" value="Set Theory Studio" />
            <StatusOk>|A ∪ B| = |A| + |B| − |A ∩ B| is proved by dragging regions, not by a static picture.</StatusOk>
            <StepList items={["Open the linked lab.", "Drag circles A, B, C.", "Come back here only as a discrete-world shortcut."]} />
          </aside>
        </>
      )}
    </Phase1LabChrome>
  );
}

export function DiscreteGraphsLinkLab({ page }: { page: StudioMockupPage }) {
  const tab = (mode: string) => {
    if (mode === "Coloring") return "algorithms";
    if (mode === "Spanning Trees" || mode === "Flows" || mode === "Paths") return "algorithms";
    if (mode === "Connectivity") return "properties";
    return "build";
  };
  return (
    <Phase1LabChrome page={page}>
      {(mode) => (
        <>
          <Panel title={mode}>
            <p className="msk-note">Graph networks in Discrete World open the Graph Theory engine so Dijkstra, MST, and coloring stay one product.</p>
            <Link className="msk-cta" to={`/graph-theory?tab=${tab(mode)}`}>Open Graph Theory · {mode}</Link>
          </Panel>
          <section className="msk-panel msk-canvas" data-mode-canvas={mode}>
            <svg className="msk-graph" viewBox="0 0 360 180" role="img" aria-label="Network preview">
              <rect width="360" height="180" fill="#f8fbff" />
              <line x1="70" y1="50" x2="210" y2="40" stroke="#147df2" />
              <line x1="70" y1="50" x2="90" y2="150" stroke="#147df2" />
              <line x1="210" y1="40" x2="310" y2="90" stroke="#8b45f4" />
              <circle cx="70" cy="50" r="10" fill="#147df2" />
              <circle cx="210" cy="40" r="10" fill="#8b45f4" />
              <circle cx="310" cy="90" r="10" fill="#08b9dd" />
              <circle cx="90" cy="150" r="10" fill="#f59e0b" />
              <text x="24" y="22" fill="#334155" fontSize="12">Build your own graph in Graph Theory — this is a shortcut, not a second Dijkstra.</text>
            </svg>
          </section>
          <aside className="msk-panel msk-live">
            <LiveRow color="#147df2" label="Engine" value="Graph Theory Studio" />
            <StatusOk>A tree with n vertices has n−1 edges. Prove it on a graph you build.</StatusOk>
            <StepList items={["Open Graph Theory.", "Run Dijkstra on your graph.", "Return via Discrete World when hopping topics."]} />
          </aside>
        </>
      )}
    </Phase1LabChrome>
  );
}
