import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { matrixAdditionPhaseNineteenConfig } from "../phase-nineteen/phaseNineteenProofConfigs";

export default function MatrixAdditionCellByCellProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={matrixAdditionPhaseNineteenConfig} />;
}
