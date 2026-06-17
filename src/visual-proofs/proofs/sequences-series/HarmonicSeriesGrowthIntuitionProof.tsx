import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { harmonicGrowthPhaseThirteenConfig } from "../phase-thirteen/phaseThirteenProofConfigs";

export default function HarmonicSeriesGrowthIntuitionProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={harmonicGrowthPhaseThirteenConfig} />;
}
