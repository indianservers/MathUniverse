import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { infiniteGeometricSeriesPhaseThirteenConfig } from "../phase-thirteen/phaseThirteenProofConfigs";

export default function InfiniteGeometricSeriesConvergenceProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={infiniteGeometricSeriesPhaseThirteenConfig} />;
}
