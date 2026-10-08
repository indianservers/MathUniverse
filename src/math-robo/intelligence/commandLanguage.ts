/** Contextual surface vocabulary. Mathematical payloads are left to native parsers. */
export const COMMAND_ALIASES:Record<string,string[]>={
 create:['generate','build','add','insert','put','place','sketch'],delete:['del','remove','erase','discard','get rid of','wipe','take away'],
 move:['shift','translate','drag','slide','reposition','relocate','push'],rotate:['turn','spin','revolve','twist','angle'],
 scale:['enlarge','shrink','expand','reduce','grow'],select:['choose','pick','highlight','focus on','activate'],deselect:['unselect','unpick','release','clear selection'],
 duplicate:['copy','clone','replicate','make another','make a copy'],reflect:['mirror','flip','reverse across'],find:['measure','determine','compute','work out'],
 undo:['revert','go back','reverse last action'],redo:['repeat last action','restore undone action'],reset:['start over','restart','return to default'],
 zoom:['magnify','get closer'],connect:['join','link','attach','draw between'],animate:['play','demonstrate','simulate','show motion'],
 change:['modify','edit','update','adjust','alter'],hide:['conceal','make invisible'],show:['reveal','unhide','display','make visible'],
};
const escape=(s:string)=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
export const COMMAND_STARTS=['draw','create','make','plot','mark','show','hide','find','calculate','solve','evaluate','simplify','move','rotate','reflect','scale','resize','change','set','select','deselect','delete','clear','reset','duplicate','check','compare','count','undo','redo','construct','extend','label','rename','call','name','color','colour','connect','animate','zoom',...Object.values(COMMAND_ALIASES).flat()];
export function normalizeCommandSurface(input:string):string{
 if(/\b(?:draw|create|make|construct|plot|add|sketch|creat|magnitude|components)\b/.test(input))input=input.replace(/\bvec\b/g,'vector').replace(/\b(?:vecter|vactor)\b/g,'vector');
 let text=input.replace(/^(?:(?:please|kindly)\s+|(?:can|could|would|will) you\s+)+/,'').replace(/^(?:i need|i want|i would like)(?: you to)?\s+/,'').replace(/\s+please(?=[?.!]*$)/,'');
 if(/^(?:i need|i want|i would like)\b/.test(input)&&/\b(?:circle|rectangle|square|triangle|sphere|cube|point|line|ray|vector)\b/.test(text)&&!new RegExp(`^(?:${COMMAND_STARTS.join('|')})\\b`).test(text))text='create '+text;
 if(/^(?:a|an)\s+(?:circle|rectangle|square|triangle|sphere|cube|point|line|ray|vector)\b/.test(text))text='create '+text;
 const typos:Record<string,string>={creat:'create',cretae:'create',deleet:'delete',delte:'delete',moev:'move',roatte:'rotate',rotat:'rotate',duplciate:'duplicate',selct:'select'};
 text=text.replace(/^(creat|cretae|deleet|delte|moev|roatte|rotat|duplciate|selct)\b/,word=>typos[word]);
 text=text.replace(/^make (.+?) (invisible|visible)(?=[?.!]*$)/,(_,target:string,state:string)=>`${state==='visible'?'show':'hide'} ${target}`);
 text=text.replace(/^(draw|create|make|plot|sketch|generate) me\s+/,'$1 ');
 if(/^compute\s+[a-z][\w-]*\.[\w]+\s*\[/.test(text))return text;
 text=text.replace(/^find the answer(?: to| for)?\s+/,'evaluate ');
 if(/^(?:compute|determine|work out)\s+/.test(text)&&! /\b(?:area|volume|length|perimeter|radius|diameter|slope|distance|midpoint|center|circumference)\b/.test(text))return text.replace(/^(?:compute|determine|work out)\s+/,'evaluate ');
 // Do not reinterpret mathematical expansion, simulation arguments or explanations.
 if(/^(?:make another parallel\b|show (?:me )?(?:steps|why|how|the answer)|expand\s+(?!.*\b(?:it|shape|circle|rectangle|triangle|sphere|cube)\b)|work out\s+(?!.*\b(?:area|volume|length|perimeter|radius|diameter|slope|distance|midpoint)\b))/.test(text))return text;
 for(const [canonical,aliases] of Object.entries(COMMAND_ALIASES)){
  const match=text.match(new RegExp(`^(?:${[...aliases].sort((a,b)=>b.length-a.length).map(escape).join('|')})(?=\\s|[?.!]|$)`));
  if(match){text=canonical+text.slice(match[0].length);break;}
 }
 if(/^clear (?:the )?selection\b/.test(text))text=text.replace(/^clear (?:the )?selection/,'deselect');
 if(/^make (?:it |that |the \w+ )?(?:bigger|smaller)\b/.test(text))text=text.replace(/^make (.*?)\b(bigger|smaller)\b/,'scale $1$2');
 if(/^plot\b/.test(text)&&/\b(?:circle|rectangle|square|triangle|sphere|cube|point|line|ray|vector)\b/.test(text))text=text.replace(/^plot/,'create');
 if(/\b(?:circle|sphere|rectangle|square|cube|cuboid|ellipse)\b/.test(text))text=text.replace(/\br\s*(?:=\s*)?(?=-?\d)/g,'radius ').replace(/\bw\s*(?:=\s*)?(?=-?\d)/g,'width ').replace(/\bh\s*(?:=\s*)?(?=-?\d)/g,'height ');
 return text;
}
