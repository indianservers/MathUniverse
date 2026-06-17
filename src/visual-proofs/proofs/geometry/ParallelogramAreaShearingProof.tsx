import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { parallelogramAreaPhaseTwoConfig } from "../phase-two/phaseTwoProofConfigs";

export default function ParallelogramAreaShearingProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={parallelogramAreaPhaseTwoConfig} />;
}
