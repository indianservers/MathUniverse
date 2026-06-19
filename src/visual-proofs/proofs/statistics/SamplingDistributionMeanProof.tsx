import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { samplingDistributionPhaseEighteenConfig } from "../phase-eighteen/phaseEighteenProofConfigs";

export default function SamplingDistributionMeanProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={samplingDistributionPhaseEighteenConfig} />;
}
