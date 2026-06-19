import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { modulusArgumentPhaseTwentyOneConfig } from "../phase-twenty-one/phaseTwentyOneProofConfigs";

export default function ModulusAndArgumentProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={modulusArgumentPhaseTwentyOneConfig} />;
}
