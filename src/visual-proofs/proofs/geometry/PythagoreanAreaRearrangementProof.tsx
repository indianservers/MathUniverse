import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { pythagoreanPhaseFourConfig } from "../phase-four/phaseFourProofConfigs";

export default function PythagoreanAreaRearrangementProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={pythagoreanPhaseFourConfig} />;
}
