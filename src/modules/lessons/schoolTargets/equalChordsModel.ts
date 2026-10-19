export type ChordHandle='a'|'b'|'c'|'d';
export type EqualChordState={leftRotation:number;rightRotation:number;leftAngle:number;rightAngle:number;overlay:number};
export const equalChordRadius=6/(2*Math.sin(27*Math.PI/180));
export const chordRotation=(v:number)=>((v%360)+360)%360;
export const chordSignedRotation=(v:number)=>chordRotation(v+180)-180;
export const chordAngleLimit=(v:number)=>Math.round(Math.max(10,Math.min(150,v))*1000)/1000;
export function equalChordsModel(state:EqualChordState){
 const{leftRotation:l,rightRotation:r,leftAngle:la,rightAngle:ra,overlay}=state,angles={a:l-la/2,b:l+la/2,c:r+ra/2+overlay,d:r-ra/2+overlay},points=Object.fromEntries(Object.entries(angles).map(([n,a])=>[n,{x:equalChordRadius*Math.cos(a*Math.PI/180),y:equalChordRadius*Math.sin(a*Math.PI/180)}])) as Record<ChordHandle,{x:number;y:number}>,length=(a:ChordHandle,b:ChordHandle)=>Math.hypot(points[a].x-points[b].x,points[a].y-points[b].y),angle=(a:ChordHandle,b:ChordHandle)=>Math.atan2(Math.abs(points[a].x*points[b].y-points[a].y*points[b].x),points[a].x*points[b].x+points[a].y*points[b].y)*180/Math.PI,ab=length('a','b'),cd=length('c','d'),leftCentral=angle('a','b'),rightCentral=angle('c','d'),equalChord=Math.abs(ab-cd)<1e-9,equalAngle=Math.abs(leftCentral-rightCentral)<1e-9;
 return{points,angles,ab,cd,leftCentral,rightCentral,equalChord,equalAngle,holds:equalChord===equalAngle};
}
export function moveEqualChord(state:EqualChordState,handle:ChordHandle,requested:number,locked:boolean){
 if(!Number.isFinite(requested))return state;
 const model=equalChordsModel(state),left=handle==='a'||handle==='b',current=model.angles[handle];
 if(locked){const delta=chordSignedRotation(requested-current);return{...state,[left?'leftRotation':'rightRotation']:chordRotation((left?state.leftRotation:state.rightRotation)+delta)};}
 const other=handle==='a'?'b':handle==='b'?'a':handle==='c'?'d':'c',sign=handle==='a'||handle==='d'?-1:1,anchor=model.angles[other],angle=chordAngleLimit(sign*chordSignedRotation(requested-anchor)),middle=anchor+sign*angle/2;
 return{...state,[left?'leftRotation':'rightRotation']:chordRotation(middle-(left?0:state.overlay)),[left?'leftAngle':'rightAngle']:angle};
}
