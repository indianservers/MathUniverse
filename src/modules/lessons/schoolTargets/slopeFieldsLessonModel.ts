export type FieldEquation="minus"|"logistic"|"plus";
export type FieldPoint={x:number;y:number};
export const fieldEquations:{id:FieldEquation;formula:string}[]=[{id:"minus",formula:"x-y"},{id:"logistic",formula:"y(1-y)"},{id:"plus",formula:"x+y"}];
export function fieldSlope(equation:FieldEquation,x:number,y:number) {return equation==="minus"?x-y:equation==="plus"?x+y:y*(1-y);}
export function fieldSolution(equation:FieldEquation,initial:FieldPoint,x:number):number|null {
  if(![x,initial.x,initial.y].every(Number.isFinite))throw new Error("Finite coordinates required.");
  if(equation==="minus")return x-1+(initial.y-initial.x+1)*Math.exp(initial.x-x);
  if(equation==="plus")return -x-1+(initial.y+initial.x+1)*Math.exp(x-initial.x);
  if(initial.y===0||initial.y===1)return initial.y;
  if(initial.y<0||initial.y>1){const pole=initial.x+Math.log((initial.y-1)/initial.y);if((x-pole)*(initial.x-pole)<=0)return null;}
  const exp=Math.exp(x-initial.x);return initial.y*exp/(1-initial.y+initial.y*exp);
}
export function fieldSegments(equation:FieldEquation,radius:number) {
  if(!Number.isInteger(radius)||radius<3||radius>5)throw new Error("Field radius must be 3 to 5.");
  const segments=[];
  for(let ix=-radius*4;ix<=radius*4;ix++)for(let iy=-radius*4;iy<=radius*4;iy++){
    const x=ix/4,y=iy/4,slope=fieldSlope(equation,x,y),dx=.08/Math.hypot(1,slope);segments.push({x,y,slope,x1:x-dx,y1:y-slope*dx,x2:x+dx,y2:y+slope*dx});
  }
  return segments;
}
export function sampleFieldSolution(equation:FieldEquation,initial:FieldPoint,radius:number) {return Array.from({length:801},(_,i)=>{const x=-radius-.2+(radius+.2)*2*i/800;return {x,y:fieldSolution(equation,initial,x)};});}
export function checkSlopePractice(initial:FieldPoint,equation:FieldEquation,behavior:string,slope:string,equilibrium:string) {return equation==="minus"&&Math.abs(initial.x-2)<.011&&Math.abs(initial.y+1)<.011&&behavior==="increase"&&slope.trim()!==""&&Number(slope)===-3&&equilibrium==="none";}
