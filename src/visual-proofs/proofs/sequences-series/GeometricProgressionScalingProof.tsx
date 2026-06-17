import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { geometricProgressionPhaseThirteenConfig } from "../phase-thirteen/phaseThirteenProofConfigs";

export default function GeometricProgressionScalingProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={geometricProgressionPhaseThirteenConfig} />;
}
