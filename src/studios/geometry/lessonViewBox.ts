import type { LessonScene } from "./geometryLessonScene";

export function lessonViewBox(scene: LessonScene): string {
  const construction = scene.construction;
  const ids = new Set(construction.polygons.flatMap(p => p.points));
  const points = construction.points.filter(p => p.style?.visible !== false && (ids.has(p.id) || (!!p.label && p.style?.labelMode !== "hidden")));
  const bounds = points.map(p => ({ x: p.x, y: p.y }));
  for (const circle of construction.circles) {
    if (circle.style?.visible === false) continue;
    const center = construction.points.find(p => p.id === circle.center), edge = construction.points.find(p => p.id === circle.edge);
    if (!center || !edge) continue;
    const radius = Math.hypot(edge.x-center.x, edge.y-center.y);
    bounds.push({x:center.x-radius,y:center.y-radius},{x:center.x+radius,y:center.y+radius});
  }
  if (!bounds.length) return `${scene.camera.x} ${scene.camera.y} ${scene.camera.width} ${scene.camera.height}`;
  const minX = Math.min(...bounds.map(p => p.x)), maxX = Math.max(...bounds.map(p => p.x));
  const minY = Math.min(...bounds.map(p => p.y)), maxY = Math.max(...bounds.map(p => p.y));
  const aspect = scene.camera.width / scene.camera.height;
  const width = Math.max(maxX-minX+80, (maxY-minY+80)*aspect, 120);
  const height = width/aspect;
  return `${(minX+maxX-width)/2} ${(minY+maxY-height)/2} ${width} ${height}`;
}
