import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { RatioProofExperience } from "./RatioProofModels";

export default function CrossMultiplicationEqualRectanglesProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <RatioProofExperience category={category} proof={proof} kind="cross" />;
}
