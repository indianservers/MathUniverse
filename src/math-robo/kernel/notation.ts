/** Restricted mathematical notation translation; never executable code. */
export function normalizeNotation(source:string):string {
 if(source.length>2048)throw new Error('Expression exceeds the 2048-character limit.');
 let text=source.replace(/\\(?:left|right)/g,'').replace(/\\(?:cdot|times)/g,'*').replace(/\\pi\b/g,'pi').replace(/π/g,'pi').replace(/−/g,'-').replace(/×/g,'*').replace(/÷/g,'/').replace(/≤/g,'<=').replace(/≥/g,'>=').replace(/≠/g,'!=');
 for(let i=0;i<8;i++){const before=text;text=text.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g,'(($1)/($2))').replace(/\\sqrt\{([^{}]+)\}/g,'sqrt($1)');if(text===before)break;}
 text=text.replace(/\\(sin|cos|tan|log|ln|exp)\b/g,'$1').replace(/(sin|cos|tan)(?:²|\^\{?2\}?)(\([^()]*\))/g,'($1$2)^2').replace(/√\s*\(/g,'sqrt(').replace(/√\s*(\d+|[a-z])/gi,'sqrt($1)').replace(/²/g,'^2').replace(/³/g,'^3').replace(/\^\{(-?\d+)\}/g,'^($1)');
 if(/[\\{}]/.test(text))throw new Error('Unsupported or malformed LaTeX notation.');
 return text;
}
