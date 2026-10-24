import test from 'node:test';
import assert from 'node:assert/strict';
import {units,lessonKey,narrationSegments,allAudioTexts,sentences,exampleUtterances,defaultUnit}from '../src/content.ts';
import {emptyProgress,parseProgress,reviewItems,completedInUnit,mastered,dayKey}from '../src/progress.ts';
import {segmentAtTime}from '../src/audio.ts';
import type {Segment}from '../src/types.ts';
import {mapRoute,pointAlongRoute}from '../src/animation.ts';
test('the moving map marker stays on its illustrated route, including corners',()=>{
 assert.deepEqual(pointAlongRoute(0),[113,190]);assert.deepEqual(pointAlongRoute(1),[368,54]);
 const total=391;assert.deepEqual(pointAlongRoute(75/total),[113,115]);assert.deepEqual(pointAlongRoute(230/total),[268,115]);assert.deepEqual(pointAlongRoute(291/total),[268,54]);
 for(let i=0;i<=100;i++){const [x,y]=pointAlongRoute(i/100);assert.ok(mapRoute.slice(1).some((p,j)=>{const a=mapRoute[j];return Math.abs((p[0]-a[0])*(y-a[1])-(p[1]-a[1])*(x-a[0]))<.001&&x>=Math.min(a[0],p[0])&&x<=Math.max(a[0],p[0])&&y>=Math.min(a[1],p[1])&&y<=Math.max(a[1],p[1]);}));}
});
test('three first-edition books contain their introduction and nine correctly ordered units',()=>{
 assert.equal(units.length,30);assert.equal(new Set(units.map(u=>u.id)).size,30);
 for(const level of [1,2,3]){
  const book=units.filter(u=>u.level===level);assert.deepEqual(book.map(u=>u.number),[0,1,2,3,4,5,6,7,8,9]);
  assert.deepEqual(book.map(u=>u.page),[4,6,18,30,44,56,68,82,94,106]);
  assert.equal(book.reduce((n,u)=>n+u.lessons.length,0),66);
  for(const u of book){assert.equal(u.lessons.length,u.number===0?3:7);assert.match(u.sourceUrl,/Scope_and_Sequence\.pdf$/);assert.match(u.isbn,/^9781108413\d{3}$/);assert.ok(u.vocabulary.length>=6);}
 }
});
test('all lessons have unique valid quizzes, distinct content, and explicit voice languages',()=>{
 const ids=new Set<string>();const explanations=new Set<string>();
 for(const u of units){assert.equal(new Set(u.vocabulary.map(w=>w.en)).size,u.vocabulary.length);
  for(const l of u.lessons){const key=lessonKey(u,l);assert.ok(!ids.has(key));ids.add(key);assert.ok(l.titleZh&&l.goalZh&&l.exampleZh&&l.exampleEn);assert.ok(l.explainZh.length>=45);assert.ok(!/[a-zA-Z]/.test(l.explainZh),`${key} Chinese narration must not mix English`);assert.ok(!/[\u4e00-\u9fff]/.test(l.exampleEn));assert.ok(l.focus.length);assert.ok(l.quiz.options.length>=3&&l.quiz.options.length<=4);assert.equal(new Set(l.quiz.options).size,l.quiz.options.length);assert.ok(Number.isInteger(l.quiz.answer)&&l.quiz.answer>=0&&l.quiz.answer<l.quiz.options.length);assert.ok(l.quiz.explanationZh);explanations.add(l.explainZh);
   const bilingual=narrationSegments(u,l);assert.equal(bilingual[0].lang,'zh-CN');assert.ok(bilingual.slice(1).every(s=>s.lang==='en-GB'));assert.ok(narrationSegments(u,l,true).every(s=>s.lang==='en-GB'));assert.ok(bilingual.every(s=>s.text.trim()));
   if(l.kind==='story'){assert.equal(l.story?.length,4);assert.deepEqual(bilingual.slice(1).map(s=>s.translation),l.story?.flatMap(s=>sentences(s.en).map(()=>s.zh)));}
   if(l.kind==='phonics'){assert.ok(l.phonics?.length);for(const p of l.phonics!){assert.ok(p.word&&p.sound&&p.spelling);assert.ok(!/[\/\[\]]/.test(p.word),'IPA must not be sent to speech synthesis as a word');}}
  }
 }
 assert.equal(ids.size,198);assert.equal(explanations.size,198);
 const voices=allAudioTexts();assert.equal(new Set(voices.map(v=>v.lang+':'+v.text)).size,voices.length);assert.ok(voices.filter(v=>v.lang==='en-GB').length>1000);
});
test('English questions and answers are separately voiced, so animation can follow sentence boundaries',()=>{
 const l=defaultUnit.lessons.find(l=>l.id==='grammar-1')!;
 const en=narrationSegments(defaultUnit,l,true);assert.equal(en[0].text,"Where's the crayon?");assert.equal(en[1].text,"It's under the desk.");assert.equal(en[2].text,'Now it is in the bag.');assert.equal(en[3].text,'Next, it is on the desk.');
 assert.deepEqual(sentences("It's a bag. What are these? They're books."),["It's a bag.",'What are these?',"They're books."]);
});
test('seeking uses real per-segment durations including exact language boundaries',()=>{
 const q:Segment[]=[{id:'zh',lang:'zh-CN',text:'中文',label:'',duration:3},{id:'en1',lang:'en-GB',text:'A sentence.',label:'',duration:2},{id:'en2',lang:'en-GB',text:'Another sentence.',label:'',duration:4}];
 assert.deepEqual(segmentAtTime(q,0),{index:0,time:0});assert.deepEqual(segmentAtTime(q,3),{index:1,time:0});assert.deepEqual(segmentAtTime(q,4),{index:1,time:1});assert.deepEqual(segmentAtTime(q,7),{index:2,time:2});assert.deepEqual(segmentAtTime(q,100),{index:2,time:4});assert.deepEqual(segmentAtTime(q,-1),{index:0,time:0});assert.deepEqual(segmentAtTime([],1),{index:0,time:0});
});
test('phonics lists and dialogue sentences are separated so each has its own time to respond',()=>{
 const phonics=units.find(u=>u.id==='l2-u6')!.lessons.find(l=>l.kind==='phonics')!;
 assert.deepEqual(exampleUtterances(phonics),['tree','green','happy','sunny']);
 const unit=units.find(u=>u.id==='l3-u1')!,story=unit.lessons.find(l=>l.kind==='story')!;
 const parts=narrationSegments(unit,story,true);assert.ok(parts.length>story.story!.length);
 for(const part of parts)assert.equal(sentences(part.text).length,1);
});
test('the reported book-pencil-crayon-bag sentence is spoken as four independent phrases',()=>{
 const lesson=defaultUnit.lessons.find(l=>l.id==='vocabulary')!;
 const parts=narrationSegments(defaultUnit,lesson,true,'guided').slice(0,4);
 assert.deepEqual(parts.map(p=>p.text),['A book','a pencil','a crayon','and a bag.']);
 assert.deepEqual(parts.map(p=>p.translation),['一本书','一支铅笔','一支蜡笔','和一个书包']);
 assert.deepEqual(parts.map(p=>p.focusWord),['book','pencil','crayon','bag']);
 for(const part of parts){assert.equal(part.sentenceText,'A book, a pencil, a crayon and a bag.');assert.equal(part.sentenceText!.slice(part.phraseStart,part.phraseEnd),part.text);}
 assert.ok(!narrationSegments(defaultUnit,lesson,true,'guided').some(p=>p.text==='A book, a pencil, a crayon and a bag.'));
});
test('natural reading keeps the complete sentence and its translation instead of splicing separately voiced phrases',()=>{
 const lesson=defaultUnit.lessons.find(l=>l.id==='vocabulary')!,natural=narrationSegments(defaultUnit,lesson,true,'natural'),guided=narrationSegments(defaultUnit,lesson,true,'guided');
 assert.deepEqual(natural.map(p=>p.text),['A book, a pencil, a crayon and a bag.','The teacher is by the window.']);
 assert.equal(natural[0].translation,'一本书，一支铅笔，一支蜡笔和一个书包。');assert.equal(natural[0].phraseStart,undefined);assert.equal(natural[0].sentenceText,undefined);
 assert.equal(guided[0].text,'A book');assert.ok(guided.length>natural.length);
 const required=new Set(allAudioTexts().map(p=>p.lang+':'+p.text));for(const p of [...natural,...guided])assert.ok(required.has(p.lang+':'+p.text),'Both modes need actual prerecorded audio');
});
test('all authored reading phrases preserve the original words and point to existing vocabulary pictures',()=>{
 const normalize=(s:string)=>s.replace(/[,.!?]/g,'').replace(/\s+/g,' ').trim();
 for(const unit of units)for(const lesson of unit.lessons)for(const group of lesson.readingGroups??[]){
  assert.ok(sentences(lesson.exampleEn).includes(group.sentence));assert.equal(normalize(group.phrases.map(p=>p.text).join(' ')),normalize(group.sentence));
  for(const phrase of group.phrases){assert.ok(phrase.translation);if(phrase.focusWord)assert.ok(unit.vocabulary.some(w=>w.en===phrase.focusWord));}
 }
});
test('revealing an answer never counts as mastery and remains due for review',()=>{
 const p=emptyProgress(),u=defaultUnit,l=u.lessons[0],key=lessonKey(u,l);
 p.records[key]={completed:false,result:{correct:true,selected:l.quiz.answer,attempts:1,revealed:true}};
 assert.equal(mastered(p,u,l),false);assert.equal(completedInUnit(p,u),0);assert.equal(reviewItems(p).length,1);
 p.records[key]={completed:true,result:{correct:true,selected:l.quiz.answer,attempts:2,revealed:false}};
 assert.equal(mastered(p,u,l),true);assert.equal(completedInUnit(p,u),1);assert.equal(reviewItems(p).length,0);
});
test('corrupt records and forged correct answers do not turn into progress',()=>{
 const p=emptyProgress(),l=defaultUnit.lessons[0],key=lessonKey(defaultUnit,l);
 p.records[key]={result:{correct:true,selected:(l.quiz.answer+1)%4,attempts:1}};
 assert.equal(parseProgress(JSON.stringify(p)).records[key],undefined);
 for(const value of [null,'{','{}','[]','{"schema":1,"records":[]}'])assert.deepEqual(parseProgress(value),emptyProgress());
 const actual=emptyProgress();actual.records[key]={completed:true,result:{correct:true,selected:l.quiz.answer,attempts:1}};actual.knownWords=[`${defaultUnit.id}/${defaultUnit.vocabulary[0].en}`];actual.missions[defaultUnit.id]='This is my book.';
 assert.deepEqual(parseProgress(JSON.stringify(actual)),actual);assert.equal(dayKey(new Date(2026,9,24)),'2026-10-24');
});
