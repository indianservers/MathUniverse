import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { sineAngleAdditionPhaseSixConfig } from "../phase-six/phaseSixProofConfigs";

export default function SineAngleAdditionProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={sineAngleAdditionPhaseSixConfig} />;
}
