export type ProofRow10057={id:string;reason:string};
export const proofFacts10057=[
{id:'G1',statement:'AB = AC',reason:'Given',kind:'Given'},
{id:'D1',statement:'△ABC is isosceles.',reason:'Definition of isosceles triangle',kind:'Definition',cardTitle:'Definition of isosceles triangle'},
{id:'T1',statement:'∠B = ∠C',reason:'Isosceles Triangle Theorem',kind:'Axiom / Theorem',cardTitle:'Isosceles Triangle Theorem',cardDetail:'If AB = AC, then ∠B = ∠C.'},
{id:'R1',statement:'AB = AB',reason:'Reflexive Property',kind:'Axiom / Theorem',cardTitle:'Reflexive Property',cardDetail:'AB = AB.'},
{id:'D2',statement:'An angle is formed by two rays with a common endpoint.',reason:'Definition of ∠',kind:'Definition',cardTitle:'Definition of ∠',cardDetail:'An angle is the figure formed by two rays with a common endpoint.'},
{id:'G2',statement:'△ABC is a triangle.',reason:'Given',kind:'Given'}];
export const proofExpected10057=['G1','D1','T1'];
export const proofInitial10057=()=>proofExpected10057.map(id=>({id,reason:proofFacts10057.find(f=>f.id===id)!.reason}));
export const proofBroken10057=():ProofRow10057[]=>[{id:'T1',reason:'Given'},{id:'D1',reason:'Isosceles Triangle Theorem'},{id:'G1',reason:''}];
export function proofValidate10057(rows:ProofRow10057[]){const known=new Set<string>();const steps=rows.map(row=>{const f=proofFacts10057.find(f=>f.id===row.id);let message='';if(!f)message='Choose a known statement.';else if(!row.reason)message='Choose a reason.';else if(row.reason!==f.reason)message=row.id==='T1'&&row.reason==='Given'?'The conclusion is not a given. Assuming it would be circular.':'This reason does not justify this statement.';else if(row.id==='D1'&&!known.has('G1'))message='First establish AB = AC before classifying the triangle.';else if(row.id==='T1'&&!known.has('G1')&&!known.has('D1'))message='First establish equal sides or the isosceles classification.';if(!message)known.add(row.id);return{valid:!message,message:message||'Justified by the stated premises and earlier valid steps.'};});return{steps,valid:rows.length>0&&steps.every(s=>s.valid)&&known.has('T1'),complete:known.has('T1')};}
