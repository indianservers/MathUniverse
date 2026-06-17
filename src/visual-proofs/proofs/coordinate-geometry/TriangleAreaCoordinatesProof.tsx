import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { triangleAreaCoordinatesPhaseNineConfig } from "../phase-nine/phaseNineProofConfigs";

export default function TriangleAreaCoordinatesProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={triangleAreaCoordinatesPhaseNineConfig} />;
}
