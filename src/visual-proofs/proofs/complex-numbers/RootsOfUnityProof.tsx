import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { rootsOfUnityPhaseTwentyOneConfig } from "../phase-twenty-one/phaseTwentyOneProofConfigs";

export default function RootsOfUnityProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={rootsOfUnityPhaseTwentyOneConfig} />;
}
