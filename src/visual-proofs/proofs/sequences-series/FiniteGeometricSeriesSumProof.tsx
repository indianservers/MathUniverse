import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { finiteGeometricSeriesPhaseThirteenConfig } from "../phase-thirteen/phaseThirteenProofConfigs";

export default function FiniteGeometricSeriesSumProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={finiteGeometricSeriesPhaseThirteenConfig} />;
}
