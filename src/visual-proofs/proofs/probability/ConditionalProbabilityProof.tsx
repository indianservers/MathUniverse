import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { conditionalPhaseSeventeenConfig } from "../phase-seventeen/phaseSeventeenProofConfigs";

export default function ConditionalProbabilityProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={conditionalPhaseSeventeenConfig} />;
}
