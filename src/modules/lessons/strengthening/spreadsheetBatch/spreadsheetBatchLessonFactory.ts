import type { StrengthenedLesson } from "../strengthenedLessonSchema";

export type SpreadsheetBatchChallenge = {
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
  action: string;
  reason: string;
  representation: "spreadsheet_grid" | "table" | "distribution_plot" | "function_graph";
  misconception: [string, string, string];
  examples: [string, string][];
  challenge: SpreadsheetBatchChallenge;
};

const data: Record<number, Seed> = {
  450: item(450, "Data Entry Grid", "data-entry-grid", "A data entry grid stores values in labelled rows and columns.", "Enter one value per cell and keep headings clear.", "Clean grids make formulas, charts, and analysis trustworthy.", "spreadsheet_grid", ["NO_HEADINGS", "Entering values without labels.", "Use headings so each column has meaning."], [["Survey", "Names and scores go in separate columns."], ["Experiment", "Time and distance are recorded in rows."], ["Class marks", "Each student gets one row."]], "What should a data grid include at the top?", "headings"),
  451: item(451, "Cell Formulas", "cell-formulas", "Cell formulas calculate values from other cells.", "Start with equals, refer to cells, and check the computed result.", "Formulas update automatically when source cells change.", "spreadsheet_grid", ["NO_EQUALS", "Typing a formula without the equals sign.", "Begin formulas with = so the cell calculates."], [["Difference", "=B2-A2 calculates change."], ["Total", "=SUM(A2:A5) adds values."], ["Mean", "=AVERAGE(B2:B6) finds average."]], "Spreadsheet formulas usually start with what symbol?", "="),
  452: item(452, "Fill and Copy", "fill-and-copy", "Fill and copy repeats values or formulas across cells.", "Copy the formula and check how references changed.", "It saves time and keeps repeated calculations consistent.", "spreadsheet_grid", ["UNCHECKED_COPY", "Copying formulas without checking references.", "Inspect copied formulas before trusting results."], [["Fill down", "Copy a change formula through a column."], ["Series", "Fill 1, 2, 3, 4."], ["Repeated label", "Copy a category name."]], "After copying a formula, what should be checked?", "references"),
  453: item(453, "Relative References", "relative-references", "Relative references change when a formula is copied.", "Use plain cell names such as A2 when movement should adjust.", "Relative references let one formula work across many rows.", "spreadsheet_grid", ["EXPECTED_FIXED", "Expecting A2 to stay fixed after copying.", "Use relative references only when adjustment is wanted."], [["Row formula", "=B2-A2 becomes =B3-A3."], ["Running change", "Each row compares nearby cells."], ["Table calculations", "Copy one pattern down."]], "Relative references change when copied: yes or no?", "yes"),
  454: item(454, "Absolute References", "absolute-references", "Absolute references stay fixed when a formula is copied.", "Use dollar signs, such as $A$1, for fixed cells.", "They protect constants like tax rate or conversion factor.", "spreadsheet_grid", ["MISSING_DOLLAR", "Copying a formula that should keep one fixed cell.", "Use $ signs for fixed row and column references."], [["Tax rate", "Use $B$1 for one rate."], ["Unit conversion", "Keep conversion factor fixed."], ["Percentage", "Divide by one fixed total."]], "What symbol marks an absolute reference?", "$"),
  455: item(455, "Sorting", "sorting", "Sorting arranges rows by a chosen column.", "Select the full table and choose ascending or descending order.", "Sorting helps compare values without separating related row data.", "table", ["ONE_COLUMN_ONLY", "Sorting one column and leaving the rest behind.", "Sort the whole row range together."], [["Marks", "Sort students by score."], ["Dates", "Order events by time."], ["Names", "Sort alphabetically."]], "When sorting data, select the whole what?", "table"),
  456: item(456, "Filtering", "filtering", "Filtering shows only rows that match a condition.", "Choose the condition and keep hidden rows unchanged.", "Filters help focus on a subset without deleting data.", "table", ["DELETE_ROWS", "Deleting rows instead of filtering them.", "Filtering hides unmatched rows; it does not erase them."], [["Scores", "Show scores above 80."], ["Category", "Show one class only."], ["Dates", "Show this month."]], "Filtering hides rows but does not what them?", "delete"),
  457: item(457, "Lists from Cells", "lists-from-cells", "Lists from cells turn a cell range into an ordered data list.", "Select the range and preserve order and data type.", "Lists feed charts, statistics, and dynamic activities.", "spreadsheet_grid", ["MIXED_TYPES", "Mixing labels and numbers in one numeric list.", "Keep list values consistent with the intended data type."], [["Numbers", "A2:A10 becomes a data list."], ["Names", "A roster becomes a text list."], ["Measurements", "Column values feed statistics."]], "A list from cells should preserve data what?", "type"),
  458: item(458, "Points from Columns", "points-from-columns", "Points from columns create coordinate points from paired x and y columns.", "Choose matching columns and pair values row by row.", "Column points link tables to graphs.", "function_graph", ["MISMATCHED_ROWS", "Pairing x and y values from different rows.", "Use matching rows for each point."], [["Scatter plot", "Column A is x and B is y."], ["Experiment", "Time and distance form points."], ["Function table", "x and f(x) form graph points."]], "Points from columns pair values by matching what?", "rows"),
  459: item(459, "Matrices from Cells", "matrices-from-cells", "Matrices from cells convert a rectangular range into a matrix.", "Select a rectangular range and keep row and column order.", "Matrices use spreadsheet data for linear algebra.", "spreadsheet_grid", ["NOT_RECTANGLE", "Selecting an uneven range for a matrix.", "A matrix range must be rectangular."], [["Coefficient matrix", "A table stores system coefficients."], ["Transformation", "Cells store a 2 by 2 matrix."], ["Data matrix", "Rows store observations."]], "A matrix cell range must be what shape?", "rectangular"),
  460: item(460, "Frequency Tables", "frequency-tables", "A frequency table counts how often each value or category appears.", "List values or classes and count each occurrence.", "Frequency tables summarise raw data without losing counts.", "table", ["MISCOUNT", "Counting a value in the wrong category.", "Use clear categories and tally each data item once."], [["Survey", "Count favourite colours."], ["Marks", "Count each score."], ["Weather", "Count rainy days."]], "A frequency table counts how often values what?", "appear"),
  461: item(461, "Summary Statistics", "summary-statistics", "Summary statistics describe a data set with key numbers.", "Compute measures such as mean, median, mode, range, or standard deviation.", "Summary values make large data sets easier to compare.", "distribution_plot", ["ONE_NUMBER_ONLY", "Describing all data with only one statistic.", "Use centre and spread together when needed."], [["Class marks", "Mean and range summarise performance."], ["Sports", "Average and spread compare players."], ["Weather", "Median temperature describes typical value."]], "Summary statistics often describe centre and what?", "spread"),
};

export function spreadsheetSeed(id: number) {
  return data[id];
}

export type SpreadsheetBatchSeed = Seed;

export function spreadsheetBatchLesson(seed: Seed): StrengthenedLesson {
  const code = seed.misconception[0];
  return {
    id: seed.id,
    title: seed.title,
    route: `/lessons/data-and-probability/${seed.id}-${seed.slug}`,
    category: "Data and Probability",
    topic: "Spreadsheet",
    lessonType: "tool",
    learningObjectives: [`Define ${seed.title}.`, seed.action, `Avoid this spreadsheet mistake: ${seed.misconception[1]}`],
    prerequisites: ["Rows and columns", "Basic data values", "Reading tables"],
    keyVocabulary: [{ term: seed.title, meaning: seed.definition }, { term: "Cell", meaning: "One box in a spreadsheet grid." }],
    introduction: `${seed.title} is a spreadsheet skill. It helps organise data, calculate values, and connect tables to charts or statistics.`,
    basicIdea: `${seed.definition} The basic idea is to keep data structured so formulas and charts read the right cells. ${seed.reason} A common mistake is ${seed.misconception[1]}`,
    howItWorks: `${seed.action} Then check the output, formula, chart, or linked data object.`,
    whyItWorks: "Spreadsheets work by cell position and data type, so clear structure keeps calculations correct.",
    definitions: [{ id: `${seed.slug}-definition`, statement: seed.definition }],
    facts: [{ id: `${seed.slug}-fact`, statement: seed.reason }],
    formulas: [],
    conditionsAndRestrictions: ["Keep headings clear.", "Use one data type per analysis column when possible.", "Check copied formulas and linked ranges."],
    representations: [{ id: `${seed.slug}-representation`, type: seed.representation, learningPurpose: `Show the spreadsheet structure for ${seed.title}.` }],
    workedExamples: [{ id: `${seed.slug}-worked-1`, prompt: seed.challenge.prompt, steps: ["Identify the spreadsheet task.", seed.action, "Check the linked result."], answer: seed.challenge.expected }],
    realLifeExamples: seed.examples.map(([context, connection], index) => ({ id: `${seed.slug}-real-${index + 1}`, context, connection })),
    misconceptions: [{ code, mistake: seed.misconception[1], correction: seed.misconception[2] }],
    interaction: { id: `${seed.slug}-interaction`, learningPurpose: `Edit a linked spreadsheet grid for ${seed.title}.`, parameters: [{ id: "cell", label: "Cell", validValues: ["A2", "B2", "C2"] }, { id: "formula", label: "Formula", validValues: ["=B2-A2", "=SUM(B2:B5)", "=AVERAGE(B2:B5)"] }], initialState: `Start with a small data grid for ${seed.title}.`, dynamicFeedback: "Edited cells, formulas, chart bars, and linked objects update together.", successCriteria: ["Edit a valid cell", "Read the linked output", "Explain the common mistake"], accessibilityAlternative: "Provide the grid, formulas, computed values, and chart values as text." },
    guidedExploration: [{ id: "predict", prompt: "Predict which output changes when one cell changes." }, { id: "test", prompt: "Edit a cell and read the computed value." }, { id: "explain", prompt: "Explain why the spreadsheet rule matters." }],
    practice: [practice(`${seed.slug}-recognition`, `What is ${seed.title}?`, seed.definition, code, "recognition"), practice(`${seed.slug}-direct`, seed.challenge.prompt, seed.challenge.expected, code, "direct"), practice(`${seed.slug}-multi`, `How do you set up ${seed.title}?`, seed.action, code, "multi_step"), practice(`${seed.slug}-error`, `What is wrong with this spreadsheet mistake: ${seed.misconception[1]}`, seed.misconception[2], code, "error_diagnosis"), practice(`${seed.slug}-transfer`, `Give one use of ${seed.title}.`, seed.examples[0][0], code, "transfer")],
    challenge: { id: `${seed.slug}-challenge`, prompt: seed.challenge.prompt, successCriteria: ["Uses the spreadsheet rule", "Checks range or formula", "Avoids the common mistake"], hints: [seed.challenge.hint, seed.misconception[2]] },
    exitCheck: [{ id: `${seed.slug}-exit`, prompt: `State one spreadsheet rule for ${seed.title}.`, answer: seed.misconception[2], criterion: "Answer names a clear data or formula check." }],
    accessibilityNotes: ["Read cells with row and column labels.", "Do not rely only on chart colour for values."],
    expertReviewRequired: false,
  };
}

export function spreadsheetBatchChallenge(seed: Seed) {
  return seed.challenge;
}

function item(id: number, title: string, slug: string, definition: string, action: string, reason: string, representation: Seed["representation"], misconception: Seed["misconception"], examples: Seed["examples"], prompt: string, expected: string): Seed {
  return { id, title, slug, definition, action, reason, representation, misconception, examples, challenge: { prompt, expected, hint: `Use the ${title} spreadsheet rule.`, kind: Number.isFinite(Number(expected)) ? "numeric" : "keywords", factoryId: `spreadsheet.${slug}` } };
}

function practice(id: string, prompt: string, answer: string, misconceptionTag: string, difficulty: StrengthenedLesson["practice"][number]["difficulty"]): StrengthenedLesson["practice"][number] {
  return { id, prompt, answer, hints: ["Check the range.", "Read headings.", "Verify the output."], workedSolution: ["Identify the spreadsheet task.", "Apply the spreadsheet rule.", "Check the linked result."], misconceptionTag, difficulty, parameterConstraints: ["Use valid cells, clear labels, and consistent data types."] };
}
