import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import { reflectionAcrossAxesPhaseNineConfig } from "../phase-nine/phaseNineProofConfigs";

export default function ReflectionAcrossAxesProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={reflectionAcrossAxesPhaseNineConfig} />;
}
