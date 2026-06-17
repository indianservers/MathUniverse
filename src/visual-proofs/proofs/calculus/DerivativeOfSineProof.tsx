import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { derivativeOfSinePhaseFifteenConfig } from "../phase-fifteen/phaseFifteenProofConfigs";

export default function DerivativeOfSineProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={derivativeOfSinePhaseFifteenConfig} />;
}
