import {units,defaultUnit,lessonKey} from './content.ts';
import type {Progress,Unit,Lesson} from './types.ts';
export const storageKey='power-up-first-edition-progress-v1';
export function emptyProgress():Progress{return {schema:1,selectedUnit:defaultUnit.id,selectedLesson:defaultUnit.lessons[0].id,records:{},knownWords:[],missions:{},days:[]};}
export function parseProgress(raw:string|null):Progress{
 if(!raw)return emptyProgress();
 try{
  const p=JSON.parse(raw);
  if(p.schema!==1||!p.records||typeof p.records!=='object'||Array.isArray(p.records)||!Array.isArray(p.knownWords)||!Array.isArray(p.days)||!p.missions||typeof p.missions!=='object'||Array.isArray(p.missions))return emptyProgress();
  const unit=units.find(u=>u.id===p.selectedUnit)??defaultUnit;
  const lesson=unit.lessons.find(l=>l.id===p.selectedLesson)??unit.lessons[0];
  const validKeys=new Map(units.flatMap(u=>u.lessons.map(l=>[lessonKey(u,l),l] as const)));
  const records:Progress['records']={};
  for(const [key,value]of Object.entries(p.records)){
   const l=validKeys.get(key),r=value as Progress['records'][string];
   if(!l||!r||typeof r!=='object')continue;
   if(r.completed!==undefined&&typeof r.completed!=='boolean')continue;
   if(r.result&&(!Number.isInteger(r.result.selected)||r.result.selected<0||r.result.selected>=l.quiz.options.length||!Number.isInteger(r.result.attempts)||r.result.attempts<1||typeof r.result.correct!=='boolean'||(r.result.revealed!==undefined&&typeof r.result.revealed!=='boolean')))continue;
   if(r.result&&r.result.correct!==(r.result.selected===l.quiz.answer))continue;
   records[key]={completed:!!r.completed&&!!r.result?.correct&&!r.result.revealed,...(r.result?{result:r.result}:{}),...(Number.isFinite(r.reviewedAt)?{reviewedAt:r.reviewedAt}:{})};
  }
  const validWords=new Set(units.flatMap(u=>u.vocabulary.map(w=>`${u.id}/${w.en}`)));
  return {schema:1,selectedUnit:unit.id,selectedLesson:lesson.id,records,knownWords:[...new Set<string>((p.knownWords as unknown[]).filter((w):w is string=>typeof w==='string'&&validWords.has(w)))],missions:Object.fromEntries(Object.entries(p.missions).filter(([key,v])=>units.some(u=>u.id===key)&&typeof v==='string'&&v.length<=3000) as [string,string][]),days:[...new Set<string>((p.days as unknown[]).filter((d):d is string=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)))]};
 }catch{return emptyProgress();}
}
export function loadProgress(){try{return parseProgress(typeof window==='undefined'?null:window.localStorage.getItem(storageKey));}catch{return emptyProgress();}}
export function saveProgress(p:Progress){try{localStorage.setItem(storageKey,JSON.stringify(p));return true;}catch{return false;}}
export function dayKey(date=new Date()){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
export function completedInUnit(p:Progress,u:Unit){return u.lessons.filter(l=>p.records[lessonKey(u,l)]?.completed).length;}
export function mastered(p:Progress,u:Unit,l:Lesson){const r=p.records[lessonKey(u,l)]?.result;return !!r?.correct&&!r.revealed;}
export function reviewItems(p:Progress){return units.flatMap(unit=>unit.lessons.filter(lesson=>{const r=p.records[lessonKey(unit,lesson)]?.result;return r&&(!r.correct||r.revealed);}).map(lesson=>({unit,lesson})));}
