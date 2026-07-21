import GraphTheoryModule from "../modules/graph-theory/GraphTheoryModule";
import PhaseTwoDomainPanel from "../components/ui/PhaseTwoDomainPanel";

export default function GraphTheory() {
  return <div className="space-y-4"><GraphTheoryModule /><PhaseTwoDomainPanel domain="graph-discrete" /></div>;
}
