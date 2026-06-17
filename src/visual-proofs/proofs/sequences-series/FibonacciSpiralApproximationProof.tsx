import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { fibonacciSpiralPhaseThirteenConfig } from "../phase-thirteen/phaseThirteenProofConfigs";

export default function FibonacciSpiralApproximationProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={fibonacciSpiralPhaseThirteenConfig} />;
}
