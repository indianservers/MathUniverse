import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { complementPhaseSeventeenConfig } from "../phase-seventeen/phaseSeventeenProofConfigs";

export default function ComplementRuleProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={complementPhaseSeventeenConfig} />;
}
