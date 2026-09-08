import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import MatrixAreaMobileProof from "./MatrixAreaMobileProof";

export default function DeterminantAreaScaleFactorProof({ category: _category, proof: _proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <MatrixAreaMobileProof />;
}
