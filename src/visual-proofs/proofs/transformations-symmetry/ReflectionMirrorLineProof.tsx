import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { reflectionMirrorLinePhaseTwentySixConfig } from "../phase-twenty-six/phaseTwentySixProofConfigs";

export default function ReflectionMirrorLineProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={reflectionMirrorLinePhaseTwentySixConfig} />;
}
