import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { cubeOfDifferencePhaseTwelveConfig } from "../phase-twelve/phaseTwelveProofConfigs";

export default function CubeOfDifferenceProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={cubeOfDifferencePhaseTwelveConfig} />;
}
