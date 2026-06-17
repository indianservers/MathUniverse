import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { cubeOfSumPhaseTwelveConfig } from "../phase-twelve/phaseTwelveProofConfigs";

export default function CubeOfSumProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={cubeOfSumPhaseTwelveConfig} />;
}
