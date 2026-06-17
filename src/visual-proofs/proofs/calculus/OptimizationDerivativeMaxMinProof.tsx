import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { optimizationPhaseFifteenConfig } from "../phase-fifteen/phaseFifteenProofConfigs";

export default function OptimizationDerivativeMaxMinProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={optimizationPhaseFifteenConfig} />;
}
