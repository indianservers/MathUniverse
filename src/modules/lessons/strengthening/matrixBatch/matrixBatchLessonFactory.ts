import type { StrengthenedLesson } from "../strengthenedLessonSchema";

export type MatrixBatchChallenge = {
  prompt: string;
  expected: string;
  hint: string;
  kind: "numeric" | "keywords" | "interaction";
  factoryId: string;
};

type Seed = {
  id: number;
  title: string;
  slug: string;
  definition: string;
  keyRule: string;
  formulaLabel: string;
  formulaExpression: string;
  variables: [string, string][];
  examples: [string, string][];
  misconception: [string, string, string];
  challenge: MatrixBatchChallenge;
};

const data: Record<number, Seed> = {
  347: item(347, "Matrix Builder", "matrix-builder", "A matrix is a rectangular array of numbers.", "Rows go across and columns go down.", "Matrix entry", "a_ij", [["i", "row"], ["j", "column"]], ["ROW_COLUMN", "Mixing up rows and columns.", "Read row first, then column."], "In a_23, which number names the row?", "2"),
  348: item(348, "Matrix Addition and Subtraction", "matrix-addition-and-subtraction", "Matrix addition and subtraction combine matching entries.", "Matrices must have the same dimensions.", "Entry operation", "C_ij=A_ij+B_ij", [["A_ij", "entry in A"], ["B_ij", "matching entry in B"]], ["SIZE_IGNORE", "Adding matrices with different sizes.", "Only same-size matrices can be added."], "If entries are 3 and 5, what is their sum?", "8"),
  349: item(349, "Scalar Multiplication", "scalar-multiplication", "Scalar multiplication multiplies every matrix entry by one number.", "Multiply each entry by the scalar.", "Scalar product", "(kA)_ij=kA_ij", [["k", "scalar"], ["A_ij", "entry"]], ["ONE_ENTRY", "Multiplying only one entry.", "Every entry is multiplied."], "If k=3 and an entry is 4, what is the new entry?", "12"),
  350: item(350, "Matrix Multiplication", "matrix-multiplication", "Matrix multiplication uses row-by-column dot products.", "Columns of the first matrix must match rows of the second.", "Product entry", "C_ij=sum A_ik B_kj", [["i,j", "output entry position"], ["k", "shared index"]], ["ENTRYWISE", "Multiplying only matching positions.", "Use row-by-column dot products."], "For row [1,2] and column [3,4], find the dot product.", "11"),
  351: item(351, "Identity Matrix", "identity-matrix", "The identity matrix leaves vectors or matrices unchanged.", "It has 1s on the main diagonal and 0s elsewhere.", "Identity rule", "AI=IA=A", [["I", "identity matrix"], ["A", "matrix"]], ["ALL_ONES", "Making every entry 1.", "Only diagonal entries are 1."], "What is A times I?", "A"),
  352: item(352, "Transpose", "transpose", "The transpose swaps rows and columns.", "Entry a_ij moves to position a_ji.", "Transpose entry", "(A^T)_ij=A_ji", [["i,j", "entry positions"], ["A^T", "transpose"]], ["REVERSE_VALUES", "Reversing the order of entries in a row only.", "Swap rows with columns."], "In a transpose, row 1 becomes what?", "column 1"),
  353: item(353, "Determinant", "determinant", "A determinant measures signed area scale for a square matrix.", "For a 2 by 2 matrix, det [[a,b],[c,d]]=ad-bc.", "2 by 2 determinant", "det A=ad-bc", [["a,b,c,d", "matrix entries"], ["det A", "determinant"]], ["PLUS_BC", "Using ad+bc.", "Use ad-bc."], "Find det [[2,1],[3,4]].", "5"),
  354: item(354, "Matrix Inverse", "matrix-inverse", "A matrix inverse undoes a matrix transformation.", "An inverse exists only when the determinant is non-zero.", "Inverse check", "AA^{-1}=I", [["A", "matrix"], ["I", "identity"]], ["ZERO_DET", "Trying to invert a matrix with determinant 0.", "Check det A is non-zero first."], "If det A=0, does A have an inverse? yes or no.", "no"),
  355: item(355, "Row Operations", "row-operations", "Row operations transform a system without changing its solution set.", "Swap rows, scale a row by a non-zero number, or add a multiple of one row to another.", "Row replacement", "R_i <- R_i+kR_j", [["R_i", "target row"], ["k", "multiple"]], ["SCALE_ZERO", "Multiplying a row by zero.", "Scaling row operations need a non-zero factor."], "Can you multiply a row by 0 as a reversible row operation? yes or no.", "no"),
  356: item(356, "RREF", "rref", "RREF is a simplified row form with leading 1s and zeros above and below pivots.", "Each pivot column has one leading 1 and zeros elsewhere.", "RREF pivot", "pivot=1", [["pivot", "leading entry"], ["column", "pivot column"]], ["HALF_REDUCED", "Stopping when zeros are only below pivots.", "RREF also needs zeros above pivots."], "In RREF, what value is each pivot?", "1"),
  357: item(357, "Augmented Matrices", "augmented-matrices", "An augmented matrix stores coefficients and constants from a linear system.", "The final column represents the right-hand side.", "Augmented form", "[A|b]", [["A", "coefficient matrix"], ["b", "constants"]], ["MIX_CONSTANTS", "Treating the constant column like another variable column.", "The augmented column stores right-hand-side values."], "In [A|b], what does b represent?", "constants"),
  358: item(358, "Linear Transformations", "linear-transformations", "A linear transformation preserves vector addition and scalar multiplication.", "A matrix sends input vectors to output vectors linearly.", "Linearity", "T(au+bv)=aT(u)+bT(v)", [["T", "transformation"], ["u,v", "vectors"]], ["CURVED_RULE", "Calling any graph movement linear.", "Linear transformations preserve combinations and the origin."], "Does a linear transformation send 0 to 0? yes or no.", "yes"),
  360: item(360, "Basis and Dimension", "basis-and-dimension", "A basis is a set of independent vectors that spans a space.", "Dimension is the number of vectors in a basis.", "Basis size", "dim V=number of basis vectors", [["V", "vector space"], ["dim V", "dimension"]], ["SPAN_ONLY", "Thinking spanning alone makes a basis.", "A basis must span and be independent."], "A basis for a plane has how many vectors?", "2"),
  361: item(361, "Linear Independence", "linear-independence", "Vectors are linearly independent when none is made from the others.", "The only zero combination is the trivial one.", "Independence test", "c_1v_1+...+c_nv_n=0 implies all c_i=0", [["c_i", "coefficients"], ["v_i", "vectors"]], ["NONZERO_COMBO", "Ignoring a non-zero combination that gives zero.", "That proves dependence."], "If one vector is twice another, are they independent? yes or no.", "no"),
  362: item(362, "Vector Spaces", "vector-spaces", "A vector space is a set closed under vector addition and scalar multiplication.", "Adding vectors or scaling them must stay inside the set.", "Closure", "u,v in V implies u+v in V and kv in V", [["V", "space"], ["k", "scalar"]], ["NO_CLOSURE", "Checking only one operation.", "Check both addition and scalar multiplication."], "Must a vector space contain the zero vector? yes or no.", "yes"),
  363: item(363, "Gram-Schmidt", "gramschmidt", "Gram-Schmidt turns independent vectors into orthogonal vectors.", "Subtract projections onto earlier vectors.", "Projection removal", "u_k=v_k-proj_{u_1}(v_k)-...", [["v_k", "original vector"], ["u_k", "orthogonal vector"]], ["NO_NORMALISE", "Confusing orthogonal with unit length.", "Normalize after making vectors orthogonal if an orthonormal set is needed."], "Does orthogonal mean perpendicular? yes or no.", "yes"),
  364: item(364, "Least Squares", "least-squares", "Least squares finds the best approximate solution when exact fit is impossible.", "Minimise the sum of squared residuals.", "Normal equation", "A^T A x=A^T b", [["A", "data matrix"], ["b", "observed vector"]], ["EXACT_ALWAYS", "Expecting every data system to fit exactly.", "Least squares gives the closest fit by squared error."], "Least squares minimises squared what?", "residuals"),
};

export function seed(id: number) {
  return data[id];
}

export type MatrixBatchSeed = Seed;

export function matrixBatchLesson(item: Seed): StrengthenedLesson {
  const code = item.misconception[0];
  return {
    id: item.id,
    title: item.title,
    route: `/lessons/advanced-mathematics/${item.id}-${item.slug}`,
    category: "Advanced Mathematics",
    topic: "Matrices and Linear Algebra",
    lessonType: "visual_exploration",
    learningObjectives: [`Define ${item.title}.`, `Use the rule: ${item.keyRule}`, `Correct a common ${item.title} mistake.`],
    prerequisites: ["Vectors", "Linear equations", "Arithmetic with arrays"],
    keyVocabulary: [{ term: item.title, meaning: item.definition }, { term: "Entry", meaning: "One number in a matrix." }],
    introduction: `${item.title} is part of matrix and linear algebra. It matters in graphics, data fitting, engineering, coding, and systems of equations.`,
    basicIdea: `${item.definition} The key rule is: ${item.keyRule} A common mistake is ${item.misconception[1]}`,
    howItWorks: "Read the matrix entries carefully. Apply the row, column, transformation, or space rule. Check the computed result against the visual model.",
    whyItWorks: "Matrices organise many linked numbers so one rule can transform vectors, systems, or data in a consistent way.",
    definitions: [{ id: `${item.id}-definition`, statement: item.definition }],
    facts: [{ id: `${item.id}-fact`, statement: item.keyRule }],
    formulas: [{ id: `${item.id}-formula`, label: item.formulaLabel, expression: item.formulaExpression, variables: item.variables.map(([symbol, meaning]) => ({ symbol, meaning })), exactness: "definition" }],
    conditionsAndRestrictions: ["Check matrix dimensions before operating.", "For inverses and bases, check the required independence or determinant condition."],
    representations: [{ id: `${item.id}-matrix`, type: "matrix_grid", learningPurpose: `Show the entries and computation for ${item.title}.` }],
    workedExamples: [{ id: `${item.id}-worked-1`, prompt: item.challenge.prompt, steps: ["Identify the matrix rule.", "Apply it to the displayed entries.", "Check dimensions and conditions."], answer: item.challenge.expected }],
    realLifeExamples: item.examples.map(([context, connection], index) => ({ id: `${item.id}-real-${index + 1}`, context, connection })),
    misconceptions: [{ code, mistake: item.misconception[1], correction: item.misconception[2] }],
    interaction: { id: `${item.id}-interaction`, learningPurpose: `Use editable matrix entries to connect ${item.title} with the computed result.`, parameters: [{ id: "a", label: "Entry a", validRange: [-9, 9] }, { id: "b", label: "Entry b", validRange: [-9, 9] }, { id: "k", label: "Scalar or parameter", validRange: [-10, 10] }], initialState: `Start with ${item.formulaLabel}.`, dynamicFeedback: "Entries, vectors, computation steps, and challenge values update together.", successCriteria: ["Read matrix entries", "Apply the formula", "Explain the misconception"], accessibilityAlternative: "Provide entries, computed result, and steps as text." },
    guidedExploration: [{ id: "predict", prompt: "Predict the result before editing an entry." }, { id: "observe", prompt: "Change one value and read the update." }, { id: "explain", prompt: `Explain using ${item.formulaLabel}.` }],
    practice: [practice(`${item.id}-recognition`, `Name the key rule for ${item.title}.`, item.keyRule, code, "recognition"), practice(`${item.id}-direct`, item.challenge.prompt, item.challenge.expected, code, "direct"), practice(`${item.id}-multi`, `State the correction for ${item.title}.`, item.misconception[2], code, "multi_step"), practice(`${item.id}-error`, `What is wrong with this mistake: ${item.misconception[1]}`, item.misconception[2], code, "error_diagnosis"), practice(`${item.id}-transfer`, `Give one real use of ${item.title}.`, item.examples[0][0], code, "transfer")],
    challenge: { id: `${item.id}-challenge`, prompt: item.challenge.prompt, successCriteria: ["Uses the rule", "Checks conditions", "Gives the correct result"], hints: [item.challenge.hint, `Use ${item.formulaLabel}.`] },
    exitCheck: [{ id: `${item.id}-exit`, prompt: `State one exact check for ${item.title}.`, answer: item.misconception[2], criterion: "Names the accepted matrix rule." }],
    accessibilityNotes: ["Announce entries and computed output.", "Do not rely only on vector colour."],
    expertReviewRequired: false,
  };
}

function item(id: number, title: string, slug: string, definition: string, keyRule: string, formulaLabel: string, formulaExpression: string, variables: [string, string][], misconception: [string, string, string], prompt: string, expected: string): Seed {
  return { id, title, slug, definition, keyRule, formulaLabel, formulaExpression, variables, misconception, examples: [["Computer graphics", "Matrices transform points and images."], ["Data fitting", "Linear algebra solves or approximates systems."], ["Engineering models", "Matrices organise linked equations."]], challenge: { prompt, expected, hint: `Use ${formulaLabel}.`, kind: Number.isFinite(Number(expected)) ? "numeric" : "keywords", factoryId: `matrix.${slug}` } };
}

export function matrixBatchChallenge(item: Seed) {
  return item.challenge;
}

function practice(id: string, prompt: string, answer: string, misconceptionTag: string, difficulty: StrengthenedLesson["practice"][number]["difficulty"]): StrengthenedLesson["practice"][number] {
  return { id, prompt, answer, hints: ["Check dimensions.", "Use the displayed formula.", "Read rows and columns carefully."], workedSolution: ["Identify the matrix object.", "Apply the rule.", "Check the condition."], misconceptionTag, difficulty, parameterConstraints: ["Use finite matrix entries."] };
}
