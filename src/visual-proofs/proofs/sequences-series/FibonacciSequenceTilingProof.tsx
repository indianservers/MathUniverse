import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { fibonacciTilingPhaseThirteenConfig } from "../phase-thirteen/phaseThirteenProofConfigs";

export default function FibonacciSequenceTilingProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={fibonacciTilingPhaseThirteenConfig} />;
}
