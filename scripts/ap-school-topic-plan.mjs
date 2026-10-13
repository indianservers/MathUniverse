// Topic-level authoring plan transcribed and decomposed from the official AP books.
// A mapped catalog title is a review candidate, never a completeness certificate.
export const sources = [
  ['AP8-S1-2026',8,1,'2026-2027','8-range','2026-2027T081700226091910274696PKA','Current AP portal edition'],
  ['AP9-S1-2026',9,1,'2026-2027','9-sem1-current','2026-2027T09170032609191130579M92U','Current AP portal edition'],
  ['AP10-S1-2026',10,1,'2026-2027','10-sem1-current','2026-2027T10170062609191211816H6AH','Current AP portal edition'],
  ['AP10-S2-2026',10,2,'2026-2027','10-sem2-current','2026-2027T10170142609281458795GFNX','Current AP portal edition'],
  ['AP8-S2-2025',8,2,'2025-2026','8-sem2-prior','2025-2026T08170102510301627663WSUW','Prior edition; current Semester 2 unconfirmed'],
  ['AP9-S2-2025',9,2,'2025-2026','9-sem2-prior','2025-2026T091701025110414558726HDK','Prior edition; current Semester 2 unconfirmed'],
].map(([id,grade,semester,academicYear,file,docId,verification])=>({id,grade,semester,academicYear,file,docId,verification,url:`https://cse.ap.gov.in/loadsupdocumentuploadbyid?req_doc_id=${docId}`}));

export const chapters = [];
function chapter(sourceId, number, name, spec) {
  chapters.push({sourceId,number,name,topics:spec.trim().split('\n').map(line=>{
    const [topicName,pdfPage,section,existingTitle=''] = line.trim().split('|');
    return {topicName,pdfPage:Number(pdfPage),section,existingTitle};
  })});
}
chapter('AP8-S1-2026',1,'A Square and a Cube',`
Square numbers and geometric arrays|70|1.1|
Perfect-square digit and factor patterns|72|1.1.1|
Consecutive squares and sums of odd numbers|74|1.1.2|
Squares and triangular numbers|78|1.1.3|
Meaning of a square root|80|1.1.4|Powers and Roots
Square roots by prime factorisation|82|1.1.4|
Estimating square roots between integers|84|1.1.5|
Smallest multiplier or divisor to make a square|84|1.1.5|
Cubic numbers and perfect cubes|88|1.2|
Taxicab numbers and Ramanujan's 1729|90|1.2.1|
Cubes as sums of consecutive odd numbers|92|1.2.2|
Cube roots by prime factorisation|92|1.2.3|
Successive differences of square and cube sequences|94|1.2.4|
History of square and cube computation|96|1.3|
`);
chapter('AP8-S1-2026',2,'Power Play',`
Repeated doubling and exponential growth|102|2.0|
Base, exponent and exponential notation|108|2.1|Indices
Multiplying and dividing powers with a common base|110|2.1|
Power of a power and powers of products|114|2.1|
Zero exponents and nonzero-base restrictions|116|2.1|
Negative powers and reciprocals|120|2.2|
Powers of ten and place value|126|2.3|
Scientific notation for large and small quantities|128|2.3|
Comparing quantities in scientific notation|130|2.3|
Order-of-magnitude estimates and Fermi questions|132|2.4|
Indian large-number naming and history|154|2.5|
`);
chapter('AP8-S1-2026',3,'A Story of Numbers',`
Need for numeral systems and counting symbols|164|3.1|
Indian numerals and zero as a placeholder|170|3.1|
Roman numerals and additive/subtractive rules|180|3.2|
Limits of non-positional numeral systems|184|3.2|
Egyptian numerals and additive representation|186|3.3|
Place value and the base of a number system|188|3.3|
Historical base systems and representations|192|3.3|
Mesopotamian numerals and base-60 place value|194|3.3|
Mayan numerals and their positional structure|204|3.3|
Chinese rod numerals and positional representation|208|3.3|
Comparing numeral systems: symbols, base and zero|212|3.3|
Reading and converting representations across bases|196|3.3|
History and contributions to positional notation|204|3.3|
`);
chapter('AP8-S1-2026',4,'Quadrilaterals',`
Definition and classification of quadrilaterals|218|4.0|
Rectangles: sides, angles and diagonals|220|4.1|
Equal diagonals of a rectangle: congruence proof|222|4.1|
Diagonals bisect each other: rectangle proof|224|4.1|
Constructing rectangles from diagonal conditions|228|4.1|
Squares and their diagonal/angle properties|238|4.1|
Quadrilateral class inclusion with Venn diagrams|240|4.1|
Interior-angle sum of a quadrilateral|246|4.2|
Parallelogram opposite sides and angles|248|4.3|Parallelogram Opposite Sides
Parallelogram diagonals and converse conditions|254|4.3|Parallelogram Diagonals
Rhombus side and diagonal properties|256|4.4|
Squares as rectangles and rhombi|260|4.4|
Quadrilateral constructions and investigations|262|4.5|
Kite properties and diagonals|266|4.6|
Trapezium properties and classification conventions|268|4.6|
Reasoning from sufficient and necessary properties|270|4.6|
`);
chapter('AP8-S1-2026',5,'Number Play',`
Multiples and general algebraic number forms|284|5.1|
Parity of sums and products|286|5.1|
Remainders and numbers of the form kn+r|290|5.1|
Visual and algebraic proofs of number patterns|294|5.1|
Always, sometimes and never: counterexamples|296|5.1|
Divisibility by 2, 5 and 10|306|5.2|
Divisibility by 4 and 8|308|5.2|
Divisibility by 3 and 9 using digit sums|310|5.2|
Divisibility by 11 and alternating digit sums|314|5.2|
Justifying divisibility tests using place value|316|5.2|
Cryptarithms with addition and carrying|322|5.3|
Cryptarithms with multiplication and constraints|326|5.3|
`);
chapter('AP8-S1-2026',6,'We Distribute, Yet Things Multiply',`
Distributive law using area and arithmetic|334|6.1|
Changes in products when factors increase|336|6.1|
Multiplying signed expressions distributively|342|6.1|
Fast multiplication using distributivity|350|6.1.1|
Square of a sum: geometric derivation|354|6.2|
Square of a difference: geometric derivation|360|6.2|
Product of sum and difference|362|6.2|
Finding and correcting expansion mistakes|364|6.3|
Equivalent algebraic descriptions of a pattern|366|6.4|
Applying identities to mental calculation|370|6.4|
`);
chapter('AP8-S1-2026',7,'Proportional Reasoning-1',`
Scaling images while preserving proportions|384|7.1|
Meaning and order of a ratio|388|7.2|Ratios
Simplifying ratios using a common divisor|390|7.3|
Equivalent ratios and testing a proportion|392|7.4|
Missing-value proportion problems|394|7.4|
Unit-rate and unitary-method problems|398|7.4|
Recipes, mixtures and scale applications|402|7.4|
Interpreting non-proportional situations|410|7.4|
Dividing a quantity in a specified ratio|416|7.5|
Converting measurement units before forming ratios|422|7.6|Unit Conversion
Multi-step proportional modelling|426|7.6|
`);
chapter('AP9-S1-2026',1,'Number Systems',`
Natural, whole, integer and rational number sets|12|1.1|Rational Numbers
Irrational numbers and examples|20|1.2|Irrational Numbers
Density of rational and irrational numbers|22|1.2|
Terminating and recurring decimal expansions|26|1.3|Terminating and Non-Terminating Decimals
Converting recurring decimals to fractions|30|1.3|
Representing real numbers by successive magnification|34|1.3|Successive Magnification on the Number Line
Locating irrational roots on a number line|36|1.3|
Operations with real numbers and surds|40|1.4|Surds
Rationalisation using conjugates|44|1.4|Rationalisation of Denominators
Laws of exponents for real numbers|52|1.5|Indices
`);
chapter('AP9-S1-2026',2,'Polynomials',`
Polynomial versus non-polynomial expressions|60|2.2|
Terms, coefficients and polynomial degree|62|2.2|
Constant, linear, quadratic and cubic polynomials|64|2.2|
Evaluating a polynomial at a given value|68|2.3|
Zeros of a polynomial|68|2.3|Graphical Zeros of Polynomials
Factor theorem and factoring a polynomial|74|2.4|Factor Theorem
Factoring quadratic polynomials by splitting terms|78|2.4|Polynomial Factorisation Practice
Square and product algebraic identities|82|2.5|Identities
Cubic identities and their applications|86|2.5|Cubic Algebraic Identities
`);
chapter('AP9-S1-2026',3,'Coordinate Geometry',`
Cartesian axes, origin and coordinate conventions|102|3.2|
Abscissa, ordinate and ordered pairs|104|3.2|
Quadrants and coordinate signs|106|3.2|
Plotting points and reading their coordinates|108|3.2|
Coordinates of points on either axis|110|3.2|
Location and map applications|112|3.2|
`);
chapter('AP9-S1-2026',4,'Linear Equations in Two Variables',`
Standard form ax+by+c=0 and its restrictions|120|4.2|
Constructing equations from word situations|122|4.2|
Checking whether an ordered pair is a solution|124|4.3|
Generating multiple solutions of a linear equation|126|4.3|
Why two-variable linear equations have infinitely many solutions|126|4.3|
`);
chapter('AP9-S1-2026',5,"Introduction to Euclid's Geometry",`
Historical origins of geometry|130|5.1|
Definitions, undefined terms, axioms and postulates|134|5.2|Definitions Axioms and Postulates
Euclid's five postulates|136|5.2|Euclid's Five Postulates
Common notions and their mathematical use|138|5.2|
Distinguishing axioms from theorems|140|5.2|Axiom versus Theorem
Using axioms to justify geometric statements|142|5.2|Proof Structure and Logical Statements
`);
chapter('AP9-S1-2026',6,'Lines and Angles',`
Lines, rays, segments and collinear points|150|6.2|
Acute, right, obtuse and reflex angles|152|6.2|
Adjacent angles and linear pairs|154|6.4|Linear Pair Axiom and Converse
Vertically opposite angles and proof|156|6.4|Vertically Opposite Angles
Intersecting and parallel lines|154|6.3|
Lines parallel to the same line: theorem and application|166|6.5|
`);
chapter('AP9-S2-2025',7,'Triangles',`
Congruence and correspondence of vertices|10|7.2|
SAS congruence criterion|16|7.3|SAS Congruence
ASA congruence criterion|22|7.3|ASA Congruence
AAS congruence and its justification|28|7.3|AAS Congruence
Isosceles triangle equal-side/equal-angle theorem|32|7.4|Equal Sides and Equal Angles
Converse isosceles triangle theorem|36|7.4|
SSS congruence criterion|42|7.5|SSS Congruence
RHS congruence criterion|44|7.5|RHS Congruence
CPCT and applications of triangle congruence|46|7.5|
`);
chapter('AP9-S2-2025',8,'Quadrilaterals',`
Parallelogram diagonal divides it into congruent triangles|52|8.1|
Parallelogram opposite sides theorem and converse|54|8.1|Parallelogram Opposite Sides
Parallelogram opposite angles|56|8.1|Parallelogram Opposite Angles
Parallelogram diagonal bisection and converse|60|8.1|Parallelogram Diagonals
Conditions for a quadrilateral to be a parallelogram|62|8.1|Conditions for a Quadrilateral to Be a Parallelogram
Midpoint theorem: proof and applications|66|8.2|Midpoint Theorem
Converse of the midpoint theorem|70|8.2|Converse of Midpoint Theorem
`);
chapter('AP9-S2-2025',9,'Circles',`
Equal chords subtend equal central angles and converse|76|9.1|Equal Chords and Equal Angles
Perpendicular from centre bisects a chord and converse|80|9.2|Perpendicular from Centre to Chord
Equal chords and equal distances from the centre|82|9.3|
Angle at the centre and angle on the circumference|88|9.4|Angle Subtended by an Arc
Angles in the same segment|90|9.4|Angles in the Same Segment
Angle in a semicircle|92|9.4|Angle in a Semicircle
Cyclic quadrilateral opposite angles and converse|94|9.5|Opposite Angles of a Cyclic Quadrilateral
`);
chapter('AP9-S2-2025',10,"Heron's Formula",`
Semiperimeter and Heron's area formula|106|10.1|Semi-Perimeter Lab
Deriving Heron's formula|108|10.1|Heron's Formula Derivation
Finding area from three sides|110|10.1|
Area, cost and practical triangular-region problems|112|10.1|
`);
chapter('AP9-S2-2025',11,'Surface Areas and Volumes',`
Right circular cone: radius, height and slant height|118|11.1|
Cone curved and total surface areas|120|11.1|
Sphere and hemisphere surface areas|126|11.2|
Cone volume and comparison with a cylinder|134|11.3|
Sphere and hemisphere volumes|140|11.4|
Selecting units and solving mensuration applications|142|11.4|
`);
chapter('AP9-S2-2025',12,'Statistics',`
Bar graphs and categorical comparisons|146|12.1|Bar Graph Builder
Grouped data and class intervals|150|12.1|
Histograms with equal class widths|154|12.1|Histogram
Histograms with unequal class widths|158|12.1|
Frequency polygons and class marks|162|12.1|
Interpreting graphs and selecting a representation|168|12.1|Misleading Graph Detection
`);
chapter('AP10-S1-2026',1,'Real Numbers',`
Fundamental theorem of arithmetic and uniqueness|14|1.2|
Prime-factorisation method for HCF and LCM|16|1.2|HCF / GCD
HCF-LCM relation and application problems|18|1.2|
Proof by contradiction for irrational square roots|22|1.3|
Rational/irrational combinations and proofs|24|1.3|
`);
chapter('AP10-S1-2026',2,'Polynomials',`
Geometric meaning of zeros of linear polynomials|32|2.2|Graphical Zeros of Polynomials
Zeros of quadratic/cubic polynomials from graphs|36|2.2|
Sum and product of quadratic zeros|46|2.3|Relationship Between Zeros and Coefficients
Forming a quadratic polynomial from its zeros|48|2.3|
Checking zero-coefficient relations in examples|50|2.3|
`);
chapter('AP10-S1-2026',3,'Pair of Linear Equations in Two Variables',`
Modelling situations with two linear equations|58|3.1|
Graphical solution and intersection|60|3.2|Simultaneous Linear Equations
Intersecting, parallel and coincident equation pairs|64|3.2|
Coefficient-ratio tests for consistency|66|3.2|
Substitution method|70|3.3.1|
Elimination method|78|3.3.2|
Word problems and interpretation of solutions|82|3.3.2|
`);
chapter('AP10-S1-2026',4,'Quadratic Equations',`
Recognising and forming quadratic equations|88|4.2|Quadratic Equations
Solving quadratics by factorisation|94|4.3|
Quadratic formula and discriminant|98|4.4|
Real, repeated and non-real root cases|100|4.4|
Modelling problems and rejecting inadmissible roots|102|4.4|
`);
chapter('AP10-S1-2026',5,'Arithmetic Progressions',`
Recognising an AP and its common difference|112|5.2|Arithmetic Sequences
Nth term of an arithmetic progression|122|5.3|
Finding missing terms and term positions|126|5.3|
Sum of the first n terms|136|5.4|Arithmetic Series
Applications of arithmetic progressions|142|5.4|
`);
chapter('AP10-S1-2026',6,'Triangles',`
Similarity of figures and scale factor|158|6.2|
Basic proportionality theorem with proof|168|6.3|
Converse of basic proportionality theorem|172|6.3|
AA/AAA similarity criterion|180|6.4|
SSS similarity criterion|184|6.4|
SAS similarity criterion|188|6.4|
Indirect measurement using similar triangles|194|6.4|
`);
chapter('AP10-S1-2026',7,'Coordinate Geometry',`
Derivation and use of the distance formula|210|7.2|Distance Formula
Checking collinearity and classifying figures by distances|216|7.2|
Internal section formula: derivation and applications|222|7.3|Internal Section Formula
Midpoint formula as a section-formula case|226|7.3|Midpoint Formula
Coordinates and geometric ratio problems|230|7.3|
`);
chapter('AP10-S2-2026',8,'Introduction to Trigonometry',`
Opposite, adjacent and hypotenuse conventions|14|8.2|
Six trigonometric ratios and reciprocal relations|16|8.2|
Trigonometric ratios depend on angle, not triangle size|20|8.2|
Exact ratios at 30, 45 and 60 degrees|28|8.3|
Ratios at 0 and 90 degrees and undefined cases|34|8.3|
Trigonometric identity from Pythagoras|42|8.4|
Derived identities and simplifying expressions|44|8.4|Trig Identities
`);
chapter('AP10-S2-2026',9,'Some Applications of Trigonometry',`
Line of sight and angle of elevation|52|9.1|Angle of Elevation
Angle of depression and horizontal reference|54|9.1|Angle of Depression
Height problems with observer's eye height|60|9.1|
Two-observer height and distance problems|64|9.1|Two-Observer Height Problems
Multi-step surveying and contextual interpretation|68|9.1|
`);
chapter('AP10-S2-2026',10,'Circles',`
Tangent, secant and point of contact|76|10.2|
Tangent perpendicular to radius: proof|78|10.2|Tangent Perpendicular to Radius
Number of tangents from interior/on/exterior points|80|10.3|
Equal tangent lengths from an external point: proof|84|10.3|Tangent Lengths from an External Point
Tangent length and angle application problems|86|10.3|
`);
chapter('AP10-S2-2026',11,'Areas Related to Circles',`
Arc length and sector area|94|11.1|
Area of a segment using sector minus triangle|96|11.1|
Major and minor sectors/segments|98|11.1|
Areas of combined circular regions|100|11.1|
Area, perimeter and cost applications|102|11.1|
`);
chapter('AP10-S2-2026',12,'Surface Areas and Volumes',`
Recognising combinations of solids|108|12.1|Combined Solids
Exposed versus joined surfaces of composite solids|110|12.2|
Surface area of combined cones, cylinders and hemispheres|114|12.2|
Volume of a combination of solids|120|12.3|
Capacity and contextual modelling with units|124|12.3|
`);
chapter('AP10-S2-2026',13,'Statistics',`
Grouped mean by direct method|128|13.2|Grouped Mean by Direct Method
Grouped mean by assumed mean|136|13.2|Grouped Mean by Assumed Mean
Grouped mean by step deviation|138|13.2|Grouped Mean by Step Deviation
Grouped-data approximation and class marks|132|13.2|
Modal class and grouped-mode formula|152|13.3|
Cumulative frequency and the median class|162|13.4|Less-Than Cumulative Frequency
Grouped-median formula and interpolation|166|13.4|
Interpreting and comparing mean, median and mode|174|13.4|
`);
chapter('AP10-S2-2026',14,'Probability',`
Equally likely outcomes and theoretical probability|190|14.1|
Listing sample spaces systematically|192|14.1|Sample Space
Impossible/certain events and probability bounds|194|14.1|
Complementary events and their probabilities|198|14.1|
Coin, dice and card probability problems|200|14.1|
Comparing experimental and theoretical probability|204|14.1|
`);
chapter('AP8-S2-2025',8,'Algebraic Expressions and Identities',`
Adding and subtracting algebraic expressions|10|8.1|Like Terms
Multiplying two or more monomials|16|8.3|
Multiplying a monomial by a binomial/trinomial|20|8.4|
Multiplying two binomials|24|8.5.1|
Multiplying a binomial by a trinomial|26|8.5.2|
`);
chapter('AP8-S2-2025',9,'Mensuration',`
Area of polygons by decomposition|30|9.2|
Area of trapezia and general quadrilaterals|32|9.2|
Nets and recognition of solid shapes|36|9.3|
Cuboid surface area|40|9.4.1|
Cube surface area|44|9.4.2|
Cylinder curved and total surface area|46|9.4.3|
Cuboid and cube volume|54|9.5.1–9.5.2|
Cylinder volume|58|9.5.3|
Volume and capacity conversions|60|9.6|
`);
chapter('AP8-S2-2025',10,'Exponents and Powers',`
Negative-exponent meaning and evaluation|66|10.2|
Applying laws of exponents|70|10.3|Indices
Scientific notation for small numbers|76|10.4|
Comparing large and small quantities|78|10.4.1|
`);
chapter('AP8-S2-2025',11,'Direct and Inverse Proportions',`
Direct proportion and constant ratio|82|11.2|Direct Proportion
Direct-proportion contextual problems|88|11.2|
Inverse proportion and constant product|98|11.3|Inverse Proportion
Work, time and sharing inverse-proportion problems|104|11.3|
Distinguishing direct, inverse and non-proportional change|108|11.3|
`);
chapter('AP8-S2-2025',12,'Factorisation',`
Factors of numbers and algebraic expressions|114|12.1|
Factorisation using common factors|116|12.2.1|Factorisation
Factorisation by regrouping|118|12.2.2|
Factorisation using identities|122|12.2.3|
Factors of the form (x+a)(x+b)|124|12.2.4|
Dividing a monomial by a monomial|128|12.3.1|
Dividing a polynomial by a monomial|130|12.3.2|
Dividing polynomials using factorisation|132|12.4|
`);
chapter('AP8-S2-2025',13,'Introduction to Graphs',`
Reading and constructing line graphs|138|13.1.1|
Coordinates and plotting points on a grid|144|13.1|
Graphs for distance-time and quantity-cost applications|152|13.2|
Interpreting rates and relationships from graphs|156|13.2|
`);

// Supplemental learning requirements from front matter and appendices.
export const supplements = [
  ['AP8-S1-2026',0,'Readiness and learning competencies',10,'Readiness: factors, primes, squares and cubes'],
  ['AP8-S1-2026',0,'Readiness and learning competencies',14,'Readiness: powers and scientific notation'],
  ['AP8-S1-2026',0,'Readiness and learning competencies',18,'Readiness: number representations and place value'],
  ['AP8-S1-2026',0,'Readiness and learning competencies',26,'Readiness: quadrilateral vocabulary and constructions'],
  ['AP8-S1-2026',0,'Readiness and learning competencies',34,'Readiness: divisibility, parity and number puzzles'],
  ['AP8-S1-2026',0,'Readiness and learning competencies',42,'Readiness: distributivity and algebraic expressions'],
  ['AP8-S1-2026',0,'Readiness and learning competencies',50,'Readiness: ratios and proportion'],
  ['AP8-S1-2026',15,'Cross-curricular mathematics',7,'Computational thinking, systematic listing and algorithms'],
  ['AP8-S1-2026',15,'Cross-curricular mathematics',8,'Mathematical history, communication and creative problem solving'],
  ['AP8-S1-2026',15,'Cross-curricular mathematics',466,'Mathematical connections and AI activities'],
  ['AP8-S1-2026',15,'Cross-curricular mathematics',470,'Square-number patterns and the locker puzzle'],
  ['AP8-S1-2026',15,'Cross-curricular mathematics',470,'Exponential growth in computational processes'],
  ['AP8-S1-2026',15,'Cross-curricular mathematics',472,'Positional notation and representing digital data'],
  ['AP8-S1-2026',15,'Cross-curricular mathematics',472,'Quadrilateral features and shape classification'],
  ['AP8-S1-2026',15,'Cross-curricular mathematics',474,'Parity and logical rules in rule-based systems'],
  ['AP8-S1-2026',15,'Cross-curricular mathematics',474,'Algebraic simplification and systematic computation'],
  ['AP8-S1-2026',15,'Cross-curricular mathematics',476,'Ratios, balanced datasets and fair comparison'],
  ['AP8-S1-2026',15,'Cross-curricular mathematics',478,'Checking mathematical AI outputs and responsible use'],
  ['AP9-S1-2026',15,'Proofs in Mathematics',176,'Statements, conjectures, counterexamples and mathematical proofs'],
  ['AP9-S1-2026',15,'Proofs in Mathematics',186,'Logical reasoning and proof-writing practice'],
  ['AP10-S1-2026',15,'Proofs in Mathematics',236,'Deductive reasoning and proof structure'],
  ['AP10-S1-2026',15,'Proofs in Mathematics',246,'Direct proof and proof by contradiction'],
  ['AP10-S2-2026',16,'Mathematical Modelling',222,'Stages of mathematical modelling and model assumptions'],
  ['AP10-S2-2026',16,'Mathematical Modelling',230,'Formulation, solution, interpretation and validation of models'],
];
