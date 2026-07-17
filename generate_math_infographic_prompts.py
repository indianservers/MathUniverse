from pathlib import Path

BASE = Path(r"C:\Indian Servers\Interactive Biology App\Image text Prompts\Maths")

QUALITY = """# OUTPUT QUALITY
* Ultra-HD 8K resolution
* Exact canvas size: 7680 x 4320 px
* Landscape orientation
* Premium, non-generic mathematical infographic
* Extremely sharp diagrams, equations, labels, axes and legends
* Print-quality educational graphics
* Professional school, college, university and science-museum quality
* No blurry text
* No incorrect formulas
* No distorted symbols
* No watermarks
* No logos
* No stock-image appearance
* No unnecessary visual clutter"""

ASSET_BLOCK = """# PREMIUM NON-GENERIC IMAGE ASSET REQUIREMENTS
* Use topic-specific mathematical assets: accurate graphs, geometric constructions, number lines, coordinate planes, vector fields, matrices, probability trees, data plots, 3D surfaces, proof diagrams or real-world mathematical models.
* Every visual element must teach a specific definition, theorem, method, pattern, relationship, proof step or application.
* Use custom mathematical illustration assets rather than generic school-themed stock visuals.
* Make every label anchored to a visible object: point, line, angle, axis, curve, surface, matrix entry, set, transformation, distribution, formula term or algorithm step.
* Include scale marks, gridlines, axis labels, units, domains, assumptions, legends and notation keys wherever relevant.
* Show multiple representations when useful: symbolic, graphical, numerical, verbal and applied.
* Maintain consistent colour coding across the whole infographic.
* Keep equations large, clean and typeset-style, with no overlapping text.

# MATHEMATICAL ACCURACY AND LABEL QA
* Verify every formula, theorem statement, graph shape, angle relation, transformation, probability, derivative, integral, matrix operation and notation mark before final rendering.
* Do not invent mathematical rules.
* Do not skip required assumptions such as nonzero denominators, independence, domain restrictions, continuity, differentiability, invertibility or convergence.
* Use exact notation where possible.
* Use approximate decimal values only when clearly marked.
* Keep arrows mathematically meaningful; do not use decorative arrows that imply false logic.
* Avoid misleading 3D perspective that changes mathematical meaning.
* Check spelling of all mathematical terms.

# NEGATIVE PROMPT
No generic classroom clip art, no random floating numbers, no fake formulas, no incorrect graphs, no distorted coordinate axes, no impossible geometry, no unreadable tiny equations, no decorative symbols without meaning, no missing legends, no wrong theorem names, no cluttered formula walls, no stock-photo appearance, no watermarks, no logos."""


def prompt(title, subtitle, level, focus, central, panels, process, applications, accuracy):
    return f"""Act as a senior mathematics infographic designer, visual pedagogy expert, mathematical illustrator and scientific-visualization specialist.

Create exactly ONE premium, highly detailed educational infographic about {title}.

# INFOGRAPHIC TITLE
{title}

# MAIN SUBTITLE
{subtitle}

# TARGET LEVEL
{level}

{QUALITY}

# VISUAL STYLE
Use a premium modern mathematics-infographic style combining clean vector diagrams, precise coordinate grids, elegant typeset equations, colour-coded steps, annotated examples, visual proofs, real-world modelling panels, subtle depth where useful and strong visual hierarchy.

# CORE FOCUS
{focus}

# CENTRAL HERO VISUAL
Show a large, mathematically accurate central visual:
{central}

# REQUIRED EDUCATIONAL PANELS
Include:
{panels}

# STEP-BY-STEP EXPLANATION OR PROOF FLOW
Show this sequence clearly:
{process}

# APPLICATIONS OR CONNECTIONS
Include:
{applications}

# COMPOSITION
Top: title, subtitle and level label.
Centre: large hero diagram or model.
Upper left: key definitions and notation.
Upper right: formulas, theorem statement or rule summary.
Lower left: worked example or visual proof.
Lower right: application, misconception or advanced connection.
Bottom strip: key facts, common mistakes, notation legend and quick review.

# TYPOGRAPHY
* Bold modern sans-serif headings
* Clear mathematical typesetting
* Large readable equations
* Consistent notation
* Correct superscripts, subscripts, radicals, fractions, Greek letters and set symbols
* No text overlapping graphs or diagrams

# MATHEMATICAL ACCURACY REQUIREMENTS
{accuracy}

{ASSET_BLOCK}

# FINAL RENDERING REQUIREMENTS
Produce one visually rich, mathematically accurate and professionally composed 8K infographic suitable for classroom teaching, self-study, digital learning, competitive exam preparation, college courses and large-format printing.
"""


CONCEPTS = [
    ("01_Number_Systems", "NUMBER SYSTEMS", "Natural numbers, integers, rational numbers, irrational numbers, real numbers and complex numbers"),
    ("02_Fractions_Decimals_Percentages", "FRACTIONS, DECIMALS AND PERCENTAGES", "Equivalent forms, conversion, comparison, operations and real-life interpretation"),
    ("03_Ratios_Proportions_and_Unit_Rates", "RATIOS, PROPORTIONS AND UNIT RATES", "Comparing quantities, direct proportion, inverse proportion, scale and rates"),
    ("04_Exponents_Radicals_and_Logarithms", "EXPONENTS, RADICALS AND LOGARITHMS", "Powers, roots, laws of exponents, logarithm meaning and inverse relationships"),
    ("05_Algebraic_Expressions_and_Identities", "ALGEBRAIC EXPRESSIONS AND IDENTITIES", "Variables, terms, simplification, factorisation and standard identities"),
    ("06_Linear_Equations_and_Inequalities", "LINEAR EQUATIONS AND INEQUALITIES", "Solving one-variable and two-variable linear relations, graphs and solution sets"),
    ("07_Coordinate_Geometry_and_Slope", "COORDINATE GEOMETRY AND SLOPE", "Coordinate plane, distance, midpoint, slope, lines and graph interpretation"),
    ("08_Euclidean_Geometry_Basics", "EUCLIDEAN GEOMETRY BASICS", "Points, lines, angles, triangles, polygons and geometric reasoning"),
    ("09_Triangles_Congruence_and_Similarity", "TRIANGLES, CONGRUENCE AND SIMILARITY", "Triangle properties, congruence rules, similarity ratios and scale factors"),
    ("10_Circles_and_Theorems", "CIRCLES AND THEOREMS", "Radius, chord, tangent, arc, sector, angle theorems and cyclic quadrilaterals"),
    ("11_Area_Surface_Area_and_Volume", "AREA, SURFACE AREA AND VOLUME", "Measurement formulas, decomposition, nets, solids and dimensional reasoning"),
    ("12_Sequences_and_Series", "SEQUENCES AND SERIES", "Arithmetic sequences, geometric sequences, sigma notation and sums"),
    ("13_Functions_and_Graphs", "FUNCTIONS AND GRAPHS", "Function notation, domain, range, transformations and graph families"),
    ("14_Quadratic_Functions_and_Equations", "QUADRATIC FUNCTIONS AND EQUATIONS", "Parabolas, roots, vertex, factorisation, completing square and quadratic formula"),
    ("15_Trigonometry", "TRIGONOMETRY", "Sine, cosine, tangent, unit circle, identities, graphs and triangle applications"),
    ("16_Analytic_Geometry_Conics", "ANALYTIC GEOMETRY AND CONICS", "Parabola, ellipse, hyperbola, circle equations, focus, directrix and eccentricity"),
    ("17_Matrices_and_Determinants", "MATRICES AND DETERMINANTS", "Matrix operations, determinants, inverse matrices, systems and transformations"),
    ("18_Vectors_and_3D_Geometry", "VECTORS AND 3D GEOMETRY", "Vector operations, dot product, cross product, lines, planes and spatial reasoning"),
    ("19_Limits_and_Continuity", "LIMITS AND CONTINUITY", "Approaching values, one-sided limits, infinite limits, continuity and asymptotes"),
    ("20_Differentiation", "DIFFERENTIATION", "Derivative meaning, rules, tangent slope, rates of change and optimization"),
    ("21_Integration", "INTEGRATION", "Antiderivatives, area under curves, definite integrals, substitution and accumulation"),
    ("22_Differential_Equations", "DIFFERENTIAL EQUATIONS", "First-order models, slope fields, separation of variables and dynamic systems"),
    ("23_Probability", "PROBABILITY", "Sample spaces, events, conditional probability, Bayes theorem and independence"),
    ("24_Statistics_and_Data_Visualization", "STATISTICS AND DATA VISUALIZATION", "Data types, distributions, mean, median, variance, graphs and interpretation"),
    ("25_Combinatorics_and_Counting", "COMBINATORICS AND COUNTING", "Permutations, combinations, binomial coefficients, pigeonhole principle and counting strategies"),
    ("26_Set_Theory_and_Logic", "SET THEORY AND LOGIC", "Sets, Venn diagrams, propositions, quantifiers, truth tables and proof logic"),
    ("27_Graph_Theory", "GRAPH THEORY", "Vertices, edges, paths, cycles, trees, networks, Euler paths and graph colouring"),
    ("28_Abstract_Algebra", "ABSTRACT ALGEBRA", "Groups, rings, fields, symmetry, modular arithmetic and algebraic structure"),
    ("29_Real_Analysis", "REAL ANALYSIS", "Sequences, convergence, epsilon-delta limits, continuity, compactness and rigorous proof"),
    ("30_Linear_Algebra_Advanced", "ADVANCED LINEAR ALGEBRA", "Vector spaces, basis, dimension, linear maps, eigenvalues, diagonalization and inner products"),
]


VARIANTS = [
    (
        "01_Concept_Map",
        "Concept Map and Foundations",
        "Class 6 to Class 10 bridge",
        "Build intuition through definitions, visual models, notation and common examples.",
        "* A clean central concept map\n* Colour-coded branches from basic definitions to examples\n* Multiple representations: diagram, table, symbolic notation and short example\n* A misconception warning panel",
        "* Definition panel\n* Notation key\n* Visual model\n* Worked mini-example\n* Common mistakes\n* Memory hooks\n* Quick practice prompt",
        "* Introduce the object or idea\n* Show its notation\n* Connect it to a visual model\n* Work one simple example\n* Point out a common mistake\n* Summarise the core rule",
        "* School mathematics\n* Competitive exam foundations\n* Everyday quantitative reasoning\n* Bridge to higher mathematics",
        "* Keep definitions age-appropriate but correct\n* Avoid advanced notation unless explained\n* Use examples with exact arithmetic\n* Show domain restrictions where relevant",
    ),
    (
        "02_Methods_and_Problem_Solving",
        "Methods, Formulas and Problem Solving",
        "Class 9 to undergraduate bridge",
        "Teach procedures, formula selection, transformations and problem-solving strategy.",
        "* A central worked problem with annotated steps\n* Side panels for formulas and when to use them\n* A flowchart for choosing a method\n* A verification/check-your-answer panel",
        "* Formula list with assumptions\n* Step-by-step worked example\n* Method comparison\n* Error traps\n* Check method\n* Exam-style shortcut where valid\n* Practice extension",
        "* Read the problem\n* Identify known and unknown quantities\n* Choose the correct formula or theorem\n* Substitute carefully\n* Simplify step by step\n* Check units, signs, domains or reasonableness",
        "* Board exams\n* JEE/NEET/CUET-style foundations where relevant\n* Engineering and science modelling\n* Financial, measurement or data applications",
        "* Do not skip algebraic steps that affect signs or domains\n* State assumptions before formulas\n* Keep units consistent\n* Verify final answer visually or numerically",
    ),
    (
        "03_Advanced_View",
        "Advanced View, Proof and Applications",
        "Senior secondary to postgraduate",
        "Connect the concept to proof, abstraction, modelling, computation or advanced mathematics.",
        "* A central theorem/proof diagram or advanced model\n* Formal notation panel\n* Data/graph/surface/network panel where relevant\n* Applications in science, engineering, AI, economics or research",
        "* Formal definition\n* Theorem or principle\n* Proof sketch\n* Advanced example\n* Computational interpretation\n* Research or modelling application\n* Limitations and assumptions",
        "* State assumptions\n* Present the formal object\n* Derive or justify the key relation\n* Interpret geometrically or computationally\n* Apply to a higher-level problem\n* Note limitations or edge cases",
        "* Calculus, linear algebra, statistics, physics, computer science, economics, machine learning, operations research or pure mathematics",
        "* Use precise notation\n* Clearly separate proof from example\n* State convergence, continuity, independence, invertibility or finiteness assumptions where needed\n* Avoid claiming a result holds beyond its hypotheses",
    ),
]


SPECIAL_DETAILS = {
    "TRIGONOMETRY": ("* Right triangle\n* Unit circle\n* Angle in radians and degrees\n* Sine, cosine and tangent curves\n* Reference angles\n* Identities panel", "* Trig ratios must match opposite, adjacent and hypotenuse correctly\n* Unit circle coordinates must be accurate\n* Distinguish degrees and radians"),
    "DIFFERENTIATION": ("* Smooth curve\n* Secant line\n* Tangent line\n* Limit of slopes\n* Derivative notation dy/dx and f'(x)\n* Optimization graph", "* Derivative is local rate of change\n* Do not confuse derivative with average slope\n* State differentiability where needed"),
    "INTEGRATION": ("* Curve with shaded area\n* Riemann rectangles\n* Antiderivative arrow\n* Definite integral bounds\n* Accumulation function\n* Fundamental theorem panel", "* Definite integral can represent signed area or accumulation\n* Antiderivative needs constant C\n* Do not ignore bounds or units"),
    "PROBABILITY": ("* Sample space\n* Event regions\n* Tree diagram\n* Venn diagram\n* Conditional probability table\n* Bayes theorem flow", "* Probabilities must lie between 0 and 1\n* Distinguish independence from mutual exclusivity\n* Conditional probability depends on given information"),
    "MATRICES AND DETERMINANTS": ("* Matrix grid\n* Row and column labels\n* Matrix multiplication diagram\n* Determinant area scaling panel\n* Inverse matrix panel\n* Linear system", "* Matrix multiplication order matters\n* Inverse exists only when determinant is nonzero for square matrix\n* Dimensions must match"),
    "ADVANCED LINEAR ALGEBRA": ("* Vector space plane\n* Basis vectors\n* Linear transformation grid\n* Eigenvector arrow\n* Eigenvalue scaling\n* Diagonalization panel", "* Eigenvectors are nonzero\n* Diagonalization needs sufficient independent eigenvectors\n* Basis and dimension require vector-space assumptions"),
}


def main():
    created = 0
    for idx, (folder_slug, title, concept_summary) in enumerate(CONCEPTS, 1):
        folder = BASE / f"{idx:02d}_{folder_slug[3:]}"
        folder.mkdir(parents=True, exist_ok=True)
        for variant_idx, (variant_slug, variant_name, level, focus, default_central, panels, process, applications, accuracy) in enumerate(VARIANTS, 1):
            central = default_central
            extra_accuracy = accuracy
            if title in SPECIAL_DETAILS:
                central, extra_accuracy = SPECIAL_DETAILS[title]
            file_path = folder / f"{variant_idx:02d}_{variant_slug}.txt"
            text = prompt(
                title=title,
                subtitle=f"{variant_name}: {concept_summary}",
                level=level,
                focus=focus,
                central=central,
                panels=panels,
                process=process,
                applications=applications,
                accuracy=extra_accuracy,
            )
            file_path.write_text(text, encoding="utf-8")
            created += 1
    print(f"Created {created} mathematics infographic prompt files in {BASE}")
    print(f"Concept folders: {len([p for p in BASE.iterdir() if p.is_dir()])}")


if __name__ == "__main__":
    main()
