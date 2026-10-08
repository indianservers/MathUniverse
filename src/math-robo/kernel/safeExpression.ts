import {normalizeNotation} from './notation';
import {parseMath} from '../../math-foundation/parser';
import type {MathAstNode} from '../../math-foundation/types';
const functions=new Set('sqrt abs sin cos tan sec csc cot asin acos atan sinh cosh tanh exp log ln'.split(' '));
const cache=new Map<string,MathAstNode>();
export function safeAst(source:string):MathAstNode{
 if(source.length>2048)throw new Error('Expression exceeds the 2048-character limit.');
 // Reject deep input before the recursive parser is entered.
 let nesting=0;for(const c of source){if('(['.includes(c)&&++nesting>32)throw new Error('Expression nesting exceeds 32.');if(')]'.includes(c))nesting--;}
 const normalized=normalizeNotation(source).replace(/π/g,'pi').replace(/²/g,'^2').replace(/³/g,'^3').replace(/\b(\d+(?:\.\d+)?)e([+-]?\d+)\b/gi,'($1*10^($2))').replace(/(?<![\w.])(-?\d+)\s+(\d+)\s*\/\s*(\d+)/g,(_,whole:string,numerator:string,denominator:string)=>`${whole.startsWith('-')?'-':''}(${whole.replace('-','')}+${numerator}/${denominator})`);
 if(cache.has(normalized))return structuredClone(cache.get(normalized)!);
 const parsed=parseMath(normalized);if(parsed.ast?.type==='DEFINITION'&&(functions.has(parsed.ast.name)||parsed.ast.parameters.length===0)){
  const definition=parsed.ast,left=parseMath(normalized.slice(0,normalized.indexOf('='))).ast;
  if(left)parsed.ast={...definition,type:'EQUATION',mathType:'EQUATION',left,right:definition.expression};
 }
 if(!parsed.ast||parsed.diagnostics.some(d=>d.severity==='ERROR'))throw new Error(parsed.diagnostics.map(d=>d.message).join('; ')||'Invalid expression.');
 let count=0;function visit(n:MathAstNode,depth=0){if(++count>256||depth>32)throw new Error('Expression exceeds computation limits.');
  if(n.type==='LITERAL'&&n.value.length>256)throw new Error('Literal exceeds 256 digits.');
  if(n.type==='SYMBOL'&&!/^(?:[a-zA-Z\u03b1-\u03c9\u0391-\u03a9]|pi)$/.test(n.name))throw new Error('Only single-letter variables and pi are allowed.');
  if(n.type==='BINARY_OPERATION'){const exponent=n.right.type==='UNARY_OPERATION'?n.right.operand:n.right;if(n.operator==='^'&&(exponent.type!=='LITERAL'||!/^\d+$/.test(exponent.value)||Number(exponent.value)>64))throw new Error('Powers require an integer exponent from -64 to 64.');visit(n.left,depth+1);visit(n.right,depth+1);}
  else if(n.type==='UNARY_OPERATION')visit(n.operand,depth+1);
  else if(n.type==='FUNCTION_CALL'){if(!functions.has(n.name)||n.arguments.length!==1)throw new Error('Unsupported function or argument count.');visit(n.arguments[0],depth+1);}
  else if(n.type==='EQUATION'||n.type==='INEQUALITY'){visit(n.left,depth+1);visit(n.right,depth+1);}
  else if(!['LITERAL','SYMBOL'].includes(n.type))throw new Error('Use a scalar expression or equation.');
 }visit(parsed.ast);
 function estimate(n:MathAstNode):{bits:number;degree:number}{let bits=1,degree=0;
  if(n.type==='LITERAL')bits=Math.max(1,n.value.length*4);
  else if(n.type==='SYMBOL')degree=['pi','e','i'].includes(n.name)?0:1;
  else if(n.type==='UNARY_OPERATION')return estimate(n.operand);
  else if(n.type==='FUNCTION_CALL')return estimate(n.arguments[0]);
  else if(n.type==='BINARY_OPERATION'||n.type==='EQUATION'||n.type==='INEQUALITY'){const a=estimate(n.left),b=estimate(n.right);bits=a.bits+b.bits;degree=Math.max(a.degree,b.degree);if(n.type==='BINARY_OPERATION'&&n.operator==='*')degree=a.degree+b.degree;if(n.type==='BINARY_OPERATION'&&n.operator==='^'){const exponent=n.right.type==='UNARY_OPERATION'?n.right.operand:n.right,k=exponent.type==='LITERAL'?Number(exponent.value):0;bits=a.bits*Math.max(1,k);degree=a.degree*k;}}
  if(bits>16384||degree>64)throw new Error('Estimated integer size or polynomial degree exceeds the computation budget.');return {bits,degree};
 }const size=estimate(parsed.ast),variables=new Set<string>();
 function symbols(n:MathAstNode){if(n.type==='SYMBOL'&&!['pi','e','i'].includes(n.name))variables.add(n.name);else if(n.type==='BINARY_OPERATION'||n.type==='EQUATION'||n.type==='INEQUALITY'){symbols(n.left);symbols(n.right);}else if(n.type==='UNARY_OPERATION')symbols(n.operand);else if(n.type==='FUNCTION_CALL')n.arguments.forEach(symbols);}
 symbols(parsed.ast);let terms=1;for(let i=1;i<=variables.size;i++){terms*=((size.degree+i)/i);if(terms>4096)throw new Error('Potential symbolic expansion exceeds the 4096-term budget.');}
 if(cache.size>=128)cache.delete(cache.keys().next().value!);cache.set(normalized,parsed.ast);return structuredClone(parsed.ast);
}
export function expressionText(ast:MathAstNode):string{
 if(ast.type==='LITERAL')return ast.value;
 if(ast.type==='SYMBOL')return ast.name;
 if(ast.type==='UNARY_OPERATION')return `(${ast.operator}${expressionText(ast.operand)})`;
 if(ast.type==='BINARY_OPERATION')return `(${expressionText(ast.left)}${ast.operator}${expressionText(ast.right)})`;
 if(ast.type==='FUNCTION_CALL')return `${ast.name==='ln'?'log':ast.name}(${ast.arguments.map(expressionText).join(',')})`;
 if(ast.type==='EQUATION'||ast.type==='INEQUALITY')return `${expressionText(ast.left)}${ast.type==='EQUATION'?'=':ast.operator}${expressionText(ast.right)}`;
 throw new Error('Unsupported scalar AST.');
}
export function numericValue(node:MathAstNode,variables:Record<string,number>={}):number{
 let result:number;
 if(node.type==='LITERAL')result=Number(node.value);
 else if(node.type==='SYMBOL')result=node.name==='pi'?Math.PI:node.name==='e'?Math.E:variables[node.name];
 else if(node.type==='UNARY_OPERATION')result=(node.operator==='-'?-1:1)*numericValue(node.operand,variables);
 else if(node.type==='BINARY_OPERATION'){const a=numericValue(node.left,variables),b=numericValue(node.right,variables);result=node.operator==='+'?a+b:node.operator==='-'?a-b:node.operator==='*'?a*b:node.operator==='/'?a/b:a**b;}
 else if(node.type==='FUNCTION_CALL'){const x=numericValue(node.arguments[0],variables),f:Record<string,(x:number)=>number>={sqrt:Math.sqrt,abs:Math.abs,sin:Math.sin,cos:Math.cos,tan:Math.tan,sec:x=>1/Math.cos(x),csc:x=>1/Math.sin(x),cot:x=>1/Math.tan(x),asin:Math.asin,acos:Math.acos,atan:Math.atan,sinh:Math.sinh,cosh:Math.cosh,tanh:Math.tanh,exp:Math.exp,ln:Math.log,log:Math.log};result=f[node.name](x);}
 else throw new Error('A scalar expression is required.');
 if(!Number.isFinite(result))throw new Error('Undefined or non-real value in the specified domain.');return result;
}
