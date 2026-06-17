import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { similarTrianglesPhaseElevenConfig } from "../phase-eleven/phaseElevenProofConfigs";

export default function SimilarTrianglesProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={similarTrianglesPhaseElevenConfig} />;
}
