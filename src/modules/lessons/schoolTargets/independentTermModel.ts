import{ciChoose}from'./combinatorialInterpretationModel';
export function itModel(n:number,a:number,b:number,m:number,checker:number){
 const raw=n/(m+1),r=Number.isInteger(raw)?raw:null;
 const coefficient=(k:number)=>ciChoose(n,k)*a**(n-k)*b**k;
 const constant=r===null?null:coefficient(r),exponent=n-(m+1)*checker,left=n-checker,right=-m*checker;
 return{raw,r,constant,constantCoefficient:constant??0,choose:r===null?null:ciChoose(n,r),left,right,exponent,checkerCoefficient:coefficient(checker),checkerValid:Number.isInteger(checker)&&checker>=0&&checker<=n&&exponent===0};
}
export function itValid(s:string,min:number,max:number,integer=false){const v=Number(s);return s.trim()!==''&&Number.isFinite(v)&&v>=min&&v<=max&&(!integer||Number.isInteger(v));}
export function itNumber(v:number){return Number.isInteger(v)?String(v):Number(v.toPrecision(12)).toString();}
