import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { lineRotationalSymmetryPhaseTwentySixConfig } from "../phase-twenty-six/phaseTwentySixProofConfigs";

export default function LineRotationalSymmetryProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={lineRotationalSymmetryPhaseTwentySixConfig} />;
}
