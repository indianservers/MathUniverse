export type SeparableMode='xy'|'y';
export type Factor='dy'|'y'|'x'|'dx';
export type FactorSide='pool'|'left'|'right';
export type FactorPositions=Record<Factor,FactorSide>;
export const activeFactors=(mode:SeparableMode):Factor[]=>mode==='xy'?['dy','y','x','dx']:['dy','y','dx'];
export const defaultPositions=(mode:SeparableMode):FactorPositions=>({dy:'left',y:'left',x:mode==='xy'?'right':'pool',dx:'right'});
export const isSeparated=(p:FactorPositions,mode:SeparableMode)=>activeFactors(mode).every(f=>p[f]===(f==='dy'||f==='y'?'left':'right'));
export const separableValue=(x:number,mode:SeparableMode,c=2)=>c*Math.exp(mode==='xy'?x*x/2:x);
export const separableSlope=(x:number,y:number,mode:SeparableMode)=>mode==='xy'?x*y:y;
export const separableDerivative=(x:number,mode:SeparableMode,c=2)=>(mode==='xy'?x:1)*c*Math.exp(mode==='xy'?x*x/2:x);
export const measuredCurveSlope=(x:number,mode:SeparableMode)=>{const h=1e-4;return (separableValue(x+h,mode)-separableValue(x-h,mode))/(2*h);};
export const clampPoint=(x:number)=>Math.max(-1.1,Math.min(1.1,Math.round(x*20)/20));

type Expr={kind:'number';n:number}|{kind:'variable';name:string}|{kind:'neg'|'ln'|'abs'|'exp';arg:Expr}|{kind:'+'|'-'|'*'|'/'|'^';left:Expr;right:Expr};
type Context={x:number;y:number;c:number;d:number};
function normalize(source:string){return source.replace(/²/g,'^2').replace(/−/g,'-').replace(/\\(?:left|right|,|!|quad|qquad)/g,'').replace(/\\(?:ln|log)/g,'ln').replace(/\\exp/g,'exp').replace(/\\(?:cdot|times)/g,'*').replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g,'($1)/($2)').replace(/\{([^{}]*)\}/g,'($1)').replace(/(?:ln|log)\|([xy])\|/g,'ln(abs($1))').replace(/\|([xy])\|/g,'abs($1)').replace(/\s/g,'');}
function parse(source:string):Expr{
 const s=normalize(source);if(!s||s.length>256)throw new Error('Unsupported expression');
 const tokens=s.match(/(?:\d+(?:\.\d*)?|\.\d+)|exp|ln|log|abs|[xCyced()+\-*/^]/g)??[];if(tokens.join('')!==s||tokens.length>128)throw new Error('Unsupported notation');let i=0;
 const atom=():Expr=>{const t=tokens[i++];if(t&&/^[xCyced]$/.test(t))return{kind:'variable',name:t.toLowerCase()};if(t==='('){const value=add();if(tokens[i++]!==')')throw new Error('Missing parenthesis');return value;}if(t==='ln'||t==='log'||t==='abs'||t==='exp'){if(tokens[i++]!=='(')throw new Error('Use parentheses');const arg=add();if(tokens[i++]!==')')throw new Error('Missing parenthesis');return{kind:t==='log'?'ln':t,arg};}if(t&&/^(?:\d|\.)/.test(t))return{kind:'number',n:Number(t)};throw new Error('Expected value');};
 const power=():Expr=>{const left=atom();return tokens[i]==='^'?(i++,{kind:'^',left,right:unary()}):left;};
 const unary=():Expr=>tokens[i]==='-'?(i++,{kind:'neg',arg:unary()}):tokens[i]==='+'?(i++,unary()):power();
 const begins=()=>!!tokens[i]&&/^(?:\d|\.|[xCyced(]|exp|ln|log|abs)/.test(tokens[i]);
 const multiply=():Expr=>{let value=unary();while(tokens[i]==='*'||tokens[i]==='/'||begins()){const kind=tokens[i]==='/'?'/':'*';if(tokens[i]==='*'||tokens[i]==='/')i++;value={kind,left:value,right:unary()};}return value;};
 const add=():Expr=>{let value=multiply();while(tokens[i]==='+'||tokens[i]==='-'){const kind=tokens[i++] as '+'|'-';value={kind,left:value,right:multiply()};}return value;};const value=add();if(i!==tokens.length)throw new Error('Unexpected token');return value;
}
function evaluate(node:Expr,p:Context):number{switch(node.kind){case'number':return node.n;case'variable':return node.name==='e'?Math.E:p[node.name as keyof Context];case'neg':return-evaluate(node.arg,p);case'ln':return Math.log(evaluate(node.arg,p));case'exp':return Math.exp(evaluate(node.arg,p));case'abs':return Math.abs(evaluate(node.arg,p));default:{const a=evaluate(node.left,p),b=evaluate(node.right,p);switch(node.kind){case'+':return a+b;case'-':return a-b;case'*':return a*b;case'/':return a/b;case'^':return a**b;}}}}
const close=(a:number,b:number)=>Number.isFinite(a)&&Math.abs(a-b)<=1e-7*(1+Math.abs(b));
function sample(source:string,expected:(p:Context)=>number,contexts:Context[]){try{const expr=parse(source);return contexts.every(p=>close(evaluate(expr,p),expected(p)));}catch{return false;}}
const contexts:Context[]=[-.8,.3,1.4,2.1].flatMap(x=>[-1,0,1,2].flatMap(c=>[.5,2].map(d=>({x,y:.4+x*x,c,d}))));
function affine(source:string,kind:'integral'|'family'):{a:number;b:number}|null{try{if(/[yd]/i.test(normalize(source)))return null;const tree=parse(source);const value=(x:number,c:number)=>{const v=evaluate(tree,{x,c,y:2,d:1});return kind==='family'?v/Math.exp(x*x):v-x*x;};const b=value(.3,0),a=value(.3,1)-b;if(!Number.isFinite(a)||Math.abs(a)<1e-8)return null;for(const x of[-1.3,-.2,.5,1.8])for(const c of[-2,0,1,2.5])if(!close(value(x,c),a*c+b))return null;return{a,b};}catch{return null;}}
export type PracticeResult={valid:boolean[];allCorrect:boolean;constant:number;messages:string[]};
export function checkSeparablePractice(input:string[]):PracticeResult{
 const v=Array.from({length:7},(_,i)=>input[i]?.trim()??'');
 const left=normalize(v[0]).replace(/dy/g,'d'),right=normalize(v[1]).replace(/dx/g,'d');
 const general=v[4].replace(/^y\s*=\s*/i,''),family=affine(general,'family');
 const constant=family?(3-family.b)/family.a:3;
 const valid=[
  !/[xceC]/.test(left)&&sample(left,p=>p.d/p.y,contexts),
  !/[ycC]/.test(right)&&sample(right,p=>2*p.x*p.d,contexts),
  !/[xcdC]/.test(normalize(v[2]))&&sample(v[2],p=>Math.log(p.y),contexts),
  affine(v[3],'integral')!==null,
  family!==null,
  !/[xycCd]/.test(normalize(v[5].replace(/^C\s*=\s*/i,'')))&&sample(v[5].replace(/^C\s*=\s*/i,''),()=>constant,contexts),
  !/[ydcC]/.test(normalize(v[6].replace(/^y\s*=\s*/i,'')))&&sample(v[6].replace(/^y\s*=\s*/i,''),p=>3*Math.exp(p.x*p.x),contexts),
 ];
 return{valid,allCorrect:valid.every(Boolean),constant,messages:['Use dy/y on the left.','Use 2x dx on the right.','Integrate 1/y to ln|y| (ln y also works for this positive solution).','Integrate 2x to x² plus an arbitrary constant.','Exponentiate and include an arbitrary multiplier: y = C e^(x²).',`Apply y(0)=3 to your general expression: C = ${Number(constant.toFixed(6))}.`,'The particular solution is y = 3e^(x²).']};
}
