from pathlib import Path
import re


ROOT = Path(r"C:\Indian Servers\Interactive Biology App\Image text Prompts")


MATHS = {
    "01_Number_Systems": ("Number Systems", "number-line zoom from natural numbers to integers, rationals, irrationals, reals and complex plane; Venn nesting of sets; prime factor tree", "a/b form, decimal expansion types, Euclid lemma, HCF x LCM = product for two integers, |x| distance", "classify numbers, compare irrational vs rational decimal, prime factorization, place value and number-line ordering"),
    "02_Fractions_Decimals_Percentages": ("Fractions, Decimals and Percentages", "fraction bars, decimal place-value grid, percent hundred-square, ratio strip, conversion triangle", "fraction = part/whole, percent = fraction x 100, decimal place value, increase/decrease percent, simple interest cue", "convert 3/8, find 15 percent of a quantity, compare fractions, percent change error"),
    "03_Ratios_Proportions_and_Unit_Rates": ("Ratios, Proportions and Unit Rates", "double number line, ratio table, scale drawing, mixture model, speed-price-density unit-rate cards", "a:b = a/b, direct proportion y=kx, inverse proportion xy=k, unit rate = quantity per 1 unit", "recipe scaling, map scale, speed unit conversion, direct vs inverse proportion"),
    "04_Exponents_Radicals_and_Logarithms": ("Exponents, Radicals and Logarithms", "power tower, exponent-law tiles, radical simplification tree, log scale with pH/decibels/earthquake inset", "a^m a^n=a^(m+n), (a^m)^n=a^(mn), a^0=1, sqrt(ab), log_a x = y iff a^y=x", "simplify powers, rational exponents, solve basic log equation, domain of logarithm"),
    "05_Algebraic_Expressions_and_Identities": ("Algebraic Expressions and Identities", "algebra tiles, distributive area model, identity proof squares, factorization flowchart", "(a+b)^2, (a-b)^2, a^2-b^2, (x+a)(x+b), distributive law", "expand, factorize, substitute values, avoid sign errors"),
    "06_Linear_Equations_and_Inequalities": ("Linear Equations and Inequalities", "balance scale equation, inequality number line, slope-intercept graph, solution interval shading", "ax+b=c, y=mx+c, inequality flip when multiplying by negative, simultaneous linear equations", "solve one-step/multi-step equations, graph inequality, word problem, intersection solution"),
    "07_Coordinate_Geometry_and_Slope": ("Coordinate Geometry and Slope", "Cartesian plane, slope triangles, distance grid, midpoint marker, parallel/perpendicular line comparison", "m=(y2-y1)/(x2-x1), distance formula, midpoint formula, y-y1=m(x-x1), m1m2=-1", "find slope, line equation, distance/midpoint, parallel/perpendicular test"),
    "08_Euclidean_Geometry_Basics": ("Euclidean Geometry Basics", "points-lines-rays diagram, angle pair wheel, parallel-line transversals, construction compass-ruler scene", "angle sum facts, vertically opposite angles, corresponding/alternate angles, polygon angle sum (n-2)180", "prove angle relationships, construct bisector, classify polygons, identify assumptions"),
    "09_Triangles_Congruence_and_Similarity": ("Triangles, Congruence and Similarity", "triangle theorem wall, congruence/similarity cards, scale factor model, altitude/median/angle bisector overlays", "SSS/SAS/ASA/RHS, AA similarity, Pythagoras, area=1/2 bh, proportional sides", "prove congruence, find missing side by similarity, Pythagorean application, CPCTC warning"),
    "10_Circles_and_Theorems": ("Circles and Theorems", "circle anatomy, chord-radius perpendicular, tangent-radius, cyclic quadrilateral, angle at center vs circumference", "C=2pi r, A=pi r^2, arc length, sector area, tangent length equality, cyclic opposite angles sum 180", "find angles, tangent length, sector area, chord theorem misconception"),
    "11_Area_Surface_Area_and_Volume": ("Area, Surface Area and Volume", "2D-to-3D shape gallery, nets of solids, volume slicing, composite shapes, unit-cube model", "rectangle/triangle/circle area, prism/cylinder/cone/sphere volume and surface area, unit conversion squared/cubed", "composite area, paint surface area, tank volume, cm^2 vs cm^3"),
    "12_Sequences_and_Series": ("Sequences and Series", "pattern tiles, arithmetic/geometric sequence graph, sigma notation ladder, convergence strip", "AP: a_n=a+(n-1)d, S_n=n/2[2a+(n-1)d], GP: ar^(n-1), S_n=a(1-r^n)/(1-r)", "find nth term, sum AP/GP, recursive vs explicit, infinite GP condition"),
    "13_Functions_and_Graphs": ("Functions and Graphs", "input-output machine, mapping diagram, domain-range graph, transformations of parent functions", "f(x), domain/range, composition, inverse, vertical line test, transformations y=a f(b(x-h))+k", "identify function, graph transformations, compose functions, inverse domain restriction"),
    "14_Quadratic_Functions_and_Equations": ("Quadratic Functions and Equations", "parabola with vertex/axis/roots, completing-square tile model, discriminant decision tree", "ax^2+bx+c, quadratic formula, D=b^2-4ac, vertex -b/2a, factorization", "solve by factorizing/completing square/formula, graph roots, max/min application"),
    "15_Trigonometry": ("Trigonometry", "right triangle, unit circle, sine/cos/tan curves, reference-angle wheel, identity triangle", "sin=opp/hyp, cos=adj/hyp, tan=sin/cos, sin^2x+cos^2x=1, radians s=r theta", "height-distance problem, unit-circle values, graph amplitude/period, degree-radian conversion"),
    "16_Analytic_Geometry_Conics": ("Analytic Geometry and Conics", "cone sliced into circle ellipse parabola hyperbola, focus-directrix panels, standard-form equation cards", "circle, parabola, ellipse, hyperbola standard equations, eccentricity, focal distance", "identify conic, complete square, find focus/directrix, graph asymptotes"),
    "17_Matrices_and_Determinants": ("Matrices and Determinants", "matrix grid operations, transformation of square, determinant area scale, inverse matrix panel", "matrix addition/multiplication, det 2x2, inverse formula, row operations, AX=B", "multiply matrices, solve linear system, determinant zero meaning, transformation interpretation"),
    "18_Vectors_and_3D_Geometry": ("Vectors and 3D Geometry", "3D axes, vector arrows, dot/cross product geometry, plane and line model", "a.b=|a||b|cos theta, |a x b| area, line vector form, plane equation, direction cosines", "resolve vector, angle between vectors, line-plane intersection, scalar triple product volume"),
    "19_Limits_and_Continuity": ("Limits and Continuity", "approach arrows on graph, hole/jump/infinite discontinuities, epsilon-delta zoom panel", "lim x->a f(x), one-sided limits, continuity conditions, standard limits sin x/x, squeeze theorem cue", "evaluate algebraic limits, removable discontinuity, asymptote, continuity check"),
    "20_Differentiation": ("Differentiation", "tangent line zoom, slope-rate-velocity panels, derivative rule tree, optimization curve", "f'(x)=lim h->0 [f(x+h)-f(x)]/h, power/product/quotient/chain rules, dy/dx", "find derivative, tangent equation, increasing/decreasing, max/min optimization"),
    "21_Integration": ("Integration", "area under curve, Riemann rectangles, antiderivative ladder, substitution/parts workflow", "integral notation, fundamental theorem, power rule, u-substitution, integration by parts, definite integral area", "compute area, antiderivative, substitution, volume/accumulation interpretation"),
    "22_Differential_Equations": ("Differential Equations", "slope field, solution curves, separation workflow, growth-decay model, spring/RLC analogy", "dy/dx=f(x,y), separable DE, y=Ce^(kx), logistic cue, initial condition", "solve separable equation, exponential decay, slope-field matching, family vs particular solution"),
    "23_Probability": ("Probability", "sample-space grid, probability tree, Venn diagram, dice/cards model, Bayes flow", "P(A), P(A or B), P(A and B), conditional P(A|B), Bayes theorem, independence", "coin/dice events, conditional probability, tree diagram, independent vs mutually exclusive"),
    "24_Statistics_and_Data_Visualization": ("Statistics and Data Visualization", "histogram, box plot, scatter plot, normal curve, mean-median-mode balance, residual plot", "mean, median, mode, variance, standard deviation, z-score, correlation r, regression line", "summarize dataset, choose graph, outlier effect, correlation not causation"),
    "25_Combinatorics_and_Counting": ("Combinatorics and Counting", "counting tree, permutation lock, combination hand, Pascal triangle, inclusion-exclusion Venn", "n!, nPr, nCr, multiplication principle, inclusion-exclusion, binomial theorem", "arrangements, selections, restrictions, overcounting correction"),
    "26_Set_Theory_and_Logic": ("Set Theory and Logic", "Venn diagrams, truth tables, logic gates, quantifier cards, proof implication arrows", "union/intersection/complement, De Morgan laws, implication, converse/inverse/contrapositive, quantifiers", "shade sets, build truth table, prove implication, identify logical fallacy"),
    "27_Graph_Theory": ("Graph Theory", "nodes-edges network, Euler/Hamilton paths, adjacency matrix, tree, planar graph", "degree sum = 2E, Euler condition, adjacency matrix, connected components, tree E=V-1", "route planning, social network, shortest path, bipartite graph"),
    "28_Abstract_Algebra": ("Abstract Algebra", "group operation table, symmetry group of polygon, subgroup lattice, ring/field comparison", "closure, associativity, identity, inverse, homomorphism, cosets, modular arithmetic", "test group, Cayley table, modular addition, symmetry composition"),
    "29_Real_Analysis": ("Real Analysis", "real line completeness, sequence convergence, epsilon neighborhoods, continuous function zoom", "epsilon-N definition, Cauchy sequence, sup/inf, Bolzano-Weierstrass, uniform continuity cue", "prove convergence, find supremum, continuity proof, counterexample panel"),
    "30_Linear_Algebra_Advanced": ("Advanced Linear Algebra", "vector spaces, basis transformation, eigenvectors, diagonalization, subspace planes, SVD matrix decomposition", "span, linear independence, rank-nullity, eigen equation Av=lambda v, determinant, orthogonality", "find basis/rank, eigenvalues/eigenvectors, diagonalize, projection and PCA application"),
}


BIO_CATEGORY = {
    "01_Human_Anatomy_and_Physiology": ("an organ-system infographic with cutaway anatomy, blood/air/fluid flow arrows, tissue microstructure insets and clinical correlation panels", "label gross anatomy, microscopic tissue, physiological pathway, feedback loop, normal vs abnormal comparison, and safe medical-disclaimer wording"),
    "02_Cell_Biology": ("a high-resolution cell cutaway with organelles, membrane transport, molecular machinery, microscopy inset and pathway arrows", "label organelles, membranes, molecular steps, energy flow, transport direction, cell-cycle or signaling checkpoints and common microscopy artifacts"),
    "03_Genetics_and_Molecular_Biology": ("DNA/RNA/protein molecular diagrams, chromosome maps, gene-expression flow, inheritance grids and lab-readout panels", "show base pairing, directionality 5' to 3', enzymes, codons, inheritance ratios, mutation types, gel/sequence readouts and regulation switches"),
    "04_Microbiology": ("microbe morphology plates, Gram/strain comparison, culture dish, microscope view, life-cycle stages and host/environment interaction", "label cell wall/envelope, growth phase, diagnostic stain, reproduction, virulence factor, antimicrobial target and biosafety notes"),
    "05_Viruses_and_Infectious_Disease": ("viral particle cutaway, host-cell entry, replication cycle, immune response, transmission route and prevention panel", "label genome type, capsid/envelope proteins, receptor binding, replication steps, diagnostic markers, vaccine/drug target and public-health caution"),
    "06_Human_Disease_and_Public_Health": ("pathophysiology map from risk factor to tissue damage to symptoms to screening/prevention, with population-health panel", "show normal vs diseased tissue, biomarkers, risk factors, diagnostic tests, prevention, treatment classes and non-diagnostic medical wording"),
    "07_Sensory_and_ENT_Anatomy": ("sensory-organ cutaway with receptor cells, nerve pathways, stimulus transduction and common disorder inset", "label anatomical layers, receptor type, signal pathway to brain, protective reflexes, clinical tests and age-related or infection-related changes"),
    "08_Plant_Biology": ("plant organ cross-sections, vascular transport arrows, chloroplast/stomata insets, hormone gradients and ecology/agriculture applications", "label tissues, xylem/phloem direction, gas exchange, reproductive structures, growth regulators, stress response and experimental setup"),
    "09_Ecology_and_Environment": ("ecosystem map with trophic levels, nutrient cycles, population graphs, abiotic factors and conservation interventions", "show arrows for matter/energy flow, carrying capacity, feedback loops, pollutant pathways, biodiversity metrics and human-impact mitigation"),
    "10_Evolution_and_Biodiversity": ("phylogenetic tree, fossil/trait comparison, selection pressure scene, population allele-frequency panel and taxonomy cards", "label shared derived traits, clades, speciation barriers, evidence lines, adaptation vs acclimation, and common evolution misconceptions"),
    "11_Biochemistry_and_Metabolism": ("molecular pathway map with enzymes, substrates, products, cofactors, energy carriers and regulation checkpoints", "show chemical structures where useful, enzyme active site, pathway compartment, ATP/NADH flow, pH/temperature effects and rate/regulation graphs"),
    "12_Developmental_and_Reproductive_Biology": ("timeline from cells to tissues/organs, embryo/fetal diagrams, hormone-cycle graphs and ethical/clinical context panels", "label stages, germ layers, signaling gradients, hormone peaks, placental/fetal circulation, congenital-risk caveats and non-diagnostic wording"),
    "13_Animal_Physiology_and_Homeostasis": ("comparative animal systems, homeostasis control loops, fluid/ion/heat exchange diagrams and physiological graphs", "show set point, sensor, integrator, effector, negative feedback, comparative adaptations and environmental constraints"),
    "14_Biotechnology_and_Lab_Techniques": ("lab workflow bench with reagents, instruments, readout images, controls, troubleshooting and biosafety labels", "show sample preparation, controls, protocol steps, expected results, interpretation, artifacts, contamination risk and PPE/safety notes"),
    "15_Cancers_and_Oncology": ("tumor microenvironment cutaway, mutation pathway, staging panel, histology/molecular marker inset and treatment strategy map", "show cell-of-origin, driver mutations, invasion/metastasis, biomarkers, screening/diagnosis concepts, therapy classes and careful medical disclaimer"),
    "16_Animals_and_Zoology": ("comparative anatomy plates, life cycle, body-plan diagrams, habitat adaptations and evolutionary relationships", "label structures, function, taxonomy, locomotion/feeding/reproduction, developmental stages and ecological role"),
    "17_Drug_Discovery_and_Pharmacology": ("drug pipeline, target binding pocket, assay plate, dose-response curve, ADME organs and clinical-trial flow", "show target, mechanism of action, potency/efficacy/selectivity, PK/PD parameters, toxicity checkpoints, trial phases and regulatory caution"),
}


BIO_KEYWORDS = {
    "brain": ("brain lobes, cortex layers, hippocampus, cerebellum, brainstem, neurons and synapses", "neural pathway arrows, action potential inset, neurotransmitter synapse panel, blood-brain barrier note"),
    "heart": ("four chambers, valves, coronary arteries, conduction nodes, ECG strip and cardiac cycle pressure-volume panel", "blood-flow arrows, systole/diastole, SA node to Purkinje pathway, oxygenated vs deoxygenated color coding"),
    "kidney": ("nephron, glomerulus, Bowman's capsule, loop of Henle, collecting duct, renal artery/vein and urine pathway", "filtration, reabsorption, secretion, osmoregulation gradient, GFR/creatinine marker caution"),
    "lungs": ("bronchi, bronchioles, alveoli, capillary exchange, diaphragm and spirometry graph", "O2/CO2 diffusion arrows, surfactant, ventilation-perfusion matching, asthma/COPD misconception where relevant"),
    "digestive": ("mouth, esophagus, stomach, liver, pancreas, small intestine villi, colon and microbiome inset", "enzyme map, peristalsis arrows, absorption surface, bile/emulsification and nutrient destination"),
    "nervous": ("CNS/PNS map, neuron anatomy, reflex arc, synapse and myelin cross-section", "afferent/efferent pathways, action potential phases, neurotransmitter release and signal integration"),
    "endocrine": ("pituitary-thyroid-adrenal-pancreas-gonad axis map, hormone receptors and feedback loops", "negative feedback, blood hormone transport, target-cell receptor specificity and timing"),
    "immune": ("innate/adaptive immune cells, antigen presentation, antibodies, inflammation and memory response", "macrophage, dendritic cell, T/B cells, cytokines, vaccination memory and self/non-self tolerance"),
    "animal_cell": ("animal-cell organelles, plasma membrane, nucleus, ER, Golgi, mitochondria, lysosomes and cytoskeleton", "protein trafficking, membrane transport, organelle dysfunction and microscopy scale"),
    "plant_cell": ("cell wall, chloroplasts, vacuole, plasmodesmata, nucleus and mitochondria", "photosynthesis compartment, turgor pressure, plant vs animal comparison and cell-wall function"),
    "membrane": ("phospholipid bilayer, channels, pumps, receptors, cholesterol and transport vesicles", "diffusion/osmosis/active transport, Na+/K+ pump, concentration gradients and membrane potential"),
    "mitosis": ("prophase, metaphase, anaphase, telophase, cytokinesis and spindle checkpoint", "chromosome alignment, sister chromatid separation, cancer-link caution and cell-cycle control"),
    "meiosis": ("meiosis I/II, crossing over, independent assortment, gametes and nondisjunction", "haploid/diploid changes, genetic variation, tetrads, chiasmata and trisomy caveat"),
    "respiration": ("glycolysis, pyruvate oxidation, Krebs cycle, electron transport chain and ATP synthase", "ATP/NADH/FADH2 yield, mitochondrion compartments, oxygen as final electron acceptor"),
    "photosynthesis": ("chloroplast, thylakoid light reactions, Calvin cycle, stomata and leaf cross-section", "photolysis, ATP/NADPH, CO2 fixation, glucose formation, limiting factors graph"),
    "dna": ("double helix, base pairs, antiparallel strands, histones and chromosome packaging", "5' to 3' direction, A-T/G-C pairing, replication fork or mutation markers"),
    "replication": ("replication fork, helicase, primase, DNA polymerase, ligase, leading/lagging strands", "Okazaki fragments, proofreading, semiconservative model and directionality"),
    "transcription": ("RNA polymerase, promoter, coding/template strands, mRNA processing and spliceosome", "initiation/elongation/termination, introns/exons, 5' cap and poly-A tail"),
    "translation": ("ribosome, mRNA codons, tRNA anticodons, amino acids and polypeptide chain", "start/stop codons, reading frame, peptide bond formation and rough ER targeting"),
    "pcr": ("thermal cycler, denaturation, annealing, extension, primers and gel result", "cycle amplification, Taq polymerase, controls, contamination and primer specificity"),
    "gel": ("agarose gel, wells, DNA ladder, bands, electrodes and UV/transilluminator result", "negative-to-positive migration, fragment size separation, loading dye and interpretation"),
    "elisa": ("microplate wells, antigen/antibody binding, enzyme substrate color change and standard curve", "positive/negative controls, optical density, sensitivity/specificity caution"),
    "western": ("protein gel, transfer membrane, primary/secondary antibodies, chemiluminescent bands", "loading control, molecular weight ladder, band intensity and false positives"),
    "virus": ("viral capsid/envelope, genome, receptor binding, replication cycle and host immune response", "attachment, entry, replication, assembly, release, vaccine/drug target"),
    "hiv": ("HIV envelope gp120, CD4 receptor, reverse transcriptase, integrase, protease and T-cell depletion timeline", "viral RNA to DNA, ART target classes, opportunistic infection caution"),
    "influenza": ("HA/NA spikes, segmented RNA, antigenic drift/shift, respiratory epithelium and vaccine update panel", "entry, replication, reassortment, immune response and prevention"),
    "coronavirus": ("spike protein, ACE2 entry, RNA replication, respiratory/systemic effects and vaccine/antiviral targets", "fusion, replication organelles, immune response and public-health caution"),
    "malaria": ("Anopheles mosquito, liver stage, RBC cycle, gametocytes and fever periodicity", "Plasmodium life cycle, vector control, diagnosis smear and prevention"),
    "tuberculosis": ("Mycobacterium, alveolar macrophage, granuloma, lung cavity and transmission droplets", "latent vs active TB, acid-fast stain, immune containment and treatment adherence caution"),
    "diabetes": ("pancreas beta cells, insulin receptor, glucose uptake, liver/muscle/fat and HbA1c panel", "type 1 vs type 2, hyperglycemia, complications and lifestyle/medical care note"),
    "hypertension": ("arteries, cardiac output, vascular resistance, kidney RAAS and blood-pressure cuff", "BP = CO x TPR, systolic/diastolic, end-organ damage and measurement accuracy"),
    "stroke": ("ischemic clot, hemorrhage, brain territory map, FAST signs and treatment-time window concept", "blood-flow blockage, penumbra, CT/MRI diagnosis concept and emergency disclaimer"),
    "cancer": ("normal-to-tumor progression, oncogenes/tumor suppressors, angiogenesis, invasion and metastasis", "hallmarks of cancer, staging concept, biomarkers and therapy classes"),
    "breast": ("breast ducts/lobules, tumor cross-section, lymph nodes, ER/PR/HER2 biomarker panel", "screening concept, metastasis route, receptor status and treatment class map"),
    "lung_cancer": ("airway epithelium, tumor mass, smoking/radon risk panel, histology and metastasis", "NSCLC/SCLC distinction, EGFR/ALK/PD-L1 biomarker examples and symptoms caution"),
    "colorectal": ("colon polyp-to-cancer sequence, adenoma, colonoscopy, APC/KRAS/p53 pathway and staging", "screening, stool tests, invasion through wall layers and metastasis to liver"),
    "prostate": ("prostate zones, urethra relation, PSA concept, Gleason histology and androgen signaling", "screening caveats, local invasion and treatment classes"),
    "cervical": ("cervix transformation zone, HPV infection, Pap smear, CIN stages and vaccine prevention", "HPV oncogenes E6/E7, screening timeline concept and prevention"),
    "leukemia": ("bone marrow, blood smear, blast cells, myeloid/lymphoid lineage tree and CBC panel", "acute vs chronic, anemia/infection/bleeding mechanism and treatment class overview"),
    "lymphoma": ("lymph node architecture, B/T cells, Reed-Sternberg cue and PET/biopsy concept", "Hodgkin vs non-Hodgkin, lymphatic spread and immune-cell origin"),
    "melanoma": ("skin layers, melanocytes, ABCDE rule, UV DNA damage and metastasis routes", "BRAF/immune checkpoint marker examples, prevention and biopsy concept"),
    "enzyme": ("active site, substrate, enzyme-substrate complex, activation-energy graph and inhibitor comparison", "Michaelis-Menten curve, competitive/noncompetitive inhibition, pH/temp optimum"),
    "atp": ("ATP molecule, phosphate bonds, ATP/ADP cycle and cellular work panels", "energy coupling, phosphorylation, mitochondria/chloroplast sources"),
    "protein": ("amino acid chain, primary-secondary-tertiary-quaternary levels, folding funnel and chaperone", "peptide bond, hydrophobic core, denaturation and misfolding disease cue"),
    "lipid": ("triglyceride, phospholipid, cholesterol, membrane bilayer and lipoprotein transport", "saturated/unsaturated comparison, amphipathic structure and energy storage"),
    "carbohydrate": ("glucose ring, starch/glycogen/cellulose comparison and glycosidic linkages", "monosaccharide/disaccharide/polysaccharide, energy and structural roles"),
    "flower": ("flower anatomy, pollen, ovule, stigma/style/ovary, pollinator interaction and fertilization", "double fertilization, seed/fruit formation, cross vs self pollination"),
    "root": ("root tip zones, root hairs, xylem/phloem, mycorrhizae and mineral uptake", "water potential, active transport, Casparian strip and nutrient deficiency"),
    "leaf": ("leaf cross-section, stomata, guard cells, chloroplasts, vascular bundle and gas exchange", "transpiration, CO2/O2 flow, stomatal regulation and photosynthesis rate"),
    "xylem": ("xylem vessels, phloem sieve tubes, companion cells and source-sink transport", "cohesion-tension, transpiration pull, pressure-flow hypothesis"),
    "ecology": ("food web, trophic pyramid, abiotic factors and population graph", "energy transfer, carrying capacity, limiting factors and disturbance"),
    "carbon": ("carbon reservoirs, photosynthesis, respiration, fossil fuels, ocean exchange and climate feedback", "flux arrows, greenhouse effect, sequestration and human emissions"),
    "nitrogen": ("nitrogen fixation, nitrification, assimilation, ammonification and denitrification", "bacteria roles, fertilizer runoff and ecosystem impact"),
    "evolution": ("selection pressure, variation, inheritance, allele frequency graph and fossil/trait evidence", "natural selection steps, fitness, adaptation and misconception ladder"),
    "phylogen": ("cladogram, nodes, common ancestor, outgroup and shared derived characters", "trait matrix, monophyletic clades and branch-length caveats"),
    "drug": ("target protein, binding pocket, assay, lead optimization, ADME and clinical phases", "potency, selectivity, toxicity, dose-response and regulatory checkpoints"),
    "pharmacokinetics": ("absorption, distribution, metabolism, excretion organs and concentration-time curve", "Cmax, Tmax, half-life, AUC, bioavailability and clearance"),
    "pharmacodynamics": ("receptor binding, agonist/antagonist, dose-response curve and therapeutic window", "EC50, Emax, potency vs efficacy, side-effect mechanisms"),
}


def clean_title(path: Path) -> str:
    name = path.stem
    name = re.sub(r"^\d+_+", "", name)
    name = name.replace("_and_", " and ").replace("_", " ")
    return name.strip()


def biology_matches(topic: str) -> list[tuple[str, str]]:
    key = topic.lower().replace(" ", "_")
    hits = []
    for token, data in BIO_KEYWORDS.items():
        if token in key:
            hits.append(data)
    return hits[:4]


def build_maths_block(data: tuple[str, str, str, str]) -> str:
    title, visuals, formulas, examples = data
    return f"""

# TOPIC-SPECIFIC INFOGRAPHIC CONTENT UPGRADE
This must be a dedicated mathematics infographic for **{title}**, not a generic classroom poster. Every diagram, equation, graph, table and example must teach this exact topic.

## Mandatory central visual assets
Build the central composition from: {visuals}. Use exact geometry, aligned grids, correct notation, readable labels and visual proof-style arrows.

## Must-show formulas, definitions and theorem panels
Include these in large clean mathematical typesetting with symbol definitions, assumptions and domain restrictions: {formulas}.

## Required worked examples
Show at least three mini examples: {examples}. Include one foundation example, one exam-style problem and one advanced/application bridge.

## Required visual reasoning panel
Add one topic-specific graph, construction, proof diagram, table, model, transformation, distribution, matrix, tree, number line, coordinate plot or 3D diagram. Label axes, units, scale marks, domains and restrictions wherever relevant.

## Misconception clinic
Include a wrong-vs-right panel showing a realistic student error for this topic and the corrected method. Make the correction visual, not just text.

## Accuracy lock
No fake formulas, no decorative equations, no unlabelled axes, no impossible geometry, no missing assumptions, no wrong theorem names, no distorted graphs and no cluttered formula wall. Every mark on the infographic must carry mathematical meaning.
""".strip()


def build_biology_block(category_data: tuple[str, str], topic: str, matches: list[tuple[str, str]]) -> str:
    category_visual, category_requirements = category_data
    matched_text = ""
    if matches:
        items = []
        for visual, requirements in matches:
            items.append(f"- Topic-specific assets: {visual}. Required mechanism/content: {requirements}.")
        matched_text = "\n".join(items)
    else:
        matched_text = f"- Topic-specific assets must be selected directly from **{topic}**: exact structures, pathway steps, molecules, tissues, organisms, disease markers, instruments or graphs named in the topic title."
    return f"""

# TOPIC-SPECIFIC INFOGRAPHIC CONTENT UPGRADE
This must be a dedicated biology infographic for **{topic}**, not a generic biology poster. Every structure, cell, organ, pathway, organism, molecule, disease marker, graph and label must directly teach this exact topic.

## Mandatory central visual assets
Create the central composition as {category_visual}.
{matched_text}

## Must-show biological mechanism or structure map
Include a labelled mechanism panel with exact sequence arrows: stimulus/source -> structure or molecule -> process -> outcome -> regulation/feedback -> clinical, ecological, laboratory or evolutionary relevance. Use real biological names, not placeholders.

## Required evidence and data panel
Add one topic-appropriate evidence panel: microscopy/histology view, anatomical cross-section, pathway diagram, Punnett square, phylogenetic tree, population graph, dose-response curve, gel/blot/ELISA readout, life-cycle timeline, hormone graph, biomarker table or diagnostic workflow.

## Required accuracy checklist
{category_requirements}. Include scale bars where microscopic, direction arrows for flow/transport/signaling, correct compartment names, normal-vs-abnormal comparison where relevant and clear assumptions/limitations.

## Misconception clinic
Add a wrong-vs-right panel for this exact topic: one common student misconception, one corrected visual explanation and one exam-ready memory cue.

## Print-ready image asset direction
Use premium scientific illustration: crisp labels, clean leader lines, realistic but educational colors, no random stock biology imagery, no fake organelles, no impossible anatomy, no unsupported medical claims, no unreadable tiny labels and no decorative molecules that do not connect to the concept.
""".strip()


def enhance_file(path: Path, block: str) -> bool:
    text = path.read_text(encoding="utf-8")
    if "# TOPIC-SPECIFIC INFOGRAPHIC CONTENT UPGRADE" in text:
        return False
    marker = "# FINAL RENDERING REQUIREMENTS"
    if marker in text:
        text = text.replace(marker, block + "\n\n" + marker, 1)
    else:
        text = text.rstrip() + "\n\n" + block + "\n"
    path.write_text(text, encoding="utf-8")
    return True


def enhance_maths() -> tuple[int, int, list[str]]:
    base = ROOT / "Maths"
    touched = 0
    missing = []
    for folder in sorted(p for p in base.iterdir() if p.is_dir()):
        data = MATHS.get(folder.name)
        if not data:
            missing.append(folder.name)
            continue
        block = build_maths_block(data)
        for path in folder.glob("*.txt"):
            touched += enhance_file(path, block)
    return touched, sum(1 for _ in base.rglob("*.txt")), missing


def enhance_biology() -> tuple[int, int, int, list[str]]:
    base = ROOT / "Biology"
    touched = 0
    matched_files = 0
    missing_categories = []
    for folder in sorted(p for p in base.iterdir() if p.is_dir()):
        category_data = BIO_CATEGORY.get(folder.name)
        if not category_data:
            missing_categories.append(folder.name)
            continue
        for path in folder.glob("*.txt"):
            topic = clean_title(path)
            matches = biology_matches(topic)
            if matches:
                matched_files += 1
            block = build_biology_block(category_data, topic, matches)
            touched += enhance_file(path, block)
    return touched, sum(1 for _ in base.rglob("*.txt")), matched_files, missing_categories


def main():
    m_touched, m_files, m_missing = enhance_maths()
    b_touched, b_files, b_matched, b_missing = enhance_biology()
    print(f"Maths: enhanced={m_touched}, total_files={m_files}, missing_categories={len(m_missing)}")
    if m_missing:
        print("  " + "; ".join(m_missing))
    print(f"Biology: enhanced={b_touched}, total_files={b_files}, keyword_specific_files={b_matched}, missing_categories={len(b_missing)}")
    if b_missing:
        print("  " + "; ".join(b_missing))


if __name__ == "__main__":
    main()
