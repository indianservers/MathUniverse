import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { rowOperationsPhaseNineteenConfig } from "../phase-nineteen/phaseNineteenProofConfigs";

export default function RowOperationsPreserveSolutionsProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={rowOperationsPhaseNineteenConfig} />;
}
