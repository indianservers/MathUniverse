import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { modularClockPhaseSixteenConfig } from "../phase-sixteen/phaseSixteenProofConfigs";

export default function ModularArithmeticClockProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={modularClockPhaseSixteenConfig} />;
}
