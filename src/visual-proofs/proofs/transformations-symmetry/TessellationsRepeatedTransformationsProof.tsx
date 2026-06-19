import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { tessellationsRepeatedTransformationsPhaseTwentySixConfig } from "../phase-twenty-six/phaseTwentySixProofConfigs";

export default function TessellationsRepeatedTransformationsProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={tessellationsRepeatedTransformationsPhaseTwentySixConfig} />;
}
