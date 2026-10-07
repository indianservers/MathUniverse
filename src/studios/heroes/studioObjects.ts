export type ObjectKind = 'plot'|'fraction'|'line'|'digits'|'identity'|'tiles'|'matrix'|'vector'|'polygon'|'circle'|'spiral'|'venn'|'mapping'|'network'|'bars'|'interval'|'field'|'pendulum'|'spring'|'surface'|'wave'|'tree'|'table'|'convergents'|'sieve'|'balance'|'tangent'|'integral'|'limit';
export type StudioObject = {name:string;kind:ObjectKind;formula:string;variant?:string;data?:number[]};
const o=(name:string,kind:ObjectKind,formula:string,variant?:string,data?:number[]):StudioObject=>({name,kind,formula,variant,data});

// Every object carries its own mathematical model; these are not interchangeable decorations.
export const studioObjects:Record<string,StudioObject[]>={
 algebra:[
  o('Linear equation','balance','2x + 4 = 10','linear'),o('Quadratic roots','plot','(x − 1)(x + 1)','quadratic'),o('Factor tiles','tiles','x² + 2x + 1','square'),o('Distributive law','tiles','a(b + c) = ab + ac','distribute'),o('Completing square','tiles','x² + 2x + 1 = (x + 1)²','complete'),
  o('Cubic turning points','plot','y = x³ − x','cubic'),o('Absolute value','plot','y = |x|','absolute'),o('Linear system','plot','y = x; y = −x','system'),o('Inequality interval','interval','−1 < x ≤ 2','inequality',[-1,2]),o('Exponent ladder','bars','2ⁿ: 1, 2, 4, 8','powers',[1,2,4,8]),
  o('Arithmetic sequence','line','aₙ = 2n + 1','arithmetic',[1,3,5,7]),o('Geometric sequence','bars','aₙ = 2ⁿ','geometric',[1,2,4,8,16]),o('Binomial expansion','tree','(a + b)²','binomial'),o('Rational graph','plot','y = 1/x','reciprocal'),o('Polynomial division','identity','(x² − 1)/(x − 1) = x + 1','division')
 ],
 'number-systems':[
  o('Natural counting','line','ℕ: 1, 2, 3, …','natural',[1,2,3,4,5]),o('Signed integers','line','ℤ: …, −2, −1, 0, 1, 2','integer',[-2,-1,0,1,2]),o('Fraction partition','fraction','¾ = 0.75','quarters',[3,4]),o('Decimal places','digits','0.375 = 3/8','decimal'),o('Percent hundred grid','tiles','25/100 = 25%','percent'),
  o('Recurring decimal','digits','⅓ = 0.333…','recurring'),o('Irrational expansion','digits','√2 = 1.414213…','sqrt2'),o('Pi expansion','digits','π = 3.141592…','pi'),o('Prime sieve','sieve','2, 3, 5, 7, 11, …','prime'),o('Prime factor tree','tree','12 = 2 × 2 × 3','factors'),
  o('Equivalent fractions','fraction','½ = 2/4 = 4/8','equivalent',[4,8]),o('Absolute distance','line','|−3| = 3','distance',[-3,0,3]),o('Interval endpoints','interval','[−1, 2)','half-open',[-1,2]),o('Rational density','line','½, ⅔, ¾, ⅘, …','density',[.5,2/3,.75,.8,.833]),o('Set inclusion','venn','ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ','nested')
 ],
 calculus:[
  o('Secant to tangent','tangent','h → 0; slope → f′(a)','secant'),o('Left-hand limit','limit','x → a⁻','left'),o('Right-hand limit','limit','x → a⁺','right'),o('Continuity','plot','lim f(x) = f(a)','continuous'),o('Derivative graph','plot','x² → 2x','derivative'),
  o('Riemann refinement','integral','Σ f(xᵢ) Δx → ∫ f','riemann'),o('Signed area','integral','∫ sin x dx','signed'),o('Accumulation','integral','F(x) = ∫₀ˣ f(t) dt','accumulation'),o('Chain rule','mapping','x → x² → sin(x²)','chain'),o('Product rule','tiles','(uv)′ = u′v + uv′','product'),
  o('Optimization','tangent','f′(x) = 0','optimum'),o('Taylor approximation','plot','sin x ≈ x − x³/6','taylor'),o('Convergent series','bars','Σ 2⁻ⁿ = 1','series',[.5,.25,.125,.0625,.03125]),o('Arc length','polygon','ds² = dx² + dy²','arc'),o('Volume of revolution','surface','V = π ∫ r² dx','revolution')
 ],
 'differential-equations':[
  o('Exponential growth','plot','y′ = y','exp'),o('Exponential decay','plot','y′ = −y','decay'),o('Logistic capacity','plot','P′ = P(1 − P)','logistic'),o('Initial condition','plot','y(0) = 1','initial'),o('Direction field','field','y′ = x − y','slope'),
  o('Euler steps','polygon','yₙ₊₁ = yₙ + h fₙ','euler'),o('Harmonic oscillator','wave','y″ + y = 0','harmonic'),o('Damped oscillator','wave','y″ + 0.4y′ + y = 0','damped'),o('Forced resonance','wave','y″ + y = sin t','forced'),o('Pendulum model','pendulum','θ″ + sin θ = 0','pendulum'),
  o('Spring mass','spring','mx″ + kx = 0','spring'),o('Phase orbit','circle','x′ = y; y′ = −x','phase'),o('Stable equilibrium','field','x′ = −x; y′ = −y','sink'),o('Separation','identity','dy/y = dt','separate'),o('Integrating factor','identity','μ(t) = e^(∫p dt)','factor')
 ],
 'complex-numbers':[
  o('Complex addition','vector','(a + bi) + (c + di)','addition'),o('Conjugate mirror','vector','z̄ = a − bi','conjugate'),o('Complex modulus','circle','|z| = √(a² + b²)','modulus'),o('Argument sweep','circle','arg z = θ','argument'),o('Multiply by i','vector','iz: rotation by π/2','quarter'),
  o('Polar conversion','mapping','a + bi ↔ reⁱθ','polar'),o('Roots of unity','polygon','z⁵ = 1','roots',[5]),o('De Moivre','circle','(eⁱθ)³ = e³ⁱθ','demoivre'),o('Complex scaling','circle','z → 2z','scale'),o('Complex reciprocal','vector','1/z = z̄ / |z|²','inverse'),
  o('Exponential spiral','spiral','z = e^((0.1+i)t)','exponential'),o('Complex square','mapping','z → z²','square'),o('Unit-circle phase','circle','eⁱθ = cos θ + i sin θ','euler'),o('Imaginary powers','digits','i, −1, −i, 1','powers-i'),o('Möbius map','mapping','w = (z − 1)/(z + 1)','mobius')
 ],
 structures:[
  o('Addition in ℤ₄','table','a + b (mod 4)','mod4'),o('Modular clock','circle','ℤ₆: a ↦ a + 1','clock',[6]),o('Permutation cycle','network','σ = (1 2 3)','cycle',[3]),o('Triangle rotations','polygon','D₃: rotations','rotation',[3]),o('Reflection symmetry','polygon','D₃: reflections','reflection',[3]),
  o('Identity element','identity','a · e = a','identity'),o('Inverse pairing','mapping','a · a⁻¹ = e','inverse'),o('Associativity','tree','(ab)c = a(bc)','association'),o('Subgroup lattice','network','{e} ⊂ H ⊂ G','lattice'),o('Coset partition','venn','G = ⋃ aH','partition'),
  o('Field arithmetic','table','a × b (mod 5)','mod5'),o('Ring distributivity','tiles','a(b + c) = ab + ac','distribute'),o('Homomorphism','mapping','φ(ab) = φ(a)φ(b)','homomorphism'),o('Kernel fibers','mapping','ker φ = {a : φ(a)=e}','kernel'),o('Cayley graph','network','ℤ₄ generators ±1','cayley',[4])
 ],
 geometry:[
  o('Perpendicular bisector','polygon','PA = PB','bisector'),o('Tangent-radius angle','circle','OP ⟂ tangent','tangent'),o('Inscribed angle','circle','∠APB = ½∠AOB','inscribed'),o('Chord midpoint','circle','OM ⟂ AB','chord'),o('Triangle angle sum','polygon','α + β + γ = π','triangle',[3]),
  o('Pythagorean squares','tiles','a² + b² = c²','pythagoras'),o('Similar triangles','polygon','a/A = b/B = c/C','similar',[3]),o('Regular pentagon','polygon','Interior angle = 108°','regular',[5]),o('Coordinate reflection','vector','(x,y) → (−x,y)','reflection'),o('Rotation construction','polygon','Rθ preserves lengths','rotation',[4]),
  o('Dilation','polygon','(x,y) → k(x,y)','dilate',[4]),o('Parallel planes','surface','Planes never intersect','planes'),o('Torus cross-section','surface','(R + r cos v)','torus'),o('Sphere meridians','surface','x² + y² + z² = r²','sphere'),o('Euler polyhedron','network','V − E + F = 2','cube')
 ],
 'linear-algebra':[
  o('Vector addition','vector','u + v','addition'),o('Scalar multiple','vector','λv','scale'),o('Dot projection','vector','projᵤ v','projection'),o('Cross product','vector','u × v ⟂ u,v','cross'),o('Basis vectors','vector','e₁, e₂','basis'),
  o('Matrix entries','matrix','A = [2 1; 1 3]','entries'),o('Shear grid','matrix','[1 s; 0 1]','shear'),o('Rotation matrix','matrix','Rθ = [cos −sin; sin cos]','rotation'),o('Determinant area','tiles','Area scale = |det A|','determinant'),o('Eigenvector direction','vector','Av = λv','eigen'),
  o('Linear system','plot','Ax = b','system'),o('Null space','vector','Av = 0','null'),o('Rank collapse','matrix','rank A = 1','rank'),o('Singular axes','circle','Unit circle → ellipse','singular'),o('Orthogonal basis','vector','q₁ · q₂ = 0','orthogonal')
 ],
 modelling:[
  o('Population capacity','plot','P′ = rP(1 − P/K)','logistic'),o('Susceptible pool','plot','S′ = −βSI','decay'),o('Infection curve','plot','I′ = βSI − γI','infection'),o('Recovered pool','plot','R′ = γI','recovered'),o('Traffic flow','network','Flow in = flow out','traffic'),
  o('Data to fit','plot','y ≈ ax + b','fit'),o('Residuals','plot','eᵢ = yᵢ − ŷᵢ','residual'),o('Seasonal climate','wave','T(t) = μ + A sin ωt','seasonal'),o('Cooling model','plot','T′ = −k(T − Tₐ)','decay'),o('Resource allocation','tiles','max cᵀx; Ax ≤ b','allocation'),
  o('Queue arrivals','bars','λ arrivals / unit time','queue',[2,4,3,5,2]),o('Compartment transfer','mapping','S → I → R','sir'),o('Feedback loop','network','Input → system → output','feedback'),o('Forecast interval','interval','Prediction ± uncertainty','forecast',[-2,2]),o('Parameter sensitivity','plot','∂y/∂θ','sensitivity')
 ],
 discrete:[
  o('Pascal coefficients','tree','1; 1 1; 1 2 1','pascal'),o('Modular residues','circle','n mod 8','clock',[8]),o('Fibonacci recurrence','bars','aₙ = aₙ₋₁ + aₙ₋₂','fibonacci',[1,1,2,3,5,8]),o('Binary counter','digits','000 → 001 → 010','binary'),o('Boolean AND','table','P ∧ Q','and'),
  o('Boolean OR','table','P ∨ Q','or'),o('Factorial choices','tree','3! = 6','permutations'),o('Combination choices','tiles','C(4,2) = 6','choose'),o('Euclidean remainder','identity','48 = 2×18 + 12','euclid'),o('Prime sieve','sieve','Primes ≤ 30','prime'),
  o('Divisibility lattice','network','1 | 2 | 6','divisibility'),o('Recursion tree','tree','T(n) = 2T(n/2)','recursion'),o('Geometric sum','bars','1 + 2 + 4 + 8','powers',[1,2,4,8]),o('Pigeonhole boxes','mapping','5 objects, 4 boxes','pigeonhole'),o('Induction steps','line','Base → n → n + 1','induction',[1,2,3,4])
 ],
 sets:[
  o('Union region','venn','A ∪ B','union'),o('Intersection lens','venn','A ∩ B','intersection'),o('Set difference','venn','A ∖ B','difference'),o('Symmetric difference','venn','A △ B','symmetric'),o('Complement','venn','U ∖ A','complement'),
  o('Nested subsets','venn','A ⊂ B ⊂ U','nested'),o('Cartesian product','tiles','{a,b} × {1,2,3}','cartesian'),o('Relation arrows','mapping','R ⊆ A × B','relation'),o('Injective map','mapping','Distinct inputs → distinct outputs','injective'),o('Surjective map','mapping','Every output is reached','surjective'),
  o('Bijective map','mapping','One-to-one and onto','bijective'),o('Equivalence classes','venn','A/∼ is a partition','partition'),o('Power set','tree','|P({a,b})| = 4','power-set'),o('Inclusion-exclusion','venn','|A∪B| = |A|+|B|−|A∩B|','inclusion'),o('Partial order','network','Hasse diagram','lattice')
 ],
 graphs:[
  o('Weighted shortest path','network','A → B → C; w = 5','weighted'),o('Breadth-first wave','network','BFS visits by distance','bfs'),o('Depth-first traversal','tree','DFS follows a branch','dfs'),o('Spanning tree','network','Connected; |E| = |V| − 1','tree'),o('Cycle traversal','network','C₆','cycle',[6]),
  o('Graph coloring','network','Adjacent colors differ','coloring'),o('Bipartite matching','mapping','U ↔ V','matching'),o('Directed flow','network','Flow conservation','flow'),o('Adjacency matrix','matrix','Aᵢⱼ = 1 for edges','adjacency'),o('Degree sequence','bars','d(v): 1, 2, 3, 2','degrees',[1,2,3,2]),
  o('Complete graph','network','K₄: 6 edges','complete',[4]),o('Wheel graph','network','W₆','wheel',[6]),o('Cube graph','network','Q₃: 8 vertices','cube'),o('Bridge edge','network','Removing e disconnects G','bridge'),o('Euler walk','network','Each edge exactly once','euler')
 ],
 statistics:[
  o('Coin experiment','fraction','P(H) = ½','coin',[1,2]),o('Die outcomes','tiles','P(k) = 1/6','die'),o('Probability tree','tree','P(A∩B) = P(A)P(B|A)','probability'),o('Binomial mass','bars','X ∼ Bin(4, ½)','binomial',[1,4,6,4,1]),o('Normal density','plot','X ∼ N(0,1)','normal'),
  o('Uniform density','plot','f(x) = ½ on [−1,1]','uniform'),o('Poisson counts','bars','X ∼ Pois(2)','poisson',[1,2,2,1.333,.667,.267]),o('Empirical histogram','bars','Frequency by bin','histogram',[1,3,6,8,5,2]),o('Sample mean','line','x̄ = Σxᵢ / n','mean',[1,2,2,3,4]),o('Variance spread','interval','σ² = E[(X−μ)²]','variance',[-2,2]),
  o('Correlation cloud','plot','r measures linear association','scatter'),o('Regression line','plot','ŷ = ax + b','fit'),o('Box and whiskers','interval','Q₁, median, Q₃','box',[-2,2]),o('Conditional events','venn','P(A|B) = P(A∩B)/P(B)','intersection'),o('Cumulative probability','plot','F(x) = P(X ≤ x)','cdf')
 ],
 'continued-fractions':[
  o('Golden convergents','convergents','1, 2, 3/2, 5/3, …','phi',[1,2,1.5,5/3,1.6,13/8]),o('Square-root convergents','convergents','1, 3/2, 7/5, 17/12','sqrt2',[1,1.5,1.4,17/12]),o('Pi convergents','convergents','3, 22/7, 333/106, 355/113','pi',[3,22/7,333/106,355/113]),o('Nested denominators','tree','[1; 1, 1, 1, …]','nested'),o('Euclidean divisions','identity','43 = 2×19 + 5','euclid'),
  o('Fibonacci ratios','bars','Fₙ₊₁ / Fₙ → φ','fibonacci',[1,1,2,3,5,8]),o('Golden rectangle','tiles','Width / height = φ','golden'),o('Golden spiral','spiral','Quarter-turn golden growth','golden'),o('Stern–Brocot tree','tree','Mediant: (a+c)/(b+d)','stern'),o('Farey neighbors','line','1/3, 1/2, 2/3','farey',[1/3,.5,2/3]),
  o('Approximation errors','bars','|x − pₙ/qₙ| ↓','error',[1,.4,.15,.06,.02]),o('Alternating bounds','convergents','Even / odd convergents bracket x','bounds',[1,2,1.5,5/3,1.6]),o('Reciprocal step','mapping','x → 1/(x − floor x)','reciprocal'),o('Periodic √2 tail','digits','√2 = [1; 2, 2, …]','cf'),o('Convergent recurrence','identity','qₙ = aₙqₙ₋₁ + qₙ₋₂','recurrence')
 ],
 'famous-problems':[
  o('Seven bridges','network','Euler: odd-degree obstruction','bridges'),o('Four-color map','tiles','Planar maps need ≤4 colors','four-color'),o('Collatz orbit','line','7 → 22 → 11 → 34 → 17','collatz',[7,22,11,34,17]),o('Goldbach pairs','mapping','10 = 3 + 7 = 5 + 5','goldbach'),o('Twin primes','line','(3,5), (5,7), (11,13)','twins',[3,5,7,11,13]),
  o('P and NP','venn','P ⊆ NP; equality open','complexity'),o('Riemann critical line','line','Re(s) = ½; RH open','critical',[14.1347,21.022,25.0109]),o('Fermat obstruction','identity','aⁿ + bⁿ ≠ cⁿ, n > 2','fermat'),o('Circle squaring','circle','Straightedge / compass: impossible','squaring'),o('Prime counting','bars','π(10)=4; π(20)=8','primes',[4,8,10,12]),
  o('Euclid infinite primes','sieve','p₁p₂…pₙ + 1','euclid'),o('Cantor diagonal','table','A new decimal differs in digit n','diagonal'),o('Hilbert hotel','mapping','n → n + 1','hotel'),o('Pythagorean triples','polygon','3² + 4² = 5²','triangle',[3]),o('Sphere packing','circle','Equal spheres; dense arrangement','packing')
 ],
 'stats-inference':[
  o('Sampling means','plot','x̄ ≈ N(μ, σ²/n)','normal'),o('Standard error','interval','SE = σ/√n','se',[-2,2]),o('Confidence interval','interval','x̄ ± 1.96 SE','confidence',[-1.96,1.96]),o('Repeated intervals','interval','Coverage across repeated samples','coverage',[-2,2]),o('Null distribution','plot','H₀: μ = μ₀','normal'),
  o('Alternative density','plot','H₁: μ ≠ μ₀','alternative'),o('Rejection tails','integral','|Z| > 1.96','tails'),o('P-value area','integral','P(|Z| ≥ |zobs|)','pvalue'),o('Test statistic','line','z = (x̄ − μ₀)/SE','z',[-2,0,2.14]),o('Prior density','plot','Beta(2,2)','beta'),
  o('Likelihood','plot','L(p) ∝ p⁶(1−p)⁴','likelihood'),o('Posterior density','plot','Beta(8,6)','posterior'),o('Bootstrap resampling','mapping','Sample → resample → estimate','bootstrap'),o('Sample-size precision','bars','SE ∝ 1/√n','precision',[1,.707,.5,.354,.25]),o('Type I and II errors','plot','α and β depend on threshold','errors')
 ],
 'special-functions':[
  o('Gamma continuation','plot','Γ(x+1) = xΓ(x)','gamma'),o('Beta kernel','plot','t(1−t)','beta'),o('Bessel J₀','plot','J₀(x)','bessel0'),o('Bessel J₁','plot','J₁(x)','bessel1'),o('Legendre P₂','plot','P₂(x) = (3x²−1)/2','legendre2'),
  o('Legendre P₃','plot','P₃(x) = (5x³−3x)/2','legendre3'),o('Hermite H₂','plot','H₂(x) = 4x²−2','hermite'),o('Laguerre L₂','plot','L₂(x) = 1−2x+x²/2','laguerre'),o('Chebyshev T₃','plot','T₃(x) = 4x³−3x','chebyshev'),o('Error function','plot','erf(x) = 2/√π ∫e⁻ᵗ²dt','erf'),
  o('Sinc oscillations','plot','sinc x = sin x / x','sinc'),o('Gaussian kernel','surface','e⁻⁽ˣ²⁺ʸ²⁾','gaussian'),o('Associated harmonics','circle','Angular mode cos(3θ)','harmonic'),o('Zeta for s > 1','plot','ζ(s) = Σ n⁻ˢ','zeta'),o('Orthogonal modes','wave','∫₀²π sin x sin 2x dx = 0','orthogonal')
 ],
 'advanced-de':[
  o('Heat diffusion','surface','uₜ = α∇²u','heat'),o('Traveling wave','wave','u(x,t) = sin(x − ct)','travel'),o('Standing wave','wave','u = sin x cos t','standing'),o('Damped wave','wave','u = e⁻ᵗ sin(x − t)','damped'),o('Laplace field','field','∇²φ = 0','laplace'),
  o('Gaussian heat kernel','surface','G ∝ t⁻¹ e⁻ʳ²/⁴ᵗ','gaussian'),o('Fourier heat mode','wave','uₙ = e⁻ⁿ²ᵗ sin nx','heat'),o('Lorenz trajectory','spiral','σ=10, ρ=28, β=8/3','lorenz'),o('Stable phase portrait','field','x′ = −x; y′ = −y','sink'),o('Saddle portrait','field','x′ = x; y′ = −y','saddle'),
  o('Limit-cycle orbit','circle','r′ = r(1 − r²)','limit-cycle'),o('Boundary values','wave','u(0,t) = u(π,t) = 0','boundary'),o('Eigenmode spectrum','bars','λₙ = n²π²','eigenvalues',[1,4,9,16]),o('Reaction diffusion','surface','uₜ = D∇²u + u(1−u)','reaction'),o('Characteristic rays','vector','dx/dt = c','characteristic')
 ]
};

// Six supporting concepts around one central scene keep each home calm.
const homeSelections:Record<string,number[]>={
 algebra:[0,1,2,6,8,12], 'number-systems':[0,1,2,6,8,14], calculus:[0,4,5,8,10,11],
 'differential-equations':[0,2,4,6,9,11], 'complex-numbers':[0,1,4,6,10,12],
 structures:[0,1,2,4,8,10], geometry:[0,1,4,5,8,13], 'linear-algebra':[0,6,7,8,9,12],
 modelling:[0,2,4,5,7,11], discrete:[0,1,2,4,7,9], sets:[0,1,2,6,8,14],
 graphs:[0,3,5,8,10,12], statistics:[0,1,2,4,10,12],
 'continued-fractions':[0,1,2,3,6,8], 'famous-problems':[0,1,2,5,6,7],
 'stats-inference':[0,1,2,6,8,11], 'special-functions':[0,2,4,8,9,10], 'advanced-de':[0,1,4,7,8,9]
};
export function visibleStudioObjects(id:string):StudioObject[]{return (homeSelections[id]||[]).map(index=>studioObjects[id][index]);}
