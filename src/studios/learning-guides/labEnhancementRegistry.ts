import { curriculumStudios, chaptersFor } from '../curriculum/curriculumCatalog';
import { studioMockups } from '../mockup/studioMockupCatalog';
import { standaloneStudioTheoryRoutes } from '../mockup/StandaloneStudioTheory';
import { studioTheoryContent, type StudioTheoryCopy } from '../mockup/studioTheoryContent';
import { studioSimpleWords } from '../mockup/studioSimpleWords';
import { studioFormulaCards } from '../mockup/studioLearningTabs';
import { investigations, initialInputs } from '../investigations/catalog';
import { evaluate } from '../investigations/models';
import { labs as numberLabs, theory as numberTheory } from '../number-systems/premium/catalog';
import { labLearningGuides } from './labLearningGuides';
import { additionalLabContent } from './additionalLabContent';

export const enhancementSections = ['idea', 'compare', 'visual', 'formulas', 'worked', 'scenarios', 'predict', 'boundaries', 'mistakes', 'method', 'check', 'connections'] as const;
export type EnhancementSection = typeof enhancementSections[number];
export type EnhancedLab = {
  key: string; studioId: string; title: string; href: string; copy: StudioTheoryCopy;
  plain: string; prerequisites: string; observe: string; experiment: string;
  challenge: string; numeric?: { prompt: string; expected: number };
  formulas: ReturnType<typeof studioFormulaCards>;
};
const aliases: Record<string, string> = { statistics: 'probability-statistics', 'statistics-extended': 'probability-statistics', 'statistics-phase': 'probability-statistics', modelling: 'mathematical-modelling', discrete: 'discrete-world' };
const rows: EnhancedLab[] = [];
function add(studioId: string, id: string, title: string, href: string, copy: StudioTheoryCopy, extra: Partial<EnhancedLab> = {}) {
  const normalized = aliases[studioId] || studioId;
  const studio = curriculumStudios.find(s => s.id === normalized);
  if (!studio) return;
  const boundaryCase = {title:'Domain and interpretation',setup:'Which conditions must hold for this relationship?',result:copy.caution};
  copy = { ...copy, examples: [copy.examples[0],copy.examples[1] || boundaryCase,copy.examples[2] || boundaryCase] };
  rows.push({ key: `${normalized}/${id}`, studioId: normalized, title, href, copy,
    plain: studioSimpleWords[studioId]?.[id] || copy.principle,
    prerequisites: studio.prerequisites,
    observe: copy.examples[0].setup,
    experiment: `Recreate “${copy.examples[0].title}”. Record the inputs and compare your result with the worked result. ${copy.caution}`,
    challenge: copy.examples[1].setup,
    formulas: studioFormulaCards(studioId, id, copy), ...extra });
}
for (const studio of Object.values(studioMockups)) {
  for (const page of studio.pages.filter(p => p.id !== 'home' && p.id !== 'ar')) {
    const copy = studioTheoryContent[studio.id]?.[page.id];
    if (copy) add(studio.id, page.id, page.label, page.route, copy, { observe: page.learning.observe, experiment: page.learning.try,
      challenge: page.learning.challenge, numeric: { prompt: page.challenge.prompt, expected: page.challenge.expected } });
  }
}
for (const [href, route] of Object.entries(standaloneStudioTheoryRoutes)) {
  if (route.pageId === 'home') continue;
  const copy = studioTheoryContent[route.studioId]?.[route.pageId];
  const studioId = route.studioId === 'advanced-concepts' ? route.pageId === 'differential-equations' ? 'advanced-differential-equations' : route.pageId : route.studioId;
  if (copy && !rows.some(r => r.href === href)) add(studioId, route.pageId, route.label, href, copy,
    href === '/algebra/equations' ? {numeric:{prompt:'Solve 3x + 6 = 18. What is x?',expected:4}} : {});
}
for (const studio of curriculumStudios) {
  for (const chapter of chaptersFor(studio.id)) {
    if (chapter.source === 'investigation') continue;
    if (!rows.some(r => r.key === `${studio.id}/${chapter.id}`))
      add(studio.id, chapter.id, chapter.title, chapter.href, chapter.copy, { numeric: chapter.exercise });
  }
}
for (const lab of investigations) {
  const result = evaluate(lab, initialInputs(lab));
  const steps = result.steps;
  const evidence = Object.entries(result.metrics).map(([key, value]) => `${key}: ${value}`).join('; ');
  const copy: StudioTheoryCopy = { principle: lab.idea, method: steps.join(' '), caution: `${lab.conditions} Claim to examine: ${lab.misconception}`,
    examples: [{ title: 'Default experiment', setup: lab.fields.map(f => `${f.label} = ${f.value}`).join('; '), result: evidence || steps.at(-1) || lab.idea },
      { title: 'Transfer problem', setup: result.check.prompt, result: `Answer: ${result.check.answer}. ${result.check.reason}` },
      { title: 'Boundary investigation', setup: lab.transfer, result: lab.conditions }] };
  add(lab.studio, `investigation-${lab.id}`, lab.title, `/studios/${lab.studio}/labs/${lab.id}`, copy,
    { observe: lab.prediction, experiment: lab.transfer, challenge: lab.transfer, numeric: { prompt: result.check.prompt, expected: result.check.answer } });
}
for (const lab of numberLabs) {
  const t = numberTheory[lab.id];
  if (!t || rows.some(r => r.href === `/number-systems/${lab.id}`)) continue;
  add('number-systems', lab.id, lab.title, `/number-systems/${lab.id}`, { principle: t[0], method: t[1], caution: t[3],
    examples: [{title:'Number relationship',setup:t[0],result:t[1]}, {title:'Concrete example',setup:'Apply the relationship to these numbers.',result:t[2]}, {title:'Explain the condition',setup:t[4],result:t[3]}] });
}
for (const item of additionalLabContent) add(item.studio,item.id,item.title,item.href,item.copy);
const graphChapters = chaptersFor('graph-theory').filter(c => c.source === 'extension');
for (const [id,title,index] of [['build','Build a Graph',0],['properties','Graph Properties',1],['algorithms','Graph Algorithms',2],['learn','Graph Validation',3]] as const) {
  const chapter=graphChapters[index];
  add('graph-theory',id,title,`/graph-theory?tab=${id}`,chapter.copy,{numeric:chapter.exercise});
}
add('graph-theory','representations','Graph Representations','/graph-theory?tab=representations',{
  principle:'Adjacency lists store neighbors; adjacency matrices store pairwise connections. Both describe the same labeled graph.',
  method:'Choose a vertex ordering, set Aᵢⱼ=1 when an edge joins the labels, and list the nonzero column labels as the neighbors of each row.',
  caution:'Vertex ordering changes the displayed matrix. Symmetry represents undirected edges; weighted and directed conventions must be specified.',
  examples:[{title:'Triangle',setup:'Undirected edges 1–2,2–3,3–1.',result:'Adjacency matrix [[0,1,1],[1,0,1],[1,1,0]]; each neighbor list has length 2.'},{title:'Three-vertex path',setup:'Undirected edges 1–2 and 2–3.',result:'Lists are 1:[2],2:[1,3],3:[2]; matrix [[0,1,0],[1,0,1],[0,1,0]].'},{title:'Directed edge',setup:'One edge 1→2, ordered vertices [1,2].',result:'Adjacency matrix [[0,1],[0,0]]; it is not symmetric.'}]
});
export const enhancedLabs: readonly EnhancedLab[] = rows;
export function resolveEnhancedLab(pathname: string, search = ''): EnhancedLab | undefined {
  const path = pathname.replace(/\/$/, '') || '/';
  const params = new URLSearchParams(search);
  const mode = params.get('mode') || params.get('tab') || params.get('topic');
  const studio = curriculumStudios.find(s => s.base === path);
  if (studio && mode) {
    const selected = rows.find(r => r.studioId === studio.id && (r.key.split('/').at(-1) === mode || r.href === `${path}/${mode}`));
    if (selected) return selected;
  }
  const shape = params.get('shape');
  if (path === '/shapes' && shape === 'segment') {
    const copy = studioTheoryContent.geometry.segment;
    const base = rows.find(r => r.href === '/shapes');
    if (base && copy) return { ...base, key:'geometry/segment', title:'Circular Segment', copy, plain:studioSimpleWords.geometry.segment, formulas:studioFormulaCards('geometry','segment',copy) };
  }
  const match = rows.find(r => r.href === path && (!studio || r.href !== studio.base)) || (path==='/graph-theory' ? rows.find(r=>r.key==='graph-theory/build') : undefined);
  if (match) {
    const guide = labLearningGuides[path];
    return guide ? {...match, plain:guide.theory, experiment:guide.experiment} : match;
  }
  return undefined;
}
