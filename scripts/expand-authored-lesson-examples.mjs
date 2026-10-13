import {readFileSync,writeFileSync} from 'node:fs';
import {buildSync} from 'esbuild';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {seeds} from './authored-lesson-seeds.mjs';
const registry=JSON.parse(readFileSync('src/modules/lessons/catalog/upcoming/apCurriculumRegistry.generated.json','utf8'));
const compiled=buildSync({entryPoints:['src/modules/lessons/authored/authoredLessonModels.ts'],bundle:true,platform:'node',format:'esm',write:false});
const runtime=resolve('tmp/authored-lessons/expanded-models.mjs');writeFileSync(runtime,compiled.outputFiles[0].text);
const {evaluateAuthoredModel:run}=await import(pathToFileURL(runtime).href);
const focusMetrics=new Map();const M=(ids,labels)=>ids.forEach(id=>focusMetrics.set(id,labels));
M([30001],['Area']);M([30002,30408],['Positive divisor count','Perfect square?']);M([30003],['Odd border','New area']);M([30004],['First triangular number','Combined square']);M([30005,30011],['Outside factor','Remaining radicand','Numerical root']);M([30006,30122,30214],['Lower bound','Upper bound','Approximate root']);M([30007],['Multiplier','Divisor','Root of product']);M([30008],['Volume','Cubes in one layer']);M([30009],['Sum','Representations']);M([30010],['Sum','Mean']);M([30012],['Constant difference order']);M([30013],['Final estimate','Squared-value error']);M([30018,30409],['Final']);M([30019],['Product','Quotient','Product exponent']);M([30020],['Exponent','Value']);M([30021],['Zero power']);M([30022,30354],['Reciprocal','Denominator']);M([30023,30355],['Value','Exponent']);M([30024],['Coefficient','Exponent']);M([30025,30356],['Comparison','Ratio first/second']);
M([30051,30057,30064,30411],['Classification']);M([30052,30053,30054],['Diagonal 1','Diagonal 2']);M([30056,30060],['Diagonal 1','Area','Classification']);M([30059],['Diagonal 1','Diagonal 2','Area']);M([30055,30061],['Half diagonal','Side 1','Side 2']);M([30058],['Fourth angle']);M([30062],['Vertical diagonal','Horizontal diagonal','Area']);M([30063],['Area','Mean base']);
M([30070,30072],['Quotient','Remainder']);M([30071,30073,30074,30398,30399,30400,30401,30412],['Sum parity','Product parity','Sum','Product']);M([30075],['Last two digits','Last three digits']);M([30076],['Last two digits','Last three digits']);M([30077,30079],['Digit sum']);M([30078],['Alternating sum']);M([30080,30081],['Result','B','C','Valid distinct-letter assignment?']);
M([30088,30090,30091,30096,30331,30333,30393,30413,30415],['Distributed value','First partial product','Second partial product']);M([30089],['Direct value','Distributed value']);M([30092],['Square of sum','Cross term']);M([30093],['Square of difference','Cross term']);M([30094],['Product of sum/difference']);M([30095,30097],['Square of sum','Square of difference','Product of sum/difference']);
M([30104,30105],['Simplified first term','Simplified second term']);M([30107,30108,30109,30113,30361],['Corresponding first amount','Unit ratio']);M([30106],['Equivalent ratios?','First cross product','Second cross product']);M([30110,30363],['Total','Cost per item']);M([30111],['First share','Second share']);M([30120,30215],['Rational midpoint','Approximate irrational point']);M([30121],['Reduced numerator','Reduced denominator']);M([30129],['Polynomial?']);M([30130,30131],['Degree']);M([30132],['Value']);M([30138,30139,30141,30142,30143,30381],['x-coordinate','y-coordinate','Location']);M([30140],['Location']);M([30148,30149,30150],['Residual','Solution pair?']);M([30151,30152],['Required y']);M([30157,30158],['Original difference','New difference']);M([30162,30163],['Supplement','Full-turn remainder']);M([30164,30165],['Relationship']);M([30170,30172,30178],['Congruent by SSS?','First perimeter','First area']);M([30171],['Apex angle']);M([30183],['Full chord','Half chord']);M([30189],['Area','Semiperimeter']);M([30190],['Cost at chosen unit rate','Area']);M([30194],['Slant height']);M([30195],['Curved area / π','Total area / π']);M([30196],['Sphere area / π','Hemisphere curved area / π','Hemisphere total area / π']);M([30197],['Volume / π']);M([30198],['Sphere volume / π','Hemisphere volume / π']);M([30199,30348,30307],['Capacity in litres if dimensions are cm','Volume / π']);M([30206,30208],['Total frequency','Estimated mean']);M([30207],['First density','Second density']);M([30212,30213],['HCF','LCM']);M([30220],['First zero','Second zero']);M([30221,30222],['Linear coefficient','Constant','First zero','Second zero']);M([30227,30230,30231,30232],['x','y']);M([30228,30229],['Solution count','Determinant']);M([30238,30239],['Root 1','Root 2','Discriminant']);M([30240],['Distinct real roots','Discriminant']);M([30241],['Root 1','Root 2']);M([30247,30248],['Nth term']);M([30249],['Nth term','Sum']);M([30256],['Length factor','Area factor']);M([30257,30258],['EC','AD/AB','AE/AC']);M([30259,30260,30261,30262],['Scaled first length','Scaled second length','Area factor']);M([30268],['Distance']);M([30269],['Midpoint x','Midpoint y']);M([30274,30275],['Sine','Cosine','Tangent','Cosecant','Secant','Cotangent']);M([30276,30277,30278],['Sine','Cosine','Tangent']);M([30279],['sin²+cos²']);M([30285,30286],['Total height','Rise']);M([30290,30291],['Number of tangents']);M([30292],['Tangent length']);M([30297],['Sector area / π','Arc length / π']);M([30298],['Minor segment area']);M([30299,30300,30301],['Minor segment area','Sector area / π','Arc length / π']);M([30304,30305],['Exposed area / π','Shared disk area / π']);M([30306,30307],['Volume / π']);M([30312],['Estimated mean']);M([30313],['Middle-class mode estimate']);M([30314],['Estimated median']);M([30315],['Estimated mean','Estimated median','Middle-class mode estimate']);M([30321,30323,30326],['Event probability']);M([30324],['Complement probability']);M([30322,30325],['Total outcomes','Favourable outcomes','Probability']);M([30330],['Coefficient','Exponent','Numerical value']);M([30332,30368,30369,30370,30371],['Linear coefficient','Constant']);M([30340,30341],['Area']);M([30342,30343,30344],['Surface area']);M([30345],['Curved area / π','Total area / π']);M([30346],['Volume']);M([30347],['Volume / π']);M([30362],['New time','Workload']);M([30372,30373],['Coefficient','Exponent','Value']);M([30374],['First zero','Second zero','Value at selected x']);M([30380,30382,30383],['Slope','Intercept','Output']);

function candidate(lesson,id,index){
 const controls=lesson.interactive.controls,values=Object.fromEntries(controls.map(c=>[c.key,c.initial]));
 let stride=1;
 for(let j=0;j<controls.length;j++){
  const c=controls[j];if(c.max===c.min)continue;
  const count=Math.round((c.max-c.min)/c.step),position=(id+Math.floor(index/stride)+j*5)%(count+1);
  stride*=count+1;
  values[c.key]=Number((c.min+position*c.step).toPrecision(10));
 }
 if([30052,30053,30054,30056,30060].includes(id))values.angle=90;
 if([30056,30059,30060].includes(id))values.b=values.a;
 if([30170,30172].includes(id))values.scale=1;
 if(id===30080)values.op=1;if(id===30081)values.op=2;
 if(id===30344||id===30346&&index%2===0){values.b=values.a;values.h=values.a;}
 if(id===30355)values.exponent=-1-index%5;
 if(id===30313||id===30315){values.a=2+index%3;values.b=8+index%5;values.c=3+index%2;}
 if(id===30277)values.angle=[30,45,60][index%3];
 if(id===30278)values.angle=index%2?90:0;
 if(id===30129)values.exponent=[2,.5,-1,0,1,3][index%6];
 if(id===30130||id===30131)values.exponent=index%5;
 if(id===30140){const scale=1+Math.floor(index/6)%2;values.x=[2,-3,-4,5,0,2][index%6]*scale;values.y=[3,4,-2,-3,4,0][index%6]*scale;}
 if(id===30142){if(index%2)values.x=0;else values.y=0;}
 if(id===30151||id===30152){if(values.b===0)values.b=1;}
 if(id===30157||id===30158)values.b=values.a;
 if(id===30291){values.distance=[values.radius/2,values.radius,values.radius*2][index%3];}
 if(id===32021&&values.b>values.n)values.b=Math.min(values.b,values.n);
 if(id===32028&&values.a>values.b)values.a=values.b;
 return values;
}
function numericalExample(lesson,id,values,index){
 if(lesson.interactive.model==='differences'){
  const degree=values.degree??2,n=index%12+1,terms=[n,n+1,n+2].map(k=>k**degree),difference=terms[1]-terms[0];
  return {prompt:`For the sequence k^${degree}, find the first difference from index ${n} to ${n+1}.`,steps:[`At index ${n}, the value is ${n}^${degree}=${terms[0]}.`,`At index ${n+1}, the value is ${n+1}^${degree}=${terms[1]}.`,`Subtract consecutive terms: ${terms[1]}−${terms[0]}=${difference}.`,`Successive differences compare neighbouring values; the constant difference appears at order ${degree}.`],answer:String(difference),expected:String(difference),tolerance:1e-7,hint:'Evaluate the two neighbouring powers, then subtract the earlier from the later.'};
 }
 const result=run(lesson.interactive.model,values);
 const wanted=id===30089?['Product increase','Corner contribution']:id===30269?['Section x','Section y','Fraction from A']:id===30178?['Area','Diagonal 1']:id===30278?['Sine','Cosine','Tangent','Cosecant','Secant','Cotangent','sin²+cos²']:(focusMetrics.get(id)??result.outputs.filter(x=>!['Side','Edge','Count','Degree','Initial','Stages','Value','Number','Nonzero base','Leading exponent','Base angle','Height','Distance from centre'].includes(x.label)).map(x=>x.label));
 const available=wanted.map(label=>result.outputs.find(x=>x.label===label)).filter(Boolean);
 if(!available.length)throw new Error(`No topic metric for ${id}`);
 const metric=available[(id===30277?Math.floor(index/3):index)%available.length];
 if(/undefined|NaN|Infinity|not uniquely/i.test(metric.value))throw new Error('Choose an applicable numerical case');
 const parameters=lesson.interactive.controls.map(c=>`${c.label.toLowerCase()} = ${values[c.key]}`).join('; ');
 const prompt=`${parameters}. Find ${metric.label.toLowerCase()}${metric.label.includes('/ π')?' (give the coefficient of π)':''}.`;
 let steps=[...result.steps];
 const answerStep=`${metric.label} = ${metric.value}.`;
 if(!steps.some(s=>s===answerStep))steps.push(answerStep);
 if([30053,30054].includes(id)){steps.push(`The two diagonals have the same squared length ${values.a**2+values.b**2}; congruence, rather than measurement, establishes the equality for all rectangles.`);}
 if(id===30130||id===30131)steps.push('Combine terms with equal exponents before reading the greatest nonzero power.');
 return {prompt,steps,answer:metric.value,expected:metric.value,tolerance:1e-7,hint:`Use ${result.formula}. ${lesson.memoryCue}`};
}
for(const row of registry.upcomingLessons){
 const lesson=seeds.get(row.lessonId);if(!lesson)throw Error(`Missing lesson ${row.lessonId}`);
 lesson.sections=lesson.sections.map(section=>({...section,paragraphs:section.paragraphs.filter(text=>!text.startsWith('After calculating, explain which assumptions')&&!text.startsWith('Start with the stated definitions and identify')&&!text.startsWith('Reproduce one worked calculation without'))}));
 if(['Guided practice','Assessment','Practice set'].includes(row.kind)&&lesson.sections[0].heading==='Retrieval before calculation')lesson.sections[0].paragraphs=lesson.formulas.map(formula=>`${formula.expression}. ${formula.meaning} Conditions: ${formula.restriction}`);
 // Keep authored examples, then add distinct input/result cases tailored to the topic.
 const topicSpecific=row.lessonId>30025&&row.lessonId<32000&&['Concept','Supplement'].includes(row.kind);
 const examples=new Map((topicSpecific?[]:lesson.examples).map(x=>[x.prompt,x]));
 const practice=new Map((topicSpecific?[]:lesson.practice).map(x=>[x.prompt,x]));
 for(let i=0;i<600&&(examples.size<8||practice.size<8);i++){
  try{const task=numericalExample(lesson,row.lessonId,candidate(lesson,row.lessonId,i),i);if(examples.size<8)examples.set(task.prompt,{prompt:task.prompt,steps:task.steps,answer:task.answer});if(practice.size<8)practice.set(task.prompt,task);}catch(error){if(i===599)throw error;}
 }
 if(examples.size<8||practice.size<8)throw Error(`Not enough distinct numerical cases for ${row.lessonId}: ${examples.size}/${practice.size}`);
 lesson.examples=[...examples.values()].slice(0,8);lesson.practice=[...practice.values()].slice(0,8);
 const initial=Object.fromEntries(lesson.interactive.controls.map(c=>[c.key,c.initial])),readout=run(lesson.interactive.model,initial);
 const selected=focusMetrics.get(row.lessonId)??readout.outputs.map(x=>x.label);
 lesson.interactive.prompts=[`For ${lesson.interactive.controls.map(c=>`${c.label.toLowerCase()} ${c.initial}`).join(', ')}, predict ${selected[0]?.toLowerCase()??'the result'}.`,`Explain how ${readout.formula} connects the controls to ${selected.join(', ').toLowerCase()}.`,`Check this claim using the calculation and the definitions: ${lesson.misconceptions[0].mistake}`];
 lesson.objectives=[`Explain ${row.topicName.toLowerCase()}.`,`Calculate and interpret ${selected.join(', ').toLowerCase()} using ${readout.formula}.`,`Recognize why this claim fails: ${lesson.misconceptions[0].mistake}`];
}
