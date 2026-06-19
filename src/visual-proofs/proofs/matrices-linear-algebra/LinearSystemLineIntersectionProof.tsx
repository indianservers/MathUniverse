import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { linearSystemPhaseNineteenConfig } from "../phase-nineteen/phaseNineteenProofConfigs";

export default function LinearSystemLineIntersectionProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={linearSystemPhaseNineteenConfig} />;
}
