import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { euclidPhaseSixteenConfig } from "../phase-sixteen/phaseSixteenProofConfigs";

export default function EuclidInfinitelyManyPrimesProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={euclidPhaseSixteenConfig} />;
}
