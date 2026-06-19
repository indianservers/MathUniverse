import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { vectorEquationLinePhaseTwentyConfig } from "../phase-twenty/phaseTwentyProofConfigs";

export default function VectorEquationLineProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={vectorEquationLinePhaseTwentyConfig} />;
}
