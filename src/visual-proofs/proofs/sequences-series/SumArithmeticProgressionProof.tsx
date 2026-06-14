import type { VisualProof, VisualProofCategory } from "../../data/proofTypes";
import SequenceSeriesProofTemplate from "./SequenceSeriesProofTemplate";
import { sequenceSeriesProofConfigs } from "./sequenceSeriesProofConfigs";

export default function SumArithmeticProgressionProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  return <SequenceSeriesProofTemplate category={category} proof={proof} config={sequenceSeriesProofConfigs.SumArithmeticProgressionProof} />;
}
