import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { coneSlicingPhaseTwentyThreeConfig } from "../phase-twenty-three/phaseTwentyThreeProofConfigs";

export default function ConeSlicingConicsProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={coneSlicingPhaseTwentyThreeConfig} />;
}
