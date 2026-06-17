import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { unitCircleSineCosinePhaseFiveConfig } from "../phase-five/phaseFiveProofConfigs";

export default function UnitCircleSineCosineProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={unitCircleSineCosinePhaseFiveConfig} />;
}
