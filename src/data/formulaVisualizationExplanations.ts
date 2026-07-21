import type { FormulaVisualizerEntry, FormulaVisualizerType } from "./formulaVisualizerRoutes";

export type FormulaVisualizationExplanation = {
  conceptSummary: string;
  diagramReading: string[];
  controlEffects: string[];
  reasoningSteps: string[];
  invariant: string;
  commonMistake: string;
  tryThis: string;
  successCondition: string;
  textAlternative: string;
};

type VisualGuide = {
  representation: string;
  marks: [string, string, string];
  invariant: string;
  experiment: string;
  success: string;
};

export function buildFormulaVisualizationExplanation(formula: FormulaVisualizerEntry): FormulaVisualizationExplanation {
  const guide = guideForVisualizerType(formula.visualizerType);
  const variables = formula.variables.length ? formula.variables.join(", ") : "the displayed quantities";
  return {
    conceptSummary: `${formula.title} belongs to ${formula.group}. ${formula.description} The visual translates ${formula.plainText} into ${guide.representation}.`,
    diagramReading: [
      `Start with the formula ${formula.plainText}. Locate ${variables} in the labels before reading any calculated value.`,
      guide.marks[0],
      guide.marks[1],
      guide.marks[2],
    ],
    controlEffects: controlEffectsFor(formula.visualizerType, formula.variables),
    reasoningSteps: [
      `Identify the known quantities (${variables}) and the quantity represented by ${formula.title}.`,
      `Match each known quantity to its labelled length, region, point, row, column, bar, or curve feature in the diagram.`,
      `Substitute the live control values into ${formula.plainText}; keep the operation order and any grouping symbols unchanged.`,
      `Compare the calculated value with the highlighted visual measure. They are two representations of the same mathematical result.`,
      `Change one relevant control at a time and verify that the diagram and substitution change together while the stated relationship remains true.`,
    ],
    invariant: guide.invariant,
    commonMistake: formula.commonMistake ?? defaultMistakeFor(formula.visualizerType),
    tryThis: guide.experiment,
    successCondition: guide.success,
    textAlternative: `Text-only model for ${formula.title}: ${formula.description} Use ${formula.plainText}. The relevant symbols are ${variables}. ${guide.invariant}`,
  };
}

function controlEffectsFor(type: FormulaVisualizerType, variables: string[]) {
  const variableText = variables.length ? `The formula symbols are ${variables.join(", ")}.` : "Read the formula labels to identify the active quantities.";
  const discrete = ["sequence", "combinatorics", "number-system", "discrete-math", "early-number-sense", "number-theory", "cryptography"].includes(type);
  const probability = ["probability", "distribution", "statistics", "information-theory", "machine-learning"].includes(type);
  return [
    `a controls the primary signed magnitude or first coefficient. Watch the first highlighted object, direction, or term. ${variableText}`,
    "b controls the second magnitude, coefficient, comparison value, or vertical response. Compare its change with a before combining them.",
    "c supplies a third value, offset, overlap, or interaction term where the selected formula needs one; otherwise it remains a comparison driver.",
    discrete ? "n is treated as a whole-number count, stage, degree, or sample size. Moving it changes the number of visible objects or iterations." : "n controls a count, resolution, exponent, or scale used by the current model; read its effect in the repeated marks or computed value.",
    probability ? "p is a percentage/probability driver. Read it as p/100 when the formula expects a probability between 0 and 1." : "p is a percentage, angle share, or interpolation driver. The visual converts it to the convention required by the selected formula.",
    "A control matters mathematically only when it represents a symbol or model parameter used by this formula. Unused shared controls do not alter the defining relationship.",
  ];
}

function guideForVisualizerType(type: FormulaVisualizerType): VisualGuide {
  if (type === "calculus" || type === "calculus-applications") return guide("a curve, a movable point, and local rate/accumulation marks", "The cyan curve is the original function whose behavior is being measured.", "The highlighted point locates the current input; local slope or accumulated area is read relative to it.", "Bars, tangent cues, or highlighted intervals approximate the operation before the live value states it numerically.", "The derivative remains the limiting slope of secants, or the integral remains accumulated signed area, regardless of display scale.", "Move a by one unit, then compare the curve height and the local slope/area cue.", "You can explain why the highlighted derivative or integral value has its displayed sign and relative size." );
  if (type === "limits-continuity" || type === "real-analysis") return guide("a function graph with approach points and tolerance bands", "The curve shows nearby function values, not merely the value at the target point.", "Left and right markers show independent approaches to the same input.", "The band represents an allowed output tolerance; shrinking it tests whether both sides stay close to one value.", "A limit is determined by nearby behavior; continuity additionally requires the function value to equal that limit.", "Move the approach values from opposite sides toward the target.", "Both sides approach the same height, or you can identify the jump/hole that prevents agreement." );
  if (type === "graph" || type === "coordinate" || type === "function" || type === "polynomial" || type === "precalculus" || type === "analytic-geometry") return guide("axes, a plotted curve, and highlighted coordinates or features", "Horizontal position represents the input and vertical position represents the output.", "The highlighted curve is generated from the selected formula using the same live coefficients.", "Marked points, roots, intercepts, or guide lines connect numeric substitution to graph geometry.", "Every plotted point must satisfy the displayed equation within the graphing tolerance.", "Change one coefficient and predict the direction of the graph change before moving it.", "Your prediction matches the observed shift, stretch, reflection, intercept, or curvature change." );
  if (type === "area") return guide("an area decomposition made from labelled rectangles or squares", "Each colored block represents one term of the algebraic expansion.", "Side lengths encode the factors; multiplying them gives each block's area.", "The outside boundary represents the unexpanded product while the pieces represent the expanded sum.", "Rearranging or subdividing pieces does not change total area.", "Increase a while holding b fixed and count which regions grow.", "You can match every region to exactly one term and show that their total equals the outer area." );
  if (["geometry", "mensuration", "euclidean-geometry", "three-d-geometry", "differential-geometry"].includes(type)) return guide("labelled geometric lengths, angles, regions, or solids", "Outlined boundaries identify the object whose measure is being calculated.", "Highlighted lengths and angles correspond directly to formula symbols.", "Filled regions or constructed auxiliary lines show the decomposition used by the formula.", "Rigid movement leaves lengths and angles unchanged; scaling by k changes length, area, and volume by k, k², and k³ respectively.", "Double the primary length while holding shape conditions fixed.", "You correctly predict whether the measured result doubles, quadruples, or increases eightfold." );
  if (type === "matrix" || type === "determinant" || type === "advanced-linear-algebra") return guide("a matrix grid paired with a geometric transformation or residual", "Each cell is a coefficient with a fixed row and column role.", "Row-column combinations produce outputs; order must be preserved.", "Area, orientation, rank, or residual cues show the geometric meaning of the calculation.", "The displayed transformation must agree with direct matrix arithmetic; determinant gives oriented scale for square matrices.", "Swap two rows or reverse the multiplication order and predict what changes.", "You identify the sign, dimension, or noncommutativity change and confirm it in the output." );
  if (type === "vector" || type === "multivariable-calculus") return guide("directed arrows or a vector field on declared axes", "Arrow direction shows orientation and arrow length shows magnitude.", "Components are projections onto the coordinate axes, not separate vectors with unrelated units.", "Resultant, gradient, dot, or cross-product marks show how vectors combine.", "Component arithmetic and geometric construction must give the same resultant or residual.", "Reverse one vector or scale it by a negative value.", "You correctly predict the changed direction, magnitude, and sign of the relevant product." );
  if (["probability", "statistics", "distribution", "information-theory", "machine-learning"].includes(type)) return guide("bars, regions, frequencies, or a probability curve", "Heights or areas encode frequency, density, probability, loss, or information—not decorative size.", "Location describes center or outcome; spread describes variation or uncertainty.", "Highlighted portions correspond to the event or statistic used in the live calculation.", "Counts must reconcile with the sample size and probabilities must remain in [0,1] and normalize appropriately.", "Move p toward an extreme and predict which outcomes or regions become dominant.", "Your explanation distinguishes probability mass/area from raw curve height and confirms normalization." );
  if (type === "number-system" || type === "number-theory" || type === "cryptography" || type === "early-number-sense") return guide("a number line, grouping model, factor pattern, or modular cycle", "Position or grouping represents the value before any symbolic shortcut is used.", "Repeated marks expose factors, multiples, residues, or place-value structure.", "Highlighted values show the exact objects included by the rule.", "Direct enumeration and the symbolic formula must return the same integer or residue.", "Choose a small n and verify the result by listing every represented item.", "The list has no missing or duplicate item and agrees exactly with the formula." );
  if (type === "sequence" || type === "dynamical-systems") return guide("ordered stages whose height or position changes by a recurrence", "Read stages from left to right; each mark represents one indexed term or state.", "Successive differences, ratios, or update arrows reveal the generating rule.", "The live label reports the term/state computed from the same recurrence.", "Every displayed stage must be reproducible from the preceding state and the declared rule.", "Increase n by one and predict the next term before revealing it.", "Your predicted term follows the recurrence and matches the new displayed stage." );
  if (type === "combinatorics" || type === "discrete-math") return guide("finite objects, slots, paths, or selection groups", "Each object or branch represents a distinct choice or outcome.", "Color separates selected, ordered, repeated, or excluded items.", "The final count labels the complete outcome set rather than a sampled subset.", "Small-case enumeration must equal the factorial, permutation, combination, or graph count with no duplicates.", "Reduce n to a small value and list the outcomes manually.", "Your manual list contains exactly the displayed count and respects whether order matters." );
  if (type === "set-logic" || type === "topology" || type === "abstract-algebra") return guide("regions, ordered pairs, truth rows, or an operation table", "Labels identify the underlying sets, propositions, elements, or operations.", "Highlighting shows exactly which region, pair, row, or cell satisfies the selected rule.", "Boundaries and table structure distinguish membership from overlap, implication, or closure.", "The highlighted objects must match direct membership tests, finite truth evaluation, or the declared operation law.", "Choose one element/row and verify it directly from the definition.", "Your direct check agrees with the highlighted region or table cell and you can explain excluded cases." );
  if (type === "linear-programming" || type === "inequality" || type === "optimization") return guide("boundaries, a shaded feasible set, and candidate optimum points", "Each line is an equality boundary for one constraint.", "Shading marks points satisfying the inequality direction; overlap is the feasible region.", "Corner or objective cues show where candidate maxima/minima are compared.", "Every feasible point satisfies every constraint, and the reported optimum must beat all tested vertices.", "Move one constraint and predict which vertices enter or leave the feasible region.", "You verify feasibility by substitution and identify the best remaining candidate." );
  if (type === "complex" || type === "complex-analysis") return guide("the complex plane with directed values and transformed images", "Horizontal position is the real component and vertical position is the imaginary component.", "Arrow length is modulus and its direction is argument.", "Conjugate or mapped points reveal reflection, rotation, scaling, or deformation.", "Cartesian and polar calculations must locate the same complex number; multiplication adds arguments and multiplies moduli.", "Change the sign of the imaginary component and predict the reflected point.", "The new point reflects across the real axis while keeping the same modulus." );
  if (type === "fraction-percent" || type === "commercial-math" || type === "speed-work" || type === "mental-math" || type === "pre-algebra") return guide("a proportional bar, grouped quantities, or a before-and-after comparison", "The whole establishes the reference amount or unit.", "Colored parts encode the fraction, rate, change, or contribution.", "Labels connect the visual proportion to the arithmetic operation.", "Equivalent units and equivalent ratios represent the same quantity after conversion.", "Set a simple benchmark such as 50% or a unit rate, then scale it.", "You explain the scaled answer from both the picture and the arithmetic without changing units incorrectly." );
  if (type === "differential-equations" || type === "pde" || type === "numerical-methods") return guide("a field or grid with an approximate solution curve/state", "Local marks encode derivative direction, grid value, or numerical update.", "The highlighted path/state follows those local rules from an initial or boundary condition.", "Spacing and step size reveal approximation resolution and possible instability.", "The numerical residual should shrink with a valid refinement and the solution must respect initial/boundary conditions.", "Reduce the step size and compare the new solution with the previous one.", "The solutions converge or you correctly identify instability and its cause." );
  if (type === "transforms" || type === "mathematical-physics") return guide("linked source and transformed-domain representations", "The source view shows the original signal, field, or physical quantity.", "The transformed view reorganizes the same information by frequency, mode, or coordinate frame.", "Highlighted components show how the original representation is reconstructed.", "Forward and inverse transformations should reconstruct the source within the stated numerical tolerance.", "Remove or change one component and predict the reconstruction error.", "You connect the changed component to the corresponding visible feature in the reconstructed model." );
  return guide("a live mathematical model with labelled quantities and computed output", "Labels connect visible objects to formula symbols.", "Color and position distinguish inputs, operations, and results.", "The live value is calculated from the same state used to draw the model.", "The diagram, substitution, and formula must remain mutually consistent.", "Change one relevant input and predict the result before moving the control.", "Your prediction matches both the updated diagram and live calculation." );
}

function defaultMistakeFor(type: FormulaVisualizerType) {
  if (type === "calculus" || type === "limits-continuity") return "Reading one plotted point as the whole limiting, derivative, or accumulated behavior. Use the nearby curve/interval as well as the live value.";
  if (type === "set-logic") return "Treating every highlighted Venn region or truth-table row as interchangeable. Read the selected operation and include only objects satisfying its definition.";
  if (type === "matrix" || type === "determinant") return "Ignoring row-column order or assuming matrix multiplication is commutative.";
  if (type === "probability" || type === "distribution") return "Reading density height as probability without considering area or normalization.";
  return "Changing several controls together and then attributing the result to the wrong symbol. Change one relevant quantity at a time.";
}

function guide(representation: string, first: string, second: string, third: string, invariant: string, experiment: string, success: string): VisualGuide {
  return { representation, marks: [first, second, third], invariant, experiment, success };
}
