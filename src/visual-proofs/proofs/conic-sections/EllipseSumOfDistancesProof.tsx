import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { ellipseSumPhaseTwentyThreeConfig } from "../phase-twenty-three/phaseTwentyThreeProofConfigs";

export default function EllipseSumOfDistancesProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={ellipseSumPhaseTwentyThreeConfig} />;
}
