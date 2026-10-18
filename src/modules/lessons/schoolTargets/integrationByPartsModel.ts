export type PartsExampleId = "exponential" | "sine";
export const partsExamples = {
 exponential:{integral:String.raw`\int x e^x\,dx`,transcendent:String.raw`e^x`,dv:String.raw`e^x\,dx`,du:String.raw`e^x\,dx`,v:String.raw`e^x`,answer:String.raw`e^x(x-1)+C`,expanded:String.raw`xe^x-e^x+C`,integrand:(x:number)=>x*Math.exp(x),primitive:(x:number)=>Math.exp(x)*(x-1),min:-1,max:20,ticks:[0,5,10,15,20]},
 sine:{integral:String.raw`\int x\sin x\,dx`,transcendent:String.raw`\sin x`,dv:String.raw`\sin x\,dx`,du:String.raw`\cos x\,dx`,v:String.raw`-\cos x`,answer:String.raw`-x\cos x+\sin x+C`,expanded:String.raw`-x\cos x+\sin x+C`,integrand:(x:number)=>x*Math.sin(x),primitive:(x:number)=>-x*Math.cos(x)+Math.sin(x),min:-.2,max:2,ticks:[0,1,2]},
};
export type PartsFactor = "algebraic" | "transcendent";
export function partsAssignment(id:PartsExampleId,u:PartsFactor|null,dv:PartsFactor|null){
 const e=partsExamples[id],preview=u===null&&dv===null,valid=u!==null&&dv!==null&&u!==dv,efficient=u==="algebraic"&&dv==="transcendent";
 return {preview,valid,efficient,u:u==="algebraic"?"x":u?e.transcendent:null,dv:dv==="algebraic"?String.raw`x\,dx`:dv?e.dv:null,du:u==="algebraic"?"dx":u?e.du:null,v:dv==="algebraic"?String.raw`\frac{x^2}{2}`:dv?e.v:null};
}
export const measuredPartsDerivative=(id:PartsExampleId,x:number)=>{const h=1e-4,f=partsExamples[id].primitive;return(f(x+h)-f(x-h))/(2*h);};
export const samplePartsVerification=(id:PartsExampleId)=>Array.from({length:311},(_,i)=>{const x=-2.2+4.4*i/310;return{x,integrand:partsExamples[id].integrand(x),derivative:measuredPartsDerivative(id,x)};});
export type ChallengeKey="u"|"dv"|"du"|"v"|"uv"|"rest"|"answer";
export type PartsChallenge=Record<ChallengeKey,string>;
export const blankPartsChallenge=():PartsChallenge=>({u:"",dv:"",du:"",v:"",uv:"",rest:"",answer:""});
type Expr={kind:"number";value:number}|{kind:"variable";name:string}|{kind:"neg"|"exp";arg:Expr}|{kind:"+"|"-"|"*"|"/"|"^";left:Expr;right:Expr};
function normalize(value:string){return value.replace(/−/g,"-").replace(/²/g,"^2").replace(/³/g,"^3").replace(/eˣ/g,"exp(x)").replace(/\\(?:left|right|,|!|quad|qquad)/g,"").replace(/\\(?:cdot|times)/g,"*").replace(/\\exp/g,"exp").replace(/\\(?:dfrac|frac)\{([^{}]+)\}\{([^{}]+)\}/g,"($1)/($2)").replace(/\{([^{}]*)\}/g,"($1)").replace(/\s/g,"").replace(/c/g,"C");}
function parse(source:string):Expr{
 if(!source||source.length>240)throw new Error("Use a short arithmetic/exponential expression");const tokens=source.match(/(?:\d+(?:\.\d*)?|\.\d+)|exp|[xeC()+\-*/^]/g)??[];if(tokens.join("")!==source||tokens.length>120)throw new Error("Unsupported notation");let i=0;
 const atom=():Expr=>{const token=tokens[i++];if(token&&/^[xeC]$/.test(token))return{kind:"variable",name:token};if(token==="("){const result=add();if(tokens[i++]!==")")throw new Error("Missing parenthesis");return result;}if(token==="exp"){if(tokens[i++]!=="(")throw new Error("Use exp(x)");const arg=add();if(tokens[i++]!==")")throw new Error("Missing parenthesis");return{kind:"exp",arg};}if(token&&/^(?:\d|\.)/.test(token))return{kind:"number",value:Number(token)};throw new Error("Expected a value");};
 const power=():Expr=>{const left=atom();return tokens[i]==="^"?(i++,{kind:"^",left,right:unary()}):left;};
 const unary=():Expr=>tokens[i]==="-"?(i++,{kind:"neg",arg:unary()}):tokens[i]==="+"?(i++,unary()):power();
 const begins=()=>!!tokens[i]&&/^(?:\d|\.|[xeC(]|exp)/.test(tokens[i]);
 const product=():Expr=>{let left=unary();while(tokens[i]==="*"||tokens[i]==="/"||begins()){const kind=tokens[i]==="/"?"/":"*";if(tokens[i]==="*"||tokens[i]==="/")i++;left={kind,left,right:unary()};}return left;};
 const add=():Expr=>{let left=product();while(tokens[i]==="+"||tokens[i]==="-"){const kind=tokens[i++]as"+"|"-";left={kind,left,right:product()};}return left;};const result=add();if(i!==tokens.length)throw new Error("Unexpected token");return result;
}
type Dual={value:number;derivative:number};
function evaluate(expr:Expr,x:number,c:number):Dual{
 if(expr.kind==="number")return{value:expr.value,derivative:0};if(expr.kind==="variable")return{value:expr.name==="x"?x:expr.name==="e"?Math.E:c,derivative:expr.name==="x"?1:0};
 if("arg" in expr){const a=evaluate(expr.arg,x,c);return expr.kind==="neg"?{value:-a.value,derivative:-a.derivative}:{value:Math.exp(a.value),derivative:Math.exp(a.value)*a.derivative};}
 const a=evaluate(expr.left,x,c),b=evaluate(expr.right,x,c);
 switch(expr.kind){case"+":return{value:a.value+b.value,derivative:a.derivative+b.derivative};case"-":return{value:a.value-b.value,derivative:a.derivative-b.derivative};case"*":return{value:a.value*b.value,derivative:a.derivative*b.value+a.value*b.derivative};case"/":return{value:a.value/b.value,derivative:(a.derivative*b.value-a.value*b.derivative)/(b.value*b.value)};case"^":{const value=a.value**b.value;return{value,derivative:b.derivative===0?(b.value===0?0:b.value*a.value**(b.value-1)*a.derivative):value*(b.derivative*Math.log(a.value)+b.value*a.derivative/a.value)};}}
}
const close=(actual:number,expected:number)=>Number.isFinite(actual)&&Math.abs(actual-expected)<1e-7*(1+Math.abs(expected));
export function gradePartsChallenge(work:PartsChallenge){
 const keys:ChallengeKey[]=["u","dv","du","v","uv","rest","answer"];
 const valid=Object.fromEntries(keys.map(key=>[key,false])) as Record<ChallengeKey,boolean>;
 const expected={u:(x:number)=>x*x,dv:(x:number)=>Math.exp(x),du:(x:number)=>2*x,v:(x:number)=>Math.exp(x),uv:(x:number)=>x*x*Math.exp(x),rest:(x:number)=>2*x*Math.exp(x)};
 for(const key of keys)try{
  let source=normalize(work[key]);source=source.replace(new RegExp(`^${key}=`),"");const differential=/dx$/.test(source);if((key==="du"||key==="dv")&&!differential)continue;if(!["du","dv","rest"].includes(key)&&differential)continue;if(differential)source=source.slice(0,-2);if(key==="rest")source=source.replace(/^∫/,"");if(key==="answer")source=source.replace(/^(?:F\(x\)|y)=/,"");const tree=parse(source);
  let correct=true;for(const c of[-2,0,3]){let offset:number|undefined;for(const x of[-1.7,-.6,0,.4,1.3,2]){const result=evaluate(tree,x,c);if(key==="answer"){const difference=result.value-Math.exp(x)*(x*x-2*x+2);if(offset===undefined)offset=difference;if(!close(result.derivative,x*x*Math.exp(x))||!close(difference,offset))correct=false;}else if(!close(result.value,expected[key](x)))correct=false;}}valid[key]=correct;
 }catch{valid[key]=false;}
 return{valid,correct:keys.every(key=>valid[key]),score:keys.filter(key=>valid[key]).length};
}
