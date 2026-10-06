import { EmbeddedWorkspaceContext } from "../../workspace/mobile/useWorkspaceOverlay";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./geometryEmbeddedWorkspace.css";

const Graph2D = lazy(() => import("../../pages/MathLabGraphingCalculator"));
const Graph3D = lazy(() => import("../../pages/MathLab3DGraphing"));

export default function GeometryEmbeddedGraph({ activityId, dimension = "2d", expressions, title, showFullWorkspace = true }: { showFullWorkspace?: boolean; activityId: string; dimension?: "2d" | "3d"; expressions: string[]; title: string }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [revision, setRevision] = useState(0);
  const [expressionRevision, setExpressionRevision] = useState(0);
  const [drafts, setDrafts] = useState(expressions);
  const source = JSON.stringify(expressions);
  const initialSource = useRef(source);
  useEffect(() => {
    if (initialSource.current === source) return;
    initialSource.current = source;
    setDrafts(JSON.parse(source));
    setExpressionRevision(value => value + 1);
  }, [source]);
  const currentScene = useRef<unknown>();
  const Component = dimension === "3d" ? Graph3D : Graph2D;
  return <details open={open} className="geo-embedded-graph" onToggle={event => setOpen(event.currentTarget.open)}>
    <summary>{title} · {dimension === "3d" ? "3D Graph" : "2D Graph"} workspace</summary>
    {open && <>
      <div className="geo-graph-expression-controls" aria-label="Graph expression controls">
        {drafts.map((expression, index) => <label key={index}>{dimension === "3d" ? `Surface ${index+1}` : `Graph ${index+1}`}<input aria-label={`${dimension === "3d" ? "Surface" : "Graph"} ${index+1} expression`} value={expression} onChange={event => { const value = event.target.value; setDrafts(previous => previous.map((item, i) => i === index ? value : item)); setExpressionRevision(value => value + 1); }} /></label>)}
      </div>
      <div className="geo-lesson-workspace-tools">
        <button type="button" onClick={() => { try { localStorage.removeItem(`geometry-studio-graph:${dimension}:${activityId}`); } catch { /* Storage may be unavailable. */ } setDrafts(expressions); setExpressionRevision(0); setRevision(v => v + 1); }}>Reset example</button>
        {showFullWorkspace && <button type="button" onClick={() => navigate(dimension === "3d" ? "/math-lab/3d-graphing" : "/workspace/graph", { state: { embeddedGraphScene: currentScene.current } })}>Open full workspace</button>}
      </div>
      <div className="geo-embedded-graph-body"><EmbeddedWorkspaceContext.Provider value={true}><Suspense fallback={<p role="status">Loading graph workspace…</p>}><Component key={`${activityId}:${revision}`} embedded={{ activityId, expressions: drafts, expressionRevision, title, onSceneChange: scene => {
        currentScene.current = scene;
        const state = scene as { functions?: Array<{input:string}>; surfaces?: Array<{expression:string}> };
        const next = dimension === "3d" ? state.surfaces?.map(row => row.expression) : state.functions?.map(row => row.input);
        if (next) setDrafts(previous => JSON.stringify(previous) === JSON.stringify(next) ? previous : next);
      } }} /></Suspense></EmbeddedWorkspaceContext.Provider></div>
    </>}
  </details>;
}
