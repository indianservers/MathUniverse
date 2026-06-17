import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { circleCircumferencePhaseFourConfig } from "../phase-four/phaseFourProofConfigs";

export default function CircleCircumferenceUnwrappingProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={circleCircumferencePhaseFourConfig} />;
}
