import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { cauchySchwarzPhaseTwentyFourConfig } from "../phase-twenty-four/phaseTwentyFourProofConfigs";

export default function CauchySchwarzDotProductBoundProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={cauchySchwarzPhaseTwentyFourConfig} />;
}
