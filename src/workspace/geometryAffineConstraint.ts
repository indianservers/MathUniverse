import type { GeoConstraint, GeoPoint } from "../components/workspace/panels/GeometryWorkspacePanel";

export function affineConstraintPoint(constraint: Extract<GeoConstraint, { type: "affine" }>, points: GeoPoint[]) {
  const source = points.find(p => p.id === constraint.source);
  if (!source) return null;
  const [a, b, c, d, tx, ty] = constraint.matrix;
  const offset = points.find(p => p.id === constraint.offsetPoint);
  const dx = offset && constraint.offsetOrigin ? offset.x - constraint.offsetOrigin.x : 0;
  const dy = offset && constraint.offsetOrigin ? offset.y - constraint.offsetOrigin.y : 0;
  return { x: a * (source.x + dx) + c * (source.y + dy) + tx, y: b * (source.x + dx) + d * (source.y + dy) + ty };
}
