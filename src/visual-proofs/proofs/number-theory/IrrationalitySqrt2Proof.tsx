import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { sqrtTwoPhaseSixteenConfig } from "../phase-sixteen/phaseSixteenProofConfigs";

export default function IrrationalitySqrt2Proof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={sqrtTwoPhaseSixteenConfig} />;
}
