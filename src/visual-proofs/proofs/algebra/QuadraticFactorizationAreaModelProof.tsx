import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { quadraticFactorizationPhaseTwelveConfig } from "../phase-twelve/phaseTwelveProofConfigs";

export default function QuadraticFactorizationAreaModelProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={quadraticFactorizationPhaseTwelveConfig} />;
}
