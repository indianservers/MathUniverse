import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import SimilarTriangleRatiosMobileProof from "./SimilarTriangleRatiosMobileProof";

export default function SimilarTrianglesProof({ category: _category, proof: _proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <SimilarTriangleRatiosMobileProof />;
}
