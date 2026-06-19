import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { histogramFrequencyPhaseEighteenConfig } from "../phase-eighteen/phaseEighteenProofConfigs";

export default function HistogramFrequencyDistributionProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={histogramFrequencyPhaseEighteenConfig} />;
}
