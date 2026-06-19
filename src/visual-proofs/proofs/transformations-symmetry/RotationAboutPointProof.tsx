import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { rotationAboutPointPhaseTwentySixConfig } from "../phase-twenty-six/phaseTwentySixProofConfigs";

export default function RotationAboutPointProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={rotationAboutPointPhaseTwentySixConfig} />;
}
