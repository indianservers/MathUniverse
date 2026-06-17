import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { oddNumberSumPhaseTwoConfig } from "../phase-two/phaseTwoProofConfigs";

export default function SumFirstNOddNumbersProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={oddNumberSumPhaseTwoConfig} />;
}
