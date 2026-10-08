export function geometryChecks(id,prompt,before,after){
  const reasons=[],near=(a,b)=>Math.abs(a-b)<=1e-6,eq=(a,b)=>Array.isArray(a)&&a.length>=b.length&&b.every((v,i)=>near(a[i],v));
  const fail=s=>reasons.push('VERIFICATION_FAILURE: '+s),objects=after.objects,added=objects.filter(o=>!before.objects.some(b=>b.id===o.id)),circles=objects.filter(o=>o.type==='circle');
  const center=o=>o.type==='circle'?o.position:o.vertices[0].map((_,i)=>o.vertices.reduce((s,p)=>s+p[i],0)/o.vertices.length);
  const area=o=>Math.abs(o.vertices.reduce((s,p,i)=>{const q=o.vertices[(i+1)%o.vertices.length];return s+p[0]*q[1]-p[1]*q[0];},0))/2;
  const value=after.memory.lastMathResult?.value;
  if(objects.some(o=>o.vertices.flat().some(n=>!Number.isFinite(n))))fail('Non-finite committed geometry');
  const circleRadius={7:5,8:4,16:5,19:5,21:3,25:7}[id];if(circleRadius!==undefined&&!added.some(o=>o.type==='circle'&&near(o.radius,circleRadius)))fail('Requested circle radius '+circleRadius);
  if([10,20].includes(id)){const side=id===10?5:4;if(!added.some(o=>o.type==='square'&&near(area(o),side*side)&&o.vertices.every((p,i)=>near(Math.hypot(...p.map((n,j)=>n-o.vertices[(i+1)%4][j])),side))))fail('Square side length '+side);}
  if([11,23].includes(id)){const expected=id===11?[[0,0],[6,0],[3,4]]:[[0,0],[4,0],[2,3]];if(!added.some(o=>o.type==='triangle'&&o.vertices.length===3&&o.vertices.every((p,i)=>eq(p,expected[i]))))fail('Explicit triangle vertices');}
  const pointExpected={1:[3,4],2:[-2,5],18:[3,-2],28:[3,2],49:[8,2],96:[3,3],97:[3,3]}[id];if(pointExpected&&!added.some(o=>o.type==='point'&&eq(o.position,pointExpected)))fail('New point must be '+pointExpected);
  if([3,4,22].includes(id)){const ends={3:[[3,4],[-2,5]],4:[[0,0],[6,4]],22:[[0,0],[5,5]]}[id];if(!added.some(o=>o.type==='line'&&eq(o.vertices[0],ends[0])&&eq(o.vertices[1],ends[1])))fail('Line endpoints');}
  if([5,6].includes(id)&&!added.some(o=>o.type===(id===5?'ray':'vector')))fail('A plain line is not a ray or directed vector');
  if([9,17].includes(id)){const o=added.find(o=>o.type==='rectangle');if(!o||!near(o.command.width,4)||!near(o.command.height,id===9?6:7)||!near(area(o),4*(id===9?6:7)))fail('Rectangle dimensions and area');}
  if(id===12){const o=added.find(o=>o.type==='triangle');if(!o||!o.vertices.every((p,i)=>near(Math.hypot(...p.map((n,j)=>n-o.vertices[(i+1)%3][j])),6)))fail('Equilateral sides must all equal 6');}
  if(id===13){const o=added.find(o=>o.type==='hexagon');if(!o||o.vertices.length!==6||!o.vertices.every((p,i)=>near(Math.hypot(...p.map((n,j)=>n-o.vertices[(i+1)%6][j])),3)))fail('Six regular hexagon sides must equal 3');}
  if(id===27&&!eq(value,[3,2]))fail('Segment midpoint');
  if(id===35&&!eq(value,[2,3]))fail('Circle center');
  if(id===37&&!eq(value,[-1.5,0]))fail('Line x intercept');
  if(id===38&&!eq(value,[0,3]))fail('Line y intercept');
  if([39,40].includes(id)&&value!==false)fail('Expected false relationship');
  if(id===42&&!circles.some(o=>eq(center(o),[3,0])))fail('Circle translation right 3');
  if(id===44&&!circles.some(o=>eq(center(o),[3,2])))fail('Pending translation up 2');
  if(id===45&&(circles.length!==2||circles.some(o=>!near(o.radius,5))))fail('Duplicate circle parameters');
  if(id===46&&!circles.some(o=>eq(center(o),[13,2])))fail('Second circle destination');
  if(id===47&&value!==true)fail('Externally tangent circles');
  if(id===48&&!Array.isArray(value?.[0])||id===48&&!eq(value?.[0],[8,2]))fail('Tangent point');
  if(id===50&&(circles.length!==1||circles[0].label!=='C2'))fail('Only first circle deleted');
  if(id===52&&!objects.some(o=>o.type==='triangle'&&near(o.command.rotation[2],45)))fail('Pending rotation is 45 degrees');
  if(id===57&&!circles.some(o=>eq(center(o),[2,3])&&near(o.radius,4)))fail('Circle center and radius revisions');
  if(id===63&&!objects.some(o=>o.type==='rectangle'&&near(o.command.scale,2)))fail('Rectangle scale factor 2');
  if(id===68&&(after.memory.selectedIds.length!==2||!after.memory.selectedIds.every(x=>circles.some(o=>o.id===x))))fail('Select both circles only');
  if(id===69&&!circles.every(o=>near(center(o)[0],-2)))fail('Both circles translated left 2');
  if(id===72&&(circles.length!==1||!near(circles[0].radius,5)))fail('Radius revision must retain object');
  if(id===74&&!circles.some(o=>eq(center(o),[-4,0])))fail('Revised move destination left 4');
  if(id===76&&!circles.some(o=>near(o.command.rotation[2],45)))fail('Revised total rotation 45');
  if(id===78&&!after.memory.selectedIds.some(x=>objects.find(o=>o.id===x)?.label==='CD'))fail('Reference revision selects the other line');
  if(id===82&&circles.some(o=>o.label==='C2'))fail('Delete only second circle');
  if(id===82&&(circles.length!==2||!circles.some(o=>o.label==='C1')||!circles.some(o=>o.label==='C3')))fail('Unchosen circles must survive');
  if(id===98){const o=objects.find(o=>o.type==='rectangle');if(!o||!near(area(o),24))fail('Area invariant 24 after every turn');}
  if(id===100){
    if(/^Make another/.test(prompt)&&(circles.length!==2||circles.some(o=>!near(o.radius,5))))fail('Two radius 5 circles');
    if(/^Move the second one/.test(prompt)&&!circles.some(o=>eq(center(o),[10,0])))fail('Second circle at (10,0)');
    if(/^Are they tangent/.test(prompt)&&value!==true)fail('Tangency true');
    if(/^Where/.test(prompt)&&!eq(value?.[0],[5,0]))fail('Touch point (5,0)');
    if(/^Mark/.test(prompt)&&!added.some(o=>o.type==='point'&&eq(o.position,[5,0])))fail('Mark touch point');
    if(/^Draw a vertical/.test(prompt)&&!added.some(o=>o.type==='line'&&o.vertices.every(p=>near(p[0],5))))fail('Vertical line through (5,0)');
    if(/^What's the distance/.test(prompt)&&!near(Number(value),5))fail('Distance to origin 5');
    if(/^Move the second circle/.test(prompt)&&!circles.some(o=>eq(center(o),[12,0])))fail('Second circle at (12,0)');
    if(/^Are they still/.test(prompt)&&value!==false)fail('Separated circles are not tangent');
    if(/^And now/.test(prompt)&&value!==true)fail('Tangency restored after undo');
    if(/^Move them up/.test(prompt)&&(circles.length!==2||!circles.every(o=>near(center(o)[1],3)&&near(o.radius,5))||!near(Math.hypot(...center(circles[0]).map((n,i)=>n-center(circles[1])[i])),10)))fail('Joint translation preserves radii and separation');
  }
  return reasons;
}
