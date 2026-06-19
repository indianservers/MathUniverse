import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { matrixInversePhaseNineteenConfig } from "../phase-nineteen/phaseNineteenProofConfigs";

export default function MatrixInverseUndoTransformationProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={matrixInversePhaseNineteenConfig} />;
}
