import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { inductionDominoPhaseThirteenConfig } from "../phase-thirteen/phaseThirteenProofConfigs";

export default function VisualInductionDominoGrowthProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={inductionDominoPhaseThirteenConfig} />;
}
