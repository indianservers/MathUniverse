import { FLAT_SHAPES, SOLID_SHAPES } from './shapeCatalog';
import type { IntelligenceMode, VisualCommand } from './commands';

export type IntelligenceExample={request:string;mode:IntelligenceMode;expected:Partial<VisualCommand>;previous?:string};
const creationPhrases=[
  (s:string)=>`Create a ${s} width 6 height 4 radius 2`,
  (s:string)=>`Draw a blue ${s} width 6 height 4 radius 2`,
  (s:string)=>`Please build a ${s} width 6 height 4 radius 2`,
  (s:string)=>`Can you construct a ${s} width 6 height 4 radius 2?`,
  (s:string)=>`Sketch a red ${s} width 6 height 4 radius 2`,
  (s:string)=>`Show me a ${s} width 6 height 4 radius 2`,
  (s:string)=>`Add a green ${s} width 6 height 4 radius 2`,
  (s:string)=>`Make a ${s} width 6 height 4 radius 2`,
  (s:string)=>`Generate a ${s} width 6 height 4 radius 2`,
  (s:string)=>`I need a ${s} width 6 height 4 radius 2`,
];

/** A bundled regression/example corpus, not a downloaded or trained language model. */
export const INTELLIGENCE_EXAMPLES:IntelligenceExample[]=[
  ...FLAT_SHAPES.flatMap(shape=>creationPhrases.map((phrase,i)=>({request:phrase(shape),mode:(i%2?'geometry2d':'graph2d') as IntelligenceMode,expected:{kind:shape,dimension:'2d' as const,width:6,height:shape==='square'?6:4,radius:2}}))),
  ...SOLID_SHAPES.flatMap(shape=>creationPhrases.map((phrase,i)=>({request:phrase(shape),mode:(i%2?'geometry3d':'graph3d') as IntelligenceMode,expected:{kind:shape,dimension:'3d' as const,width:6,height:shape==='cube'?6:4,radius:2}}))),
  ...[...FLAT_SHAPES,...SOLID_SHAPES].flatMap(shape=>[
    {request:'Scale it by 2',expected:{scale:2}},
    {request:'Rotate it 45 degrees',expected:{rotation:[0,0,45] as [number,number,number]}},
    {request:'Make it purple',expected:{color:'#a855f7'}},
    {request:'Move it right by 2',expected:{points:[2,0,...(SOLID_SHAPES.includes(shape as typeof SOLID_SHAPES[number])?[0]:[])].length===3?[[2,0,0]]:[[2,0]]}},
  ].map(example=>({...example,previous:`Create ${shape}`,mode:(SOLID_SHAPES.includes(shape as typeof SOLID_SHAPES[number])?'geometry3d':'geometry2d') as IntelligenceMode}))),
  ...['x','x^2','x^3-2*x','sin(x)','cos(x)','exp(-x^2)','sqrt(x)','abs(x)'].flatMap(expression=>[
    {request:`Please draw a graph of y = ${expression}`,mode:'graph2d' as const,expected:{kind:'plot' as const,expression,dimension:'2d' as const}},
    {request:`Plot z = ${expression}+y^2`,mode:'graph3d' as const,expected:{kind:'plot' as const,expression:`${expression}+y^2`,dimension:'3d' as const}},
  ]),
];
