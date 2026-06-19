import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { fourierWaveBuildingPhaseTwentySevenConfig } from "../phase-twenty-seven/phaseTwentySevenProofConfigs";

export default function FourierSeriesWaveBuildingProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={fourierWaveBuildingPhaseTwentySevenConfig} />;
}
