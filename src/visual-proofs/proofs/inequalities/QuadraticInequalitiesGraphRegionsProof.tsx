import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { quadraticInequalitiesPhaseTwentyFourConfig } from "../phase-twenty-four/phaseTwentyFourProofConfigs";

export default function QuadraticInequalitiesGraphRegionsProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={quadraticInequalitiesPhaseTwentyFourConfig} />;
}
