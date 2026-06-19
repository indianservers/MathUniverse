import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { multiplicationPhaseSeventeenConfig } from "../phase-seventeen/phaseSeventeenProofConfigs";

export default function MultiplicationRuleIndependentEventsProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={multiplicationPhaseSeventeenConfig} />;
}
