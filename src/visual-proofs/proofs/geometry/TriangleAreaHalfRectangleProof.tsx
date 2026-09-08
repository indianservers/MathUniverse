import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import TriangleAreaDissectionMobileProof from "./TriangleAreaDissectionMobileProof";

export default function TriangleAreaHalfRectangleProof({ category: _category, proof: _proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <TriangleAreaDissectionMobileProof />;
}
