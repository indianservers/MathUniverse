import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { medianQuartilesPhaseEighteenConfig } from "../phase-eighteen/phaseEighteenProofConfigs";

export default function MedianAndQuartilesProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={medianQuartilesPhaseEighteenConfig} />;
}
