import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

// Evidence search, not a syllabus-completeness or teaching-quality certification.
const root = process.cwd();
function jsonArray(path) {
  const source = readFileSync(path, 'utf8');
  const start = source.indexOf('= [');
  if (start < 0) throw new Error(`Expected generated JSON array: ${path}`);
  return JSON.parse(source.slice(start + 2).replace(/\]\s*(?:as const\s*)?satisfies[\s\S]*$/, ']'));
}
const core = [1, 2, 3, 4].flatMap(p => jsonArray(`src/modules/lessons/catalog/phase${p}.generated.ts`));
const school = jsonArray('src/modules/lessons/catalog/school/schoolSyllabusLessons.generated.ts');
const advancedSource = readFileSync('src/modules/lessons/catalog/advanced/advancedConceptLessons.ts', 'utf8');
const advanced = [...advancedSource.matchAll(/^    title: "([^"]+)",/gm)].map((match, i) => ({ title: match[1], numericId: 2001 + i }));
const lessons = [...core, ...school, ...advanced].map(x => ({ id: x.numericId ?? x.id, title: x.title, route: x.route ?? null, text: [x.title, x.purpose, x.description, x.outcome, ...(x.objectives ?? []), ...(x.metadata?.learningObjectives ?? [])].filter(Boolean).join(' ') }));
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]);
}
const supporting = walk('src').filter(p => /\.(ts|tsx)$/.test(p) && !/\.test\.|\.generated\.|[\\/]lessons[\\/]|[\\/]theorems[\\/]|[\\/]math-robo[\\/]/.test(p)).map(path => ({ path: relative(root, join(root, path)).replaceAll('\\', '/'), text: readFileSync(path, 'utf8') }));
const rows = [];
function add(stage, source, priority, concept, pattern) { rows.push({ stage, source, priority, concept, pattern }); }
const schoolTopics = [
  ['Rational numbers and number properties', 'rational number'],
  ['Linear equations in one variable', 'linear equation|one.variable'],
  ['Quadrilaterals and polygon angles', 'quadrilateral|polygon|parallelogram'],
  ['Squares, cubes and roots', 'square root|cube root|nth roots|radical'],
  ['Comparing quantities, percentages and interest', 'percentage|percent|interest|discount|profit'],
  ['Algebraic identities and factorisation', 'identit|factorisation|factorization'],
  ['Mensuration and composite solids', 'mensuration|surface area|volume|combined solids'],
  ['Direct and inverse proportion', 'direct.*proportion|inverse.*proportion|variation'],
  ['Exponents and powers', 'exponent|laws of.*power|indices'],
  ['Data handling and graphs', 'data handling|bar graph|histogram|mean median'],
  ['Number systems and decimal expansions', 'number system|decimal expansion|irrational'],
  ['Polynomials, remainder and factor theorem', 'polynomial|remainder theorem|factor theorem'],
  ['Euclidean proofs and congruence', 'euclid|congruence|postulate'],
  ['Similarity and basic proportionality theorem', 'similar|proportionality theorem'],
  ['Coordinate geometry', 'distance formula|section formula|coordinate area'],
  ['Quadratics and arithmetic progressions', 'quadratic|arithmetic sequence|arithmetic series|arithmetic progression'],
  ['Circle and tangent proofs', 'tangent.*radius|tangent lengths|circle.*proof|cyclic'],
  ['Trigonometry and heights/distances', 'trigonometric|elevation|depression'],
  ['Grouped statistics and cumulative frequency', 'grouped mean|ogive|cumulative frequency'],
  ['Elementary probability', 'probability|sample space'],
];
for (const [name, pattern] of schoolTopics) add('AP Classes 8–10', 'AP-SCHOOL-VERIFY', 'P1', name, pattern);
const inter = [
  ['Sets, relations and functions', 'set builder|relations|functions'],
  ['Trigonometric equations and identities', 'trigonometric equation|trigonometric identit'],
  ['Complex powers and De Moivre theorem', 'de moivre|complex.*power|powers'],
  ['Theory of equations and reciprocal equations', 'theory of equations|reciprocal equations|transformation of equations'],
  ['Permutations, combinations and binomial theorem', 'permutation|combination|binomial'],
  ['Partial fractions', 'partial fractions'],
  ['Locus', '\\blocus\\b|loci'],
  ['Translation and rotation of coordinate axes', 'transformation of axes|rotation of axes|translation of axes'],
  ['Families and concurrency of straight lines', 'family of.*lines|families of.*lines|concurrent lines|concurrency'],
  ['Pair of straight lines and homogenisation', 'pair of.*lines|homogeniz|homogenis'],
  ['Circles, systems of circles and radical axis', 'radical axis|system.*circles|family.*circles'],
  ['Conics, tangents and normals', 'parabola|ellipse|hyperbola|conic'],
  ['Vectors, direction cosines and planes', 'direction cosine|direction ratio|plane equation|vector equation'],
  ['Limits, continuity and derivatives', 'limit|continuity|derivative|differentiation'],
  ['Integration and differential equations', 'integration|differential equation'],
  ['Probability and binomial distribution', 'probability|binomial distribution'],
];
for (const [name, pattern] of inter) add('AP Intermediate', /Locus|axes|Families|Pair/.test(name) ? 'BIE-IB-2023' : 'AP-INTER-VERIFY', 'P1', name, pattern);
const ug = [
  ['Matrix rank, eigenvalues and diagonalisation', 'rank|eigenvalue|diagonali'],
  ['Cayley-Hamilton theorem', 'cayley.?hamilton'],
  ['Multivariable calculus, Jacobians and extrema', 'jacobian|partial derivative|partial differentiation|multivariable'],
  ['Double/triple integrals and change of order', 'double integral|triple integral|order of integration'],
  ['Vector calculus and integral theorems', 'divergence|stokes|green.*theorem|vector calculus'],
  ['First/higher-order differential equations', 'differential equation|second.order oscillator'],
  ['Laplace and Fourier transforms', 'laplace|fourier'],
  ['Numerical roots, interpolation and quadrature', 'newton|bisection|interpolat|simpson|trapezoid'],
  ['Numerical ODEs and Runge-Kutta', 'runge.?kutta|euler method'],
  ['Complex analyticity, Cauchy formula and residues', 'cauchy.?riemann|analytic function|residue|contour integral'],
  ['Probability distributions and inference', 'distribution|hypothesis|confidence interval'],
  ['Discrete logic, graphs and recurrences', 'truth table|logical connective|graph|recurrence'],
];
for (const [name, pattern] of ug) add('JNTUK UG bridge', 'UG-REGULATION-VERIFY', 'P1', name, pattern);
const pgMath = [
  ['Binary operations and Boolean algebra', 'binary operation|boolean algebra'],
  ['Generating functions', 'generating function'],
  ['Pigeonhole and propositional calculus', 'pigeonhole|truth table|tautology|contradiction'],
  ['Euler theorem for homogeneous functions', 'euler.*homogeneous|homogeneous function'],
  ['Positive definite and semidefinite matrices', 'positive.definite|positive.semidefinite|semi.definite'],
  ['Groups and rings', 'group theor|ring theor|abelian|algebraic groups|algebraic rings|abstract algebra'],
  ['Subspaces, kernel/image and rank-nullity', 'subspace|rank.nullity|kernel.*image|image.*kernel'],
];
for (const [name, pattern] of pgMath) add('PG mathematical foundations', 'JNTUK-AIDS-R25 pp7–8', 'P0', name, pattern);
const pg = [
  ['Nearest-neighbour distance models', 'nearest.neighbou?r|\\bknn\\b|k.nearest'],
  ['Decision trees, impurity and random forests', 'decision tree|random forest|impurity'],
  ['Naive Bayes classification', 'na[iï]ve bayes|bayes classifier'],
  ['SVM, margins and kernel trick', 'support vector|kernel trick|\\bsvm\\b'],
  ['Logistic regression and classification loss', 'logistic regression|classification loss|cross.entropy'],
  ['K-means and fuzzy clustering', 'k.means|fuzzy c.means'],
  ['Expectation-maximisation and spectral clustering', 'expectation.maximi[sz]|spectral clustering'],
  ['Perceptron and backpropagation', 'perceptron|backpropagation'],
  ['Bias-variance and model evaluation', 'bias.variance|cross.validation|confusion matrix'],
];
for (const [name, pattern] of pg) add('PG machine learning', 'JNTUK-CSE-R25 pp38–39', 'P0', name, pattern);
for (const [name, pattern] of [
  ['PCA, whitening and ZCA', 'principal component|\\bpca\\b|whitening|\\bzca\\b'],
  ['Scaling, standardisation and feature selection', 'feature scal|standardization|standardisation|feature selection'],
  ['Bag-of-words, n-grams and TF-IDF', 'bag.of.words|n.grams|tf.idf'],
  ['SIFT, HOG and image-gradient features', '\\bsift\\b|\\bhog\\b|gradient orientation histogram'],
]) add('PG feature engineering', 'JNTUK-AIDS-R25 pp39–40', 'P0', name, pattern);
for (const [name, pattern] of [
  ['SGD, momentum, Adam and initialisation', '\\badam\\b|stochastic gradient descent|xavier|he initialization|momentum'],
  ['Regularisation, dropout and batch normalisation', 'dropout|batch normali|regulari[sz]ation'],
  ['Convolution and pooling mathematics', 'convolutional|pooling'],
  ['RNN, LSTM, GRU and gradient stability', '\\brnn\\b|\\blstm\\b|\\bgru\\b|vanishing gradient|exploding gradient'],
  ['Attention and graph neural networks', 'attention mechanism|graph neural network'],
]) add('PG deep learning', 'JNTUK-AIDS-R25 pp35–36', 'P0', name, pattern);
for (const [name, pattern] of [
  ['N-gram probability, smoothing and backoff', 'n.gram|backoff|language model.*smooth'],
  ['Hidden Markov and maximum entropy models', 'hidden markov|maximum entropy model'],
  ['Probabilistic grammars and dynamic-programming parsing', 'probabilistic.*grammar|probabilistic.*cyk|probabilistic.*cfg'],
]) add('PG NLP mathematics', 'JNTUK-CSE-R25 pp40–41', 'P1', name, pattern);
for (const [name, pattern] of [
  ['Hilbert spaces and quantum measurement', 'hilbert|quantum measurement'],
  ['Qubit, Bloch sphere and unitary gates', 'qubit|bloch sphere|unitary.*gate'],
  ['Tensor products, Bell states and entanglement', 'tensor product|bell state|entanglement'],
]) add('PG quantum mathematics', 'JNTUK-CSE-R25 pp42–43', 'P1', name, pattern);

for (const row of rows) {
  const regex = new RegExp(row.pattern, 'i');
  row.lessonEvidence = lessons.filter(x => regex.test(x.text)).map(({ id, title, route }) => ({ id, title, route }));
  row.supportingSourceEvidence = supporting.filter(x => regex.test(x.text)).map(x => x.path);
  row.status = row.lessonEvidence.length ? 'LESSON_CANDIDATE' : row.supportingSourceEvidence.length ? 'SUPPORT_ONLY_CANDIDATE' : 'NO_EVIDENCE_FOUND';
}
const summary = Object.fromEntries(['LESSON_CANDIDATE', 'SUPPORT_ONLY_CANDIDATE', 'NO_EVIDENCE_FOUND'].map(status => [status, rows.filter(x => x.status === status).length]));
const output = { date: '2026-10-12', scope: 'AP Class 8 through JNTUK M.Tech CSE / AI / Data Science mathematical topics', method: 'Fresh source catalog extraction and case-insensitive lexical evidence search. Candidates require review; no match is not proof of absence. Stage assignment and exact current AP/UG syllabus completeness remain unverified.', counts: { core: core.length, school: school.length, advanced: advanced.length, total: lessons.length }, schoolByLevel: Object.fromEntries([...new Set(school.map(x => x.metadata.academicLevel))].map(level => [level, school.filter(x => x.metadata.academicLevel === level).length])), summary, rows };
mkdirSync('reports', { recursive: true });
writeFileSync('reports/AP_JNTUK_LESSON_COVERAGE_EVIDENCE.json', JSON.stringify(output, null, 2) + '\n');
const lines = ['# AP to JNTUK lesson evidence matrix', '', 'Date: 2026-10-12', '', `Catalog: ${lessons.length} lessons. Screening checklist: ${rows.length} topic groups.`, '', '**Candidate search only:** a lesson hit does not establish syllabus depth or correct grade placement. Support-only means source mentions exist outside the lesson catalogs; they may be formulas, dictionary entries, or studios. No evidence found means no hit in this search, not certified absence. Related concepts can produce false positives (especially groups, powers, rank, and kernels).', '', 'AP-SCHOOL-VERIFY and AP-INTER-VERIFY are provisional checklist entries awaiting current official chapter/outcome verification. BIE-IB-2023 is an explicitly historical AP source. UG-REGULATION-VERIFY requires a branch/semester regulation source. JNTUK R25 references are university-authored PDFs obtained from a public mirror; official-host equivalence is not independently confirmed.', '', '| Stage | Topic group | Priority | Result | Lesson candidates (ID: title) | Supporting source candidates | Syllabus evidence |', '| --- | --- | --- | --- | --- | --- | --- |'];
for (const r of rows) lines.push(`| ${r.stage} | ${r.concept} | ${r.priority} | ${r.status} | ${r.lessonEvidence.slice(0, 6).map(x => `${x.id}: ${x.title}`).join('; ') || '—'}${r.lessonEvidence.length > 6 ? `; +${r.lessonEvidence.length - 6} more` : ''} | ${r.supportingSourceEvidence.slice(0, 3).map(x => '`' + x + '`').join('; ') || '—'} | ${r.source} |`);
writeFileSync('reports/AP_JNTUK_LESSON_COVERAGE_MATRIX.md', lines.join('\n') + '\n');
console.log(JSON.stringify({ counts: output.counts, groups: rows.length, summary, noEvidence: rows.filter(x => x.status === 'NO_EVIDENCE_FOUND').map(x => x.concept), supportOnly: rows.filter(x => x.status === 'SUPPORT_ONLY_CANDIDATE').map(x => x.concept) }, null, 2));
