import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { directrixFocusEquationsPhaseTwentyThreeConfig } from "../phase-twenty-three/phaseTwentyThreeProofConfigs";

export default function DirectrixFocusStandardEquationsProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={directrixFocusEquationsPhaseTwentyThreeConfig} />;
}
