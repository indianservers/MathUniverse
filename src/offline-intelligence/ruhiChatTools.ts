import type {EngineRouter} from '../math-robo/intelligence/engineRouter';
import {useState,useEffect} from 'react';
import type {RuhiResponse} from './OfflineMathAssistant';
export type ChatMessage={id:string;role:'user'|'assistant';text:string;time:number;answer?:RuhiResponse;request?:string;mutated?:boolean};
export type SavedChat={id:string;name:string;mode:string;messages:ChatMessage[];pins:string[];context?:string;solver?:ReturnType<EngineRouter['exportContext']>};
export type ChatAppearance={fontSize:number;contrast:boolean;compact:boolean;dock:'floating'|'left'|'right'};
const read=<T,>(key:string,fallback:T):T=>{try{return JSON.parse(localStorage.getItem(key)??'null')??fallback;}catch{return fallback;}};
export function useChatTools(mode:string){
 const [appearance,setAppearance]=useState<ChatAppearance>(()=>({...{fontSize:14,contrast:false,compact:false,dock:'floating' as const},...read<Partial<ChatAppearance>>('ruhi-chat-appearance',{})}));
 const [saved,setSaved]=useState<SavedChat[]>(()=>read('ruhi-saved-chats',[]));
 const [pinnedAnswers,setPinnedAnswers]=useState<ChatMessage[]>(()=>read('ruhi-pinned-answers:'+mode,[]));
 const pins=pinnedAnswers.map(message=>message.id);
 const [search,setSearch]=useState(''),[notice,setNotice]=useState(''),[name,setName]=useState('My maths exploration'),[practice,setPractice]=useState(false),[attempt,setAttempt]=useState(''),[hintLevel,setHintLevel]=useState(0);
 useEffect(()=>{try{localStorage.setItem('ruhi-chat-appearance',JSON.stringify(appearance));}catch{/* Session preferences remain usable. */}},[appearance]);
 const save=(messages:ChatMessage[],context:string,solver:ReturnType<EngineRouter['exportContext']>)=>{const chat:SavedChat={id:crypto.randomUUID(),name:name.trim()||'Untitled exploration',mode,messages,pins,context,solver};const next=[chat,...saved].slice(0,30);try{localStorage.setItem('ruhi-saved-chats',JSON.stringify(next));setSaved(next);setNotice('Conversation and workspace saved.');}catch{setNotice('Storage is full. Export this conversation instead.');}};
 const remove=(id:string)=>{const next=saved.filter(c=>c.id!==id);try{localStorage.setItem('ruhi-saved-chats',JSON.stringify(next));setSaved(next);}catch{setNotice('Could not update saved conversations.');}};
 const storePins=(next:ChatMessage[])=>{setPinnedAnswers(next);try{localStorage.setItem('ruhi-pinned-answers:'+mode,JSON.stringify(next));}catch{setNotice('Pins are available for this session; persistent storage is full.');}};
 const pin=(message:ChatMessage)=>storePins(pins.includes(message.id)?pinnedAnswers.filter(p=>p.id!==message.id):[...pinnedAnswers,message].slice(-50));
 const restorePins=(ids:string[],messages:ChatMessage[])=>storePins([...pinnedAnswers,...messages.filter(message=>ids.includes(message.id)&&!pins.includes(message.id))].slice(-50));
 const copy=async(text:string)=>{try{await navigator.clipboard.writeText(text);setNotice('Copied.');}catch{setNotice('Clipboard unavailable. Select and copy the text manually.');}};
 const exportChat=(messages:ChatMessage[],format:'markdown'|'print')=>{
  if(format==='markdown'){const text='# '+name+'\n\n'+messages.map(m=>'## '+(m.role==='assistant'?'Ruhi':'You')+'\n\n'+m.text).join('\n\n');const url=URL.createObjectURL(new Blob([text],{type:'text/markdown;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='ruhi-conversation.md';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setNotice('Markdown exported.');}
  else{const win=window.open('','_blank');if(!win){setNotice('Allow popups to print or save as PDF.');return;}const doc=win.document;doc.title=name;const style=doc.createElement('style');style.textContent='body{font:16px system-ui;max-width:900px;margin:40px auto}article{break-inside:avoid;margin:24px 0}pre{white-space:pre-wrap;font:inherit}';doc.head.append(style);const heading=doc.createElement('h1');heading.textContent=name;doc.body.append(heading);for(const m of messages){const article=doc.createElement('article'),h=doc.createElement('h2'),pre=doc.createElement('pre');h.textContent=m.role==='assistant'?'Ruhi':'You';pre.textContent=m.text;article.append(h,pre);doc.body.append(article);}win.focus();win.print();}
 };
 return {appearance,setAppearance,saved,save,remove,pins,pinnedAnswers,restorePins,pin,search,setSearch,notice,setNotice,name,setName,practice,setPractice,attempt,setAttempt,hintLevel,setHintLevel,copy,exportChat};
}
export const readChatDraft=(mode:string)=>{try{return localStorage.getItem('ruhi-chat-draft:'+mode)??'';}catch{return '';}};
