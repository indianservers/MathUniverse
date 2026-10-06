import { studioMockups } from '../mockup/studioMockupCatalog';
import { studioTheoryContent, type StudioTheoryCopy } from '../mockup/studioTheoryContent';
import { standaloneStudioTheoryRoutes } from '../mockup/StandaloneStudioTheory';
import { distributionSpecs } from '../../modules/probability-statistics/data/distributionAtlas';
import { curriculumExtensions } from './curriculumExtensions';
import { masteryCourses } from './masteryContent';
export type CurriculumStudio={id:string;name:string;base:string;prerequisites:string;scope:string};
const definitions:[string,string,string,string][]=[
 ['algebra','Algebra Studio','/algebra','Arithmetic, fractions and signed numbers'],
 ['algebraic-structures','Algebraic Structures Studio','/algebraic-structures','Sets, functions, modular arithmetic and proof'],
 ['geometry','Geometry Studio','/geometry','Lengths, angles and coordinate arithmetic'],
 ['trigonometry','Trigonometry Studio','/trigonometry','Angles, ratios, functions and algebra'],
 ['calculus','Calculus Studio','/calculus','Algebra, functions and trigonometry'],
 ['number-systems','Number Systems Studio','/number-systems','Counting, integers and fractions'],
 ['linear-algebra','Linear Algebra Studio','/linear-algebra','Algebra and coordinate systems'],
 ['complex-numbers','Complex Numbers Studio','/complex-numbers','Algebra, trigonometry and vectors'],
 ['mathematical-modelling','Mathematical Modelling Studio','/mathematical-modelling','Functions, calculus and probability'],
 ['discrete-world','Number & Discrete Mathematics Studio','/discrete-world','Integer arithmetic, algebra and sets'],
 ['set-theory','Set Theory and Relations','/set-theory','Logic and elementary counting'],
 ['graph-theory','Graph Theory','/graph-theory','Sets, counting and algorithms'],
 ['probability-statistics','Statistics & Probability Studio','/probability-statistics','Fractions, functions and data displays'],
 ['differential-equations','Differential Equations Studio','/differential-equations','Calculus and linear algebra'],
 ['continued-fractions','Continued Fractions Lab','/math-lab/continued-fractions','Fractions, Euclidean algorithm and sequences'],
 ['famous-problems','Famous Problems Atlas','/math-lab/famous-problems','Proof and relevant mathematical background'],
 ['stats-inference','Statistics Inference Studio','/math-lab/stats-inference','Probability, distributions and sampling'],
 ['special-functions','Special Functions Gallery','/math-lab/special-functions','Calculus, series and differential equations'],
 ['advanced-differential-equations','Advanced Differential Equations Studio','/math-lab/differential-equations','Differential equations and linear algebra']
];
const scopes:Record<string,string>={
 algebra:'Expressions → equations and inequalities → functions → polynomials, systems, logarithms, sequences and proof',
 'algebraic-structures':'Operations → groups → homomorphisms and quotients → rings, fields, lattices and Boolean algebra',
 geometry:'Constructions and proof → triangles, circles, polygons → coordinates and conics → transformations → measurement and solids',
 trigonometry:'Right triangles → unit circle → identities and equations → inverse branches → oblique triangles → waves and Fourier',
 calculus:'Limits → derivatives → integration and convergence → series → multivariable and vector calculus → numerical methods',
 'number-systems':'Integers → rationals and irrationals → completeness and cardinality → bases and representations → numerical accuracy',
 'linear-algebra':'Vectors and matrices → elimination → subspaces → determinants and eigenvectors → least squares, SVD and conditioning',
 'complex-numbers':'Arithmetic → polar geometry and roots → Euler formula → transforms and fractals → branches and analytic functions',
 'mathematical-modelling':'Assumptions and units → physical and population models → optimization → validation, identifiability and sensitivity',
 'discrete-world':'Primes and modular arithmetic → counting → logic and proof → graphs and algorithms → recurrences and cryptography',
 'set-theory':'Operations → products and relations → equivalence and order → functions → finite and infinite cardinality',
 'graph-theory':'Connectivity and traversal → paths and trees → weights and optimization → coloring, planarity, matching and flow',
 'probability-statistics':'Descriptive data → probability and distributions → sampling and inference → regression and design → advanced models',
 'differential-equations':'Initial values → first-order methods → numerical integration → higher-order and systems → transforms → boundary values and PDEs',
 'continued-fractions':'Expansions → convergents and error → periodic quadratic irrationals → Pell equations',
 'famous-problems':'Precise statements → proof and computational evidence → proved and open problems → constructibility',
 'stats-inference':'Estimands → likelihood → score intervals and coverage → tests, power and equivalence → multiplicity',
 'special-functions':'Gamma and beta → error function → zeta domains → Bessel and Legendre families',
 'advanced-differential-equations':'Eigenmodes → stiffness → resonance → boundary eigenvalues → heat modes'
};
export const curriculumStudios:CurriculumStudio[]=definitions.map(([id,name,base,prerequisites])=>({id,name,base,prerequisites,scope:scopes[id]}));
export const slug=(label:string)=>label.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export type CurriculumChapter={id:string;title:string;copy:StudioTheoryCopy;href:string;exercise?:{prompt:string;expected:number};source:'existing'|'extension'|'distribution'|'guided'};
export function chaptersFor(id:string):CurriculumChapter[]{
 const s=curriculumStudios.find(s=>s.id===id);if(!s)return [];
 const aliases:Record<string,string>={'probability-statistics':'statistics','mathematical-modelling':'modelling','discrete-world':'discrete','advanced-differential-equations':'differential-equations'};
 const copyId=['continued-fractions','famous-problems','stats-inference','special-functions'].includes(id)?'advanced-concepts':aliases[id]||id;
 const copies=studioTheoryContent[copyId]||{};
 let keys=Object.keys(copies).filter(k=>k!=='home');if(copyId==='advanced-concepts')keys=keys.filter(k=>k===id);
 const catalog=studioMockups[id]||Object.values(studioMockups).find(d=>d.basePath===s.base);
 const existing=keys.map(key=>{const p=catalog?.pages.find(p=>p.id===key);const route=Object.entries(standaloneStudioTheoryRoutes).find(([,r])=>r.studioId===copyId&&r.pageId===key)?.[0];return {id:key,title:p?.label||key.split('-').map(w=>w[0].toUpperCase()+w.slice(1)).join(' '),copy:copies[key],href:p?.route||route||s.base,source:'existing' as const};});
 const extensions=(curriculumExtensions[id]||[]).map(e=>({id:slug(e.title),title:e.title,copy:{principle:e.principle,method:e.method,caution:e.caution,examples:[{title:'Worked example',setup:e.example,result:e.method},{title:'Practice',setup:e.exercise,result:`Answer: ${e.answer}`},{title:'Boundary and assumptions',setup:e.caution,result:e.principle}] as StudioTheoryCopy['examples']},href:e.href,exercise:{prompt:e.exercise,expected:e.answer},source:'extension' as const}));
 const distributions=id==='probability-statistics'?distributionSpecs.map(d=>({id:`distribution-${d.id}`,title:d.name,href:d.route,source:'distribution' as const,copy:{principle:`${d.shortUse} ${d.theory.join(' ')}`,method:`Use the stated distribution with its parameter constraints: ${d.formula}`,caution:`Check support and parameter constraints. ${d.kind==='discrete'?'Add probability masses over eligible outcomes.':'Integrate density; height is not probability.'}`,examples:d.examples.slice(0,3).map((example,i)=>({title:`Application ${i+1}`,setup:example,result:d.formula})) as StudioTheoryCopy['examples']}})):[];
 const extended=id==='probability-statistics'?Object.entries(studioTheoryContent['statistics-extended']||{}).map(([key,copy])=>({id:key,title:key.replaceAll('-',' '),copy,href:`/probability-statistics/${key}`,source:'existing' as const})):[];
 const guided=(masteryCourses[id]?.units||[]).map(u=>({id:`guided-${u.id}`,title:u.title,href:u.href,source:'guided' as const,exercise:{prompt:u.calculation.prompt,expected:u.calculation.answer},copy:{principle:`${u.idea} ${u.conditions}`,method:u.method.join(' '),caution:`${u.conditions} Common misconception: ${u.misconception} Correction: ${u.explanation}`,examples:[{title:'Worked solution',setup:u.problem,result:u.solution.join(' ')},{title:'Transfer exercise',setup:u.calculation.prompt,result:`Answer: ${u.calculation.answer}`},{title:'Investigation',setup:u.investigation,result:'Explain your prediction and observation using the stated hypotheses.'}] as StudioTheoryCopy['examples']}}));
 return [...existing,...extensions,...distributions,...extended,...guided];
}
export function studioForPath(path:string){return [...curriculumStudios].sort((a,b)=>b.base.length-a.base.length).find(s=>path===s.base||path.startsWith(s.base+'/'));}
