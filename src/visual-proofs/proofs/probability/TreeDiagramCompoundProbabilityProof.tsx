import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { treePhaseSeventeenConfig } from "../phase-seventeen/phaseSeventeenProofConfigs";

export default function TreeDiagramCompoundProbabilityProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={treePhaseSeventeenConfig} />;
}
