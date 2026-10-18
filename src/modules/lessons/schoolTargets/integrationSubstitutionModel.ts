export type SubstitutionChoice="x"|"x²"|"sin x"|"2x"|"x²+1";
export const substitutionChoices:SubstitutionChoice[]=["x","x²","sin x","2x","x²+1"];
export function substitutionState(choice:SubstitutionChoice){
 const choices={
  "x":{u:"x",derivative:"1",du:"dx",inner:"u^2",factor:String.raw`2u\,du`,transformed:String.raw`\int 2u\cos(u^2)\,du`,primitive:String.raw`\sin(u^2)+C`,match:false,supported:true,message:"Valid, but this simply renames x and leaves the same inner-function pattern.",code:"integral-2u-cos-u-squared-du"},
  "x²":{u:"x^2",derivative:"2x",du:String.raw`2x\,dx`,inner:"u",factor:"du",transformed:String.raw`\int\cos(u)\,du`,primitive:String.raw`\sin(u)+C`,match:true,supported:true,message:"Match found! 2x dx is present in the integrand.",code:"integral-cos-u-du"},
  "sin x":{u:String.raw`\sin x`,derivative:String.raw`\cos x`,du:String.raw`\cos x\,dx`,inner:String.raw`(\arcsin u)^2`,factor:String.raw`\cos x\,dx`,transformed:"",primitive:"",match:false,supported:false,message:"du = cos x dx does not match 2x dx. A sine substitution needs a local inverse branch; choose x² for a direct simplification.",code:"local-inverse-branch-required"},
  "2x":{u:"2x",derivative:"2",du:String.raw`2\,dx`,inner:"u^2/4",factor:String.raw`\frac u2\,du`,transformed:String.raw`\int\frac u2\cos(u^2/4)\,du`,primitive:String.raw`\sin(u^2/4)+C`,match:false,supported:true,message:"Valid, but du = 2 dx leaves a factor u/2 and another inner expression.",code:"integral-half-u-cos-quarter-u-squared-du"},
  "x²+1":{u:"x^2+1",derivative:"2x",du:String.raw`2x\,dx`,inner:"u-1",factor:"du",transformed:String.raw`\int\cos(u-1)\,du`,primitive:String.raw`\sin(u-1)+C`,match:true,supported:true,message:"Valid shifted choice! du = 2x dx, and x² becomes u − 1.",code:"integral-cos-u-minus-one-du"},
 };return choices[choice];
}
export const substitutionIntegrand=(x:number)=>2*x*Math.cos(x*x);
export const substitutionPrimitive=(x:number)=>Math.sin(x*x);
export function accumulation(a:number,b:number){
 if(!Number.isFinite(a)||!Number.isFinite(b)||Math.abs(a)>3||Math.abs(b)>3)throw new RangeError("Endpoints must be in [-3, 3]");
 const n=1000,h=(b-a)/n;let total=substitutionIntegrand(a)+substitutionIntegrand(b);for(let i=1;i<n;i++)total+=(i%2?4:2)*substitutionIntegrand(a+i*h);
 const area=total*h/3,netChange=substitutionPrimitive(b)-substitutionPrimitive(a);return{area,netChange,residual:area-netChange};
}
export const substitutionCurve=(primitive=false)=>Array.from({length:1201},(_,i)=>{const x=-3+6*i/1200;return{x,y:primitive?substitutionPrimitive(x):substitutionIntegrand(x)};});
export const practiceIntegrands=[(x:number)=>4*x*Math.sin(x*x),(x:number)=>3*x*(x*x+5)**4,(x:number)=>x*Math.cos(5*x*x+1)];
const practicePrimitives=[(x:number)=>-2*Math.cos(x*x),(x:number)=>3/10*(x*x+5)**5,(x:number)=>1/10*Math.sin(5*x*x+1)];
type Expr={kind:"number";value:number}|{kind:"variable";name:string}|{kind:"neg"|"sin"|"cos"|"exp"|"ln"|"abs";arg:Expr}|{kind:"+"|"-"|"*"|"/"|"^";left:Expr;right:Expr};
function parse(source:string):Expr{
 if(!source||source.length>256)throw new Error("Use a short expression");const tokens=source.match(/(?:\d+(?:\.\d*)?|\.\d+)|sin|cos|exp|ln|abs|pi|[xeCc()+\-*/^]/g)??[];if(tokens.join("")!==source||tokens.length>128)throw new Error("Unsupported notation");let i=0;
 const atom=():Expr=>{const t=tokens[i++];if(t&&/^(?:[xeCc]|pi)$/.test(t))return{kind:"variable",name:t};if(t==="("){const result=add();if(tokens[i++]!==")")throw new Error("Missing parenthesis");return result;}if(["sin","cos","exp","ln","abs"].includes(t)){if(tokens[i++]!=="(")throw new Error("Use function parentheses");const arg=add();if(tokens[i++]!==")")throw new Error("Missing parenthesis");return{kind:t as"sin"|"cos"|"exp"|"ln"|"abs",arg};}if(t&&/^(\d|\.)/.test(t))return{kind:"number",value:Number(t)};throw new Error("Expected a value");};
 const power=():Expr=>{const left=atom();return tokens[i]==="^"?(i++,{kind:"^",left,right:unary()}):left;};const unary=():Expr=>tokens[i]==="-"?(i++,{kind:"neg",arg:unary()}):tokens[i]==="+"?(i++,unary()):power();
 const begins=()=>!!tokens[i]&&/^(?:\d|\.|[xeCc(]|sin|cos|exp|ln|abs|pi)/.test(tokens[i]);const product=():Expr=>{let left=unary();while(tokens[i]==="*"||tokens[i]==="/"||begins()){const kind=tokens[i]==="/"?"/":"*";if(tokens[i]==="*"||tokens[i]==="/")i++;left={kind,left,right:unary()};}return left;};const add=():Expr=>{let left=product();while(tokens[i]==="+"||tokens[i]==="-"){const kind=tokens[i++]as"+"|"-";left={kind,left,right:product()};}return left;};const result=add();if(i!==tokens.length)throw new Error("Unexpected token");return result;
}
type Dual={value:number;derivative:number};
function evaluate(expr:Expr,x:number,c:number):Dual{
 if(expr.kind==="number")return{value:expr.value,derivative:0};if(expr.kind==="variable")return{value:expr.name==="x"?x:expr.name==="e"?Math.E:expr.name==="pi"?Math.PI:c,derivative:expr.name==="x"?1:0};
 if("arg" in expr){const a=evaluate(expr.arg,x,c);switch(expr.kind){case"neg":return{value:-a.value,derivative:-a.derivative};case"sin":return{value:Math.sin(a.value),derivative:Math.cos(a.value)*a.derivative};case"cos":return{value:Math.cos(a.value),derivative:-Math.sin(a.value)*a.derivative};case"ln":return{value:Math.log(a.value),derivative:a.derivative/a.value};case"abs":return{value:Math.abs(a.value),derivative:Math.sign(a.value)*a.derivative};case"exp":return{value:Math.exp(a.value),derivative:Math.exp(a.value)*a.derivative};}}
 const a=evaluate(expr.left,x,c),b=evaluate(expr.right,x,c);switch(expr.kind){case"+":return{value:a.value+b.value,derivative:a.derivative+b.derivative};case"-":return{value:a.value-b.value,derivative:a.derivative-b.derivative};case"*":return{value:a.value*b.value,derivative:a.derivative*b.value+a.value*b.derivative};case"/":return{value:a.value/b.value,derivative:(a.derivative*b.value-a.value*b.derivative)/(b.value*b.value)};case"^":{const value=a.value**b.value;return{value,derivative:b.derivative===0?(b.value===0?0:b.value*a.value**(b.value-1)*a.derivative):value*(b.derivative*Math.log(a.value)+b.value*a.derivative/a.value)};}}
}
function normalize(value:string){return value.replace(/−/g,"-").replace(/²/g,"^2").replace(/⁴/g,"^4").replace(/⁵/g,"^5").replace(/π/g,"pi").replace(/\\pi/g,"pi").replace(/\\(?:left|right|,|!|quad|qquad)/g,"").replace(/\\(?:cdot|times)/g,"*").replace(/\\(sin|cos|exp|ln)/g,"$1").replace(/\\(?:dfrac|frac)\{([^{}]+)\}\{([^{}]+)\}/g,"($1)/($2)").replace(/\{([^{}]*)\}/g,"($1)").replace(/\s/g,"").replace(/^(?:F\(x\)|y)=/,"");}
export function gradeSubstitutionAnswer(index:number,answer:string){
 try{if(index<0||index>2)throw new Error("Unknown exercise");const tree=parse(normalize(answer));for(const c of[-2,0,3]){let offset:number|undefined;for(const x of[-2.1,-1.2,-.3,0,.4,1.1,1.8,2.5]){const result=evaluate(tree,x,c),expected=practiceIntegrands[index](x),difference=result.value-practicePrimitives[index](x);if(offset===undefined)offset=difference;if(!Number.isFinite(result.derivative)||!Number.isFinite(difference)||Math.abs(result.derivative-expected)>1e-7*(1+Math.abs(expected))||Math.abs(difference-offset)>1e-6*(1+Math.abs(offset)))return{correct:false,message:"Differentiate your answer and recheck u and du."};}}return{correct:true,message:/[Cc]/.test(answer.replace(/cos/g,""))?"Correct substitution and general antiderivative.":"Correct antiderivative. Add + C for the general answer."};}catch{return{correct:false,message:"Use sin(...), cos(...), arithmetic and powers; then recheck the substitution."};}
}
