import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { triangleAngleSumPhaseFourConfig } from "../phase-four/phaseFourProofConfigs";

export default function TriangleAngleSumProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={triangleAngleSumPhaseFourConfig} />;
}
