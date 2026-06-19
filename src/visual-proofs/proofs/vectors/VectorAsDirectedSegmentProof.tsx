import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { vectorDirectedSegmentPhaseTwentyConfig } from "../phase-twenty/phaseTwentyProofConfigs";

export default function VectorAsDirectedSegmentProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={vectorDirectedSegmentPhaseTwentyConfig} />;
}
