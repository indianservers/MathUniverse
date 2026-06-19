import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { gcdPhaseSixteenConfig } from "../phase-sixteen/phaseSixteenProofConfigs";

export default function GcdEuclideanAlgorithmProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={gcdPhaseSixteenConfig} />;
}
