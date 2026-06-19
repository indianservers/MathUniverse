import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { evenOddPhaseSixteenConfig } from "../phase-sixteen/phaseSixteenProofConfigs";

export default function EvenOddPairingProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={evenOddPhaseSixteenConfig} />;
}
