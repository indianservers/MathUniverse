import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { cosineAngleAdditionPhaseSixConfig } from "../phase-six/phaseSixProofConfigs";

export default function CosineAngleAdditionProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={cosineAngleAdditionPhaseSixConfig} />;
}
