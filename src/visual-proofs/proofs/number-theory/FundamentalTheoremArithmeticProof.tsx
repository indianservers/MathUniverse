import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { factorTreePhaseSixteenConfig } from "../phase-sixteen/phaseSixteenProofConfigs";

export default function FundamentalTheoremArithmeticProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={factorTreePhaseSixteenConfig} />;
}
