import MathematicalLogicModule from "../modules/mathematical-logic/MathematicalLogicModule";
import PhaseTwoDomainPanel from "../components/ui/PhaseTwoDomainPanel";

export default function TruthTableGenerator() {
  return <div className="space-y-4"><MathematicalLogicModule /><PhaseTwoDomainPanel domain="mathematical-logic" /></div>;
}
