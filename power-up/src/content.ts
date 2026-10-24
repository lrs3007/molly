import level1 from './curriculum/level1.json' with { type:'json' };
import level2 from './curriculum/level2.json' with { type:'json' };
import level3 from './curriculum/level3.json' with { type:'json' };
import type { Unit, Lesson, LessonKind, Segment, Level, ReadingMode } from './types.ts';
export const units = [...level1, ...level2, ...level3] as Unit[];
export const defaultUnit = units.find(u=>u.id==='l1-u1')!;
export const kindLabels: Record<LessonKind,string> = {vocabulary:'单词探险',grammar:'句型魔法',phonics:'声音实验室',discover:'发现世界',story:'故事时光',mission:'单元任务'};
export const kindIcons: Record<LessonKind,string> = {vocabulary:'book',grammar:'spark',phonics:'ear',discover:'globe',story:'heart',mission:'star'};
export const levelInfo: Record<Level,{label:string;subtitle:string;color:string;isbn:string}> = {
  1:{label:'初次探索',subtitle:'从看见，到会说',color:'#e8f0dc',isbn:'9781108413749'},
  2:{label:'大胆表达',subtitle:'把英语带进生活',color:'#f7e9cb',isbn:'9781108413763'},
  3:{label:'发现更多',subtitle:'用英语探索世界',color:'#e6eaf5',isbn:'9781108413794'},
};
export function lessonKey(unit:Unit,lesson:Lesson){return `${unit.id}/${lesson.id}:v1`;}
export function wordKey(unit:Unit,en:string){return `${unit.id}/${en}`;}
export function sentences(text:string,lang='en'){return [...new Intl.Segmenter(lang,{granularity:'sentence'}).segment(text)].map(s=>s.segment.trim()).filter(Boolean);}
export function exampleParts(lesson:Lesson,readingMode:ReadingMode='guided'):Omit<Segment,'id'|'lang'|'label'>[]{
  return sentences(lesson.exampleEn).flatMap(sentence=>{
    const group=readingMode==='guided'?lesson.readingGroups?.find(g=>g.sentence===sentence):undefined;
    if(group){
      let cursor=0;
      return group.phrases.map(phrase=>{
        const start=sentence.indexOf(phrase.text,cursor);
        if(start<0)throw new Error(`Invalid reading phrase in ${lesson.titleEn}: ${phrase.text}`);
        cursor=start+phrase.text.length;
        return {...phrase,sentenceText:sentence,phraseStart:start,phraseEnd:cursor};
      });
    }
    return (lesson.kind==='phonics'?sentence.split(/,\s*/).map(word=>word.trim()).filter(Boolean):[sentence]).map(text=>({text}));
  });
}
export function exampleUtterances(lesson:Lesson){return exampleParts(lesson).map(part=>part.text);}
export function narrationSegments(unit:Unit,lesson:Lesson,englishOnly=false,readingMode:ReadingMode='natural'):Segment[]{
  const id=lessonKey(unit,lesson);
  const segments:Segment[]=[];
  if(!englishOnly)segments.push({id:`${id}/explain`,lang:'zh-CN',text:lesson.explainZh,label:'老师讲解'});
  if(lesson.kind==='story'&&lesson.story?.length){
    lesson.story.forEach((line,i)=>sentences(line.en).forEach((text,j)=>segments.push({id:`${id}/story-${i}-${j}`,lang:'en-GB',text,translation:line.zh,label:`故事 · 第 ${i+1} 幕`})));
  } else {
    const en=exampleParts(lesson,readingMode),zh=sentences(lesson.exampleZh,'zh');
    en.forEach((part,i)=>segments.push({id:`${id}/example-${i}`,lang:'en-GB',...part,translation:part.translation??(en.length===zh.length?zh[i]:lesson.exampleZh),label:part.sentenceText?`词组慢读 · ${i+1}/${en.length}`:lesson.kind==='phonics'?'听单词，找相同的声音':`英文示范 · ${i+1}/${en.length}`}));
  }
  return segments;
}
export function allAudioTexts():{lang:'zh-CN'|'en-GB';text:string;label:string}[]{
  const list=[...['on','under','in','next to'].map(pos=>({lang:'en-GB' as const,text:`The crayon is ${pos} ${pos==='in'?'the bag':pos==='next to'?'the book':'the desk'}.`,label:'互动位置示范'})),...units.flatMap(unit=>[
    ...unit.vocabulary.map(word=>({lang:'en-GB' as const,text:word.en,label:`${unit.id} 单词`})),
    ...unit.lessons.flatMap(lesson=>[
      ...narrationSegments(unit,lesson,false,'natural'),
      ...narrationSegments(unit,lesson,false,'guided'),
      {lang:'en-GB' as const,text:lesson.exampleEn,label:`${unit.id} ${lesson.titleZh}`},
      ...(lesson.quiz.spokenEn?[{lang:'en-GB' as const,text:lesson.quiz.spokenEn,label:`${unit.id} 听力`}]:[]),
      ...(lesson.phonics??[]).map(p=>({lang:'en-GB' as const,text:p.word,label:`${unit.id} 拼读示范词`})),
    ])
  ])];
  const seen=new Set<string>();
  return list.filter(s=>{const k=`${s.lang}:${s.text}`;if(seen.has(k))return false;seen.add(k);return true;});
}
