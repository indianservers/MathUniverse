type DraftSeed = {
  title: string;
  statement: string;
  strategy: string;
  keyRelation: string;
  warning: string;
};

const coordinateSeeds: DraftSeed[] = [
  seed("Distance formula theorem", "Distance between two plane points follows the Pythagorean formula.", "Draw horizontal and vertical changes between the points to make a right triangle.", "d^2=(x2-x1)^2+(y2-y1)^2", "Use coordinate differences in a consistent order."),
  seed("Midpoint theorem", "The midpoint coordinates are the averages of endpoint coordinates.", "Use equal horizontal and vertical changes from each endpoint to the halfway point.", "M=((x1+x2)/2,(y1+y2)/2)", "Do not average an x-coordinate with a y-coordinate."),
  seed("Section formula theorem", "A point dividing a segment in a ratio has weighted-average coordinates.", "Write the point as a weighted blend of the two endpoints and match the required ratio.", "P=(mB+nA)/(m+n)", "Internal and external division use different signs."),
  seed("Slope criterion for parallel lines", "Non-vertical parallel lines have equal slopes.", "Compare equal rise-to-run ratios along two lines that never change separation.", "m1=m2", "Vertical lines need a separate statement because their slope is undefined."),
  seed("Slope criterion for perpendicular lines", "Perpendicular non-vertical slopes multiply to -1.", "Represent direction vectors for both lines and use their zero dot product.", "m1*m2=-1", "Horizontal and vertical perpendicular lines need the undefined-slope case."),
  seed("Two-point line theorem", "Two distinct points determine exactly one line.", "Form the direction vector from one point to the other and parameterize every point on that direction.", "P(t)=A+t(B-A)", "The two points must be distinct."),
  seed("Point-line distance theorem", "Distance from a point to Ax+By+C=0 is absolute substitution over sqrt(A^2+B^2).", "Project the point-to-line displacement onto the line's normal vector.", "d=|Ax0+By0+C|/sqrt(A^2+B^2)", "The coefficients A and B cannot both be zero."),
  seed("Area shoelace theorem", "Polygon area can be computed from cross-products of successive coordinates.", "Split the polygon into signed triangles from the origin and sum their determinant areas.", "Area=1/2|sum(x_i y_(i+1)-y_i x_(i+1))|", "List vertices in boundary order."),
  seed("Collinearity determinant theorem", "Three points are collinear exactly when their coordinate area determinant is zero.", "Use the determinant area formula for the triangle formed by the three points.", "det[[x1,y1,1],[x2,y2,1],[x3,y3,1]]=0", "Zero area is the conclusion, not merely equal slopes with unchecked vertical cases."),
  seed("Circle center-radius theorem", "(x-h)^2+(y-k)^2=r^2 describes all points at distance r from (h,k).", "Apply the distance formula from a general point to the fixed center.", "(x-h)^2+(y-k)^2=r^2", "The radius must be non-negative."),
  seed("Parabola focus-directrix theorem", "A parabola is the locus of points equidistant from a focus and a directrix.", "Equate point-to-focus distance with perpendicular point-to-line distance.", "distance(P,F)=distance(P,directrix)", "Square only after both distances are known to be non-negative."),
  seed("Ellipse focal sum theorem", "An ellipse is the locus with constant sum of distances from two foci.", "Add the two focal distances and simplify to the standard ellipse equation.", "PF1+PF2=2a", "The constant must exceed the distance between the foci."),
  seed("Hyperbola focal difference theorem", "A hyperbola is the locus with constant absolute difference of focal distances.", "Subtract focal distances, use absolute value, and isolate the two branches.", "|PF1-PF2|=2a", "Dropping the absolute value loses one branch."),
  seed("Conic eccentricity theorem", "Eccentricity classifies conics as circle, ellipse, parabola, or hyperbola.", "Compare point-to-focus distance with point-to-directrix distance using a fixed ratio.", "PF=e*distance(P,directrix)", "Classification depends on whether e is 0, below 1, equal to 1, or above 1."),
  seed("Rotation matrix theorem", "A rotation preserves lengths and angles in the coordinate plane.", "Show the rotation matrix has orthonormal columns, so dot products are preserved.", "R^T R=I", "Use radians or degrees consistently when evaluating sine and cosine."),
  seed("Reflection transformation theorem", "Reflection preserves distance and reverses orientation.", "Use an orthogonal reflection matrix with determinant -1.", "Q^T Q=I and det(Q)=-1", "Reflection preserves size but not orientation."),
  seed("Translation invariance theorem", "Translation preserves distances, angles, and areas.", "Add the same vector to every point and observe that all coordinate differences remain unchanged.", "(P+t)-(Q+t)=P-Q", "Translation changes position, not relative geometry."),
  seed("Homothety scale theorem", "A scale factor k multiplies lengths by k and areas by k squared.", "Scale every displacement vector from the center and compare norms and determinants.", "length scale=|k|, area scale=k^2", "Negative k also reverses direction through the center."),
];

const calculusSeeds: DraftSeed[] = [
  seed("Squeeze theorem", "A function trapped between two functions with the same limit has that limit.", "Keep the target function between lower and upper bounds inside every sufficiently small neighborhood.", "g(x)<=f(x)<=h(x), lim g=lim h=L", "Both bounds must approach the same limit."),
  seed("Intermediate value theorem", "A continuous function takes every value between two endpoint values.", "Use continuity to prevent the graph from jumping over a target height.", "f(c)=N for N between f(a) and f(b)", "Continuity on the whole closed interval is required."),
  seed("Extreme value theorem", "A continuous function on a closed interval attains a maximum and minimum.", "Combine compactness of the closed interval with preservation of compactness under continuity.", "max f and min f occur on [a,b]", "Closed and bounded interval conditions matter."),
  seed("Rolle theorem", "If endpoint values match, some interior derivative is zero.", "Apply the extreme value theorem and inspect an interior maximum or minimum.", "f(a)=f(b) implies f'(c)=0", "The function must be continuous and differentiable in the stated places."),
  seed("Mean value theorem", "Some tangent slope equals the secant slope over a differentiable interval.", "Subtract the secant line to create a function with equal endpoint values, then apply Rolle's theorem.", "f'(c)=(f(b)-f(a))/(b-a)", "The point c is guaranteed to exist but is not necessarily unique."),
  seed("Taylor theorem", "A smooth function equals its Taylor polynomial plus a controlled remainder.", "Match derivatives at the expansion point and apply repeated mean-value reasoning to the error.", "f(x)=P_n(x)+R_n(x)", "A small remainder requires the stated derivative bounds."),
  seed("L'Hopital theorem", "Certain indeterminate quotient limits can use derivative quotients.", "Apply the Cauchy mean value theorem to numerator and denominator near the limit point.", "lim f/g=lim f'/g'", "Only valid indeterminate forms and hypotheses qualify."),
  seed("Fundamental theorem of calculus I", "Accumulated area functions have derivative equal to the integrand.", "Compare the added thin area over a short interval and use continuity to trap its average height.", "d/dx integral_a^x f(t)dt=f(x)", "Continuity at the evaluation point is the key condition."),
  seed("Fundamental theorem of calculus II", "A definite integral equals antiderivative value difference.", "Apply Part I to the accumulated integral and compare it with any antiderivative.", "integral_a^b f(x)dx=F(b)-F(a)", "Use an antiderivative on the entire interval."),
  seed("Integration by parts theorem", "The product rule rearranges into an integral identity.", "Integrate both sides of the product derivative formula and isolate one product integral.", "integral u dv=uv-integral v du", "Keep boundary terms for definite integrals."),
  seed("Change of variables theorem", "Substitution transforms an integral by changing variables and differentials.", "Compose with the substitution and apply the chain rule to the antiderivative.", "integral f(g(x))g'(x)dx=integral f(u)du", "Transform bounds when evaluating a definite integral."),
  seed("Monotonicity theorem", "A positive derivative implies increasing behavior on an interval.", "Apply the mean value theorem between any two ordered points.", "f(y)-f(x)=f'(c)(y-x)", "Non-negative derivative gives non-decreasing, not always strictly increasing."),
  seed("Concavity theorem", "The sign of the second derivative controls concavity.", "Use the first derivative's monotonic behavior to compare tangent slopes.", "f''>0 implies concave up", "Inflection requires a change of concavity, not just f''=0."),
  seed("Uniform convergence theorem", "Uniform limits of continuous functions remain continuous.", "Choose one index that controls the approximation error at every point, then use continuity of that one function.", "|f_n-f|<epsilon uniformly", "Pointwise convergence alone is not enough."),
  seed("Ratio test theorem", "A series converges absolutely when the ratio limit is less than one.", "Bound later term ratios by a fixed number below one and compare with a geometric series.", "|a_(n+1)/a_n|<=r<1", "A ratio limit equal to one gives no conclusion."),
  seed("Green theorem", "A planar line integral equals a double integral of circulation over the region.", "Prove the identity on simple regions using the fundamental theorem of calculus, then add regions.", "oint(P dx+Q dy)=double integral(dQ/dx-dP/dy)dA", "Boundary orientation must be positive."),
  seed("Divergence theorem", "Flux through a closed surface equals volume integral of divergence.", "Verify on boxes by cancellation of interior flux, then extend by subdivision.", "surface integral F.n dS=volume integral div(F)dV", "The surface must be closed and outward oriented."),
  seed("Stokes theorem", "Boundary circulation equals surface integral of curl.", "Approximate the surface by small patches whose interior edge circulations cancel.", "oint_boundaryS F.dr=surface integral_S curl(F).n dS", "Boundary orientation must agree with the chosen normal."),
];

export const coordinateCalculusProofDrafts = {
  ...buildDrafts("coordinate-geometry", coordinateSeeds),
  ...buildDrafts("calculus-analysis", calculusSeeds),
};

function seed(title: string, statement: string, strategy: string, keyRelation: string, warning: string): DraftSeed {
  return { title, statement, strategy, keyRelation, warning };
}

function buildDrafts(categoryId: string, seeds: DraftSeed[]) {
  return Object.fromEntries(
    seeds.map((item) => [
      `${categoryId}:${item.title}`,
      {
        proofIdea: `${item.strategy} The proof then translates that construction into the theorem's symbolic statement.`,
        proofSteps: [
          { title: "State the hypotheses", explanation: `Write the claim precisely and identify every condition: ${item.statement}`, representation: "The givens and target conclusion are separated into labeled boxes." },
          { title: "Build the mathematical setup", explanation: item.strategy, representation: "A coordinate diagram, graph, interval, or field is labeled with the relevant quantities." },
          { title: "Apply the key relation", explanation: `Use the central relation ${item.keyRelation} and simplify without changing the hypotheses.`, representation: "The key equality or inequality is highlighted beside the visual setup." },
          { title: "Check the conditions", explanation: `Confirm the theorem's assumptions before concluding. ${item.warning}`, representation: "A condition checklist marks the valid domain, orientation, continuity, or non-zero requirement." },
          { title: "Conclude the theorem", explanation: `The setup and key relation now give the required result: ${item.statement}`, representation: "The final statement is boxed and linked back to the original diagram." },
        ],
        examMemory: `${item.title}: remember the setup first, then the relation ${item.keyRelation}.`,
        commonMistakes: [item.warning, "Skipping the hypothesis check before using the theorem.", "Writing the final formula without connecting it to the construction."],
      },
    ]),
  );
}
