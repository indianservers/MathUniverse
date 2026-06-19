import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { divergenceCurlVectorFieldPhaseTwentySevenConfig } from "../phase-twenty-seven/phaseTwentySevenProofConfigs";

export default function DivergenceCurlVectorFieldProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={divergenceCurlVectorFieldPhaseTwentySevenConfig} />;
}
