import {executionOutcome} from '../../math-foundation/executionOutcome';
import {kernelRequest} from '../kernel/language';
import {routeQuery} from '../../utils/mathEngine/queryRouter';
import {normalizeLanguage,parseNumber,NUMBER_PATTERN} from './numberParser';
import {engineCapabilities,executeCapability,type EngineResult,type SpecialistInput} from './engineRegistry';
import {composeEngineResponse,type ResponseStyle} from './responseComposer';
import type {RoboSceneContext} from './types';
export class EngineRouter{
  private calculation?:AbortController;
  cancelCalculation(){this.calculation?.abort();}
  resetContext(){this.cancelCalculation();this.last=undefined;this.recent=[];this.pending=undefined;this.assumptions=[];this.variables={};this.dataset=[];this.notebook=[];this.quiz=undefined;this.quizAnswerModel=undefined;}
  last?:{input:string;expression:string;result:EngineResult;style:ResponseStyle};
  recent:{input:string;capabilityId:string;success:boolean}[]=[];
  assumptions:string[]=[];
  variables:Record<string,string>={};
  dataset:number[]=[];
  notebook:import('../../cas/casNotebookEngine').NotebookCell[]=[];
  quiz?:import('../../learning-system/types').GeneratedQuestion;
  quizAnswerModel?:import('../../learning-system/types').AnswerModel;
  pending?:{capabilityId:string;question:string};
  async dispatch(raw:string,scene:RoboSceneContext):Promise<{result:EngineResult;message:string}|{visualText:string}|undefined>{
    let text=normalizeLanguage(raw).replace(/[.!?]+$/,'').replace(/^(?:please|can you|could you)\s+/,'');
    if(/^(?:forget that|clear context|reset context|start over)$/.test(text)){this.last=undefined;this.pending=undefined;this.assumptions=[];this.variables={};this.dataset=[];this.notebook=[];this.quiz=undefined;return undefined;}
    if(this.pending?.capabilityId.startsWith('statistics.')&&/^\s*\[?[-+\d.,\s]+\]?\s*$/.test(raw)){const {parseNumberList}=await import('../../utils/mathEngine/expressionUtils');const values=parseNumberList(raw.replace(/^\s*\[|\]\s*$/g,''));if(values.length){this.dataset=values.slice(0,100000);const id=this.pending.capabilityId.replace('standard deviation','standardDeviation');this.pending=undefined;return this.run(id,{text:raw,args:[this.dataset]},raw);}}
    if(this.pending&&/^(?:draw|create|make|move|rotate|delete|undo|solve|differentiate|integrate|cas|convert|run)\b/.test(text))this.pending=undefined;
    const assignment=raw.match(/^(?:let\s+)?([a-z]\w*)\s*(?::=|=)\s*(-?\d+(?:\.\d+)?)\s*[.!]?$/i);
    if(assignment&&/^let\b|:=/i.test(raw)){this.variables={...this.variables,[assignment[1]]:assignment[2]};if(Object.keys(this.variables).length>25)delete this.variables[Object.keys(this.variables)[0]];return this.reply('variables',`${assignment[1]} = ${assignment[2]}`,Number(assignment[2]));}
    const mathematical=kernelRequest(raw);if(mathematical)return this.run('kernel.compute',{text:raw,args:[{...mathematical,assumptions:[...this.assumptions,...(mathematical.assumptions??[])]}]},mathematical.expression??raw);
    if(/^assume\s+/.test(text)){this.assumptions=[...this.assumptions,text.replace(/^assume\s+/,'')].slice(-12);return this.reply('assumptions',`Assumption saved: ${this.assumptions.at(-1)}.`);}
    if(/\b(?:what can you do|what .*operations.*support|can you solve differential equations)\b/.test(text)){
      const catalog=engineCapabilities(),topic=text.match(/matrices|matrix|geometry|calculus|statistics|differential equations|sets|graph/ )?.[0];
      if(topic==='differential equations')return this.reply('capabilities',catalog.flatMap(e=>e.capabilities.filter(c=>/differential equations|ode/i.test(c.description+' '+c.id)).map(c=>`${e.label}: ${c.label} — ${c.description}`)).join('\n')||'No differential-equation operation is registered.');
      const matches=topic?catalog.filter(e=>(`${e.label} ${e.id}`).toLowerCase().includes(topic==='matrix'||topic==='matrices'?'matri':topic)):catalog;
      return this.reply('capabilities',matches.map(e=>`${e.label}: ${e.capabilities.map(c=>c.label).join(', ')}`).join('\n')||'No matching registered capability.');
    }
    if(this.last&&!/^(?:teach me|explain|show.*steps)\b.*(?:solve|differentiate|integrate|simplify|factor|expand|determinant|mean|median)\b/.test(text)&&/^(?:why|explain|show (?:me )?(?:the )?steps|teach me|answer only)(?:\b|$)/.test(text)){
      const steps=this.last.result.steps??[];const requestedStep=text.match(/^(?:explain|show) step (\d+)$/);if(requestedStep){const index=Number(requestedStep[1])-1;return {result:this.last.result,message:steps[index]?`Step ${index+1}: ${steps[index]}`:`The recorded derivation has ${steps.length} steps.`};}
      let message=composeEngineResponse(this.last.result,/answer only/.test(text)?'answer':'steps');
      if(/^why\b/.test(text)&&text!=='why'){const operation=text.match(/(subtract|add|divide|multiply)\s+(-?\d+(?:\.\d+)?)/),term=operation?.[0];const step=term?steps.find(s=>s.toLowerCase().includes(term)):undefined;message=step?`${step}\nApplying the same operation to both sides preserves the equation's solutions.`:operation&&this.last.expression.includes(operation[2])?`Applying ${operation[1]} ${operation[2]} to both sides preserves equality. The existing solver records the isolation in these steps:\n${steps.join('\n')}`:steps.length?steps.join('\n'):this.last.result.answer??'The existing engine returned no derivation for that result.';}
      return {result:this.last.result,message};
    }
    if(this.last&&/^(?:plot|graph|visualize) (?:it|that|the result)$/.test(text))return {visualText:`Plot y = ${typeof this.last.result.metadata?.plotExpression==='string'?this.last.result.metadata.plotExpression:this.last.expression.split('=')[0]}`};
    if(/^now (?:cosine|sine|tangent)$/.test(text)&&scene.objects.some(o=>o.type==='plot'))return {visualText:`Plot y = ${/cosine/.test(text)?'cos':/sine/.test(text)?'sin':'tan'}(x)`};
    if(/^what about (?:half|double|twice) (?:of )?it$/.test(text)&&typeof scene.previousResult==='number')return this.run('problem.solve',{text:`${scene.previousResult}${/half/.test(text)?'/2':'*2'}`},String(scene.previousResult));
    if(this.quiz&&/^(?:my answer is|answer:)\s*/.test(text)){const {evaluateAnswer}=await import('../../learning-system/assessmentEngine');const result=evaluateAnswer(raw.replace(/^(?:my answer is|answer:)\s*/i,''),this.quiz.answer,this.quizAnswerModel??{kind:'EXACT'});return this.reply('assessment',`${result.status}: ${result.feedback.join(' ')}. Expected answer: ${this.quiz.answer}`,result);}
    if(this.quiz&&/^(?:hint|give me a hint)$/.test(text))return this.reply('practice',this.quiz.hints[0]?.template??'Use the first solution step: '+this.quiz.solutionSteps[0]?.explanation);
    if(/^(?:quiz me|give (?:me )?another example)\b/.test(text)){
      const {practiceFamilies,generateQuestion}=await import('../../learning-system/practiceEngine');const topic=text.match(/quiz me (?:on|about) (.+)/)?.[1]??String(this.last?.result.metadata?.classification??this.last?.result.engineId??scene.objects.find(o=>o.id===scene.lastReferenced)?.type??'');const needle=/complex/.test(topic)?'complex':/equation|algebra|solve/i.test(topic)?'equations':/geometry|line|triangle|circle/.test(topic)?'line':topic;const family=practiceFamilies.find(f=>`${f.id} ${f.conceptIds.join(' ')}`.toLowerCase().includes(needle.toLowerCase()))??practiceFamilies[0];const q=generateQuestion(family,Date.now()%100000);this.quiz=q;this.quizAnswerModel=family.answerModel;return this.reply('practice',`${q.prompt}\n${q.choices?.join(' Â· ')??''}`,q);
    }
    const explicit=text.match(/^(?:run|use|compute)\s+([a-z][\w-]*\.[a-z][\w]*)\s+(?:with\s+)?(\[[\s\S]*\])$/i);
    if(explicit){let args:unknown[];try{args=JSON.parse(raw.slice(raw.indexOf('[')));}catch{return this.reply('clarification','Use a JSON array of typed arguments for this registered engine operation.',undefined,false);}
      return this.run(explicit[1],{text:raw,args},text);}
    const set=text.match(/\b(union|intersection|difference|cartesian product)\b.*?\{([^}]*)\}.*?\{([^}]*)\}/);if(set){const op={union:'setUnion',intersection:'setIntersection',difference:'setDifference','cartesian product':'cartesianProduct'}[set[1]]!;return this.run(`sets.${op}`,{text,args:set.slice(2).map(s=>s.split(',').map(x=>x.trim()).filter(Boolean))},text);}
    if(/^truth table (?:for|of)\s+/.test(text))return this.run('logic.buildTruthTable',{text,args:[raw.replace(/^truth table (?:for|of)\s+/i,'')]},text);
    const count=text.match(/\b(factorial|combinations?|permutations?)\b(?:\s+(?:of|for))?\s+(\d+)(?:\s*[, ]\s*(?:choose|and|taken)?\s*(\d+))?/);if(count)return this.run(`combinatorics.${count[1].startsWith('comb')?'combinations':count[1].startsWith('perm')?'permutations':'factorial'}`,{text,args:count.slice(2).filter(Boolean).map(Number)},text);
    const units=text.match(new RegExp(`^convert\\s+(${NUMBER_PATTERN})\\s*([a-z/]+)\\s+(?:to|into)\\s+([a-z/]+)$`));if(units)return this.run('units.convertGraphUnit',{text,args:[parseNumber(units[1]),...units.slice(2).map(u=>/^[nj]$/.test(u)?u.toUpperCase():u)]},text);
    const dice=text.match(/probability (?:of|that) (?:rolling )?(\d+) (?:on|with) (?:a |one |1 )?die/);if(dice)return this.run('probability.diceProbability',{text,args:[Number(dice[1]),1]},text);
    const decimal=text.match(/decimal (?:expansion )?(?:of )?(-?\d+)\s*\/\s*(-?\d+)/);if(decimal)return this.run('decimal.analyzeDecimalExpansion',{text,args:[Number(decimal[1]),Number(decimal[2])]},text);
    text=text.replace(/^(?:and|what about) (?:the )?(?=mean|median|mode|variance|standard deviation|quartiles)/,'');
    const statistics=text.match(/^(?:what is (?:the )?|find (?:the )?|calculate (?:the )?)?(mean|median|mode|variance|standard deviation|quartiles)(?:\s+(?:of|for))?(.*)$/);if(statistics){const {parseNumberList}=await import('../../utils/mathEngine/expressionUtils');const values=statistics[2].trim()?parseNumberList(statistics[2].trim()):[];if(values.length)this.dataset=values.slice(0,100000);if(!this.dataset.length){this.pending={capabilityId:'statistics.'+statistics[1],question:'Which numeric dataset should I use?'};return this.reply('clarification',this.pending.question,undefined,false);}this.pending=undefined;const name=statistics[1]==='standard deviation'?'standardDeviation':statistics[1];return this.run(`statistics.${name}`,{text,args:[this.dataset]},text);}
    const style:ResponseStyle=/answer only/.test(text)?'answer':/teach me/.test(text)?'teach':/show.*steps|explain/.test(text)?'steps':'answer';
    const cas=text.match(/^(?:cas\s+)?(ode|inverse matrix|rref|eigenvalues|eigenvectors|laplace|inverse laplace|partial fractions|rationalize|numeric solve|complex solve|inequality)\s+([\s\S]+)/);
    if(cas){const operation=cas[1].replaceAll(' ','-') as import('../../cas/casNotebookEngine').NotebookOperation;return this.run('cas.evaluate',{text,expression:cas[2],assumptions:this.assumptions,operation} as SpecialistInput,cas[2],style);}
    if(/^cas\b/.test(text)){const m=text.match(/^cas\s+(simplify|solve|factor|expand|differentiate|integrate)\s+([\s\S]+)/);if(m)return this.run('cas.evaluate',{text,expression:m[2],assumptions:this.assumptions,operation:m[1]} as SpecialistInput,m[2],style);}
    text=text.replace(/\s*[,;]?\s*(?:answer only|show (?:me )?(?:the )?steps|explain)\s*$/,'').replace(/^(?:teach me (?:how to )?|explain (?:how to )?|show (?:me )?(?:the )?steps (?:for|to) |calculate|evaluate)\s*/,'');
    for(const [symbol,value] of Object.entries(this.variables))text=text.replace(new RegExp(`\\b${symbol}\\b`,'g'),`(${value})`);
    const route=routeQuery(text);
    if(['solve','cas','differentiate','integrate','statistics','matrix','trigonometry','complex'].includes(route.intent)||/^[\d(][\d\s+*/().^-]*$/.test(text)||/^(?:sin|cos|tan|sqrt|ln|log)\(/.test(text))return this.run('problem.solve',{text,expression:route.expression},route.expression||text,style);
    return undefined;
  }
  private reply(id:string,answer:string,value?:unknown,success=true){return {result:{verificationStatus:success?'unverified':'unsupported',success,engineId:'conversation',capabilityId:id,answer,value} as EngineResult,message:answer};}
  private async run(id:string,input:SpecialistInput,expression:string,style:ResponseStyle='answer'){
    this.calculation?.abort();const controller=new AbortController();this.calculation=controller;
    const result=await executeCapability(id,{...input,...(id==='cas.evaluate'?{cells:this.notebook}:{}),signal:controller.signal});if(this.calculation!==controller||controller.signal.aborted){const cancelled:EngineResult={success:false,engineId:result.engineId,capabilityId:id,error:{code:'CANCELLED',message:'Calculation cancelled.'},execution:executionOutcome('cancelled',result.execution?.requestId)};return {result:cancelled,message:'Calculation cancelled.'};}this.calculation=undefined;if(id==='cas.evaluate'&&result.success&&result.metadata?.cells)this.notebook=result.metadata.cells as typeof this.notebook;this.recent=[...this.recent,{input:input.text,capabilityId:id,success:result.success}].slice(-25);
    if(result.success)this.last={input:input.text,expression,result,style};return {result,message:composeEngineResponse(result,style)};
  }
}
