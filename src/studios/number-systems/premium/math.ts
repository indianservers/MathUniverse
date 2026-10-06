import { normalizeRational } from '../../../utils/coreAccuracyOracles';
import { repeatingDecimal, terminatingDenominator } from '../../../pages/numberSystemsStudioSession';
export type NumberSet='N'|'W'|'Z'|'Q'|'I'|'R';
export type Rational={numerator:number;denominator:number};
export type RealValue={label:string;value:number;rational:Rational|null};
export const constants=[{label:'π',name:'Pi',value:Math.PI,digits:'3.14159265358979323846264338327950288419716939937510',context:'The ratio of circumference to diameter; circles, waves and geometry.'},{label:'√2',name:'Square root of two',value:Math.SQRT2,digits:'1.41421356237309504880168872420969807856967187537694',context:'The diagonal of a unit square.'},{label:'√3',name:'Square root of three',value:Math.sqrt(3),digits:'1.73205080756887729352744634150587236694280525381038',context:'The altitude of an equilateral triangle of side two.'},{label:'e',name:'Euler’s number',value:Math.E,digits:'2.71828182845904523536028747135266249775724709369995',context:'Continuous growth and the natural exponential function.'},{label:'φ',name:'Golden ratio',value:(1+Math.sqrt(5))/2,digits:'1.61803398874989484820458683436563811772030917980576',context:'A rectangle whose side ratio is unchanged by removing a square.'}];
export function rational(p:number,q:number):Rational{if(!Number.isSafeInteger(p)||!Number.isSafeInteger(q))throw Error('Use integer components within the exact safe-integer range.');return normalizeRational(p,q);}
export function fractionText(r:Rational){return r.denominator===1?String(r.numerator):`${r.numerator}/${r.denominator}`;}
export function parseReal(input:string):RealValue {
 const label=input.trim(),s=label.replace(/\s/g,'').replace(/−/g,'-').replace(/pi/gi,'π').replace(/phi/gi,'φ').replace(/sqrt\((\d+)\)/g,'√$1');if(!s)throw Error('Enter a number.');
 const sign=s.startsWith('-')?-1:1,t=s.replace(/^[+-]/,'');const constant=constants.find(c=>c.label===t);if(constant)return {label,value:sign*constant.value,rational:null};
 if(/^√\d+$/.test(t)){const n=Number(t.slice(1));if(!Number.isSafeInteger(n))throw Error('The radicand is too large.');const root=Math.sqrt(n);return {label,value:sign*root,rational:Number.isInteger(root)?rational(sign*root,1):null};}
 const percent=s.endsWith('%'),v=percent?s.slice(0,-1):s;let r:Rational;
 const fraction=v.match(/^([+-]?\d+)[/:]([+-]?\d+)$/),repeat=v.match(/^([+-]?)(\d+)\.(\d*)\((\d+)\)$/);
 if(fraction)r=rational(Number(fraction[1]),Number(fraction[2]));
 else if(repeat){if(repeat[3].length+repeat[4].length>10)throw Error('Use up to ten decimal digits.');const a=Number(repeat[2]+repeat[3]+repeat[4]),b=Number(repeat[2]+repeat[3]),q=10**repeat[3].length*(10**repeat[4].length-1);r=rational((repeat[1]==='-'?-1:1)*(a-b),q);}
 else {if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(v))throw Error('Use a fraction, decimal, percentage, ratio, π, e, φ or √n.');const decimals=v.split('.')[1]?.length||0;if(decimals>10)throw Error('Use up to ten decimal places; use fraction notation for exact values.');r=rational(Math.round(Number(v)*10**decimals),10**decimals);}
 if(percent)r=rational(r.numerator,r.denominator*100);return {label,value:r.numerator/r.denominator,rational:r};
}
export function memberships(x:RealValue):NumberSet[]{if(!x.rational)return ['I','R'];const {numerator:p,denominator:q}=x.rational;return [...(q===1&&p>=1?['N' as const]:[]),...(q===1&&p>=0?['W' as const]:[]),...(q===1?['Z' as const]:[]),'Q','R'];}
export function compareReal(a:RealValue,b:RealValue):'<'|'='|'>'{if(a.rational&&b.rational){const left=BigInt(a.rational.numerator)*BigInt(b.rational.denominator),right=BigInt(b.rational.numerator)*BigInt(a.rational.denominator);return left===right?'=':left<right?'<':'>';}return a.value===b.value?'=':a.value<b.value?'<':'>';}
export function decimalText(r:Rational){return repeatingDecimal(r.numerator,r.denominator);}
export { terminatingDenominator };
export type Interval={lo:number;hi:number;left:boolean;right:boolean};
export function endpoint(s:string){const text=s.trim().replace(/−/g,'-');if(['-∞','-Infinity'].includes(text))return -Infinity;if(['∞','+∞','Infinity'].includes(text))return Infinity;return parseReal(text).value;}
export function interval(lo:number,hi:number,left:boolean,right:boolean):Interval{if(Number.isNaN(lo)||Number.isNaN(hi)||lo>hi||lo===Infinity||hi===-Infinity)throw Error('Lower endpoint must not exceed the upper endpoint.');return {lo,hi,left:Number.isFinite(lo)&&left,right:Number.isFinite(hi)&&right};}
export function emptyInterval(i:Interval){return i.lo===i.hi&&!(i.left&&i.right);}
export function intervalContains(i:Interval,x:number){return !emptyInterval(i)&&(x>i.lo||x===i.lo&&i.left)&&(x<i.hi||x===i.hi&&i.right);}
export const short=(v:number)=>v===Infinity?'∞':v===-Infinity?'−∞':String(Number(v.toFixed(6)));
export function intervalText(i:Interval){return emptyInterval(i)?'∅':`${i.left?'[':'('}${short(i.lo)}, ${short(i.hi)}${i.right?']':')'}`;}
export function intersection(a:Interval,b:Interval):Interval[]{const lo=Math.max(a.lo,b.lo),hi=Math.min(a.hi,b.hi);if(lo>hi)return [];const i=interval(lo,hi,(lo!==a.lo||a.left)&&(lo!==b.lo||b.left),(hi!==a.hi||a.right)&&(hi!==b.hi||b.right));return emptyInterval(i)?[]:[i];}
export function union(a:Interval,b:Interval):Interval[]{const xs=[a,b].filter(i=>!emptyInterval(i)).sort((x,y)=>x.lo-y.lo);if(xs.length<2)return xs;const [x,y]=xs;if(y.lo>x.hi||y.lo===x.hi&&!x.right&&!y.left)return xs;return [interval(x.lo,Math.max(x.hi,y.hi),x.left||(x.lo===y.lo&&y.left),x.hi>y.hi?x.right:x.hi<y.hi?y.right:x.right||y.right)];}
export type Operation='+'|'−'|'×'|'÷';
export const closure:Record<NumberSet,Record<Operation,string>>={N:{'+':'Closed','−':'Not closed: 1−2=−1','×':'Closed','÷':'Not closed: 1÷2=1/2'},W:{'+':'Closed','−':'Not closed: 0−1=−1','×':'Closed','÷':'Not closed: 1÷2=1/2; zero divisor excluded'},Z:{'+':'Closed','−':'Closed','×':'Closed','÷':'Not closed: 1÷2=1/2; zero divisor excluded'},Q:{'+':'Closed','−':'Closed','×':'Closed','÷':'Closed for nonzero divisors'},I:{'+':'Not closed: √2+(−√2)=0','−':'Not closed: √2−√2=0','×':'Not closed: √2×√2=2','÷':'Not closed: √2÷√2=1'},R:{'+':'Closed','−':'Closed','×':'Closed','÷':'Closed for nonzero divisors'}};
export function operate(a:RealValue,b:RealValue,op:Operation){if(op==='÷'&&b.value===0)throw Error('Division by zero is undefined.');const value=op==='+'?a.value+b.value:op==='−'?a.value-b.value:op==='×'?a.value*b.value:a.value/b.value;return {value,expression:`${a.label} ${op} ${b.label}`,note:'One example illustrates an operation; closure requires every allowed pair of operands.'};}
export type Formula='Conversion'|'Absolute Value'|'Distance'|'Midpoint'|'Interval Notation'|'Compare Numbers';
export const formulas:Formula[]=['Conversion','Absolute Value','Distance','Midpoint','Interval Notation','Compare Numbers'];
export type Question={prompt:string;answer:string;hint:string;steps:string[];second?:string};
export function question(formula:Formula,seed:number,difficulty:string):Question{const size=difficulty==='Hard'?19:difficulty==='Medium'?11:6,a=(seed*7)%size+1+Math.floor(seed/size)*2,b=(seed*3)%size+2+Math.floor(seed/(size*2)),left=(seed%2?-1:1)*(seed+1+(difficulty==='Hard'?size:0)),right=b+seed%5;
 if(formula==='Conversion'){const r=rational(a,b),value=a/b;return {prompt:`Convert ${fractionText(r)} to a decimal and percentage. Use up to six decimal places.`,answer:String(Number(value.toFixed(6))),second:String(Number((value*100).toFixed(6))),hint:'Divide numerator by denominator, then multiply by 100.',steps:[`${a} ÷ ${b} = ${decimalText(r)}`,`${short(value)} × 100 ≈ ${short(value*100)}%`]};}
 if(formula==='Absolute Value')return {prompt:`Find |${left}|.`,answer:String(Math.abs(left)),hint:'Distance from zero cannot be negative.',steps:[`|${left}| = ${Math.abs(left)}`]};
 if(formula==='Distance')return {prompt:`Find the distance between ${left} and ${right}.`,answer:String(Math.abs(right-left)),hint:'Subtract the coordinates and take the absolute value.',steps:[`|${left} − ${right}| = ${Math.abs(right-left)}`]};
 if(formula==='Midpoint')return {prompt:`Find the midpoint of ${left} and ${right}.`,answer:String((left+right)/2),hint:'Average the two coordinates.',steps:[`(${left} + ${right}) / 2 = ${(left+right)/2}`]};
 if(formula==='Interval Notation')return {prompt:`Write x ≥ ${left} in interval notation.`,answer:`[${left},∞)`,hint:'Include the finite endpoint; infinity is never included.',steps:[`[${left}, ∞)`]};
 const other=rational(a+(seed%3-1),b),symbol=compareReal(parseReal(`${a}/${b}`),parseReal(fractionText(other)));return {prompt:`Compare ${a}/${b} and ${fractionText(other)}. Enter <, = or >.`,answer:symbol,hint:'Use a common positive denominator and compare numerators.',steps:[`${a}/${b} ${symbol} ${fractionText(other)}`]};
}
export function grades(expected:string,answer:string){if(/^[<>=[(]/.test(expected))return expected.replace(/\s/g,'')===answer.replace(/\s/g,'').replace(/−/g,'-');try{return Math.abs(parseReal(answer).value-Number(expected))<=.000001;}catch{return false;}}
