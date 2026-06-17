import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { chainRulePhaseFourteenConfig } from "../phase-fourteen/phaseFourteenProofConfigs";

export default function ChainRuleVisualProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={chainRulePhaseFourteenConfig} />;
}
