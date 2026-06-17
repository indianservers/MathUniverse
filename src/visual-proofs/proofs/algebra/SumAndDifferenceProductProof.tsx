import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { sumDifferenceProductPhaseTwelveConfig } from "../phase-twelve/phaseTwelveProofConfigs";

export default function SumAndDifferenceProductProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={sumDifferenceProductPhaseTwelveConfig} />;
}
