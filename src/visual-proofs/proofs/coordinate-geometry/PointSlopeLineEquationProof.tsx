import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { pointSlopeLinePhaseNineConfig } from "../phase-nine/phaseNineProofConfigs";

export default function PointSlopeLineEquationProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={pointSlopeLinePhaseNineConfig} />;
}
