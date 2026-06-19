import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { matrixMultiplicationPhaseNineteenConfig } from "../phase-nineteen/phaseNineteenProofConfigs";

export default function MatrixMultiplicationRowColumnProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={matrixMultiplicationPhaseNineteenConfig} />;
}
