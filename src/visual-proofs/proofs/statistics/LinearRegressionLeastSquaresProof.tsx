import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { regressionLeastSquaresPhaseEighteenConfig } from "../phase-eighteen/phaseEighteenProofConfigs";

export default function LinearRegressionLeastSquaresProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={regressionLeastSquaresPhaseEighteenConfig} />;
}
