import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { expectedValuePhaseSeventeenConfig } from "../phase-seventeen/phaseSeventeenProofConfigs";

export default function ExpectedValueLongRunAverageProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={expectedValuePhaseSeventeenConfig} />;
}
