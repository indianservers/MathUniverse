import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { multiplicationByIPhaseTwentyOneConfig } from "../phase-twenty-one/phaseTwentyOneProofConfigs";

export default function MultiplicationByIRotationProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={multiplicationByIPhaseTwentyOneConfig} />;
}
