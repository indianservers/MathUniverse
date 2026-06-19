import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { favorableTotalPhaseSeventeenConfig } from "../phase-seventeen/phaseSeventeenProofConfigs";

export default function ProbabilityFavorableOverTotalProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={favorableTotalPhaseSeventeenConfig} />;
}
