export type Family = 'Pythagorean' | 'Angle Sum' | 'Double Angle' | 'Half Angle' | 'Product-Sum' | 'Complementary' | 'Negative Angles' | 'Triple Angle' | 'Sum-Product';
export type ProofStep = { equation: string; reason: string; rule: string; scene: string };
export type Identity = { id: string; family: Family; label: string; latex: string; keywords: string; fn: 'sin' | 'cos' | 'tan'; twoAngles: boolean; lhs: (a: number, b: number) => number; rhs: (a: number, b: number) => number; domain: string; intuition: string; steps: ProofStep[] };
const sin = Math.sin, cos = Math.cos;
export const rad = (a: number) => a * Math.PI / 180;
export const nearZero = (n: number) => Math.abs(n) < 1e-10;
export const safeDivide = (a: number, b: number) => nearZero(b) ? NaN : a / b;
const tan = (a: number) => safeDivide(sin(a), cos(a));
const cot = (a: number) => safeDivide(cos(a), sin(a));
const secSquared=(x:number)=>nearZero(cos(x))?NaN:1/cos(x)**2;
const cscSquared=(x:number)=>nearZero(sin(x))?NaN:1/sin(x)**2;
export const families: Family[] = ['Pythagorean', 'Angle Sum', 'Double Angle', 'Half Angle', 'Product-Sum', 'Complementary', 'Negative Angles', 'Triple Angle', 'Sum-Product'];
const step = (equation: string, reason: string, rule: string, scene: string): ProofStep => ({ equation, reason, rule, scene });
const all = 'All real angles.';
const s = '\\sin', c = '\\cos', t = '\\tan', a = '\\theta', b = '\\varphi';
const identity = (id: string, family: Family, label: string, latex: string, lhs: Identity['lhs'], rhs: Identity['rhs'], domain: string, intuition: string, steps: ProofStep[], fn: Identity['fn'] = 'sin', twoAngles = false, keywords = ''): Identity => ({ id, family, label, latex, lhs, rhs, domain, intuition, steps, fn, twoAngles, keywords });
const baseSteps = [step('x^2+y^2=r^2', 'Pythagoras applies to the horizontal and vertical lengths, even when coordinates are negative.', 'Pythagoras', 'triangle'), step(`x=${c}${a},\\quad y=${s}${a},\\quad r=1`, 'A point on the unit circle has these coordinates.', 'Substitute coordinates', 'projections'), step(`${c}^2${a}+${s}^2${a}=1`, 'Squaring removes coordinate signs; the squared lengths fill one unit of area.', 'Simplify', 'area')];
const sumSteps = (fn: 'sin' | 'cos' | 'tan', sign: '+' | '-') => {
  const plus = sign === '+'; const op = plus ? '+' : '-';
  const eq = fn === 'sin' ? `${s}(${a}${op}${b})=${s}${a}${c}${b}${op}${c}${a}${s}${b}` : fn === 'cos' ? `${c}(${a}${op}${b})=${c}${a}${c}${b}${plus ? '-' : '+'}${s}${a}${s}${b}` : `${t}(${a}${op}${b})=\\frac{${t}${a}${op}${t}${b}}{1${plus ? '-' : '+'}${t}${a}${t}${b}}`;
  return [step(`R(${a})R(${plus ? b : `-${b}`})=R(${a}${op}${b})`, 'Compose two rotations; subtracting an angle reverses the second rotation.', 'Compose rotations', 'rays'), step(`R(u)=\\begin{pmatrix}${c} u&-${s} u\\\\${s} u&${c} u\\end{pmatrix}`, 'Resolve each vector into horizontal and vertical components.', 'Resolve components', 'projections'), step(eq, fn === 'tan' ? 'Divide vertical by horizontal components, then by cos θ cos φ on the stated common domain.' : 'Collect the appropriate components of the rotated vector.', fn === 'tan' ? 'Divide with domain check' : 'Collect components', 'result')];
};
export const identities: Identity[] = [
  identity('pythagorean', 'Pythagorean', 'sin²θ + cos²θ = 1', `${s}^2${a}+${c}^2${a}=1`, x => sin(x)**2+cos(x)**2, () => 1, all, 'The two squared leg lengths add to the squared unit radius.', baseSteps),
  identity('secant', 'Pythagorean', '1 + tan²θ = sec²θ', `1+${t}^2${a}=\\sec^2${a}`, x => 1+tan(x)**2, secSquared, 'cos θ ≠ 0; θ ≠ 90° + 180°k (π/2 + kπ).', 'Scale the unit triangle by 1/|cos θ|: its adjacent leg becomes 1.', [...baseSteps.slice(0,1), step(`\\frac{${c}^2${a}+${s}^2${a}}{${c}^2${a}}=\\frac1{${c}^2${a}}`, 'Divide both sides by cos²θ only when cos θ ≠ 0.', 'Divide by cos²θ', 'scaled'), step(`1+${t}^2${a}=\\sec^2${a}`, 'Use tan θ = sin θ/cos θ and sec θ = 1/cos θ.', 'Use reciprocal ratios', 'area')], 'tan', false, 'sec secant'),
  identity('cosecant', 'Pythagorean', '1 + cot²θ = csc²θ', `1+\\cot^2${a}=\\csc^2${a}`, x => 1+cot(x)**2, cscSquared, 'sin θ ≠ 0; θ ≠ 180°k (kπ).', 'Scale the unit triangle by 1/|sin θ|: its opposite leg becomes 1.', [...baseSteps.slice(0,1), step(`\\frac{${c}^2${a}+${s}^2${a}}{${s}^2${a}}=\\frac1{${s}^2${a}}`, 'Divide by sin²θ only when sin θ ≠ 0.', 'Divide by sin²θ', 'scaled'), step(`1+\\cot^2${a}=\\csc^2${a}`, 'Use cotangent and cosecant definitions.', 'Use reciprocal ratios', 'area')], 'tan', false, 'cosec cosecant cotangent'),
];
for (const sign of ['+', '-'] as const) for (const fn of ['sin','cos','tan'] as const) {
  const plus = sign === '+', f = fn === 'sin' ? sin : fn === 'cos' ? cos : tan;
  identities.push(identity(`${fn}-${plus ? 'sum' : 'difference'}`, 'Angle Sum', `${fn}(θ ${sign} φ)`, sumSteps(fn,sign).at(-1)!.equation, (x,y) => f(x+(plus ? y : -y)), (x,y) => fn === 'sin' ? sin(x)*cos(y)+(plus ? 1 : -1)*cos(x)*sin(y) : fn === 'cos' ? cos(x)*cos(y)-(plus ? 1 : -1)*sin(x)*sin(y) : safeDivide(tan(x)+(plus ? 1 : -1)*tan(y),1-(plus ? 1 : -1)*tan(x)*tan(y)), fn === 'tan' ? `cos θ, cos φ and cos(θ ${sign} φ) must all be nonzero.` : all, 'Compose rotations and track their projections to see why the cross terms appear.', sumSteps(fn,sign), fn, true));
}
for (const fn of ['sin','cos','tan'] as const) {
  const form = fn === 'sin' ? `${s}2${a}=2${s}${a}${c}${a}` : fn === 'cos' ? `${c}2${a}=${c}^2${a}-${s}^2${a}` : `${t}2${a}=\\frac{2${t}${a}}{1-${t}^2${a}}`;
  identities.push(identity(`double-${fn}`, 'Double Angle', `${fn} 2θ`, form, x => fn === 'sin' ? sin(2*x) : fn === 'cos' ? cos(2*x) : tan(2*x), x => fn === 'sin' ? 2*sin(x)*cos(x) : fn === 'cos' ? cos(x)**2-sin(x)**2 : safeDivide(2*tan(x),1-tan(x)**2), fn === 'tan' ? 'Common domain: cos θ ≠ 0 and cos 2θ ≠ 0. LHS alone exists at θ = 90° + 180°k; its tan-θ RHS does not.' : all, fn === 'sin' ? 'Two equal cross terms give the coefficient 2; doubling the angle does not double its sine.' : fn === 'cos' ? 'The horizontal projection of the second rotation is a difference of squared components.' : 'The doubled angle has a slope; expressing it with tan θ introduces an additional restriction.', [sumSteps(fn,'+').at(-1)!, step(`${b}=${a}`, 'Set the second angle equal to the first.', 'Set φ = θ', 'rays'), step(form, fn === 'tan' ? 'Simplify only where both tan θ and tan 2θ exist.' : 'Combine the matching products.', 'Simplify', 'result')], fn));
}
for (const variant of ['cos','sin'] as const) identities.push(identity(`double-cos-${variant}`, 'Double Angle', variant === 'cos' ? 'cos 2θ = 2cos²θ − 1' : 'cos 2θ = 1 − 2sin²θ', `${c}2${a}=${variant === 'cos' ? `2${c}^2${a}-1` : `1-2${s}^2${a}`}`, x=>cos(2*x), x=>variant === 'cos' ? 2*cos(x)**2-1 : 1-2*sin(x)**2, all, 'Pythagoras replaces one squared term with 1 minus the other.', [step(`${c}2${a}=${c}^2${a}-${s}^2${a}`, 'Start with the cosine double-angle formula.', 'Double-angle identity', 'rays'), step(variant === 'cos' ? `${s}^2${a}=1-${c}^2${a}` : `${c}^2${a}=1-${s}^2${a}`, 'Rearrange Pythagoras.', 'Pythagorean substitution', 'area'), step(`${c}2${a}=${variant === 'cos' ? `2${c}^2${a}-1` : `1-2${s}^2${a}`}`, 'Collect the squared terms.', 'Simplify', 'result')], 'cos'));
for (const fn of ['sin','cos'] as const) {
  const isSin = fn === 'sin', f = isSin ? sin : cos, sign = isSin ? '-' : '+';
  const squared = `${isSin?s:c}^2\\frac{${a}}2=\\frac{1${sign}${c}${a}}2`;
  const halfSteps = [step(isSin ? `${c}${a}=1-2${s}^2\\frac{${a}}2` : `${c}${a}=2${c}^2\\frac{${a}}2-1`, 'Apply cosine double angle with u = θ/2.', 'Double-angle identity', 'rays'), step(isSin ? `2${s}^2\\frac{${a}}2=1-${c}${a}` : `2${c}^2\\frac{${a}}2=1+${c}${a}`, 'Isolate the squared half-angle term.', 'Rearrange', 'projections'), step(squared, 'Divide both sides by 2. No square-root sign is needed for a squared quantity.', 'Divide by 2', 'area')];
  identities.push(identity(`half-${fn}-squared`, 'Half Angle', `${fn}²(θ/2)`, squared, x=>f(x/2)**2, x=>(1+(isSin?-1:1)*cos(x))/2, all, 'Reverse a cosine double-angle formula to recover a squared half-angle value.', halfSteps, fn));
  identities.push(identity(`half-${fn}`, 'Half Angle', `${fn}(θ/2), signed root`, `${isSin?s:c}\\frac{${a}}2=\\pm\\sqrt{\\frac{1${sign}${c}${a}}2}`, x=>f(x/2), x=>Math.sign(f(x/2))*Math.sqrt(Math.max(0,(1+(isSin?-1:1)*cos(x))/2)), 'All real θ; choose + or − from the quadrant of θ/2, not θ.', 'The square determines magnitude; the half-angle quadrant determines its sign.', [...halfSteps,step(`${isSin?s:c}\\frac{${a}}2=\\pm\\sqrt{\\frac{1${sign}${c}${a}}2}`, 'Choose the sign of the function at θ/2; at an axis the value may be zero.', 'Choose quadrant sign', 'result')],fn));
}
for (const variant of ['ratio','reciprocal','root'] as const) {
  const right = variant === 'ratio' ? `${s}${a}/(1+${c}${a})` : variant === 'reciprocal' ? `(1-${c}${a})/${s}${a}` : `\\pm\\sqrt{\\frac{1-${c}${a}}{1+${c}${a}}}`;
  identities.push(identity(`half-tan-${variant}`, 'Half Angle', `tan(θ/2): ${variant === 'root' ? 'signed root' : variant === 'ratio' ? 'sin θ / (1 + cos θ)' : '(1 − cos θ) / sin θ'}`, `${t}\\frac{${a}}2=${right}`, x=>tan(x/2), x=>variant === 'ratio' ? safeDivide(sin(x),1+cos(x)) : variant === 'reciprocal' ? safeDivide(1-cos(x),sin(x)) : Math.sign(tan(x/2))*Math.sqrt(safeDivide(1-cos(x),1+cos(x))), variant === 'reciprocal' ? 'sin θ ≠ 0 for this RHS; also cos(θ/2) ≠ 0 for the LHS.' : '1 + cos θ ≠ 0; choose the root sign from θ/2 for the square-root form.', 'Use half-angle sine and cosine to express their ratio.', [step(`${t}\\frac{${a}}2=\\frac{${s}(${a}/2)}{${c}(${a}/2)}`, 'Tangent is the ratio of sine to cosine.', 'Use ratio definition', 'rays'), step(variant==='root' ? `${t}^2\\frac{${a}}2=\\frac{1-${c}${a}}{1+${c}${a}}` : variant==='ratio' ? `${s}${a}=2${s}(${a}/2)${c}(${a}/2),\\quad 1+${c}${a}=2${c}^2(${a}/2)` : `1-${c}${a}=2${s}^2(${a}/2),\\quad ${s}${a}=2${s}(${a}/2)${c}(${a}/2)`, 'Substitute double-angle formulas and preserve denominator restrictions.', 'Double-angle substitution', 'projections'), step(`${t}\\frac{${a}}2=${right}`, variant==='root' ? 'Choose the sign using the quadrant of θ/2.' : 'Cancel common factors only when nonzero.', variant==='root' ? 'Choose quadrant sign' : 'Cancel with domain check', 'result')], 'tan'));
}
const products = [
  ['sin-cos','2 sin θ cos φ',`${s}(${a}+${b})+${s}(${a}-${b})`,(x:number,y:number)=>2*sin(x)*cos(y),(x:number,y:number)=>sin(x+y)+sin(x-y),'sin','Add equations'],
  ['cos-sin','2 cos θ sin φ',`${s}(${a}+${b})-${s}(${a}-${b})`,(x:number,y:number)=>2*cos(x)*sin(y),(x:number,y:number)=>sin(x+y)-sin(x-y),'sin','Subtract equations'],
  ['cos-cos','2 cos θ cos φ',`${c}(${a}+${b})+${c}(${a}-${b})`,(x:number,y:number)=>2*cos(x)*cos(y),(x:number,y:number)=>cos(x+y)+cos(x-y),'cos','Add equations'],
  ['sin-sin','2 sin θ sin φ',`${c}(${a}-${b})-${c}(${a}+${b})`,(x:number,y:number)=>2*sin(x)*sin(y),(x:number,y:number)=>cos(x-y)-cos(x+y),'cos','Subtract equations'],
] as const;
for (const [id,label,right,lhs,rhs,fn,rule] of products) identities.push(identity(`product-${id}`,'Product-Sum',label,`${label.replaceAll('sin',s).replaceAll('cos',c).replaceAll('θ',a).replaceAll('φ',b)}=${right}`,lhs,rhs,all,'Two shifted waves add or subtract to reproduce a product; matching terms reinforce while opposite terms cancel.',[sumSteps(fn,'+').at(-1)!,sumSteps(fn,'-').at(-1)!,step(`${label.replaceAll('sin',s).replaceAll('cos',c).replaceAll('θ',a).replaceAll('φ',b)}=${right}`, 'Combine the sum and difference equations; cancel opposite terms.',rule,'waves')],fn,true));

// Fifteen additional searchable identities: four cofunctions, four parity rules,
// three triple-angle identities, and four sum-to-product transformations.
for(const fn of ['sin','cos','tan','cot'] as const) {
  const f=fn==='sin'?sin:fn==='cos'?cos:fn==='tan'?tan:cot;
  const partner=fn==='sin'?'cos':fn==='cos'?'sin':fn==='tan'?'cot':'tan';
  const g=partner==='sin'?sin:partner==='cos'?cos:partner==='tan'?tan:cot;
  const formula=`\\${fn}(\\pi/2-${a})=\\${partner}${a}`;
  identities.push(identity(`complement-${fn}`,'Complementary',`${fn}(90° − θ) = ${partner} θ`,formula,x=>f(Math.PI/2-x),x=>g(x),fn==='tan'?'sin θ ≠ 0.':fn==='cot'?'cos θ ≠ 0.':all,'A quarter-turn exchanges horizontal and vertical projections.',[step(`u=\\pi/2-${a}`, 'Express the complementary angle as a quarter-turn minus θ.','Set complementary angle','rays'),step(`\\sin(\\pi/2)=1,\\quad\\cos(\\pi/2)=0`, 'Use the quarter-turn coordinates in the difference formulas.','Substitute special angle','projections'),step(formula,'Simplify the surviving projection; for tangent and cotangent use their ratios on the stated domain.','Simplify','result')],fn==='cot'?'tan':fn,false,`cofunction complementary ${partner}`));
}
for(const fn of ['sin','cos','tan','cot'] as const) {
  const f=fn==='sin'?sin:fn==='cos'?cos:fn==='tan'?tan:cot, odd=fn!=='cos';
  const formula=`\\${fn}(-${a})=${odd?'-':''}\\${fn}${a}`;
  identities.push(identity(`negative-${fn}`,'Negative Angles',`${fn}(−θ) = ${odd?'−':''}${fn} θ`,formula,x=>f(-x),x=>(odd?-1:1)*f(x),fn==='tan'?'cos θ ≠ 0.':fn==='cot'?'sin θ ≠ 0.':all,'Reflection across the x-axis reverses the vertical coordinate and preserves the horizontal coordinate.',[step(`P(${a})=(${c}${a},${s}${a})`, 'Begin with the point on the unit circle.','Substitute coordinates','rays'),step(`P(-${a})=(${c}${a},-${s}${a})`, 'Reflect across the horizontal axis.','Reflect across x-axis','projections'),step(formula,odd?'The sine coordinate or slope changes sign.':'The cosine coordinate is unchanged.','Simplify','result')],fn==='cot'?'tan':fn,false,'parity odd even reflection'));
}
for(const fn of ['sin','cos','tan'] as const) {
  const f=fn==='sin'?sin:fn==='cos'?cos:tan;
  const right=fn==='sin'?`3${s}${a}-4${s}^3${a}`:fn==='cos'?`4${c}^3${a}-3${c}${a}`:`\\frac{3${t}${a}-${t}^3${a}}{1-3${t}^2${a}}`;
  const formula=`\\${fn}3${a}=${right}`;
  identities.push(identity(`triple-${fn}`,'Triple Angle',`${fn} 3θ`,formula,x=>f(3*x),x=>fn==='sin'?3*sin(x)-4*sin(x)**3:fn==='cos'?4*cos(x)**3-3*cos(x):safeDivide(3*tan(x)-tan(x)**3,1-3*tan(x)**2),fn==='tan'?'Common domain: cos θ ≠ 0 and cos 3θ ≠ 0.':all,'Compose a double rotation with one more copy of the original angle.',[step(`\\${fn}3${a}=\\${fn}(2${a}+${a})`, 'Split the triple angle into a double angle plus θ.','Split angle','rays'),step(fn==='tan'?`${t}(2${a}+${a})=\\frac{${s}3${a}}{${c}3${a}}`:`\\${fn}(2${a}+${a})=${fn==='sin'?`${s}2${a}${c}${a}+${c}2${a}${s}${a}`:`${c}2${a}${c}${a}-${s}2${a}${s}${a}`}`, 'Expand the angle sum, using sine and cosine components for the tangent ratio.','Angle-sum expansion','projections'),step(formula,'Substitute double-angle formulas and Pythagoras, then collect powers on the common domain.','Double-angle substitution','result')],fn,false,'triple cubic'));
}
const sums=[
 ['sin-add','sin θ + sin φ',`${s}${a}+${s}${b}=2${s}\\frac{${a}+${b}}2${c}\\frac{${a}-${b}}2`,(x:number,y:number)=>sin(x)+sin(y),(x:number,y:number)=>2*sin((x+y)/2)*cos((x-y)/2),'sin'],
 ['sin-subtract','sin θ − sin φ',`${s}${a}-${s}${b}=2${c}\\frac{${a}+${b}}2${s}\\frac{${a}-${b}}2`,(x:number,y:number)=>sin(x)-sin(y),(x:number,y:number)=>2*cos((x+y)/2)*sin((x-y)/2),'sin'],
 ['cos-add','cos θ + cos φ',`${c}${a}+${c}${b}=2${c}\\frac{${a}+${b}}2${c}\\frac{${a}-${b}}2`,(x:number,y:number)=>cos(x)+cos(y),(x:number,y:number)=>2*cos((x+y)/2)*cos((x-y)/2),'cos'],
 ['cos-subtract','cos θ − cos φ',`${c}${a}-${c}${b}=-2${s}\\frac{${a}+${b}}2${s}\\frac{${a}-${b}}2`,(x:number,y:number)=>cos(x)-cos(y),(x:number,y:number)=>-2*sin((x+y)/2)*sin((x-y)/2),'cos'],
] as const;
for(const [id,label,formula,lhs,rhs,fn] of sums) identities.push(identity(`sum-product-${id}`,'Sum-Product',label,formula,lhs,rhs,all,'The average angle and half-difference reorganize two waves into a product.',[step(`u=\\frac{${a}+${b}}2,\\quad v=\\frac{${a}-${b}}2`, 'Choose the average angle and half-difference.','Substitute average angles','rays'),step(`${a}=u+v,\\quad${b}=u-v`, 'The two original angles are a sum and difference.','Rearrange','projections'),step(formula,'Apply the matching product-to-sum formula in reverse.','Reverse product-to-sum','waves')],fn,true,'sum to product sum-to-product'));

export function evaluateIdentity(item: Identity, theta: number, phi: number) {
  const x=rad(theta), y=rad(phi), lhs=item.lhs(x,y), rhs=item.rhs(x,y);
  const comparable=Number.isFinite(lhs)&&Number.isFinite(rhs);
  return { lhs, rhs, comparable, error: comparable ? Math.abs(lhs-rhs) : null, matches: comparable && Math.abs(lhs-rhs)<1e-8*Math.max(1,Math.abs(lhs),Math.abs(rhs)) };
}
export function decimal(n: number, digits=6) { return Number.isFinite(n) ? Number(n.toFixed(digits)).toString() : 'undefined'; }
export function colorFormula(latex: string) {
  return latex.replace(/\\(sin|cos|tan|cot|sec|csc)\b/g, (_match,fn:string)=>`{\\color{${fn==='sin'||fn==='csc'?'#7c3aed':fn==='cos'||fn==='sec'?'#0891b2':'#b45309'}}\\${fn}}`);
}
export function searchIdentities(query: string, family: Family|'All identities'='All identities') {
  const normalize=(text:string)=>text.toLowerCase().replaceAll('θ','theta').replaceAll('φ','phi').replaceAll('²','^2').replaceAll('³','^3').replaceAll('−','-').replace(/\s/g,'');
  const needle=normalize(query.trim());
  return identities.filter(i=>(family==='All identities'||i.family===family)&&normalize(`${i.label} ${i.family} ${i.keywords}`).includes(needle));
}
export function unitText(text: string, units:'deg'|'rad') {
  return units==='deg'?text:text.replace(/(-?\d+(?:\.\d+)?)°/g,(_match,degrees:string)=>angleLabel(Number(degrees),'rad').replace(' rad',''));
}
// Exact labels require a supported special angle AND a tight numeric match, never proximity alone.
export function exactValue(n: number, angles: number[]): string | null {
  if (!Number.isFinite(n)||!angles.every(x=>Math.abs(x/15-Math.round(x/15))<1e-10)) return null;
  const values: [number,string][]=[[0,'0'],[.5,'1/2'],[Math.SQRT1_2,'√2/2'],[Math.sqrt(3)/2,'√3/2'],[1,'1'],[Math.sqrt(3)/3,'√3/3'],[Math.SQRT2,'√2'],[Math.sqrt(3),'√3'],[2,'2'],[(Math.sqrt(6)-Math.sqrt(2))/4,'(√6−√2)/4'],[(Math.sqrt(6)+Math.sqrt(2))/4,'(√6+√2)/4'],[2-Math.sqrt(3),'2−√3']];
  for(const [v,label] of values) if(Math.abs(n-v)<1e-10) return label;
  for(const [v,label] of values) if(v!==0&&Math.abs(n+v)<1e-10) return `−(${label})`;
  return null;
}
export function quadrant(degrees: number) { const n=((degrees%360)+360)%360; return n%90===0 ? ['positive x-axis','positive y-axis','negative x-axis','negative y-axis'][n/90] : `quadrant ${['I','II','III','IV'][Math.floor(n/90)]}`; }
export function angleLabel(degrees: number, units: 'deg'|'rad') {
  if(units==='deg') return `${decimal(degrees,2)}°`;
  const k=Math.round(degrees/15); if(Math.abs(degrees-k*15)<1e-10) { if(!k)return '0 rad'; let n=k,d=12; const gcd=(a:number,b:number):number=>b?gcd(b,a%b):Math.abs(a); const g=gcd(n,d);n/=g;d/=g; return `${n===1?'':n===-1?'−':n}π${d===1?'':`/${d}`} rad`; }
  return `${decimal(rad(degrees),4)} rad`;
}
export function parseNumeric(raw: string): number {
  const normalized=raw.trim().replaceAll('−','-').replaceAll('√','sqrt').replaceAll('π','pi').replace(/sqrt\s*(\d+)/g,'sqrt($1)').replace(/\s/g,'');
  const tokens=normalized.match(/sqrt|pi|\d*\.?\d+(?:e[+-]?\d+)?|[()+\-*/]/gi)||[];
  if(tokens.join('')!==normalized||!tokens.length)return NaN;
  let i=0;
  const atom=():number=>{const token=tokens[i++];if(token==='+')return atom();if(token==='-')return -atom();if(token==='pi')return Math.PI;if(token==='sqrt'){if(tokens[i++]!=='(')return NaN;const n=expr();if(tokens[i++]!==')')return NaN;return Math.sqrt(n);}if(token==='('){const n=expr();return tokens[i++]===')'?n:NaN;}return token&&/^\d*\.?\d/.test(token)?Number(token):NaN;};
  const term=():number=>{let n=atom();while(tokens[i]==='*'||tokens[i]==='/'){const op=tokens[i++],v=atom();n=op==='*'?n*v:safeDivide(n,v);}return n;};
  const expr=():number=>{let n=term();while(tokens[i]==='+'||tokens[i]==='-'){const op=tokens[i++],v=term();n=op==='+'?n+v:n-v;}return n;};
  const n=expr();return i===tokens.length?n:NaN;
}
export function validateRule(item: Identity, nextIndex: number, rule: string, restrictionsAccepted: boolean) {
  const next=item.steps[nextIndex]; if(!next)return {ok:false,message:'The derivation is already complete.'};
  if(rule!==next.rule)return {ok:false,message:'That rule does not justify this transformation. Compare the current equation with the target step.'};
  if(/Divide|Cancel/.test(rule)&&item.domain!==all&&!restrictionsAccepted)return {ok:false,message:'First acknowledge the domain restriction. A denominator must be nonzero before dividing or cancelling.'};
  return {ok:true,message:next.reason};
}
