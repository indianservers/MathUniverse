export function lessonTitleSlug(title:string){return title.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}
export function publicLessonLevel(level:string){return level.replace(/JNTU(?:K|\s*Kakinada)?\s*/gi,'').replace(/\bPG\b/g,'Advanced').replace(/\bUG bridge\b/gi,'Undergraduate mathematics');}
export function learnerText(text:string){return text.replace(/\b(?:upcoming|planned)\b/gi,'').replace(/\b(?:content )?drafts?\b/gi,'lesson').replace(/\bJNTU(?:K|\s*Kakinada)?\b/gi,'university').replace(/\bbatch\s*\d*\b/gi,'').replace(/\s{2,}/g,' ').trim();}
