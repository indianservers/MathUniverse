import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { polygonInteriorAnglePhaseElevenConfig } from "../phase-eleven/phaseElevenProofConfigs";

export default function PolygonInteriorAngleSumProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={polygonInteriorAnglePhaseElevenConfig} />;
}
