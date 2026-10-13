import {readFileSync,writeFileSync} from 'node:fs';
import {buildSync} from 'esbuild';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
const inventory=JSON.parse(readFileSync('src/modules/lessons/catalog/unified/unifiedLessonIndex.generated.json','utf8')).lessons;
const authored=JSON.parse(readFileSync('src/modules/lessons/authored/authoredLessons.generated.json','utf8')).lessons;
const bundle=buildSync({entryPoints:['src/modules/lessons/authored/authoredLessonModels.ts'],bundle:true,platform:'node',format:'esm',write:false});
const runtime=resolve('tmp/authored-lessons/upgrade-models.mjs');writeFileSync(runtime,bundle.outputFiles[0].text);
const {evaluateAuthoredModel:run}=await import(pathToFileURL(runtime).href);
const plans={
 'Numbers and Arithmetic':['Build a manipulable number representation','Draggable number-line points; place-value tiles; estimate/reveal toggle','Exact value, decomposition and estimation error'],
 'Number Theory':['Reveal the structure behind the number rule','Prime-factor tree; pair/group factor chips; divisor and remainder toggles','Factorization, parity, divisor pairs and a checked counterexample'],
 'Ratios and Proportion':['Link quantities with a ratio table and visual scale','Editable ratio rows; linked quantities; unit selector; direct/inverse comparison','Unit rate, common scale, invariant and unit-consistent result'],
 'Algebra':['Connect expressions with manipulable algebra tiles','Signed area tiles; term highlighting; expansion/factorization switch; step reveal','Matching original/simplified values and coefficient-by-coefficient checks'],
 'Equations and Inequalities':['Link equation solving to a balance and graph','Drag balance terms; step-back/step-forward; coefficient sliders; domain constraints','Residual checks, intersections, root classifications and rejected contextual solutions'],
 'Functions and Graphs':['Link curve, equation, domain and value table','Draggable curve handles; domain endpoints; trace point; compare-function overlays','Coordinates, domain/range, slope and transformation parameters'],
 'Coordinate Geometry':['Make coordinates and measurements draggable','Draggable points; snapping; axes/units toggle; ratio handle; construction trace','Distance, section ratio, determinant/collinearity and labelled coordinates'],
 'Geometry':['Use constrained draggable constructions','Drag vertices; lock equal lengths/parallel lines; ruler/protractor; proof-step overlays','Angles, sides, diagonals, invariants and a condition-breaking counterexample'],
 'Trigonometry':['Link a right triangle, unit circle and ratio graph','Angle drag handle; triangle-size control; degree/radian switch; exact-angle presets','Six ratios, angle-only invariance, undefined endpoints and exact values'],
 'Mensuration':['Link dimensions, nets and measured quantities','Radius/height handles; net unfold animation; exposed-face toggles; unit conversion','Area versus volume, hidden joined faces, capacity and correct units'],
 'Vectors and 3D Geometry':['Manipulate vectors and spatial measurements','Draggable vector tips; component projections; camera/reset; dot/cross-product overlays','Components, lengths, angles, orientation and signed products'],
 'Matrices and Linear Algebra':['Show how a matrix transforms a point cloud','Editable matrix cells; drag vectors; eigenvector overlays; singular-case presets','Determinant, transformed coordinates, eigenvalues and numerical residuals'],
 'Complex Numbers':['Link algebraic and geometric complex representations','Drag Argand points; polar/cartesian switch; multiplication rotation; contour/pole controls','Magnitude, argument, products and contour conditions'],
 'Sequences and Series':['Build sequences and show accumulation','Term-index slider; difference rows; recurrence stepper; partial-sum animation','Nth term, differences, sums and convergence assumptions'],
 'Limits and Derivatives':['Link approaching points to local change','Drag secant points; zoom; left/right approach; tangent and error overlays','Difference quotients, derivative, discontinuities and approximation error'],
 'Integrals':['Make accumulation visible','Partition-count control; left/right/midpoint sums; draggable bounds; signed-area toggle','Approximation, exact integral, signed area and error'],
 'Differential Equations':['Explore trajectories with stated numerical methods','Initial-condition drag point; slope-field toggle; step size; solver comparison','Trajectory, equilibrium, step error and method limitations'],
 'Probability':['Compare theoretical outcomes and experiments','Clickable sample-space tree; fair/unfair controls; seeded trial animation; batch size','Exact probabilities, empirical frequencies and convergence variability'],
 'Statistics and Inference':['Link an editable dataset to a plot and calculation','Editable/addable data rows; draggable frequencies; sample-size presets; method comparison','Weighted contributions, centre/spread, cumulative frequency and assumptions'],
 'Combinatorics and Discrete Mathematics':['Build and count finite structures systematically','Arrange objects by dragging; repetition/order toggles; enumeration tree; recurrence stepper','Distinct cases, count formula, rejected duplicates and coefficient interpretation'],
 'Logic and Proofs':['Make assumptions and implications explicit','Drag proof cards; counterexample generator; condition toggles; assumption checklist','Valid implications, missing premises and proof versus numerical evidence'],
 'Graph Theory':['Build a graph and trace an algorithm','Draggable vertices; add/remove edges; weights/direction toggle; traversal animation','Degree, paths, components, algorithm queue and checked optimality conditions'],
 'Finance and Optimization':['Compare contextual scenarios','Editable cash-flow rows; rate/time controls; feasible-region handles; scenario overlays','Cash flow, compound growth, optimal point and unit/assumption checks'],
 'Numerical Methods':['Inspect iteration and approximation error','Step-size/tolerance controls; iteration stepper; residual chart; method comparison','Approximations, stopping rule, error and convergence failure'],
 'Transforms and Special Functions':['Link a function with its transformed representation','Function preset; frequency/transform parameter; integration bounds; convergence-region overlay','Transform value, reconstruction, normalization and domain conditions'],
 'Machine Learning and AI':['Use a small visible dataset and trace each operation','Editable points/labels; parameter sliders; one-step training; compare predictions','Distances, scores, loss, gradients and held-out evaluation'],
 'NLP and Image Features':['Show the feature construction explicitly','Editable token counts/image pixels; histogram bins; vocabulary/smoothing controls','Feature vectors, normalized weights, orientation bins and probabilities'],
 'Quantum Mathematics':['Link amplitudes, state geometry and measurements','Bloch-angle drag handles; gate buttons; basis selector; measurement animation','Normalized amplitudes, probabilities, phase and state purity'],
 'Abstract Algebra and Topology':['Explore a finite algebraic structure','Operation-table editor; modulus/control; identity/inverse checks; counterexample selector','Closure, inverses, associativity examples and axiom failures'],
 'History and Numeral Systems':['Compare authentic representation conventions','Digit/glyph tiles; base selector; decode/encode stepper; calendar/base distinction','Place contributions, zero conventions and equivalent values'],
 'Authoring and Learning Tools':['Use a working miniature authoring sandbox','Live component preview; property controls; event trace; accessible interaction modes','Actual behaviour, feedback states and exportable authored example'],
 'Patterns and Algorithms':['Trace a rule or algorithm on visible inputs','Editable inputs; next-step animation; pattern cards; rule/counterexample switch','Execution trace, intermediate state and checked output'],
 'Calculators and Workspaces':['Expose linked representations and exact steps','Editable expressions; variable sliders; table/graph switch; precision control','Exact and approximate outputs, units and domain errors'],
 'Mathematical Modelling':['Compare a mathematical model with observations','Editable data/assumptions; scenario sliders; residual plot; model comparison','Prediction, dimensional consistency, uncertainty and validation error'],
};
const pg={
 32001:['Reciprocal root pairing explorer','Coefficient editor; t=x+1/x substitution stepper; paired-root plot','Reduced roots, reciprocal x pairs and real-root conditions'],
 32002:['Axes transformation board','Drag point/origin; rotate axes; active/passive switch','Old/new coordinates and invariant distances'],
 32003:['Paired-line construction','Slope handles; homogeneous coefficient editor; degeneracy presets','Two factors, line directions and discriminant'],
 32004:['Circle power and radical-axis board','Drag centres; change radii; show equal-power locus','Powers, radical axis and circle intersections'],
 32005:['Matrix-polynomial verification','Editable 2×2 matrix; multiply-step animation; inverse toggle','A², characteristic polynomial residual and determinant conditions'],
 32006:['Transform comparison','Signal presets; decay/frequency controls; Laplace-region and Fourier component toggles','Transform, periodic reconstruction and convergence'],
 32007:['Complex contour and pole explorer','Drag pole and contour; orientation switch; Cauchy/residue mode','Enclosed residues, contour integral and analyticity conditions'],
 32008:['Coefficient and generating-function board','Editable sequence coefficients; recurrence stepper; series truncation control','Coefficient extraction, convolution and convergence'],
 32009:['Homogeneous scaling surface','Drag x/y; scale both inputs; derivative overlays','Scaling degree and Euler identity residual'],
 32010:['Quadratic-form surface','Matrix cell editor; vector direction handle; eigenvalue indicator','Curvature, eigenvalue signs and PD/PSD boundary'],
 32011:['Modular operation table','Modulus selector; add/multiply switch; inverse lookup','Units, zero divisors and axiom checks'],
 32012:['Nearest-neighbour voting board','Drag labelled points/query; k slider; feature-scale and metric selector','Neighbour ranking, votes and decision regions'],
 32013:['Tree split and forest voting board','Split threshold drag; editable labels; Gini/entropy switch; sample toggles','Weighted impurity gain and ensemble votes'],
 32014:['Bayes evidence table','Editable class/feature counts; smoothing toggle; log-score reveal','Class likelihood products and normalized posteriors'],
 32015:['Margin and kernel board','Drag training points/support lines; C and kernel controls','Margin, support vectors, violations and kernel similarity'],
 32016:['Clustering iteration board','Drag points/centres; k and fuzziness controls; one-step animation','Assignments, memberships, centroids and objective'],
 32017:['EM and spectral comparison','Mixture density controls; E/M stepper; affinity graph and embedding view','Responsibilities, weighted updates, likelihood and graph eigenvectors'],
 32018:['Neuron and gradient board','Editable weights/input/target; forward/backward stepper; gradient check','Prediction, loss and layer-wise derivatives'],
 32019:['Evaluation and learning-curve board','Confusion-matrix cells; train/validation switch; complexity control','Precision/recall/F1, learning curves and leakage indicators'],
 32020:['PCA and whitening scatter board','Drag sample points; centering/axis/whitening toggles; regularizer control','Covariance, eigenvectors and transformed cloud'],
 32021:['Token-to-vector table','Editable corpus/tokens; unigram/bigram switch; IDF convention and normalization','Counts, document frequencies and TF-IDF vectors'],
 32022:['Gradient descriptor image board','Editable pixel grid; gradient arrows; orientation bins; block normalization','Magnitude/orientation votes and descriptor vector'],
 32023:['Optimizer trajectory board','Loss-surface presets; learning rate/momentum controls; SGD/Adam switch','Parameter path, moments, loss and update magnitude'],
 32024:['Regularization comparison','Penalty/dropout controls; seeded masks; train/inference switch; batch-statistics editor','Expected activations, penalty gradients and normalized values'],
 32025:['Convolution workbench','Editable input/kernel grid; stride/padding controls; window animation; pooling switch','Products per window and output feature map'],
 32026:['Recurrent timeline','Sequence editor; gate sliders; unrolled steps; gradient-product trace','Hidden/cell states and vanishing/exploding gradients'],
 32027:['Attention and message-passing matrix','Editable Q/K/V; score heatmap; neighbour graph; masks/temperature controls','Normalized weights, messages and output vectors'],
 32028:['N-gram smoothing table','Token/history counts; vocabulary selector; smoothing/backoff switch','Normalized probabilities and sequence log scores'],
 32029:['HMM path lattice','Transition/emission matrix editor; observations; forward/Viterbi stepper','Path scores, summed likelihood and best path'],
 32030:['Parsing chart','Small grammar/token editor; span selection; inside/Viterbi switch','Rule products, split contributions and parse trees'],
 32031:['Measurement amplitude board','Real/imaginary amplitude editor; basis selector; repeated trials','Norm, Born probabilities and basis effects'],
 32032:['Bloch-sphere gate board','Draggable θ/φ; X/Z/H gate buttons; basis toggle','State amplitudes, Bloch vector and measurements'],
 32033:['Two-qubit state board','Tensor-product amplitude grid; Bell presets; local gates; partial-trace view','Joint outcomes, reduced states and purity'],
};
const rows=inventory.map(lesson=>{
 const draft=authored.find(l=>l.lessonId===lesson.id),result=draft?run(draft.interactive.model,Object.fromEntries(draft.interactive.controls.map(c=>[c.key,c.initial]))):null;
 let plan=pg[lesson.id]??plans[lesson.category];if(!plan)throw Error('Missing upgrade plan '+lesson.id);
 if(/normal|gaussian|gamma distribution|beta distribution|density|cumulative distribution|cdf|continuous distribution/i.test(lesson.title)&&lesson.category==='Probability')plan=['Distribution and probability-area explorer','Distribution parameter controls; draggable interval bounds; density/CDF switch; seeded sample histogram','Density, interval probability, CDF and theoretical versus sampled distribution'];
 if(/confidence|hypothesis|p.value|sample size|t.test|z.test|anova|chi.square/i.test(lesson.title)&&lesson.category==='Statistics and Inference')plan=['Sampling and inference workbench','Editable sample data; null/alternative controls; confidence/alpha sliders; repeated-sample animation','Test statistic, interval, tail area and assumptions'];
 if(draft&&['square-array','cube-array','odd-square','odd-cube','triangular-square','differences'].includes(draft.interactive.model))plan=['Square/cube pattern construction','Tile/layer drag controls; add-border animation; odd-term highlighting; difference-table stepper','Cell counts, layer volumes, sequence differences and the matching identity'];
 if(draft&&['root-factors','square-pattern','square-completion','root-bracket','root-iteration'].includes(draft.interactive.model))plan=['Root and factor-grouping board','Drag prime factors into pairs/triples; multiplier/divisor chips; number-line bounds; iteration trace','Exact grouped root, leftover factors, minimal corrections and approximation error'];
 if(draft&&['power-product','power-power','zero-power','negative-power','doubling','decimal-power','scientific','scientific-compare'].includes(draft.interactive.model))plan=['Exponent and scale explorer','Factor-block grouping; reciprocal switch; animated decimal-place shifts; logarithmic scale; growth stages','Exponent operations, normalized coefficient, magnitude ratio and domain restrictions'];
 if(draft&&['base-system','sexagesimal','mayan','roman','egyptian','indian-place'].includes(draft.interactive.model))plan=['Numeral representation workbench','Place/glyph tiles; carry/regroup animation; encode/decode steps; Indian/international or historical-convention switch','Place contributions, equivalent value and zero/base conventions'];
 if(draft&&draft.interactive.model==='coins')plan=['Ordered-outcome and trial board','Clickable H/T tree; coin-count control; event selection; seeded toss animation','Ordered outcomes, favourable count and empirical/theoretical probability'];
 if(draft&&draft.interactive.model==='cryptarithm')plan=['Column-arithmetic puzzle board','Drag digits onto letters; show/hide carries; addition/multiplication mode; constraint checks','Column equations, carry values, uniqueness and leading-zero violations'];
 if(draft&&draft.interactive.model==='grouped')plan=['Editable grouped-data workbench','Add/remove class rows; drag frequencies; mean/median/mode switch; midpoint and cumulative-frequency overlays','Weighted contributions, histogram/ogive, class boundaries and approximation assumptions'];
 if(draft&&draft.interactive.model==='convolution')plan=pg[32025];
 if(draft&&draft.interactive.model==='product-growth')plan=['Product-growth area board','Drag original sides and increments; reveal two strips/corner; animate expansion','Old/new areas and separate ak, bh and hk contributions'];
 const reference=lesson.id===10102;
 return {lessonId:lesson.id,title:lesson.title,category:lesson.category,level:lesson.level,route:lesson.route,recent:Boolean(draft),batch:draft?.batch??null,model:draft?.interactive.model??'',priority:reference?'Reference':draft?result.plot?'P2':'P1':'Review',currentEvidence:reference?'Editable rows, draggable midpoint markers, linked weighted-contribution bars and numerical frequency scenarios; colors corrected':draft?`${draft.interactive.controls.length} numeric/slider controls; ${result.plot?'SVG geometry illustration':'SVG concept visualization'}; ${result.table?'calculation table':'numeric readout'}; 8 examples and 8 practice questions`:'Registered existing page; individual interaction depth has not been reviewed in this audit',proposedBoard:plan[0],creativeControls:plan[1],liveInformation:plan[2],contentUpgrade:draft?`Connect the ${lesson.title.toLowerCase()} diagram to the worked steps; add prediction prompts, boundary/counterexample cases and contextual units.`:`Review ${lesson.title.toLowerCase()} against its definitions, worked steps and domain assumptions before choosing the board.`,auditStatus:reference?'Reference page and UI fix':draft?'Concept visualization and explanations added; further proposed controls require implementation':'Category-based candidate; page-level review pending'};
});
const report={referenceLessonId:10102,total:rows.length,recent:rows.filter(r=>r.recent).length,priorities:Object.fromEntries(['P1','P2','Review','Reference'].map(p=>[p,rows.filter(r=>r.priority===p).length])),method:'All registry identities indexed; all recently authored models evaluated at initial inputs. Existing pages are candidates pending individual review. The upgrade controls are proposals, not completion claims.',rows};
writeFileSync('reports/LESSON_INTERACTION_UPGRADE_AUDIT.json',JSON.stringify(report,null,2)+'\n');
writeFileSync('src/modules/lessons/catalog/unified/lessonUpgradeAudit.generated.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({total:report.total,recent:report.recent,priorities:report.priorities}));
