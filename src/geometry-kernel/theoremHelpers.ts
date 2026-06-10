import { classifyTriangle, distance2d, type KernelPoint } from "./geometryMeasurements";

export type TheoremInsight = {
  title: string;
  result: string;
  detail: string;
  confidence: "exact" | "numeric";
};

export function triangleInsights(points: KernelPoint[], unitScale = 40): TheoremInsight[] {
  if (points.length !== 3) return [];
  const [a, b, c] = points as [KernelPoint, KernelPoint, KernelPoint];
  const classification = classifyTriangle([a, b, c], unitScale);
  return [
    {
      title: "Triangle classification",
      result: `${classification.sideType}, ${classification.angleType}`,
      detail: `Sides: ${classification.sides.map((side) => side.toFixed(2)).join(", ")}. Perimeter ${classification.perimeter.toFixed(2)}, area ${classification.area.toFixed(2)} square units.`,
      confidence: "numeric",
    },
    {
      title: "Triangle area theorem",
      result: `Area = ${classification.area.toFixed(2)}`,
      detail: "Computed using the shoelace formula from live vertex coordinates.",
      confidence: "numeric",
    },
  ];
}

export function circleInsights(center: KernelPoint | null, edge: KernelPoint | null, unitScale = 40): TheoremInsight[] {
  if (!center || !edge) return [];
  const radius = distance2d(center, edge) / unitScale;
  return [
    {
      title: "Circle measurement",
      result: `r = ${radius.toFixed(2)}`,
      detail: `Area ${(Math.PI * radius * radius).toFixed(2)}, circumference ${(2 * Math.PI * radius).toFixed(2)}.`,
      confidence: "numeric",
    },
  ];
}

