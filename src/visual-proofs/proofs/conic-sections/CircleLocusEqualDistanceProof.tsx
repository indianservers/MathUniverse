import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { circleLocusPhaseTwentyThreeConfig } from "../phase-twenty-three/phaseTwentyThreeProofConfigs";

export default function CircleLocusEqualDistanceProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={circleLocusPhaseTwentyThreeConfig} />;
}
