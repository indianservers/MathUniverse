import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { remainderCyclePhaseSixteenConfig } from "../phase-sixteen/phaseSixteenProofConfigs";

export default function RemainderPatternCyclesProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={remainderCyclePhaseSixteenConfig} />;
}
