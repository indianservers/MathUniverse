import {evaluateMath} from '../../math-foundation/evaluator';
import {formatValue,toFraction,fractionValue,rationalAdd,rationalSubtract,rationalMultiply,rationalDivide} from '../../math-foundation/values';
import type {MathAstNode} from '../../math-foundation/types';
import {safeAst,expressionText} from './safeExpression';
import {outcome,unsupported,type KernelRequest} from './types';
export type Fraction={numerator:bigint;denominator:bigint};
export const zero:Fraction={numerator:0n,denominator:1n};
export function rational(source:string):Fraction{const r=evaluateMath(safeAst(source));const f=r.value&&toFraction(r.value);if(r.status!=='EXACT'||!f||f.denominator===0n||r.diagnostics.some(d=>d.severity==='ERROR'))throw new Error('An exact finite rational value is required.');return f;}
export const fractionText=(f:Fraction)=>formatValue(fractionValue(f.numerator,f.denominator));
export function gcd(a:bigint,b:bigint):bigint{a=a<0n?-a:a;b=b<0n?-b:b;while(b)[a,b]=[b,a%b];return a;}
export function exactSquareRoot(f:Fraction):Fraction|undefined{
 if(f.numerator<0n)return;
 const root=(n:bigint)=>{if(n<2n)return n;let x=1n<<BigInt(Math.ceil(n.toString(2).length/2));for(;;){const next=(x+n/x)/2n;if(next>=x)return x;x=next;}};
 const n=root(f.numerator),d=root(f.denominator);return n*n===f.numerator&&d*d===f.denominator?{numerator:n,denominator:d}:undefined;
}
export function integer(source:unknown):bigint{const f=rational(String(source));if(f.denominator!==1n)throw new Error('An integer is required.');return f.numerator;}
export function exactArithmetic(request:KernelRequest){
 const args=request.args??[],op=request.operation;
 if(request.expression){const root=safeAst(request.expression);function check(n:MathAstNode){if(n.type==='BINARY_OPERATION'){if(n.operator==='^'){const a=evaluateMath(n.left).value,b=evaluateMath(n.right).value;if(a&&b&&toFraction(a)?.numerator===0n&&toFraction(b)?.numerator===0n)throw new Error('0^0 is indeterminate without an explicitly stated convention.');}check(n.left);check(n.right);}else if(n.type==='UNARY_OPERATION')check(n.operand);else if(n.type==='FUNCTION_CALL')n.arguments.forEach(check);else if(n.type==='EQUATION'||n.type==='INEQUALITY'){check(n.left);check(n.right);}}check(root);}
 if(op==='decimal'){
  const f=rational(request.expression??''),places=request.precision??20;if(!Number.isInteger(places)||places<0||places>100)throw new Error('Decimal places must be between 0 and 100.');
  const scale=10n**BigInt(places),negative=f.numerator<0n,n=negative?-f.numerator:f.numerator;let q=n*scale/f.denominator;const remainder=n*scale%f.denominator;
  if(2n*remainder>f.denominator||2n*remainder===f.denominator&&q%2n===1n)q++;
  const digits=q.toString().padStart(places+1,'0'),answer=(negative&&q!==0n?'-':'')+(places?digits.slice(0,-places)+'.'+digits.slice(-places):digits);
  const r=outcome('verified_numerical',answer,answer,'Exact integer division with half-even rounding',['Convert to an exact rational.','Round the scaled integer quotient with ties to even.']);r.exact=fractionText(f);r.approximation=answer;r.errorBound=`1/(2*10^${places})`;return r;
 }
 if(op==='evaluate'){
  const ast=safeAst(request.expression??'');if(ast.type==='FUNCTION_CALL'||ast.type==='SYMBOL'&&['pi','e'].includes(ast.name))return undefined;const r=evaluateMath(ast);if(r.status!=='EXACT'||!r.value||r.value.kind==='SPECIAL'||r.diagnostics.some(d=>d.severity==='ERROR'))return undefined;
  const answer=formatValue(r.value),result=outcome('verified_exact',answer,r.value,'Exact BigInt rational/complex arithmetic',['Evaluate the typed expression using exact rational operations.']);result.ast=ast;return result;
 }
 if(!['gcd','lcm','mod','factorial','factorization','base'].includes(op))return undefined;
 const a=integer(args[0]??request.expression),b=args[1]===undefined?0n:integer(args[1]);let value:unknown;
 if(op==='gcd')value=gcd(a,b).toString();
 else if(op==='lcm')value=a===0n||b===0n?'0':((a/gcd(a,b))*b<0n?-(a/gcd(a,b))*b:(a/gcd(a,b))*b).toString();
 else if(op==='mod'){if(b<=0n)throw new Error('The modulus must be positive.');value=((a%b+b)%b).toString();}
 else if(op==='factorial'){if(a<0n||a>1000n)throw new Error('Factorial requires an integer from 0 to 1000.');let product=1n;for(let k=2n;k<=a;k++)product*=k;value=product.toString();}
 else if(op==='base'){const base=Number(args[1]);if(!Number.isInteger(base)||base<2||base>36)throw new Error('Base must be 2 to 36.');value=a.toString(base);}
 else{if(a<2n||a>1000000000000n)return unsupported('Prime factorization supports integers from 2 to 10^12.');let n=a,k=2n,iterations=0;const factors:string[]=[];while(k*k<=n){if(++iterations>100000)return unsupported('Factorization reached the trial-division budget.');while(n%k===0n){factors.push(k.toString());n/=k;}k=k===2n?3n:k+2n;}if(n>1n)factors.push(n.toString());value=factors;}
 return outcome('verified_exact',typeof value==='string'?value:JSON.stringify(value),value,'Exact bounded integer algorithm');
}
export function polynomial(node:MathAstNode,variable='x'):Fraction[]|undefined{
 try{return [rational(expressionText(node))];}catch{/* Expressions with variables need coefficient recursion. */}
 if(node.type==='SYMBOL'&&node.name===variable)return [zero,{numerator:1n,denominator:1n}];
 if(node.type==='UNARY_OPERATION'){const p=polynomial(node.operand,variable);return p?.map(c=>node.operator==='-'?{...c,numerator:-c.numerator}:c);}
 if(node.type==='BINARY_OPERATION'){
  const a=polynomial(node.left,variable),b=polynomial(node.right,variable);if(!a||!b)return;
  if(node.operator==='+'||node.operator==='-'){return Array.from({length:Math.max(a.length,b.length)},(_,i)=>(node.operator==='+'?rationalAdd:rationalSubtract)(a[i]??zero,b[i]??zero));}
  if(node.operator==='*'){if(a.length+b.length>66)return;const p=Array.from({length:a.length+b.length-1},()=>zero);a.forEach((x,i)=>b.forEach((y,j)=>{p[i+j]=rationalAdd(p[i+j],rationalMultiply(x,y));}));return p;}
  if(node.operator==='/'&&b.length===1&&b[0].numerator!==0n)return a.map(c=>rationalDivide(c,b[0]));
  if(node.operator==='^'&&b.length===1&&b[0].denominator===1n&&b[0].numerator>=0n&&b[0].numerator<=8n){let p:Fraction[]=[{numerator:1n,denominator:1n}];for(let k=0;k<Number(b[0].numerator);k++){const next=Array.from({length:p.length+a.length-1},()=>zero);p.forEach((x,i)=>a.forEach((y,j)=>{next[i+j]=rationalAdd(next[i+j],rationalMultiply(x,y));}));p=next;}return p;}
  return;
 }
 try{return [rational(fractionNodeText(node))];}catch{return;}
}
function fractionNodeText(node:MathAstNode):string{if(node.type==='LITERAL')return node.value;if(node.type==='UNARY_OPERATION')return node.operator+fractionNodeText(node.operand);throw new Error('Not rational');}
