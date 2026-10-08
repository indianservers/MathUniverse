# Ruhi mathematical kernel 5.2

## v5.2 additions

The local typed kernel now accepts bounded Unicode/basic LaTeX notation, substitution values and assumptions, structured interval/set/vector/matrix/calculus/piecewise ASTs, exact affine systems, polynomial division/GCD, rational inequalities, function analysis for degree-two polynomials, and explicit 2D/3D geometry requests. Parsed syntax has an `unverified` status until an operation supplies mathematical verification.

```ts
await computeMathLocal({operation: 'system', equations: ['x+y=3', '2*x-y=0'], variables: ['x','y']});
await computeMathLocal({operation: 'geometry3d', args: ['plane', [[0,0,0],[6,0,0],[0,4,0]]]});
```

The CAS uses independent BigInt rational polynomial arithmetic and rational-ring identities to check supported results. Original denominators and real-function domains survive simplification. Real `sqrt(x^2)` respects assumptions; real integration of `1/x` returns `log(abs(x))+C`. Affine systems report rank, inconsistent rows and free parameters. Equation candidates are checked against the original expression and poles.

Native workspaces preserve line/segment/ray distinctions, update incircles and 3D planes/perpendicular lines/intersections through parent dependencies, and preserve those relationships across undo/redo. Plane patches display an underlying infinite mathematical plane. Core 3D coordinates are right-handed XYZ with angles in radians; the graph renderer converts its existing Z-up display frame separately.

### Scope and limits

- Exact linear predicates operate on the exact IEEE-754 coordinates supplied; rounded rendered coordinates remain approximations. Triangle centers and circle tangencies additionally use bounded numerical residual checks and can reject ill-conditioned inputs.
- Supported equations include rational-factorable real polynomials, selected principal-root/absolute-value/exponential/logarithmic classes, and complex rational quadratics. General irreducible higher-degree, parameterized and nonlinear systems remain unsupported. Rational sign charts require rational critical roots; general function analysis is not certified.
- Constraint solving covers exact affine point constraints (four points, sixteen constraints). There is no general nonlinear geometric constraint optimizer. Conic classification and selected circle/line constructions do not constitute a complete conic intersection/tangent solver.
- 3D operations cover vectors, selected line/plane incidence and skew distances, sphere-plane sections and analytic solid measurements. General solid booleans and arbitrary polyhedron cross-sections remain outside this implementation. Closest skew bounded segments/rays are explicitly unsupported.
- Transcendental numerical evaluation without an independent accuracy certificate stays `unverified`. Numerical consistency checks are not universal proofs.
- Worker pools are bounded, cancellable and recycled. Browser heap measurements cover the main page, not all worker heaps or a physical low-memory device. A local asset server remains necessary; disconnected cold reload is not implemented.
- The existing TensorFlow classifier and weights are retained. These tests are not evidence of a newly trained model, improved held-out classifier accuracy, or measured 100K-row training throughput.

Shared local API for Ruhi and mathematical studios:

```ts
import {computeMathLocal} from './kernel';
const result = await computeMathLocal({operation: 'solve', expression: 'sqrt(x+5)=x-1', variable: 'x', domain: 'real'}, signal);
// x ∈ {4}; rejected candidate -1; principal-root conditions included.
```

Use `KernelResult.status`, `verification`, `conditions`, `steps`, and `errorBound` together. Success from a legacy solver alone does not constitute independent verification. Numerical quadrature and ODE error estimates are consistency estimates, not rigorous global bounds. The assistant displays these details with the answer.

## Supported certified classes

BigInt rational arithmetic, controlled decimal rounding, integer utilities; bounded rational univariate linear/quadratic equations and principal-square-root equations reducing to those classes; polynomial algebra and calculus checked by coefficients; exact unit-circle values and symbolic sine/cosine solution families; coordinate geometry, circle tangency at a supplied point, selected vector/matrix/statistical operations; bracketed roots, Simpson quadrature and scalar RK4 initial-value problems with explicit tolerances.

Expressions enter the existing typed AST parser with node/depth/literal/exponent/expansion budgets. No arbitrary JavaScript evaluator is used. Installed Nerdamer and existing mathematical engines are reused. Longer calculations run in cancellable module workers; each of two pools allows two concurrent workers, with 20-second timeouts and worker recycling. Legacy structured inputs are limited to 2 MB; kernel requests to 200 KB. Worker termination provides a time limit, not a hard heap quota.

## Integration and limits

The shared registry retains existing studio capabilities. `kernel.compute` accepts a serialized KernelRequest; registered legacy mathematical operations use a separate worker transport. Callback-valued legacy inputs cannot be structured-cloned. Native drawings are verified against committed workspace objects; circumcircles follow translated parent triangles and participate in undo/redo. Tangency without a contact point asks a follow-up question.

General parameterized/higher-degree/complex equation solving, unrestricted identities, arbitrary closed-form ODEs, all advanced geometric constraints, and universal proof tutoring are not certified by this kernel. Existing specialist results remain available with explicit unverified status where appropriate. Legacy visual line/segment aliases have not been fully migrated. Internet access is unnecessary while the local asset server is available; this is not a disconnected cold-reload PWA. Existing TensorFlow model weights and measured model accuracy are unchanged.

See `artifacts/ruhi-v51/final-report.md` for evaluation, baseline repository failures, performance and phase coverage.
