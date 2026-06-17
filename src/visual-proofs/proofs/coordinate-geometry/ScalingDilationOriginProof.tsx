import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { scalingDilationOriginPhaseNineConfig } from "../phase-nine/phaseNineProofConfigs";

export default function ScalingDilationOriginProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={scalingDilationOriginPhaseNineConfig} />;
}
