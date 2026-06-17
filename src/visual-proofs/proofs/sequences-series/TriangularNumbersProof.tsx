import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { triangularNumbersPhaseThirteenConfig } from "../phase-thirteen/phaseThirteenProofConfigs";

export default function TriangularNumbersProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={triangularNumbersPhaseThirteenConfig} />;
}
