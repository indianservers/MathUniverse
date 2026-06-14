import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import AlgebraProofTemplate from "./AlgebraProofTemplate";
import { algebraProofConfigs } from "./algebraProofConfigs";

export default function DifferenceOfSquaresProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <AlgebraProofTemplate category={category} proof={proof} config={algebraProofConfigs.DifferenceOfSquaresProof} />;
}
