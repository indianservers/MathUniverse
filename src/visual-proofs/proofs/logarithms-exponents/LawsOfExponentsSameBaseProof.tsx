import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { lawsOfExponentsSameBasePhaseTwentyFiveConfig } from "../phase-twenty-five/phaseTwentyFiveProofConfigs";

export default function LawsOfExponentsSameBaseProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={lawsOfExponentsSameBasePhaseTwentyFiveConfig} />;
}
