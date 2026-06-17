import { PhaseTwoProofExperience } from "../../components/PhaseTwoProofExperience";
import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import { pascalTrianglePhaseThirteenConfig } from "../phase-thirteen/phaseThirteenProofConfigs";

export default function PascalTriangleBinomialCoefficientsProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <PhaseTwoProofExperience category={category} proof={proof} config={pascalTrianglePhaseThirteenConfig} />;
}
