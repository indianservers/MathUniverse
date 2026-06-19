import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { complexPlanePointPhaseTwentyOneConfig } from "../phase-twenty-one/phaseTwentyOneProofConfigs";

export default function ComplexNumberPlanePointProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={complexPlanePointPhaseTwentyOneConfig} />;
}
