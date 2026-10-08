import type {MathAstNode} from '../../math-foundation/types';
import {rationalAdd as add,rationalSubtract as sub,rationalMultiply as mul} from '../../math-foundation/values';
import {rational,zero,type Fraction} from './exact';
import {expressionText} from './safeExpression';
type Ring=Map<string,Fraction>;type Form={n:Ring;d:Ring};
const unit=()=>new Map([['', {numerator:1n,denominator:1n}]]);
function sum(a:Ring,b:Ring,negative=false):Ring{const out=new Map(a);for(const [k,c] of b){const v=(negative?sub:add)(out.get(k)??zero,c);if(v.numerator===0n)out.delete(k);else out.set(k,v);}return out;}
function product(a:Ring,b:Ring):Ring{if(a.size*b.size>4096)throw new Error('Symbolic proof exceeds term budget.');const out:Ring=new Map();for(const [ka,va] of a)for(const [kb,vb] of b){const key=[...JSON.parse(ka||'[]') as string[],...JSON.parse(kb||'[]') as string[]].sort(),k=key.length?JSON.stringify(key):'',v=add(out.get(k)??zero,mul(va,vb));if(v.numerator===0n)out.delete(k);else out.set(k,v);}return out;}
function form(n:MathAstNode):Form{
 try{const c=rational(expressionText(n));return {n:c.numerator?new Map([['',c]]):new Map(),d:unit()};}catch{/* Treat symbols and entire function calls as independent indeterminates. */}
 if(n.type==='SYMBOL'||n.type==='FUNCTION_CALL')return {n:new Map([[JSON.stringify([expressionText(n)]),{numerator:1n,denominator:1n}]]),d:unit()};
 if(n.type==='UNARY_OPERATION'){const a=form(n.operand);return n.operator==='-'?{...a,n:new Map([...a.n].map(([k,c])=>[k,{...c,numerator:-c.numerator}]))}:a;}
 if(n.type==='BINARY_OPERATION'){const a=form(n.left);if(n.operator==='^'){const k=rational(expressionText(n.right));if(k.denominator!==1n||k.numerator>16n||k.numerator<-16n)throw new Error('Proof exponent limit.');const base=k.numerator<0n?{n:a.d,d:a.n}:a;let p:Form={n:unit(),d:unit()};for(let i=0n;i<(k.numerator<0n?-k.numerator:k.numerator);i++)p={n:product(p.n,base.n),d:product(p.d,base.d)};return p;}const b=form(n.right);if(n.operator==='+')return {n:sum(product(a.n,b.d),product(b.n,a.d)),d:product(a.d,b.d)};if(n.operator==='-')return {n:sum(product(a.n,b.d),product(b.n,a.d),true),d:product(a.d,b.d)};if(n.operator==='*')return {n:product(a.n,b.n),d:product(a.d,b.d)};if(n.operator==='/'){if(!b.n.size)throw new Error('Zero proof denominator.');return {n:product(a.n,b.d),d:product(a.d,b.n)};}}
 throw new Error('Expression is outside the formal rational ring.');
}
/** Proof by rational-ring arithmetic, with functions kept as opaque atoms (no sampling). */
export function ringEqual(a:MathAstNode,b:MathAstNode):boolean{try{const x=form(a),y=form(b);return sum(product(x.n,y.d),product(y.n,x.d),true).size===0;}catch{return false;}}
