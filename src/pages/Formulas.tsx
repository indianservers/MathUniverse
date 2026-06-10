import katex from "katex";
import { BookOpen, ListFilter, Search, Sigma } from "lucide-react";
import { useMemo, useState } from "react";
import SectionCard from "../components/ui/SectionCard";
import { formulaCategories, formulaCategoryCount, type FormulaLibraryItem } from "../data/formulaLibrary";

export default function Formulas() {
  const [activeCategoryId, setActiveCategoryId] = useState(formulaCategories[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const activeCategory = formulaCategories.find((category) => category.id === activeCategoryId) ?? formulaCategories[0];
  const totalFormulaCount = useMemo(() => formulaCategories.reduce((sum, category) => sum + category.formulas.reduce((count, item) => count + formulaLineCount(item), 0), 0), []);
  const visibleFormulas = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return activeCategory.formulas;
    return activeCategory.formulas.filter((item) => {
      const haystack = `${item.title} ${item.formula} ${item.note}`.toLowerCase();
      return haystack.includes(value);
    });
  }, [activeCategory.formulas, query]);
  const geometryGroups = useMemo(() => groupGeometryFormulas(visibleFormulas), [visibleFormulas]);

  return (
    <div className="desktop-page-shell">
      <div className="desktop-page-header">
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/85 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-300">
              <Sigma className="h-4 w-4" />
              Special Formula Page
            </p>
            <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">Formulas</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              Select a category to revise all formulas for that concept. This page is intentionally text-first, with clean math rendering and no visualization panels.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <FormulaStat label="Categories" value={formulaCategoryCount} />
            <FormulaStat label="Formulas" value={totalFormulaCount} />
            <FormulaStat label="Mode" value="Text" />
          </div>
        </div>
      </div>

      <div className="desktop-tab-surface grid gap-4 xl:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="min-w-0 space-y-4">
          <SectionCard title="Categories" description="Choose one concept area." compact>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search selected category..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm font-semibold outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:focus:ring-cyan-400/10"
              />
            </div>
            <div className="mt-3 grid max-h-[calc(100vh-22rem)] gap-2 overflow-auto pr-1 thin-scrollbar">
              {formulaCategories.map((category) => {
                const active = category.id === activeCategory.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      setActiveCategoryId(category.id);
                      setQuery("");
                    }}
                    className={`flex min-w-0 items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
                      active
                        ? "border-cyan-300 bg-cyan-50 text-cyan-950 shadow-sm dark:border-cyan-400/40 dark:bg-cyan-400/10 dark:text-cyan-50"
                        : "border-slate-200 bg-white/70 text-slate-700 hover:border-cyan-200 hover:bg-cyan-50/70 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-cyan-400/10"
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-black">{category.title}</span>
                      <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{category.formulas.reduce((count, item) => count + formulaLineCount(item), 0)} formulas</span>
                    </span>
                    <BookOpen className="h-4 w-4 shrink-0" />
                  </button>
                );
              })}
            </div>
          </SectionCard>
        </aside>

        <main className="min-w-0">
          <SectionCard title={activeCategory.title} description={activeCategory.description}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-black text-slate-600 dark:border-white/10 dark:bg-slate-950 dark:text-slate-300">
                <ListFilter className="h-4 w-4 text-cyan-500" />
                Showing {visibleFormulas.reduce((count, item) => count + formulaLineCount(item), 0)} of {activeCategory.formulas.reduce((count, item) => count + formulaLineCount(item), 0)}
              </span>
            </div>
            {visibleFormulas.length ? (
              activeCategory.id === "geometry" ? (
                <div className="space-y-5">
                  {geometryGroups.map((group) => (
                    <section key={group.title} className="min-w-0">
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                        <div>
                          <h2 className="text-base font-black text-slate-950 dark:text-white">{group.title}</h2>
                          <p className="mt-0.5 text-xs font-semibold text-slate-500 dark:text-slate-400">{group.description}</p>
                        </div>
                        <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-black text-cyan-800 dark:bg-cyan-400/15 dark:text-cyan-100">
                          {group.items.reduce((count, item) => count + formulaLineCount(item), 0)} formulas
                        </span>
                      </div>
                      <div className="grid gap-3 lg:grid-cols-2">
                        {group.items.map((item) => (
                          <FormulaLibraryCard key={`${activeCategory.id}-${group.title}-${item.title}`} item={item} />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              ) : (
                <div className="grid gap-3 lg:grid-cols-2">
                  {visibleFormulas.map((item) => (
                    <FormulaLibraryCard key={`${activeCategory.id}-${item.title}`} item={item} />
                  ))}
                </div>
              )
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm font-semibold text-slate-500 dark:border-white/15 dark:bg-white/5 dark:text-slate-300">
                No formulas matched this search in {activeCategory.title}.
              </div>
            )}
          </SectionCard>
        </main>
      </div>
    </div>
  );
}

const geometryShapeGroups = [
  { id: "lines-angles", title: "Lines and Angles", description: "Segments, rays, angle sums, slopes, and basic angle facts.", keywords: ["line", "ray", "angle", "slope", "segment length"] },
  { id: "triangles", title: "Triangles", description: "Right, scalene, isosceles, equilateral, Heron, altitude, radius, and triangle rules.", keywords: ["triangle", "pythagorean", "heron", "hypotenuse", "altitude", "median", "bisector", "inradius", "circumradius"] },
  { id: "quadrilaterals", title: "Quadrilaterals", description: "Rectangle, square, parallelogram, rhombus, trapezium, kite, and cyclic quadrilateral formulas.", keywords: ["rectangle", "square", "parallelogram", "rhombus", "trapezium", "trapezoid", "kite", "quadrilateral", "cyclic"] },
  { id: "circles-arcs", title: "Circles, Arcs, and Sectors", description: "Circle area, circumference, diameter, radius, chord, arc, semicircle, sector, segment, annulus, and quadrant formulas.", keywords: ["circle", "diameter", "radius", "circumference", "chord", "arc", "sector", "semicircle", "segment area", "annulus", "quadrant"] },
  { id: "polygons", title: "Polygons", description: "Regular polygons, pentagons, hexagons, octagons, diagonals, apothem, and angle formulas.", keywords: ["polygon", "pentagon", "hexagon", "octagon", "diagonal", "apothem", "exterior angle", "interior angle"] },
  { id: "conics", title: "Conics", description: "Ellipse, parabola, hyperbola, eccentricity, focal distance, and latus rectum formulas.", keywords: ["ellipse", "parabola", "hyperbola", "eccentricity", "focal", "latus"] },
  { id: "solids", title: "3D Solids", description: "Cube, cuboid, cylinder, cone, sphere, hemisphere, prism, pyramid, frustum, and other solid measures.", keywords: ["cube", "cuboid", "cylinder", "cone", "sphere", "hemisphere", "prism", "pyramid", "frustum", "torus", "solid", "volume", "surface"] },
] as const;

function groupGeometryFormulas(items: FormulaLibraryItem[]) {
  const grouped = geometryShapeGroups.map((group) => ({ ...group, items: [] as FormulaLibraryItem[] }));
  const other = { id: "general", title: "General Geometry", description: "General plane geometry formulas and shape facts that do not belong to one shape family.", keywords: [] as string[], items: [] as FormulaLibraryItem[] };

  items.forEach((item) => {
    const haystack = `${item.title} ${item.note}`.toLowerCase();
    const group = grouped.find((candidate) => candidate.keywords.some((keyword) => haystack.includes(keyword)));
    (group ?? other).items.push(item);
  });

  return [...grouped, other].filter((group) => group.items.length > 0);
}

function FormulaStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="min-w-[96px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center dark:border-white/10 dark:bg-white/5">
      <p className="text-lg font-black text-slate-950 dark:text-white">{value}</p>
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}

function FormulaLibraryCard({ item }: { item: FormulaLibraryItem }) {
  const formulaLines = useMemo(() => splitFormulaLines(item.formula), [item.formula]);

  return (
    <article className="min-w-0 rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/55">
      <h2 className="text-sm font-black text-slate-950 dark:text-white">{item.title}</h2>
      <div className="formula-card mt-3 space-y-2 rounded-xl border border-cyan-200/70 bg-cyan-50 p-2 dark:border-cyan-400/20 dark:bg-cyan-400/10">
        {formulaLines.map((formula, index) => <FormulaLine key={`${item.title}-${index}-${formula}`} formula={formula} />)}
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.note}</p>
    </article>
  );
}

function FormulaLine({ formula }: { formula: string }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(formula, { throwOnError: false, displayMode: false });
    } catch {
      return null;
    }
  }, [formula]);

  return (
    <div className="min-w-0 overflow-x-auto rounded-lg bg-white/70 px-3 py-2 text-center dark:bg-slate-950/65">
      {html ? (
        <div className="formula-katex whitespace-nowrap text-base md:text-lg" dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <p className="formula-plain whitespace-nowrap font-mono text-sm font-bold">{formula}</p>
      )}
    </div>
  );
}

function formulaLineCount(item: FormulaLibraryItem) {
  return splitFormulaLines(item.formula).length;
}

function splitFormulaLines(formula: string) {
  return formula
    .split(/,\s*\\quad\s*|\\quad\s*|;\s*/)
    .map((part) => part.trim().replace(/,$/, ""))
    .filter(Boolean);
}
