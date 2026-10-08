import type {EngineResult} from './engineRegistry';
export type ResponseStyle='answer'|'explain'|'steps'|'teach';
export function composeEngineResponse(result:EngineResult,style:ResponseStyle='answer'){
  if(!result.success)return result.error?.message??'The selected engine could not complete that operation.';
  const answer=result.answer??(typeof result.value==='string'?result.value:JSON.stringify(result.value));
  const steps=result.steps??[];
  return style==='answer'||!steps.length?answer:`${answer}\n${steps.map((s,i)=>`${i+1}. ${s}`).join('\n')}`;
}
