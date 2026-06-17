import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { pythagoreanTrigIdentityPhaseFiveConfig } from "../phase-five/phaseFiveProofConfigs";

export default function PythagoreanTrigIdentityProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={pythagoreanTrigIdentityPhaseFiveConfig} />;
}
