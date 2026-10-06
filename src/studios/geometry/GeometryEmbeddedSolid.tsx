import { EmbeddedWorkspaceContext } from "../../workspace/mobile/useWorkspaceOverlay";
import { lazy, Suspense, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import "./geometryEmbeddedWorkspace.css";

const MathWorkspace = lazy(() => import("../../pages/MathWorkspace"));

export function solidWorkspaceScene(solid = "cube", size = 3) {
  return { workspaceType: "3d-geometry", workspaceSnapshot: {
    input: "", results: [], plots: [], construction: { points: [], lines: [], circles: [], polygons: [], arcs: [], loci: [], constraints: [] },
    solid, height3d: size, surfaceScale: 1, crossSection: 0, showSurface: false, showSolid: true, autoRotate3d: false, zoom3d: 1,
    transforms3d: { solid: { name: solid, position: [0, 0, 0], rotation: [0, 0, 0], scale: 1, visible: true, color: "#8b45f4", dimensions: [size, size, size], opacity: 0.78, material: "glass" } },
    deletedBase3dIds: ["surface", "slice", "point", "vector", "line3d", "plane3d", "sphere3d", "cone3d", "cylinder3d", "prism3d", "pyramid3d", "polyhedron3d"],
  } };
}

export default function GeometryEmbeddedSolid({ activityId, scene = solidWorkspaceScene(), children }: { activityId: string; scene?: unknown; children?: ReactNode }) {
  const editing = !children;
  const [revision, setRevision] = useState(0);
  const latest = useRef(scene);
  const navigate = useNavigate();
  return <div className="geo-lesson-workspace" data-workspace-type="3d-geometry">
    <div className="geo-lesson-workspace-tools" role="toolbar" aria-label="3D workspace tools">
      <span>3D Geometry</span>
      {editing && <button type="button" onClick={() => { try { localStorage.removeItem(`geometry-studio-workspace:${activityId}`); } catch { /* Use in-memory state. */ } setRevision(v => v + 1); }}>Reset example</button>}
      <button type="button" onClick={() => navigate("/workspace/3d", { state: { embeddedWorkspaceScene: editing ? latest.current : scene } })}>Open full workspace</button>
    </div>
    {children && <div className="geo-lesson-presentation" hidden={editing}>{children}</div>}
    {editing && <div className="geo-lesson-editor"><EmbeddedWorkspaceContext.Provider value={true}><Suspense fallback={<p role="status">Loading 3D geometry workspace…</p>}><MathWorkspace key={`${activityId}:${revision}`} initialView="3d" singleView embedded={{ activityId, initialScene: scene, onSceneChange: next => { latest.current = next; } }} /></Suspense></EmbeddedWorkspaceContext.Provider></div>}
  </div>;
}
