import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { distributiveLawPhaseTwelveConfig } from "../phase-twelve/phaseTwelveProofConfigs";

export default function DistributiveLawAreaModelProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={distributiveLawPhaseTwelveConfig} />;
}
