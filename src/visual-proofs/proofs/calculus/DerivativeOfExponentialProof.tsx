import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { derivativeOfExponentialPhaseFifteenConfig } from "../phase-fifteen/phaseFifteenProofConfigs";

export default function DerivativeOfExponentialProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={derivativeOfExponentialPhaseFifteenConfig} />;
}
