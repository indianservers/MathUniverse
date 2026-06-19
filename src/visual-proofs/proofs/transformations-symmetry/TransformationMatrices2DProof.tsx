import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { transformationMatrices2dPhaseTwentySixConfig } from "../phase-twenty-six/phaseTwentySixProofConfigs";

export default function TransformationMatrices2DProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={transformationMatrices2dPhaseTwentySixConfig} />;
}
