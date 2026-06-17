import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { complementaryAngleIdentitiesPhaseSixConfig } from "../phase-six/phaseSixProofConfigs";

export default function ComplementaryAngleIdentitiesProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={complementaryAngleIdentitiesPhaseSixConfig} />;
}
