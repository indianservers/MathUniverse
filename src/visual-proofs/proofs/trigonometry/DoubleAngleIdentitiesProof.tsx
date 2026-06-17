import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { doubleAngleIdentitiesPhaseSixConfig } from "../phase-six/phaseSixProofConfigs";

export default function DoubleAngleIdentitiesProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={doubleAngleIdentitiesPhaseSixConfig} />;
}
