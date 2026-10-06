import { createMathWorkspacePayload } from "../../workspace/mathWorkspaces";
import { useState } from "react";
import { Link } from "react-router-dom";
import GeometryLessonCanvas from "./GeometryLessonCanvas";
import { lessonScene, nativeLessonScene } from "./geometryLessonScene";
import { solidWorkspaceScene } from "./GeometryEmbeddedSolid";

export default function GeometryHomeWorkspace() {
  const [ax, setAx] = useState(140);
  const A = { id: "A", x: ax, y: 150 }, B = { id: "B", x: 380, y: 150 };
  const M = { id: "M", x: (ax + 380) / 2, y: 150 };
  const scene = lessonScene(520, 280);
  const base = scene.line(A, B);
  const end = { id: "bisector-end", x: M.x, y: 20 };
  const bisector = scene.line(M, end, { color: "#8b45f4", dashArray: "6 4" });
  scene.construction.constraints.push({ id: "midpoint", type: "midpoint", a: "A", b: "B", point: "M" }, { id: "perpendicular", type: "perpendicular", sourceLine: base, throughPoint: "M", line: bisector });
  const current = scene.result();
  return <div>
    <GeometryLessonCanvas activityId="home-bisector" scene={current} viewBox="0 0 520 280" aria-label="Live perpendicular bisector" onPointChange={(id, p) => { if (id === "A") setAx(p.x); }} onPointerMove={event => {
      if (!event.buttons) return;
      const svg = event.currentTarget, matrix = svg.getScreenCTM();
      if (!matrix) return;
      const p = svg.createSVGPoint(); p.x = event.clientX; p.y = event.clientY;
      setAx(Math.max(40, Math.min(240, p.matrixTransform(matrix.inverse()).x)));
    }}>
      <rect width="520" height="280" fill="#f8fbff" />
      <line x1={ax} y1="150" x2="380" y2="150" stroke="#147df2" strokeWidth="2" />
      <line x1={M.x} y1="20" x2={M.x} y2="260" stroke="#8b45f4" strokeWidth="2" strokeDasharray="6 4" />
      {[A, B, M].map(p => <g key={p.id}><circle cx={p.x} cy={p.y} r="7" fill={p.id === "M" ? "#10b981" : "#147df2"} /><text x={p.x + 10} y={p.y - 10} fill="#0f2747">{p.id}</text></g>)}
      <text x="20" y="30" fill="#536381">Drag A · the bisector follows the midpoint</text>
    </GeometryLessonCanvas>
    <nav className="geo-lesson-workspace-tools" aria-label="Try our workspaces">
      <Link to="/workspace/geometry" state={{ embeddedWorkspaceScene: nativeLessonScene(current) }}>2D Geometry</Link>
      <Link to="/workspace/3d" state={{ embeddedWorkspaceScene: solidWorkspaceScene() }}>3D Geometry</Link>
      <Link to="/workspace/graph?q=x%5E2%2By%5E2%3D25">2D Graph</Link>
      <Link to="/math-lab/3d-graphing" state={{ mathWorkspacePayload: createMathWorkspacePayload({ sourceWorkspace: "geometry-3d", objectType: "surface", label: "Paraboloid", value: "x^2+y^2" }) }}>3D Graph</Link>
    </nav>
  </div>;
}
