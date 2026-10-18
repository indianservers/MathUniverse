export function parseFraction(value:string):number|null{
 const s=value.trim().replace(/−/g,"-").replace(/\s/g,"").replace(/\\(?:d?frac)\{([^{}]+)\}\{([^{}]+)\}/g,"$1/$2");
 if(s.length>50||! /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:\/[+-]?(?:\d+(?:\.\d*)?|\.\d+))?$/.test(s))return null;
 const parts=s.split("/").map(Number),n=parts.length===2?parts[0]/parts[1]:parts[0];return Number.isFinite(n)?n:null;
}
export function stepFraction(value:string,amount:number){const n=parseFraction(value)??0;const denominator=value.replace(/\s/g,"").match(/\/([1-9]\d*)$/)?.[1];if(denominator){const d=Number(denominator),numerator=(n+amount)*d;if(Number.isSafeInteger(Math.round(numerator))&&Math.abs(numerator-Math.round(numerator))<1e-9)return `${Math.round(numerator)}/${d}`;}return String(Number((n+amount).toFixed(10)));}
export function solveLinearFractions(xCoefficient:number,constant:number,p:number,q:number){if(p===q)throw new RangeError("Distinct linear factors required");const a=(constant-p*xCoefficient)/(q-p);return {a,b:xCoefficient-a};}
export function coefficientState(a:number|null,b:number|null,practice=false){
 const valid=a!==null&&b!==null,coefficient=valid?a+b:null,constant=valid?(practice?2*a-3*b:2*a+b):null;
 const xMatches=coefficient!==null&&Math.abs(coefficient-(practice?2:3))<1e-9,constantMatches=constant!==null&&Math.abs(constant-(practice?7:5))<1e-9;
 return {valid,coefficient,constant,xMatches,constantMatches,solved:xMatches&&constantMatches};
}
export function rationalFunction(x:number){if(x===-2||x===-1)return null;return (3*x+5)/((x+1)*(x+2));}
export function rationalBranches(count=1001){
 if(!Number.isInteger(count)||count<2)throw new RangeError("At least two samples per branch required");
 return [[-7,-2.002],[-1.998,-1.002],[-.998,7]].map(([a,b])=>Array.from({length:count},(_,i)=>{const x=a+(b-a)*i/(count-1);return {x,y:rationalFunction(x)!};}));
}
export function primitive(x:number,practice=false){if(practice?(x===3||x===-2):(x===-1||x===-2))return null;return practice?13/5*Math.log(Math.abs(x-3))-3/5*Math.log(Math.abs(x+2)):2*Math.log(Math.abs(x+1))+Math.log(Math.abs(x+2));}
