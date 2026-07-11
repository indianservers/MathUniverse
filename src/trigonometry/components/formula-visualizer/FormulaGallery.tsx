import FormulaCard from "./FormulaCard";
import {
  type TrigFormulaId,
  type TrigFormulaValues,
  formulaGroupsWithDefinitions,
} from "../../utils/trigFormulaUtils";

type FormulaGalleryProps = {
  values: TrigFormulaValues;
  selectedFormulaId: TrigFormulaId;
  onSelect: (formulaId: TrigFormulaId) => void;
};

export default function FormulaGallery({ values, selectedFormulaId, onSelect }: FormulaGalleryProps) {
  return (
    <section className="max-h-[560px] space-y-4 overflow-y-auto pr-1" data-testid="formula-gallery" aria-label="Trigonometry formula gallery">
      {formulaGroupsWithDefinitions.map((group) => (
        <div
          key={group.id}
          className="rounded-xl border border-slate-200 bg-white/85 p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/50"
          data-testid={`formula-group-${group.id}`}
        >
          <div className="mb-3">
            <h2 className="text-base font-black text-slate-950 dark:text-white">{group.title}</h2>
            <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-300">{group.description}</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {group.formulas.map((formula) => (
              <FormulaCard
                key={formula.id}
                formula={formula}
                values={values}
                active={formula.id === selectedFormulaId}
                onSelect={() => onSelect(formula.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
