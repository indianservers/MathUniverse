import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { taylorSeriesPhaseFifteenConfig } from "../phase-fifteen/phaseFifteenProofConfigs";

export default function TaylorSeriesApproximationProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={taylorSeriesPhaseFifteenConfig} />;
}
