import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { riemannSumsPhaseFourteenConfig } from "../phase-fourteen/phaseFourteenProofConfigs";

export default function RiemannSumsAreaUnderCurveProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={riemannSumsPhaseFourteenConfig} />;
}
