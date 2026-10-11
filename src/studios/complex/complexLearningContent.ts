export type ComplexQuestion = { prompt: string; choices: string[]; correct: number; explanation: string };
export type ComplexLesson = {
  title: string; prerequisite: string; goal: string; meaning: string;
  formula: string; derivation: string[]; example: string[]; misconception: string;
  investigation: string[]; application: string; questions: ComplexQuestion[];
};
export const complexLessons: Record<string, ComplexLesson> = {
  "argand-plane": {
    title: "Numbers become points", prerequisite: "Coordinates and Pythagoras", goal: "Read, plot and explain a complex number using its coordinates, modulus and argument.",
    meaning: "A complex number z = a + bi is both a point (a, b) and a vector from the origin. The real axis runs horizontally; the imaginary axis runs vertically. The symbol i satisfies i² = −1.",
    formula: String.raw`|z|=\sqrt{a^2+b^2},\quad \arg z=\operatorname{atan2}(b,a)`,
    derivation: ["The right triangle with legs a and b has hypotenuse |z| by Pythagoras.", "The argument is the angle of the vector, measured counterclockwise from the positive real axis. atan2 uses both signs to choose the correct quadrant.", "Conjugation replaces b by −b, reflecting the point in the real axis. Therefore z times its conjugate equals a² + b²."],
    example: ["For z = −3 + 4i, the point lies in quadrant II.", "Its modulus is √(9 + 16) = 5; its principal argument is about 126.87°.", "Its conjugate is −3 − 4i, which has the same modulus."],
    misconception: "The argument of zero is undefined. Using arctan(b/a) alone loses quadrant information.",
    investigation: ["Predict the modulus of 3 + 4i, then set the coordinates and check it.", "Reflect across the real axis: which values change and which remain invariant?", "Keep the modulus fixed and move the angle: describe the resulting locus."],
    application: "A complex point encodes two perpendicular components of a signal or displacement in one number.",
    questions: [
      { prompt: "What is |−3 + 4i|?", choices: ["1", "5", "7", "25"], correct: 1, explanation: "√((−3)² + 4²) = 5. Modulus is distance, so it is nonnegative." },
      { prompt: "Where does −2 − i lie?", choices: ["Quadrant I", "Quadrant II", "Quadrant III", "Quadrant IV"], correct: 2, explanation: "Both coordinates are negative: left and below the origin." },
      { prompt: "Which argument can be assigned to z = 0?", choices: ["Always 0", "Always π", "Undefined", "Always π/2"], correct: 2, explanation: "The zero vector has no direction, so its argument is undefined." },
    ],
  },
  arithmetic: {
    title: "Algebra meets vector geometry", prerequisite: "Argand coordinates and i² = −1", goal: "Explain addition as translation and multiplication as scaling and rotation.",
    meaning: "Addition combines real and imaginary components separately. Multiplication distributes like ordinary algebra, then uses i² = −1. Division reverses a nonzero multiplication.",
    formula: String.raw`(a+bi)(c+di)=(ac-bd)+(ad+bc)i`,
    derivation: ["Expand ac + adi + bci + bdi² and replace i² with −1.", "For division by c + di, multiply numerator and denominator by c − di. The denominator becomes c² + d².", "On the plane, the sum is the diagonal of the parallelogram. For a product, moduli multiply and arguments add."],
    example: ["(2 + i)(1 − 3i) = 2 − 6i + i − 3i² = 5 − 5i.", "(2 + i)/(1 − i) = (2 + i)(1 + i)/2 = (1 + 3i)/2.", "Check the product magnitude: √5 × √10 = √50, the magnitude of 5 − 5i."],
    misconception: "Complex multiplication is not componentwise multiplication. Division by zero is undefined.",
    investigation: ["Choose two vectors and predict their sum before showing the parallelogram.", "Multiply by i, then by i again. Explain the resulting half-turn.", "Divide your product by the original nonzero multiplier to recover the input."],
    application: "Complex arithmetic combines phase and amplitude in AC circuits and wave interference.",
    questions: [
      { prompt: "(1 + i)² equals…", choices: ["2", "2i", "1 + i", "−2"], correct: 1, explanation: "1 + 2i + i² = 2i." },
      { prompt: "(2 + 3i) + (−1 + 4i) equals…", choices: ["1 + 7i", "1 − i", "−2 + 12i", "3 + 7i"], correct: 0, explanation: "Add corresponding components: 2 − 1 = 1 and 3 + 4 = 7." },
      { prompt: "Why multiply by the conjugate when dividing?", choices: ["To remove the numerator", "To make the denominator real", "To change i² to 1", "To set the argument to zero"], correct: 1, explanation: "(c + di)(c − di) = c² + d², a positive real number for a nonzero denominator." },
    ],
  },
  "polar-forms": {
    title: "One number, three representations", prerequisite: "Modulus, argument and basic trigonometry", goal: "Convert between rectangular, polar and exponential forms with correct quadrants.",
    meaning: "Rectangular form describes components; polar form describes distance and direction. Exponential form packages rotation using Euler’s formula. All three describe the same point.",
    formula: String.raw`a+bi=r(\cos\theta+i\sin\theta)=re^{i\theta}`,
    derivation: ["Project a radius r onto the axes: a = r cos θ and b = r sin θ.", "Conversely, r = √(a² + b²) and θ = atan2(b, a), provided z is nonzero.", "Adding 2πk to θ preserves the point. A principal argument selects one interval, usually (−π, π]."],
    example: ["For 1 + √3 i, r = 2 and θ = π/3.", "Therefore z = 2(cos(π/3) + i sin(π/3)) = 2e^(iπ/3).", "The angle 7π/3 is another argument of the same number."],
    misconception: "Arguments are not unique: they differ by whole turns. At zero, r = 0 but the angle is undefined.",
    investigation: ["Place a point in each quadrant and predict its principal argument.", "Change θ by 360°: compare the rectangular coordinates.", "Hold θ fixed and vary r: explain why the point follows a ray."],
    application: "Polar form makes multiplying signals easy: multiply amplitudes and add phases.",
    questions: [
      { prompt: "The polar modulus of 1 + √3 i is…", choices: ["1", "√3", "2", "4"], correct: 2, explanation: "√(1 + 3) = 2." },
      { prompt: "Which angle also represents π/3?", choices: ["−π/3", "4π/3", "7π/3", "2π/3"], correct: 2, explanation: "7π/3 = π/3 + 2π, one full turn later." },
      { prompt: "For r = 2 and θ = π, z equals…", choices: ["2", "−2", "2i", "−2i"], correct: 1, explanation: "2 cos π + 2i sin π = −2." },
    ],
  },
  rotation: {
    title: "Multiplication is a transformation", prerequisite: "Complex multiplication and polar form", goal: "Predict the scale, rotation and matrix of multiplication by a complex number.",
    meaning: "Multiplication by w = u + vi is a linear transformation of the plane. It scales every distance by |w| and rotates every nonzero direction by arg(w), unless w = 0 collapses everything.",
    formula: String.raw`\begin{pmatrix}\Re(wz)\\\Im(wz)\end{pmatrix}=\begin{pmatrix}u&-v\\v&u\end{pmatrix}\begin{pmatrix}a\\b\end{pmatrix}`,
    derivation: ["Expand (u + vi)(a + bi): the coordinates are ua − vb and va + ub.", "The matrix columns are perpendicular and have equal length √(u² + v²), so the transformation has no shear.", "Its determinant u² + v² is the area scale factor. Repeating multiplication n times gives scale |w|ⁿ and rotation n arg(w)."],
    example: ["Multiplication by i sends 2 + i to −1 + 2i: a 90° counterclockwise turn.", "Multiplication by 2i doubles lengths and rotates 90°.", "Four multiplications by i return the original point because i⁴ = 1."],
    misconception: "A negative real multiplier rotates by π as well as scaling. The scale factor is its absolute value.",
    investigation: ["Predict the image of a point under w = i, then verify it.", "Try |w| < 1, |w| = 1 and |w| > 1 under repeated multiplication.", "Compare the matrix determinant with the squared modulus of w."],
    application: "Complex multiplication provides efficient planar rotations in graphics and phase shifts in signal processing.",
    questions: [
      { prompt: "Multiplication by −1 produces…", choices: ["A reflection", "A 180° rotation", "A 90° rotation", "A translation"], correct: 1, explanation: "Both coordinates change sign, a half-turn about the origin." },
      { prompt: "Multiplication by 2i scales lengths by…", choices: ["1", "2", "4", "0"], correct: 1, explanation: "|2i| = 2. Areas scale by 4." },
      { prompt: "Repeated multiplication by a number of modulus 0.8…", choices: ["Spirals outward", "Preserves radius", "Approaches zero", "Always moves on a line"], correct: 2, explanation: "The radius after n steps is |z| × 0.8ⁿ, which tends to zero." },
    ],
  },
  roots: {
    title: "Roots form regular polygons", prerequisite: "Polar form and De Moivre’s theorem", goal: "Find every nth root and explain their equal angular spacing.",
    meaning: "Solving wⁿ = z requires both the right radius and every possible angle. For nonzero z there are n distinct roots, evenly spaced on a circle.",
    formula: String.raw`w_k=r^{1/n}e^{i(\theta+2\pi k)/n},\quad k=0,\ldots,n-1`,
    derivation: ["Write w = ρe^(iφ). Then wⁿ = ρⁿe^(inφ).", "Matching magnitudes gives ρ = r^(1/n); matching arguments gives nφ = θ + 2πk.", "The n angles are separated by 2π/n. Values k ≥ n repeat earlier roots. Zero has just one distinct root, zero."],
    example: ["For w³ = 8, the root radius is 2 and angles are 0°, 120° and 240°.", "The roots are 2, −1 + √3 i and −1 − √3 i.", "Cubing each root gives 8; the roots sum to zero."],
    misconception: "Taking only the principal root misses the other solutions. Roots of a nonzero number need not lie on the unit circle.",
    investigation: ["Compare the third, fourth and sixth roots of 1; measure angular spacing.", "Rotate the input by 90°: predict how much the nth-root polygon rotates.", "Increase the input modulus and test the radius r^(1/n)."],
    application: "Roots of unity are the equally spaced rotations used by discrete Fourier transforms.",
    questions: [
      { prompt: "The spacing of the sixth roots of 1 is…", choices: ["30°", "60°", "90°", "120°"], correct: 1, explanation: "360°/6 = 60°." },
      { prompt: "Every cube root of 8 has modulus…", choices: ["8", "4", "2", "1"], correct: 2, explanation: "ρ³ = 8 gives ρ = 2." },
      { prompt: "How many distinct square roots does zero have?", choices: ["0", "1", "2", "Infinitely many"], correct: 1, explanation: "Only w = 0 satisfies w² = 0, though it is a repeated polynomial root." },
    ],
  },
  euler: {
    title: "Exponentials encode rotation", prerequisite: "Radians, unit circle and power series", goal: "Connect Euler’s formula, its helix and projections, and quantify Taylor convergence.",
    meaning: "For a real angle θ, e^(iθ) lies on the unit circle. Plotting angle as a third coordinate lifts this rotation into a helix. The height records the unwrapped angle; it is not another component of the complex number.",
    formula: String.raw`e^{i\theta}=\cos\theta+i\sin\theta,\qquad |e^{i\theta}|=1`,
    derivation: ["Start with e^x = Σ xⁿ/n!, which converges for every complex x.", "Substitute x = iθ and use i² = −1, i³ = −i, i⁴ = 1.", "The even powers give 1 − θ²/2! + θ⁴/4! − … = cos θ; the odd powers give i(θ − θ³/3! + …) = i sin θ.", "At θ = π, cos π = −1 and sin π = 0. Hence e^(iπ) + 1 = 0. Also e^(i(θ + 2πk)) = e^(iθ)."],
    example: ["At θ = π/2, the point is i: real part 0, imaginary part 1.", "At θ = π, the exact point is −1. Six terms (n = 0 to 5) give about 0.124 + 0.524i, visibly away from the circle.", "Increasing the number of terms makes the partial sum converge. Large |θ| can require many more terms."],
    misconception: "A finite Taylor sum generally has modulus different from 1. Angles in power series must be in radians.",
    investigation: ["Predict the point at each quarter-turn before selecting the shortcut.", "Compare θ = 0 and 2π: same complex point, different helix heights.", "At θ = π, increase terms from 2 to 24 and track absolute error.", "Compare cosine and sine projections with the helix and unit-circle point."],
    application: "A rotating complex exponential generates sine and cosine signals. Adding such rotations is the basis of Fourier analysis.",
    questions: [
      { prompt: "e^(iπ/2) equals…", choices: ["1", "−1", "i", "−i"], correct: 2, explanation: "cos(π/2) = 0 and sin(π/2) = 1, so the value is i." },
      { prompt: "What changes between helix points θ = 0 and θ = 2π?", choices: ["Complex modulus", "Complex point", "Unwrapped angle (height)", "Real part"], correct: 2, explanation: "Both project to 1 + 0i; their angle coordinates differ by 2π." },
      { prompt: "Does a finite Taylor sum always lie on the unit circle?", choices: ["Yes", "No", "Only at π", "Only with six terms"], correct: 1, explanation: "The truncation introduces error; the modulus need not be exactly 1." },
    ],
  },
  loci: {
    title: "Equations describe geometric sets", prerequisite: "Distance on the Argand plane and complex division", goal: "Interpret loci and distinguish a Möbius transformation from its poles.",
    meaning: "A locus is the set of all points satisfying a condition. Complex modulus measures distance. A Möbius map transforms the extended complex plane, including the point at infinity.",
    formula: String.raw`|z-c|=r,\qquad w=\frac{az+b}{cz+d},\quad ad-bc\ne0`,
    derivation: ["Writing z = x + iy and c = p + iq gives (x − p)² + (y − q)² = r², a circle.", "The condition |z − p| = |z − q| gives the perpendicular bisector of the segment joining p and q.", "For a Möbius map with c ≠ 0, the denominator vanishes at −d/c: a pole mapped to infinity. Generalized circles (circles or lines) map to generalized circles."],
    example: ["|z − (1 + 2i)| = 3 describes a circle centered at (1, 2) with radius 3.", "For w = (z − 1)/(z + 1), z = 1 maps to 0, z = 0 maps to −1, and z = −1 is a pole.", "The imaginary axis maps to the unit circle because |iy − 1| = |iy + 1|."],
    misconception: "A circle can map to a line, particularly when it passes through a pole. A zero denominator is not a finite plotted point.",
    investigation: ["Predict center and radius before changing a circle condition.", "Follow points toward a pole and describe how their images behave.", "Compare a line and circle under inversion; identify when the image is a line."],
    application: "Möbius maps appear in conformal geometry and transformations between impedance and reflection coefficients.",
    questions: [
      { prompt: "|z − (2 − i)| = 4 has center…", choices: ["(−2, 1)", "(2, −1)", "(4, 0)", "(0, 4)"], correct: 1, explanation: "The center is the complex number subtracted from z: 2 − i." },
      { prompt: "The pole of (z − 1)/(z + 1) is…", choices: ["1", "0", "−1", "i"], correct: 2, explanation: "z + 1 = 0 at z = −1." },
      { prompt: "Equidistance from two distinct points describes…", choices: ["Their midpoint only", "A circle", "A perpendicular bisector", "The entire plane"], correct: 2, explanation: "Every point on the perpendicular bisector has equal distance to the two endpoints." },
    ],
  },
  fractals: {
    title: "Simple iteration creates intricate boundaries", prerequisite: "Complex squaring and sequences", goal: "Distinguish Mandelbrot and Julia experiments and interpret finite escape tests.",
    meaning: "Iterate z_(n+1) = z_n² + c. A Mandelbrot experiment varies c with z₀ = 0. A Julia experiment fixes c and varies the starting point z₀.",
    formula: String.raw`z_{n+1}=z_n^2+c`,
    derivation: ["For the Mandelbrot set, a point c belongs precisely when the orbit starting at zero remains bounded forever.", "Once a Mandelbrot orbit has modulus greater than 2 it escapes. For Julia orbits with arbitrary c, max(2, |c|) is a safe escape radius.", "A finite iteration budget can prove escape, but failure to escape within that budget is not a proof of membership."],
    example: ["For c = 0 and z₀ = 0 the orbit stays at zero.", "For c = −1, the orbit is 0, −1, 0, −1, …, a bounded two-cycle.", "For c = 1 it is 0, 1, 2, 5, 26, … and escapes."],
    misconception: "An apparently interior pixel means ‘not escaped within this budget,’ not a rigorous membership proof.",
    investigation: ["Compare c = 0, −1 and 1 and record the first five iterates.", "Increase the iteration limit near a boundary and note which pixels change.", "Keep c fixed in Julia mode and compare starting points inside and outside the visible boundary."],
    application: "Complex iteration models discrete dynamical systems and demonstrates sensitivity near chaotic boundaries.",
    questions: [
      { prompt: "What varies across a Mandelbrot image?", choices: ["The parameter c", "Only z₀", "The exponent", "The iteration rule"], correct: 0, explanation: "Each pixel is a different c; the starting value is always zero." },
      { prompt: "For c = −1 and z₀ = 0, the orbit…", choices: ["Escapes immediately", "Alternates 0 and −1", "Stays at 1", "Increases forever"], correct: 1, explanation: "0² − 1 = −1 and (−1)² − 1 = 0." },
      { prompt: "No escape after 100 iterations proves…", choices: ["Membership forever", "Nothing about the tested orbit", "Only non-escape within 100 steps", "Escape after 101 steps"], correct: 2, explanation: "The finite test supplies evidence, not an infinite-time boundedness proof." },
    ],
  },
  "waves-circuits": {
    title: "Phase and amplitude become circuit quantities", prerequisite: "Polar form, sine waves and elementary circuits", goal: "Interpret phasors, impedance, resonance and power factor under a stated convention.",
    meaning: "With the e^(iωt) convention, a phasor encodes a sinusoid’s amplitude and phase. In a series RLC circuit, resistance and reactance combine as complex impedance. Engineers often write j instead of i.",
    formula: String.raw`Z=R+i\left(\omega L-\frac{1}{\omega C}\right),\quad I=\frac{V}{Z}`,
    derivation: ["A resistor contributes R. An inductor contributes iωL. A capacitor contributes 1/(iωC) = −i/(ωC).", "Series impedances add. Write X = ωL − 1/(ωC); then |Z| = √(R² + X²) and φ = atan2(X, R).", "For R > 0, resonance occurs at ω₀ = 1/√(LC), where X = 0. The power factor is cos φ = R/|Z|. Current phase relative to voltage is −φ."],
    example: ["At f = 50 Hz, R = 100 Ω, L = 0.2 H and C = 100 μF, ω ≈ 314.16 rad/s.", "X_L ≈ 62.83 Ω and X_C ≈ 31.83 Ω, so Z ≈ 100 + 31.00i Ω.", "|Z| ≈ 104.69 Ω and φ ≈ 17.22°. Current lags voltage by 17.22°; power factor ≈ 0.955."],
    misconception: "Reactances carry opposite signs. Use one amplitude convention consistently: RMS phasors give average power V_rms I_rms cos φ.",
    investigation: ["Sweep frequency through resonance and track reactance, impedance magnitude and phase.", "Increase R and explain the change in phase angle.", "Compare the time-domain wave with the phasor projection; record whether current leads or lags."],
    application: "Phasors replace sinusoidal differential equations with complex algebra for steady-state AC analysis.",
    questions: [
      { prompt: "At series RLC resonance, net reactance is…", choices: ["R", "Zero", "Infinite", "ωL"], correct: 1, explanation: "The inductive and capacitive reactances cancel." },
      { prompt: "Positive net reactance means current…", choices: ["Leads voltage", "Lags voltage", "Is always zero", "Is always in phase"], correct: 1, explanation: "Impedance has positive phase; I = V/Z therefore has lower phase than V." },
      { prompt: "With RMS phasors, average power equals…", choices: ["VI", "VI sin φ", "VI cos φ", "V/I"], correct: 2, explanation: "Only the in-phase component transfers average real power." },
    ],
  },
};

export const complexPaths = [
  { title: "Build the foundations", description: "Coordinates → arithmetic → representations → transformations", ids: ["argand-plane", "arithmetic", "polar-forms", "rotation"] },
  { title: "Explain the structure", description: "Rotation → Euler → De Moivre → geometric sets", ids: ["rotation", "euler", "roots", "loci"] },
  { title: "Explore applications", description: "Exponentials → signals and circuits → nonlinear dynamics", ids: ["euler", "waves-circuits", "fractals"] },
];
