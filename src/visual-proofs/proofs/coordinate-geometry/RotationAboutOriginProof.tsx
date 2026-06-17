import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { rotationAboutOriginPhaseNineConfig } from "../phase-nine/phaseNineProofConfigs";

export default function RotationAboutOriginProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={rotationAboutOriginPhaseNineConfig} />;
}
