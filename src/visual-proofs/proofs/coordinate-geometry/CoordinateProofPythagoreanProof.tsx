import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { coordinatePythagoreanPhaseNineConfig } from "../phase-nine/phaseNineProofConfigs";

export default function CoordinateProofPythagoreanProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={coordinatePythagoreanPhaseNineConfig} />;
}
