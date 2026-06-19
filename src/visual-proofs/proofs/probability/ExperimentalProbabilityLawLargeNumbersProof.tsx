import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { experimentalPhaseSeventeenConfig } from "../phase-seventeen/phaseSeventeenProofConfigs";

export default function ExperimentalProbabilityLawLargeNumbersProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={experimentalPhaseSeventeenConfig} />;
}
