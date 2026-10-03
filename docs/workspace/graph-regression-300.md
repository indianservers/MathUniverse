# 2D and 3D graph regression catalog

Added 2026-10-03. The two new suites contain exactly 150 named cases each. These are engine and workspace-model tests; mobile browser interactions are covered separately by the Playwright suites.

Run the 300 cases with `npm run test:graphs:300`.

## Coverage

| Suite | Coverage | Cases |
| --- | --- | ---: |
| 2D | Numerical expressions | 60 |
| 2D | Malformed input and error reporting | 20 |
| 2D | Explicit, sideways, implicit, inequality, point, list, polar and parametric plots | 20 |
| 2D | Advanced graph families | 10 |
| 2D | Value tables and descending ranges | 10 |
| 2D | Zoom limits and fitting | 10 |
| 2D | Intersections | 10 |
| 2D | Variables and built-ins | 10 |
| 3D | Numerical surface expressions | 60 |
| 3D | Malformed input and error reporting | 20 |
| 3D | Bounds, resolution, and non-real domains | 20 |
| 3D | Mesh indexing, finite vertices, and domain holes | 15 |
| 3D | Implicit surfaces | 10 |
| 3D | Space curves | 10 |
| 3D | Parametric surfaces | 10 |
| 3D | Empty, multi-layer, and 150-layer lifecycle | 5 |

## Bugs found and fixed

- Unary minus bound more tightly than powers: `-x^2` evaluated as positive. Exponentiation now takes precedence, including negative exponents.
- Character-based implicit multiplication split `exp` into invalid identifiers. Multiplication is now inserted between parsed tokens, preserving function names.
- Malformed expressions such as `x^`, `sin()`, and `x**2` compiled without errors. Compilation now validates operand counts.
- The mathematical minus sign was rejected by the 3D parser. Shared normalization now accepts it.
- Sideways and parameter expressions such as `x=2y`, `seq(2n,0,4)`, and numeric coefficients on parameters missed replacement. Parameter replacement now handles preceding numbers.
- `sec`, `csc`, `cot`, `sign`, and `sinc` were detected as slider names. They are now recognized as built-ins.
- An older sampler test asserted an obsolete fixed 5,000-point count. It now verifies the 2,400-point budget, endpoints, and numerical accuracy.

## Results

- New matrices: 300/300 passed. First run: 262 passed, 38 failed.
- Expanded unit suite: 373/373 passed.
- Mobile browser tests: 5/5 passed. They check editing, gestures, intersections, layer deletion, undo/redo, clearing, viewport rotation, and built-in function error recovery.
- These checks use Chromium mobile emulation; they do not certify every physical phone or native keyboard.

## Individual cases

| ID and scenario | Result |
| --- | --- |
| 2D-001 numeric 0 at 2 | passed |
| 2D-002 numeric 5 at -3 | passed |
| 2D-003 numeric -7 at 1 | passed |
| 2D-004 numeric x at 3 | passed |
| 2D-005 numeric -x at 3 | passed |
| 2D-006 numeric x+2 at 3 | passed |
| 2D-007 numeric x-2 at 3 | passed |
| 2D-008 numeric 2*x at 3 | passed |
| 2D-009 numeric x/2 at 3 | passed |
| 2D-010 numeric 2x at 3 | passed |
| 2D-011 numeric x^2 at -3 | passed |
| 2D-012 numeric x^3 at -2 | passed |
| 2D-013 numeric x^4 at -2 | passed |
| 2D-014 numeric x^0 at 3 | passed |
| 2D-015 numeric x^-2 at 2 | passed |
| 2D-016 numeric -x^2 at 3 | passed |
| 2D-017 numeric (-x)^2 at 3 | passed |
| 2D-018 numeric 2^3^2 at 0 | passed |
| 2D-019 numeric 2^-3 at 0 | passed |
| 2D-020 numeric -2^2 at 0 | passed |
| 2D-021 numeric sqrt(x) at 9 | passed |
| 2D-022 numeric cbrt(x) at -8 | passed |
| 2D-023 numeric abs(x) at -5 | passed |
| 2D-024 numeric floor(x) at 2.7 | passed |
| 2D-025 numeric ceil(x) at 2.1 | passed |
| 2D-026 numeric round(x) at 2.7 | passed |
| 2D-027 numeric sign(x) at -3 | passed |
| 2D-028 numeric sinc(x) at 0 | passed |
| 2D-029 numeric sin(x) at 0 | passed |
| 2D-030 numeric cos(x) at 0 | passed |
| 2D-031 numeric tan(x) at 0 | passed |
| 2D-032 numeric asin(x) at 0 | passed |
| 2D-033 numeric acos(x) at 1 | passed |
| 2D-034 numeric atan(x) at 0 | passed |
| 2D-035 numeric sinh(x) at 0 | passed |
| 2D-036 numeric cosh(x) at 0 | passed |
| 2D-037 numeric tanh(x) at 0 | passed |
| 2D-038 numeric sec(x) at 0 | passed |
| 2D-039 numeric csc(x) at 1.5707963267948966 | passed |
| 2D-040 numeric cot(x) at 0.7853981633974483 | passed |
| 2D-041 numeric ln(x) at 2.718281828459045 | passed |
| 2D-042 numeric log(x) at 100 | passed |
| 2D-043 numeric exp(x) at 0 | passed |
| 2D-044 numeric pi at 0 | passed |
| 2D-045 numeric e at 0 | passed |
| 2D-046 numeric sin(pi/2) at 0 | passed |
| 2D-047 numeric 2(x+1) at 2 | passed |
| 2D-048 numeric (x+1)(x-1) at 3 | passed |
| 2D-049 numeric x(x+1) at 2 | passed |
| 2D-050 numeric x² at 3 | passed |
| 2D-051 numeric x³ at 2 | passed |
| 2D-052 numeric X^2 at 3 | passed |
| 2D-053 numeric SIN(X) at 0 | passed |
| 2D-054 numeric 3×x at 2 | passed |
| 2D-055 numeric x÷2 at 6 | passed |
| 2D-056 numeric x−2 at 5 | passed |
| 2D-057 numeric 1/(1+x^2) at 2 | passed |
| 2D-058 numeric sqrt(abs(x)) at -9 | passed |
| 2D-059 numeric exp(ln(x)) at 2 | passed |
| 2D-060 numeric sin(x)^2+cos(x)^2 at 1 | passed |
| 2D-061 invalid "" | passed |
| 2D-062 invalid "x^" | passed |
| 2D-063 invalid "x+" | passed |
| 2D-064 invalid "*x" | passed |
| 2D-065 invalid "x/" | passed |
| 2D-066 invalid "sin()" | passed |
| 2D-067 invalid "()" | passed |
| 2D-068 invalid "(x" | passed |
| 2D-069 invalid "x)" | passed |
| 2D-070 invalid "x..2" | passed |
| 2D-071 invalid "." | passed |
| 2D-072 invalid "sqrt()" | passed |
| 2D-073 invalid "unknown(x)" | passed |
| 2D-074 invalid "x=" | passed |
| 2D-075 invalid "x**2" | passed |
| 2D-076 invalid "x//2" | passed |
| 2D-077 invalid "x^^2" | passed |
| 2D-078 invalid "1,2" | passed |
| 2D-079 invalid "window" | passed |
| 2D-080 invalid "x;alert(1)" | passed |
| 2D-081 plot Y^2 | passed |
| 2D-082 plot y² | passed |
| 2D-083 plot X=Y^2 | passed |
| 2D-084 plot x=y^3 | passed |
| 2D-085 plot x=2y | passed |
| 2D-086 plot y=x^2 | passed |
| 2D-087 plot Y=X^3 | passed |
| 2D-088 plot x^2+y^2=4 | passed |
| 2D-089 plot Y^2=X | passed |
| 2D-090 plot x*y=1 | passed |
| 2D-091 plot y<x | passed |
| 2D-092 plot y>=x^2 | passed |
| 2D-093 plot x<2 | passed |
| 2D-094 plot x>=-1 | passed |
| 2D-095 plot (2,3) | passed |
| 2D-096 plot (-2,-3) | passed |
| 2D-097 plot [1,2,3] | passed |
| 2D-098 plot (0,0);(1,1) | passed |
| 2D-099 plot x=cos(t),y=sin(t) | passed |
| 2D-100 plot r=2 | passed |
| 2D-101 advanced seq(n^2,1,5) | passed |
| 2D-102 advanced seq(2n,0,4) | passed |
| 2D-103 advanced recur(1,prev+1,5) | passed |
| 2D-104 advanced cobweb(0.5,x/2,5) | passed |
| 2D-105 advanced contour(x^2+y^2,1;4) | passed |
| 2D-106 advanced vector(-y,x) | passed |
| 2D-107 advanced slope(x-y) | passed |
| 2D-108 advanced param(cos(t),sin(t),0,pi) | passed |
| 2D-109 advanced r=2,theta=0..pi | passed |
| 2D-110 advanced param(t,t^2,-2,2) | passed |
| 2D-111 table x -2..2 | passed |
| 2D-112 table x^2 -3..3 | passed |
| 2D-113 table sin(x) 0..3 | passed |
| 2D-114 table 2x 2..-2 | passed |
| 2D-115 table 5 0..2 | passed |
| 2D-116 table sqrt(x) 0..4 | passed |
| 2D-117 table 1/x -2..2 | passed |
| 2D-118 table abs(x) -1..1 | passed |
| 2D-119 table x^3 0..2 | passed |
| 2D-120 table cos(x) 3..0 | passed |
| 2D-121 view zoom 0.1 | passed |
| 2D-122 view zoom 0.5 | passed |
| 2D-123 view zoom 0.8 | passed |
| 2D-124 view zoom 1 | passed |
| 2D-125 view zoom 1.25 | passed |
| 2D-126 view zoom 2 | passed |
| 2D-127 view zoom 10 | passed |
| 2D-128 view zoom 1e-10 | passed |
| 2D-129 view zoom 10000000000 | passed |
| 2D-130 view zoom 0 | passed |
| 2D-131 intersection y=x with y=-5 | passed |
| 2D-132 intersection y=x with y=-4 | passed |
| 2D-133 intersection y=x with y=-3 | passed |
| 2D-134 intersection y=x with y=-2 | passed |
| 2D-135 intersection y=x with y=-1 | passed |
| 2D-136 intersection y=x with y=0 | passed |
| 2D-137 intersection y=x with y=1 | passed |
| 2D-138 intersection y=x with y=2 | passed |
| 2D-139 intersection y=x with y=3 | passed |
| 2D-140 intersection y=x with y=4 | passed |
| 2D-141 variables a*x | passed |
| 2D-142 variables b+x | passed |
| 2D-143 variables c*x^2 | passed |
| 2D-144 variables d*sin(x) | passed |
| 2D-145 variables k+x | passed |
| 2D-146 variables sec(x) | passed |
| 2D-147 variables csc(x) | passed |
| 2D-148 variables cot(x) | passed |
| 2D-149 variables sign(x) | passed |
| 2D-150 variables sinc(x) | passed |
| 3D-001 numeric z=0 at 2 | passed |
| 3D-002 numeric z=5 at -3 | passed |
| 3D-003 numeric z=-7 at 1 | passed |
| 3D-004 numeric z=x at 3 | passed |
| 3D-005 numeric z=-x at 3 | passed |
| 3D-006 numeric z=x+2 at 3 | passed |
| 3D-007 numeric z=x-2 at 3 | passed |
| 3D-008 numeric z=2*x at 3 | passed |
| 3D-009 numeric z=x/2 at 3 | passed |
| 3D-010 numeric z=2x at 3 | passed |
| 3D-011 numeric z=x^2 at -3 | passed |
| 3D-012 numeric z=x^3 at -2 | passed |
| 3D-013 numeric z=x^4 at -2 | passed |
| 3D-014 numeric z=x^0 at 3 | passed |
| 3D-015 numeric z=x^-2 at 2 | passed |
| 3D-016 numeric z=-x^2 at 3 | passed |
| 3D-017 numeric z=(-x)^2 at 3 | passed |
| 3D-018 numeric z=2^3^2 at 0 | passed |
| 3D-019 numeric z=2^-3 at 0 | passed |
| 3D-020 numeric z=-2^2 at 0 | passed |
| 3D-021 numeric z=sqrt(x) at 9 | passed |
| 3D-022 numeric z=cbrt(x) at -8 | passed |
| 3D-023 numeric z=abs(x) at -5 | passed |
| 3D-024 numeric z=floor(x) at 2.7 | passed |
| 3D-025 numeric z=ceil(x) at 2.1 | passed |
| 3D-026 numeric z=round(x) at 2.7 | passed |
| 3D-027 numeric z=sign(x) at -3 | passed |
| 3D-028 numeric z=sinc(x) at 0 | passed |
| 3D-029 numeric z=sin(x) at 0 | passed |
| 3D-030 numeric z=cos(x) at 0 | passed |
| 3D-031 numeric z=tan(x) at 0 | passed |
| 3D-032 numeric z=asin(x) at 0 | passed |
| 3D-033 numeric z=acos(x) at 1 | passed |
| 3D-034 numeric z=atan(x) at 0 | passed |
| 3D-035 numeric z=sinh(x) at 0 | passed |
| 3D-036 numeric z=cosh(x) at 0 | passed |
| 3D-037 numeric z=tanh(x) at 0 | passed |
| 3D-038 numeric z=sec(x) at 0 | passed |
| 3D-039 numeric z=csc(x) at 1.5707963267948966 | passed |
| 3D-040 numeric z=cot(x) at 0.7853981633974483 | passed |
| 3D-041 numeric z=ln(x) at 2.718281828459045 | passed |
| 3D-042 numeric z=log(x) at 100 | passed |
| 3D-043 numeric z=exp(x) at 0 | passed |
| 3D-044 numeric z=pi at 0 | passed |
| 3D-045 numeric z=e at 0 | passed |
| 3D-046 numeric z=sin(pi/2) at 0 | passed |
| 3D-047 numeric z=2(x+1) at 2 | passed |
| 3D-048 numeric z=(x+1)(x-1) at 3 | passed |
| 3D-049 numeric z=x(x+1) at 2 | passed |
| 3D-050 numeric z=x² at 3 | passed |
| 3D-051 numeric z=x³ at 2 | passed |
| 3D-052 numeric z=X^2 at 3 | passed |
| 3D-053 numeric z=SIN(X) at 0 | passed |
| 3D-054 numeric z=3×x at 2 | passed |
| 3D-055 numeric z=x÷2 at 6 | passed |
| 3D-056 numeric z=x−2 at 5 | passed |
| 3D-057 numeric z=1/(1+x^2) at 2 | passed |
| 3D-058 numeric z=sqrt(abs(x)) at -9 | passed |
| 3D-059 numeric z=exp(ln(x)) at 2 | passed |
| 3D-060 numeric z=sin(x)^2+cos(x)^2 at 1 | passed |
| 3D-061 invalid "" | passed |
| 3D-062 invalid "x^" | passed |
| 3D-063 invalid "x+" | passed |
| 3D-064 invalid "*x" | passed |
| 3D-065 invalid "x/" | passed |
| 3D-066 invalid "sin()" | passed |
| 3D-067 invalid "()" | passed |
| 3D-068 invalid "(x" | passed |
| 3D-069 invalid "x)" | passed |
| 3D-070 invalid "x..2" | passed |
| 3D-071 invalid "." | passed |
| 3D-072 invalid "sqrt()" | passed |
| 3D-073 invalid "unknown(x)" | passed |
| 3D-074 invalid "x=" | passed |
| 3D-075 invalid "x**2" | passed |
| 3D-076 invalid "x//2" | passed |
| 3D-077 invalid "x^^2" | passed |
| 3D-078 invalid "1,2" | passed |
| 3D-079 invalid "window" | passed |
| 3D-080 invalid "x;alert(1)" | passed |
| 3D-081 bounds x+y [-2,2] [-3,3] n=8 | passed |
| 3D-082 bounds x-y [2,-2] [3,-3] n=10 | passed |
| 3D-083 bounds x*y [-1,1] [-2,2] n=12 | passed |
| 3D-084 bounds Y^2 [-2,2] [-3,3] n=8 | passed |
| 3D-085 bounds Z=X+Y [-2,2] [-3,3] n=8 | passed |
| 3D-086 bounds x+y [-2,2] [-3,3] n=1 | passed |
| 3D-087 bounds x+y [-2,2] [-3,3] n=100 | passed |
| 3D-088 bounds x+y [-2,2] [-3,3] n=8.5 | passed |
| 3D-089 bounds x+y [0,0] [-3,3] n=8 | passed |
| 3D-090 bounds x+y [-2,2] [0,0] n=8 | passed |
| 3D-091 bounds x+y [NaN,2] [-3,3] n=8 | passed |
| 3D-092 bounds x+y [-2,Infinity] [-3,3] n=8 | passed |
| 3D-093 bounds x+y [-2,2] [NaN,3] n=8 | passed |
| 3D-094 bounds x+y [-2,2] [-3,Infinity] n=8 | passed |
| 3D-095 bounds x+y [-2,2] [-3,3] n=NaN | passed |
| 3D-096 bounds x+y [-2,2] [-3,3] n=Infinity | passed |
| 3D-097 bounds sqrt(-1) [-2,2] [-3,3] n=8 | passed |
| 3D-098 bounds sqrt(x) [-2,2] [-3,3] n=8 | passed |
| 3D-099 bounds 1/(x-y) [-2,2] [-2,2] n=9 | passed |
| 3D-100 bounds ln(x) [-2,2] [-3,3] n=8 | passed |
| 3D-101 mesh 0 | passed |
| 3D-102 mesh 1 | passed |
| 3D-103 mesh x | passed |
| 3D-104 mesh y | passed |
| 3D-105 mesh x+y | passed |
| 3D-106 mesh x-y | passed |
| 3D-107 mesh x*y | passed |
| 3D-108 mesh x^2+y^2 | passed |
| 3D-109 mesh x^2-y^2 | passed |
| 3D-110 mesh sin(x)*cos(y) | passed |
| 3D-111 mesh sqrt(x) | passed |
| 3D-112 mesh sqrt(y) | passed |
| 3D-113 mesh ln(x) | passed |
| 3D-114 mesh 1/x | passed |
| 3D-115 mesh sqrt(-1) | passed |
| 3D-116 implicit x=0 | passed |
| 3D-117 implicit y=0 | passed |
| 3D-118 implicit z=0 | passed |
| 3D-119 implicit x+y+z=0 | passed |
| 3D-120 implicit x^2+y^2+z^2=1 | passed |
| 3D-121 implicit x^2+y^2=1 | passed |
| 3D-122 implicit x*y-z=0 | passed |
| 3D-123 implicit X+Y+Z=0 | passed |
| 3D-124 implicit x^2-y^2-z=0 | passed |
| 3D-125 implicit sin(x)+y-z=0 | passed |
| 3D-126 curve z=t | passed |
| 3D-127 curve z=t^2 | passed |
| 3D-128 curve z=t^3 | passed |
| 3D-129 curve z=sin(t) | passed |
| 3D-130 curve z=cos(t) | passed |
| 3D-131 curve z=0 | passed |
| 3D-132 curve z=2*t | passed |
| 3D-133 curve z=-t | passed |
| 3D-134 curve z=abs(t) | passed |
| 3D-135 curve z=exp(t) | passed |
| 3D-136 parametric z=0 | passed |
| 3D-137 parametric z=u | passed |
| 3D-138 parametric z=v | passed |
| 3D-139 parametric z=u+v | passed |
| 3D-140 parametric z=u*v | passed |
| 3D-141 parametric z=u^2+v^2 | passed |
| 3D-142 parametric z=sin(u)*cos(v) | passed |
| 3D-143 parametric z=-u^2 | passed |
| 3D-144 parametric z=sqrt(abs(u)) | passed |
| 3D-145 parametric z=exp(u) | passed |
| 3D-146 layer lifecycle 0 surfaces | passed |
| 3D-147 layer lifecycle 1 surfaces | passed |
| 3D-148 layer lifecycle 2 surfaces | passed |
| 3D-149 layer lifecycle 12 surfaces | passed |
| 3D-150 layer lifecycle 150 surfaces | passed |
