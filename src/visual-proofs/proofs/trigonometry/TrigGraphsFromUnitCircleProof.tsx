import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { trigGraphsFromUnitCirclePhaseFiveConfig } from "../phase-five/phaseFiveProofConfigs";

export default function TrigGraphsFromUnitCircleProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={trigGraphsFromUnitCirclePhaseFiveConfig} />;
}
