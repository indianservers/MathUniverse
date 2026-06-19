import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { solvingLinearInequalitiesPhaseTwentyFourConfig } from "../phase-twenty-four/phaseTwentyFourProofConfigs";

export default function SolvingLinearInequalitiesProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={solvingLinearInequalitiesPhaseTwentyFourConfig} />;
}
