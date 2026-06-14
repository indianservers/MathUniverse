import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import CoordinateProofTemplate from "./CoordinateProofTemplate";
import { coordinateProofConfigs } from "./coordinateProofConfigs";

export default function SlopeFormulaProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <CoordinateProofTemplate category={category} proof={proof} config={coordinateProofConfigs.SlopeFormulaProof} />;
}
