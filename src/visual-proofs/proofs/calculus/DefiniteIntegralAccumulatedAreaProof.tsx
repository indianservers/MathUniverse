import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { definiteIntegralPhaseFourteenConfig } from "../phase-fourteen/phaseFourteenProofConfigs";

export default function DefiniteIntegralAccumulatedAreaProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={definiteIntegralPhaseFourteenConfig} />;
}
