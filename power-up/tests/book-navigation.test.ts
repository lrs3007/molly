import test from 'node:test';
import assert from 'node:assert/strict';
import {selectBook,activeBook,progressForBookLink} from '../src/book-navigation.ts';
import {emptyProgress} from '../src/progress.ts';
import {units,lessonKey,narrationSegments} from '../src/content.ts';
import {enrichedSegments} from '../src/audio.ts';

test('selecting each book changes the actual classroom and keeps all learning records',()=>{
 const progress=emptyProgress(),original=units.find(u=>u.id===progress.selectedUnit)!,key=lessonKey(original,original.lessons[0]);
 progress.records[key]={completed:true};progress.knownWords=[`${original.id}/book`];progress.missions[original.id]='My school.';
 for(const level of [2,3,1] as const){
  const next=selectBook(progress,level),unit=units.find(u=>u.id===next.selectedUnit)!;
  assert.equal(activeBook(next),level);assert.equal(unit.level,level);assert.equal(unit.number,1);assert.equal(next.selectedLesson,unit.lessons[0].id);
  assert.deepEqual(next.records,progress.records);assert.deepEqual(next.knownWords,progress.knownWords);assert.deepEqual(next.missions,progress.missions);
  for(const segment of enrichedSegments(narrationSegments(unit,unit.lessons[0])))assert.ok(segment.src&&segment.duration,'Selected book must have playable bilingual audio');
 }
});

test('reselecting the active book keeps its selected unit and lesson',()=>{
 const progress={...emptyProgress(),selectedUnit:'l3-u8',selectedLesson:'grammar-2'};
 assert.deepEqual(selectBook(progress,3),progress);
});

test('book links open the requested book independently of a previous saved book',()=>{
 const progress=emptyProgress();
 for(const n of [1,2,3] as const)assert.equal(activeBook(progressForBookLink(progress,`?book=${n}`)),n);
 for(const search of ['','?book=0','?book=4','?book=hello'])assert.deepEqual(progressForBookLink(progress,search),progress);
 const remembered={...progress,selectedUnit:'l2-u7',selectedLesson:'grammar-1'};
 assert.deepEqual(progressForBookLink(remembered,'?book=2'),remembered);
});
