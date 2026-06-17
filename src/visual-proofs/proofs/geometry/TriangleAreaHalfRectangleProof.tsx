import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { triangleAreaPhaseTwoConfig } from "../phase-two/phaseTwoProofConfigs";

export default function TriangleAreaHalfRectangleProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={triangleAreaPhaseTwoConfig} />;
}
