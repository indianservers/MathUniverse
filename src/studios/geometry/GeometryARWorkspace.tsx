import { useState, type ReactNode } from "react";
import GeometryLessonCanvas from "./GeometryLessonCanvas";
import GeometryEmbeddedSolid, { solidWorkspaceScene } from "./GeometryEmbeddedSolid";
import { lessonScene } from "./geometryLessonScene";

export default function GeometryARWorkspace({ mode, scale, children }: { mode: string; scale: number; children?: ReactNode }) {
  const [vertex, setVertex] = useState({ x: 220, y: 110 });
  if (mode.toLowerCase() === "3d solid" || mode.toLowerCase() === "plane") return <GeometryEmbeddedSolid activityId={`ar:${mode}`} scene={solidWorkspaceScene("cube", 3 * scale)}>{children}</GeometryEmbeddedSolid>;
  const scene = lessonScene(560, 360, p => p, 70);
  const A = { id: "A", x: 120, y: 260 }, B = { id: "B", x: 120 + 2.18 * scale * 70, y: 260 }, C = { id: "C", ...vertex };
  if (mode.toLowerCase() === "circle") scene.circle(A, 2.18 * scale * 70);
  else scene.polygon([A, B, C]);
  return <GeometryLessonCanvas activityId={`ar-${mode}`} presentation={children} scene={scene.result()} viewBox="0 0 560 360" aria-label={`${mode} geometry overlay`} onPointChange={(id, p) => { if (id === "C") setVertex(p); }} onPointerMove={event => {
    if (!event.buttons) return;
    const matrix = event.currentTarget.getScreenCTM(); if (!matrix) return;
    const p = event.currentTarget.createSVGPoint(); p.x = event.clientX; p.y = event.clientY;
    const next = p.matrixTransform(matrix.inverse()); setVertex({ x: next.x, y: next.y });
  }}>
    <rect width="560" height="360" fill="#f8fbff" />
    {mode.toLowerCase() === "circle" ? <circle cx={A.x} cy={A.y} r={2.18 * scale * 70} fill="rgba(8,185,221,.07)" stroke="#08b9dd" /> : <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill="rgba(20,125,242,.12)" stroke="#147df2" />}
    {[A, B, C].map(p => <g key={p.id}><circle cx={p.x} cy={p.y} r="7" fill="#147df2" /><text x={p.x + 10} y={p.y - 10} fill="#0f2747">{p.id}</text></g>)}
  </GeometryLessonCanvas>;
}
