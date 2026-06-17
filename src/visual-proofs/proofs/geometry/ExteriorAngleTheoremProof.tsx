import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { exteriorAnglePhaseElevenConfig } from "../phase-eleven/phaseElevenProofConfigs";

export default function ExteriorAngleTheoremProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={exteriorAnglePhaseElevenConfig} />;
}
