import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { perfectSquareRecognitionPhaseTwelveConfig } from "../phase-twelve/phaseTwelveProofConfigs";

export default function PerfectSquareTrinomialRecognitionProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={perfectSquareRecognitionPhaseTwelveConfig} />;
}
