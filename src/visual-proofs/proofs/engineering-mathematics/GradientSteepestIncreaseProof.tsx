import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { gradientSteepestIncreasePhaseTwentySevenConfig } from "../phase-twenty-seven/phaseTwentySevenProofConfigs";

export default function GradientSteepestIncreaseProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={gradientSteepestIncreasePhaseTwentySevenConfig} />;
}
