import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { matrixTransformationPhaseNineteenConfig } from "../phase-nineteen/phaseNineteenProofConfigs";

export default function MatrixLinearTransformationGridProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={matrixTransformationPhaseNineteenConfig} />;
}
