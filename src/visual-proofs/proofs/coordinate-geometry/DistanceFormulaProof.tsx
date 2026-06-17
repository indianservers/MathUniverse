import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { distanceFormulaPhaseEightConfig } from "../phase-eight/phaseEightProofConfigs";

export default function DistanceFormulaProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={distanceFormulaPhaseEightConfig} />;
}
