import {
  Atom,
  BarChart3,
  BrainCircuit,
  ChartSpline,
  CircleHelp,
  Cone,
  Cuboid,
  FunctionSquare,
  GitFork,
  Grid3X3,
  Hash,
  ListOrdered,
  Shapes,
  Sigma,
  Sparkles,
  Workflow,
  Waves,
} from "lucide-react";

export const visualProofIconMap = {
  Atom,
  BarChart3,
  BrainCircuit,
  ChartSpline,
  CircleHelp,
  Cone,
  Cuboid,
  FunctionSquare,
  GitFork,
  Grid3X3,
  Hash,
  ListOrdered,
  Shapes,
  Sigma,
  Sparkles,
  Workflow,
  Waves,
};

export type VisualProofIconName = keyof typeof visualProofIconMap;

export function getVisualProofIcon(iconName: string) {
  return visualProofIconMap[iconName as VisualProofIconName] ?? Sigma;
}
