import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { meanValueTheoremPhaseFifteenConfig } from "../phase-fifteen/phaseFifteenProofConfigs";

export default function MeanValueTheoremProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={meanValueTheoremPhaseFifteenConfig} />;
}
