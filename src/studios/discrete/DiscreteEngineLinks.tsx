import { useStudioState } from "../phase1/StudioModelProvider";
import { Link } from "react-router-dom";
import { useState } from "react";
import type { StudioMockupPage } from "../mockup/studioMockupCatalog";
import { ChallengeBox, LiveRow, Panel, StatusOk, StepList } from "../mockup/studioLabKit";
import { Phase1LabChrome } from "../phase1/Phase1LabChrome";
import { dijkstraSteps, edgeId, kruskalSteps, raceEdges } from "./graphRace";

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
            <ChallengeBox prompt="|A ∪ B| for A={1,2,3} and B={3,4}?" expected={4} hint="Union counts 3 only once: {1,2,3,4}." />
            <StepList items={["Open the linked lab.", "Drag circles A, B, C.", "Come back here only as a discrete-world shortcut."]} />
          </aside>
        </>
      )}
    </Phase1LabChrome>
  );
}

export function DiscreteGraphsLinkLab({ page }: { page: StudioMockupPage }) {
  const [step, setStep] = useStudioState("DiscreteEngineLinks:DiscreteGraphsLinkLab:step", 0);
  const shortest = dijkstraSteps();
  const spanning = kruskalSteps();
  const positions: Record<string, [number, number]> = { A: [55, 55], B: [150, 40], C: [105, 140], D: [250, 55], E: [290, 140] };
  const GRAPH_TABS = ["build", "representations", "algorithms", "properties", "learn"] as const;
  const tab = (mode: string) => {
    const preferred = mode === "Paths"
      ? "algorithms"
      : mode === "Connectivity"
        ? "properties"
        : mode === "Coloring"
          ? "coloring"
          : mode === "Spanning Trees"
            ? "trees"
            : mode === "Flows"
              ? "flow"
              : "build";
    return (GRAPH_TABS as readonly string[]).includes(preferred) ? preferred : "algorithms";
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
            <h2>Algorithm race: shortest paths and minimum spanning tree</h2>
            <div className="msk-seg"><button type="button" disabled={step === 0} onClick={() => setStep((n) => n - 1)}>Previous step</button><button type="button" disabled={step >= Math.max(shortest.length, spanning.length) - 1} onClick={() => setStep((n) => n + 1)}>Next step</button><button type="button" onClick={() => setStep(0)}>Restart</button></div>
            <p className="msk-note">Step {step} of {Math.max(shortest.length, spanning.length) - 1}. Blue = Dijkstra from A; purple = Kruskal spanning tree; dashed = candidate.</p>
            {([shortest, spanning] as const).map((steps, race) => { const current = steps[Math.min(step, steps.length - 1)]; const color = race ? "#8b45f4" : "#147df2"; return <div key={race}>
              <h3>{race ? "Kruskal · minimum spanning tree" : "Dijkstra · shortest paths from A"}</h3>
              <svg className="msk-graph" viewBox="0 0 360 180" role="img" aria-label={race ? "Kruskal spanning tree step" : "Dijkstra shortest path step"}>
              <rect width="360" height="180" fill="#f8fbff" />
              {raceEdges.map((edge) => { const [x1, y1] = positions[edge.a], [x2, y2] = positions[edge.b]; const id = edgeId(edge); return <g key={id}><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={current.chosen.includes(id) ? color : "#94a3b8"} strokeWidth={current.chosen.includes(id) ? 4 : 2} strokeDasharray={current.candidates.includes(id) && !current.chosen.includes(id) ? "4 3" : undefined} /><text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 4} fill="#334155" fontSize="11">{edge.w}</text></g>; })}
              {Object.entries(positions).map(([node, [x, y]]) => <g key={node}><circle cx={x} cy={y} r="13" fill={current.visited.includes(node) ? color : "#fff"} stroke={color} strokeWidth="2" /><text x={x} y={y + 4} textAnchor="middle" fontSize="12" fill={current.visited.includes(node) ? "#fff" : "#1e293b"}>{node}</text></g>)}
              </svg><p className="msk-note">{current.reason} Cost: {current.cost}. Visited: {current.visited.join(", ") || "none"}. Candidate edges: {current.candidates.join(", ") || "none"}.</p>
            </div>; })}
          </section>
          <aside className="msk-panel msk-live">
            <LiveRow color="#147df2" label="Dijkstra current distance" value={String(shortest[Math.min(step, shortest.length - 1)].cost)} />
            <LiveRow color="#8b45f4" label="Kruskal tree cost" value={String(spanning[Math.min(step, spanning.length - 1)].cost)} />
            <StatusOk>A tree with n vertices has n−1 edges. Prove it on a graph you build.</StatusOk>
            <StepList items={["Open Graph Theory.", "Run Dijkstra on your graph.", "Return via Discrete World when hopping topics."]} />
          </aside>
        </>
      )}
    </Phase1LabChrome>
  );
}
