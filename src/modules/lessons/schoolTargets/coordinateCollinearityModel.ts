export type ExactPoint={x:string;y:string};
export type ExactPoints=Record<'a'|'b'|'c',ExactPoint>;
type Q={n:bigint;d:bigint};
const gcd=(a:bigint,b:bigint):bigint=>{a=a<0n?-a:a;b=b<0n?-b:b;while(b){const r=a%b;a=b;b=r;}return a||1n;};
const q=(n:bigint,d=1n):Q=>{if(!d)throw new Error('Zero denominator');if(d<0n){n=-n;d=-d;}const g=gcd(n,d);return{n:n/g,d:d/g};};
const add=(a:Q,b:Q)=>q(a.n*b.d+b.n*a.d,a.d*b.d),neg=(a:Q)=>q(-a.n,a.d),sub=(a:Q,b:Q)=>add(a,neg(b)),mul=(a:Q,b:Q)=>q(a.n*b.n,a.d*b.d),div=(a:Q,b:Q)=>q(a.n*b.d,a.d*b.n),cmp=(a:Q,b:Q)=>a.n*b.d-b.n*a.d;
const str=(a:Q)=>a.d===1n?String(a.n):`${a.n}/${a.d}`,num=(a:Q)=>{const n=Number(a.n),d=Number(a.d);if(Number.isFinite(n)&&Number.isFinite(d))return n/d;const sign=a.n<0n?-1:1,ns=String(a.n<0n?-a.n:a.n),ds=String(a.d),nl=Math.min(16,ns.length),dl=Math.min(16,ds.length);return sign*Number(ns.slice(0,nl))/Number(ds.slice(0,dl))*10**(ns.length-nl-ds.length+dl);},zero=q(0n),one=q(1n);
export function exactCoordinate(value:string):Q{
 if(value.length>2000)throw new Error('Coordinate too long');
 const s=value.trim();if(s.includes('/')){const parts=s.split('/');if(parts.length!==2)throw new Error('Invalid fraction');return div(exactCoordinate(parts[0]),exactCoordinate(parts[1]));}
 const m=s.match(/^([+-]?)(\d+(?:\.\d*)?|\.\d+)(?:e([+-]?\d+))?$/i);if(!m)throw new Error('Enter a finite coordinate');const exponent=Number(m[3]||0);if(Math.abs(exponent)>30)throw new Error('Exponent out of range');const [whole,fraction='']=m[2].split('.'),digits=BigInt((whole||'0')+fraction)*(m[1]==='-'?-1n:1n),power=exponent-fraction.length;return power>=0?q(digits*10n**BigInt(power)):q(digits,10n**BigInt(-power));
}
export const coordinateNumber=(s:string)=>num(exactCoordinate(s));
export const exactCoordinateText=(s:string)=>str(exactCoordinate(s));
export function boundedCoordinate(s:string,min:number,max:number){const v=exactCoordinate(s);if(cmp(v,q(BigInt(min)))<0n||cmp(v,q(BigInt(max)))>0n)throw new Error('Coordinate outside bounds');return str(v);}
export const startCollinearity:ExactPoints={a:{x:'1',y:'2'},b:{x:'3',y:'4'},c:{x:'5',y:'6'}};
const point=(p:ExactPoint)=>({x:exactCoordinate(p.x),y:exactCoordinate(p.y)});
export function coordinateCollinearityModel(points:ExactPoints){
 const a=point(points.a),b=point(points.b),c=point(points.c),dx=sub(b.x,a.x),dy=sub(b.y,a.y),det=sub(mul(dx,sub(c.y,a.y)),mul(dy,sub(c.x,a.x))),signed=div(det,q(2n)),area=q(signed.n<0n?-signed.n:signed.n,signed.d),lineDefined=dx.n!==0n||dy.n!==0n,length=Math.hypot(num(dx),num(dy)),distance=lineDefined?Math.abs(num(det))/length:null,slope=lineDefined&&dx.n!==0n?div(dy,dx):null,intercept=slope?sub(a.y,mul(slope,a.x)):null;
 const numeric=Object.fromEntries(Object.entries(points).map(([k,p])=>[k,{x:coordinateNumber(p.x),y:coordinateNumber(p.y)}])) as Record<keyof ExactPoints,{x:number;y:number}>;
 return{numeric,det:num(det),signed:num(signed),area:num(area),exactDet:str(det),exactSigned:str(signed),exactArea:str(area),collinear:det.n===0n,lineDefined,distance,dx:num(dx),dy:num(dy),slope:slope?str(slope):null,intercept:intercept?str(intercept):null};
}
export function snapCollinearity(points:ExactPoints):ExactPoints{
 if(coordinateCollinearityModel(points).collinear)return points;
 const a=point(points.a),b=point(points.b),c=point(points.c),dx=sub(b.x,a.x),dy=sub(b.y,a.y),norm=add(mul(dx,dx),mul(dy,dy));if(norm.n===0n)return points;
 let t=div(add(mul(sub(c.x,a.x),dx),mul(sub(c.y,a.y),dy)),norm),lo:Q|null=null,hi:Q|null=null;
 for(const [origin,delta,min,max]of[[a.x,dx,-6,6],[a.y,dy,-6,7]] as const){if(delta.n===0n)continue;let l=div(sub(q(BigInt(min)),origin),delta),h=div(sub(q(BigInt(max)),origin),delta);if(cmp(l,h)>0)[l,h]=[h,l];if(!lo||cmp(l,lo)>0)lo=l;if(!hi||cmp(h,hi)<0)hi=h;}
 if(lo&&cmp(t,lo)<0)t=lo;if(hi&&cmp(t,hi)>0)t=hi;
 return{...points,c:{x:str(add(a.x,mul(t,dx))),y:str(add(a.y,mul(t,dy)))}};
}
type Affine={x:Q;y:Q;c:Q};
const constant=(c:Q):Affine=>({x:zero,y:zero,c}),sum=(a:Affine,b:Affine):Affine=>({x:add(a.x,b.x),y:add(a.y,b.y),c:add(a.c,b.c)}),scale=(a:Affine,v:Q):Affine=>({x:mul(a.x,v),y:mul(a.y,v),c:mul(a.c,v)}),hasVariable=(a:Affine)=>a.x.n!==0n||a.y.n!==0n;
function parseAffine(source:string):Affine{
 const text=source.toLowerCase().replace(/\s/g,'').replace(/[−–]/g,'-').replace(/×/g,'*');if(!text||text.length>200)throw new Error('Invalid equation');const tokens:string[]=[];let at=0;while(at<text.length){const m=text.slice(at).match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|^[xy()+*/-]/);if(!m)throw new Error('Use x, y and arithmetic only');tokens.push(m[0]);at+=m[0].length;}if(tokens.length>100)throw new Error('Equation too long');let i=0;
 const factor=():Affine=>{const token=tokens[i++];if(token==='+')return factor();if(token==='-')return scale(factor(),q(-1n));if(token==='('){const a=expression();if(tokens[i++]!==')')throw new Error('Missing parenthesis');return a;}if(token==='x')return{x:one,y:zero,c:zero};if(token==='y')return{x:zero,y:one,c:zero};if(token&&/^[\d.]/.test(token))return constant(exactCoordinate(token));throw new Error('Missing expression');};
 const product=():Affine=>{let a=factor();while(i<tokens.length){const token=tokens[i],implicit=token==='('||token==='x'||token==='y'||/^[\d.]/.test(token);if(token!=='*'&&token!=='/'&&!implicit)break;if(!implicit)i++;const b=factor();if(token==='/'){if(hasVariable(b))throw new Error('Variable denominator');a=scale(a,div(one,b.c));}else{if(hasVariable(a)&&hasVariable(b))throw new Error('Not a linear equation');a=hasVariable(b)?scale(b,a.c):scale(a,b.c);}}return a;};
 const expression=():Affine=>{let a=product();while(tokens[i]==='+'||tokens[i]==='-'){const op=tokens[i++],b=product();a=sum(a,op==='-'?scale(b,q(-1n)):b);}return a;};const result=expression();if(i!==tokens.length)throw new Error('Unexpected token');return result;
}
export function checkCollinearityEquation(equation:string,points:ExactPoints){
 try{const parts=equation.split('=');if(parts.length!==2)return false;const left=parseAffine(parts[0]),right=parseAffine(parts[1]),line=sum(left,scale(right,q(-1n)));if(!hasVariable(line)||!coordinateCollinearityModel(points).lineDefined)return false;return[points.a,points.b].every(p=>{const a=point(p);return add(add(mul(line.x,a.x),mul(line.y,a.y)),line.c).n===0n;});}catch{return false;}
}
