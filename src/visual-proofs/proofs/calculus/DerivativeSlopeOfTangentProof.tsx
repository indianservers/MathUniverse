import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { derivativeSlopePhaseFourteenConfig } from "../phase-fourteen/phaseFourteenProofConfigs";

export default function DerivativeSlopeOfTangentProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={derivativeSlopePhaseFourteenConfig} />;
}
