export const homogeneousSlope=(x:number,y:number)=>x===0?null:1+y/x;
export const homogeneousSolution=(x:number,c:number)=>x===0?null:x*(Math.log(Math.abs(x))+c);
export const homogeneousDerivative=(x:number,c:number)=>x===0?null:Math.log(Math.abs(x))+c+1;
export const rayScale=(x:number,y:number)=>Math.max(.25,Math.min(1.45,Math.round(((4*x+2*y)/20)*20)/20));
export const scaleExamples=[{x:3,y:1,t:2},{x:2,y:-1,t:3},{x:-4,y:2,t:2}].map(p=>({...p,scaledX:p.x*p.t,scaledY:p.y*p.t,value:homogeneousSlope(p.x,p.y)!}));
export function solutionBranch(c:number,side:-1|1){
 return Array.from({length:181},(_,i)=>{const x=side*(.01+i*(3.99/180));return {x,y:homogeneousSolution(x,c)!};}).sort((a,b)=>a.x-b.x);
}
type Expr={kind:'n';value:number}|{kind:'x'|'c'}|{kind:'neg'|'ln'|'abs';arg:Expr}|{kind:'+'|'-'|'*'|'/'|'^';left:Expr;right:Expr};
function parseExpression(source:string):Expr{
 const tokens=source.match(/(?:\d+(?:\.\d*)?|\.\d+)|ln|log|abs|[xCc()+\-*/^]/g)??[];
 if(tokens.join('')!==source||tokens.length>128)throw new Error('Unsupported expression');
 let i=0;
 const atom=():Expr=>{const t=tokens[i++];if(t==='x'||t==='c'||t==='C')return {kind:t==='x'?'x':'c'};if(t==='('){const e=add();if(tokens[i++]!==')')throw new Error('Missing parenthesis');return e;}if(t==='ln'||t==='log'||t==='abs'){if(tokens[i++]!=='(')throw new Error('Use parentheses');const arg=add();if(tokens[i++]!==')')throw new Error('Missing parenthesis');return {kind:t==='abs'?'abs':'ln',arg};}if(t&&/^\d|^\./.test(t))return {kind:'n',value:Number(t)};throw new Error('Expected value');};
 const power=():Expr=>{const left=atom();return tokens[i]==='^'?(i++,{kind:'^',left,right:unary()}):left;};
 const unary=():Expr=>tokens[i]==='-'?(i++,{kind:'neg',arg:unary()}):tokens[i]==='+'?(i++,unary()):power();
 const startsAtom=()=>!!tokens[i]&&/^(?:\d|\.|x|c|C|\(|ln|log|abs)/.test(tokens[i]);
 const multiply=():Expr=>{let e=unary();while(tokens[i]==='*'||tokens[i]==='/'||startsAtom()){const op=tokens[i]==='/'?'/':'*';if(tokens[i]==='*'||tokens[i]==='/')i++;e={kind:op,left:e,right:unary()};}return e;};
 const add=():Expr=>{let e=multiply();while(tokens[i]==='+'||tokens[i]==='-'){const op=tokens[i++] as '+'|'-';e={kind:op,left:e,right:multiply()};}return e;};
 const result=add();if(i!==tokens.length)throw new Error('Unexpected token');return result;
}
function evaluate(e:Expr,x:number,c:number):number{
 switch(e.kind){case'n':return e.value;case'x':return x;case'c':return c;case'neg':return -evaluate(e.arg,x,c);case'ln':return Math.log(evaluate(e.arg,x,c));case'abs':return Math.abs(evaluate(e.arg,x,c));default:{const a=evaluate(e.left,x,c),b=evaluate(e.right,x,c);switch(e.kind){case'+':return a+b;case'-':return a-b;case'*':return a*b;case'/':return a/b;case'^':return a**b;}}}
}
function normalize(s:string){return s.replace(/^(?:(?:the\s+)?(?:solution|answer)\s*(?:is)?|therefore|hence|thus|so)\s*[:=]?\s*/i,'').replace(/\s+(?:for\s+)?x\s*(?:>|<|≠|!=|\\ne(?:q)?)\s*0[.)]?\s*$/,'').replace(/\\(?:left|right|,|!|quad|qquad)/g,'').replace(/\\(?:ln|log)/g,'ln').replace(/\\(?:cdot|times)/g,'*').replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g,'($1)/($2)').replace(/\{([^{}]*)\}/g,'($1)').replace(/ln\|x\|/g,'ln(abs(x))').replace(/log\|x\|/g,'ln(abs(x))').replace(/\|x\|/g,'abs(x)').replace(/\s/g,'').replace(/−/g,'-').replace(/[.]$/,'');}
export function checkHomogeneousWork(work:string):{correct:boolean;message:string}{
 if(!work.trim())return {correct:false,message:'Write your solution or sketch the substitution steps first.'};
 const positive=/x\s*>\s*0/.test(work),negative=/x\s*<\s*0/.test(work);
 const xs=positive&&!negative?[.25,.9,1.8,3.3]:negative&&!positive?[-3.1,-1.6,-.35]:[-3.1,-1.6,-.35,.25,.9,1.8,3.3];
 const lines=work.replace(/\\Rightarrow|⇒|→/g,';').split(/[;\n,]/);
 for(const line of lines){
  const s=normalize(line),match=s.match(/(?:^|:)(y|y\/x|\(y\)\/\(x\))=(.+)$/i);if(!match||match[2].length>256)continue;
  try{const tree=parseExpression(match[2]);let valid=true;
   const candidate=(x:number,c:number)=>evaluate(tree,x,c)*(match[1].toLowerCase()==='y'?1:x);
   const inferred=(x:number,c:number)=>candidate(x,c)/x-Math.log(Math.abs(x));
   const base=negative&&!positive?-.9:.9,offset=inferred(base,0),coefficient=inferred(base,1)-offset;
   if(!Number.isFinite(coefficient)||Math.abs(coefficient)<1e-9)valid=false;
   for(const x of xs)for(const c of [-2.3,-1,0,1,2.3]){
    const value=inferred(x,c),expected=offset+coefficient*c;
    if(!Number.isFinite(value)||Math.abs(value-expected)>1e-7*(1+Math.abs(expected)))valid=false;
   }
   if(valid)return {correct:true,message:positive&&!negative?'Correct on x > 0. The full family is y = x ln|x| + Cx, with x ≠ 0.':negative&&!positive?'Correct on x < 0. The full family is y = x ln|x| + Cx, with x ≠ 0.':'Correct: y = x ln|x| + Cx. Use x ≠ 0; each solution is defined on one side of zero.'};
  }catch{/* Unsupported student notation gets a constructive hint below. */}
 }
 return {correct:false,message:'Let v = y/x and y = vx. Then y′ = v + xv′, so v′ = 1/x. Integrate and write y = x(ln|x| + C), with x ≠ 0.'};
}
