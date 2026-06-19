import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { simpleHarmonicMotionPhaseTwentySevenConfig } from "../phase-twenty-seven/phaseTwentySevenProofConfigs";

export default function SimpleHarmonicMotionProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={simpleHarmonicMotionPhaseTwentySevenConfig} />;
}
