import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import GeometryProofTemplate from "./GeometryProofTemplate";
import { geometryProofConfigs } from "./geometryProofConfigs";

export default function CircleCircumferenceUnwrappingProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <GeometryProofTemplate category={category} proof={proof} config={geometryProofConfigs.CircleCircumferenceUnwrappingProof} />;
}
