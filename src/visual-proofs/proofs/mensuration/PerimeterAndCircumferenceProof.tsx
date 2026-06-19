import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { perimeterCircumferencePhaseTwentyTwoConfig } from "../phase-twenty-two/phaseTwentyTwoProofConfigs";

export default function PerimeterAndCircumferenceProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={perimeterCircumferencePhaseTwentyTwoConfig} />;
}
