import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {reference20261023Lessons as courses} from '../src/courses/reference-20261023-lessons.ts';
import {referenceDocument,referenceText,referenceImages} from '../src/courses/reference-20261023.ts';
import {sourceFigures,sourceShapes,sourceFigureGroup,drawnEdge} from '../src/reference-figure-math.ts';
import {emptyProgress,parseProgress,progressKey} from '../src/progress.ts';

test('all 32 source questions and the three geometry subquestions keep exact text and original images',()=>{
  assert.equal(courses.length,34);
  assert.deepEqual(['transfer','geometry','age'].map(topic=>courses.filter(c=>c.topic===topic).length),[11,12,11]);
  assert.deepEqual([...new Set(courses.map(c=>Number(c.source!.question.match(/第(\d+)题/)![1])))].sort((a,b)=>a-b),Array.from({length:32},(_,i)=>i+1));
  const paragraphs=[5,7,9,11,13,15,19,21,23,25,27,32,34,36,39,44,47,50,55,58,61,66,69,73,75,77,81,83,85,87,89,91,93,95];
  assert.deepEqual(courses.map(c=>c.source!.paragraph).sort((a,b)=>a-b),paragraphs);
  for(const c of courses){
    assert.equal(c.source!.document,referenceDocument);assert.ok(c.problem.includes(referenceText[c.source!.paragraph]),c.id);
    assert.equal(c.steps.length,5);assert.equal(c.scene.kind,'storyboard');
    if(c.scene.kind==='storyboard')assert.equal(c.scene.frames.length,5);
    assert.ok(c.steps[2].question);assert.equal(c.exercises.length,1);
    assert.ok(c.steps.every(s=>s.narration.length>=25&&s.narration.length<400));
  }
  assert.equal(referenceImages.length,12);
  for(const im of referenceImages){
    const data=readFileSync(`public${im.src}`);assert.equal(createHash('sha256').update(data).digest('hex'),im.sha256);
    assert.equal(courses.filter(c=>c.images?.some(i=>i.src===im.src)).length,1);
  }
});

test('transfer solutions satisfy the original signed differences, compensation and conservation',()=>{
  const first=courses.filter(c=>c.topic==='transfer');
  const solutions=[14,(24-4)/2,2*(12-2),(21+3)/2,20-2*8,4/(12-(12+8)/2),4+2*8,2*10-2,(10-2*2)/2,15-2*3,(12+2*4)/2];
  for(const [i,c] of first.entries()){
    const formula=c.steps[3].formula!;
    const result=Number(formula.split('＝').at(-1)!.match(/^\s*(-?\d+)/)![1]);
    assert.equal(result,solutions[i],`${c.id}: ${formula}`);
  }
  assert.equal(14-3,8+3);assert.equal(24-2*10,4);assert.equal(21-2*12,-3);
  assert.equal(12*2-(12+8)*2/2,4);assert.equal((12+8)*2/2-8*2,4);
  assert.equal(18-2*10,-2);assert.equal(9+2*3,15);
  // Question 11 sends sweets out of the system, rather than transferring between the two children.
  const donation=first[10];assert.equal(donation.scene.kind,'storyboard');
  if(donation.scene.kind==='storyboard'){
    const before=donation.scene.frames[1],after=donation.scene.frames[3];
    assert.equal(before.kind,'transfer-story');assert.equal(after.kind,'transfer-story');
    if(before.kind==='transfer-story'&&after.kind==='transfer-story'){
      assert.deepEqual(before.values,[24,16]);assert.deepEqual(after.values,[14,14]);
      assert.equal(before.values.reduce((a,b)=>a+b,0)-after.values.reduce((a,b)=>a+b,0),12);
    }
  }
});

test('age solutions independently satisfy both time conditions and the differing rates of age sums',()=>{
  const unique=(predicate:(older:number,younger:number)=>boolean)=>{
    const pairs:number[][]=[];for(let older=1;older<=80;older++)for(let younger=1;younger<older;younger++)if(predicate(older,younger))pairs.push([older,younger]);return pairs;
  };
  assert.deepEqual(unique((o,y)=>o-y===15-6&&o===21),[[21,12]]);
  assert.deepEqual(unique((o,y)=>o-y===32-4&&o+y===50),[[39,11]]);
  assert.deepEqual([7,10,11].map(a=>a+(37-28)/3),[10,13,14]);
  assert.deepEqual(unique((father,sons)=>father+sons===84&&father+12===sons+24),[[48,36]]);
  assert.deepEqual(unique((o,y)=>y===12&&o+(o-y)===24),[[18,12]]);
  assert.deepEqual(unique((o,y)=>o-y===24&&o===4*y),[[32,8]]);
  assert.deepEqual(unique((o,y)=>(o-2)+(y-2)===46&&o===4*y),[[40,10]]);
  assert.deepEqual(unique((o,y)=>y>4&&o-4===7*(y-4)&&o+4+y+4===48),[[32,8]]);
  assert.deepEqual(unique((o,y)=>y===20&&o+(o-y)===32),[[26,20]]);
  assert.deepEqual(unique((o,y)=>y-(o-y)>0&&y===3*(y-(o-y))&&o+(o-y)===2*o-15),[[25,15]]);
  assert.deepEqual(unique((o,y)=>y-(o-y)>0&&o+y===32&&o+(o-y)===7*(y-(o-y))),[[20,12]]);
  const expected=[[21,12],[39,11],[10,13,14],[48,36],[18,12],[32,8],[40,10],[32,8],[26,20],[25,15],[28,20]];
  courses.filter(c=>c.topic==='age').forEach((c,i)=>{
    assert.equal(c.scene.kind,'storyboard');if(c.scene.kind!=='storyboard')return;
    const frame=c.scene.frames[i===9?4:3];assert.equal(frame.kind,'age-story');
    if(frame.kind==='age-story')assert.deepEqual(frame.ages,expected[i],c.id);
  });
});

test('source geometry totals match independent combinatorics and never bridge missing edges',()=>{
  const totals:Record<string,number>={segments:6+1,strip:5+4+3+2+1,fan:4+3+2+1,missingRect:10*6+5,
    missingSquare:8+6+1,layeredTriangle:10*3,animals:(18-4)*2,nestedRect:18+18+4,
    splitTriangle:6+6+1+2,star:1+4+5+1,brokenSquare:12+7+2+1,partialRect:10*6+5*3};
  for(const [id,expected] of Object.entries(totals)){
    const shapes=sourceShapes(id),definition=sourceFigures[id];assert.equal(shapes.length,expected,id);
    assert.equal(new Set(shapes.map(s=>s.map(p=>p.map(n=>n.toFixed(6)).join(',')).sort().join('|'))).size,expected);
    for(const shape of shapes){
      const pairs=shape.length===2?[[0,1]]:shape.map((_,i)=>[i,(i+1)%shape.length]);
      for(const [a,b] of pairs)assert.ok(drawnEdge(shape[a],shape[b],definition.segments),`${id}: missing edge`);
    }
  }
  assert.deepEqual([1,2,3,4].map(size=>sourceShapes('missingSquare').filter(s=>Math.max(...s.map(p=>p[0]))-Math.min(...s.map(p=>p[0]))===size).length),[8,6,0,1]);
  assert.deepEqual([1,2,3,4].map(size=>sourceShapes('star').filter(s=>Math.max(...s.map(p=>p[0]))-Math.min(...s.map(p=>p[0]))===size).length),[1,4,5,1]);
  assert.deepEqual([1,2,3,4].map(size=>sourceShapes('brokenSquare').filter(s=>Math.max(...s.map(p=>p[0]))-Math.min(...s.map(p=>p[0]))===size).length),[12,7,2,1]);
  assert.deepEqual(['outer','inner','bridge'].map(g=>sourceFigureGroup('nestedRect',g).length),[18,18,4]);
  assert.deepEqual(['left','right'].map(g=>sourceFigureGroup('animals',g).length),[14,14]);
  for(const id of ['missingRect','partialRect'])assert.ok(!drawnEdge(id==='missingRect'?[3,0]:[4.5,0],id==='missingRect'?[3,3]:[4.5,3],sourceFigures[id].segments));
});

test('new independent practice answers are calculated separately from lesson generation',()=>{
  const answers=[18,12,12,11,8,3,17,10,4,11,8,6,10,6,5,6,20,'不算',18,15,4,2,15,13,12,7,40,16,10,11,8,22,20,32];
  // Registry groups age before geometry so old Qwen seeds remain stable when appending these new lessons.
  const ordered=[...courses.filter(c=>c.topic==='transfer'),...courses.filter(c=>c.topic==='geometry'),...courses.filter(c=>c.topic==='age')];
  assert.equal(ordered.length,answers.length);
  ordered.forEach((c,i)=>assert.equal(c.exercises[0].answer,String(answers[i]),c.id));
});

test('adding new source lessons preserves both old and new browser learning records',()=>{
  const p=emptyProgress();p.lessonId='agecrossratioref-1';
  p.lessons['trees-1:v1']={completed:true,step:4,results:{}};
  p.lessons[progressKey(p.lessonId,1)]={step:3,results:{}};
  assert.deepEqual(parseProgress(JSON.stringify(p)),p);
});
