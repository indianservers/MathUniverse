import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { translationOfPointsPhaseEightConfig } from "../phase-eight/phaseEightProofConfigs";

export default function TranslationOfPointsProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={translationOfPointsPhaseEightConfig} />;
}
