import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { translationSlidingVectorPhaseTwentySixConfig } from "../phase-twenty-six/phaseTwentySixProofConfigs";

export default function TranslationSlidingVectorProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={translationSlidingVectorPhaseTwentySixConfig} />;
}
