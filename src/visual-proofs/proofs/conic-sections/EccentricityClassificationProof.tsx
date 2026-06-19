import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { eccentricityClassificationPhaseTwentyThreeConfig } from "../phase-twenty-three/phaseTwentyThreeProofConfigs";

export default function EccentricityClassificationProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={eccentricityClassificationPhaseTwentyThreeConfig} />;
}
